const page = document.getElementById('reportPage');

const levelLabelMap = {
  high: '红灯 / 高风险',
  medium: '黄灯 / 中风险',
  low: '绿灯 / 低风险'
};

const launchAdviceMap = {
  high: '当前不建议直接上线，先关闭暴露面、收紧权限，再进入复检。',
  medium: '可进入小范围试运行，但不建议直接扩大到真实团队或高价值账号场景。',
  low: '当前已接近可上线状态，建议带着例行巡检和告警继续运行。'
};

Promise.all([
  fetch('/api/report').then(r => r.json()),
  fetch('/api/report-template').then(r => r.json()),
  fetch('/api/report-priority').then(r => r.json())
]).then(([data, template, priorityMap]) => {
  const grouped = { high: [], medium: [], low: [] };
  data.findings.forEach(item => {
    if (!grouped[item.severity]) grouped[item.severity] = [];
    grouped[item.severity].push(item);
  });

  const orderedFindings = [
    ...(grouped.high || []),
    ...(grouped.medium || []),
    ...(grouped.low || [])
  ];

  const topFixes = orderedFindings.slice(0, 3);
  const scoreClass = data.riskLevel || 'medium';
  const levelLabel = levelLabelMap[data.riskLevel] || '待评估';
  const launchAdvice = launchAdviceMap[data.riskLevel] || '建议结合详细报告继续评估。';

  page.innerHTML = `
    <section class="report-hero report-hero-4">
      <div class="card score-card ${scoreClass}"><strong>${data.score}</strong><span>风险分数</span></div>
      <div class="card"><strong>${levelLabel}</strong><span>红黄绿等级</span></div>
      <div class="card"><strong>${priorityMap[data.riskLevel] || '待评估'}</strong><span>整改优先级</span></div>
      <div class="card"><strong>${data.project}</strong><span>项目名称</span></div>
    </section>

    <section class="grid">
      <article class="card summary-card ${scoreClass}">
        <strong>是否建议上线</strong>
        <span>${launchAdvice}</span>
      </article>
      <article class="card">
        <strong>最适合怎么用</strong>
        <span>上线前检查、团队内部汇报、客户交付前风险确认、复检前后对比。</span>
      </article>
      <article class="card">
        <strong>报告真正价值</strong>
        <span>不是列一堆问题，而是明确先修哪 3 个、为什么先修、修完能不能更安心上线。</span>
      </article>
    </section>

    <section class="card">
      <h2>执行摘要</h2>
      <p>${data.summary}</p>
    </section>

    <section>
      <h2>先修哪 3 个</h2>
      <div class="grid">
        ${topFixes.map((item, index) => `
          <article class="finding finding-priority-${item.severity}">
            <span class="severity">优先级 ${index + 1}</span>
            <h3>${item.title}</h3>
            <p><strong>为什么先修：</strong>${item.evidence}</p>
            <p><strong>建议动作：</strong>${item.fix}</p>
          </article>
        `).join('') || '<div class="finding">当前没有可排序的问题项</div>'}
      </div>
    </section>

    ${template.sections.map(section => `
      <section>
        <h2>${section.title}</h2>
        <div class="grid">
          ${(grouped[section.name] || []).map(item => `
            <article class="finding finding-priority-${item.severity}">
              <span class="severity">${levelLabelMap[item.severity] || item.severity}</span>
              <h3>${item.title}</h3>
              <p><strong>证据：</strong>${item.evidence}</p>
              <p><strong>整改建议：</strong>${item.fix}</p>
            </article>
          `).join('') || `<div class="finding">当前无${section.title}</div>`}
        </div>
      </section>
    `).join('')}
  `;
});
