/**
 * Parse DoD 8140 Cybersecurity Qualification Matrix xlsx and output a JSON lookup.
 * Usage: node scripts/parse-dod8140.js [path-to.xlsx]
 * Default path: scripts/data/DoD8140MatrixV2.1.xlsx
 *
 * If the xlsx is not present, download from:
 * https://www.cyber.mil/dod-workforce-innovation-directorate/dod8140/
 * (Cybersecurity Qualification Matrix) and save as scripts/data/DoD8140MatrixV2.1.xlsx
 */

const fs = require('fs');
const path = require('path');

const defaultPath = path.join(__dirname, 'data', 'DoD8140MatrixV2.1.xlsx');
const outPath = path.join(__dirname, 'data', 'dod8140-lookup.json');

function normalize(s) {
  if (s == null || typeof s !== 'string') return '';
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function findColumnIndex(headers, keywords) {
  for (let i = 0; i < headers.length; i++) {
    const h = normalize(String(headers[i] || ''));
    if (keywords.some(kw => h.includes(kw))) return i;
  }
  return -1;
}

function main() {
  const xlsxPath = process.argv[2] || defaultPath;
  if (!fs.existsSync(xlsxPath)) {
    console.error('DoD 8140 xlsx not found at:', xlsxPath);
    console.error('Download the Cybersecurity Qualification Matrix from:');
    console.error('  https://www.cyber.mil/dod-workforce-innovation-directorate/dod8140/');
    console.error('Save as:', defaultPath);
    process.exit(1);
  }

  let XLSX;
  try {
    XLSX = require('xlsx');
  } catch (e) {
    console.error('Run: npm install xlsx');
    process.exit(1);
  }

  const workbook = XLSX.readFile(xlsxPath);
  const lookup = {}; // normalized cert name -> { dod8140: true, dodWorkRoleCodes: string[] }

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    if (data.length < 2) continue;

    const headers = data[0].map(h => (h != null ? String(h) : ''));
    const certCol = findColumnIndex(headers, ['certification', 'credential', 'acronym', 'cert name', 'certification name', 'commercial certification']);
    const roleCol = findColumnIndex(headers, ['work role', 'dcwf', 'role', '8140', 'qualification', 'proficiency']);
    if (certCol < 0) continue;

    for (let r = 1; r < data.length; r++) {
      const row = data[r];
      const certName = row[certCol] != null ? String(row[certCol]).trim() : '';
      if (!certName) continue;

      const key = normalize(certName);
      if (!lookup[key]) {
        lookup[key] = { certName: certName, dod8140: true, dodWorkRoleCodes: [] };
      }
      const roleCodes = lookup[key].dodWorkRoleCodes;
      if (roleCol >= 0 && row[roleCol] != null) {
        const code = String(row[roleCol]).trim();
        if (code && roleCodes.indexOf(code) === -1) roleCodes.push(code);
      }
      for (let c = 0; c < row.length; c++) {
        if (c === certCol || c === roleCol) continue;
        const val = row[c];
        if (val != null && String(val).trim() && headers[c] && normalize(headers[c]).includes('role')) {
          const code = String(val).trim();
          if (code && roleCodes.indexOf(code) === -1) roleCodes.push(code);
        }
      }
    }
  }

  const list = Object.values(lookup);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(list, null, 2), 'utf8');
  console.log('Wrote', list.length, 'DoD 8140 cert entries to', outPath);
}

main();
