/**
 * Okurrrr – Cybersecurity Career Launcher
 * Loads certs + NICE work roles + CISSP domains + free resources, renders tabbed UI with card grids.
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
  var statCweEl = document.getElementById('stat-cwe');

  var controlsCertsEl = document.getElementById('controls-certs');
  var controlsResEl = document.getElementById('controls-resources');
  var controlsDefconEl = document.getElementById('controls-defcon');
  var chipSectionEl = document.getElementById('chip-section');
  var filterResCategoryEl = document.getElementById('filter-res-category');
  var filterResProviderEl = document.getElementById('filter-res-provider');
  var filterResLevelEl = document.getElementById('filter-res-level');
  var filterResCisspEl = document.getElementById('filter-res-cissp');
  var sortResEl = document.getElementById('sort-res');
  var resetResBtn = document.getElementById('reset-res-filters');
  var sortDefconEl = document.getElementById('sort-defcon');
  var resetDefconBtn = document.getElementById('reset-defcon-filters');
  var tabCountCertsEl = document.getElementById('tab-count-certs');
  var tabCountResEl = document.getElementById('tab-count-resources');
  var tabCountDefconEl = document.getElementById('tab-count-defcon');

  var certs = [];
  var resources = [];
  var defconMedia = [];
  var niceWorkRoles = [];
  var cisspDomains = [];
  var careerPaths = [];
  var selectedRoleIds = new Set();
  var selectedCategoryId = '';
  var searchTerm = '';
  var debounceTimer = null;
  var activeTab = 'certs';
  var selectedPath = null;
  var pathfinderProgress = {};

  var pathfinderPanelEl = document.getElementById('pathfinder-panel');
  var pathfinderTimelineEl = document.getElementById('pathfinder-timeline');
  var pathfinderChipsEl = document.getElementById('pathfinder-chips');
  var tabCountPathfinderEl = document.getElementById('tab-count-pathfinder');
  var buildPathBtn = document.getElementById('build-path-btn');
  var pfNiceRoleEl = document.getElementById('pf-nice-role');
  var pfCisspDomainEl = document.getElementById('pf-cissp-domain');

  var cwePanelEl = document.getElementById('cwe-panel');
  var cweListEl = document.getElementById('cwe-list');
  var cweSearchInput = document.getElementById('cwe-search-input');
  var cweCountEl = document.getElementById('cwe-count');
  var cweLoadingEl = document.getElementById('cwe-loading');
  var cweFilterAbstractionEl = document.getElementById('cwe-filter-abstraction');
  var cweFilterStatusEl = document.getElementById('cwe-filter-status');
  var cweFilterLikelihoodEl = document.getElementById('cwe-filter-likelihood');
  var tabCountCweEl = document.getElementById('tab-count-cwe');
  var cweVersionBadgeEl = document.getElementById('cwe-version-badge');

  var cweData = null;
  var filteredCwe = [];
  var cwePage = 1;
  var CWE_PAGE_SIZE = 50;
  var cweLoaded = false;
  var cweSearchTerm = '';
  var cweDebounceTimer = null;

  var glossaryPanelEl = document.getElementById('glossary-panel');
  var glossaryListEl = document.getElementById('glossary-list');
  var glossarySearchInput = document.getElementById('glossary-search-input');
  var glossaryAlphaEl = document.getElementById('glossary-alpha');
  var glossaryCountEl = document.getElementById('glossary-count');
  var glossaryLoadingEl = document.getElementById('glossary-loading');
  var glossaryPathFilterEl = document.getElementById('glossary-path-filter');
  var glossarySourceFilterEl = document.getElementById('glossary-source-filter');
  var tabCountGlossaryEl = document.getElementById('tab-count-glossary');

  var glossaryTerms = null;
  var glossaryPathMap = null;
  var filteredGlossary = [];
  var glossaryLetter = 'All';
  var glossarySource = 'all';
  var glossaryPathFilter = '';
  var glossarySearchTerm = '';
  var glossaryPage = 1;
  var GLOSSARY_PAGE_SIZE = 100;
  var glossaryLoaded = false;
  var glossaryDebounceTimer = null;

  var CISSP_SHORT = {
    'cissp-d1': 'D1: Risk Mgmt',
    'cissp-d2': 'D2: Asset Security',
    'cissp-d3': 'D3: Sec Architecture',
    'cissp-d4': 'D4: Network Security',
    'cissp-d5': 'D5: IAM',
    'cissp-d6': 'D6: Sec Testing',
    'cissp-d7': 'D7: Sec Operations',
    'cissp-d8': 'D8: Software Security'
  };

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

  /* ── Resource filtering ── */

  function filterResources() {
    var term = searchTerm.toLowerCase();
    var catVal = filterResCategoryEl ? filterResCategoryEl.value : '';
    var provVal = filterResProviderEl ? filterResProviderEl.value : '';
    var lvlVal = filterResLevelEl ? filterResLevelEl.value : '';
    var cisspVal = filterResCisspEl ? filterResCisspEl.value : '';

    return resources.filter(function (r) {
      if (term) {
        var nm = r.name.toLowerCase().indexOf(term) !== -1;
        var pv = r.provider && r.provider.toLowerCase().indexOf(term) !== -1;
        var ds = r.description && r.description.toLowerCase().indexOf(term) !== -1;
        var tg = r.tags && r.tags.some(function (t) { return t.toLowerCase().indexOf(term) !== -1; });
        if (!nm && !pv && !ds && !tg) return false;
      }
      if (catVal && r.category !== catVal) return false;
      if (provVal && r.provider !== provVal) return false;
      if (lvlVal && r.level !== lvlVal) return false;
      if (cisspVal) {
        if (!r.cisspDomains || r.cisspDomains.indexOf(cisspVal) === -1) return false;
      }
      return true;
    });
  }

  /* ── Resource sorting ── */

  function applySortResources(list, sortValue) {
    var arr = list.slice();
    switch (sortValue) {
      case 'level-asc':
        arr.sort(function (a, b) { return (LEVEL_ORDER[a.level] || 0) - (LEVEL_ORDER[b.level] || 0) || a.name.localeCompare(b.name); });
        break;
      case 'level-desc':
        arr.sort(function (a, b) { return (LEVEL_ORDER[b.level] || 0) - (LEVEL_ORDER[a.level] || 0) || a.name.localeCompare(b.name); });
        break;
      case 'name':
      default:
        arr.sort(function (a, b) { return a.name.localeCompare(b.name); });
        break;
    }
    return arr;
  }

  /* ── Render resource cards ── */

  function renderResources(list) {
    var sorted = applySortResources(list, sortResEl ? sortResEl.value : 'name');
    resultsEl.innerHTML = '';

    if (sorted.length === 0) {
      resultsEl.innerHTML =
        '<div class="empty-state">' +
          '<span class="empty-icon">&#x1F4DA;</span>' +
          '<p>No resources match your filters.<br>Try broadening your search or removing some filters.</p>' +
          '<button class="btn-ghost" id="empty-reset-res">Reset all filters</button>' +
        '</div>';
      var emptyBtn = document.getElementById('empty-reset-res');
      if (emptyBtn) emptyBtn.addEventListener('click', resetResources);
      resultCountEl.textContent = '0 resources';
      return;
    }

    var frag = document.createDocumentFragment();
    sorted.forEach(function (res) {
      var card = document.createElement('div');
      card.className = 'cert-card resource-card';

      var levelClass = (res.level || '').toLowerCase();
      var tagBadges = '';
      if (res.tags && res.tags.length) {
        res.tags.slice(0, 3).forEach(function (t) {
          tagBadges += '<span class="badge badge-tag">' + escapeHtml(t) + '</span>';
        });
      }

      var cisspTagsHtml = '';
      if (res.cisspDomains && res.cisspDomains.length) {
        var tagItems = '';
        res.cisspDomains.forEach(function (d) {
          var dom = cisspDomains.find(function (cd) { return cd.id === d; });
          var fullLabel = dom ? dom.name : d;
          var shortLabel = CISSP_SHORT[d] || fullLabel;
          tagItems += '<span class="cissp-tag" title="' + escapeHtml(fullLabel) + '">' + escapeHtml(shortLabel) + '</span>';
        });
        cisspTagsHtml = '<div class="cert-card-cissp">' + tagItems + '</div>';
      }

      card.innerHTML =
        '<div class="cert-card-header">' +
          '<a href="' + escapeHtml(res.url) + '" target="_blank" rel="noopener">' + escapeHtml(res.name) + '</a>' +
          '<span class="cert-vendor">' + escapeHtml(res.provider || '') + '</span>' +
          '<p class="cert-desc">' + escapeHtml(res.description || '') + '</p>' +
        '</div>' +
        '<div class="cert-card-body">' +
          '<span class="badge badge-resource-category">' + escapeHtml(res.category || '') + '</span>' +
          '<span class="badge badge-' + escapeHtml(levelClass) + '">' + escapeHtml(res.level || '') + '</span>' +
          tagBadges +
        '</div>' +
        cisspTagsHtml +
        '<div class="cert-card-footer">' +
        '</div>';

      frag.appendChild(card);
    });

    resultsEl.appendChild(frag);
    resultCountEl.textContent = sorted.length + ' resource' + (sorted.length === 1 ? '' : 's');
  }

  /* ── DEF CON filtering, sorting, rendering ── */

  function filterDefcon() {
    var term = searchTerm.toLowerCase();
    return defconMedia.filter(function (dc) {
      if (term) {
        var nm = dc.name.toLowerCase().indexOf(term) !== -1;
        var ds = dc.description && dc.description.toLowerCase().indexOf(term) !== -1;
        var yr = String(dc.year).indexOf(term) !== -1;
        var tg = dc.tags && dc.tags.some(function (t) { return t.toLowerCase().indexOf(term) !== -1; });
        if (!nm && !ds && !yr && !tg) return false;
      }
      return true;
    });
  }

  function sortDefcon(list, sortValue) {
    var arr = list.slice();
    switch (sortValue) {
      case 'year-asc':
        arr.sort(function (a, b) { return a.year - b.year || a.name.localeCompare(b.name); });
        break;
      case 'name':
        arr.sort(function (a, b) { return a.name.localeCompare(b.name); });
        break;
      case 'year-desc':
      default:
        arr.sort(function (a, b) { return b.year - a.year || a.name.localeCompare(b.name); });
        break;
    }
    return arr;
  }

  function renderDefcon(list) {
    var sorted = sortDefcon(list, sortDefconEl ? sortDefconEl.value : 'year-desc');
    resultsEl.innerHTML = '';

    if (sorted.length === 0) {
      resultsEl.innerHTML =
        '<div class="empty-state">' +
          '<span class="empty-icon">&#x1F399;</span>' +
          '<p>No DEF CON conferences match your search.</p>' +
          '<button class="btn-ghost" id="empty-reset-dc">Reset</button>' +
        '</div>';
      var emptyBtn = document.getElementById('empty-reset-dc');
      if (emptyBtn) emptyBtn.addEventListener('click', resetDefcon);
      resultCountEl.textContent = '0 conferences';
      return;
    }

    var frag = document.createDocumentFragment();
    sorted.forEach(function (dc) {
      var card = document.createElement('div');
      card.className = 'cert-card defcon-card';

      var tagBadges = '';
      if (dc.tags && dc.tags.length) {
        dc.tags.forEach(function (t) {
          tagBadges += '<span class="badge badge-defcon-tag">' + escapeHtml(t) + '</span>';
        });
      }

      card.innerHTML =
        '<div class="cert-card-header">' +
          '<a href="' + escapeHtml(dc.url) + '" target="_blank" rel="noopener">' + escapeHtml(dc.name) + '</a>' +
          '<span class="defcon-year">' + escapeHtml(String(dc.year)) + '</span>' +
          '<p class="cert-desc">' + escapeHtml(dc.description || '') + '</p>' +
        '</div>' +
        '<div class="cert-card-body">' +
          '<div class="defcon-tags">' + tagBadges + '</div>' +
        '</div>';

      frag.appendChild(card);
    });

    resultsEl.appendChild(frag);
    resultCountEl.textContent = sorted.length + ' conference' + (sorted.length === 1 ? '' : 's');
  }

  function resetDefcon() {
    searchInput.value = '';
    searchTerm = '';
    if (sortDefconEl) sortDefconEl.value = 'year-desc';
    runFilterAndRender();
  }

  /* ── Populate resource dropdowns ── */

  function populateResCategoryFilter() {
    if (!filterResCategoryEl) return;
    var cats = [];
    var seen = new Set();
    resources.forEach(function (r) {
      if (r.category && !seen.has(r.category)) {
        seen.add(r.category);
        cats.push(r.category);
      }
    });
    cats.sort();
    filterResCategoryEl.innerHTML = '<option value="">-- All categories --</option>';
    cats.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      filterResCategoryEl.appendChild(opt);
    });
  }

  function populateResProviderFilter() {
    if (!filterResProviderEl) return;
    var providers = [];
    var seen = new Set();
    resources.forEach(function (r) {
      if (r.provider && !seen.has(r.provider)) {
        seen.add(r.provider);
        providers.push(r.provider);
      }
    });
    providers.sort();
    filterResProviderEl.innerHTML = '<option value="">-- All providers --</option>';
    providers.forEach(function (p) {
      var opt = document.createElement('option');
      opt.value = p;
      opt.textContent = p;
      filterResProviderEl.appendChild(opt);
    });
  }

  function populateResCisspFilter() {
    if (!filterResCisspEl) return;
    filterResCisspEl.innerHTML = '<option value="">-- All domains --</option>';
    cisspDomains.forEach(function (d) {
      var opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = d.name;
      filterResCisspEl.appendChild(opt);
    });
  }

  /* ── Career Pathfinder ── */

  function loadPathfinderProgress() {
    try {
      var raw = localStorage.getItem('okurrrr-pathfinder');
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function savePathfinderProgress() {
    try { localStorage.setItem('okurrrr-pathfinder', JSON.stringify(pathfinderProgress)); } catch (e) {}
  }

  function populatePathfinderDropdowns() {
    if (pfNiceRoleEl) {
      pfNiceRoleEl.innerHTML = '<option value="">-- Select a role --</option>';
      niceWorkRoles.forEach(function (r) {
        var opt = document.createElement('option');
        opt.value = r.id;
        opt.textContent = r.name;
        pfNiceRoleEl.appendChild(opt);
      });
    }
    if (pfCisspDomainEl) {
      pfCisspDomainEl.innerHTML = '<option value="">-- Select a domain --</option>';
      cisspDomains.forEach(function (d) {
        var opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = d.name;
        pfCisspDomainEl.appendChild(opt);
      });
    }
  }

  function buildPathfinderChips() {
    if (!pathfinderChipsEl) return;
    pathfinderChipsEl.innerHTML = '';
    careerPaths.forEach(function (p) {
      var chip = document.createElement('button');
      chip.className = 'path-chip';
      chip.type = 'button';
      chip.textContent = p.title;
      chip.dataset.pathId = p.id;
      chip.addEventListener('click', function () { selectCareerPath(p.id); });
      pathfinderChipsEl.appendChild(chip);
    });
  }

  function selectCareerPath(pathId) {
    selectedPath = careerPaths.find(function (p) { return p.id === pathId; }) || null;
    if (pfNiceRoleEl) pfNiceRoleEl.value = '';
    if (pfCisspDomainEl) pfCisspDomainEl.value = '';

    var chips = pathfinderChipsEl.querySelectorAll('.path-chip');
    chips.forEach(function (c) {
      c.classList.toggle('active', c.dataset.pathId === pathId);
    });

    if (buildPathBtn) buildPathBtn.disabled = !selectedPath;
  }

  function selectPathByNiceRole(roleId) {
    if (!roleId) { selectedPath = null; updateBuildBtn(); return; }
    var match = careerPaths.find(function (p) {
      return p.niceRoleIds.indexOf(roleId) !== -1;
    });
    if (match) {
      selectCareerPath(match.id);
    } else {
      selectedPath = null;
      var chips = pathfinderChipsEl.querySelectorAll('.path-chip');
      chips.forEach(function (c) { c.classList.remove('active'); });
      updateBuildBtn();
    }
  }

  function selectPathByCisspDomain(domainId) {
    if (!domainId) { selectedPath = null; updateBuildBtn(); return; }
    var match = careerPaths.find(function (p) {
      return p.cisspDomains.indexOf(domainId) !== -1;
    });
    if (match) {
      selectCareerPath(match.id);
    } else {
      selectedPath = null;
      var chips = pathfinderChipsEl.querySelectorAll('.path-chip');
      chips.forEach(function (c) { c.classList.remove('active'); });
      updateBuildBtn();
    }
  }

  function updateBuildBtn() {
    if (buildPathBtn) buildPathBtn.disabled = !selectedPath;
  }

  function arraysIntersect(a, b) {
    if (!a || !b) return false;
    for (var i = 0; i < a.length; i++) {
      if (b.indexOf(a[i]) !== -1) return true;
    }
    return false;
  }

  function buildPathfinder() {
    if (!selectedPath) return;
    var path = selectedPath;
    pathfinderProgress = loadPathfinderProgress();

    var pathCerts = certs.filter(function (c) {
      return arraysIntersect(c.niceWorkRoleIds, path.niceRoleIds) ||
             arraysIntersect(c.cisspDomains, path.cisspDomains);
    });

    var pathResources = resources.filter(function (r) {
      return arraysIntersect(r.cisspDomains, path.cisspDomains) ||
             (path.resourceCategories.indexOf(r.category) !== -1);
    });

    var pathTools = resources.filter(function (r) {
      return path.toolCategories.indexOf(r.category) !== -1;
    });

    var groupedCerts = groupByLevel(pathCerts);
    var groupedRes = groupByLevel(pathResources);
    var groupedTools = groupByLevel(pathTools);

    renderPathfinderTimeline(path, groupedCerts, groupedRes, groupedTools);
  }

  function groupByLevel(items) {
    var grouped = { Beginner: [], Intermediate: [], Expert: [] };
    items.forEach(function (item) {
      var lvl = item.level || 'Beginner';
      if (grouped[lvl]) grouped[lvl].push(item);
      else grouped.Beginner.push(item);
    });
    grouped.Beginner.sort(function (a, b) { return a.name.localeCompare(b.name); });
    grouped.Intermediate.sort(function (a, b) { return a.name.localeCompare(b.name); });
    grouped.Expert.sort(function (a, b) { return a.name.localeCompare(b.name); });
    return grouped;
  }

  function renderPathfinderTimeline(path, groupedCerts, groupedRes, groupedTools) {
    var el = pathfinderTimelineEl;
    if (!el) return;

    var checked = pathfinderProgress[path.id] || {};
    var totalItems = 0;
    var checkedCount = 0;

    function countItems(grouped, prefix) {
      ['Beginner', 'Intermediate', 'Expert'].forEach(function (lvl) {
        grouped[lvl].forEach(function (item) {
          totalItems++;
          if (checked[prefix + item.id]) checkedCount++;
        });
      });
    }

    countItems(groupedCerts, 'cert-');
    countItems(groupedRes, 'res-');
    countItems(groupedTools, 'tool-');

    var pct = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

    var html = '';

    html += '<div class="pf-timeline-header">' +
      '<div class="pf-timeline-title">Career Pathfinder: <span>' + escapeHtml(path.title) + '</span></div>' +
      '<button type="button" class="pf-change-btn" id="pf-change-btn">&larr; Change Role</button>' +
    '</div>';

    html += '<div class="pf-overall-progress">' +
      '<div class="pf-overall-label"><span>Overall Progress</span><span>' + checkedCount + ' / ' + totalItems + ' milestones (' + pct + '%)</span></div>' +
      '<div class="pf-progress-track"><div class="pf-progress-fill" style="width:' + pct + '%"></div></div>' +
    '</div>';

    html += '<div class="pf-stages">' +
      '<div class="pf-stage"><div class="pf-stage-node beginner">1</div><div class="pf-stage-label">Beginner</div></div>' +
      '<div class="pf-stage-line"></div>' +
      '<div class="pf-stage"><div class="pf-stage-node intermediate">2</div><div class="pf-stage-label">Intermediate</div></div>' +
      '<div class="pf-stage-line"></div>' +
      '<div class="pf-stage"><div class="pf-stage-node expert">3</div><div class="pf-stage-label">Expert</div></div>' +
    '</div>';

    html += renderSwimlaneCerts('Certifications', groupedCerts, 'cert-', checked, path);
    html += renderSwimlaneResources('Free Training', groupedRes, 'res-', checked, path);
    html += renderSwimlaneResources('Tools to Learn', groupedTools, 'tool-', checked, path);
    html += renderSwimlaneLearningPath(path);
    html += renderProgressSummary(path, groupedCerts, groupedRes, groupedTools, checked);

    el.innerHTML = html;
    el.style.display = '';

    el.querySelector('#pf-change-btn').addEventListener('click', resetPathfinder);

    el.querySelectorAll('.pf-check').forEach(function (cb) {
      cb.addEventListener('change', function () {
        handlePathfinderCheck(path.id, cb.dataset.itemKey, cb.checked);
      });
    });

    document.querySelector('.pathfinder-selector').style.display = 'none';
  }

  function renderSwimlaneCerts(title, grouped, prefix, checked, path) {
    var total = grouped.Beginner.length + grouped.Intermediate.length + grouped.Expert.length;
    var html = '<div class="pf-swimlane">' +
      '<div class="pf-swimlane-header">' + escapeHtml(title) + ' <span class="pf-lane-count">(' + total + ')</span></div>' +
      '<div class="pf-swimlane-body">';

    ['Beginner', 'Intermediate', 'Expert'].forEach(function (lvl) {
      html += '<div class="pf-level-col">' +
        '<div class="pf-level-col-header ' + lvl.toLowerCase() + '">' + lvl + '</div>';

      if (grouped[lvl].length === 0) {
        html += '<div class="pf-item-none">None at this level</div>';
      } else {
        grouped[lvl].forEach(function (cert) {
          var key = prefix + cert.id;
          var isChecked = checked[key] ? ' checked' : '';
          var completedClass = checked[key] ? ' completed' : '';
          var displayName = cert.fullName || cert.name;
          var meta = escapeHtml(cert.vendor || '') + (cert.costUsd != null ? ' &middot; ' + escapeHtml(formatCost(cert)) : '');

          html += '<div class="pf-item' + completedClass + '">' +
            '<input type="checkbox" class="pf-check" data-item-key="' + escapeHtml(key) + '"' + isChecked + '>' +
            '<div class="pf-item-info">' +
              '<a class="pf-item-name" href="' + escapeHtml(cert.url) + '" target="_blank" rel="noopener">' + escapeHtml(displayName) + '</a>' +
              '<div class="pf-item-meta">' + meta + '</div>' +
            '</div>' +
          '</div>';
        });
      }

      html += '</div>';
    });

    html += '</div></div>';
    return html;
  }

  function renderSwimlaneResources(title, grouped, prefix, checked, path) {
    var total = grouped.Beginner.length + grouped.Intermediate.length + grouped.Expert.length;
    var html = '<div class="pf-swimlane">' +
      '<div class="pf-swimlane-header">' + escapeHtml(title) + ' <span class="pf-lane-count">(' + total + ')</span></div>' +
      '<div class="pf-swimlane-body">';

    ['Beginner', 'Intermediate', 'Expert'].forEach(function (lvl) {
      html += '<div class="pf-level-col">' +
        '<div class="pf-level-col-header ' + lvl.toLowerCase() + '">' + lvl + '</div>';

      if (grouped[lvl].length === 0) {
        html += '<div class="pf-item-none">None at this level</div>';
      } else {
        grouped[lvl].forEach(function (res) {
          var key = prefix + res.id;
          var isChecked = checked[key] ? ' checked' : '';
          var completedClass = checked[key] ? ' completed' : '';
          var meta = escapeHtml(res.provider || '') + ' &middot; ' + escapeHtml(res.category || '');

          html += '<div class="pf-item' + completedClass + '">' +
            '<input type="checkbox" class="pf-check" data-item-key="' + escapeHtml(key) + '"' + isChecked + '>' +
            '<div class="pf-item-info">' +
              '<a class="pf-item-name" href="' + escapeHtml(res.url) + '" target="_blank" rel="noopener">' + escapeHtml(res.name) + '</a>' +
              '<div class="pf-item-meta">' + meta + '</div>' +
            '</div>' +
          '</div>';
        });
      }

      html += '</div>';
    });

    html += '</div></div>';
    return html;
  }

  function renderSwimlaneLearningPath(path) {
    var html = '<div class="pf-swimlane">' +
      '<div class="pf-swimlane-header">Learning Path</div>' +
      '<div class="pf-swimlane-body">';

    path.phases.forEach(function (phase) {
      var lvlClass = (phase.level || 'Beginner').toLowerCase();
      html += '<div class="pf-level-col">' +
        '<div class="pf-level-col-header ' + lvlClass + '">' + escapeHtml(phase.level) + '</div>' +
        '<div class="pf-phase-card">' +
          '<div class="pf-phase-title">' + escapeHtml(phase.name) + '</div>' +
          '<ul class="pf-phase-skills">';

      phase.skills.forEach(function (skill) {
        html += '<li>' + escapeHtml(skill) + '</li>';
      });

      html += '</ul></div></div>';
    });

    html += '</div></div>';
    return html;
  }

  function renderProgressSummary(path, groupedCerts, groupedRes, groupedTools, checked) {
    function calcPct(grouped, prefix) {
      var total = 0;
      var done = 0;
      ['Beginner', 'Intermediate', 'Expert'].forEach(function (lvl) {
        grouped[lvl].forEach(function (item) {
          total++;
          if (checked[prefix + item.id]) done++;
        });
      });
      return total > 0 ? Math.round((done / total) * 100) : 0;
    }

    function calcLevelPct(level) {
      var total = 0;
      var done = 0;
      [groupedCerts, groupedRes, groupedTools].forEach(function (g) {
        g[level].forEach(function (item) {
          total++;
          var prefix = g === groupedCerts ? 'cert-' : (g === groupedRes ? 'res-' : 'tool-');
          if (checked[prefix + item.id]) done++;
        });
      });
      return total > 0 ? Math.round((done / total) * 100) : 0;
    }

    var certPct = calcPct(groupedCerts, 'cert-');
    var resPct = calcPct(groupedRes, 'res-');
    var toolPct = calcPct(groupedTools, 'tool-');
    var begPct = calcLevelPct('Beginner');
    var intPct = calcLevelPct('Intermediate');
    var expPct = calcLevelPct('Expert');

    var html = '<div class="pf-progress-section"><h4>Milestone Progress</h4>';

    html += progressRow('Beginner Stage', begPct, 'beginner');
    html += progressRow('Intermediate Stage', intPct, 'intermediate');
    html += progressRow('Expert Stage', expPct, 'expert');
    html += progressRow('Certifications', certPct, 'gradient');
    html += progressRow('Free Training', resPct, 'gradient');
    html += progressRow('Tools', toolPct, 'gradient');

    html += '</div>';
    return html;
  }

  function progressRow(label, pct, fillClass) {
    return '<div class="pf-progress-row">' +
      '<span class="pf-progress-row-label">' + escapeHtml(label) + '</span>' +
      '<div class="pf-progress-row-track"><div class="pf-progress-row-fill ' + fillClass + '" style="width:' + pct + '%"></div></div>' +
      '<span class="pf-progress-row-pct">' + pct + '%</span>' +
    '</div>';
  }

  function handlePathfinderCheck(pathId, itemKey, isChecked) {
    if (!pathfinderProgress[pathId]) pathfinderProgress[pathId] = {};
    if (isChecked) {
      pathfinderProgress[pathId][itemKey] = true;
    } else {
      delete pathfinderProgress[pathId][itemKey];
    }
    savePathfinderProgress();

    var item = document.querySelector('.pf-check[data-item-key="' + itemKey + '"]');
    if (item) {
      item.closest('.pf-item').classList.toggle('completed', isChecked);
    }

    updatePathfinderProgressBars();
  }

  function updatePathfinderProgressBars() {
    if (!selectedPath) return;
    var path = selectedPath;
    var checked = pathfinderProgress[path.id] || {};

    var allChecks = pathfinderTimelineEl.querySelectorAll('.pf-check');
    var totalItems = allChecks.length;
    var checkedCount = 0;
    allChecks.forEach(function (cb) { if (cb.checked) checkedCount++; });

    var pct = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

    var overallFill = pathfinderTimelineEl.querySelector('.pf-progress-fill');
    if (overallFill) overallFill.style.width = pct + '%';

    var overallLabel = pathfinderTimelineEl.querySelector('.pf-overall-label');
    if (overallLabel) {
      overallLabel.innerHTML = '<span>Overall Progress</span><span>' + checkedCount + ' / ' + totalItems + ' milestones (' + pct + '%)</span>';
    }

    buildPathfinder();
  }

  function resetPathfinder() {
    selectedPath = null;
    if (pathfinderTimelineEl) pathfinderTimelineEl.style.display = 'none';
    var selector = document.querySelector('.pathfinder-selector');
    if (selector) selector.style.display = '';

    if (pfNiceRoleEl) pfNiceRoleEl.value = '';
    if (pfCisspDomainEl) pfCisspDomainEl.value = '';
    if (buildPathBtn) buildPathBtn.disabled = true;

    var chips = pathfinderChipsEl ? pathfinderChipsEl.querySelectorAll('.path-chip') : [];
    chips.forEach(function (c) { c.classList.remove('active'); });
  }

  /* ── NIST Glossary ── */

  function loadGlossary() {
    if (glossaryLoaded) return Promise.resolve();
    if (glossaryLoadingEl) glossaryLoadingEl.style.display = '';
    if (glossaryListEl) glossaryListEl.innerHTML = '';

    return loadJSON('data/nist-glossary.json').then(function (data) {
      glossaryTerms = data.terms || [];
      glossaryPathMap = {};
      if (data.pathMap) {
        Object.keys(data.pathMap).forEach(function (key) {
          glossaryPathMap[key] = new Set(data.pathMap[key]);
        });
      }
      glossaryLoaded = true;
      if (glossaryLoadingEl) glossaryLoadingEl.style.display = 'none';
      if (tabCountGlossaryEl) tabCountGlossaryEl.textContent = glossaryTerms.length;
      buildGlossaryAlpha();
      populateGlossaryPathFilter();
      filterGlossary();
    }).catch(function (err) {
      if (glossaryLoadingEl) glossaryLoadingEl.style.display = 'none';
      if (glossaryListEl) {
        glossaryListEl.innerHTML =
          '<div class="glossary-empty">' +
            '<span class="empty-icon">&#x26A0;</span>' +
            '<p>Could not load glossary data.<br>' + escapeHtml(err.message) + '</p>' +
          '</div>';
      }
    });
  }

  function populateGlossaryPathFilter() {
    if (!glossaryPathFilterEl) return;
    glossaryPathFilterEl.innerHTML = '<option value="">All Paths</option>';
    careerPaths.forEach(function (cp) {
      var opt = document.createElement('option');
      opt.value = cp.id;
      var count = glossaryPathMap[cp.id] ? glossaryPathMap[cp.id].size : 0;
      opt.textContent = cp.title + ' (' + count + ')';
      glossaryPathFilterEl.appendChild(opt);
    });
  }

  function buildGlossaryAlpha() {
    if (!glossaryAlphaEl) return;
    var letters = ['All', '#', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var frag = document.createDocumentFragment();
    letters.forEach(function (l) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'glossary-alpha-btn' + (l === glossaryLetter ? ' active' : '');
      btn.dataset.letter = l;
      btn.textContent = l;
      frag.appendChild(btn);
    });
    glossaryAlphaEl.innerHTML = '';
    glossaryAlphaEl.appendChild(frag);
  }

  function filterGlossary() {
    if (!glossaryTerms) return;
    var term = glossarySearchTerm.toLowerCase();
    var pathSet = (glossaryPathFilter && glossaryPathMap[glossaryPathFilter]) ? glossaryPathMap[glossaryPathFilter] : null;

    filteredGlossary = glossaryTerms.filter(function (t) {
      if (glossaryLetter !== 'All' && t.letter !== glossaryLetter) return false;
      if (glossarySource !== 'all' && t.src !== glossarySource) return false;
      if (pathSet && !pathSet.has(t.id)) return false;
      if (term) {
        var nameMatch = t.term.toLowerCase().indexOf(term) !== -1;
        if (!nameMatch) {
          var defMatch = false;
          for (var i = 0; i < t.defs.length; i++) {
            if (t.defs[i].t.toLowerCase().indexOf(term) !== -1) { defMatch = true; break; }
          }
          if (!defMatch) return false;
        }
      }
      return true;
    });

    glossaryPage = 1;
    renderGlossary();
  }

  function renderGlossary() {
    if (!glossaryListEl) return;
    var total = filteredGlossary.length;
    var limit = glossaryPage * GLOSSARY_PAGE_SIZE;
    var visible = filteredGlossary.slice(0, limit);

    if (glossaryCountEl) {
      glossaryCountEl.textContent = total + ' term' + (total === 1 ? '' : 's') +
        (glossarySearchTerm ? ' matching "' + glossarySearchTerm + '"' : '') +
        (glossaryPathFilter ? ' for ' + (careerPaths.find(function(p){return p.id===glossaryPathFilter})||{}).title : '');
    }

    if (visible.length === 0) {
      glossaryListEl.innerHTML =
        '<div class="glossary-empty">' +
          '<span class="empty-icon">&#x1F50D;</span>' +
          '<p>No terms match your filters.<br>Try broadening your search or changing filters.</p>' +
        '</div>';
      return;
    }

    var frag = document.createDocumentFragment();
    visible.forEach(function (t) {
      var card = document.createElement('div');
      card.className = 'glossary-term-card';

      var srcClass = t.src === 'CSRC' ? 'src-csrc' : (t.src === 'AI' ? 'src-ai' : 'src-both');
      var srcLabel = t.src === 'CSRC' ? 'NIST CSRC' : (t.src === 'AI' ? 'AI RMF' : 'CSRC + AI');

      var html = '<div class="glossary-term-header">';
      if (t.link) {
        html += '<a class="glossary-term-name" href="' + escapeHtml(t.link) + '" target="_blank" rel="noopener">' + escapeHtml(t.term) + '</a>';
      } else {
        html += '<span class="glossary-term-name">' + escapeHtml(t.term) + '</span>';
      }
      html += '<span class="glossary-term-source ' + srcClass + '">' + srcLabel + '</span>';
      html += '</div>';

      if (t.defs.length > 0) {
        html += '<div class="glossary-term-def">' + escapeHtml(t.defs[0].t) + '</div>';
        if (t.defs[0].c) {
          html += '<div class="glossary-term-cite">' + escapeHtml(t.defs[0].c) + '</div>';
        }
      }

      if (t.defs.length > 1) {
        var extraId = 'gex-' + t.id;
        html += '<div class="glossary-extra-defs" id="' + extraId + '">';
        for (var i = 1; i < t.defs.length; i++) {
          html += '<div class="glossary-term-def">' + escapeHtml(t.defs[i].t) + '</div>';
          if (t.defs[i].c) {
            html += '<div class="glossary-term-cite">' + escapeHtml(t.defs[i].c) + '</div>';
          }
        }
        html += '</div>';
        html += '<button type="button" class="glossary-show-more-btn" data-target="' + extraId + '">Show ' + (t.defs.length - 1) + ' more definition' + (t.defs.length - 1 === 1 ? '' : 's') + '</button>';
      }

      card.innerHTML = html;
      frag.appendChild(card);
    });

    if (limit < total) {
      var loadMoreDiv = document.createElement('div');
      loadMoreDiv.className = 'glossary-load-more';
      loadMoreDiv.innerHTML = '<button type="button" class="glossary-load-more-btn">Load more (' + (total - limit) + ' remaining)</button>';
      frag.appendChild(loadMoreDiv);
    }

    glossaryListEl.innerHTML = '';
    glossaryListEl.appendChild(frag);
  }

  /* ── CWE Database ── */

  function loadCWE() {
    if (cweLoaded) return Promise.resolve();
    if (cweLoadingEl) cweLoadingEl.style.display = '';
    if (cweListEl) cweListEl.innerHTML = '';

    return loadJSON('data/cwe-data.json').then(function (data) {
      cweData = data.weaknesses || [];
      cweLoaded = true;
      if (cweLoadingEl) cweLoadingEl.style.display = 'none';
      if (tabCountCweEl) tabCountCweEl.textContent = cweData.length;
      if (cweVersionBadgeEl) {
        cweVersionBadgeEl.textContent = 'v' + (data.version || '') + ' (' + (data.date || '') + ')';
      }
      if (statCweEl) statCweEl.textContent = cweData.length;
      filterCWE();
    }).catch(function (err) {
      if (cweLoadingEl) cweLoadingEl.style.display = 'none';
      if (cweListEl) {
        cweListEl.innerHTML =
          '<div class="cwe-empty">' +
            '<span class="empty-icon">&#x26A0;</span>' +
            '<p>Could not load CWE data.<br>' + escapeHtml(err.message) + '</p>' +
          '</div>';
      }
    });
  }

  function filterCWE() {
    if (!cweData) return;
    var term = cweSearchTerm.toLowerCase();
    var abstraction = cweFilterAbstractionEl ? cweFilterAbstractionEl.value : '';
    var status = cweFilterStatusEl ? cweFilterStatusEl.value : '';
    var likelihood = cweFilterLikelihoodEl ? cweFilterLikelihoodEl.value : '';

    filteredCwe = cweData.filter(function (w) {
      if (abstraction && w.abstraction !== abstraction) return false;
      if (status && w.status !== status) return false;
      if (likelihood && w.likelihood !== likelihood) return false;
      if (term) {
        var idMatch = ('cwe-' + w.id).indexOf(term) !== -1 || w.id === term;
        var nameMatch = w.name.toLowerCase().indexOf(term) !== -1;
        var descMatch = w.description.toLowerCase().indexOf(term) !== -1;
        if (!idMatch && !nameMatch && !descMatch) return false;
      }
      return true;
    });

    cwePage = 1;
    renderCWE();
  }

  function cweAbstractionClass(abstraction) {
    var map = { Pillar: 'cwe-abs-pillar', Class: 'cwe-abs-class', Base: 'cwe-abs-base', Variant: 'cwe-abs-variant', Compound: 'cwe-abs-compound' };
    return map[abstraction] || 'cwe-abs-base';
  }

  function renderCWE() {
    if (!cweListEl) return;
    var total = filteredCwe.length;
    var limit = cwePage * CWE_PAGE_SIZE;
    var visible = filteredCwe.slice(0, limit);

    if (cweCountEl) {
      cweCountEl.textContent = total + ' weakness' + (total === 1 ? '' : 'es') +
        (cweSearchTerm ? ' matching "' + cweSearchTerm + '"' : '');
    }

    if (visible.length === 0) {
      cweListEl.innerHTML =
        '<div class="cwe-empty">' +
          '<span class="empty-icon">&#x1F50D;</span>' +
          '<p>No weaknesses match your filters.<br>Try broadening your search or changing filters.</p>' +
        '</div>';
      return;
    }

    var frag = document.createDocumentFragment();
    visible.forEach(function (w) {
      var card = document.createElement('div');
      card.className = 'cwe-card';

      var html = '<div class="cwe-card-header">';
      html += '<a class="cwe-card-id" href="https://cwe.mitre.org/data/definitions/' + escapeHtml(w.id) + '.html" target="_blank" rel="noopener">CWE-' + escapeHtml(w.id) + '</a>';
      html += '<div class="cwe-card-badges">';
      html += '<span class="cwe-abstraction-badge ' + cweAbstractionClass(w.abstraction) + '">' + escapeHtml(w.abstraction) + '</span>';
      if (w.status && w.status !== 'Stable') {
        html += '<span class="cwe-status-badge cwe-status-' + w.status.toLowerCase() + '">' + escapeHtml(w.status) + '</span>';
      }
      if (w.likelihood) {
        html += '<span class="cwe-likelihood-badge cwe-likelihood-' + w.likelihood.toLowerCase() + '">' + escapeHtml(w.likelihood) + ' Likelihood</span>';
      }
      html += '</div>';
      html += '</div>';

      html += '<h4 class="cwe-card-name">' + escapeHtml(w.name) + '</h4>';

      if (w.description) {
        var desc = w.description;
        var truncated = desc.length > 280;
        var descId = 'cwe-desc-' + w.id;
        html += '<p class="cwe-card-desc" id="' + descId + '">';
        html += truncated ? escapeHtml(desc.substring(0, 280)) + '...' : escapeHtml(desc);
        html += '</p>';
        if (truncated) {
          html += '<button type="button" class="cwe-expand-btn" data-full="' + escapeHtml(desc) + '" data-target="' + descId + '">Show more</button>';
        }
      }

      var metaItems = [];
      if (w.platforms && w.platforms.length > 0) {
        metaItems.push('<span class="cwe-meta-item" title="Applicable Platforms">&#x1F4BB; ' + escapeHtml(w.platforms.slice(0, 4).join(', ')) + (w.platforms.length > 4 ? ' +' + (w.platforms.length - 4) : '') + '</span>');
      }
      if (w.consequences && w.consequences.length > 0) {
        var scopes = [];
        w.consequences.forEach(function (c) { if (scopes.indexOf(c.scope) === -1) scopes.push(c.scope); });
        metaItems.push('<span class="cwe-meta-item" title="Impact Scopes">&#x26A1; ' + escapeHtml(scopes.slice(0, 3).join(', ')) + (scopes.length > 3 ? ' +' + (scopes.length - 3) : '') + '</span>');
      }
      if (w.mitigationCount > 0) {
        metaItems.push('<span class="cwe-meta-item" title="Mitigations">&#x1F6E1; ' + w.mitigationCount + ' mitigation' + (w.mitigationCount === 1 ? '' : 's') + '</span>');
      }
      if (w.capecIds && w.capecIds.length > 0) {
        metaItems.push('<span class="cwe-meta-item" title="Related Attack Patterns (CAPEC)">&#x1F3AF; ' + w.capecIds.length + ' CAPEC</span>');
      }
      if (w.cveExamples && w.cveExamples.length > 0) {
        metaItems.push('<span class="cwe-meta-item" title="CVE Examples">&#x1F41B; ' + w.cveExamples.length + ' CVE' + (w.cveExamples.length === 1 ? '' : 's') + '</span>');
      }
      if (w.owasp && w.owasp.length > 0) {
        metaItems.push('<span class="cwe-meta-item cwe-meta-owasp" title="OWASP Mapping">OWASP</span>');
      }
      if (metaItems.length > 0) {
        html += '<div class="cwe-card-meta">' + metaItems.join('') + '</div>';
      }

      card.innerHTML = html;
      frag.appendChild(card);
    });

    if (limit < total) {
      var loadMoreDiv = document.createElement('div');
      loadMoreDiv.className = 'cwe-load-more';
      loadMoreDiv.innerHTML = '<button type="button" class="cwe-load-more-btn">Load more (' + (total - limit) + ' remaining)</button>';
      frag.appendChild(loadMoreDiv);
    }

    cweListEl.innerHTML = '';
    cweListEl.appendChild(frag);
  }

  /* ── Tab switching ── */

  function switchTab(tab) {
    activeTab = tab;
    var tabBtns = document.querySelectorAll('.tab-bar .tab');
    tabBtns.forEach(function (btn) {
      var isActive = btn.dataset.tab === tab;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    controlsCertsEl.style.display = 'none';
    controlsResEl.style.display = 'none';
    if (controlsDefconEl) controlsDefconEl.style.display = 'none';
    if (pathfinderPanelEl) pathfinderPanelEl.style.display = 'none';
    if (glossaryPanelEl) glossaryPanelEl.style.display = 'none';
    if (cwePanelEl) cwePanelEl.style.display = 'none';
    chipSectionEl.style.display = 'none';

    var searchBarEl = document.querySelector('.search-bar');
    var activeFiltersBar = document.getElementById('active-filters');
    var resultCountLine = document.getElementById('result-count');

    if (tab === 'certs') {
      controlsCertsEl.style.display = '';
      chipSectionEl.style.display = '';
      searchInput.placeholder = 'Search by name, vendor, or keyword...';
      if (searchBarEl) searchBarEl.style.display = '';
      if (activeFiltersBar) activeFiltersBar.style.display = '';
      if (resultCountLine) resultCountLine.style.display = '';
      resultsEl.style.display = '';
    } else if (tab === 'resources') {
      controlsResEl.style.display = '';
      searchInput.placeholder = 'Search by name, provider, or keyword...';
      if (searchBarEl) searchBarEl.style.display = '';
      if (activeFiltersBar) activeFiltersBar.style.display = '';
      if (resultCountLine) resultCountLine.style.display = '';
      resultsEl.style.display = '';
    } else if (tab === 'defcon') {
      if (controlsDefconEl) controlsDefconEl.style.display = '';
      searchInput.placeholder = 'Search DEF CON conferences...';
      if (searchBarEl) searchBarEl.style.display = '';
      if (activeFiltersBar) activeFiltersBar.style.display = '';
      if (resultCountLine) resultCountLine.style.display = '';
      resultsEl.style.display = '';
    } else if (tab === 'pathfinder') {
      if (pathfinderPanelEl) pathfinderPanelEl.style.display = '';
      if (searchBarEl) searchBarEl.style.display = 'none';
      if (activeFiltersBar) activeFiltersBar.style.display = 'none';
      if (resultCountLine) resultCountLine.style.display = 'none';
      resultsEl.style.display = 'none';
    } else if (tab === 'glossary') {
      if (glossaryPanelEl) glossaryPanelEl.style.display = '';
      if (searchBarEl) searchBarEl.style.display = 'none';
      if (activeFiltersBar) activeFiltersBar.style.display = 'none';
      if (resultCountLine) resultCountLine.style.display = 'none';
      resultsEl.style.display = 'none';
      if (!glossaryLoaded) loadGlossary();
    } else if (tab === 'cwe') {
      if (cwePanelEl) cwePanelEl.style.display = '';
      if (searchBarEl) searchBarEl.style.display = 'none';
      if (activeFiltersBar) activeFiltersBar.style.display = 'none';
      if (resultCountLine) resultCountLine.style.display = 'none';
      resultsEl.style.display = 'none';
      if (!cweLoaded) loadCWE();
    }

    searchInput.value = '';
    searchTerm = '';
    if (tab !== 'pathfinder' && tab !== 'glossary' && tab !== 'cwe') runFilterAndRender();
  }

  /* ── Hero stats ── */

  function updateStats() {
    statCertsEl.textContent = certs.length;
    var cats = new Set();
    niceWorkRoles.forEach(function (r) { cats.add(r.categoryId); });
    statCategoriesEl.textContent = cats.size;
    statRolesEl.textContent = niceWorkRoles.length;
    if (statFreeEl) {
      statFreeEl.textContent = resources.length;
    }
    if (tabCountCertsEl) tabCountCertsEl.textContent = certs.length;
    if (tabCountResEl) tabCountResEl.textContent = resources.length;
    if (tabCountDefconEl) tabCountDefconEl.textContent = defconMedia.length;
    if (tabCountPathfinderEl) tabCountPathfinderEl.textContent = careerPaths.length;
    if (tabCountGlossaryEl) tabCountGlossaryEl.textContent = glossaryLoaded ? glossaryTerms.length : '--';
    if (tabCountCweEl) tabCountCweEl.textContent = cweLoaded ? cweData.length : '--';
    if (statCweEl) statCweEl.textContent = cweLoaded ? cweData.length : '--';
  }

  /* ── Master filter + render ── */

  function runFilterAndRender() {
    if (activeTab === 'certs') {
      selectedCategoryId = filterCategoryEl.value || '';
      var filtered = filterCerts();
      renderCerts(filtered);
      renderActiveFilters();
    } else if (activeTab === 'resources') {
      var filteredRes = filterResources();
      renderResources(filteredRes);
      renderActiveFiltersResources();
    } else if (activeTab === 'defcon') {
      var filteredDc = filterDefcon();
      renderDefcon(filteredDc);
      renderActiveFiltersDefcon();
    } else if (activeTab === 'pathfinder') {
      activeFiltersEl.innerHTML = '';
    } else if (activeTab === 'glossary') {
      activeFiltersEl.innerHTML = '';
    } else if (activeTab === 'cwe') {
      activeFiltersEl.innerHTML = '';
    }
  }

  /* ── Active filters for resources ── */

  function renderActiveFiltersResources() {
    var chips = [];
    if (searchTerm) {
      chips.push({ label: 'Search: ' + searchTerm, clear: function () { searchInput.value = ''; searchTerm = ''; } });
    }
    if (filterResCategoryEl && filterResCategoryEl.value) {
      var v = filterResCategoryEl.value;
      chips.push({ label: 'Category: ' + v, clear: function () { filterResCategoryEl.value = ''; } });
    }
    if (filterResProviderEl && filterResProviderEl.value) {
      var p = filterResProviderEl.value;
      chips.push({ label: 'Provider: ' + p, clear: function () { filterResProviderEl.value = ''; } });
    }
    if (filterResLevelEl && filterResLevelEl.value) {
      var l = filterResLevelEl.value;
      chips.push({ label: 'Level: ' + l, clear: function () { filterResLevelEl.value = ''; } });
    }
    if (filterResCisspEl && filterResCisspEl.value) {
      var cv = filterResCisspEl.value;
      var domObj = cisspDomains.find(function (d) { return d.id === cv; });
      var domLabel = domObj ? domObj.name : cv;
      chips.push({ label: 'CISSP: ' + domLabel, clear: function () { filterResCisspEl.value = ''; } });
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
      clearAll.addEventListener('click', resetResources);
      activeFiltersEl.appendChild(clearAll);
    }
  }

  /* ── Active filters for DEF CON ── */

  function renderActiveFiltersDefcon() {
    var chips = [];
    if (searchTerm) {
      chips.push({ label: 'Search: ' + searchTerm, clear: function () { searchInput.value = ''; searchTerm = ''; } });
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

  function resetResources() {
    searchInput.value = '';
    searchTerm = '';
    if (filterResCategoryEl) filterResCategoryEl.value = '';
    if (filterResProviderEl) filterResProviderEl.value = '';
    if (filterResLevelEl) filterResLevelEl.value = '';
    if (filterResCisspEl) filterResCisspEl.value = '';
    if (sortResEl) sortResEl.value = 'name';
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

  if (filterResCategoryEl) filterResCategoryEl.addEventListener('change', runFilterAndRender);
  if (filterResProviderEl) filterResProviderEl.addEventListener('change', runFilterAndRender);
  if (filterResLevelEl) filterResLevelEl.addEventListener('change', runFilterAndRender);
  if (filterResCisspEl) filterResCisspEl.addEventListener('change', runFilterAndRender);
  if (sortResEl) sortResEl.addEventListener('change', runFilterAndRender);
  if (resetResBtn) resetResBtn.addEventListener('click', resetResources);
  if (sortDefconEl) sortDefconEl.addEventListener('change', runFilterAndRender);
  if (resetDefconBtn) resetDefconBtn.addEventListener('click', resetDefcon);

  var tabBtns = document.querySelectorAll('.tab-bar .tab');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { switchTab(btn.dataset.tab); });
  });

  if (pfNiceRoleEl) pfNiceRoleEl.addEventListener('change', function () {
    selectPathByNiceRole(pfNiceRoleEl.value);
  });
  if (pfCisspDomainEl) pfCisspDomainEl.addEventListener('change', function () {
    selectPathByCisspDomain(pfCisspDomainEl.value);
  });
  if (buildPathBtn) buildPathBtn.addEventListener('click', buildPathfinder);

  if (glossarySearchInput) {
    glossarySearchInput.addEventListener('input', function () {
      clearTimeout(glossaryDebounceTimer);
      glossaryDebounceTimer = setTimeout(function () {
        glossarySearchTerm = glossarySearchInput.value.trim();
        filterGlossary();
      }, 250);
    });
  }

  if (glossaryAlphaEl) {
    glossaryAlphaEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.glossary-alpha-btn');
      if (!btn) return;
      glossaryLetter = btn.dataset.letter;
      glossaryAlphaEl.querySelectorAll('.glossary-alpha-btn').forEach(function (b) {
        b.classList.toggle('active', b.dataset.letter === glossaryLetter);
      });
      filterGlossary();
    });
  }

  if (glossarySourceFilterEl) {
    glossarySourceFilterEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.glossary-src-btn');
      if (!btn) return;
      glossarySource = btn.dataset.source;
      glossarySourceFilterEl.querySelectorAll('.glossary-src-btn').forEach(function (b) {
        b.classList.toggle('active', b.dataset.source === glossarySource);
      });
      filterGlossary();
    });
  }

  if (glossaryPathFilterEl) {
    glossaryPathFilterEl.addEventListener('change', function () {
      glossaryPathFilter = glossaryPathFilterEl.value;
      filterGlossary();
    });
  }

  if (glossaryListEl) {
    glossaryListEl.addEventListener('click', function (e) {
      var loadMoreBtn = e.target.closest('.glossary-load-more-btn');
      if (loadMoreBtn) {
        glossaryPage++;
        renderGlossary();
        return;
      }
      var showMoreBtn = e.target.closest('.glossary-show-more-btn');
      if (showMoreBtn) {
        var targetId = showMoreBtn.dataset.target;
        var extraDefs = document.getElementById(targetId);
        if (extraDefs) {
          var isOpen = extraDefs.classList.toggle('open');
          showMoreBtn.textContent = isOpen ? 'Show fewer definitions' : showMoreBtn.textContent;
          if (!isOpen) {
            var count = extraDefs.querySelectorAll('.glossary-term-def').length;
            showMoreBtn.textContent = 'Show ' + count + ' more definition' + (count === 1 ? '' : 's');
          }
        }
        return;
      }
    });
  }

  if (cweSearchInput) {
    cweSearchInput.addEventListener('input', function () {
      clearTimeout(cweDebounceTimer);
      cweDebounceTimer = setTimeout(function () {
        cweSearchTerm = cweSearchInput.value.trim();
        filterCWE();
      }, 250);
    });
  }

  if (cweFilterAbstractionEl) cweFilterAbstractionEl.addEventListener('change', filterCWE);
  if (cweFilterStatusEl) cweFilterStatusEl.addEventListener('change', filterCWE);
  if (cweFilterLikelihoodEl) cweFilterLikelihoodEl.addEventListener('change', filterCWE);

  if (cweListEl) {
    cweListEl.addEventListener('click', function (e) {
      var loadMoreBtn = e.target.closest('.cwe-load-more-btn');
      if (loadMoreBtn) {
        cwePage++;
        renderCWE();
        return;
      }
      var expandBtn = e.target.closest('.cwe-expand-btn');
      if (expandBtn) {
        var targetId = expandBtn.dataset.target;
        var descEl = document.getElementById(targetId);
        if (descEl) {
          var isExpanded = expandBtn.classList.toggle('expanded');
          if (isExpanded) {
            descEl.textContent = expandBtn.dataset.full;
            expandBtn.textContent = 'Show less';
          } else {
            descEl.textContent = expandBtn.dataset.full.substring(0, 280) + '...';
            expandBtn.textContent = 'Show more';
          }
        }
        return;
      }
    });
  }

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
    loadJSON('data/cissp-domains.json'),
    loadJSON('data/free-resources.json'),
    loadJSON('data/defcon-media.json'),
    loadJSON('data/career-paths.json')
  ]).then(function (results) {
    certs = results[0] || [];
    niceWorkRoles = results[1] || [];
    cisspDomains = results[2] || [];
    resources = results[3] || [];
    defconMedia = results[4] || [];
    careerPaths = results[5] || [];
    populateCategoryFilter();
    populateVendorFilter();
    populateRegionFilter();
    populateCisspFilter();
    populateResCategoryFilter();
    populateResProviderFilter();
    populateResCisspFilter();
    buildChipPanel();
    populatePathfinderDropdowns();
    buildPathfinderChips();
    pathfinderProgress = loadPathfinderProgress();
    updateStats();
    runFilterAndRender();
  }).catch(function (err) {
    resultCountEl.textContent = 'Failed to load data: ' + err.message;
    resultsEl.innerHTML =
      '<div class="empty-state">' +
        '<span class="empty-icon">&#x26A0;</span>' +
        '<p>Could not load data.<br>Ensure all data files exist and are served from the same origin.</p>' +
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
                value: 130,
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
                mode: 'destroy'
              },
              destroy: {
                mode: 'split',
                split: {
                  count: 2,
                  factor: { value: { min: 2, max: 4 } },
                  rate: { value: { min: 2, max: 3 } },
                  particles: {
                    collisions: { enable: false },
                    destroy: { mode: 'none' },
                    life: {
                      count: 1,
                      duration: { value: { min: 1, max: 3 } }
                    },
                    opacity: {
                      value: { min: 0.3, max: 0.8 },
                      animation: { enable: true, speed: 2, startValue: 'max', destroy: 'min', sync: false }
                    },
                    move: {
                      speed: { min: 3, max: 6 },
                      outModes: { default: 'out' },
                      random: true,
                      straight: false
                    }
                  }
                }
              },
              links: {
                enable: true,
                distance: 220,
                color: { value: ['#ff2d7b', '#ff5a9d', '#00e5c7', '#33f0d6', '#f5a623', '#58a6ff', '#a78bfa', '#ff6b6b', '#e2e8f4'] },
                opacity: 0.85,
                width: 0.8
              },
              move: {
                enable: true,
                speed: 1.8,
                direction: 'none',
                outModes: { default: 'bounce' },
                attract: { enable: true, rotate: { x: 600, y: 600 } },
                random: true
              }
            },
            interactivity: {
              detectsOn: 'canvas',
              events: {
                onHover: { enable: true, mode: ['grab', 'attract'] },
                onClick: { enable: true, mode: ['push', 'repulse'] }
              },
              modes: {
                grab: { distance: 250, links: { opacity: 1.0, color: '#a78bfa' } },
                attract: { distance: 200, duration: 0.4, speed: 1 },
                repulse: { distance: 200, duration: 0.8, speed: 1 },
                push: { quantity: 4 }
              }
            },
            detectRetina: true
          }
        });

        return tsParticles.load({
          id: 'tsparticles-stars',
          options: {
            fullScreen: { enable: false },
            fpsLimit: 120,
            particles: {
              number: { value: 4, density: { enable: false } },
              color: { value: ['#e2e8f4', '#58a6ff', '#ff5a9d', '#00e5c7', '#f5a623'] },
              shape: { type: 'circle' },
              opacity: {
                value: { min: 0.5, max: 1.0 },
                animation: { enable: true, speed: 2, startValue: 'max', sync: false }
              },
              size: {
                value: { min: 1, max: 2.5 },
                animation: { enable: false }
              },
              links: { enable: false },
              move: {
                enable: true,
                speed: { min: 20, max: 40 },
                direction: 'bottom-left',
                outModes: { default: 'out' },
                straight: true,
                trail: {
                  enable: true,
                  length: 15,
                  fill: { color: '#0b0e1a' }
                }
              }
            },
            interactivity: { detectsOn: 'canvas', events: {} },
            detectRetina: true
          }
        });
      });
    })();
  }
})();
