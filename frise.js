/* frise.js — Frise chronologique medievale 1300-1500 */

var ZONES = [
  'France', 'Angleterre', 'St Empire', 'Papaute',
  'Naples', 'Italie', 'Pen. iberique', 'Hongrie',
  'Europe C. & Or.', 'Byzance', 'Monde islamique', 'Orient', 'Monde',
  'Art', 'Techniques', 'Idees'
];

var COLORS = {
  'France':           { bg: '#8B1A1A', light: '#F5E6E6', text: '#5C0F0F' },
  'Angleterre':       { bg: '#1A4A6B', light: '#E6EFF5', text: '#0F2E45' },
  'St Empire':        { bg: '#6B4A10', light: '#F5EDE0', text: '#3A2508' },
  'Papaute':          { bg: '#7A1A1A', light: '#F5E0E0', text: '#4A0808' },
  'Naples':           { bg: '#1A5C4A', light: '#E0F5EE', text: '#0A3028' },
  'Italie':           { bg: '#1A6B3C', light: '#E6F5ED', text: '#0F3D24' },
  'Pen. iberique':    { bg: '#5B3A8B', light: '#EDE6F5', text: '#3A245A' },
  'Hongrie':          { bg: '#8B3A1A', light: '#F5E8E0', text: '#5C2008' },
  'Europe C. & Or.':  { bg: '#2A5C5C', light: '#E0F2F2', text: '#173A3A' },
  'Byzance':          { bg: '#6B1A6B', light: '#F5E6F5', text: '#3A0A3A' },
  'Monde islamique':  { bg: '#8B6B10', light: '#F5EDD8', text: '#5C4408' },
  'Orient':           { bg: '#5C2A10', light: '#F5E8E0', text: '#3A1A08' },
  'Monde':            { bg: '#3A3A3A', light: '#EBEBEB', text: '#1C1C1C' },
  'Art':              { bg: '#A0522D', light: '#F5EDE6', text: '#5C2E18' },
  'Techniques':       { bg: '#2F5233', light: '#E6F0E7', text: '#1A2E1C' },
  'Idees':            { bg: '#1A3A6B', light: '#E0E8F5', text: '#0A1E3A' }
};

var ROW_H    = 24;
var ROW_GAP  = 4;
var CHIP_PAD = 6;
var TRACK_PX = 820;

var currentLevel   = 1;
var currentCentury = null;
var currentDecade  = null;
var allEvents      = [];
var activeZones    = null;

function initActiveZones() {
  activeZones = {};
  for (var i = 0; i < ZONES.length; i++) activeZones[ZONES[i]] = true;
}

/* ── Visibilite par type ─────────────────────────────────────────────
   type 1 → niveaux 1, 2, 3
   type 2 → niveaux 2, 3
   type 3 → niveau 3 seulement                                        */
function visibleAtLevel(evt, level) {
  /* type 1 = toutes echelles, type 2 = siecle+decennie, type 3 = decennie seule */
  var t = (evt.type === undefined || evt.type === null || evt.type === '') ? 1 : parseInt(evt.type, 10);
  if (isNaN(t) || t === 1) return true;
  if (t === 2) return level >= 2;
  if (t === 3) return level >= 3;
  return true;
}

/* ── Normalisation des zones ─────────────────────────────────────────
   Accepte les anciens noms et les variantes avec accents             */
var ZONE_ALIASES = {
  'Empire':              'St Empire',
  'St_Empire':           'St Empire',
  'Iberique':            'Pen. iberique',
  'Ibérique':            'Pen. iberique',
  'Pen. ibérique':       'Pen. iberique',
  'Pén. ibérique':       'Pen. iberique',
  'Pen. Iberique':       'Pen. iberique',
  'Péninsule ibérique':  'Pen. iberique',
  'Papaute':             'Papaute',
  'Papauté':             'Papaute',
  'Hongrie':             'Hongrie',
  'Naples':              'Naples',
  'Techniques et idees': 'Techniques',
  'Art':                 'Art',
  'Idees':               'Idees',
  'Idées':               'Idees'
};

function normalizeZone(z) {
  return ZONE_ALIASES[z] || z;
}

/* ── Chargement ──────────────────────────────────────────────────────*/
function loadEvents() {
  fetch('events.json')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      allEvents = data.map(function(e) {
        /* Normalise zones */
        var rawZones = e.zones || (e.zone ? [e.zone] : []);
        e.zones = rawZones.map(normalizeZone);
        /* Normalise type en nombre */
        e.type = Number(e.type) || 1;
        return e;
      });
      buildFilterBar();
      renderLevel(1);
    })
    .catch(function() {
      document.getElementById('frise-container').innerHTML =
        '<p class="error">Impossible de charger events.json.</p>';
    });
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
      label.className = 'zone-checkbox checked';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = true;
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
  } else {
    currentDecade = rangeStart;
    start = rangeStart; end = rangeStart + 10; tickStep = 1;
  }

  updateBreadcrumb();
  updateNavButtons();

  var container = document.getElementById('frise-container');
  container.innerHTML = '';
  container.appendChild(buildAxis(start, end, tickStep, level));

  for (var i = 0; i < ZONES.length; i++) {
    var zone = ZONES[i];
    if (!activeZones[zone]) continue;

    var evts = [];
    for (var j = 0; j < allEvents.length; j++) {
      var e = allEvents[j];
      /* Zone */
      if (e.zones.indexOf(zone) === -1) continue;
      /* Type / niveau */
      if (!visibleAtLevel(e, level)) continue;
      /* Fenetre temporelle */
      var fin = (e.date_fin && e.date_fin > e.date) ? e.date_fin : e.date;
      if (e.date > end || fin < start) continue;
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
    : 'Cliquez sur un evenement pour afficher sa fiche complete';
  container.appendChild(hint);
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

  if (level === 1) {
    var slices = [1300, 1350, 1400, 1450];
    for (var s = 0; s < slices.length; s++) {
      (function(sv) {
        var band = makeBand(sv, sv + 50, start, end, function() {
          renderLevel(2, Math.floor(sv / 100) * 100);
        });
        bar.appendChild(band);
      })(slices[s]);
    }
  } else if (level === 2) {
    for (var d = currentCentury; d < currentCentury + 100; d += 10) {
      (function(decade) {
        bar.appendChild(makeBand(decade, decade + 10, start, end, function() {
          renderLevel(3, decade);
        }));
      })(d);
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
  return (Math.min(evt.titre.length, level === 3 ? 28 : 20) * 7 + 16) / TRACK_PX * 100;
}

function assignRows(evts, start, end, level) {
  var rowEnds = [];
  var gap = CHIP_PAD / TRACK_PX * 100;
  return evts.map(function(evt) {
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
function buildTrack(zone, evts, start, end, level) {
  var row = document.createElement('div');
  row.className = 'track-row';

  var lbl = document.createElement('div');
  lbl.className = 'zone-label';
  var dot = document.createElement('span');
  dot.className = 'zone-dot';
  dot.style.background = (COLORS[zone] || COLORS['France']).bg;
  lbl.appendChild(dot);
  lbl.appendChild(document.createTextNode(zone));
  row.appendChild(lbl);

  /* Filtre : garde seulement les évenements dans la fenetre */
  var visible = evts.filter(function(e) {
    var fin = (e.date_fin && e.date_fin > e.date) ? e.date_fin : e.date;
    return e.date <= end && fin >= start;
  });

  var rows  = assignRows(visible, start, end, level);
  var maxR  = visible.length > 0 ? Math.max.apply(null, rows) : 0;
  var trackH = (maxR + 1) * ROW_H + maxR * ROW_GAP + 8;

  var track = document.createElement('div');
  track.className = 'track';
  track.style.height = trackH + 'px';

  var line = document.createElement('div');
  line.className = 'track-line';
  line.style.top = (trackH / 2) + 'px';
  track.appendChild(line);

  for (var i = 0; i < visible.length; i++) {
    var chip = buildChip(visible[i], zone, start, end, level, rows[i]);
    if (chip) track.appendChild(chip);
  }

  row.appendChild(track);
  return row;
}

/* ── Chip ────────────────────────────────────────────────────────────*/
function buildChip(evt, zone, start, end, level, rowIndex) {
  var col      = COLORS[zone] || COLORS['France'];
  var isPeriod = evt.date_fin && evt.date_fin > evt.date;
  var type     = Number(evt.type) || 1;
  var chip     = document.createElement('div');
  chip.className      = 'evt-chip';
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
      chip.textContent = evt.titre.length > mx ? evt.titre.slice(0, mx - 1) + '\u2026' : evt.titre;
    }
    chip.title = evt.titre + ' (' + evt.date + (evt.date_fin ? '\u2013' + evt.date_fin : '') + ')';

  } else {
    chip.style.height    = ROW_H + 'px';
    chip.style.left      = pct(evt.date, start, end);
    chip.style.transform = 'translateX(-50%)';

    if (level === 3) {
      chip.classList.add('chip-full');
      if (type === 1) chip.classList.add('chip-type1');
      if (type === 3) chip.classList.add('chip-type3');
      chip.style.background = col.bg;
      chip.style.color      = '#fff';
      chip.textContent = evt.titre.length > 28 ? evt.titre.slice(0, 26) + '\u2026' : evt.titre;
    } else if (level === 2) {
      chip.classList.add('chip-medium');
      if (type === 1) chip.classList.add('chip-type1');
      if (type === 3) chip.classList.add('chip-type3');
      chip.style.background  = col.light;
      chip.style.color       = col.text;
      chip.style.borderColor = col.bg;
      chip.textContent = evt.titre.length > 20 ? evt.titre.slice(0, 18) + '\u2026' : evt.titre;
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
    typeEl.textContent = t === 1 ? '\u2605\u2605\u2605 Evenement majeur'
                       : t === 2 ? '\u2605\u2605 Evenement regional'
                       :           '\u2605 Evenement local';
    typeEl.className = 'modal-type-badge type' + t;
  }

  document.getElementById('modal-date').textContent =
    (evt.date_fin && evt.date_fin > evt.date)
      ? evt.date + ' \u2013 ' + evt.date_fin + ' apr. J.-C.'
      : evt.date + ' apr. J.-C.';
  document.getElementById('modal-title').textContent   = evt.titre;
  /* Affiche la description avec paragraphes (\n\n = nouveau paragraphe, \n = saut de ligne) */
  var descEl = document.getElementById('modal-desc');
  descEl.innerHTML = '';
  var rawDesc = evt.description || '';
  var paragraphs = rawDesc.split(/\n\n+/);
  for (var pi = 0; pi < paragraphs.length; pi++) {
    var para = paragraphs[pi].trim();
    if (!para) continue;
    var p = document.createElement('p');
    /* Gere les simples \n comme <br> dans un paragraphe */
    var lines = para.split('\n');
    for (var li = 0; li < lines.length; li++) {
      if (li > 0) p.appendChild(document.createElement('br'));
      p.appendChild(document.createTextNode(lines[li]));
    }
    descEl.appendChild(p);
  }
  document.getElementById('modal-sources').textContent = evt.sources ? '\uD83D\uDCD6 ' + evt.sources : '';

  var imgWrap   = document.getElementById('modal-img-wrap');
  var imgEl     = document.getElementById('modal-img');
  var captionEl = document.getElementById('modal-img-caption');

  if (evt.image && evt.image.trim() !== '') {
    imgEl.src = evt.image;
    imgEl.alt = evt.legende || evt.titre;
    captionEl.textContent = evt.legende || '';
    captionEl.style.display = evt.legende ? 'block' : 'none';
    imgWrap.style.display = 'block';
  } else {
    imgWrap.style.display = 'none';
    imgEl.src = '';
  }

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Navigation ──────────────────────────────────────────────────────*/
function goLevel(level) {
  if      (level === 1)                             renderLevel(1);
  else if (level === 2 && currentCentury !== null)  renderLevel(2, currentCentury);
  else if (level === 3 && currentDecade  !== null)  renderLevel(3, currentDecade);
}

function navigateDecade(direction) {
  if (currentDecade === null) return;
  var next = currentDecade + direction * 10;
  if (next < 1290 || next > 1500) return;
  currentCentury = Math.floor(next / 100) * 100;
  renderLevel(3, next);
}

function updateBreadcrumb() {
  var html = '<span class="bc-item bc-link" onclick="goLevel(1)">1300\u20131500</span>';
  if (currentLevel >= 2 && currentCentury !== null)
    html += '<span class="bc-sep"> \u203a </span><span class="bc-item bc-link" onclick="goLevel(2)">'
          + currentCentury + '\u2013' + (currentCentury + 100) + '</span>';
  if (currentLevel === 3 && currentDecade !== null)
    html += '<span class="bc-sep"> \u203a </span><span class="bc-item">'
          + currentDecade + '\u2013' + (currentDecade + 10) + '</span>';
  document.getElementById('breadcrumb').innerHTML = html;
}

function updateNavButtons() {
  document.querySelectorAll('.nav-btn').forEach(function(btn, i) {
    btn.classList.toggle('active', i + 1 === currentLevel);
    btn.disabled = (i === 1 && currentCentury === null) || (i === 2 && currentDecade === null);
  });
  var prev = document.getElementById('btn-prev');
  var next = document.getElementById('btn-next');
  var lbl  = document.getElementById('decade-label');
  if (!prev || !next) return;
  var show = (currentLevel === 3 && currentDecade !== null);
  prev.style.display = show ? 'inline-block' : 'none';
  next.style.display = show ? 'inline-block' : 'none';
  if (lbl) lbl.style.display = show ? 'inline-block' : 'none';
  if (show) {
    prev.disabled = currentDecade <= 1290;
    next.disabled = currentDecade >= 1500;
    if (lbl) lbl.textContent = currentDecade + '\u2013' + (currentDecade + 10);
  }
}

/* ── Utilitaires ─────────────────────────────────────────────────────*/
function pct(year, start, end) {
  return ((year - start) / (end - start) * 100).toFixed(3) + '%';
}

/* ── Init ────────────────────────────────────────────────────────────*/
document.addEventListener('DOMContentLoaded', function() {
  initActiveZones();
  document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
    if (!document.getElementById('modal-overlay').classList.contains('open')) {
      if (e.key === 'ArrowLeft')  navigateDecade(-1);
      if (e.key === 'ArrowRight') navigateDecade(1);
    }
  });
  loadEvents();
});
