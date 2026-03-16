/**
 * Okurrrr – Cybersecurity Career Launcher
 * Loads certs + NICE work roles + CISSP domains, renders chip-based filters, card grid, active filter bar.
 */

(function () {
  var LEVEL_ORDER = { Beginner: 0, Intermediate: 1, Expert: 2 };

  var resultsEl = document.getElementById('results');
  var resultCountEl = document.getElementById('result-count');
  var filterCategoryEl = document.getElementById('filter-category');
  var filterVendorEl = document.getElementById('filter-vendor');
  var filterLevelEl = document.getElementById('filter-level');
  var filterCisspEl = document.getElementById('filter-cissp');
  var filterRegionEl = document.getElementById('filter-region');
  var filterDod8140El = document.getElementById('filter-dod8140');
  var filterFreeEl = document.getElementById('filter-free');
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
  var statFreeEl = document.getElementById('stat-free');

  var certs = [];
  var niceWorkRoles = [];
  var cisspDomains = [];
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
        return '$' + cert.costUsd.min.toLocaleString() + '\u2013' + cert.costUsd.max.toLocaleString();
      if (cert.costUsd.min != null) return '$' + cert.costUsd.min.toLocaleString() + '+';
    }
    if (cert.costNote) return cert.costNote;
    return '\u2014';
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
    var vendorVal = filterVendorEl ? filterVendorEl.value : '';
    var regionVal = filterRegionEl ? filterRegionEl.value : '';
    var levelVal = filterLevelEl ? filterLevelEl.value : '';
    var cisspVal = filterCisspEl ? filterCisspEl.value : '';

    return certs.filter(function (cert) {
      if (term) {
        var nameMatch = cert.name.toLowerCase().indexOf(term) !== -1;
        var fullMatch = cert.fullName && cert.fullName.toLowerCase().indexOf(term) !== -1;
        var vendorMatch = cert.vendor && cert.vendor.toLowerCase().indexOf(term) !== -1;
        var descMatch = cert.description && cert.description.toLowerCase().indexOf(term) !== -1;
        if (!nameMatch && !fullMatch && !vendorMatch && !descMatch) return false;
      }

      if (vendorVal && cert.vendor !== vendorVal) return false;

      if (regionVal) {
        if (!cert.regions || cert.regions.indexOf(regionVal) === -1) return false;
      }

      if (levelVal && cert.level !== levelVal) return false;

      if (cisspVal) {
        if (!cert.cisspDomains || cert.cisspDomains.indexOf(cisspVal) === -1) return false;
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

      if (filterFreeEl && filterFreeEl.checked) {
        if (!cert.freeTraining) return false;
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

      var freeBadgeHtml = '';
      if (cert.freeTraining) {
        if (cert.freeTrainingUrl) {
          freeBadgeHtml = '<span class="badge badge-free"><a href="' + escapeHtml(cert.freeTrainingUrl) +
            '" target="_blank" rel="noopener" title="Free study resources available">Free Training \u2197</a></span>';
        } else {
          freeBadgeHtml = '<span class="badge badge-free" title="Free study resources available">Free Training</span>';
        }
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

      var regionBadgesHtml = '';
      if (cert.regions && !(cert.regions.length === 1 && cert.regions[0] === 'Global')) {
        cert.regions.forEach(function (r) {
          regionBadgesHtml += '<span class="badge badge-region">' + escapeHtml(r) + '</span>';
        });
      }

      card.innerHTML =
        '<div class="cert-card-header">' +
          '<a href="' + escapeHtml(cert.url) + '" target="_blank" rel="noopener">' + escapeHtml(displayName) + acronym + '</a>' +
          vendorHtml +
          descHtml +
        '</div>' +
        '<div class="cert-card-body">' +
          '<span class="badge badge-' + escapeHtml(levelClass) + '">' + escapeHtml(cert.level || '') + '</span>' +
          '<span class="badge badge-category" title="' + escapeHtml(cert.category || '') + '">' + escapeHtml(cert.category || '') + '</span>' +
          regionBadgesHtml +
        '</div>' +
        '<div class="cert-card-footer">' +
          dodBadgeHtml +
          statusBadgeHtml +
          freeBadgeHtml +
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
    if (filterVendorEl && filterVendorEl.value) {
      var vv = filterVendorEl.value;
      chips.push({ label: 'Vendor: ' + vv, clear: function () { filterVendorEl.value = ''; } });
    }
    if (filterRegionEl && filterRegionEl.value) {
      var rv = filterRegionEl.value;
      chips.push({ label: 'Region: ' + rv, clear: function () { filterRegionEl.value = ''; } });
    }
    if (filterLevelEl && filterLevelEl.value) {
      var lv = filterLevelEl.value;
      chips.push({ label: 'Level: ' + lv, clear: function () { filterLevelEl.value = ''; } });
    }
    if (selectedCategoryId) {
      var catName = '';
      var catOpt = filterCategoryEl.querySelector('option[value="' + selectedCategoryId + '"]');
      if (catOpt) catName = catOpt.textContent;
      chips.push({ label: 'NICE Category: ' + catName, clear: function () { filterCategoryEl.value = ''; selectedCategoryId = ''; } });
    }
    if (filterCisspEl && filterCisspEl.value) {
      var cv = filterCisspEl.value;
      var domObj = cisspDomains.find(function (d) { return d.id === cv; });
      var domLabel = domObj ? domObj.name : cv;
      chips.push({ label: 'CISSP: ' + domLabel, clear: function () { filterCisspEl.value = ''; } });
    }
    selectedRoleIds.forEach(function (id) {
      var role = niceWorkRoles.find(function (r) { return r.id === id; });
      var name = role ? role.name : id;
      chips.push({ label: 'Role: ' + name, clear: function () { selectedRoleIds.delete(id); syncChipVisuals(); } });
    });
    if (filterDod8140El && filterDod8140El.checked) {
      chips.push({ label: 'DoD 8140', clear: function () { filterDod8140El.checked = false; } });
    }
    if (filterFreeEl && filterFreeEl.checked) {
      chips.push({ label: 'Free Training', clear: function () { filterFreeEl.checked = false; } });
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

  /* ── Populate dropdowns ── */

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

  function populateVendorFilter() {
    if (!filterVendorEl) return;
    var vendors = [];
    var seen = new Set();
    certs.forEach(function (c) {
      if (c.vendor && !seen.has(c.vendor)) {
        seen.add(c.vendor);
        vendors.push(c.vendor);
      }
    });
    vendors.sort(function (a, b) { return a.localeCompare(b); });

    filterVendorEl.innerHTML = '<option value="">-- All vendors --</option>';
    vendors.forEach(function (v) {
      var opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      filterVendorEl.appendChild(opt);
    });
  }

  function populateRegionFilter() {
    if (!filterRegionEl) return;
    var regionSet = new Set();
    certs.forEach(function (c) {
      if (c.regions) c.regions.forEach(function (r) { regionSet.add(r); });
    });
    var regions = [];
    regionSet.forEach(function (r) { regions.push(r); });
    regions.sort(function (a, b) {
      if (a === 'Global') return -1;
      if (b === 'Global') return 1;
      return a.localeCompare(b);
    });

    filterRegionEl.innerHTML = '<option value="">-- All regions --</option>';
    regions.forEach(function (r) {
      var opt = document.createElement('option');
      opt.value = r;
      opt.textContent = r;
      filterRegionEl.appendChild(opt);
    });
  }

  function populateCisspFilter() {
    if (!filterCisspEl) return;
    filterCisspEl.innerHTML = '<option value="">-- All domains --</option>';
    cisspDomains.forEach(function (d) {
      var opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = d.name;
      filterCisspEl.appendChild(opt);
    });
  }

  /* ── Hero stats ── */

  function updateStats() {
    statCertsEl.textContent = certs.length;
    var cats = new Set();
    niceWorkRoles.forEach(function (r) { cats.add(r.categoryId); });
    statCategoriesEl.textContent = cats.size;
    statRolesEl.textContent = niceWorkRoles.length;
    if (statFreeEl) {
      statFreeEl.textContent = certs.filter(function (c) { return c.freeTraining; }).length;
    }
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
    if (filterVendorEl) filterVendorEl.value = '';
    if (filterRegionEl) filterRegionEl.value = '';
    if (filterLevelEl) filterLevelEl.value = '';
    if (filterCisspEl) filterCisspEl.value = '';
    if (filterDod8140El) filterDod8140El.checked = false;
    if (filterFreeEl) filterFreeEl.checked = false;
    sortByEl.value = 'level-asc';
    selectedRoleIds.clear();
    syncChipVisuals();
    runFilterAndRender();
  }

  /* ── Event listeners ── */

  filterCategoryEl.addEventListener('change', runFilterAndRender);
  if (filterVendorEl) filterVendorEl.addEventListener('change', runFilterAndRender);
  if (filterRegionEl) filterRegionEl.addEventListener('change', runFilterAndRender);
  if (filterLevelEl) filterLevelEl.addEventListener('change', runFilterAndRender);
  if (filterCisspEl) filterCisspEl.addEventListener('change', runFilterAndRender);
  sortByEl.addEventListener('change', function () { runFilterAndRender(); });
  resetBtn.addEventListener('click', resetAll);
  if (filterDod8140El) filterDod8140El.addEventListener('change', runFilterAndRender);
  if (filterFreeEl) filterFreeEl.addEventListener('change', runFilterAndRender);

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
    loadJSON('data/nice-work-roles.json'),
    loadJSON('data/cissp-domains.json')
  ]).then(function (results) {
    certs = results[0] || [];
    niceWorkRoles = results[1] || [];
    cisspDomains = results[2] || [];
    populateCategoryFilter();
    populateVendorFilter();
    populateRegionFilter();
    populateCisspFilter();
    buildChipPanel();
    updateStats();
    runFilterAndRender();
  }).catch(function (err) {
    resultCountEl.textContent = 'Failed to load data: ' + err.message;
    resultsEl.innerHTML =
      '<div class="empty-state">' +
        '<span class="empty-icon">&#x26A0;</span>' +
        '<p>Could not load certification data.<br>Ensure <code>data/certs.json</code>, <code>data/nice-work-roles.json</code>, and <code>data/cissp-domains.json</code> exist and are served from the same origin.</p>' +
      '</div>';
  });

  /* ── Particle background (Miami Vice themed) ── */

  if (typeof loadSlim === 'function' && typeof tsParticles !== 'undefined') {
    (function () {
      loadSlim(tsParticles).then(function () {
        return tsParticles.load({
          id: 'tsparticles',
          options: {
            fullScreen: { enable: false },
            fpsLimit: 120,
            particles: {
              number: {
                value: 100,
                density: { enable: true, area: 1000 }
              },
              color: {
                value: ['#ff2d7b', '#ff5a9d', '#00e5c7', '#33f0d6', '#f5a623', '#58a6ff', '#a78bfa', '#ff6b6b', '#e2e8f4']
              },
              shape: { type: 'circle' },
              opacity: {
                value: { min: 0.6, max: 1.0 },
                animation: { enable: true, speed: 1.5, startValue: 'random', sync: false }
              },
              size: {
                value: { min: 1, max: 4 },
                animation: { enable: true, speed: 2, startValue: 'random', sync: false }
              },
              collisions: {
                enable: true,
                mode: 'bounce'
              },
              links: {
                enable: true,
                distance: 220,
                color: { value: ['#ff2d7b', '#ff5a9d', '#00e5c7', '#33f0d6', '#f5a623', '#58a6ff', '#a78bfa', '#ff6b6b', '#e2e8f4'] },
                opacity: 0.85,
                width: 1.5
              },
              move: {
                enable: true,
                speed: 1.8,
                direction: 'none',
                outModes: { default: 'bounce' },
                attract: { enable: true, rotate: { x: 1500, y: 1500 } },
                random: true
              }
            },
            interactivity: {
              detectsOn: 'canvas',
              events: {
                onHover: { enable: true, mode: ['grab', 'attract'] },
                onClick: { enable: true, mode: 'push' }
              },
              modes: {
                grab: { distance: 250, links: { opacity: 1.0, color: '#a78bfa' } },
                attract: { distance: 200, duration: 0.4, speed: 1 },
                push: { quantity: 4 }
              }
            },
            detectRetina: true
          }
        });
      });
    })();
  }
})();
