"""Génère un fichier .xpsm par workflow de la fiche PixInsight, avec tous les process
dans l'ordre et une description détaillée sur chaque icône.
Réutilise les modèles et fonctions de make_icons.py (instances réelles PixInsight 1.9.3)."""
import os, re, sys, tempfile
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]
sys.argv = [sys.argv[0], tempfile.mkdtemp()]
import make_icons as M  # noqa: E402  (génère les icônes unitaires dans un dossier temporaire)

ALL = open(os.environ.get('ALL_XPSM', os.path.join(HERE, 'all.x')), encoding='utf-8').read()

def described(item, text):
    name, t = item
    t = re.sub(r'(<instance [^>]*>)', lambda m: m.group(1) + '\n      <description>%s</description>' % escape(text), t, count=1)
    return name, t

def renamed(item, new):
    name, t = item
    return new, t.replace('id="%s_instance"' % name, 'id="%s_instance"' % new, 1)

def note(name, text):
    return name, ('   <instance class="NoOperation" version="256" id="%s_instance">\n'
                  '      <description>%s</description>\n   </instance>' % (name, escape(text)))

def raw(src_id, new):
    m = re.search(r'<instance class="[^"]+" version="\d+" id="%s_instance">.*?</instance>' % src_id, ALL, re.S)
    t = re.sub(r'\n\s*<time[^>]*/>', '', m.group(0))
    return new, '   ' + t.replace('id="%s_instance"' % src_id, 'id="%s_instance"' % new, 1)

def curves(name):
    def post(t):
        def table(tid, pts):
            rows = ''.join('\n         <tr>\n            <td id="x" value="%.5f"/>\n            <td id="y" value="%.5f"/>\n         </tr>' % p for p in pts)
            return '<table id="%s" rows="%d">%s\n      </table>' % (tid, len(pts), rows)
        t, n1 = re.subn(r'<table id="K" rows="\d+">.*?</table>', lambda m: table('K', [(0, 0), (0.25, 0.22), (0.75, 0.78), (1, 1)]), t, flags=re.S)
        t, n2 = re.subn(r'<table id="S" rows="\d+">.*?</table>', lambda m: table('S', [(0, 0), (0.5, 0.6), (1, 1)]), t, flags=re.S)
        assert n1 == 1 and n2 == 1
        return t
    return M.instance('CurvesTransformation', name, post=post)

def ghs(name, b, hp=1.0, lp=0.0, channel='SC_RGB'):
    return M.instance('GeneralizedHyperbolicStretch', name, {
        'stretchType': 'ST_GeneralisedHyperbolic', 'stretchChannel': channel, 'inverse': False,
        'stretchFactor': '0.000', 'localIntensity': '%.3f' % b, 'symmetryPoint': '0.000000',
        'highlightProtection': '%.6f' % hp, 'shadowProtection': '%.6f' % lp, 'clipType': 'CT_RGBBlend'})

def pm(*a, **k):
    return M.pixelmath(*a, **k)

def write(filename, prefix, title, steps):
    """steps : liste de (item, description). Les icônes sont numérotées dans l'ordre."""
    insts, icons = [], []
    for i, (item, desc) in enumerate(steps, 1):
        name = '%s_%02d_%s' % (prefix, i, item[0])
        item = renamed(item, name)
        if 'class="NoOperation"' not in item[1]:
            item = described(item, desc)
        insts.append(item[1])
        col, row = divmod(i - 1, 14)
        icons.append('   <icon id="%s" instance="%s_instance" xpos="%d" ypos="%d" workspace="Workspace01"/>' % (name, name, 30 + 300 * col, 30 + 30 * row))
    xml = M.HEADER + '<!-- ' + escape(title) + ' -->\n' + '\n'.join(insts) + '\n' + '\n'.join(icons) + '\n</xpsm>\n'
    open(os.path.join(OUT, filename), 'w', encoding='utf-8').write(xml)
    return len(steps)

# ---------------------------------------------------------------- textes communs
SRC = ' Détails et sources : docs/pixinsight-workflow.html et docs/sources.md (github.com/clodoweg/PixInsight).'
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
T_SOLVER = ("ÉTAPE MANUELLE — ImageSolver (Script › Image Analysis › ImageSolver). Icône-note : dépend de ta focale et de ta caméra. Inutile si WBPP a déjà résolu l'image. "
            "Réglages : Search coordinates avec le nom de l'objet ; focale et taille de pixel de ton setup ; catalogue Gaia DR3 local (XPSD) ; Distortion correction pour les grands champs.")
T_MGC = ("ÉTAPE MANUELLE — Gradient par MARS : SpectrophotometricFluxCalibration (SPFC) puis MultiscaleGradientCorrection (MGC). Icône-note : SPFC dépend de ton capteur/filtres, MGC de l'emplacement de ta base MARS. "
         "Prérequis : image linéaire, solution astrométrique, bases Gaia DR3/SP et MARS installées (clé à molette de MGC › Add › fichier .xmars). "
         "SPFC (Process › ColorCalibration) : QE curve = ton capteur, sinon Ideal QE curve ; image mono : Gray filter = ton filtre (Narrowband mode + longueur d'onde et bande passante pour Ha/OIII/SII) ; image couleur : Red/Green/Blue filter = tes filtres ou les filtres Bayer du capteur ; Catalog Gaia DR3/SP ; Automatic limit magnitude coché ; le reste par défaut. SPFC ne modifie pas les pixels (métadonnées de flux pour MGC) ; utilise ensuite les mêmes filtres dans SPCC. "
         "MGC : Use MARS database coché, filtres MARS Gray = L, Red = R, Green = G, Blue = B ; Gradient scale 1024 au départ (512 ou 256 si un gradient reste dans les coins), Structure separation 3 (1-2 pour les bords), Model smoothness 1,0 (3-5 si le modèle ondule), Scale factors 1,0, Show gradient model coché. "
         "Si ta base MARS ne couvre pas le filtre (narrowband), utilise l'icône GradientCorrection ou DBE.")
T_GC = ("ALTERNATIVE — GradientCorrection, valeurs par défaut. Structure protection activée ; Generate gradient model coché pour contrôler le modèle. "
        "Si des zones claires apparaissent autour des structures sombres : monte Low threshold. Si le modèle a des bords nets : désactive la protection, baisse Scale et Smoothness, puis réactive.")
T_DBE = ("ALTERNATIVE — DynamicBackgroundExtraction. Icône-note : les points dépendent de l'image. Samples per row 10-20 ; Sample radius 10-50 ; Tolerance 0,5 (1,0-1,5 si points rejetés) ; "
         "Shadows relaxation 3 ; Smoothing 0,25 (0,5-1,0 champs nébuleux) ; Correction Subtraction (pollution lumineuse), Division seulement pour le vignettage ; Normalize, Discard model et Replace target cochés. "
         "Retire les points posés sur la nébuleuse. D'un filtre à l'autre, garde les points et ajuste Tolerance.")
T_SPCC = ("SPCC — Average Spiral Galaxy, neutralisation du fond activée. ATTENTION : cette icône contient les filtres Astrodon E-series et le capteur Sony IMX571 de l'auteur du modèle : "
          "remplace-les par TES filtres et TON capteur. Crée une preview sur du fond vide et choisis-la comme référence de fond. Coche Generate graphs pour contrôler. "
          "Toujours en linéaire, après le gradient et BXT Correct Only, avant BXT complet.")
T_STAT = ("ÉTAPE MANUELLE — Statistical Stretch (SetiAstro, script). Icône-note : le chemin du script dépend de ton installation. Alternative à GHS. "
          "Target Median 0,25 (défaut, 0,15-0,25) ; Linked Stretch coché pour une image couleur calibrée ; Blackpoint Sigma 5,0 ; Normalize décoché ; Curves Boost 0 ; même Target Median pour les images à combiner.")
T_STARSTRETCH = ("ÉTAPE MANUELLE — Star Stretch (SetiAstro, script) sur l'image d'étoiles LINÉAIRE issue de SXT. Stretch Amount 5 (défaut, prudence au-delà) ; Color Boost 1,0 (0 à 2) ; "
                 "Remove Green via SCNR optionnel (décoché par défaut).")
T_HALO = "ÉTAPE MANUELLE — Halo-B-Gon (SetiAstro, script) sur l'image d'étoiles seule. Reduction Amount Low au départ (Extra Low / Low / Med / High) ; Linear Data coché seulement si l'image est encore linéaire."
T_CMS = ("ÉTAPE MANUELLE — CorrectMagentaStars (Script › Utilities). Sur l'image SHO finale avec étoiles. Amount 0,8 (défaut, 0 à 1). "
         "Le script inverse l'image, retire le vert avec SCNR (le magenta inversé), puis réinverse.")
T_NBCM = "OPTION — NBColourMapper (Mike Cranfield, script). Une couche par filtre sans étoiles : Ha rouge-orangé, OIII cyan-bleu, SII rouge profond ou or ; règle teinte et saturation avec l'aperçu."

def cc():
    return M.instance('CosmeticCorrection', 'CC_auto', {'useAutoDetect': True, 'hotAutoCheck': True, 'hotAutoValue': '2.5', 'coldAutoCheck': False, 'coldAutoValue': '3.0', 'cfa': False})

D_CC = ("CosmeticCorrection pour WBPP : Auto detect, Hot sigma 2,5 (2,2 à 3,0 ; 2,2-2,5 en narrowband, poses longues), Cold désactivé. Coche CFA si caméra couleur. "
        "Ne l'applique pas directement : dans WBPP, sélectionne cette icône comme modèle de correction cosmétique.")
D_BXT_CO = ("BlurXTerminator — Correct Only, AVANT SPCC (manuel RC Astro) : corrige aberrations, coma et tilt sans accentuer. Sur l'image couleur combinée, en linéaire, après le gradient. "
            "Si les aberrations diffèrent d'un filtre à l'autre : applique-le sur chaque master avant de combiner.")
D_SXT_LIN = ("StarXTerminator — sur données LINÉAIRES, le plus tôt possible après BXT (RC Astro). Generate star image coché, UNSCREEN DÉCOCHÉ (réservé aux images étirées) : "
             "simple soustraction, couleurs d'étoiles les plus fidèles. N'applique pas l'autoSTF de façon permanente à l'image d'étoiles. Large overlap : décoché par défaut, à cocher seulement si un quadrillage apparaît (deux fois plus lent).")
D_GHS1 = ("GHS, 1er étirement — Stretch factor à 0 : l'icône ne fait rien tant que tu ne l'as pas réglée. Zoome l'histogramme, clique dans l'image sur la zone intéressante la plus faible (sonde 15x15), "
          "Send to SP. Local intensity (b) = 10. Monte Stretch factor jusqu'à un pic d'histogramme vers 0,20-0,25. Retire l'autoSTF, active l'aperçu, affine SP. "
          "Image couleur : passe Colour mode sur Colour (clip RGBBlend). Même niveau de fond visé pour toutes les images à combiner.")
D_GHS2 = ("GHS, ajout de contraste (passes suivantes) — clique sur une zone qui paraît plate, Send to SP ; Local intensity (b) 4 (3 à 5) ; monte Stretch factor doucement ; "
          "baisse HP (ici 0,90) pour protéger les étoiles et les cœurs brillants ; monte LP pour garder le fond sombre. 1 à 3 passes.")
D_GHS3 = ("GHS, assombrir le fond sans écrêter — SP juste sous le niveau à rendre noir, HP = SP (règle HP à la même valeur que SP), LP = 0, b = 10 ; ajuste Stretch factor. "
          "Plus propre qu'un point noir en Linear, qui détruit des données.")
D_SCREEN = ("Recombinaison des étoiles en mode screen : ~((~starless) * (~stars)). Renomme la vue sans étoiles 'starless' et l'image d'étoiles 'stars', toutes deux étirées. "
            "Résultat : nouvelle image 'Final'.")
D_BL = ("Réduction d'étoiles Bill Blanshan, méthode Transfer V2 : applique sur l'image AVEC étoiles, la version sans étoiles de la même image (étirée pareil) doit s'appeler 'starless'. "
        "S = 0,15 (plus bas = étoiles plus petites). Les versions V3 et les méthodes Halo/Star sont dans 01-PixelMath-formules.xpsm.")
D_MT = ("Alternative : MorphologicalTransformation sur l'image d'étoiles seule (ou avec un masque d'étoiles). Morphological Selection 0,25 (sous 0,5 = érosion), Amount 0,60, 1 itération, élément circulaire 5x5.")
D_CURVES = ("CurvesTransformation — légère courbe en S sur RGB/K (0,25→0,22 ; 0,75→0,78) et saturation (canal S : milieu monté de 0,5 à 0,6). "
            "Ajuste à l'œil, idéalement sous un masque de luminance pour protéger le fond.")
D_LHE = "LocalHistogramEqualization sur l'image sans étoiles, sous masque de luminance : Kernel radius 150 (64 à 300 selon les structures), Contrast limit 2,0, Amount 0,35 (facile à exagérer)."
D_HDR = "HDRMultiscaleTransform sur l'image sans étoiles pour les zones brillantes : 6 couches, 1 itération (essaie 2), To lightness, Preserve hue et Lightness mask cochés. Trop fort : mélange à 50 % avec l'original."
D_NXT_F = "NoiseXTerminator, passe finale légère sur l'image étirée : Denoise 0,40, Detail 0,15. Seulement si besoin."

D_SPFC_COMMUN = (" Prérequis : image LINÉAIRE et résolue (ImageSolver ou WBPP), base Gaia DR3/SP installée. Catalog Gaia DR3/SP, Automatic limit magnitude coché, détection PSF par défaut. "
                 "SPFC ne modifie pas les pixels : il écrit les métadonnées de flux lues par MGC. Utilise ensuite les MÊMES filtres dans SPCC.")
D_SPFC = {
 'SPFC_RGB_filtres': "SPFC sur l'image RGB combinée, configuré pour ton matériel : QE curve Sony IMX411/455/461/533/571 (QHY600), Red/Green/Blue filter = Antlia V Pro Series R, G, B (courbes de ta base de filtres). Mêmes filtres que l'icône SPCC.",
 'SPFC_L': "SPFC sur le master L : QE curve IMX455 ; Gray filter = Generic UV-IR-CUT Filter, approximation car le filtre Antlia V Pro L n'est pas dans ta base de filtres (remplace-le si tu l'ajoutes).",
 'SPFC_Ha': "SPFC sur le master Ha : QE curve IMX455 ; Narrowband mode, 656,3 nm, bande passante 3 nm À CONFIRMER selon ton filtre Antlia (3 nm Pro : 3 nm).",
 'SPFC_OIII': "SPFC sur le master OIII : QE curve IMX455 ; Narrowband mode, 500,7 nm, bande passante 3 nm À CONFIRMER selon ton filtre Antlia.",
 'SPFC_SII': "SPFC sur le master SII : QE curve IMX455 ; Narrowband mode, 672,4 nm, bande passante 3 nm À CONFIRMER selon ton filtre Antlia.",
}
D_MGC = ("MultiscaleGradientCorrection, juste après SPFC, sur la même image. Use MARS database coché ; filtres MARS Gray = L (image mono), Red = R, Green = G, Blue = B (image couleur) ; "
         "Gradient scale 1024 (512 ou 256 si un gradient reste dans les coins), Structure separation 3 (1-2 pour les bords), Model smoothness 1,0 (3-5 si le modèle ondule), Scale factors 1,0, Show gradient model coché. "
         "La base MARS se charge dans les préférences de MGC (clé à molette › Add › fichier .xmars) : si MGC signale qu'aucune base n'est chargée, ajoute-la là. "
         "Narrowband : seulement si ta base MARS couvre le filtre, sinon utilise GradientCorrection ou DBE.")
D_DBE = ("ALTERNATIVE — DynamicBackgroundExtraction, sans points (ils dépendent de l'image) : ouvre l'icône, clique sur l'image, puis Generate. Samples per row 15, Sample radius 15 (10 à 50), "
         "Tolerance 0,5 (1,0-1,5 si des points sont rejetés), Shadows relaxation 3, Smoothing 0,25 (0,5-1,0 champs nébuleux), Correction Subtract (Division seulement pour le vignettage), "
         "Normalize, Discard model et Replace target cochés. Retire les points posés sur la nébuleuse ; d'un filtre à l'autre, garde les points et ajuste Tolerance.")

def gradient_block(kind='rgb'):
    """kind : 'rgb' (RGB + L), 'lha' (RGB + L + Ha), 'sho', 'hoo'."""
    names = {'rgb': ['SPFC_RGB_filtres', 'SPFC_L'], 'lha': ['SPFC_RGB_filtres', 'SPFC_L', 'SPFC_Ha'],
             'sho': ['SPFC_SII', 'SPFC_Ha', 'SPFC_OIII'], 'hoo': ['SPFC_Ha', 'SPFC_OIII']}[kind]
    opts = {'SPFC_RGB_filtres': dict(rgb='antlia', gray='generic_uvir', qe='qe_imx455'), 'SPFC_L': dict(rgb='antlia', gray='generic_uvir', qe='qe_imx455'),
            'SPFC_Ha': dict(nb=(656.3, 3.0), rgb='antlia', gray='generic_uvir', qe='qe_imx455'), 'SPFC_OIII': dict(nb=(500.7, 3.0), rgb='antlia', gray='generic_uvir', qe='qe_imx455'),
            'SPFC_SII': dict(nb=(672.4, 3.0), rgb='antlia', gray='generic_uvir', qe='qe_imx455')}
    b = [(M.spfc(n, **opts[n]), D_SPFC[n] + D_SPFC_COMMUN) for n in names]
    b += [(M.mgc('MGC_MARS'), D_MGC),
          (M.instance('GradientCorrection', 'GradientCorrection'), T_GC),
          (M.dbe('DBE'), D_DBE)]
    return b

def pre_block():
    return [(note('WBPP', T_WBPP), ''), (cc(), D_CC), (M.crop('DynamicCrop'), "DynamicCrop, sans recadrage au départ (le cadre dépend de ton image) : ouvre l'icône, trace le cadre sur un master en excluant les bords mal couverts, "
            "glisse le triangle du process sur l'espace de travail pour créer ton icône, puis applique CETTE icône à tous les autres masters (ils sont alignés, le recadrage sera identique).")]

def finish_block(extra=None):
    b = [(curves('Courbes'), D_CURVES), (M.instance('LocalHistogramEqualization', 'LHE', {'radius': 150, 'slopeLimit': '2.0', 'amount': '0.350', 'circularKernel': True}), D_LHE),
         (M.instance('HDRMultiscaleTransform', 'HDRMT', {'numberOfLayers': 6, 'numberOfIterations': 1, 'toLightness': True, 'preserveHue': True, 'lightnessMask': True}), D_HDR)]
    if extra:
        b = extra + b
    return b + [(M.nxt('NXT_final', 0.40, 1), D_NXT_F)]

def stars_end(cms=False):
    b = [(pm('Etoiles_screen', '~((~starless) * (~stars))', new_image=True, new_id='Final'), D_SCREEN)]
    if cms:
        b.append((note('CorrectMagentaStars', T_CMS), ''))
    b += [(pm('Blanshan_Transfer', "S=0.15;\nImg1=starless;\nf1= ~((~mtf(~S,$T)/~mtf(~S,Img1))*~Img1);\nmax(Img1,f1)", symbols='S, Img1, f1'), D_BL),
          (M.instance('MorphologicalTransformation', 'MT_etoiles', {'operator': 'Selection', 'numberOfIterations': 1, 'amount': '0.60', 'selectionPoint': '0.25', 'structureSize': 5}, post=M.mt_post), D_MT),
          (note('Halo_B_Gon', T_HALO), '')]
    return b

def ghs_block(extra_desc=''):
    return [(ghs('GHS_1_premier', 10), D_GHS1 + extra_desc), (ghs('GHS_2_contraste', 4, hp=0.9), D_GHS2), (ghs('GHS_3_fond', 10), D_GHS3), (note('Statistical_Stretch', T_STAT), '')]

rgb_comb = lambda: (pm('Combinaison_RGB', 'R', 'G', 'B', new_image=True, new_id='RGB', space='RGB'),
                    "Combinaison RGB (équivalent de ChannelCombination) : nomme tes masters linéaires 'R', 'G' et 'B'. Crée l'image couleur 'RGB'.")
MATERIEL = "QHY600 (Sony IMX455) + filtres Antlia V Pro"

def spcc_perso(name):
    n, t = raw('SPCC_RGB_ASG', name)
    for ch in ('red', 'green', 'blue'):
        cn, cc = M.CURVES['antlia_' + ch]
        t, k1 = re.subn(r'<parameter id="%sFilterTrCurve">[^<]*</parameter>' % ch, '<parameter id="%sFilterTrCurve">%s</parameter>' % (ch, cc), t)
        t, k2 = re.subn(r'<parameter id="%sFilterName">[^<]*</parameter>' % ch, '<parameter id="%sFilterName">%s</parameter>' % (ch, escape(cn)), t)
        assert k1 == 1 and k2 == 1
    qn, qc = M.CURVES['qe_imx455']
    t, k1 = re.subn(r'<parameter id="deviceQECurve">[^<]*</parameter>', '<parameter id="deviceQECurve">%s</parameter>' % qc, t)
    t, k2 = re.subn(r'<parameter id="deviceQECurveName">[^<]*</parameter>', '<parameter id="deviceQECurveName">%s</parameter>' % escape(qn), t)
    assert k1 == 1 and k2 == 1
    return n, t

T_SPCC = ("SPCC configuré pour ton matériel (" + MATERIEL + ") : White reference Average Spiral Galaxy ; QE curve Sony IMX411/455/461/533/571 ; filtres Antlia V Pro Series R, G, B "
          "(courbes issues de ta base de filtres PixInsight) ; neutralisation du fond activée (limites -2,80 / +2,00) ; Generate graphs coché. "
          "Crée une preview sur du fond vide et choisis-la comme référence de fond. Toujours en linéaire, après le gradient et BXT Correct Only, avant BXT complet.")
spcc = lambda: (spcc_perso('SPCC'), T_SPCC)

# ---------------------------------------------------------------- LRGB
lrgb = pre_block() + [rgb_comb(), (note('ImageSolver', T_SOLVER), '')] + gradient_block('rgb') + [
    (M.bxt('BXT_CorrectOnly', True, 0.25, 0.0, 0.50), D_BXT_CO),
    spcc(),
    (M.bxt('BXT_RGB', False, 0.25, 0.0, 0.50), "BlurXTerminator complet sur RGB, APRÈS SPCC : Sharpen Stars 0,25 (0 à 0,5), Adjust Star Halos 0, PSF automatique, Sharpen Nonstellar 0,50 (le détail viendra de L). Avant toute réduction de bruit."),
    (M.bxt('BXT_L', False, 0.25, 0.0, 0.80), "BlurXTerminator complet sur L (linéaire, gradient retiré) : Sharpen Nonstellar 0,80 (0,70 à 0,90), plus fort que sur RGB car la luminance porte le détail. Si vers ou pores à 100 % : baisse Nonstellar."),
    (M.sxt('SXT_lineaire', False), D_SXT_LIN + " Sur RGB (garde les étoiles : ce sont celles de l'image finale) et sur L (jette ses étoiles)."),
    (M.nxt('NXT_RGB', 0.80, 1), "NoiseXTerminator sur RGB sans étoiles : Denoise 0,80 (0,70 à 0,90), Detail 0,15. Toujours après BXT. Fonctionne en linéaire ou après étirement (RC Astro)."),
    (M.nxt('NXT_L', 0.60, 1), "NoiseXTerminator sur L sans étoiles : Denoise 0,60 (0,50 à 0,70) pour garder le détail fin."),
] + ghs_block(" En LRGB : étire le RGB sans étoiles et L sans étoiles jusqu'au MÊME fond et à une médiane proche.") + [
    (note('Star_Stretch', T_STARSTRETCH), ''),
    (M.instance('LRGBCombination', 'LRGB_ajout_L', {'mL': '0.500', 'mc': '0.400', 'noiseReduction': True}, post=M.lrgb_post),
     "LRGBCombination sur les images étirées et SANS étoiles : seul L activé (renomme ta luminance 'L'), glisse le triangle sur le RGB. Lightness 0,5 ; Saturation 0,40 (plus bas = plus saturé) ; "
     "Chrominance noise reduction cochée. Couleurs délavées : L trop claire par rapport au RGB, étire-la moins."),
] + finish_block() + stars_end()

# ---------------------------------------------------------------- LHaRGB
lhargb = pre_block() + [rgb_comb(), (note('ImageSolver', T_SOLVER), '')] + gradient_block('lha') + [
    (M.bxt('BXT_CorrectOnly', True, 0.25, 0.0, 0.50), D_BXT_CO),
    spcc(),
    (M.bxt('BXT_RGB', False, 0.25, 0.0, 0.50), "BlurXTerminator complet sur RGB, après SPCC : Sharpen Stars 0,25, Halos 0, Nonstellar 0,50."),
    (M.bxt('BXT_L_Ha', False, 0.25, 0.0, 0.80), "BlurXTerminator complet sur L et sur le master Ha (mono, linéaires) : Nonstellar 0,80. Déconvolue AVANT tout mélange (soustraction du continuum, injection)."),
    (pm('Continuum_Ha', 'k = 0.9;\nHa - k*(R - med(R))', symbols='k', new_image=True, new_id='Ha_cs', space='Gray'),
     "Soustraction du continuum : Ha_cs = Ha - k*(R - med(R)). Vues 'Ha' et 'R' (master rouge linéaire, gradient retiré). Ajuste k (0,8 à 1) jusqu'à faire disparaître étoiles et disque galactique. "
     "med(R) garde le niveau du fond. Limite : résidus sur les étoiles (PSF différentes)."),
    (note('Continuum_auto', "OPTION — Automatic Continuum Subtraction (SetiAstro, script) : choisis Ha et R ; le script calcule le coefficient. Contrôle que les étoiles disparaissent de Ha_cs."), ''),
    (pm('Ha_dans_RGB', 'w = 1.0;\n$T[0] + w*Ha_cs', '$T[1]', '$T[2]', symbols='w'),
     "Injection de Ha_cs dans le rouge : applique sur l'image RGB (linéaire, calibrée) ; R' = R + w*Ha_cs, G et B inchangés. w de 0,5 à 2 selon l'effet voulu."),
    (pm('Ha_dans_L', 'a = 1.0;\nmax(L, Ha_cs*a)', symbols='a', new_image=True, new_id='L_Ha', space='Gray'),
     "Option : injection de Ha dans la luminance, L' = max(L, a*Ha_cs). Vues 'L' et 'Ha_cs'. Rend les régions HII plus nettes. Renomme ensuite 'L_Ha' en 'L' pour la suite."),
    (note('NBRGBCombination', "ALTERNATIVE — NBRGBCombination (Script › Utilities) : image RGB et sa bande passante (~100 nm pour un filtre R mono), image Ha dans le canal R avec la bande passante de ton filtre (3, 5, 7 nm), "
          "Scale 1,2 par défaut (3 à 5 pour un Ha faible). Compare avec les aperçus RGB et NBRGB."), ''),
    (M.sxt('SXT_lineaire', False), D_SXT_LIN + " Sur RGB (garde les étoiles) et sur L (jette ses étoiles)."),
    (M.nxt('NXT_RGB', 0.80, 1), "NoiseXTerminator sur RGB sans étoiles : Denoise 0,80, Detail 0,15."),
    (M.nxt('NXT_L', 0.60, 1), "NoiseXTerminator sur L sans étoiles : Denoise 0,60."),
] + ghs_block(" Étire RGB et L sans étoiles jusqu'au même fond.") + [
    (note('Star_Stretch', T_STARSTRETCH), ''),
    (M.instance('LRGBCombination', 'LRGB_ajout_L', {'mL': '0.500', 'mc': '0.400', 'noiseReduction': True}, post=M.lrgb_post),
     "LRGBCombination sur les images étirées sans étoiles : seul L activé (vue 'L'), Lightness 0,5, Saturation 0,40, Chrominance noise reduction cochée."),
] + finish_block() + stars_end()

# ---------------------------------------------------------------- narrowband communs
def nb_masters(chans):
    names = ' et '.join(chans)
    return [(note('Masters_' + '_'.join(chans), "Masters %s : même recadrage (icône DynamicCrop) et retrait du gradient sur CHAQUE master séparément (icônes suivantes). OIII est le plus sensible à la Lune : contrôle bien son modèle. "
                  "Nomme les vues exactement 'Sii', 'Ha' et 'Oiii' : les formules en dépendent." % names), '')] + gradient_block('sho' if 'Sii' in chans else 'hoo') + [
        (M.instance('LinearFit', 'LinearFit_ref_Ha', {'rejectLow': '0.000000', 'rejectHigh': '0.920000'}, {'referenceViewId': 'Ha'}),
         "Option — LinearFit avec Ha comme référence : applique sur OIII (et SII). Rapproche fonds et niveaux, ce qu'exige Foraxx (theAstroShed, Galactic Hunter). Référence : vue nommée 'Ha'.")]

D_BXT_NB = ("BlurXTerminator complet sur la combinaison narrowband SIMPLE (un filtre par canal, sans boost ni mélange) : Sharpen Stars 0,25, Halos 0, Nonstellar 0,60. "
            "Manuel RC Astro : mélanger ou booster un canal avant la déconvolution modifie la PSF (étoiles brillantes incohérentes). Baisse Nonstellar si artefacts dans OIII/SII.")

def extract(prefix_names, src_desc):
    out = []
    for idx, n in prefix_names:
        out.append((pm('Extraire_' + n, '$T[%d]' % idx, new_image=True, new_id=n, space='Gray'),
                    "Extraction du canal %d (équivalent de ChannelExtraction) : applique sur %s. Crée la vue mono '%s'. "
                    "AVANT : renomme les masters linéaires qui portent déjà ce nom (par exemple '%s_lin'), sinon PixInsight donnera un autre nom à la nouvelle vue et les formules suivantes ne la trouveront pas." % (idx, src_desc, n, n)))
    return out

nb_noise = [(M.nxt('NXT_Ha', 0.60, 1), "NoiseXTerminator sur Ha sans étoiles : Denoise 0,60 (0,50 à 0,70), Detail 0,15. En linéaire ou après étirement."),
            (M.nxt('NXT_OIII_SII', 0.75, 1), "NoiseXTerminator sur OIII et SII sans étoiles, plus bruités : Denoise 0,75 (0,60 à 0,85). Ne pousse pas plus : aspect plastique.")]
GHS_NB = " En narrowband : étire Ha en premier, puis OIII et SII jusqu'au MÊME fond et à une médiane proche ; OIII/SII demandent un Stretch factor plus élevé, monte LP pour ne pas faire ressortir leur bruit."

sho_combine = (pm('Combinaison_SHO', 'Sii', 'Ha', 'Oiii', new_image=True, new_id='SHO', space='RGB'),
               "Combinaison SHO SIMPLE (équivalent de ChannelCombination) : R = Sii, G = Ha, B = Oiii, sans boost ni mélange. Sert à BXT et SXT. Crée l'image 'SHO'.")
sho_palette = [
    (M.instance('NarrowbandNormalization', 'NBN_SHO', {'palette': 'Palette_SHO'}),
     "PALETTE — NarrowbandNormalization, palette SHO (valeurs par défaut ; nom interne Palette_SHO vérifié dans le module 1.1). Sur l'image SHO combinée (R = Sii, G = Ha, B = Oiii), "
     "ÉTIRÉE et sans étoiles (recombine les canaux étirés avec l'icône Combinaison_SHO). Active l'aperçu ; monte O3 boost et S2 boost progressivement ; Shadowpoint pour le fond ; "
     "Highlight reduction ; Brightness ; Lightness (Off, Preserve, Ha, OIII ou SII) ; SCNR partiel si besoin."),
    (pm('Foraxx_SHO', '(Oiii^~Oiii)*Sii + ~(Oiii^~Oiii)*Ha', '((Oiii*Ha)^~(Oiii*Ha))*Ha + ~((Oiii*Ha)^~(Oiii*Ha))*Oiii', 'Oiii', new_image=True, new_id='SHO_Foraxx', space='RGB'),
     "ALTERNATIVE — Palette Foraxx SHO dynamique (Ludo/ForaxX) : vues 'Sii', 'Ha', 'Oiii' ÉTIRÉES, sans étoiles, fonds proches. Crée 'SHO_Foraxx'. Tons or et bleu sans vert envahissant."),
    (note('NBColourMapper', T_NBCM), ''),
]
sho_finish = [(M.instance('SCNR', 'SCNR_SHO', {'amount': '0.70', 'protectionMethod': 'AverageNeutral', 'colorToRemove': 'Green'}),
               "SCNR sur la palette SHO si un vert reste : Green, Average Neutral, Amount 0,70 (1,0 par défaut convient souvent ; plus bas pour garder un peu de vert).")]

def rgb_stars_block():
    return [
        (note('Etoiles_RGB', "ÉTOILES RGB — masters R, G, B : même recadrage, puis les icônes suivantes dans l'ordre (combinaison, gradient via l'icône GradientCorrection ou les notes, BXT Correct Only, SPCC, BXT, SXT)."), ''),
        rgb_comb(),
        (M.bxt('BXT_CorrectOnly', True, 0.25, 0.0, 0.50), D_BXT_CO),
        spcc(),
        (M.bxt('BXT_RGB', False, 0.25, 0.0, 0.50), "BlurXTerminator complet sur RGB après SPCC : Sharpen Stars 0,25, Halos 0, Nonstellar 0,50."),
        (M.sxt('SXT_RGB_lineaire', False), D_SXT_LIN + " Garde uniquement l'image d'étoiles RGB."),
        (note('Star_Stretch', T_STARSTRETCH), ''),
    ]

# ---------------------------------------------------------------- RGB + SHO
rgbsho = pre_block() + nb_masters(['Sii', 'Ha', 'Oiii']) + [
    sho_combine,
    (M.bxt('BXT_NB', False, 0.25, 0.0, 0.60), D_BXT_NB),
    (M.sxt('SXT_lineaire', False), D_SXT_LIN + " Sur l'image SHO : garde le fond sans étoiles (les étoiles viendront du RGB)."),
] + extract([(0, 'Sii'), (1, 'Ha'), (2, 'Oiii')], "l'image SHO sans étoiles") + nb_noise + ghs_block(GHS_NB) + sho_palette + finish_block(sho_finish) + rgb_stars_block() + stars_end(cms=True)

# ---------------------------------------------------------------- SHO sans RGB
sho = pre_block() + nb_masters(['Sii', 'Ha', 'Oiii']) + [
    sho_combine,
    (M.bxt('BXT_NB', False, 0.25, 0.0, 0.60), D_BXT_NB),
    (M.sxt('SXT_lineaire', False), D_SXT_LIN + " Sur l'image SHO : GARDE LES DEUX images (fond et étoiles), les étoiles viennent ici du narrowband."),
] + extract([(0, 'Sii'), (1, 'Ha'), (2, 'Oiii')], "l'image SHO sans étoiles") + extract([(0, 'Sii_stars'), (1, 'Ha_stars'), (2, 'Oiii_stars')], "l'image d'étoiles SHO (linéaire)") + nb_noise + ghs_block(GHS_NB) + sho_palette + finish_block(sho_finish) + [
    (note('NB_to_RGB_Stars', "ÉTOILES — méthode 1 : NB to RGB Star Combination (SetiAstro, script). Ha Stars et OIII Stars (linéaires, obligatoires), SII optionnel. "
          "Green Channel Blend Ratio décoché par défaut (Ha to OIII ratio 0,3 si activé). Apply Star Stretch recommandé par l'auteur : Stretch Factor 5, Color Boost 1,0."), ''),
    (pm('Etoiles_HOO_synth', 'Ha_stars', '0.2*Ha_stars + 0.8*Oiii_stars', 'Oiii_stars', new_image=True, new_id='Stars_HOO', space='RGB'),
     "ÉTOILES — méthode 2 : étoiles HOO synthétiques (AIASTRO) sur les images d'étoiles linéaires 'Ha_stars' et 'Oiii_stars' : R = Ha, G = 20 % Ha + 80 % OIII, B = OIII. "
     "Calibre ensuite la couleur, puis étire avec Star Stretch. Renomme le résultat étiré 'stars'."),
    (note('Star_Stretch', T_STARSTRETCH), ''),
] + stars_end(cms=True)

# ---------------------------------------------------------------- HOO
hoo = pre_block() + [
    (pm('DualBand_Ha', '$T[0]', new_image=True, new_id='Ha', space='Gray'),
     "CAMÉRA COULEUR + filtre dual-band seulement : applique sur l'image couleur (gradient retiré, BXT déjà appliqué) ; Ha = canal rouge. Caméra mono : ignore cette icône et la suivante."),
    (pm('DualBand_OIII', '($T[1] + $T[2]) / 2', new_image=True, new_id='Oiii', space='Gray'),
     "CAMÉRA COULEUR + dual-band : OIII = moyenne de G et B. Le bleu est plus bruité et moins riche : donner plus de poids à G donne souvent un OIII plus propre (poids selon capteur et filtre). "
     "La fuite Bayer (OIII dans R, Ha dans B) ne peut pas être séparée parfaitement."),
] + nb_masters(['Ha', 'Oiii']) + [
    (pm('Combinaison_HOO', 'Ha', 'Oiii', 'Oiii', new_image=True, new_id='HOO', space='RGB'),
     "Combinaison HOO SIMPLE : R = Ha, G = Oiii, B = Oiii, sans boost. Sert à BXT et SXT (en caméra couleur, BXT s'applique plutôt sur l'image d'origine avant extraction). Crée 'HOO'."),
    (M.bxt('BXT_NB', False, 0.25, 0.0, 0.60), D_BXT_NB),
    (M.sxt('SXT_lineaire', False), D_SXT_LIN + " Sur l'image HOO : garde l'image d'étoiles si tu n'as pas d'étoiles RGB."),
] + extract([(0, 'Ha'), (1, 'Oiii')], "l'image HOO sans étoiles") + nb_noise + ghs_block(GHS_NB) + [
    (pm('HOO_simple', 'Ha', 'Oiii', 'Oiii', new_image=True, new_id='HOO_etire', space='RGB'),
     "PALETTE — combinaison simple sur 'Ha' et 'Oiii' étirés sans étoiles, à équilibrer ensuite avec NarrowbandNormalization (icône suivante)."),
    (M.instance('NarrowbandNormalization', 'NBN_HOO', {'palette': 'Palette_HOO'}),
     "NarrowbandNormalization, palette HOO (valeurs par défaut) : applique sur l'image HOO étirée sans étoiles, active l'aperçu, monte O3 boost progressivement, Shadowpoint pour le fond, SCNR si besoin."),
    (pm('Foraxx_HOO', 'Ha', '((Oiii*Ha)^~(Oiii*Ha))*Ha + ~((Oiii*Ha)^~(Oiii*Ha))*Oiii', 'Oiii', new_image=True, new_id='HOO_Foraxx', space='RGB'),
     "ALTERNATIVE — Foraxx HOO : le vert varie selon le rapport Ha/OIII (transitions orangées). Vues 'Ha' et 'Oiii' étirées, sans étoiles, fonds proches."),
    (pm('HOO_Hubble', 'Ha', '0.6*Ha + 0.4*Oiii', 'Oiii', new_image=True, new_id='HOO_Hubble', space='RGB'),
     "ALTERNATIVE — variante « style Hubble » (Galactic Hunter) : G = 0,6·Ha + 0,4·OIII, tons plus dorés ; ajuste les coefficients."),
    (note('NBColourMapper', T_NBCM), ''),
    (M.instance('LRGBCombination', 'Ha_en_luminance', {'mL': '0.500', 'mc': '0.400', 'noiseReduction': True}, post=M.lrgb_post),
     "Option — Ha en luminance : fais une copie de Ha étiré nommée 'L' (même fond et médiane proche que l'image HOO, sinon couleurs délavées), puis applique sur l'image HOO. Seul L activé, Saturation 0,40."),
] + finish_block() + [
    (note('Etoiles_HOO', "ÉTOILES — avec RGB : suis le bloc étoiles RGB du workflow RGB + SHO. Sans RGB : utilise l'image d'étoiles de SXT sur HOO (ou NB to RGB Star Combination), étire-la avec Star Stretch et renomme-la 'stars'. "
          "Les étoiles HOO tirent vers le rouge et le cyan : désature-les légèrement si besoin."), ''),
    (note('Star_Stretch', T_STARSTRETCH), ''),
] + stars_end()

os.makedirs(OUT, exist_ok=True)
mat = [(spcc_perso('SPCC_QHY600_Antlia'), T_SPCC)] + [(M.spfc(n + '_QHY600_Antlia' if n != 'SPFC_RGB_filtres' else 'SPFC_RGB_QHY600_Antlia', **o), D_SPFC[n] + D_SPFC_COMMUN) for n, o in [
    ('SPFC_RGB_filtres', dict(rgb='antlia', gray='generic_uvir', qe='qe_imx455')), ('SPFC_L', dict(rgb='antlia', gray='generic_uvir', qe='qe_imx455')),
    ('SPFC_Ha', dict(nb=(656.3, 3.0), rgb='antlia', gray='generic_uvir', qe='qe_imx455')), ('SPFC_OIII', dict(nb=(500.7, 3.0), rgb='antlia', gray='generic_uvir', qe='qe_imx455')), ('SPFC_SII', dict(nb=(672.4, 3.0), rgb='antlia', gray='generic_uvir', qe='qe_imx455'))]]
insts, icons = [], []
for i, (item, desc) in enumerate(mat):
    item = described(item, desc)
    insts.append(item[1])
    icons.append('   <icon id="%s" instance="%s_instance" xpos="30" ypos="%d" workspace="Workspace01"/>' % (item[0], item[0], 30 + 30 * i))
open(os.path.join(OUT, '..', '04-Materiel-QHY600-Antlia.xpsm'), 'w', encoding='utf-8').write(
    M.HEADER + '<!-- Icônes pour ' + MATERIEL + ' -->\n' + '\n'.join(insts) + '\n' + '\n'.join(icons) + '\n</xpsm>\n')
for fn, pre, title, steps in [
    ('Workflow-LRGB.xpsm', 'LRGB', 'Workflow LRGB', lrgb),
    ('Workflow-LHaRGB.xpsm', 'LHA', 'Workflow LHaRGB', lhargb),
    ('Workflow-RGB-SHO.xpsm', 'RSHO', 'Workflow RGB + SHO (étoiles RGB)', rgbsho),
    ('Workflow-SHO-sans-RGB.xpsm', 'SHO', 'Workflow SHO sans RGB', sho),
    ('Workflow-HOO.xpsm', 'HOO', 'Workflow HOO', hoo),
]:
    print(fn, write(fn, pre, title, steps), 'icônes')
