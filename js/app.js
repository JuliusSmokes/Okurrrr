/**
 * Security Certification Roadmap – NICE Filterable
 * Loads certs + NICE work roles, renders chip-based filters, card grid, active filter bar.
 */

(function () {
  var LEVEL_ORDER = { Beginner: 0, Intermediate: 1, Expert: 2 };

  var resultsEl = document.getElementById('results');
  var resultCountEl = document.getElementById('result-count');
  var filterCategoryEl = document.getElementById('filter-category');
  var filterDod8140El = document.getElementById('filter-dod8140');
  var sortByEl = document.getElementById('sort-by');
  var resetBtn = document.getElementById('reset-filters');
  var searchInput = document.getElementById('search-input');
  var chipPanel = document.getElementById('chip-panel');
  var chipToggle = document.getElementById('chip-toggle');
  var expandIcon = document.getElementById('expand-icon');
  var chipCountEl = document.getElementById('chip-count');
  var clearRolesBtn = document.getElementById('clear-roles');
  var activeFiltersEl = document.getElementById('active-filters');
  var statCertsEl = document.getElementById('stat-certs');
  var statCategoriesEl = document.getElementById('stat-categories');
  var statRolesEl = document.getElementById('stat-roles');

  var certs = [];
  var niceWorkRoles = [];
  var selectedRoleIds = new Set();
  var selectedCategoryId = '';
  var searchTerm = '';
  var debounceTimer = null;

  /* ── Utilities ── */

  function escapeHtml(s) {
    if (s == null) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function getCostSortValue(cert) {
    var c = cert.costUsd;
    if (c == null) return Infinity;
    if (typeof c === 'number') return c;
    if (c && typeof c.min === 'number') return c.min;
    return Infinity;
  }

  function formatCost(cert) {
    if (cert.costUsd != null) {
      if (typeof cert.costUsd === 'number') return '$' + cert.costUsd.toLocaleString();
      if (cert.costUsd.min != null && cert.costUsd.max != null)
        return '$' + cert.costUsd.min.toLocaleString() + '–' + cert.costUsd.max.toLocaleString();
      if (cert.costUsd.min != null) return '$' + cert.costUsd.min.toLocaleString() + '+';
    }
    if (cert.costNote) return cert.costNote;
    return '—';
  }

  /* ── Sorting ── */

  function applySort(list, sortValue) {
    var arr = list.slice();
    switch (sortValue) {
      case 'level-asc':
        arr.sort(function (a, b) { return (LEVEL_ORDER[a.level] || 0) - (LEVEL_ORDER[b.level] || 0) || a.name.localeCompare(b.name); });
        break;
      case 'level-desc':
        arr.sort(function (a, b) { return (LEVEL_ORDER[b.level] || 0) - (LEVEL_ORDER[a.level] || 0) || a.name.localeCompare(b.name); });
        break;
      case 'cost-asc':
        arr.sort(function (a, b) { return getCostSortValue(a) - getCostSortValue(b) || a.name.localeCompare(b.name); });
        break;
      case 'cost-desc':
        arr.sort(function (a, b) { return getCostSortValue(b) - getCostSortValue(a) || a.name.localeCompare(b.name); });
        break;
      case 'name':
      default:
        arr.sort(function (a, b) { return a.name.localeCompare(b.name); });
        break;
    }
    return arr;
  }

  /* ── Filtering ── */

  function filterCerts() {
    var term = searchTerm.toLowerCase();
    return certs.filter(function (cert) {
      if (term) {
        var nameMatch = cert.name.toLowerCase().indexOf(term) !== -1;
        var fullMatch = cert.fullName && cert.fullName.toLowerCase().indexOf(term) !== -1;
        var vendorMatch = cert.vendor && cert.vendor.toLowerCase().indexOf(term) !== -1;
        if (!nameMatch && !fullMatch && !vendorMatch) return false;
      }

      if (selectedCategoryId) {
        var roleIdsInCategory = niceWorkRoles
          .filter(function (r) { return r.categoryId === selectedCategoryId; })
          .map(function (r) { return r.id; });
        var certInCategory = cert.niceWorkRoleIds &&
          cert.niceWorkRoleIds.some(function (id) { return roleIdsInCategory.indexOf(id) !== -1; });
        if (!certInCategory) return false;
      }

      if (selectedRoleIds.size > 0) {
        var certMatches = cert.niceWorkRoleIds &&
          cert.niceWorkRoleIds.some(function (id) { return selectedRoleIds.has(id); });
        if (!certMatches) return false;
      }

      if (filterDod8140El && filterDod8140El.checked) {
        if (!cert.dod8140) return false;
      }

      return true;
    });
  }

  /* ── Render cards ── */

  function renderCerts(list) {
    var sorted = applySort(list, sortByEl.value);
    resultsEl.innerHTML = '';

    if (sorted.length === 0) {
      resultsEl.innerHTML =
        '<div class="empty-state">' +
          '<span class="empty-icon">&#x1F50D;</span>' +
          '<p>No certifications match your filters.<br>Try broadening your search or removing some filters.</p>' +
          '<button class="btn-ghost" id="empty-reset">Reset all filters</button>' +
        '</div>';
      var emptyResetBtn = document.getElementById('empty-reset');
      if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAll);
      resultCountEl.textContent = '0 certifications';
      return;
    }

    var frag = document.createDocumentFragment();
    sorted.forEach(function (cert) {
      var card = document.createElement('div');
      card.className = 'cert-card';

      var levelClass = (cert.level || '').toLowerCase();
      var dodBadgeHtml = '';
      if (cert.dod8140) {
        var dodTitle = 'DoD 8140 qualified';
        if (cert.dodWorkRoleCodes && cert.dodWorkRoleCodes.length)
          dodTitle += ': ' + cert.dodWorkRoleCodes.join(', ');
        dodBadgeHtml = '<span class="badge badge-dod" title="' + escapeHtml(dodTitle) + '">DoD 8140</span>';
      }

      var statusBadgeHtml = '';
      if (cert.status === 'retiring') {
        var statusTitle = cert.statusNote || 'This certification is being retired';
        statusBadgeHtml = '<span class="badge badge-retiring" title="' + escapeHtml(statusTitle) + '">Retiring</span>';
        card.className += ' cert-card-retiring';
      } else if (cert.status === 'upcoming') {
        var upTitle = cert.statusNote || 'This certification is not yet available';
        statusBadgeHtml = '<span class="badge badge-upcoming" title="' + escapeHtml(upTitle) + '">Upcoming</span>';
        card.className += ' cert-card-upcoming';
      }

      var displayName = cert.fullName || cert.name;
      var acronym = (cert.fullName && cert.fullName !== cert.name)
        ? ' <span class="cert-acronym">(' + escapeHtml(cert.name) + ')</span>'
        : '';
      var vendorHtml = cert.vendor
        ? '<span class="cert-vendor">' + escapeHtml(cert.vendor) + '</span>'
        : '';
      var descHtml = cert.description
        ? '<p class="cert-desc">' + escapeHtml(cert.description) + '</p>'
        : '';

      card.innerHTML =
        '<div class="cert-card-header">' +
          '<a href="' + escapeHtml(cert.url) + '" target="_blank" rel="noopener">' + escapeHtml(displayName) + acronym + '</a>' +
          vendorHtml +
          descHtml +
        '</div>' +
        '<div class="cert-card-body">' +
          '<span class="badge badge-' + escapeHtml(levelClass) + '">' + escapeHtml(cert.level || '') + '</span>' +
          '<span class="badge badge-category" title="' + escapeHtml(cert.category || '') + '">' + escapeHtml(cert.category || '') + '</span>' +
        '</div>' +
        '<div class="cert-card-footer">' +
          dodBadgeHtml +
          statusBadgeHtml +
          '<span class="cert-cost">' + escapeHtml(formatCost(cert)) + '</span>' +
        '</div>';

      frag.appendChild(card);
    });

    resultsEl.appendChild(frag);
    resultCountEl.textContent = sorted.length + ' certification' + (sorted.length === 1 ? '' : 's');
  }

  /* ── Chip panel (NICE roles) ── */

  function buildChipPanel() {
    var categoryOrder = [];
    var seen = new Set();
    niceWorkRoles.forEach(function (r) {
      if (!seen.has(r.categoryId)) {
        seen.add(r.categoryId);
        categoryOrder.push(r.categoryId);
      }
    });

    chipPanel.innerHTML = '';
    categoryOrder.forEach(function (catId) {
      var roles = niceWorkRoles.filter(function (r) { return r.categoryId === catId; });
      if (roles.length === 0) return;

      var groupLabel = document.createElement('div');
      groupLabel.className = 'chip-group-label';
      groupLabel.textContent = roles[0].categoryName;
      chipPanel.appendChild(groupLabel);

      var chipList = document.createElement('div');
      chipList.className = 'chip-list';

      roles.forEach(function (r) {
        var chip = document.createElement('span');
        chip.className = 'chip';
        chip.setAttribute('tabindex', '0');
        chip.setAttribute('role', 'checkbox');
        chip.setAttribute('aria-checked', 'false');
        chip.dataset.roleId = r.id;
        chip.textContent = r.name;

        chip.addEventListener('click', function () { toggleRole(r.id); });
        chip.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleRole(r.id); }
        });

        chipList.appendChild(chip);
      });

      chipPanel.appendChild(chipList);
    });
  }

  function toggleRole(roleId) {
    if (selectedRoleIds.has(roleId)) selectedRoleIds.delete(roleId);
    else selectedRoleIds.add(roleId);
    syncChipVisuals();
    runFilterAndRender();
  }

  function syncChipVisuals() {
    var chips = chipPanel.querySelectorAll('.chip');
    chips.forEach(function (chip) {
      var isSelected = selectedRoleIds.has(chip.dataset.roleId);
      chip.classList.toggle('selected', isSelected);
      chip.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
    var count = selectedRoleIds.size;
    chipCountEl.textContent = count > 0 ? '(' + count + ' selected)' : '';
    clearRolesBtn.style.display = count > 0 ? '' : 'none';
  }

  /* ── Chip panel toggle (expand/collapse) ── */

  var chipPanelOpen = true;

  chipToggle.addEventListener('click', function () {
    chipPanelOpen = !chipPanelOpen;
    chipPanel.classList.toggle('collapsed', !chipPanelOpen);
    expandIcon.classList.toggle('collapsed', !chipPanelOpen);
  });

  clearRolesBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    selectedRoleIds.clear();
    syncChipVisuals();
    runFilterAndRender();
  });

  /* ── Active filter chips bar ── */

  function renderActiveFilters() {
    var chips = [];

    if (searchTerm) {
      chips.push({ label: 'Search: ' + searchTerm, clear: function () { searchInput.value = ''; searchTerm = ''; } });
    }
    if (selectedCategoryId) {
      var catName = '';
      var catOpt = filterCategoryEl.querySelector('option[value="' + selectedCategoryId + '"]');
      if (catOpt) catName = catOpt.textContent;
      chips.push({ label: 'Category: ' + catName, clear: function () { filterCategoryEl.value = ''; selectedCategoryId = ''; } });
    }
    selectedRoleIds.forEach(function (id) {
      var role = niceWorkRoles.find(function (r) { return r.id === id; });
      var name = role ? role.name : id;
      chips.push({ label: 'Role: ' + name, clear: function () { selectedRoleIds.delete(id); syncChipVisuals(); } });
    });
    if (filterDod8140El && filterDod8140El.checked) {
      chips.push({ label: 'DoD 8140', clear: function () { filterDod8140El.checked = false; } });
    }

    activeFiltersEl.innerHTML = '';
    if (chips.length === 0) return;

    var label = document.createElement('span');
    label.className = 'af-label';
    label.textContent = 'Active filters:';
    activeFiltersEl.appendChild(label);

    chips.forEach(function (c) {
      var fc = document.createElement('span');
      fc.className = 'filter-chip';
      fc.textContent = c.label + ' ';
      var btn = document.createElement('button');
      btn.className = 'fc-remove';
      btn.innerHTML = '&times;';
      btn.setAttribute('aria-label', 'Remove filter: ' + c.label);
      btn.addEventListener('click', function () {
        c.clear();
        runFilterAndRender();
      });
      fc.appendChild(btn);
      activeFiltersEl.appendChild(fc);
    });

    if (chips.length >= 2) {
      var clearAll = document.createElement('button');
      clearAll.className = 'clear-all-btn';
      clearAll.textContent = 'Clear all';
      clearAll.addEventListener('click', resetAll);
      activeFiltersEl.appendChild(clearAll);
    }
  }

  /* ── Populate category dropdown ── */

  function populateCategoryFilter() {
    var categoryIds = [];
    var seen = new Set();
    niceWorkRoles.forEach(function (r) {
      if (!seen.has(r.categoryId)) {
        seen.add(r.categoryId);
        categoryIds.push(r.categoryId);
      }
    });

    filterCategoryEl.innerHTML = '<option value="">-- All categories --</option>';
    categoryIds.forEach(function (cid) {
      var cat = niceWorkRoles.find(function (r) { return r.categoryId === cid; });
      var opt = document.createElement('option');
      opt.value = cid;
      opt.textContent = cat ? cat.categoryName : cid;
      filterCategoryEl.appendChild(opt);
    });
  }

  /* ── Hero stats ── */

  function updateStats() {
    statCertsEl.textContent = certs.length;
    var cats = new Set();
    niceWorkRoles.forEach(function (r) { cats.add(r.categoryId); });
    statCategoriesEl.textContent = cats.size;
    statRolesEl.textContent = niceWorkRoles.length;
  }

  /* ── Master filter + render ── */

  function runFilterAndRender() {
    selectedCategoryId = filterCategoryEl.value || '';
    var filtered = filterCerts();
    renderCerts(filtered);
    renderActiveFilters();
  }

  /* ── Reset all ── */

  function resetAll() {
    searchInput.value = '';
    searchTerm = '';
    filterCategoryEl.value = '';
    selectedCategoryId = '';
    if (filterDod8140El) filterDod8140El.checked = false;
    sortByEl.value = 'level-asc';
    selectedRoleIds.clear();
    syncChipVisuals();
    runFilterAndRender();
  }

  /* ── Event listeners ── */

  filterCategoryEl.addEventListener('change', runFilterAndRender);
  sortByEl.addEventListener('change', function () { runFilterAndRender(); });
  resetBtn.addEventListener('click', resetAll);
  if (filterDod8140El) filterDod8140El.addEventListener('change', runFilterAndRender);

  searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      searchTerm = searchInput.value.trim();
      runFilterAndRender();
    }, 200);
  });

  /* ── Data loading ── */

  function loadJSON(path) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
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
    populateCategoryFilter();
    buildChipPanel();
    updateStats();
    runFilterAndRender();
  }).catch(function (err) {
    resultCountEl.textContent = 'Failed to load data: ' + err.message;
    resultsEl.innerHTML =
      '<div class="empty-state">' +
        '<span class="empty-icon">&#x26A0;</span>' +
        '<p>Could not load certification data.<br>Ensure <code>data/certs.json</code> and <code>data/nice-work-roles.json</code> exist and are served from the same origin.</p>' +
      '</div>';
  });
})();
