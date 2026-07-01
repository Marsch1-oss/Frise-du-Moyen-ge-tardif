
/* frise.js — Frise chronologique medievale 1300-1500 */

var ZONES = [
  'France', 'Angleterre', 'St Empire',
  'Naples', 'Italie', 'Castille', 'Aragon', 'Portugal', 'Papaute', 'Alsace', 'Flandre',
  'Scandinavie', 'Pologne', 'Russie',
  'Hongrie', 'Europe C. & Or.', 'Byzance', 'Ottomans',
  'Monde islamique', 'Orient', 'Japon', 'Chine', 'Inde',
  'Afrique', 'Amerique', 'Monde', 'Atlas'
];

/* Les anciens « thèmes-zones » (Art, Techniques, Sciences, Idées, Littérature)
   sont désormais gérés via les thèmes-icônes (champ evt.theme).
   « Atlas » (Cartes/Maps) reste un filtre autonome, hors géographie et hors thèmes. */
var ZONES_GROUPS = {
  'Europe occidentale': ['France', 'Angleterre', 'St Empire', 'Naples', 'Italie', 'Castille', 'Aragon', 'Portugal', 'Papaute', 'Alsace', 'Flandre'],
  'Europe du Nord':     ['Scandinavie'],
  'Europe orientale':   ['Pologne', 'Russie', 'Hongrie', 'Europe C. & Or.', 'Byzance', 'Ottomans'],
  'Asie & Islam':       ['Monde islamique', 'Orient', 'Japon', 'Chine', 'Inde'],
  'Afrique & Amérique': ['Afrique', 'Amerique'],
  'Monde':              ['Monde'],
  'Cartographie':       ['Atlas']
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
  'Flandre':             { bg: '#C26A1A', light: '#F7EADB', text: '#5C2E08' },
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
  'Flandre':             'Flandre',
  'Flandres':            'Flandre',
  'Flanders':            'Flandre',
  'Comté de Flandre':    'Flandre',
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

var ROW_H    = 30;
var ROW_GAP  = 18;
var CHIP_PAD = 10;
var TRACK_PX = 860;

var currentLevel   = 1;
var currentYear    = null;
var searchTerm     = '';
var searchFilterActive = false;
var currentCentury = null;
var currentDecade  = null;
var startZones     = null;  /* zones sélectionnées au départ (wizard) → cible du bouton « frise complète » */
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
  /* Mode parcours actif : seuls les événements de la série sont visibles */
  if (typeof activeParcours !== 'undefined' && activeParcours) {
    return parseSeries(evt.serie).indexOf(activeParcours) !== -1;
  }
  /* Mode recherche active : seuls les événements correspondants sont visibles */
  if (typeof searchFilterActive !== 'undefined' && searchFilterActive) {
    return eventMatchesSearch(evt);
  }
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
/* ── Synthèses décennales par zone ──────────────────────────────── */
var _syntheses = {};   /* clé "Zone|décennie" -> { titre, texte, auto } */

function loadSyntheses() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'syntheses.json?v=' + Date.now(), true);
  xhr.onload = function() {
    if (xhr.status === 200 || xhr.status === 0) {
      try { _syntheses = JSON.parse(xhr.responseText) || {}; }
      catch (e) { _syntheses = {}; }
    }
  };
  xhr.onerror = function() { _syntheses = {}; };
  xhr.send();
}

/* Génère un brouillon de synthèse à partir des fiches de la période */
function generateSynthese(zone, dec) {
  var evts = allEvents.filter(function(e) {
    return !e.regne && e.zones.indexOf(zone) !== -1 &&
           e.date >= dec && e.date < dec + 10;
  }).sort(function(a, b) {
    var da = a.date + (a.mois ? (a.mois - 1) / 12 : 0);
    var db = b.date + (b.mois ? (b.mois - 1) / 12 : 0);
    return da - db;
  });
  if (evts.length === 0) return null;

  /* Intro : les événements majeurs (types 2-3) en phrase */
  var majeurs = evts.filter(function(e) { return (Number(e.type) || 3) <= 3; });
  var intro = 'Au cours de la décennie ' + dec + '-' + (dec + 9) +
              ', la zone « ' + zone + ' » compte ' + evts.length +
              ' événement' + (evts.length > 1 ? 's' : '') + ' notable' +
              (evts.length > 1 ? 's' : '') +
              (majeurs.length ? ', dont ' + majeurs.length + ' majeur' +
               (majeurs.length > 1 ? 's' : '') : '') + '.';

  /* Corps : liste chronologique titre + début de description */
  var lignes = evts.map(function(e) {
    var d = e.date + (e.mois ? '' : '');
    var desc = stripDescMarks(e.description || '').replace(/\s+/g, ' ').trim();
    if (desc.length > 160) desc = desc.slice(0, 157) + '…';
    return d + ' — ' + e.titre + (desc ? ' : ' + desc : '');
  });

  return {
    titre: zone + ' · ' + dec + '-' + (dec + 9),
    texte: intro + '\n\n' + lignes.join('\n'),
    auto: true,
    nbFiches: evts.length
  };
}

/* Renvoie la synthèse rédigée si elle existe, sinon le brouillon auto */
function getSynthese(zone, dec) {
  var key = zone + '|' + dec;
  if (_syntheses[key]) {
    var s = _syntheses[key];
    return { titre: s.titre || (zone + ' · ' + dec), texte: s.texte || '', auto: false };
  }
  return generateSynthese(zone, dec);
}

function loadEvents() {
  var xhr = new XMLHttpRequest();
  /* Anti-cache : force la lecture de la dernière version du fichier à chaque ouverture */
  xhr.open('GET', 'events.json?v=' + Date.now(), true);
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
        getAllParcours();
        buildFilterBar();
        loadSyntheses();   /* charge les synthèses rédigées (optionnel) */
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
  else if (currentLevel === 4 && currentYear !== null) renderLevel(4, currentYear);
  else                         renderLevel(3, currentDecade);
}

/* ── Rendu principal ─────────────────────────────────────────────────*/
function renderLevel(level, rangeStart) {
  var _prevLevel = currentLevel;
  currentLevel = level;
  /* Gère le bandeau de synthèse : le masquer si on quitte la vue décennale
     ou si l'on change de décennie (la synthèse ne correspondrait plus) */
  if (typeof _currentSynthese !== 'undefined' && _currentSynthese) {
    if (level !== 3 || rangeStart !== _currentSynthese.dec) {
      var _sb = document.getElementById('synthese-banner');
      if (_sb) _sb.style.display = 'none';
      _currentSynthese = null;
    }
  }
  /* À la PREMIÈRE entrée en vue annuelle (depuis une autre échelle),
     ouvrir au niveau de détail Complet pour ne pas afficher une vue vide.
     (Si on était déjà en vue annuelle, on respecte le détail choisi par l'usager.) */
  if (level === 4 && _prevLevel !== 4) {
    detailLevel = 4;
    document.querySelectorAll('.detail-btn').forEach(function(b) {
      b.classList.toggle('active', parseInt(b.dataset.level) === 4);
    });
  }
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
  updateSyntheseBar();
  updatePeriodBanner(level, rangeStart || 1300);

  var container = document.getElementById('frise-container');
  container.innerHTML = '';
  container.appendChild(buildAxis(start, end, tickStep, level));
  updateStickyAxis(start, end, tickStep, level);   /* échelle fixe sous la barre nav */

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
  _shownImages = {};  /* réinitialise le registre d'images à chaque rendu */

  /* ── Numérotation globale des événements visibles ──
     Tous les événements visibles de la période (toutes zones actives
     confondues), triés chronologiquement. Dates identiques → suffixes a,b,c */
  _globalNum = {};
  var numList = allEvents.filter(function(e) {
    if (e.regne) return false;
    if (!visibleAtLevel(e, level)) return false;
    if (!e.zones.some(function(z) { return activeZones[z]; })) return false;
    var fin = (e.date_fin && e.date_fin > e.date) ? e.date_fin : e.date;
    return e.date <= end && fin >= start;
  }).sort(function(a, b) {
    var da = a.date + (a.mois ? (a.mois - 1) / 12 : 0);
    var db = b.date + (b.mois ? (b.mois - 1) / 12 : 0);
    return da - db;
  });
  /* Groupe les événements par date identique (année + mois) */
  var groups = [];      /* chaque groupe = liste d'events de même date */
  var lastKey = null;
  numList.forEach(function(e) {
    var key = e.date + '-' + (e.mois || 0);
    if (key !== lastKey) { groups.push([]); lastKey = key; }
    groups[groups.length - 1].push(e);
  });
  /* Attribue un numéro par groupe ; suffixe a,b,c si le groupe a >1 événement */
  groups.forEach(function(grp, gi) {
    var num = gi + 1;
    if (grp.length === 1) {
      _globalNum[grp[0].id] = '' + num;
    } else {
      grp.forEach(function(e, k) {
        _globalNum[e.id] = num + String.fromCharCode(97 + k); /* 'a','b','c'... */
      });
    }
  });


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

    if (level >= 3 && !activeParcours && !searchFilterActive) {
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

  setTimeout(function() { injectBackgroundImages(container, start, end, level); }, 180);

  if (searchTerm) applySearch();
}

/* ── Axe ─────────────────────────────────────────────────────────────*/
/* Remplit la bande d'échelle chronologique FIXE (sous la barre de navigation).
   Reproduit les graduations de l'axe pour qu'elles restent visibles au défilement. */
/* ── Liste des événements de la période ───────────────────────────── */
var _eliFilterLevel = 4;  /* 2=Important, 3=Détaillé, 4=Complet */

function eliSetFilter(lvl) {
  _eliFilterLevel = lvl;
  document.querySelectorAll('.eli-filter-btn').forEach(function(b) {
    b.classList.toggle('active', parseInt(b.dataset.lvl) === lvl);
  });
  openEventList();   /* régénère la liste avec le nouveau filtre */
}

/* Un événement passe-t-il le filtre de niveau de la liste ?
   niveau 2 = Important (types 2-3), 3 = Détaillé (2-4), 4 = Complet (tous) */
function eliPassesFilter(evt) {
  var t = (evt.type === undefined || evt.type === null || evt.type === '')
        ? 2 : parseInt(evt.type, 10);
  if (isNaN(t) || t < 1) t = 2;
  if (t === 1) return false;            /* règnes exclus */
  if (_eliFilterLevel === 2) return t <= 3;
  if (_eliFilterLevel === 3) return t <= 4;
  return true;                          /* Complet */
}

/* Navigation d'une période à l'autre directement depuis la vue liste :
   réutilise navigatePeriod (qui met à jour l'état + la frise sous l'overlay)
   puis reconstruit la liste pour la nouvelle période. */
function eliNavigatePeriod(direction) {
  if (activeParcours) return;                 /* en mode parcours, la liste est le fil complet */
  navigatePeriod(direction);                  /* déplace currentDecade/Year/Century + bornes */
  openEventList();                            /* reconstruit la liste (filtres zones/thèmes/niveau conservés) */
}

/* Met à jour le libellé et l'activation des boutons ‹ / › de la liste */
function eliUpdatePeriodNav() {
  var nav = document.getElementById('eli-period-nav');
  if (!nav) return;
  var navigable = !activeParcours && (
    (currentLevel === 3 && currentDecade  !== null) ||
    (currentLevel === 4 && currentYear    !== null) ||
    (currentLevel === 2 && currentCentury !== null)
  );
  nav.style.display = navigable ? 'flex' : 'none';
  if (!navigable) return;
  var lbl = document.getElementById('eli-period-label');
  var prevBtn = document.getElementById('eli-period-prev');
  var nextBtn = document.getElementById('eli-period-next');
  var label, canPrev, canNext;
  if (currentLevel === 4) {
    label = 'Année ' + currentYear;
    canPrev = currentYear > 1290;  canNext = currentYear < 1509;
  } else if (currentLevel === 3) {
    label = currentDecade + '\u2013' + (currentDecade + 9);
    canPrev = currentDecade > 1290;  canNext = currentDecade < 1500;
  } else {
    label = currentCentury + '\u2013' + (currentCentury + 100);
    canPrev = currentCentury > 1200;  canNext = currentCentury < 1500;
  }
  if (lbl) lbl.textContent = label;
  if (prevBtn) prevBtn.disabled = !canPrev;
  if (nextBtn) nextBtn.disabled = !canNext;
}

function openEventList() {
  var overlay = document.getElementById('event-list-overlay');
  var body = document.getElementById('event-list-body');
  var titleEl = document.getElementById('event-list-title');
  if (!overlay || !body) return;

  /* En mode parcours, le filtre par niveau (Important/Détaillé/Complet) ne s'applique pas */
  document.querySelectorAll('.eli-filter-label, .eli-filter-btn[data-lvl]').forEach(function(el) {
    el.style.display = activeParcours ? 'none' : '';
  });

  var list, periodeLabel;
  if (activeParcours) {
    /* Mode parcours : la liste ne présente QUE les événements du parcours sélectionné
       (l'ensemble du fil, sans restriction de période, de zone ni de niveau). */
    periodeLabel = 'Parcours : ' + activeParcours;
    list = getParcoursSteps(activeParcours).filter(function(e) { return !e.regne; });
  } else {
    /* Détermine les bornes de la période courante selon le niveau */
    var start, end;
    if (currentLevel === 4 && currentYear !== null) {
      start = currentYear; end = currentYear + 1;
      periodeLabel = 'Année ' + currentYear;
    } else if (currentLevel === 3 && currentDecade !== null) {
      start = currentDecade; end = currentDecade + 10;
      periodeLabel = 'Décennie ' + currentDecade + '\u2013' + (currentDecade + 9);
    } else if (currentLevel === 2 && currentCentury !== null) {
      start = currentCentury; end = currentCentury + 100;
      periodeLabel = 'Siècle ' + currentCentury + '\u2013' + (currentCentury + 100);
    } else {
      start = 1290; end = 1510;
      periodeLabel = 'Ensemble de la période';
    }
    /* Collecte les événements visibles (mêmes règles que la frise) */
    list = allEvents.filter(function(e) {
      if (e.regne) return false;
      if (!eliPassesFilter(e)) return false;   /* filtre Important/Détaillé/Complet */
      if (!eventMatchesTheme(e)) return false; /* filtre thématique (légende) */
      if (!e.zones.some(function(z) { return activeZones[z]; })) return false;
      var fin = (e.date_fin && e.date_fin > e.date) ? e.date_fin : e.date;
      return e.date < end && fin >= start;
    }).sort(function(a, b) {
      var da = a.date + (a.mois ? (a.mois - 1) / 12 : 0);
      var db = b.date + (b.mois ? (b.mois - 1) / 12 : 0);
      return da - db;
    });
  }

  if (titleEl) {
    titleEl.innerHTML = 'Liste des événements ' +
      '<span class="eli-count">' + periodeLabel + ' — ' + list.length +
      ' événement' + (list.length > 1 ? 's' : '') + '</span>';
  }

  /* Barre de navigation période (‹ Précédente / Suivante ›) */
  eliUpdatePeriodNav();

  /* Bandeau d'état (mode lecture « Liste ») : reprend la configuration courante */
  var eliStatus = document.getElementById('eli-status');
  if (eliStatus) {
    if (typeof updateNavStatus === 'function') updateNavStatus();
    var niEl = document.getElementById('nav-status-info');
    eliStatus.innerHTML =
      '<span class="eli-status-info">Mode lecture : <b>Liste des événements</b> &nbsp;\u00b7&nbsp; ' +
      (niEl ? niEl.innerHTML : '') + '</span>' +
      '<button class="nav-status-home" onclick="backToDecade()" title="Quitter la liste, supprimer les filtres et revenir à la frise décennale en cours">\u21A9 Retour à la frise complète</button>';
  }

  /* Accès aux synthèses décennales depuis la liste (zones actives ayant une synthèse rédigée) */
  var eliSyn = document.getElementById('eli-synthese');
  if (eliSyn) {
    eliSyn.innerHTML = '';
    var synFound = 0;
    if (!(typeof activeParcours !== 'undefined' && activeParcours) && currentDecade !== null) {
      ZONES.forEach(function(zone) {
        if (!activeZones[zone]) return;
        var key = zone + '|' + currentDecade;
        if (!_syntheses[key]) return;
        synFound++;
        var s = _syntheses[key];
        var titreSynth = (s && s.titre && s.titre.trim())
          ? s.titre.trim()
          : zone + ' (' + currentDecade + '-' + (currentDecade + 9) + ')';
        var col = COLORS[zone] || COLORS['France'];
        var b = document.createElement('button');
        b.className = 'eli-synthese-btn';
        b.style.background = col.bg;
        b.textContent = '\uD83D\uDCD6 Synthèse : ' + titreSynth;
        b.title = 'Lire la synthèse : ' + titreSynth;
        b.onclick = (function(z, d) {
          return function() { closeEventList(); showSyntheseBanner(z, d); };
        })(zone, currentDecade);
        eliSyn.appendChild(b);
      });
    }
    eliSyn.style.display = synFound > 0 ? 'flex' : 'none';
  }

  body.innerHTML = '';
  if (list.length === 0) {
    body.innerHTML = '<p class="eli-empty">Aucun événement pour cette période et les zones actives.</p>';
  } else {
    var MOIS = ['', 'janvier','février','mars','avril','mai','juin',
                'juillet','août','septembre','octobre','novembre','décembre'];
    list.forEach(function(e) {
      /* Zone d'affichage : 1re zone active de l'événement */
      var zoneAff = (e.zones || []).filter(function(z){ return activeZones[z]; })[0] || (e.zones||[])[0];
      var col = COLORS[zoneAff] || COLORS['France'];

      var card = document.createElement('div');
      card.className = 'eli-card';
      card.style.setProperty('--zone-color', col.bg);
      card.onclick = (function(ev, z) {
        return function() { openModal(ev, z); };   /* la liste reste ouverte dessous → on y revient en fermant la fiche */
      })(e, zoneAff);

      /* Vignette si image */
      var thumbHtml = '';
      if ((e.image || '').trim()) {
        thumbHtml = '<img class="eli-thumb" src="' + e.image + '" alt="" ' +
                    'onerror="this.style.display=\'none\'">';
      }

      /* Date lisible (avec mois si présent) */
      var dateTxt = (e.mois ? MOIS[e.mois] + ' ' : '') + e.date;
      if (e.date_fin && e.date_fin > e.date) {
        dateTxt += ' – ' + (e.mois_fin ? MOIS[e.mois_fin] + ' ' : '') + e.date_fin;
      }

      var desc = stripDescMarks(e.description || '').replace(/\s+/g, ' ').trim();
      if (desc.length > 280) desc = desc.slice(0, 277) + '…';

      card.innerHTML =
        thumbHtml +
        '<div class="eli-content">' +
          '<div class="eli-head">' +
            '<span class="eli-date">' + dateTxt + '</span>' +
            '<span class="eli-zone" style="background:' + col.bg + ';">' + zoneAff + '</span>' +
          '</div>' +
          '<div class="eli-title">' + themePrefix(e) + (e.titre || '') + '</div>' +
          (desc ? '<div class="eli-desc">' + desc + '</div>' : '') +
        '</div>';
      body.appendChild(card);
    });
  }

  /* Synchronise l'état visuel des boutons de filtre */
  document.querySelectorAll('.eli-filter-btn').forEach(function(b) {
    b.classList.toggle('active', parseInt(b.dataset.lvl) === _eliFilterLevel);
  });
  renderEliThemeFilter();

  overlay.style.display = 'block';
  overlay.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

/* Filtres thématiques dans l'en-tête de la liste (mêmes thèmes que la légende) */
function renderEliThemeFilter() {
  var box = document.getElementById('eli-theme-filter');
  if (!box) return;
  box.innerHTML = '';
  var lbl = document.createElement('span');
  lbl.className = 'eli-filter-label';
  lbl.textContent = 'Thème\u00A0:';
  box.appendChild(lbl);

  var keys = THEME_ORDER.slice().reverse();
  for (var key in THEME_DEFS) { if (keys.indexOf(key) === -1) keys.push(key); }

  keys.forEach(function(t) {
    var d = THEME_DEFS[t];
    if (!d) return;
    var btn = document.createElement('button');
    btn.className = 'eli-filter-btn eli-theme-btn' + (activeThemes[t] ? ' active' : '');
    btn.innerHTML = d.icon + ' ' + d.label;
    btn.onclick = (function(theme) {
      return function() {
        activeThemes[theme] = !activeThemes[theme];
        openEventList();                 /* régénère la liste */
        if (typeof renderThemeLegend === 'function') renderThemeLegend();  /* sync légende frise */
      };
    })(t);
    box.appendChild(btn);
  });

  var anyActive = false;
  for (var k in activeThemes) if (activeThemes[k]) anyActive = true;
  if (anyActive) {
    var reset = document.createElement('button');
    reset.className = 'theme-legend-reset';
    reset.textContent = '\u2715 Tous';
    reset.onclick = function() {
      activeThemes = {};
      openEventList();
      if (typeof renderThemeLegend === 'function') renderThemeLegend();
    };
    box.appendChild(reset);
  }
}

function closeEventList() {
  var overlay = document.getElementById('event-list-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function updateStickyAxis(start, end, step, level) {
  var wrap = document.getElementById('sticky-axis');
  var bar = document.getElementById('sticky-axis-bar');
  if (!wrap || !bar) return;
  bar.innerHTML = '';

  if (level === 4) {
    /* Vue annuelle : graduations par mois */
    var MOIS = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];
    for (var m = 0; m < 12; m++) {
      var lp = (m / 12) * 100;
      var t = document.createElement('div');
      t.className = 'sticky-axis-tick';
      t.style.left = lp + '%';
      t.textContent = MOIS[m];
      bar.appendChild(t);
      var tlm = document.createElement('div');
      tlm.className = 'sticky-axis-tickline';
      tlm.style.left = lp + '%';
      bar.appendChild(tlm);
    }
  } else {
    /* En vue décennale : chaque année devient une BANDE CLIQUABLE vers la vue annuelle */
    if (level === 3 && currentDecade !== null) {
      for (var yy = currentDecade; yy < currentDecade + 10; yy++) {
        (function(yr) {
          var l0 = (yr - start) / (end - start) * 100;
          var l1 = (yr + 1 - start) / (end - start) * 100;
          var zone = document.createElement('div');
          zone.className = 'sticky-axis-zone';
          zone.style.left = l0 + '%';
          zone.style.width = (l1 - l0) + '%';
          zone.title = 'Année ' + yr + ' \u2192 vue annuelle';
          zone.onclick = function() { currentYear = yr; renderLevel(4, yr); };
          bar.appendChild(zone);
        })(yy);
      }
    }
    for (var y = Math.ceil(start / step) * step; y <= end; y += step) {
      var lpct = (y - start) / (end - start) * 100;
      var tick = document.createElement('div');
      tick.className = 'sticky-axis-tick';
      tick.style.left = lpct + '%';
      tick.textContent = Math.round(y);
      if (level === 3) tick.classList.add('sticky-axis-tick-click');
      bar.appendChild(tick);
      var tl = document.createElement('div');
      tl.className = 'sticky-axis-tickline';
      tl.style.left = lpct + '%';
      bar.appendChild(tl);
    }
  }
  /* Indice visuel en vue décennale */
  var hint = document.getElementById('sticky-axis-hint');
  if (hint) hint.style.display = (level === 3) ? 'inline' : 'none';
  wrap.style.display = 'block';
}

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
  /* Tri par date puis répartition en 2 strates :
     majeurs (type <= 3) placés en premier sur les lignes du haut,
     secondaires (type >= 4) placés ensuite sur les lignes du dessous,
     sans jamais réutiliser les lignes occupées par les majeurs */
  function evtLeft(evt) {
    var isPeriod = evt.date_fin && evt.date_fin > evt.date;
    if (isPeriod) {
      return (Math.max(evt.date, start) - start) / (end - start) * 100;
    }
    /* Inclut le mois pour rester cohérent avec le rendu du chip */
    var dF = evt.date + (evt.mois ? (evt.mois - 1) / 12 : 0);
    return (dF - start) / (end - start) * 100;
  }
  function sortByDate(a, b) {
    var da = a.date + (a.mois ? (a.mois - 1) / 12 : 0);
    var db = b.date + (b.mois ? (b.mois - 1) / 12 : 0);
    return da - db;
  }

  var majeurs     = regulars.filter(function(e){ return (Number(e.type)||2) <= 3; }).sort(sortByDate);
  var secondaires = regulars.filter(function(e){ return (Number(e.type)||2) >= 4; }).sort(sortByDate);

  /* Calcule les bornes RÉELLES gauche/droite d'un chip selon son centrage
     (translateX -50% au centre, 0% au début, -100% en fin de frise) */
  function chipBounds(evt) {
    var isPeriod = evt.date_fin && evt.date_fin > evt.date;
    var w = chipW(evt, start, end, level);
    if (isPeriod) {
      var l = evtLeft(evt);
      return { x0: l, x1: l + w };
    }
    var anchor = evtLeft(evt);
    var finalPct = Math.min(Math.max(anchor, 3), 97);
    if (finalPct > 88)      return { x0: finalPct - w, x1: finalPct };       /* translateX(-100%) */
    else if (finalPct < 8)  return { x0: finalPct,     x1: finalPct + w };   /* translateX(0%) */
    else                    return { x0: finalPct - w/2, x1: finalPct + w/2 };/* translateX(-50%) */
  }

  /* Place une liste d'événements sur des lignes sans chevauchement.
     rowsBounds[row] = liste des intervalles [x0,x1] occupés sur cette ligne */
  function placeOn(list, rowsBounds, baseRow, rowMap) {
    for (var i = 0; i < list.length; i++) {
      var b = chipBounds(list[i]);
      var row = 0;
      while (row < rowsBounds.length) {
        var collide = false;
        var occ = rowsBounds[row];
        for (var k = 0; k < occ.length; k++) {
          if (b.x0 < occ[k].x1 + gap && b.x1 > occ[k].x0 - gap) { collide = true; break; }
        }
        if (!collide) break;
        row++;
      }
      if (rowsBounds[row] === undefined) rowsBounds[row] = [];
      rowsBounds[row].push(b);
      rowMap[list[i].id] = baseRow + row;
    }
    return rowsBounds.length;
  }

  var rowMap = {};
  /* 1. Majeurs sur les lignes du haut */
  var majBounds = [];
  var nbMajRows = placeOn(majeurs, majBounds, 0, rowMap);
  /* 2. Secondaires sous les majeurs */
  var secBounds = [];
  placeOn(secondaires, secBounds, nbMajRows, rowMap);
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
      /* En mode parcours, tous les règnes des zones actives restent
         affichés comme repères chronologiques pour le lecteur */
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

var _shownImages = {};  /* registre des images déjà affichées (vignettes) */
var _globalNum = {};    /* numéro d'ordre global de chaque événement (id -> '3a') */

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
  /* Enregistre ces images comme déjà affichées */
  withImg.forEach(function(e) { _shownImages[e.image] = true; });
  var galleryRow = document.createElement('div');
  galleryRow.className = 'illus-row';
  var spacer = document.createElement('div');
  spacer.className = 'zone-label illus-spacer';
  galleryRow.appendChild(spacer);
  var band = document.createElement('div');
  band.className = 'illus-band';
  band.style.height = (ILLUS_H + 8) + 'px';
  /* Trie par date et répartit les vignettes sans chevauchement horizontal.
     Largeur en % d'une vignette = ILLUS_W / TRACK_PX */
  withImg.sort(function(a, b) {
    var da = a.date + (a.mois ? (a.mois - 1) / 12 : 0);
    var db = b.date + (b.mois ? (b.mois - 1) / 12 : 0);
    return da - db;
  });
  var vignWpct = (ILLUS_W + 6) / TRACK_PX * 100;  /* largeur + marge */
  var lastRight = -Infinity;
  withImg.forEach(function(evt) {
    var dateF = evt.date + (evt.mois ? (evt.mois - 1) / 12 : 0);
    var idealLeft = Math.max(0, Math.min(98, (dateF - start) / (end - start) * 100));
    /* Décale vers la droite si la vignette précédente déborde */
    var leftPct = Math.max(idealLeft, lastRight);
    if (leftPct + vignWpct > 100) leftPct = 100 - vignWpct;  /* ne dépasse pas le bord */
    lastRight = leftPct + vignWpct;
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
    if (!eventMatchesTheme(evt)) return false;   /* filtre thématique (légende) */
    var fin = (evt.date_fin && evt.date_fin > evt.date) ? evt.date_fin : evt.date;
    return evt.date <= end && fin >= start;
  });
  var rows = assignRows(visible, start, end, level);
  var maxR = visible.length > 0 ? Math.max.apply(null, rows) : -1;
  var evtH = (maxR + 1) * ROW_H + maxR * ROW_GAP + 26;  /* +marge étiquettes */
  var track = document.createElement('div');
  track.className = 'track';
  track.style.height    = evtH + 'px';
  track.style.minHeight = evtH + 'px';
  track.style.flexShrink = '0';
  /* Force aussi la track-row à adopter cette hauteur */
  row.style.minHeight = evtH + 'px';
  var line = document.createElement('div');
  line.className = 'track-line';
  line.style.top = (evtH / 2) + 'px';
  track.appendChild(line);
  for (var i = 0; i < visible.length; i++) {
    var chip = buildChip(visible[i], zone, start, end, level, rows[i]);
    if (chip) {
      track.appendChild(chip);
    }
  }
  row.appendChild(track);
  return row;
}

/* ── Illustrations de fond dans les espaces vides ───────────────────*/
function injectBackgroundImages(container, start, end, level) {
  /* Pas de grandes images de fond en mode parcours ou recherche
     (frise éparse : les vignettes sous les pistes suffisent et
      évitent tout risque de recouvrement des cartouches) */
  if (activeParcours || searchFilterActive) {
    var card0 = document.querySelector('.frise-card');
    if (card0) card0.querySelectorAll('.frise-bg-strip').forEach(function(el){ el.remove(); });
    container.querySelectorAll('.frise-bgf-wrap').forEach(function(el){ el.remove(); });
    return;
  }
  var card = document.querySelector('.frise-card');
  if (!card) return;
  card.querySelectorAll('.frise-bg-strip').forEach(function(el) { el.remove(); });
  container.querySelectorAll('.frise-bgf-wrap').forEach(function(el) { el.remove(); });

  var candidates = allEvents.filter(function(e) {
    if (!e.image || !e.image.trim()) return false;
    if (_shownImages[e.image]) return false;
    if (!visibleAtLevel(e, level)) return false;
    if (!e.zones.some(function(z) { return activeZones[z]; })) return false;
    var d0 = e.date, d1 = e.date_fin || e.date;
    return d0 <= end && d1 >= start;
  });
  if (candidates.length === 0) return;

  var cr = container.getBoundingClientRect();
  var friseW = container.offsetWidth  || TRACK_PX;
  var friseH = container.offsetHeight || 200;
  var labelW = 90;

  var occupied = [];
  container.querySelectorAll('.evt-chip, .illus-wrap, .chip-date-label, .ruler-chip, .parcours-num-badge, .illus-cap').forEach(function(el) {
    var r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    occupied.push({
      x0: r.left - cr.left, x1: r.right - cr.left,
      y0: r.top  - cr.top,  y1: r.bottom - cr.top
    });
  });

  var PAD = 12;
  var placed = [];
  function areaFree(x, y, w, h) {
    if (x < labelW || x + w > friseW - 4) return false;
    if (y < 4 || y + h > friseH - 4) return false;
    for (var i = 0; i < occupied.length; i++) {
      var o = occupied[i];
      if (x + w + PAD > o.x0 && x - PAD < o.x1 &&
          y + h + PAD > o.y0 && y - PAD < o.y1) return false;
    }
    for (var p = 0; p < placed.length; p++) {
      var q = placed[p];
      if (x + w + 12 > q.x0 && x - 12 < q.x1 &&
          y + h + 12 > q.y0 && y - 12 < q.y1) return false;
    }
    return true;
  }

  /* Convertit une date en position x */
  function dateToX(d) {
    return labelW + ((d - start) / (end - start)) * (friseW - labelW);
  }

  var RATIO = 1.25;            /* h / w */
  var MIN_W = 70, MAX_W = 240;
  var usedImages = {};
  var MAX_IMGS = 6;

  /* Trie les candidates par date pour traiter la frise de gauche à droite */
  var cands = candidates.slice().sort(function(a, b) { return a.date - b.date; });

  for (var ci = 0; ci < cands.length && placed.length < MAX_IMGS; ci++) {
    var pick = cands[ci];
    if (usedImages[pick.image]) continue;

    /* Position d'ancrage : la date de l'événement */
    var anchorX = dateToX(pick.date);

    /* Cherche la plus grande image possible centrée près de l'ancre,
       en autorisant un débordement vers les vides voisins */
    var bestRect = null;
    for (var w = MAX_W; w >= MIN_W; w -= 10) {
      var h = Math.round(w * RATIO);
      if (h > friseH - 8) continue;

      /* Essaie plusieurs décalages horizontaux autour de l'ancre
         (l'image peut s'étendre à gauche ou à droite pour combler un vide) */
      var offsets = [0, w*0.15, -w*0.15, w*0.35, -w*0.35, w*0.5, -w*0.5];
      for (var oi = 0; oi < offsets.length && !bestRect; oi++) {
        var cx = anchorX + offsets[oi];
        var x  = Math.round(cx - w / 2);
        /* Essaie plusieurs positions verticales */
        for (var y = 4; y + h <= friseH - 4; y += 18) {
          if (areaFree(x, y, w, h)) { bestRect = { x: x, y: y, w: w, h: h }; break; }
        }
      }
      if (bestRect) break;   /* la plus grande taille qui rentre est trouvée */
    }
    if (!bestRect) continue;

    usedImages[pick.image] = true;
    var wrap = document.createElement('div');
    wrap.className    = 'frise-bgf-wrap';
    wrap.style.left   = bestRect.x + 'px';
    wrap.style.top    = bestRect.y + 'px';
    wrap.style.width  = bestRect.w + 'px';
    wrap.style.height = bestRect.h + 'px';
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
    placed.push({ x0: bestRect.x, x1: bestRect.x + bestRect.w,
                  y0: bestRect.y, y1: bestRect.y + bestRect.h });
  }
}

function _drawBgImage(container, evt, x, y, w, h) {
  var wrap = document.createElement('div');
  wrap.className    = 'frise-bgf-wrap';
  wrap.style.left   = x + 'px';
  wrap.style.top    = y + 'px';
  wrap.style.width  = w + 'px';
  wrap.style.height = h + 'px';
  wrap.style.cursor = 'pointer';
  var img = document.createElement('img');
  img.src       = evt.image;
  img.alt       = evt.legende || evt.titre;
  img.className = 'frise-bgf-img';
  img.draggable = false;
  wrap.appendChild(img);
  var cap = document.createElement('span');
  cap.className   = 'frise-bg-caption';
  cap.textContent = (evt.legende || evt.titre) + ' (' + evt.date + ')';
  wrap.appendChild(cap);
  wrap.addEventListener('click', (function(e) {
    return function(ev) { ev.stopPropagation(); openModal(e, e.zones[0]); };
  })(evt));
  container.appendChild(wrap);
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
    var lblTxtR = evt.mois ? MOIS_ABR_R[evt.mois - 1] + '\u00a0' + evt.date : '' + evt.date;
    if (evt.date_fin && evt.date_fin > evt.date) {
      var finTxtR = evt.mois_fin ? MOIS_ABR_R[evt.mois_fin - 1] + '\u00a0' + evt.date_fin : '' + evt.date_fin;
      lblTxtR += '\u2013' + finTxtR;
    }
    /* Largeur approximative du chip de règne en pixels */
    var rChipPct = (Math.min(d1, end) - Math.max(d0, start)) / (end - start);
    var rChipPx  = rChipPct * (TRACK_PX - 90);
    /* Place pour le titre ? (≈ 6.5px par caractère + marge) */
    var maxC = Math.max(0, Math.floor((rChipPx - 14) / 6.5));
    var titreVisible = (maxC >= 4);  /* en dessous, le titre n'est pas lisible */

    /* Pour les règnes, la date est TOUJOURS affichée À L'INTÉRIEUR du chip
       (jamais en étiquette flottante au-dessus, qui déborderait sur la ligne
        du dessus et recouvrirait le règne voisin). */
    if (titreVisible) {
      /* Chip large : « nom (date) » dans le chip */
      var maxCName = Math.max(4, maxC - lblTxtR.length - 3);
      var titre = evt.titre.length > maxCName ? evt.titre.slice(0, maxCName - 1) + '\u2026' : evt.titre;
      var nameSpan = document.createElement('span');
      nameSpan.textContent = titre;
      nameSpan.style.fontWeight = '700';
      chip.appendChild(nameSpan);
      var dSpan = document.createElement('span');
      dSpan.textContent = '\u00a0(' + lblTxtR + ')';
      dSpan.style.fontWeight = '400';
      dSpan.style.fontSize   = '0.9em';
      dSpan.style.opacity    = '0.85';
      chip.appendChild(dSpan);
    } else {
      /* Chip étroit : seulement la date à l'intérieur */
      chip.style.fontSize = '0.6rem';
      chip.appendChild(document.createTextNode(lblTxtR));
    }
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

  /* Badge numéroté :
     - en mode parcours : numéro d'ordre dans la série (couleur du parcours)
     - sinon : numéro d'ordre global de la période visible (couleur neutre) */
  var badgeLabel = null, badgeColor = null;
  if (activeParcours) {
    var steps = getParcoursSteps(activeParcours);
    for (var si = 0; si < steps.length; si++) {
      if (steps[si].id === evt.id) { badgeLabel = '' + (si + 1); break; }
    }
    badgeColor = parcoursColors[activeParcours] || '#7D3C98';
  } else if (_globalNum[evt.id]) {
    badgeLabel = _globalNum[evt.id];
    badgeColor = '#5A4A2F';  /* brun discret, neutre */
  }
  if (badgeLabel) {
    var badge = document.createElement('span');
    badge.className = 'parcours-num-badge';
    badge.textContent = badgeLabel;
    badge.style.background = badgeColor;
    chip.style.overflow = 'visible';
    chip.appendChild(badge);
  }

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

/* ── Thèmes iconographiques ──────────────────────────────────────── */
var THEME_DEFS = {
  'guerre':      { icon: '\u2694\uFE0F',     label: 'Guerre' },
  'politique':   { icon: '\uD83D\uDC51',     label: 'Politique' },
  'religion':    { icon: '\u271D\uFE0F',     label: 'Religion' },
  'revolte':     { icon: '\uD83D\uDD25',     label: 'Révolte' },
  'diplomatie':  { icon: '\uD83D\uDCDC',     label: 'Diplomatie' },
  'economie':    { icon: '\uD83E\uDE99',     label: 'Économie' },
  'societe':     { icon: '\uD83E\uDDD1',     label: 'Société' },
  'art':         { icon: '\uD83C\uDFA8',     label: 'Art' },
  'litterature': { icon: '\uD83D\uDCD6',     label: 'Littérature' },
  'sciences':    { icon: '\uD83D\uDD2C',     label: 'Sciences' },
  'techniques':  { icon: '\u2699\uFE0F',     label: 'Techniques' },
  'idees':       { icon: '\uD83D\uDCA1',     label: 'Idées' },
  'catastrophe': { icon: '\uD83C\uDF0B',     label: 'Catastrophe' }
};
var THEME_ORDER = ['catastrophe','revolte','diplomatie','religion','economie','idees','sciences','techniques','art','litterature','societe','guerre','politique'];
var THEME_KEYWORDS = {
  'catastrophe': ['peste','épidémie','séisme','tremblement de terre','inondation','famine','disette','sécheresse'],
  'revolte':     ['révolte','soulèvement','soulève','émeute'],
  'diplomatie':  ['traité','paix','trêve'],
  'religion':    ['bulle','vaudois','hérétique','hérési','inquisition'],
  'economie':    ['monnaie','exportation','dévaluation'],
  'idees':       ['université'],
  'techniques':  ['imprimerie','horloge','boussole','mécanique','métier à tisser','arquebuse'],
  'guerre':      ['croisade','chevauchée','bataille','guerre','raid','siège','routiers','invasion'],
  'politique':   ['roi','arrestation','procès','ordonnance','sacre','maréchal','exécution']
};
/* Détecte le thème : champ explicite prioritaire, sinon mots-clés, sinon 'politique' */
var activeThemes = {};  /* thèmes cochés dans la légende ; vide = aucun filtre */

/* Un événement passe-t-il le filtre thématique ?
   - si aucun thème coché → tous passent
   - sinon → seuls ceux dont le thème est coché passent
   (en mode manuel, un événement sans thème ne passe QUE si aucun filtre n'est actif) */
function eventMatchesTheme(evt) {
  var anyActive = false;
  for (var t in activeThemes) { if (activeThemes[t]) { anyActive = true; break; } }
  if (!anyActive) return true;
  var th = detectTheme(evt);   /* manuel ou auto (titre) */
  return !!(th && activeThemes[th]);
}

function detectTheme(evt) {
  /* Thème manuel prioritaire */
  if (evt.theme && THEME_DEFS[evt.theme]) return evt.theme;
  /* Sinon détection auto sur le TITRE uniquement */
  var txt = (evt.titre || '').toLowerCase();
  for (var i = 0; i < THEME_ORDER.length; i++) {
    var theme = THEME_ORDER[i];
    var kws = THEME_KEYWORDS[theme];
    if (!kws) continue;
    for (var k = 0; k < kws.length; k++) {
      if (txt.indexOf(kws[k]) !== -1) return theme;
    }
  }
  return null;   /* aucun mot-clé trouvé → pas de thème (pas d'icône) */
}
function toggleThemeLegend() {
  var el = document.getElementById('theme-legend');
  if (!el) return;
  if (el.style.display === 'flex') { el.style.display = 'none'; return; }
  renderThemeLegend();
  el.style.display = 'flex';
}

/* Construit la légende interactive : chaque thème est une case à cocher (filtre).
   elId = conteneur cible (défaut : la légende de la frise) */
function renderThemeLegend(elId) {
  var el = document.getElementById(elId || 'theme-legend');
  if (!el) return;
  el.innerHTML = '';

  var hint = document.createElement('span');
  hint.className = 'theme-legend-hint';
  hint.textContent = 'Filtrer par thème :';
  el.appendChild(hint);

  /* Liste ordonnée des thèmes (puis ceux hors THEME_ORDER) */
  var keys = THEME_ORDER.slice().reverse();
  for (var key in THEME_DEFS) {
    if (keys.indexOf(key) === -1) keys.push(key);
  }

  keys.forEach(function(t) {
    var d = THEME_DEFS[t];
    if (!d) return;
    var btn = document.createElement('button');
    btn.className = 'theme-legend-item' + (activeThemes[t] ? ' active' : '');
    btn.innerHTML = '<span class="ic">' + d.icon + '</span>' + d.label;
    btn.onclick = (function(theme) {
      return function() {
        activeThemes[theme] = !activeThemes[theme];
        renderAllLegends();
        refreshThemeFilter();
      };
    })(t);
    el.appendChild(btn);
  });

  /* Bouton de remise à zéro si au moins un thème est actif */
  var anyActive = false;
  for (var k in activeThemes) if (activeThemes[k]) anyActive = true;
  if (anyActive) {
    var reset = document.createElement('button');
    reset.className = 'theme-legend-reset';
    reset.textContent = '\u2715 Tout afficher';
    reset.onclick = function() {
      activeThemes = {};
      /* Masque la fenêtre de filtre : réouverture via le bouton « Légende » */
      var lg = document.getElementById('theme-legend');
      if (lg) lg.style.display = 'none';
      var lgList = document.getElementById('list-theme-legend');
      if (lgList) lgList.style.display = 'none';
      refreshThemeFilter();
    };
    el.appendChild(reset);
  }
}

/* Rafraîchit toutes les légendes actuellement affichées */
function renderAllLegends() {
  var f = document.getElementById('theme-legend');
  if (f && f.style.display !== 'none') renderThemeLegend('theme-legend');
  var l = document.getElementById('list-theme-legend');
  if (l && l.style.display !== 'none') renderThemeLegend('list-theme-legend');
}

/* Affiche/masque la légende dans le panneau de liste */
function toggleListLegend() {
  var el = document.getElementById('list-theme-legend');
  if (!el) return;
  if (el.style.display === 'flex') { el.style.display = 'none'; return; }
  renderThemeLegend('list-theme-legend');
  el.style.display = 'flex';
}

/* Rafraîchit la frise et la liste après changement de filtre thématique */
function refreshThemeFilter() {
  /* Re-rend la vue courante */
  if (typeof refreshFrise === 'function') refreshFrise();
  else if (currentLevel) renderLevel(currentLevel, rangeStartForLevel());
  /* Si la liste est ouverte, la régénérer */
  var lst = document.getElementById('event-list-overlay');
  if (lst && lst.style.display === 'block') openEventList();
}

/* Détermine le rangeStart selon le niveau courant (utilitaire) */
function rangeStartForLevel() {
  if (currentLevel === 4) return currentYear;
  if (currentLevel === 3) return currentDecade;
  if (currentLevel === 2) return currentCentury;
  return 1300;
}

/* Icône : thème manuel prioritaire, sinon détection auto par mots-clés du titre.
   Renvoie '' si aucun thème (manuel ou détecté). */
function themeIcon(evt) {
  var t = detectTheme(evt);
  return (t && THEME_DEFS[t]) ? THEME_DEFS[t].icon : '';
}
/* Préfixe titre : icône + fine espace, ou rien si pas de thème */
function themePrefix(evt) {
  var ic = themeIcon(evt);
  return ic ? ic + '\u202F' : '';
}

/* Date de DÉBUT fractionnaire (année + mois) : 1356 + (10-1)/12 pour octobre 1356 */
function evtStartFrac(evt) {
  var m = Number(evt.mois) || 0;
  return evt.date + (m > 0 ? (m - 1) / 12 : 0);
}
/* Date de FIN fractionnaire : prend mois_fin si présent, sinon fin d'année.
   Pour octobre on veut la FIN d'octobre, donc on ajoute le mois complet (m/12). */
function evtEndFrac(evt) {
  var base = (evt.date_fin && evt.date_fin > evt.date) ? evt.date_fin : evt.date;
  var mf = Number(evt.mois_fin) || 0;
  if (mf > 0) return base + mf / 12;          /* fin du mois mf */
  return base + 1;                             /* fin d'année si mois inconnu */
}

/* Mélange deux couleurs hex en une couleur intermédiaire */
function mixHex(h1, h2) {
  function rgb(h) {
    h = h.replace('#', '');
    return [parseInt(h.substr(0,2),16), parseInt(h.substr(2,2),16), parseInt(h.substr(4,2),16)];
  }
  var a = rgb(h1), b = rgb(h2);
  var m = [Math.round((a[0]+b[0])/2), Math.round((a[1]+b[1])/2), Math.round((a[2]+b[2])/2)];
  return '#' + m.map(function(v){ return ('0'+v.toString(16)).slice(-2); }).join('');
}

/* Éclaircit une couleur hex vers le parchemin (ratio 0=couleur, 1=parchemin) */
function lightenHex(hex, ratio) {
  var PARCH = [245, 237, 216];  /* #F5EDD8 */
  hex = hex.replace('#', '');
  var r = parseInt(hex.substr(0,2),16), g = parseInt(hex.substr(2,2),16), b = parseInt(hex.substr(4,2),16);
  var nr = Math.round(r + (PARCH[0]-r)*ratio);
  var ng = Math.round(g + (PARCH[1]-g)*ratio);
  var nb = Math.round(b + (PARCH[2]-b)*ratio);
  return '#' + [nr,ng,nb].map(function(v){ return ('0'+v.toString(16)).slice(-2); }).join('');
}

/* Détermine la couleur d'un chip selon les règles :
   - 1 seule zone active concernée → couleur de cette zone
   - plusieurs zones actives concernées → couleur intermédiaire (mélange)
   - intensité en 3 paliers selon le type (1-2 soutenu, 3 moyen, 4-5 clair) */
function chipColor(evt, zone) {
  /* Zones de l'événement qui sont actuellement ACTIVES */
  var activeMatched = (evt.zones || []).filter(function(z){ return activeZones[z]; });
  var baseHex;
  if (activeMatched.length >= 2) {
    /* Mélange des couleurs des deux premières zones actives */
    var c1 = (COLORS[activeMatched[0]] || COLORS['France']).bg;
    var c2 = (COLORS[activeMatched[1]] || COLORS['France']).bg;
    baseHex = mixHex(c1, c2);
  } else {
    /* Mono-zone : couleur de la zone (celle de la piste, ou la 1re active) */
    var zn = activeMatched.length === 1 ? activeMatched[0] : zone;
    baseHex = (COLORS[zn] || COLORS['France']).bg;
  }
  /* Intensité par palier : type 1-2 soutenu, 3 moyen, 4-5 clair */
  var type = Number(evt.type) || 1;
  var ratio = (type <= 2) ? 0 : (type === 3 ? 0.28 : 0.52);
  var fill = lightenHex(baseHex, ratio);
  /* Texte : blanc sur soutenu/moyen, sombre sur clair pour la lisibilité */
  var textColor = (type <= 3) ? '#fff' : '#2a1c0c';
  return { fill: fill, border: baseHex, text: textColor, multi: activeMatched.length >= 2 };
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
  chip.style.top      = (18 + rowIndex * (ROW_H + ROW_GAP)) + 'px';

  if (isPeriod) {
    /* Bornes précises au mois (année + mois/12) pour les vues fines.
       En vue siècle (level 1) on reste à l'année pour la lisibilité. */
    var startFrac = (level >= 3) ? evtStartFrac(evt) : evt.date;
    var endFrac   = (level >= 3) ? evtEndFrac(evt)   : evt.date_fin;
    var d0 = Math.max(startFrac, start);
    var d1 = Math.min(endFrac, end);
    if (d1 <= d0) return null;
    chip.classList.add('chip-period');
    if (level === 1) chip.classList.add('chip-period-sm');
    chip.style.left        = pct(d0, start, end);
    chip.style.width       = 'calc(' + pct(d1, start, end) + ' - ' + pct(d0, start, end) + ')';
    chip.style.minHeight   = (ROW_H - 4) + 'px';  /* hauteur auto pour retour ligne */
    var _cc = chipColor(evt, zone);
    chip.style.background  = _cc.fill;
    chip.style.borderColor = _cc.border;
    chip.style.color   = _cc.text;
    chip.style.overflow = 'visible';
    if (level > 1) {
      var titreP = themePrefix(evt) + evt.titre;  /* icône thématique (manuelle) */
      var chipPct      = (Math.min(evt.date_fin, end) - Math.max(evt.date, start)) / (end - start);
      var chipPxApprox = chipPct * (TRACK_PX - 90);
      var maxC         = Math.max(8, Math.floor(chipPxApprox / 6.5));
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

      chip.style.overflow = 'hidden';
      if (chipPxApprox < 40) {
        /* Très étroit : titre masqué (en tooltip), mais on garde l'icône thématique si présente */
        var icNarrow = themeIcon(evt);
        if (icNarrow) {
          var icSpan = document.createElement('span');
          icSpan.textContent = icNarrow;
          icSpan.style.fontSize = '0.7rem';
          icSpan.style.lineHeight = '1';
          chip.appendChild(icSpan);
        }
      } else {
        /* Titre dans un span interne pour gérer ellipsis/retour ligne
           (text-overflow ne marche pas sur un conteneur flex) */
        var txtSpan = document.createElement('span');
        txtSpan.textContent   = titreP;
        txtSpan.style.display = 'block';
        txtSpan.style.width   = '100%';
        txtSpan.style.lineHeight = '1.2';
        if (chipPxApprox < 80) {
          /* Étroit : une ligne tronquée */
          txtSpan.style.fontSize     = adaptFontSize(titreP, 0.72, maxC);
          txtSpan.style.whiteSpace   = 'nowrap';
          txtSpan.style.overflow     = 'hidden';
          txtSpan.style.textOverflow = 'ellipsis';
        } else {
          /* Large : retour à la ligne */
          txtSpan.style.fontSize   = adaptFontSize(titreP, 0.78, maxC);
          txtSpan.style.whiteSpace = 'normal';
          txtSpan.style.wordBreak  = 'break-word';
          txtSpan.style.hyphens    = 'auto';
        }
        chip.appendChild(txtSpan);
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
      var _cc1 = chipColor(evt, zone);
      chip.style.background = _cc1.fill;
      chip.style.borderColor = _cc1.border;
      chip.style.color      = _cc1.text;
      var MOIS_ABR = ['jan.','fév.','mar.','avr.','mai','jun.','jul.','aoû.','sep.','oct.','nov.','déc.'];
      var dateLbl = document.createElement('span');
      dateLbl.className = 'chip-date-label';
      dateLbl.textContent = evt.mois ? MOIS_ABR[evt.mois - 1] + ' ' + evt.date : '' + evt.date;
      chip.appendChild(dateLbl);
      var titreF = themePrefix(evt) + evt.titre;  /* icône thématique (manuelle) */
      chip.style.fontSize = adaptFontSize(titreF, 0.83, level === 4 ? 48 : 40);
      /* Titre sur une seule ligne (span interne pour ellipsis sur flex) */
      var titreSpan = document.createElement('span');
      titreSpan.textContent = titreF;
      titreSpan.style.cssText = 'display:inline-block;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom;';
      chip.appendChild(titreSpan);
    } else if (level === 2) {
      chip.classList.add('chip-medium');
      if (type === 1) chip.classList.add('chip-type1');
      if (type === 3) chip.classList.add('chip-type3');
      var _cc2 = chipColor(evt, zone);
      chip.style.background  = _cc2.fill;
      chip.style.color       = _cc2.text;
      chip.style.borderColor = col.bg;
      chip.style.fontSize   = adaptFontSize(evt.titre, 0.76, 18);
      chip.style.whiteSpace = 'normal';
      var dateLbl2 = document.createElement('span');
      dateLbl2.className   = 'chip-date-label';
      dateLbl2.textContent = evt.date;
      chip.appendChild(dateLbl2);
      chip.appendChild(document.createTextNode(themePrefix(evt) + evt.titre));
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

  /* Badge numéroté :
     - parcours actif : numéro d'ordre dans la série (couleur du parcours)
     - sinon : numéro d'ordre global de la période visible (brun neutre) */
  var badgeLabel = null, badgeColor = null;
  if (activeParcours) {
    var pSteps = getParcoursSteps(activeParcours);
    for (var psi = 0; psi < pSteps.length; psi++) {
      if (pSteps[psi].id === evt.id) { badgeLabel = '' + (psi + 1); break; }
    }
    badgeColor = parcoursColors[activeParcours] || '#7D3C98';
  } else if (_globalNum[evt.id]) {
    badgeLabel = _globalNum[evt.id];
    badgeColor = '#5A4A2F';
  }
  if (badgeLabel) {
    var nBadge = document.createElement('span');
    nBadge.className = 'parcours-num-badge';
    nBadge.textContent = badgeLabel;
    nBadge.style.background = badgeColor;
    /* chip déjà en position absolute : sert d'ancre, ne pas modifier */
    chip.style.overflow = 'visible';
    chip.appendChild(nBadge);
  }

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
/* Transforme un paragraphe de synthèse en noeuds DOM :
   les balises [[id]] deviennent des liens cliquables vers la fiche,
   les sauts de ligne simples deviennent des <br>. */
function renderSyntheseParagraph(container, text) {
  /* Découpe le texte sur les balises [[id]] tout en les conservant */
  var parts = text.split(/(\[\[\d+\]\])/);
  parts.forEach(function(part) {
    var m = part.match(/^\[\[(\d+)\]\]$/);
    if (m) {
      var id = parseInt(m[1]);
      var evt = allEvents.filter(function(e) { return e.id === id; })[0];
      if (evt) {
        var a = document.createElement('a');
        a.className = 'synth-link';
        a.href = '#';
        a.textContent = '\uD83D\uDD0E';  /* 🔎 loupe : ouvre la fiche */
        a.title = 'Ouvrir la fiche : ' + evt.titre + ' (' + evt.date + ')';
        a.onclick = (function(e) {
          return function(ev) {
            ev.preventDefault();
            var z = (e.zones && e.zones[0]) || ZONES[0];
            openModal(e, z);
          };
        })(evt);
        container.appendChild(a);
      } else {
        /* id inconnu : on ignore la balise silencieusement */
      }
    } else if (part) {
      /* Texte normal : applique le surlignage de recherche + <br> pour les retours ligne */
      var lines = part.split('\n');
      lines.forEach(function(line, li) {
        if (li > 0) container.appendChild(document.createElement('br'));
        var span = document.createElement('span');
        span.innerHTML = highlightText(line);
        /* déplie le span pour garder le texte inline */
        while (span.firstChild) container.appendChild(span.firstChild);
      });
    }
  });
}

var _currentSynthese = null;   /* {zone, dec} de la synthèse affichée dans le bandeau */

function updateSyntheseBar() {
  var bar = document.getElementById('synthese-bar');
  var btns = document.getElementById('synthese-bar-btns');
  if (!bar || !btns) return;
  btns.innerHTML = '';

  /* Affichée seulement en vue décennale */
  if (currentLevel !== 3 || currentDecade === null) {
    bar.style.display = 'none';
    return;
  }

  /* Mode parcours : synthèse du parcours (décennie, avec repli sur la synthèse globale) */
  if (typeof activeParcours !== 'undefined' && activeParcours) {
    var ps = getParcoursSynthese(activeParcours, currentDecade);
    if (ps) {
      var pcol = parcoursColors[activeParcours] || '#7D3C98';
      var ptitre = (ps.s.titre && ps.s.titre.trim()) ? ps.s.titre.trim() : activeParcours;
      var scopeLbl = (ps.scope === 'decade')
        ? ' (' + currentDecade + '-' + (currentDecade + 9) + ')'
        : ' (vue d\'ensemble)';
      var pb = document.createElement('button');
      pb.className = 'synthese-bar-btn';
      var picon = document.createElement('span');
      picon.className = 'synthese-bar-btn-icon'; picon.textContent = '\uD83D\uDCD6';
      var plbl = document.createElement('span');
      plbl.className = 'synthese-bar-btn-text';
      plbl.textContent = 'Synthèse du parcours : ' + ptitre + scopeLbl;
      pb.appendChild(picon); pb.appendChild(plbl);
      pb.style.background = pcol;
      pb.title = 'Lire la synthèse du parcours';
      pb.onclick = function() { showParcoursSyntheseBanner(activeParcours, currentDecade, true); };
      btns.appendChild(pb);
      bar.style.display = 'flex';
      showParcoursSyntheseBanner(activeParcours, currentDecade, false);  /* affichage automatique */
    } else {
      bar.style.display = 'none';
      closeSyntheseBanner();
    }
    return;
  }

  /* Un bouton par zone active possédant une synthèse RÉDIGÉE pour cette décennie */
  var found = 0;
  ZONES.forEach(function(zone) {
    if (!activeZones[zone]) return;
    var key = zone + '|' + currentDecade;
    if (!_syntheses[key]) return;   /* uniquement les synthèses rédigées à la main */
    found++;
    var col = COLORS[zone] || COLORS['France'];
    var synth = _syntheses[key];
    var titreSynth = (synth && synth.titre && synth.titre.trim())
      ? synth.titre.trim()
      : zone + ' (' + currentDecade + '-' + (currentDecade + 9) + ')';
    var b = document.createElement('button');
    b.className = 'synthese-bar-btn';
    /* Le bouton affiche le TITRE de la synthèse (double rôle : titre + lien) */
    var icon = document.createElement('span');
    icon.className = 'synthese-bar-btn-icon';
    icon.textContent = '\uD83D\uDCD6';  /* 📖 */
    var lbl = document.createElement('span');
    lbl.className = 'synthese-bar-btn-text';
    lbl.textContent = 'Synthèse : ' + titreSynth;
    b.appendChild(icon);
    b.appendChild(lbl);
    b.style.background = col.bg;
    b.title = 'Lire la synthèse : ' + titreSynth;
    b.onclick = (function(z, d) {
      return function() { showSyntheseBanner(z, d); };
    })(zone, currentDecade);
    btns.appendChild(b);
  });

  bar.style.display = found > 0 ? 'flex' : 'none';
}

function showSyntheseBanner(zone, dec) {
  var s = getSynthese(zone, dec);
  if (!s) {
    s = { titre: zone + ' \u00b7 ' + dec + '-' + (dec + 9),
          texte: 'Aucun événement enregistré pour cette zone à cette période.', auto: true };
  }
  _currentSynthese = { zone: zone, dec: dec };

  var banner = document.getElementById('synthese-banner');
  var titleEl = document.getElementById('synthese-banner-title');
  var perEl = document.getElementById('synthese-banner-period');
  var bodyEl = document.getElementById('synthese-banner-body');
  if (!banner) return;

  titleEl.innerHTML = '';
  var synthPre = document.createElement('span');
  synthPre.className = 'synth-prefix';
  synthPre.textContent = 'Synthèse';
  titleEl.appendChild(synthPre);
  titleEl.appendChild(document.createTextNode(' ' + (s.titre || (zone + ' \u00b7 ' + dec))));
  perEl.textContent = (s.auto ? '(brouillon auto) ' : '') + zone + ' \u2014 ' + dec + '-' + (dec + 9);

  bodyEl.innerHTML = '';
  var paras = (s.texte || '').split(/\n\n+/);
  paras.forEach(function(para) {
    if (!para.trim()) return;
    var p = document.createElement('p');
    renderSyntheseParagraph(p, para.trim());
    bodyEl.appendChild(p);
  });

  banner.style.display = 'block';
  banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* Synthèse de parcours : clé "@parcours|Nom|décennie" (décennale) ou "@parcours|Nom" (globale).
   Repli automatique de la décennale vers la globale. */
function getParcoursSynthese(name, dec) {
  var k1 = '@parcours|' + name + '|' + dec;
  if (_syntheses[k1]) return { s: _syntheses[k1], scope: 'decade' };
  var k2 = '@parcours|' + name;
  if (_syntheses[k2]) return { s: _syntheses[k2], scope: 'global' };
  return null;
}

function showParcoursSyntheseBanner(name, dec, doScroll) {
  var pres = getParcoursSynthese(name, dec);
  if (!pres) return;
  var s = pres.s;
  var banner  = document.getElementById('synthese-banner');
  var titleEl = document.getElementById('synthese-banner-title');
  var perEl   = document.getElementById('synthese-banner-period');
  var bodyEl  = document.getElementById('synthese-banner-body');
  if (!banner) return;
  _currentSynthese = { parcours: name, dec: dec };

  titleEl.innerHTML = '';
  var pre = document.createElement('span');
  pre.className = 'synth-prefix synth-prefix-parcours';
  pre.textContent = 'Parcours';
  titleEl.appendChild(pre);
  titleEl.appendChild(document.createTextNode(' ' + (s.titre || name)));
  perEl.textContent = (pres.scope === 'decade')
    ? name + ' \u2014 ' + dec + '-' + (dec + 9)
    : name + ' \u2014 vue d\'ensemble';

  bodyEl.innerHTML = '';
  (s.texte || '').split(/\n\n+/).forEach(function(para) {
    if (!para.trim()) return;
    var p = document.createElement('p');
    renderSyntheseParagraph(p, para.trim());
    bodyEl.appendChild(p);
  });
  banner.style.display = 'block';
  if (doScroll) banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeSyntheseBanner() {
  var banner = document.getElementById('synthese-banner');
  if (banner) banner.style.display = 'none';
  _currentSynthese = null;
}

function openSyntheseModal(zone, dec) {
  var s = getSynthese(zone, dec);
  if (!s) {
    s = { titre: zone + ' · ' + dec + '-' + (dec + 9),
          texte: 'Aucun événement enregistré pour cette zone à cette période.',
          auto: true };
  }
  var col = COLORS[zone] || COLORS['France'];

  /* En-tête : zone + période */
  var zoneEl = document.getElementById('modal-zone');
  zoneEl.textContent = zone;
  zoneEl.style.background = col.light;
  zoneEl.style.color = col.text;

  var typeEl = document.getElementById('modal-type');
  if (typeEl) {
    typeEl.textContent = s.auto ? '\uD83D\uDCCB Synthèse (brouillon auto)'
                                : '\uD83D\uDCCB Synthèse';
    typeEl.className = 'modal-type-badge';
  }
  document.getElementById('modal-date').textContent = dec + ' \u2013 ' + (dec + 9);
  document.getElementById('modal-title').innerHTML = highlightText(s.titre);

  /* Corps : texte de la synthèse, paragraphes */
  var descEl = document.getElementById('modal-desc');
  descEl.innerHTML = '';
  var paras = (s.texte || '').split(/\n\n+/);
  for (var pi = 0; pi < paras.length; pi++) {
    if (!paras[pi].trim()) continue;
    var p = document.createElement('p');
    renderSyntheseParagraph(p, paras[pi].trim());
    descEl.appendChild(p);
  }

  /* Masque les éléments propres aux fiches (image, vidéo, sources) */
  document.getElementById('modal-sources').textContent = '';
  var imgWrap = document.getElementById('modal-img-wrap');
  if (imgWrap) imgWrap.style.display = 'none';
  var videoWrap = document.getElementById('modal-video-wrap');
  if (videoWrap) { videoWrap.innerHTML = ''; videoWrap.style.display = 'none'; }

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* Rendu enrichi de la description : titres (## / ###), listes (- / •), paragraphes.
   Compatible avec l'ancien format (texte simple → paragraphes). */
function renderDescription(text, descEl) {
  var blocks = (text || '').split(/\n\n+/);
  for (var bi = 0; bi < blocks.length; bi++) {
    var block = blocks[bi].replace(/^\n+|\n+$/g, '');
    if (!block.trim()) continue;
    var lines = block.split(/\n/).map(function(l){ return l.trim(); }).filter(Boolean);

    /* Titre / sous-titre */
    if (lines.length === 1 && /^#{2,3}\s+/.test(lines[0])) {
      var isSub = /^###\s+/.test(lines[0]);
      var h = document.createElement(isSub ? 'h5' : 'h4');
      h.className = isSub ? 'desc-sub' : 'desc-h';
      h.innerHTML = highlightText(lines[0].replace(/^#{2,3}\s+/, ''));
      descEl.appendChild(h);
      continue;
    }
    /* Liste : chaque ligne commence par - ou • */
    if (lines.length && lines.every(function(l){ return /^[-•]\s+/.test(l); })) {
      var ul = document.createElement('ul');
      ul.className = 'desc-list';
      lines.forEach(function(l){
        var li = document.createElement('li');
        var it = l.replace(/^[-•]\s+/, '');
        var m = it.match(/^(.{1,34}?)\s[—–]\s([\s\S]+)$/);   /* "date — texte" → date en gras */
        if (m && /\d/.test(m[1])) {
          li.innerHTML = '<strong>' + highlightText(m[1]) + '</strong> — ' + highlightText(m[2]);
        } else {
          li.innerHTML = highlightText(it);
        }
        ul.appendChild(li);
      });
      descEl.appendChild(ul);
      continue;
    }
    /* Paragraphe (saut simple → espace) */
    var p = document.createElement('p');
    p.innerHTML = highlightText(lines.join(' '));
    descEl.appendChild(p);
  }
}
/* Retire les marqueurs de structure pour les aperçus (chips, liste) */
function stripDescMarks(t) {
  return (t || '').replace(/(^|\n)\s*#{2,3}\s+/g, '$1').replace(/(^|\n)\s*[-•]\s+/g, '$1 ');
}

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
  renderDescription(evt.description, descEl);

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
            wzUpdateNextHint();
            if (on) wzShowZoneActions();   /* guidage : actions proposées après l'ajout d'une zone */
          });
          chipsEl.appendChild(chip);
        })(grpZones[zi]);
      }
      grid.appendChild(chipsEl);
    }
  }
  wzUpdateNextHint();  /* reflète l'état initial des zones (bandeau masqué si aucune) */
  /* Réinitialise le mode d'exploration sur « Frise décennale » */
  _wzMode  = '3';
  _wzScale = 3;
  var rd = document.querySelector('input[name="wz-mode"][value="3"]');
  if (rd) rd.checked = true;
  wzApplyModeUI();
  wzHideActionPanels();
  wzGoTo(1);
}

function wzUpdateNextHint() {
  /* Affiche un bandeau d'invite centré dès qu'au moins une zone est choisie */
  var prompt = document.getElementById('wz-next-prompt');
  var countEl = document.getElementById('wz-zone-count');
  if (!prompt) return;
  var nbZones = 0;
  for (var z in activeZones) if (activeZones[z]) nbZones++;
  if (nbZones > 0) {
    prompt.style.display = 'block';
    if (countEl) {
      countEl.textContent = nbZones === 1
        ? '1 zone sélectionnée'
        : nbZones + ' zones sélectionnées';
    }
  } else {
    prompt.style.display = 'none';
  }
}

var _wzMode = '3';   /* '3' décennale · '4' annuelle · 'search' recherche · '5' parcours */

function wzModeChanged(val) {
  _wzMode = val;
  if (val !== 'search') _wzScale = parseInt(val);
  wzApplyModeUI();
  wzShowModeActions();
}

/* Panneau central « a. Choisir une zone et une période / b. Choisir un autre mode » */
function wzShowModeActions() {
  var panel = document.getElementById('wz-mode-actions');
  if (!panel) return;
  if (_wzMode === 'search') { panel.style.display = 'none'; return; }  /* la saisie se fait dans le champ */
  var go = document.getElementById('wz-mode-ca-go');
  if (go) go.innerHTML = (_wzMode === '5')
    ? '\u2694\uFE0F Choisir le parcours'
    : '\uD83D\uDDFA\uFE0F Choisir une zone et une période';
  var title = document.getElementById('wz-mode-ca-title');
  if (title) {
    var labels = { '3': 'Frise décennale', '4': 'Frise par année', '5': 'Parcours thématique' };
    title.textContent = (labels[_wzMode] || 'Mode') + ' \u2713';
  }
  panel.style.display = 'flex';
}
function wzPickAnotherMode() {
  var panel = document.getElementById('wz-mode-actions');
  if (panel) panel.style.display = 'none';
}

/* Panneau central « a. Ajouter une zone / b. Choisir une période / c. Ouvrir la frise » */
function wzShowZoneActions() {
  var panel = document.getElementById('wz-zone-actions');
  if (panel) panel.style.display = 'flex';
}
function wzAddAnotherZone() {
  var panel = document.getElementById('wz-zone-actions');
  if (panel) panel.style.display = 'none';
}
function wzChoosePeriod() {
  var panel = document.getElementById('wz-zone-actions');
  if (panel) panel.style.display = 'none';
  var sel = document.getElementById('wz-period-select');
  if (!sel) return;
  sel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  try { sel.focus(); if (sel.showPicker) sel.showPicker(); } catch (e) {}
}
function wzHideActionPanels() {
  ['wz-mode-actions', 'wz-zone-actions'].forEach(function(id) {
    var p = document.getElementById(id); if (p) p.style.display = 'none';
  });
}

function wzApplyModeUI() {
  /* Champ de recherche visible uniquement en mode recherche */
  var row = document.getElementById('wz-search-row');
  if (row) row.style.display = (_wzMode === 'search') ? 'block' : 'none';
  /* Libellé du bouton de l'étape 1 */
  var btn = document.getElementById('wz-step1-next');
  if (btn) btn.innerHTML = (_wzMode === 'search') ? 'Voir la frise \u203A' : 'Suivant \u203A';
  if (_wzMode === 'search') {
    var inp = document.getElementById('wz-search-input');
    if (inp) setTimeout(function(){ inp.focus(); }, 50);
  }
}

/* Ancien nom conservé pour compatibilité (non appelé par le nouveau wizard) */
function wzScaleChanged(val) {
  _wzScale = parseInt(val);
  if (wzCurrentStep === 2) wzBuildPeriodSelect();
}

function wzGoTo(step) {
  wzCurrentStep = step;
  if (typeof wzHideActionPanels === 'function') wzHideActionPanels();
  document.querySelectorAll('.wizard-step').forEach(function(el, i) {
    el.classList.toggle('active', i + 1 === step);
  });
  document.querySelectorAll('.wz-step-dot').forEach(function(d, i) {
    d.classList.toggle('active', i + 1 === step);
    d.classList.toggle('done',   i + 1 < step);
  });
  /* Étape 2 : prépare zones/parcours + période */
  if (step === 2) wzSetupStep2();
}

function wzSetupStep2() {
  /* Les zones-thèmes ne sont proposées QUE pour les frises décennale et annuelle.
     En mode parcours, on masque la grille et on ne propose que la liste des parcours. */
  var isParcours = (_wzMode === '5');
  var grid  = document.getElementById('wz-zones-grid');
  var sub   = document.getElementById('wz-step2-sub');
  var title = document.getElementById('wz-step2-title');
  if (grid)  grid.style.display = isParcours ? 'none' : '';
  if (sub)   sub.style.display  = isParcours ? 'none' : '';
  if (title) title.textContent  = isParcours ? 'Parcours thématique' : 'Zones \u0026 thèmes';
  wzBuildPeriodSelect();
}

function wzNext() {
  /* ── Étape 1 : choix du mode d'exploration ── */
  if (wzCurrentStep === 1) {
    if (_wzMode === 'search') {
      var q = (document.getElementById('wz-search-input').value || '').trim();
      if (!q) { alert('Saisissez un mot-clé pour lancer la recherche.'); return; }
      wzClose();                /* wzClose détecte le mot-clé et lance la recherche */
      return;
    }
    /* Décennale / annuelle / parcours → étape 2 */
    _wzScale = (_wzMode === '5') ? 5 : parseInt(_wzMode);
    wzGoTo(2);
    return;
  }
  /* ── Étape 2 : validation puis ouverture de la frise ── */
  if (_wzMode === '5') {
    var pv = (document.getElementById('wz-period-select').value || '');
    if (!pv) { alert('Aucun parcours disponible pour le moment.'); return; }
  } else {
    var anyZone = Object.values(activeZones).some(Boolean);
    if (!anyZone) { alert('Sélectionnez au moins une zone ou un thème.'); return; }
  }
  wzClose();
}

function wzPrev() {
  if (wzCurrentStep > 1) wzGoTo(wzCurrentStep - 1);
}

var _wzScale = 3; /* Mémorise le choix d'échelle — défaut décennale */

function wzGetScale() {
  if (_wzMode === '5') return 5;
  if (_wzMode === 'search') return _wzScale;
  return parseInt(_wzMode);
}

function wzBuildPeriodSelect() {
  var scale = wzGetScale();
  var sel   = document.getElementById('wz-period-select');
  var sub   = document.getElementById('wz-period-sub');
  if (!sel) return;
  sel.innerHTML = '';
  if (scale === 5) {
    /* Parcours thématique : liste les parcours disponibles */
    sub.textContent = 'Sélectionnez le parcours à suivre.';
    var parcours = getAllParcours();
    if (parcours.length === 0) {
      var opt0 = document.createElement('option');
      opt0.textContent = '(aucun parcours disponible)';
      opt0.value = '';
      sel.appendChild(opt0);
    } else {
      parcours.forEach(function(p) {
        var opt = document.createElement('option');
        var n = allEvents.filter(function(e){ return parseSeries(e.serie).indexOf(p) !== -1; }).length;
        opt.textContent = p + ' (' + n + ' événements)';
        opt.value = p;
        sel.appendChild(opt);
      });
    }
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
  if (_wzMode === 'search' && q) { wzApplySearch(q); return; }
  updateFilterCheckboxes();

  /* Échelle déduite du mode choisi */
  var scale = (_wzMode === '5') ? 5 : (_wzMode === 'search' ? 3 : parseInt(_wzMode));
  _wzScale = scale;

  /* Parcours thématique : on lance directement le parcours sélectionné */
  if (scale === 5) {
    var pName = document.getElementById('wz-period-select').value;
    if (pName) { setParcours(pName); return; }
    /* aucun parcours : repli sur la vue décennale */
    scale = 3;
  }

  var period = parseInt(document.getElementById('wz-period-select').value || '1300');

  /* Niveau de détail par défaut selon la vue :
     - vue siècle (2)  : detailLevel 1 (les autres niveaux non proposés)
     - vue décennale(3): detailLevel 2 (Important par défaut, ajustable au zoom)
     - vue annuelle (4): detailLevel 3 (Détaillé par défaut, ajustable au zoom) */
  if (scale === 2)      detailLevel = 1;  /* siècle    → Siècle */
  else if (scale === 3) detailLevel = 2;  /* décennale → Important */
  else                  detailLevel = 4;  /* annuelle  → Complet (tous les événements) */
  document.querySelectorAll('.detail-btn').forEach(function(b) {
    b.classList.toggle('active', parseInt(b.dataset.level) === detailLevel);
  });

  currentCentury = Math.floor(period / 100) * 100;
  currentDecade  = scale >= 3 ? Math.floor(period / 10) * 10 : null;
  currentYear    = scale === 4 ? period : null;
  /* Mémorise les zones choisies au départ (frise décennale/annuelle) */
  if (scale === 3 || scale === 4) {
    startZones = {};
    ZONES.forEach(function(z) { if (activeZones[z]) startZones[z] = true; });
  }
  renderLevel(scale, period);
}

/* ══════════ SYSTÈME PARCOURS / SÉRIES ══════════ */
var activeParcours  = null;
var parcoursColors  = {};
var _savedZonesP    = null;
var PARCOURS_PALETTE = ['#7D3C98','#C0392B','#1E8449','#2471A3','#D68910',
                        '#148F77','#BA4A00','#6D4C41','#1A5276','#2D6A4F'];

function parseSeries(serie) {
  if (!serie || !serie.trim()) return [];
  return serie.split('|').map(function(s){ return s.trim(); }).filter(Boolean);
}

function getAllParcours() {
  var seen = {}, list = [];
  allEvents.forEach(function(e) {
    parseSeries(e.serie).forEach(function(p) {
      if (!seen[p]) {
        seen[p] = true;
        list.push(p);
        if (!parcoursColors[p])
          parcoursColors[p] = PARCOURS_PALETTE[(list.length - 1) % PARCOURS_PALETTE.length];
      }
    });
  });
  return list.sort();
}

function getParcoursSteps(p) {
  return allEvents.filter(function(e) {
    return parseSeries(e.serie).indexOf(p) !== -1;
  }).sort(function(a, b) {
    return a.date !== b.date ? a.date - b.date : (a.mois||0) - (b.mois||0);
  });
}

function openParcoursPanel() {
  var overlay = document.getElementById('parcours-overlay');
  var listEl  = document.getElementById('parcours-list');
  if (!overlay || !listEl) return;
  var all = getAllParcours();
  listEl.innerHTML = '';
  if (all.length === 0) {
    listEl.innerHTML = '<p class="parcours-empty">Aucun parcours d\u00e9fini.</p>';
  } else {
    all.forEach(function(p) {
      var col   = parcoursColors[p];
      var steps = getParcoursSteps(p);
      var btn = document.createElement('button');
      btn.className = 'parcours-item' + (activeParcours === p ? ' active' : '');
      btn.style.borderLeftColor = col;
      if (activeParcours === p) btn.style.background = col + '18';
      btn.innerHTML =
        '<span class="parcours-dot" style="background:' + col + '"></span>' +
        '<span class="parcours-name">' + p.replace(/_/g,' ') + '</span>' +
        '<span class="parcours-count">' + steps.length + ' \u00e9tape' + (steps.length>1?'s':'') + '</span>';
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
  overlay.style.display = 'flex';
}

function closeParcoursPanel() {
  var overlay = document.getElementById('parcours-overlay');
  if (overlay) { overlay.classList.remove('open'); overlay.style.display = 'none'; }
}

function updateParcoursBtn() {
  var btn = document.getElementById('btn-parcours');
  if (!btn) return;
  if (activeParcours) {
    var col = parcoursColors[activeParcours] || '#7D3C98';
    btn.style.cssText = 'background:' + col + '22;border-color:' + col + ';color:' + col + ';font-weight:700;';
    btn.innerHTML = '\u25c6 ' + activeParcours.replace(/_/g,' ') + ' \u00d7';
  } else {
    btn.style.cssText = '';
    btn.innerHTML = '\u25c6 Parcours';
  }
}

function setParcours(p) {
  activeParcours = p;
  updateParcoursBtn();

  /* Sauvegarde et active uniquement les zones du parcours */
  _savedZonesP = {};
  for (var zz in activeZones) _savedZonesP[zz] = activeZones[zz];
  var pZones = {};
  allEvents.forEach(function(e) {
    if (parseSeries(e.serie).indexOf(p) === -1) return;
    (e.zones || []).forEach(function(z) { pZones[z] = true; });
  });
  for (var z in activeZones) activeZones[z] = false;
  for (var z2 in pZones) activeZones[z2] = true;
  updateFilterCheckboxes();

  /* Navigue vers la décennie de la 1re étape */
  var steps = getParcoursSteps(p);
  if (steps[0]) {
    var dec = Math.floor(steps[0].date / 10) * 10;
    currentDecade  = dec;
    currentCentury = Math.floor(dec / 100) * 100;
    currentYear    = null;
    currentLevel   = 3;
    renderLevel(3, dec);
  } else {
    refreshFrise();
  }
  updateParcoursNavBar(p);
  showParcoursResults(p);
  updateNavButtons();
  updateDetailBar();
}

function clearParcours() {
  activeParcours = null;
  updateParcoursBtn();
  if (_savedZonesP) {
    for (var z in activeZones) activeZones[z] = !!_savedZonesP[z];
    _savedZonesP = null;
    updateFilterCheckboxes();
  }
  var bar = document.getElementById('parcours-nav-bar');
  if (bar) bar.style.display = 'none';
  var panel = document.getElementById('search-results-panel');
  if (panel) panel.style.display = 'none';
  document.body.classList.remove('parcours-panel-open');
  closeSyntheseBanner();
  refreshFrise();
  updateNavButtons();
  updateDetailBar();
}

function updateParcoursNavBar(p) {
  var bar = document.getElementById('parcours-nav-bar');
  if (!bar) return;
  var steps = getParcoursSteps(p);
  var col   = parcoursColors[p] || '#7D3C98';
  var titleEl = bar.querySelector('.pnav-title');
  if (titleEl) titleEl.innerHTML = '<span style="color:'+col+'">\u25c6 '+p.replace(/_/g,' ')+'</span> &mdash; '+steps.length+' \u00e9tape'+(steps.length>1?'s':'');
  var sel = bar.querySelector('.pnav-select');
  if (sel) {
    sel.innerHTML = '';
    var MOIS=['jan.','f\u00e9v.','mar.','avr.','mai','jun.','jul.','ao\u00fb.','sep.','oct.','nov.','d\u00e9c.'];
    steps.forEach(function(evt, i) {
      var opt = document.createElement('option');
      var d = evt.mois ? MOIS[evt.mois-1]+'\u00a0'+evt.date : ''+evt.date;
      opt.value = i;
      opt.textContent = (i+1)+'. '+d+' \u2014 '+evt.titre;
      sel.appendChild(opt);
    });
    sel.onchange = function() { parcoursGoToStep(steps, parseInt(this.value)); };

    /* Bouton Fiche uniquement (le select navigue déjà sur la frise) */
    var oldF = bar.querySelector('.pnav-frise-btn'); if (oldF) oldF.remove();
    var oldFi = bar.querySelector('.pnav-fiche-btn'); if (oldFi) oldFi.remove();
    var bStyle = 'font-size:0.78rem;padding:0.2rem 0.65rem;border:1px solid var(--border-dark);border-radius:14px;background:rgba(245,237,216,0.9);cursor:pointer;white-space:nowrap;';
    var ficheBtn = document.createElement('button');
    ficheBtn.className='pnav-fiche-btn'; ficheBtn.textContent='Fiche \u2197'; ficheBtn.style.cssText=bStyle;
    ficheBtn.onclick=function(){ var s=getParcoursSteps(activeParcours)[parseInt(sel.value)]; if(s) openModal(s, s.zones&&s.zones[0]||ZONES[0]); };
    sel.parentNode.insertBefore(ficheBtn, sel.nextSibling);
  }
  bar.style.display = 'flex';
  bar.style.borderColor = col;
}

function parcoursGoToStep(steps, idx) {
  if (!steps || idx < 0 || idx >= steps.length) return;
  var evt = steps[idx];
  var sel = document.querySelector('#parcours-nav-bar .pnav-select');
  if (sel) sel.value = idx;
  var items = document.querySelectorAll('#search-results-list .sr-item');
  items.forEach(function(it, i) { it.classList.toggle('sr-item-active', i === idx); });
  var dec = Math.floor(evt.date / 10) * 10;
  currentDecade = dec; currentCentury = Math.floor(dec/100)*100; currentYear = null; currentLevel = 3;
  renderLevel(3, dec); updateNavButtons(); updateDetailBar();
}

function parcoursNavStep(dir) {
  if (!activeParcours) return;
  var steps = getParcoursSteps(activeParcours);
  var sel = document.querySelector('#parcours-nav-bar .pnav-select');
  var cur = sel ? parseInt(sel.value) : 0;
  parcoursGoToStep(steps, Math.max(0, Math.min(steps.length-1, cur+dir)));
}

function showParcoursResults(p) {
  var panel = document.getElementById('search-results-panel');
  var listEl = document.getElementById('search-results-list');
  var titleEl = document.getElementById('sr-title');
  if (!panel || !listEl) return;
  var col = parcoursColors[p] || '#7D3C98';
  var steps = getParcoursSteps(p);
  if (titleEl) titleEl.innerHTML = '<span style="color:'+col+'">\u25c6 '+p.replace(/_/g,' ')+'</span> \u2014 '+steps.length+' \u00e9tape'+(steps.length>1?'s':'');
  listEl.innerHTML = '';
  if (steps.length === 0) { listEl.innerHTML='<p class="sr-empty">Aucune \u00e9tape.</p>'; panel.style.display='flex'; return; }

  var MOIS=['jan.','f\u00e9v.','mar.','avr.','mai','jun.','jul.','ao\u00fb.','sep.','oct.','nov.','d\u00e9c.'];
  var LVL={1:{o:1,d:10,fs:'14px',fw:'500'},2:{o:0.78,d:8,fs:'13px',fw:'500'},3:{o:0.55,d:6,fs:'12px',fw:'400'},4:{o:0.4,d:4,fs:'11px',fw:'400'},5:{o:0.3,d:3,fs:'11px',fw:'400'}};
  var timeline = document.createElement('div');
  timeline.style.cssText = 'position:relative;padding-left:22px;border-left:2px solid '+col+'33;display:flex;flex-direction:column;gap:2px;';

  steps.forEach(function(evt, idx) {
    var lvl = Math.min(Math.max(parseInt(evt.type)||2,1),5);
    var cfg = LVL[lvl];
    var d = evt.mois ? MOIS[evt.mois-1]+'\u00a0'+evt.date : ''+evt.date;
    if (evt.date_fin && evt.date_fin>evt.date) d += '\u2013'+evt.date_fin;
    var row = document.createElement('div');
    row.style.cssText='display:flex;align-items:flex-start;gap:8px;position:relative;padding:3px 0;cursor:pointer;border-radius:5px;';
    row.addEventListener('mouseenter',function(){this.style.background='var(--parchment-dk)';});
    row.addEventListener('mouseleave',function(){this.style.background='';});
    var dot=document.createElement('span');
    dot.style.cssText='position:absolute;left:'+(-22-cfg.d/2+1)+'px;top:'+(8-cfg.d/2)+'px;width:'+cfg.d+'px;height:'+cfg.d+'px;border-radius:50%;background:'+col+';opacity:'+cfg.o+';flex-shrink:0;';
    row.appendChild(dot);
    var dateEl=document.createElement('span');
    dateEl.style.cssText='font-size:10px;color:var(--ink-muted);min-width:38px;text-align:right;padding-top:2px;flex-shrink:0;';
    dateEl.textContent=d; row.appendChild(dateEl);
    var body=document.createElement('span'); body.style.cssText='display:flex;flex-direction:column;flex:1;min-width:0;';
    var titre=document.createElement('span');
    titre.style.cssText='font-size:'+cfg.fs+';font-weight:'+cfg.fw+';color:var(--ink);font-style:italic;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
    titre.textContent=evt.titre; body.appendChild(titre);
    row.appendChild(body);
    row.addEventListener('click',(function(e,si){return function(){
      timeline.querySelectorAll('.parcours-row-active').forEach(function(r){r.classList.remove('parcours-row-active');r.style.background='';});
      this.classList.add('parcours-row-active'); this.style.background=col+'18';
      var sel=document.querySelector('#parcours-nav-bar .pnav-select'); if(sel) sel.value=si;
      var dec=Math.floor(e.date/10)*10; currentDecade=dec; currentCentury=Math.floor(dec/100)*100; currentYear=null; currentLevel=3;
      renderLevel(3,dec); updateNavButtons(); updateDetailBar();
    };})(evt,idx));
    row.addEventListener('dblclick',(function(e){return function(ev){ev.stopPropagation();openModal(e,e.zones&&e.zones[0]||ZONES[0]);};})(evt));
    timeline.appendChild(row);
  });
  listEl.appendChild(timeline);

  var srHeader = document.querySelector('.sr-header');
  if (srHeader) {
    var oldBtn = srHeader.querySelector('.sr-frise-btn'); if (oldBtn) oldBtn.remove();
    var fb = document.createElement('button');
    fb.className='sr-frise-btn'; fb.textContent='Voir sur la frise \u2192';
    fb.onclick=function(){ panel.style.display='none'; document.body.classList.remove('parcours-panel-open'); };
    var cb = srHeader.querySelector('.sr-close');
    if (cb) srHeader.insertBefore(fb, cb); else srHeader.appendChild(fb);
  }
  panel.style.display='flex';
  document.body.classList.add('parcours-panel-open');
}


/* ── Navigation vers la carte : transmet la période actuellement affichée
     (année en vue annuelle, décennie en vue décennale/siècle/ensemble)
     pour que carte.html s'ouvre au bon endroit plutôt que sur la décennie
     la plus peuplée par défaut. ── */
function goToCarte() {
  var params = new URLSearchParams();
  if (currentLevel === 4 && currentYear) {
    params.set('year', currentYear);
  } else if (currentDecade !== undefined && currentDecade !== null) {
    params.set('decade', currentDecade);
  } else if (currentCentury !== undefined && currentCentury !== null) {
    params.set('decade', currentCentury);
  }
  window.location.href = 'carte.html' + (params.toString() ? '?' + params.toString() : '');
}

function goHome() {
  /* Réinitialise complètement la frise */
  var _sa = document.getElementById('sticky-axis');
  if (_sa) _sa.style.display = 'none';
  closeEventList();

  /* 1. Désactive un éventuel parcours actif */
  if (activeParcours) {
    activeParcours = null;
    _savedZonesP = null;
    if (typeof updateParcoursBtn === 'function') updateParcoursBtn();
    var pbar = document.getElementById('parcours-nav-bar');
    if (pbar) pbar.style.display = 'none';
  }

  /* 2. Désactive le filtre de recherche */
  searchFilterActive = false;
  searchTerm = '';

  /* 3. Ferme les panneaux latéraux */
  var panel = document.getElementById('search-results-panel');
  if (panel) panel.style.display = 'none';
  document.body.classList.remove('parcours-panel-open');

  /* 4. Réinitialise zones, recherche, niveau de détail */
  for (var z in activeZones) activeZones[z] = false;
  detailLevel = 2;
  var inp = document.getElementById('search-input');
  if (inp) inp.value = '';
  clearSearch();
  var wzInp = document.getElementById('wz-search-input');
  if (wzInp) wzInp.value = '';

  /* 5. Rouvre l'assistant d'accueil */
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
  else if (level === 4) {
    /* Vue annuelle : si une année est déjà définie, on y va directement ;
       sinon on ouvre la fenêtre de choix d'année */
    if (currentYear !== null) renderLevel(4, currentYear);
    else openYearPicker();
  }
}

/* ── Fenêtre de choix d'année ─────────────────────────────────────── */
function openYearPicker() {
  var overlay = document.getElementById('year-picker-overlay');
  var grid = document.getElementById('year-picker-grid');
  var sub = document.getElementById('year-picker-sub');
  var input = document.getElementById('year-picker-input');
  if (!overlay || !grid) return;
  grid.innerHTML = '';

  /* Décennie de référence : la décennie active, sinon 1340 par défaut */
  var baseDec = (currentDecade !== null) ? currentDecade
              : (currentCentury !== null ? currentCentury + 40 : 1340);

  if (sub) sub.textContent = 'Années de la décennie ' + baseDec + '-' + (baseDec + 9) +
    ' (ou saisissez une autre année ci-dessous).';

  for (var y = baseDec; y < baseDec + 10; y++) {
    (function(year) {
      var b = document.createElement('button');
      b.textContent = year;
      b.onclick = function() { yearPickerSelect(year); };
      grid.appendChild(b);
    })(y);
  }
  if (input) input.value = '';
  overlay.style.display = 'flex';
  if (input) setTimeout(function() { input.focus(); }, 50);
}

function closeYearPicker() {
  var overlay = document.getElementById('year-picker-overlay');
  if (overlay) overlay.style.display = 'none';
}

function yearPickerSelect(year) {
  closeYearPicker();
  currentYear = year;
  renderLevel(4, year);
}

function yearPickerGo() {
  var input = document.getElementById('year-picker-input');
  if (!input) return;
  var y = parseInt(input.value);
  if (isNaN(y) || y < 1192 || y > 1494) {
    input.style.borderColor = '#c00';
    return;
  }
  yearPickerSelect(y);
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
  /* Surbrillance et activation par identifiant (évite le décalage d'index) */
  var lvlBtns = [
    { id: 'btn-level1', lvl: 1 },
    { id: 'btn-level2', lvl: 2 },
    { id: 'btn-level3', lvl: 3 },
    { id: 'btn-level4', lvl: 4 }
  ];
  lvlBtns.forEach(function(b) {
    var el = document.getElementById(b.id);
    if (!el) return;
    el.classList.toggle('active', currentLevel === b.lvl);
    /* niveau 1 toujours dispo ; 2 si siècle connu ; 3 et 4 si siècle ou décennie connus */
    if (b.lvl === 1)      el.disabled = false;
    else if (b.lvl === 2) el.disabled = (currentCentury === null);
    else if (b.lvl === 3) el.disabled = (currentCentury === null && currentDecade === null);
    else                  el.disabled = false;  /* Vue annuelle : toujours active (ouvre le choix d'année) */
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
  var other = document.getElementById('btn-other');
  if (other) other.style.display = showNav ? '' : 'none';
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
  updateNavStatus();
}

/* Bandeau d'état : rappelle le mode, l'échelle, la période et les filtres actifs */
function updateNavStatus() {
  var bar  = document.getElementById('nav-status');
  var info = document.getElementById('nav-status-info');
  if (!bar || !info) return;

  var modeTxt, periodTxt = '';
  if (typeof activeParcours !== 'undefined' && activeParcours) {
    modeTxt = 'Parcours thématique';
  } else if (searchFilterActive) {
    modeTxt = 'Recherche';
  } else if (currentLevel === 4 && currentYear !== null) {
    modeTxt = 'Frise par année'; periodTxt = 'année ' + currentYear;
  } else if (currentLevel === 2 && currentCentury !== null) {
    modeTxt = 'Vue siècle'; periodTxt = currentCentury + '\u2013' + (currentCentury + 99);
  } else if (currentLevel === 1) {
    modeTxt = "Vue d'ensemble"; periodTxt = '1300\u20131500';
  } else {
    modeTxt = 'Frise décennale';
    periodTxt = (currentDecade !== null) ? currentDecade + '\u2013' + (currentDecade + 9) : '';
  }

  /* Échelle = niveau de lecture (densité d'événements affichés) */
  var levelNames = { 1: 'Siècle', 2: 'Important', 3: 'Détaillé', 4: 'Complet' };
  var echelleTxt = levelNames[detailLevel] || '';

  var zones = ZONES.filter(function(z) { return activeZones[z]; });
  var zonesTxt;
  if (zones.length === 0) zonesTxt = 'aucune';
  else if (zones.length === ZONES.length) zonesTxt = 'toutes';
  else if (zones.length > 6) zonesTxt = zones.length + ' zones';
  else zonesTxt = zones.join(', ');

  var themes = [];
  for (var t in activeThemes) {
    if (activeThemes[t]) themes.push(THEME_DEFS[t] ? THEME_DEFS[t].label : t);
  }

  var SEP = ' &nbsp;\u00b7&nbsp; ';
  var html = 'Mode : <b>' + modeTxt + '</b>';
  if (typeof activeParcours !== 'undefined' && activeParcours) {
    html += SEP + 'Parcours : <b>' + activeParcours + '</b>';
  } else if (searchFilterActive) {
    html += SEP + 'Mot-clé : <b>' + (searchTerm || '') + '</b>';
  } else {
    if (echelleTxt) html += SEP + 'Échelle : <b>' + echelleTxt + '</b>';
    if (periodTxt)  html += SEP + 'Période : <b>' + periodTxt + '</b>';
  }
  html += SEP + 'Zones : <b>' + zonesTxt + '</b>';
  if (themes.length) html += SEP + 'Filtres thématiques : <b>' + themes.join(', ') + '</b>';
  info.innerHTML = html;

  bar.style.display = 'flex';
}

/* « Retour à la frise complète » : quitte les listes et les parcours,
   supprime tous les filtres actifs, et revient à la frise décennale
   de la période EN COURS (en conservant les zones de l'usager). */
function backToDecade() {
  /* Quitte la liste des événements si elle est ouverte */
  if (typeof closeEventList === 'function') closeEventList();
  /* Quitte le parcours et la recherche */
  if (typeof activeParcours !== 'undefined' && activeParcours && typeof clearParcours === 'function') clearParcours();
  if ((searchFilterActive || searchTerm) && typeof clearSearch === 'function') clearSearch();

  /* Supprime les filtres thématiques (légende) */
  activeThemes = {};
  if (typeof renderAllLegends === 'function') renderAllLegends();
  var tl = document.getElementById('theme-legend'); if (tl) tl.style.display = 'none';

  /* Réaffiche les zones sélectionnées AU DÉPART (et non les zones courantes ni toutes les zones) */
  if (startZones) {
    ZONES.forEach(function(z) { activeZones[z] = !!startZones[z]; });
  }
  var anyZone = ZONES.some(function(z) { return activeZones[z]; });
  if (!anyZone) activeZones['France'] = true;   /* filet de sécurité si aucune zone */
  if (typeof updateFilterCheckboxes === 'function') updateFilterCheckboxes();

  /* Échelle de détail « Important » */
  detailLevel = 2;
  document.querySelectorAll('.detail-btn').forEach(function(b) {
    b.classList.toggle('active', parseInt(b.dataset.level) === 2);
  });

  /* Vue décennale, sur la période EN COURS */
  var d = (currentDecade !== null) ? currentDecade : 1300;
  currentCentury = Math.floor(d / 100) * 100;
  renderLevel(3, d);
}

function pct(year, start, end) {
  return ((year - start) / (end - start) * 100).toFixed(3) + '%';
}

/* « Autres périodes » : ouvre une fenêtre proposant les autres décennies (ou années),
   pour sauter directement à l'une d'elles sans repasser par le menu des zones. */
function openPeriodPicker() {
  var overlay = document.getElementById('period-picker');
  var grid    = document.getElementById('pp-grid');
  var title   = document.getElementById('pp-title');
  if (!overlay || !grid) return;
  grid.innerHTML = '';

  function mkItem(label, val, isCurrent, fn) {
    var b = document.createElement('div');
    b.className = 'pp-item' + (isCurrent ? ' current' : '');
    b.textContent = label;
    b.onclick = function() { closePeriodPicker(); fn(val); };
    grid.appendChild(b);
  }

  if (currentLevel === 4) {
    if (title) title.textContent = 'Choisir une année';
    for (var y = 1300; y <= 1499; y++) {
      mkItem('' + y, y, y === currentYear, function(v) { renderLevel(4, v); });
    }
  } else if (currentLevel === 2) {
    if (title) title.textContent = 'Choisir un siècle';
    for (var c = 1300; c <= 1400; c += 100) {
      mkItem(c + '\u2013' + (c + 99), c, c === currentCentury, function(v) { renderLevel(2, v); });
    }
  } else {
    if (title) title.textContent = 'Choisir une décennie';
    for (var d = 1300; d <= 1490; d += 10) {
      mkItem(d + '\u2013' + (d + 9), d, d === currentDecade, function(v) {
        currentCentury = Math.floor(v / 100) * 100;
        renderLevel(3, v);
      });
    }
  }
  overlay.style.display = 'flex';
}

function closePeriodPicker() {
  var overlay = document.getElementById('period-picker');
  if (overlay) overlay.style.display = 'none';
}

/* ── Recherche ──────────────────────────────────────────────────────*/
var savedActiveZones = null;
var savedCurrentLevel   = null;
var savedCurrentCentury = null;
var savedCurrentDecade  = null;
var savedCurrentYear    = null;

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

function navigateToEvent(evt) {
  /* Si une recherche est active, active le filtre et les zones des résultats */
  if (searchTerm) {
    searchFilterActive = true;
    var matches = allEvents.filter(function(e) { return eventMatchesSearch(e); });
    ZONES.forEach(function(z) {
      activeZones[z] = matches.some(function(e) { return e.zones.indexOf(z) !== -1; });
    });
    updateFilterCheckboxes();
  }
  /* Navigue vers la décennie contenant l'événement */
  var dec = Math.floor(evt.date / 10) * 10;
  currentDecade  = dec;
  currentCentury = Math.floor(dec / 100) * 100;
  currentYear    = null;
  currentLevel   = 3;
  renderLevel(3, dec);
  updateNavButtons();
  updateDetailBar();
}

function showSearchResults() {
  var panel   = document.getElementById('search-results-panel');
  var listEl  = document.getElementById('search-results-list');
  var titleEl = document.getElementById('sr-title');
  var countEl = document.getElementById('search-count');
  if (!panel || !listEl) return;

  var results = allEvents
    .filter(function(e) { return eventMatchesSearch(e); })
    .sort(function(a, b) { return a.date !== b.date ? a.date - b.date : (a.mois||0) - (b.mois||0); });

  if (countEl) countEl.textContent = results.length
    ? results.length + ' r\u00e9sultat' + (results.length > 1 ? 's' : '')
    : 'Aucun r\u00e9sultat';
  if (titleEl) titleEl.textContent = searchTerm
    ? 'Recherche\u00a0: \u00ab\u00a0' + searchTerm + '\u00a0\u00bb'
    : 'R\u00e9sultats';

  var MOIS_ABR = ['jan.','f\u00e9v.','mar.','avr.','mai','jun.',
                  'jul.','ao\u00fb.','sep.','oct.','nov.','d\u00e9c.'];
  var LEVEL_LABELS = {
    1: 'Niveau 1 \u2014 R\u00e8gne', 2: 'Niveau 2 \u2014 Si\u00e8cle',
    3: 'Niveau 3 \u2014 Important', 4: 'Niveau 4 \u2014 D\u00e9taill\u00e9',
    5: 'Niveau 5 \u2014 Complet'
  };

  listEl.innerHTML = '';
  if (results.length === 0) {
    listEl.innerHTML = '<p class="sr-empty">Aucun \u00e9v\u00e9nement ne correspond.</p>';
  } else {
    var byLevel = {1:[],2:[],3:[],4:[],5:[]};
    results.forEach(function(e) {
      var t = e.regne ? 1 : (parseInt(e.type) || 2);
      (byLevel[t] || byLevel[2]).push(e);
    });
    [1,2,3,4,5].forEach(function(lvl) {
      var items = byLevel[lvl];
      if (!items.length) return;
      var header = document.createElement('div');
      header.className = 'sr-level-header';
      header.textContent = LEVEL_LABELS[lvl] + ' (' + items.length + ')';
      listEl.appendChild(header);
      items.forEach(function(evt) {
        var evtCol = COLORS[evt.zones && evt.zones[0]] || COLORS['France'];
        var dateStr = evt.mois ? MOIS_ABR[evt.mois-1] + '\u00a0' + evt.date : '' + evt.date;
        if (evt.date_fin && evt.date_fin > evt.date) dateStr += '\u2013' + evt.date_fin;
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
          thumb.src = evt.image; thumb.alt = ''; thumb.className = 'sr-thumb';
          item.appendChild(thumb);
        }
        item.style.cursor = 'pointer';
        /* Clic simple → navigue sur la frise + surligne */
        item.addEventListener('click', (function(e) {
          return function() {
            listEl.querySelectorAll('.sr-item-active').forEach(function(it) {
              it.classList.remove('sr-item-active');
            });
            this.classList.add('sr-item-active');
            navigateToEvent(e);
          };
        })(evt));
        /* Double-clic → ouvre la fiche */
        item.addEventListener('dblclick', (function(e) {
          return function(ev) { ev.stopPropagation(); openModal(e, e.zones && e.zones[0] || ZONES[0]); };
        })(evt));
        listEl.appendChild(item);
      });
    });
  }
  panel.style.display = 'flex';
  document.body.classList.add('parcours-panel-open');
}

function closeSearchResults() {
  var panel   = document.getElementById('search-results-panel');
  var countEl = document.getElementById('search-count');
  if (panel) panel.style.display = 'none';
  if (countEl) countEl.textContent = '';
  document.body.classList.remove('parcours-panel-open');
  searchTerm = '';
  /* Désactive le filtre recherche et restaure l'affichage */
  if (searchFilterActive) {
    searchFilterActive = false;
    refreshFrise();
  }
  var inp = document.getElementById('search-input');
  if (inp) inp.value = '';
  var clearBtn = document.getElementById('search-clear');
  if (clearBtn) clearBtn.style.display = 'none';
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
  closeSearchResults();
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

/* ── Zoom d'affichage (simule le zoom navigateur, mémorisé par appareil) ── */
function applyFriseZoom(z) {
  z = z || '1';
  document.documentElement.style.zoom = z;
  try { localStorage.setItem('friseZoom', z); } catch (e) {}
}
function initFriseZoom() {
  var z = '1';
  try { z = localStorage.getItem('friseZoom') || '1'; } catch (e) {}
  document.documentElement.style.zoom = z;
  var sel = document.getElementById('zoom-select');
  if (sel) sel.value = z;
}

document.addEventListener('DOMContentLoaded', function() {
  initActiveZones();
  initFriseZoom();
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
