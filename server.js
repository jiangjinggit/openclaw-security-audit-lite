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
const questionnairePath = path.join(__dirname, 'data', 'questionnaire.json');
const reportOutputPath = path.join(__dirname, 'data', 'report-output.md');
const reportPriorityPath = path.join(__dirname, 'data', 'report-priority.json');

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
  let score = 10;
  const deployType = String(payload.deployType || '').toLowerCase();
  const publicAccess = String(payload.publicAccess || '').toLowerCase();
  const authStatus = String(payload.authStatus || '').toLowerCase();
  const toolPermission = String(payload.toolPermission || '').toLowerCase();
  const skillSource = String(payload.skillSource || '').toLowerCase();
  const auditLog = String(payload.auditLog || '').toLowerCase();
  const riskConcern = String(payload.riskConcern || '').toLowerCase();

  if (deployType.includes('vps') || deployType.includes('云')) score += 10;
  if (publicAccess.includes('是') || publicAccess.includes('yes') || publicAccess.includes('公网')) score += 25;
  if (authStatus.includes('无')) score += 20;
  else if (authStatus.includes('基础')) score += 10;
  if (toolPermission.includes('高')) score += 20;
  else if (toolPermission.includes('中')) score += 10;
  if (skillSource.includes('不明')) score += 15;
  else if (skillSource.includes('部分')) score += 8;
  if (auditLog.includes('没有')) score += 15;
  else if (auditLog.includes('部分')) score += 8;
  if (riskConcern.includes('权限') || riskConcern.includes('暴露') || riskConcern.includes('泄露')) score += 10;

  score = Math.min(score, 100);
  const riskLevel = score >= 75 ? 'high' : score >= 45 ? 'medium' : 'low';
  return { score, riskLevel };
}

function buildDynamicReport(payload) {
  const { score, riskLevel } = scoreLead(payload);
  const findings = [];
  const priorityMap = JSON.parse(fs.readFileSync(reportPriorityPath, 'utf8'));
  if (String(payload.publicAccess).includes('是') || String(payload.publicAccess).toLowerCase().includes('yes')) {
    findings.push({ title: '实例公网可达', severity: 'high', evidence: '实例暴露在公网访问路径中', fix: '增加网关鉴权、来源限制或内网隔离' });
  }
  if (String(payload.authStatus).includes('无')) {
    findings.push({ title: '鉴权缺失', severity: 'high', evidence: '当前未设置有效鉴权', fix: '为管理入口和关键接口增加鉴权机制' });
  }
  if (String(payload.toolPermission).includes('高')) {
    findings.push({ title: '工具权限过宽', severity: 'high', evidence: 'Agent 获得过高工具执行范围', fix: '按角色与环境收紧权限边界' });
  }
  if (String(payload.skillSource).includes('不明')) {
    findings.push({ title: 'Skill 来源风险', severity: 'medium', evidence: '存在来源不明的技能包', fix: '建立技能白名单并校验来源' });
  }
  if (String(payload.auditLog).includes('没有')) {
    findings.push({ title: '缺少审计日志', severity: 'medium', evidence: '关键动作未形成统一审计记录', fix: '增加日志留存、异常告警与巡检记录' });
  }
  if (!findings.length) {
    findings.push({ title: '基础风险可控', severity: 'low', evidence: '当前输入下未发现明显高风险项', fix: '继续保持定期复检与配置审查' });
  }
  const grouped = {
    high: findings.filter(f => f.severity === 'high'),
    medium: findings.filter(f => f.severity === 'medium'),
    low: findings.filter(f => f.severity === 'low')
  };
  return {
    project: payload.name || 'Submitted OpenClaw Workspace',
    score,
    riskLevel,
    priority: priorityMap[riskLevel],
    summary: `根据问卷结果，当前部署风险等级为 ${riskLevel}，建议优先处理高风险权限与暴露面问题。`,
    findings,
    grouped
  };
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/checks') return serveFile(res, checksPath);
  if (url.pathname === '/api/report') return serveFile(res, reportPath);
  if (url.pathname === '/api/plans') return serveFile(res, plansPath);
  if (url.pathname === '/api/lead-status') return serveFile(res, leadStatusPath);
  if (url.pathname === '/api/cta') return serveFile(res, ctaPath);
  if (url.pathname === '/api/report-template') return serveFile(res, reportTemplatePath);
  if (url.pathname === '/api/questionnaire') return serveFile(res, questionnairePath);
  if (url.pathname === '/api/report-output') return serveFile(res, reportOutputPath);
  if (url.pathname === '/api/report-priority') return serveFile(res, reportPriorityPath);
  if (url.pathname === '/api/leads' && req.method === 'GET') {
    const all = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
    const status = url.searchParams.get('status');
    const filtered = status ? all.filter(item => item.status === status) : all;
    return send(res, 200, JSON.stringify(filtered), 'application/json; charset=utf-8');
  }

  if ((url.pathname === '/api/score' || url.pathname === '/api/dynamic-report') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        if (url.pathname === '/api/score') {
          const result = scoreLead(payload);
          return send(res, 200, JSON.stringify({ ok: true, ...result }), 'application/json; charset=utf-8');
        }
        const report = buildDynamicReport(payload);
        return send(res, 200, JSON.stringify({ ok: true, report }), 'application/json; charset=utf-8');
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
