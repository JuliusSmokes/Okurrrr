#!/usr/bin/env node
/**
 * Link checker for all data files containing URLs.
 * Scans free-resources.json, certs.json, career-paths.json, defcon-media.json.
 * Reports broken, redirected, and timed-out URLs.
 *
 * Run: node scripts/check-links.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const url = require('url');

var CONCURRENCY = 10;
var TIMEOUT_MS = 15000;
var DELAY_MS = 100;

function checkUrl(targetUrl, maxRedirects) {
  if (maxRedirects === undefined) maxRedirects = 5;
  return new Promise(function (resolve) {
    if (maxRedirects <= 0) {
      resolve({ url: targetUrl, status: 0, error: 'Too many redirects' });
      return;
    }

    var parsed;
    try { parsed = new URL(targetUrl); } catch (e) {
      resolve({ url: targetUrl, status: 0, error: 'Invalid URL: ' + e.message });
      return;
    }

    var mod = parsed.protocol === 'https:' ? https : http;
    var options = {
      method: 'HEAD',
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      timeout: TIMEOUT_MS,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkChecker/1.0)',
        'Accept': '*/*'
      },
      rejectUnauthorized: false
    };

    var req = mod.request(options, function (res) {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        var nextUrl = res.headers.location;
        if (nextUrl.startsWith('/')) {
          nextUrl = parsed.protocol + '//' + parsed.host + nextUrl;
        }
        checkUrl(nextUrl, maxRedirects - 1).then(function (result) {
          resolve({
            url: targetUrl,
            status: res.statusCode,
            finalUrl: result.finalUrl || result.url,
            finalStatus: result.finalStatus || result.status,
            error: result.error
          });
        });
      } else {
        resolve({ url: targetUrl, status: res.statusCode, finalUrl: targetUrl, finalStatus: res.statusCode });
      }
      res.resume();
    });

    req.on('timeout', function () {
      req.destroy();
      resolve({ url: targetUrl, status: 0, error: 'Timeout (' + TIMEOUT_MS + 'ms)' });
    });

    req.on('error', function (err) {
      if (err.code === 'ENOTFOUND') {
        resolve({ url: targetUrl, status: 0, error: 'DNS not found: ' + parsed.hostname });
      } else if (err.message && err.message.indexOf('socket hang up') !== -1) {
        mod.request(Object.assign({}, options, { method: 'GET' }), function (res) {
          resolve({ url: targetUrl, status: res.statusCode, finalUrl: targetUrl, finalStatus: res.statusCode, note: 'HEAD rejected, GET ok' });
          res.resume();
        }).on('error', function (e2) {
          resolve({ url: targetUrl, status: 0, error: err.message });
        }).on('timeout', function () {
          resolve({ url: targetUrl, status: 0, error: 'Timeout on GET fallback' });
        }).end();
      } else {
        resolve({ url: targetUrl, status: 0, error: err.message });
      }
    });

    req.end();
  });
}

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

function extractUrls(dataDir) {
  var entries = [];

  var frPath = path.join(dataDir, 'free-resources.json');
  if (fs.existsSync(frPath)) {
    var fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));
    fr.forEach(function (r) {
      if (r.url) entries.push({ source: 'free-resources', id: r.id || '', name: r.name || '', url: r.url });
    });
  }

  var certsPath = path.join(dataDir, 'certs.json');
  if (fs.existsSync(certsPath)) {
    var certs = JSON.parse(fs.readFileSync(certsPath, 'utf8'));
    certs.forEach(function (c) {
      if (c.url) entries.push({ source: 'certs', id: c.id || '', name: c.name || '', url: c.url });
      if (c.trainingUrl) entries.push({ source: 'certs(training)', id: c.id || '', name: c.name || ' (training)', url: c.trainingUrl });
    });
  }

  var dcPath = path.join(dataDir, 'defcon-media.json');
  if (fs.existsSync(dcPath)) {
    var dc = JSON.parse(fs.readFileSync(dcPath, 'utf8'));
    dc.forEach(function (d) {
      if (d.url) entries.push({ source: 'defcon-media', id: d.id || '', name: d.name || '', url: d.url });
    });
  }

  return entries;
}

async function main() {
  var dataDir = path.resolve(__dirname, '..', 'data');
  var entries = extractUrls(dataDir);
  console.log('Found ' + entries.length + ' URLs to check\n');

  var broken = [];
  var redirected = [];
  var timedOut = [];
  var errors = [];
  var ok = 0;
  var checked = 0;

  for (var i = 0; i < entries.length; i += CONCURRENCY) {
    var batch = entries.slice(i, i + CONCURRENCY);
    var results = await Promise.all(batch.map(function (entry) {
      return checkUrl(entry.url).then(function (result) {
        return { entry: entry, result: result };
      });
    }));

    results.forEach(function (r) {
      var e = r.entry;
      var res = r.result;
      checked++;

      if (res.error) {
        if (res.error.indexOf('Timeout') !== -1) {
          timedOut.push(e.source + ' | ' + e.id + ' | ' + e.name + ' | ' + e.url + ' | ' + res.error);
        } else {
          errors.push(e.source + ' | ' + e.id + ' | ' + e.name + ' | ' + e.url + ' | ' + res.error);
        }
      } else if (res.finalStatus >= 400) {
        broken.push(e.source + ' | ' + e.id + ' | ' + e.name + ' | ' + e.url + ' | HTTP ' + res.finalStatus);
      } else if (res.status >= 300 && res.status < 400 && res.finalUrl !== res.url) {
        redirected.push(e.source + ' | ' + e.id + ' | ' + e.name + ' | ' + e.url + ' -> ' + res.finalUrl);
        ok++;
      } else {
        ok++;
      }
    });

    process.stdout.write('\r  Checked ' + checked + '/' + entries.length);
    if (i + CONCURRENCY < entries.length) await sleep(DELAY_MS);
  }

  console.log('\n');

  if (broken.length > 0) {
    console.log('=== BROKEN (' + broken.length + ') ===');
    broken.forEach(function (b) { console.log('  ' + b); });
    console.log('');
  }

  if (errors.length > 0) {
    console.log('=== ERRORS (' + errors.length + ') ===');
    errors.forEach(function (e) { console.log('  ' + e); });
    console.log('');
  }

  if (timedOut.length > 0) {
    console.log('=== TIMEOUT (' + timedOut.length + ') ===');
    timedOut.forEach(function (t) { console.log('  ' + t); });
    console.log('');
  }

  if (redirected.length > 0) {
    console.log('=== REDIRECTED (' + redirected.length + ') ===');
    redirected.forEach(function (r) { console.log('  ' + r); });
    console.log('');
  }

  console.log('=== SUMMARY ===');
  console.log('  Total URLs:  ' + entries.length);
  console.log('  OK:          ' + ok);
  console.log('  Broken:      ' + broken.length);
  console.log('  Errors:      ' + errors.length);
  console.log('  Timed out:   ' + timedOut.length);
  console.log('  Redirected:  ' + redirected.length);
}

main().catch(function (err) {
  console.error('Fatal:', err);
  process.exit(1);
});
