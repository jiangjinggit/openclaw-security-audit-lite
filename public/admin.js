const leadCount = document.getElementById('leadCount');
const latestLead = document.getElementById('latestLead');
const leadList = document.getElementById('leadList');
const statusFilter = document.getElementById('statusFilter');
const riskFilter = document.getElementById('riskFilter');

async function loadLeads() {
  const query = statusFilter.value ? `?status=${statusFilter.value}` : '';
  const [data, statusMap] = await Promise.all([
    fetch('/api/leads' + query).then(r => r.json()),
    fetch('/api/lead-status').then(r => r.json())
  ]);
  let filtered = riskFilter.value ? data.filter(item => item.riskLevel === riskFilter.value) : data;
  filtered = filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
  leadCount.textContent = filtered.length;
  latestLead.textContent = filtered.length ? new Date(filtered[0].createdAt).toLocaleDateString('zh-CN') : '-';
  leadList.innerHTML = filtered.map(item => `
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
}

statusFilter.addEventListener('change', loadLeads);
riskFilter.addEventListener('change', loadLeads);
loadLeads();
