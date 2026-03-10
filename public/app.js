const checksBox = document.getElementById('checks');
const plansBox = document.getElementById('plans');
const ctaBox = document.getElementById('ctaBox');
const leadForm = document.getElementById('leadForm');
const leadResult = document.getElementById('leadResult');
const scoreResult = document.getElementById('scoreResult');
const reportPreview = document.getElementById('reportPreview');

fetch('/api/checks').then(r => r.json()).then(data => {
  checksBox.innerHTML = data.map(item => `
    <article class="check">
      <span class="severity">${item.severity}</span>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
    </article>
  `).join('');
});

fetch('/api/plans').then(r => r.json()).then(data => {
  plansBox.innerHTML = data.map(item => `
    <article class="plan">
      <h3>${item.name}</h3>
      <p><strong>${item.price}</strong></p>
      <p>${item.desc}</p>
    </article>
  `).join('');
});

fetch('/api/cta').then(r => r.json()).then(data => {
  ctaBox.innerHTML = `
    <a class="cta-btn primary" href="${data.primary.url}" target="_blank">${data.primary.text}</a>
    <a class="cta-btn" href="${data.secondary.url}" target="_blank">${data.secondary.text}</a>
  `;
});

fetch('/api/questionnaire').then(r => r.json()).then(fields => {
  leadForm.innerHTML = `
    <input name="name" placeholder="你的称呼" required />
    <input name="contact" placeholder="邮箱 / 微信 / Telegram" required />
    ${fields.map(field => `
      <label>${field.label}
        <select name="${field.id}" required>
          <option value="">请选择</option>
          ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
        </select>
      </label>
    `).join('')}
    <input name="riskConcern" placeholder="你最担心的风险" required />
    <button type="submit">提交体检申请</button>
  `;

  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(leadForm);
    const payload = Object.fromEntries(form.entries());
    const [scoreRes, reportRes, leadRes] = await Promise.all([
      fetch('/api/score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
      fetch('/api/dynamic-report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
      fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    ]);
    const scoreData = await scoreRes.json();
    const reportData = await reportRes.json();
    if (leadRes.ok) {
      leadResult.textContent = '提交成功，已进入首批安全体检线索池。';
      scoreResult.innerHTML = `<strong>基础风险评分：</strong>${scoreData.score} / 100<br/><strong>风险等级：</strong>${scoreData.riskLevel}`;
      reportPreview.innerHTML = `<strong>动态报告预览：</strong><br/>${reportData.report.summary}<br/><br/>${reportData.report.findings.map(f => `- [${f.severity}] ${f.title}`).join('<br/>')}`;
      leadForm.reset();
    } else {
      leadResult.textContent = '提交失败，请稍后重试。';
    }
  });
});
