#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const RESOURCES_PATH = path.resolve(__dirname, '..', 'data', 'free-resources.json');
const CERTS_PATH = path.resolve(__dirname, '..', 'data', 'certs.json');
const REPORT_PATH = path.resolve(__dirname, '..', 'data', 'link-health-report.json');

const CONCURRENCY = 12;
const TIMEOUT_MS = 15000;
const RETRY_DELAY_MS = 1000;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

function collectUrls() {
  var resources = JSON.parse(fs.readFileSync(RESOURCES_PATH, 'utf8'));
  var certs = JSON.parse(fs.readFileSync(CERTS_PATH, 'utf8'));

  var urls = [];

  resources.forEach(function (r) {
    if (r.url) urls.push({ id: r.id, name: r.name, url: r.url, source: 'free-resources.json', field: 'url' });
  });

  certs.forEach(function (c) {
    if (c.url) urls.push({ id: c.id, name: c.name || c.fullName, url: c.url, source: 'certs.json', field: 'url' });
    if (c.freeTrainingUrl) urls.push({ id: c.id, name: (c.name || c.fullName) + ' (free training)', url: c.freeTrainingUrl, source: 'certs.json', field: 'freeTrainingUrl' });
  });

  return urls;
}

async function checkUrl(entry) {
  var result = { ...entry, status: null, statusText: '', category: '', redirectUrl: '', error: '' };

  try {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);

    // Try HEAD first (lighter)
    var resp = await fetch(entry.url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'follow'
    });
    clearTimeout(timer);

    // Some servers reject HEAD (405, 403). Retry with GET.
    if (resp.status === 405 || resp.status === 403) {
      controller = new AbortController();
      timer = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);
      resp = await fetch(entry.url, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'User-Agent': USER_AGENT },
        redirect: 'follow'
      });
      clearTimeout(timer);
    }

    result.status = resp.status;
    result.statusText = resp.statusText;

    if (resp.redirected && resp.url !== entry.url) {
      result.redirectUrl = resp.url;
    }

    if (resp.status >= 200 && resp.status < 300) {
      result.category = 'ok';
    } else if (resp.status >= 300 && resp.status < 400) {
      result.category = 'redirect';
    } else if (resp.status === 429) {
      result.category = 'rate-limited';
    } else if (resp.status >= 400 && resp.status < 500) {
      result.category = 'client-error';
    } else if (resp.status >= 500) {
      result.category = 'server-error';
    }
  } catch (err) {
    var msg = err.message || String(err);
    if (msg.includes('abort') || msg.includes('timeout') || msg.includes('TIMEOUT')) {
      result.category = 'timeout';
      result.error = 'Request timed out (' + TIMEOUT_MS + 'ms)';
    } else if (msg.includes('ENOTFOUND') || msg.includes('getaddrinfo')) {
      result.category = 'dns-failure';
      result.error = 'DNS resolution failed';
    } else if (msg.includes('SSL') || msg.includes('TLS') || msg.includes('certificate') || msg.includes('CERT_')) {
      result.category = 'ssl-error';
      result.error = msg;
    } else if (msg.includes('ECONNREFUSED')) {
      result.category = 'connection-refused';
      result.error = 'Connection refused';
    } else if (msg.includes('ECONNRESET')) {
      result.category = 'connection-reset';
      result.error = 'Connection reset';
    } else {
      result.category = 'other-error';
      result.error = msg;
    }
  }

  return result;
}

async function runBatch(entries, concurrency) {
  var results = [];
  var index = 0;
  var completed = 0;
  var total = entries.length;
  var startTime = Date.now();

  function progressBar() {
    var pct = Math.round((completed / total) * 100);
    var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    var bar = '='.repeat(Math.floor(pct / 2)) + ' '.repeat(50 - Math.floor(pct / 2));
    process.stdout.write('\r  [' + bar + '] ' + pct + '% (' + completed + '/' + total + ') ' + elapsed + 's');
  }

  async function worker() {
    while (index < entries.length) {
      var i = index++;
      var result = await checkUrl(entries[i]);

      // Retry once for rate-limited or timeout
      if (result.category === 'rate-limited' || result.category === 'timeout') {
        await new Promise(function (r) { setTimeout(r, RETRY_DELAY_MS + Math.random() * 2000); });
        result = await checkUrl(entries[i]);
      }

      results.push(result);
      completed++;
      progressBar();
    }
  }

  var workers = [];
  for (var w = 0; w < concurrency; w++) {
    workers.push(worker());
  }
  await Promise.all(workers);
  process.stdout.write('\n');
  return results;
}

function printReport(results) {
  var counts = { ok: 0, redirect: 0, 'client-error': 0, 'server-error': 0, 'rate-limited': 0, timeout: 0, 'dns-failure': 0, 'ssl-error': 0, 'connection-refused': 0, 'connection-reset': 0, 'other-error': 0 };

  results.forEach(function (r) { counts[r.category] = (counts[r.category] || 0) + 1; });

  console.log('\n========================================');
  console.log('       LINK HEALTH REPORT');
  console.log('========================================');
  console.log('  Checked:           ' + results.length + ' URLs');
  console.log('  OK (2xx):          ' + counts.ok);
  console.log('  Redirected (3xx):  ' + counts.redirect);
  console.log('  Client Error (4xx):' + counts['client-error']);
  console.log('  Server Error (5xx):' + counts['server-error']);
  console.log('  Rate Limited (429):' + counts['rate-limited']);
  console.log('  Timeout:           ' + counts.timeout);
  console.log('  DNS Failure:       ' + counts['dns-failure']);
  console.log('  SSL/TLS Error:     ' + counts['ssl-error']);
  console.log('  Conn Refused:      ' + counts['connection-refused']);
  console.log('  Conn Reset:        ' + counts['connection-reset']);
  console.log('  Other Error:       ' + counts['other-error']);
  console.log('========================================\n');

  var problems = results.filter(function (r) { return r.category !== 'ok'; });

  if (problems.length === 0) {
    console.log('All links are healthy!');
    return;
  }

  var grouped = {};
  problems.forEach(function (p) {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  var order = ['client-error', 'server-error', 'dns-failure', 'ssl-error', 'connection-refused', 'connection-reset', 'timeout', 'rate-limited', 'redirect', 'other-error'];

  order.forEach(function (cat) {
    if (!grouped[cat] || grouped[cat].length === 0) return;

    var labels = {
      'client-error': 'DEAD LINKS (4xx)',
      'server-error': 'SERVER ERRORS (5xx)',
      'dns-failure': 'DNS FAILURES',
      'ssl-error': 'SSL/TLS ERRORS',
      'connection-refused': 'CONNECTION REFUSED',
      'connection-reset': 'CONNECTION RESET',
      'timeout': 'TIMEOUTS',
      'rate-limited': 'RATE LIMITED (may be false positives)',
      'redirect': 'REDIRECTED (review destination)',
      'other-error': 'OTHER ERRORS'
    };

    console.log('--- ' + labels[cat] + ' (' + grouped[cat].length + ') ---');
    grouped[cat].forEach(function (p) {
      console.log('  ' + p.id + '  "' + p.name + '"');
      console.log('       URL: ' + p.url);
      if (p.status) console.log('       Status: ' + p.status + ' ' + p.statusText);
      if (p.redirectUrl) console.log('       -> ' + p.redirectUrl);
      if (p.error) console.log('       Error: ' + p.error);
      console.log('       Source: ' + p.source + ' [' + p.field + ']');
      console.log('');
    });
  });
}

async function main() {
  console.log('Collecting URLs...');
  var entries = collectUrls();
  console.log('  Found ' + entries.length + ' URLs to check\n');

  console.log('Checking links (concurrency: ' + CONCURRENCY + ', timeout: ' + (TIMEOUT_MS / 1000) + 's)...');
  var results = await runBatch(entries, CONCURRENCY);

  printReport(results);

  // Save full report
  var report = {
    timestamp: new Date().toISOString(),
    totalChecked: results.length,
    summary: {},
    problems: results.filter(function (r) { return r.category !== 'ok'; })
  };
  results.forEach(function (r) {
    report.summary[r.category] = (report.summary[r.category] || 0) + 1;
  });

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');
  console.log('Full report saved to: data/link-health-report.json');
}

main().catch(function (err) {
  console.error('Fatal error:', err);
  process.exit(1);
});
