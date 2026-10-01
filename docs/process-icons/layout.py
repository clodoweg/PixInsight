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
    'ImageSolver': 2, 'SPFC_RGB_filtres': 2, 'SPFC_L': 2, 'SPFC_H': 2, 'SPFC_O': 2, 'SPFC_S': 2, 'MGC_MARS': 2, 'MGC_MARS_H': 2, 'MGC_MARS_O': 2,
    'GradientCorrection': 2, 'DBE': 2, 'LinearFit_ref_H': 2,
    'BXT_CorrectOnly': 3, 'Find_Background': 3, 'SPCC': 3, 'BXT_RGB': 3, 'BXT_L': 3, 'BXT_L_H': 3, 'BXT_NB': 3, 'Combinaison_SHO': 3, 'Combinaison_HOO': 3,
    'Continuum_H': 3, 'Continuum_auto': 3, 'H_dans_RGB': 3, 'H_dans_L': 3, 'NBRGBCombination': 3, 'SXT_lineaire': 3, 'SXT_RGB_lineaire': 3,
    'Extraire_S': 3, 'Extraire_H': 3, 'Extraire_O': 3, 'Extraire_S_stars': 3, 'Extraire_H_stars': 3, 'Extraire_O_stars': 3,
    'NXT_RGB': 3, 'NXT_L': 3, 'NXT_H': 3, 'NXT_O_S': 3,
    'GHS_1_premier': 4, 'GHS_2_contraste': 4, 'GHS_3_fond': 4, 'Statistical_Stretch': 4, 'Star_Stretch': 4,
    'LRGB_ajout_L': 5, 'NBN_SHO': 5, 'NBN_HOO': 5, 'Foraxx_SHO': 5, 'Foraxx_HOO': 5, 'HOO_simple': 5, 'HOO_Hubble': 5,
    'Perfect_Palette_Picker': 5, 'NBColourMapper': 5, 'SCNR_SHO': 5, 'H_en_luminance': 5,
    'Masque_L': 6, 'Courbes': 6, 'LHE': 6, 'LHE_fin': 6, 'Boost_finition_light': 6, 'Boost_finition': 6, 'HDRMT_50': 6, 'NXT_final': 6,
    'Etoiles_RGB': 7, 'Etoiles_HOO': 7, 'NB_to_RGB_Stars': 7, 'Etoiles_HOO_synth': 7, 'Etoiles_screen': 7, 'CorrectMagentaStars': 7,
    'Etoiles_reduites': 7, 'Fermer_L_stars': 3, 'MT_etoiles': 7, 'Halo_B_Gon': 7,
}

NB = ('RSHO', 'SHO', 'HOO')
LUM = ('LRGB', 'LHA')   # workflows avec luminance : par défaut Statistical Stretch sur le RGB, GHS sur L
OPT = {'Boost_finition_light', 'Boost_finition', 'LinearPatternSubtraction', 'WBPP', 'CC_auto', 'Find_Background', 'LinearFit_ref_H', 'Continuum_auto', 'H_dans_L', 'NBRGBCombination', 'HDRMT_50', 'NXT_final',
       'MT_etoiles', 'Halo_B_Gon', 'CorrectMagentaStars', 'SCNR_SHO', 'Perfect_Palette_Picker', 'NBColourMapper', 'H_en_luminance',
       'Etoiles_HOO_synth', 'DualBand_H', 'DualBand_O', 'SPFC_S'}


def role(prefix, base):
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
    'str': ('Étirement', [('mix', 'Statistical Stretch sur RGB + GHS sur L (défaut LRGB)'), ('ghs', 'GHS sur tout (défaut sans L)'), ('stat', 'Statistical Stretch sur tout (automatique)')]),
    'et': ('Étoiles', [('screen', 'Recombinaison simple (défaut galaxies)'), ('reduit', 'Recombinaison + réduction Blanshan (défaut nébuleuses)')]),
    'pal': ('Palette', [('nbn', 'NarrowbandNormalization (défaut)'), ('foraxx', 'Foraxx (or et bleu)'), ('hubble', 'Variante Hubble (HOO, tons dorés)')]),
}

# pour les options : quand les ajouter
WHEN = {
    'LinearPatternSubtraction': "lignes horizontales résiduelles visibles sur un master (motif du capteur)",
    'WBPP': "seulement si tu repars des brutes (masters pas encore empilés)", 'CC_auto': "avec WBPP, si tu repars des brutes",
    'Find_Background': "champ rempli de nébuleuse : fond de référence pour SPCC",
    'LinearFit_ref_H': "fonds très différents entre H, O et S (conseillé avec Foraxx)", 'Continuum_auto': "calcul automatique du coefficient k",
    'H_dans_L': "régions HII plus nettes (H injecté dans la luminance)", 'NBRGBCombination': "alternative à la soustraction du continuum",
    'Boost_finition_light': "un tout petit peu plus de couleur et de contraste après LHE_fin (version douce du Boost, rejouable)",
    'Boost_finition': "encore un peu plus de couleur et de contraste après LHE_fin (rejouable)",
    'HDRMT_50': "cœur de galaxie ou nébuleuse brillante brûlé (HDRMT appliqué à 50 %)", 'NXT_final': "bruit visible sur l'image finale",
    'MT_etoiles': "réduction d'étoiles supplémentaire", 'Halo_B_Gon': "halos autour des étoiles brillantes",
    'CorrectMagentaStars': "étoiles magenta", 'SCNR_SHO': "reste de vert après la palette",
    'Perfect_Palette_Picker': "comparer 16 palettes avant de choisir", 'NBColourMapper': "teintes libres, filtre par filtre",
    'H_en_luminance': "détail plus net en HOO (H en luminance)", 'Etoiles_HOO_synth': "alternative à NB to RGB pour les étoiles",
    'DualBand_H': "caméra couleur avec filtre dual-band", 'DualBand_O': "caméra couleur avec filtre dual-band",
    'SPFC_S': "seulement si ta base MARS couvre S (pas le cas de DR2)",
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
_FIN = ('C_Finition', "l'image sans étoiles étirée, Masque_L attaché (Ctrl+M)", ['Courbes', 'LHE', 'LHE_fin'])
CONTAINERS = {
    'LRGB': [('C_RGB_lineaire', "l'image RGB combinée, linéaire, gradient retiré", ['BXT_CorrectOnly', 'SPCC', 'BXT_RGB', 'SXT_lineaire', 'NXT_RGB']),
             ('C_L_lineaire', "le master L, linéaire, gradient retiré", ['BXT_L', 'SXT_lineaire', 'NXT_L', 'Fermer_L_stars']), _FIN],
    'LHA': [('C_RGB_couleur', "l'image RGB combinée, linéaire, gradient retiré", ['BXT_CorrectOnly', 'SPCC', 'BXT_RGB']),
            ('C_RGB_etoiles_bruit', "l'image RGB après injection de H", ['SXT_lineaire', 'NXT_RGB']),
            ('C_L_etoiles_bruit', "le master L après BXT", ['SXT_lineaire', 'NXT_L', 'Fermer_L_stars']), _FIN],
    'RSHO': [('C_SHO_lineaire', "l'image SHO combinée, linéaire", ['BXT_NB', 'SXT_lineaire']),
             ('C_Extraction_SHO', "l'image SHO sans étoiles", ['Extraire_S', 'Extraire_H', 'Extraire_O']), _FIN,
             ('C_Etoiles_RGB', "l'image RGB combinée, linéaire, gradient retiré", ['BXT_CorrectOnly', 'SPCC', 'BXT_RGB', 'SXT_RGB_lineaire'])],
    'SHO': [('C_SHO_lineaire', "l'image SHO combinée, linéaire", ['BXT_NB', 'SXT_lineaire']),
            ('C_Extraction_SHO', "l'image SHO sans étoiles", ['Extraire_S', 'Extraire_H', 'Extraire_O']),
            ('C_Extraction_etoiles', "l'image d'étoiles SHO, linéaire", ['Extraire_S_stars', 'Extraire_H_stars', 'Extraire_O_stars']), _FIN],
    'HOO': [('C_HOO_lineaire', "l'image HOO combinée, linéaire", ['BXT_NB', 'SXT_lineaire']),
            ('C_Extraction_HOO', "l'image HOO sans étoiles", ['Extraire_H', 'Extraire_O']), _FIN],
}
