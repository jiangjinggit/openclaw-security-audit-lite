const page = document.getElementById('reportPage');
Promise.all([
  fetch('/api/report').then(r => r.json()),
  fetch('/api/report-template').then(r => r.json())
]).then(([data, template]) => {
  const grouped = { high: [], medium: [], low: [] };
  data.findings.forEach(item => {
    if (!grouped[item.severity]) grouped[item.severity] = [];
    grouped[item.severity].push(item);
  });

  page.innerHTML = `
    <section class="report-hero">
      <div class="card"><strong>${data.project}</strong><span>项目名称</span></div>
      <div class="card"><strong>${data.score}</strong><span>安全评分</span></div>
      <div class="card"><strong>${data.riskLevel}</strong><span>风险等级</span></div>
      <div class="card"><strong>可整改</strong><span>输出可执行建议</span></div>
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
