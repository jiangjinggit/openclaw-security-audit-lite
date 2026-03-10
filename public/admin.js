const leadCount = document.getElementById('leadCount');
const latestLead = document.getElementById('latestLead');
const leadList = document.getElementById('leadList');

Promise.all([
  fetch('/api/leads').then(r => r.json()),
  fetch('/api/lead-status').then(r => r.json())
]).then(([data, statusMap]) => {
  leadCount.textContent = data.length;
  latestLead.textContent = data.length ? new Date(data[data.length - 1].createdAt).toLocaleDateString('zh-CN') : '-';
  leadList.innerHTML = data.slice().reverse().map(item => `
    <article class="check">
      <h3>${item.name}</h3>
      <p><strong>联系方式：</strong>${item.contact}</p>
      <p><strong>部署方式：</strong>${item.deployType}</p>
      <p><strong>公网访问：</strong>${item.publicAccess}</p>
      <p><strong>关注风险：</strong>${item.riskConcern}</p>
      <p><strong>基础评分：</strong>${item.score} / 100</p>
      <p><strong>风险等级：</strong>${item.riskLevel}</p>
      <p><strong>状态：</strong>${statusMap[item.status] || item.status}</p>
      <p class="muted">${item.createdAt}</p>
    </article>
  `).join('') || '<div class="check">暂无线索</div>';
});
