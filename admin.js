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
           '<div style="background:' + color + ';height:100%;width:' + pct + '%;"></div></div> ' + pct + '%';
  }

  var html = '<div style="display:flex;gap:0.8rem;flex-wrap:wrap;margin-bottom:1rem;">';
  function card(label, value, sub) {
    return '<div style="flex:1;min-width:120px;background:#f7f3ea;border:1px solid #ddd;border-radius:8px;padding:0.7rem;text-align:center;">' +
           '<div style="font-size:1.5rem;font-weight:700;color:#8B5E34;">' + value + '</div>' +
           '<div style="font-size:0.78rem;color:#666;">' + label + '</div>' +
           (sub ? '<div style="font-size:0.7rem;color:#999;">' + sub + '</div>' : '') + '</div>';
  }
  html += card('Événements', total, nonRegne.length + ' hors règnes');
  html += card('Avec image', (nonRegne.length - sansImg.length), bar(nonRegne.length - sansImg.length, nonRegne.length, '#2e7d32'));
  html += card('Avec description', (nonRegne.length - sansDesc.length), bar(nonRegne.length - sansDesc.length, nonRegne.length, '#1565c0'));
  html += card('Synthèses', nbSynth, 'rédigées');
  html += '</div>';

  html += '<h4 style="margin:0.8rem 0 0.4rem;">Répartition par niveau</h4>';
  var typeLabels = {1:'Règne',2:'Siècle',3:'Important',4:'Détaillé',5:'Complet'};
  html += '<table style="width:100%;border-collapse:collapse;font-size:0.85rem;">';
  for (var t = 1; t <= 5; t++) {
    html += '<tr><td style="padding:2px 8px;">Niveau ' + t + ' — ' + typeLabels[t] + '</td>' +
            '<td style="padding:2px 8px;text-align:right;font-weight:600;">' + byType[t] + '</td>' +
            '<td style="padding:2px 8px;">' + bar(byType[t], total, '#8B5E34') + '</td></tr>';
  }
  html += '</table>';

  html += '<h4 style="margin:1rem 0 0.4rem;">\u26A0 Points à vérifier</h4>';
  function probLine(label, arr) {
    if (arr.length === 0) return '<div style="color:#2e7d32;padding:2px 0;">\u2713 ' + label + ' : aucun</div>';
    var ids = arr.slice(0, 12).map(function(e){
      return '<a href="#" onclick="loadEvent(' + e.id + ');return false;" style="color:#c00;">#' + e.id + '</a>';
    }).join(', ');
    return '<div style="padding:2px 0;"><strong style="color:#c00;">' + arr.length + '</strong> ' + label + ' : ' +
           ids + (arr.length > 12 ? '\u2026' : '') + '</div>';
  }
  html += probLine('sans description', sansDesc);
  html += probLine('dates incohérentes', pbDate);
  html += probLine('mois invalides', pbMois);
  html += probLine('zone manquante/inconnue', pbZone);
  html += probLine('niveau (type) invalide', pbType);
  html += probLine('champ image invalide (ni chemin ni URL)', pbImage);

  var sansTheme = nonRegne.filter(function(e){ return !detectTheme(e); });
  var avecTheme = nonRegne.length - sansTheme.length;
  html += '<h4 style="margin:1rem 0 0.4rem;">\uD83C\uDFF7 Classification thématique</h4>';
  html += '<p style="font-size:0.85rem;margin:0 0 0.5rem;">' +
          '<strong>' + avecTheme + '</strong> / ' + nonRegne.length + ' événements classés ' +
          bar(avecTheme, nonRegne.length, '#6a4ea8') + '</p>';
  if (sansTheme.length > 0) {
    var ids = sansTheme.slice(0, 40).map(function(e){
      return '<a href="#" onclick="loadEvent(' + e.id + ');return false;" style="color:#8B5E34;">#' + e.id + '</a>';
    }).join(', ');
    html += '<div style="font-size:0.82rem;padding:2px 0;"><strong>' + sansTheme.length +
            '</strong> sans thème (à classer) : ' + ids + (sansTheme.length > 40 ? ' \u2026 (et ' + (sansTheme.length - 40) + ' autres)' : '') + '</div>';
  } else {
    html += '<div style="color:#2e7d32;font-size:0.85rem;">\u2713 Tous les événements sont classés.</div>';
  }

  html += '<h4 style="margin:1rem 0 0.4rem;">Complétude par zone</h4>';
  html += '<table style="width:100%;border-collapse:collapse;font-size:0.82rem;">';
  html += '<tr style="border-bottom:1px solid #ccc;"><th style="text-align:left;padding:3px 8px;">Zone</th>' +
          '<th style="padding:3px 8px;">Fiches</th><th style="padding:3px 8px;">Images</th><th style="padding:3px 8px;">Descriptions</th></tr>';
  zoneRows.forEach(function(z){
    var s = zoneStat[z];
    html += '<tr style="border-bottom:1px solid #eee;"><td style="padding:3px 8px;">' + z + '</td>' +
            '<td style="padding:3px 8px;text-align:center;">' + s.total + '</td>' +
            '<td style="padding:3px 8px;">' + bar(s.img, s.total, '#2e7d32') + '</td>' +
            '<td style="padding:3px 8px;">' + bar(s.desc, s.total, '#1565c0') + '</td></tr>';
  });
  html += '</table>';

  el.innerHTML = html;
}

function loadEvent(id) {
  var e = events.filter(function(x){ return x.id === id; })[0];
  if (e) {
    fillForm(e);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast('Événement #' + id + ' chargé');
  }
}

function synthDelete() {
  var key = synthSelection().key;
  if (_synthData[key]) {
    delete _synthData[key];
    markSynthDirty();
    synthRenderList();
    synthInitControls();
    toast('Synthèse « ' + key + ' » supprimée');
  } else {
    toast('Aucune synthèse pour cette sélection');
  }
}

function synthLoadIntoForm(key) {
  var s = _synthData[key];
  if (!s) return;
  var p = synthParseKey(key);
  var zSel = document.getElementById('synth-zone');
  var dSel = document.getElementById('synth-dec');
  zSel.value = (p.scope === 'parcours') ? (PARCOURS_PREFIX + p.name) : p.name;
  synthSyncDecOption();
  dSel.value = (p.dec === null) ? 'all' : String(p.dec);
  synthUpdateKeyPreview();
  document.getElementById('synth-titre').value = s.titre || '';
  document.getElementById('synth-texte').value = s.texte || '';
  var st = document.getElementById('synth-status');
  if (st) {
    st.innerHTML = '\u2713 Synthèse existante chargée — modifiez puis « Ajouter / Mettre à jour ».';
    st.style.color = '#2e7d32';
  }
}

function synthRenderList() {
  var el = document.getElementById('synth-list');
  var keys = Object.keys(_synthData).sort(function(a, b) {
    var pa = synthParseKey(a), pb = synthParseKey(b);
    if (pa.scope !== pb.scope) return pa.scope === 'zone' ? -1 : 1;
    if (pa.name !== pb.name) return pa.name.localeCompare(pb.name, 'fr');
    return (pa.dec === null ? -1 : pa.dec) - (pb.dec === null ? -1 : pb.dec);
  });
  document.getElementById('synth-count').textContent = keys.length + ' synthèse(s)';
  if (keys.length === 0) { el.innerHTML = '<em style="color:#999;">Aucune synthèse enregistrée.</em>'; return; }
  el.innerHTML = '';
  keys.forEach(function(k) {
    var s = _synthData[k];
    var p = synthParseKey(k);
    var row = document.createElement('div');
    row.style.cssText = 'padding:0.3rem 0.5rem;border-bottom:1px solid #eee;display:flex;gap:0.5rem;align-items:center;';
    var badge = document.createElement('span');
    var isP = p.scope === 'parcours';
    badge.textContent = isP ? 'PARCOURS' : 'ZONE';
    badge.style.cssText = 'font-size:0.65rem;font-weight:700;letter-spacing:0.04em;padding:1px 5px;border-radius:3px;flex:0 0 auto;' +
      (isP ? 'background:#e8dcc0;color:#6b4c1e;' : 'background:#dfe7ef;color:#2b4a6b;');
    row.appendChild(badge);
    var a = document.createElement('a');
    a.href = '#';
    a.style.fontWeight = '600';
    a.textContent = p.name + ' \u00b7 ' + (p.dec === null ? 'vue d\u2019ensemble' : p.dec + '-' + (p.dec + 9));
    a.addEventListener('click', function(ev) {
      ev.preventDefault();
      synthLoadIntoForm(k);
      window.scrollTo({ top: a.getBoundingClientRect().top + window.scrollY - 400, behavior: 'smooth' });
    });
    row.appendChild(a);
    var t = document.createElement('span');
    t.style.cssText = 'color:#999;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
    t.textContent = s.titre || '';
    row.appendChild(t);
    el.appendChild(row);
  });
}

function synthDownload() {
  if (Object.keys(_synthData).length === 0) { toast('\u26a0 Aucune synthèse à exporter'); return; }
  var blob = new Blob([JSON.stringify(_synthData, null, 2)], { type: 'application/json' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'syntheses.json';
  a.click();
  clearSynthDirty();
  toast('\u2713 syntheses.json téléchargé');
}

function synthImport(input) {
  var file = input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      _synthData = JSON.parse(e.target.result) || {};
      synthRenderList();
      synthInitControls();
      toast('\u2713 ' + Object.keys(_synthData).length + ' synthèse(s) importée(s)');
    } catch (err) { toast('\u26a0 Erreur JSON : ' + err.message); }
  };
  reader.readAsText(file);
  input.value = '';
}

function initThemeButtons() {
  var box = document.getElementById('theme-buttons');
  if (!box) return;
  box.innerHTML = '';
  var keys = THEME_ORDER.slice();
  for (var key in THEME_DEFS) { if (keys.indexOf(key) === -1) keys.push(key); }
  keys.forEach(function(t) {
    var d = THEME_DEFS[t]; if (!d) return;
    var b = document.createElement('span');
    b.className = 'theme-btn';
    b.dataset.theme = t;
    b.innerHTML = '<span class="tb-ic">' + d.icon + '</span>' + d.label;
    b.addEventListener('click', function() {
      toggleTheme(t);
    });
    box.appendChild(b);
  });
}

function toggleTheme(val) {
  var input = document.getElementById('f-theme');
  var currentThemes = input.value ? input.value.split(',').map(function(s){return s.trim();}) : [];
  var idx = currentThemes.indexOf(val);
  if (idx !== -1) currentThemes.splice(idx, 1);
  else currentThemes.push(val);
  setTheme(currentThemes);
}

function setTheme(val) {
  var themesArray = [];
  if (Array.isArray(val)) themesArray = val;
  else if (typeof val === 'string' && val.trim() !== '') themesArray = val.split(',').map(function(s){return s.trim();});
  
  document.getElementById('f-theme').value = themesArray.join(',');
  document.querySelectorAll('#theme-buttons .theme-btn').forEach(function(b) {
    b.classList.toggle('selected', themesArray.indexOf(b.dataset.theme) !== -1);
  });
}

/* ============ Mini-carte de pointage (lat/lng) ============ */
var GEO_LAND = "M669.0,944.7L667.4,947.5L665.8,950.0L654.1,949.2L641.7,949.6L634.8,947.7L634.8,947.5L631.7,945.9L644.2,946.1L656.2,946.6L660.3,944.3L663.3,942.4L669.0,944.7Z M115.5,941.7L104.8,942.4L97.6,940.5L94.3,938.5L94.1,938.2L90.5,936.6L90.5,936.6L93.9,934.6L104.2,935.4L109.7,937.2L114.0,939.1L115.5,941.7Z M749.1,933.6L756.0,936.0L758.4,939.4L759.0,941.8L759.3,944.6L750.7,946.3L741.6,947.7L731.2,949.1L719.5,950.1L706.4,949.8L699.1,948.0L700.1,945.7L711.9,944.2L716.7,942.3L720.2,939.9L722.7,937.8L726.1,935.9L729.7,933.6L729.7,933.6L732.5,933.6L740.8,932.4L749.1,933.6Z M326.6,908.3L333.8,909.2L340.4,908.2L337.3,910.2L332.0,911.6L324.3,911.2L318.8,909.2L318.8,909.2L320.0,907.4L326.6,908.3Z M302.4,908.2L310.9,910.4L307.7,910.2L300.5,909.6L292.9,908.1L292.9,908.1L296.9,906.9L302.4,908.2Z M450.1,899.6L456.2,900.4L462.3,899.7L465.6,902.9L461.2,902.5L454.5,902.7L447.6,902.5L440.1,902.8L434.4,901.7L431.5,899.4L431.5,899.4L435.0,898.4L442.1,899.2L450.1,899.6Z M619.7,894.2L620.4,896.7L619.4,898.9L617.9,900.9L611.3,901.7L605.1,902.8L597.8,902.7L600.6,900.5L594.0,901.3L587.8,902.0L583.6,900.4L583.3,898.1L589.4,895.9L589.4,895.9L593.2,895.3L599.6,895.5L601.2,892.7L601.5,890.6L601.4,886.1L604.6,883.5L609.7,882.7L612.6,884.7L613.9,886.8L616.3,889.3L618.2,891.7L619.7,894.2Z M674.4,856.4L672.0,857.6L667.8,856.7L663.3,857.3L659.5,858.6L655.4,860.0L652.7,861.6L652.0,863.8L652.3,865.9L654.9,867.7L651.1,869.0L645.9,869.5L642.8,871.3L639.5,873.1L636.1,875.5L635.2,877.5L637.2,879.8L640.1,881.5L644.7,882.9L648.9,884.6L651.2,886.8L652.4,888.8L654.0,891.0L656.6,892.9L658.3,894.9L659.0,900.1L660.7,902.1L661.1,904.3L662.8,906.5L662.1,909.4L659.0,911.7L655.8,913.6L648.4,914.3L645.9,916.3L642.5,918.1L634.1,920.2L626.7,921.1L619.7,922.3L612.2,923.5L607.8,925.7L598.9,926.0L589.1,925.7L580.2,926.2L570.9,926.2L572.6,928.4L581.1,929.3L587.3,930.9L590.8,932.8L584.6,934.6L575.0,934.0L567.1,935.4L566.8,937.7L566.5,939.9L573.1,941.7L574.3,943.8L581.3,945.9L593.1,946.8L603.1,948.3L611.0,950.0L621.2,951.8L635.0,952.6L648.6,954.2L658.0,955.8L668.4,957.6L673.8,960.3L676.5,962.3L683.3,960.4L692.4,958.7L702.1,957.0L713.6,955.6L723.5,954.1L737.4,953.9L751.0,954.7L762.2,956.0L765.8,953.6L773.5,952.0L787.5,951.9L798.5,950.7L809.0,949.5L820.5,948.7L832.8,947.7L841.4,946.3L837.5,944.4L835.1,942.4L835.1,940.3L824.3,940.6L812.9,941.4L802.0,941.4L800.5,939.4L801.2,935.2L803.7,934.0L811.7,932.7L821.0,931.4L827.8,929.8L834.5,928.1L839.5,926.0L847.2,925.0L854.7,924.2L858.5,923.8L867.1,923.6L875.2,922.8L882.1,921.7L888.8,920.4L894.9,919.1L902.7,917.4L907.5,915.5L912.8,913.9L914.4,911.7L908.5,910.4L910.5,908.1L914.2,906.4L920.0,905.3L926.0,904.0L931.7,902.2L936.1,900.1L938.8,897.4L942.8,895.9L949.4,896.2L952.2,898.1L958.8,898.3L959.0,896.2L961.8,894.1L967.8,894.6L969.2,896.7L975.9,897.0L983.1,896.0L990.0,895.4L996.3,895.7L998.7,898.0L1004.8,896.1L1010.5,895.2L1016.8,894.4L1023.0,893.6L1028.7,892.3L1034.9,891.5L1039.6,890.3L1043.0,888.3L1047.2,889.7L1052.9,889.0L1056.9,891.6L1060.1,893.5L1066.4,892.4L1068.9,890.3L1074.6,888.7L1081.9,889.1L1084.0,891.1L1088.6,889.1L1094.6,888.4L1101.1,888.2L1107.0,888.3L1113.2,889.0L1119.2,889.3L1121.8,891.1L1125.4,892.8L1131.5,891.8L1138.0,891.6L1144.3,891.6L1150.5,891.5L1156.1,890.7L1161.9,890.0L1166.8,888.5L1172.1,887.5L1177.7,887.0L1182.0,885.5L1185.0,882.4L1188.2,880.6L1193.9,881.4L1196.1,883.4L1200.9,884.7L1206.7,884.3L1210.6,886.2L1214.7,887.6L1220.4,886.3L1222.3,883.9L1227.3,883.0L1233.1,881.1L1238.5,880.4L1245.1,879.3L1249.4,878.1L1254.0,876.8L1258.4,875.6L1263.6,876.2L1268.6,874.3L1272.2,872.7L1277.4,872.8L1282.0,871.5L1283.1,869.6L1287.7,868.1L1292.3,867.0L1297.9,866.1L1303.0,865.7L1307.9,866.0L1313.1,866.5L1317.5,868.1L1318.1,870.4L1323.0,872.3L1326.4,873.8L1333.0,874.5L1336.7,876.0L1341.3,877.5L1346.6,877.8L1351.1,876.8L1355.8,874.5L1361.1,875.7L1366.5,876.3L1371.7,877.0L1377.2,877.4L1382.7,877.4L1387.3,883.2L1387.1,884.6L1386.4,887.1L1381.1,888.5L1376.7,890.6L1377.5,892.8L1383.7,892.7L1382.9,894.8L1380.1,896.9L1377.5,899.2L1381.7,900.9L1388.2,901.5L1394.6,900.5L1397.6,898.3L1399.5,896.2L1402.5,894.5L1406.0,892.9L1407.4,890.9L1410.4,888.2L1413.8,887.6L1420.2,887.4L1425.7,886.8L1431.4,885.9L1434.1,883.7L1435.7,881.7L1439.5,879.6L1445.0,878.2L1449.6,877.1L1452.7,875.2L1455.8,874.3L1459.9,873.4L1465.4,873.9L1470.4,873.4L1475.9,872.7L1482.0,873.1L1486.0,871.5L1488.8,867.8L1490.9,869.4L1493.5,872.0L1498.2,873.1L1503.5,873.5L1508.8,872.8L1514.5,873.3L1519.7,873.4L1523.2,872.8L1527.9,873.2L1532.1,874.4L1537.1,873.6L1543.1,873.6L1548.2,872.8L1554.0,873.6L1557.7,871.8L1560.5,869.9L1564.3,868.4L1571.3,864.2L1574.9,865.0L1579.1,866.5L1582.8,868.5L1589.9,871.9L1595.3,872.0L1600.5,872.0L1606.4,871.3L1612.4,870.6L1617.0,869.0L1620.8,867.4L1627.0,867.2L1631.1,866.0L1635.5,867.1L1638.3,868.8L1642.2,870.6L1648.3,870.3L1652.1,871.8L1658.8,873.2L1665.7,873.7L1671.5,873.3L1675.9,871.5L1679.6,869.8L1684.6,869.4L1689.6,870.1L1695.3,870.7L1700.6,869.8L1705.6,869.8L1710.5,870.3L1715.6,870.9L1720.6,869.9L1726.6,869.0L1732.2,868.8L1738.5,868.8L1743.6,868.3L1748.7,867.8L1750.2,865.1L1750.4,862.8L1753.9,864.3L1754.9,866.9L1756.7,869.1L1759.0,871.0L1763.7,872.0L1770.0,871.6L1777.3,871.5L1782.3,871.2L1789.6,871.2L1794.8,871.1L1802.1,871.3L1808.3,871.8L1812.2,873.5L1811.1,875.6L1814.7,877.2L1820.7,878.5L1826.9,879.9L1834.1,880.9L1841.6,881.8L1847.2,882.6L1853.5,882.7L1857.1,880.9L1862.0,882.4L1866.3,884.2L1871.2,885.5L1877.9,886.0L1884.3,886.7L1887.1,888.8L1893.4,890.1L1897.6,892.1L1903.8,893.0L1910.2,892.9L1916.2,893.2L1922.9,893.1L1929.5,893.5L1935.7,894.3L1941.5,895.6L1947.2,896.7L1951.1,898.3L1950.5,900.5L1947.6,902.5L1945.1,905.0L1943.1,906.9L1940.5,909.2L1933.2,910.1L1929.9,912.0L1922.7,913.2L1920.2,915.4L1916.4,917.5L1912.4,919.2L1910.1,921.5L1908.7,923.6L1908.2,926.1L1908.3,928.1L1911.4,930.3L1912.6,932.4L1915.2,934.3L1925.6,935.1L1927.8,937.5L1917.7,938.4L1909.3,939.6L1898.7,939.8L1894.0,942.9L1893.0,945.6L1890.6,947.6L1887.7,949.7L1895.1,951.5L1897.9,953.8L1902.7,955.9L1909.5,957.8L1917.2,959.5L1925.6,961.2L1938.3,963.0L1941.1,965.7L1957.1,966.9L1958.2,967.3L1962.4,969.0L1977.7,967.5L1990.4,969.3L2000.0,970.6L2000.0,1000.0L0.0,1000.0L0.0,970.6L0.3,970.7L5.2,967.4L15.2,969.2L15.9,969.0L17.4,968.5L19.3,968.0L20.9,967.5L21.8,967.2L22.6,967.2L23.2,967.3L31.2,969.6L38.2,967.3L39.5,967.0L55.8,966.0L61.1,967.3L63.7,968.0L72.1,969.8L87.9,971.3L100.4,973.0L121.8,974.3L137.8,972.8L161.4,973.9L174.8,975.6L189.5,974.0L205.0,972.4L206.2,969.8L184.3,969.6L166.3,968.3L161.7,966.1L146.7,964.9L147.7,962.4L149.8,960.1L151.9,958.1L150.8,955.8L141.5,954.3L137.3,952.3L128.7,950.6L142.2,950.9L155.0,950.0L163.1,951.9L173.0,950.2L182.1,948.2L186.6,946.3L184.6,944.0L177.4,942.5L169.3,940.9L157.8,940.6L147.8,939.8L137.1,939.2L133.5,937.2L126.3,935.4L121.9,933.5L120.2,927.2L122.9,927.7L127.9,929.4L137.1,928.9L145.9,928.1L150.4,930.5L159.3,930.0L166.7,928.8L173.6,927.3L179.9,925.4L188.3,924.9L188.1,922.8L186.1,920.7L187.8,918.8L194.9,917.8L198.2,919.7L206.7,918.6L213.1,917.1L221.1,917.0L228.6,916.5L236.1,915.2L242.1,914.0L248.8,912.8L253.2,913.1L257.0,913.6L265.2,912.8L272.6,913.8L280.3,913.7L287.5,912.9L295.1,913.4L303.3,914.0L311.0,913.8L319.1,913.9L327.4,914.0L335.0,913.8L340.6,912.1L347.4,911.3L354.4,912.5L361.0,911.5L367.0,909.5L370.6,911.3L372.5,913.2L376.1,915.1L381.9,913.4L388.5,915.5L396.0,916.2L402.4,917.7L410.3,917.4L417.4,916.4L425.7,916.6L433.2,917.4L440.9,918.3L443.8,915.9L440.2,914.1L437.5,912.1L430.3,911.7L427.1,909.6L426.0,907.6L424.0,903.4L428.2,904.2L435.5,904.5L442.7,904.2L449.2,905.1L454.9,906.7L457.3,908.7L464.8,909.0L472.0,908.2L479.6,907.1L486.4,906.5L492.1,907.8L499.5,907.3L504.3,903.1L508.8,905.6L515.2,906.6L522.1,906.0L526.7,908.2L534.0,908.4L540.7,909.1L547.4,910.3L551.7,908.2L553.9,906.3L559.5,908.4L567.1,907.9L572.7,909.1L576.5,910.9L583.9,910.4L589.7,909.2L595.4,907.8L602.1,907.0L609.9,906.4L617.0,905.6L622.5,904.4L625.7,902.7L627.0,900.3L626.4,898.0L624.6,895.8L622.7,893.6L620.9,891.5L619.5,889.5L619.2,887.3L619.7,885.1L622.4,883.1L624.5,880.8L625.4,878.6L624.3,876.2L623.7,874.0L626.4,871.5L629.4,869.9L633.0,867.8L636.8,866.1L641.3,864.5L643.5,862.1L646.5,860.5L650.0,859.1L655.3,858.8L658.8,857.1L662.7,856.0L667.3,855.3L671.3,853.9L674.5,852.2L678.8,851.5L682.1,852.9L680.0,854.8L674.4,856.4Z M623.6,799.2L630.8,802.5L638.6,803.9L636.1,806.7L630.8,806.9L628.0,805.0L626.2,807.2L621.4,809.0L615.4,808.3L611.3,806.7L605.5,805.9L598.5,802.8L592.9,799.8L585.2,793.5L589.8,794.7L597.6,798.4L605.0,800.4L607.8,797.9L609.6,794.1L614.7,791.8L618.7,792.4L618.7,792.4L620.8,795.0L623.6,799.2Z M674.7,783.9L679.2,786.4L677.5,788.3L670.0,790.0L667.5,788.1L662.8,790.6L660.0,788.1L666.7,784.7L671.4,786.1L674.7,783.9Z M1390.4,776.2L1381.9,776.5L1381.8,773.6L1382.6,771.3L1383.0,770.1L1386.6,771.9L1391.8,772.6L1392.0,773.6L1390.4,776.2Z M1807.8,726.6L1813.1,728.5L1816.2,727.8L1820.5,726.7L1823.8,727.1L1824.2,733.7L1822.3,735.6L1821.7,740.1L1819.8,738.5L1815.9,742.4L1814.8,742.1L1811.4,741.9L1808.0,737.2L1807.2,733.5L1804.0,728.7L1804.1,726.1L1807.8,726.6Z M1961.2,727.3L1962.5,729.6L1966.4,727.4L1968.0,729.7L1968.0,732.1L1966.0,734.6L1962.3,738.7L1959.5,741.0L1961.6,743.6L1957.3,743.7L1952.5,745.8L1951.0,749.4L1947.9,755.0L1943.5,757.5L1940.7,759.1L1935.6,759.0L1932.0,757.2L1926.0,756.8L1925.1,754.7L1928.0,750.6L1935.0,745.1L1938.6,744.1L1942.6,742.0L1947.4,739.1L1950.7,736.2L1953.2,732.0L1955.3,730.6L1956.1,727.5L1960.0,725.0L1961.2,727.3Z M1970.1,700.9L1974.1,706.7L1974.2,702.9L1976.7,704.4L1977.5,708.6L1982.0,710.5L1985.8,710.9L1988.9,708.8L1991.8,709.4L1990.4,714.3L1988.7,717.6L1984.5,717.5L1983.0,719.2L1983.5,721.6L1982.7,722.6L1980.6,725.6L1977.8,729.4L1973.6,731.6L1972.6,730.1L1970.3,729.3L1973.5,724.8L1971.7,721.7L1965.7,719.5L1965.8,717.5L1969.9,715.5L1970.8,711.3L1970.5,707.7L1968.3,704.0L1968.4,703.0L1965.8,700.7L1961.4,695.8L1959.1,691.8L1961.2,691.4L1964.2,694.5L1968.5,695.9L1970.1,700.9Z M1928.4,623.1L1926.3,624.4L1923.3,622.9L1919.3,620.4L1915.7,617.5L1912.0,613.6L1911.3,611.7L1913.7,611.8L1916.8,613.7L1919.2,615.6L1921.0,617.1L1925.6,620.6L1928.4,623.1Z M1991.0,596.3L1992.9,597.9L1992.0,600.8L1988.5,601.6L1985.5,600.9L1984.9,598.5L1987.1,596.6L1989.6,597.2L1991.0,596.3Z M1996.5,593.3L1992.9,594.5L1992.2,592.4L1995.0,591.3L1996.7,591.0L2000.0,589.3L2000.0,592.0L1996.5,593.3Z M0.5,591.7L0.0,592.0L0.0,589.3L1.1,589.0L0.5,591.7Z M1932.5,591.5L1930.6,592.2L1928.8,589.8L1929.0,588.3L1932.5,591.5Z M1928.4,583.0L1929.3,587.4L1927.8,586.7L1926.6,587.0L1925.8,585.5L1925.7,581.3L1928.4,583.0Z M1278.1,575.3L1279.0,582.0L1280.4,584.6L1279.9,587.3L1278.9,588.9L1277.0,585.6L1276.0,587.3L1277.0,591.4L1276.5,593.8L1275.0,595.0L1274.6,599.7L1272.5,606.2L1269.7,613.9L1266.3,624.4L1264.2,632.1L1261.6,638.6L1257.1,639.9L1252.3,642.2L1249.1,640.8L1244.7,638.8L1243.1,635.9L1242.8,631.0L1240.8,626.5L1240.3,622.5L1241.3,618.5L1243.9,617.6L1243.9,615.7L1246.5,611.5L1247.0,608.0L1245.7,605.3L1244.7,601.8L1244.2,596.7L1246.2,593.6L1246.9,590.1L1249.7,589.9L1252.8,588.7L1254.8,587.7L1257.3,587.7L1260.5,584.5L1265.0,581.1L1266.7,578.3L1265.9,575.9L1268.3,576.6L1271.4,572.7L1271.5,569.4L1273.3,566.9L1275.2,569.3L1276.7,571.6L1278.1,575.3Z M1797.6,576.5L1799.6,580.8L1803.1,578.7L1805.0,581.1L1807.6,583.2L1807.1,585.7L1808.3,590.5L1809.1,593.2L1810.5,593.9L1812.0,598.7L1811.5,601.6L1813.3,605.3L1819.3,608.2L1823.2,610.9L1826.9,613.3L1826.2,614.6L1829.4,618.1L1831.5,624.1L1833.8,622.9L1836.0,625.3L1837.4,624.5L1838.3,630.3L1842.3,633.8L1844.9,635.9L1849.2,640.4L1850.8,644.8L1850.9,648.0L1850.5,651.4L1853.2,656.2L1852.8,661.1L1851.9,663.7L1850.4,668.6L1850.5,671.8L1849.4,675.8L1846.9,680.8L1842.8,683.6L1840.8,687.9L1838.9,690.6L1837.3,695.4L1835.2,698.2L1833.8,702.3L1833.0,706.2L1833.3,707.9L1830.1,709.8L1823.9,710.1L1818.8,712.3L1816.2,714.5L1812.9,716.9L1808.3,714.4L1804.9,713.4L1805.7,710.5L1802.7,711.6L1797.8,715.6L1793.0,714.1L1789.9,713.2L1786.7,712.8L1781.3,711.2L1777.7,707.8L1776.7,703.6L1775.4,700.8L1772.7,698.5L1767.3,697.8L1769.2,695.2L1767.8,691.0L1765.1,694.9L1760.2,695.9L1763.1,692.8L1763.9,689.6L1766.1,686.9L1765.6,682.8L1761.1,687.5L1757.6,689.4L1755.5,693.8L1751.2,691.5L1751.3,688.6L1747.9,684.6L1744.9,682.5L1746.0,681.2L1738.8,677.8L1734.9,677.7L1729.6,675.0L1719.6,675.5L1712.4,677.5L1706.1,679.3L1700.8,679.0L1694.9,681.8L1690.1,683.1L1689.0,686.0L1687.0,688.3L1682.3,688.4L1678.8,688.9L1673.9,687.9L1669.9,688.5L1666.1,688.8L1662.8,691.7L1661.2,691.5L1658.4,693.0L1655.7,694.8L1651.6,694.6L1647.9,694.6L1642.0,691.0L1639.0,690.0L1639.2,686.8L1641.9,686.0L1642.9,684.8L1642.7,682.8L1643.3,678.9L1642.7,675.6L1639.8,670.0L1638.9,666.8L1639.1,663.7L1636.9,660.1L1636.8,658.4L1634.3,656.2L1633.6,651.9L1630.4,647.5L1629.7,645.1L1632.1,647.5L1630.2,642.3L1633.0,644.0L1634.6,646.1L1634.5,643.3L1631.8,638.9L1631.3,637.1L1630.0,635.5L1630.6,632.3L1631.7,630.9L1632.5,628.1L1631.9,624.9L1634.2,620.9L1634.6,625.1L1636.9,621.3L1641.4,619.4L1644.2,617.0L1648.4,615.0L1650.9,614.6L1652.5,615.3L1656.8,613.2L1660.2,612.6L1661.0,611.4L1662.5,610.8L1665.6,611.0L1671.4,609.4L1674.4,606.9L1675.9,603.9L1679.1,601.1L1679.4,598.9L1679.5,595.9L1683.4,591.1L1685.7,595.9L1688.1,594.8L1686.1,592.2L1687.9,589.5L1690.3,590.7L1691.0,586.5L1694.0,583.8L1695.4,581.6L1698.2,580.6L1698.3,579.1L1700.7,579.7L1700.8,578.3L1703.2,577.5L1705.9,576.8L1710.0,579.3L1713.1,582.6L1716.6,582.6L1720.1,583.2L1718.9,580.1L1721.6,575.7L1724.1,574.2L1723.2,572.8L1725.7,569.6L1729.0,567.7L1731.9,568.3L1736.5,567.3L1736.4,564.5L1732.4,562.6L1735.3,561.8L1739.0,563.2L1741.9,565.5L1746.6,566.9L1748.2,566.3L1751.7,568.0L1754.9,566.5L1757.0,566.9L1758.3,565.9L1760.8,568.6L1759.4,571.6L1757.3,573.8L1755.3,574.0L1756.0,576.2L1754.4,579.0L1752.4,581.8L1752.8,583.3L1757.2,586.4L1761.5,588.2L1764.3,590.1L1768.4,593.4L1769.9,593.4L1772.8,594.8L1773.7,596.5L1779.0,598.4L1782.6,596.5L1783.7,593.5L1784.9,591.0L1785.5,588.0L1787.2,583.6L1786.5,580.9L1786.9,579.3L1786.2,576.1L1786.9,571.9L1788.0,570.8L1787.1,568.9L1788.5,566.0L1789.5,562.9L1789.7,561.3L1791.8,559.3L1793.3,562.0L1793.7,565.5L1795.1,566.1L1795.3,568.5L1797.3,571.3L1797.8,574.4L1797.6,576.5Z M1900.7,558.2L1902.2,560.1L1898.3,560.1L1896.2,556.7L1899.5,558.0L1900.7,558.2Z M1670.6,556.9L1668.3,557.0L1660.9,553.1L1666.1,552.0L1669.0,553.7L1671.0,555.4L1670.6,556.9Z M1893.6,554.8L1891.5,555.0L1888.1,554.4L1886.9,553.6L1887.2,551.3L1890.9,552.2L1892.7,553.4L1893.6,554.8Z M1898.2,553.3L1897.4,554.4L1893.3,549.5L1892.1,546.2L1894.0,546.2L1896.0,550.7L1898.2,553.3Z M1691.3,556.3L1686.6,557.6L1685.9,556.9L1686.4,555.0L1688.8,551.6L1694.3,549.4L1694.9,548.1L1699.7,546.8L1703.6,546.7L1705.3,546.0L1707.4,546.7L1705.4,548.2L1699.6,550.6L1694.9,552.2L1691.3,556.3Z M1655.0,545.0L1657.0,546.5L1660.4,546.0L1661.8,548.4L1655.4,549.5L1651.5,550.2L1648.6,550.2L1650.5,547.0L1653.5,546.9L1655.0,545.0Z M1682.8,545.0L1682.0,548.1L1673.6,549.6L1666.2,548.9L1666.2,546.9L1670.6,545.8L1674.1,547.4L1677.8,547.0L1682.8,545.0Z M1888.2,546.3L1888.4,547.4L1884.1,545.1L1881.0,543.1L1879.0,541.2L1879.8,540.7L1882.3,542.0L1886.9,544.6L1888.2,546.3Z M1875.2,540.8L1874.1,541.1L1871.7,539.9L1869.4,537.6L1869.7,536.7L1873.0,539.0L1875.2,540.8Z M1603.5,537.7L1614.1,538.2L1615.3,535.9L1625.6,538.6L1627.7,542.2L1636.0,543.2L1642.8,546.5L1636.5,548.6L1630.4,546.4L1625.3,546.5L1619.6,546.1L1614.4,545.1L1607.9,543.0L1603.9,542.5L1601.5,543.1L1591.4,540.9L1590.4,538.5L1585.4,538.1L1589.2,532.8L1595.9,533.1L1600.4,535.3L1602.7,535.7L1603.5,537.7Z M1748.5,534.5L1745.6,538.3L1745.1,534.1L1746.1,532.1L1747.2,530.3L1748.5,531.9L1748.5,534.5Z M1866.0,537.9L1864.4,538.4L1862.0,536.3L1859.6,532.8L1858.4,528.6L1859.2,528.0L1859.8,529.7L1861.5,530.9L1864.2,534.4L1866.8,536.3L1866.0,537.9Z M1844.3,530.4L1841.4,530.9L1840.6,532.4L1837.5,533.8L1834.7,535.1L1831.7,535.1L1827.2,533.5L1824.0,531.9L1824.5,530.2L1829.4,531.0L1832.5,530.6L1833.3,527.9L1834.1,527.8L1834.6,530.7L1837.8,530.3L1839.4,528.4L1842.5,526.4L1841.9,523.2L1845.2,523.0L1846.3,524.0L1846.2,527.0L1844.3,530.4Z M1706.9,519.2L1704.9,521.1L1701.0,520.0L1699.9,517.7L1705.6,517.4L1706.9,519.2Z M1724.8,517.2L1726.9,521.4L1722.2,519.1L1717.5,518.7L1714.4,519.0L1710.5,518.9L1711.9,515.8L1718.7,515.6L1724.8,517.2Z M1850.8,525.0L1849.0,526.5L1848.0,523.2L1846.7,521.1L1844.2,519.2L1841.0,516.9L1837.0,515.2L1838.6,513.9L1841.6,515.4L1843.4,516.7L1845.8,518.0L1848.0,520.3L1850.1,522.1L1850.8,525.0Z M1745.2,506.4L1746.8,515.4L1752.5,518.7L1757.2,512.8L1763.6,509.5L1768.5,509.5L1773.2,511.4L1777.4,513.4L1783.3,514.4L1793.0,518.3L1803.2,521.5L1807.1,524.3L1810.2,527.1L1811.0,530.4L1820.3,533.8L1821.6,536.7L1816.5,537.3L1817.7,541.0L1822.7,544.7L1826.3,550.6L1829.5,550.4L1829.3,552.9L1833.5,553.8L1831.9,554.8L1837.8,557.2L1837.2,558.8L1833.5,559.2L1832.1,557.7L1827.4,557.1L1821.7,556.3L1817.4,552.7L1814.3,549.7L1811.4,544.8L1804.1,542.4L1799.4,544.0L1796.0,545.8L1796.7,549.9L1792.4,551.8L1789.3,550.9L1783.5,550.7L1778.6,546.1L1772.9,545.0L1771.6,546.6L1764.5,546.7L1766.9,542.2L1770.4,540.7L1768.9,534.6L1766.3,530.0L1755.5,525.3L1750.9,524.8L1742.6,519.7L1740.9,522.4L1738.8,522.8L1737.5,520.8L1737.5,518.4L1733.3,515.7L1739.3,513.7L1743.2,513.8L1742.8,512.3L1734.6,512.3L1732.4,509.0L1727.5,508.0L1725.1,505.2L1732.6,503.9L1735.4,502.1L1744.4,504.3L1745.2,506.4Z M1695.8,492.1L1691.3,497.6L1687.1,498.7L1681.8,497.6L1672.5,497.9L1667.7,498.7L1666.9,502.9L1671.9,507.8L1674.9,505.3L1685.2,503.4L1684.8,506.0L1682.3,505.2L1679.9,508.4L1675.0,510.6L1680.3,517.7L1679.3,519.6L1684.3,526.0L1684.2,529.7L1681.3,531.3L1679.1,529.3L1681.8,524.8L1676.3,527.0L1674.9,525.4L1675.7,523.3L1671.7,520.0L1672.1,514.6L1668.4,516.3L1668.8,522.8L1669.1,530.7L1665.5,531.5L1663.1,529.9L1664.7,524.8L1663.9,519.4L1661.5,519.4L1659.8,515.6L1662.1,511.9L1662.9,507.5L1665.7,499.1L1666.9,496.9L1671.6,492.7L1675.9,494.4L1682.9,495.1L1689.3,494.9L1694.8,490.9L1695.8,492.1Z M1714.9,493.7L1714.6,498.6L1711.8,498.0L1710.9,501.4L1713.2,504.3L1711.7,505.0L1709.4,501.5L1707.8,494.4L1708.9,489.9L1710.7,487.9L1711.1,491.0L1714.4,491.4L1714.9,493.7Z M1587.9,532.5L1581.7,532.6L1577.0,528.0L1569.9,523.4L1567.5,520.1L1563.3,515.6L1560.6,511.4L1556.3,503.6L1551.5,499.0L1549.8,494.2L1547.8,489.9L1542.8,486.4L1539.9,481.6L1535.7,478.5L1529.9,472.4L1529.4,469.6L1533.0,469.8L1541.6,470.9L1546.5,476.3L1550.8,480.1L1553.9,482.4L1559.1,488.3L1564.8,488.4L1569.4,492.2L1572.6,496.9L1576.9,499.4L1574.7,504.0L1577.8,505.9L1579.8,506.0L1580.8,509.9L1582.7,513.0L1586.8,513.5L1589.5,517.0L1588.1,523.9L1587.9,532.5Z M1654.9,489.8L1661.1,495.0L1654.5,495.6L1652.7,499.4L1652.9,504.5L1647.6,508.3L1647.4,513.8L1645.3,522.3L1644.4,520.3L1638.1,522.8L1635.9,519.4L1632.0,519.1L1629.2,517.3L1622.6,519.3L1620.6,516.6L1616.9,516.9L1612.4,516.3L1611.5,508.8L1608.7,507.3L1606.1,502.6L1605.3,497.7L1605.9,492.5L1609.2,488.9L1613.3,490.8L1617.6,489.7L1618.7,485.0L1621.1,484.0L1627.8,482.8L1631.7,478.4L1634.5,474.9L1636.7,472.8L1641.4,469.7L1645.7,465.9L1648.5,461.5L1650.7,461.5L1653.6,464.3L1653.8,466.7L1657.5,468.3L1662.1,470.0L1661.7,472.1L1658.0,472.4L1659.0,475.1L1654.9,477.0L1651.7,482.0L1655.8,487.3L1654.9,489.8Z M1702.1,453.3L1702.7,456.9L1703.0,460.1L1701.1,465.1L1699.1,459.5L1696.5,462.3L1698.2,466.4L1696.6,469.0L1690.1,465.8L1688.5,461.7L1690.2,459.1L1686.7,456.5L1685.0,458.8L1682.4,458.6L1678.3,461.7L1677.3,460.0L1679.5,455.4L1683.0,453.8L1686.0,451.7L1688.0,454.2L1692.2,452.7L1693.1,450.2L1697.1,450.1L1696.7,445.8L1701.2,448.4L1701.7,451.2L1702.1,453.3Z M1451.2,465.6L1446.4,466.8L1443.7,462.4L1442.8,454.4L1445.3,445.4L1449.1,448.5L1451.7,452.4L1454.4,458.2L1453.5,464.0L1451.2,465.6Z M661.5,443.8L656.8,444.4L655.8,443.9L657.4,442.4L657.3,440.2L660.5,439.5L661.7,439.7L661.5,443.8Z M1688.8,442.9L1686.8,444.7L1685.1,448.2L1683.3,449.9L1679.9,446.0L1681.0,444.5L1682.4,443.0L1683.0,439.5L1686.1,439.2L1685.2,443.0L1689.3,437.6L1688.8,442.9Z M1658.4,448.2L1651.0,453.5L1653.7,449.6L1657.7,446.2L1661.0,442.4L1664.0,436.8L1664.9,441.4L1661.3,444.4L1658.4,448.2Z M1677.1,433.9L1680.5,435.7L1684.0,435.6L1683.9,438.0L1681.3,440.3L1677.8,442.0L1677.6,439.4L1678.0,436.6L1677.1,433.9Z M1697.2,432.4L1698.8,438.6L1694.5,437.2L1694.6,439.0L1696.0,442.5L1693.3,443.7L1693.1,439.8L1691.4,439.5L1690.6,436.1L1693.8,436.6L1693.8,434.5L1690.4,430.2L1695.7,430.4L1697.2,432.4Z M1675.2,427.4L1673.7,432.2L1671.3,429.4L1668.5,425.2L1673.2,425.4L1675.2,427.4Z M1674.0,397.2L1677.4,398.8L1679.1,397.3L1679.6,398.8L1678.7,401.1L1680.6,405.0L1679.2,409.7L1675.9,411.5L1675.0,416.0L1676.3,420.4L1679.2,421.0L1681.7,420.4L1688.6,423.4L1688.1,426.5L1689.9,427.8L1689.3,430.4L1685.0,427.6L1682.9,424.7L1681.5,426.7L1678.0,423.4L1672.9,424.2L1670.2,423.0L1670.4,420.7L1672.2,419.3L1670.5,418.0L1669.8,420.0L1667.1,416.8L1666.2,414.4L1666.0,409.1L1668.3,410.9L1668.8,402.2L1670.6,397.2L1674.0,397.2Z M635.6,398.7L634.2,400.1L630.0,400.1L626.8,400.3L626.4,397.9L627.2,397.1L631.8,397.1L634.6,397.6L635.6,398.7Z M572.8,400.7L571.1,401.7L568.0,400.8L564.8,398.7L565.5,397.5L567.8,397.1L569.1,397.3L572.8,397.8L575.7,399.1L576.7,400.6L572.8,400.7Z M596.8,389.6L601.6,390.5L602.3,389.5L606.6,389.6L609.9,391.0L611.4,390.8L612.4,392.8L615.4,392.7L615.3,394.4L617.7,394.6L620.5,396.6L618.4,398.9L615.8,397.7L613.2,397.9L611.4,397.6L610.4,398.6L608.2,399.0L607.4,397.6L605.6,398.4L603.3,402.2L601.9,401.3L601.6,399.8L597.9,398.8L595.3,399.2L591.9,398.8L589.3,399.8L586.3,398.1L586.8,396.3L591.9,397.1L596.1,397.5L598.1,396.3L595.6,393.9L595.6,391.8L592.1,390.9L593.4,389.4L596.8,389.6Z M1613.0,396.2L1608.2,398.9L1603.6,397.2L1603.5,392.4L1606.2,389.9L1612.3,388.3L1615.5,388.5L1616.7,390.6L1614.3,393.0L1613.0,396.2Z M135.9,394.0L135.1,394.9L133.7,394.1L133.8,392.6L132.9,390.5L133.2,389.9L134.2,389.0L133.8,387.9L134.1,387.4L134.5,387.5L136.7,388.4L137.6,388.9L138.5,389.7L140.0,391.6L139.8,391.9L137.7,393.1L135.9,394.0Z M132.9,385.3L131.0,385.7L130.1,384.5L129.4,384.1L129.4,383.7L129.9,383.3L131.9,383.8L133.4,384.6L132.9,385.3Z M129.1,382.4L128.9,383.0L126.0,382.8L126.4,382.1L129.1,382.4Z M124.2,381.5L123.8,381.9L123.5,381.8L121.5,381.6L120.8,380.3L120.6,380.1L122.1,379.4L122.5,379.7L124.2,381.5Z M114.7,377.9L114.1,378.4L112.2,377.4L112.5,377.0L113.4,376.5L114.6,376.6L114.7,377.9Z M557.3,373.5L559.5,375.6L564.7,374.9L566.7,376.2L571.4,379.7L574.9,382.2L576.7,382.1L580.0,383.2L579.6,384.8L583.7,385.0L587.9,387.3L587.2,388.6L583.5,389.3L579.8,389.6L576.0,389.2L568.0,389.7L571.7,386.6L569.5,385.1L565.9,384.8L564.0,383.2L562.7,380.0L559.5,380.2L554.3,378.7L552.7,377.6L545.4,376.7L543.5,375.6L545.6,374.2L540.1,374.0L536.1,376.8L533.8,376.9L533.0,378.3L530.3,378.9L527.9,378.4L530.8,376.6L532.1,374.6L534.6,373.4L537.4,372.3L541.6,371.8L543.0,371.2L547.8,371.6L552.1,371.6L557.3,373.5Z M569.3,368.0L567.9,368.3L566.5,365.1L564.4,363.5L565.6,359.9L567.3,360.2L569.2,364.8L569.3,368.0Z M1673.2,373.4L1670.8,377.9L1667.9,373.3L1667.3,369.1L1670.5,363.7L1675.0,359.5L1677.5,361.1L1676.5,364.5L1673.2,373.4Z M567.7,352.3L561.6,353.2L561.2,351.2L563.8,350.7L567.5,350.9L567.7,352.3Z M572.2,352.3L571.3,356.2L570.2,355.5L570.3,352.6L567.8,350.4L567.8,349.8L572.2,352.3Z M1748.0,310.3L1748.7,312.2L1745.6,315.5L1743.3,313.8L1740.4,315.1L1739.0,318.3L1735.4,316.7L1735.4,314.1L1738.5,310.8L1741.6,311.4L1743.9,309.1L1748.0,310.3Z M1192.1,301.8L1188.3,304.2L1188.7,305.2L1188.9,305.7L1183.2,307.9L1180.5,307.2L1179.2,305.0L1181.8,304.8L1182.2,304.7L1183.0,303.4L1187.0,303.5L1192.1,301.8Z M1131.7,301.6L1134.7,303.5L1139.0,303.2L1143.2,303.6L1143.0,304.6L1146.1,303.9L1145.4,305.5L1137.4,306.0L1137.4,305.1L1130.6,304.0L1131.7,301.6Z M1086.2,287.6L1084.2,292.0L1085.1,293.7L1083.9,296.6L1079.6,294.5L1076.8,293.9L1069.1,291.0L1069.8,288.2L1076.3,288.7L1082.0,288.1L1086.2,287.6Z M1051.2,271.1L1054.5,275.0L1053.7,282.3L1051.2,282.0L1048.9,283.9L1046.8,282.4L1046.6,275.7L1045.3,272.5L1048.4,272.8L1051.2,271.1Z M1783.2,293.7L1781.1,298.1L1782.1,300.9L1779.2,304.8L1772.1,307.4L1762.3,307.7L1754.4,314.1L1750.7,311.9L1750.4,307.8L1740.8,309.0L1734.2,311.6L1727.7,311.7L1733.3,315.8L1729.6,325.3L1726.0,327.6L1723.3,325.5L1724.7,320.4L1721.2,318.8L1718.9,315.0L1724.2,313.3L1727.1,309.8L1732.7,306.9L1736.8,303.1L1747.8,301.5L1753.8,302.6L1759.6,292.8L1763.3,295.4L1771.4,289.8L1774.6,287.7L1778.1,280.9L1777.1,274.6L1779.5,271.1L1785.4,270.1L1788.4,277.8L1788.2,282.3L1783.1,287.9L1783.2,293.7Z M1053.1,265.8L1051.3,270.1L1048.8,269.0L1047.5,265.2L1048.6,263.2L1052.2,261.1L1053.1,265.8Z M1799.5,254.6L1803.4,255.8L1807.3,253.4L1808.6,259.7L1800.3,261.2L1795.5,266.7L1786.7,262.9L1783.7,269.0L1777.5,269.1L1776.8,263.5L1779.5,259.3L1785.4,259.0L1787.1,251.3L1788.7,246.9L1795.2,252.7L1799.5,254.6Z M646.3,241.4L650.3,242.1L655.5,242.0L652.8,244.3L650.7,244.6L643.7,242.3L642.3,240.4L644.4,238.7L646.3,241.4Z M656.6,227.2L653.9,227.3L646.7,225.6L641.6,222.9L643.5,222.5L650.8,223.9L656.5,226.2L656.6,227.2Z M313.8,230.5L311.0,231.3L301.9,228.7L300.3,226.8L295.3,224.8L294.3,223.3L288.6,222.3L286.4,219.2L286.9,217.9L292.7,219.2L296.1,220.0L301.4,220.6L303.2,222.5L306.0,225.1L311.5,227.4L313.8,230.5Z M688.1,218.4L684.5,223.3L688.1,221.4L691.8,222.6L689.9,224.5L694.8,226.0L697.4,224.7L702.9,226.4L701.2,230.5L705.1,229.5L705.8,232.5L707.5,235.9L705.2,240.8L702.7,241.0L699.0,240.0L700.2,235.4L698.7,234.7L692.2,239.5L688.9,239.3L692.8,236.7L687.5,235.4L681.5,235.7L670.7,235.5L669.9,233.9L673.4,231.9L670.9,230.4L675.6,227.1L681.3,218.2L684.8,215.1L689.6,213.2L692.2,213.4L691.1,214.9L688.1,218.4Z M262.7,199.8L262.7,199.8L262.7,199.8L262.7,199.8L268.1,199.3L266.4,205.6L271.2,210.1L269.0,210.1L265.7,207.6L263.6,205.0L260.8,203.3L259.8,200.8L260.1,199.1L262.7,199.8Z M
