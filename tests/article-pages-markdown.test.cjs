'use strict';
const assert=require('node:assert/strict');
const {renderBody,renderArticle}=require('../server/article-pages');
const body='# What this means\n\nThis is **important** and *uncertain*; keep the original caveat.\n\n## Practical points\n\n- Keep the existing care plan.\n- Discuss new concerns with the treating doctor.\n\n> This article does not replace an individual assessment.\n\nUser-supplied markup: <script>alert(1)</script>';
const html=renderBody(body);
assert.match(html,/<h2>What this means<\/h2>/);assert.match(html,/<h3>Practical points<\/h3>/);assert.match(html,/<strong>important<\/strong>/);assert.match(html,/<em>uncertain<\/em>/);assert.match(html,/<ul><li>Keep the existing care plan\.<\/li><li>Discuss new concerns with the treating doctor\.<\/li><\/ul>/);assert.match(html,/<blockquote>/);assert.match(html,/&lt;script&gt;alert\(1\)&lt;\/script&gt;/);assert.doesNotMatch(html,/<script>/i);
const page=renderArticle({slug:'sample-guide',title:'Sample guide',description:'A patient guide with a clear summary and review caveat.',body,sources:['https://example.org/source'],language:'en',published_at:'2026-10-30T00:00:00Z',updated_at:'2026-10-30T00:00:00Z',reviewed_at:'2026-10-30T00:00:00Z',reviewed_by:'Doctor'});
assert.match(page,/<h2>What this means<\/h2>/);assert.match(page,/<h3>Practical points<\/h3>/);assert.match(page,/References/);assert.match(page,/https:\/\/example\.org\/source/);assert.doesNotMatch(page,/<script>alert\(1\)<\/script>/);
console.log('Published article Markdown rendering checks passed: headings, emphasis, lists, blockquotes and HTML escaping.');
