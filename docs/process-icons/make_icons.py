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


# ---------- Process sans modèle .xpsm : construits à partir des paramètres du code d'AutoIntegrate ----------
CURVES = json.load(open(os.environ.get('SPFC_CURVES', os.path.join(os.path.dirname(__file__), 'spfc_curves.json'))))

def build(cls, version, name, params):
    """params : liste de (id, valeur, 'v' = attribut value | 't' = texte | 'table0' = table vide)."""
    lines = ['   <instance class="%s" version="%s" id="%s_instance">' % (cls, version, name)]
    for pid, val, kind in params:
        if kind == 'v':
            if isinstance(val, bool):
                val = 'true' if val else 'false'
            lines.append('      <parameter id="%s" value="%s"/>' % (pid, val))
        elif kind == 't':
            lines.append('      <parameter id="%s">%s</parameter>' % (pid, escape(val)))
        elif kind == 'table0':
            lines.append('      <table id="%s" rows="0"/>' % pid)
    lines.append('   </instance>')
    return name, '\n'.join(lines)

def densify(curve, step=2.0, minpoints=20):
    """Courbe de filtre approchée (quelques points) -> mêmes segments, rééchantillonnés tous les 2 nm.
    SPFC refuse une courbe trop courte (« At least 5 items are required »)."""
    v = [float(x) for x in curve.split(',')]
    pts = list(zip(v[0::2], v[1::2]))
    if len(pts) >= minpoints:
        return curve
    out, w = [], pts[0][0]
    while w <= pts[-1][0] + 1e-9:
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            if x0 <= w <= x1:
                y = y0 + (y1 - y0) * (w - x0) / (x1 - x0) if x1 > x0 else y1
                break
        out.append('%g,%.3f' % (w, y))
        w += step
    return ','.join(out)

def spfc(name, rgb='ai', gray='ai_gray', qe=None, nb=None):
    """rgb : 'ai' (filtres Bayer Sony) ou 'astrodon' ; nb : (longueur d'onde, bande passante) pour un master narrowband."""
    qn, qc = CURVES[qe] if qe else ('Ideal QE curve', '1,1.0,500,1.0,1000,1.0,1500,1.0,2000,1.0,2500,1.0')
    gn, gc = CURVES[gray]
    gc = densify(gc)
    rn, rc = CURVES[rgb + '_red']; gnn, gcc = CURVES[rgb + '_green']; bn, bc = CURVES[rgb + '_blue']
    wl, bw = nb if nb else (656.3, 3.0)
    p = [('narrowbandMode', bool(nb), 'v'),
         ('grayFilterTrCurve', gc, 't'), ('grayFilterName', gn, 't'),
         ('redFilterTrCurve', rc, 't'), ('redFilterName', rn, 't'),
         ('greenFilterTrCurve', gcc, 't'), ('greenFilterName', gnn, 't'),
         ('blueFilterTrCurve', bc, 't'), ('blueFilterName', bn, 't'),
         ('grayFilterWavelength', '%.1f' % wl, 'v'), ('grayFilterBandwidth', '%.1f' % bw, 'v'),
         ('redFilterWavelength', '656.3', 'v'), ('redFilterBandwidth', '3.0', 'v'),
         ('greenFilterWavelength', '500.7', 'v'), ('greenFilterBandwidth', '3.0', 'v'),
         ('blueFilterWavelength', '500.7', 'v'), ('blueFilterBandwidth', '3.0', 'v'),
         ('deviceQECurve', qc, 't'), ('deviceQECurveName', qn, 't'),
         ('broadbandIntegrationStepSize', '0.50', 'v'), ('narrowbandIntegrationSteps', '10', 'v'),
         ('rejectionLimit', '0.30', 'v'), ('catalogId', 'GaiaDR3SP', 't'),
         ('minMagnitude', '0.00', 'v'), ('limitMagnitude', '12.00', 'v'), ('autoLimitMagnitude', True, 'v'),
         ('psfStructureLayers', '5', 'v'), ('saturationThreshold', '0.75', 'v'), ('saturationRelative', True, 'v'),
         ('saturationShrinkFactor', '0.10', 'v'), ('psfNoiseLayers', '1', 'v'), ('psfHotPixelFilterRadius', '1', 'v'),
         ('psfNoiseReductionFilterRadius', '0', 'v'), ('psfMinStructureSize', '0', 'v'), ('psfMinSNR', '40.00', 'v'),
         ('psfAllowClusteredSources', False, 'v'), ('psfType', 'PSFType_Auto', 'v'), ('psfGrowth', '1.75', 'v'),
         ('psfMaxStars', '24576', 'v'), ('psfSearchTolerance', '4.00', 'v'),
         ('generateGraphs', False, 'v'), ('generateStarMaps', False, 'v'), ('generateTextFiles', False, 'v')]
    return build('SpectrophotometricFluxCalibration', 1, name, p)

def mgc(name, scale=1024, gray='L'):
    p = [('command', '', 't'), ('useMARSDatabase', True, 'v'),
         ('grayMARSFilter', gray, 't'), ('redMARSFilter', 'R', 't'), ('greenMARSFilter', 'G', 't'), ('blueMARSFilter', 'B', 't'),
         ('referenceImageId', '', 't'), ('gradientScale', str(scale), 'v'), ('structureSeparation', '3', 'v'),
         ('modelSmoothness', '1.00', 'v'), ('minFieldRatio', '0.017', 'v'), ('maxFieldRatio', '0.167', 'v'),
         ('enforceFieldLimits', True, 'v'), ('scaleFactorRK', '1.00', 'v'), ('scaleFactorG', '1.00', 'v'),
         ('scaleFactorB', '1.00', 'v'), ('showGradientModel', True, 'v')]
    return build('MultiscaleGradientCorrection', 1, name, p)

def dbe(name):
    p = [('table0', None, None)]
    p = [('data', None, 'table0'), ('derivativeOrder', '2', 'v'), ('smoothing', '0.250', 'v'), ('ignoreWeights', False, 'v'),
         ('modelId', '', 't'), ('modelWidth', '0', 'v'), ('modelHeight', '0', 'v'), ('downsample', '2', 'v'),
         ('modelSampleFormat', 'f32', 'v'), ('targetCorrection', 'Subtract', 'v'), ('normalize', True, 'v'),
         ('discardModel', True, 'v'), ('replaceTarget', True, 'v'), ('correctedImageId', '', 't'),
         ('correctedImageSampleFormat', 'SameAsTarget', 'v'), ('samples', None, 'table0'),
         ('imageWidth', '0', 'v'), ('imageHeight', '0', 'v'), ('symmetryCenterX', '0.500000', 'v'), ('symmetryCenterY', '0.500000', 'v'),
         ('tolerance', '0.500', 'v'), ('shadowsRelaxation', '3.000', 'v'), ('minSampleFraction', '0.050', 'v'),
         ('defaultSampleRadius', '15', 'v'), ('samplesPerRow', '15', 'v')]
    return build('DynamicBackgroundExtraction', 1, name, p)

def crop(name):
    return instance('DynamicCrop', name)

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
    pixelmath('Foraxx_SHO', '(O^~O)*S + ~(O^~O)*H',
              '((O*H)^~(O*H))*H + ~((O*H)^~(O*H))*O', 'O', new_image=True, new_id='SHO_Foraxx', space='RGB'),
    pixelmath('Foraxx_HOO', 'H', '((O*H)^~(O*H))*H + ~((O*H)^~(O*H))*O', 'O',
              new_image=True, new_id='HOO_Foraxx', space='RGB'),
    pixelmath('HOO_simple', 'H', 'O', 'O', new_image=True, new_id='HOO', space='RGB'),
    pixelmath('HOO_Hubble', 'H', '0.6*H + 0.4*O', 'O', new_image=True, new_id='HOO_Hubble', space='RGB'),
    pixelmath('DualBand_H', '$T[0]', new_image=True, new_id='H', space='Gray'),
    pixelmath('DualBand_O', '($T[1] + $T[2]) / 2', new_image=True, new_id='O', space='Gray'),
    pixelmath('Continuum_H', 'k = 0.9;\nH - k*(R - med(R))', symbols='k', new_image=True, new_id='H_cs', space='Gray'),
    pixelmath('H_dans_R', 'w = 1.0;\nR + w*H_cs', symbols='w', new_image=True, new_id='R_H', space='Gray'),
    pixelmath('Etoiles_screen', '~((~$T) * (~RGB_Stars))', new_image=True, new_id='Final', space='SameAsTarget'),
    pixelmath('Masque_L', 's = 0.14;\nmax(0, (0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2] - s) / (1 - s))', symbols='s', new_image=True, new_id='masque_L', space='Gray'),
    pixelmath('Masque_L_mono', 's = 0.14;\nmax(0, ($T - s) / (1 - s))', symbols='s', new_image=True, new_id='masque_L', space='Gray'),
    pixelmath('Etoiles_HOO_synth', 'H_stars', '0.2*H_stars + 0.8*O_stars', 'O_stars', new_image=True, new_id='Stars_HOO', space='RGB'),
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
    bxt('BXT_L_H', False, 0.25, 0.0, 0.80),
    bxt('BXT_NB_combine', False, 0.25, 0.0, 0.60),
    nxt('NXT_L_H', 0.60, 1),
    nxt('NXT_RGB', 0.80, 1),
    nxt('NXT_O_S', 0.75, 1),
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
    instance('LinearFit', 'LinearFit_ref_H', {'rejectLow': '0.000000', 'rejectHigh': '0.920000'}, {'referenceViewId': 'H'}),
    instance('SCNR', 'SCNR_vert', {'amount': '1.00', 'protectionMethod': 'AverageNeutral', 'colorToRemove': 'Green'}),
    instance('SCNR', 'SCNR_SHO_partiel', {'amount': '0.70', 'protectionMethod': 'AverageNeutral', 'colorToRemove': 'Green'}),
    instance('LocalHistogramEqualization', 'LHE_150', {'radius': 150, 'slopeLimit': '2.0', 'amount': '0.350', 'circularKernel': True}),
    instance('HDRMultiscaleTransform', 'HDRMT_6', {'numberOfLayers': 6, 'numberOfIterations': 1, 'toLightness': True, 'preserveHue': True, 'lightnessMask': True}),
    instance('MorphologicalTransformation', 'MT_reduction_etoiles', {'operator': 'Selection', 'numberOfIterations': 1, 'amount': '0.60',
                                                                    'selectionPoint': '0.25', 'structureSize': 5}, post=mt_post),
    spfc('SPFC_RGB_filtres', rgb='astrodon', qe='qe_imx571'),
    spfc('SPFC_couleur_OSC', rgb='ai'),
    spfc('SPFC_L'),
    spfc('SPFC_H', nb=(656.3, 3.0)),
    spfc('SPFC_O', nb=(500.7, 3.0)),
    spfc('SPFC_S', nb=(672.4, 3.0)),
    mgc('MGC_MARS'),
    mgc('MGC_MARS_H', gray='Ha'),
    mgc('MGC_MARS_O', gray='OIII'),
    dbe('DBE_base'),
    crop('DynamicCrop_base'),
    instance('NarrowbandNormalization', 'NBN_SHO', {'palette': 'Palette_SHO'}),
    instance('NarrowbandNormalization', 'NBN_HOO', {'palette': 'Palette_HOO'}),
    instance('CosmeticCorrection', 'CC_auto_WBPP', {'useAutoDetect': True, 'hotAutoCheck': True, 'hotAutoValue': '2.5',
                                                   'coldAutoCheck': False, 'coldAutoValue': '3.0', 'cfa': False}),
]
write('03-Natifs-PixInsight.xpsm', nat, 'Process natifs')
print('ok')
