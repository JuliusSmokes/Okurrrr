# Okurrrr – Cybersecurity Career Launcher

**Set your Objectives. Certifications are the Key Results.**

A static, shareable cybersecurity certification roadmap for mentees and career-changers. Filterable by **NICE Framework Work Roles**, **CISSP CBK Domains**, **vendor**, **level**, and **free training availability**. Sortable by difficulty and cost.

Aligned with:
- [NIST NICE Framework](https://www.nist.gov/itl/applied-cybersecurity/nice) v2.1.0
- [NIST Cybersecurity Framework (CSF)](https://www.nist.gov/cyberframework)
- [NIST Risk Management Framework (RMF)](https://csrc.nist.gov/projects/risk-management)
- [NIST AI Risk Management Framework (AI RMF)](https://www.nist.gov/artificial-intelligence)
- [OWASP](https://owasp.org)
- [DoD 8140 Qualification Matrix](https://www.cyber.mil/dod-workforce-innovation-directorate/dod8140)
- [CISSP CBK (Common Body of Knowledge)](https://www.isc2.org/certifications/cissp)

No backend or build step. Open in a browser or deploy as static files (e.g. GitHub Pages).

---

## How to run locally

1. **Option A – Local HTTP server (recommended)**
   Browsers often block loading local JSON via `file://`. Use a simple static server from the project root, for example:

   ```bash
   npx serve .
   # or: python -m http.server 8000
   # or: npx http-server -p 8080
   ```

   Then open `http://localhost:3000` (or the port shown).

2. **Option B – Open `index.html` directly**
   If your environment allows `file://` requests to local JSON, you can open `index.html` in a browser. If you see "Failed to load data", use Option A.

---

## How to update data

- **Certifications**: Edit `data/certs.json`. Each object can have:
  - `id`, `name`, `fullName`, `vendor`, `description`, `url`
  - `category` (cert category), `level` (Beginner | Intermediate | Expert)
  - `niceWorkRoleIds`: array of NICE Work Role IDs (e.g. `["PD-WRL-003", "IO-WRL-006"]`)
  - `costUsd`: number or `{ "min": 100, "max": 200 }`, or `null`
  - `costNote`: string when cost is unknown
  - `dod8140`: boolean, `dodWorkRoleCodes`: string array
  - `freeTraining`: boolean, `freeTrainingUrl`: string or null
  - `cisspDomains`: array of CISSP domain IDs (e.g. `["cissp-d1", "cissp-d7"]`)
  - `status`: "active" | "retiring" | "upcoming", `statusNote`: string or null

- **NICE Work Roles**: Replace or edit `data/nice-work-roles.json` with the same structure (array of `{ "id", "name", "categoryId", "categoryName" }`). You can refresh this from [NIST NICE Framework Components](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/nice-framework-current-versions).

- **CISSP Domains**: Edit `data/cissp-domains.json` to update the 8 CISSP CBK domain definitions.

After saving JSON, refresh the page to see changes.

---

## Deployment (GitHub Pages)

The repo is set up for GitHub Pages with a `.nojekyll` file and an optional GitHub Actions workflow.

**Option A – Deploy from a branch (simplest)**
1. Push the repo to GitHub.
2. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose **Branch**: `main`, **Folder**: `/ (root)`, then save.
4. The site will be at `https://<username>.github.io/<repo-name>/`.

**Option B – GitHub Actions**
1. Push the repo to GitHub.
2. Go to **Settings → Pages**. Set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/pages.yml` runs on push to `main` and deploys the site.

**Option C – Enable from CLI**
If the repo has a remote and you use [GitHub CLI](https://cli.github.com/), run: `npm run enable-pages`

---

## Alignment Sources

- **NIST NICE Framework**: [Workforce Framework for Cybersecurity](https://www.nist.gov/itl/applied-cybersecurity/nice) – Work Role Categories and Work Roles used for filtering.
- **NIST CSF**: [Cybersecurity Framework](https://www.nist.gov/cyberframework) – Organizational risk management alignment.
- **NIST RMF**: [Risk Management Framework](https://csrc.nist.gov/projects/risk-management) – Federal security authorization lifecycle.
- **NIST AI RMF**: [AI Risk Management Framework](https://www.nist.gov/artificial-intelligence) – AI/ML risk management guidance.
- **OWASP**: [Open Worldwide Application Security Project](https://owasp.org) – Application security standards and training.
- **DoD 8140**: [DoD Cybersecurity Workforce Qualification Program](https://www.cyber.mil/dod-workforce-innovation-directorate/dod8140) – Certification alignment uses the DoD 8140 Qualification Matrix.
- **CISSP CBK**: [(ISC)² CISSP](https://www.isc2.org/certifications/cissp) – 8 domains of the Common Body of Knowledge used for domain-based filtering.

---

## DoD 8140 enrichment

To refresh DoD 8140 alignment (e.g. after the DoD matrix is updated):

1. Download the **Cybersecurity Qualification Matrix** (xlsx) from the [DoD 8140](https://www.cyber.mil/dod-workforce-innovation-directorate/dod8140) site and save it as `scripts/data/DoD8140MatrixV2.1.xlsx`.
2. Run: `npm run parse-dod8140` to parse the xlsx and generate `scripts/data/dod8140-lookup.json`.
3. Run: `npm run enrich-dod8140` to merge the lookup into `data/certs.json`.
4. Reload the site; the "DoD 8140 only" filter and DoD 8140 badges will reflect the updated data.
