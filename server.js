const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 4320;
const publicDir = path.join(__dirname, 'public');
const checksPath = path.join(__dirname, 'data', 'checks.json');
const reportPath = path.join(__dirname, 'data', 'report.json');
const leadsPath = path.join(__dirname, 'data', 'leads.json');
const plansPath = path.join(__dirname, 'data', 'plans.json');
const leadStatusPath = path.join(__dirname, 'data', 'lead-status.json');
const ctaPath = path.join(__dirname, 'data', 'cta.json');
const reportTemplatePath = path.join(__dirname, 'data', 'report-template.json');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, 'Not found');
    send(res, 200, data, types[path.extname(filePath)] || 'application/octet-stream');
  });
}

function scoreLead(payload) {
  let score = 20;
  const publicAccess = String(payload.publicAccess || '').toLowerCase();
  const deployType = String(payload.deployType || '').toLowerCase();
  const riskConcern = String(payload.riskConcern || '').toLowerCase();
  if (publicAccess.includes('yes') || publicAccess.includes('公网')) score += 35;
  if (deployType.includes('vps') || deployType.includes('云')) score += 15;
  if (riskConcern.includes('权限') || riskConcern.includes('暴露') || riskConcern.includes('泄露')) score += 20;
  if (riskConcern.includes('审计') || riskConcern.includes('日志')) score += 10;
  const riskLevel = score >= 70 ? 'high' : score >= 45 ? 'medium' : 'low';
  return { score, riskLevel };
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/checks') return serveFile(res, checksPath);
  if (url.pathname === '/api/report') return serveFile(res, reportPath);
  if (url.pathname === '/api/plans') return serveFile(res, plansPath);
  if (url.pathname === '/api/lead-status') return serveFile(res, leadStatusPath);
  if (url.pathname === '/api/cta') return serveFile(res, ctaPath);
  if (url.pathname === '/api/report-template') return serveFile(res, reportTemplatePath);
  if (url.pathname === '/api/leads' && req.method === 'GET') {
    const all = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
    const status = url.searchParams.get('status');
    const filtered = status ? all.filter(item => item.status === status) : all;
    return send(res, 200, JSON.stringify(filtered), 'application/json; charset=utf-8');
  }

  if (url.pathname === '/api/score' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const result = scoreLead(payload);
        send(res, 200, JSON.stringify({ ok: true, ...result }), 'application/json; charset=utf-8');
      } catch {
        send(res, 400, JSON.stringify({ ok: false }), 'application/json; charset=utf-8');
      }
    });
    return;
  }

  if (url.pathname === '/api/leads' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const current = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
        const scored = scoreLead(payload);
        current.push({ ...payload, ...scored, status: 'new', createdAt: new Date().toISOString() });
        fs.writeFileSync(leadsPath, JSON.stringify(current, null, 2));
        send(res, 200, JSON.stringify({ ok: true }), 'application/json; charset=utf-8');
      } catch {
        send(res, 400, JSON.stringify({ ok: false }), 'application/json; charset=utf-8');
      }
    });
    return;
  }

  const filePath = path.join(publicDir, url.pathname === '/' ? 'index.html' : url.pathname);
  if (!filePath.startsWith(publicDir)) return send(res, 403, 'Forbidden');
  serveFile(res, filePath);
}).listen(port, () => {
  console.log(`OpenClaw Security Audit Lite running at http://localhost:${port}`);
});
