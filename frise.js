/* =====================================================================
   frise.js — Frise chronologique médiévale 1300–1500
   ===================================================================== */

const ZONES = [
  'France', 'Angleterre', 'St Empire', 'Italie',
  'Pén. ibérique', 'Europe C. & Or.', 'Monde islamique', 'Orient', 'Monde'
];

const COLORS = {
  'France':           { bg: '#8B1A1A', light: '#F5E6E6', text: '#5C0F0F' },
  'Angleterre':       { bg: '#1A4A6B', light: '#E6EFF5', text: '#0F2E45' },
  'St Empire':        { bg: '#6B4A10', light: '#F5EDE0', text: '#3A2508' },
  'Italie':           { bg: '#1A6B3C', light: '#E6F5ED', text: '#0F3D24' },
  'Pén. ibérique':    { bg: '#5B3A8B', light: '#EDE6F5', text: '#3A245A' },
  'Europe C. & Or.':  { bg: '#2A5C5C', light: '#E0F2F2', text: '#173A3A' },
  'Monde islamique':  { bg: '#8B6B10', light: '#F5EDD8', text: '#5C4408' },
  'Orient':           { bg: '#5C2A10', light: '#F5E8E0', text: '#3A1A08' },
  'Monde':            { bg: '#3A3A3A', light: '#EBEBEB', text: '#1C1C1C' }
};

/* Visibilité par type :
   type 1 = toutes les échelles (niveaux 1, 2, 3)
   type 2 = siècle et décennie  (niveaux 2, 3)
   type 3 = décennie seulement  (niveau 3)
   si non renseigné → traité comme type 1 */
function eventVisibleAtLevel(evt, level) {
  var t = parseInt(evt.type, 10) || 1;
  if (t === 1) return true;
  if (t === 2) return level >= 2;
  if (t === 3) return level === 3;
  return true;
}

const ROW_H    = 24;
const ROW_GAP  = 4;
const CHIP_PAD = 6;
const TRACK_PX = 820;

var currentLevel   = 1;
var currentCentury = null;
var currentDecade  = null;
var allEvents      = [];
var activeZones    = new Set(ZONES);

/* ── Chargement ─────────────────────────────────────────────────────── */

function loadEvents() {
  fetch('events.json')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      allEvents = data;
      allEvents.forEach(function(e) {
        if (!e.zones) {
          e.zones = Array.isArray(e.zone) ? e.zone : (e.zone ? [e.zone] : []);
        }
        if (!e.type) e.type = 1;
      });
      buildFilterBar();
      renderLevel(1);
    })
    .catch(function() {
      document.getElementById('frise-container').innerHTML =
        '<p class="error">Impossible de charger events.json.</p>';
    });
}

/* ── Filtre zones ───────────────────────────────────────────────────── */

function buildFilterBar() {
  var container = document.getElementById('zone-filters');
  if (!container) return;
  container.innerHTML = '';
  ZONES.forEach(function(zone) {
    var col = COLORS[zone];
    if (!col) return;
    var label = document.createElement('label');
    label.className = 'zone-checkbox checked';
    var input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = true;
    input.addEventListener('change', (function(z) {
      return function() { toggleZone(z, this.checked); };
    })(zone));
    var dot = document.createElement('span');
    dot.className = 'zone-cb-dot';
    dot.style.background = col.bg;
    label.appendChild(input);
    label.appendChild(dot);
    label.appendChild(document.createTextNode('\u00a0' + zone));
    container.appendChild(label);
  });
}

function toggleZone(zone, checked) {
  if (checked) activeZones.add(zone);
  else         activeZones.delete(zone);
  document.querySelectorAll('.zone-checkbox').forEach(function(lbl) {
    var inp = lbl.querySelector('input');
    lbl.classList.toggle('checked',   inp.checked);
    lbl.classList.toggle('unchecked', !inp.checked);
  });
  refreshFrise();
}

function filterAll(checked) {
  activeZones = checked ? new Set(ZONES) : new Set();
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
  else if (currentLevel === 2 && currentCentury !== null) renderLevel(2, currentCentury);
  else if (currentLevel === 3 && currentDecade  !== null) renderLevel(3, currentDecade);
}

/* ── Rendu principal ────────────────────────────────────────────────── */

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

  ZONES.filter(function(z) { return activeZones.has(z); }).forEach(function(zone) {
    var evts = allEvents.filter(function(e) {
      if (!e.zones || e.zones.indexOf(zone) === -1) return false;
      if (!eventVisibleAtLevel(e, level)) return false;
      var fin = (e.date_fin && e.date_fin > e.date) ? e.date_fin : e.date;
      return e.date <= end && fin >= start;
    });
    container.appendChild(buildTrack(zone, evts, start, end, level));
  });

  var hint = document.createElement('div');
  hint.className = 'frise-hint';
  hint.textContent = level === 1
    ? 'Cliquez sur une période pour zoomer \u00b7 cliquez sur un événement pour sa fiche'
    : level === 2
    ? 'Cliquez sur une décennie pour zoomer \u00b7 cliquez sur un événement pour sa fiche'
    : 'Cliquez sur un événement pour afficher sa fiche complète';
  container.appendChild(hint);
}

/* ── Axe ────────────────────────────────────────────────────────────── */

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
    [1300, 1350, 1400, 1450].forEach(function(s) {
      var band = makeBand(s, s + 50, start, end, (function(sv) {
        return function() { renderLevel(2, Math.floor(sv / 100) * 100); };
      })(s));
      band.title = 'Zoomer sur ' + s + '\u2013' + (s + 50);
      bar.appendChild(band);
    });
  } else if (level === 2) {
    for (var d = currentCentury; d < currentCentury + 100; d += 10) {
      (function(decade) {
        var band = makeBand(decade, decade + 10, start, end, function() {
          renderLevel(3, decade);
        });
        band.title = 'Zoomer sur ' + decade + '\u2013' + (decade + 10);
        bar.appendChild(band);
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

/* ── Anti-collision ─────────────────────────────────────────────────── */

function chipWidthPct(evt, start, end, level) {
  if (evt.date_fin && evt.date_fin > evt.date) {
    return (Math.min(evt.date_fin, end) - Math.max(evt.date, start)) / (end - start) * 100;
  }
  if (level === 1) return 1.2;
  var chars = Math.min(evt.titre.length, level === 3 ? 28 : 20);
  return (chars * 7 + 16) / TRACK_PX * 100;
}

function assignRows(events, start, end, level) {
  var rowEnds = [];
  var safeGapPct = CHIP_PAD / TRACK_PX * 100;
  return events.map(function(evt) {
    var isPeriod = evt.date_fin && evt.date_fin > evt.date;
    var leftPct  = isPeriod
      ? (Math.max(evt.date, start) - start) / (end - start) * 100
      : (evt.date - start) / (end - start) * 100;
    var widthPct = chipWidthPct(evt, start, end, level);
    var rightPct = leftPct + widthPct;
    var row = 0;
    while (row < rowEnds.length && rowEnds[row] > leftPct - safeGapPct) row++;
    rowEnds[row] = rightPct;
    return row;
  });
}

/* ── Piste ──────────────────────────────────────────────────────────── */

function buildTrack(zone, events, start, end, level) {
  var row = document.createElement('div');
  row.className = 'track-row';
  var lbl = document.createElement('div');
  lbl.className = 'zone-label';
  var dot = document.createElement('span');
  dot.className = 'zone-dot';
  dot.style.background = COLORS[zone].bg;
  lbl.appendChild(dot);
  lbl.appendChild(document.createTextNode(zone));
  row.appendChild(lbl);

  var visible = events.filter(function(evt) {
    if (evt.date_fin && evt.date_fin > evt.date) {
      return Math.min(evt.date_fin, end) > Math.max(evt.date, start);
    }
    return evt.date >= start && evt.date <= end;
  });

  var rows   = assignRows(visible, start, end, level);
  var maxRow = visible.length > 0 ? Math.max.apply(null, rows) : 0;
  var trackH = (maxRow + 1) * ROW_H + maxRow * ROW_GAP + 8;

  var track = document.createElement('div');
  track.className = 'track';
  track.style.height = trackH + 'px';

  var line = document.createElement('div');
  line.className = 'track-line';
  line.style.top = (trackH / 2) + 'px';
  track.appendChild(line);

  visible.forEach(function(evt, i) {
    var chip = buildChip(evt, zone, start, end, level, rows[i]);
    if (chip) track.appendChild(chip);
  });

  row.appendChild(track);
  return row;
}

/* ── Chip ───────────────────────────────────────────────────────────── */

/* Taille du chip selon le type d'événement :
   type 1 = grand + gras (événement majeur)
   type 2 = taille normale
   type 3 = petit + discret */
function chipSizeClass(type) {
  if (type === 1) return 'chip-type1';
  if (type === 3) return 'chip-type3';
  return '';
}

function buildChip(evt, zone, start, end, level, rowIndex) {
  var col      = COLORS[zone] || COLORS['France'];
  var isPeriod = evt.date_fin && evt.date_fin > evt.date;
  var type     = evt.type || 1;
  var chip     = document.createElement('div');
  chip.className       = 'evt-chip';
  chip.style.position  = 'absolute';
  chip.style.transform = 'none';
  chip.style.top       = (4 + rowIndex * (ROW_H + ROW_GAP)) + 'px';

  if (isPeriod) {
    var d0 = Math.max(evt.date, start);
    var d1 = Math.min(evt.date_fin, end);
    if (d1 <= d0) return null;
    chip.classList.add('chip-period');
    chip.classList.add(chipSizeClass(type));
    chip.style.left        = pct(d0, start, end);
    chip.style.width       = 'calc(' + pct(d1, start, end) + ' - ' + pct(d0, start, end) + ')';
    chip.style.height      = ROW_H + 'px';
    chip.style.background  = col.bg + (type === 3 ? '88' : 'CC');
    chip.style.borderColor = col.bg;
    chip.style.color       = '#fff';
    if (level === 1) {
      chip.classList.add('chip-period-sm');
    } else {
      var max = level === 3 ? 40 : 22;
      chip.textContent = evt.titre.length > max ? evt.titre.slice(0, max - 1) + '\u2026' : evt.titre;
    }
    chip.title = evt.titre + ' (' + evt.date + '\u2013' + evt.date_fin + ')';

  } else {
    chip.style.height    = ROW_H + 'px';
    chip.style.left      = pct(evt.date, start, end);
    chip.style.transform = 'translateX(-50%)';

    if (level === 3) {
      chip.classList.add('chip-full');
      chip.classList.add(chipSizeClass(type));
      chip.style.background = type === 3 ? col.bg + 'AA' : col.bg;
      chip.style.color      = '#fff';
      chip.textContent = evt.titre.length > 28 ? evt.titre.slice(0, 26) + '\u2026' : evt.titre;
    } else if (level === 2) {
      chip.classList.add('chip-medium');
      chip.classList.add(chipSizeClass(type));
      chip.style.background  = col.light;
      chip.style.color       = col.text;
      chip.style.borderColor = col.bg;
      chip.textContent = evt.titre.length > 20 ? evt.titre.slice(0, 18) + '\u2026' : evt.titre;
    } else {
      chip.classList.add('chip-dot');
      chip.classList.add(chipSizeClass(type));
      chip.style.background   = col.bg;
      var dotSize = type === 1 ? 13 : type === 3 ? 7 : 10;
      chip.style.width        = dotSize + 'px';
      chip.style.height       = dotSize + 'px';
      chip.style.top          = (4 + rowIndex * (ROW_H + ROW_GAP) + ROW_H / 2 - dotSize / 2) + 'px';
      chip.style.borderRadius = '50%';
    }
    chip.title = evt.titre + ' (' + evt.date + ')';
  }

  chip.addEventListener('click', (function(e, z) {
    return function(ev) { ev.stopPropagation(); openModal(e, z); };
  })(evt, zone));
  return chip;
}

/* ── Modale plein écran ─────────────────────────────────────────────── */

function openModal(evt, zone) {
  var z   = zone || (evt.zones && evt.zones[0]) || 'France';
  var col = COLORS[z] || COLORS['France'];

  document.getElementById('modal-zone').textContent      = z;
  document.getElementById('modal-zone').style.background = col.light;
  document.getElementById('modal-zone').style.color      = col.text;

  /* Badge type */
  var typeEl = document.getElementById('modal-type');
  if (typeEl) {
    var t = evt.type || 1;
    typeEl.textContent = t === 1 ? '\u2605\u2605\u2605 Événement majeur'
                       : t === 2 ? '\u2605\u2605 Événement régional'
                       :           '\u2605 Événement local';
    typeEl.className = 'modal-type-badge type' + t;
  }

  document.getElementById('modal-date').textContent =
    (evt.date_fin && evt.date_fin > evt.date)
      ? evt.date + ' \u2013 ' + evt.date_fin + ' apr. J.-C.'
      : evt.date + ' apr. J.-C.';
  document.getElementById('modal-title').textContent   = evt.titre;
  document.getElementById('modal-desc').textContent    = evt.description;
  document.getElementById('modal-sources').textContent = evt.sources ? '\uD83D\uDCD6 ' + evt.sources : '';

  var imgEl = document.getElementById('modal-img');
  if (evt.image && evt.image.trim() !== '') {
    imgEl.innerHTML = '';
    var img = document.createElement('img');
    img.src = evt.image;
    img.alt = evt.titre;
    imgEl.appendChild(img);
    imgEl.style.display = 'block';
  } else {
    imgEl.style.display = 'none';
  }

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Navigation ─────────────────────────────────────────────────────── */

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
    html += '<span class="bc-sep"> \u203a </span>'
          + '<span class="bc-item bc-link" onclick="goLevel(2)">'
          + currentCentury + '\u2013' + (currentCentury + 100) + '</span>';
  if (currentLevel === 3 && currentDecade !== null)
    html += '<span class="bc-sep"> \u203a </span>'
          + '<span class="bc-item">'
          + currentDecade + '\u2013' + (currentDecade + 10) + '</span>';
  document.getElementById('breadcrumb').innerHTML = html;
}

function updateNavButtons() {
  document.querySelectorAll('.nav-btn').forEach(function(btn, i) {
    btn.classList.toggle('active', i + 1 === currentLevel);
    btn.disabled = (i === 1 && currentCentury === null)
                || (i === 2 && currentDecade  === null);
  });
  var prev  = document.getElementById('btn-prev');
  var next  = document.getElementById('btn-next');
  var lbl   = document.getElementById('decade-label');
  if (!prev || !next) return;
  var show = (currentLevel === 3 && currentDecade !== null);
  prev.style.display = show ? 'inline-block' : 'none';
  next.style.display = show ? 'inline-block' : 'none';
  if (lbl) lbl.style.display = show ? 'inline-block' : 'none';
  if (show) {
    prev.disabled = (currentDecade <= 1290);
    next.disabled = (currentDecade >= 1500);
    if (lbl) lbl.textContent = currentDecade + ' \u2013 ' + (currentDecade + 10);
  }
}

/* ── Utilitaires ────────────────────────────────────────────────────── */

function pct(year, start, end) {
  return ((year - start) / (end - start) * 100).toFixed(3) + '%';
}

/* ── Init ───────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function() {
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
