const page = document.getElementById('reportPage');
fetch('/api/report').then(r => r.json()).then(data => {
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
    <section>
      <h2>主要发现</h2>
      <div class="grid">
        ${data.findings.map(item => `
          <article class="finding">
            <span class="severity">${item.severity}</span>
            <h3>${item.title}</h3>
            <p><strong>证据：</strong>${item.evidence}</p>
            <p><strong>整改建议：</strong>${item.fix}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
});
