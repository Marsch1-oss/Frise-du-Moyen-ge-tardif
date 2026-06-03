/* frise.js — Frise chronologique medievale 1300-1500 */

var ZONES = [
  'France', 'Angleterre', 'St Empire',
  'Naples', 'Italie', 'Castille', 'Aragon', 'Portugal', 'Papaute', 'Alsace',
  'Scandinavie', 'Pologne', 'Russie',
  'Hongrie', 'Europe C. & Or.', 'Byzance', 'Ottomans',
  'Monde islamique', 'Orient', 'Japon', 'Chine', 'Inde',
  'Afrique', 'Amerique', 'Monde',
  'Art', 'Techniques', 'Sciences', 'Idees', 'Litterature', 'Atlas'
];

var ZONES_GROUPS = {
  'Europe occidentale': ['France', 'Angleterre', 'St Empire', 'Naples', 'Italie', 'Castille', 'Aragon', 'Portugal', 'Papaute', 'Alsace'],
  'Europe du Nord':     ['Scandinavie'],
  'Europe orientale':   ['Pologne', 'Russie', 'Hongrie', 'Europe C. & Or.', 'Byzance', 'Ottomans'],
  'Asie & Islam':       ['Monde islamique', 'Orient', 'Japon', 'Chine', 'Inde'],
  'Afrique & Amérique': ['Afrique', 'Amerique'],
  'Monde':              ['Monde'],
  'Thèmes':             ['Art', 'Techniques', 'Sciences', 'Idees', 'Litterature', 'Atlas']
}

var COLORS = {
  'France':              { bg: '#8B1A1A', light: '#F5E6E6', text: '#5C0F0F' },
  'Angleterre':          { bg: '#1A4A6B', light: '#E6EFF5', text: '#0F2E45' },
  'St Empire':           { bg: '#6B4A10', light: '#F5EDE0', text: '#3A2508' },
  'Papaute':             { bg: '#7A1A1A', light: '#F5E0E0', text: '#4A0808' },
  'Naples':              { bg: '#1A5C4A', light: '#E0F5EE', text: '#0A3028' },
  'Italie':              { bg: '#1A6B3C', light: '#E6F5ED', text: '#0F3D24' },
  'Castille':            { bg: '#8B6B10', light: '#F5EDD8', text: '#5C4408' },
  'Aragon':              { bg: '#6B2A10', light: '#F5E8E0', text: '#3A1508' },
  'Portugal':            { bg: '#3A6B10', light: '#EAF5E0', text: '#1E3A08' },
  'Hongrie':             { bg: '#8B3A1A', light: '#F5E8E0', text: '#5C2008' },
  'Europe C. & Or.':     { bg: '#2A5C5C', light: '#E0F2F2', text: '#173A3A' },
  'Pologne':             { bg: '#8B1A4A', light: '#F5E0EC', text: '#5C0A2E' },
  'Russie':              { bg: '#5C1A1A', light: '#F0E0E0', text: '#3A0A0A' },
  'Byzance':             { bg: '#6B1A6B', light: '#F5E6F5', text: '#3A0A3A' },
  'Ottomans':            { bg: '#8B1A3A', light: '#F5E0E8', text: '#5C0A22' },
  'Monde islamique':     { bg: '#8B6B10', light: '#F5EDD8', text: '#5C4408' },
  'Orient':              { bg: '#5C2A10', light: '#F5E8E0', text: '#3A1A08' },
  'Japon':               { bg: '#8B1A1A', light: '#F5E6E6', text: '#5C0F0F' },
  'Chine':               { bg: '#8B3A10', light: '#F5EAE0', text: '#5C2008' },
  'Inde':                { bg: '#6B5A10', light: '#F5F0D8', text: '#3A3008' },
  'Monde':               { bg: '#3A3A3A', light: '#EBEBEB', text: '#1C1C1C' },
  'Alsace':              { bg: '#7A3B69', light: '#F3E8F1', text: '#4A1A42' },
  'Art':                 { bg: '#A0522D', light: '#F5EDE6', text: '#5C2E18' },
  'Techniques':          { bg: '#2F5233', light: '#E6F0E7', text: '#1A2E1C' },
  'Sciences':            { bg: '#1A4A5C', light: '#E0EEF5', text: '#0A2A3A' },
  'Idees':               { bg: '#1A3A6B', light: '#E0E8F5', text: '#0A1E3A' },
  'Litterature':         { bg: '#2A5C2A', light: '#E0F0E0', text: '#163316' },
  'Scandinavie':         { bg: '#2A4A6B', light: '#DCE8F5', text: '#162B40' },
  'Afrique':             { bg: '#7A4A10', light: '#F5EAD8', text: '#4A2A08' },
  'Amerique':            { bg: '#2A6B4A', light: '#D8F0E8', text: '#163A28' },
  'Atlas':               { bg: '#1A5C7A', light: '#D8EEF5', text: '#0A2E40' }
};

var ZONE_ALIASES = {
  'Empire':              'St Empire',
  'St_Empire':           'St Empire',
  'Iberique':            'Castille',
  'Ibérique':            'Castille',
  'Pen. iberique':       'Castille',
  'Pen. ibérique':       'Castille',
  'Pén. ibérique':       'Castille',
  'Péninsule ibérique':  'Castille',
  'Papaute':             'Papaute',
  'Papauté':             'Papaute',
  'Hongrie':             'Hongrie',
  'Naples':              'Naples',
  'Alsace':              'Alsace',
  'Castille':            'Castille',
  'Aragon':              'Aragon',
  'Portugal':            'Portugal',
  'Techniques et idees': 'Techniques',
  'Art':                 'Art',
  'Idees':               'Idees',
  'Idées':               'Idees',
  'Littérature':         'Litterature',
  'Literature':          'Litterature',
  'Amérique':            'Amerique',
  'America':             'Amerique',
  'Africa':              'Afrique',
  'Cartes':              'Atlas',
  'Maps':                'Atlas'
};

var ROW_H    = 32;
var ROW_GAP  = 5;
var CHIP_PAD = 6;
var TRACK_PX = 860;

var currentLevel   = 1;
var currentYear    = null;
var searchTerm     = '';
var currentCentury = null;
var currentDecade  = null;
var allEvents      = [];
var activeZones    = null;
var detailLevel    = 1;  /* 1=Essentiel, 2=Détaillé, 3=Complet */
var matchedIds     = []; /* ids des événements correspondants, ordonnés par date */
var currentMatchIdx = -1; /* index courant dans matchedIds */

function initActiveZones() {
  activeZones = {};
  for (var i = 0; i < ZONES.length; i++) activeZones[ZONES[i]] = false;
  /* Aucune zone active par défaut — l'utilisateur choisit dans le wizard */
}

function normalizeZone(z) {
  return ZONE_ALIASES[z] || z;
}

function visibleAtLevel(evt, level) {
  /* Types : 1=Règne  2=Siècle  3=Important  4=Détaillé  5=Complet
     Les règnes (type 1) sont affichés via buildRulersSection, exclus ici */
  var t = (evt.type === undefined || evt.type === null || evt.type === '')
        ? 2 : parseInt(evt.type, 10);
  if (isNaN(t) || t < 1) t = 2;

  /* Vue ensemble : rien dans la piste events (règnes via RulersSection) */
  if (level === 1) return false;

  /* Vue siècle : seulement les événements Siècle (type 2) */
  if (level === 2) return t === 2;

  /* Règnes jamais dans la piste events */
  if (t === 1) return false;

  /* Vue décennale (3) et annuelle (4) : selon le zoom détail
     detailLevel 1 = Siècle    : type 2
     detailLevel 2 = Important : types 2+3
     detailLevel 3 = Détaillé  : types 2+3+4
     detailLevel 4 = Complet   : tous (2+3+4+5) */
  if (detailLevel <= 1) return t === 2;
  if (detailLevel === 2) return t <= 3;
  if (detailLevel === 3) return t <= 4;
  return true;
}

/* ── Chargement ─────────────────────────────────────────────────────── */
function loadEvents() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'events.json', true);
  xhr.onload = function() {
    if (xhr.status === 200 || xhr.status === 0) {
      try {
        var data = JSON.parse(xhr.responseText);
        allEvents = data.map(function(e) {
          var rawZones = e.zones || (e.zone ? [e.zone] : []);
          e.zones = rawZones.map(normalizeZone);
          e.type  = Number(e.type) || 1;
          return e;
        });
        buildFilterBar();
        wzInit();
      } catch(err) {
        document.getElementById('frise-container').innerHTML =
          '<p class="error">Erreur JSON : ' + err.message + '</p>';
      }
    } else {
      document.getElementById('frise-container').innerHTML =
        '<p class="error">Impossible de charger events.json.</p>';
    }
  };
  xhr.onerror = function() {
    document.getElementById('frise-container').innerHTML =
      '<p class="error">Impossible de charger events.json.</p>';
  };
  xhr.send();
}

/* ── Filtre zones ────────────────────────────────────────────────────*/
function buildFilterBar() {
  var container = document.getElementById('zone-filters');
  if (!container) return;
  container.innerHTML = '';
  for (var i = 0; i < ZONES.length; i++) {
    (function(zone) {
      var col = COLORS[zone];
      if (!col) return;
      var label = document.createElement('label');
      label.className   = (zone === 'France') ? 'zone-checkbox checked' : 'zone-checkbox unchecked';
      label.dataset.zone = zone;
      var input = document.createElement('input');
      input.type    = 'checkbox';
      input.checked = (zone === 'France');
      input.addEventListener('change', function() { toggleZone(zone, this.checked); });
      var dot = document.createElement('span');
      dot.className = 'zone-cb-dot';
      dot.style.background = col.bg;
      label.appendChild(input);
      label.appendChild(dot);
      label.appendChild(document.createTextNode('\u00a0' + zone));
      container.appendChild(label);
    })(ZONES[i]);
  }
}

function toggleZone(zone, checked) {
  activeZones[zone] = checked;
  document.querySelectorAll('.zone-checkbox').forEach(function(lbl) {
    var inp = lbl.querySelector('input');
    lbl.classList.toggle('checked',   inp.checked);
    lbl.classList.toggle('unchecked', !inp.checked);
  });
  refreshFrise();
}

function filterAll(checked) {
  for (var i = 0; i < ZONES.length; i++) activeZones[ZONES[i]] = checked;
  document.querySelectorAll('.zone-checkbox').forEach(function(lbl) {
    var inp = lbl.querySelector('input');
    inp.checked = checked;
    lbl.classList.toggle('checked',   checked);
    lbl.classList.toggle('unchecked', !checked);
  });
  refreshFrise();
}

function refreshFrise() {
  if      (currentLevel === 1) renderLevel(1);
  else if (currentLevel === 2) renderLevel(2, currentCentury);
  else                         renderLevel(3, currentDecade);
}

/* ── Rendu principal ─────────────────────────────────────────────────*/
function renderLevel(level, rangeStart) {
  currentLevel = level;
  var start, end, tickStep;
  if (level === 1) {
    start = 1290; end = 1510; tickStep = 25;
  } else if (level === 2) {
    currentCentury = rangeStart;
    start = rangeStart; end = rangeStart + 102; tickStep = 10;
  } else if (level === 3) {
    currentDecade = rangeStart;
    start = rangeStart; end = rangeStart + 10.5; tickStep = 1;
  } else {
    currentYear = rangeStart;
    currentDecade = Math.floor(rangeStart / 10) * 10;
    currentCentury = Math.floor(rangeStart / 100) * 100;
    start = rangeStart; end = rangeStart + 1; tickStep = 0.0833;
  }

  updateBreadcrumb();
  updateNavButtons();
  updatePeriodBanner(level, rangeStart || 1300);

  var container = document.getElementById('frise-container');
  container.innerHTML = '';
  container.appendChild(buildAxis(start, end, tickStep, level));

  var rulersSection = buildRulersSection(start, end, level);
  if (rulersSection) container.appendChild(rulersSection);

  var sharedZoneOf = {};
  for (var j = 0; j < allEvents.length; j++) {
    var e = allEvents[j];
    if (e.zones.length <= 1) continue;
    if (!visibleAtLevel(e, level)) continue;
    if (e.regne) continue;
    for (var zi = 0; zi < ZONES.length; zi++) {
      if (e.zones.indexOf(ZONES[zi]) !== -1 && activeZones[ZONES[zi]]) {
        sharedZoneOf[e.id] = ZONES[zi];
        break;
      }
    }
  }

  var displayedIds = {};

  for (var i = 0; i < ZONES.length; i++) {
    var zone = ZONES[i];
    if (!activeZones[zone]) continue;
    var evts = [];
    for (var j = 0; j < allEvents.length; j++) {
      var e = allEvents[j];
      if (e.zones.indexOf(zone) === -1) continue;
      if (!visibleAtLevel(e, level)) continue;
      if (e.regne) continue;
      if (e.zones.length > 1) {
        if (sharedZoneOf[e.id] !== zone) continue;
      }
      if (displayedIds[e.id]) continue;
      displayedIds[e.id] = true;
      var eDateF = e.date + (e.mois ? (e.mois - 1) / 12 : 0);
      var fin = (e.date_fin && e.date_fin > e.date)
        ? e.date_fin + (e.mois_fin ? (e.mois_fin - 1) / 12 : 0)
        : eDateF;
      if (level === 4) {
        if (eDateF >= start + 1 || fin < start) continue;
      } else if (level === 3) {
        if (e.date > start + 9 || (e.date_fin ? e.date_fin : e.date) < start) continue;
      } else {
        if (e.date > end || (e.date_fin ? e.date_fin : e.date) < start) continue;
      }
      evts.push(e);
    }
    container.appendChild(buildTrack(zone, evts, start, end, level));

    if (level >= 3) {
      var illusRow = buildIllusRow(zone, evts, start, end, level);
      if (illusRow) container.appendChild(illusRow);
    }
  }

  var hint = document.createElement('div');
  hint.className = 'frise-hint';
  hint.textContent = level === 1
    ? 'Cliquez sur une periode pour zoomer \u00b7 cliquez sur un evenement pour sa fiche'
    : level === 2
    ? 'Cliquez sur une decennie pour zoomer \u00b7 cliquez sur un evenement pour sa fiche'
    : level === 3
    ? 'Cliquez sur une annee pour voir le detail mensuel \u00b7 cliquez sur un evenement pour sa fiche'
    : 'Vue mensuelle \u00b7 cliquez sur un evenement pour afficher sa fiche complete';
  container.appendChild(hint);

  setTimeout(function() { injectBackgroundImages(container, start, end, level); }, 60);

  if (searchTerm) applySearch();
}

/* ── Axe ─────────────────────────────────────────────────────────────*/
function buildAxis(start, end, step, level) {
  var axis = document.createElement('div');
  axis.className = 'axis-row';
  var spacer = document.createElement('div');
  spacer.className = 'zone-label axis-spacer';
  axis.appendChild(spacer);
  var bar = document.createElement('div');
  bar.className = 'axis-bar';

  if (level !== 4) {
    for (var y = Math.ceil(start / step) * step; y <= end; y += step) {
      var tick = document.createElement('div');
      tick.className = 'tick';
      tick.style.left = pct(y, start, end);
      tick.textContent = y;
      bar.appendChild(tick);
      var tl = document.createElement('div');
      tl.className = 'tick-line';
      tl.style.left = pct(y, start, end);
      bar.appendChild(tl);
    }
  }

  if (level === 1) {
    [1300, 1350, 1400, 1450].forEach(function(s) {
      var band = makeBand(s, s + 50, start, end, (function(sv) {
        return function() { renderLevel(2, Math.floor(sv / 100) * 100); };
      })(s));
      bar.appendChild(band);
    });
  } else if (level === 2) {
    for (var d = currentCentury; d < currentCentury + 100; d += 10) {
      (function(decade) {
        var b = makeBand(decade, decade + 10, start, end, function() {
          renderLevel(3, decade);
        });
        b.dataset.label = decade + '\u2013' + (decade + 10) + ' → zoomer';
        bar.appendChild(b);
      })(d);
    }
  } else if (level === 3) {
    for (var y = currentDecade; y < currentDecade + 10; y++) {
      (function(yr) {
        var band = makeBand(yr, yr + 1, start, end, function() {
          renderLevel(4, yr);
        });
        band.classList.add('axis-band-year');
        band.dataset.label = yr + ' \u2192 vue annuelle';
        bar.appendChild(band);
      })(y);
    }
  } else if (level === 4) {
    var MOIS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
    for (var m = 0; m < 12; m++) {
      var mStart = currentYear + m / 12;
      var tick = document.createElement('div');
      tick.className = 'tick tick-month';
      tick.style.left = pct(mStart, start, end);
      tick.textContent = MOIS[m];
      bar.appendChild(tick);
      var tl = document.createElement('div');
      tl.className = 'tick-line';
      tl.style.left = pct(mStart, start, end);
      bar.appendChild(tl);
    }
  }
  axis.appendChild(bar);
  return axis;
}

function makeBand(from, to, start, end, onClick) {
  var band = document.createElement('div');
  band.className = 'axis-band';
  band.style.left  = pct(from, start, end);
  band.style.width = 'calc(' + pct(to, start, end) + ' - ' + pct(from, start, end) + ')';
  band.addEventListener('click', onClick);
  return band;
}

/* ── Anti-collision ──────────────────────────────────────────────────*/
function chipW(evt, start, end, level) {
  if (evt.date_fin && evt.date_fin > evt.date)
    return (Math.min(evt.date_fin, end) - Math.max(evt.date, start)) / (end - start) * 100;
  if (level === 1) return 1.5;
  var charPx = level === 4 ? 7.5 : 7;
  var chipPx = Math.min(evt.titre.length * charPx + 22, 280);
  return chipPx / TRACK_PX * 100;
}

function assignRows(evts, start, end, level) {
  var gap = CHIP_PAD / TRACK_PX * 100;
  var reigns   = evts.filter(function(e) { return !!e.regne; });
  var regulars = evts.filter(function(e) { return !e.regne; });
  var sorted = regulars.slice().sort(function(a, b) {
    var da = a.date + (a.mois ? (a.mois - 1) / 12 : 0);
    var db = b.date + (b.mois ? (b.mois - 1) / 12 : 0);
    return da - db;
  });
  var rowEnds = [];
  var rowMap  = {};
  for (var si = 0; si < sorted.length; si++) {
    var evt = sorted[si];
    var isPeriod = evt.date_fin && evt.date_fin > evt.date;
    var left = isPeriod
      ? (Math.max(evt.date, start) - start) / (end - start) * 100
      : (evt.date - start) / (end - start) * 100;
    var right = left + chipW(evt, start, end, level);
    var row = 0;
    while (row < rowEnds.length && rowEnds[row] > left - gap) row++;
    if (rowEnds[row] === undefined) rowEnds[row] = 0;
    rowEnds[row] = right;
    rowMap[evt.id] = row;
  }
  var reignEnds = [];
  var reignMap  = {};
  for (var ri = 0; ri < reigns.length; ri++) {
    var re = reigns[ri];
    var d0r = re.date, d1r = re.date_fin || re.date;
    var placed = false;
    for (var rj = 0; rj < reignEnds.length; rj++) {
      if (d0r >= reignEnds[rj]) {
        reignEnds[rj] = d1r + gap;
        reignMap[re.id] = rj;
        placed = true;
        break;
      }
    }
    if (!placed) {
      reignMap[re.id] = reignEnds.length;
      reignEnds.push(d1r + gap);
    }
  }
  return evts.map(function(e) {
    return e.regne ? (reignMap[e.id] || 0) : (rowMap[e.id] || 0);
  });
}

/* ── Piste ───────────────────────────────────────────────────────────*/
function buildRulersSection(start, end, level) {
  var byZone = {};
  for (var zi = 0; zi < ZONES.length; zi++) {
    var zone = ZONES[zi];
    if (!activeZones[zone]) continue;
    var zoneReigns = [];
    for (var j = 0; j < allEvents.length; j++) {
      var e = allEvents[j];
      if (!e.regne) continue;
      if (e.zones.indexOf(zone) === -1) continue;
      if (searchTerm && !eventMatchesSearch(e)) continue;
      var d0 = e.date, d1 = e.date_fin || e.date;
      if (level === 4) {
        var eF = e.date + (e.mois ? (e.mois-1)/12 : 0);
        var eL = e.date_fin ? e.date_fin + (e.mois_fin ? (e.mois_fin-1)/12 : 0) : eF;
        if (eF > end || eL < start) continue;
      } else {
        if (d0 > end || d1 < start) continue;
      }
      zoneReigns.push(e);
    }
    if (zoneReigns.length > 0) byZone[zone] = zoneReigns;
  }
  var zonesWithReigns = ZONES.filter(function(z) { return byZone[z]; });
  if (zonesWithReigns.length === 0) return null;
  var section = document.createElement('div');
  section.className = 'rulers-section';
  var sectionTitle = document.createElement('div');
  sectionTitle.className = 'rulers-section-title';
  sectionTitle.textContent = '♛ Souverains';
  section.appendChild(sectionTitle);
  var RULER_H = 22;
  var RULER_GAP = 3;
  for (var zi = 0; zi < zonesWithReigns.length; zi++) {
    var z = zonesWithReigns[zi];
    var col = COLORS[z] || COLORS['France'];
    var zReigns = byZone[z];
    var row = document.createElement('div');
    row.className = 'rulers-zone-row';
    var lbl = document.createElement('div');
    lbl.className = 'rulers-zone-label';
    lbl.style.borderLeft = '3px solid ' + col.bg;
    lbl.style.color = col.bg;
    var dotSpan = document.createElement('span');
    dotSpan.className = 'zone-dot';
    dotSpan.style.background = col.bg;
    lbl.appendChild(dotSpan);
    lbl.appendChild(document.createTextNode(z));
    row.appendChild(lbl);
    var rRows = assignRows(zReigns, start, end, level);
    var maxRR = zReigns.length > 0 ? Math.max.apply(null, rRows) : 0;
    var trackH = (maxRR + 1) * (RULER_H + RULER_GAP);
    var track = document.createElement('div');
    track.className = 'rulers-zone-track';
    track.style.position = 'relative';
    track.style.height = trackH + 'px';
    for (var ri = 0; ri < zReigns.length; ri++) {
      var rc = buildRulerChip(zReigns[ri], z, start, end, level, rRows[ri], RULER_H, RULER_GAP);
      if (rc) track.appendChild(rc);
    }
    row.appendChild(track);
    section.appendChild(row);
  }
  return section;
}

function buildIllusRow(zone, evts, start, end, level) {
  var ILLUS_H = 68;
  var ILLUS_W = 56;
  var withImg = evts.filter(function(e) {
    return e.image && e.image.trim() &&
           e.date <= end &&
           (e.date_fin ? e.date_fin : e.date) >= start;
  });
  if (withImg.length === 0) return null;
  var seen = {};
  withImg = withImg.filter(function(e) {
    if (seen[e.image]) return false;
    seen[e.image] = true;
    return true;
  });
  var galleryRow = document.createElement('div');
  galleryRow.className = 'illus-row';
  var spacer = document.createElement('div');
  spacer.className = 'zone-label illus-spacer';
  galleryRow.appendChild(spacer);
  var band = document.createElement('div');
  band.className = 'illus-band';
  band.style.height = (ILLUS_H + 8) + 'px';
  withImg.forEach(function(evt) {
    var dateF = evt.date + (evt.mois ? (evt.mois - 1) / 12 : 0);
    var leftPct = Math.max(0, Math.min(98, (dateF - start) / (end - start) * 100));
    var wrap = document.createElement('div');
    wrap.className = 'illus-wrap';
    wrap.style.left = leftPct + '%';
    var img = document.createElement('img');
    img.src       = evt.image;
    img.alt       = evt.legende || evt.titre;
    img.className = 'illus-img';
    img.draggable = false;
    wrap.appendChild(img);
    var cap = document.createElement('span');
    cap.className   = 'illus-cap';
    cap.textContent = (evt.legende || evt.titre) + ' (' + evt.date + ')';
    wrap.appendChild(cap);
    wrap.style.cursor = 'pointer';
    wrap.addEventListener('click', (function(e) {
      return function(ev) { ev.stopPropagation(); openModal(e, e.zones[0]); };
    })(evt));
    band.appendChild(wrap);
  });
  galleryRow.appendChild(band);
  return galleryRow;
}

function buildTrack(zone, evts, start, end, level) {
  var col = COLORS[zone] || COLORS['France'];
  var row = document.createElement('div');
  row.className = 'track-row';
  row.dataset.zone = zone;
  var lbl = document.createElement('div');
  lbl.className = 'zone-label';
  var dot = document.createElement('span');
  dot.className = 'zone-dot';
  dot.style.background = col.bg;
  lbl.appendChild(dot);
  lbl.appendChild(document.createTextNode(zone));
  row.appendChild(lbl);
  var visible = evts.filter(function(evt) {
    var fin = (evt.date_fin && evt.date_fin > evt.date) ? evt.date_fin : evt.date;
    return evt.date <= end && fin >= start;
  });
  var rows = assignRows(visible, start, end, level);
  var maxR = visible.length > 0 ? Math.max.apply(null, rows) : -1;
  var evtH = (maxR + 1) * ROW_H + maxR * ROW_GAP + 8;
  var track = document.createElement('div');
  track.className = 'track';
  track.style.height = evtH + 'px';
  var line = document.createElement('div');
  line.className = 'track-line';
  line.style.top = (evtH / 2) + 'px';
  track.appendChild(line);
  for (var i = 0; i < visible.length; i++) {
    var chip = buildChip(visible[i], zone, start, end, level, rows[i]);
    if (chip) track.appendChild(chip);
  }
  row.appendChild(track);
  return row;
}

/* ── Illustrations de fond dans les espaces vides ───────────────────*/
function injectBackgroundImages(container, start, end, level) {
  var IMG_W  = 110;
  var IMG_H  = 135;
  var MARGIN = 12;
  var card = document.querySelector('.frise-card');
  if (!card) return;
  card.querySelectorAll('.frise-bg-strip').forEach(function(el) { el.remove(); });
  container.querySelectorAll('.frise-bgf-wrap').forEach(function(el) { el.remove(); });
  var candidates = allEvents.filter(function(e) {
    if (!e.image || !e.image.trim()) return false;
    if (!visibleAtLevel(e, level)) return false;
    if (!e.zones.some(function(z) { return activeZones[z]; })) return false;
    var d0 = e.date, d1 = e.date_fin || e.date;
    return d0 <= end && d1 >= start;
  });
  if (candidates.length === 0) return;
  var chips = Array.prototype.slice.call(container.querySelectorAll('.evt-chip'));
  var maxChips = level === 4 ? 8 : level === 3 ? 14 : 10;
  if (chips.length > maxChips) return;
  var cr = container.getBoundingClientRect();
  var occupied = chips.map(function(chip) {
    var r = chip.getBoundingClientRect();
    return {
      x0: r.left  - cr.left - MARGIN,
      x1: r.right - cr.left + MARGIN,
      y0: r.top   - cr.top  - MARGIN,
      y1: r.bottom- cr.top  + MARGIN
    };
  });
  var friseW   = container.offsetWidth  || TRACK_PX;
  var friseH   = container.offsetHeight || 200;
  var labelW   = 90;
  var rulersH = 0;
  var rs = container.querySelector('.rulers-section');
  if (rs) rulersH = rs.offsetHeight || 0;
  var evtTop = rulersH;
  var evtH   = friseH - rulersH;
  var stepX  = Math.floor(IMG_W / 2);
  var imgTop = evtTop + (evtH - IMG_H) / 2;
  var imgBot = imgTop + IMG_H;
  var slots = [];
  for (var x = labelW; x + IMG_W <= friseW - 4; x += stepX) {
    var x1 = x + IMG_W;
    var free = occupied.every(function(o) {
      return x1 <= o.x0 || x >= o.x1 || imgBot <= o.y0 || imgTop >= o.y1;
    });
    if (free) slots.push(x);
  }
  if (slots.length === 0) return;
  var MIN_GAP = IMG_W + 20;
  var filtered = [slots[0]];
  for (var si = 1; si < slots.length; si++) {
    if (slots[si] - filtered[filtered.length - 1] >= MIN_GAP) {
      filtered.push(slots[si]);
    }
  }
  var maxImgs = Math.min(filtered.length, 3);
  var usedImages = {};
  for (var fi = 0; fi < maxImgs; fi++) {
    var slotX    = filtered[fi];
    var centerDate = start + ((slotX + IMG_W / 2 - labelW) / (friseW - labelW)) * (end - start);
    var pick = null;
    var best = Infinity;
    for (var ci = 0; ci < candidates.length; ci++) {
      var c = candidates[ci];
      if (usedImages[c.image]) continue;
      var dist = Math.abs(c.date - centerDate);
      if (dist < best) { best = dist; pick = c; }
    }
    if (!pick) continue;
    usedImages[pick.image] = true;
    var wrap = document.createElement('div');
    wrap.className    = 'frise-bgf-wrap';
    wrap.style.left   = slotX + 'px';
    wrap.style.top    = imgTop + 'px';
    wrap.style.width  = IMG_W + 'px';
    wrap.style.height = IMG_H + 'px';
    wrap.style.cursor = 'pointer';
    var img = document.createElement('img');
    img.src       = pick.image;
    img.alt       = pick.legende || pick.titre;
    img.className = 'frise-bgf-img';
    img.draggable = false;
    wrap.appendChild(img);
    var cap = document.createElement('span');
    cap.className   = 'frise-bg-caption';
    cap.textContent = (pick.legende || pick.titre) + ' (' + pick.date + ')';
    wrap.appendChild(cap);
    wrap.addEventListener('click', (function(e) {
      return function(ev) { ev.stopPropagation(); openModal(e, e.zones[0]); };
    })(pick));
    container.appendChild(wrap);
  }
}

/* ── Ruler Chip (ligne Rulers dédiée) ──────────────────────────────*/
function buildRulerChip(evt, zone, start, end, level, rowIndex, RULER_H, RULER_GAP) {
  var col  = COLORS[zone] || COLORS['France'];
  var chip = document.createElement('div');
  chip.className     = 'ruler-chip';
  chip.dataset.evtId = evt.id;
  var d0 = Math.max(evt.date + (evt.mois ? (evt.mois - 1) / 12 : 0), start);
  var d1 = evt.date_fin
    ? Math.min(evt.date_fin + (evt.mois_fin ? (evt.mois_fin - 1) / 12 : 0), end)
    : Math.min(evt.date + 1, end);
  if (d1 <= d0) return null;
  chip.style.left   = pct(d0, start, end);
  chip.style.width  = 'calc(' + pct(d1, start, end) + ' - ' + pct(d0, start, end) + ')';
  chip.style.top    = (rowIndex * (RULER_H + RULER_GAP)) + 'px';
  chip.style.height = RULER_H + 'px';
  chip.style.background    = 'linear-gradient(135deg, ' + col.bg + 'EE 0%, ' + col.bg + 'AA 100%)';
  chip.style.borderLeft    = '4px solid ' + col.bg;
  chip.style.borderTop     = '1px solid ' + col.bg + '66';
  chip.style.borderBottom  = '1px solid ' + col.bg + '33';
  chip.style.borderRight   = 'none';
  chip.style.borderRadius  = '0 4px 4px 0';
  chip.style.color         = '#fff';
  chip.style.fontSize      = '0.72rem';
  chip.style.fontWeight    = '700';
  chip.style.boxShadow     = '0 2px 6px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.15)';
  chip.style.display       = 'flex';
  chip.style.alignItems    = 'center';
  chip.style.justifyContent= 'center';
  chip.style.overflow      = 'hidden';
  chip.style.whiteSpace    = 'nowrap';
  chip.style.boxSizing     = 'border-box';
  chip.style.cursor        = 'pointer';
  chip.style.overflow = 'visible';
  if (level > 1) {
    var MOIS_ABR_R = ['jan.','fév.','mar.','avr.','mai','jun.','jul.','aoû.','sep.','oct.','nov.','déc.'];
    var dateLblR = document.createElement('span');
    dateLblR.className   = 'chip-date-label';
    var lblTxtR = evt.mois ? MOIS_ABR_R[evt.mois - 1] + '\u00a0' + evt.date : '' + evt.date;
    if (evt.date_fin && evt.date_fin > evt.date) {
      var finTxtR = evt.mois_fin ? MOIS_ABR_R[evt.mois_fin - 1] + '\u00a0' + evt.date_fin : '' + evt.date_fin;
      lblTxtR += '\u2013' + finTxtR;
    }
    dateLblR.textContent = lblTxtR;
    chip.appendChild(dateLblR);
    var maxC = level === 4 ? 36 : level === 3 ? 26 : 18;
    var titre = evt.titre.length > maxC ? evt.titre.slice(0, maxC - 1) + '\u2026' : evt.titre;
    chip.appendChild(document.createTextNode(titre));
  }
  chip.title = '\u265b ' + evt.titre + ' (' + evt.date + (evt.date_fin ? '\u2013' + evt.date_fin : '') + ')';
  if (evt.image && evt.image.trim()) {
    var imgBadge = document.createElement('span');
    imgBadge.className   = 'chip-img-badge';
    imgBadge.textContent = '\uD83D\uDDBC';
    chip.appendChild(imgBadge);
    chip.style.overflow = 'visible';
    var tt = document.createElement('div');
    tt.className = 'chip-img-tooltip';
    var ttImg = document.createElement('img');
    ttImg.src = evt.image;
    tt.appendChild(ttImg);
    if (evt.legende) {
      var ttCap = document.createElement('span');
      ttCap.textContent = evt.legende;
      tt.appendChild(ttCap);
    }
    chip.appendChild(tt);
  }
  if (evt.video && evt.video.trim()) {
    var vBadge = document.createElement('span');
    vBadge.className   = 'chip-video-badge';
    vBadge.textContent = '\u25B6';
    chip.appendChild(vBadge);
  }
  chip.addEventListener('click', (function(e, z) {
    return function(ev) { ev.stopPropagation(); openModal(e, z); };
  })(evt, zone));
  return chip;
}

/* ── Chip ────────────────────────────────────────────────────────────*/
function adaptFontSize(titre, basePx, maxChars) {
  var len = titre.length;
  if (len <= maxChars)        return basePx + 'rem';
  if (len <= maxChars * 1.4)  return (basePx * 0.88).toFixed(2) + 'rem';
  if (len <= maxChars * 1.8)  return (basePx * 0.78).toFixed(2) + 'rem';
  return (basePx * 0.70).toFixed(2) + 'rem';
}

function buildChip(evt, zone, start, end, level, rowIndex) {
  var isShared = evt.zones && evt.zones.length > 1;
  var col      = COLORS[zone] || COLORS['France'];
  var col2     = isShared && evt.zones.length >= 2 ? (COLORS[evt.zones[evt.zones.indexOf(zone) !== 0 ? 0 : 1]] || col) : col;
  var isPeriod = evt.date_fin && evt.date_fin > evt.date;
  var type     = Number(evt.type) || 1;
  var chip     = document.createElement('div');
  chip.className      = isShared ? 'evt-chip chip-shared' : 'evt-chip';
  chip.dataset.evtId  = evt.id;
  chip.style.position = 'absolute';
  chip.style.top      = (4 + rowIndex * (ROW_H + ROW_GAP)) + 'px';

  if (isPeriod) {
    var d0 = Math.max(evt.date, start);
    var d1 = Math.min(evt.date_fin, end);
    if (d1 <= d0) return null;
    chip.classList.add('chip-period');
    if (level === 1) chip.classList.add('chip-period-sm');
    chip.style.left        = pct(d0, start, end);
    chip.style.width       = 'calc(' + pct(d1, start, end) + ' - ' + pct(d0, start, end) + ')';
    chip.style.height      = ROW_H + 'px';
    if (isShared) {
      chip.style.background  = 'repeating-linear-gradient(60deg,' + col.bg + 'CC 0px,' + col.bg + 'CC 8px,' + col2.bg + 'CC 8px,' + col2.bg + 'CC 16px)';
    } else {
      chip.style.background  = col.bg + (type === 3 ? '88' : 'CC');
    }
    chip.style.borderColor = col.bg;
    chip.style.color   = '#fff';
    chip.style.overflow = 'visible';
    if (level > 1) {
      var titreP = evt.titre;
      var chipPct      = (Math.min(evt.date_fin, end) - Math.max(evt.date, start)) / (end - start);
      var chipPxApprox = chipPct * (TRACK_PX - 90);
      var maxC         = level === 3 ? 32 : 18;
      var MOIS_ABR_P = ['jan.','fév.','mar.','avr.','mai','jun.','jul.','aoû.','sep.','oct.','nov.','déc.'];
      var dateLblP = document.createElement('span');
      dateLblP.className   = 'chip-date-label';
      var lblTxtP = evt.mois ? MOIS_ABR_P[evt.mois - 1] + '\u00a0' + evt.date : '' + evt.date;
      if (evt.date_fin && evt.date_fin > evt.date) {
        var finTxtP = evt.mois_fin ? MOIS_ABR_P[evt.mois_fin - 1] + '\u00a0' + evt.date_fin : '' + evt.date_fin;
        lblTxtP += '\u2013' + finTxtP;
      }
      dateLblP.textContent = lblTxtP;
      chip.appendChild(dateLblP);

      if (chipPxApprox < 60) {
        chip.style.fontSize     = '0.60rem';
        chip.style.whiteSpace   = 'nowrap';
        chip.style.textOverflow = 'ellipsis';
        chip.style.overflow     = 'hidden';
        chip.appendChild(document.createTextNode(titreP));
      } else {
        chip.style.fontSize   = adaptFontSize(titreP, 0.78, maxC);
        chip.style.whiteSpace = chipPxApprox < 100 ? 'nowrap' : 'normal';
        chip.appendChild(document.createTextNode(titreP));
      }
    }
    chip.title = evt.titre + ' (' + evt.date + (evt.date_fin ? '\u2013' + evt.date_fin : '') + ')';
  } else {
    chip.style.minHeight = ROW_H + 'px';
    var evtDateF = evt.date + (evt.mois ? (evt.mois - 1) / 12 : 0);
    var rawPct = (evtDateF - start) / (end - start) * 100;
    var finalPct = Math.min(Math.max(rawPct, 3), 97);
    chip.style.left = finalPct.toFixed(3) + '%';
    if (finalPct > 88) chip.style.transform = 'translateX(-100%)';
    else if (finalPct < 8) chip.style.transform = 'translateX(0%)';
    else chip.style.transform = 'translateX(-50%)';

    if (level === 4 || level === 3) {
      chip.classList.add('chip-full');
      if (type === 1) chip.classList.add('chip-type1');
      if (type === 3) chip.classList.add('chip-type3');
      chip.style.background = isShared ? 'repeating-linear-gradient(60deg,' + col.bg + ' 0px,' + col.bg + ' 7px,' + col2.bg + ' 7px,' + col2.bg + ' 14px)' : col.bg;
      chip.style.color      = '#fff';
      var MOIS_ABR = ['jan.','fév.','mar.','avr.','mai','jun.','jul.','aoû.','sep.','oct.','nov.','déc.'];
      var dateLbl = document.createElement('span');
      dateLbl.className = 'chip-date-label';
      dateLbl.textContent = evt.mois ? MOIS_ABR[evt.mois - 1] + ' ' + evt.date : '' + evt.date;
      chip.appendChild(dateLbl);
      var titreF = evt.titre;
      chip.style.fontSize   = adaptFontSize(titreF, 0.83, level === 4 ? 48 : 40);
      chip.style.whiteSpace = 'normal';
      chip.appendChild(document.createTextNode(titreF));
    } else if (level === 2) {
      chip.classList.add('chip-medium');
      if (type === 1) chip.classList.add('chip-type1');
      if (type === 3) chip.classList.add('chip-type3');
      chip.style.background  = isShared ? 'repeating-linear-gradient(60deg,' + col.light + ' 0px,' + col.light + ' 7px,' + col2.light + ' 7px,' + col2.light + ' 14px)' : col.light;
      chip.style.color       = col.text;
      chip.style.borderColor = col.bg;
      chip.style.fontSize   = adaptFontSize(evt.titre, 0.76, 18);
      chip.style.whiteSpace = 'normal';
      var dateLbl2 = document.createElement('span');
      dateLbl2.className   = 'chip-date-label';
      dateLbl2.textContent = evt.date;
      chip.appendChild(dateLbl2);
      chip.appendChild(document.createTextNode(evt.titre));
    } else {
      chip.classList.add('chip-dot');
      var sz = type === 1 ? 13 : type === 3 ? 7 : 10;
      chip.style.background   = isShared ? 'linear-gradient(135deg, ' + col.bg + ' 50%, ' + col2.bg + ' 50%)' : col.bg;
      chip.style.width        = sz + 'px';
      chip.style.height       = sz + 'px';
      chip.style.top          = (4 + rowIndex * (ROW_H + ROW_GAP) + ROW_H / 2 - sz / 2) + 'px';
      chip.style.borderRadius = '50%';
      var dateLblD = document.createElement('span');
      dateLblD.className   = 'chip-date-label chip-date-dot';
      dateLblD.textContent = '' + evt.date;
      chip.appendChild(dateLblD);
    }
    chip.title = evt.titre + ' (' + evt.date + ')';
  }

  if (evt.video && evt.video.trim()) {
    var badge = document.createElement('span');
    badge.className   = 'chip-video-badge';
    badge.textContent = '\u25B6';
    chip.appendChild(badge);
  }

  if (evt.image && evt.image.trim() && !chip.classList.contains('chip-dot')) {
    var imgBadge = document.createElement('span');
    imgBadge.className   = 'chip-img-badge';
    imgBadge.textContent = '\uD83D\uDDBC';
    chip.appendChild(imgBadge);
    var tt = document.createElement('div');
    tt.className = 'chip-img-tooltip';
    var ttImg = document.createElement('img');
    ttImg.src = evt.image;
    tt.appendChild(ttImg);
    if (evt.legende) {
      var ttCap = document.createElement('span');
      ttCap.textContent = evt.legende;
      tt.appendChild(ttCap);
    }
    chip.appendChild(tt);
    chip.style.position = 'absolute';
    if (chip.classList.contains('chip-period')) chip.style.overflow = 'visible';
  }

  chip.addEventListener('click', (function(e, z) {
    return function(ev) { ev.stopPropagation(); openModal(e, z); };
  })(evt, zone));
  return chip;
}

/* ── Lightbox image ─────────────────────────────────────────────────*/
function openLightbox(src, caption) {
  var lb  = document.getElementById('img-lightbox');
  var img = document.getElementById('lightbox-img');
  var cap = document.getElementById('lightbox-caption');
  if (!lb || !img) return;
  img.src = src;
  img.alt = caption || '';
  if (cap) cap.textContent = caption || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  var lb = document.getElementById('img-lightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Modale ──────────────────────────────────────────────────────────*/
function openModal(evt, zone) {
  var col = COLORS[zone] || COLORS['France'];
  document.getElementById('modal-zone').textContent      = zone;
  document.getElementById('modal-zone').style.background = col.light;
  document.getElementById('modal-zone').style.color      = col.text;

  var typeEl = document.getElementById('modal-type');
  if (typeEl) {
    var t = Number(evt.type) || 1;
    typeEl.textContent = t === 1 ? '⬛ Niveau 1 — visible dès la vue siècle'
                       : t === 2 ? '🔲 Niveau 2 — vue décennale Essentiel'
                       : t === 3 ? '▪ Niveau 3 — vue décennale Détaillé'
                       :           '· Niveau 4 — vue décennale Complet';
    typeEl.className = 'modal-type-badge type' + t;
  }

  var MOIS_L = ['janvier','février','mars','avril','mai','juin',
                'juillet','août','septembre','octobre','novembre','décembre'];
  var dateStr = evt.mois ? MOIS_L[evt.mois - 1] + ' ' + evt.date : '' + evt.date;
  if (evt.date_fin && evt.date_fin > evt.date) {
    var finStr = evt.mois_fin ? MOIS_L[evt.mois_fin - 1] + ' ' + evt.date_fin : '' + evt.date_fin;
    dateStr += ' \u2013 ' + finStr;
  }
  document.getElementById('modal-date').textContent = dateStr;
  var titleEl = document.getElementById('modal-title');
  titleEl.innerHTML = highlightText(evt.titre);

  var descEl = document.getElementById('modal-desc');
  descEl.innerHTML = '';
  var paras = (evt.description || '').split(/\n\n+/);
  for (var pi = 0; pi < paras.length; pi++) {
    if (!paras[pi].trim()) continue;
    var p = document.createElement('p');
    var paraText = paras[pi].replace(/\n/g, ' ').trim();
    p.innerHTML = highlightText(paraText);
    descEl.appendChild(p);
  }

/* --- DEBUT DU BLOC SÉQUENCES (Événements longs) --- */
  if (evt.serie) {
    var sequenceEvents = allEvents.filter(function(e) {
      return e.serie === evt.serie;
    }).sort(function(a, b) {
      return a.date - b.date;
    });

    if (sequenceEvents.length > 1) {
      var seqContainer = document.createElement('div');
      seqContainer.className = 'sequence-container';
      
      var seqTitle = document.createElement('h4');
      seqTitle.className = 'sequence-title';
      seqTitle.textContent = 'Épisode de : ' + evt.serie;
      seqContainer.appendChild(seqTitle);

      var seqList = document.createElement('ul');
      seqList.className = 'sequence-list';

      sequenceEvents.forEach(function(seqEvt) {
        var li = document.createElement('li');
        var isCurrent = (seqEvt.id === evt.id);
        if (isCurrent) {
          li.className = 'current-step';
          li.innerHTML = '<span>' + seqEvt.date + ' — ' + seqEvt.titre + ' (Actuel)</span>';
        } else {
          li.innerHTML = '<a href="#" onclick="openLightboxById(' + seqEvt.id + '); return false;">' + seqEvt.date + ' — ' + seqEvt.titre + '</a>';
        }
        seqList.appendChild(li);
      });

      seqContainer.appendChild(seqList);
      descEl.appendChild(seqContainer);
    }
  }
  /* --- FIN DU BLOC SÉQUENCES --- */
  /* --- FIN DU BLOC SÉQUENCES --- */

  document.getElementById('modal-sources').textContent = evt.sources ? '\uD83D\uDCD6 ' + evt.sources : '';

  var imgWrap   = document.getElementById('modal-img-wrap');
  var imgEl     = document.getElementById('modal-img');
  var captionEl = document.getElementById('modal-img-caption');

  if (evt.image && evt.image.trim() !== '') {
    imgEl.src = evt.image;
    imgEl.alt = evt.legende || evt.titre;
    if (captionEl) {
      captionEl.textContent  = evt.legende || '';
      captionEl.style.display = evt.legende ? 'block' : 'none';
    }
    var zoomBtn = imgWrap.querySelector('.img-zoom-btn');
    if (!zoomBtn) {
      zoomBtn = document.createElement('button');
      zoomBtn.className = 'img-zoom-btn';
      zoomBtn.title = 'Agrandir l\u2019image';
      zoomBtn.textContent = '\uD83D\uDD0D';
      imgWrap.appendChild(zoomBtn);
    }
    zoomBtn.onclick = (function(src, cap) {
      return function(e) { e.stopPropagation(); openLightbox(src, cap); };
    })(evt.image, evt.legende || evt.titre);
    imgEl.style.cursor = 'zoom-in';
    imgEl.onclick = (function(src, cap) {
      return function() { openLightbox(src, cap); };
    })(evt.image, evt.legende || evt.titre);
    imgWrap.style.display = 'block';
  } else {
    imgWrap.style.display = 'none';
    imgEl.src = '';
    imgEl.onclick = null;
    imgEl.style.cursor = '';
  }

  var videoWrap = document.getElementById('modal-video-wrap');
  if (videoWrap) {
    var ytId = extractYouTubeId(evt.video || '');
    if (ytId) {
      videoWrap.innerHTML =
        '<iframe src="https://www.youtube.com/embed/' + ytId + '?rel=0&modestbranding=1"'
        + ' width="100%" height="260" frameborder="0"'
        + ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"'
        + ' allowfullscreen style="border-radius:6px;display:block;margin-top:1rem;"></iframe>';
      videoWrap.style.display = 'block';
    } else {
      videoWrap.innerHTML = '';
      videoWrap.style.display = 'none';
    }
  }

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ── Fermeture de la modale ── */
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  var videoWrap = document.getElementById('modal-video-wrap');
  if (videoWrap) {
    videoWrap.innerHTML = ''; /* Coupe la vidéo */
    videoWrap.style.display = 'none';
  }
  if (searchTerm) {
    if (matchedIds.length === 0) clearSearch();
  }
}

/* ── Navigation ──────────────────────────────────────────────────────*/
function zoomIn() {
  if (currentLevel === 1) {
    var century = currentCentury !== null ? currentCentury : 1400;
    renderLevel(2, century);
  } else if (currentLevel === 2 && currentCentury !== null) {
    var decade = currentDecade !== null ? currentDecade : currentCentury + 50;
    renderLevel(3, decade);
  } else if (currentLevel === 3 && currentDecade !== null) {
    var year = currentYear !== null ? currentYear : currentDecade + 5;
    renderLevel(4, year);
  }
}

function zoomOut() {
  if (currentLevel === 4) {
    renderLevel(3, currentDecade);
  } else if (currentLevel === 3) {
    renderLevel(2, currentCentury !== null ? currentCentury : 1300);
  } else if (currentLevel === 2) {
    renderLevel(1);
  }
}

/* ── Accueil ─────────────────────────────────────────────────────────*/
var wzCurrentStep = 1;
var WZ_TOTAL_STEPS = 2;

function wzInit() {
  startMusic();
  document.querySelectorAll('.wz-step-dot').forEach(function(d, i) {
    d.textContent = i + 1;
  });
  var grid = document.getElementById('wz-zones-grid');
  if (grid) {
    grid.innerHTML = '';
    var groupNames = Object.keys(ZONES_GROUPS);
    for (var gi = 0; gi < groupNames.length; gi++) {
      var grpName  = groupNames[gi];
      var grpZones = ZONES_GROUPS[grpName];
      var titleEl = document.createElement('div');
      titleEl.className   = 'wz-group-title';
      titleEl.textContent = grpName;
      grid.appendChild(titleEl);
      var chipsEl = document.createElement('div');
      chipsEl.className = 'wz-group-chips';
      for (var zi = 0; zi < grpZones.length; zi++) {
        (function(zone) {
          var col  = COLORS[zone] || { bg: '#888', light: '#eee', text: '#333' };
          var isOn = !!activeZones[zone];
          var chip = document.createElement('span');
          chip.className = 'wz-zone-chip';
          chip.dataset.zone = zone;
          chip.style.borderColor = col.bg;
          chip.style.color       = isOn ? '#fff' : col.text;
          chip.style.background  = isOn ? col.bg : col.light;
          var dot = document.createElement('span');
          dot.className = 'chip-dot-sm';
          dot.style.background = isOn ? 'rgba(255,255,255,0.6)' : col.bg;
          chip.appendChild(dot);
          chip.appendChild(document.createTextNode(zone));
          chip.addEventListener('click', function() {
            activeZones[zone] = !activeZones[zone];
            var on = activeZones[zone];
            chip.style.color      = on ? '#fff' : col.text;
            chip.style.background = on ? col.bg : col.light;
            dot.style.background  = on ? 'rgba(255,255,255,0.6)' : col.bg;
          });
          chipsEl.appendChild(chip);
        })(grpZones[zi]);
      }
      grid.appendChild(chipsEl);
    }
  }
  wzGoTo(1);
}

function wzScaleChanged(val) {
  _wzScale = parseInt(val);
  if (wzCurrentStep === 2) wzBuildPeriodSelect();
}

function wzGoTo(step) {
  wzCurrentStep = step;
  document.querySelectorAll('.wizard-step').forEach(function(el, i) {
    el.classList.toggle('active', i + 1 === step);
  });
  document.querySelectorAll('.wz-step-dot').forEach(function(d, i) {
    d.classList.toggle('active', i + 1 === step);
    d.classList.toggle('done',   i + 1 < step);
  });
  /* Étape 2 : construit le select de période selon l'échelle choisie */
  if (step === 2) wzBuildPeriodSelect();
}

function wzNext() {
  if (wzCurrentStep === 1) {
    var q = (document.getElementById('wz-search-input').value || '').trim();
    if (q) { wzClose(); wzApplySearch(q); return; }
    var anyZone = Object.values(activeZones).some(Boolean);
    if (!anyZone) { alert('Sélectionnez au moins une zone ou saisissez un mot-clé.'); return; }
  }
  /* Mémorise le scale quand on quitte l'étape 2 (avant que la div soit masquée) */
  if (wzCurrentStep === 2) {
    var r = document.querySelector('input[name="wz-scale"]:checked');
    if (r) _wzScale = parseInt(r.value);
  }
  var next = wzCurrentStep + 1;
  if (next > WZ_TOTAL_STEPS) { wzClose(); return; }
  wzGoTo(next);
}

function wzPrev() {
  var prev = wzCurrentStep - 1;
  if (wzCurrentStep === 5 && wzGetScale() !== 3) { wzGoTo(3); return; }
  if (prev < 1) return;
  wzGoTo(prev);
}

var _wzScale = 3; /* Mémorise le choix d'échelle — défaut décennale */

function wzGetScale() {
  /* Tente d'abord de lire le DOM, sinon utilise _wzScale */
  var r = document.querySelector('input[name="wz-scale"]:checked');
  if (r) _wzScale = parseInt(r.value);
  return _wzScale;
}

function wzBuildPeriodSelect() {
  var scale = wzGetScale();
  var sel   = document.getElementById('wz-period-select');
  var sub   = document.getElementById('wz-period-sub');
  if (!sel) return;
  sel.innerHTML = '';
  if (scale === 2) {
    sub.textContent = 'Sélectionnez le siècle à afficher.';
    [['XIVe siècle (1300–1400)', 1300],
     ['XVe siècle (1400–1500)',  1400]].forEach(function(o) {
      var opt = document.createElement('option');
      opt.textContent = o[0]; opt.value = o[1];
      sel.appendChild(opt);
    });
  } else if (scale === 3) {
    sub.textContent = 'Sélectionnez la décennie à afficher.';
    for (var d = 1300; d < 1500; d += 10) {
      var opt = document.createElement('option');
      opt.textContent = d + ' – ' + (d + 9);
      opt.value = d;
      sel.appendChild(opt);
    }
  } else {
    sub.textContent = "Sélectionnez l'année à afficher.";
    for (var y = 1300; y < 1500; y++) {
      var opt = document.createElement('option');
      opt.textContent = y;
      opt.value = y;
      sel.appendChild(opt);
    }
  }
}

function wzApplySearch(q) {
  var inp = document.getElementById('search-input');
  if (inp) { inp.value = q; onSearch(q); }
}

function wzClose() {
  var overlay = document.getElementById('wizard-overlay');
  if (overlay) overlay.classList.add('hidden');
  var q = (document.getElementById('wz-search-input').value || '').trim();
  if (q) { wzApplySearch(q); return; }
  updateFilterCheckboxes();

  /* Lit l'échelle mémorisée et la période choisie */
  var rScale = document.querySelector('input[name="wz-scale"]:checked');
  if (rScale) _wzScale = parseInt(rScale.value);
  var scale  = _wzScale;
  var period = parseInt(document.getElementById('wz-period-select').value || '1300');

  /* Niveau de détail par défaut selon la vue :
     - vue siècle (2)  : detailLevel 1 (les autres niveaux non proposés)
     - vue décennale(3): detailLevel 2 (Important par défaut, ajustable au zoom)
     - vue annuelle (4): detailLevel 3 (Détaillé par défaut, ajustable au zoom) */
  if (scale === 2)      detailLevel = 1;
  else if (scale === 3) detailLevel = 2;
  else                  detailLevel = 3;
  document.querySelectorAll('.detail-btn').forEach(function(b) {
    b.classList.toggle('active', parseInt(b.dataset.level) === detailLevel);
  });

  currentCentury = Math.floor(period / 100) * 100;
  currentDecade  = scale >= 3 ? Math.floor(period / 10) * 10 : null;
  currentYear    = scale === 4 ? period : null;
  renderLevel(scale, period);
}

function goHome() {
  for (var z in activeZones) activeZones[z] = false;
  var inp = document.getElementById('search-input');
  if (inp) inp.value = '';
  clearSearch();
  var wzInp = document.getElementById('wz-search-input');
  if (wzInp) wzInp.value = '';
  var overlay = document.getElementById('wizard-overlay');
  if (overlay) overlay.classList.remove('hidden');
  wzInit();
}

/* ── Modale Zones & Thèmes ──────────────────────────────────────────*/
function openZonesModal() {
  var overlay = document.getElementById('zones-modal-overlay');
  var grid    = document.getElementById('zones-modal-grid');
  if (!overlay || !grid) return;
  grid.innerHTML = '';
  var groupNames = Object.keys(ZONES_GROUPS);
  for (var gi = 0; gi < groupNames.length; gi++) {
    var grpName  = groupNames[gi];
    var grpZones = ZONES_GROUPS[grpName];
    var section = document.createElement('div');
    var title   = document.createElement('div');
    title.className   = 'zones-group-title';
    title.textContent = grpName;
    section.appendChild(title);
    var chips = document.createElement('div');
    chips.className = 'zones-group-chips';
    for (var zi = 0; zi < grpZones.length; zi++) {
      (function(zone) {
        var col     = COLORS[zone] || { bg: '#888', light: '#eee', text: '#333' };
        var isOn    = !!activeZones[zone];
        var chip    = document.createElement('span');
        chip.className = 'zone-modal-chip';
        chip.dataset.zone = zone;
        chip.style.borderColor = col.bg;
        chip.style.color       = isOn ? '#fff' : col.text;
        chip.style.background  = isOn ? col.bg : col.light;
        var dot = document.createElement('span');
        dot.className = 'chip-dot-sm';
        dot.style.background = isOn ? 'rgba(255,255,255,0.6)' : col.bg;
        chip.appendChild(dot);
        chip.appendChild(document.createTextNode(zone));
        chip.addEventListener('click', function() {
          activeZones[zone] = !activeZones[zone];
          var on = activeZones[zone];
          chip.style.color      = on ? '#fff' : col.text;
          chip.style.background = on ? col.bg : col.light;
          dot.style.background  = on ? 'rgba(255,255,255,0.6)' : col.bg;
        });
        chips.appendChild(chip);
      })(grpZones[zi]);
    }
    section.appendChild(chips);
    grid.appendChild(section);
  }
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeZonesModal() {
  var overlay = document.getElementById('zones-modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
  updateFilterCheckboxes();
  refreshFrise();
}

function zonesModalAll(val) {
  for (var z in activeZones) activeZones[z] = val;
  var chips = document.querySelectorAll('.zone-modal-chip');
  chips.forEach(function(chip) {
    var zone = chip.dataset.zone;
    var col  = COLORS[zone] || { bg: '#888', light: '#eee', text: '#333' };
    var on   = val;
    chip.style.color      = on ? '#fff' : col.text;
    chip.style.background = on ? col.bg : col.light;
    var dot = chip.querySelector('.chip-dot-sm');
    if (dot) dot.style.background = on ? 'rgba(255,255,255,0.6)' : col.bg;
  });
}

function goLevel(level) {
  if      (level === 1)                             renderLevel(1);
  else if (level === 2 && currentCentury !== null)  renderLevel(2, currentCentury);
  else if (level === 3 && currentDecade  !== null)  renderLevel(3, currentDecade);
  else if (level === 4 && currentYear    !== null)  renderLevel(4, currentYear);
}

function setDetailLevel(n) {
  detailLevel = n;
  var btns = document.querySelectorAll('.detail-btn');
  btns.forEach(function(b) {
    b.classList.toggle('active', parseInt(b.dataset.level) === n);
  });
  refreshFrise();
}

function updateDetailBar() {
  var bar  = document.getElementById('detail-bar');
  var hint = document.getElementById('detail-hint');
  if (!bar) return;
  /* Barre de zoom détail visible en vue décennale et annuelle uniquement
     (en vue siècle, un seul niveau est proposé) */
  bar.style.display = (currentLevel === 3 || currentLevel === 4) ? 'flex' : 'none';
  if (hint) {
    var labels = {
      1: '— événements Siècle',
      2: '— + Importants',
      3: '— + Détaillés',
      4: '— tous les événements'
    };
    hint.textContent = labels[detailLevel] || '';
  }
}

function navigateDecade(direction) { navigatePeriod(direction); }

function navigatePeriod(direction) {
  if (currentLevel === 4 && currentYear !== null) {
    var nextY = currentYear + direction;
    if (nextY < 1290 || nextY > 1509) return;
    renderLevel(4, nextY);
    return;
  }
  if (currentLevel === 3 && currentDecade !== null) {
    var nextD = currentDecade + direction * 10;
    if (nextD < 1290 || nextD > 1500) return;
    currentCentury = Math.floor(nextD / 100) * 100;
    renderLevel(3, nextD);
    return;
  }
  if (currentLevel === 2 && currentCentury !== null) {
    var nextC = currentCentury + direction * 100;
    if (nextC < 1200 || nextC > 1500) return;
    renderLevel(2, nextC);
    return;
  }
}

function updateBreadcrumb() {
  var html = '<span class="bc-item bc-link" onclick="goLevel(1)">1300\u20131500</span>';
  if (currentLevel >= 2 && currentCentury !== null)
    html += '<span class="bc-sep"> \u203a </span><span class="bc-item bc-link" onclick="goLevel(2)">' + currentCentury + '\u2013' + (currentCentury + 100) + '</span>';
  if (currentLevel >= 3 && currentDecade !== null)
    html += '<span class="bc-sep"> \u203a </span><span class="bc-item bc-link" onclick="goLevel(3)">' + currentDecade + '\u2013' + (currentDecade + 10) + '</span>';
  if (currentLevel === 4 && currentYear !== null)
    html += '<span class="bc-sep"> \u203a </span><span class="bc-item">' + currentYear + '</span>';
  document.getElementById('breadcrumb').innerHTML = html;
}

function updateNavButtons() {
  document.querySelectorAll('.nav-btn').forEach(function(btn, i) {
    btn.classList.toggle('active', i + 1 === currentLevel);
    btn.disabled = (i === 1 && currentCentury === null) || (i === 2 && currentDecade  === null) || (i === 3 && currentDecade  === null);
  });
  var btn4 = document.getElementById('btn-level4');
  if (btn4) {
    btn4.disabled = (currentDecade === null);
    btn4.classList.toggle('active', currentLevel === 4);
  }
  var prev = document.getElementById('btn-prev');
  var next = document.getElementById('btn-next');
  var lbl  = document.getElementById('decade-label');
  if (!prev || !next) return;
  var show = ((currentLevel === 3 || currentLevel === 4) && currentDecade !== null);
  prev.style.display = show ? 'inline-block' : 'none';
  next.style.display = show ? 'inline-block' : 'none';
  if (lbl) lbl.style.display = show ? 'inline-block' : 'none';
  if (show) {
    prev.disabled = currentLevel === 4 ? currentYear <= 1290 : currentDecade <= 1290;
    next.disabled = currentLevel === 4 ? currentYear >= 1509 : currentDecade >= 1500;
    if (lbl) lbl.textContent = currentLevel === 4 ? currentYear + '' : currentDecade + '\u2013' + (currentDecade + 10);
  }
  updateDetailBar();
  var showNav = currentLevel >= 2;
  if (prev) prev.style.display = showNav ? '' : 'none';
  if (next) next.style.display = showNav ? '' : 'none';
  if (lbl)  lbl.style.display  = showNav ? '' : 'none';
  if (showNav) {
    var atStart, atEnd;
    if (currentLevel === 2) {
      atStart = currentCentury <= 1300;
      atEnd   = currentCentury >= 1400;
      if (lbl) lbl.textContent = currentCentury + '–' + (currentCentury + 100);
    } else if (currentLevel === 3) {
      atStart = currentDecade <= 1290;
      atEnd   = currentDecade >= 1490;
      if (lbl) lbl.textContent = currentDecade + '–' + (currentDecade + 9);
    } else {
      atStart = currentYear <= 1290;
      atEnd   = currentYear >= 1509;
      if (lbl) lbl.textContent = currentYear + '';
    }
    if (prev) prev.disabled = atStart;
    if (next) next.disabled = atEnd;
  }
}

function pct(year, start, end) {
  return ((year - start) / (end - start) * 100).toFixed(3) + '%';
}

/* ── Recherche ──────────────────────────────────────────────────────*/
var savedActiveZones = null;
var savedCurrentLevel   = null;
var savedCurrentCentury = null;
var savedCurrentDecade  = null;
var savedCurrentYear    = null;

function onSearch(val) {
  searchTerm = (val || '').trim().toLowerCase();
  var clearBtn = document.getElementById('search-clear');
  if (clearBtn) clearBtn.style.display = searchTerm ? 'inline-block' : 'none';
  if (searchTerm) {
    if (!savedActiveZones) {
      savedActiveZones    = {};
      for (var z in activeZones) savedActiveZones[z] = activeZones[z];
      savedCurrentLevel   = currentLevel;
      savedCurrentCentury = currentCentury;
      savedCurrentDecade  = currentDecade;
      savedCurrentYear    = currentYear;
    }
    var matches = allEvents.filter(function(e) { return eventMatchesSearch(e); });
    if (matches.length === 0) {
      updateFilterCheckboxes();
      refreshFrise();
      applySearch();
      return;
    }
    ZONES.forEach(function(z) {
      activeZones[z] = matches.some(function(e) { return e.zones.indexOf(z) !== -1; });
    });
    updateFilterCheckboxes();
    var maxType = 1;
    matches.forEach(function(e) { var t = e.type || 1; if (t > maxType) maxType = t; });
    var neededLevel = maxType;
    var earliest = matches.reduce(function(min, e) { return e.date < min ? e.date : min; }, matches[0].date);
    if (neededLevel === 1) {
      renderLevel(1);
    } else if (neededLevel === 2) {
      currentCentury = Math.floor(earliest / 100) * 100;
      renderLevel(2, currentCentury);
    } else if (neededLevel === 3) {
      currentCentury = Math.floor(earliest / 100) * 100;
      currentDecade  = Math.floor(earliest / 10) * 10;
      renderLevel(3, currentDecade);
    } else {
      currentCentury = Math.floor(earliest / 100) * 100;
      currentDecade  = Math.floor(earliest / 10) * 10;
      currentYear    = earliest;
      renderLevel(4, earliest);
    }
  } else {
    if (savedActiveZones) {
      activeZones = savedActiveZones;
      savedActiveZones = null;
      if (savedCurrentLevel !== null) {
        currentLevel   = savedCurrentLevel;
        currentCentury = savedCurrentCentury;
        currentDecade  = savedCurrentDecade;
        currentYear    = savedCurrentYear;
        savedCurrentLevel = null;
        if      (currentLevel === 1) renderLevel(1);
        else if (currentLevel === 2) renderLevel(2, currentCentury);
        else if (currentLevel === 3) renderLevel(3, currentDecade);
        else                         renderLevel(4, currentYear);
      } else {
        updateFilterCheckboxes();
        refreshFrise();
      }
    }
  }
  applySearch();
}

function goToMatch(idx) {
  if (matchedIds.length === 0) return;
  idx = ((idx % matchedIds.length) + matchedIds.length) % matchedIds.length;
  currentMatchIdx = idx;
  var id  = matchedIds[idx];
  var evt = allEvents.find(function(e) { return e.id === id; });
  if (!evt) return;

  var date = evt.date;
  if (currentLevel === 4) {
    if (date !== currentYear) { currentYear = date; renderLevel(4, date); }
  } else if (currentLevel === 3) {
    var dec = Math.floor(date / 10) * 10;
    if (dec !== currentDecade) { currentDecade = dec; currentCentury = Math.floor(dec/100)*100; renderLevel(3, dec); }
  } else if (currentLevel === 2) {
    var cent = Math.floor(date / 100) * 100;
    if (cent !== currentCentury) { currentCentury = cent; renderLevel(2, cent); }
  }

  applySearch();
  setTimeout(function() {
    var chip = document.querySelector('.evt-chip[data-evt-id="' + id + '"]');
    if (chip) chip.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 150);
}

function prevMatch() { goToMatch(currentMatchIdx - 1); }
function nextMatch() { goToMatch(currentMatchIdx + 1); }

function clearSearch() {
  var input = document.getElementById('search-input');
  if (input) input.value = '';
  searchTerm = '';
  var clearBtn = document.getElementById('search-clear');
  if (clearBtn) clearBtn.style.display = 'none';
  var countEl = document.getElementById('search-count');
  if (countEl) countEl.textContent = '';
  matchedIds = []; currentMatchIdx = -1;
  if (savedActiveZones) {
    activeZones = savedActiveZones;
    savedActiveZones = null;
    if (savedCurrentLevel !== null) {
      currentLevel   = savedCurrentLevel;
      currentCentury = savedCurrentCentury;
      currentDecade  = savedCurrentDecade;
      currentYear    = savedCurrentYear;
      savedCurrentLevel = null;
      if      (currentLevel === 1) renderLevel(1);
      else if (currentLevel === 2) renderLevel(2, currentCentury);
      else if (currentLevel === 3) renderLevel(3, currentDecade);
      else                         renderLevel(4, currentYear);
    } else {
      updateFilterCheckboxes();
      refreshFrise();
    }
  }
  applySearch();
}

function eventMatchesSearch(evt) {
  if (!searchTerm) return true;
  var haystack = [
    evt.titre || '',
    evt.description || '',
    evt.sources || '',
    (evt.zones || []).join(' ')
  ].join(' ').toLowerCase();
  return haystack.indexOf(searchTerm.toLowerCase()) !== -1;
}

function applySearch() {
  var chips   = document.querySelectorAll('.evt-chip');
  var countEl = document.getElementById('search-count');
  if (!searchTerm) {
    chips.forEach(function(c) { c.classList.remove('search-match','search-dim'); });
    document.querySelectorAll('.track-row').forEach(function(r) { r.classList.remove('search-hidden'); });
    document.querySelectorAll('.zone-checkbox').forEach(function(lbl) {
      lbl.style.opacity       = '1';
      lbl.style.pointerEvents = '';
    });
    if (countEl) countEl.textContent = '';
    return;
  }
  var matchByZone = {};
  var totalMatch  = 0;
  chips.forEach(function(chip) {
    var id  = parseInt(chip.dataset.evtId, 10);
    var evt = allEvents.find(function(e) { return e.id === id; });
    if (evt && eventMatchesSearch(evt)) {
      chip.classList.add('search-match');
      chip.classList.remove('search-dim');
      totalMatch++;
      (evt.zones || []).forEach(function(z) { matchByZone[z] = true; });
    } else {
      chip.classList.add('search-dim');
      chip.classList.remove('search-match');
    }
  });
  document.querySelectorAll('.track-row').forEach(function(row) {
    var zone = row.dataset.zone;
    if (zone) row.classList.toggle('search-hidden', !matchByZone[zone]);
  });
  document.querySelectorAll('.zone-checkbox').forEach(function(lbl) {
    var zone = lbl.dataset.zone;
    if (!zone) return;
    var hasMatch = !!matchByZone[zone];
    lbl.style.opacity    = hasMatch ? '1' : '0.3';
    lbl.style.pointerEvents = hasMatch ? '' : 'none';
  });
  matchedIds = allEvents.filter(function(e) { return eventMatchesSearch(e); }).map(function(e) { return e.id; });
  if (currentMatchIdx < 0 || currentMatchIdx >= matchedIds.length) {
    currentMatchIdx = matchedIds.length > 0 ? 0 : -1;
  }
  if (countEl) {
    if (matchedIds.length > 0) {
      var pos = currentMatchIdx >= 0 ? (currentMatchIdx + 1) : 1;
      countEl.innerHTML = '<span class="match-nav" onclick="prevMatch()" title="Résultat précédent">&#8249;</span>'
        + '<span class="match-pos">' + pos + '&thinsp;/&thinsp;' + matchedIds.length + '</span>'
        + '<span class="match-nav" onclick="nextMatch()" title="Résultat suivant">&#8250;</span>';
    } else {
      countEl.textContent = 'Aucun résultat';
    }
  }
}

function updatePeriodBanner(level, rangeStart) {
  var lbl     = document.getElementById('pb-label');
  var sub     = document.getElementById('pb-sub');
  var banner  = document.getElementById('period-banner');
  if (!lbl || !sub) return;
  if (banner) banner.classList.toggle('pb-decade', level === 3);
  var ROMAN = { 1000:'XIe', 1100:'XIIe', 1200:'XIIIe', 1300:'XIVe', 1400:'XVe', 1500:'XVIe' };
  if (level === 1) {
    lbl.textContent = 'XIVe et XVe siècle';
    sub.textContent = '1300 — 1500';
  } else if (level === 2) {
    var cent = Math.floor(rangeStart / 100) * 100;
    var rom  = ROMAN[cent] || (cent + 1) + 'e';
    lbl.textContent = rom + ' siècle';
    sub.textContent = rangeStart + ' — ' + (rangeStart + 100);
  } else if (level === 3) {
    var cent2 = Math.floor(rangeStart / 100) * 100;
    var rom2  = ROMAN[cent2] || (cent2 + 1) + 'e';
    lbl.textContent = rangeStart + ' – ' + (rangeStart + 9);
    sub.textContent = rom2 + ' siècle — décennie ' + rangeStart;
  } else if (level === 4) {
    var cent3 = Math.floor(rangeStart / 100) * 100;
    var rom3  = ROMAN[cent3] || (cent3 + 1) + 'e';
    lbl.textContent = 'Année ' + rangeStart;
    sub.textContent = rom3 + ' siècle';
  }
}

function updateFilterCheckboxes() {
  document.querySelectorAll('.zone-checkbox').forEach(function(lbl) {
    var inp  = lbl.querySelector('input');
    if (!inp) return;
    var zone = inp.value || lbl.dataset.zone;
    if (!zone) return;
    inp.checked = !!activeZones[zone];
    lbl.classList.toggle('checked',   !!activeZones[zone]);
    lbl.classList.toggle('unchecked', !activeZones[zone]);
    lbl.style.opacity       = '';
    lbl.style.pointerEvents = '';
  });
}

function highlightText(text) {
  if (!text) return '';
  var escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  if (!searchTerm) return escaped;
  var words = searchTerm.split(/\s+/).filter(Boolean);
  words.forEach(function(word) {
    var safe = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    try {
      var re = new RegExp('(' + safe + ')', 'gi');
      escaped = escaped.replace(re, '<mark style="background:#FFE066;color:#1C140A;border-radius:2px;padding:0 2px;">$1</mark>');
    } catch(e) {}
  });
  return escaped;
}

function extractYouTubeId(url) {
  if (!url || !url.trim()) return '';
  var m;
  m = url.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  m = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  m = url.match(/embed\/([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return '';
}

/* ── Init ────────────────────────────────────────────────────────────*/
var MUSIC_TRACKS  = [
  'audio/Guillaume_de_Machaut_Je_vivroie_liementLiement_me_deport.mp3',
  'audio/Guillaume_de_Machaut_Jaim_sans_penser.mp3',
  'audio/Douce_Dame_Jolie Guillaume de Machaut.mp3'
];
var musicTrackIdx = 0;
var musicStarted  = false;

function initMusicPlayer() {
  var audio = document.getElementById('music-audio');
  if (!audio) return;
  audio.volume = 0.28;
  audio.src    = MUSIC_TRACKS[0];
  audio.addEventListener('ended', function() {
    musicTrackIdx = (musicTrackIdx + 1) % MUSIC_TRACKS.length;
    audio.src = MUSIC_TRACKS[musicTrackIdx];
    audio.play().catch(function(){});
  });
  document.addEventListener('click', function firstClick() {
    if (audio.paused) audio.play().catch(function(){});
    updateMusicBtn();
    document.removeEventListener('click', firstClick);
  });
  var btn = document.getElementById('music-toggle');
  if (btn) btn.classList.remove('muted');
}

function startMusic() {
  initMusicPlayer();
}

function toggleMusic() {
  var audio = document.getElementById('music-audio');
  if (!audio) return;
  if (!audio.src || audio.src === window.location.href) {
    initMusicPlayer();
  }
  if (audio.paused) {
    musicStarted = true;
    audio.play().catch(function(e) { console.warn('Lecture audio impossible :', e); });
  } else {
    audio.pause();
  }
  setTimeout(updateMusicBtn, 80);
}

function updateMusicBtn() {
  var audio  = document.getElementById('music-audio');
  var btn    = document.getElementById('music-toggle');
  var status = document.getElementById('music-status');
  if (!audio || !btn) return;
  var playing = !audio.paused && audio.currentTime > 0;
  btn.classList.remove('muted');
  if (status) status.textContent = playing ? '\u23F8' : '\u25B6';
}

document.addEventListener('DOMContentLoaded', function() {
  initActiveZones();
  document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeLightbox(); closeZonesModal(); }
    if (e.key === 'Escape') {
      closeModal();
      if (searchTerm) clearSearch();
    }
    if (!document.getElementById('modal-overlay').classList.contains('open')) {
      if (e.key === 'ArrowLeft')  navigateDecade(-1);
      if (e.key === 'ArrowRight') navigateDecade(1);
    }
  });
  loadEvents();
});

/* --- NOUVELLE FONCTION DES ÉVÉNEMENTS LONGS --- */
function openLightboxById(id) {
  var evt = allEvents.find(function(e) { return e.id === id; });
  if (evt) {
    openModal(evt, evt.zones[0]); 
  }
}
