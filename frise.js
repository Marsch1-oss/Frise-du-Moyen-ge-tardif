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
  'Aragon':              { bg: '#6B2A10', light: '#F5E8E0', text: '#