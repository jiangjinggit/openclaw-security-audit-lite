# Architecture

## Overview
OpenClaw Security Audit Lite is a lightweight MVP that converts deployment questionnaire input into:
- a risk score
- a risk level
- grouped findings
- remediation suggestions
- exportable markdown output

## Current layers
1. **Landing / intake layer**
   - `public/index.html`
   - collects structured deployment and security answers

2. **Scoring and report layer**
   - `server.js`
   - computes score, risk level, grouped findings, remediation

3. **Data layer**
   - `data/questionnaire.json`
   - `data/plans.json`
   - `data/report-priority.json`
   - `data/remediation-map.json`
   - `data/report.json`

4. **Admin / lead layer**
   - `public/admin.html`
   - filtered lead list and prioritization view

5. **Export layer**
   - `scripts/export-report.js`
   - writes markdown report artifacts

## Current limitations
- Scoring is rule-based, not evidence-based scanning
- Export is markdown only
- No auth/account system
- No persistent customer workspace yet
