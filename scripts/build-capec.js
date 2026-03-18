#!/usr/bin/env node
/**
 * Downloads the CAPEC XML catalog from capec.mitre.org,
 * parses attack patterns, trims to display-relevant fields,
 * and writes data/capec-data.json.
 *
 * Run: node scripts/build-capec.js
 * Re-run when a new CAPEC version is released (a few times per year).
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

var CAPEC_XML_URL = 'https://capec.mitre.org/data/xml/capec_latest.xml';
var OUTPUT_PATH = path.resolve(__dirname, '..', 'data', 'capec-data.json');

function downloadXML(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, function (res) {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadXML(res.headers.location).then(resolve, reject);
      }
      var chunks = [];
      res.on('data', function (c) { chunks.push(c); });
      res.on('end', function () {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(Buffer.concat(chunks).toString('utf8'));
        } else {
          reject(new Error('HTTP ' + res.statusCode));
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

function extractTag(xml, tag) {
  var re = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>', 'i');
  var m = xml.match(re);
  return m ? m[1].trim() : '';
}

function extractAttr(xml, attr) {
  var re = new RegExp(attr + '="([^"]*)"');
  var m = xml.match(re);
  return m ? m[1] : '';
}

function extractAllTags(xml, tag) {
  var re = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>', 'gi');
  var results = [];
  var m;
  while ((m = re.exec(xml)) !== null) {
    results.push(m[1].trim());
  }
  return results;
}

function extractAllElements(xml, tag) {
  var re = new RegExp('<' + tag + '[\\s\\S]*?(?:/>|</' + tag + '>)', 'gi');
  var results = [];
  var m;
  while ((m = re.exec(xml)) !== null) {
    results.push(m[0]);
  }
  return results;
}

function stripXhtml(s) {
  return s.replace(/<\/?xhtml:[^>]*>/g, '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function parseAttackPattern(apXml) {
  var id = extractAttr(apXml, 'ID');
  var name = extractAttr(apXml, 'Name');
  var abstraction = extractAttr(apXml, 'Abstraction');
  var status = extractAttr(apXml, 'Status');
  var description = stripXhtml(extractTag(apXml, 'Description'));

  var likelihood = extractTag(apXml, 'Likelihood_Of_Attack') || '';
  var severity = extractTag(apXml, 'Typical_Severity') || '';

  var prerequisites = extractAllTags(apXml, 'Prerequisite').map(stripXhtml).filter(Boolean);

  var skills = [];
  var skillEls = extractAllElements(apXml, 'Skill');
  skillEls.forEach(function (el) {
    var level = extractAttr(el, 'Level');
    if (level) skills.push(level);
  });
  var uniqueSkills = [];
  skills.forEach(function (s) { if (uniqueSkills.indexOf(s) === -1) uniqueSkills.push(s); });

  var cweIds = [];
  var rwEls = extractAllElements(apXml, 'Related_Weakness');
  rwEls.forEach(function (el) {
    var cid = extractAttr(el, 'CWE_ID');
    if (cid && cweIds.indexOf(cid) === -1) cweIds.push(cid);
  });

  var parentCapec = [];
  var childCapec = [];
  var relApEls = extractAllElements(apXml, 'Related_Attack_Pattern');
  relApEls.forEach(function (el) {
    var nature = extractAttr(el, 'Nature');
    var capecId = extractAttr(el, 'CAPEC_ID');
    if (nature === 'ChildOf' && capecId) parentCapec.push(capecId);
    if (nature === 'ParentOf' && capecId) childCapec.push(capecId);
  });

  var consequences = [];
  var conseqEls = extractAllElements(apXml, 'Consequence');
  conseqEls.forEach(function (el) {
    var scopes = extractAllTags(el, 'Scope');
    var impacts = extractAllTags(el, 'Impact');
    scopes.forEach(function (s) {
      impacts.forEach(function (imp) {
        var key = s + '|' + imp;
        var exists = consequences.some(function (c) { return c.scope + '|' + c.impact === key; });
        if (!exists) consequences.push({ scope: s, impact: imp });
      });
    });
  });

  var mitigations = [];
  var mitEls = extractAllElements(apXml, 'Mitigation');
  mitEls.forEach(function (el) {
    var text = stripXhtml(el);
    if (text) mitigations.push(text);
  });

  var executionSteps = 0;
  var stepEls = extractAllElements(apXml, 'Attack_Step');
  executionSteps = stepEls.length;

  var taxonomies = [];
  var taxEls = extractAllElements(apXml, 'Taxonomy_Mapping');
  taxEls.forEach(function (el) {
    var taxName = extractAttr(el, 'Taxonomy_Name');
    var entryId = extractTag(el, 'Entry_ID');
    var entryName = extractTag(el, 'Entry_Name');
    if (taxName) {
      var label = entryId ? (entryId + ' - ' + entryName) : entryName;
      taxonomies.push({ source: taxName, label: label });
    }
  });

  return {
    id: id,
    name: name,
    abstraction: abstraction,
    status: status,
    description: description,
    likelihood: likelihood,
    severity: severity,
    prerequisites: prerequisites.length,
    skillLevels: uniqueSkills,
    cweIds: cweIds,
    parents: parentCapec,
    consequences: consequences,
    mitigationCount: mitigations.length,
    executionSteps: executionSteps,
    taxonomies: taxonomies
  };
}

async function main() {
  console.log('Downloading CAPEC XML catalog...');
  var xml = await downloadXML(CAPEC_XML_URL);
  console.log('  Downloaded: ' + Math.round(xml.length / 1024) + ' KB');

  var version = extractAttr(xml, 'Version');
  var date = extractAttr(xml, 'Date');
  console.log('  Version: ' + version);
  console.log('  Date: ' + date);

  console.log('\nParsing attack patterns...');
  var apRegex = /<Attack_Pattern [\s\S]*?<\/Attack_Pattern>/g;
  var apMatches = xml.match(apRegex) || [];
  console.log('  Found ' + apMatches.length + ' Attack_Pattern elements');

  var patterns = [];
  apMatches.forEach(function (apXml) {
    var status = extractAttr(apXml, 'Status');
    if (status === 'Deprecated' || status === 'Obsolete') return;
    patterns.push(parseAttackPattern(apXml));
  });

  patterns.sort(function (a, b) { return Number(a.id) - Number(b.id); });

  var output = {
    version: version,
    date: date,
    patterns: patterns
  };

  var json = JSON.stringify(output);
  fs.writeFileSync(OUTPUT_PATH, json);

  var sizeMB = (Buffer.byteLength(json) / (1024 * 1024)).toFixed(2);
  console.log('\nOutput written to ' + OUTPUT_PATH);
  console.log('  Attack patterns: ' + patterns.length);
  console.log('  File size: ' + sizeMB + ' MB');

  var abstractions = {};
  patterns.forEach(function (p) {
    abstractions[p.abstraction] = (abstractions[p.abstraction] || 0) + 1;
  });
  console.log('\nAbstraction breakdown:');
  Object.keys(abstractions).sort().forEach(function (k) {
    console.log('  ' + k + ': ' + abstractions[k]);
  });

  var severities = {};
  patterns.forEach(function (p) {
    var s = p.severity || '(none)';
    severities[s] = (severities[s] || 0) + 1;
  });
  console.log('\nSeverity breakdown:');
  Object.keys(severities).sort().forEach(function (k) {
    console.log('  ' + k + ': ' + severities[k]);
  });

  var withCwe = patterns.filter(function (p) { return p.cweIds.length > 0; }).length;
  console.log('\nWith CWE refs: ' + withCwe + '/' + patterns.length);

  console.log('\nDone!');
}

main().catch(function (err) {
  console.error('Fatal error:', err);
  process.exit(1);
});
