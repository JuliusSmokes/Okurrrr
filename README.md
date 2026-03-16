# Security Certification Roadmap (NICE-Filterable)

A **static**, shareable version of the [Paul Jerimy Security Certification Roadmap](https://pauljerimy.com/security-certification-roadmap/) that you can use with mentees. It is **filterable by NICE Framework Work Roles** and **sortable by level (difficulty/effort) and cost**.

- **Certification data**: Based on Paul Jerimy’s roadmap (July 2024, 481 certifications). Each cert has a Paul Jerimy category and is mapped to one or more **NICE Framework Work Roles** (NIST NICE Framework v2.1.0) for filtering.
- **Difficulty / effort**: Uses the roadmap’s **level** (Beginner, Intermediate, Expert). Sort by level ascending or descending.
- **Cost**: Each cert has optional `costUsd` (number or `{ min, max }`) and `costNote` (e.g. “See vendor”). You can add or edit these in `data/certs.json`. Sort by cost low→high or high→low.

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
   If your environment allows `file://` requests to local JSON, you can open `index.html` in a browser. If you see “Failed to load data”, use Option A.

---

## How to update data

- **Certifications**: Edit `data/certs.json`. Each object can have:
  - `id`, `name`, `url`, `category` (Paul Jerimy category), `level` (Beginner | Intermediate | Expert)
  - `niceWorkRoleIds`: array of NICE Work Role IDs (e.g. `["PD-WRL-003", "IO-WRL-006"]`) used for the NICE filter
  - `costUsd`: number or `{ "min": 100, "max": 200 }`, or `null`
  - `costNote`: string (e.g. "See vendor") when cost is unknown
  - `dod8140`: boolean — whether the cert appears in the DoD 8140 matrix (used by "DoD 8140 only" filter)
  - `dodWorkRoleCodes`: string array — DoD work role codes from the matrix (shown in badge tooltip)

- **NICE Work Roles**: Replace or edit `data/nice-work-roles.json` with the same structure (array of `{ "id", "name", "categoryId", "categoryName" }`). You can refresh this from [NIST NICE Framework Components](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/nice-framework-current-versions) (XLSX or JSON).

After saving JSON, refresh the page to see changes.

---

## Deployment (GitHub Pages)

The repo is set up for GitHub Pages with a `.nojekyll` file (so Jekyll is not run) and an optional GitHub Actions workflow.

**Option A – Deploy from a branch (simplest)**  
1. Push the repo to GitHub.  
2. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**.  
3. Choose **Branch**: `main` (or your default branch), **Folder**: `/ (root)`, then save.  
4. The site will be at `https://<username>.github.io/<repo-name>/` once deployment finishes.

**Option B – GitHub Actions**  
1. Push the repo to GitHub.  
2. Go to **Settings → Pages**. Set **Source** to **GitHub Actions**.  
3. The workflow in `.github/workflows/pages.yml` runs on push to `main` and deploys the site.  
4. After the first run, the site will be at `https://<username>.github.io/<repo-name>/`.

If your default branch is not `main`, either use Option A with that branch, or edit the workflow `branches: [main]` to match your branch name.

**Option C – Enable from CLI (after repo is on GitHub)**  
If the repo has a remote and you use [GitHub CLI](https://cli.github.com/) (`gh auth login`), you can enable Pages from the project root:  
`npm run enable-pages`

---

## Attribution

- **Certification roadmap**: [Paul Jerimy – Security Certification Roadmap](https://pauljerimy.com/security-certification-roadmap/) (July 2024). Source: [GitHub: PaulJerimy/SecCertRoadmapHTML](https://github.com/PaulJerimy/SecCertRoadmapHTML).
- **NICE Framework**: [NIST NICE Workforce Framework for Cybersecurity](https://www.nist.gov/itl/applied-cybersecurity/nice) (Work Role Categories and Work Roles). NICE-to-certification mapping is best-effort (category-based and can be refined using the [C3 NICE mapping](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/nice-framework-current-versions) where applicable).
- **DoD 8140**: Certification alignment uses the [DoD Cybersecurity Workforce Qualification Program](https://www.cyber.mil/dod-workforce-innovation-directorate/dod8140) (DoD 8140 Qualification Matrix). The matrix is used for enrichment only; download the official xlsx from the DoD 8140 site and run the scripts below to refresh `dod8140` and `dodWorkRoleCodes` in `data/certs.json`.

---

## Rebuilding `data/certs.json` from the roadmap

If you have a copy of the roadmap page content (e.g. saved as text with `[Cert Name](url)` links and “Expert” / “Intermediate” / “Beginner” section headers):

```bash
node scripts/build-certs.js path/to/roadmap-sample.txt
```

This overwrites `data/certs.json` with parsed certs, inferred categories, and NICE role IDs from the category mapping in the script. You can then edit `data/certs.json` to add costs or adjust NICE roles.


---

## DoD 8140 enrichment

To refresh DoD 8140 alignment (e.g. after the DoD matrix is updated):

1. Download the **Cybersecurity Qualification Matrix** (xlsx) from the [DoD 8140](https://www.cyber.mil/dod-workforce-innovation-directorate/dod8140) site and save it as `scripts/data/DoD8140MatrixV2.1.xlsx`.
2. Run: `npm run parse-dod8140` to parse the xlsx and generate `scripts/data/dod8140-lookup.json`.
3. Run: `npm run enrich-dod8140` to merge the lookup into `data/certs.json` (sets `dod8140` and `dodWorkRoleCodes` per cert).
4. Reload the site; the “DoD 8140 only” filter and DoD 8140 badges will reflect the updated data.
