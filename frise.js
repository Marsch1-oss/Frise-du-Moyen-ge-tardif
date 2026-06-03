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

/* ── Couleurs Art par région géographique (détection automatique) ── */
var ART_REGIONS = [
  /* Couleurs proches des zones géographiques correspondantes */
  { name: 'Italie',     bg: '#1A6B3C', light: '#D5F5E3', text: '#0E3D22',
    keys: ['Florence','Florentin','Giotto','Duccio','Sienne','Siennois','Pisano',
           'Venise','Venezia','Milan','Milanese','Padoue','Vérone','Verona',
           'Orcagna','Martini','Lorenzetti','Cimabue','Gaddi','Traini',
           'Italie','Italian','Toscane','Toscan','Lombard'] },
  { name: 'France',     bg: '#1A3A6B', light: '#D6EAF8', text: '#0E1F40',
    keys: ['Paris','Parisien','Avignon','Bourgogne','Berry','France','Française',
           'Gothique','cathédrale','Duc de Berry','Limbourg','Fouquet',
           'Illumin','manuscrit','tapisserie','Île-de-France'] },
  { name: 'Flandres',   bg: '#5D4E37', light: '#EDE8E0', text: '#2E2418',
    keys: ['Flamand','Flandre','Bruges','Gand','Ghent','Bruxelles','Cologne',
           'Prague','Bohème','Rhin','Empire','Basse-Rhénanie','Westphalie',
           'Van Eyck','Van der Weyden','Memling','Bouts','Goes'] },
  { name: 'Espagne',    bg: '#7B2D8B', light: '#EAD9F7', text: '#4A1756',
    keys: ['Castille','Aragon','Hispano','Mudéjar','Espagne','Ibérique',
           'Catalane','Catalogne','Barcelone','Tolède','Séville'] },
  { name: 'Angleterre', bg: '#1F5C8B', light: '#D4E6F1', text: '#0D2E47',
    keys: ['Anglais','Angleterre','Londres','Westminster','Winchester',
           'Gloucester','Ely','Lincoln','Canterbury'] },
  { name: 'Orient',     bg: '#8B6914', light: '#FCF3CF', text: '#4A380A',
    keys: ['Byzantin','Constantinople','Persan','Ottoman','Mamlouk','Islam',
           'Mongol','Timouride','Iran','Arabe','Mosaïque','dorée'] },
];

function getArtColor(evt) {
  /* Retourne la couleur de région pour un événement Art, ou la couleur Art par défaut */
  if (evt.zones.indexOf('Art') === -1) return null;
  var text = ((evt.titre || '') + ' ' + (evt.description || '') + ' ' + (evt.legende || '')).toLowerCase();
  for (var i = 0; i < ART_REGIONS.length; i++) {
    var r = ART_REGIONS[i];
    for (var k = 0; k < r.keys.length; k++) {
      if (text.indexOf(r.keys[k].toLowerCase()) !== -1) {
        return { bg: r.bg, light: r.light, text: r.text, regionName: r.name };
      }
    }
  }
  return null; /* couleur Art générique */
}

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
var detailLevel    = 2;  /* 1=Siècle, 2=Important, 3=Détaillé, 4=Complet */
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
  /* Si un parcours est actif : seuls ses événements sont visibles */
  if (activeParcours) {
    return parseSeries(evt.serie).indexOf(activeParcours) !== -1;
  }

  /* Type 1=Règne  2=Siècle  3=Important  4=Détaillé  5=Complet
     Les règnes (type 1) sont affichés via buildRulersSection,
     pas dans la piste events — on les exclut ici             */
  var t = (evt.type === undefined || evt.type === null || evt.type === '')
        ? 2 : parseInt(evt.type, 10);
  if (isNaN(t) || t < 1) t = 2;

  /* Vue ensemble (level 1) : types 1 (règnes via RulersSection) → rien dans events */
  if (level === 1) return false;   /* les règnes passent par buildRulersSection */

  /* Vue siècle (level 2) : types 2 (Siècle) dans la piste events */
  if (level === 2) return t === 2;

  /* Vue décennale (level 3) et annuelle (level 4) : selon filtre
     detailLevel 1 = Siècle    → types 2
     detailLevel 2 = Important → types 2+3
     detailLevel 3 = Détaillé  → types 2+3+4
     detailLevel 4 = Complet   → tous (2+3+4+5)        */
  if (t === 1) return false;   /* règnes toujours via RulersSection */
  if (detailLevel === 1) return t === 2;
  if (detailLevel === 2) return t <= 3;
  if (detailLevel === 3) return t <= 4;
  return true;   /* Complet : tout */
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
        /* Initialise les couleurs de toutes les séries dès le chargement */
        getAllParcours();
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

    /* Légende Art sous la piste — pleine largeur, hors du track-row */
    if (zone === 'Art' && evts.length > 0) {
      var artLegRow = buildArtLegendRow(evts, start, end);
      if (artLegRow) container.appendChild(artLegRow);
    }

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

/* Appelé depuis renderLevel pour insérer la légende Art SOUS la piste */
function buildArtLegendRow(evts, start, end) {
  var legend = buildArtLegend(evts, start, end);
  return legend || null;
}

function buildArtLegend(evts, start, end) {
  /* Détecte quelles régions sont présentes dans les événements Art visibles */
  var present = {};
  evts.forEach(function(e) {
    var c = getArtColor(e);
    if (c && c.regionName && !present[c.regionName]) {
      present[c.regionName] = c;
    }
  });

  var regions = Object.keys(present);
  if (regions.length === 0) return null;

  var legend = document.createElement('div');
  legend.className = 'art-legend-bar';

  /* Label */
  var lbl = document.createElement('span');
  lbl.className = 'art-legend-lbl';
  lbl.textContent = 'Origines :';
  legend.appendChild(lbl);

  /* Une pastille par région détectée */
  regions.sort().forEach(function(name) {
    var col  = present[name];
    var item = document.createElement('span');
    item.className = 'art-legend-item';

    var dot = document.createElement('span');
    dot.className = 'art-legend-dot';
    dot.style.background = col.bg;
    item.appendChild(dot);
    item.appendChild(document.createTextNode(name));
    legend.appendChild(item);
  });

  /* Pastille pour les événements sans région identifiée */
  var hasGeneric = evts.some(function(e) { return !getArtColor(e); });
  if (hasGeneric) {
    var item2 = document.createElement('span');
    item2.className = 'art-legend-item';
    var dot2 = document.createElement('span');
    dot2.className = 'art-legend-dot';
    dot2.style.background = '#A0522D';
    item2.appendChild(dot2);
    item2.appendChild(document.createTextNode('Autre'));
    legend.appendChild(item2);
  }

  return legend;
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
    /* Date compacte intégrée dans le chip (pas au-dessus) pour ne pas masquer le texte voisin */
    var dateCompact = evt.mois ? MOIS_ABR_R[evt.mois - 1] + ' ' + evt.date : '' + evt.date;
    if (evt.date_fin && evt.date_fin > evt.date) {
      dateCompact += '–' + evt.date_fin;
    }
    var maxC  = level === 4 ? 36 : level === 3 ? 26 : 18;
    var titre = evt.titre.length > maxC ? evt.titre.slice(0, maxC - 1) + '…' : evt.titre;

    /* Span date inline (petit, à gauche du titre) */
    var dateInline = document.createElement('span');
    dateInline.className = 'ruler-date-inline';
    dateInline.textContent = dateCompact;
    chip.appendChild(dateInline);
    chip.appendChild(document.createTextNode(' ' + titre));
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

  /* Couleur de série/parcours (priorité maximale) */
  var serieCol = null;
  var evtSeries = parseSeries(evt.serie);
  if (evtSeries.length > 0 && parcoursColors[evtSeries[0]]) {
    serieCol = hexToCol(parcoursColors[evtSeries[0]]);
  }

  /* Couleur géographique pour les événements Art */
  var artCol = (!serieCol && zone === 'Art') ? getArtColor(evt) : null;
  var col    = serieCol || artCol || COLORS[zone] || COLORS['France'];
  var col2   = isShared && evt.zones.length >= 2 ? (COLORS[evt.zones[evt.zones.indexOf(zone) !== 0 ? 0 : 1]] || col) : col;
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
    chip.style.minHeight   = (ROW_H - 4) + 'px'; /* hauteur auto — permet retour ligne */
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
      /* Calcule le nombre max de chars affichables sur 1 ligne */
      var charPxW = 6.5;
      var maxC    = Math.max(8, Math.floor(chipPxApprox / charPxW));
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

      if (chipPxApprox < 80 && level === 2) {
        /* Vue siècle, chip étroit : étiquette flottante au-dessus de la barre */
        chip.style.fontSize   = '0';      /* cache le texte dans la barre */
        chip.style.overflow   = 'visible';
        var floatLbl = document.createElement('span');
        floatLbl.className   = 'chip-period-float-label';
        floatLbl.textContent = titreP;
        chip.appendChild(floatLbl);
      } else if (chipPxApprox < 60) {
        chip.style.fontSize     = '0.60rem';
        chip.style.whiteSpace   = 'nowrap';
        chip.style.textOverflow = 'ellipsis';
        chip.style.overflow     = 'hidden';
        chip.appendChild(document.createTextNode(titreP));
      } else {
        chip.style.fontSize   = adaptFontSize(titreP, 0.78, maxC);
        chip.style.lineHeight = '1.25';
        if (chipPxApprox < 50) {
          /* Chip très étroit : une ligne tronquée */
          chip.style.whiteSpace   = 'nowrap';
          chip.style.overflow     = 'hidden';
          chip.style.textOverflow = 'ellipsis';
        } else {
          /* Chip assez large : retour à la ligne */
          chip.style.whiteSpace = 'normal';
          chip.style.overflow   = 'visible';
          chip.style.wordBreak  = 'break-word';
          chip.style.hyphens    = 'auto';
        }
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
      /* Largeur approximative du chip en px */
      var chipPxM = chipW(evt, start, end, level) / 100 * TRACK_PX;
      chip.style.lineHeight = '1.25';
      chip.style.height     = 'auto';
      chip.style.minHeight  = (ROW_H - 4) + 'px';

      var dateLbl2 = document.createElement('span');
      dateLbl2.className   = 'chip-date-label';
      dateLbl2.textContent = evt.date;
      chip.appendChild(dateLbl2);

      if (chipPxM < 40) {
        /* Trop étroit : affiche juste un point, titre en tooltip */
        chip.style.fontSize   = '0';
        chip.style.overflow   = 'hidden';
        chip.style.whiteSpace = 'nowrap';
        /* Le titre est déjà dans chip.title — pas de texte affiché */
      } else if (chipPxM < 100) {
        /* Étroit : une ligne tronquée */
        chip.style.fontSize     = adaptFontSize(evt.titre, 0.72, Math.floor(chipPxM / 6.5));
        chip.style.whiteSpace   = 'nowrap';
        chip.style.overflow     = 'hidden';
        chip.style.textOverflow = 'ellipsis';
        chip.appendChild(document.createTextNode(evt.titre));
      } else {
        /* Large : retour à la ligne autorisé */
        chip.style.fontSize   = adaptFontSize(evt.titre, 0.76, Math.floor(chipPxM / 6.5));
        chip.style.whiteSpace = 'normal';
        chip.style.wordBreak  = 'break-word';
        chip.style.hyphens    = 'auto';
        chip.style.overflow   = 'visible';
        chip.appendChild(document.createTextNode(evt.titre));
      }
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
    typeEl.textContent = t === 1 ? '♛ Niveau 1 — Règne (toutes les vues)'
                       : t === 2 ? '⬛ Niveau 2 — Siècle (vue siècle et inférieures)'
                       : t === 3 ? '🔲 Niveau 3 — Important (décennale filtre Important+)'
                       : t === 4 ? '▪ Niveau 4 — Détaillé (décennale filtre Détaillé+)'
                       :           '· Niveau 5 — Complet (décennale filtre Complet)';
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
  var evtSeriesModal = parseSeries(evt.serie);
  if (evtSeriesModal.length > 0) {
    evtSeriesModal.forEach(function(serieName) {
      var sequenceEvents = allEvents.filter(function(e) {
        return parseSeries(e.serie).indexOf(serieName) !== -1;
      }).sort(function(a, b) { return a.date - b.date; });

      if (sequenceEvents.length > 1) {
        var seqContainer = document.createElement('div');
        seqContainer.className = 'sequence-container';

        var seqTitle = document.createElement('h4');
        seqTitle.className = 'sequence-title';
        seqTitle.textContent = 'Épisode de : ' + serieName;
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
    }); /* fin forEach series */
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
var WZ_TOTAL_STEPS = 5;

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
  /* Si on est à l'étape 3, met à jour le select de période */
  if (wzCurrentStep === 3) wzBuildPeriodSelect();
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
  if (step === 2) {
    /* Synchronise _wzScale avec le radio coché à l'affichage */
    var checkedScale = document.querySelector('input[name="wz-scale"]:checked');
    if (checkedScale) _wzScale = parseInt(checkedScale.value);
  }
  if (step === 3) wzBuildPeriodSelect();
  if (step === 4) {
    var scale = wzGetScale();
    if (scale !== 3) { wzGoTo(5); return; }
  }
}

function wzNext() {
  if (wzCurrentStep === 1) {
    var q = (document.getElementById('wz-search-input').value || '').trim();
    if (q) { wzClose(); wzApplySearch(q); return; }
    var anyZone = Object.values(activeZones).some(Boolean);
    if (!anyZone) { alert('Sélectionnez au moins une zone ou saisissez un mot-clé.'); return; }
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

var _wzScale = 3; /* valeur par défaut : vue décennale */

function wzGetScale() {
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
  var scale  = _wzScale;  /* utilise la valeur mémorisée directement */
  /* Reconstruit le select si nécessaire pour garantir sa cohérence */
  wzBuildPeriodSelect();
  var periodEl = document.getElementById('wz-period-select');
  var period = periodEl && periodEl.value ? parseInt(periodEl.value) : 1300;
  /* DEBUG temporaire */
  console.log('wzClose: scale=' + scale + ' _wzScale=' + _wzScale + ' period=' + period);
  alert('DEBUG: scale=' + scale + ' | _wzScale=' + _wzScale + ' | period=' + period);
  if (scale === 3) {
    var dr = document.querySelector('input[name="wz-detail"]:checked');
    detailLevel = dr ? parseInt(dr.value) : 2;
    document.querySelectorAll('.detail-btn').forEach(function(b) {
      b.classList.toggle('active', parseInt(b.dataset.level) === detailLevel);
    });
  }
  currentCentury = Math.floor(period / 100) * 100;
  currentDecade  = scale >= 3 ? Math.floor(period / 10) * 10 : null;
  currentYear    = scale === 4 ? period : null;
  renderLevel(scale, period);
}

/* ══════════ PARCOURS THÉMATIQUES ══════════ */
var activeParcours = null;
var parcoursColors = {};
var PARCOURS_PALETTE = [
  '#C0392B','#2471A3','#1E8449','#D68910','#7D3C98',
  '#148F77','#BA4A00','#1A5276','#6D4C41','#2D6A4F'
];

/* Parse le champ serie (peut contenir plusieurs séries séparées par |) */
function parseSeries(serie) {
  if (!serie || !serie.trim()) return [];
  return serie.split('|').map(function(s) { return s.trim(); }).filter(Boolean);
}

/* Convertit un code hex en objet couleur compatible avec COLORS */
function hexToCol(hex) {
  /* Décode R,G,B */
  var r = parseInt(hex.slice(1,3),16);
  var g = parseInt(hex.slice(3,5),16);
  var b = parseInt(hex.slice(5,7),16);
  /* Version claire : mélange avec blanc (85%) */
  var lr = Math.round(r + (255-r)*0.82);
  var lg = Math.round(g + (255-g)*0.82);
  var lb = Math.round(b + (255-b)*0.82);
  /* Texte sombre basé sur la couleur */
  var dr = Math.round(r*0.45);
  var dg = Math.round(g*0.45);
  var db = Math.round(b*0.45);
  return {
    bg:    hex,
    light: 'rgb('+lr+','+lg+','+lb+')',
    text:  'rgb('+dr+','+dg+','+db+')'
  };
}

function getAllParcours() {
  var seen = {}, list = [];
  allEvents.forEach(function(e) {
    var tags = parseSeries(e.serie);
    if (tags.length === 0) return;
    tags.forEach(function(p) {
      var key = p.trim();
      if (!key || seen[key]) return;
      seen[key] = true;
      list.push(key);
      if (!parcoursColors[key])
        parcoursColors[key] = PARCOURS_PALETTE[(list.length - 1) % PARCOURS_PALETTE.length];
    });
  });
  return list.sort();
}

function getParcoursSteps(p) {
  return allEvents.filter(function(e) {
    var tags = parseSeries(e.serie);
    return tags.indexOf(p) !== -1;
  }).sort(function(a, b) { return a.date !== b.date ? a.date - b.date : (a.mois||0) - (b.mois||0); });
}

function openParcoursPanel() {
  var overlay = document.getElementById('parcours-overlay');
  var listEl  = document.getElementById('parcours-list');
  if (!overlay || !listEl) return;

  var all = getAllParcours();
  listEl.innerHTML = '';

  if (all.length === 0) {
    listEl.innerHTML = '<p class="parcours-empty">Aucun parcours défini dans les événements chargés.</p>';
  } else {
    all.forEach(function(p) {
      var col   = parcoursColors[p];
      var steps = getParcoursSteps(p);

      /* Groupe les étapes par niveau */
      var byLevel = {1:[], 2:[], 3:[], 4:[]};
      steps.forEach(function(e) { (byLevel[e.type || 1] || byLevel[4]).push(e); });

      var btn = document.createElement('button');
      btn.className = 'parcours-item' + (activeParcours === p ? ' active' : '');
      btn.style.borderLeftColor = col;
      if (activeParcours === p) btn.style.background = col + '18';
      btn.innerHTML =
        '<span class="parcours-dot" style="background:' + col + '"></span>' +
        '<span class="parcours-name">' + p.replace(/_/g,' ') + '</span>' +
        '<span class="parcours-count">' + steps.length + ' étape' + (steps.length > 1 ? 's' : '') + '</span>';

      btn.addEventListener('click', (function(pk) {
        return function() {
          closeParcoursPanel();
          activeParcours === pk ? clearParcours() : setParcours(pk);
        };
      })(p));
      listEl.appendChild(btn);
    });
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeParcoursPanel() {
  var overlay = document.getElementById('parcours-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function setParcours(p) {
  activeParcours = p;
  updateParcoursBtn();

  /* 0. Sauvegarde les zones actives actuelles pour restauration */
  _savedZones = {};
  for (var zz in activeZones) _savedZones[zz] = activeZones[zz];

  /* 1. Collecte les zones impliquées dans ce parcours */
  var parcoursZones = {};
  allEvents.forEach(function(e) {
    if (parseSeries(e.serie).indexOf(p) === -1) return;
    (e.zones || []).forEach(function(z) { parcoursZones[z] = true; });
  });

  /* 2. Active uniquement ces zones */
  for (var z in activeZones) activeZones[z] = false;
  for (var z in parcoursZones) activeZones[z] = true;
  updateFilterCheckboxes();

  /* 3. Trouve la 1re étape et navigue vers sa décennie */
  var steps = getParcoursSteps(p);
  var first = steps[0];
  if (first) {
    var dec = Math.floor(first.date / 10) * 10;
    currentDecade  = dec;
    currentCentury = Math.floor(dec / 100) * 100;
    currentYear    = null;
    currentLevel   = 3;
    renderLevel(3, dec);
  } else {
    refreshFrise();
  }

  /* 4. Barre de navigation + panneau latéral */
  updateParcoursNavBar(p);
  showParcoursResults(p);

  /* 5. Met à jour les boutons de vue */
  updateNavButtons();
  updateDetailBar();
}

var _savedZones = null; /* zones sauvegardées avant activation parcours */

function clearParcours() {
  activeParcours = null;
  updateParcoursBtn();

  /* Restaure les zones précédentes si elles ont été sauvegardées */
  if (_savedZones) {
    for (var z in activeZones) activeZones[z] = !!_savedZones[z];
    _savedZones = null;
    updateFilterCheckboxes();
  }

  refreshFrise();
  var bar = document.getElementById('parcours-nav-bar');
  if (bar) bar.style.display = 'none';
  var panel = document.getElementById('search-results-panel');
  if (panel) panel.style.display = 'none';
  updateNavButtons();
  updateDetailBar();
}

function updateParcoursBtn() {
  var btn = document.getElementById('btn-parcours');
  if (!btn) return;
  if (activeParcours) {
    var col = parcoursColors[activeParcours] || '#888';
    btn.style.cssText = 'background:' + col + '22;border-color:' + col + ';color:' + col + ';font-weight:700;';
    btn.textContent   = '◆ ' + activeParcours.replace(/_/g,' ') + ' ×';
  } else {
    btn.style.cssText = '';
    btn.textContent   = '◆ Parcours';
  }
}

function showParcoursResults(p) {
  var panel   = document.getElementById('search-results-panel');
  var listEl  = document.getElementById('search-results-list');
  var titleEl = document.getElementById('sr-title');
  if (!panel || !listEl) return;

  var col   = parcoursColors[p] || '#C0392B';
  var steps = getParcoursSteps(p);

  if (titleEl) {
    titleEl.innerHTML =
      '<span style="color:' + col + '">◆ ' + p.replace(/_/g,' ') + '</span>' +
      ' — ' + steps.length + ' étape' + (steps.length > 1 ? 's' : '');
  }

  /* Bouton "Voir sur la frise" dans le header */
  var srHeader = document.querySelector('.sr-header');
  if (srHeader) {
    var oldBtn = srHeader.querySelector('.sr-frise-btn');
    if (oldBtn) oldBtn.remove();
    var friseBtn = document.createElement('button');
    friseBtn.className   = 'sr-frise-btn';
    friseBtn.textContent = 'Voir sur la frise →';
    friseBtn.title       = 'Fermer ce panneau et naviguer sur la frise';
    friseBtn.onclick = function() {
      /* Ferme le panneau mais garde le parcours actif */
      var panel = document.getElementById('search-results-panel');
      if (panel) panel.style.display = 'none';
      document.body.classList.remove('parcours-panel-open');
    };
    /* Insère avant le bouton Fermer */
    var closeBtn = srHeader.querySelector('.sr-close');
    if (closeBtn) srHeader.insertBefore(friseBtn, closeBtn);
    else srHeader.appendChild(friseBtn);
  }

  listEl.innerHTML = '';
  if (steps.length === 0) {
    listEl.innerHTML = '<p class="sr-empty">Aucune étape trouvée.</p>';
    panel.style.display = 'flex';
    return;
  }

  var MOIS_ABR = ['jan.','fév.','mar.','avr.','mai','jun.',
                  'jul.','aoû.','sep.','oct.','nov.','déc.'];

  /* Config visuelle par niveau :
     point + opacité + taille de fonte + couleur texte */
  var LVL = {
    1: { dot: 10, opacity: 1.0,  fs: '14px', fw: '500', tc: 'var(--color-text-primary)',   indent: 0  },
    2: { dot: 7,  opacity: 0.75, fs: '13px', fw: '400', tc: 'var(--color-text-primary)',   indent: 0  },
    3: { dot: 5,  opacity: 0.45, fs: '12px', fw: '400', tc: 'var(--color-text-secondary)', indent: 0  },
    4: { dot: 3,  opacity: 0.28, fs: '11px', fw: '400', tc: 'var(--color-text-tertiary)',  indent: 0  }
  };

  /* Ligne verticale contenante */
  var timeline = document.createElement('div');
  timeline.style.cssText =
    'position:relative;padding-left:22px;' +
    'border-left:2px solid ' + col + '33;' +
    'display:flex;flex-direction:column;gap:2px;';

  steps.forEach(function(evt, idx) {
    var lvl     = Math.min(Math.max(parseInt(evt.type) || 1, 1), 4);
    var cfg     = LVL[lvl];
    var evtCol  = COLORS[evt.zones && evt.zones[0]] || COLORS['France'];
    if (evt.zones && evt.zones.indexOf('Art') !== -1) {
      var artC = getArtColor(evt);
      if (artC) evtCol = artC;
    }

    var dateStr = evt.mois ? MOIS_ABR[evt.mois - 1] + ' ' + evt.date : '' + evt.date;
    if (evt.date_fin && evt.date_fin > evt.date) dateStr += '–' + evt.date_fin;

    var row = document.createElement('div');
    row.style.cssText =
      'display:flex;align-items:flex-start;gap:8px;' +
      'position:relative;padding:3px 0;cursor:pointer;' +
      'border-radius:5px;transition:background 0.12s;';
    row.addEventListener('mouseenter', function() { this.style.background = 'var(--color-background-secondary)'; });
    row.addEventListener('mouseleave', function() { this.style.background = ''; });

    /* Point sur la ligne */
    var dot = document.createElement('span');
    var dotSz = cfg.dot;
    var dotLeft = -22 - dotSz / 2 + 1;
    dot.style.cssText =
      'position:absolute;' +
      'left:' + dotLeft + 'px;' +
      'top:' + (8 - dotSz / 2) + 'px;' +
      'width:' + dotSz + 'px;height:' + dotSz + 'px;' +
      'border-radius:50%;' +
      'background:' + col + ';' +
      'opacity:' + cfg.opacity + ';' +
      'border:' + (lvl <= 2 ? '1.5px solid var(--color-background-primary)' : 'none') + ';' +
      'flex-shrink:0;';
    row.appendChild(dot);

    /* Date */
    var dateEl = document.createElement('span');
    dateEl.style.cssText =
      'font-size:10px;color:var(--color-text-tertiary);' +
      'min-width:38px;text-align:right;padding-top:2px;flex-shrink:0;';
    dateEl.textContent = dateStr;
    row.appendChild(dateEl);

    /* Pastille zone */
    var zoneDot = document.createElement('span');
    zoneDot.style.cssText =
      'width:7px;height:7px;border-radius:50%;' +
      'background:' + evtCol.bg + ';flex-shrink:0;margin-top:5px;';
    row.appendChild(zoneDot);

    /* Corps texte */
    var body = document.createElement('span');
    body.style.cssText = 'display:flex;flex-direction:column;flex:1;min-width:0;';

    var titre = document.createElement('span');
    titre.style.cssText =
      'font-size:' + cfg.fs + ';font-weight:' + cfg.fw + ';' +
      'color:' + cfg.tc + ';font-style:italic;' +
      'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
    titre.textContent = evt.titre;
    body.appendChild(titre);

    if (evt.zones && evt.zones.length) {
      var zones = document.createElement('span');
      zones.style.cssText = 'font-size:10px;color:var(--color-text-tertiary);';
      zones.textContent = evt.zones.join(', ');
      body.appendChild(zones);
    }
    row.appendChild(body);

    /* Miniature si image */
    if (evt.image && evt.image.trim()) {
      var thumb = document.createElement('img');
      thumb.src = evt.image; thumb.alt = '';
      thumb.style.cssText =
        'width:32px;height:38px;object-fit:cover;object-position:top;' +
        'border-radius:3px;border:0.5px solid var(--color-border-tertiary);flex-shrink:0;';
      row.appendChild(thumb);
    }

    /* Clic simple → navigue sur la frise + surligne l'étape */
    row.addEventListener('click', (function(e, stepIdx) {
      return function() {
        /* Surligne cet item */
        timeline.querySelectorAll('.parcours-row-active').forEach(function(r) {
          r.classList.remove('parcours-row-active');
          r.style.background = '';
        });
        this.classList.add('parcours-row-active');
        this.style.background = 'rgba(154,107,26,0.12)';

        /* Met à jour le select de la barre */
        var sel = document.querySelector('#parcours-nav-bar .pnav-select');
        if (sel) sel.value = stepIdx;

        /* Navigue vers la décennie de cet événement */
        var dec = Math.floor(e.date / 10) * 10;
        currentDecade  = dec;
        currentCentury = Math.floor(dec / 100) * 100;
        currentYear    = null;
        renderLevel(3, dec);
        updateNavButtons();
      };
    })(evt, idx));

    /* Double-clic → ouvre la fiche modale */
    row.addEventListener('dblclick', (function(e) {
      return function(ev) { ev.stopPropagation(); openModal(e, e.zones && e.zones[0] || ZONES[0]); };
    })(evt));

    timeline.appendChild(row);
  });

  listEl.appendChild(timeline);
  panel.style.display = 'flex';
}


function closeSearchResults() {
  var panel   = document.getElementById('search-results-panel');
  var countEl = document.getElementById('search-count');
  if (panel)   panel.style.display = 'none';
  document.body.classList.remove('parcours-panel-open');
  if (countEl) countEl.textContent = '';
  searchTerm = '';
  var inp = document.getElementById('search-input');
  if (inp) inp.value = '';
  var clearBtn = document.getElementById('search-clear');
  if (clearBtn) clearBtn.style.display = 'none';
}


/* ── Barre de navigation parcours (select + flèches) ── */
function updateParcoursNavBar(p) {
  var bar = document.getElementById('parcours-nav-bar');
  if (!bar) return;

  var steps = getParcoursSteps(p);
  var col   = parcoursColors[p] || '#C0392B';

  /* Titre */
  var titleEl = bar.querySelector('.pnav-title');
  if (titleEl) {
    titleEl.innerHTML = '<span style="color:' + col + '">◆ ' +
      p.replace(/_/g,' ') + '</span> &mdash; ' +
      steps.length + ' étape' + (steps.length > 1 ? 's' : '');
  }

  /* Select déroulant */
  var sel = bar.querySelector('.pnav-select');
  if (sel) {
    sel.innerHTML = '';
    var MOIS_ABR = ['jan.','fév.','mar.','avr.','mai','jun.',
                    'jul.','aoû.','sep.','oct.','nov.','déc.'];
    steps.forEach(function(evt, i) {
      var opt = document.createElement('option');
      var dateStr = evt.mois ? MOIS_ABR[evt.mois-1]+' '+evt.date : ''+evt.date;
      opt.value       = i;
      opt.textContent = (i+1) + '. ' + dateStr + ' — ' + evt.titre;
      sel.appendChild(opt);
    });
    sel.onchange = function() {
      var idx = parseInt(this.value);
      parcoursGoToStep(steps, idx);
    };

    /* Bouton "Ouvrir la fiche" à côté du select */
    var oldFicheBtn = bar.querySelector('.pnav-fiche-btn');
    if (oldFicheBtn) oldFicheBtn.remove();
    var ficheBtn = document.createElement('button');
    ficheBtn.className   = 'pnav-fiche-btn';
    ficheBtn.textContent = 'Fiche ↗';
    ficheBtn.title       = 'Ouvrir la fiche de l’étape sélectionnée';
    ficheBtn.style.cssText = 'font-size:0.78rem;padding:0.2rem 0.65rem;border:1px solid var(--border-dark);border-radius:14px;background:rgba(245,237,216,0.9);cursor:pointer;white-space:nowrap;';
    ficheBtn.onclick = function() {
      var selEl = bar.querySelector('.pnav-select');
      if (!selEl) return;
      var stepIdx = parseInt(selEl.value);
      var stepsNow = getParcoursSteps(activeParcours);
      if (stepsNow[stepIdx]) {
        var e = stepsNow[stepIdx];
        openModal(e, e.zones && e.zones[0] || ZONES[0]);
      }
    };

    /* Bouton "Frise" : navigue vers l'étape sélectionnée */
    var oldFriseBtn2 = bar.querySelector('.pnav-frise-btn');
    if (oldFriseBtn2) oldFriseBtn2.remove();
    var friseBtn2 = document.createElement('button');
    friseBtn2.className   = 'pnav-frise-btn';
    friseBtn2.textContent = 'Frise ↓';
    friseBtn2.title       = 'Centrer la frise sur l’étape sélectionnée';
    friseBtn2.style.cssText = 'font-size:0.78rem;padding:0.2rem 0.65rem;border:1px solid var(--border-dark);border-radius:14px;background:rgba(245,237,216,0.9);cursor:pointer;white-space:nowrap;';
    friseBtn2.onclick = function() {
      var selEl = bar.querySelector('.pnav-select');
      if (!selEl) return;
      var stepIdx = parseInt(selEl.value);
      var stepsNow = getParcoursSteps(activeParcours);
      parcoursGoToStep(stepsNow, stepIdx);
    };

    /* Insère après le select : Frise | Fiche */
    sel.parentNode.insertBefore(friseBtn2, sel.nextSibling);
    sel.parentNode.insertBefore(ficheBtn, friseBtn2.nextSibling);
  }

  bar.style.display = 'flex';
  bar.style.borderColor = col;
}

function navigateToEvent(evt) {
  /* Navigue vers la décennie contenant cet événement */
  var dec = Math.floor(evt.date / 10) * 10;
  currentDecade  = dec;
  currentCentury = Math.floor(dec / 100) * 100;
  currentYear    = null;
  currentLevel   = 3;
  renderLevel(3, dec);
  updateNavButtons();
  updateDetailBar();
}

function parcoursGoToStep(steps, idx) {
  if (!steps || idx < 0 || idx >= steps.length) return;
  var evt = steps[idx];

  /* Met à jour le select */
  var sel = document.querySelector('#parcours-nav-bar .pnav-select');
  if (sel) sel.value = idx;

  /* Met à jour la liste latérale */
  var items = document.querySelectorAll('#search-results-list .sr-item');
  items.forEach(function(item, i) { item.classList.toggle('sr-item-active', i === idx); });

  /* Navigue vers la période contenant l'étape */
  navigateToEvent(evt);
}

function parcoursNavStep(dir) {
  if (!activeParcours) return;
  var steps = getParcoursSteps(activeParcours);
  var sel   = document.querySelector('#parcours-nav-bar .pnav-select');
  var cur   = sel ? parseInt(sel.value) : 0;
  var next  = Math.max(0, Math.min(steps.length - 1, cur + dir));
  parcoursGoToStep(steps, next);
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
  if (level === 1) {
    renderLevel(1);
  } else if (level === 2 && currentCentury !== null) {
    renderLevel(2, currentCentury);
  } else if (level === 3) {
    var dec = currentDecade !== null ? currentDecade : currentCentury;
    if (dec === null) dec = 1300;
    currentDecade = dec;
    renderLevel(3, dec);
  } else if (level === 4) {
    /* Déduit l'année de départ depuis currentYear, currentDecade ou currentCentury */
    var yr = currentYear
          || (currentDecade  !== null ? currentDecade  : null)
          || (currentCentury !== null ? currentCentury : 1300);
    currentYear = yr;
    renderLevel(4, yr);
  }
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
  /* Visible en vue décennale ET annuelle */
  bar.style.display = (currentLevel === 3 || currentLevel === 4) ? 'flex' : 'none';
  if (hint) {
    var labels = {
      1: '— type 2 (Siècle)',
      2: '— types 2–3 (Important)',
      3: '— types 2–4 (Détaillé)',
      4: '— tous les types (Complet)'
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
  /* Active le bouton de vue correspondant au niveau courant */
  [1, 2, 3, 4].forEach(function(lvl) {
    var btn = document.getElementById('btn-level' + lvl);
    if (!btn) return;
    btn.classList.toggle('active', lvl === currentLevel);
    if (lvl === 2) btn.disabled = (currentCentury === null);
    /* Décennie activable si on a un siècle (on entre sur la 1re décennie) */
    if (lvl === 3) btn.disabled = (currentCentury === null && currentDecade === null);
    /* Annuelle activable si on a une décennie ou un siècle */
    if (lvl === 4) btn.disabled = (currentCentury === null && currentDecade === null);
  });
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

/* ══════════ RECHERCHE EN LISTE ══════════ */

function eventMatchesSearch(evt) {
  if (!searchTerm) return true;
  var q = searchTerm.toLowerCase();
  var haystack = [
    evt.titre || '',
    evt.description || '',
    evt.sources || '',
    (evt.zones || []).join(' ')
  ].join(' ').toLowerCase();
  return haystack.indexOf(q) !== -1;
}

function showSearchResults() {
  var panel   = document.getElementById('search-results-panel');
  var listEl  = document.getElementById('search-results-list');
  var titleEl = document.getElementById('sr-title');
  var countEl = document.getElementById('search-count');
  if (!panel || !listEl) return;

  var results = allEvents
    .filter(function(e) { return eventMatchesSearch(e); })
    .sort(function(a, b) {
      return a.date !== b.date ? a.date - b.date : (a.mois || 0) - (b.mois || 0);
    });

  if (countEl) countEl.textContent = results.length
    ? results.length + ' résultat' + (results.length > 1 ? 's' : '')
    : 'Aucun résultat';

  if (titleEl) titleEl.textContent = searchTerm
    ? 'Recherche : « ' + searchTerm + ' »'
    : 'Résultats';

  var MOIS_ABR = ['jan.','fév.','mar.','avr.','mai','jun.',
                  'jul.','aoû.','sep.','oct.','nov.','déc.'];
  var LEVEL_LABELS = {
    1: 'Niveau 1 — Règne',
    2: 'Niveau 2 — Siècle',
    3: 'Niveau 3 — Important',
    4: 'Niveau 4 — Détaillé',
    5: 'Niveau 5 — Complet'
  };

  listEl.innerHTML = '';

  if (results.length === 0) {
    listEl.innerHTML = '<p class="sr-empty">Aucun événement ne correspond.</p>';
  } else {
    /* Groupe par niveau */
    var byLevel = { 1:[], 2:[], 3:[], 4:[], 5:[] };
    results.forEach(function(e) {
      var t = e.regne ? 1 : (parseInt(e.type) || 2);
      (byLevel[t] || byLevel[2]).push(e);
    });

    [1, 2, 3, 4, 5].forEach(function(lvl) {
      var items = byLevel[lvl];
      if (!items.length) return;

      var header = document.createElement('div');
      header.className = 'sr-level-header';
      header.textContent = LEVEL_LABELS[lvl] + ' (' + items.length + ')';
      listEl.appendChild(header);

      items.forEach(function(evt) {
        var evtCol = COLORS[evt.zones && evt.zones[0]] || COLORS['France'];
        if (evt.zones && evt.zones.indexOf('Art') !== -1) {
          var artC = getArtColor(evt);
          if (artC) evtCol = artC;
        }
        var dateStr = evt.mois
          ? MOIS_ABR[evt.mois - 1] + ' ' + evt.date
          : '' + evt.date;
        if (evt.date_fin && evt.date_fin > evt.date) dateStr += '–' + evt.date_fin;

        var item = document.createElement('div');
        item.className = 'sr-item sr-level-' + lvl;

        item.innerHTML =
          '<span class="sr-date">' + dateStr + '</span>' +
          '<span class="sr-dot" style="background:' + evtCol.bg + '"></span>' +
          '<span class="sr-body">' +
            '<span class="sr-titre">' + evt.titre + '</span>' +
            '<span class="sr-zones">' + (evt.zones || []).join(', ') + '</span>' +
          '</span>';

        if (evt.image && evt.image.trim()) {
          var thumb = document.createElement('img');
          thumb.src = evt.image;
          thumb.alt = evt.legende || '';
          thumb.className = 'sr-thumb';
          item.appendChild(thumb);
        }

        item.style.cursor = 'pointer';
        item.addEventListener('click', (function(e) {
          return function() { openModal(e, e.zones && e.zones[0] || ZONES[0]); };
        })(evt));

        listEl.appendChild(item);
      });
    });
  }

  panel.style.display = 'flex';
  document.body.classList.add('parcours-panel-open');
}


function onSearch(val) {
  searchTerm = (val || '').trim();
  var clearBtn = document.getElementById('search-clear');
  if (clearBtn) clearBtn.style.display = searchTerm ? 'inline-block' : 'none';
  if (searchTerm) {
    showSearchResults();
  } else {
    closeSearchResults();
  }
}



function clearSearch() { closeSearchResults(); }

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
