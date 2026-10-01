"""Injecte (ou remplace) la section « Préparer ma photo », ses données et son script dans la page."""
import json, re, sys

page, data_path = sys.argv[1], sys.argv[2]
s = open(page, encoding='utf-8').read()
data = json.load(open(data_path, encoding='utf-8'))
FILTERS = {'LRGB': 'L + R, G, B', 'LHA': 'L + R, G, B + H', 'RSHO': 'S, H, O + R, G, B', 'SHO': 'S, H, O seuls', 'HOO': 'H + O (mono ou dual-band)'}
for wf in data['wf']:
    wf['filters'] = FILTERS[wf['id']]
blob = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')

CSS = '''/*prep-css*/
.prep { display: grid; gap: 14px; }
.prep fieldset { border: 1px solid var(--line); border-radius: 6px; background: var(--surface); padding: 12px 14px; margin: 0; min-width: 0; }
.prep legend { font-family: var(--display); font-weight: 700; font-size: 14px; padding: 0 6px; }
.prep .opts { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 6px 14px; }
.prep label { display: flex; gap: 8px; align-items: flex-start; font-size: 15px; cursor: pointer; min-width: 0; }
.prep label input { margin-top: 4px; flex: none; accent-color: var(--accent); }
.prep label small { display: block; color: var(--muted); font-size: 13px; }
.prep .ph { font-family: var(--display); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin: 10px 0 4px; }
.prep .ph:first-child { margin-top: 0; }
.prep-out { border: 1px solid var(--accent); border-radius: 6px; background: var(--accent-soft); padding: 12px 14px; }
.prep-out .bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 10px; }
.prep-out input[type=text] { font: inherit; font-size: 15px; padding: 6px 8px; border: 1px solid var(--line); border-radius: 4px; background: var(--surface); color: var(--fg); min-width: 0; flex: 1 1 160px; max-width: 260px; }
.prep-out button { font-family: var(--display); font-weight: 700; font-size: 14px; padding: 8px 14px; border-radius: 4px; border: 1px solid var(--accent); background: var(--accent); color: var(--bg); cursor: pointer; }
.prep-out button:disabled { opacity: .5; cursor: default; }
.prep-out .msg { font-size: 14px; color: var(--muted); width: 100%; }
.prep-out ol { margin: 0; padding-left: 0; list-style: none; }
.prep-out li { padding: 5px 0; border-top: 1px solid var(--line); font-size: 14px; min-width: 0; overflow-wrap: anywhere; }
.prep-out li b { font-family: var(--mono); font-size: 13px; }
.prep-out li.phase { border-top: 0; padding-top: 10px; font-family: var(--display); font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: var(--accent); }
/*prep-css-end*/
'''

SECTION = '''  <section id="preparer">
    <h2>Préparer ma photo</h2>
    <p class="sec-intro">Coche tes filtres et tes choix : la liste des étapes de <em>cette</em> photo s'affiche avec ce qu'il faut régler, et tu télécharges un fichier d'icônes qui ne contient qu'elles, rangées en colonnes par phase et numérotées dans l'ordre (E01, E02…). Dans PixInsight : <em>Process Icons › Load Process Icons</em>. Une fois la photo réglée, sauvegarde les icônes dans son dossier (<em>Save Process Icons</em>) pour garder ses réglages.</p>
    <div class="prep" id="prep">
      <fieldset><legend>1. Tes filtres</legend><div class="opts" id="prep-wf"></div></fieldset>
      <fieldset><legend>2. Tes méthodes</legend><div id="prep-choices"></div></fieldset>
      <fieldset><legend>3. Options (seulement si besoin)</legend><div id="prep-opts"></div></fieldset>
      <fieldset><legend>4. Aller plus vite</legend><label><input type="checkbox" id="prep-cont"><span>Regrouper les étapes sans réglage en conteneurs (conseillé)<small>Un seul clic pour une suite d'étapes appliquées à la même image (par exemple BXT, SPCC, BXT, SXT, NXT sur le RGB). Chaque étape garde les réglages de son icône. Format recopié d'icônes réelles, mais pas encore testé chez toi : essaie d'abord sur une copie.</small></span></label></fieldset>
      <div class="prep-out"><div class="bar"><input type="text" id="prep-name" placeholder="Nom de la photo (ex. M31)" aria-label="Nom de la photo"><button type="button" id="prep-dl">Télécharger mes icônes</button><span class="msg" id="prep-msg"></span></div><ol id="prep-list"></ol></div>
    </div>
    <script type="application/json" id="prep-data">''' + blob + '''</script>
  </section>

'''

JS = r'''<script>
/*prep-js*/
(function () {
  var D = JSON.parse(document.getElementById('prep-data').textContent);
  var KEY = 'prep-state-v1', st = {};
  try { st = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { st = {}; }
  if (st.cont === undefined) st.cont = true;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  function wf() { return D.wf.filter(function (w) { return w.id === st.wf; })[0] || D.wf[0]; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function groupsOf(w) { var g = {}; w.steps.forEach(function (s) { if (s.r.indexOf(':') > 0) { var p = s.r.split(':'); p[1].split('|').forEach(function (v) { (g[p[0]] = g[p[0]] || {})[v] = 1; }); } }); return g; }
  function chosen(w) { var g = groupsOf(w), c = {}; Object.keys(g).forEach(function (k) { var v = (st.ch || {})[k]; c[k] = g[k][v] ? v : ((w.def || {})[k] || D.defaults[k]); }); return c; }
  function keep(s, c) {
    if (s.r === 'core') return true;
    if (s.r === 'opt') return !!(st.opt || {})[s.b];
    var p = s.r.split(':'); return p[1].split('|').indexOf(c[p[0]]) >= 0;
  }
  function render() {
    var w = wf();
    $('prep-wf').innerHTML = D.wf.map(function (x) {
      return '<label><input type="radio" name="prep-wf" value="' + x.id + '"' + (x.id === w.id ? ' checked' : '') + '><span>' + esc(x.title.replace('Workflow ', '')) + '<small>' + esc(x.filters) + '</small></span></label>';
    }).join('');
    var g = groupsOf(w), c = chosen(w);
    $('prep-choices').innerHTML = Object.keys(g).map(function (k) {
      var ch = D.choices[k];
      return '<div class="ph">' + esc(ch[0]) + '</div><div class="opts">' + ch[1].filter(function (o) { return g[k][o[0]]; }).map(function (o) {
        return '<label><input type="radio" name="prep-' + k + '" value="' + o[0] + '"' + (c[k] === o[0] ? ' checked' : '') + '><span>' + esc(o[1]) + '</span></label>';
      }).join('') + '</div>';
    }).join('');
    var html = '', last = 0;
    w.steps.forEach(function (s) {
      if (s.r !== 'opt') return;
      if (s.p !== last) { html += (last ? '</div>' : '') + '<div class="ph">' + esc(D.phases[s.p - 1]) + '</div><div class="opts">'; last = s.p; }
      html += '<label><input type="checkbox" data-b="' + s.b + '"' + ((st.opt || {})[s.b] ? ' checked' : '') + '><span>' + esc(s.b.replace(/_/g, ' ')) + '<small>' + esc(s.w) + '</small></span></label>';
    });
    $('prep-opts').innerHTML = html + (last ? '</div>' : '');
    $('prep-cont').checked = !!st.cont;
    list();
  }
  function selection() {
    var w = wf(), c = chosen(w), sel = w.steps.filter(function (s) { return keep(s, c); });
    if (!st.cont) return sel;
    var have = {}; sel.forEach(function (s) { have[s.b] = s; });
    var used = (w.containers || []).filter(function (k) { return k.m.every(function (b) { return have[b]; }); });
    if (!used.length) return sel;
    var member = {}; used.forEach(function (k) { k.m.forEach(function (b) { member[b] = 1; }); });
    var out = [], done = {};
    sel.forEach(function (s) {
      if (!member[s.b]) { out.push(s); return; }
      used.forEach(function (k) {
        if (!done[k.n] && k.m[0] === s.b) { done[k.n] = 1; out.push({ b: k.n, p: s.p, c: k, d: 'CONTENEUR — applique-le une fois sur ' + k.t + ' : ' + k.m.join(' → ') + '. Chaque étape garde les réglages de son icône.' }); }
      });
    });
    return out;
  }
  function nested(x) { return x.replace(/\s*<description>[\s\S]*?<\/description>/, '').replace(' id="__ID___instance"', ' enabled="true"').split('\n').map(function (l) { return '   ' + l; }).join('\n'); }
  function instOf(s, name) {
    if (!s.c) return D.inst[s.k].replace('id="__ID___instance"', 'id="' + name + '_instance"');
    var w = wf(), by = {}; w.steps.forEach(function (x) { by[x.b] = x; });
    return '   <instance class="ProcessContainer" id="' + name + '_instance">\n' + s.c.m.map(function (b) { return nested(D.inst[by[b].k]); }).join('\n') + '\n   </instance>';
  }
  function clean(d) { return d.replace(/\s*Détails : page \S+\.$/, '').replace(/SI :\n- /g, 'SI ').replace(/\n- /g, ' ; si ').replace(/\n+/g, ' '); }
  function list() {
    var sel = selection(), html = '', last = 0;
    sel.forEach(function (s, i) {
      if (s.p !== last) { html += '<li class="phase">' + s.p + '. ' + esc(D.phases[s.p - 1]) + ' — ' + esc(D.notes[s.p - 1]) + '</li>'; last = s.p; }
      html += '<li><b>E' + ('0' + (i + 1)).slice(-2) + '_' + esc(s.b) + '</b> — ' + esc(clean(s.d)) + '</li>';
    });
    $('prep-list').innerHTML = html;
    $('prep-msg').textContent = sel.length + ' icônes, ' + new Set(sel.map(function (s) { return s.p; })).size + ' phases (colonnes).';
  }
  function xpsm() {
    var w = wf(), sel = selection(), phases = [], insts = [], icons = [], col = -1, row = 0;
    sel.forEach(function (s) { if (phases.indexOf(s.p) < 0) phases.push(s.p); });
    sel.forEach(function (s, i) {
      var c = phases.indexOf(s.p);
      if (c !== col) {
        col = c; row = 0;
        var hn = 'P' + s.p + '_' + D.ascii[s.p - 1];
        insts.push('   <instance class="NoOperation" version="256" id="' + hn + '_instance">\n      <description>' + esc('PHASE ' + s.p + ' — ' + D.phases[s.p - 1] + ' : ' + D.notes[s.p - 1] + '. Colonne de repère, sans effet.') + '</description>\n   </instance>');
        icons.push('   <icon id="' + hn + '" instance="' + hn + '_instance" xpos="' + (30 + 260 * c) + '" ypos="20" workspace="Workspace01"/>');
      }
      var name = 'E' + ('0' + (i + 1)).slice(-2) + '_' + s.b;
      insts.push(instOf(s, name));
      icons.push('   <icon id="' + name + '" instance="' + name + '_instance" xpos="' + (30 + 260 * c) + '" ypos="' + (64 + 30 * row) + '" workspace="Workspace01"/>');
      row++;
    });
    return D.header + '<!-- ' + esc(w.title) + ' — sélection du préparateur -->\n' + insts.join('\n') + '\n' + icons.join('\n') + '\n</xpsm>\n';
  }
  var CRC = (function () { var t = [], c, n, k; for (n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function zip(name, text) {
    var enc = new TextEncoder(), data = enc.encode(text), fn = enc.encode(name), crc = 0xFFFFFFFF;
    for (var i = 0; i < data.length; i++) crc = CRC[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
    crc = (crc ^ 0xFFFFFFFF) >>> 0;
    function hdr(size, central) {
      var b = new DataView(new ArrayBuffer(central ? 46 : 30)), o = 0;
      function u32(v) { b.setUint32(o, v, true); o += 4; } function u16(v) { b.setUint16(o, v, true); o += 2; }
      u32(central ? 0x02014b50 : 0x04034b50); if (central) u16(20); u16(20); u16(0x0800); u16(0); u16(0); u16(0x21);
      u32(crc); u32(size); u32(size); u16(fn.length); u16(0);
      if (central) { u16(0); u16(0); u16(0); u32(0); u32(0); }
      return new Uint8Array(b.buffer);
    }
    var lh = hdr(data.length, false), ch = hdr(data.length, true), off = lh.length + fn.length + data.length;
    var end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, 1, true); end.setUint16(10, 1, true);
    end.setUint32(12, ch.length + fn.length, true); end.setUint32(16, off, true);
    return new Blob([lh, fn, data, ch, fn, new Uint8Array(end.buffer)], { type: 'application/zip' });
  }
  function fileBase() {
    var n = ($('prep-name').value || '').trim().replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
    return (n ? n + '-' : 'Photo-') + wf().id;
  }
  var dl = null;
  if (window.claude && window.claude.use) window.claude.use('downloads').then(function (d) { dl = d; }, function () {});
  $('prep-dl').addEventListener('click', function () {
    var base = fileBase(), text = xpsm(), msg = $('prep-msg');
    if (dl) {
      dl.save({ filename: base + '.zip', data: zip(base + '.xpsm', text) }).then(function () {
        msg.textContent = 'Fichier ' + base + '.zip enregistré : décompresse-le, puis charge ' + base + '.xpsm dans PixInsight.';
      }, function (e) { msg.textContent = e && e.code === 'declined' ? 'Téléchargement annulé.' : 'Téléchargement impossible ici : ouvre la page du dépôt (docs/pixinsight-workflow.html).'; });
      return;
    }
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'application/xml' }));
    a.download = base + '.xpsm'; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    msg.textContent = 'Fichier ' + base + '.xpsm téléchargé : charge-le dans PixInsight.';
  });
  $('prep').addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'prep-wf') { st.wf = t.value; save(); render(); return; }
    if (t.name && t.name.indexOf('prep-') === 0) { (st.ch = st.ch || {})[t.name.slice(5)] = t.value; save(); list(); return; }
    if (t.id === 'prep-cont') { st.cont = t.checked; save(); list(); return; }
    if (t.dataset && t.dataset.b) { (st.opt = st.opt || {})[t.dataset.b] = t.checked; save(); list(); }
  });
  render();
})();
/*prep-js-end*/
</script>
'''

# CSS
s = re.sub(r'/\*prep-css\*/.*?/\*prep-css-end\*/\n', '', s, flags=re.S)
s = s.replace('</style>', CSS + '</style>', 1)
# section
s = re.sub(r'  <section id="preparer">.*?</section>\n\n', '', s, flags=re.S)
anchor = '  <section id="outils">'
assert s.count(anchor) == 1
s = s.replace(anchor, SECTION + anchor, 1)
# nav
nav = '<a href="#demarrer" data-sec="demarrer">Par où commencer</a>'
if 'data-sec="preparer"' not in s:
    s = s.replace(nav, nav + '<a href="#preparer" data-sec="preparer">Préparer ma photo</a>', 1)
# script
s = re.sub(r'<script>\n/\*prep-js\*/.*?/\*prep-js-end\*/\n</script>\n', '', s, flags=re.S)
s = s.rstrip() + '\n' + JS
open(page, 'w', encoding='utf-8').write(s)
print('ok', len(s))
