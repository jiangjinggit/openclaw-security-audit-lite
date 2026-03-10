const checksBox = document.getElementById('checks');
const plansBox = document.getElementById('plans');
const leadForm = document.getElementById('leadForm');
const leadResult = document.getElementById('leadResult');
const scoreResult = document.getElementById('scoreResult');

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

leadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(leadForm);
  const payload = Object.fromEntries(form.entries());
  const scoreRes = await fetch('/api/score', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  const scoreData = await scoreRes.json();
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (res.ok) {
    leadResult.textContent = '提交成功，已进入首批安全体检线索池。';
    scoreResult.innerHTML = `<strong>基础风险评分：</strong>${scoreData.score} / 100<br/><strong>风险等级：</strong>${scoreData.riskLevel}`;
    leadForm.reset();
  } else {
    leadResult.textContent = '提交失败，请稍后重试。';
  }
});
