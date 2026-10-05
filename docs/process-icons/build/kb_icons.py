"""Écrit docs/kb/icones-<workflow>.md à partir des fichiers Conteneurs-*.xpsm générés :
chaque icône dans l'ordre des colonnes (P1 à P7), avec sa classe, ses réglages et sa description.
Fichier GÉNÉRÉ par build.sh : ne pas l'éditer à la main."""
import os, re, sys
import xml.etree.ElementTree as ET

NS = '{http://www.pixinsight.com/xpsm}'
SKIP_TABLE_ROWS = 12   # tables plus longues (courbes de filtres, structures) : résumées

def val(p):
    v = p.get('value')
    return v if v is not None else (p.text or '').strip()

def params(inst, indent='   '):
    out = []
    cls = inst.get('class')
    if cls == 'Script':
        get = {p.get('id'): val(p) for p in inst.findall(NS + 'parameter')}
        out.append('%sscript `%s`' % (indent, get.get('filePath', '')))
        t = inst.find(NS + 'table')
        rows = []
        for tr in (t.findall(NS + 'tr') if t is not None else []):
            tds = {td.get('id'): (td.text or td.get('value') or '') for td in tr.findall(NS + 'td')}
            rows.append('%s=%s' % (tds.get('id', ''), tds.get('value', '')))
        solver = [r for r in rows if r.startswith(('solver_', 'metadata_'))]
        if len(solver) > 6:
            keep = [r for r in solver if r.split('=')[0] in ('metadata_focal', 'metadata_xpixsz', 'solver_catalogMode', 'solver_distortionCorrection')]
            rows = [r for r in rows if r not in solver] + keep + ['(+ %d autres réglages ImageSolver)' % (len(solver) - len(keep))]
        if rows:
            out.append('%sparamètres : %s' % (indent, ', '.join('`%s`' % r for r in rows)))
        return out
    if cls == 'ProcessContainer':
        for k, sub in enumerate(inst.findall(NS + 'instance'), 1):
            out.append('%s%d. %s' % (indent, k, sub.get('class')))
            out += params(sub, indent + '   ')
        return out
    if cls == 'NoOperation':
        return out
    kv = []
    for p in inst.findall(NS + 'parameter'):
        v = val(p)
        if p.get('id') in ('expression', 'expression1', 'expression2', 'expression3', 'symbols'):
            if v:
                kv.append('%s = `%s`' % (p.get('id'), v.replace('\n', ' ')))
            continue
        if len(v) > 80:
            v = v[:77] + '…'
        kv.append('%s=%s' % (p.get('id'), v))
    for t in inst.findall(NS + 'table'):
        n = int(t.get('rows', '0'))
        if n:
            kv.append('table %s (%d lignes)' % (t.get('id'), n))
    if kv:
        out.append('%s%s' % (indent, ' ; '.join(kv)))
    return out

def main(src_dir, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    for wf in ('LRGB', 'LHaRGB', 'RGB-SHO', 'SHO-sans-RGB', 'HOO'):
        path = os.path.join(src_dir, 'Conteneurs-%s.xpsm' % wf)
        root = ET.parse(path).getroot()
        insts = {i.get('id'): i for i in root.findall(NS + 'instance')}
        icons = sorted(root.findall(NS + 'icon'), key=lambda i: (int(i.get('xpos')), int(i.get('ypos'))))
        lines = ['# Icônes du fichier Conteneurs-%s.xpsm' % wf, '',
                 "Fichier GÉNÉRÉ par `docs/process-icons/build/build.sh` (kb_icons.py) à partir de l'xpsm : ne pas éditer ; "
                 'pour changer une icône, modifier le générateur (voir `generateur.md`).', '',
                 'Préfixes : `E##_` chemin principal (dans l\'ordre), `Opt_` option, `R_` mode rapide, `C_` conteneur. '
                 'Les icônes `P#_…` sont des repères de colonne.', '']
        for ic in icons:
            iid = ic.get('id')
            inst = insts[ic.get('instance')]
            if re.match(r'P\d_', iid):
                if re.match(r'P\d_[A-Z][a-z]', iid) and not iid.endswith(('_options', '_rapide', '_turbo')):
                    lines += ['## %s' % iid, '']
                else:
                    lines += ['### %s' % iid, '']
                continue
            lines.append('#### %s — %s' % (iid, inst.get('class')))
            lines += params(inst)
            d = inst.find(NS + 'description')
            if d is not None and d.text:
                txt = re.sub(r'\n?Détails : page docs/pixinsight-workflow\.html\.', '', d.text.strip())
                lines += ['', '> ' + txt.strip().replace('\n', '\n> ')]
            lines.append('')
        open(os.path.join(out_dir, 'icones-%s.md' % wf), 'w', encoding='utf-8').write('\n'.join(lines).rstrip() + '\n')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
