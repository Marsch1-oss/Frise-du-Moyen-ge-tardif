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
};

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
  'Empire': 'St Empire', 'St_Empire': 'St Empire', 'Iberique': 'Castille', 'Ibérique': 'Castille',
  'Papaute': 'Papaute', 'Papauté': 'Papaute', 'Idées': 'Idees', 'Littérature': 'Litterature'
};

var ROW_H = 32, ROW_GAP = 5, TRACK_PX = 860;
var currentLevel = 1, allEvents = [], activeZones = null;
var activeSerie = null; // Stocke la série en cours (Fil rouge)

function initActiveZones() {
  activeZones = {};
  for (var i = 0; i < ZONES.length; i++) activeZones[ZONES[i]] = (ZONES[i] === 'France');
}

function normalizeZone(z) { return ZONE_ALIASES[z] || z; }

function loadEvents() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'events.json', true);
  xhr.onload = function() {
    if (xhr.status === 200 || xhr.status === 0) {
      try {
        allEvents = JSON.parse(xhr.responseText).map(function(e) {
          e.zones = (e.zones || [e.zone || 'Monde']).map(normalizeZone);
          return e;
        });
        buildFilterBar();
        renderFrise();
      } catch(err) { console.error("Erreur JSON:", err); }
    }
  };
  xhr.send();
}

function buildFilterBar() {
  var container = document.getElementById('zone-filters');
  if (!container) return;
  container.innerHTML = '';
  ZONES.forEach(function(zone) {
    var label = document.createElement('label');
    label.className = activeZones[zone] ? 'zone-checkbox checked' : 'zone-checkbox unchecked';
    var input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = activeZones[zone];
    input.addEventListener('change', function() {
      activeZones[zone] = this.checked;
      label.className = this.checked ? 'zone-checkbox checked' : 'zone-checkbox unchecked';
      renderFrise();
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(' ' + zone));
    container.appendChild(label);
  });
}

// --- Système de Série (Fil Rouge) ---
function openSerie(serieName) {
  activeSerie = serieName;
  var serieEvents = allEvents.filter(e => e.serie === serieName).sort((a,b) => a.date - b.date);
  console.log("Fil rouge activé : " + serieName, serieEvents);
  renderFrise();
}

function closeSerie() {
  activeSerie = null;
  renderFrise();
}

function renderFrise() {
  var container = document.getElementById('frise-container');
  if (!container) return;
  container.innerHTML = '';

  // Filtrage des événements par zones actives OU par série active
  var filtered = allEvents.filter(function(e) {
    if (activeSerie && e.serie === activeSerie) return true;
    return e.zones.some(z => activeZones[z]);
  });

  // Affichage basique (à adapter selon votre buildTrack d'origine)
  ZONES.forEach(function(zone) {
    if (!activeZones[zone] && (!activeSerie)) return;
    var zoneEvts = filtered.filter(e => e.zones.includes(zone));
    if (zoneEvts.length > 0) {
      var track = document.createElement('div');
      track.className = 'track-row';
      track.innerHTML = '<strong>' + zone + '</strong>';
      // Ici viendrait votre logique de positionnement buildChip...
      container.appendChild(track);
    }
  });
}

// Initialisation au chargement
window.addEventListener('DOMContentLoaded', function() {
  initActiveZones();
  loadEvents();
});