/* frise.js — Frise chronologique medievale 1300-1500 */

var ZONES = [
  'France', 'Angleterre', 'St Empire', 'Papaute',
  'Naples', 'Italie', 'Castille', 'Aragon', 'Portugal', 'Hongrie',
  'Europe C. & Or.', 'Pologne', 'Russie', 'Scandinavie',
  'Byzance', 'Ottomans', 'Monde islamique', 'Orient',
  'Japon', 'Chine', 'Inde', 'Monde',
  'Alsace',
  'Art', 'Techniques', 'Sciences', 'Idees', 'Litterature'
];

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
  'Scandinavie':         { bg: '#2A4A6B', light: '#DCE8F5', text: '#162B40' }
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
  'Literature':          'Litterature'
};

var ROW_H    = 28;
var ROW_GAP  = 5;
var CHIP_PAD = 6;
var TRACK_PX = 820;

var currentLevel   = 1;
var currentYear    = null;
var searchTerm     = '';
var currentCentury = null;
var currentDecade  = null;
var allEvents      = [];
var activeZones    = null;

function initActiveZones() {
  activeZones = {};
  for (var i = 0; i < ZONES.length; i++) activeZones[ZONES[i]] = false;
  activeZones['France'] = true;  /* Seule la France active par défaut */
}

function normalizeZone(z) {
  return ZONE_ALIASES[z] || z;
}

function visibleAtLevel(evt, level) {
  var t = (evt.type === undefined || evt.type === null || evt.type === '') ? 1 : parseInt(evt.type, 10);
  if (isNaN(t) || t === 1) return true;   /* Majeur    : tous niveaux */
  if (t === 2) return level >= 2;          /* Important : siècle, décennie, année */
  if (t === 3) return level >= 3;          /* National  : décennie, année */
  if (t === 4) return level >= 4;          /* Local     : année uniquement */
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
        renderLevel(1);
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
    start = rangeStart; end = rangeStart + 100; tickStep = 10;
  } else if (level === 3) {
    currentDecade = rangeStart;
    start = rangeStart; end = rangeStart + 10; tickStep = 1;
  } else {
    currentYear = rangeStart;
    currentDecade = Math.floor(rangeStart / 10) * 10;
    currentCentury = Math.floor(rangeStart / 100) * 100;
    start = rangeStart; end = rangeStart + 1; tickStep = 0.0833; /* 1/12 */
  }

  updateBreadcrumb();
  updateNavButtons();
  updatePeriodBanner(level, rangeStart || 1300);

  var container = document.getElementById('frise-container');
  container.innerHTML = '';
  container.appendChild(buildAxis(start, end, tickStep, level));

  /* ── Section Rulers globale en haut ── */
  var rulersSection = buildRulersSection(start, end, level);
  if (rulersSection) container.appendChild(rulersSection);

  /* ── Zones événements ── */
  for (var i = 0; i < ZONES.length; i++) {
    var zone = ZONES[i];
    if (!activeZones[zone]) continue;
    var evts = [];
    for (var j = 0; j < allEvents.length; j++) {
      var e = allEvents[j];
      if (e.zones.indexOf(zone) === -1) continue;
      if (!visibleAtLevel(e, level)) continue;
      if (e.regne) continue;  /* règnes déjà affichés dans rulersSection */
      var eDateF = e.date + (e.mois ? (e.mois - 1) / 12 : 0);
      var fin = (e.date_fin && e.date_fin > e.date)
        ? e.date_fin + (e.mois_fin ? (e.mois_fin - 1) / 12 : 0)
        : eDateF;
      if (level === 4) {
        if (eDateF > end || fin < start) continue;
      } else {
        if (e.date > end || (e.date_fin ? e.date_fin : e.date) < start) continue;
      }
      evts.push(e);
    }
    container.appendChild(buildTrack(zone, evts, start, end, level));
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
  /* Ré-applique la recherche si active */
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

  /* Au niveau 4, les ticks génériques sont supprimés — seuls les mois s'affichent */
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
        bar.appendChild(makeBand(decade, decade + 10, start, end, function() {
          renderLevel(3, decade);
        }));
      })(d);
    }
  } else if (level === 3) {
    /* Bandes annuelles cliquables */
    for (var y = currentDecade; y < currentDecade + 10; y++) {
      (function(yr) {
        var band = makeBand(yr, yr + 1, start, end, function() {
          renderLevel(4, yr);
        });
        band.classList.add('axis-band-year');
        bar.appendChild(band);
      })(y);
    }
  } else if (level === 4) {
    /* Bandes mensuelles */
    var MOIS = ['Jan','év','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
    for (var m = 0; m < 12; m++) {
      var mStart = currentYear + m / 12;
      var mEnd   = currentYear + (m + 1) / 12;
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
  if (level === 4) return (Math.min(evt.titre.length, 35) * 7 + 16) / TRACK_PX * 100;
  return (Math.min(evt.titre.length, level === 3 ? 28 : 20) * 7 + 16) / TRACK_PX * 100;
}

function assignRows(evts, start, end, level) {
  var rowEnds = [];
  var reignEnds = [];          /* file dédiée aux règnes */
  var gap = CHIP_PAD / TRACK_PX * 100;
  return evts.map(function(evt) {
    /* Les règnes ont leur propre file (rowIndex 0) sans collision */
    if (evt.regne) {
      var d0r = evt.date, d1r = evt.date_fin || evt.date;
      var placed = false;
      for (var ri = 0; ri < reignEnds.length; ri++) {
        if (d0r >= reignEnds[ri]) {
          reignEnds[ri] = d1r + gap;
          return ri;           /* rowIndex dans la zone règne */
        }
      }
      reignEnds.push(d1r + gap);
      return reignEnds.length - 1;
    }
    var isPeriod = evt.date_fin && evt.date_fin > evt.date;
    var left = isPeriod
      ? (Math.max(evt.date, start) - start) / (end - start) * 100
      : (evt.date - start) / (end - start) * 100;
    var right = left + chipW(evt, start, end, level);
    var row = 0;
    while (row < rowEnds.length && rowEnds[row] > left - gap) row++;
    rowEnds[row] = right;
    return row;
  });
}

/* ── Piste ───────────────────────────────────────────────────────────*/
/* ── Section Rulers globale ─────────────────────────────────────────*/
function buildRulersSection(start, end, level) {
  /* Collecte les règnes visibles par zone */
  var byZone = {};
  for (var zi = 0; zi < ZONES.length; zi++) {
    var zone = ZONES[zi];
    if (!activeZones[zone]) continue;
    var zoneReigns = [];
    for (var j = 0; j < allEvents.length; j++) {
      var e = allEvents[j];
      if (!e.regne) continue;
      if (e.zones.indexOf(zone) === -1) continue;
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

  /* Conteneur global */
  var section = document.createElement('div');
  section.className = 'rulers-section';

  /* Titre de section */
  var sectionTitle = document.createElement('div');
  sectionTitle.className = 'rulers-section-title';
  sectionTitle.textContent = '♛ Souverains';
  section.appendChild(sectionTitle);

  /* Une ligne par zone */
  var RULER_H = 22;
  var RULER_GAP = 3;

  for (var zi = 0; zi < zonesWithReigns.length; zi++) {
    var z = zonesWithReigns[zi];
    var col = COLORS[z] || COLORS['France'];
    var zReigns = byZone[z];

    var row = document.createElement('div');
    row.className = 'rulers-zone-row';

    /* Label zone */
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

    /* Track des rulers */
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

function buildTrack(zone, evts, start, end, level) {
  var col = COLORS[zone] || COLORS['France'];
  var row = document.createElement('div');
  row.className = 'track-row';
  row.dataset.zone = zone;

  /* Label zone */
  var lbl = document.createElement('div');
  lbl.className = 'zone-label';
  var dot = document.createElement('span');
  dot.className = 'zone-dot';
  dot.style.background = col.bg;
  lbl.appendChild(dot);
  lbl.appendChild(document.createTextNode(zone));
  row.appendChild(lbl);

  /* Filtre les événements dans la plage (règnes déjà exclus par renderLevel) */
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

  /* Dégradé diagonal : couleur bg → couleur light pour différencier des events */
  chip.style.background    = 'linear-gradient(135deg, ' + col.bg + 'EE 0%, ' + col.bg + 'AA 100%)';
  chip.style.borderLeft    = '4px solid ' + col.bg;
  chip.style.borderTop     = '1px solid ' + col.bg + '66';
  chip.style.borderBottom  = '1px solid ' + col.bg + '33';
  chip.style.borderRight   = 'none';
  chip.style.borderRadius  = '0 4px 4px 0';
  chip.style.color         = '#fff';
  chip.style.fontSize      = '0.72rem';
  chip.style.fontWeight    = '700';
  chip.style.fontStyle     = 'normal';
  chip.style.letterSpacing = '0.02em';
  chip.style.textShadow    = '0 1px 2px rgba(0,0,0,0.35)';
  chip.style.boxShadow     = '0 2px 6px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.15)';
  chip.style.display       = 'flex';
  chip.style.alignItems    = 'center';
  chip.style.justifyContent= 'center';   /* centrage horizontal */
  chip.style.textAlign     = 'center';
  chip.style.overflow      = 'hidden';
  chip.style.whiteSpace    = 'nowrap';
  chip.style.boxSizing     = 'border-box';
  chip.style.minWidth      = '4px';
  chip.style.cursor        = 'pointer';

  /* Texte selon niveau de zoom — centré */
  if (level > 1) {
    var maxC = level === 4 ? 36 : level === 3 ? 26 : 18;
    var titre = evt.titre.length > maxC
      ? evt.titre.slice(0, maxC - 1) + '\u2026'
      : evt.titre;
    chip.textContent = titre;
  }
  chip.title = '\u265b ' + evt.titre
    + ' (' + evt.date + (evt.date_fin ? '\u2013' + evt.date_fin : '') + ')';

  chip.addEventListener('click', (function(e, z) {
    return function(ev) { ev.stopPropagation(); openModal(e, z); };
  })(evt, zone));

  return chip;
}

/* ── Chip ────────────────────────────────────────────────────────────*/
function buildChip(evt, zone, start, end, level, rowIndex) {
  var col      = COLORS[zone] || COLORS['France'];
  var isPeriod = evt.date_fin && evt.date_fin > evt.date;
  var type     = Number(evt.type) || 1;
  var chip     = document.createElement('div');
  chip.className      = 'evt-chip';
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
    chip.style.background  = col.bg + (type === 3 ? '88' : 'CC');
    chip.style.borderColor = col.bg;
    chip.style.color       = '#fff';
    if (level > 1) {
      var mx = level === 3 ? 40 : 22;
      var titreP = evt.titre.length > mx ? evt.titre.slice(0, mx - 1) + '\u2026' : evt.titre;
      chip.textContent = (type === 1 && !evt.regne ? '\u2605 ' : '') + titreP;
    }
    chip.title = evt.titre + ' (' + evt.date + (evt.date_fin ? '\u2013' + evt.date_fin : '') + ')';

  } else {
    chip.style.height    = ROW_H + 'px';
    var evtDateF = evt.date + (evt.mois ? (evt.mois - 1) / 12 : 0);
    chip.style.left      = pct(evtDateF, start, end);
    chip.style.transform = 'translateX(-50%)';

    if (level === 4 || level === 3) {
      chip.classList.add('chip-full');
      if (type === 1) chip.classList.add('chip-type1');
      if (type === 3) chip.classList.add('chip-type3');
      chip.style.background = col.bg;
      chip.style.color      = '#fff';
      var maxC = level === 4 ? 38 : 26;
      var titreF = evt.titre.length > maxC ? evt.titre.slice(0, maxC - 2) + '\u2026' : evt.titre;
      chip.textContent = (type === 1 && !evt.regne ? '\u2605 ' : '') + titreF;
    } else if (level === 2) {
      chip.classList.add('chip-medium');
      if (type === 1) chip.classList.add('chip-type1');
      if (type === 3) chip.classList.add('chip-type3');
      chip.style.background  = col.light;
      chip.style.color       = col.text;
      chip.style.borderColor = col.bg;
      var titreM = evt.titre.length > 20 ? evt.titre.slice(0, 18) + '\u2026' : evt.titre;
      chip.textContent = (type === 1 && !evt.regne ? '\u2605 ' : '') + titreM;
    } else {
      chip.classList.add('chip-dot');
      var sz = type === 1 ? 13 : type === 3 ? 7 : 10;
      chip.style.background   = col.bg;
      chip.style.width        = sz + 'px';
      chip.style.height       = sz + 'px';
      chip.style.top          = (4 + rowIndex * (ROW_H + ROW_GAP) + ROW_H / 2 - sz / 2) + 'px';
      chip.style.borderRadius = '50%';
    }
    chip.title = evt.titre + ' (' + evt.date + ')';
  }

  chip.addEventListener('click', (function(e, z) {
    return function(ev) { ev.stopPropagation(); openModal(e, z); };
  })(evt, zone));
  return chip;
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
    typeEl.textContent = t === 1 ? '⬛ Niveau 1 — toutes échelles'
                       : t === 2 ? '🔲 Niveau 2 — siècle, décennie, année'
                       : t === 3 ? '▪ Niveau 3 — décennie & année'
                       :           '· Niveau 4 — année uniquement';
    typeEl.className = 'modal-type-badge type' + t;
  }

  var MOIS_L = ['janvier','février','mars','avril','mai','juin',
                'juillet','août','septembre','octobre','novembre','décembre'];
  var dateStr = evt.mois ? MOIS_L[evt.mois - 1] + ' ' + evt.date : evt.date + ' apr. J.-C.';
  if (evt.date_fin && evt.date_fin > evt.date) {
    var finStr = evt.mois_fin ? MOIS_L[evt.mois_fin - 1] + ' ' + evt.date_fin : evt.date_fin + ' apr. J.-C.';
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

  document.getElementById('modal-sources').textContent =
    evt.sources ? '\uD83D\uDCD6 ' + evt.sources : '';

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
    imgWrap.style.display = 'block';
  } else {
    imgWrap.style.display = 'none';
    imgEl.src = '';
  }

  /* ── Vidéo YouTube ── */
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

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  /* Arrête la vidéo YouTube en vidant l'iframe */
  var vw = document.getElementById('modal-video-wrap');
  if (vw) { vw.innerHTML = ''; vw.style.display = 'none'; }
}

/* ── Navigation ──────────────────────────────────────────────────────*/
/* ── Zoom + / Zoom - ────────────────────────────────────────────────*/
function zoomIn() {
  /* Descend d'un niveau (vue plus détaillée) */
  if (currentLevel === 1) {
    /* Depuis vue ensemble → vue siècle : centre sur 1400 par défaut */
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
  /* Monte d'un niveau (vue plus large) */
  if (currentLevel === 4) {
    renderLevel(3, currentDecade);
  } else if (currentLevel === 3) {
    renderLevel(2, currentCentury);
  } else if (currentLevel === 2) {
    renderLevel(1);
  }
}

function goLevel(level) {
  if      (level === 1)                             renderLevel(1);
  else if (level === 2 && currentCentury !== null)  renderLevel(2, currentCentury);
  else if (level === 3 && currentDecade  !== null)  renderLevel(3, currentDecade);
  else if (level === 4 && currentYear    !== null)  renderLevel(4, currentYear);
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
    html += '<span class="bc-sep"> \u203a </span><span class="bc-item bc-link" onclick="goLevel(2)">'
          + currentCentury + '\u2013' + (currentCentury + 100) + '</span>';
  if (currentLevel >= 3 && currentDecade !== null)
    html += '<span class="bc-sep"> \u203a </span><span class="bc-item bc-link" onclick="goLevel(3)">'
          + currentDecade + '\u2013' + (currentDecade + 10) + '</span>';
  if (currentLevel === 4 && currentYear !== null)
    html += '<span class="bc-sep"> \u203a </span><span class="bc-item">' + currentYear + '</span>';
  document.getElementById('breadcrumb').innerHTML = html;
}

function updateNavButtons() {
  document.querySelectorAll('.nav-btn').forEach(function(btn, i) {
    btn.classList.toggle('active', i + 1 === currentLevel);
    btn.disabled = (i === 1 && currentCentury === null)
                || (i === 2 && currentDecade  === null)
                || (i === 3 && currentDecade  === null);
  });
  /* Bouton vue annuelle */
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
    if (lbl) lbl.textContent = currentLevel === 4
      ? currentYear + ''
      : currentDecade + '\u2013' + (currentDecade + 10);
  }
  /* Boutons zoom */
  var btnZoomIn  = document.getElementById('btn-zoom-in');
  var btnZoomOut = document.getElementById('btn-zoom-out');
  if (btnZoomIn)  btnZoomIn.disabled  = (currentLevel === 4);
  if (btnZoomOut) btnZoomOut.disabled = (currentLevel === 1);

  /* Boutons période précédente / suivante : visibles dès le niveau 2 */
  var prev = document.getElementById('btn-prev');
  var next = document.getElementById('btn-next');
  var lbl  = document.getElementById('decade-label');
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
      if (lbl) lbl.textContent = currentDecade + '–' + (currentDecade + 10);
    } else {
      atStart = currentYear <= 1290;
      atEnd   = currentYear >= 1509;
      if (lbl) lbl.textContent = currentYear + '';
    }
    if (prev) prev.disabled = atStart;
    if (next) next.disabled = atEnd;
  }
}

/* ── Utilitaires ─────────────────────────────────────────────────────*/
function pct(year, start, end) {
  return ((year - start) / (end - start) * 100).toFixed(3) + '%';
}


/* ── Recherche ──────────────────────────────────────────────────────*/
/* Sauvegarde des zones actives avant toute recherche */
var savedActiveZones = null;

/* Sauvegarde du niveau et de la date avant recherche */
var savedCurrentLevel   = null;
var savedCurrentCentury = null;
var savedCurrentDecade  = null;
var savedCurrentYear    = null;

function onSearch(val) {
  searchTerm = (val || '').trim().toLowerCase();
  var clearBtn = document.getElementById('search-clear');
  if (clearBtn) clearBtn.style.display = searchTerm ? 'inline-block' : 'none';

  if (searchTerm) {
    /* Sauvegarde l'état initial (zones + niveau + dates) */
    if (!savedActiveZones) {
      savedActiveZones    = {};
      for (var z in activeZones) savedActiveZones[z] = activeZones[z];
      savedCurrentLevel   = currentLevel;
      savedCurrentCentury = currentCentury;
      savedCurrentDecade  = currentDecade;
      savedCurrentYear    = currentYear;
    }

    /* Trouve tous les événements correspondants (tous types, toutes zones) */
    var matches = allEvents.filter(function(e) { return eventMatchesSearch(e); });

    if (matches.length === 0) {
      updateFilterCheckboxes();
      refreshFrise();
      applySearch();
      return;
    }

    /* Active les zones qui ont des résultats */
    ZONES.forEach(function(z) {
      activeZones[z] = matches.some(function(e) {
        return e.zones.indexOf(z) !== -1;
      });
    });
    updateFilterCheckboxes();

    /* Niveau minimal nécessaire : type 1→niv1, type 2→niv2, type 3→niv3, type 4→niv4 */
    var maxType = 1;
    matches.forEach(function(e) { var t = e.type || 1; if (t > maxType) maxType = t; });
    var neededLevel = maxType;

    /* Date du résultat le plus ancien */
    var earliest = matches.reduce(function(min, e) {
      return e.date < min ? e.date : min;
    }, matches[0].date);

    /* Navigue au bon niveau avec les bonnes variables globales */
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
    /* Efface : restaure l'état d'origine */
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

function clearSearch() {
  var input = document.getElementById('search-input');
  if (input) input.value = '';
  searchTerm = '';
  var clearBtn = document.getElementById('search-clear');
  if (clearBtn) clearBtn.style.display = 'none';
  var countEl = document.getElementById('search-count');
  if (countEl) countEl.textContent = '';
  /* Restaure les zones et le niveau d'origine */
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
  return searchTerm.split(/\s+/).filter(Boolean).every(function(w) {
    return haystack.indexOf(w) !== -1;
  });
}

function applySearch() {
  /* Surligne les chips correspondants */
  var chips   = document.querySelectorAll('.evt-chip');
  var countEl = document.getElementById('search-count');

  if (!searchTerm) {
    chips.forEach(function(c) { c.classList.remove('search-match','search-dim'); });
    /* Ré-affiche toutes les pistes et restaure les filtres */
    document.querySelectorAll('.track-row').forEach(function(r) {
      r.classList.remove('search-hidden');
    });
    document.querySelectorAll('.zone-checkbox').forEach(function(lbl) {
      lbl.style.opacity       = '1';
      lbl.style.pointerEvents = '';
    });
    if (countEl) countEl.textContent = '';
    return;
  }

  /* Compte les correspondances par piste */
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

  /* Masque les pistes ET décoche les filtres des zones sans résultat */
  document.querySelectorAll('.track-row').forEach(function(row) {
    var zone = row.dataset.zone;
    if (zone) row.classList.toggle('search-hidden', !matchByZone[zone]);
  });

  /* Grise les cases à cocher des zones sans résultat */
  document.querySelectorAll('.zone-checkbox').forEach(function(lbl) {
    var inp  = lbl.querySelector('input');
    var zone = lbl.dataset.zone;
    if (!zone) return;
    var hasMatch = !!matchByZone[zone];
    lbl.style.opacity    = hasMatch ? '1' : '0.3';
    lbl.style.pointerEvents = hasMatch ? '' : 'none';
  });

  if (countEl) {
    countEl.textContent = totalMatch > 0
      ? totalMatch + ' résultat' + (totalMatch > 1 ? 's' : '')
      : 'Aucun résultat';
  }
}


/* ── Cartouche de période ────────────────────────────────────────────*/
function updatePeriodBanner(level, rangeStart) {
  var lbl = document.getElementById('pb-label');
  var sub = document.getElementById('pb-sub');
  if (!lbl || !sub) return;

  var ROMAN = {
    1000:'XIe', 1100:'XIIe', 1200:'XIIIe',
    1300:'XIVe', 1400:'XVe', 1500:'XVIe'
  };

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
    lbl.textContent = rom2 + ' siècle — décennie ' + rangeStart;
    sub.textContent = rangeStart + ' — ' + (rangeStart + 10);
  } else if (level === 4) {
    var cent3 = Math.floor(rangeStart / 100) * 100;
    var rom3  = ROMAN[cent3] || (cent3 + 1) + 'e';
    lbl.textContent = 'Année ' + rangeStart;
    sub.textContent = rom3 + ' siècle';
  }
}

/* ── Mise à jour des cases à cocher du filtre ───────────────────────*/
function updateFilterCheckboxes() {
  document.querySelectorAll('.zone-checkbox').forEach(function(lbl) {
    var inp  = lbl.querySelector('input');
    if (!inp) return;
    var zone = inp.value || lbl.dataset.zone;
    if (!zone) return;
    inp.checked = !!activeZones[zone];
    lbl.classList.toggle('checked',   !!activeZones[zone]);
    lbl.classList.toggle('unchecked', !activeZones[zone]);
    /* Restaure l'opacité (peut avoir été grisée par applySearch) */
    lbl.style.opacity       = '';
    lbl.style.pointerEvents = '';
  });
}

/* ── Surlignage du terme recherché ──────────────────────────────────*/
function highlightText(text) {
  if (!text) return '';
  /* Échappe les caractères HTML */
  var escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  if (!searchTerm) return escaped;
  /* Surligne chaque mot du terme de recherche */
  var words = searchTerm.split(/\s+/).filter(Boolean);
  words.forEach(function(word) {
    /* Échappe les caractères spéciaux regex */
    var safe = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    try {
      var re = new RegExp('(' + safe + ')', 'gi');
      escaped = escaped.replace(re,
        '<mark style="background:#FFE066;color:#1C140A;border-radius:2px;padding:0 2px;">$1</mark>');
    } catch(e) {}
  });
  return escaped;
}

/* ── Extraction ID YouTube ─────────────────────────────────────────*/
function extractYouTubeId(url) {
  if (!url || !url.trim()) return '';
  /* Formats acceptés :
     https://www.youtube.com/watch?v=ID
     https://youtu.be/ID
     https://www.youtube.com/embed/ID
     ID seul (11 caractères)                */
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
document.addEventListener('DOMContentLoaded', function() {
  initActiveZones();
  document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
  document.addEventListener('keydown', function(e) {
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
