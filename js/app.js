/**
 * Security Certification Roadmap – NICE Filterable
 * Loads data/certs.json and data/nice-work-roles.json, filters by NICE Work Role, sorts by level/cost.
 */

(function () {
  const LEVEL_ORDER = { Beginner: 0, Intermediate: 1, Expert: 2 };
  const resultCountEl = document.getElementById('result-count');
  const resultsEl = document.getElementById('results');
  const filterNiceEl = document.getElementById('filter-nice');
  const filterCategoryEl = document.getElementById('filter-category');
  const filterDod8140El = document.getElementById('filter-dod8140');
  const sortByEl = document.getElementById('sort-by');
  const resetBtn = document.getElementById('reset-filters');

  let certs = [];
  let niceWorkRoles = [];
  let selectedRoleIds = new Set();
  let selectedCategoryId = '';

  function getCostSortValue(cert) {
    const c = cert.costUsd;
    if (c == null) return Infinity;
    if (typeof c === 'number') return c;
    if (c && typeof c.min === 'number') return c.min;
    return Infinity;
  }

  function applySort(list, sortValue) {
    const arr = list.slice();
    switch (sortValue) {
      case 'level-asc':
        arr.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || a.name.localeCompare(b.name));
        break;
      case 'level-desc':
        arr.sort((a, b) => LEVEL_ORDER[b.level] - LEVEL_ORDER[a.level] || a.name.localeCompare(b.name));
        break;
      case 'cost-asc':
        arr.sort((a, b) => getCostSortValue(a) - getCostSortValue(b) || a.name.localeCompare(b.name));
        break;
      case 'cost-desc':
        arr.sort((a, b) => getCostSortValue(b) - getCostSortValue(a) || a.name.localeCompare(b.name));
        break;
      case 'name':
      default:
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return arr;
  }

  function filterCerts() {
    return certs.filter(function (cert) {
      if (selectedCategoryId) {
        const roleIdsInCategory = niceWorkRoles.filter(function (r) { return r.categoryId === selectedCategoryId; }).map(function (r) { return r.id; });
        const certInCategory = cert.niceWorkRoleIds && cert.niceWorkRoleIds.some(function (id) { return roleIdsInCategory.indexOf(id) !== -1; });
        if (!certInCategory) return false;
      }
      if (selectedRoleIds.size > 0) {
        const certMatches = cert.niceWorkRoleIds && cert.niceWorkRoleIds.some(function (id) { return selectedRoleIds.has(id); });
        if (!certMatches) return false;
      }
      if (filterDod8140El && filterDod8140El.checked) {
        if (!cert.dod8140) return false;
      }
      return true;
    });
  }

  function renderCerts(list) {
    const sorted = applySort(list, sortByEl.value);
    const frag = document.createDocumentFragment();
    sorted.forEach(function (cert) {
      const card = document.createElement('div');
      card.className = 'cert-card';
      let costDisplay = '—';
      if (cert.costUsd != null) {
        if (typeof cert.costUsd === 'number') costDisplay = '$' + cert.costUsd;
        else if (cert.costUsd.min != null && cert.costUsd.max != null) costDisplay = '$' + cert.costUsd.min + '–' + cert.costUsd.max;
        else if (cert.costUsd.min != null) costDisplay = '$' + cert.costUsd.min + '+';
      } else if (cert.costNote) costDisplay = cert.costNote;
      const dodBadge = (cert.dod8140 ? '<span class="cert-dod8140" title="DoD 8140 qualified' + (cert.dodWorkRoleCodes && cert.dodWorkRoleCodes.length ? ': ' + escapeHtml(cert.dodWorkRoleCodes.join(', ')) : '') + '">DoD 8140</span>' : '');
      card.innerHTML =
        '<span class="cert-name"><a href="' + escapeHtml(cert.url) + '" target="_blank" rel="noopener">' + escapeHtml(cert.name) + '</a></span>' +
        '<span class="cert-level ' + (cert.level || '').toLowerCase() + '">' + escapeHtml(cert.level || '') + '</span>' +
        '<span class="cert-cost">' + escapeHtml(costDisplay) + '</span>' +
        '<span class="cert-category" title="' + escapeHtml(cert.category || '') + '">' + escapeHtml(cert.category || '') + '</span>' +
        '<span class="cert-badges">' + dodBadge + '</span>';
      frag.appendChild(card);
    });
    resultsEl.innerHTML = '';
    resultsEl.appendChild(frag);
    resultCountEl.textContent = sorted.length + ' certification' + (sorted.length === 1 ? '' : 's');
  }

  function escapeHtml(s) {
    if (s == null) return '';
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function populateNiceFilter() {
    const categoryIds = [];
    const seen = new Set();
    niceWorkRoles.forEach(function (r) {
      if (!seen.has(r.categoryId)) {
        seen.add(r.categoryId);
        categoryIds.push(r.categoryId);
      }
    });
    filterCategoryEl.innerHTML = '<option value="">— All categories —</option>';
    categoryIds.forEach(function (cid) {
      const cat = niceWorkRoles.find(function (r) { return r.categoryId === cid; });
      const opt = document.createElement('option');
      opt.value = cid;
      opt.textContent = cat ? cat.categoryName : cid;
      filterCategoryEl.appendChild(opt);
    });
    filterNiceEl.innerHTML = '<option value="">— All roles —</option>';
    niceWorkRoles.forEach(function (r) {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = r.name + ' (' + r.id + ')';
      filterNiceEl.appendChild(opt);
    });
  }

  function syncSelectedRolesFromMultiSelect() {
    selectedRoleIds.clear();
    Array.prototype.forEach.call(filterNiceEl.selectedOptions, function (opt) {
      if (opt.value) selectedRoleIds.add(opt.value);
    });
  }

  function runFilterAndRender() {
    syncSelectedRolesFromMultiSelect();
    selectedCategoryId = filterCategoryEl.value || '';
    const filtered = filterCerts();
    renderCerts(filtered);
  }

  filterNiceEl.addEventListener('change', runFilterAndRender);
  filterCategoryEl.addEventListener('change', runFilterAndRender);
  sortByEl.addEventListener('change', function () {
    const filtered = filterCerts();
    renderCerts(filtered);
  });
  resetBtn.addEventListener('click', function () {
    filterNiceEl.selectedIndex = -1;
    filterCategoryEl.value = '';
    if (filterDod8140El) filterDod8140El.checked = false;
    sortByEl.value = 'level-asc';
    selectedRoleIds.clear();
    selectedCategoryId = '';
    runFilterAndRender();
  });
  if (filterDod8140El) filterDod8140El.addEventListener('change', runFilterAndRender);

  function loadJSON(path) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', path);
      xhr.responseType = 'json';
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
        else reject(new Error(xhr.statusText));
      };
      xhr.onerror = function () { reject(new Error('Network error')); };
      xhr.send();
    });
  }

  Promise.all([
    loadJSON('data/certs.json'),
    loadJSON('data/nice-work-roles.json')
  ]).then(function (results) {
    certs = results[0] || [];
    niceWorkRoles = results[1] || [];
    populateNiceFilter();
    runFilterAndRender();
  }).catch(function (err) {
    resultCountEl.textContent = 'Failed to load data: ' + err.message;
    resultsEl.innerHTML = '<p>Ensure <code>data/certs.json</code> and <code>data/nice-work-roles.json</code> exist and are served from the same origin (e.g. open via a local server or file).</p>';
  });
})();
