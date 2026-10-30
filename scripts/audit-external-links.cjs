'use strict';
const fs = require('node:fs');
const path = require('node:path');

const INVENTORY = path.join(__dirname, '..', 'data', 'external-link-inventory-2026-10-30.json');

function classifyStatus(status) {
  if (status >= 200 && status < 300) return 'reachable';
  if (status === 404 || status === 410) return 'broken';
  if (status === 405 || status === 501) return 'method_not_allowed';
  if (status === 401 || status === 403 || status === 429) return 'blocked_or_rate_limited';
  if (status >= 500) return 'server_error';
  if (status >= 300 && status < 400) return 'redirect_or_unfollowed';
  return 'http_error';
}

async function checkOne(record, fetchImpl = globalThis.fetch, timeoutMs = 10000) {
  const base = { url: record.url, source_files: record.source_files || [], checked_at: new Date().toISOString() };
  if (record.classification !== 'external-destination') {
    return { ...base, outcome: 'skipped', reason: 'Not a static external destination in this inventory.' };
  }
  let parsed;
  try { parsed = new URL(record.url); } catch {
    return { ...base, outcome: 'invalid_url', reason: 'URL literal could not be parsed.' };
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { ...base, outcome: 'skipped', reason: 'Only HTTP(S) destinations are checked.' };
  }
  if (record.url.includes('[REDACTED]') || /\$\{|\.\.\./.test(record.url)) {
    return { ...base, outcome: 'skipped', reason: 'Contains a redaction or dynamic placeholder.' };
  }
  const headers = {
    'user-agent': 'HomeVisitingICUDoctor-LinkAudit/1.0 (+public-link-check; no scraping)',
    accept: '*/*'
  };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let method = 'HEAD';
  try {
    let response = await fetchImpl(record.url, { method, redirect: 'follow', headers, signal: controller.signal });
    if (response.status === 405 || response.status === 501) {
      method = 'GET';
      response = await fetchImpl(record.url, {
        method, redirect: 'follow', headers: { ...headers, range: 'bytes=0-0' }, signal: controller.signal
      });
    }
    return {
      ...base,
      method,
      final_url: response.url || record.url,
      http_status: response.status,
      outcome: classifyStatus(response.status),
      reason: response.status === 403 || response.status === 429
        ? 'Host blocked or rate-limited this automated check; do not classify as a broken link.'
        : response.status === 405 || response.status === 501
          ? 'Host does not support the automated request method; verify manually in a browser.'
          : undefined
    };
  } catch (error) {
    return {
      ...base, method, outcome: error?.name === 'AbortError' ? 'timeout' : 'network_error',
      error: String(error?.message || error).slice(0, 300)
    };
  } finally {
    clearTimeout(timer);
  }
}

async function runPool(items, worker, concurrency = 4) {
  const results = new Array(items.length);
  let next = 0;
  const count = Math.max(1, Math.min(Number(concurrency) || 4, items.length || 1));
  await Promise.all(Array.from({ length: count }, async () => {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }));
  return results;
}

async function runAudit({ inventoryPath = INVENTORY, fetchImpl = globalThis.fetch, limit = Infinity, concurrency = 4, timeoutMs = 10000 } = {}) {
  const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
  const candidates = inventory.links.filter(item => item.classification === 'external-destination').slice(0, limit);
  const results = await runPool(candidates, record => checkOne(record, fetchImpl, timeoutMs), concurrency);
  const counts = {};
  for (const result of results) counts[result.outcome] = (counts[result.outcome] || 0) + 1;
  return {
    schema_version: '1.0',
    generated_at: new Date().toISOString(),
    source_inventory: path.basename(inventoryPath),
    source_revision: inventory.source_revision,
    candidates_checked: results.length,
    counts,
    results,
    note: 'A failed automated request can be caused by blocking, rate limits, transient outages or DNS. Review the result before removing any destination.'
  };
}

async function main() {
  const args = process.argv.slice(2);
  const limitArg = args.find(arg => arg.startsWith('--limit='));
  const concurrencyArg = args.find(arg => arg.startsWith('--concurrency='));
  const timeoutArg = args.find(arg => arg.startsWith('--timeout='));
  const outputArg = args.find(arg => arg.startsWith('--output='));
  const limit = limitArg ? Math.max(0, Number(limitArg.split('=')[1]) || 0) : Infinity;
  const concurrency = concurrencyArg ? Math.max(1, Number(concurrencyArg.split('=')[1]) || 4) : 4;
  const timeoutMs = timeoutArg ? Math.max(1000, Number(timeoutArg.split('=')[1]) || 10000) : 10000;
  const report = await runAudit({ limit, concurrency, timeoutMs });
  const json = JSON.stringify(report, null, 2) + '\n';
  if (outputArg) {
    const target = path.resolve(outputArg.split('=').slice(1).join('='));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, json);
  }
  console.log(JSON.stringify({ candidates_checked: report.candidates_checked, counts: report.counts, output: outputArg ? path.resolve(outputArg.split('=').slice(1).join('=')) : 'stdout' }, null, 2));
}

if (require.main === module) main().catch(error => {
  console.error('External link audit failed:', error.message);
  process.exitCode = 1;
});

module.exports = { classifyStatus, checkOne, runPool, runAudit };
