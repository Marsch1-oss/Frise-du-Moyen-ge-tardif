/* =====================================================================
   frise.js — Logique de la frise chronologique médiévale 1300–1500
   ===================================================================== */

const ZONES = [
  'France',
  'Angleterre',
  'St Empire',
  'Italie',
  'Pén. ibérique',
  'Europe C. & Or.',
  'Monde islamique',
  'Orient',
  'Monde'
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

// Niveaux de zoom
const LEVELS = {
  1: { start: 1290, end: 1510, label: 'Vue d\'ensemble (1300–1500)', step: 50 },
  2: { start: null, end: null, label: null, step: 10 },
  3: { start: null, end: null, label: null, step: 1 }
};

let currentLevel = 1;
let currentCentury = null;  // siècle sélectionné au niveau 2 (ex: 1300)
let currentDecade = null;   // décennie sélectionnée au niveau 3 (ex: 1340)
let allEvents = [];

// ─── Chargement des données ───────────────────────────────────────────────────

async function loadEvents() {
  try {
    const res = await fetch('events.json');
    allEvents = await res.json();
    buildLegend();
    renderLevel(1);
  } catch (e) {
    document.getElementById('frise-container').innerHTML =
      '<p class="error">Impossible de charger events.json. Vérifiez que le fichier est présent.</p>';
  }
}

function buildLegend() {
  const legend = document.getElementById('legend');
  if (!legend) return;
  legend.innerHTML = '';
  ZONES.forEach(zone => {
    const col = COLORS[zone];
    if (!col) return;
    const item = document.createElement('div');
    item.className = 'leg-item';
    item.innerHTML = `<span class="leg-dot" style="background:${col.bg}"></span>${zone}`;
    legend.appendChild(item);
  });
}

// ─── Rendu principal ──────────────────────────────────────────────────────────

function renderLevel(level, rangeStart, rangeEnd) {
  currentLevel = level;
  updateBreadcrumb();
  updateNavButtons();

  let start, end, tickStep, tickFormat;

  if (level === 1) {
    start = 1290; end = 1510; tickStep = 25;
    tickFormat = y => y;
  } else if (level === 2) {
    start = rangeStart; end = rangeStart + 100; tickStep = 10;
    tickFormat = y => y;
    currentCentury = rangeStart;
  } else {
    start = rangeStart; end = rangeStart + 10; tickStep = 1;
    tickFormat = y => y;
    currentDecade = rangeStart;
  }

  const container = document.getElementById('frise-container');
  container.innerHTML = '';

  // Axe temporel
  container.appendChild(buildAxis(start, end, tickStep, tickFormat, level));

  // Piste par zone géographique
  ZONES.forEach(zone => {
    const evts = allEvents.filter(e => {
  if (e.zone !== zone) return false;
  const fin = (e.date_fin && e.date_fin > e.date) ? e.date_fin : e.date;
  return e.date <= end && fin >= start;
});
    container.appendChild(buildTrack(zone, evts, start, end, level));
  });

  // Hint cliquable
  const hint = document.createElement('div');
  hint.className = 'frise-hint';
  hint.textContent = level === 1
    ? 'Cliquez sur une période pour zoomer — cliquez sur un événement pour sa fiche'
    : level === 2
    ? 'Cliquez sur une décennie pour zoomer — cliquez sur un événement pour sa fiche'
    : 'Cliquez sur un événement pour afficher sa fiche complète';
  container.appendChild(hint);
}

// ─── Construction de l'axe ───────────────────────────────────────────────────

function buildAxis(start, end, step, format, level) {
  const axis = document.createElement('div');
  axis.className = 'axis-row';

  const label = document.createElement('div');
  label.className = 'zone-label axis-spacer';
  axis.appendChild(label);

  const bar = document.createElement('div');
  bar.className = 'axis-bar';

  // Graduations
  for (let y = Math.ceil(start / step) * step; y <= end; y += step) {
    if (y < start || y > end) continue;
    const tick = document.createElement('div');
    tick.className = 'tick';
    tick.style.left = pct(y, start, end);
    tick.textContent = format(y);
    bar.appendChild(tick);

    const tickLine = document.createElement('div');
    tickLine.className = 'tick-line';
    tickLine.style.left = pct(y, start, end);
    bar.appendChild(tickLine);
  }

  // Zones cliquables (niveau 1 → siècles, niveau 2 → décennies)
  if (level === 1) {
    [1300, 1350, 1400, 1450].forEach(s => {
      const band = makeBand(s, s + 50, start, end, () => renderLevel(2, Math.floor(s / 100) * 100, null));
      band.title = `Zoomer sur ${s}–${s + 50}`;
      bar.appendChild(band);
    });
  } else if (level === 2) {
    for (let d = currentCentury; d < currentCentury + 100; d += 10) {
      const band = makeBand(d, d + 10, start, end, () => renderLevel(3, d, null));
      band.title = `Zoomer sur ${d}–${d + 10}`;
      bar.appendChild(band);
    }
  }

  axis.appendChild(bar);
  return axis;
}

function makeBand(from, to, start, end, onClick) {
  const band = document.createElement('div');
  band.className = 'axis-band';
  band.style.left = pct(from, start, end);
  band.style.width = `calc(${pct(to, start, end)} - ${pct(from, start, end)})`;
  band.addEventListener('click', onClick);
  return band;
}

// ─── Estimation de la largeur d'un chip en % de la piste ─────────────────────
// Permet de détecter les collisions AVANT le rendu DOM.

const TRACK_PX   = 820;  // largeur approximative de la zone de piste (px)
const ROW_H      = 24;   // hauteur d'une rangée (px)
const ROW_GAP    = 4;    // espace entre rangées (px)
const CHIP_PAD   = 6;    // marge horizontale de sécurité entre chips (px)

function chipWidthPct(evt, start, end, level) {
  const isPeriod = evt.date_fin && evt.date_fin > evt.date;
  if (isPeriod) {
    const d0 = Math.max(evt.date, start);
    const d1 = Math.min(evt.date_fin, end);
    return (d1 - d0) / (end - start) * 100;
  }
  // Pour les ponctuels, on estime la largeur selon le niveau et la longueur du titre
  if (level === 1) return 1.2;  // simple point, très étroit
  const chars = level === 3
    ? Math.min(evt.titre.length, 28)
    : Math.min(evt.titre.length, 20);
  const estimatedPx = chars * 7 + 16;
  return estimatedPx / TRACK_PX * 100;
}

// ─── Algorithme d'anti-collision par rangées ──────────────────────────────────
// Retourne pour chaque événement l'index de rangée (0, 1, 2…) où le placer.

function assignRows(events, start, end, level) {
  // rowEnds[r] = valeur en % de la fin du dernier chip placé sur la rangée r
  const rowEnds = [];

  return events.map(evt => {
    const isPeriod = evt.date_fin && evt.date_fin > evt.date;
    const leftPct = isPeriod
      ? (Math.max(evt.date, start) - start) / (end - start) * 100
      : (evt.date - start) / (end - start) * 100;
    const widthPct = chipWidthPct(evt, start, end, level);
    const rightPct = leftPct + widthPct;
    const safeGapPct = CHIP_PAD / TRACK_PX * 100;

    // Cherche la première rangée libre
    let row = 0;
    while (row < rowEnds.length && rowEnds[row] > leftPct - safeGapPct) {
      row++;
    }
    rowEnds[row] = rightPct;
    return row;
  });
}

// ─── Construction d'une piste ────────────────────────────────────────────────

function buildTrack(zone, events, start, end, level) {
  const row = document.createElement('div');
  row.className = 'track-row';

  const label = document.createElement('div');
  label.className = 'zone-label';
  const dot = document.createElement('span');
  dot.className = 'zone-dot';
  dot.style.background = COLORS[zone].bg;
  label.appendChild(dot);
  label.appendChild(document.createTextNode(zone));
  row.appendChild(label);

  // Filtrer les événements visibles
  const visible = events.filter(evt => {
    if (evt.date_fin && evt.date_fin > evt.date) {
      return Math.min(evt.date_fin, end) > Math.max(evt.date, start);
    }
    return evt.date >= start && evt.date <= end;
  });

  // Calculer les rangées anti-collision
  const rows = assignRows(visible, start, end, level);
  const numRows = visible.length > 0 ? Math.max(...rows) + 1 : 1;

  // Hauteur dynamique : une rangée minimum, s'étend si besoin
  const trackHeight = numRows * ROW_H + (numRows - 1) * ROW_GAP + 8;

  const track = document.createElement('div');
  track.className = 'track';
  track.style.height = trackHeight + 'px';

  // Ligne de fond (centrée verticalement)
  const line = document.createElement('div');
  line.className = 'track-line';
  line.style.top = (trackHeight / 2) + 'px';
  track.appendChild(line);

  visible.forEach((evt, i) => {
    const chip = buildChip(evt, start, end, level, rows[i], numRows, trackHeight);
    if (chip) track.appendChild(chip);
  });

  row.appendChild(track);
  return row;
}

function buildChip(evt, start, end, level, rowIndex, numRows, trackHeight) {
  const zone = evt.zone;
  const col = COLORS[zone] || COLORS['France'];
  const isPeriod = evt.date_fin && evt.date_fin > evt.date;
  const chip = document.createElement('div');
  chip.className = 'evt-chip';

  // Position verticale : répartit les rangées uniformément dans la hauteur de piste
  const topOffset = 4 + rowIndex * (ROW_H + ROW_GAP);
  chip.style.top = topOffset + 'px';
  chip.style.transform = 'none';  // annule le translateY(-50%) par défaut

  if (isPeriod) {
    const dateDebut = Math.max(evt.date, start);
    const dateFin   = Math.min(evt.date_fin, end);
    if (dateFin <= dateDebut) return null;

    chip.classList.add('chip-period');
    chip.style.position = 'absolute';
    chip.style.left    = pct(dateDebut, start, end);
    chip.style.width   = `calc(${pct(dateFin, start, end)} - ${pct(dateDebut, start, end)})`;
    chip.style.height  = ROW_H + 'px';
    chip.style.background  = col.bg + 'CC';
    chip.style.borderColor = col.bg;
    chip.style.color       = '#fff';

    if (level === 1) {
      chip.classList.add('chip-period-sm');
    } else {
      const maxChars = level === 3 ? 40 : 22;
      const lbl = evt.titre.length > maxChars ? evt.titre.slice(0, maxChars - 1) + '…' : evt.titre;
      chip.textContent = lbl;
    }
    chip.title = `${evt.titre} (${evt.date}–${evt.date_fin})`;

  } else {
    chip.style.position = 'absolute';
    chip.style.height   = ROW_H + 'px';

    if (level === 3) {
      chip.classList.add('chip-full');
      chip.style.background = col.bg;
      chip.style.color      = '#fff';
      chip.style.transform  = 'translateX(-50%)';
      chip.style.left       = pct(evt.date, start, end);
      const shortTitle = evt.titre.length > 28 ? evt.titre.slice(0, 26) + '…' : evt.titre;
      chip.textContent = shortTitle;
    } else if (level === 2) {
      chip.classList.add('chip-medium');
      chip.style.background   = col.light;
      chip.style.color        = col.text;
      chip.style.borderColor  = col.bg;
      chip.style.transform    = 'translateX(-50%)';
      chip.style.left         = pct(evt.date, start, end);
      const shortTitle = evt.titre.length > 20 ? evt.titre.slice(0, 18) + '…' : evt.titre;
      chip.textContent = shortTitle;
    } else {
      chip.classList.add('chip-dot');
      chip.style.background = col.bg;
      chip.style.left       = pct(evt.date, start, end);
      chip.style.transform  = 'translateX(-50%)';
      chip.style.width      = '10px';
      chip.style.height     = '10px';
      chip.style.top        = (topOffset + ROW_H / 2 - 5) + 'px';
      chip.style.borderRadius = '50%';
    }
    chip.title = `${evt.titre} (${evt.date})`;
  }

  chip.addEventListener('click', e => {
    e.stopPropagation();
    openModal(evt);
  });

  return chip;
}

// ─── Fiche modale ─────────────────────────────────────────────────────────────

function openModal(evt) {
  const col = COLORS[evt.zone] || COLORS['France'];
  document.getElementById('modal-zone').textContent = evt.zone;
  document.getElementById('modal-zone').style.background = col.light;
  document.getElementById('modal-zone').style.color = col.text;
  const dateLabel = evt.date_fin && evt.date_fin > evt.date
    ? `${evt.date} – ${evt.date_fin} apr. J.-C.`
    : `${evt.date} apr. J.-C.`;
  document.getElementById('modal-date').textContent = dateLabel;
  document.getElementById('modal-title').textContent = evt.titre;
  document.getElementById('modal-desc').textContent = evt.description;
  document.getElementById('modal-sources').textContent = evt.sources ? '📖 ' + evt.sources : '';

  const imgEl = document.getElementById('modal-img');
  if (evt.image && evt.image.trim() !== '') {
    imgEl.innerHTML = `<img src="${evt.image}" alt="${evt.titre}">`;
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

// ─── Navigation ───────────────────────────────────────────────────────────────

function goLevel(level) {
  if (level === 1) {
    renderLevel(1);
  } else if (level === 2 && currentCentury !== null) {
    renderLevel(2, currentCentury);
  } else if (level === 3 && currentDecade !== null) {
    renderLevel(3, currentDecade);
  }
}

function updateBreadcrumb() {
  const bc = document.getElementById('breadcrumb');
  let html = `<span class="bc-item bc-link" onclick="goLevel(1)">1300–1500</span>`;
  if (currentLevel >= 2 && currentCentury !== null) {
    html += `<span class="bc-sep">›</span><span class="bc-item bc-link" onclick="goLevel(2)">${currentCentury}–${currentCentury + 100}</span>`;
  }
  if (currentLevel === 3 && currentDecade !== null) {
    html += `<span class="bc-sep">›</span><span class="bc-item">${currentDecade}–${currentDecade + 10}</span>`;
  }
  bc.innerHTML = html;
}

function updateNavButtons() {
  document.querySelectorAll('.nav-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i + 1 === currentLevel);
    btn.disabled = (i === 1 && currentCentury === null) || (i === 2 && currentDecade === null);
  });
}

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function pct(year, start, end) {
  return ((year - start) / (end - start) * 100).toFixed(3) + '%';
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Fermeture modale
  document.getElementById('modal-overlay').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  loadEvents();
});
