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
    'Continuum_auto': 3, 'H_dans_RGB': 3, 'H_dans_L': 3, 'NBRGBCombination': 3, 'SXT_lineaire': 3, 'SXT_RGB_lineaire': 3, 'SXT_L_etire': 4, 'Etoiles_LRGB_etire': 4, 'SXT_L_lineaire': 3, 'Etoiles_LRGB': 4,
    'Extraire_S': 3, 'Extraire_H': 3, 'Extraire_O': 3, 'Extraire_S_stars': 3, 'Extraire_H_stars': 3, 'Extraire_O_stars': 3,
    'NXT_RGB': 3, 'NXT_L': 3, 'NXT_H': 3, 'NXT_O_S': 3,
    'GHS_1_premier': 4, 'GHS_2_contraste': 4, 'GHS_3_fond': 4, 'Statistical_Stretch': 4, 'Star_Stretch': 4,
    'LRGB_ajout_L': 5, 'NBN_SHO': 5, 'NBN_HOO': 5, 'Foraxx_SHO': 5, 'Foraxx_HOO': 5, 'HOO_simple': 5, 'HOO_Hubble': 5,
    'Perfect_Palette_Picker': 5, 'NBColourMapper': 5, 'SCNR_SHO': 5, 'H_en_luminance': 5,
    'Masque_L': 6, 'Masque_retirer': 6, 'Courbes': 6, 'LHE': 6, 'LHE_fin': 6, 'Boost_finition_light': 6, 'Finition_saturee': 6, 'Boost_finition': 6, 'HDRMT_50': 6, 'HDRMT_eclat': 6, 'NXT_final': 6, 'HDRMT_40': 6, 'Mode_rapide': 1, 'Turbo_debut': 1, 'Boost_final_doux': 7, 'C_Fin_rapide': 6, 'C_Etoiles_fond_rapide': 7, 'SXT_non_lineaire': 4, 'Gradient_auto_rapide': 2, 'Solver_auto': 1, 'C_Preparation_rapide': 1, 'C_RGB_rapide': 3, 'SXT_LRGB': 5, 'C_LRGB_rapide': 5, 'C_L_rapide': 3, 'STF': 3, 'C_RGB_couleur_rapide': 3, 'C_H_rapide': 3, 'C_RGB_fin_rapide': 3, 'HDRMT_30': 6, 'Nettoyage_sans_etoiles': 6, 'ICC_sRGB': 7, 'Export_TIFF': 7, 'NXT_final_doux': 6, 'NXT_final_fort': 6, 'Fond_auto': 7, 'Fond_auto_clair': 7, 'Boost_final': 7, 'Fond_desature': 7,
    'Etoiles_RGB': 7, 'Etoiles_HOO': 7, 'NB_to_RGB_Stars': 7, 'Etoiles_HOO_synth': 7, 'Etoiles_screen': 7, 'CorrectMagentaStars': 7,
    'Etoiles_reduites': 7, 'Fermer_L_stars': 3, 'Fermer_continuum': 3, 'Fermer_etoiles': 7, 'MT_etoiles': 7, 'Halo_B_Gon': 7, 'Etoiles_plafond': 7, 'Saturation_grosses': 4, 'NXT_dernier': 7, 'Etoiles_grosses': 7, 'Lineaire_rapide': 3, 'SCNR_etoiles_vert': 4, 'SCNR_etoiles_violet': 4, 'SXT_RGB_etire': 4, 'Sharp_USM': 6, 'C_Sharp_MMT': 6, 'C_RGB_etire_rapide': 4,
    'Binning_x2': 1, 'H_dans_RGB_v2': 3, 'CombineHaWithRGB': 3, 'MAS': 4, 'DarkStructureEnhance': 6, 'Agrandir_x2': 7,
}

NB = ('RSHO', 'SHO', 'HOO')
LUM = ('LRGB', 'LHA')   # workflows avec luminance : par défaut Statistical Stretch sur le RGB, GHS sur L
OPT = {'ImageSolver_seul', 'Turbo_debut', 'H_dans_RGB', 'Finition_saturee', 'Boost_finition_light', 'Boost_finition', 'WBPP', 'CC_auto', 'Find_Background', 'LinearFit_ref_H', 'H_dans_L', 'NBRGBCombination', 'HDRMT_30', 'HDRMT_40', 'HDRMT_50', 'HDRMT_eclat', 'Boost_final', 'Fond_desature', 'NXT_final', 'NXT_final_doux', 'NXT_final_fort', 'Fond_auto_clair', 'Nettoyage_sans_etoiles', 'ICC_sRGB', 'Export_TIFF', 'Gradient_auto_rapide', 'Boost_final_doux', 'SXT_non_lineaire', 'C_Fin_rapide', 'C_Etoiles_fond_rapide', 'Mode_rapide', 'C_Preparation_rapide', 'C_RGB_rapide', 'C_LRGB_rapide', 'C_L_rapide', 'STF', 'C_RGB_couleur_rapide', 'C_H_rapide', 'C_RGB_fin_rapide',
       'MT_etoiles', 'Halo_B_Gon', 'Etoiles_plafond', 'Saturation_grosses', 'SCNR_etoiles_violet', 'Etoiles_grosses', 'CorrectMagentaStars', 'SCNR_SHO', 'Perfect_Palette_Picker', 'NBColourMapper', 'H_en_luminance',
       'Etoiles_HOO_synth', 'DualBand_H', 'DualBand_O', 'SPFC_S',
       'Binning_x2', 'H_dans_RGB_v2', 'C_RGB_etire_rapide', 'DarkStructureEnhance', 'Agrandir_x2', 'Lineaire_rapide', 'Sharp_USM'}


def role(prefix, base):
    if prefix in LUM and base in ('NXT_final', 'Fond_desature', 'HDRMT_30'):
        return 'core'   # galaxies : finition en parties, NXT_final et Fond_desature dans le chemin principal (demande de l'utilisateur)
    if prefix in LUM and base == 'Statistical_Stretch':
        return 'opt'    # galaxies (demande de l'utilisateur, 5 octobre 2026) : MAS sur le RGB
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
    'C_Fin_rapide': "MODE RAPIDE, à la place de HDRMT_30, C_Finition, C_Sharp_MMT et NXT_final : sur l'image sans étoiles après LRGB_ajout_L (ou R_C_LRGB_rapide)",
    'C_Etoiles_fond_rapide': "MODE RAPIDE, à la place de Fond_desature, Fond_auto, Etoiles_screen, NXT_dernier et Export_TIFF : sur l'image sans étoiles finie, RGB_stars et L ouvertes",
    'SXT_non_lineaire': "double-clic : ouvre StarXTerminator réglé pour une image ÉTIRÉE (Unscreen coché, Generate star image coché) ; à glisser sur une image non linéaire qui a encore des étoiles",
    'Gradient_auto_rapide': "MODE RAPIDE, à la place de la phase 2 : GradientCorrection sur TOUTES les images ouvertes (plus d'ImageSolver : fait par Solver_auto en phase 1) ; à faire AVANT R_Lineaire_rapide (sans GradientCorrection)",
    'Mode_rapide': "repère du mode rapide (galaxies), sans effet : lis sa description pour l'ordre",
    'Turbo_debut': "MODE TURBO, à la place de R_C_Preparation_rapide, R_Gradient_auto_rapide et R_Lineaire_rapide (phases 1 à 3) : masters seuls ouverts, double-clic puis Apply Global (pas en glissant) ; ensuite GHS_1_premier sur L",
    'C_Preparation_rapide': "MODE RAPIDE, à la place d'E00 à E03 : masters seuls ouverts, double-clic puis Apply Global (pas en glissant : ImageSolver échoue sur une image en cours de traitement) : Renommer_auto, LinearPatternSubtraction, Combinaison_RGB, Solver_auto (ImageSolver sur toutes les images) en un seul conteneur",
    'C_RGB_etire_rapide': "MODE RAPIDE, à la place de MAS, SXT_RGB_etire, SCNR_etoiles_vert et GHS_3_fond sur le RGB (options SCNR_etoiles_violet et Saturation_grosses à passer à part si besoin) : glisse sur RGB linéaire avec étoiles ; MAS, SXT Unscreen (RGB_stars créée), SCNR vert sur RGB_stars, GHS fond (SP = HP = 0,12)",
    'Statistical_Stretch': "à la place de MAS sur le RGB avec étoiles (étirement statistique, étoiles plus grosses) ; puis SXT_RGB_etire",
    'Sharp_USM': "à la place de C_Sharp_MMT : accentuation finale par UnsharpMask, avant NXT_final, sur l'image sans étoiles ; masque de luminance attaché puis retiré automatiquement",
    'Fond_auto': "après Fond_desature, sur l'image sans étoiles, avant Etoiles_screen : fond amené à 0,12 et neutre (grille 8 × 8)",
    'Lineaire_rapide': "MODE RAPIDE, à la place de la phase 3 du chemin principal : double-clic puis Apply Global ; lance les icônes du chemin principal sur RGB et L (LRGB : C_RGB_lineaire et C_L_lineaire ; LHaRGB : C_RGB_couleur, BXT_L_H sur L et H, NXT_L) ; RGB et L restent linéaires, avec leurs étoiles",
    'C_RGB_rapide': "MODE RAPIDE, à la place de C_RGB_lineaire, Statistical_Stretch et GHS_3_fond (sur RGB) : sur RGB après Gradient_auto_rapide ; BXT Correct Only, SPCC, BXT, NXT, Statistical Stretch sans dialogue, GHS fond ; étoiles gardées (SXT après LRGB)",
    'C_LRGB_rapide': "MODE RAPIDE, à la place de LRGB_ajout_L : glisse sur le RGB sans étoiles, L sans étoiles étirée ouverte ; LRGB_ajout_L (Saturation 0,5) seule",
    'C_L_rapide': "MODE RAPIDE, à la place de C_L_lineaire : sur L après Gradient_auto_rapide ; ensuite GHS_1_premier, GHS_2_contraste, GHS_3_fond sur L",
    'STF': "n'importe quand : double-clic pour ouvrir la fenêtre ScreenTransferFunction (bouton A = auto-étirement de l'affichage, Reset pour revenir), pixels inchangés",
    'C_RGB_couleur_rapide': "MODE RAPIDE LHaRGB, à la place de C_RGB_couleur : sur RGB ; GradientCorrection, BXT Correct Only, SPCC, BXT",
    'C_H_rapide': "MODE RAPIDE LHaRGB, à la place de BXT_L_H sur H : sur H ; GradientCorrection, BXT ; puis Continuum_auto et H_dans_RGB du chemin principal",
    'C_RGB_fin_rapide': "MODE RAPIDE LHaRGB, à la place de NXT_RGB, Statistical_Stretch et GHS_3_fond (sur RGB) : sur RGB après H_dans_RGB ; NXT, Statistical Stretch sans dialogue, GHS fond ; étoiles gardées (SXT après LRGB)",

    'LinearPatternSubtraction': "lignes horizontales résiduelles visibles sur un master (motif du capteur)",
    'WBPP': "seulement si tu repars des brutes (masters pas encore empilés)", 'CC_auto': "avec WBPP, si tu repars des brutes",
    'Find_Background': "champ rempli de nébuleuse : fond de référence pour SPCC",
    'LinearFit_ref_H': "fonds très différents entre H, O et S (conseillé avec Foraxx)", 
    'H_dans_L': "régions HII plus nettes (H injecté dans la luminance)", 'NBRGBCombination': "alternative à la soustraction du continuum",
    'Finition_saturee': "à la place de C_Finition, couleurs trop ternes : même finition (masque, Courbes, LHE, LHE_fin, masque retiré) avec la saturation de l'ancienne version (0,65 au lieu de 0,58)",
    'Boost_finition_light': "un tout petit peu plus de couleur et de contraste après LHE_fin (version douce du Boost, rejouable)",
    'Boost_finition': "encore un peu plus de couleur et de contraste après LHE_fin (rejouable)",
    'ICC_sRGB': "tout à la fin, avant une finition dans Photoshop, Lightroom ou Affinity : image convertie en sRGB IEC61966-2.1 (couleurs identiques dans l'autre logiciel)",
    'Export_TIFF': "tout à la fin : copie enregistrée en TIFF 16 bits sRGB, profil ICC intégré, pour Photoshop, Lightroom ou Affinity",
    'Nettoyage_sans_etoiles': "avant la partie 1, sur l'image sans étoiles juste après LRGB (RGB_stars ouverte) : taches rondes floues ou halo coloré laissés par SXT autour des étoiles",
    'NXT_final_doux': "partie 3, à la place de NXT_final : données très propres, ou aspect plastique avec 0,40 (Denoise 0,25)",
    'NXT_final_fort': "partie 3, à la place de NXT_final : bruit encore visible dans le fond (Denoise 0,60)",
    'Fond_auto_clair': "à la place de Fond_auto : image trop sombre, fond amené à 0,14, après Fond_desature, avant Etoiles_screen",
    'HDRMT_30': "cœur un peu trop clair, mais HDRMT_40 aplatit trop (HDRMT appliqué à 30 %, effet plus léger)",
    'HDRMT_40': "partie 1, à la place de HDRMT_30 : cœur encore trop clair (HDRMT appliqué à 40 %)",
    'HDRMT_50': "cœur de galaxie ou nébuleuse brillante brûlé (HDRMT appliqué à 50 %)",
    'Fond_desature': "fond du ciel teinté (violet, bruit de couleur) sur l'image finie : couleur retirée du fond seulement",
    'Boost_final_doux': "comme Boost_final mais moitié moins fort (courbes c et S montées de moitié) : un petit cran de couleur sur l'image finie, sans toucher aux étoiles ; L encore ouverte",
    'Boost_final': "sur l'image FINIE, étoiles comprises : un peu plus de couleur sans toucher aux étoiles (masque tiré de L sans étoiles, courbes chrominance et saturation)",
    'HDRMT_eclat': "cœur laiteux sans détail, mais terne avec HDRMT seul : HDRMT à 40 % puis Boost_finition_light, en un glisser", 'NXT_final': "bruit visible sur l'image finale",
    'SCNR_etoiles_violet': "étoiles violettes (R et B nettement au-dessus de G à la sonde, surtout en LHaRGB) : après SCNR_etoiles_vert, glisse sur n'importe quelle image (traite RGB_stars) ; Invert, SCNR vert 1,0, Invert ; pas dans le rapide",
    'Saturation_grosses': "grosses étoiles presque blanches, petites assez colorées : glisse sur n'importe quelle image (traite RGB_stars) après SCNR_etoiles_vert ; seules les grosses étoiles et leur halo sont saturés ; pas dans le rapide (à la main après R_C_RGB_etire_rapide si besoin)",
    'Etoiles_grosses': "grosses étoiles trop présentes, mais Etoiles_reduites réduirait toutes les étoiles : glisse sur l'image d'étoiles (RGB_stars) AVANT Etoiles_screen ; en rapide, avant R_C_Etoiles_fond_rapide",
    'Etoiles_plafond': "cœurs d'étoiles cramés à 1 (blanc pur) : glisse sur l'image d'étoiles (RGB_stars) AVANT Etoiles_screen ; en rapide, avant R_C_Etoiles_fond_rapide",
    'MT_etoiles': "réduction d'étoiles supplémentaire", 'Halo_B_Gon': "halos autour des étoiles brillantes ; attention, réduit aussi les petites étoiles (pour les grosses seulement : Etoiles_grosses, en narrowband)",
    'CorrectMagentaStars': "étoiles magenta", 'SCNR_SHO': "reste de vert après la palette",
    'Perfect_Palette_Picker': "comparer 16 palettes avant de choisir", 'NBColourMapper': "teintes libres, filtre par filtre",
    'H_en_luminance': "détail plus net en HOO (H en luminance)", 'Etoiles_HOO_synth': "alternative à NB to RGB pour les étoiles",
    'DualBand_H': "caméra couleur avec filtre dual-band", 'DualBand_O': "caméra couleur avec filtre dual-band",
    'SPFC_S': "seulement si ta base MARS couvre S (pas le cas de DR2)",
    'ImageSolver_seul': "secours : ImageSolver seul, si l'icône ImageSolver (date + ImageSolver) s'arrête après la date",
    'Etoiles_reduites': "à la place d'Etoiles_screen, si les étoiles sont trop présentes (recombinaison + réduction Blanshan)",
    # icônes à tester (demande de l'utilisateur, 5 octobre 2026)
    'Binning_x2': "traitement 4 fois plus rapide et moins de bruit (0,528″/px au lieu de 0,264″/px, l'image du CDK17 est suréchantillonnée) : double-clic puis Apply Global juste après Solver_auto, toutes les images divisées par 2 ; pour un grand tirage, Agrandir_x2 avant l'export",
    'H_dans_RGB_v2': "TEST, à la place de CombineHaWithRGB ou H_dans_RGB : HaNB injecté sans son fond (HaNB − med(HaNB)) dans R, et 20 % dans B (Hβ) : régions HII plus roses, fond inchangé",
    'H_dans_RGB': "à la place de CombineHaWithRGB : injection simple R + w·HaNB (PixelMath), sur le RGB linéaire après Continuum_auto",
    'MAS': "TEST, à la place des GHS ou de Statistical Stretch : MultiscaleAdaptiveStretch avec tes réglages (fond 0,15, saturation) ; glisse sur l'image LINÉAIRE",
    'DarkStructureEnhance': "TEST, avant C_Finition : bandes de poussière et structures sombres plus marquées (script livré avec PixInsight)",
    'Agrandir_x2': "après Binning_x2, pour un grand tirage : image agrandie 2 fois (Lanczos 3) juste avant Export_TIFF ; ne recrée pas le détail perdu",
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
# galaxies : Courbes à saturation 0,58 (demande de l'utilisateur : l'ancienne, 0,65, saturait trop ; elle reste en option Finition_saturee)
_FIN_G = ('C_Finition', "l'image sans étoiles étirée (masque créé, attaché puis retiré automatiquement) ; courbe en S, saturation 0,5 -> 0,58 (couleurs trop ternes : Finition_saturee, 0,65, à la place)", _FIN[2])
CONTAINERS = {
    # LRGB (demande de l'utilisateur, 5 octobre 2026) : L sans étoiles (C_L_lineaire finit par SXT), RGB étiré par MAS avec étoiles puis SXT ; fond final = Fond_desature seul
    'LRGB': [('C_RGB_lineaire', "l'image RGB combinée, linéaire, gradient retiré (étoiles gardées) : BXT Correct Only, SPCC, BXT, NXT", ['BXT_CorrectOnly', 'SPCC', 'BXT_RGB', 'NXT_RGB']),
             ('C_L_lineaire', "le master L, linéaire, gradient retiré : BXT, NXT, puis SXT (L sans étoiles)", ['BXT_L', 'NXT_L', 'SXT_L_lineaire']),
             _FIN_G],
    'LHA': [('C_RGB_couleur', "l'image RGB combinée, linéaire, gradient retiré", ['BXT_CorrectOnly', 'SPCC', 'BXT_RGB']),
            ('C_RGB_bruit', "l'image RGB après CombineHaWithRGB (ou H_dans_RGB ; et H_dans_L éventuel) : NXT, puis H, R et HaNB fermées", ['NXT_RGB', 'Fermer_continuum']),
            _FIN_G],   # LHaRGB (demande de l'utilisateur) : étoiles gardées jusqu'à LRGB, plus de C_RGB_etoiles_bruit ni de C_L_lineaire (NXT seul)
    'RSHO': [('C_SHO_lineaire', "l'image SHO combinée, linéaire", ['BXT_NB', 'SXT_lineaire']),
             ('C_Extraction_SHO', "l'image SHO sans étoiles", ['Extraire_S', 'Extraire_H', 'Extraire_O']), _FIN,
             ('C_Etoiles_RGB', "l'image RGB combinée, linéaire, gradient retiré", ['BXT_CorrectOnly', 'SPCC', 'BXT_RGB', 'SXT_RGB_lineaire'])],
    'SHO': [('C_SHO_lineaire', "l'image SHO combinée, linéaire", ['BXT_NB', 'SXT_lineaire']),
            ('C_Extraction_SHO', "l'image SHO sans étoiles", ['Extraire_S', 'Extraire_H', 'Extraire_O']),
            ('C_Extraction_etoiles', "l'image d'étoiles SHO, linéaire", ['Extraire_S_stars', 'Extraire_H_stars', 'Extraire_O_stars']), _FIN],
    'HOO': [('C_HOO_lineaire', "l'image HOO combinée, linéaire", ['BXT_NB', 'SXT_lineaire']),
            ('C_Extraction_HOO', "l'image HOO sans étoiles", ['Extraire_H', 'Extraire_O']), _FIN],
}
