# Organisation des icônes : phase (colonne) et rôle de chaque étape.
# Rôle : 'core' = chemin principal ; 'opt' = option ; 'groupe:choix' = alternative (le choix par défaut va dans le chemin principal).
PHASES = ['Préparation', 'Gradient', 'Linéaire', 'Étirement', 'Couleur', 'Finition', 'Étoiles']
PHASE_NOTE = [
    "masters intégrés, recadrés et combinés",
    "image linéaire : retrait du gradient",
    "image linéaire : couleur, déconvolution, retrait des étoiles, bruit",
    "passage en non linéaire, même fond pour toutes les images",
    "combinaison finale et palette",
    "contraste et saturation sur l'image sans étoiles",
    "étoiles : étirement, recombinaison, réduction",
]

PHASE = {
    'Renommer_auto': 1, 'LinearPatternSubtraction': 1, 'WBPP': 1, 'CC_auto': 1, 'DynamicCrop': 1, 'Combinaison_RGB': 1, 'Masters_S_H_O': 1, 'Masters_H_O': 1, 'DualBand_H': 1, 'DualBand_O': 1,
    'ImageSolver': 2, 'ImageSolver_seul': 2, 'SPFC_RGB_filtres': 2, 'SPFC_L': 2, 'SPFC_H': 2, 'SPFC_O': 2, 'SPFC_S': 2, 'MGC_MARS': 2, 'MGC_MARS_H': 2, 'MGC_MARS_O': 2,
    'GradientCorrection': 2, 'DBE': 2, 'LinearFit_ref_H': 2,
    'BXT_CorrectOnly': 3, 'Find_Background': 3, 'SPCC': 3, 'BXT_RGB': 3, 'BXT_L': 3, 'BXT_L_H': 3, 'BXT_NB': 3, 'Combinaison_SHO': 3, 'Combinaison_HOO': 3,
    'Continuum_H': 3, 'Continuum_auto': 3, 'H_dans_RGB': 3, 'H_dans_L': 3, 'NBRGBCombination': 3, 'SXT_lineaire': 3, 'SXT_RGB_lineaire': 3, 'SXT_L_etire': 4, 'Etoiles_LRGB_etire': 4, 'SXT_L_lineaire': 3, 'Etoiles_LRGB': 4,
    'Extraire_S': 3, 'Extraire_H': 3, 'Extraire_O': 3, 'Extraire_S_stars': 3, 'Extraire_H_stars': 3, 'Extraire_O_stars': 3,
    'NXT_RGB': 3, 'NXT_L': 3, 'NXT_H': 3, 'NXT_O_S': 3,
    'GHS_1_premier': 4, 'GHS_2_contraste': 4, 'GHS_3_fond': 4, 'Statistical_Stretch': 4, 'Star_Stretch': 4,
    'LRGB_ajout_L': 5, 'NBN_SHO': 5, 'NBN_HOO': 5, 'Foraxx_SHO': 5, 'Foraxx_HOO': 5, 'HOO_simple': 5, 'HOO_Hubble': 5,
    'Perfect_Palette_Picker': 5, 'NBColourMapper': 5, 'SCNR_SHO': 5, 'H_en_luminance': 5,
    'Masque_L': 6, 'Masque_retirer': 6, 'Courbes': 6, 'LHE': 6, 'LHE_fin': 6, 'Boost_finition_light': 6, 'Boost_finition': 6, 'HDRMT_50': 6, 'HDRMT_eclat': 6, 'NXT_final': 6, 'HDRMT_40': 6, 'Mode_rapide': 1, 'C_Fin_GHS_rapide': 4, 'Boost_final_doux': 7, 'C_Fin_rapide': 6, 'C_Etoiles_fond_rapide': 7, 'SXT_non_lineaire': 4, 'GC_Solver_auto_rapide': 2, 'Solver_auto': 1, 'C_Preparation_rapide': 1, 'C_RGB_rapide': 3, 'C_RGB_rapide_SXT_etire': 3, 'C_L_rapide': 3, 'STF': 3, 'C_RGB_couleur_rapide': 3, 'C_H_rapide': 3, 'C_RGB_fin_rapide': 3, 'HDRMT_30': 6, 'Nettoyage_sans_etoiles': 6, 'ICC_sRGB': 7, 'Export_TIFF': 7, 'NXT_final_doux': 6, 'NXT_final_fort': 6, 'Fond_auto': 7, 'Fond_auto_clair': 7, 'Boost_final': 7, 'Fond_desature': 7,
    'Etoiles_RGB': 7, 'Etoiles_HOO': 7, 'NB_to_RGB_Stars': 7, 'Etoiles_HOO_synth': 7, 'Etoiles_screen': 7, 'CorrectMagentaStars': 7,
    'Etoiles_reduites': 7, 'Fermer_L_stars': 3, 'MT_etoiles': 7, 'Halo_B_Gon': 7,
}

NB = ('RSHO', 'SHO', 'HOO')
LUM = ('LRGB', 'LHA')   # workflows avec luminance : par défaut Statistical Stretch sur le RGB, GHS sur L
OPT = {'ImageSolver_seul', 'Boost_finition_light', 'Boost_finition', 'WBPP', 'CC_auto', 'Find_Background', 'LinearFit_ref_H', 'Continuum_auto', 'H_dans_L', 'NBRGBCombination', 'HDRMT_30', 'HDRMT_50', 'HDRMT_eclat', 'Boost_final', 'Fond_desature', 'NXT_final', 'NXT_final_doux', 'NXT_final_fort', 'Fond_auto_clair', 'Nettoyage_sans_etoiles', 'ICC_sRGB', 'Export_TIFF', 'GC_Solver_auto_rapide', 'Boost_final_doux', 'C_Fin_GHS_rapide', 'SXT_non_lineaire', 'C_Fin_rapide', 'C_Etoiles_fond_rapide', 'Mode_rapide', 'C_Preparation_rapide', 'C_RGB_rapide', 'C_RGB_rapide_SXT_etire', 'C_L_rapide', 'STF', 'C_RGB_couleur_rapide', 'C_H_rapide', 'C_RGB_fin_rapide',
       'MT_etoiles', 'Halo_B_Gon', 'CorrectMagentaStars', 'SCNR_SHO', 'Perfect_Palette_Picker', 'NBColourMapper', 'H_en_luminance',
       'Etoiles_HOO_synth', 'DualBand_H', 'DualBand_O', 'SPFC_S'}


def role(prefix, base):
    if prefix in LUM and base in ('NXT_final', 'Fond_desature', 'Fond_auto', 'HDRMT_40'):
        return 'core'   # galaxies : finition en parties, NXT_final et le fond dans le chemin principal (demande de l'utilisateur)
    if base in OPT or (base == 'MGC_MARS' and prefix in NB):
        return 'opt'
    if base == 'Etoiles_screen':
        return 'et:screen'
    if base == 'Etoiles_reduites':
        return 'et:reduit'
    if base.startswith(('SPFC_', 'MGC_MARS')):
        return 'grad:mgc'
    if base == 'GradientCorrection':
        return 'grad:mgc|gc' if prefix in NB else 'grad:gc'   # en narrowband, S n'est pas dans MARS : GradientCorrection s'y ajoute
    if base == 'DBE':
        return 'grad:dbe'
    if base == 'GHS_3_fond':
        return 'core'   # assombrit le fond après GHS comme après Statistical Stretch
    if base.startswith('GHS_'):
        return 'str:ghs|mix' if prefix in LUM else 'str:ghs'
    if base == 'Statistical_Stretch':
        return 'str:stat|mix' if prefix in LUM else 'str:stat'
    if base in ('NBN_SHO', 'NBN_HOO', 'HOO_simple'):
        return 'pal:nbn'
    if base in ('Foraxx_SHO', 'Foraxx_HOO'):
        return 'pal:foraxx'
    if base == 'HOO_Hubble':
        return 'pal:hubble'
    return 'core'


DEFAULT = {'grad': 'mgc', 'str': 'ghs', 'pal': 'nbn', 'et': 'reduit'}
WF_DEFAULT = {p: {'str': 'mix', 'et': 'screen'} for p in LUM}   # galaxies : pas de réduction d'étoiles par défaut
CHOICES = {
    'grad': ('Gradient', [('mgc', 'MGC + MARS (défaut)'), ('gc', 'GradientCorrection (sans MARS)'), ('dbe', 'DBE (nébuleuse qui remplit le champ)')]),
    'str': ('Étirement', [('mix', 'Statistical Stretch sur RGB + GHS sur L (défaut LRGB)'), ('ghs', 'GHS sur tout (défaut sans L)'), ('stat', 'Statistical Stretch sur tout (automatique ; jamais avec L : halos d\'étoiles)')]),
    'et': ('Étoiles', [('screen', 'Recombinaison simple (défaut galaxies)'), ('reduit', 'Recombinaison + réduction Blanshan (défaut nébuleuses)')]),
    'pal': ('Palette', [('nbn', 'NarrowbandNormalization (défaut)'), ('foraxx', 'Foraxx (or et bleu)'), ('hubble', 'Variante Hubble (HOO, tons dorés)')]),
}

# pour les options : quand les ajouter
WHEN = {
    'C_Fin_GHS_rapide': "MODE RAPIDE, « fin de GHS », à la place de GHS_2_contraste et GHS_3_fond : sur L après GHS_1_premier, avec les réglages par défaut des deux GHS",
    'C_Fin_rapide': "MODE RAPIDE, à la place de HDRMT_40, C_Finition et NXT_final : sur l'image sans étoiles après LRGB_ajout_L",
    'C_Etoiles_fond_rapide': "MODE RAPIDE, à la place d'Etoiles_screen, C_Fond_final et Export_TIFF : sur l'image sans étoiles finie, RGB_stars ouverte",
    'SXT_non_lineaire': "double-clic : ouvre StarXTerminator réglé pour une image ÉTIRÉE (Unscreen coché, Generate star image coché) ; à glisser sur une image non linéaire qui a encore des étoiles",
    'GC_Solver_auto_rapide': "MODE RAPIDE, à la place de la phase 2 : GradientCorrection sur TOUTES les images ouvertes (plus d'ImageSolver : fait par Solver_auto en phase 1) ; à faire AVANT C_RGB_rapide et C_L_rapide (sans GradientCorrection)",
    'Mode_rapide': "repère du mode rapide (galaxies), sans effet : lis sa description pour l'ordre",
    'C_Preparation_rapide': "MODE RAPIDE, à la place d'E00 à E03 : masters seuls ouverts, double-clic puis Apply Global (pas en glissant : ImageSolver échoue sur une image en cours de traitement) : Renommer_auto, LinearPatternSubtraction, Combinaison_RGB, Solver_auto (ImageSolver sur toutes les images) en un seul conteneur",
    'C_RGB_rapide': "MODE RAPIDE, à la place de C_RGB_lineaire, Statistical_Stretch, GHS_3_fond (sur RGB) et Star_Stretch : sur RGB après GC_Solver_auto_rapide ; BXT Correct Only, SPCC, BXT, SXT linéaire, NXT, Statistical Stretch sans dialogue, GHS fond, Etoiles_auto",
    'C_RGB_rapide_SXT_etire': "MODE RAPIDE, à la place de C_RGB_rapide : même conteneur mais StarXTerminator APRÈS l'étirement (Unscreen coché) ; étoiles déjà étirées (Etoiles_auto sans étirement : saturation et SCNR seulement)",
    'C_L_rapide': "MODE RAPIDE, à la place de C_L_lineaire : sur L après GC_Solver_auto_rapide ; BXT, SXT linéaire (L_stars gardée), NXT ; ensuite les GHS du chemin principal sur L",
    'STF': "n'importe quand : double-clic pour ouvrir la fenêtre ScreenTransferFunction (bouton A = auto-étirement de l'affichage, Reset pour revenir), pixels inchangés",
    'C_RGB_couleur_rapide': "MODE RAPIDE LHaRGB, à la place de C_RGB_couleur : sur RGB ; GradientCorrection, BXT Correct Only, SPCC, BXT",
    'C_H_rapide': "MODE RAPIDE LHaRGB, à la place de BXT_L_H sur H : sur H ; GradientCorrection, BXT ; puis Continuum_H et H_dans_RGB du chemin principal",
    'C_RGB_fin_rapide': "MODE RAPIDE LHaRGB, à la place de C_RGB_etoiles_bruit, Statistical_Stretch, GHS_3_fond (sur RGB) et Star_Stretch : sur RGB après H_dans_RGB ; SXT linéaire, NXT, Statistical Stretch sans dialogue, GHS fond, Etoiles_auto",

    'LinearPatternSubtraction': "lignes horizontales résiduelles visibles sur un master (motif du capteur)",
    'WBPP': "seulement si tu repars des brutes (masters pas encore empilés)", 'CC_auto': "avec WBPP, si tu repars des brutes",
    'Find_Background': "champ rempli de nébuleuse : fond de référence pour SPCC",
    'LinearFit_ref_H': "fonds très différents entre H, O et S (conseillé avec Foraxx)", 'Continuum_auto': "calcul automatique du coefficient k",
    'H_dans_L': "régions HII plus nettes (H injecté dans la luminance)", 'NBRGBCombination': "alternative à la soustraction du continuum",
    'Boost_finition_light': "un tout petit peu plus de couleur et de contraste après LHE_fin (version douce du Boost, rejouable)",
    'Boost_finition': "encore un peu plus de couleur et de contraste après LHE_fin (rejouable)",
    'ICC_sRGB': "tout à la fin, avant une finition dans Photoshop, Lightroom ou Affinity : image convertie en sRGB IEC61966-2.1 (couleurs identiques dans l'autre logiciel)",
    'Export_TIFF': "tout à la fin : copie enregistrée en TIFF 16 bits sRGB, profil ICC intégré, pour Photoshop, Lightroom ou Affinity",
    'Nettoyage_sans_etoiles': "avant la partie 1, sur l'image sans étoiles juste après LRGB (RGB_stars ouverte) : taches rondes floues ou halo coloré laissés par SXT autour des étoiles",
    'NXT_final_doux': "partie 3, à la place de NXT_final : données très propres, ou aspect plastique avec 0,40 (Denoise 0,25)",
    'NXT_final_fort': "partie 3, à la place de NXT_final : bruit encore visible dans le fond (Denoise 0,60)",
    'Fond_auto_clair': "partie 5, à la place de Fond_auto dans C_Fond_final : image trop sombre, fond amené à 0,14",
    'HDRMT_30': "cœur un peu trop clair, mais HDRMT_40 aplatit trop (HDRMT appliqué à 30 %, effet plus léger)",
    'HDRMT_50': "cœur de galaxie ou nébuleuse brillante brûlé (HDRMT appliqué à 50 %)",
    'Fond_desature': "fond du ciel teinté (violet, bruit de couleur) sur l'image finie : couleur retirée du fond seulement",
    'Boost_final_doux': "comme Boost_final mais moitié moins fort (courbes c et S montées de moitié) : un petit cran de couleur sur l'image finie, sans toucher aux étoiles ; L encore ouverte",
    'Boost_final': "sur l'image FINIE, étoiles comprises : un peu plus de couleur sans toucher aux étoiles (masque tiré de L sans étoiles, courbes chrominance et saturation)",
    'HDRMT_eclat': "cœur laiteux sans détail, mais terne avec HDRMT seul : HDRMT à 40 % puis Boost_finition_light, en un glisser", 'NXT_final': "bruit visible sur l'image finale",
    'MT_etoiles': "réduction d'étoiles supplémentaire", 'Halo_B_Gon': "halos autour des étoiles brillantes",
    'CorrectMagentaStars': "étoiles magenta", 'SCNR_SHO': "reste de vert après la palette",
    'Perfect_Palette_Picker': "comparer 16 palettes avant de choisir", 'NBColourMapper': "teintes libres, filtre par filtre",
    'H_en_luminance': "détail plus net en HOO (H en luminance)", 'Etoiles_HOO_synth': "alternative à NB to RGB pour les étoiles",
    'DualBand_H': "caméra couleur avec filtre dual-band", 'DualBand_O': "caméra couleur avec filtre dual-band",
    'SPFC_S': "seulement si ta base MARS couvre S (pas le cas de DR2)",
    'ImageSolver_seul': "secours : ImageSolver seul, si l'icône ImageSolver (date + ImageSolver) s'arrête après la date",
    'Etoiles_reduites': "à la place d'Etoiles_screen, si les étoiles sont trop présentes (recombinaison + réduction Blanshan)",
    'MGC_MARS': "image RGB (étoiles du workflow RGB + SHO) ou master L",
}


def is_default(r, prefix=None):
    if r == 'core':
        return True
    if r == 'opt':
        return False
    g, vals = r.split(':')
    return WF_DEFAULT.get(prefix, {}).get(g, DEFAULT[g]) in vals.split('|')

# Conteneurs (ProcessContainer) : suites d'étapes sans réglage intermédiaire, appliquées à la même image.
# nom -> (image cible, étapes). Un conteneur n'est utilisé que si toutes ses étapes sont dans la sélection.
_FIN = ('C_Finition', "l'image sans étoiles étirée (masque créé, attaché puis retiré automatiquement)", ['Masque_L', 'Courbes', 'LHE', 'LHE_fin', 'Masque_retirer'])
_FOND = ('C_Fond_final', "l'image finie, étoiles comprises (après Etoiles_screen et Boost_final éventuel)", ['Fond_auto', 'Fond_desature'])
CONTAINERS = {
    'LRGB': [('C_RGB_lineaire', "l'image RGB combinée, linéaire, gradient retiré", ['BXT_CorrectOnly', 'SPCC', 'BXT_RGB', 'SXT_lineaire', 'NXT_RGB']),
             ('C_L_lineaire', "le master L, linéaire, gradient retiré : BXT, SXT (L_stars gardée pour Etoiles_LRGB), NXT", ['BXT_L', 'SXT_L_lineaire', 'NXT_L']),
             _FIN, _FOND],
    'LHA': [('C_RGB_couleur', "l'image RGB combinée, linéaire, gradient retiré", ['BXT_CorrectOnly', 'SPCC', 'BXT_RGB']),
            ('C_RGB_etoiles_bruit', "l'image RGB après injection de H", ['SXT_lineaire', 'NXT_RGB']),
            ('C_L_lineaire', "L linéaire après BXT_L_H (et H_dans_L éventuel) : SXT (L_stars gardée pour Etoiles_LRGB), NXT", ['SXT_L_lineaire', 'NXT_L']), _FIN, _FOND],
    'RSHO': [('C_SHO_lineaire', "l'image SHO combinée, linéaire", ['BXT_NB', 'SXT_lineaire']),
             ('C_Extraction_SHO', "l'image SHO sans étoiles", ['Extraire_S', 'Extraire_H', 'Extraire_O']), _FIN,
             ('C_Etoiles_RGB', "l'image RGB combinée, linéaire, gradient retiré", ['BXT_CorrectOnly', 'SPCC', 'BXT_RGB', 'SXT_RGB_lineaire'])],
    'SHO': [('C_SHO_lineaire', "l'image SHO combinée, linéaire", ['BXT_NB', 'SXT_lineaire']),
            ('C_Extraction_SHO', "l'image SHO sans étoiles", ['Extraire_S', 'Extraire_H', 'Extraire_O']),
            ('C_Extraction_etoiles', "l'image d'étoiles SHO, linéaire", ['Extraire_S_stars', 'Extraire_H_stars', 'Extraire_O_stars']), _FIN],
    'HOO': [('C_HOO_lineaire', "l'image HOO combinée, linéaire", ['BXT_NB', 'SXT_lineaire']),
            ('C_Extraction_HOO', "l'image HOO sans étoiles", ['Extraire_H', 'Extraire_O']), _FIN],
}
