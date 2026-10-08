"""Génère les fichiers workflows/Conteneurs-X.xpsm (une colonne par phase : chemin principal, options, rapide).
Réutilise les modèles et fonctions de make_icons.py (instances réelles PixInsight 1.9.3)."""
import os, re, sys, tempfile
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]
sys.argv = [sys.argv[0], tempfile.mkdtemp()]
import short_desc as SD  # noqa: E402
import layout as L  # noqa: E402
import json
from html import unescape as html_unescape
import make_icons as M  # noqa: E402  (génère les icônes unitaires dans un dossier temporaire)

ALL = open(os.environ.get('ALL_XPSM', os.path.join(HERE, 'all.x')), encoding='utf-8').read()

def described(item, text):
    name, t = item
    t = re.sub(r'(<instance [^>]*>)', lambda m: m.group(1) + '\n      <description>%s</description>' % escape(text), t, count=1)
    return name, t

def renamed(item, new):
    name, t = item
    return new, t.replace('id="%s_instance"' % name, 'id="%s_instance"' % new, 1)

# Scripts lancés par une vraie icône Script (et non une icône-note NoOperation).
# (chemin, md5 du fichier installé ou '' si inconnu, paramètres lus par le script, mode de lancement)
# SetiAstro : archive SetiAstroScripts09.19.2026.zip (dépôt 1.9.4 à 1.9.5), md5 calculés sur les fichiers.
# Scripts livrés avec PixInsight : chemin relevé dans des icônes réelles ou dans psf-guard (PixInsight 1.9.5),
# md5 laissé vide (version 1.9.5 du fichier inconnue) : PixInsight ne vérifie alors pas la somme de contrôle.
L_DRAG = ("LANCEMENT : GLISSE cette icône sur l'image cible (le script refuse le mode global : un double-clic suivi de "
          "« Apply Global » n'aboutit pas). ")
L_GLOBAL = ("LANCEMENT : double-clique l'icône, puis clique sur le rond « Apply Global » (ou glisse-la sur une image) : "
            "le dialogue du script s'ouvre. ")
SCRIPTS = {
    'WBPP': ('$PXI_SRCDIR/scripts/BatchPreprocessing/BPP-Main.js', '', [],
             L_GLOBAL + "WBPP 3.x lit ses réglages dans sa propre mémoire (dernière session) et sur la ligne de commande, pas dans les paramètres d'une icône : "
             "cette icône ouvre WBPP, les réglages ci-dessous se font dans son dialogue. Chemin relevé pour WBPP 3.1.0 sous PixInsight 1.9.5 (psf-guard). "),
    'ImageSolver': ('$PXI_SRCDIR/scripts/ImageSolver/ImageSolver.js', '',
             [('metadata_focal', '2939'), ('metadata_useFocal', 'true'), ('metadata_xpixsz', '3.76'), ('metadata_resolution', '0.00007330116739335556'), ('metadata_referenceSystem', 'ICRS'), ('metadata_topocentric', 'false'), ('solver_version', '6.4.2'), ('solver_magnitude', '12'), ('solver_autoMagnitude', 'true'), ('solver_databasePath', 'undefined'), ('solver_generateErrorImg', 'false'), ('solver_structureLayers', '5'), ('solver_minStructureSize', '0'), ('solver_hotPixelFilterRadius', '1'), ('solver_noiseReductionFilterRadius', '0'), ('solver_sensitivity', '0.5'), ('solver_peakResponse', '0.5'), ('solver_brightThreshold', '3'), ('solver_maxStarDistortion', '0.6'), ('solver_autoPSF', 'false'), ('solver_catalogMode', '2'), ('solver_vizierServer', 'https://vizier.cds.unistra.fr/'), ('solver_showStars', 'false'), ('solver_showStarMatches', 'false'), ('solver_showSimplifiedSurfaces', 'false'), ('solver_showDistortion', 'false'), ('solver_generateDistortModel', 'false'), ('solver_catalog', 'PPMXL'), ('solver_distortionCorrection', 'true'), ('solver_rbfType', '101'), ('solver_maxSplinePoints', '4000'), ('solver_splineOrder', '2'), ('solver_splineSmoothing', '0.005'), ('solver_enableSimplifier', 'true'), ('solver_simplifierRejectFraction', '0.1'), ('solver_outlierDetectionRadius', '160'), ('solver_outlierDetectionMinThreshold', '4'), ('solver_outlierDetectionSigma', '5'), ('solver_useActive', 'true'), ('solver_outSuffix', '_ast'), ('solver_projection', '0'), ('solver_projectionOriginMode', '0'), ('solver_restrictToHQStars', 'false'), ('solver_intersectionMode', '1'), ('solver_tryApparentCoordinates', 'true'), ('solver_tryExhaustiveInitialAlignment', 'false')],
             L_DRAG),
    'Combinaison_RGB': ('$PXI_SRCDIR/scripts/clodoweg/Combiner_RGB.js', '',
             [('red', 'R'), ('green', 'G'), ('blue', 'B'), ('newId', 'RGB'), ('closeSources', 'true'), ('copyKeywords', 'true'), ('garder', '')], L_GLOBAL),
    'Masque_L': ('$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js', '', [('mode', 'attacher'), ('s', '0.14'), ('flou', '2'), ('nom', 'masque_L')], L_DRAG),
    'Masque_L_source': ('$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js', '', [('mode', 'attacher'), ('s', '0.20'), ('gamma', '2'), ('flou', '2'), ('nom', 'masque_L'), ('source', 'L'), ('exclure', 'RGB_stars'), ('exclureGain', '4')], L_DRAG),
    'Masque_retirer': ('$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js', '', [('mode', 'retirer'), ('nom', 'masque_L')], L_DRAG),
    'Fermer_vues': ('$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js', '', [('views', '')], L_GLOBAL),
    'Renommer_auto': ('$PXI_SRCDIR/scripts/clodoweg/Renommer_auto.js', '', [], L_GLOBAL),
    'SCNR_etoiles_vert': ('$PXI_SRCDIR/scripts/clodoweg/Etoiles_auto.js', '', [('vue', 'RGB_stars'), ('amount', '0'), ('satAmount', '0'), ('scnr', 'true'), ('violet', 'false')], L_DRAG),
    'SCNR_etoiles_violet': ('$PXI_SRCDIR/scripts/clodoweg/Etoiles_auto.js', '', [('vue', 'RGB_stars'), ('amount', '0'), ('satAmount', '0'), ('scnr', 'false'), ('violet', 'true')], L_DRAG),   # Invert, SCNR vert 1,0, Invert sur RGB_stars : violet retiré (demande de l'utilisateur)   # SCNR vert 1,0 sur RGB_stars seulement, quelle que soit l'image (demande de l'utilisateur)
    'Fond_desature': ('$PXI_SRCDIR/scripts/clodoweg/Fond_desature.js', '', [('debut', '0.03'), ('fin', '0.15'), ('violetFin', '0.30'), ('flou', '3')], L_DRAG),
    'Fond_auto': ('$PXI_SRCDIR/scripts/clodoweg/Fond_auto.js', '', [('cible', '0.12'), ('tolerance', '0.005'), ('grille', '8')], L_DRAG),
    'Nettoyage_sans_etoiles': ('$PXI_SRCDIR/scripts/clodoweg/Nettoyage_sans_etoiles.js', '', [('etoiles', 'RGB_stars'), ('seuilBas', '0.05'), ('seuilHaut', '0.12'), ('etendue', '25'), ('passes', '3'), ('protege', '0.08'), ('structure', '0.15'), ('compact', '0.05'), ('tresBrillant', '0.05'), ('etendue2', '80'), ('gain', '3'), ('gain2', '8'), ('afficherMasque', 'false')], L_DRAG),
    'Saturation_grosses': ('$PXI_SRCDIR/scripts/clodoweg/Saturation_grosses.js', '', [('vue', 'RGB_stars'), ('taille', '7'), ('seuil', '0.15'), ('etendue', '12'), ('passes', '1')], L_DRAG),   # option P4 : courbe de saturation de l'utilisateur sur les grosses étoiles seulement (demande de l'utilisateur)
    'Etoiles_grosses': ('$PXI_SRCDIR/scripts/clodoweg/Etoiles_grosses.js', '', [('taille', '7'), ('seuil', '0.15'), ('etendue', '12'), ('force', '0.80'), ('afficherMasque', 'false')], L_DRAG),   # demande de l'utilisateur : réduire seulement les grosses étoiles
    'Export_TIFF': ('$PXI_SRCDIR/scripts/clodoweg/Export_TIFF.js', '', [('nom', ''), ('suffixe', ''), ('dossier', ''), ('icc', 'true')], L_DRAG),   # plus aucune vue fermée (demande de l'utilisateur)
    'Crop_reference': ('$PXI_SRCDIR/scripts/clodoweg/Crop_commun.js', '', [('mode', 'reference'), ('nom', 'Crop_ref')], L_GLOBAL),   # option P1 (demande de l'utilisateur) : image minimum + DynamicCrop
    'Crop_appliquer': ('$PXI_SRCDIR/scripts/clodoweg/Crop_commun.js', '', [('mode', 'appliquer'), ('nom', 'Crop_ref')], L_GLOBAL),   # même crop sur toutes les images ouvertes
    'Binning_x2': ('$PXI_SRCDIR/scripts/clodoweg/Binning_x2.js', '', [('facteur', '2')], L_GLOBAL),   # demande de l'utilisateur : binning logiciel de toutes les images
    'EZ_Soft_Stretch': ('$PXI_SRCDIR/scripts/EZProcessingSuite/EZ_SoftStretch.js', '', [], L_GLOBAL + "Ce script ne lit pas de paramètres d'icône : réglages dans sa fenêtre (gardés d'une fois sur l'autre). "),   # EZ Processing Suite (Elveteek), option d'étirement (demande de l'utilisateur)
    'CombineHaWithRGB': ('$PXI_SRCDIR/scripts/Toolbox/CombineHaToRGB.js', '140cbb0fc118263dc1d71b8e9e39f0e1', [('alphaView', 'HaNB'), ('amount', '2'), ('beta', '0.2'), ('linear', 'true'), ('rgbLinked', 'true'), ('bg', '0.05'), ('invertMask', 'true'), ('sigma', '0')], L_DRAG),   # PixInsight Toolbox de Jürgen Terpe (test, demande de l'utilisateur)
    'DarkStructureEnhance': ('$PXI_SRCDIR/scripts/misc/DarkStructureEnhance.js', '', [], L_GLOBAL + "Ce script ne lit pas de paramètres d'icône : les réglages se font dans son dialogue. "),   # script livré avec PixInsight (test)
    'Sharp_MMT': ('$PXI_SRCDIR/scripts/clodoweg/Sharp_MMT.js', '', [('biais', '0.04'), ('premiere', '2'), ('derniere', '4'), ('couches', '5')], L_DRAG),   # instance MMT de l'utilisateur
    'Fond_auto_clair': ('$PXI_SRCDIR/scripts/clodoweg/Fond_auto.js', '', [('cible', '0.14'), ('tolerance', '0.005'), ('grille', '8')], L_DRAG),
    'Solver_auto': ('$PXI_SRCDIR/scripts/clodoweg/GC_Solver_auto.js', '', [('gradient', 'false'), ('solve', 'true'), ('solveTout', 'true'), ('defaultDate', '2020-01-01T00:00:00')], L_GLOBAL),
    'Lineaire_rapide': ('$PXI_SRCDIR/scripts/clodoweg/Lineaire_auto.js', '', [('etapes', '')], L_GLOBAL),   # P3_rapide : une seule icône (demande de l'utilisateur)
    'Gradient_auto_rapide': ('$PXI_SRCDIR/scripts/clodoweg/Gradient_auto.js', '', [], L_GLOBAL),   # GradientCorrection seule, sans ImageSolver (demande de l'utilisateur)
    'ImageSolver_Date': ('$PXI_SRCDIR/scripts/clodoweg/ImageSolver_Date.js', '', [('defaultDate', '2020-01-01T00:00:00')], L_DRAG),
    'LinearPatternSubtraction': ('$PXI_SRCDIR/scripts/clodoweg/LPS_UnClic.js', '',
             [('correctColumns', 'false'), ('correctEntireImage', 'true'), ('defectTableFilePath', ''), ('layersToRemove', '9'),
              ('rejectionLimit', '3'), ('globalRejection', 'true'), ('globalRejectionLimit', '5'), ('autoBackground', 'true'),
              ('backgroundReferenceLeft', '0'), ('backgroundReferenceTop', '0'), ('backgroundReferenceWidth', '512'), ('backgroundReferenceHeight', '512'),
              ('allOpenImages', 'true'), ('closeWorkingImages', 'true')],
             L_DRAG + "Script LPS_UnClic.js de la fiche (moteur de Vicent Peris, sans dialogue). "),
    'Statistical_Stretch': ('$PXI_SRCDIR/scripts/statisticalstretch.js', 'defab45bb4e2f33db39a7bb016cdefb0',
             [('targetMedian', '0.25'), ('curvesBoost', '0'), ('numIterations', '1'), ('normalizeImageRange', 'false'),
              ('linkedStretch', 'true'), ('openDialogbox', 'true'), ('autoConvergence', 'false'), ('blackpointSigma', '5'),
              ('noBlackClip', 'false'), ('hdrCompress', 'false'), ('hdrAmount', '0.25'), ('hdrKnee', '0.35'),
              ('lumaOnly', 'false'), ('lumaMode', 'rec709'), ('lumaBlend', '0.6')],
             L_DRAG + "Le dialogue s'ouvre avec les valeurs de l'icône (openDialogbox = true) ; pour étirer directement sans dialogue, mets openDialogbox à false. "),
    'Star_Stretch': ('$PXI_SRCDIR/scripts/star_stretch.js', '69a1ee6db4e9f5374c2cddb1e5a7f4ae',
             [('amount', '6'), ('satAmount', '1.3'), ('removeGreen', 'true'), ('showPreview', 'false')],
             L_DRAG + "Glisse-la sur l'image d'étoiles linéaire : le dialogue s'ouvre avec Stretch Amount 6 (choix de la fiche ; défaut du script 5) et Color Boost 1,3. "),
    'Halo_B_Gon': ('$PXI_SRCDIR/scripts/Halo-B-Gon.js', 'b9427e718e2b9760704c8c738e0893b7', [],
             L_GLOBAL + "Ce script ne lit pas de paramètres d'icône : les réglages se font dans son dialogue. "),
    'NB_to_RGB_Stars': ('$PXI_SRCDIR/scripts/NBtoRGBStars.js', '0fae2f23d6f23037fb118fd1ef749592', [],
             L_DRAG + "La version 1.6 du script ne relit pas les paramètres d'icône : choisis les vues H, O (et S) et les réglages dans son dialogue. "),
    'Continuum_auto': ('$PXI_SRCDIR/scripts/ContinuumSubtraction.js', 'e795144823fb111101f269c22eaaf8cf',
             [('applyNoiseReduction', 'false'), ('noiseReductionMethod', 'NoiseXterminator'), ('starrySelected', 'true'),
              ('outputLinearImageOnly', 'true'), ('aiModel', '2.0.0')],
             L_GLOBAL + "Préréglé pour ce workflow : images avec étoiles (Starry), sortie linéaire seule (Output Linear Image Only, pour injecter HaNB en linéaire), "
             "sans réduction de bruit intégrée (NXT se fait à part). "),
    'Perfect_Palette_Picker': ('$PXI_SRCDIR/scripts/PerfectPalettePicker.js', '0ffff6a0fb869acfc4f9ee3ad81b6338', [],
             L_GLOBAL + "Ce script ne lit pas de paramètres d'icône : choisis les vues et Linear Input Data dans son dialogue. "),
    'Find_Background': ('$PXI_SRCDIR/scripts/FindBackground.js', '4af61e322ea5149f93fdcfe6ef0e62bd',
             [('filterAvg', 'true'), ('filterSdev', 'true'), ('filterPoisonIndex', 'false'), ('filterMAAD', 'false'),
              ('filterObjects', 'false'), ('printInformation', 'true'), ('generatePreview', 'true'), ('previewName', 'Background'),
              ('slowSearch', 'false'), ('fastSearch', 'true'), ('size', '50'), ('spacingRate', '2'), ('searchGridSize', '100'),
              ('startingPoints', '40')],
             "LANCEMENT : clique d'abord sur l'image pour l'activer, puis GLISSE l'icône dessus (le script travaille sur l'image active et refuse le mode global). "
             "Sans dialogue, il crée directement un aperçu nommé 'Background' (recherche rapide, réglages par défaut du script). "),
    'CorrectMagentaStars': ('$PXI_SRCDIR/scripts/CorrectMagentaStars/CorrectMagentaStars.js', '',
             [('scnrAmount', '0.8'), ('scnrPresLight', 'true')],
             "LANCEMENT : GLISSE l'icône sur l'image : la correction s'applique DIRECTEMENT, sans dialogue, avec Amount 0,8 (en global, elle s'applique à l'image active). "
             "Pour changer l'Amount, double-clique l'icône et modifie scnrAmount (0 à 1). "),
}
MD5_NOTE = {True: ("SOMME DE CONTRÔLE : l'icône contient l'empreinte MD5 de la version actuelle du script ; après une mise à jour du script, PixInsight bloque l'icône : "
                   "double-clique-la, efface le champ MD5 et réenregistre-la. "),
            False: "Le champ MD5 est vide : PixInsight exécute le script installé sans vérifier sa version. "}

def script(name, text):
    path, md5, params, launch = SCRIPTS[name]
    text = re.sub(r"Icône-note[^.]*\.\s*", "", text).replace("ÉTAPE MANUELLE — ", "SCRIPT — ", 1)
    rows = ''.join('\n         <tr>\n            <td id="id">%s</td>\n            <td id="value">%s</td>\n         </tr>' % (escape(k), escape(v)) for k, v in params)
    table = ('\n      <table id="parameters" rows="%d">%s\n      </table>' % (len(params), rows)) if params else '\n      <table id="parameters" rows="0"/>'
    return name, ('   <instance class="Script" version="256" id="%s_instance">\n'
                  '      <description>%s</description>\n'
                  '      <parameter id="filePath">%s</parameter>\n'
                  '      <parameter id="md5sum">%s</parameter>%s\n'
                  '      <parameter id="information"></parameter>\n   </instance>'
                  % (name, escape(launch + MD5_NOTE[bool(md5)] + text), escape(path), md5, table))

def note(name, text):
    if name in SCRIPTS:
        return script(name, text)
    return name, ('   <instance class="NoOperation" version="256" id="%s_instance">\n'
                  '      <description>%s</description>\n   </instance>' % (name, escape(text)))

def raw(src_id, new):
    m = re.search(r'<instance class="[^"]+" version="\d+" id="%s_instance">.*?</instance>' % src_id, ALL, re.S)
    t = re.sub(r'\n\s*<time[^>]*/>', '', m.group(0))
    return new, '   ' + t.replace('id="%s_instance"' % src_id, 'id="%s_instance"' % new, 1)

def curves(name, k=((0, 0), (0.25, 0.19), (0.75, 0.81), (1, 1)), sat=0.65):
    def post(t):
        def table(tid, pts):
            rows = ''.join('\n         <tr>\n            <td id="x" value="%.5f"/>\n            <td id="y" value="%.5f"/>\n         </tr>' % p for p in pts)
            return '<table id="%s" rows="%d">%s\n      </table>' % (tid, len(pts), rows)
        t, n1 = re.subn(r'<table id="K" rows="\d+">.*?</table>', lambda m: table('K', list(k)), t, flags=re.S)
        t, n2 = re.subn(r'<table id="S" rows="\d+">.*?</table>', lambda m: table('S', [(0, 0), (0.5, sat), (1, 1)]), t, flags=re.S)
        assert n1 == 1 and n2 == 1
        return t
    return M.instance('CurvesTransformation', name, post=post)

def ghs(name, b, hp=1.0, lp=0.0, channel='SC_RGB', sf=0.0, sp=0.0):
    return M.instance('GeneralizedHyperbolicStretch', name, {
        'stretchType': 'ST_GeneralisedHyperbolic', 'stretchChannel': channel, 'inverse': False,
        'stretchFactor': '%.3f' % sf, 'localIntensity': '%.3f' % b, 'symmetryPoint': '%.6f' % sp,
        'highlightProtection': '%.6f' % hp, 'shadowProtection': '%.6f' % lp, 'clipType': 'CT_RGBBlend'})

def pm(*a, **k):
    return M.pixelmath(*a, **k)

def opt_lines(t):
    """Texte « quand l'utiliser » d'une option : une idée par ligne (demande de l'utilisateur), découpé aux « ; »."""
    parts = [x.strip() for x in t.split(' ; ')]
    return '\n'.join(parts[:1] + [x[:1].upper() + x[1:] for x in parts[1:]])

def shorten(xml, prefix, base):
    """Remplace la description détaillée par la version courte (préréglé / à régler / si ... ->)."""
    drag = md5 = None
    if xml.lstrip().startswith('<instance class="ProcessContainer"'):
        # conteneur (retour de l'utilisateur) : rien ne disait de le GLISSER ; le rond Apply Global échoue avec des process natifs
        drag = 'cont_global' if '/GC_Solver_auto.js' in xml else 'cont_scripts' if base in ('C_Lineaire_rapide', 'C_Continuum_prep', 'C_Continuum_fin', 'C_RGB_etoiles_rapide') else 'cont'
        if '<description>' not in xml:
            xml = re.sub(r'(<instance class="ProcessContainer" id="[^"]*">)', r'\1\n      <description></description>', xml, count=1)
    elif base in SCRIPTS and 'class="Script"' in xml:
        path, md5, params, launch = SCRIPTS[base]
        drag = launch.startswith(L_DRAG)
        if '/clodoweg/' in path:
            drag = 'dlg'   # script de la fiche avec fenêtre de réglages (demande de l'utilisateur)
    short = escape(SD.text(prefix, base, drag, bool(md5)) if SD.has(prefix, base) else SD.LAUNCH[drag] if drag in ('cont', 'cont_global', 'cont_scripts') else '')
    return re.sub(r'<description>.*?</description>', lambda m: '<description>%s</description>' % short, xml, count=1, flags=re.S)

ASCII = ['Preparation', 'Gradient', 'Lineaire', 'Etirement', 'Couleur', 'Finition', 'Etoiles']
DATA = {'phases': L.PHASES, 'notes': L.PHASE_NOTE, 'ascii': ASCII, 'choices': L.CHOICES, 'defaults': L.DEFAULT, 'inst': {}, 'wf': []}

def header_icon(n):
    name = 'P%d_%s' % (n, ASCII[n - 1])
    return name, ('   <instance class="NoOperation" version="256" id="%s_instance">\n      <description>%s</description>\n   </instance>'
                  % (name, escape('PHASE %d — %s : %s. Colonne de repère, sans effet.' % (n, L.PHASES[n - 1], L.PHASE_NOTE[n - 1]))))

def col_width(names):
    """Largeur d'une colonne d'icônes : nom le plus long (environ 4,4 unités par caractère) + icône + marge."""
    return int(round(90 + 4.4 * max(len(n) for n in names)))

def xs_of(columns):
    """columns : listes de noms par colonne -> abscisse de chaque colonne."""
    xs, x = [], 30
    for names in columns:
        xs.append(x)
        x += col_width(names)
    return xs

def layout(entries, naming):
    """entries : liste de (base, phase, xml avec id __ID__). Une colonne par phase, une icône-titre en haut."""
    phases = sorted({e[1] for e in entries})
    named = [(naming(k, base), base, ph, xml) for k, (base, ph, xml) in enumerate(entries, 1)]
    cols = [[header_icon(ph)[0]] + [n for n, b, p, x in named if p == ph] for ph in phases]
    xs = xs_of(cols)
    insts, icons, col, rows = [], [], -1, 0
    for name, base, ph, xml in named:
        c = phases.index(ph)
        if c != col:
            col, rows = c, 0
            hn, hx = header_icon(ph)
            insts.append(hx)
            icons.append('   <icon id="%s" instance="%s_instance" xpos="%d" ypos="20" workspace="Workspace01"/>' % (hn, hn, xs[c]))
        insts.append(xml.replace('id="__ID___instance"', 'id="%s_instance"' % name, 1))
        icons.append('   <icon id="%s" instance="%s_instance" xpos="%d" ypos="%d" workspace="Workspace01"/>' % (name, name, xs[c], 64 + 30 * rows))
        rows += 1
    return insts, icons

TURBO = {'Turbo_debut'}   # ancien mode Turbo supprimé ; Turbo_debut ajouté ensuite (demande de l'utilisateur, 5 octobre 2026)
RAPIDE = {'C_Lineaire_rapide', 'C_RGB_etoiles_rapide', 'Main_continuum', 'Lineaire_rapide', 'C_P3_rapide', 'C_RGB_etire_rapide', 'C_Fin_rapide', 'C_Etoiles_fond_rapide', 'C_Preparation_rapide', 'Gradient_auto_rapide', 'C_RGB_rapide', 'C_L_rapide', 'C_RGB_fin_rapide', 'C_LRGB_rapide'}
RAPIDE_NOTE = {
    'LRGB': {1: "MODE RAPIDE (galaxies) : dans chaque colonne, une icône R_ remplace les étapes du chemin principal qu'elle cite ; sans icône R_, chemin principal. Ordre (étoiles gardées jusqu'à LRGB) : R_C_Preparation_rapide ; R_Gradient_auto_rapide ; R_Lineaire_rapide (RGB et L) ; GHS_1_premier, GHS_2_contraste, GHS_3_fond sur L ; R_C_RGB_etire_rapide sur RGB ; R_C_LRGB_rapide (LRGB sans étoiles) ; finition. Phase 1 : R_C_Preparation_rapide (double-clic puis Apply Global) à la place de LinearPatternSubtraction, Renommer_auto, Combinaison_RGB et Solver_auto",
             2: "R_Gradient_auto_rapide à la place de toute la phase 2 : GradientCorrection sur toutes les images ouvertes (l'astrométrie est déjà faite par R_C_Preparation_rapide)",
             3: "R_Lineaire_rapide (double-clic puis Apply Global) à la place de C_RGB_lineaire et C_L_lineaire : lance C_RGB_lineaire sur RGB puis C_L_lineaire sur L ; les deux restent linéaires, avec leurs étoiles",
             4: "GHS_1_premier sur L sans étoiles (chemin principal, à régler), puis GHS_2_contraste et GHS_3_fond (chemin principal) sur L ; R_C_RGB_etire_rapide sur RGB (MAS avec étoiles, SXT Unscreen qui crée RGB_stars, SCNR vert sur RGB_stars, GHS fond)",
             5: "R_C_LRGB_rapide sur RGB sans étoiles (L sans étoiles ouverte) à la place de LRGB_ajout_L : L ajoutée (Saturation 0,5)",
             6: "R_C_Fin_rapide sur l'image sans étoiles après LRGB_ajout_L (ou R_C_LRGB_rapide) : HDRMT à 30 %, masque, Courbes, LHE, LHE_fin, Sharp_MMT, masque retiré, NXT_final 0,40 en un seul conteneur (= HDRMT_30, C_Finition, C_Sharp_MMT et NXT_final)",
             7: "R_C_Etoiles_fond_rapide sur l'image sans étoiles finie : Fond_desature, Fond_auto (0,12) sur l'image sans étoiles, étoiles remises (Etoiles_screen), NXT_dernier (0,25), puis Export_TIFF en un seul conteneur"},
    'LHA': {1: "MODE RAPIDE (galaxies) : dans chaque colonne, une icône R_ remplace les étapes du chemin principal qu'elle cite ; sans icône R_, chemin principal. Ordre : R_C_Preparation_rapide ; R_Gradient_auto_rapide ; R_Lineaire_rapide (RGB, L et H), Continuum_auto, H_dans_RGB, C_RGB_bruit (étoiles gardées) ; GHS_1_premier, GHS_2_contraste, GHS_3_fond sur L ; R_C_RGB_etire_rapide sur RGB ; R_C_LRGB_rapide (LRGB sans étoiles) ; finition. Phase 1 : R_C_Preparation_rapide (double-clic puis Apply Global) à la place de LinearPatternSubtraction, Renommer_auto, Combinaison_RGB et Solver_auto",
            2: "R_Gradient_auto_rapide à la place de toute la phase 2 : GradientCorrection sur toutes les images ouvertes (R et H compris, pour le continuum) ; l'astrométrie est déjà faite par R_C_Preparation_rapide",
            3: "R_C_P3_rapide glissé sur RGB à la place de E10 à E13 : BXT Correct Only, SPCC, BXT sur RGB ; BXT_L_H sur L et H, NXT_L et SXT_L_lineaire sur L ; puis chemin principal : E14_Continuum_auto (fenêtre), E15_CombineHaWithRGB et E16_C_RGB_bruit glissés sur RGB, E17_Fermer_continuum ; T_Turbo_debut fait P1 à P3 jusqu'à E13",
            4: "GHS_1_premier sur L sans étoiles (chemin principal, à régler), puis GHS_2_contraste et GHS_3_fond (chemin principal) sur L ; R_C_RGB_etire_rapide sur RGB (MAS avec étoiles, SXT Unscreen qui crée RGB_stars, SCNR vert sur RGB_stars, GHS fond)",
            5: "R_C_LRGB_rapide sur RGB sans étoiles (L sans étoiles ouverte) à la place de LRGB_ajout_L : L ajoutée (Saturation 0,5)",
            6: "R_C_Fin_rapide sur l'image sans étoiles après LRGB_ajout_L (ou R_C_LRGB_rapide) : HDRMT à 30 %, masque, Courbes, LHE, LHE_fin, Sharp_MMT, masque retiré, NXT_final 0,40 en un seul conteneur (= HDRMT_30, C_Finition, C_Sharp_MMT et NXT_final)",
            7: "R_C_Etoiles_fond_rapide sur l'image sans étoiles finie : Fond_desature, Fond_auto (0,12) sur l'image sans étoiles, étoiles remises (Etoiles_screen), NXT_dernier (0,25), puis Export_TIFF en un seul conteneur"}}

# Narrowband (demande de l'utilisateur, 8 octobre 2026) : rapides faits phase par phase ; les autres phases gardent le chemin principal
_NB_RAP1 = ("MODE RAPIDE (nébuleuses, en cours) : dans chaque colonne, une icône R_ remplace les étapes du chemin principal qu'elle cite ; sans icône R_, chemin principal. Ordre : R_C_Preparation_rapide, R_Gradient_auto_rapide, R_C_Lineaire_rapide (ou les trois en un : T_Turbo_debut), puis chemin principal à partir de la phase 4. "
            "Phase 1 : R_C_Preparation_rapide (masters seuls ouverts, double-clic puis Apply Global) à la place de LinearPatternSubtraction, Renommer_auto et ImageSolver (phase 2)%s")
_NB_VIDE = "pas encore de rapide narrowband : chemin principal"
for _p, _x in (('RSHO', ", Combinaison_RGB comprise (RGB des étoiles)"), ('SHO', ""), ('HOO', "")):
    RAPIDE_NOTE[_p] = {k: _NB_VIDE for k in range(2, 8)}
    RAPIDE_NOTE[_p][1] = _NB_RAP1 % _x
    RAPIDE_NOTE[_p][2] = "R_Gradient_auto_rapide (double-clic puis Apply Global) à la place de toute la phase 2 (ImageSolver, SPFC, MGC + MARS, GradientCorrection) : GradientCorrection sur toutes les images ouvertes (%s) ; l'astrométrie est déjà faite par R_C_Preparation_rapide" % ('S, H, O et RGB' if _p == 'RSHO' else 'S, H, O' if _p == 'SHO' else 'H, O')
    RAPIDE_NOTE[_p][3] = "R_C_Lineaire_rapide (double-clic puis Apply Global) à la place de toute la phase 3 : combinaison, %s, extraction des canaux (vues %s linéaires sans étoiles) ; masters et images linéaires inutiles fermés%s" % (
        'C_HOO_lineaire (BXT, SXT, NXT)' if _p == 'HOO' else 'C_SHO_lineaire (BXT, SXT, NXT)', 'H, O' if _p == 'HOO' else 'S, H, O',
        ' ; aussi C_RGB_lineaire sur RGB (BXT Correct Only, SPCC, BXT, NXT : RGB reste linéaire avec ses étoiles)' if _p == 'RSHO' else ' ; étoiles S_stars, H_stars, O_stars extraites de SHO_stars' if _p == 'SHO' else ' ; HOO_stars gardée')
RAPIDE_NOTE['RSHO'][3] += " ; AVEC CONTINUUM (option) : ensuite Opt_C_Continuum_prep, Opt_Continuum_SHO (fenêtre, Starless), Opt_C_Continuum_fin, avant GHS_1_premier"
RAPIDE_NOTE['RSHO'][4] = "GHS_1_premier, GHS_2_contraste, GHS_3_fond sur S, H, O (chemin principal, à régler) ; R_C_RGB_etoiles_rapide (double-clic puis Apply Global) à la place de MAS, SXT_RGB_etire, SCNR_etoiles_vert et Fermer_RGB : crée RGB_stars, ferme le RGB sans étoiles"

def layout_all(main, opts, rapide=None, notes=None, turbo=None):
    """Une colonne par phase : icône-titre, étapes du chemin principal (E01…), puis icône « options » et options (Opt_…)."""
    insts, icons = [], []
    phases = sorted({e[1] for e in main} | {e[1] for e in opts})
    numbered, k = [], -1 if main and main[0][0] in ('LinearPatternSubtraction', 'C_Preparation_rapide') else 0   # LPS (ou la préparation rapide) = E00
    for ph in phases:
        for b, p, xml in main:
            if p == ph:
                k += 1
                numbered.append(('E%02d_%s' % (k, b), p, xml))
    cols = [[header_icon(ph)[0], 'P%d_options' % ph, 'P%d_rapide' % ph] + [n for n, p, x in numbered if p == ph] + ['Opt_%s' % b for b, p, x in opts if p == ph]
            + ['R_%s' % b for b, p, x in (rapide or []) if p == ph] + ['P%d_turbo' % ph] + ['T_%s' % b for b, p, x in (turbo or []) if p == ph] for ph in phases]
    xs = xs_of(cols)
    for c, ph in enumerate(phases):
        x = xs[c]
        hn, hx = header_icon(ph)
        insts.append(hx)
        icons.append('   <icon id="%s" instance="%s_instance" xpos="%d" ypos="20" workspace="Workspace01"/>' % (hn, hn, x))
        y = 64
        for name, p, xml in numbered:
            if p != ph:
                continue
            if notes and name.endswith('_Statistical_Stretch'):
                y += 16   # LRGB / LHaRGB : petit espace entre les 3 GHS (L) et Statistical_Stretch, Star_Stretch, Etoiles_LRGB
            insts.append(xml.replace('id="__ID___instance"', 'id="%s_instance"' % name, 1))
            icons.append('   <icon id="%s" instance="%s_instance" xpos="%d" ypos="%d" workspace="Workspace01"/>' % (name, name, x, y))
            y += 30
        mine = [e for e in opts if e[1] == ph]
        if mine:
            y += 16
            on = 'P%d_options' % ph
            insts.append('   <instance class="NoOperation" version="256" id="%s_instance">\n      <description>%s</description>\n   </instance>'
                         % (on, escape('OPTIONS de la phase %d — %s : à utiliser seulement si besoin (la description de chaque icône dit quand). Icône de repère, sans effet.' % (ph, L.PHASES[ph - 1]))))
            icons.append('   <icon id="%s" instance="%s_instance" xpos="%d" ypos="%d" workspace="Workspace01"/>' % (on, on, x, y))
            y += 34
            for b, p, xml in mine:
                name = 'Opt_%s' % b
                insts.append(xml.replace('id="__ID___instance"', 'id="%s_instance"' % name, 1))
                icons.append('   <icon id="%s" instance="%s_instance" xpos="%d" ypos="%d" workspace="Workspace01"/>' % (name, name, x, y))
                y += 30
        if notes:   # groupe P#_rapide (demande de l'utilisateur) : dans toutes les colonnes des fichiers qui ont un mode rapide
            y += 16
            rn = 'P%d_rapide' % ph
            insts.append('   <instance class="NoOperation" version="256" id="%s_instance">\n      <description>%s</description>\n   </instance>'
                         % (rn, escape('MODE RAPIDE, phase %d — %s : %s. Icône de repère, sans effet.' % (ph, L.PHASES[ph - 1], notes[ph]))))
            icons.append('   <icon id="%s" instance="%s_instance" xpos="%d" ypos="%d" workspace="Workspace01"/>' % (rn, rn, x, y))
            y += 34
            for b, p, xml in (rapide or []):
                if p != ph:
                    continue
                name = 'R_%s' % b
                insts.append(xml.replace('id="__ID___instance"', 'id="%s_instance"' % name, 1))
                icons.append('   <icon id="%s" instance="%s_instance" xpos="%d" ypos="%d" workspace="Workspace01"/>' % (name, name, x, y))
                y += 30
        mine_t = [e for e in (turbo or []) if e[1] == ph]
        if mine_t:   # groupe P#_turbo (demande de l'utilisateur) : seulement dans les colonnes qui ont une icône Turbo
            y += 16
            tn = 'P%d_turbo' % ph
            insts.append('   <instance class="NoOperation" version="256" id="%s_instance">\n      <description>%s</description>\n   </instance>'
                         % (tn, escape('MODE TURBO, phase %d — %s : une icône T_ enchaîne en un clic les étapes de plusieurs icônes rapides (R_) ; elle les contient, les icônes R_ ne sont pas nécessaires. Icône de repère, sans effet.' % (ph, L.PHASES[ph - 1]))))
            icons.append('   <icon id="%s" instance="%s_instance" xpos="%d" ypos="%d" workspace="Workspace01"/>' % (tn, tn, x, y))
            y += 34
            for b, p, xml in mine_t:
                name = 'T_%s' % b
                insts.append(xml.replace('id="__ID___instance"', 'id="%s_instance"' % name, 1))
                icons.append('   <icon id="%s" instance="%s_instance" xpos="%d" ypos="%d" workspace="Workspace01"/>' % (name, name, x, y))
                y += 30
    return insts, icons

CONT_LAYOUT = {}   # prefix -> (fichier Conteneurs, titre, insts, icons) : le mode rapide est ajouté en bas du même fichier

def save(filename, title, insts, icons):
    xml = M.HEADER + '<!-- ' + escape(title) + ' -->\n' + '\n'.join(insts) + '\n' + '\n'.join(icons) + '\n</xpsm>\n'
    # retours à la ligne des descriptions en &#10; (test de l'utilisateur, 5 octobre 2026) : un fichier converti en CRLF
    # (git sous Windows) donne sinon des CR que PixInsight affiche mal (lignes inversées, lignes vides en haut)
    xml = re.sub(r'<description>(.*?)</description>', lambda m: '<description>%s</description>' % m.group(1).strip().replace('\n', '&#10;'), xml, flags=re.S)
    open(os.path.join(OUT, filename), 'w', encoding='utf-8').write(xml)

def nested(xml):
    """Instance d'une icône -> instance imbriquée dans un ProcessContainer (format des icônes de référence)."""
    x = re.sub(r'\s*<description>.*?</description>', '', xml, count=1, flags=re.S)
    x = x.replace(' id="__ID___instance"', ' enabled="true"', 1)
    x = no_dialog(x)
    return '\n'.join('   ' + l for l in x.splitlines())

def no_dialog(x):
    """Script de la fiche dans un conteneur : paramètre dialogue = false (exécution directe, sans fenêtre de réglages)."""
    if 'class="Script"' not in x or '/clodoweg/' not in x or '<td id="id">dialogue</td>' in x:
        return x
    row = '\n         <tr>\n            <td id="id">dialogue</td>\n            <td id="value">false</td>\n         </tr>'
    m = re.search(r'<table id="parameters" rows="(\d+)"(/>|>)', x)
    if m.group(2) == '/>':
        return x.replace(m.group(0), '<table id="parameters" rows="1">%s\n      </table>' % row, 1)
    x = x.replace(m.group(0), '<table id="parameters" rows="%d">' % (int(m.group(1)) + 1), 1)
    i = x.index('</table>', x.index('<table id="parameters"'))
    return x[:i].rstrip() + row + '\n      ' + x[i:]

def container(name, xmls):
    return '   <instance class="ProcessContainer" id="%s_instance">\n%s\n   </instance>' % (name, '\n'.join(nested(x) for x in xmls))


def fermer(icon, views):
    """Icône Script Fermer_vues réglée pour fermer les vues données (dernière étape d'un conteneur)."""
    n, x = script('Fermer_vues', '')
    a = '<td id="id">views</td>\n            <td id="value"></td>'
    assert a in x
    x = x.replace(a, '<td id="id">views</td>\n            <td id="value">%s</td>' % views)
    return icon, x.replace('id="Fermer_vues_instance"', 'id="%s_instance"' % icon, 1)

def curves_cs(name, c, s):
    """CurvesTransformation : seulement les courbes c (chrominance) et S (saturation), le reste à l'identité."""
    def post(t):
        def table(tid, pts):
            rows = ''.join('\n         <tr>\n            <td id="x" value="%.5f"/>\n            <td id="y" value="%.5f"/>\n         </tr>' % p for p in pts)
            return '<table id="%s" rows="%d">%s\n      </table>' % (tid, len(pts), rows)
        for tid, pts in (('K', [(0, 0), (1, 1)]), ('c', c), ('S', s)):
            t, n = re.subn(r'<table id="%s" rows="\d+">.*?</table>' % tid, lambda m: table(tid, pts), t, flags=re.S)
            assert n == 1
        return t
    return M.instance('CurvesTransformation', name, post=post)

def boost_final_items(doux=False):
    """Image finie (étoiles comprises) : masque tiré de L sans étoiles, étoiles de RGB_stars retirées, courbes c et S
    (réglage de l'utilisateur : c 0,46094 -> 0,53646, S 0,46354 -> 0,54167), masque retiré.
    doux (demande de l'utilisateur) : même masque, montée des courbes divisée par deux (c -> 0,49870, S -> 0,50261)."""
    c, s = ((0.46094, 0.49870), (0.46354, 0.50261)) if doux else ((0.46094, 0.53646), (0.46354, 0.54167))
    return [script('Masque_L_source', ''), curves_cs('Courbes_boost_final', [(0, 0), c, (1, 1)], [(0, 0), s, (1, 1)]),
            script('Masque_retirer', '')]

def boost_final(doux=False):
    items = boost_final_items(doux)
    name = 'Boost_final_doux' if doux else 'Boost_final'
    return name, container(name, [x.replace('id="%s_instance"' % n, 'id="__ID___instance"', 1) for n, x in items])

def hdrmt_items(a):
    """Copie de l'image, HDRMT sur l'image, puis mélange a·résultat + (1 − a)·copie, copie fermée."""
    return (pm('HDR_copie', '$T', new_image=True, new_id='HDR_avant'),
            M.instance('HDRMultiscaleTransform', 'HDRMT', {'numberOfLayers': 6, 'numberOfIterations': 1, 'toLightness': True, 'preserveHue': True, 'lightnessMask': True}),
            pm('HDR_melange', 'a = %s;\na*$T + (1 - a)*HDR_avant' % a, symbols='a'), fermer('Fermer_HDR_avant', 'HDR_avant'))

def _cont(name, items):
    return name, container(name, [x.replace('id="%s_instance"' % n, 'id="__ID___instance"', 1) for n, x in items])

def hdrmt_50():
    """HDRMT à 50 %."""
    return _cont('HDRMT_50', hdrmt_items('0.5'))

def hdrmt_eclat_items():
    """HDRMT à 40 % (détail du cœur) puis Boost_finition_light (éclat et chaleur rendus au cœur, que HDRMT assombrit et ternit)."""
    boost = [script('Masque_L', ''), curves('Courbes_boost', k=((0, 0), (0.25, 0.24), (0.75, 0.76), (1, 1)), sat=0.57),
             M.instance('LocalHistogramEqualization', 'LHE_moyen', {'radius': 80, 'histogramBins': 'Bit10', 'slopeLimit': '2.0', 'amount': '0.120', 'circularKernel': True}),
             script('Masque_retirer', '')]
    return list(hdrmt_items('0.4')) + boost

def hdrmt_eclat():
    return _cont('HDRMT_eclat', hdrmt_eclat_items())

def boost_container(name='Boost_finition', k=((0, 0), (0.25, 0.23), (0.75, 0.77), (1, 1)), sat=0.60, amount='0.200'):
    """Option de finition en un glisser : petite courbe (contraste + saturation) puis LHE à rayon moyen. Rejouable."""
    parts = []
    for item in (script('Masque_L', ''), curves('Courbes_boost', k=k, sat=sat),
                 M.instance('LocalHistogramEqualization', 'LHE_moyen', {'radius': 80, 'histogramBins': 'Bit10', 'slopeLimit': '2.0', 'amount': amount, 'circularKernel': True}),
                 script('Masque_retirer', '')):
        n, x = item
        parts.append(x.replace('id="%s_instance"' % n, 'id="__ID___instance"', 1))
    return name, container(name, parts)

def solver_container():
    """Icône ImageSolver en un glisser : ImageSolver_Date.js ajoute la date si elle manque, puis résout l'image avec le moteur
    d'ImageSolver (#include, comme WBPP) et les réglages du matériel. Pas de ProcessContainer : ImageSolver y échoue (« The image is already being processed »)."""
    name, x = script('ImageSolver_Date', '')
    path, md5, params, launch = SCRIPTS['ImageSolver']
    extra = list(params)   # réglages d'ImageSolver lus par son moteur, inclus comme bibliothèque dans ImageSolver_Date.js
    rows = ''.join('\n         <tr>\n            <td id="id">%s</td>\n            <td id="value">%s</td>\n         </tr>' % (escape(k), escape(v)) for k, v in extra)
    x, n = re.subn(r'<table id="parameters" rows="(\d+)">(.*?)\n      </table>',
                   lambda m: '<table id="parameters" rows="%d">%s%s\n      </table>' % (int(m.group(1)) + len(extra), m.group(2), rows), x, count=1, flags=re.S)
    assert n == 1
    return 'ImageSolver', x.replace('id="ImageSolver_Date_instance"', 'id="ImageSolver_instance"', 1)

def gc_solver(base='Solver_auto'):
    """Mode rapide (demande de l'utilisateur) : ImageSolver sur les images ouvertes (base Solver_auto), avec les réglages d'ImageSolver du matériel, comme solver_container."""
    name, x = script(base, '')
    extra = SCRIPTS['ImageSolver'][2]
    rows = ''.join('\n         <tr>\n            <td id="id">%s</td>\n            <td id="value">%s</td>\n         </tr>' % (escape(k), escape(v)) for k, v in extra)
    x, n = re.subn(r'<table id="parameters" rows="(\d+)">(.*?)\n      </table>',
                   lambda m: '<table id="parameters" rows="%d">%s%s\n      </table>' % (int(m.group(1)) + len(extra), m.group(2), rows), x, count=1, flags=re.S)
    assert n == 1
    return name, x

def solver_seul():
    n, x = script('ImageSolver', '')
    return 'ImageSolver_seul', x.replace('id="ImageSolver_instance"', 'id="ImageSolver_seul_instance"', 1)

def label(r):
    g, vals = r.split(':')
    names = dict(L.CHOICES[g][1])
    return ' ou '.join(names[v].split(' (')[0] for v in vals.split('|'))

def write(filename, prefix, title, steps):
    """steps : liste de (item, description). Fichier principal (chemin par défaut) + fichier d'options."""
    entries, prev = [], 1
    for item, desc in steps:
        base = item[0]
        ph = max(L.PHASE[base], prev)
        prev = ph
        item = renamed(item, '__ID__')
        if 'class="NoOperation"' not in item[1] and 'class="ProcessContainer"' not in item[1] and '<description>' not in item[1]:
            item = described(item, desc)
        xml = shorten(item[1], prefix, base)
        r = L.role(prefix, base)
        if base in RAPIDE or base in TURBO:
            tag = '%s.\n\n' % L.when(prefix, base)
        elif r == 'opt':
            tag = 'OPTION — %s.\n\n' % opt_lines(L.when(prefix, base))
        elif not L.is_default(r, prefix):
            tag = 'ALTERNATIVE — %s.\n\n' % label(r)
        else:
            tag = ''
        xml = xml.replace('<description>', '<description>' + escape(tag), 1)
        entries.append((base, ph, r, xml, tag))
    main = [(b, ph, x) for b, ph, r, x, t in entries if L.is_default(r, prefix)]
    opts = [(b, ph, x) for b, ph, r, x, t in entries if not L.is_default(r, prefix)]
    off = 1 if main and main[0][0] == 'LinearPatternSubtraction' else 0   # LinearPatternSubtraction = E00, la suite garde ses numéros
    # Workflow-X et Options-X ne sont plus écrits (demande de l'utilisateur : seulement Conteneurs-X et Rapide-X)
    # Conteneurs-X.xpsm : chemin principal complet, suites sans réglage remplacées par un ProcessContainer
    byb = {b: x for b, ph, x in main}
    used = [c for c in L.CONTAINERS.get(prefix, []) if all(m in byb for m in c[2])]
    member = {m for c in used for m in c[2]}
    cmain, done = [], set()
    for b, ph, x in main:
        if b not in member:
            cmain.append((b, ph, x))
            continue
        for cn, target, members in used:
            if cn not in done and members[0] == b:
                done.add(cn)
                cx = container('__ID__', [byb[m] for m in members])
                cd = SD.LAUNCH['cont'] + "\n\nCONTENEUR : " + ", ".join(members) + ".\n\nSUR : " + target + ".\n\nDouble-clic sur le conteneur pour voir ou changer les réglages de chaque étape."
                cx = cx.replace('<instance class="ProcessContainer" id="__ID___instance">', '<instance class="ProcessContainer" id="__ID___instance">\n      <description>%s</description>' % escape(cd).replace('\n', '&#10;'), 1)
                cmain.append((cn, ph, cx))
    cfn, ctitle = filename.replace('Workflow-', 'Conteneurs-'), title + ' — chemin principal avec conteneurs, options dans leur phase'
    rap = [o for o in opts if o[0] in RAPIDE]
    tur = [o for o in opts if o[0] in TURBO]
    opts = [o for o in opts if o[0] not in RAPIDE and o[0] not in TURBO]
    CONT_LAYOUT[prefix] = (cfn, ctitle) + tuple(layout_all(cmain, opts, rap, RAPIDE_NOTE.get(prefix), tur))
    save(cfn, ctitle, *CONT_LAYOUT[prefix][2:])
    conts = [{'n': cn, 't': target, 'm': members} for cn, target, members in L.CONTAINERS.get(prefix, [])]
    wf = {'id': prefix, 'file': filename, 'title': title, 'steps': [], 'containers': conts, 'def': L.WF_DEFAULT.get(prefix, {})}
    for b, ph, r, x, t in entries:
        key = 'i%d' % len(DATA['inst'])
        for k2, v in DATA['inst'].items():
            if v == x:
                key = k2
                break
        DATA['inst'][key] = x
        d = re.search(r'<description>(.*?)</description>', x, re.S)
        wf['steps'].append({'b': b, 'p': ph, 'r': r, 'k': key, 'w': L.WHEN.get(b, ''), 'd': html_unescape(d.group(1)) if d else SD.text(prefix, b, True if b in SCRIPTS else None)})
    DATA['wf'].append(wf)
    return len(main), len(opts), len(cmain)

# ---------------------------------------------------------------- textes communs
SRC = ' Détails et sources : docs/kb et docs/sources.md (github.com/clodoweg/PixInsight).'
T_WBPP = ("ÉTAPE MANUELLE — WBPP 3.1 (Script › Batch Processing › WeightedBatchPreprocessing). Icône-note : WBPP dépend de tes fichiers et de ton dossier de sortie. "
          "Fichiers : mêmes gain/offset/température/driver/format ; darks de même durée et température (jamais pré-calibrés avec les bias) ; flats par filtre et par session, flat-darks de même durée ; "
          "plusieurs nuits : dossiers SESSION_<date> et Grouping keywords = SESSION. Add Directory, puis vérifie dans l'onglet Calibration que chaque groupe de lights a son dark et son flat. "
          "Réglages : préréglage Maximum quality ; Output pedestal Automatic ; Optimize dark frames décoché ; CosmeticCorrection avec l'icône CC_auto ; caméra couleur : CFA images, motif Auto, Debayer VNG ; "
          "Subframe weighting PSF Signal Weight ; Registration reference Auto, Distortion correction pour les grands champs ; Local normalization activée ; "
          "Rejection Auto (sinon Percentile < 10 images, Winsorized > 10, ESD pour les grands lots) ; Large-scale pixel rejection High ; "
          "Fast Integration automatique dès 150 images par groupe (à décocher pour l'intégration pondérée complète) ; Drizzle par groupe x2 seulement si FWHM < 2 px et 15-20 poses dithérées "
          "(caméra couleur : drizzle CFA Scale 1, Drop shrink 1,0) ; Autocrop et Astrometric solution activés. Contrôle ensuite le journal et les cartes de réjection." + SRC)
T_CROP = ("ÉTAPE MANUELLE — DynamicCrop. Icône-note : le cadre dépend de ton image. Trace le cadre sur un master en excluant les bords mal couverts, glisse le triangle du process sur l'espace de travail pour créer une icône, "
          "puis applique CETTE icône à tous les autres masters (ils sont alignés, le recadrage sera identique).")
T_SOLVER = ("ÉTAPE MANUELLE — ImageSolver (Script › Image Analysis › ImageSolver). Applique-le sur chaque image après recadrage et combinaison (elles effacent la solution), avant SPFC et SPCC. "
            "Réglages : Search coordinates avec le nom de l'objet ; focale et taille de pixel de ton setup ; catalogue Gaia DR3 local (XPSD) ; Distortion correction pour les grands champs.")
T_MGC = ("ÉTAPE MANUELLE — Gradient par MARS : SpectrophotometricFluxCalibration (SPFC) puis MultiscaleGradientCorrection (MGC). Icône-note : SPFC dépend de ton capteur/filtres, MGC de l'emplacement de ta base MARS. "
         "Prérequis : image linéaire, solution astrométrique, bases Gaia DR3/SP et MARS installées (clé à molette de MGC › Add › fichier .xmars). "
         "SPFC (Process › ColorCalibration) : QE curve = ton capteur, sinon Ideal QE curve ; image mono : Gray filter = ton filtre (Narrowband mode + longueur d'onde et bande passante pour H/O/S) ; image couleur : Red/Green/Blue filter = tes filtres ou les filtres Bayer du capteur ; Catalog Gaia DR3/SP ; Automatic limit magnitude coché ; le reste par défaut. SPFC ne modifie pas les pixels (métadonnées de flux pour MGC) ; utilise ensuite les mêmes filtres dans SPCC. "
         "MGC : Use MARS database coché, filtres MARS Gray = L, Red = R, Green = G, Blue = B ; Gradient scale 1024 au départ (512 ou 256 si un gradient reste dans les coins), Structure separation 3 (1-2 pour les bords), Model smoothness 1,0 (3-5 si le modèle ondule), Scale factors 1,0, Show gradient model coché. "
         "Narrowband : MARS DR2 (juin 2026) couvre H et O jusqu'à +75° de déclinaison (SPFC en Narrowband mode, puis les icônes MGC_MARS_H et MGC_MARS_O, filtre MARS Gray = Ha ou OIII) ; S absent de DR2 : icône GradientCorrection ou DBE.")
T_GC = ("ALTERNATIVE — GradientCorrection, valeurs par défaut. Structure protection activée ; Generate gradient model décoché (coche-le pour voir le modèle si le résultat est douteux). "
        "Si des zones claires apparaissent autour des structures sombres : monte Low threshold. Si le modèle a des bords nets : désactive la protection, baisse Scale et Smoothness, puis réactive.")
T_DBE = ("ALTERNATIVE — DynamicBackgroundExtraction. Icône-note : les points dépendent de l'image. Samples per row 10-20 ; Sample radius 10-50 ; Tolerance 0,5 (1,0-1,5 si points rejetés) ; "
         "Shadows relaxation 3 ; Smoothing 0,25 (0,5-1,0 champs nébuleux) ; Correction Subtraction (pollution lumineuse), Division seulement pour le vignettage ; Normalize, Discard model et Replace target cochés. "
         "Retire les points posés sur la nébuleuse. D'un filtre à l'autre, garde les points et ajuste Tolerance.")
T_SPCC = ("SPCC — Average Spiral Galaxy, neutralisation du fond activée. ATTENTION : cette icône contient les filtres Astrodon E-series et le capteur Sony IMX571 de l'auteur du modèle : "
          "remplace-les par TES filtres et TON capteur. Crée une preview sur du fond vide et choisis-la comme référence de fond. Generate graphs décoché (coche-le pour contrôler). "
          "Toujours en linéaire, après le gradient et BXT Correct Only, avant BXT complet.")
T_STAT = ("ÉTAPE MANUELLE — Statistical Stretch (SetiAstro, script v2.3). Alternative à GHS. À chaque passe : point noir = médiane − Blackpoint Sigma × 1,4826 × MAD (jamais sous le minimum), "
          "puis fonction de transfert qui place la médiane sur Target Median. "
          "Target Median 0,25 par défaut (0 à 1) ; avec 0,25, passe ensuite GHS_3_fond pour ramener le fond vers 0,12-0,14 (image finale) ; l'auteur conseille 0,10 pour une cible compacte (galaxie, nébuleuse planétaire), 0,25 pour une grande nébuleuse ; même valeur pour les images à combiner. "
          "Blackpoint Sigma 5,0 (0 à 10) : plus haut = fond protégé et plus sombre, plus bas = plus de signal faible ; Calculate Clipped Pixels estime l'écrêtage. No Black Clip décoché. "
          "Linked Stretch coché pour une image couleur calibrée (décoché : chaque canal séparément, les couleurs bougent) ; sans effet en mono. "
          "Luma Only décoché (Luma Mode rec709, Luma Blend 0,60 : 0 = lié, 1 = luminance seule). Normalize décoché (sinon la médiane dépasse la cible). "
          "Curves Boost 0 (0 à 0,50) : relève les tons au-dessus de la médiane après les passes. HDR Compress décoché (Amount 0,25, Knee 0,35) : comprime les hautes lumières. "
          "Dans l'icône seulement : numIterations 1 (5 au plus), autoConvergence false (jusqu'à 5 passes, arrêt à 0,001 de la cible).")
T_STARSTRETCH = ("ÉTAPE MANUELLE — Star Stretch (SetiAstro, script v2.6) sur l'image d'étoiles LINÉAIRE issue de SXT. Modifie l'image elle-même : garde une copie linéaire. "
                 "Étirement y = 3^a·x / ((3^a − 1)·x + 1). Stretch Amount a = 6 dans l'icône (défaut du script 5 ; 0 à 8, l'auteur conseille la prudence au-delà de 5 : cœurs blancs -> 5,5) : un pixel à 0,01 devient 0,45 à 4, 0,71 à 5, 0,88 à 6. "
                 "Color Boost 1,3 dans l'icône (défaut du script 1,0 ; 0 à 2) : saturation par teinte, 0,4 × Boost sur les rouges, 0,7 × Boost sur les cyans (couleur seulement). "
                 "Remove Green via SCNR coché dans l'icône (SCNR vert pleine force, Average Neutral : retire la teinte cyan-vert des étoiles brillantes, demande de l'utilisateur). Show Preview décoché (aperçu + Refresh Preview).")
T_HALO = ("ÉTAPE MANUELLE — Halo-B-Gon (SetiAstro, script v2.1) sur l'image d'étoiles seule, AVANT Etoiles_screen ; modifie l'image elle-même, garde une copie. "
          "Select stars-only image : l'image d'étoiles étirée, celle de la formule Etoiles_screen (RGB_stars ; NBtoRGB_stars en SHO ; HOO_stars en HOO). "
          "Déjà recombiné : annule Etoiles_screen (Ctrl+Z sur l'image), applique Halo-B-Gon sur l'image d'étoiles, puis relance Etoiles_screen. "
          "Masque de luminosité inversé moins les petites structures (cœurs protégés), puis courbe qui assombrit les tons moyens (0,75 → 0,40). "
          "Reduction Amount, Low par défaut : Extra Low = 1 courbe douce (0,75 → 0,575) ; Low = 1 passe, 1 courbe ; Med = 2 passes × 2 courbes (4) ; High = 3 passes × 3 courbes (9). "
          "ATTENTION : la courbe assombrit aussi les petites étoiles (elles sont surtout faites de tons moyens) ; pour ne réduire que les grosses étoiles et leur halo : icône Etoiles_grosses. "
          "Commence par Extra Low ou Low. Linear Data décoché par défaut ; coché, le script étire (mtf 0,25^5), traite puis rend l'image linéaire : seulement si l'image est encore linéaire.")
T_CMS = ("ÉTAPE MANUELLE — CorrectMagentaStars (Script › Utilities). Sur l'image SHO finale avec étoiles. Amount 0,8 (défaut, 0 à 1). "
         "Le script inverse l'image, retire le vert avec SCNR (le magenta inversé), puis réinverse.")
T_PPP = ("EXPLORER — Perfect Palette Picker (SetiAstro, script v1.3, Script › SetiAstro › Perfect Palette Picker). Icône-note : le chemin du script dépend de ton installation. "
         "Choisis les vues H, O et S (sans étoiles de préférence ; sans S, H le remplace), ou jusqu'à deux images couleur dual-band (HaO3, S2O3). "
         "Linear Input Data coché par défaut : chaque canal est étiré à une médiane de 0,25 ; décoche si tes images sont déjà étirées. Create Palettes : 16 vignettes "
         "(HOO, HOS, HSO, HSS, OHH, OHS, OSH, OSS, SHH, SHO, SOH, SOO, Realistic1, Realistic2, Foraxx, Dynamic Inverse). Clique une vignette pour générer la palette en pleine taille. "
         "Sert à choisir : équilibre ensuite le résultat (NarrowbandNormalization, courbes) et vérifie les couleurs.")
T_NBCM = "OPTION — NBColourMapper (Mike Cranfield, script). Une couche par filtre sans étoiles : H rouge-orangé, O cyan-bleu, S rouge profond ou or ; règle teinte et saturation avec l'aperçu."

def cc():
    return M.instance('CosmeticCorrection', 'CC_auto', {'useAutoDetect': True, 'hotAutoCheck': True, 'hotAutoValue': '2.5', 'coldAutoCheck': False, 'coldAutoValue': '3.0', 'cfa': False})

D_CC = ("CosmeticCorrection pour WBPP : Auto detect, Hot sigma 2,5 (2,2 à 3,0 ; 2,2-2,5 en narrowband, poses longues), Cold désactivé. Coche CFA si caméra couleur. "
        "Ne l'applique pas directement : dans WBPP, sélectionne cette icône comme modèle de correction cosmétique.")
BXT_C = (" Réglages (manuel RC Astro AI4) : données LINÉAIRES obligatoires, avant toute réduction de bruit et avant SXT. Sharpen Stars 0 à 0,5 (défaut 0,25 ; au maximum les étoiles perdent la moitié de leur taille) ; "
         "longue focale : une valeur haute peut laisser des zones sans détail autour des étoiles brillantes, et des halos sombres (baisse la valeur ou monte Adjust Star Halos). "
         "Adjust Star Halos −0,5 à +0,5 (défaut 0 ; plus haut = halos plus larges et plus doux, plus bas = étoiles plus dures). "
         "Automatic PSF coché ; sinon PSF Diameter = FWHM des étoiles en pixels (8 px au plus ; au-delà, réduis l'image de moitié). CDK17 + QHY600 bin 1 : 0,264″/px, donc 2″ de FWHM = 7,6 px, 2,5″ = 9,5 px. "
         "Sharpen Nonstellar 0 à 1 (1 = viser une PSF ponctuelle). Ne pas appliquer deux fois.")
D_BXT_CO = ("BlurXTerminator — Correct Only, AVANT SPCC (manuel RC Astro) : corrige aberrations, coma et tilt sans accentuer. Sur l'image couleur combinée, en linéaire, après le gradient. "
            "Si les aberrations diffèrent d'un filtre à l'autre : applique-le sur chaque master avant de combiner.")
D_SXT_L_ETIRE = ("StarXTerminator sur L ÉTIRÉE (après GHS ou Statistical Stretch et GHS_3_fond), Unscreen coché (image étirée, RC Astro). "
                 "Retirer les étoiles de L après l'étirement enlève aussi leurs halos diffus, qui ressortent en taches rondes si SXT tourne sur L linéaire (constat sur NGC 1532). "
                 "Les étoiles de L (L_stars, déjà étirées) servent ensuite à Etoiles_LRGB_etire.")
D_SXT_LIN = ("StarXTerminator — sur données LINÉAIRES, le plus tôt possible après BXT (RC Astro). Generate star image coché, UNSCREEN DÉCOCHÉ (réservé aux images étirées) : "
             "simple soustraction, couleurs d'étoiles les plus fidèles. N'applique pas l'autoSTF de façon permanente à l'image d'étoiles. Large overlap : décoché (recouvrement des tuiles 20 %) ; coché = 50 %, seulement si un quadrillage apparaît (environ trois fois plus lent selon RC Astro). "
             "AI11 : version complète de préférence (Lite = 75 % de mémoire en moins ; Lite.nonoise plus rapide mais sans bruit dans les zones retirées). Plus de case Linear : détection automatique. "
             "Remove stars, spikes, aureoles et reflections cochés (reflections décoché dans l'instance de référence, coché à la demande de l'utilisateur ; réglages non documentés par RC Astro, sans effet constaté sur le grand reflet d'une étoile brillante de NGC 1532). "
             "Masque noir sur un cœur de galaxie compact : zone protégée du retrait (SXT 2.2.0).")
D_GHS1 = ("GHS, 1er étirement — Stretch factor à 0 : l'icône ne fait rien tant que tu ne l'as pas réglée. Zoome l'histogramme, clique dans l'image sur la zone intéressante la plus faible (sonde 15x15), "
          "Send to SP. Local intensity (b) = 10. Monte Stretch factor jusqu'à un pic d'histogramme à 0,25 (fond lu 0,001 : 6,5 ; 0,002 : 5,5 ; 0,005 : 4,5 ; 0,01 : 3,5). Retire l'autoSTF, active l'aperçu, affine SP. "
          "Image couleur : passe Colour mode sur Colour (clip RGBBlend). Même niveau de fond visé pour toutes les images à combiner. "
          "REPÈRES : après ce 1er étirement, fond à 0,25 (volontairement clair) ; l'image finale visera 0,12-0,14 (30-35 sur 255), jamais 0. "
          "Contrôle : preview sur du fond vide + Process › Image › Statistics (médiane) ; aucun pixel écrêté à 0 dans l'histogramme.")
D_GHS2 = ("GHS, ajout de contraste (passes suivantes) — clique sur une zone qui paraît plate, Send to SP ; Local intensity (b) 4 (3 à 5) ; préréglé : Stretch factor 1 (1 à 2 en général) et SP 0,35 ; remplace SP par la valeur de TA zone plate, au-dessus du fond (0,30-0,45 ; jamais 0,25, le fond s'éclaircirait) ; "
          "baisse HP (ici 0,90) pour protéger les cœurs brillants ; monte LP si le fond devient trop sombre. 1 à 3 passes. Image sans étoiles uniquement (étoiles : Star Stretch). "
          "Aucune grande zone ne doit atteindre 1 ; si la lecture donne 1,0 sur un cœur, baisse HP. "
          "Trop étiré : fond granuleux, cœurs brûlés, couleurs délavées. Pas assez : extensions faibles invisibles, aspect découpé sur du noir.")
D_GHS3 = ("GHS, assombrir le fond sans écrêter — après GHS ou Statistical Stretch. Préréglé pour un fond à 0,23 (après GHS_2) : SP = HP = 0,20, Stretch factor 1, LP = 0, b = 10. Règle SP = HP = fond lu - 0,03 (après Statistical Stretch à 0,25 : 0,22) ; Stretch factor 0,8 à 1,2 jusqu'au fond visé. "
          "Plus propre qu'un point noir en Linear, qui détruit des données. "
          "CIBLE DU FOND FINAL : gris foncé 0,12-0,14 (30-35 sur 255 ; Readout Options › plage entière 8 bits), R = G = B à quelques unités près, JAMAIS 0. "
          "Données bruitées : 0,14-0,15 ; données propres (après NXT) : 0,10-0,12. Au-delà de 0,18-0,20 : trop étiré. Vérifie avec Statistics (médiane d'une preview de fond).")
D_SCREEN = ("Recombinaison des étoiles en mode screen : ~((~$T) * (~%s)). GLISSE l'icône sur l'image SANS étoiles finale (après palette et finition), quel que soit son nom ; "
            "l'image d'étoiles étirée doit s'appeler '%s' (nom donné par SXT : écris-le exactement comme le titre de la fenêtre, sinon corrige-le dans l'icône). "
            "L'icône MODIFIE l'image sans étoiles (pas de nouvelle vue) : elle devient l'image finale avec étoiles. Pour recommencer : Ctrl+Z. "
            "Alternative avec réduction des étoiles : icône Etoiles_reduites (à la place de celle-ci).")
D_BL = ("Recombinaison des étoiles + réduction Bill Blanshan (Transfer V2) en une seule formule, À LA PLACE d'Etoiles_screen : GLISSE l'icône sur l'image SANS étoiles finale ; elle est modifiée directement. "
        "W = ~((~$T)*(~%s)) est l'image avec étoiles (screen), puis la formule de Bill avec Img1 = $T (sans étoiles) : même calcul que Etoiles_screen suivi de Blanshan, sans vue intermédiaire. "
        "S = 0,20 dans cette icône (valeur de Bill : 0,15 ; plus bas = étoiles plus petites ; étoiles trop petites -> 0,25, ou saute cette étape). Les versions V3 et les méthodes Halo/Star sont décrites dans la fiche (section réduction d'étoiles).")
D_PLAFOND = ("Plafond des cœurs d'étoiles, AVANT la réintégration : GLISSE l'icône sur l'image d'étoiles seule (RGB_stars, ou celle de ton workflow), juste avant Etoiles_screen ou Etoiles_reduites. "
             "m = max(R, G, B) du pixel ; au-dessus de s = 0,70, les trois canaux sont multipliés par le même facteur 1 − k·t² (t de 0 à 1 entre s et 1) : un cœur à 1 descend à 0,94 (k = 0,06), "
             "une étoile sous 0,70 ne change pas, et le rapport R:G:B est gardé (la couleur ne se délave pas). Ne recrée pas la couleur d'un cœur saturé à la prise de vue (R = G = B = 1 reste blanc, à 0,94). "
             "Encore trop blanc : k = 0,10 ; étoiles moyennes touchées : s = 0,80. Rejouable, Ctrl+Z pour revenir.")
D_MT = ("Alternative : MorphologicalTransformation sur l'image d'étoiles seule (ou avec un masque d'étoiles), AVANT Etoiles_screen. Morphological Selection 0,25 (sous 0,5 = érosion), Amount 0,60, 1 itération, élément circulaire 5x5.")
D_CURVES = ("CurvesTransformation — sur l'image sans étoiles étirée, sous masque de luminance (icône Masque_L juste avant). "
            "Préréglé : courbe en S sur RGB/K (0,25 → 0,19 ; 0,75 → 0,81) et saturation (canal S, milieu monté de 0,5 à 0,65), interpolation Akima : contraste d'environ deux passes de l'ancienne courbe légère, saturation modérée (0,72 jugé trop saturé sur NGC 1532). Trop saturé -> milieu S à 0,60 ; couleurs ternes -> 0,72 ; trop contrasté -> 0,21 / 0,79 ; pas assez -> option Boost_finition. "
            "Place les points aux niveaux réels (valeur K du curseur dans la barre d'état). Canaux : RGB/K = même courbe sur R, G, B ; L = luminosité CIE L* seule ; "
            "S = saturation en fonction de la saturation (sature les pixels ternes sans toucher aux saturés) ; H = teinte d'origine → nouvelle teinte (un point déplacé verticalement change une couleur en une autre) ; c = chroma. "
            "Petits déplacements, compare avec l'aperçu.")
D_LHE = ("LocalHistogramEqualization (CLAHE) sur l'image sans étoiles, sous masque de luminance (icône Masque_L, masque attaché avec Ctrl+M) : sans masque, le fond bruité prend du contraste. "
         "Kernel radius 150 (défaut 64 ; 100 à 300 selon la taille des structures ; petit = effet fort mais bruit et anneaux, grand = plus doux ; en pixels, donc plus grand à fort échantillonnage). "
         "Contrast limit 2,0 (1,0 = rien ; 1,5 à 2,0 ; sous 3 sinon bruit). Amount 0,30 (1,0 = résultat pur ; facile à exagérer). Histogram resolution 12-bit (anneaux ou paliers autour d'un cœur brillant en 8-bit, postérisation ; plus lent), Circular kernel coché. "
         "PASSE 1 sur 2 (grandes structures) ; l'icône LHE_fin suit (petit rayon). Deux passes de rayons différents (Chad Leader : galaxie 140 px à 0,20 puis 32 px à 0,18) ; "
         "ici Amounts plus forts (0,30 puis 0,25) pour un effet plus marqué : effet artificiel, halo sombre autour de la galaxie ou bruit -> 0,20 et 0,16. Resature aux courbes si besoin.")
D_LHE_FIN = ("LocalHistogramEqualization, PASSE 2 sur 2 (petits détails : poussières, nœuds, bras) : après l'icône LHE, même image sans étoiles, même Masque_L. "
             "Kernel radius 40 (32 à 50), Contrast limit 2,0, Amount 0,25 (0,30 donnait un aspect un peu peint à 1:1), 10-bit (12-bit marche mal avec un petit rayon), circulaire. Bruit ou aspect gravé -> Amount 0,16 ou Contrast limit 1,5.")
D_HDR = ("HDRMultiscaleTransform sur l'image sans étoiles pour les zones brillantes (cœurs, nébuleuses denses). "
         "Number of layers 6 = échelles 1 à 32 px (4 à 6 selon Starlust ; plus de couches = plus grandes structures ; essaie 7 à fort échantillonnage). Iterations 1 (plus = plus fort et plus doux ; essaie 2). "
         "Overdrive 0 (0,10 à 0,20 pour plus de force). Median transform décoché (coché = moins d'anneaux, plus lent). Scaling function B3 Spline (5). Deringing décoché (petites valeurs si anneaux). "
         "Midtones balance Automatic. To lightness, Preserve hue et Lightness mask cochés (le masque interne protège le fond : pas de masque externe). "
         "Trop fort : mélange à 50 % avec l'original.")
NXT_C = (" Réglages communs (manuel RC Astro AI3) : Iterations 1 (plus = garde mieux le détail des zones très bruitées, mais trop d'itérations crée des artefacts) ; "
         "Detail sans effet en AI3 ; séparations décochées. Option Enable color separation (image couleur seulement) : Denoise color plus haut que l'intensité. "
         "Option Enable frequency separation : HF intensité 0,80-0,90, HF couleur 0,90-1,00, LF intensité 0,50-0,70, LF couleur 1,00 ; HF/LF scale 5 px (règle-le avec LF à 0 en aperçu).")
D_NXT_F = "NoiseXTerminator, passe finale légère sur l'image étirée : Denoise 0,40 (0,30 à 0,50). Seulement si besoin." + NXT_C

D_SPFC_COMMUN = (" Prérequis : image LINÉAIRE et résolue (ImageSolver ou WBPP), base Gaia DR3/SP installée. Catalog Gaia DR3/SP, Automatic limit magnitude coché, détection PSF par défaut. "
                 "SPFC ne modifie pas les pixels : il écrit les métadonnées de flux lues par MGC. Utilise ensuite les MÊMES filtres dans SPCC.")
D_SPFC = {
 'SPFC_RGB_filtres': "SPFC sur l'image RGB combinée, configuré pour ton matériel : QE curve Sony IMX411/455/461/533/571 (QHY600), Red/Green/Blue filter = Antlia V Pro Series R, G, B (courbes de ta base de filtres). Mêmes filtres que l'icône SPCC.",
 'SPFC_L': "SPFC sur le master L : QE curve IMX455 ; Gray filter = courbe approchée du filtre Antlia V Pro L (420 à 715 nm, transmission 95 %, d'après les caractéristiques publiées : la vraie courbe n'est pas dans ta base de filtres).",
 'SPFC_H': "SPFC sur le master H : QE curve IMX455 ; Narrowband mode, 656,3 nm, bande passante 3 nm (filtres Antlia 3 nm).",
 'SPFC_O': "SPFC sur le master O : QE curve IMX455 ; Narrowband mode, 500,7 nm, bande passante 3 nm (filtres Antlia 3 nm).",
 'SPFC_S': "SPFC sur le master S : QE curve IMX455 ; Narrowband mode, 672,4 nm, bande passante 3 nm (filtres Antlia 3 nm).",
}
D_MGC = ("MultiscaleGradientCorrection, juste après SPFC, sur la même image. Use MARS database coché ; filtres MARS Gray = L (image mono), Red = R, Green = G, Blue = B (image couleur) ; "
         "Gradient scale 1024 (512 ou 256 si un gradient reste dans les coins), Structure separation 3 (1-2 pour les bords), Model smoothness 1,0 (3-5 si le modèle ondule), Scale factors 1,0, Show gradient model coché. "
         "La base MARS se charge dans les préférences de MGC (clé à molette › Add › fichier .xmars) : si MGC signale qu'aucune base n'est chargée, ajoute-la là. "
         "Narrowband : MARS DR2 (21 juin 2026) couvre H et O jusqu'à +75° de déclinaison : utilise les icônes MGC_MARS_H et MGC_MARS_O (filtre MARS Gray = Ha ou OIII) ; cette icône-ci est réglée sur L. S absent de DR2 : GradientCorrection ou DBE.")
D_DBE = ("ALTERNATIVE — DynamicBackgroundExtraction, sans points (ils dépendent de l'image) : ouvre l'icône, clique sur l'image, puis Generate. Samples per row 15, Sample radius 15 (10 à 50), "
         "Tolerance 0,5 (1,0-1,5 si des points sont rejetés), Shadows relaxation 3, Smoothing 0,25 (0,5-1,0 champs nébuleux), Correction Subtract (Division seulement pour le vignettage), "
         "Normalize, Discard model et Replace target cochés. Retire les points posés sur la nébuleuse ; d'un filtre à l'autre, garde les points et ajuste Tolerance.")

D_MGC_NB = ("MultiscaleGradientCorrection pour le master %s : filtre MARS Gray = %s (MARS DR2, juin 2026 : bandes Ha et OIII, couverture narrowband jusqu'à +75° de déclinaison ; "
            "valeur du paramètre relevée dans un outil qui pilote MGC sous PixInsight 1.9.5, texte du menu non vu dans l'interface). "
            "Applique juste après l'icône %s, sur le même master linéaire et résolu. Autres réglages identiques à MGC_MARS : Gradient scale 1024 (512 ou 256 si un gradient reste dans les coins), "
            "Structure separation 3, Model smoothness 1,0, Show gradient model coché (le modèle doit être lisse, sans structure de la nébuleuse). "
            "Base MARS DR2 à charger dans les préférences de MGC (clé à molette › Add › fichier .xmars). Hors couverture MARS : GradientCorrection ou DBE. "
            "S : pas de bande S dans MARS, utilise GradientCorrection ou DBE.")

def gradient_block(kind='rgb'):
    """kind : 'rgb' (RGB + L), 'lha' (RGB + L + H), 'sho', 'hoo'."""
    names = {'rgb': ['SPFC_RGB_filtres', 'SPFC_L'], 'lha': ['SPFC_RGB_filtres', 'SPFC_L', 'SPFC_H'],
             'sho': ['SPFC_S', 'SPFC_H', 'SPFC_O'], 'hoo': ['SPFC_H', 'SPFC_O']}[kind]
    opts = {'SPFC_RGB_filtres': dict(rgb='antlia', gray='antlia_L_spec', qe='qe_imx455'), 'SPFC_L': dict(rgb='antlia', gray='antlia_L_spec', qe='qe_imx455'),
            'SPFC_H': dict(nb=(656.3, 3.0), rgb='antlia', gray='antlia_L_spec', qe='qe_imx455'), 'SPFC_O': dict(nb=(500.7, 3.0), rgb='antlia', gray='antlia_L_spec', qe='qe_imx455'),
            'SPFC_S': dict(nb=(672.4, 3.0), rgb='antlia', gray='antlia_L_spec', qe='qe_imx455')}
    b = [(M.spfc(n, **opts[n]), D_SPFC[n] + D_SPFC_COMMUN) for n in names]
    b += [(M.mgc('MGC_MARS'), D_MGC)]
    if kind in ('lha', 'sho', 'hoo'):
        b += [(M.mgc('MGC_MARS_H', gray='Ha'), D_MGC_NB % ('H', 'Ha', 'SPFC_H'))]
    if kind in ('sho', 'hoo'):
        b += [(M.mgc('MGC_MARS_O', gray='OIII'), D_MGC_NB % ('O', 'OIII', 'SPFC_O'))]
    b += [(M.instance('GradientCorrection', 'GradientCorrection', {'generateGradientModel': False}), T_GC),
          (M.dbe('DBE'), D_DBE)]
    return b

T_LPS = ("OPTION — LinearPatternSubtraction (Vicent Peris, script livré avec PixInsight). Icône-note : chemin du script non vérifié ; lance-le depuis le menu Script. "
         "Réglages : Target is active image coché ; Close former working images décoché ; Correct columns décoché (lignes) ; Correct the entire image coché ; Defects file vide ; "
         "Postfix _lps ; Layers to remove 9 ; Rejection limit 3 ; Global rejection coché, limite 5 ; Background reference region 0, 0, 512, 512 (à placer sur une zone sombre).")

def pre_block():
    return [(note('LinearPatternSubtraction', T_LPS), ''), (note('Renommer_auto', ''), ''), (script('Crop_reference', ''), ''), (script('Crop_appliquer', ''), ''), (note('WBPP', T_WBPP), ''), (cc(), D_CC)]

D_MASK = ("MASQUE DE LUMINANCE créé ET attaché en un clic (script Masque_auto.js) : glisse l'icône sur l'image SANS ÉTOILES étirée ; elle crée la vue mono 'masque_L' = luminance Rec. 709 (0,2126 R + 0,7152 G + 0,0722 B ; l'image elle-même si elle est mono) "
          "dont le fond est coupé : tout ce qui est sous s passe à 0 (protégé), le reste va de 0 à 1 ; puis léger flou gaussien (flou = 2 px) et masque ATTACHÉ à l'image, sans affichage rouge : plus de Ctrl+M. "
          "s = 0,14 par défaut : fond final de la fiche 0,12-0,14 ; règle s = fond mesuré à la sonde 15x15 + 0,01 (vers 0,26 si le fond est encore à 0,20-0,25). Contrôle à la sonde sur masque_L : fond 0 à 0,05. "
          "Retrait : icône Masque_retirer (détache et ferme masque_L), déjà en fin de C_Finition et des Boost. HDRMT n'en a pas besoin (option Lightness mask).")

D_HDRMT30 = ("PARTIE 1 (cœur) — conteneur HDRMT à 30 % (par défaut, demande de l'utilisateur) : copie de l'image (HDR_avant), HDRMultiscaleTransform 6 couches (To lightness, Preserve hue, Lightness mask), "
             "mélange 0,3 × résultat + 0,7 × copie, copie fermée. Sur l'image sans étoiles, AVANT le contraste. "
             "Options de la partie 1, à la place : HDRMT_40 (cœur encore trop clair), HDRMT_50 (cœur brûlé), HDRMT_eclat (cœur détaillé mais terne) ; cœur déjà parfait : saute-la.")
D_HDRMT40 = ("PARTIE 1 (cœur) — conteneur HDRMT à 40 % : copie de l'image (HDR_avant), HDRMultiscaleTransform 6 couches (To lightness, Preserve hue, Lightness mask), "
             "mélange 0,4 × résultat + 0,6 × copie, copie fermée. Sur l'image sans étoiles, AVANT le contraste : détail du cœur sans l'aplatir. "
             "Options de la partie 1, à la place : HDRMT_30 (effet plus léger), HDRMT_50 (cœur brûlé), HDRMT_eclat (cœur détaillé mais terne : HDRMT 40 % puis Boost light) ; cœur déjà parfait : saute-la.")
D_NXT_DERNIER = ("NoiseXTerminator, toute dernière réduction de bruit (demande de l'utilisateur) : sur l'image finie AVEC ses étoiles, juste après Etoiles_screen, avant l'export. "
                 "Denoise 0,25, 1 itération (léger : NXT_final 0,40 a déjà débruité l'image sans étoiles ; ici le bruit ramené par les étoiles et les dernières étapes). Aspect plastique -> 0,15 ; bruit encore visible -> 0,35.")
D_NXT_DOUX = "PARTIE 3, option à la place de NXT_final : NoiseXTerminator Denoise 0,25, données très propres ou aspect plastique avec 0,40."
D_NXT_FORT = "PARTIE 3, option à la place de NXT_final : NoiseXTerminator Denoise 0,60, peu de poses ou bruit encore visible dans le fond après 0,40."
D_FOND = ("PARTIE 5 (fond) — conteneur sur l'image FINIE, étoiles comprises : Fond_auto (fond de chaque canal mesuré sur une grille 8 × 8, amené à 0,12, neutre, sans écrêtage), "
          "puis Fond_desature (couleur et violet retirés du fond et du halo faible). Options de la partie 5 : Boost_final AVANT ce conteneur (cœur et bras brillants), Fond_auto_clair (cible 0,14, à la place) si l'image est trop sombre.")

def usm():
    # UnsharpMask (module Convolution, version 0x100) : identifiants et bornes relevés dans la PCL (UnsharpMaskParameters.cpp)
    return M.build('UnsharpMask', 256, 'UnsharpMask', [('sigma', '2.00', 'v'), ('amount', '0.30', 'v'), ('useLuminance', True, 'v'), ('linear', False, 'v'),
                   ('deringing', True, 'v'), ('deringingDark', '0.1000', 'v'), ('deringingBright', '0.0000', 'v'), ('outputDeringingMaps', False, 'v'),
                   ('rangeLow', '0.0000000', 'v'), ('rangeHigh', '0.0000000', 'v')])

def sharp_mmt():
    """P6, chemin principal (demande de l'utilisateur) : accentuation finale MMT sous masque de luminance, sur l'image sans étoiles."""
    return _cont('C_Sharp_MMT', [script('Masque_L', ''), script('Sharp_MMT', ''), script('Masque_retirer', '')])

def sharp_usm():
    """Option P6 (demande de l'utilisateur) : accentuation finale par UnsharpMask, sous masque de luminance, sur l'image sans étoiles."""
    return _cont('Sharp_USM', [script('Masque_L', ''), usm(), script('Masque_retirer', '')])

D_CURVES_G = D_CURVES.replace("milieu monté de 0,5 à 0,65", "milieu monté de 0,5 à 0,58").replace(
    "saturation modérée (0,72 jugé trop saturé sur NGC 1532). Trop saturé -> milieu S à 0,60 ; couleurs ternes -> 0,72",
    "saturation légère (0,72 puis 0,65 jugés trop saturés par l'utilisateur ; 0,65 reste en option Finition_saturee). Trop saturé -> milieu S à 0,54 ; couleurs ternes -> Finition_saturee (0,65)")
assert D_CURVES_G != D_CURVES

def finition_saturee():
    """Option P6 (demande de l'utilisateur) : l'ancienne C_Finition, saturation 0,65 (la principale passe à 0,58)."""
    return _cont('Finition_saturee', [script('Masque_L', ''), curves('Courbes_saturees', sat=0.65),
        M.instance('LocalHistogramEqualization', 'LHE', {'radius': 150, 'histogramBins': 'Bit12', 'slopeLimit': '2.0', 'amount': '0.300', 'circularKernel': True}),
        M.instance('LocalHistogramEqualization', 'LHE_fin', {'radius': 40, 'histogramBins': 'Bit10', 'slopeLimit': '2.0', 'amount': '0.250', 'circularKernel': True}),
        script('Masque_retirer', '')])

def finish_block(extra=None, galaxie=False):
    if galaxie:
        # finition en parties (demande de l'utilisateur) : 1 cœur (HDRMT 40 %), 2 contraste (C_Finition), 3 bruit (NXT_final), chacune avec ses options
        b = [(script('Nettoyage_sans_etoiles', ''), ''),   # option, avant la partie 1 : restes de halos d'étoiles (demande de l'utilisateur)
             (_cont('HDRMT_30', hdrmt_items('0.3')), D_HDRMT30), (_cont('HDRMT_40', hdrmt_items('0.4')), ''), (hdrmt_50(), ''), (hdrmt_eclat(), ''),   # HDRMT_30 par défaut (demande de l'utilisateur)
             (note('Masque_L', D_MASK), ''),
             (curves('Courbes', sat=0.58), D_CURVES_G),   # saturation 0,58 au lieu de 0,65 (demande de l'utilisateur : C_Finition trop saturée)
             (M.instance('LocalHistogramEqualization', 'LHE', {'radius': 150, 'histogramBins': 'Bit12', 'slopeLimit': '2.0', 'amount': '0.300', 'circularKernel': True}), D_LHE),
             (M.instance('LocalHistogramEqualization', 'LHE_fin', {'radius': 40, 'histogramBins': 'Bit10', 'slopeLimit': '2.0', 'amount': '0.250', 'circularKernel': True}), D_LHE_FIN),
             (note('Masque_retirer', ''), ''),
             (finition_saturee(), ''),   # option : l'ancienne C_Finition (saturation 0,65), la nouvelle sature moins (demande de l'utilisateur)
             (boost_container('Boost_finition_light', k=((0, 0), (0.25, 0.24), (0.75, 0.76), (1, 1)), sat=0.57, amount='0.120'), ''),
             (boost_container(), ''),
             (sharp_mmt(), ''), (sharp_usm(), ''),   # accentuation finale : MMT au chemin principal, UnsharpMask en option (demande de l'utilisateur)
             (M.nxt('NXT_final', 0.40, 1), "PARTIE 3 (bruit) — " + D_NXT_F),
             (M.nxt('NXT_final_doux', 0.25, 1), D_NXT_DOUX), (M.nxt('NXT_final_fort', 0.60, 1), D_NXT_FORT)]
        return (extra or []) + b   # narrowband (demande de l'utilisateur, 8 octobre 2026) : même finition, options propres en tête (SCNR_SHO)
    b = [(note('Masque_L', D_MASK), ''),
         (curves('Courbes'), D_CURVES), (M.instance('LocalHistogramEqualization', 'LHE', {'radius': 150, 'histogramBins': 'Bit12', 'slopeLimit': '2.0', 'amount': '0.300', 'circularKernel': True}), D_LHE),
         (M.instance('LocalHistogramEqualization', 'LHE_fin', {'radius': 40, 'histogramBins': 'Bit10', 'slopeLimit': '2.0', 'amount': '0.250', 'circularKernel': True}), D_LHE_FIN),
         (note('Masque_retirer', ''), ''),
         (boost_container('Boost_finition_light', k=((0, 0), (0.25, 0.24), (0.75, 0.76), (1, 1)), sat=0.57, amount='0.120'), ''),
         (boost_container(), ''),
         (_cont('HDRMT_30', hdrmt_items('0.3')), ''), (hdrmt_50(), ''), (hdrmt_eclat(), '')]
    if extra:
        b = extra + b
    return b + [(sharp_mmt(), ''), (sharp_usm(), ''), (M.nxt('NXT_final', 0.40, 1), D_NXT_F)]

def icc_srgb():
    # ICCProfileTransformation vers sRGB IEC61966-2.1 (paramètres du module ICCProfileTransformation de PixInsight)
    return 'ICC_sRGB', ('   <instance class="ICCProfileTransformation" version="256" id="ICC_sRGB_instance">\n'
                        '      <parameter id="targetProfile">sRGB IEC61966-2.1</parameter>\n'
                        '      <parameter id="toDefaultProfile" value="false"/>\n'
                        '      <parameter id="renderingIntent" value="Perceptual"/>\n'
                        '      <parameter id="useBlackPointCompensation" value="true"/>\n'
                        '      <parameter id="useFloatingPointTransformation" value="true"/>\n'
                        '   </instance>')

EXPORT = [(icc_srgb(), ''), (script('Export_TIFF', ''), '')]   # options, tout à la fin : finition hors PixInsight (demande de l'utilisateur)
EXPORT.append((fermer('Fermer_tout', '*'), ''))   # option après Export_TIFF : fermer toutes les vues (demande de l'utilisateur)

def stars_end(stars='RGB_stars', cms=False, screen_extra='', cms_extra='', alt='', galaxie=False):
    # options sur l'image d'étoiles seule : AVANT la recombinaison
    b = [(M.instance('MorphologicalTransformation', 'MT_etoiles', {'operator': 'Selection', 'numberOfIterations': 1, 'amount': '0.60', 'selectionPoint': '0.25', 'structureSize': 5}, post=M.mt_post), D_MT),
         (note('Halo_B_Gon', T_HALO), ''),
         # option (demande de l'utilisateur) : cœurs d'étoiles qui ne touchent plus 1, avant la réintégration
         (script('Etoiles_grosses', ''), ''),
         (pm('Etoiles_plafond', 's = 0.70;\nk = 0.06;\nm = max($T[0], $T[1], $T[2]);\nt = max(0, (m - s)/(1 - s));\n$T*(1 - k*t*t)', symbols='s, k, m, t'), D_PLAFOND)]
    b.append((pm('Etoiles_screen', '~((~$T) * (~%s))' % stars),
              D_SCREEN % (stars, stars) + alt + screen_extra))
    b.append((pm('Etoiles_reduites', "S=0.20;\nW=~((~$T)*(~%s));\nf1= ~((~mtf(~S,W)/~mtf(~S,$T))*~$T);\nmax($T,f1)" % stars, symbols='S, W, f1'), D_BL % stars))
    if cms:
        b.append((note('CorrectMagentaStars', T_CMS + cms_extra), ''))
    if galaxie:
        # partie 5 (fond) : Boost_final (option, avant), Fond_desature puis Fond_auto au chemin principal (demande de l'utilisateur), Fond_auto_clair (option, à la place de Fond_auto)
        return b + [(boost_final(True), ''), (boost_final(), ''), (script('Fond_desature', ''), ''), (note('Fond_auto', D_FOND), ''),   # Fond_desature puis Fond_auto (demande de l'utilisateur)
                   
                    (script('Fond_auto_clair', ''), '')] + EXPORT
    b.append((script('Fond_desature', ''), ''))   # option, tout à la fin : couleur retirée du fond du ciel
    return b + EXPORT

def ghs_block(extra_desc='', stat_extra='', fond_extra=''):
    return [(ghs('GHS_1_premier', 10), D_GHS1 + extra_desc), (ghs('GHS_2_contraste', 4, hp=0.9, sf=1.0, sp=0.35), D_GHS2), (note('Statistical_Stretch', T_STAT + stat_extra), ''), (ghs('GHS_3_fond', 10, hp=0.20, sf=1.0, sp=0.20), D_GHS3 + fond_extra)]

L_GHS = (" LRGB, méthode par défaut : GHS_1 et GHS_2 sur L sans étoiles seulement (L porte le détail) ; le RGB passe par Statistical Stretch. "
         "Si tu as choisi GHS sur tout : aussi sur le RGB sans étoiles, jusqu'au MÊME fond et à une médiane proche.")
L_STAT = (" LRGB, méthode par défaut : sur le RGB sans étoiles seulement (il ne donne que la couleur), Target Median 0,25 ; L passe par GHS. "
          "Si tu as choisi Statistical Stretch sur tout : même Target Median pour L. Ensuite GHS_3_fond sur les deux avant LRGB. "
          "Couleurs ternes : Saturation plus basse dans LRGBCombination, ou Luma Only coché.")
L_FOND = " LRGB : applique-la au RGB ET à L avec les mêmes réglages, avant LRGBCombination, pour qu'elles arrivent au même fond (0,12-0,14)."
# Process galaxies (demande de l'utilisateur, 5 octobre 2026) : L sans étoiles (SXT linéaire) étirée par GHS ; RGB étiré par MAS AVEC ses étoiles,
# puis SXT (Unscreen) -> RGB_stars ; LRGB sur les deux images sans étoiles ; RGB_stars remises à la fin.
L_GHS_SANS = (" Galaxies : GHS_1 et GHS_2 sur L SANS étoiles (SXT_L_lineaire fait en phase 3) : étire librement, pas de HP à gérer pour les étoiles. "
              "Le RGB passe par MAS avec ses étoiles, puis SXT_RGB_etire.")
D_MAS = ("MultiscaleAdaptiveStretch sur le RGB LINÉAIRE, AVEC ses étoiles (demande de l'utilisateur) : étire en gardant la forme et la couleur des étoiles. "
         "Réglages de l'utilisateur : Aggressiveness 0,70, Target background 0,150, Dynamic range compression 0,40, Contrast recovery (1024, 1,0), saturation 0,75 (boost 0,50, masque de luminosité). "
         "Ensuite SXT_RGB_etire (Unscreen), puis GHS_3_fond sur le RGB sans étoiles (SP = HP = 0,12) pour le même fond que L.")
D_SXT_RGB_ETIRE = ("StarXTerminator sur le RGB ÉTIRÉ par MAS, Unscreen COCHÉ (image étirée, RC Astro), Generate star image coché : RGB sans étoiles + RGB_stars (étoiles étirées, couleur gardée). "
                   "Garde RGB_stars ouverte jusqu'à Etoiles_screen (fin de phase 7). CONTRÔLE à 100 % : pas de morceaux de galaxie (nœuds HII, amas) dans RGB_stars, pas de halos restés.")
D_SXT_L_LIN = ("StarXTerminator sur L LINÉAIRE (dernière étape de C_L_lineaire), Unscreen décoché, sans image d'étoiles : L sans étoiles pour les GHS (les étoiles viendront du RGB). "
               "CONTRÔLE : nœuds HII et amas compacts des bras gardés dans L (sinon masque noir sur la zone, ou baisse le retrait).")
def mas():
    # MultiscaleAdaptiveStretch : réglages donnés par l'utilisateur ; version 256 confirmée (l'icône se charge, retour de l'utilisateur)
    p = [('aggressiveness', '0.70'), ('targetBackground', '0.150'), ('dynamicRangeCompression', '0.40'), ('contrastRecovery', True), ('scaleSeparation', '1024'),
         ('contrastRecoveryIntensity', '1.000'), ('previewLargeScale', False), ('saturationEnabled', True), ('saturationAmount', '0.75'), ('saturationBoost', '0.50'),
         ('saturationLightnessMask', True), ('backgroundROIEnabled', False), ('backgroundROIX0', '0'), ('backgroundROIY0', '0'), ('backgroundROIWidth', '0'), ('backgroundROIHeight', '0')]
    return M.build('MultiscaleAdaptiveStretch', 256, 'MAS', [(k, v, 'v') for k, v in p])

def lum_block():
    """Galaxies (demande de l'utilisateur) : GHS_1, GHS_2 sur L sans étoiles ; MAS puis SXT_RGB_etire sur RGB ; GHS_3_fond sur les deux ; Statistical_Stretch en option."""
    return [(ghs('GHS_1_premier', 10), D_GHS1 + L_GHS_SANS), (ghs('GHS_2_contraste', 4, hp=0.9, sf=1.0, sp=0.35), D_GHS2),
            # GHS_3_fond juste après GHS_2_contraste (demande de l'utilisateur), puis MAS et SXT_RGB_etire
            (ghs('GHS_3_fond', 10, hp=0.20, sf=1.0, sp=0.20), D_GHS3 + " Galaxies : sur L juste après GHS_2 (SP = HP = 0,20), puis de nouveau sur le RGB sans étoiles après MAS, SXT_RGB_etire et SCNR_etoiles_vert (SP = HP = 0,12), avant LRGB, même fond 0,12-0,14 sur les deux."),
            (mas(), D_MAS), (M.sxt('SXT_RGB_etire', True), D_SXT_RGB_ETIRE),
            (note('Statistical_Stretch', T_STAT + " Galaxies : OPTION, à la place de MAS sur le RGB avec étoiles (étoiles plus grosses)."), '')]
def rgb_comb(close=True):
    n, x = note('Combinaison_RGB', '')
    if not close:
        # LHaRGB (demande de l'utilisateur : fermer au fur et à mesure) : G et B fermées, R gardée pour Continuum_auto
        a = '<td id="id">garder</td>\n            <td id="value"></td>'
        assert a in x
        x = x.replace(a, a.replace('<td id="value"></td>', '<td id="value">R</td>'))
    return n, x

rgb_comb_item = lambda close=True: (rgb_comb(close), '')
MATERIEL = "QHY600 (Sony IMX455) + filtres Antlia V Pro"

def spcc_perso(name):
    n, t = raw('SPCC_RGB_ASG', name)
    for ch in ('red', 'green', 'blue'):
        cn, cc = M.CURVES['antlia_' + ch]
        t, k1 = re.subn(r'<parameter id="%sFilterTrCurve">[^<]*</parameter>' % ch, '<parameter id="%sFilterTrCurve">%s</parameter>' % (ch, cc), t)
        t, k2 = re.subn(r'<parameter id="%sFilterName">[^<]*</parameter>' % ch, '<parameter id="%sFilterName">%s</parameter>' % (ch, escape(cn)), t)
        assert k1 == 1 and k2 == 1
    t, kg = re.subn(r'<parameter id="generateGraphs" value="true"/>', '<parameter id="generateGraphs" value="false"/>', t)
    assert kg == 1
    qn, qc = M.CURVES['qe_imx455']
    t, k1 = re.subn(r'<parameter id="deviceQECurve">[^<]*</parameter>', '<parameter id="deviceQECurve">%s</parameter>' % qc, t)
    t, k2 = re.subn(r'<parameter id="deviceQECurveName">[^<]*</parameter>', '<parameter id="deviceQECurveName">%s</parameter>' % escape(qn), t)
    assert k1 == 1 and k2 == 1
    return n, t

T_SPCC = ("SPCC configuré pour ton matériel (" + MATERIEL + ") : White reference Average Spiral Galaxy ; QE curve Sony IMX411/455/461/533/571 ; filtres Antlia V Pro Series R, G, B "
          "(courbes issues de ta base de filtres PixInsight) ; neutralisation du fond activée (limites -2,80 / +2,00) ; Generate graphs décoché (coche-le pour contrôler la calibration). "
          "FOND DE RÉFÉRENCE : l'icône n'a ni vue de référence ni Region of Interest, donc SPCC prend l'image entière ; les limites sont en écarts-types autour de la médiane et écartent étoiles et nébuleuse. "
          "Suffisant après le retrait du gradient sur une galaxie ou un champ avec du ciel libre. Champ rempli de nébuleuse : baisse la limite haute, ou lance Script › SetiAstro › Find Background (dépôt "
          "https://updates.setiastro.com/) qui crée automatiquement un aperçu nommé Background, puis coche Region of Interest et clique From Preview (ou crée toi-même une preview sur du fond vide). "
          "Après SPCC, vérifie que le fond est gris neutre. Toujours en linéaire, après le gradient et BXT Correct Only, avant BXT complet. "
          "CONTRÔLE : graphes = étoiles serrées autour des droites, croix du blanc de référence dans le nuage (forte dispersion : flat à revoir, gradient multiplicatif). "
          "COULEURS ATTENDUES : galaxie spirale blanche en moyenne (définition du blanc Average Spiral Galaxy), cœur jaune, bras bleus, régions HII roses, poussière brun sombre, "
          "nébuleuse par réflexion bleue, en émission rouge, étoiles du bleu-blanc au jaune-orange, JAMAIS vertes (G au-dessus de R et de B à la fois = erreur). "
          "Légère dominante bleue (moins de 10 %) possible et normale avec SPCC. Tout vert, tout bleu ou tout jaune : filtres ou capteur mal choisis, ou gradient resté avant SPCC.")
spcc = lambda: (spcc_perso('SPCC'), T_SPCC)
T_FINDBG = ("OPTION avant SPCC, champ rempli de nébuleuse — Find Background (SetiAstro, Script › SetiAstro › Find Background, v1.2.2) : "
            "crée un aperçu 'Background' sur du fond vide ; dans SPCC, coche Region of Interest puis From Preview. Galaxie ou ciel libre : inutile, SPCC prend l'image entière.")

# ---------------------------------------------------------------- LRGB
STARS_LRGB = (" STANDARD DES ÉTOILES (RGB calibré par SPCC) : du bleu-blanc au jaune-orange, couleur visible mais pas criarde, une gamme de couleurs, JAMAIS vertes. "
              "CONTRÔLE sur l'image d'étoiles seule, à la sonde 15x15 sur le HALO (le cœur est souvent saturé et blanc) : chaudes R >= G >= B, bleues B >= G >= R, aucune avec G au-dessus de R et B ; "
              "une dizaine d'étoiles pas toutes identiques. Toutes blanches : Stretch Amount plus bas (ou GHS avec HP) ; criardes : Color Boost plus bas ; vertes, bleues ou jaunes en bloc : SPCC à revoir.")
SCREEN_LRGB = (" LRGB — CONTRÔLE après recombinaison, à 100 % : étoiles de la même couleur que sur l'image d'étoiles seule (la combinaison L a été faite sans étoiles) ; "
               "pas d'anneau sombre ni de halo coloré autour des étoiles ; étoiles ni grossies ni trop présentes (sinon réduction d'étoiles ou étirement plus doux) ; "
               "fond toujours R = G = B (fond éclairci : fond de l'image d'étoiles pas à 0).")

SCREEN_LRGB_ET = (" LRGB — CONTRÔLE après recombinaison, à 100 % : étoiles de la même couleur que sur RGB_stars (sortie de SXT_RGB_etire, étoiles du RGB étiré par MAS) ; "
                  "pas d'anneau sombre ni de halo coloré autour des étoiles ; étoiles ni grossies ni trop présentes (sinon Etoiles_reduites) ; "
                  "fond toujours R = G = B (fond éclairci : fond de l'image d'étoiles pas à 0).")
lrgb = pre_block() + [rgb_comb_item(), (solver_container(), ''), (solver_seul(), '')] + gradient_block('rgb') + [
    (M.bxt('BXT_CorrectOnly', True, 0.25, 0.0, 0.50), D_BXT_CO + BXT_C),
    (note('Find_Background', T_FINDBG), ''),
    spcc(),
    (M.bxt('BXT_RGB', False, 0.25, 0.0, 0.50), "BlurXTerminator complet sur RGB, APRÈS SPCC : Sharpen Stars 0,25 (0 à 0,5), Adjust Star Halos 0, PSF automatique, Sharpen Nonstellar 0,50 (le détail viendra de L). Avant toute réduction de bruit." + BXT_C),
    (M.bxt('BXT_L', False, 0.25, 0.0, 0.80), "BlurXTerminator complet sur L (linéaire, gradient retiré) : Sharpen Stars 0,25, Halos 0, Sharpen Nonstellar 0,80 (0,70 à 0,90), plus fort que sur RGB car la luminance porte le détail. Si vers ou pores à 100 % : baisse Nonstellar." + BXT_C),
    # LRGB (demande de l'utilisateur, 5 octobre 2026) : SXT linéaire sur L, GHS sur L sans étoiles ; MAS sur RGB avec étoiles puis SXT Unscreen ; LRGB sans étoiles
    (M.nxt('NXT_RGB', 0.80, 1), "NoiseXTerminator sur RGB (linéaire, AVEC ses étoiles : SXT vient après LRGB) : Denoise 0,80 (0,70 à 0,90), Detail 0,15. Toujours après BXT. Fonctionne en linéaire ou après étirement (RC Astro)." + NXT_C),
    (M.nxt('NXT_L', 0.60, 1), "NoiseXTerminator sur L (linéaire) : Denoise 0,60 (0,50 à 0,70) pour garder le détail fin." + NXT_C),
    (M.instance('StarXTerminator', 'SXT_L_lineaire', {'output_stars': False, 'unscreen': False, 'remove_reflections': True}), D_SXT_L_LIN),
] + lum_block() + [
    (M.instance('LRGBCombination', 'LRGB_ajout_L', {'mL': '0.500', 'mc': '0.500', 'noiseReduction': True}, post=M.lrgb_post),
     "LRGBCombination sur les images étirées SANS étoiles (demande de l'utilisateur : L sans étoiles par SXT_L_lineaire, RGB sans étoiles par SXT_RGB_etire) : seul L activé (renomme ta luminance 'L'), glisse le triangle sur le RGB. Lightness 0,5 ; Saturation 0,5 (réglage de l'utilisateur ; plus bas = plus saturé) ; Chrominance noise reduction cochée. Couleurs délavées : L trop claire par rapport au RGB, étire-la moins. CONTRÔLE après combinaison (sonde 15x15) : cœur de galaxie R >= G, nettement au-dessus de B ; bras B au-dessus de R ; régions HII R > B > G ; fond R = G = B. Couleurs criardes ou bruit coloré : remonte Saturation (plus haut = moins saturé), NXT sur le RGB. Régions HII peu visibles : normal en LRGB pur, passe en LHaRGB. Les étoiles (RGB_stars) reviennent en phase 7."),
] + finish_block(galaxie=True) + stars_end('RGB_stars', screen_extra=SCREEN_LRGB_ET, galaxie=True)

# ---------------------------------------------------------------- LHaRGB
lhargb = pre_block() + [rgb_comb_item(False), (solver_container(), ''), (solver_seul(), '')] + gradient_block('lha') + [
    (M.bxt('BXT_CorrectOnly', True, 0.25, 0.0, 0.50), D_BXT_CO + BXT_C),
    (note('Find_Background', T_FINDBG), ''),
    spcc(),
    (M.bxt('BXT_RGB', False, 0.25, 0.0, 0.50), "BlurXTerminator complet sur RGB, après SPCC : Sharpen Stars 0,25, Halos 0, Nonstellar 0,50." + BXT_C),
    (M.bxt('BXT_L_H', False, 0.25, 0.0, 0.80), "BlurXTerminator complet sur L et sur le master H (mono, linéaires) : Sharpen Stars 0,25, Halos 0, Nonstellar 0,80. Déconvolue AVANT tout mélange (soustraction du continuum, injection)." + BXT_C),
    # Continuum_H (PixelMath, k à la main) supprimé (demande de l'utilisateur) : Continuum_auto au chemin principal
    (note('Continuum_auto', "Soustraction du continuum AUTOMATIQUE (SetiAstro, Automatic Continuum Subtraction, ContinuumSubtraction.js), au chemin principal (demande de l'utilisateur, à la place de l'ancien Continuum_H). "
          "Double-clic puis Apply Global : dans le dialogue, Ha = H (master linéaire, BXT fait), Red (or RGB) = R (master rouge linéaire, gradient retiré) ou le RGB calibré ; le reste vide ; Execute. "
          "Le script combine H et R, neutralise le fond et égalise les deux canaux sur le fond (le coefficient se calcule tout seul), puis HaNB = H − 0,9·(R − med(R)) (Starry), en niveaux de gris, LINÉAIRE. "
          "Il crée la vue HaNB (HaNB1… si elle existe déjà : renomme-la HaNB, ou ferme l'ancienne avant). "
          "CONTRÔLE : dans HaNB, étoiles et disque galactique presque disparus, il reste les taches HII sur un fond proche de 0. "
          "Continuum mal soustrait (cœur et halo de la galaxie rougis, étoiles à halo rouge dans l'image finale) : relance en cochant Starless (soustraction plus forte, coefficient 1,0 au lieu de 0,9 ; images toujours avec étoiles), ou réduis w dans H_dans_RGB. NXT sur HaNB avant injection si son fond est granuleux."), ''),
    (pm('H_dans_RGB', 'w = 1.0;\n$T[0] + w*HaNB', '$T[1]', '$T[2]', symbols='w'),
     "Injection de HaNB dans le rouge : applique sur l'image RGB (linéaire, calibrée) ; R' = R + w*HaNB, G et B inchangés. w de 0,5 à 2 selon l'effet voulu. "
     "Garde une copie du RGB avant injection pour comparer. RENDU VISÉ : identique au LRGB partout, sauf les régions HII, rose à rouge rosé (Hα + Hβ), plus visibles mais ponctuelles ; cœur, bras, étoiles et fond inchangés. "
     "CONTRÔLE à la sonde 15x15 : région HII R nettement au-dessus de G et B avec B >= G ; cœur R >= G >> B comme en LRGB ; fond R = G = B. "
     "Taches HII rouge vif : baisse w. Régions HII invisibles : monte w ou injecte aussi dans L. Fond rouge : bruit de HaNB injecté. Cœur ou étoiles rougis : continuum mal soustrait (Continuum_auto). "
     "ÉTOILES : l'injection se fait avant SXT, donc les étoiles gardées viennent du RGB injecté ; tout résidu d'étoile dans HaNB passe dans leur rouge. Défauts : étoiles rougies ou à halo rouge (continuum mal soustrait), "
     "anneaux clairs ou sombres (PSF différentes entre H et R, inévitable en partie), étoiles grossies (w trop fort). Standard : comme en LRGB, et pas plus rouges que sur la copie avant injection. "
     "OPTION la plus propre : SXT sur une copie du RGB AVANT injection, garde ces étoiles-là, et injecte le H seulement dans l'image sans étoiles."),
    (pm('H_dans_L', 'a = 1.0;\nmax($T, HaNB*a)', symbols='a'),
     "Option : injection de H dans la luminance, L' = max(L, a*HaNB) : GLISSE l'icône sur L (modifiée directement, pas de nouvelle vue). Vue 'HaNB' requise. Rend les régions HII plus nettes. "
     "Régions HII nettes mais couleurs délavées après LRGBCombination : a trop fort, baisse-le ou fais un mélange léger."),
    (note('NBRGBCombination', "ALTERNATIVE — NBRGBCombination (Script › Utilities) : image RGB et sa bande passante (~100 nm pour un filtre R mono), image H dans le canal R avec la bande passante de ton filtre (3, 5, 7 nm), "
          "Scale 1,2 par défaut (3 à 5 pour un H faible). Compare avec les aperçus RGB et NBRGB."), ''),
    # LHaRGB (comme le LRGB, demande de l'utilisateur) : SXT linéaire sur L ; MAS sur RGB avec étoiles puis SXT Unscreen ; LRGB sans étoiles
    (M.nxt('NXT_RGB', 0.80, 1), "NoiseXTerminator sur RGB (linéaire, après H_dans_RGB, AVEC ses étoiles : SXT vient après LRGB) : Denoise 0,80, Detail 0,15." + NXT_C),
    (fermer('Fermer_continuum', 'H, R, HaNB'), ''),   # icône à part après C_RGB_bruit (demande de l'utilisateur) ; H_dans_L éventuel fait avant
    (M.nxt('NXT_L', 0.60, 1), "NoiseXTerminator sur L (linéaire, après BXT_L_H et H_dans_L éventuel) : Denoise 0,60." + NXT_C),
    (M.instance('StarXTerminator', 'SXT_L_lineaire', {'output_stars': False, 'unscreen': False, 'remove_reflections': True}), D_SXT_L_LIN),
] + lum_block() + [
    (M.instance('LRGBCombination', 'LRGB_ajout_L', {'mL': '0.500', 'mc': '0.500', 'noiseReduction': True}, post=M.lrgb_post),
     "LRGBCombination sur les images étirées SANS étoiles (demande de l'utilisateur : L sans étoiles par SXT_L_lineaire, RGB sans étoiles par SXT_RGB_etire) : seul L activé (renomme ta luminance 'L'), glisse le triangle sur le RGB. Lightness 0,5 ; Saturation 0,5 (réglage de l'utilisateur ; plus bas = plus saturé) ; Chrominance noise reduction cochée. Couleurs délavées : L trop claire par rapport au RGB, étire-la moins. CONTRÔLE (sonde 15x15) : cœur de galaxie jaune (R >= G >> B), bras bleus, régions HII roses et bien visibles grâce au H (R > B > G), fond R = G = B. Compare avec la copie LRGB sans H : seules les régions HII doivent changer ; cœur rougi : continuum mal soustrait (Continuum_auto en Starless) ou w trop fort. Les étoiles (RGB_stars) reviennent en phase 7."),
] + finish_block(galaxie=True) + stars_end('RGB_stars', screen_extra=SCREEN_LRGB_ET, galaxie=True)

# ---------------------------------------------------------------- narrowband communs
def nb_masters(chans):
    # icône-note Masters_S_H_O / Masters_H_O supprimée (demande de l'utilisateur, 8 octobre 2026) : Renommer_auto renomme, Crop_reference / Crop_appliquer recadrent
    return [(solver_container(), ''), (solver_seul(), '')] + gradient_block('sho' if 'S' in chans else 'hoo') + [
        (M.instance('LinearFit', 'LinearFit_ref_H', {'rejectLow': '0.000000', 'rejectHigh': '0.920000'}, {'referenceViewId': 'H'}),
         "Option — LinearFit avec H comme référence : applique sur O (et S). Rapproche fonds et niveaux, ce qu'exige Foraxx (theAstroShed, Galactic Hunter). Référence : vue nommée 'H'.")]

D_BXT_NB = ("BlurXTerminator complet sur la combinaison narrowband SIMPLE (un filtre par canal, sans boost ni mélange) : Sharpen Stars 0,25, Halos 0, Nonstellar 0,60. "
            "Manuel RC Astro : mélanger ou booster un canal avant la déconvolution modifie la PSF (étoiles brillantes incohérentes). Baisse Nonstellar si artefacts dans O/SII.")

def extract(prefix_names, src_desc):
    out = []
    for idx, n in prefix_names:
        out.append((pm('Extraire_' + n, '$T[%d]' % idx, new_image=True, new_id=n, space='Gray'),
                    "Extraction du canal %d (équivalent de ChannelExtraction) : applique sur %s. Crée la vue mono '%s'. "
                    "AVANT : renomme les masters linéaires qui portent déjà ce nom (par exemple '%s_lin'), sinon PixInsight donnera un autre nom à la nouvelle vue et les formules suivantes ne la trouveront pas." % (idx, src_desc, n, n)))
    return out

nb_noise = [(M.nxt('NXT_H', 0.60, 1), "OPTION, à la place de NXT_NB (ancien réglage par canal) : NoiseXTerminator sur H sans étoiles : Denoise 0,60 (0,50 à 0,70), Detail 0,15. En linéaire ou après étirement." + NXT_C),
            (M.nxt('NXT_O_S', 0.75, 1), "OPTION, à la place de NXT_NB (ancien réglage par canal) : NoiseXTerminator sur O et S sans étoiles, plus bruités : Denoise 0,75 (0,60 à 0,85). Ne pousse pas plus : aspect plastique." + NXT_C)]
# NXT sur la combinaison narrowband sans étoiles, avant extraction (demande de l'utilisateur, choix B du 8 octobre 2026 :
# conseil RC Astro, réseau entraîné aux écarts de bruit entre canaux ; NXT_H et NXT_O_S passent en options)
NXT_NB = (M.nxt('NXT_NB', 0.75, 1), "NoiseXTerminator sur la combinaison narrowband SANS étoiles, linéaire (juste après SXT_lineaire, avant l'extraction des canaux) : Denoise 0,75. "
          "RC Astro conseille NXT après la combinaison des canaux : le réseau gère lui-même un S ou un O plus bruité que H. "
          "H trop lissé (aspect plastique) -> 0,65 ; O ou S encore granuleux -> 2 itérations, ou NXT_O_S en plus sur ce canal après extraction." + NXT_C)
GHS_NB = (" En narrowband, étire chaque canal séparément. Règle : même niveau de fond et médiane proche pour tous les canaux (on n'égalise pas la nébuleuse : l'écart de signal, c'est la couleur). "
          "Étire H en premier (pic d'histogramme vers 0,20-0,25) et note ce niveau : c'est la référence. Puis O et S jusqu'au MÊME fond et à la même médiane ; ils demandent un Stretch factor plus élevé, monte LP pour ne pas faire ressortir leur bruit. "
          "Vérifie le fond avec Statistics ou la lecture de pixel. CONTRÔLE : combinaison simple des canaux étirés ; le fond doit être gris neutre, sinon le fond du canal dominant est trop clair : reprends son étirement. "
          "Alternative : Statistical Stretch avec la même Target Median (icône Statistical_Stretch).")
STAT_NB = (" En narrowband : même Target Median (0,25) pour tous les masters narrowband (H, O et S s'il y en a), les médianes sont alors identiques par construction ; "
           "sur une image couleur déjà combinée, décoche Linked Stretch pour étirer chaque canal séparément. Contrôle ensuite le fond neutre (combinaison simple).")

sho_combine = (pm('Combinaison_SHO', 'S', 'H', 'O', new_image=True, new_id='SHO', space='RGB'),
               "Combinaison SHO SIMPLE (équivalent de ChannelCombination) : R = S, G = H, B = O, sans boost ni mélange. Sert à BXT et SXT. Crée l'image 'SHO'.")
sho_palette = [
    # combinaison des canaux ÉTIRÉS avant NBN (demande de l'utilisateur, 8 octobre 2026 : « il ne manque pas un process pour combiner les canaux ? »), comme HOO_simple
    (pm('SHO_simple', 'S', 'H', 'O', new_image=True, new_id='SHO_etire', space='RGB'),
     "PALETTE — combinaison simple sur 'S', 'H' et 'O' étirés sans étoiles (R = S, G = H, B = O), à équilibrer ensuite avec NarrowbandNormalization (icône suivante). Crée 'SHO_etire'."),
    (M.instance('NarrowbandNormalization', 'NBN_SHO', {'palette': 'Palette_SHO', 'o3Boost': '1.000', 's2Boost': '1.000', 'highlightReduction': '1.000', 'brightness': '1.000'}),
     "PALETTE — NarrowbandNormalization, palette SHO (valeurs par défaut ; nom interne Palette_SHO vérifié dans le module 1.1). Sur l'image SHO combinée (R = S, G = H, B = O), "
     "ÉTIRÉE et sans étoiles, canaux étirés avec le même fond et la même médiane (recombinés par l'icône SHO_simple : image 'SHO_etire'). Active l'aperçu. "
     "Ordre de réglage conseillé (suggestion de la fiche, pas une consigne de l'auteur) : Lightness (Off, Preserve, Ha, OIII ou SII ; souvent Ha) ; Shadowpoint pour le fond, sans l'écrêter ; "
     "O3 boost puis S2 boost, progressivement (S, le plus bruité, avec prudence) ; Highlight reduction ; Brightness ; SCNR partiel en dernier, si besoin. "
     "Pour comprendre un curseur, pousse-le à fond (0 ou maximum) puis reviens à une valeur raisonnable (astuce theAstroShed). Garde ton réglage en glissant le triangle du process sur le bureau. "
     "RENDU VISÉ (look Hubble) : zones H or / jaune orangé, zones O cyan à bleu, soufre en orange plus rouge, fond gris neutre foncé, pas de vert dominant (quelques touches acceptées), étoiles pas magenta "
     "(standard des étoiles : avec RGB, étoiles calibrées comme en LRGB, voir les icônes Etoiles_RGB et Star_Stretch ; sans RGB, étoiles plausibles, voir NB_to_RGB_Stars et Etoiles_HOO_synth). "
     "CONTRÔLE à la sonde 15x15 : zone H R >= G, nettement au-dessus de B (si G > R : trop vert) ; zone O G et B au-dessus de R, B >= G ; fond R = G = B. "
     "AJUSTER : trop vert -> SCNR partiel (ou SCNR 0,50-0,80 après) ; pas de bleu -> O3 boost ; pas de nuances orange/rouge -> S2 boost ; fond coloré -> Shadowpoint, sinon reprends l'étirement des canaux ; "
     "cœur brûlé -> Highlight reduction ; détail pâteux -> Lightness Ha ; teinte à affiner -> CurvesTransformation (canal H, puis S) sous masque de luminance. "
     "AUTRE PALETTE : S très faible -> HOO ; H dominant et O faible -> HOO centré sur H ou HaRGB ; or et bleu sans vert -> Foraxx ; teintes libres -> NBColourMapper ; pour comparer -> Perfect Palette Picker."),
    (pm('Foraxx_SHO', '(O^~O)*S + ~(O^~O)*H', '((O*H)^~(O*H))*H + ~((O*H)^~(O*H))*O', 'O', new_image=True, new_id='SHO_Foraxx', space='RGB'),
     "ALTERNATIVE — Palette Foraxx SHO dynamique (Ludo/ForaxX) : vues 'S', 'H', 'O' ÉTIRÉES, sans étoiles, fonds proches. Crée 'SHO_Foraxx'. Tons or et bleu sans vert envahissant."),
    (note('Perfect_Palette_Picker', T_PPP), ''),
    (note('NBColourMapper', T_NBCM), ''),
]
sho_finish = [(M.instance('SCNR', 'SCNR_SHO', {'amount': '0.70', 'protectionMethod': 'AverageNeutral', 'colorToRemove': 'Green'}),
               "SCNR sur la palette SHO si un vert reste : Green, Average Neutral, Amount 0,70 (1,0 par défaut convient souvent ; plus bas pour garder un peu de vert).")]

SCREEN_RGBSHO = (" RGB + SHO — CONTRÔLE après recombinaison, à 100 % : pas de restes d'étoiles SHO sous les étoiles RGB (anneaux ou points magenta, trous sombres : SXT incomplet sur l'image SHO, "
                 "refais-le ou passe CorrectMagentaStars) ; étoiles pas « collées » (ni plus grosses ni plus brillantes que la nébuleuse ne le laisse attendre, sinon réduction d'étoiles ou étirement plus doux) ; "
                 "pas de décalage entre étoiles RGB et leurs traces (aligne RGB et SHO sur la même référence dans WBPP, même recadrage) ; fond toujours R = G = B (fond éclairci ou teinté : fond de l'image d'étoiles pas à 0). "
                 "Nébuleuse en fausses couleurs et étoiles en vraies couleurs : c'est voulu.")
# Étoiles RGB du RGB + SHO : faites comme en LRGB (P2 à P4, demande de l'utilisateur, 8 octobre 2026) ; ancien rgb_stars_block (P7, SXT linéaire + Star Stretch) supprimé

# ---------------------------------------------------------------- RGB + SHO
rgbsho = pre_block() + [rgb_comb_item()] + nb_masters(['S', 'H', 'O']) + [   # RGB des étoiles combiné dès P1, comme en LRGB (demande de l'utilisateur, 8 octobre 2026)
    sho_combine,
    (M.bxt('BXT_NB', False, 0.25, 0.0, 0.60), D_BXT_NB + BXT_C),
    (M.sxt('SXT_lineaire', False), D_SXT_LIN + " Sur l'image SHO : garde le fond sans étoiles (les étoiles viendront du RGB)."),
    NXT_NB,
] + extract([(0, 'S'), (1, 'H'), (2, 'O')], "l'image SHO sans étoiles") + nb_noise + ghs_block(GHS_NB, STAT_NB) + sho_palette + finish_block(sho_finish, galaxie=True) + stars_end('RGB_stars', cms=True, screen_extra=SCREEN_RGBSHO)   # étoiles RGB faites comme en LRGB (P2 à P4), plus de bloc étoiles en P7

# ---------------------------------------------------------------- SHO sans RGB
STARS_NB = (" STANDARD DES ÉTOILES SANS RGB : couleurs non calibrées, on vise des étoiles PLAUSIBLES, proches du RGB : du bleu-blanc au jaune-orange, peu saturées, une gamme de couleurs, "
            "JAMAIS magenta (R et B nettement au-dessus de G) ni vertes (G au-dessus de R et B). CONTRÔLE à la sonde 15x15 sur le halo (le cœur est souvent blanc) : étoiles chaudes R >= G >= B, bleues B >= G >= R ; "
            "parcours une dizaine d'étoiles, toutes identiques = couleurs écrasées. ")
STARS_NB_FIX = ("AJUSTER : magenta -> NB to RGB ou étoiles HOO synthétiques, sinon CorrectMagentaStars ; bleues verdâtres ou étoiles trop rouges -> plus de H dans le vert (G = a·H + (1 − a)·O : monter a rend les bleues moins vertes et les rouges plus jaunes) ; étoiles chaudes trop jaunes ou verdâtres -> moins de H dans le vert ; "
                "criardes -> Color Boost plus bas ; toutes blanches -> étirement plus doux ; anneau cœur rouge / halo cyan -> réduction d'étoiles ou désaturation des halos. "
                "Étoiles vraiment calibrées : quelques poses RGB courtes (workflow RGB + SHO).")

sho = pre_block() + nb_masters(['S', 'H', 'O']) + [
    sho_combine,
    (M.bxt('BXT_NB', False, 0.25, 0.0, 0.60), D_BXT_NB + BXT_C),
    (M.sxt('SXT_lineaire', False), D_SXT_LIN + " Sur l'image SHO : GARDE LES DEUX images (fond et étoiles), les étoiles viennent ici du narrowband."),
    NXT_NB,
] + extract([(0, 'S'), (1, 'H'), (2, 'O')], "l'image SHO sans étoiles") + extract([(0, 'S_stars'), (1, 'H_stars'), (2, 'O_stars')], "l'image d'étoiles SHO (linéaire)") + nb_noise + ghs_block(GHS_NB, STAT_NB) + sho_palette + finish_block(sho_finish, galaxie=True) + [
    (note('NB_to_RGB_Stars', "ÉTOILES — méthode 1 : NB to RGB Star Combination (SetiAstro, script). Ha Stars et OIII Stars (linéaires, obligatoires), S optionnel. "
          "Green Channel Blend Ratio décoché par défaut (Ha to OIII ratio 0,3 si activé). Apply Star Stretch recommandé par l'auteur : Stretch Factor 5, Color Boost 1,0. "
          "Mélange du script (code v1.6) : R = 0,5·H + 0,5·S (H seul sans S), G = ratio·H + (1 − ratio)·O (0,3·H + 0,7·O par défaut), B = O ; monte le ratio si les étoiles bleues sont verdâtres ou les rouges trop rouges, baisse-le si les étoiles chaudes tirent vers le jaune-vert." + STARS_NB + STARS_NB_FIX), ''),
    (pm('Etoiles_HOO_synth', 'H_stars', '0.2*H_stars + 0.8*O_stars', 'O_stars', new_image=True, new_id='Stars_HOO', space='RGB'),
     "ÉTOILES — méthode 2 : étoiles HOO synthétiques (AIASTRO) sur les images d'étoiles linéaires 'H_stars' et 'O_stars' : R = H, G = 20 % H + 80 % O, B = O. "
     "Calibre ensuite la couleur, puis étire avec Star Stretch. Crée 'Stars_HOO' : mets ce nom dans l'icône Etoiles_screen à la place de NBtoRGB_stars. Rapport choisi par l'auteur en comparant à des étoiles RGB, propre à son matériel ; "
     "une légère teinte verte peut rester sur les étoiles bleues (passe à 0,3·H + 0,7·O)." + STARS_NB),
    (note('Star_Stretch', T_STARSTRETCH + " Étoiles narrowband : Color Boost plus bas si criardes, Stretch Amount plus bas si toutes blanches."), ''),
] + stars_end('NBtoRGB_stars', cms=True, cms_extra=' ' + STARS_NB + STARS_NB_FIX, alt=" Étoiles HOO synthétiques (méthode 2) : remplace NBtoRGB_stars par Stars_HOO dans l'icône.")

# ---------------------------------------------------------------- HOO
hoo = pre_block() + [
    (pm('DualBand_H', '$T[0]', new_image=True, new_id='H', space='Gray'),
     "CAMÉRA COULEUR + filtre dual-band seulement : applique sur l'image couleur (gradient retiré, BXT déjà appliqué) ; H = canal rouge. Caméra mono : ignore cette icône et la suivante."),
    (pm('DualBand_O', '($T[1] + $T[2]) / 2', new_image=True, new_id='O', space='Gray'),
     "CAMÉRA COULEUR + dual-band : O = moyenne de G et B. Le bleu est plus bruité et moins riche : donner plus de poids à G donne souvent un O plus propre (poids selon capteur et filtre). "
     "La fuite Bayer (O dans R, H dans B) ne peut pas être séparée parfaitement."),
] + nb_masters(['H', 'O']) + [
    (pm('Combinaison_HOO', 'H', 'O', 'O', new_image=True, new_id='HOO', space='RGB'),
     "Combinaison HOO SIMPLE : R = H, G = O, B = O, sans boost. Sert à BXT et SXT (en caméra couleur, BXT s'applique plutôt sur l'image d'origine avant extraction). Crée 'HOO'."),
    (M.bxt('BXT_NB', False, 0.25, 0.0, 0.60), D_BXT_NB + BXT_C),
    (M.sxt('SXT_lineaire', False), D_SXT_LIN + " Sur l'image HOO : garde l'image d'étoiles si tu n'as pas d'étoiles RGB."),
    NXT_NB,
] + extract([(0, 'H'), (1, 'O')], "l'image HOO sans étoiles") + nb_noise + ghs_block(GHS_NB, STAT_NB) + [
    (pm('HOO_simple', 'H', 'O', 'O', new_image=True, new_id='HOO_etire', space='RGB'),
     "PALETTE — combinaison simple sur 'H' et 'O' étirés sans étoiles, à équilibrer ensuite avec NarrowbandNormalization (icône suivante)."),
    (M.instance('NarrowbandNormalization', 'NBN_HOO', {'palette': 'Palette_HOO', 'o3Boost': '1.000', 's2Boost': '1.000', 'highlightReduction': '1.000', 'brightness': '1.000'}),
     ("NarrowbandNormalization, palette HOO (valeurs par défaut) : applique sur l'image HOO étirée sans étoiles, active l'aperçu, monte O3 boost progressivement, Shadowpoint pour le fond, SCNR si besoin. "
      "RENDU VISÉ (HOO classique R = H, G = B = O) : zones H rouge profond à rouge orangé, zones O cyan / turquoise, zones mixtes rose saumon à blanchâtre (or ou orange seulement si le vert reçoit du H : Foraxx HOO, variante Hubble), fond gris neutre foncé. "
      "CONTRÔLE à la sonde 15x15 : zone H R >> G = B ; zone O G = B, nettement au-dessus de R ; fond R = G = B (fond rouge : H trop étiré ; fond cyan : O trop étiré). G et B sont égaux avant NBN : un écart vient du module ou des courbes. "
      "AJUSTER : tout rouge -> O3 boost, sinon reprends l'étirement d'O ; cyan trop froid -> baisse O3 boost ou mets un peu de H dans le vert (G = 0,85·O + 0,15·H) ; fond coloré -> Shadowpoint ; O granuleux -> NXT plus fort sur O, LP plus haut ; "
      "détail pâteux -> Lightness Ha ou H en luminance ; SCNR souvent inutile en HOO. Étoiles cœur rouge / halo cyan : étoiles RGB, NB to RGB Star Combination ou étoiles HOO synthétiques, sinon désature. "
      "PAS DE HOO si la cible contient du S (SHO) ou si O est quasi absent (HaRGB, H en noir et blanc).")),
    (pm('Foraxx_HOO', 'H', '((O*H)^~(O*H))*H + ~((O*H)^~(O*H))*O', 'O', new_image=True, new_id='HOO_Foraxx', space='RGB'),
     "ALTERNATIVE — Foraxx HOO : le vert varie selon le rapport H/O (transitions orangées). Vues 'H' et 'O' étirées, sans étoiles, fonds proches."),
    (pm('HOO_Hubble', 'H', '0.6*H + 0.4*O', 'O', new_image=True, new_id='HOO_Hubble', space='RGB'),
     "ALTERNATIVE — variante « style Hubble » (Galactic Hunter) : G = 0,6·H + 0,4·O, tons plus dorés ; ajuste les coefficients."),
    (note('Perfect_Palette_Picker', T_PPP), ''),
    (note('NBColourMapper', T_NBCM), ''),
    (M.instance('LRGBCombination', 'H_en_luminance', {'mL': '0.500', 'mc': '0.400', 'noiseReduction': True}, post=M.lrgb_post),
     "Option — H en luminance : fais une copie de H étiré nommée 'L' (même fond et médiane proche que l'image HOO, sinon couleurs délavées), puis applique sur l'image HOO. Seul L activé, Lightness 0,5, Saturation 0,40."),
] + finish_block(galaxie=True) + [
    (note('Etoiles_HOO', "ÉTOILES — avec RGB : suis le bloc étoiles RGB du workflow RGB + SHO. Sans RGB : utilise l'image d'étoiles de SXT sur HOO (ou NB to RGB Star Combination), étire-la avec Star Stretch ; son nom ('HOO_stars' après SXT, 'NBtoRGB_stars' après NB to RGB, 'RGB_stars' avec RGB) doit être celui de l'icône Etoiles_screen. "
          "Les étoiles HOO tirent vers le rouge et le cyan : désature-les légèrement si besoin. "
          "STANDARD : étoiles plausibles, du bleu-blanc au jaune-orange, peu saturées, une gamme de couleurs, jamais vertes. En HOO classique (G = B = O), le magenta est impossible "
          "mais les étoiles chaudes sortent rouges ou saumon (jamais jaunes) et les froides cyan ; cœur rouge / halo cyan fréquent (étoiles O plus grosses). "
          "MIEUX : vert synthétique, G = 0,2·H + 0,8·O (AIASTRO) ou NB to RGB Star Combination (sans S : R = H, G = 0,3·H + 0,7·O, B = O) : étoile chaude G > B donc jaune-orange, froide G < B donc bleutée. "
          "Caméra couleur dual-band : NB to RGB accepte l'image couleur directement (H = canal rouge, O = canal vert seul). "
          "CONTRÔLE à la sonde 15x15 sur le halo : chaude R >= G >= B (G = B exactement = HOO classique, pas de jaune possible), froide B >= G >= R, pas de G au-dessus de R et B ; une dizaine d'étoiles pas toutes identiques. "
          "AJUSTER : bleues verdâtres ou chaudes trop rouges -> plus de H dans le vert ; chaudes jaune-vert -> moins ; cyan saturé -> désature ou Color Boost plus bas ; anneau rouge/cyan -> réduction d'étoiles ; toutes blanches -> étirement plus doux."), ''),
    (note('Star_Stretch', T_STARSTRETCH + " Étoiles HOO : Color Boost plus bas si le cyan ou le rouge est criard, Stretch Amount plus bas si toutes blanches."), ''),
] + stars_end('HOO_stars', alt=" Avec étoiles RGB : remplace HOO_stars par RGB_stars ; avec NB to RGB Star Combination : par NBtoRGB_stars ; étoiles synthétiques : par Stars_HOO.")

os.makedirs(OUT, exist_ok=True)
mat = [(spcc_perso('SPCC_QHY600_Antlia'), T_SPCC)] + [(M.spfc(n + '_QHY600_Antlia' if n != 'SPFC_RGB_filtres' else 'SPFC_RGB_QHY600_Antlia', **o), D_SPFC[n] + D_SPFC_COMMUN) for n, o in [
    ('SPFC_RGB_filtres', dict(rgb='antlia', gray='antlia_L_spec', qe='qe_imx455')), ('SPFC_L', dict(rgb='antlia', gray='antlia_L_spec', qe='qe_imx455')),
    ('SPFC_H', dict(nb=(656.3, 3.0), rgb='antlia', gray='antlia_L_spec', qe='qe_imx455')), ('SPFC_O', dict(nb=(500.7, 3.0), rgb='antlia', gray='antlia_L_spec', qe='qe_imx455')), ('SPFC_S', dict(nb=(672.4, 3.0), rgb='antlia', gray='antlia_L_spec', qe='qe_imx455'))]]
insts, icons = [], []
for i, (item, desc) in enumerate(mat):
    item = described(item, desc)
    insts.append(shorten(item[1], '', item[0]))
    icons.append('   <icon id="%s" instance="%s_instance" xpos="30" ypos="%d" workspace="Workspace01"/>' % (item[0], item[0], 30 + 30 * i))
# 04-Materiel-QHY600-Antlia.xpsm n'est plus écrit (seulement Conteneurs-X et Rapide-X)

# ---------------------------------------------------------------- MODE RAPIDE (LRGB, LHaRGB)
# Un fichier Rapide-X.xpsm : moins de clics, presque aucun réglage. MGC reste une icône à part (la liste des
# fichiers MARS est propre à chaque instance : l'utilisateur garde la sienne, réglée avec « Default Files »).
def flat(item):
    name, x = item
    return x.replace('id="%s_instance"' % name, 'id="__ID___instance"', 1)

def cont(name, items):
    return name, container(name, [flat(i) for i in items])

def stat_auto():
    n, x = script('Statistical_Stretch', '')
    a = '<td id="id">openDialogbox</td>\n            <td id="value">true</td>'
    assert a in x
    return n, x.replace(a, a.replace('true', 'false'))

GHS_FOND_R = lambda: ghs('GHS_fond', 10, hp=0.22, sf=1.0, sp=0.22)   # fond 0,25 (Statistical Stretch) -> environ 0,13
SPFC_OPTS = dict(rgb='antlia', gray='antlia_L_spec', qe='qe_imx455')

def pick(steps, base):
    for item, desc in steps:
        if item[0] == base:
            return item, desc
    raise KeyError(base)

WHEN_R = {}

def stf_icon():
    # STF neutre (c0 0, m 0,5 : aucun étirement) : l'icône sert à ouvrir la fenêtre ScreenTransferFunction
    name, x = M.instance('ScreenTransferFunction', 'STF')
    x = re.sub(r'<td id="c0" value="[^"]*"/>', '<td id="c0" value="0.00000"/>', x)
    x = re.sub(r'<td id="m" value="[^"]*"/>', '<td id="m" value="0.50000"/>', x)
    return name, x

bxt_rgb = lambda: M.bxt('BXT_RGB', False, 0.25, 0.0, 0.50)
gc_r = lambda: M.instance('GradientCorrection', 'GradientCorrection', {'generateGradientModel': False})   # mode rapide : pas de MARS
# Quatre variantes de C_L_rapide, dans le même fichier : la 1 au chemin principal, les 3 autres en options (P3).
#   sxt_etire : L étirée (Statistical Stretch + fond) AVANT SXT (Unscreen), sinon SXT en linéaire ;
#   etoilesL : luminance de L_stars ajoutée aux étoiles RGB_stars (Etoiles_LRGB) à la fin du conteneur, sinon L_stars fermée.
# L en mode rapide (choix de l'utilisateur) : SXT TOUJOURS avant l'étirement. C_L_rapide = GC, BXT, SXT linéaire, NXT, puis
# les 3 GHS à la main, puis Etoiles_LRGB (L_stars linéaire étirée comme les étoiles RGB, luminance ajoutée à RGB_stars).
def lineaire_rapide(etapes):
    """P3_rapide (demande de l'utilisateur) : une seule icône qui lance les icônes du chemin principal sur RGB et L (script Lineaire_auto.js)."""
    n, x = script('Lineaire_rapide', '')
    a = '<td id="id">etapes</td>\n            <td id="value"></td>'
    assert a in x
    return n, x.replace(a, '<td id="id">etapes</td>\n            <td id="value">%s</td>' % escape(etapes))

def lrgb_rapide(steps):
    """P5_rapide LRGB (demande de l'utilisateur) : LRGB_ajout_L avec étoiles, SXT Unscreen, saturation et SCNR des étoiles."""
    return cont('C_LRGB_rapide', [pick(steps, 'LRGB_ajout_L')[0]])   # Etoiles_auto_etire retiré puis supprimé (demande de l'utilisateur)

def rgb_etire_rapide(steps):
    """P4_rapide galaxies (demande de l'utilisateur) : MAS avec étoiles, SXT Unscreen (RGB_stars), SCNR vert sur RGB_stars, GHS fond (SP = HP = 0,12, fond MAS 0,15)."""
    return cont('C_RGB_etire_rapide', [pick(steps, 'MAS')[0], pick(steps, 'SXT_RGB_etire')[0], pick(steps, 'SCNR_etoiles_vert')[0], ghs('GHS_fond', 10, hp=0.12, sf=1.0, sp=0.12)])

def prep_rapide(steps):
    """E00 : renommage, LinearPatternSubtraction (masters mono ouverts), combinaison RGB, en un conteneur."""
    # Solver_auto en dernier (demande de l'utilisateur) : ImageSolver sur toutes les images ; conteneur lancé en Apply Global
    return (1, cont('C_Preparation_rapide', [pick(steps, b)[0] for b in ('Renommer_auto', 'LinearPatternSubtraction', 'Combinaison_RGB')] + [gc_solver('Solver_auto')]), '')

# Mode rapide rangé dans les colonnes d'options du workflow normal (demande de l'utilisateur) : plus de section R_ en bas.
# Les icônes identiques au normal (ImageSolver, GradientCorrection, Continuum_auto, H_dans_RGB, GHS, Etoiles_LRGB…) ne sont pas doublées.
def insert_after(steps, base, items):
    i = next(k for k, (it, d) in enumerate(steps) if it[0] == base)
    steps[i + 1:i + 1] = items

def insert_before(steps, base, items):
    i = next(k for k, (it, d) in enumerate(steps) if it[0] == base)
    steps[i:i] = items

prep_l, prep_h = prep_rapide(lrgb)[1], prep_rapide(lhargb)[1]
insert_after(lrgb, 'Combinaison_RGB', [(prep_l, ''), (gc_solver('Solver_auto'), '')])
insert_after(lrgb, 'ImageSolver', [(script('Gradient_auto_rapide', ''), '')])
# SCNR vert à 1,0 sur les étoiles : en P4, juste après SXT_RGB_etire, sur RGB_stars (script Etoiles_auto) ; plus en P7 (demande de l'utilisateur, 5 octobre 2026)
for _st in (lrgb, lhargb):
    insert_after(_st, 'Etoiles_screen', [(M.nxt('NXT_dernier', 0.25, 1), D_NXT_DERNIER)])   # toute dernière réduction de bruit, image finie avec étoiles (demande de l'utilisateur)
    insert_after(_st, 'SXT_RGB_etire', [(script('SCNR_etoiles_vert', ''), ''), (script('SCNR_etoiles_violet', ''), ''), (script('Saturation_grosses', ''), '')])   # vert au chemin principal ; violet et Saturation_grosses en options P4, pas dans le rapide (demande de l'utilisateur)
    # P7 (demande de l'utilisateur) : Fond_desature, Fond_auto (et Fond_auto_clair) sur l'image SANS étoiles, puis Etoiles_screen
    for _b in ('Fond_desature', 'Fond_auto', 'Fond_auto_clair'):
        _it = pick(_st, _b)
        _st.remove(_it)
        insert_before(_st, 'Etoiles_screen', [_it])

def fin_rapide(steps):
    """P6_rapide et P7_rapide (demande de l'utilisateur) : un conteneur par phase avec les étapes de la finition."""
    c6 = cont('C_Fin_rapide', list(hdrmt_items('0.3')) + [pick(steps, b)[0] for b in ('Masque_L', 'Courbes', 'LHE', 'LHE_fin')]
               + [script('Sharp_MMT', '')] + [pick(steps, b)[0] for b in ('Masque_retirer', 'NXT_final')])   # Sharp_MMT sous le masque (demande de l'utilisateur)
    c7 = cont('C_Etoiles_fond_rapide', [pick(steps, b)[0] for b in ('Fond_desature', 'Fond_auto', 'Etoiles_screen', 'NXT_dernier', 'Export_TIFF')])   # Export_TIFF en dernier (demande de l'utilisateur)
    return c6, c7

for _st in (lrgb, lhargb):
    # P4_rapide « Fin de GHS » (demande de l'utilisateur) : GHS_2_contraste puis GHS_3_fond en un conteneur, sur L après GHS_1_premier
    insert_after(_st, 'Statistical_Stretch', [(rgb_etire_rapide(_st), '')])   # R_C_Fin_GHS_rapide supprimé (demande de l'utilisateur)
    _c6, _c7 = fin_rapide(_st)
    insert_after(_st, 'LRGB_ajout_L', [(lrgb_rapide(_st), '')])
    insert_after(_st, 'NXT_final_fort', [(_c6, '')])
    _st.append((_c7, ''))
insert_before(lrgb, 'GHS_1_premier', [(lineaire_rapide('C_RGB_lineaire>RGB ; C_L_lineaire>L'), ''), (stf_icon(), '')])
insert_after(lhargb, 'Combinaison_RGB', [(prep_h, ''), (gc_solver('Solver_auto'), '')])
insert_after(lhargb, 'ImageSolver', [(script('Gradient_auto_rapide', ''), '')])
# LHaRGB : C_RGB_couleur_rapide et C_H_rapide sans GradientCorrection = C_RGB_couleur et BXT_L_H du chemin principal : supprimés
insert_before(lhargb, 'GHS_1_premier', [(lineaire_rapide('C_RGB_couleur>RGB ; BXT_L_H>L,H ; NXT_L>L ; SXT_L_lineaire>L'), ''), (stf_icon(), '')])

# Icônes à tester (demande de l'utilisateur, 5 octobre 2026) : binning, agrandissement, MAS, H_dans_RGB_v2, scripts tiers (GraXpert, VeraLux_HMS, MKStarReduction supprimés ensuite)
def agrandir_x2():
    # Resample (module Geometry, version 0x100) : x 2 en largeur et hauteur, Lanczos 3 (identifiants relevés dans la PCL)
    return M.build('Resample', 256, 'Agrandir_x2', [('xSize', '2.000000', 'v'), ('ySize', '2.000000', 'v'), ('mode', 'RelativeDimensions', 'v'),
                   ('absoluteMode', 'ForceWidthAndHeight', 'v'), ('interpolation', 'Lanczos3', 'v'), ('clampingThreshold', '0.30', 'v'), ('smoothness', '1.50', 'v'), ('noGUIMessages', True, 'v')])

for _st in (lrgb, lhargb):
    insert_after(_st, 'Statistical_Stretch', [(script('EZ_Soft_Stretch', ''), ''), (script('Star_Stretch', ''), '')])   # options P4 (demande de l'utilisateur, LRGB et LHaRGB) : EZ Soft Stretch, Star Stretch (6, SCNR)
    insert_after(_st, 'Solver_auto', [(script('Binning_x2', ''), '')])
    insert_before(_st, 'Masque_L', [(script('DarkStructureEnhance', ''), '')])
    insert_before(_st, 'ICC_sRGB', [(agrandir_x2(), '')])
insert_after(lhargb, 'H_dans_RGB', [(pm('H_dans_RGB_v2', 'w = 1.0;\n$T[0] + w*(HaNB - med(HaNB))', '$T[1]', '$T[2] + 0.2*w*(HaNB - med(HaNB))', symbols='w'), '')])
insert_before(lhargb, 'H_dans_RGB', [(script('CombineHaWithRGB', ''), '')])
# LHaRGB (demande de l'utilisateur, 5 octobre 2026) : P3 = C_RGB_couleur, BXT_L_H, NXT_L, SXT_L_lineaire, CombineHaWithRGB (sur H, par sa fenêtre :
# glissé il échoue, « already being processed »), C_RGB_bruit ; Continuum_auto en option ; PhotometricContinuumSubtraction, Ha_screen, R_C_Ha_rapide et R_C_P3_rapide essayés puis retirés
for _b in ('NXT_L', 'SXT_L_lineaire'):
    _it = pick(lhargb, _b)
    lhargb.remove(_it)
    insert_before(lhargb, 'Continuum_auto', [_it])

def turbo_debut(steps, extra=()):
    """Turbo (demande de l'utilisateur) : en une fois R_C_Preparation_rapide, R_Gradient_auto_rapide, R_Lineaire_rapide (leurs étapes à la suite, un seul conteneur, Apply Global)"""
    return cont('Turbo_debut', [pick(steps, b)[0] for b in ('Renommer_auto', 'LinearPatternSubtraction', 'Combinaison_RGB')] + [gc_solver('Solver_auto'),
                script('Gradient_auto_rapide', ''), pick(steps, 'Lineaire_rapide')[0]] + list(extra))
insert_after(lrgb, 'C_Preparation_rapide', [(turbo_debut(lrgb), '')])   # colonne P1, à côté de R_C_Preparation_rapide
insert_after(lhargb, 'C_Preparation_rapide', [(turbo_debut(lhargb), '')])   # turbo LHaRGB laissé tel quel (Lineaire_auto), à revoir (demande de l'utilisateur)

# Narrowband (demande de l'utilisateur, 8 octobre 2026) : mêmes ajouts que le LRGB et le LHaRGB, sauf les rapides et le turbo (plus tard).
# Finition galaxies (HDRMT_30, C_Finition à 0,58, C_Sharp_MMT, NXT_final au chemin principal, options P6) via finish_block(galaxie=True) ;
# fin P7 : Fond_desature, Fond_auto (options Fond_auto_clair) sur l'image SANS étoiles avant la recombinaison, NXT_dernier juste après ;
# la recombinaison par défaut reste Etoiles_reduites en nébuleuse (Etoiles_screen en alternative). Options STF, EZ_Soft_Stretch, Binning_x2,
# DarkStructureEnhance, Agrandir_x2 ; Etoiles_plafond retiré. Pas de Boost_final (masque tiré de L).
D_NXT_DERNIER_NB = D_NXT_DERNIER.replace("juste après Etoiles_screen", "juste après la recombinaison des étoiles (Etoiles_reduites ou Etoiles_screen)")
for _st in (rgbsho, sho, hoo):
    _st.insert(next(k for k, (it, d) in enumerate(_st) if it[0] == 'GHS_1_premier'), (stf_icon(), ''))
    insert_after(_st, 'Statistical_Stretch', [(script('EZ_Soft_Stretch', ''), '')])
    insert_after(_st, 'ImageSolver', [(script('Binning_x2', ''), '')])
    insert_before(_st, 'Masque_L', [(script('DarkStructureEnhance', ''), '')])
    insert_before(_st, 'ICC_sRGB', [(agrandir_x2(), '')])
    _it = pick(_st, 'Fond_desature')
    _st.remove(_it)
    insert_before(_st, 'Etoiles_screen', [_it, (note('Fond_auto', D_FOND), ''), (script('Fond_auto_clair', ''), '')])
    insert_after(_st, 'Etoiles_reduites', [(M.nxt('NXT_dernier', 0.25, 1), D_NXT_DERNIER_NB)])
    _st[:] = [x for x in _st if x[0][0] != 'Etoiles_plafond']
# P3 rapide narrowband (demande de l'utilisateur, 8 octobre 2026) : conteneur de scripts (Apply Global) ; Lineaire_auto lance les icônes du chemin
# principal sur leurs vues, Fermer_vues ferme les masters avant l'extraction (elle recrée S, H, O) et les images linéaires devenues inutiles
_P3_NB = {
    'RSHO': ('Combinaison_SHO>H', 'S, H, O', 'C_SHO_lineaire>SHO ; C_Extraction_SHO>SHO ; C_RGB_lineaire>RGB', 'SHO, SHO_stars'),
    'SHO': ('Combinaison_SHO>H', 'S, H, O', 'C_SHO_lineaire>SHO ; C_Extraction_SHO>SHO ; C_Extraction_etoiles>SHO_stars', 'SHO'),
    'HOO': ('Combinaison_HOO>H', 'H, O', 'C_HOO_lineaire>HOO ; C_Extraction_HOO>HOO', 'HOO'),
}
def lineaire_nb_items(prefix):
    comb, masters, suite, fin = _P3_NB[prefix]
    return [lineaire_rapide(comb), fermer('Fermer_masters', masters), lineaire_rapide(suite), fermer('Fermer_lineaires', fin)]
def lineaire_rapide_nb(prefix):
    return cont('C_Lineaire_rapide', lineaire_nb_items(prefix))
# RGB + SHO (demande de l'utilisateur, 8 octobre 2026 : « Il faut faire la meme chose que sur LRGB pour arriver jusqu'a RGB_stars ») :
# P2 SPFC_RGB_filtres + MGC_MARS sur RGB, P3 C_RGB_lineaire (BXT Correct Only, SPCC, BXT, NXT), P4 MAS, SXT_RGB_etire (RGB_stars), SCNR_etoiles_vert,
# options SCNR_etoiles_violet et Saturation_grosses, puis Fermer_RGB (le RGB sans étoiles ne sert plus). Mêmes icônes que le LRGB.
insert_before(rgbsho, 'MGC_MARS', [pick(lrgb, 'SPFC_RGB_filtres')])
insert_after(rgbsho, 'Extraire_O', [pick(lrgb, b) for b in ('BXT_CorrectOnly', 'Find_Background', 'SPCC', 'BXT_RGB', 'NXT_RGB')])
insert_after(rgbsho, 'GHS_3_fond', [pick(lrgb, b) for b in ('MAS', 'SXT_RGB_etire', 'SCNR_etoiles_vert', 'SCNR_etoiles_violet', 'Saturation_grosses')] + [(fermer('Fermer_RGB', 'RGB'), '')])
# P4 rapide RGB + SHO (demande de l'utilisateur, 8 octobre 2026 : « un P4 comme pour LRGB qui travaille sur le RGB et fait le RGB_stars a la fin ») :
# conteneur de scripts en Apply Global (rien à glisser) : Lineaire_auto lance MAS et SXT_RGB_etire du chemin principal sur RGB, SCNR_etoiles_vert sur RGB_stars, Fermer_RGB
insert_after(rgbsho, 'Fermer_RGB', [(cont('C_RGB_etoiles_rapide', [lineaire_rapide('MAS>RGB ; SXT_RGB_etire>RGB'), script('SCNR_etoiles_vert', ''), fermer('Fermer_RGB', 'RGB')]), '')])
# RGB + SHO, continuum (demande de l'utilisateur, 8 octobre 2026 : « il faut pouvoir gerer le continuum aussi » ; choix : nettoyer H, O, S par le RGB,
# RGB + SHO seulement) : options P3 avant Combinaison_SHO ; ContinuumSubtraction.js (SetiAstro, code 1.3.5 lu) accepte Ha, OIII, SII et un RGB
# (Red (or RGB) : il en extrait R et G) et crée HaNB, SIINB (avec R), OIIINB (avec G)
# Version Starless (demande de l'utilisateur, 8 octobre 2026 : « OK » pour remplacer la version Starry ; pratiques : nébuleuse -> images sans étoiles) :
# à la fin de P3, sur S, H, O déjà extraits SANS étoiles et une copie du RGB linéaire sans étoiles (RGB_cont) ; RGB garde ses étoiles pour MAS (P4)
_cs = SCRIPTS['Continuum_auto']
SCRIPTS['Continuum_SHO'] = (_cs[0], _cs[1], [(k, 'false' if k == 'starrySelected' else v) for k, v in _cs[2]], _cs[3])
insert_after(rgbsho, 'NXT_RGB', [
    (pm('Copie_RGB_continuum', '$T', new_image=True, new_id='RGB_cont', space='RGB'), ''),
    (M.instance('StarXTerminator', 'SXT_RGB_continuum', {'output_stars': False, 'unscreen': False, 'remove_reflections': True}), ''),
    (cont('C_Continuum_prep', [lineaire_rapide('Opt_Copie_RGB_continuum>RGB ; Opt_SXT_RGB_continuum>RGB_cont')]), ''),
    (script('Continuum_SHO', ''), ''),
    (cont('C_NB_renommer', [pm('NB_vers_H', 'HaNB', new_image=True, new_id='H', space='Gray'), pm('NB_vers_O', 'OIIINB', new_image=True, new_id='O', space='Gray'),
                            pm('NB_vers_S', 'SIINB', new_image=True, new_id='S', space='Gray')]), ''),
    (cont('C_Continuum_fin', [fermer('Fermer_canaux', 'S, H, O, RGB_cont, RGB_cont_R, RGB_cont_G'), lineaire_rapide('Opt_C_NB_renommer>HaNB'),
                              fermer('Fermer_NB', 'HaNB, OIIINB, SIINB')]), '')])
# Mode rapide narrowband, phase 1 (demande de l'utilisateur, 8 octobre 2026) : R_C_Preparation_rapide comme en galaxies, sans Combinaison_RGB
# (la combinaison SHO ou HOO se fait après le gradient, en phase 3) ; RGB + SHO : Combinaison_RGB des étoiles RGB gardée, comme en LRGB
for _st, _rgb in ((rgbsho, True), (sho, False), (hoo, False)):
    insert_after(_st, 'Renommer_auto', [(cont('C_Preparation_rapide', [pick(_st, b)[0] for b in ('Renommer_auto', 'LinearPatternSubtraction')]
                                              + ([rgb_comb_item()[0]] if _rgb else []) + [gc_solver('Solver_auto')]), '')])
    insert_after(_st, 'ImageSolver', [(script('Gradient_auto_rapide', ''), '')])   # P2 rapide (demande de l'utilisateur) : GradientCorrection sur toutes les images, comme en galaxies
    insert_before(_st, 'STF', [(lineaire_rapide_nb({id(rgbsho): 'RSHO', id(sho): 'SHO', id(hoo): 'HOO'}[id(_st)]), '')])   # P3 rapide
    # Turbo narrowband (demande de l'utilisateur, 8 octobre 2026) : R_C_Preparation_rapide + R_Gradient_auto_rapide + R_C_Lineaire_rapide en un seul conteneur, Apply Global
    _p = {id(rgbsho): 'RSHO', id(sho): 'SHO', id(hoo): 'HOO'}[id(_st)]
    insert_after(_st, 'C_Preparation_rapide', [(cont('Turbo_debut', [pick(_st, b)[0] for b in ('Renommer_auto', 'LinearPatternSubtraction')]
                                                    + ([rgb_comb_item()[0]] if _rgb else []) + [gc_solver('Solver_auto'), script('Gradient_auto_rapide', '')]
                                                    + lineaire_nb_items(_p)), '')])
for _st, _et in ((rgbsho, 'RGB_stars'), (sho, 'NBtoRGB_stars'), (hoo, 'HOO_stars')):
    # Nettoyage_sans_etoiles : image d'étoiles du workflow
    _k = next(k for k, (it, d) in enumerate(_st) if it[0] == 'Nettoyage_sans_etoiles')
    (_n, _x), _d = _st[_k]
    _a = '<td id="id">etoiles</td>\n            <td id="value">RGB_stars</td>'
    assert _a in _x
    _st[_k] = ((_n, _x.replace(_a, _a.replace('RGB_stars', _et))), _d)

# options supprimées des workflows galaxies (demande de l'utilisateur, 5 octobre 2026) ; Etoiles_grosses reste en narrowband
SUPPR_GALAXIES = {'Etoiles_plafond'}   # Etoiles_grosses remise en option P7 (demande de l'utilisateur) ; Etoiles_auto_etire, GraXpert, VeraLux_HMS, MKStarReduction, Coeurs_etoiles, RepairedHSV, Etoiles_couleur : retirés du code
for _st in (lrgb, lhargb):
    _st[:] = [x for x in _st if x[0][0] not in SUPPR_GALAXIES]
# LHaRGB, phase 3 en un seul rapide glissé sur RGB (demande de l'utilisateur ; CombineHaWithRGB se glisse maintenant) : BXT Correct Only, SPCC, BXT sur RGB
# (la vue glissée), Lineaire_auto sur L et H seulement (BXT_L_H, NXT_L, SXT_L_lineaire : jamais la vue glissée), CombineHaWithRGB, NXT, H, R, HaNB fermées.
# R_Lineaire_rapide retirée du LHaRGB (le turbo garde ses étapes)
_i = next(k for k, (it, d) in enumerate(lhargb) if it[0] == 'Lineaire_rapide')
lhargb[_i] = (cont('C_P3_rapide', [pick(lhargb, b)[0] for b in ('BXT_CorrectOnly', 'SPCC', 'BXT_RGB')] + [lineaire_rapide('BXT_L_H>L,H ; NXT_L>L ; SXT_L_lineaire>L')]
                   ), '')   # CombineHaWithRGB, NXT et fermeture retirés du rapide (demande de l'utilisateur) : à faire au chemin principal (E14, E15)
# repère NoOperation juste après R_C_P3_rapide (demande de l'utilisateur) : la suite du continuum se fait à la main
insert_after(lhargb, 'C_P3_rapide', [(note('Main_continuum', "À FAIRE À LA MAIN (pas de rapide pour cette partie) : E14_Continuum_auto (fenêtre), E15_CombineHaWithRGB et E16_C_RGB_bruit glissés sur RGB, E17_Fermer_continuum (double-clic puis Apply Global) ; ensuite GHS_1_premier sur L."), '')])

for fn, pre, title, steps in [
    ('Workflow-LRGB.xpsm', 'LRGB', 'Workflow LRGB', lrgb),
    ('Workflow-LHaRGB.xpsm', 'LHA', 'Workflow LHaRGB', lhargb),
    ('Workflow-RGB-SHO.xpsm', 'RSHO', 'Workflow RGB + SHO (étoiles RGB)', rgbsho),
    ('Workflow-SHO-sans-RGB.xpsm', 'SHO', 'Workflow SHO sans RGB', sho),
    ('Workflow-HOO.xpsm', 'HOO', 'Workflow HOO', hoo),
]:
    print(fn, 'principal, options, avec conteneurs :', write(fn, pre, title, steps))


