const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'data');
const outDir = path.join(root, 'exports');
fs.mkdirSync(outDir, { recursive: true });

const report = JSON.parse(fs.readFileSync(path.join(dataDir, 'report.json'), 'utf8'));
const outPath = path.join(outDir, `security-audit-report-${Date.now()}.md`);
const lines = [];
lines.push(`# ${report.project}`);
lines.push('');
lines.push(`- 安全评分：${report.score}`);
lines.push(`- 风险等级：${report.riskLevel}`);
lines.push('');
lines.push('## 摘要');
lines.push(report.summary);
lines.push('');
lines.push('## 主要发现');
for (const f of report.findings) {
  lines.push(`### [${f.severity}] ${f.title}`);
  lines.push(`- 证据：${f.evidence}`);
  lines.push(`- 整改建议：${f.fix}`);
  lines.push('');
}
fs.writeFileSync(outPath, lines.join('\n'));
const logPath = path.join(dataDir, 'export-log.json');
let log = [];
try { log = JSON.parse(fs.readFileSync(logPath, 'utf8')); } catch {}
log.unshift({ at: new Date().toISOString(), path: outPath, type: 'markdown-report' });
log = log.slice(0, 20);
fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
console.log(outPath);
