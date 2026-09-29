"""Génère les fichiers .xpsm de la fiche PixInsight à partir d'instances réelles
(jamiesmith/pixinsight-icons, générées par PixInsight 1.9.3) en ne changeant que les valeurs."""
import json, re, os, sys
from xml.sax.saxutils import escape

T = json.load(open(os.environ.get('TEMPLATES', os.path.join(os.path.dirname(__file__), 'templates.json'))))
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

HEADER = '''<?xml version="1.0" encoding="UTF-8"?>
<!--
Fiche PixInsight — icônes de process générées pour docs/pixinsight-workflow.html
Format XPSM 1.0 (PixInsight 1.9.x). Valeurs de départ : à ajuster sur tes images.
-->
<xpsm version="1.0" xmlns="http://www.pixinsight.com/xpsm" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.pixinsight.com/xpsm http://pixinsight.com/xpsm/xpsm-1.0.xsd">
'''

def base(cls):
    t = T[cls]
    t = re.sub(r'\n\s*<time[^>]*/>', '', t)
    # normalise l'indentation (certaines instances étaient imbriquées)
    lines = t.split('\n')
    out = []
    for ln in lines:
        out.append('   ' + ln.strip() if not ln.strip().startswith('<instance') and not ln.strip().startswith('</instance') else '   ' + ln.strip())
    t = '\n'.join(out)
    t = re.sub(r'\n   (<(parameter|table|tr|td)\b)', r'\n      \1', t)
    t = re.sub(r'\n      (<(tr|/tr)\b)', r'\n         \1', t)
    t = re.sub(r'\n      (<td\b)', r'\n            \1', t)
    t = re.sub(r'\n   (</table>)', r'\n      \1', t)
    t = re.sub(r"\n   (</tr>)", r"\n         \1", t)
    return t

def set_val(t, pid, val):
    if isinstance(val, bool):
        val = 'true' if val else 'false'
    new, n = re.subn(r'(<parameter id="%s" value=")[^"]*(")' % re.escape(pid), lambda m: m.group(1) + str(val) + m.group(2), t)
    assert n == 1, (pid, n)
    return new

def set_text(t, pid, text):
    new, n = re.subn(r'<parameter id="%s"(?:>.*?</parameter>|/>)' % re.escape(pid),
                     lambda m: '<parameter id="%s">%s</parameter>' % (pid, escape(text)), t, flags=re.S)
    assert n == 1, (pid, n)
    return new

def instance(cls, name, values=None, texts=None, post=None):
    t = base(cls)
    t = re.sub(r'<instance class="%s" version="(\d+)"[^>]*>' % cls,
               lambda m: '<instance class="%s" version="%s" id="%s_instance">' % (cls, m.group(1), name), t, count=1)
    for k, v in (values or {}).items():
        t = set_val(t, k, v)
    for k, v in (texts or {}).items():
        t = set_text(t, k, v)
    if post:
        t = post(t)
    return name, t

def pixelmath(name, rgbk, g=None, b=None, symbols='', new_image=False, new_id='', space='SameAsTarget'):
    single = g is None
    texts = {'expression': rgbk, 'expression1': g or '', 'expression2': b or '', 'expression3': '', 'symbols': symbols, 'newImageId': new_id}
    values = {'useSingleExpression': single, 'createNewImage': new_image, 'newImageColorSpace': space,
              'rescale': False, 'truncate': True}
    return instance('PixelMath', name, values, texts)

def write(filename, items, title):
    body = []
    icons = []
    for i, (name, inst) in enumerate(items):
        body.append(inst)
        icons.append('   <icon id="%s" instance="%s_instance" xpos="%d" ypos="%d" workspace="Workspace01"/>' % (name, name, 40 + 230 * (i // 12), 40 + 32 * (i % 12)))
    xml = HEADER + '<!-- ' + title + ' -->\n' + '\n'.join(body) + '\n' + '\n'.join(icons) + '\n</xpsm>\n'
    open(os.path.join(OUT, filename), 'w', encoding='utf-8').write(xml)

# ---------- 1. PixelMath : formules ----------
blanshan_transfer = "S=0.15;\nImg1=starless;\nf1= ~((~mtf(~S,$T)/~mtf(~S,Img1))*~Img1);\nmax(Img1,f1)"
blanshan_halo = "S=0.15;\nImg1=starless;\nf2= ((~(~$T/~Img1)-~(~mtf(~S,$T)/~mtf(~S,Img1)))*~Img1);\nf3= (~(~$T/~Img1)-~(~mtf(~S,$T)/~mtf(~S,Img1)));\nmax(Img1,$T-mean(f2,f3))"
blanshan_star = """Img1=starless;
I=1;
M=1;

E1= $T*~(~(Img1/$T)*~$T);
E2= max(E1,($T*E1)+(E1*~E1));

E3= E1*~(~(Img1/E1)*~E1);
E4= max(E3,($T*E3)+(E3*~E3));

E5= E3*~(~(Img1/E3)*~E3);
E6= max(E5,($T*E5)+(E5*~E5));

E7= iif(I==1,E1,iif(I==2,E3,E5));
E8= iif(I==1,E2,iif(I==2,E4,E6));

E9= mean(
$T-($T-iif(I==1,E2,iif(I==2,E4,E6))),
$T*~($T-iif(I==1,E2,iif(I==2,E4,E6))));

max(Img1,iif(M==1,E7,iif(M==2,E8,E9)))"""

pm = [
    pixelmath('Foraxx_SHO', '(Oiii^~Oiii)*Sii + ~(Oiii^~Oiii)*Ha',
              '((Oiii*Ha)^~(Oiii*Ha))*Ha + ~((Oiii*Ha)^~(Oiii*Ha))*Oiii', 'Oiii', new_image=True, new_id='SHO_Foraxx', space='RGB'),
    pixelmath('Foraxx_HOO', 'Ha', '((Oiii*Ha)^~(Oiii*Ha))*Ha + ~((Oiii*Ha)^~(Oiii*Ha))*Oiii', 'Oiii',
              new_image=True, new_id='HOO_Foraxx', space='RGB'),
    pixelmath('HOO_simple', 'Ha', 'Oiii', 'Oiii', new_image=True, new_id='HOO', space='RGB'),
    pixelmath('HOO_Hubble', 'Ha', '0.6*Ha + 0.4*Oiii', 'Oiii', new_image=True, new_id='HOO_Hubble', space='RGB'),
    pixelmath('DualBand_Ha', '$T[0]', new_image=True, new_id='Ha', space='Gray'),
    pixelmath('DualBand_OIII', '($T[1] + $T[2]) / 2', new_image=True, new_id='Oiii', space='Gray'),
    pixelmath('Continuum_Ha', 'k = 0.9;\nHa - k*(R - med(R))', symbols='k', new_image=True, new_id='Ha_cs', space='Gray'),
    pixelmath('Ha_dans_R', 'w = 1.0;\nR + w*Ha_cs', symbols='w', new_image=True, new_id='R_Ha', space='Gray'),
    pixelmath('Etoiles_screen', '~((~starless) * (~stars))', new_image=True, new_id='Final', space='SameAsTarget'),
    pixelmath('Etoiles_HOO_synth', 'Ha_stars', '0.2*Ha_stars + 0.8*Oiii_stars', 'Oiii_stars', new_image=True, new_id='Stars_HOO', space='RGB'),
    pixelmath('Blanshan_Transfer', blanshan_transfer, symbols='S, Img1, f1'),
    pixelmath('Blanshan_Halo', blanshan_halo, symbols='S, Img1, f2, f3'),
    pixelmath('Blanshan_Star', blanshan_star, symbols='I, M, Img1, E1, E2, E3, E4, E5, E6, E7, E8, E9'),
]
SRC_V3 = open(os.environ.get('SRC_V3', os.path.join(os.path.dirname(__file__), 'src_icons', 'FromLukeAndBill.xpsm')), encoding='utf-8').read()
def import_raw(src_id, name):
    m = re.search(r'<instance class="PixelMath" version="\d+" id="%s_instance">.*?</instance>' % src_id, SRC_V3, re.S)
    t = re.sub(r'\n\s*<time[^>]*/>', '', m.group(0))
    t = t.replace('id="%s_instance"' % src_id, 'id="%s_instance"' % name, 1)
    return name, t
pm += [import_raw('StarReductionM1_V3', 'Blanshan_Transfer_V3'),
       import_raw('StarReductionM2_V3', 'Blanshan_Halo_V3'),
       import_raw('StarReductionM3_V3', 'Blanshan_Star_V3')]
write('01-PixelMath-formules.xpsm', pm, 'Formules PixelMath')

# ---------- 2. RC Astro ----------
bxt = lambda n, co, ss, sh, ns: instance('BlurXTerminator', n, {'correct_only': co, 'sharpen_stars': '%.2f' % ss, 'adjust_star_halos': '%.2f' % sh,
                                                               'auto_nonstellar_psf': True, 'sharpen_nonstellar': '%.2f' % ns})
nxt = lambda n, d, it: instance('NoiseXTerminator', n, {'denoise': '%.2f' % d, 'detail': '0.15', 'iterations': it,
                                                        'enable_color_separation': False, 'enable_frequency_separation': False})
sxt = lambda n, un: instance('StarXTerminator', n, {'output_stars': True, 'unscreen': un})
rc = [
    bxt('BXT_CorrectOnly', True, 0.25, 0.0, 0.50),
    bxt('BXT_RGB', False, 0.25, 0.0, 0.50),
    bxt('BXT_L_Ha', False, 0.25, 0.0, 0.80),
    bxt('BXT_NB_combine', False, 0.25, 0.0, 0.60),
    nxt('NXT_L_Ha', 0.60, 1),
    nxt('NXT_RGB', 0.80, 1),
    nxt('NXT_OIII_SII', 0.75, 1),
    nxt('NXT_final_etire', 0.40, 1),
    sxt('SXT_lineaire', False),
    sxt('SXT_etire', True),
]
write('02-RC-Astro.xpsm', rc, 'RC Astro (licence requise)')

# ---------- 3. Natifs ----------
def lrgb_post(t):
    rows = re.findall(r'<tr>.*?</tr>', t, re.S)
    assert len(rows) == 4
    new_rows = []
    for i, r in enumerate(rows):
        r = re.sub(r'<td id="enabled" value="[^"]*"/>', '<td id="enabled" value="%s"/>' % ('true' if i == 3 else 'false'), r)
        r = re.sub(r'<td id="id">[^<]*</td>|<td id="id"/>', '<td id="id">%s</td>' % ('L' if i == 3 else ''), r)
        r = re.sub(r'<td id="k" value="[^"]*"/>', '<td id="k" value="1.00000"/>', r)
        new_rows.append(r)
    for old, new in zip(rows, new_rows):
        t = t.replace(old, new, 1)
    return t

circle5 = '0x00,0x01,0x01,0x01,0x00,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x00,0x01,0x01,0x01,0x00'
def mt_post(t):
    t, n = re.subn(r'<td id="mask">[^<]*</td>', '<td id="mask">%s</td>' % circle5, t)
    assert n == 1
    return t

nat = [
    instance('LRGBCombination', 'LRGB_ajout_L', {'mL': '0.500', 'mc': '0.400', 'noiseReduction': True}, post=lrgb_post),
    instance('LinearFit', 'LinearFit_ref_Ha', {'rejectLow': '0.000000', 'rejectHigh': '0.920000'}, {'referenceViewId': 'Ha'}),
    instance('SCNR', 'SCNR_vert', {'amount': '1.00', 'protectionMethod': 'AverageNeutral', 'colorToRemove': 'Green'}),
    instance('SCNR', 'SCNR_SHO_partiel', {'amount': '0.70', 'protectionMethod': 'AverageNeutral', 'colorToRemove': 'Green'}),
    instance('LocalHistogramEqualization', 'LHE_150', {'radius': 150, 'slopeLimit': '2.0', 'amount': '0.350', 'circularKernel': True}),
    instance('HDRMultiscaleTransform', 'HDRMT_6', {'numberOfLayers': 6, 'numberOfIterations': 1, 'toLightness': True, 'preserveHue': True, 'lightnessMask': True}),
    instance('MorphologicalTransformation', 'MT_reduction_etoiles', {'operator': 'Selection', 'numberOfIterations': 1, 'amount': '0.60',
                                                                    'selectionPoint': '0.25', 'structureSize': 5}, post=mt_post),
    instance('NarrowbandNormalization', 'NBN_SHO', {'palette': 'Palette_SHO'}),
    instance('NarrowbandNormalization', 'NBN_HOO', {'palette': 'Palette_HOO'}),
    instance('CosmeticCorrection', 'CC_auto_WBPP', {'useAutoDetect': True, 'hotAutoCheck': True, 'hotAutoValue': '2.5',
                                                   'coldAutoCheck': False, 'coldAutoValue': '3.0', 'cfa': False}),
]
write('03-Natifs-PixInsight.xpsm', nat, 'Process natifs')
print('ok')
