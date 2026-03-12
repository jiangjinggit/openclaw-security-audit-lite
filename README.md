# OpenClaw Security Audit Lite

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Module](https://img.shields.io/badge/module-security%20%2F%20audit-red)
![License](https://img.shields.io/badge/license-MIT-black)

A lightweight MVP for auditing OpenClaw deployments for exposure, permission, skill-source, and logging risks.

## English

### Positioning
This project helps OpenClaw users answer one critical question:

> Is my OpenClaw deployment safe enough to run in a real environment?

### Position in the product matrix
This repository is the **security / audit module** in the broader OpenClaw Control Console direction.

Related modules:
- `openclaw-monitor-lite` → runtime / observability module
- `openclaw-template-market` → workflow / enablement module

### Current scope
- Landing page for private deployment health-check
- Structured questionnaire
- Risk scoring
- Dynamic report generation
- Remediation suggestions
- Markdown report export
- Lead admin with filtering

### Best current packaging
This repo is currently strongest as a **private deployment health-check / security baseline / skill-risk scan** product, not as a heavy consulting service.

### Quick start
```bash
npm start
# default http://localhost:4320
```

### Screenshots / Demo
> Add screenshots here later:
- landing page
- dynamic report preview
- lead admin and prioritization view

### Related repositories
- [openclaw-monitor-lite](https://github.com/jiangjinggit/openclaw-monitor-lite)
- [openclaw-template-market](https://github.com/jiangjinggit/openclaw-template-market)

### Offer packaging
- [Security baseline offer](docs/SECURITY_BASELINE_OFFER.md)
- [Private deployment health-check landing copy](docs/PRIVATE_DEPLOYMENT_HEALTHCHECK_LANDING.md)
- [Homepage one-pager](docs/HOMEPAGE_ONE_PAGER.md)
- [First 299 RMB offer](docs/FIRST_OFFER_299.md)
- [First batch 199 RMB offer](docs/FIRST_BATCH_199.md)
- [First batch CTA strategy](docs/FIRST_BATCH_CTA.md)
- [Scarcity strategy](docs/SCARCITY_STRATEGY.md)
- [Security + observability positioning](docs/SECURITY_PLUS_OBSERVABILITY.md)
- [Baseline hardening and recheck](docs/BASELINE_AND_RECHECK.md)
- [Skill risk positioning](docs/SKILL_RISK_POSITIONING.md)
- [Recheck before/after](docs/RECHECK_BEFORE_AFTER.md)
- [Delivery artifacts plus](docs/DELIVERY_ARTIFACTS_PLUS.md)
- [Before/after cards](docs/BEFORE_AFTER_CARDS.md)
- [Skill scan outputs](docs/SKILL_SCAN_OUTPUTS.md)
- [Report readability](docs/REPORT_READABILITY.md)
- [Plan comparison](docs/PLAN_COMPARISON.md)
- [Case placeholders](docs/CASE_PLACEHOLDERS.md)
- [Anonymous case result format](docs/ANON_CASE_RESULTS.md)
- [Anonymous case cards](docs/ANON_CASE_CARDS.md)
- [Case results priority](docs/CASE_RESULTS_PRIORITY.md)
- [24h / 48h delivery expectations](docs/SLA_EXPECTATIONS.md)
- [Delivery checklist](docs/DELIVERY_CHECKLIST.md)
- [Deliverables](docs/DELIVERABLES.md)
- [Why productized, not consulting](docs/WHY_PRODUCTIZED_NOT_CONSULTING.md)
- [Why now](docs/WHY_NOW.md)
- [Pricing and fit](docs/PRICING_AND_FIT.md)
- [First batch flow](docs/FIRST_BATCH_FLOW.md)
- [Typical risk scenarios](docs/TYPICAL_RISK_SCENARIOS.md)
- [Fit guide](docs/FIT_GUIDE.md)
- [Customer scenarios](docs/CUSTOMER_SCENARIOS.md)
- [Buying path](docs/BUYING_PATH.md)
- [Sample outputs](docs/SAMPLE_OUTPUTS.md)
- [FAQ](docs/FAQ.md)
- [Chinese security checklist](docs/OPENCLAW_SECURITY_CHECKLIST_CN.md)

### Roadmap
- Better report delivery UX
- Better export formatting
- Better customer-side history view
- Team / multi-instance positioning
- Then switch focus back to `openclaw-monitor-lite` for the longer-term AgentOps shell

---

## 中文版

### 这个项目是干什么的
这是一个面向 OpenClaw 部署场景的**安全体检与审计产品原型**。

它帮助用户回答一个最关键的问题：
> **我现在这套 OpenClaw 部署，是否已经安全到可以进入真实环境？**

### 它在整个产品矩阵里的位置
这个仓库在 **OpenClaw Control Console** 路线里，承担的是：
> **安全审计 / 风险评分 / 整改建议模块**

另外两个关联模块：
- `openclaw-monitor-lite`：运行监控模块
- `openclaw-template-market`：模板与场景模块

### 当前能力
- landing page
- 结构化问卷
- 风险评分
- 动态报告生成
- 整改建议映射
- Markdown 报告导出
- 带筛选的线索后台

### 为什么值得做
当 OpenClaw 从“能跑”进入“真要用进业务”时，安全、审计、权限、暴露面就变成企业最先关心的问题。这个项目就是专门切这层付费点的。

### 快速启动
```bash
npm start
```
默认地址：
```bash
http://localhost:4320
```

### 截图 / 演示区（占位）
后续建议补三张图：
- landing page
- 动态报告预览页
- 线索后台与优先级页

### 关联仓库
- [openclaw-monitor-lite](https://github.com/jiangjinggit/openclaw-monitor-lite)
- [openclaw-template-market](https://github.com/jiangjinggit/openclaw-template-market)

### 后续路线
- 更好的正式报告体验
- 更强导出格式
- 更完整的客户侧历史视图
- 团队版 / 多实例定位

## License
MIT
