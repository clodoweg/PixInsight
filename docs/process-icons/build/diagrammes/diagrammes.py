# Diagrammes des workflows (demande de l'utilisateur, 18 octobre 2026) : une page HTML, un onglet par workflow, construite depuis docs/kb/icones-*.md.
# Usage : python3 diagrammes.py sortie.html (build.sh l'écrit dans docs/Diagrammes-workflows.html).
import re, html, sys, os
KB = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'kb')
WF = [('LRGB','icones-LRGB.md','Galaxies LRGB'),('LHaRGB','icones-LHaRGB.md','Galaxies LHaRGB'),
      ('RGB-SHO','icones-RGB-SHO.md','Nébuleuses RGB + SHO'),('SHO','icones-SHO-sans-RGB.md','SHO sans RGB'),('HOO','icones-HOO.md','HOO')]
PH = {'P1':'Préparation','P2':'Gradient','P3':'Linéaire','P4':'Étirement','P5':'Couleur','P6':'Finition','P7':'Étoiles et fin'}

def parse(fn):
    phases, cur, grp, icon = [], None, 'main', None
    for line in open(os.path.join(KB, fn), encoding='utf-8'):
        line = line.rstrip('\n')
        m = re.match(r'^## (P\d)_', line)
        if m:
            cur = {'id': m.group(1), 'main': [], 'options': [], 'rapide': [], 'turbo': []}; phases.append(cur); grp = 'main'; icon = None; continue
        m = re.match(r'^### P\d_(\w+)', line)
        if m and cur:
            grp = m.group(1); grp = grp if grp in cur else 'options'; icon = None; continue
        m = re.match(r'^#### (\S+) — (.+)$', line)
        if m and cur:
            icon = {'name': m.group(1), 'cls': m.group(2), 'txt': {}, 'steps': []}; cur[grp].append(icon); continue
        if icon is None: continue
        m = re.match(r'^   (\d+)\. (\S+)', line)
        if m: icon['steps'].append(m.group(2))
        m = re.match(r'^      script `[^`]*/([^/`]+)\.js`', line)
        if m and icon['steps']: icon['steps'][-1] = m.group(1)
        if line.startswith('> '):
            t = line[2:].strip()
            for key in ('OPTION —', 'ALTERNATIVE —', 'MODE RAPIDE', 'PRÉRÉGLÉ :', 'À RÉGLER :', 'CONTENEUR :', 'SUR :', 'LANCEMENT :'):
                if t.startswith(key):
                    k = key.rstrip(' :—')
                    icon['txt'][k] = t[len(key):].strip() if key.endswith((':','—')) else t
                    icon['last'] = k; break
            else:
                if t and not t.startswith('-') and icon.get('last') in ('OPTION', 'ALTERNATIVE', 'MODE RAPIDE'):
                    icon['txt'][icon['last']] += ' ' + t
    return phases

def short(t, n=150):
    t = re.sub(r'\s+', ' ', t).strip()
    return t if len(t) <= n else t[:n].rsplit(' ', 1)[0] + '…'

def label(name):
    n = re.sub(r'^(E\d\d|Opt|R|T)_', '', name)
    return n.replace('_', ' ')

def card(ic, kind):
    t = ic['txt']
    head = t.get('OPTION') or t.get('ALTERNATIVE') or t.get('MODE RAPIDE') or t.get('SUR') or t.get('PRÉRÉGLÉ') or ''
    num = re.match(r'^E(\d\d)_', ic['name'])
    badge = '<span class="num">%s</span>' % num.group(1) if num else ''
    body = ''
    for k, lab in (('PRÉRÉGLÉ', 'Préréglé'), ('À RÉGLER', 'À régler'), ('CONTENEUR', 'Contient'), ('LANCEMENT', 'Lancement')):
        if k in t: body += '<p><b>%s :</b> %s</p>' % (lab, html.escape(t[k]))
    if ic['steps'] and 'CONTENEUR' not in t:
        body += '<p><b>Étapes :</b> %s</p>' % html.escape(', '.join(ic['steps']))
    return ('<details class="node %s"><summary>%s<span class="nm">%s</span><span class="sub">%s</span></summary><div class="more"><code>%s</code>%s</div></details>'
            % (kind, badge, html.escape(label(ic['name'])), html.escape(short(head)), html.escape(ic['name']), body))

def wf_html(key, fn, title):
    out = ['<section class="wf" id="wf-%s"><h2>%s</h2><div class="flow">' % (key, html.escape(title))]
    phases = parse(fn)
    for i, ph in enumerate(phases):
        out.append('<div class="phase"><div class="ph-title"><span>%s</span> %s</div><div class="ph-body">' % (ph['id'], PH.get(ph['id'], '')))
        out.append('<div class="col main"><div class="col-h">Chemin principal</div>')
        for j, ic in enumerate(ph['main']):
            if j: out.append('<div class="arrow" aria-hidden="true">↓</div>')
            out.append(card(ic, 'n-main'))
        if not ph['main']: out.append('<p class="empty">—</p>')
        out.append('</div><div class="col side">')
        for g, lab, kind in (('options', 'Options (à la place ou en plus)', 'n-opt'), ('rapide', 'Mode rapide', 'n-rap'), ('turbo', 'Turbo', 'n-tur')):
            if ph[g]:
                out.append('<div class="col-h">%s</div>' % lab + ''.join(card(ic, kind) for ic in ph[g]))
        out.append('</div></div></div>')
        if i < len(phases) - 1: out.append('<div class="ph-arrow" aria-hidden="true">▼</div>')
    out.append('</div></section>')
    return '\n'.join(out)

tabs = ''.join('<button class="tab" data-k="%s">%s</button>' % (k, html.escape(t)) for k, f, t in WF)
secs = '\n'.join(wf_html(*w) for w in WF)
page = open(os.path.join(os.path.dirname(__file__), 'modele.html'), encoding='utf-8').read().replace('{{TABS}}', tabs).replace('{{SECS}}', secs)
open(sys.argv[1], 'w', encoding='utf-8').write(page)
print('ok', len(page))
