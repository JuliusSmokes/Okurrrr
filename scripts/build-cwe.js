#!/usr/bin/env node
/**
 * Fetches all CWE weaknesses from the MITRE CWE REST API,
 * trims to display-relevant fields, and writes data/cwe-data.json.
 *
 * Run: node scripts/build-cwe.js
 * Re-run when a new CWE version is released (a few times per year).
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const API_BASE = 'https://cwe-api.mitre.org/api/v1';
const OUTPUT_PATH = path.resolve(__dirname, '..', 'data', 'cwe-data.json');
const BATCH_SIZE = 15;
const CONCURRENCY = 3;
const DELAY_MS = 300;

function fetchJSON(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, function (res) {
      var chunks = [];
      res.on('data', function (c) { chunks.push(c); });
      res.on('end', function () {
        var body = Buffer.concat(chunks).toString();
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(body)); }
          catch (e) { reject(new Error('JSON parse error: ' + e.message)); }
        } else {
          reject(new Error('HTTP ' + res.statusCode + ' for ' + url));
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(function (r) { setTimeout(r, ms); });
}

function extractIdsFromTree(node) {
  var ids = new Set();
  if (node.Data && node.Data.Type && node.Data.Type.indexOf('weakness') !== -1) {
    ids.add(node.Data.ID);
  }
  if (node.Children) {
    node.Children.forEach(function (child) {
      extractIdsFromTree(child).forEach(function (id) { ids.add(id); });
    });
  }
  return ids;
}

function trimWeakness(w) {
  var parents = [];
  if (w.RelatedWeaknesses) {
    w.RelatedWeaknesses.forEach(function (r) {
      if (r.Nature === 'ChildOf' && r.ViewID === '1000') parents.push(r.CweID);
    });
  }

  var platforms = [];
  if (w.ApplicablePlatforms) {
    w.ApplicablePlatforms.forEach(function (p) {
      var label = p.Name || p.Class || '';
      if (label && platforms.indexOf(label) === -1) platforms.push(label);
    });
  }

  var consequences = [];
  if (w.CommonConsequences) {
    w.CommonConsequences.forEach(function (c) {
      (c.Scope || []).forEach(function (s) {
        (c.Impact || []).forEach(function (imp) {
          consequences.push({ scope: s, impact: imp });
        });
      });
    });
  }
  var seenConseq = {};
  consequences = consequences.filter(function (c) {
    var key = c.scope + '|' + c.impact;
    if (seenConseq[key]) return false;
    seenConseq[key] = true;
    return true;
  });

  var capecIds = (w.RelatedAttackPatterns || []).map(function (id) { return String(id); });

  var cveExamples = [];
  if (w.ObservedExamples) {
    w.ObservedExamples.slice(0, 5).forEach(function (ex) {
      if (ex.Reference) cveExamples.push(ex.Reference);
    });
  }

  var owasp = [];
  if (w.TaxonomyMappings) {
    w.TaxonomyMappings.forEach(function (tm) {
      if (tm.TaxonomyName && tm.TaxonomyName.indexOf('OWASP') !== -1) {
        var label = tm.EntryID ? (tm.EntryID + ' - ' + (tm.EntryName || '')) : (tm.EntryName || '');
        if (label && owasp.indexOf(label) === -1) owasp.push(label);
      }
    });
  }

  var mitigationCount = (w.PotentialMitigations || []).length;

  return {
    id: w.ID,
    name: w.Name || '',
    abstraction: w.Abstraction || '',
    status: w.Status || '',
    description: (w.Description || '').replace(/\n\s+/g, ' ').trim(),
    likelihood: w.LikelihoodOfExploit || '',
    parents: parents,
    platforms: platforms,
    consequences: consequences,
    mitigationCount: mitigationCount,
    capecIds: capecIds,
    cveExamples: cveExamples,
    owasp: owasp
  };
}

async function main() {
  console.log('Fetching CWE version info...');
  var versionInfo = await fetchJSON(API_BASE + '/cwe/version');
  console.log('  Version: ' + versionInfo.ContentVersion);
  console.log('  Date: ' + versionInfo.ContentDate);
  console.log('  Total weaknesses: ' + versionInfo.TotalWeaknesses);

  console.log('\nFetching weakness ID tree (View 1000 descendants)...');
  var tree = await fetchJSON(API_BASE + '/cwe/1000/descendants?view=1000');
  var treeRoot = Array.isArray(tree) ? tree[0] : tree;
  var allIds = extractIdsFromTree(treeRoot);
  var idList = Array.from(allIds).sort(function (a, b) { return Number(a) - Number(b); });
  console.log('  Extracted ' + idList.length + ' unique weakness IDs');

  console.log('\nFetching weakness details in batches of ' + BATCH_SIZE + '...');
  var weaknesses = [];
  var failed = [];

  var processed = 0;
  for (var i = 0; i < idList.length; i += CONCURRENCY) {
    var chunk = idList.slice(i, i + CONCURRENCY);
    var promises = chunk.map(function (id) {
      return fetchJSON(API_BASE + '/cwe/weakness/' + id).then(function (data) {
        var items = data.Weaknesses || [];
        if (items.length > 0) {
          weaknesses.push(trimWeakness(items[0]));
          return 1;
        }
        return 0;
      }).catch(function (err) {
        console.error('\n  FAIL CWE-' + id + ': ' + err.message);
        failed.push(id);
        return 0;
      });
    });

    var counts = await Promise.all(promises);
    processed += counts.reduce(function (a, b) { return a + b; }, 0);

    if (i % 30 === 0 || i + CONCURRENCY >= idList.length) {
      process.stdout.write('\r  Fetched ' + processed + '/' + idList.length + ' weaknesses');
    }

    if (i + CONCURRENCY < idList.length) await sleep(DELAY_MS);
  }
  console.log('');

  if (failed.length > 0) {
    console.log('\nRetrying ' + failed.length + ' failed IDs individually...');
    for (var fi = 0; fi < failed.length; fi++) {
      try {
        var data = await fetchJSON(API_BASE + '/cwe/weakness/' + failed[fi]);
        var items = data.Weaknesses || [];
        items.forEach(function (w) { weaknesses.push(trimWeakness(w)); });
      } catch (err) {
        console.error('  FAIL retry CWE-' + failed[fi] + ': ' + err.message);
      }
      await sleep(200);
    }
  }

  weaknesses.sort(function (a, b) { return Number(a.id) - Number(b.id); });

  var output = {
    version: versionInfo.ContentVersion,
    date: versionInfo.ContentDate,
    weaknesses: weaknesses
  };

  var json = JSON.stringify(output);
  fs.writeFileSync(OUTPUT_PATH, json);

  var sizeMB = (Buffer.byteLength(json) / (1024 * 1024)).toFixed(2);
  console.log('\nOutput written to ' + OUTPUT_PATH);
  console.log('  Weaknesses: ' + weaknesses.length);
  console.log('  File size: ' + sizeMB + ' MB');

  var abstractions = {};
  weaknesses.forEach(function (w) {
    abstractions[w.abstraction] = (abstractions[w.abstraction] || 0) + 1;
  });
  console.log('\nAbstraction breakdown:');
  Object.keys(abstractions).sort().forEach(function (k) {
    console.log('  ' + k + ': ' + abstractions[k]);
  });

  console.log('\nDone!');
}

main().catch(function (err) {
  console.error('Fatal error:', err);
  process.exit(1);
});
