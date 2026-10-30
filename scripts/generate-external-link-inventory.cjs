'use strict';
const fs = require('node:fs');
const path = require('node:path');

const EXTENSIONS = new Set(['.html', '.js', '.mjs', '.cjs', '.css', '.xml', '.json']);
const EXCLUDED_DIRS = new Set(['.git', 'node_modules', 'tests', 'reports', 'audit-runs', '.github', 'data', 'scripts']);
const EXCLUDED_PREFIXES = ['assets/drugs/', 'assets/pdf/', 'assets/icons/'];
const ROOT_FILES = new Set(['index.html', 'sitemap.xml', 'sitemap-pages.xml', 'robots.txt', 'vercel.json']);
const INTERNAL_HOSTS = new Set(['home-visiting-icu-doctor.vercel.app']);

function shouldScan(relativePath) {
  const rel = relativePath.replace(/\\/g, '/');
  if (EXCLUDED_PREFIXES.some(prefix => rel.startsWith(prefix))) return false;
  const parts = rel.split('/');
  if (parts.some(part => EXCLUDED_DIRS.has(part))) return false;
  if (ROOT_FILES.has(rel)) return true;
  if (parts.length === 1) return EXTENSIONS.has(path.extname(rel)) && !['package.json', 'package-lock.json'].includes(rel);
  if (parts[0] === 'api' || parts[0] === 'server' || parts[0] === 'public') return EXTENSIONS.has(path.extname(rel));
  if (parts[0] === 'assets') {
    return EXTENSIONS.has(path.extname(rel)) && (
      parts.length === 2 ||
      rel.startsWith('assets/forms/') ||
      rel.startsWith('assets/guides/') ||
      rel.startsWith('assets/articles/')
    );
  }
  return false;
}

function walk(root, directory = root, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    const rel = path.relative(root, full).replace(/\\/g, '/');
    const excludedPrefix = EXCLUDED_PREFIXES.some(prefix => rel === prefix.slice(0, -1) || rel.startsWith(prefix));
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name) && !excludedPrefix) walk(root, full, files);
    } else if (entry.isFile() && shouldScan(rel)) files.push({ full, rel });
  }
  return files;
}

function classifyUrl(url, line, relativePath, rawMatch) {
  if (url.includes('${') || rawMatch.includes('${') || /<[^>]+>/.test(url)) return 'runtime-template';
  if (/placeholder/i.test(line) && (/hook\.eu1\.make\.com/i.test(url) || /\.\.\./.test(rawMatch))) return 'placeholder';
  let parsed;
  try { parsed = new URL(url); } catch { return 'invalid-url' }
  if (INTERNAL_HOSTS.has(parsed.hostname)) return 'internal-route-or-asset';
  if ((parsed.hostname === 'fonts.googleapis.com' || parsed.hostname === 'fonts.gstatic.com') &&
      (/preconnect/i.test(line) || /content-security-policy|connect-src|font-src/i.test(line))) return 'domain-allowlist';
  if ((relativePath.startsWith('api/') || relativePath.startsWith('server/')) &&
      (/fetch\s*\(|axios|api[_-]?url|endpoint|webhook/i.test(line))) return 'service-endpoint';
  return 'external-destination';
}

function redactSensitiveQuery(url) {
  return url.replace(/([?&](?:token|api[_-]?key|secret|signature|auth|password|code)=)[^&]*/ig, '$1[REDACTED]');
}

function generateInventory({ root = path.resolve(__dirname, '..'), sourceRevision = process.env.GITHUB_SHA || null } = {}) {
  const records = new Map();
  const scanned = [];
  const files = walk(root).sort((a, b) => a.rel.localeCompare(b.rel));
  for (const file of files) {
    let content;
    try { content = fs.readFileSync(file.full, 'utf8'); } catch { continue; }
    scanned.push(file.rel);
    const lines = content.split(/\r?\n/);
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      for (const match of line.matchAll(/https?:\/\/[^\s"'<>\x60\\)]+/g)) {
        const rawMatch = match[0];
        let url = rawMatch.replace(/[),.;]+$/, '').replace(/&amp;/g, '&');
        if (url.length > 1000) continue;
        url = redactSensitiveQuery(url);
        const classification = classifyUrl(url, line, file.rel, rawMatch);
        if (!records.has(url)) {
          records.set(url, {
            url,
            source_files: [],
            source_lines: [],
            classification,
            verification_status: classification === 'domain-allowlist' ? 'not-a-navigable-link' :
              classification === 'placeholder' ? 'not-a-configured-destination' : 'not-live-checked',
            notes: classification === 'domain-allowlist' ? 'Origin used for preconnect/CSP, not a user-clickable destination.' :
              classification === 'placeholder' ? 'Example placeholder only; no configured destination should be called.' :
              classification === 'runtime-template' || classification === 'service-endpoint' ? 'Dynamic/runtime endpoint; requires context-specific verification, not a public-link HEAD check.' :
              classification === 'internal-route-or-asset' ? 'Internal site URL/route; verify through live site routing, not as an external destination.' :
              'Extracted from active source; reachability and intended destination not yet independently verified.'
          });
        }
        const record = records.get(url);
        if (!record.source_files.includes(file.rel)) record.source_files.push(file.rel);
        if (!record.source_lines.includes(lineIndex + 1)) record.source_lines.push(lineIndex + 1);
        if (record.classification !== classification && classification !== 'external-destination') {
          // Preserve the safer/non-navigable classification when any occurrence is a known placeholder or allowlist.
          if (['placeholder', 'domain-allowlist', 'runtime-template', 'service-endpoint'].includes(classification)) record.classification = classification;
        }
      }
    }
  }
  const links = [...records.values()].map(record => ({
    ...record,
    source_files: record.source_files.sort(),
    source_lines: record.source_lines.sort((a, b) => a - b)
  })).sort((a, b) => a.url.localeCompare(b.url));
  return {
    schema_version: '1.0',
    generated_at: new Date().toISOString(),
    repository: 'drkulkarnipg-lang/doctor-at-home',
    source_revision: sourceRevision,
    method: 'Generated by scripts/generate-external-link-inventory.cjs from active website HTML, JS, CSS, XML, selected asset manifests and API/server modules. Excludes tests, build artifacts, audit ledgers, package lockfile, icon/font binaries, bundled PDF libraries and the drug catalogue. This is a source inventory; it does not imply live verification.',
    source_files_scanned: scanned,
    unique_extracted_destinations: links.length,
    verification_policy: 'Only records classified external-destination are checked by the link auditor. 403/429/405/406/network/timeout results are not automatically treated as broken. Dynamic/service endpoints, placeholders, internal routes and domain allowlists require their own checks.',
    links
  };
}

function main() {
  const outputArg = process.argv.slice(2).find(arg => arg.startsWith('--output='));
  const inventory = generateInventory();
  if (outputArg) {
    const outputPath = path.resolve(outputArg.split('=').slice(1).join('='));
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(inventory, null, 2) + '\\n');
  }
  console.log(JSON.stringify({
    scanned_files: inventory.source_files_scanned.length,
    unique_destinations: inventory.unique_extracted_destinations,
    classifications: inventory.links.reduce((counts, link) => {
      counts[link.classification] = (counts[link.classification] || 0) + 1;
      return counts;
    }, {}),
    output: outputArg ? path.resolve(outputArg.split('=').slice(1).join('=')) : 'stdout summary'
  }, null, 2));
}

if (require.main === module) main();
module.exports = { generateInventory, shouldScan, classifyUrl };
