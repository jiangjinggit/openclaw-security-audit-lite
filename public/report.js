const page = document.getElementById('reportPage');
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

  page.innerHTML = `
    <section class="report-hero">
      <div class="card"><strong>${data.project}</strong><span>项目名称</span></div>
      <div class="card"><strong>${data.score}</strong><span>部署风险评分</span></div>
      <div class="card"><strong>${data.riskLevel}</strong><span>风险等级</span></div>
      <div class="card"><strong>${priorityMap[data.riskLevel] || '待评估'}</strong><span>整改优先级</span></div>
    </section>
    <section class="grid">
      <article class="card">
        <strong>适合作用</strong>
        <span>上线前检查、团队内部汇报、客户交付前风险确认</span>
      </article>
      <article class="card">
        <strong>报告结构</strong>
        <span>摘要 + 分级问题清单 + 整改建议，适合直接继续往正式报告导出</span>
      </article>
      <article class="card">
        <strong>最重要的价值</strong>
        <span>不只是发现问题，而是明确先修什么、为什么先修</span>
      </article>
    </section>
    <section class="card">
      <h2>摘要</h2>
      <p>${data.summary}</p>
    </section>
    ${template.sections.map(section => `
      <section>
        <h2>${section.title}</h2>
        <div class="grid">
          ${(grouped[section.name] || []).map(item => `
            <article class="finding">
              <span class="severity">${item.severity}</span>
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
