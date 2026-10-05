# Fiches outils : réglages, méthode, symptômes, sources

Une fiche par outil (WBPP, MGC, SPCC, BXT, NXT, SXT, GHS, LRGBCombination, continuum, étoiles, finition…) : valeurs de l'icône (« À régler »), quoi changer selon le symptôme, puis méthode, paramètres détaillés et sources.

Issu de l'ancienne fiche HTML `docs/pixinsight-workflow.html` (octobre 2026) ; sources dans `docs/sources.md`.

## Paramètres des outils
Pour chaque outil, l'encadré **À régler** donne les valeurs à mettre (celles des icônes) et quoi changer si le résultat ne va pas. La méthode, les explications, les différences entre filtres et les sources sont repliées dans _Détails_. Ce sont des points de départ à ajuster à l'œil sur tes données. Clique sur une étiquette d'outil dans les workflows pour arriver directement à sa fiche.

### Prétraitement
#### WBPP (WeightedBatchPreprocessing)
**À régler :**

- **Préréglage** : Maximum quality
- **Cosmetic correction** : icône CC_auto (Hot sigma 2,5)
- **Pondération** : PSF Signal Weight
- **Local normalization** : activée
- **Rejection** : Auto
- **Drizzle** : non, sauf FWHM < 2 px et 15–20 poses dithérées

  * Un groupe de lights sans dark ou sans flat (onglet Calibration) → corrige avant Run.
  * Traînées de satellites → Large-scale pixel rejection (High) activé.

**Détails, explications et sources**

Méthode

1. Prépare les fichiers (mêmes réglages de caméra, darks de même durée et température, flats et flat-darks par filtre et par session).
2. Add Directory, puis vérifie dans l'onglet Calibration que chaque groupe de lights a son dark et son flat.
3. Règle les options ci-dessous, Run, puis contrôle le journal et les cartes de réjection. Détail pas à pas : `preparation.md`.

Paramètres

- **Version** : WBPP 3.1 (PixInsight 1.9.5)

- **Préréglage de qualité** : Maximum quality (défaut)

- **Output pedestal** : Automatic

- **Optimize dark frames** : Décoché (caméra refroidie, darks de même durée et température) ; ne calibre jamais les darks avec les bias

- **Cosmetic correction** : Icône CC_auto : Auto detect, Hot sigma 2,2 à 3,0, Cold désactivé

- **Caméra couleur** : CFA images coché, motif Auto, Debayer VNG

- **Subframe weighting** : PSF Signal Weight

- **Registration** : Référence Auto ; Distortion correction pour les grands champs

- **Local normalization** : Activée, référence : intégration des meilleures images

- **Rejection** : Auto ; sinon Percentile (moins de 10 images), Winsorized (plus de 10), ESD (grands lots)

- **Large-scale pixel rejection (High)** : Activé contre les satellites

- **Fast Integration** : Automatique dès 150 images par groupe ; à décocher pour l'intégration pondérée complète

- **Drizzle** : Par groupe : ×2 si FWHM < 2 px et 15 à 20 poses dithérées ; caméra couleur : drizzle CFA Scale 1, Drop shrink 1,0

- **Autocrop / Astrometric solution** : Activés

- **Grouping keywords** : Mot-clé de nuit (par ex. SESSION) si les flats changent d'une nuit à l'autre

#### FastBatchPreprocessing
**À régler :**

- **Quand** : centaines de poses courtes, machine modeste
- **Sinon** : utilise WBPP

**Détails, explications et sources**

Méthode

1. Alternative rapide à WBPP pour des centaines de poses courtes (couleur ou mono).
2. Charge brutes et calibrations, choisis le dossier de sortie, Run.

Paramètres

- **Quand l'utiliser** : Très gros volumes, poses courtes, machine modeste

- **Limites** : Moins d'options que WBPP (pondération, normalisation locale) : WBPP reste la référence pour la qualité

#### CosmeticCorrection
**À régler :**

- **Auto detect** : activé
- **Hot sigma** : 2,5 (L, R, G, B : 2,5–3,0 ; S, H, O : 2,2–2,5)
- **Cold sigma** : désactivé
- **CFA** : coché seulement en caméra couleur

  * Du vrai signal (petites étoiles) est modifié → remonte Hot sigma.

**Détails, explications et sources**

Méthode

1. Crée une icône de process réglée comme ci-dessous.
2. Dans WBPP, sélectionne cette icône comme modèle de correction cosmétique.

Paramètres

- **Use Auto detect** : Activé

- **Hot sigma** : 2,2 à 3,0 (Telescope Live : 2,2 à 2,5). Ne descends pas trop bas, sinon du vrai signal est modifié

- **Cold sigma** : 3,0, ou désactivé (Telescope Live le laisse à 0)

- **CFA** : Coché pour une caméra couleur

#### LinearPatternSubtraction (script)
**À régler :**

- **Quand** : E00 de tous les workflows : lignes résiduelles du capteur sur tous les masters ouverts
- **Une seule fois** : copie [LPS_UnClic.js](https://github.com/clodoweg/PixInsight/blob/main/docs/process-icons/scripts/LPS_UnClic.js) dans `src/scripts/clodoweg`
- **Ensuite** : masters seuls ouverts, glisse l'icône sur l'un d'eux : tous sont corrigés, sans dialogue
- **Préréglé** : lignes, Correct the entire image, Layers to remove 9, Rejection limit 3, Global rejection 5, zone de fond la plus sombre trouvée seule

  * Colonnes plutôt que lignes → `correctColumns = true`.
  * Artefacts → Ctrl+Z (script prévu pour les brutes).

**Détails, explications et sources**

Méthode

1. Script de Vicent Peris livré avec PixInsight (_Script › Pattern Correction_) ; il ouvre toujours son dialogue. LPS_UnClic.js appelle son moteur directement avec les réglages de l'icône et ferme les fenêtres de travail.
2. Prévu pour les brutes ; sur un master, seulement si un motif reste visible.

#### LocalNormalization
**À régler :**

- **Rien à régler** : WBPP s'en charge (Scale 1024)

**Détails, explications et sources**

Méthode

1. Géré automatiquement par WBPP : tu n'as normalement rien à lancer à la main.

Paramètres

- **Scale** : 1024 (défaut)

- **Référence** : Intégration des meilleures images (choix de WBPP)

Très utile quand les gradients varient d'une nuit à l'autre.

### Recadrage et gradient
#### DynamicCrop
**À régler :**

- **Cadre** : exclut les bords bruités, quelques dizaines de pixels de marge
- **Rotation** : 0
- **Autres masters** : même icône appliquée à tous

**Détails, explications et sources**

Méthode

1. Ouvre un master, trace le cadre en excluant les bords mal couverts.
2. Glisse le triangle du process sur la fenêtre de l'espace de travail pour créer une icône.
3. Applique cette icône à tous les autres masters : ils sont alignés, le recadrage est identique.

Paramètres

- **Rotation** : 0

- **Marge** : Quelques dizaines de pixels au-delà des bords bruités

#### MultiscaleGradientCorrection + MARS
**À régler :**

- **Couverture** : MARS DR2 : tout l'hémisphère nord en large bande, vers le sud jusqu'à −15° environ ; narrowband jusqu'à +75°. **Cible plus au sud** (« 0 reference image(s) available ») → GradientCorrection ou DBE à la place de SPFC + MGC (préparateur : choix du gradient).
- **Base MARS, une fois par ordinateur** : déclare tes fichiers `.xmars` (clé à molette › Add), puis dans chaque icône MGC : section MARS Database › **Default Files** , remplace l'icône (triangle) et enregistre tes icônes. Chaque instance garde sa propre liste : sans cela, « No MARS database files have been selected ».
- **Gradient scale** : 1024
- **Structure separation** : 3
- **Model smoothness** : 1,0
- **Filtre MARS** : L : Gray = L ; couleur : R, G, B ; H : Ha ; O : OIII
- **Show gradient model** : coché

  * Gradient restant dans les coins → Gradient scale 512, puis 256.
  * Modèle qui ondule → Model smoothness 3 à 5.
  * Filtre S ou cible hors MARS → GradientCorrection ou DBE.

**Détails, explications et sources**

Méthode

1. Installe la base **MARS DR2** (fichiers .xmars, depuis le Software Distribution System de PixInsight ; l'exemple officiel charge « MARS DR2 » et « MARS-u DR1 ») : icône clé à molette du process, Add, puis choisis le fichier.
2. Sur l'image linéaire : ImageSolver, puis SpectrophotometricFluxCalibration (réglages : voir la fiche SPFC), puis MGC.
3. Coche Show gradient model et contrôle le modèle : il doit être lisse, sans structure de la nébuleuse.
4. Enchaîne avec SPCC (neutralisation du fond activée).

Paramètres

- **Gradient scale** : 1024 au départ ; 512 ou 256 si un gradient reste dans les coins (plus bas = plus agressif)

- **Structure separation** : 3 ; 1 ou 2 pour mieux corriger bords et coins

- **Model smoothness** : 1,0 ; 3 à 5 si le modèle ondule

- **Scale factors R/G/B** : 1,0

- **Show gradient model** : Coché

- **Use MARS database / filtres MARS** : Coché ; bandes MARS : Gray = L (image mono), Red = R, Green = G, Blue = B (image couleur) ; masters narrowband : Gray = Ha ou OIII (MARS DR2, icônes MGC_MARS_H et MGC_MARS_O)

- **Reference image** : Vide (la base MARS sert de référence)

#### GradientCorrection
**À régler :**

- **Tous les réglages** : défaut
- **Structure protection** : activé
- **Generate gradient model** : décoché (coché pour voir le modèle)

  * Gradient dans les coins → baisse Gradient scale.
  * Nébuleuse assombrie → monte Protection amount.
  * Zones claires autour des structures sombres → monte Low threshold.

**Détails, explications et sources**

Méthode

1. Pars des valeurs par défaut et génère le modèle de gradient pour le contrôler.
2. Ajuste selon les symptômes (ci-dessous), en gardant Structure protection activée.

Paramètres

- **Gradient scale** : Défaut ; baisser si un gradient reste dans les coins

- **Structure protection** : Activé

- **Protection threshold** : Plus bas = protège aussi les zones faibles de la nébuleuse

- **Protection amount** : Monter si la nébuleuse est assombrie

- **Low threshold** : Monter si des zones claires apparaissent autour des structures sombres

- **Bords nets dans le modèle** : Désactive temporairement la protection, baisse Scale et Smoothness, puis réactive

#### DBE (DynamicBackgroundExtraction)
**À régler :**

- **Samples per row** : 15 (10–20)
- **Tolerance** : 0,5
- **Smoothing factor** : 0,25
- **Correction** : Subtraction
- **Points** : seulement sur du fond vide, surtout vers les coins

  * Points rouges (rejetés) → Tolerance 1,0 à 1,5.
  * Champ nébuleux complexe → Smoothing 0,5 à 1,0.
  * Vignettage → Division.

**Détails, explications et sources**

Méthode

1. Clique sur l'image pour ouvrir DBE, puis Generate pour placer les points.
2. Supprime tous les points posés sur la nébuleuse, la galaxie ou une étoile brillante.
3. Ajoute des points à la main dans le fond de ciel vide, surtout vers les coins.
4. Exécute, contrôle le modèle, puis ferme-le.

Paramètres

- **Samples per row** : 10 à 20 (Jon Rista : 20 à 25 pour un capteur 4:3 ou 3:2)

- **Sample radius** : 10 à 50 selon l'échantillonnage

- **Tolerance** : 0,5 (défaut) ; monter à 1,0 à 1,5 si des points sont rejetés (rouges)

- **Shadows relaxation** : 3,0 (défaut) ; monter si des points sombres sont rejetés

- **Smoothing factor** : 0,25 (défaut) ; 0,5 à 1,0 pour les champs nébuleux complexes

- **Correction** : Subtraction pour la pollution lumineuse ; Division pour le vignettage

- **Normalize** : Coché (conseillé par nrStellar)

- **Discard background model** : Coché

- **Replace target image** : Coché

#### GraXpert (module DeepSkyForge) — plus d'icône (supprimée à la demande de l'utilisateur)
GRATUIT

**À régler :**

- **Correction** : Subtraction
- **Smoothing** : 0
- **Modèle IA** : le plus récent

  * Nébuleuse qui remplit le champ, modèle suspect → DBE.

**Détails, explications et sources**

Méthode

1. Installe GraXpert sur ta machine, puis le module via son dépôt.
2. Lance le process sur l'image linéaire, contrôle le modèle de fond.

Paramètres

- **Correction** : Subtraction ; Division seulement pour un vignettage ou un gradient très fort

- **Smoothing** : 0,0 (défaut) : n'influence pas le résultat du modèle IA

- **Modèle IA** : Dernière version disponible

### Couleur et astrométrie
#### ChannelCombination
**À régler :**

- **Couleur** : R = R, G = G, B = B
- **SHO** : R = S, G = H, B = O
- **HOO** : R = H, G = O, B = O

**Détails, explications et sources**

Méthode

1. Espace de couleur RGB, assigne une image par canal, puis clique sur le rond bleu (application globale).

Paramètres

- **RGB naturel** : R = R, G = G, B = B

- **SHO (pour NarrowbandNormalization)** : R = S, G = H, B = O

- **HOO** : R = H, G = O, B = O

- **CIE L*a*b*** : Pour remplacer L : L = ta luminance, a et b issus du RGB (ChannelExtraction en L*a*b*)

#### LinearFit
**À régler :**

- **Référence** : H
- **Appliquer sur** : O et S
- **Reject low / high** : défaut

  * En RGB → inutile, SPCC équilibre déjà.

**Détails, explications et sources**

Méthode

1. Choisis le canal de référence, puis applique LinearFit à chacun des autres canaux.
2. À faire après le retrait du gradient, avant de combiner ou d'étirer.

Paramètres

- **Reference image** : H en narrowband (theAstroShed) ; certains préfèrent le canal le plus faible

- **Reject low / high** : Valeurs par défaut

#### ImageSolver
**À régler :**

- **Icônes** : E03 `Solver_auto` (toutes les images ouvertes, Apply Global) ou `ImageSolver` (glissée sur une image)
- **Préréglé** : date 2020-01-01 ajoutée si absente ; focale 2 939 mm, pixel 3,76 µm (0,264″/px) ; Gaia DR3 local ; correction de distorsion
- **Quand** : avant SPFC, MGC et SPCC ; après toute combinaison (une image combinée n'a pas de solution)

  * Pas de coordonnées dans l'en-tête → ImageSolver depuis le menu Script, Search.
  * Master en bin 2 → `metadata_xpixsz = 7.52` dans l'icône.
  * Jamais dans un conteneur glissé sur une image : conteneurs avec Solver_auto en Apply Global.

**Détails, explications et sources**

Méthode

1. Scripts de la fiche (ImageSolver_Date.js, GC_Solver_auto.js) : ils ajoutent la date si elle manque puis lancent le moteur d'ImageSolver avec les réglages du matériel ; coordonnées et date viennent de chaque image.
2. 1.9.5 : distorsion _Recursive surface splines_ , plus précise.

#### SPCC (SpectrophotometricColorCalibration)
**À régler :**

- **White reference** : Average Spiral Galaxy
- **QE curve** : Sony IMX411/455/461/533/571
- **Filtres** : Antlia V Pro R, G, B
- **Background neutralization** : activé, limites −2,80 / +2,00
- **Catalogue** : Gaia DR3/SP
- **Generate graphs** : décoché (coché pour contrôler)

  * Nébuleuse qui remplit le champ → script Find Background, puis Region of Interest › From Preview.
  * Palette SHO/HOO → pas de SPCC.

**Détails, explications et sources**

Méthode

1. Choisis capteur et filtres.
2. **Fond de référence** , trois possibilités :
     * **Automatique, sans rien faire** : sans vue de référence ni _Region of Interest_ , SPCC prend l'image entière. Les limites, en écarts-types autour de la médiane, écartent étoiles et nébuleuse. Suffisant après le retrait du gradient sur une galaxie ou un champ avec du ciel libre.
     * **Automatique, par script** : sur un champ rempli de nébuleuse, lance _Script › SetiAstro › Find Background_ (dépôt https://updates.setiastro.com/). Il crée un aperçu nommé _Background_ ; dans SPCC, coche _Region of Interest_ puis _From Preview_. Autre solution : baisser la limite haute.
     * **Manuel** : crée une petite preview sur du fond vide et choisis-la de la même façon.
3. Apply, puis vérifie que le fond est gris neutre.
4. Coche Generate graphs et vérifie que les étoiles suivent bien les droites.

Paramètres

- **White reference** : Average Spiral Galaxy

- **QE curve** : Ton capteur (ex. Sony IMX571) ; Ideal QE si absent

- **Filters (mono)** : Ton jeu RGB (Astronomik, Baader, Antlia, Chroma…)

- **Filters (couleur)** : Filtres Bayer de ta caméra

- **Narrowband filters mode** : Pour une image composée de filtres étroits (longueurs d'onde et bandes passantes)

- **Catalogue** : Gaia DR3/SP

- **Background neutralization** : Activé ; référence = image entière (défaut de l'icône) ou aperçu de fond (script Find Background ou preview manuelle) ; limites basse et haute −2,80 et +2,00 en écarts-types (valeurs par défaut)

- **Generate graphs** : Coché

#### SPFC (SpectrophotometricFluxCalibration)
**À régler :**

- **QE curve** : Sony IMX411/455/461/533/571
- **L** : Gray filter = Antlia L
- **RGB combiné** : Red/Green/Blue = Antlia R, G, B
- **H / O / S** : Narrowband mode : 656,3 / 500,7 / 672,4 nm, 3 nm
- **Catalog** : Gaia DR3/SP, Automatic limit magnitude coché

  * Prêt dans le fichier 04 (icônes QHY600_Antlia).

**Détails, explications et sources**

Méthode

1. Prérequis : image **linéaire** , gradient non encore retiré, **résolue** (ImageSolver ou WBPP), base Gaia DR3/SP installée.
2. Ouvre _Process › ColorCalibration › SpectrophotometricFluxCalibration_ et règle capteur, filtres et catalogue (ci-dessous).
3. Applique sur l'image. Elle ne change pas visuellement : SPFC écrit seulement dans le fichier les métadonnées de flux que MGC lit ensuite.
4. Enchaîne directement avec MGC, puis SPCC avec **les mêmes filtres** que dans SPFC.

Paramètres

- **QE curve** : Ton capteur s'il est dans la liste ; sinon _Ideal QE curve_ (défaut), qui suppose une sensibilité égale à toutes les longueurs d'onde

- **Gray filter (image mono)** : Le filtre du master : courbe mesurée de ton filtre si elle est dans la liste (par ex. Astronomik L-2 pour L), sinon une bande plate définie par longueur d'onde et bande passante

- **Red / Green / Blue filter (image couleur)** : Pour un RGB combiné : tes filtres R, G, B. Pour une caméra couleur : les filtres Bayer de ton capteur (par ex. _Sony Color Sensor R/G/B-UVIRcut_). Le Gray filter est alors ignoré

- **Narrowband mode** : Coché pour un master H, O ou S : longueur d'onde 656,3 / 500,7 / 672,4 nm et bande passante de ton filtre (3, 5, 7 nm…)

- **Catalog** : Gaia DR3/SP

- **Automatic limit magnitude** : Coché

- **Détection des étoiles (PSF)** : Valeurs par défaut : PSF type Auto, saturation threshold 0,75 relatif

- **Generate graphs / star maps** : Optionnels (décochés par défaut)

### RC Astro
#### BlurXTerminator
**À régler :**

- **Passe 1 (avant SPCC)** : Correct Only coché
- **Sharpen Stars** : 0,25
- **Adjust Star Halos** : 0
- **Sharpen Nonstellar** : L et H 0,80 ; narrowband 0,60 ; RGB 0,50
- **Automatic PSF** : coché

  * Vers ou pores à 100 % → baisse Sharpen Nonstellar.
  * Halos sombres autour des étoiles → baisse Sharpen Stars ou monte Halos.
  * FWHM au-delà de ~2,1″ au CDK17 en bin 1 (> 8 px) → bin 2 ou réduction ×0,5 avant BXT.

**Détails, explications et sources**

Méthode

1. Passe 1, avant SPCC : Correct Only sur le RGB combiné.
2. Passe 2, après SPCC : réglages ci-dessous.
3. Toujours en linéaire, avant NXT et SXT ; jamais deux fois.

Paramètres

- **Sharpen Stars** : 0 à 0,5 (0,25) ; trop haut : halos sombres.

- **Adjust Star Halos** : 0 (−0,5 à +0,5).

- **Sharpen Nonstellar** : L et H 0,80, narrowband 0,60, RGB 0,50 ; vers ou pores à 100 % : baisse.

- **Automatic PSF** : Coché. PSF manuelle : 8 px au maximum ; au CDK17 en bin 1 (0,264″/px), une FWHM au-delà de 2,1″ demande bin 2 ou une réduction ×0,5.

#### NoiseXTerminator
**À régler :**

- **Denoise** : L et H 0,60 ; O et S 0,75 ; RGB 0,80 ; passe finale 0,40 (NXT_final, image sans étoiles) ; galaxies : toute dernière passe 0,25 sur l'image finie avec étoiles (NXT_dernier)
- **Iterations** : 1
- **Séparations** : décochées

  * Aspect plastique → baisse Denoise.
  * Master très bruité → 2 itérations.
  * Taches de couleur restantes (image couleur) → Color separation, Denoise color plus haut.

**Détails, explications et sources**

Méthode

1. Toujours après BXT ; une passe principale (linéaire ou étirée, NXT fonctionne dans les deux cas), une passe finale légère si besoin.

Paramètres

- **Denoise** : 0 à 1 ; L et H 0,60, O et S 0,75, RGB 0,80, finale 0,40.

- **Iterations** : 1 ; 2 sur un master très bruité.

- **Color / frequency separation** : Décochées ; color separation pour des taches de couleur restantes (image couleur).

#### StarXTerminator
**À régler :**

- **Generate star image** : coché
- **Unscreen stars** : coché sur image étirée (galaxies : RGB après MAS, SXT_RGB_etire) ; décoché en linéaire (L des galaxies, SXT_L_lineaire ; narrowband)
- **Large overlap** : décoché
- **AI** : AI11, version complète

  * Quadrillage dans l'image sans étoiles → Large overlap.
  * Cœur de galaxie retiré → masque noir sur le cœur.

**Détails, explications et sources**

Méthode

1. Galaxies : L en linéaire (SXT_L_lineaire, sans image d'étoiles) ; RGB étiré par MAS avec ses étoiles, puis SXT_RGB_etire (Unscreen coché) : RGB_stars sort déjà étirée, remise à la fin (Etoiles_screen).
2. Narrowband : le plus tôt possible en linéaire, après BXT (RC Astro) ; étire ensuite fond et étoiles séparément.
3. Recombinaison en mode screen à la fin.

Paramètres

- **AI version** : AI11, en version complète de préférence (meilleurs résultats). _Lite_ : environ 75 % de mémoire en moins. _Lite.nonoise_ : bien plus rapide, mais sans reconstitution du bruit dans les zones d'où les étoiles sont retirées (notes de version AI11).

- **Generate star image** : Coché : crée l'image d'étoiles en plus de l'image sans étoiles.

- **Unscreen stars** : **Décoché** sur une image linéaire : l'image d'étoiles est alors l'original moins l'image sans étoiles (simple soustraction), la meilleure méthode en linéaire. Coché seulement sur une image déjà étirée : l'extraction « unscreen » permet ensuite une recombinaison en screen exacte.

- **Large overlap** : Décoché : recouvrement des tuiles de 20 %. Coché : 50 %, environ trois fois plus lent (RC Astro). Seulement si un quadrillage apparaît dans l'image sans étoiles ; Evan Tsai signale qu'il peut parfois créer d'autres artefacts.

- **Linear** : Case supprimée depuis AI11 : SXT détecte seul si l'image est linéaire ou étirée.

- **Remove stars / spikes / aureoles / reflections** : Paramètres de l'instance, tous cochés dans les icônes (reflections était décoché dans l'instance de référence ; coché à la demande de l'utilisateur, sans effet constaté sur le grand reflet d'une étoile brillante). RC Astro ne les documente pas publiquement.

- **Masque** : Les zones noires d'un masque sont protégées du retrait : utile si SXT prend le cœur compact d'une galaxie pour une étoile. Depuis la 2.2.0, ces zones n'apparaissent plus dans l'image d'étoiles (images sans étoiles et d'étoiles cohérentes).

- **Recombinaison** : Après étirement séparé des deux images, en mode screen dans PixelMath : `~((~starless) * (~stars))`.

### Étirement
#### GeneralizedHyperbolicStretch (GHS)
**À régler :**

- **1er étirement** : SP sur le fond ou le signal faible, b = 10, Stretch factor ≈ 5,5 (fond linéaire à 0,002) jusqu'au pic à 0,25
- **Passes suivantes** : b = 4, Stretch factor 1 à 2, SP sur la zone plate au-dessus du fond (0,30–0,45), HP 0,9, LP 0
- **Fond** : b = 10, SP = fond − 0,03, HP = SP, Stretch factor ≈ 1 jusqu'au fond vers 0,12–0,14
- **Couleur** : Colour mode, clip RGBBlend
- **Image** : sans étoiles seulement (étoiles : Star Stretch)

  * Cœur brillant qui sature → baisse HP.
  * Fond trop sombre, bouché → monte LP.
  * Fond bruité qui monte → SP trop bas : remonte-le.
  * Pas à pas : affiner SP, LP et HP.

**Détails, explications et sources**

Méthode

1. Premier étirement : SP sur le signal faible, Local intensity (b) vers 10, puis monte Stretch factor jusqu'à un pic d'histogramme vers 0,20 à 0,25.
2. Passes suivantes : ajoute du contraste là où l'image est plate, avec b entre 3 et 5. HP empêche les zones brillantes de saturer, LP empêche le fond de se boucher.
3. Fond trop clair : assombris-le sans rien écrêter grâce à la technique HP = SP.

Paramètres

- **Transformation type** : Generalized Hyperbolic

- **Stretch factor (ln(D+1))** : 0 à 20 ; 0 = aucun effet. ≈ 3 à 6 au 1er étirement, 1 à 2 en contraste, ≈ 1 pour le fond (tableau)

- **Local intensity (b)** : ≈ 10 au premier étirement, 3 à 5 ensuite

- **Symmetry point (SP)** : Clic sur la zone à contraster, Send to SP, puis affiner jusqu'à l'histogramme le plus large

- **Protect shadows (LP)** : 0 au départ ; monter vers le niveau du fond s'il devient trop sombre (jamais au-dessus de SP)

- **Protect highlights (HP)** : 1 au départ ; baisser vers le niveau du cœur brillant jusqu'à ce qu'il ne sature plus (jamais sous SP)

- **Colour mode** : Colour pour une image couleur, avec la clip mode RGBBlend

#### Statistical Stretch (SetiAstro)
GRATUIT

**À régler :**

- **Target Median** : 0,25 (0,10 pour une cible compacte)
- **Blackpoint Sigma** : 5,0
- **Linked Stretch** : coché
- **Tout le reste** : défaut (Normalize, Luma Only, HDR décochés ; Curves Boost 0)

  * Ensuite, avec 0,25 : passe GHS_3_fond (étape Fond de GHS) pour ramener le fond vers 0,12–0,14. Avec 0,10 : rien à faire.
  * Galaxies : option seulement, à la place de MAS sur le RGB (L est étirée par les GHS) ; puis GHS_3_fond, avant LRGBCombination.
  * Fond trop clair → monte Blackpoint Sigma.
  * Images à combiner → même Target Median pour toutes.

**Détails, explications et sources**

Méthode

1. Point noir = médiane − Blackpoint Sigma × 1,4826 × MAD, puis une fonction de transfert amène la médiane sur Target Median.
2. Dans les conteneurs rapides, l'icône l'applique sans dialogue (openDialogbox false).

Paramètres

- **Target Median** : 0,25 (0,10 pour une cible compacte) ; même valeur pour toutes les images à combiner.

- **Blackpoint Sigma** : 5 ; plus haut : fond plus sombre, plus bas : plus de signal faible.

- **Linked Stretch** : Coché : garde l'équilibre de SPCC. Décoché : canal par canal (narrowband).

- **Luma Only, Normalize, HDR Compress, Curves Boost** : Décochés / 0 dans les icônes.

### Combinaison
#### LRGBCombination
**À régler :**

- **Canaux** : seul L coché
- **Lightness** : 0,5
- **Saturation** : 0,5 dans les galaxies (réglage de l'utilisateur ; plus bas = plus saturé)
- **Chrominance noise reduction** : coché

  * Couleurs délavées → L trop claire : étire-la moins.

**Détails, explications et sources**

Méthode

1. Prépare L et RGB étirés SANS étoiles (galaxies : L par SXT_L_lineaire puis GHS, RGB par MAS puis SXT_RGB_etire), avec des niveaux de fond et une médiane proches : même méthode pour les deux, y compris GHS_3_fond (fond 0,12–0,14) passé sur L et sur RGB avant la combinaison.
2. Dans le process : décoche R, G et B, coche L et choisis ta luminance.
3. Glisse le triangle sur l'image RGB.

Paramètres

- **Channel weights** : 1

- **Lightness** : 0,5 (défaut)

- **Saturation** : 0,5 dans les icônes LRGB_ajout_L (réglage de l'utilisateur ; plus bas = plus saturé, ex. 0,40 si couleurs ternes)

- **Chrominance noise reduction** : Coché (valeurs par défaut)

#### NBRGBCombination (script)
**À régler :**

- **RGB** : ton image, bande ≈ 100 nm
- **R Channel** : H, bande 3 nm
- **Scale** : 1,2

  * H trop discret → Scale 3 à 5.

**Détails, explications et sources**

Méthode

1. Menu Script › Utilities › NBRGBCombination (script livré avec PixInsight).
2. Choisis l'image RGB et sa bande passante, puis l'image narrowband de chaque canal concerné et la bande passante de son filtre.
3. Compare avec les boutons d'aperçu RGB et NBRGB, ajuste Scale, puis applique. Compare aussi avec la soustraction du continuum en PixelMath.

Paramètres

- **RGB** : Ton image RGB et sa bande passante : ≈ 100 nm pour un filtre R mono (Chroma R : 600 à 700 nm) ; un tutoriel utilise 200 nm pour un capteur couleur

- **R Channel** : Image H et bande passante de ton filtre (3, 5, 7 nm…)

- **G / B Channel** : Image O et sa bande passante, si tu l'injectes

- **Scale** : 1,2 (défaut) ; jusqu'à 3 à 5 pour faire ressortir un H faible

#### Automatic Continuum Subtraction (SetiAstro)
GRATUIT

**À régler :**

- **Entrées** : master H + master R (ou O + G), linéaires
- **Mode** : Starry
- **Output Linear Image Only** : coché
- **Noise reduction** : décochée

  * Étoiles ou disque encore visibles dans HaNB → relance en mode Starless.
  * Vue créée HaNB1 → renomme-la HaNB (H_dans_RGB et H_dans_L lisent HaNB).

**Détails, explications et sources**

Méthode

1. Choisis le master H et le master R (ou O et G).
2. Le script calcule le coefficient et produit HaNB (gris, linéaire), sans continuum ; c'est l'icône E12 Continuum_auto du chemin principal LHaRGB.

Paramètres

- **Entrées** : Masters linéaires, alignés, gradient retiré

- **Contrôle** : Les étoiles et le disque galactique doivent disparaître de HaNB

- **Starry / Starless** : Starry (images avec étoiles), dans ce workflow où la soustraction se fait avant SXT

- **Output Linear Image Only** : Coché : sortie linéaire seule, pour injecter HaNB en linéaire (sinon le script étire et extrait le signal pur)

- **Noise reduction** : Décochée (NXT se fait à part) ; préréglé ainsi dans l'icône Continuum_auto

#### ImageBlend (Mike Cranfield)
GRATUIT

**À régler :**

- **H dans R ou L** : Lighten ou Screen, opacité 20–60 %
- **O dans G et B** : opacité 20–40 %, plus faible dans G
- **Étoiles** : Screen

**Détails, explications et sources**

Méthode

1. Choisis l'image de base et l'image à mélanger.
2. Choisis le mode et l'opacité en regardant l'aperçu, puis applique.

Paramètres

- **H dans R ou L** : Mode Lighten ou Screen, opacité 20 à 60 %

- **Étoiles** : Mode Screen

- **Étirement ou filtre par image** : Optionnel, pour équilibrer les intensités

### Narrowband
#### NarrowbandNormalization (module)
GRATUIT

**À régler :**

- **Palette** : SHO ou HOO selon ta combinaison
- **Lightness** : H
- **O3 / S2 boost** : 0, puis monte peu à peu
- **Shadowpoint** : fond gris foncé, sans écrêter
- **SCNR** : 0, partiel si besoin

  * Trop vert → SCNR partiel.
  * O trop discret → O3 boost.

**Détails, explications et sources**

Méthode

1. Étire les canaux avec le même fond et la même médiane (méthode), puis combine S, H et O en une image RGB selon la palette (ChannelCombination), de préférence **étirée et sans étoiles**.
2. Choisis la palette correspondante (SHO, HOO…).
3. Active l'aperçu en temps réel. Ordre de réglage conseillé (suggestion de la fiche, pas une consigne de l'auteur) : Lightness, Shadowpoint, O3 boost, S2 boost, hautes lumières, Brightness, SCNR en dernier.
4. Pour comprendre un curseur, pousse-le à fond (0 ou maximum), observe, puis reviens à une valeur raisonnable (astuce theAstroShed).
5. Utilise le SCNR intégré si un reste de vert apparaît. Garde le réglage en glissant le triangle du process sur le bureau (icône).

Paramètres

- **Palette** : Celle de ta combinaison : HOO, SHO, HSO ou HOS

- **O3 boost / S2 boost** : 0 par défaut ; monter progressivement jusqu'à l'équilibre voulu

- **Shadowpoint** : Point noir : ajuster le fond sans l'écrêter

- **Highlight reduction** : Atténuer les hautes lumières

- **Brightness** : Luminosité globale

- **Lightness** : Off (défaut), Preserve, H, O ou S : canal qui porte la luminance, souvent H

- **Blend mode / Ha blend** : Mode de mélange du vert, surtout pour les données de caméra couleur

- **SCNR** : 0 par défaut ; partiel, seulement si nécessaire

#### NBColourMapper (Mike Cranfield)
GRATUIT

**À régler :**

- **H** : rouge à orange
- **O** : cyan à bleu
- **S** : rouge profond ou or

**Détails, explications et sources**

Méthode

1. Ajoute chaque image narrowband sans étoiles comme une couche.
2. Assigne une teinte et une saturation à chaque couche, puis règle le mélange avec l'aperçu.

Paramètres

- **H** : Teinte rouge à orange

- **O** : Teinte cyan à bleu

- **S** : Teinte rouge profond ou or selon la palette

- **Nombre de couches** : Illimité : tu peux ajouter d'autres filtres

#### Perfect Palette Picker (SetiAstro)
GRATUIT

**À régler :**

- **Linear Input Data** : coché si tes masters sont linéaires
- **Entrées** : H, O, S sans étoiles
- **Usage** : compare les 16 vignettes, garde la meilleure

**Détails, explications et sources**

Méthode

1. _Script › SetiAstro › Perfect Palette Picker_ (version 1.3).
2. Choisis tes vues H, O et S (masters mono, de préférence sans étoiles), ou jusqu'à deux images couleur dual-band (HaO3 et S2O3).
3. Coche ou décoche _Linear Input Data_ selon l'état de tes images, puis _Create Palettes_ : 16 vignettes s'affichent.
4. Clique sur une vignette pour générer cette palette en pleine taille ; tu peux en générer plusieurs.
5. Garde la meilleure, puis équilibre-la (NarrowbandNormalization, courbes) et vérifie les couleurs SHO.

Paramètres

- **Linear Input Data** : Coché par défaut : chaque canal est étiré à une médiane de 0,25 (point noir à médiane − 2,7 σ), donc avec des niveaux comparables. Décoche si tes images sont déjà étirées

- **Palettes (16)** : 12 correspondances : HOO, HOS, HSO, HSS, OHH, OHS, OSH, OSS, SHH, SHO, SOH, SOO ; plus Realistic1, Realistic2, Foraxx et Dynamic Inverse

- **Canaux manquants** : Sans S, H le remplace (et inversement) ; Dynamic Inverse demande les trois canaux, sinon retour à SHO

- **Caméra couleur** : OSC HaO3 Dual : H = rouge, O = moyenne de G et B ; OSC S2O3 Dual : S = rouge ; l'O des deux images est moyenné

- **Usage** : Explorer les palettes avant de choisir la méthode finale ; le résultat reste à équilibrer

#### PixelMath
**À régler :**

- **Destination** : Create new image
- **Symbols** : déclare les variables
- **Formules** : prêtes dans les icônes du fichier 01

**Détails, explications et sources**

Méthode

1. Écris la formule dans RGB/K (une seule expression) ou canal par canal (décoche Use a single RGB/K expression).
2. Déclare les variables utilisées dans l'onglet Symbols.
3. Destination : Create new image pour garder l'original intact.

Paramètres

- **~x** : 1 − x

- **^** : Puissance

- **$T** : L'image cible

- **Formules prêtes** : Foraxx, réduction d'étoiles, continuum : voir les sections dédiées

### Étoiles
#### Star Stretch (SetiAstro)
GRATUIT

**À régler :**

- **Stretch Amount** : 6 (défaut du script : 5)
- **Color Boost** : 1,3 (défaut du script : 1,0 ; criard → 1,0, pâle → 1,5)
- **Remove Green** : décoché

  * Cœurs d'étoiles blancs (R = G = B = 1 à la sonde) → 5,5.
  * Étoiles trop grosses → 5 ou 4.
  * Étoile verte à la sonde (G au-dessus de R et de B) → coche Remove Green. Pas par défaut : après SPCC, SCNR abaisserait aussi le vert des étoiles jaunes (R 1,0 / G 0,9 / B 0,7 → G 0,85).
  * Petites seulement après réduction → Etoiles_reduites avec S 0,25, ou Etoiles_screen sans réduction ; Halo-B-Gon Extra Low.

**Détails, explications et sources**

Méthode

1. Sur l'image d'étoiles **linéaire** (narrowband) ; glisse l'icône sur l'image. Modifie l'image elle-même : garde une copie.
2. Galaxies : inutile, les étoiles viennent du RGB étiré par MAS (RGB_stars, sortie de SXT_RGB_etire).

Paramètres

- **Stretch Amount** : 6 dans l'icône (5 par défaut, 0 à 8) ; trop haut : cœurs saturés, petites étoiles envahissantes.

- **Color Boost** : 1,0 à 1,3 ; les bleues et cyan gagnent plus que les rouges.

- **Remove Green (SCNR)** : Coché dans l'icône (étoiles teintées cyan-vert).

#### NB to RGB Star Combination (SetiAstro)
GRATUIT

**À régler :**

- **Ha / OIII Stars** : images d'étoiles linéaires
- **Apply Star Stretch** : coché, Stretch Factor 5, Color Boost 1,0
- **Green Blend Ratio** : décoché (0,3 si activé)

  * Étoiles bleues verdâtres → active le ratio et monte-le.

**Détails, explications et sources**

Méthode

1. Combine les images d'étoiles H, O et S en étoiles de couleur naturelle.
2. Utile quand tu n'as pas de poses RGB pour les étoiles.

Paramètres

- **Ha / OIII Stars Image** : Images d'étoiles linéaires issues de SXT (obligatoires)

- **SII Stars Image** : Optionnelle

- **OSC Image** : Alternative pour une caméra couleur avec filtre dual-band

- **Green Channel Blend Ratio** : Décoché par défaut ; Ha to OIII ratio 0,3 si activé

- **Apply Star Stretch** : Recommandé par l'auteur ; Stretch Factor 5, Color Boost 1,0

#### StarReduction et ScreenStars (Mike Cranfield)
GRATUIT

**À régler :**

- **Méthode** : Transfer
- **S** : 0,15

  * Étoiles encore trop grosses → baisse S.

**Détails, explications et sources**

Méthode

1. StarReduction : choisis la méthode (Transfer, Halo, Star) et l'image sans étoiles de référence, règle avec l'aperçu.
2. ScreenStars : recombine l'image sans étoiles et l'image d'étoiles en mode screen.

Paramètres

- **Méthode** : Transfer pour commencer

- **S** : 0,15 ; plus bas = étoiles plus petites

- **Formules équivalentes** : Voir la section Réduction d'étoiles

#### MorphologicalTransformation
**À régler :**

- **Operator** : Morphological Selection
- **Selection** : 0,25
- **Amount** : 0,60
- **Iterations** : 1
- **Élément** : 5×5 circulaire

  * Effet trop fort → Amount 0,50.

**Détails, explications et sources**

Méthode

1. Applique sur l'image d'étoiles seule (ou avec un masque d'étoiles sur l'image complète).

Paramètres

- **Operator** : Morphological Selection

- **Selection** : 0,20 à 0,30 (sous 0,5 = érosion)

- **Amount** : 0,50 à 0,75

- **Iterations** : 1 à 2

- **Structuring element** : 3×3 à 7×7, forme circulaire, selon la taille des étoiles

#### Halo-B-Gon (SetiAstro)
GRATUIT

**À régler :**

- **Select stars-only image** : l'image d'étoiles étirée : RGB_stars (SHO : NBtoRGB_stars ; HOO : HOO_stars), avant Etoiles_screen
- **Reduction Amount** : Low (ou Extra Low)
- **Linear Data** : décoché sur une image étirée

  * Petites étoiles réduites ou effacées aussi → normal (son masque ne protège que les cœurs) : utilise Etoiles_grosses.
  * Pas assez → relance en Low plutôt que Med ou High (Med = 4 courbes, High = 9).
  * Déjà recombiné → Ctrl+Z sur l'image, Halo-B-Gon sur l'image d'étoiles, puis relance Etoiles_screen.

**Détails, explications et sources**

Méthode

1. Sur l'image d'étoiles seule (avant Etoiles_screen) ; modifie l'image elle-même. Un masque protège les cœurs, une courbe assombrit les halos.

Paramètres

- **Reduction Amount** : Low par défaut (1 passe) ; Med = 4 courbes, High = 9 : essaie Extra Low ou Low d'abord.

- **Linear Data** : Coché seulement sur une image d'étoiles encore linéaire.

- **Icône** : Le script ne lit aucun paramètre : réglages dans le dialogue.

#### CorrectMagentaStars
**À régler :**

- **Amount** : 0,8

  * Magenta encore visible → monte vers 1.

**Détails, explications et sources**

Méthode

1. Menu Script › Utilities › CorrectMagentaStars.
2. Applique sur l'image SHO finale, étoiles comprises. Le script inverse l'image, retire le vert avec SCNR (le magenta devient vert une fois inversé), puis la réinverse.

Paramètres

- **Amount** : 0,8 (défaut) ; plage 0 à 1. C'est la force du SCNR appliqué à l'image inversée

### Finition
#### CurvesTransformation
**À régler :**

- **RGB/K** : courbe en S : 0,25 → 0,19 et 0,75 → 0,81
- **S (saturation)** : milieu 0,5 → 0,58 en galaxies (LRGB, LHaRGB ; 0,65 trop saturé, gardé en option Finition_saturee), 0,65 en narrowband
- **Masque** : Masque_L

  * Trop saturé → S à 0,60 ; ternes → 0,72. Pas assez → option Boost_finition.
  * Fond qui sature ou se colore → vérifie le masque.
  * Teinte à corriger (SHO) → canal H, petits déplacements.

**Détails, explications et sources**

Méthode

1. Sur l'image sans étoiles étirée, sous Masque_L. Ordre : contraste (RGB/K), saturation (S), teinte (H) si besoin, par petits déplacements.

Canaux

- **RGB/K** : Courbe en S 0,25 → 0,19, 0,75 → 0,81.

- **S** : Saturation selon la saturation : sature les pixels ternes sans toucher aux autres ; milieu 0,5 → 0,58 en galaxies (0,65 : option Finition_saturee), 0,65 en narrowband.

- **H** : Teinte : en SHO, déplace le vert vers l'or ou règle le cyan.

- **c** : Chroma (utilisé par Boost_final).

#### LocalHistogramEqualization
**À régler :**

- **Icône LHE (passe 1)** : Kernel Radius 150, Amount 0,30
- **Icône LHE_fin (passe 2)** : Kernel Radius 40, Amount 0,25
- **Contrast Limit** : 2,0
- **Histogram Resolution** : 12-bit pour LHE (rayon 150), 10-bit pour LHE_fin (rayon 40)
- **Circular Kernel** : coché
- **Masque** : Masque_L

  * Effet artificiel ou halo sombre autour de la galaxie → 0,20 puis 0,16.
  * Bruit qui ressort → Contrast Limit 1,5.
  * Anneaux autour des objets brillants → Kernel Radius plus grand.
  * Pousser un peu → option Boost_finition_light (courbe très légère, saturation 0,57, LHE rayon 80 à 0,12). Pousser plus → Boost_finition (saturation 0,60, LHE 0,20), qui peut donner des bras cyan et un aspect peint à 1:1.
  * Anneaux ou paliers autour d'un cœur brillant (postérisation) → Histogram Resolution plus haute (déjà 12-bit dans l'icône LHE) ; s'ils restent, essaie sans HDRMT_50.

**Détails, explications et sources**

Méthode

1. Sur l'image sans étoiles étirée, sous masque de luminance (Masque_L) : sans masque, le fond bruité prend du contraste.
2. Deux passes : grand rayon puis petit rayon, Amount faible (LHE s'exagère facilement). Icônes : 150 px puis 40 px.
3. LHE réduit un peu la saturation : reprends-la aux courbes si besoin.

Paramètres

- **Kernel Radius** : Taille des structures renforcées ; 100 à 300 en ciel profond, plus grand à fort échantillonnage.

- **Contrast Limit** : 1,5 à 2,0 ; reste sous 3.

- **Amount** : 0,15 à 0,35 par passe.

- **Histogram Resolution** : 12-bit pour 150 px, 10-bit pour 40 px (anneaux ou paliers : plus haut).

- **Circular Kernel** : Coché.

#### HDRMultiscaleTransform
**À régler :**

- **Number of layers** : 6
- **Iterations** : 1
- **To lightness, Preserve hue, Lightness mask** : cochés
- **Tout le reste** : valeurs de l'icône

  * Pas assez → 2 itérations.
  * Icône des workflows : `Opt_HDRMT_50`, conteneur qui applique HDRMT à 50 % (copie `HDR_avant`, HDRMT, puis 0,5 × résultat + 0,5 × copie ; la copie est fermée automatiquement à la fin).
  * Plus ou moins d'effet → change a (0,5) dans la formule HDR_melange : 0,7 plus fort, 0,3 plus doux. Luminosité et détail du cœur varient en sens inverse : a plus haut = plus de détail, mais cœur plus sombre et plus terne (HDRMT comprime les hautes lumières et ne travaille que la luminosité).
  * Cœur détaillé ET lumineux → `Opt_HDRMT_eclat` : HDRMT à 40 % puis Boost_finition_light (courbe très légère, saturation, LHE doux sous masque) en un glisser ; essayé sur NGC 1532 (cœur laiteux à 0,5, terne à 1).
  * Grandes structures (CDK17) → essaie 7 couches.

**Détails, explications et sources**

Méthode

1. Sur l'image sans étoiles étirée, pour le détail des zones brillantes ; _Lightness mask_ remplace un masque externe.
2. Dans les icônes, mélangé à 30, 40 ou 50 % avec l'original (HDRMT_30/40/50).

Paramètres

- **Number of layers** : 6 (échelles jusqu'à 32 px) ; 7 à essayer en bin 1 au CDK17.

- **Number of iterations** : 1.

- **To lightness, Preserve hue, Lightness mask** : Cochés.

- **Median transform, Deringing** : Décochés ; à essayer contre des anneaux sombres.

#### SCNR
**À régler :**

- **Color to remove** : Green
- **Protection** : Average Neutral
- **Amount** : LRGB 1,0 ; SHO 0,50–0,80

  * HOO → souvent inutile.

**Détails, explications et sources**

Méthode

1. Retire un excès de vert. Rarement utile en LRGB après SPCC, souvent utile en SHO.

Paramètres

- **Color to remove** : Green

- **Protection method** : Average Neutral

- **Amount** : 1,0 (défaut) convient dans la plupart des cas ; 0,50 à 0,80 pour garder un peu de vert en SHO
