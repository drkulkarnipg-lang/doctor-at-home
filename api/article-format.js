'use strict';
const { owner } = require('../server/owner-session');
const { createFormatter } = require('../server/article-format');
const formatArticle = createFormatter();

module.exports = async function articleFormat(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ message: 'Use POST.' }); }
  if (req.headers['sec-fetch-site'] === 'cross-site' ||
      req.headers.origin !== 'https://' + req.headers.host ||
      !String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    return res.status(403).json({ message: 'Same-origin JSON request required.' });
  }
  try {
    const session = await owner(req);
    if (!session) return res.status(401).json({ message: 'Sign in with Doctor login before using AI article formatting.' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!body || Buffer.byteLength(JSON.stringify(body)) > 36000) return res.status(400).json({ message: 'Article formatting request is too large.' });
    const result = await formatArticle(body, session.id);
    return res.status(200).json({ title: result.title, standfirst: result.standfirst, bodyMarkdown: result.bodyMarkdown, editorialNotes: result.editorialNotes, model: result.model });
  } catch (error) {
    const message = String(error?.message || '');
    if (/Confirm that|Invalid article|Enter a title|Provide no more|Each source|Owner authentication|Please wait 30 seconds|AI response|disallowed markup|safe request limit/i.test(message)) return res.status(400).json({ message });
    if (/AI formatting is not configured/i.test(message)) return res.status(503).json({ message });
    if (/AI Gateway authentication or credits/i.test(message)) return res.status(503).json({ message });
    if (/AI Gateway is unavailable|AI response was truncated|AI response was not valid JSON/i.test(message)) return res.status(502).json({ message });
    return res.status(503).json({ message: 'AI formatting did not complete. Your editor draft remains unchanged.' });
  }
};
