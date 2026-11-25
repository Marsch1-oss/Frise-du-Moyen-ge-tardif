const ZONES = [
  /* Zones géographiques */
  'Europe', 'France', 'Angleterre', 'St Empire',
  'Naples', 'Italie', 'Castille', 'Aragon', 'Portugal', 'Papaute', 'Alsace', 'Flandre',
  'Scandinavie', 'Pologne', 'Russie',
  'Hongrie', 'Europe C. & Or.', 'Byzance', 'Ottomans',
  'Monde islamique', 'Orient', 'Mesopotamie', 'Asie centrale', 'Inde', 'Asie du Sud-Est', 'Chine', 'Japon',
  'Afrique', 'Afrique du Nord', 'Egypte', 'Amerique', 'Monde'
];

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
  'catastrophe': { icon: '\uD83C\uDF0B',     label: 'Catastrophe' },
  'atlas':       { icon: '\uD83D\uDDFA\uFE0F', label: 'Atlas / Cartes' }
};
var THEME_ORDER = ['catastrophe','revolte','diplomatie','religion','economie','idees','sciences','techniques','art','litterature','societe','guerre','politique','atlas'];
/* Détecte le thème principal (utilisé pour les aperçus rapides) */
function detectTheme(evt) {
  if (evt.themes && evt.themes.length > 0) return evt.themes[0];
  if (evt.theme && THEME_DEFS[evt.theme]) return evt.theme; // Fallback ancien format
  if (evt.atlas) return 'atlas';
  return null;
}

function themeIcon(evt) {
  var t = detectTheme(evt);
  if (t && THEME_DEFS[t]) return THEME_DEFS[t].icon;
  return '';
}
const ZONE_GROUPS = [
 { label: 'Général',             zones: ['Europe', 'Monde'] },
  { label: 'Europe occidentale',  zones: ['France', 'Angleterre', 'St Empire', 'Naples', 'Italie', 'Castille', 'Aragon', 'Portugal', 'Papaute', 'Alsace', 'Flandre'] },
  { label: 'Europe du Nord',      zones: ['Scandinavie'] },
  { label: 'Europe orientale',    zones: ['Pologne', 'Russie', 'Hongrie', 'Europe C. & Or.', 'Byzance', 'Ottomans'] },
  { label: 'Asie & Islam',        zones: ['Monde islamique', 'Orient', 'Mesopotamie', 'Asie centrale', 'Inde', 'Asie du Sud-Est', 'Chine', 'Japon'] },
  { label: 'Afrique & Amérique',  zones: ['Afrique', 'Afrique du Nord', 'Egypte', 'Amerique'] }
];

const COLORS = {
 'Europe':'#3B5998','France':'#8B1A1A','Angleterre':'#1A4A6B','St Empire':'#6B4A10',
  'Papaute':'#7A1A1A','Naples':'#1A5C4A','Italie':'#1A6B3C',
  'Castille':'#8B6B10','Aragon':'#6B2A10','Portugal':'#3A6B10',
  'Hongrie':'#8B3A1A','Europe C. & Or.':'#2A5C5C','Pologne':'#8B1A4A',
  'Russie':'#5C1A1A','Byzance':'#6B1A6B','Ottomans':'#8B1A3A',
  'Monde islamique':'#8B6B10','Orient':'#5C2A10','Japon':'#8B1A1A',
  'Chine':'#8B3A10','Inde':'#6B5A10','Monde':'#3A3A3A',
  'Alsace':'#7A3B69','Flandre':'#C26A1A','Art':'#A0522D','Techniques':'#2F5233',
  'Sciences':'#1A4A5C','Idees':'#1A3A6B','Litterature':'#2A5C2A','Scandinavie':'#2A4A6B',
  'Afrique':'#7A4A10','Amerique':'#2A6B4A',
  /* Nouvelles zones */
  'Afrique du Nord':'#A65E2E',
  'Egypte':'#B8860B',
  'Mesopotamie':'#7A3E10',
  'Asie centrale':'#5C6B28',
  'Asie du Sud-Est':'#2E6B5E'
};

const ALIASES = {
  'Pen. iberique':'Castille','Pen. ibérique':'Castille',
  'Pén. ibérique':'Castille','Ibérique':'Castille',
  'Papauté':'Papaute','Techniques et idees':'Techniques',
  'Idées':'Idees','Empire':'St Empire',
  'Flandres':'Flandre','Flanders':'Flandre','Comté de Flandre':'Flandre',
  'Amérique':'Amerique','America':'Amerique','Afrique':'Afrique',
  /* Alias pour les nouvelles zones */
  'Égypte':'Egypte',
  'Mésopotamie':'Mesopotamie',
  'Asie du Sud est':'Asie du Sud-Est',
  'Asie du Sud-est':'Asie du Sud-Est',
  'Asie du sud-est':'Asie du Sud-Est',
  'Asie Centrale':'Asie centrale'
};

var events = [];

var _evtDirty = false;
var _synthDirty = false;
function markEvtDirty() { _evtDirty = true; refreshDirtyUI(); }
function markSynthDirty() { _synthDirty = true; refreshDirtyUI(); }
function clearEvtDirty() { _evtDirty = false; refreshDirtyUI(); }
function clearSynthDirty() { _synthDirty = false; refreshDirtyUI(); }
function refreshDirtyUI() {
  var b1 = document.getElementById('dl-evt-btn');
  var b2 = document.getElementById('dl-synth-btn');
  if (b1) b1.classList.toggle('needs-download', _evtDirty);
  if (b2) b2.classList.toggle('needs-download', _synthDirty);
  var pill = document.getElementById('dirty-pill');
  if (pill) {
    var pending = [];
    if (_evtDirty) pending.push('events.json');
    if (_synthDirty) pending.push('syntheses.json');
    if (pending.length) {
      pill.style.display = '';
      pill.textContent = '\u26A0 \u00C0 t\u00E9l\u00E9charger avant de fermer : ' + pending.join(' + ');
    } else {
      pill.style.display = 'none';
    }
  }
}

window.addEventListener('beforeunload', function(e) {
  if (_evtDirty || _synthDirty) { e.preventDefault(); e.returnValue = ''; return ''; }
});

function dismissOpenReminder() {
  var o = document.getElementById('open-reminder-overlay');
  if (o) o.style.display = 'none';
}
function showOpenReminder() {
  var o = document.getElementById('open-reminder-overlay');
  if (o) o.style.display = 'flex';
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') dismissOpenReminder();
});

var editingId = null;
var hasImported = false;

function cleanText(s) {
  if (!s) return '';
  return s.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '').trim();
}

function validateEvents() {
  var warnings = [];
  events.forEach(function(e) {
    (e.zones || []).forEach(function(z) {
      if (ZONES.indexOf(z) === -1)
        warnings.push('ID ' + e.id + ' \u00ab' + (e.titre||'').substring(0,20) + '\u00bb : zone inconnue \u00ab' + z + '\u00bb');
    });
  });
  return warnings;
}

function initZones() {
  var grid = document.getElementById('zones-grid');
  ZONE_GROUPS.forEach(function(group) {
    var sep = document.createElement('div');
    sep.className = 'zones-group-sep';
    sep.textContent = group.label;
    grid.appendChild(sep);

    var groupWrap = document.createElement('div');
    groupWrap.className = 'zones-group-wrap';

    group.zones.forEach(function(z) {
      var lbl = document.createElement('label');
      lbl.className = 'zone-tag';
      lbl.dataset.zone = z;
      var inp = document.createElement('input');
      inp.type = 'checkbox'; inp.value = z;
      inp.addEventListener('change', function() { updateZoneTag(lbl, this.checked, z); });
      var dot = document.createElement('span');
      dot.className = 'zone-dot-sm';
      dot.style.background = COLORS[z] || '#888';
      lbl.appendChild(inp); lbl.appendChild(dot);
      lbl.appendChild(document.createTextNode(' ' + z));
      groupWrap.appendChild(lbl);
    });
    grid.appendChild(groupWrap);
  });
}

function updateZoneTag(lbl, checked, z) {
  lbl.classList.toggle('selected', checked);
  lbl.style.background = checked ? (COLORS[z] || '#888') : '';
}

function initTypeRadios() {
  document.querySelectorAll('.type-radio').forEach(function(lbl) {
    lbl.querySelector('input').addEventListener('change', function() {
      document.querySelectorAll('.type-radio').forEach(function(l) { l.classList.remove('selected'); });
      lbl.classList.add('selected');
    });
  });
}

/* ==================================================================== */
/* CODE COULEUR DE LA RUBRIQUE IMAGE                                    */
/* ==================================================================== */
function updateImageColorCode() {
  var inp = document.getElementById('f-image');
  var box = document.getElementById('img-box');
  var badge = document.getElementById('img-status-badge');
  if (!box || !badge) return;
  var val = inp ? inp.value.trim() : '';

  if (val) {
    var isExternal = /^https?:\/\//i.test(val);
    box.style.background = isExternal ? '#eef4fa' : '#eef6f0';
    box.style.borderColor = isExternal ? '#1F5A8A' : '#1A6B3C';
    badge.textContent = isExternal ? 'URL externe' : 'Fichier local';
    badge.style.background = isExternal ? '#D6E8F8' : '#D4EDE0';
    badge.style.color = isExternal ? '#164266' : '#14532D';
  } else {
    box.style.background = '#fdf5e6';
    box.style.borderColor = '#8C4A1B';
    badge.textContent = 'Sans image';
    badge.style.background = '#F3DEC0';
    badge.style.color = '#7A3E12';
  }
}

function readForm() {
  var date = parseInt(document.getElementById('f-date').value);
  var titre = document.getElementById('f-titre').value.trim();
  if (!date || !titre) { toast('Remplissez au minimum la date et le titre.'); return null; }

  var dateFin = parseInt(document.getElementById('f-date-fin').value) || null;
  var mois = parseInt(document.getElementById('f-mois').value) || null;
  var moisFin = parseInt(document.getElementById('f-mois-fin').value) || null;

  var zones = [];
  document.querySelectorAll('#zones-grid input:checked').forEach(function(inp) { zones.push(inp.value); });
  if (zones.length === 0) { toast('Sélectionnez au moins une zone géographique.'); return null; }

  var type = parseInt(document.querySelector('input[name="type"]:checked').value);

  var rawImg = document.getElementById('f-image').value.trim();
  if (/^[A-Za-z]:[\\\/]|^\/Users\/|^\/home\//.test(rawImg)) {
    toast('Image : chemin local détecté — utilisez images/nom-fichier.jpg');
    rawImg = '';
  }
  var fVideoEl = document.getElementById('f-video');
  var rawVideo = fVideoEl ? fVideoEl.value.trim() : '';
  var isRegne = !!(document.getElementById('f-regne') && document.getElementById('f-regne').checked);

  var evt = { id: editingId !== null ? editingId : nextId(), titre: cleanText(titre), date: date };
  if (mois) evt.mois = mois;
  if (dateFin && dateFin > date) evt.date_fin = dateFin;
  if (moisFin && dateFin) evt.mois_fin = moisFin;
  evt.zones = zones;
  evt.type = type;
  evt.description = cleanText(document.getElementById('f-desc').value);
  evt.image = rawImg;
  
  var fTheme = document.getElementById('f-theme').value;
  var themes = fTheme ? fTheme.split(',').map(function(s){return s.trim();}) : [];
  var atlasCb = document.getElementById('f-atlas');
  // Si la case atlas existe et est cochée, on l'ajoute comme thème
  if (atlasCb && atlasCb.checked && themes.indexOf('atlas') === -1) {
    themes.push('atlas');
  }
  if (themes.length > 0) {
    evt.themes = themes;
  }
  
  var leg = document.getElementById('f-legende').value.trim();
  if (leg) evt.legende = cleanText(leg);
  if (rawVideo) evt.video = cleanText(rawVideo);
  if (isRegne) evt.regne = true;
  evt.sources = cleanText(document.getElementById('f-sources').value) || '';
  
  var _noCoord = !!(document.getElementById('f-geo-none') && document.getElementById('f-geo-none').checked);
  var _verified = !!(document.getElementById('f-geo-ok') && document.getElementById('f-geo-ok').checked);
  var _la = parseFloat(document.getElementById('f-lat').value);
  var _lo = parseFloat(document.getElementById('f-lng').value);
  
  if (!_noCoord && !isNaN(_la) && !isNaN(_lo)) {
    evt.lat = Math.round(_la*10000)/10000;
    evt.lng = Math.round(_lo*10000)/10000;
    if (!_verified) evt.geo_auto = true; 
  } else if (_noCoord) {
    evt.geo_none = true;
  }
  var series = [];
  ['f-serie-1','f-serie-2','f-serie-3'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el && el.value.trim()) series.push(cleanText(el.value.trim()));
  });
  evt.serie = series.join('|');
  if (wdFormQid) evt.wikidata = wdFormQid;
  return evt;
}

function nextId() {
  if (events.length === 0) return 1;
  return Math.max.apply(null, events.map(function(e) { return e.id; })) + 1;
}

function fillForm(evt) {
  editingId = evt.id;
  document.getElementById('f-titre').value    = evt.titre    || '';
  document.getElementById('f-date').value     = evt.date     || '';
  document.getElementById('f-mois').value     = evt.mois     || '';
  document.getElementById('f-date-fin').value = evt.date_fin || '';
  document.getElementById('f-mois-fin').value = evt.mois_fin || '';
  document.getElementById('f-desc').value     = evt.description || '';
  
  var themesToSet = [];
  if (evt.themes && evt.themes.length > 0) themesToSet = evt.themes;
  else if (evt.theme) themesToSet = [evt.theme];
  setTheme(themesToSet);

  document.getElementById('f-image').value    = evt.image    || '';
  updateImageColorCode();
  document.getElementById('f-legende').value  = evt.legende  || '';
  document.getElementById('f-video').value    = evt.video    || '';
  var regneCb = document.getElementById('f-regne');
  if (regneCb) regneCb.checked = !!evt.regne;

  document.getElementById('f-sources').value  = evt.sources  || '';
  geoLoadedAuto = !!evt.geo_auto; geoValidated = false;
  var _hasGeo = (typeof evt.lat === 'number' && typeof evt.lng === 'number');
  var _cbNone = document.getElementById('f-geo-none'); if (_cbNone) _cbNone.checked = !!evt.geo_none;
  var _cbOk   = document.getElementById('f-geo-ok');   if (_cbOk)   _cbOk.checked   = _hasGeo && !evt.geo_auto;
  if (_hasGeo) {
    geoSet(evt.lat, evt.lng, false);
    geoBadge(geoLoadedAuto ? 'auto' : 'ok');
  } else {
    geoClearSilent();
    geoBadge(evt.geo_none ? 'none' : 'todo');
  }
  geoFitZones();
  geoSearchReset();
  wdFormQid = evt.wikidata || null;
  wdRenderFiche();
  wdFicheStatus('');
  cmReset();
  wpReset();
  trReset();
  var _sParts = (evt.serie || '').split('|').map(function(s){return s.trim();});
  ['f-serie-1','f-serie-2','f-serie-3'].forEach(function(id, i) {
    var el = document.getElementById(id);
    if (el) el.value = _sParts[i] || '';
  });
  document.querySelectorAll('#zones-grid input').forEach(function(inp) {
    var checked = (evt.zones || []).indexOf(inp.value) !== -1;
    inp.checked = checked;
    updateZoneTag(inp.closest('.zone-tag'), checked, inp.value);
  });
  var t = evt.type || 1;
  document.querySelectorAll('.type-radio').forEach(function(lbl) {
    var match = parseInt(lbl.dataset.val) === t;
    lbl.classList.toggle('selected', match);
    lbl.querySelector('input').checked = match;
  });
  document.getElementById('form-title').textContent = 'Modifier l\'événement #' + evt.id;
  document.getElementById('btn-delete').style.display = 'inline-block';
  document.getElementById('f-titre').focus();
  renderList();
}

function resetForm() {
  editingId = null;
  var regneCb = document.getElementById('f-regne');
  if (regneCb) regneCb.checked = false;
  
  ['f-titre','f-date','f-mois','f-date-fin','f-mois-fin',
   'f-desc','f-image','f-legende','f-video','f-sources','f-lat','f-lng','f-serie-1','f-serie-2','f-serie-3'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
  updateImageColorCode();
  document.querySelectorAll('#zones-grid input').forEach(function(inp) {
    inp.checked = false;
    updateZoneTag(inp.closest('.zone-tag'), false, inp.value);
  });
  setTheme([]);
  document.querySelectorAll('.type-radio').forEach(function(lbl) {
    var isDefault = parseInt(lbl.dataset.val) === 3;
    lbl.classList.toggle('selected', isDefault);
    lbl.querySelector('input').checked = isDefault;
  });
  document.getElementById('form-title').textContent = 'Nouvel événement';
  var _cbN = document.getElementById('f-geo-none'); if (_cbN) _cbN.checked = false;
  var _cbO = document.getElementById('f-geo-ok');   if (_cbO) _cbO.checked = false;
  geoLoadedAuto=false; geoValidated=false; geoClearSilent(); geoBadge('todo');
  geoSearchReset();
  wdFormQid = null;
  wdRenderFiche();
  wdFicheStatus('');
  cmReset();
  wpReset();
  trReset();
  document.getElementById('btn-delete').style.display = 'none';
}

function saveEvent() {
  var evt = readForm();
  if (!evt) return;
  if (editingId !== null) {
    var idx = events.findIndex(function(e) { return e.id === editingId; });
    if (idx !== -1) events[idx] = evt;
    toast('Événement modifié \u2713');
  } else {
    events.push(evt);
    toast('Événement ajouté \u2713');
  }
  events.sort(function(a, b) { return a.date - b.date; });
  resetForm();
  updateJSON();
  markEvtDirty();
}
function deleteEvent() {
  if (editingId === null) return;
  
  if (!confirm('Supprimer définitivement cet événement ?')) return;
  
  // Filtre la liste pour exclure l'événement en cours d'édition
  events = events.filter(function(e) { return e.id !== editingId; });
  
  resetForm();     // Vide le formulaire
  updateJSON();    // Met à jour la liste et le code JSON exporté
  markEvtDirty();  // Indique qu'il faut télécharger la nouvelle version
  toast('Événement supprimé \u2713');
}

function getNoThemeEvents() {
  return events.filter(function(e) { return !detectTheme(e); })
               .slice().sort(function(a, b) { return a.date - b.date; });
}
function getAutoOnlyThemeEvents() {
  return events.filter(function(e) { return (!e.themes || e.themes.length === 0) && !e.theme && detectTheme(e); })
               .slice().sort(function(a, b) { return a.date - b.date; });
}
function refreshNoTheme() {
  var c = document.getElementById('no-theme-count');
  if (c) c.textContent = getNoThemeEvents().length;
  var hint = document.getElementById('no-theme-auto-hint');
  if (hint) {
    var autoCount = getAutoOnlyThemeEvents().length;
    if (autoCount > 0) {
      hint.textContent = '\u2139\uFE0F ' + autoCount + ' fiche(s) suppl\u00e9mentaire(s) n\'ont qu\'un th\u00e8me d\u00e9tect\u00e9 automatiquement (non valid\u00e9 manuellement).';
      hint.style.display = 'block';
    } else {
      hint.style.display = 'none';
    }
  }
  var box = document.getElementById('no-theme-list');
  if (box && box.style.display === 'block') renderNoThemeList();
}
function toggleNoThemeList() {
  var box   = document.getElementById('no-theme-list');
  var caret = document.getElementById('no-theme-caret');
  if (!box) return;
  if (box.style.display === 'block') {
    box.style.display = 'none';
    if (caret) caret.classList.remove('open');
  } else {
    renderNoThemeList();
    box.style.display = 'block';
    if (caret) caret.classList.add('open');
  }
}
function renderNoThemeList() {
  var box = document.getElementById('no-theme-list');
  if (!box) return;
  var list = getNoThemeEvents();
  box.innerHTML = '';
  if (list.length === 0) {
    box.innerHTML = '<div class="no-theme-empty">Toutes les fiches ont un th\u00e8me \uD83C\uDF89</div>';
    return;
  }
  list.forEach(function(e) {
    var it = document.createElement('div');
    it.className = 'no-theme-item';
    var zones = (e.zones || []).join(', ');
    it.textContent = e.date + ' \u2014 ' + (e.titre || '') + (zones ? '  (' + zones + ')' : '');
    it.title = 'Ouvrir la fiche #' + e.id;
    it.addEventListener('click', function() {
      fillForm(e);
      var f = document.getElementById('f-titre');
      if (f) f.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    box.appendChild(it);
  });
}

function renderList() {
  refreshNoTheme();
  refreshNoDesc();
  geoTodoRefresh();
  var q = (document.getElementById('search-input').value || '').toLowerCase().trim();
  var filtered = events.filter(function(e) {
    return !q || e.titre.toLowerCase().indexOf(q) !== -1
      || String(e.date).indexOf(q) !== -1
      || String(e.id).indexOf(q) !== -1
      || ('#' + e.id).indexOf(q) !== -1
      || (e.zones && e.zones.join(' ').toLowerCase().indexOf(q) !== -1);
  });

  var sortEl = document.getElementById('sort-select');
  var sortMode = sortEl ? sortEl.value : 'default';
  if (sortMode === 'id-asc' || sortMode === 'id-desc') {
    var dir = sortMode === 'id-asc' ? 1 : -1;
    filtered.sort(function(a, b) {
      var numA = Number(a.id);
      var numB = Number(b.id);
      if (!isNaN(numA) && !isNaN(numB)) return (numA - numB) * dir;
      return String(a.id || '').localeCompare(String(b.id || ''), 'fr', { numeric: true }) * dir;
    });
  }

  document.getElementById('list-count').textContent = '(' + (q ? filtered.length + ' / ' : '') + events.length + ')';
  var list = document.getElementById('event-list');
  list.innerHTML = '';
  if (filtered.length === 0) {
    list.innerHTML = '<p style="font-size:0.82rem;color:var(--ink-muted);font-style:italic;padding:0.5rem">Aucun événement.</p>';
    return;
  }
  filtered.forEach(function(evt) {
    var card = document.createElement('div');
    card.className = 'event-card' + (editingId === evt.id ? ' active' : '');
    var t = evt.type || 1;
    var stars = t === 1 ? '★★★★★' : t === 2 ? '★★★★' : t === 3 ? '★★★' : t === 4 ? '★★' : '★';
    var zonesHtml = (evt.zones || []).map(function(z) {
      return '<span class="ec-zone" style="background:' + (COLORS[z] || '#888') + '">' + z + '</span>';
    }).join('');
    
    card.innerHTML =
      '<button class="ec-del" title="Supprimer" onclick="quickDelete(' + evt.id + ', event)">&times;</button>'
      + '<div class="ec-header">'
      + '<span class="ec-date">' + evt.date + (evt.date_fin ? '–' + evt.date_fin : '') + '</span>'
      + '<span class="ec-title">' + evt.titre + '</span>'
      + '<span class="ec-id">#' + evt.id + '</span>'
      + '</div>'
      + '<div class="ec-meta">' + zonesHtml + '<span class="ec-type">' + stars + '</span>'
      + (function(){
          var html = '';
          var ths = (evt.themes && evt.themes.length > 0) ? evt.themes : (evt.theme ? [evt.theme] : []);
          if (ths.length > 0) {
            ths.forEach(function(th) {
              if (THEME_DEFS[th]) html += '<span class="ec-theme" title="' + THEME_DEFS[th].label + ' (manuel)" style="margin-right:2px;">' + THEME_DEFS[th].icon + '</span>';
            });
          } else {
            var dt = detectTheme(evt);
            if (dt && THEME_DEFS[dt]) {
              html += '<span class="ec-theme" title="' + THEME_DEFS[dt].label + ' (auto)" style="opacity:0.6;">' + THEME_DEFS[dt].icon + '</span>';
            } else {
              html += '<span class="ec-theme ec-theme-none" title="Sans thème">\u26A0</span>';
            }
          }
          return html;
        })()
      + '</div>';
    card.addEventListener('click', function() { fillForm(evt); });
    list.appendChild(card);
  });
}

function quickDelete(id, ev) {
  ev.stopPropagation();
  if (!confirm('Supprimer cet événement ?')) return;
  events = events.filter(function(e) { return e.id !== id; });
  if (editingId === id) resetForm();
  updateJSON();
  markEvtDirty();
  toast('Événement supprimé');
}

function updateJSON() {
  var clean = events.map(function(e) {
    var o = { id: e.id, titre: e.titre, date: e.date };
    if (e.mois)     o.mois     = e.mois;
    if (e.date_fin) o.date_fin = e.date_fin;
    if (e.mois_fin) o.mois_fin = e.mois_fin;
    o.zones = e.zones;
    o.type  = e.type || 1;
    if (e.description) o.description = e.description;
    o.image = e.image || '';
    if (e.themes && e.themes.length > 0) o.themes = e.themes;
    if (e.legende) o.legende = e.legende;
    if (e.video)   o.video   = e.video;
    if (e.regne)   o.regne   = true;
    if (typeof e.lat === 'number') o.lat = e.lat;
    if (typeof e.lng === 'number') o.lng = e.lng;
    if (e.geo_auto) o.geo_auto = true;
    if (e.geo_none) o.geo_none = true;
    if (e.sources) o.sources = e.sources;
    if (e.serie)   o.serie   = e.serie;
    if (e.wikidata) o.wikidata = e.wikidata;
    return o;
  });
  var txt = JSON.stringify(clean, null, 2);
  document.getElementById('json-output').value = txt;
  var warns = validateEvents();
  var countEl = document.getElementById('json-count');
  countEl.textContent = events.length + ' événement' + (events.length > 1 ? 's' : '');
  if (warns.length > 0) {
    countEl.textContent += ' \u26a0 ' + warns.length + ' pb';
    countEl.style.color = '#8B1A1A';
    countEl.title = warns.join('\n');
  } else {
    countEl.style.color = '';
    countEl.title = '';
  }
  renderList();
  buildSerieDatalist();
  if (typeof synthInitControls === 'function') synthInitControls({ keepForm: true });
}

function buildSerieDatalist() {
  var dl = document.getElementById('serie-suggestions');
  if (!dl) return;
  dl.innerHTML = '';
  var series = {};
  events.forEach(function(e) {
    if (!e.serie) return;
    e.serie.split('|').forEach(function(s) {
      s = s.trim();
      if (s) series[s] = true;
    });
  });
  Object.keys(series).sort().forEach(function(s) {
    var opt = document.createElement('option');
    opt.value = s;
    dl.appendChild(opt);
  });
}

function downloadJSON() {
  if (events.length === 0) {
    toast('\u26a0 Aucun événement — importez d\'abord votre events.json !');
    return;
  }
  if (!hasImported && events.length < 5) {
    if (!confirm('Vous n\'avez pas importé de fichier existant. Continuer ?')) return;
  }
  var warns = validateEvents();
  if (warns.length > 0) {
    var msg = warns.length + ' zone(s) inconnue(s) — ces événements n\'apparaîtront pas sur la frise :\n\n'
            + warns.slice(0, 6).join('\n')
            + (warns.length > 6 ? '\n... et ' + (warns.length - 6) + ' autre(s).' : '')
            + '\n\nTélécharger quand même ?';
    if (!confirm(msg)) return;
  }
  var json = document.getElementById('json-output').value;
  var blob = new Blob([json], { type: 'application/json' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href = url; a.download = 'events.json';
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  clearEvtDirty();
  toast('events.json téléchargé (' + events.length + ' événements) \u2713');
}

function copyJSON() {
  if (events.length === 0) {
    toast('\u26a0 Aucun événement — importez d\'abord votre events.json !');
    return;
  }
  var ta = document.getElementById('json-output');
  ta.select();
  document.execCommand('copy');
  clearEvtDirty();
  toast('JSON copié (' + events.length + ' événements) \u2713');
}

var THEME_ZONE_MAP = { 'Art':'art', 'Techniques':'techniques', 'Sciences':'sciences', 'Idees':'idees', 'Litterature':'litterature' };

function migrateThemeZones() {
  var oldKeys = Object.keys(THEME_ZONE_MAP);
  var affected = events.filter(function(ev) {
    return (ev.zones || []).some(function(z) { return oldKeys.indexOf(z) !== -1; });
  });
  if (affected.length === 0) return;

  if (!confirm(affected.length + ' \u00e9v\u00e9nement(s) utilisent les anciens th\u00e8mes-zones.\nLes convertir automatiquement en th\u00e8mes-ic\u00f4nes ?')) {
    return;
  }

  var orphans = [];
  events.forEach(function(ev) {
    var zones = ev.zones || [];
    var themesFound = zones.filter(function(z) { return oldKeys.indexOf(z) !== -1; });
    if (themesFound.length === 0) return;
    if (!ev.themes) ev.themes = [];
    var newTheme = THEME_ZONE_MAP[themesFound[0]];
    if (ev.themes.indexOf(newTheme) === -1) ev.themes.push(newTheme);
    ev.zones = zones.filter(function(z) { return oldKeys.indexOf(z) === -1; });
    if (ev.zones.length === 0) orphans.push('#' + ev.id + ' \u00ab ' + (ev.titre || '').substring(0, 30) + ' \u00bb');
  });

  events.sort(function(a, b) { return a.date - b.date; });

  if (orphans.length > 0) {
    alert('Migration effectu\u00e9e.\n\n' + orphans.length + ' \u00e9v\u00e9nement(s) n\'ont plus de zone g\u00e9ographique.');
  } else {
    toast('Migration th\u00e8mes \u2192 ic\u00f4nes effectu\u00e9e \u2713');
  }
}

function importJSON(input) {
  var file = input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = JSON.parse(e.target.result);
      events = data.map(function(ev) {
        if (!ev.zones) ev.zones = ev.zone ? [ev.zone] : [];
        if (!ev.type)  ev.type  = 1;
        ev.zones = ev.zones.map(function(z) { return ALIASES[z] || z; });
        
        /* --- Migration des thèmes au chargement --- */
        // Si le tableau "themes" n'existe pas encore, on le crée
        if (!ev.themes) {
          ev.themes = [];
        }
        
        // Si l'ancien attribut singulier "theme" est présent, on le migre
        if (ev.theme) {
          var oldThemes = Array.isArray(ev.theme) ? ev.theme.slice() : ev.theme.split(',').map(function(s){ return s.trim(); });
          oldThemes.forEach(function(t) {
            if (ev.themes.indexOf(t) === -1) ev.themes.push(t);
          });
          delete ev.theme; // On nettoie l'ancienne clé
        }
        
        // Migration de l'ancien attribut atlas
        if (ev.atlas && ev.themes.indexOf('atlas') === -1) ev.themes.push('atlas');
        delete ev.atlas;
        
        var idx = ev.zones ? ev.zones.indexOf('Atlas') : -1;
        if (idx !== -1) {
          if (ev.themes.indexOf('atlas') === -1) ev.themes.push('atlas');
          ev.zones.splice(idx, 1);
          if (ev.zones.length === 0) ev.zones.push('Monde');
        }
        
        return ev;
      });
      hasImported = true;
      var warn = document.getElementById('import-warning');
      if (warn) warn.style.display = 'none';
      migrateThemeZones();
      resetForm();
      updateJSON();
      toast(events.length + ' événements importés \u2713');
    } catch(err) {
      toast('Erreur : fichier JSON invalide');
    }
  };
  reader.readAsText(file);
  input.value = '';
}

function toast(msg) {
  var el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(function() { el.classList.remove('show'); }, 2800);
}

var _synthData = {};
var PARCOURS_PREFIX = '@parcours|';

function synthParcoursList() {
  var set = {};
  (events || []).forEach(function(e) {
    if (!e.serie) return;
    e.serie.split('|').forEach(function(s) {
      s = s.trim();
      if (s) set[s] = true;
    });
  });
  Object.keys(_synthData).forEach(function(k) {
    var p = synthParseKey(k);
    if (p.scope === 'parcours') set[p.name] = true;
  });
  return Object.keys(set).sort(function(a, b) { return a.localeCompare(b, 'fr'); });
}

function synthParseKey(key) {
  if (key.indexOf(PARCOURS_PREFIX) === 0) {
    var rest = key.slice(PARCOURS_PREFIX.length);
    var i = rest.lastIndexOf('|');
    if (i !== -1 && /^\d{3,4}$/.test(rest.slice(i + 1)))
      return { scope: 'parcours', name: rest.slice(0, i), dec: parseInt(rest.slice(i + 1), 10) };
    return { scope: 'parcours', name: rest, dec: null };
  }
  var j = key.lastIndexOf('|');
  if (j === -1) return { scope: 'zone', name: key, dec: null };
  return { scope: 'zone', name: key.slice(0, j), dec: parseInt(key.slice(j + 1), 10) };
}

function synthSelection() {
  var v = document.getElementById('synth-zone').value || '';
  var d = document.getElementById('synth-dec').value;
  var isP = v.indexOf(PARCOURS_PREFIX) === 0;
  var name = isP ? v.slice(PARCOURS_PREFIX.length) : v;
  var dec  = (d === 'all') ? null : parseInt(d, 10);
  var key  = isP
    ? (dec === null ? PARCOURS_PREFIX + name : PARCOURS_PREFIX + name + '|' + dec)
    : (name + '|' + dec);
  return { scope: isP ? 'parcours' : 'zone', name: name, dec: dec, key: key };
}

function synthInitControls(opts) {
  opts = opts || {};
  var zSel = document.getElementById('synth-zone');
  var dSel = document.getElementById('synth-dec');
  if (!zSel || !dSel) return;
  var curZ = zSel.value, curD = dSel.value;
  var parsed = Object.keys(_synthData).map(synthParseKey);

  zSel.innerHTML = '';
  var gZ = document.createElement('optgroup');
  gZ.label = 'Zones';
  ZONES.forEach(function(z) {
    var n = parsed.filter(function(p){ return p.scope === 'zone' && p.name === z; }).length;
    var o = document.createElement('option');
    o.value = z;
    o.textContent = (n > 0 ? '\u2713 ' : '\u2007 ') + z + (n > 0 ? ' (' + n + ')' : '');
    gZ.appendChild(o);
  });
  zSel.appendChild(gZ);

  var parcours = synthParcoursList();
  if (parcours.length) {
    var gP = document.createElement('optgroup');
    gP.label = 'Parcours';
    parcours.forEach(function(nom) {
      var n = parsed.filter(function(p){ return p.scope === 'parcours' && p.name === nom; }).length;
      var o = document.createElement('option');
      o.value = PARCOURS_PREFIX + nom;
      o.textContent = (n > 0 ? '\u2713 ' : '\u2007 ') + nom + (n > 0 ? ' (' + n + ')' : '');
      gP.appendChild(o);
    });
    zSel.appendChild(gP);
  }

  dSel.innerHTML = '';
  var oAll = document.createElement('option');
  oAll.value = 'all';
  oAll.textContent = '\u2014 Vue d\u2019ensemble \u2014';
  dSel.appendChild(oAll);
  for (var d = 1190; d <= 1500; d += 10) {
    var nd = parsed.filter(function(p){ return p.dec === d; }).length;
    var o = document.createElement('option');
    o.value = d;
    o.textContent = (nd > 0 ? '\u2713 ' : '\u2007 ') + d + '-' + (d + 9) + (nd > 0 ? ' (' + nd + ')' : '');
    dSel.appendChild(o);
  }

  if (curZ) zSel.value = curZ;
  if (!zSel.value) zSel.value = ZONES[0];
  if (curD) dSel.value = curD;
  if (!dSel.value) dSel.value = 1340;

  if (opts.keepForm) { synthSyncDecOption(); synthUpdateKeyPreview(); }
  else synthUpdateStatus();
}

function synthSyncDecOption() {
  var dSel = document.getElementById('synth-dec');
  var oAll = dSel ? dSel.querySelector('option[value="all"]') : null;
  if (!oAll) return;
  var isZone = synthSelection().scope === 'zone';
  oAll.disabled = isZone;
  if (isZone && dSel.value === 'all') dSel.value = 1340;
}

function synthUpdateKeyPreview() {
  var el = document.getElementById('synth-key');
  if (el) el.textContent = synthSelection().key;
}

function synthUpdateStatus() {
  var st = document.getElementById('synth-status');
  if (!st || !document.getElementById('synth-zone')) return;
  synthSyncDecOption();
  var sel = synthSelection();
  synthUpdateKeyPreview();
  var titreEl = document.getElementById('synth-titre');
  var texteEl = document.getElementById('synth-texte');
  if (_synthData[sel.key]) {
    var s = _synthData[sel.key];
    if (titreEl) titreEl.value = s.titre || '';
    if (texteEl) texteEl.value = s.texte || '';
    st.innerHTML = '\u2713 Synthèse existante chargée — modifiez puis « Ajouter / Mettre à jour ».';
    st.style.color = '#2e7d32';
  } else {
    if (titreEl) titreEl.value = '';
    if (texteEl) texteEl.value = '';
    st.innerHTML = '\u25cb Aucune synthèse pour cette sélection — générez un brouillon puis ajoutez.';
    st.style.color = '#999';
  }
}

function synthEvents(sel) {
  return (events || []).filter(function(e) {
    if (e.regne) return false;
    if (sel.dec !== null && !(e.date >= sel.dec && e.date < sel.dec + 10)) return false;
    if (sel.scope === 'parcours') {
      if (!e.serie) return false;
      return e.serie.split('|').some(function(s){ return s.trim() === sel.name; });
    }
    return (e.zones || []).indexOf(sel.name) !== -1;
  }).sort(function(a, b) {
    var da = a.date + (a.mois ? (a.mois - 1) / 12 : 0);
    var db = b.date + (b.mois ? (b.mois - 1) / 12 : 0);
    return da - db;
  });
}

function synthGenerate() {
  var sel  = synthSelection();
  var evts = synthEvents(sel);
  var periode = sel.dec === null ? 'vue d\u2019ensemble' : (sel.dec + '-' + (sel.dec + 9));
  if (evts.length === 0) {
    toast('\u26a0 Aucun événement pour ' + sel.name + ' (' + periode + ')');
    return;
  }
  var isP = sel.scope === 'parcours';
  var majeurs = evts.filter(function(e) { return (Number(e.type) || 3) <= 3; });
  var n = evts.length, m = majeurs.length;
  var noyau = isP ? n + ' étape' + (n > 1 ? 's' : '') : n + ' événement' + (n > 1 ? 's' : '') + ' notable' + (n > 1 ? 's' : '');
  var suite = m ? ', dont ' + m + ' majeur' + (isP ? 'e' : '') + (m > 1 ? 's' : '') : '';
  var sujet = (isP ? 'le parcours « ' : 'la zone « ') + sel.name + ' »';
  var intro = sel.dec === null
    ? 'De ' + evts[0].date + ' à ' + evts[n - 1].date + ', ' + sujet + ' compte ' + noyau + suite + '.'
    : 'Au cours de la décennie ' + sel.dec + '-' + (sel.dec + 9) + ', ' + sujet + ' compte ' + noyau + suite + '.';
  var lignes = evts.map(function(e) {
    var desc = (e.description || '').replace(/\s+/g, ' ').trim();
    if (desc.length > 160) desc = desc.slice(0, 157) + '\u2026';
    return '[[' + e.id + ']] ' + e.date + ' \u2014 ' + e.titre + (desc ? ' : ' + desc : '');
  });
  document.getElementById('synth-titre').value = sel.name + ' \u00b7 ' + periode;
  document.getElementById('synth-texte').value = intro + '\n\n' + lignes.join('\n');
  toast('Brouillon généré (' + n + ' fiches) — corrigez puis Ajouter');
}

function synthSave() {
  var sel = synthSelection();
  var titre = document.getElementById('synth-titre').value.trim();
  var texte = document.getElementById('synth-texte').value.trim();
  if (!texte) { toast('\u26a0 Texte vide'); return; }
  _synthData[sel.key] = { titre: titre, texte: texte, auto: false };
  markSynthDirty();
  synthRenderList();
  synthInitControls({ keepForm: true });
  toast('\u2713 Synthèse « ' + sel.key + ' » enregistrée');
}

function dashRefresh() {
  var el = document.getElementById('dash-content');
  if (!el) return;
  el.innerHTML = '<p style="color:#999;">Génération du tableau de bord\u2026</p>';
  if (!events || events.length === 0) {
    el.innerHTML = '<div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:1rem;color:#856404;">' +
      '<strong>\u26A0 Aucun événement chargé.</strong></div>';
    return;
  }
  el.innerHTML = '<p style="color:#666;">Calcul en cours\u2026</p>';

  var nonRegne = events.filter(function(e){ return !e.regne; });
  var total = events.length;

  var sansDesc = nonRegne.filter(function(e){ return !(e.description||'').trim(); });
  var sansImg  = nonRegne.filter(function(e){ return !(e.image||'').trim(); });
  var sansSrc  = nonRegne.filter(function(e){ return !(e.sources||'').trim(); });

  var pbDate = [], pbMois = [], pbZone = [], pbType = [], pbImage = [];
  events.forEach(function(e){
    if (e.date_fin && e.date_fin < e.date) pbDate.push(e);
    if (e.mois && (e.mois < 1 || e.mois > 12)) pbMois.push(e);
    if (e.date && (e.date < 1000 || e.date > 1600)) pbDate.push(e);
    if (!e.zones || e.zones.length === 0) pbZone.push(e);
    (e.zones||[]).forEach(function(z){ if (ZONES.indexOf(z) === -1 && pbZone.indexOf(e) === -1) pbZone.push(e); });
    if (e.type && (e.type < 1 || e.type > 5)) pbType.push(e);
    var _im = (e.image || '').trim();
    if (_im && _im.indexOf('/') === -1 && !/^https?:/i.test(_im)) pbImage.push(e);
  });

  var byType = {1:0,2:0,3:0,4:0,5:0};
  events.forEach(function(e){ var t = e.type||1; if (byType[t]!==undefined) byType[t]++; });

  var zoneStat = {};
  nonRegne.forEach(function(e){
    (e.zones||[]).forEach(function(z){
      if (!zoneStat[z]) zoneStat[z] = { total:0, img:0, desc:0 };
      zoneStat[z].total++;
      if ((e.image||'').trim()) zoneStat[z].img++;
      if ((e.description||'').trim()) zoneStat[z].desc++;
    });
  });
  var zoneRows = Object.keys(zoneStat).sort(function(a,b){ return zoneStat[b].total - zoneStat[a].total; });

  var nbSynth = Object.keys(_synthData).length;

  function bar(n, tot, color) {
    var pct = tot ? Math.round(n / tot * 100) : 0;
    return '<div style="background:#eee;border-radius:4px;height:14px;width:100px;display:inline-block;vertical-align:middle;overflow:hidden;">' +
           '<div style="background:' + color + ';height:100%;width
