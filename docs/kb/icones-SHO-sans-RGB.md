# Icônes du fichier Conteneurs-SHO-sans-RGB.xpsm

Fichier GÉNÉRÉ par `docs/process-icons/build/build.sh` (kb_icons.py) à partir de l'xpsm : ne pas éditer ; pour changer une icône, modifier le générateur (voir `generateur.md`).

Préfixes : `E##_` chemin principal (dans l'ordre), `Opt_` option, `R_` mode rapide, `C_` conteneur. Les icônes `P#_…` sont des repères de colonne.

## P1_Preparation

#### E00_Renommer_auto — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Renommer_auto.js`
   paramètres : `fermerAutocrop=true`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Renommer_auto : renomme les masters mono ouverts L, R, G, B, H, O, S d'après le mot-clé FILTER (Lum, Red, Ha, OIII... ; V ou Vert -> G), sinon d'après le nom du fichier, puis le nom de la vue ; ferme d'abord, sans demander, les vues dont le nom finit par autocrop ou autocrop_c QUAND une autre vue du même filtre est ouverte (doublon) ; une vue autocrop seule pour son filtre est gardée et renommée (fermerAutocrop = true) ; retient aussi le dossier des masters pour Export_TIFF.
> 
> À RÉGLER : une seule fois par ordinateur : copie Renommer_auto.js et clodoweg_objet.jsh dans src/scripts/clodoweg ; ouvre tes masters, puis lance l'icône.
> 
> SI :
> - filtre inconnu ou nom déjà pris -> message dans la console, renomme cette vue à la main
> - vue autocrop à garder -> décoche la case dans la fenêtre (ou fermerAutocrop = false)

#### E01_LinearPatternSubtraction — Script
   script `$PXI_SRCDIR/scripts/clodoweg/LPS_UnClic.js`
   paramètres : `correctColumns=false`, `correctEntireImage=true`, `defectTableFilePath=`, `layersToRemove=9`, `rejectionLimit=3`, `globalRejection=true`, `globalRejectionLimit=5`, `autoBackground=true`, `backgroundReferenceLeft=0`, `backgroundReferenceTop=0`, `backgroundReferenceWidth=512`, `backgroundReferenceHeight=512`, `allOpenImages=true`, `closeWorkingImages=true`, `vues=L,R,G,B`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script LPS_UnClic (moteur de Vicent Peris, sans dialogue) : lignes, Correct the entire image, Layers to remove 9, Rejection limit 3, Global rejection 5, zone de fond choisie automatiquement (la plus sombre), fenêtres de travail fermées ; masters L, R, G, B ouverts corrigés (vues = L,R,G,B ; S, H, O jamais corrigés par défaut, une image couleur non plus).
> 
> À RÉGLER : une seule fois par ordinateur (Mac ou PC) : crée le dossier clodoweg dans src/scripts de PixInsight (à côté de PatternCorrection ; Mac : /Applications/PixInsight/src/scripts/clodoweg, PC : en général C:\Program Files\PixInsight\src\scripts\clodoweg ; pas le dossier scripts du premier niveau) et copies-y LPS_UnClic.js ; ensuite ouvre les masters linéaires de la cible (et rien d'autre), puis glisse l'icône sur l'un d'eux : L, R, G, B sont corrigés (S, H, O laissés tels quels), avant le recadrage (la correction se fait dans les images).
> 
> SI :
> - corriger aussi S, H, O -> vues = L,R,G,B,S,H,O dans l'icône (vide = tous les masters mono)
> - corriger des colonnes -> correctColumns = true dans l'icône
> - une seule image -> allOpenImages = false dans l'icône, puis glisse-la sur l'image
> - artefacts -> Ctrl+Z : le script est conçu pour les brutes, avant alignement
> - script introuvable -> vérifie le dossier scripts/clodoweg (à recopier après une réinstallation de PixInsight) ; version avec dialogue : menu Script › Pattern Correction › LinearPatternSubtraction

#### E02_Solver_auto — Script
   script `$PXI_SRCDIR/scripts/clodoweg/GC_Solver_auto.js`
   paramètres : `gradient=false`, `solve=true`, `solveTout=true`, `defaultDate=2020-01-01T00:00:00`, `metadata_focal=2939`, `metadata_xpixsz=3.76`, `solver_catalogMode=1`, `solver_distortionCorrection=true`, `(+ 42 autres réglages ImageSolver)`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script GC_Solver_auto.js (gradient false, solveTout true) : ImageSolver (date par défaut si absente, réglages du matériel) sur TOUTES les images ouvertes, sans GradientCorrection ; images *_stars ignorées ; une erreur n'arrête pas les autres.
> 
> À RÉGLER : double-clic puis Apply Global, juste après LinearPatternSubtraction, masters ouverts (S, H, O) ; ensuite ImageSolver (phase 2) est inutile, sauf pour une image en erreur dans le bilan de la console ; copie GC_Solver_auto.js dans src/scripts/clodoweg.
> 
> SI :
> - seulement la RGB -> solveTout false
> - une image en erreur -> lis le bilan en fin de console, refais-la avec ImageSolver

### P1_options

#### Opt_Crop_reference — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Crop_commun.js`
   paramètres : `mode=reference`, `nom=Crop_ref`

> OPTION — bandes noires sur les bords (masters décalés) : étape 1 du crop commun, après Renommer_auto, avant Combinaison_RGB
> Image Crop_ref (minimum de toutes les images) et DynamicCrop ouvert.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Crop_commun, mode reference : crée Crop_ref = minimum pixel par pixel de toutes les images ouvertes (= ImageIntegration en Minimum, sans normalisation) ; une bande noire d'UNE image y est noire ; Crop_ref étirée (STF auto) ; DynamicCrop s'ouvre.
> 
> À RÉGLER : masters ouverts, après Renommer_auto, avant Combinaison_RGB (mode rapide : avant R_C_Preparation_rapide) ; double-clic puis Apply Global, OK ; dans DynamicCrop, trace le cadre sur Crop_ref sans bande noire, coche verte ; puis Crop_appliquer ; copie Crop_commun.js dans src/scripts/clodoweg.
> 
> SI :
> - tailles différentes -> décoche l'image d'une autre taille
> - DynamicCrop ne s'ouvre pas -> Process > Geometry > DynamicCrop
> - pas de rotation dans DynamicCrop (angle 0)

#### Opt_Crop_appliquer — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Crop_commun.js`
   paramètres : `mode=appliquer`, `nom=Crop_ref`

> OPTION — étape 2 du crop commun, après le cadre tracé et appliqué sur Crop_ref : même crop sur toutes les images ouvertes.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Crop_commun, mode appliquer : relit le dernier DynamicCrop appliqué à Crop_ref et l'applique à toutes les images ouvertes de même taille, puis ferme Crop_ref.
> 
> À RÉGLER : après le cadre appliqué sur Crop_ref : double-clic puis Apply Global, OK ; ensuite Combinaison_RGB.
> 
> SI :
> - « aucun DynamicCrop » -> applique d'abord le cadre sur Crop_ref (coche verte)
> - cadre à refaire -> Ctrl+Z sur Crop_ref, nouveau cadre, coche verte, puis relance
> - une image n'est pas recadrée -> taille différente, la console la nomme

### P1_rapide

#### R_C_Preparation_rapide — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Renommer_auto.js`
      paramètres : `fermerAutocrop=true`, `dialogue=false`
   2. Script
      script `$PXI_SRCDIR/scripts/clodoweg/LPS_UnClic.js`
      paramètres : `correctColumns=false`, `correctEntireImage=true`, `defectTableFilePath=`, `layersToRemove=9`, `rejectionLimit=3`, `globalRejection=true`, `globalRejectionLimit=5`, `autoBackground=true`, `backgroundReferenceLeft=0`, `backgroundReferenceTop=0`, `backgroundReferenceWidth=512`, `backgroundReferenceHeight=512`, `allOpenImages=true`, `closeWorkingImages=true`, `vues=L,R,G,B`, `dialogue=false`
   3. Script
      script `$PXI_SRCDIR/scripts/clodoweg/GC_Solver_auto.js`
      paramètres : `gradient=false`, `solve=true`, `solveTout=false`, `defaultDate=2020-01-01T00:00:00`, `dialogue=false`, `metadata_focal=2939`, `metadata_xpixsz=3.76`, `solver_catalogMode=1`, `solver_distortionCorrection=true`, `(+ 42 autres réglages ImageSolver)`

> MODE RAPIDE, à la place de LinearPatternSubtraction, Renommer_auto (Combinaison_RGB en RGB + SHO) et Solver_auto : masters seuls ouverts, double-clic puis Apply Global (pas en glissant : ImageSolver échoue sur une image en cours de traitement) ; ImageSolver sur le RGB seulement ; ensuite R_Gradient_auto_rapide (ou la phase 2 avec ImageSolver sur S, H, O : SPFC en a besoin).
> 
> LANCEMENT : masters seuls ouverts, double-clic puis Apply Global (rond bleu) ; pas en glissant (ImageSolver échoue sur une image en cours de traitement).
> 
> PRÉRÉGLÉ : conteneur : Renommer_auto (S, H, O d'après FILTER), LinearPatternSubtraction sur aucun master (S, H, O exclus : vues = L,R,G,B), Solver_auto (ImageSolver sur les images couleur seulement : aucune ici, rien n'en a besoin dans les rapides) ; pas de combinaison (SHO combinée en phase 3, après le gradient).
> 
> À RÉGLER : masters S, H, O seuls ouverts ; double-clic puis Apply Global (pas en glissant) ; remplace LinearPatternSubtraction, Renommer_auto et Solver_auto ; ensuite R_Gradient_auto_rapide, ou la phase 2 du chemin principal (ImageSolver d'abord sur les masters mono : SPFC en a besoin, le rapide ne résout que le RGB).
> 
> SI :
> - une étape en erreur -> lis la console, puis fais les icônes du chemin principal une par une
> - masters décalés, bandes noires -> Crop_reference et Crop_appliquer AVANT ce conteneur

### P1_turbo

#### T_Turbo_debut — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Renommer_auto.js`
      paramètres : `fermerAutocrop=true`, `dialogue=false`
   2. Script
      script `$PXI_SRCDIR/scripts/clodoweg/LPS_UnClic.js`
      paramètres : `correctColumns=false`, `correctEntireImage=true`, `defectTableFilePath=`, `layersToRemove=9`, `rejectionLimit=3`, `globalRejection=true`, `globalRejectionLimit=5`, `autoBackground=true`, `backgroundReferenceLeft=0`, `backgroundReferenceTop=0`, `backgroundReferenceWidth=512`, `backgroundReferenceHeight=512`, `allOpenImages=true`, `closeWorkingImages=true`, `vues=L,R,G,B`, `dialogue=false`
   3. Script
      script `$PXI_SRCDIR/scripts/clodoweg/GC_Solver_auto.js`
      paramètres : `gradient=false`, `solve=true`, `solveTout=false`, `defaultDate=2020-01-01T00:00:00`, `dialogue=false`, `metadata_focal=2939`, `metadata_xpixsz=3.76`, `solver_catalogMode=1`, `solver_distortionCorrection=true`, `(+ 42 autres réglages ImageSolver)`
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Gradient_auto.js`
      paramètres : `dialogue=false`
   5. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Lineaire_auto.js`
      paramètres : `etapes=Combinaison_SHO>H`, `dialogue=false`
   6. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=S, H, O`, `dialogue=false`
   7. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Lineaire_auto.js`
      paramètres : `etapes=C_SHO_lineaire>SHO ; C_Extraction_SHO>SHO ; C_Extraction_etoiles>SHO_stars`, `dialogue=false`
   8. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=SHO`, `dialogue=false`
   9. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Etoiles_NB_auto.js`
      paramètres : `h=H_stars`, `o=O_stars`, `s=S_stars`, `ratio=0.30`, `linearfit=true`, `stretch=6.0`, `boost=1.30`, `scnr=false`, `nom=NBtoRGB_stars`, `fermer=true`, `dialogue=false`

> MODE TURBO, à la place de R_C_Preparation_rapide, R_Gradient_auto_rapide et R_C_Lineaire_rapide (phases 1 à 3) : masters seuls ouverts, Conteneurs du workflow chargé, double-clic puis Apply Global (pas en glissant) ; ensuite Statistical_Stretch sur S, H et O.
> 
> LANCEMENT : masters seuls ouverts, double-clic puis Apply Global (rond bleu) ; pas en glissant (ImageSolver échoue sur une image en cours de traitement).
> 
> PRÉRÉGLÉ : conteneur, en une fois : Renommer_auto, LinearPatternSubtraction, Solver_auto (images couleur seulement : aucune ici, = R_C_Preparation_rapide) ; Gradient_auto (GradientCorrection sur toutes les images, = R_Gradient_auto_rapide) ; Lineaire_auto Combinaison_SHO, masters S, H, O fermés, Lineaire_auto C_SHO_lineaire (BXT, SXT, NXT_NB), C_Extraction_SHO et C_Extraction_etoiles, SHO fermée, Etoiles_NB_auto (= R_C_Lineaire_rapide) ; résultat : S, H, O sans étoiles, linéaires, NBtoRGB_stars (étirée) et SHO_stars.
> 
> À RÉGLER : masters S, H, O seuls ouverts ; Conteneurs-SHO-sans-RGB chargé ; double-clic puis Apply Global (pas en glissant : ImageSolver échoue sur une image en cours de traitement) ; ensuite Statistical_Stretch sur S, H et O.
> 
> SI :
> - une étape échoue -> la console dit laquelle ; lance les icônes R_ une par une pour voir où
> - gradient mal retiré (O, Lune) -> fais plutôt R_C_Preparation_rapide, la phase 2 du chemin principal (MGC + MARS), puis R_C_Lineaire_rapide
> - masters à garder -> enregistre-les AVANT : ils sont fermés sans enregistrer

## P2_Gradient

#### E03_ImageSolver — Script
   script `$PXI_SRCDIR/scripts/clodoweg/ImageSolver_Date.js`
   paramètres : `defaultDate=2020-01-01T00:00:00`, `metadata_focal=2939`, `metadata_xpixsz=3.76`, `solver_catalogMode=1`, `solver_distortionCorrection=true`, `(+ 42 autres réglages ImageSolver)`

> LANCEMENT : glisse l'icône sur l'image.
> 
> PRÉRÉGLÉ : script ImageSolver_Date.js en une seule icône (pas de conteneur) : date d'observation 2020-01-01 ajoutée seulement si l'image n'en a pas, puis ImageSolver 6.4.2 lancé avec focale 2 939 mm, pixel 3,76 µm (0,264″/px), catalogue EN LIGNE Gaia DR2 (VizieR, connexion internet), magnitude limite fixe 15, correction de distorsion ; coordonnées et vraie date lues dans l'image.
> 
> À RÉGLER : seulement si Solver_auto (phase 1) a échoué sur une image (bilan de la console) : glisse l'icône sur cette image, avant SPFC.
> 
> SI :
> - la date est ajoutée mais ImageSolver ne se lance pas -> glisse l'icône ImageSolver_seul (options) sur la même image
> - échec sans coordonnées dans l'en-tête -> lance ImageSolver depuis le menu Script et utilise Search (nom de l'objet)
> - master en bin 2 -> metadata_xpixsz = 7.52 et metadata_resolution = 0.0001466 dans solverParams
> - trop peu d'étoiles (log : Catalog ... objects sous 300) -> solver_magnitude = 16
> - pas d'internet ou VizieR en panne -> catalogue local Gaia DR3 (XPSD) dans la fenêtre, seulement si la base locale est complète

#### E04_SPFC_H — SpectrophotometricFluxCalibration
   narrowbandMode=true ; grayFilterTrCurve=300,0.000,302,0.000,304,0.000,306,0.000,308,0.000,310,0.000,312,0.000,314,0.0… ; grayFilterName=Antlia V Pro Series L (approx. 420-715 nm) ; redFilterTrCurve=594,0,596,0.001,598,0.001,600,0.002,602,0.003,604,0.004,606,0.005,608,0.006,6… ; redFilterName=Antlia V Pro Series R ; greenFilterTrCurve=480,0.001,482,0.004,484,0.009,486,0.018,488,0.053,490,0.151,492,0.357,494,0.6… ; greenFilterName=Antlia V Pro Series G ; blueFilterTrCurve=420,0.002,422,0.006,424,0.021,426,0.088,428,0.237,430,0.418,432,0.611,434,0.7… ; blueFilterName=Antlia V Pro Series B ; grayFilterWavelength=656.3 ; grayFilterBandwidth=3.0 ; redFilterWavelength=656.3 ; redFilterBandwidth=3.0 ; greenFilterWavelength=500.7 ; greenFilterBandwidth=3.0 ; blueFilterWavelength=500.7 ; blueFilterBandwidth=3.0 ; deviceQECurve=402,0.7219,404,0.7367,406,0.75,408,0.7618,410,0.7751,412,0.787,414,0.7944,416… ; deviceQECurveName=Sony IMX411/455/461/533/571 ; broadbandIntegrationStepSize=0.50 ; narrowbandIntegrationSteps=10 ; rejectionLimit=0.30 ; catalogId=GaiaDR3SP ; minMagnitude=0.00 ; limitMagnitude=12.00 ; autoLimitMagnitude=true ; psfStructureLayers=5 ; saturationThreshold=0.75 ; saturationRelative=true ; saturationShrinkFactor=0.10 ; psfNoiseLayers=1 ; psfHotPixelFilterRadius=1 ; psfNoiseReductionFilterRadius=0 ; psfMinStructureSize=0 ; psfMinSNR=40.00 ; psfAllowClusteredSources=false ; psfType=PSFType_Auto ; psfGrowth=1.75 ; psfMaxStars=24576 ; psfSearchTolerance=4.00 ; generateGraphs=false ; generateStarMaps=false ; generateTextFiles=false

> PRÉRÉGLÉ : QE IMX455, Narrowband 656,3 nm, 3 nm.
> 
> À RÉGLER : rien ; applique sur le master H, puis MGC_MARS_H.

#### E05_SPFC_O — SpectrophotometricFluxCalibration
   narrowbandMode=true ; grayFilterTrCurve=300,0.000,302,0.000,304,0.000,306,0.000,308,0.000,310,0.000,312,0.000,314,0.0… ; grayFilterName=Antlia V Pro Series L (approx. 420-715 nm) ; redFilterTrCurve=594,0,596,0.001,598,0.001,600,0.002,602,0.003,604,0.004,606,0.005,608,0.006,6… ; redFilterName=Antlia V Pro Series R ; greenFilterTrCurve=480,0.001,482,0.004,484,0.009,486,0.018,488,0.053,490,0.151,492,0.357,494,0.6… ; greenFilterName=Antlia V Pro Series G ; blueFilterTrCurve=420,0.002,422,0.006,424,0.021,426,0.088,428,0.237,430,0.418,432,0.611,434,0.7… ; blueFilterName=Antlia V Pro Series B ; grayFilterWavelength=500.7 ; grayFilterBandwidth=3.0 ; redFilterWavelength=656.3 ; redFilterBandwidth=3.0 ; greenFilterWavelength=500.7 ; greenFilterBandwidth=3.0 ; blueFilterWavelength=500.7 ; blueFilterBandwidth=3.0 ; deviceQECurve=402,0.7219,404,0.7367,406,0.75,408,0.7618,410,0.7751,412,0.787,414,0.7944,416… ; deviceQECurveName=Sony IMX411/455/461/533/571 ; broadbandIntegrationStepSize=0.50 ; narrowbandIntegrationSteps=10 ; rejectionLimit=0.30 ; catalogId=GaiaDR3SP ; minMagnitude=0.00 ; limitMagnitude=12.00 ; autoLimitMagnitude=true ; psfStructureLayers=5 ; saturationThreshold=0.75 ; saturationRelative=true ; saturationShrinkFactor=0.10 ; psfNoiseLayers=1 ; psfHotPixelFilterRadius=1 ; psfNoiseReductionFilterRadius=0 ; psfMinStructureSize=0 ; psfMinSNR=40.00 ; psfAllowClusteredSources=false ; psfType=PSFType_Auto ; psfGrowth=1.75 ; psfMaxStars=24576 ; psfSearchTolerance=4.00 ; generateGraphs=false ; generateStarMaps=false ; generateTextFiles=false

> PRÉRÉGLÉ : QE IMX455, Narrowband 500,7 nm, 3 nm.
> 
> À RÉGLER : rien ; applique sur le master O, puis MGC_MARS_O.

#### E06_MGC_MARS_H — MultiscaleGradientCorrection
   command= ; useMARSDatabase=true ; grayMARSFilter=Ha ; redMARSFilter=R ; greenMARSFilter=G ; blueMARSFilter=B ; referenceImageId= ; gradientScale=1024 ; structureSeparation=3 ; modelSmoothness=1.00 ; minFieldRatio=0.017 ; maxFieldRatio=0.167 ; enforceFieldLimits=true ; scaleFactorRK=1.00 ; scaleFactorG=1.00 ; scaleFactorB=1.00 ; showGradientModel=true

> PRÉRÉGLÉ : comme MGC_MARS, filtre MARS Gray = Ha.
> 
> À RÉGLER : une seule fois par ordinateur : ouvre l'icône, section MARS Database, clique Default Files (copie la liste des préférences de MGC), puis glisse le triangle sur l'icône pour la remplacer et enregistre tes icônes (Save Process Icons) ; à refaire si tu recharges les icônes de la fiche ; ensuite après SPFC_H, sur le master H.
> 
> SI :
> - cible au sud au-delà de −15° environ (et narrowband au-delà de +75°) -> pas de référence MARS : GradientCorrection ou DBE
> - gradient restant -> Gradient scale 512 puis 256

#### E07_MGC_MARS_O — MultiscaleGradientCorrection
   command= ; useMARSDatabase=true ; grayMARSFilter=OIII ; redMARSFilter=R ; greenMARSFilter=G ; blueMARSFilter=B ; referenceImageId= ; gradientScale=1024 ; structureSeparation=3 ; modelSmoothness=1.00 ; minFieldRatio=0.017 ; maxFieldRatio=0.167 ; enforceFieldLimits=true ; scaleFactorRK=1.00 ; scaleFactorG=1.00 ; scaleFactorB=1.00 ; showGradientModel=true

> PRÉRÉGLÉ : comme MGC_MARS, filtre MARS Gray = OIII.
> 
> À RÉGLER : une seule fois par ordinateur : ouvre l'icône, section MARS Database, clique Default Files (copie la liste des préférences de MGC), puis glisse le triangle sur l'icône pour la remplacer et enregistre tes icônes (Save Process Icons) ; à refaire si tu recharges les icônes de la fiche ; ensuite après SPFC_O, sur le master O.
> 
> SI :
> - cible au sud au-delà de −15° environ (et narrowband au-delà de +75°) -> pas de référence MARS : GradientCorrection ou DBE
> - gradient restant -> Gradient scale 512 puis 256

#### E08_GradientCorrection — GradientCorrection
   reference=0.50 ; lowThreshold=0.20 ; lowTolerance=0.50 ; highThreshold=0.05 ; highTolerance=0.00 ; iterations=15 ; scale=5.00 ; smoothness=0.60 ; downsamplingFactor=16 ; protection=true ; protectionThreshold=0.10 ; protectionAmount=0.50 ; protectionSmoothingFactor=16 ; lowClippingLevel=0.000076 ; automaticConvergence=true ; convergenceLimit=0.00001000 ; maxIterations=10 ; useSimplification=false ; simplificationDegree=1 ; simplificationScale=1024 ; generateSimpleModel=false ; generateGradientModel=false ; generateProtectionMasks=false ; gridSamplingDelta=16

> PRÉRÉGLÉ : valeurs par défaut, Structure protection activée.
> 
> À RÉGLER : rien ; contrôle le modèle de gradient.
> 
> SI :
> - gradient dans les coins -> baisse Gradient scale
> - nébuleuse assombrie -> monte Protection amount

### P2_options

#### Opt_ImageSolver_seul — Script
   script `$PXI_SRCDIR/scripts/ImageSolver/ImageSolver.js`
   paramètres : `metadata_focal=2939`, `metadata_xpixsz=3.76`, `solver_catalogMode=1`, `solver_distortionCorrection=true`, `(+ 42 autres réglages ImageSolver)`

> OPTION — secours : ImageSolver seul, si l'icône ImageSolver (date + ImageSolver) s'arrête après la date.
> 
> PRÉRÉGLÉ : ImageSolver 6.4.2 seul (mêmes réglages que l'icône ImageSolver, sans l'ajout de date).
> 
> À RÉGLER : secours : glisse sur l'image si l'icône ImageSolver s'arrête après la date.
> 
> SI :
> - icône bloquée après une mise à jour d'ImageSolver -> efface son champ MD5

#### Opt_SPFC_S — SpectrophotometricFluxCalibration
   narrowbandMode=true ; grayFilterTrCurve=300,0.000,302,0.000,304,0.000,306,0.000,308,0.000,310,0.000,312,0.000,314,0.0… ; grayFilterName=Antlia V Pro Series L (approx. 420-715 nm) ; redFilterTrCurve=594,0,596,0.001,598,0.001,600,0.002,602,0.003,604,0.004,606,0.005,608,0.006,6… ; redFilterName=Antlia V Pro Series R ; greenFilterTrCurve=480,0.001,482,0.004,484,0.009,486,0.018,488,0.053,490,0.151,492,0.357,494,0.6… ; greenFilterName=Antlia V Pro Series G ; blueFilterTrCurve=420,0.002,422,0.006,424,0.021,426,0.088,428,0.237,430,0.418,432,0.611,434,0.7… ; blueFilterName=Antlia V Pro Series B ; grayFilterWavelength=672.4 ; grayFilterBandwidth=3.0 ; redFilterWavelength=656.3 ; redFilterBandwidth=3.0 ; greenFilterWavelength=500.7 ; greenFilterBandwidth=3.0 ; blueFilterWavelength=500.7 ; blueFilterBandwidth=3.0 ; deviceQECurve=402,0.7219,404,0.7367,406,0.75,408,0.7618,410,0.7751,412,0.787,414,0.7944,416… ; deviceQECurveName=Sony IMX411/455/461/533/571 ; broadbandIntegrationStepSize=0.50 ; narrowbandIntegrationSteps=10 ; rejectionLimit=0.30 ; catalogId=GaiaDR3SP ; minMagnitude=0.00 ; limitMagnitude=12.00 ; autoLimitMagnitude=true ; psfStructureLayers=5 ; saturationThreshold=0.75 ; saturationRelative=true ; saturationShrinkFactor=0.10 ; psfNoiseLayers=1 ; psfHotPixelFilterRadius=1 ; psfNoiseReductionFilterRadius=0 ; psfMinStructureSize=0 ; psfMinSNR=40.00 ; psfAllowClusteredSources=false ; psfType=PSFType_Auto ; psfGrowth=1.75 ; psfMaxStars=24576 ; psfSearchTolerance=4.00 ; generateGraphs=false ; generateStarMaps=false ; generateTextFiles=false

> OPTION — seulement si ta base MARS couvre S (pas le cas de DR2).
> 
> PRÉRÉGLÉ : QE IMX455, Narrowband 672,4 nm, 3 nm.
> 
> À RÉGLER : rien ; S n'est pas dans MARS : utilise plutôt GradientCorrection ou DBE.

#### Opt_MGC_MARS — MultiscaleGradientCorrection
   command= ; useMARSDatabase=true ; grayMARSFilter=L ; redMARSFilter=R ; greenMARSFilter=G ; blueMARSFilter=B ; referenceImageId= ; gradientScale=1024 ; structureSeparation=3 ; modelSmoothness=1.00 ; minFieldRatio=0.017 ; maxFieldRatio=0.167 ; enforceFieldLimits=true ; scaleFactorRK=1.00 ; scaleFactorG=1.00 ; scaleFactorB=1.00 ; showGradientModel=true

> OPTION — image RGB (étoiles du workflow RGB + SHO) ou master L.
> 
> PRÉRÉGLÉ : Gradient scale 1024, Structure separation 3, Smoothness 1,0, MARS Gray = L et R, G, B (la même icône sert pour L et pour l'image RGB), modèle affiché.
> 
> À RÉGLER : une seule fois par ordinateur : ouvre l'icône, section MARS Database, clique Default Files (copie la liste des préférences de MGC), puis glisse le triangle sur l'icône pour la remplacer et enregistre tes icônes (Save Process Icons) ; à refaire si tu recharges les icônes de la fiche ; ensuite après SPFC, sur l'image linéaire.
> 
> SI :
> - erreur « No MARS database files have been selected » -> Default Files dans la section MARS Database
> - « 0 reference image(s) available » ou « No reference data found » -> cible hors de MARS (sud au-delà de −15° environ) : GradientCorrection ou DBE à la place de SPFC + MGC
> - gradient restant dans les coins -> Gradient scale 512 puis 256
> - modèle qui ondule -> Smoothness 3 à 5
> - image couleur -> filtres MARS R, G, B

#### Opt_DBE — DynamicBackgroundExtraction
   derivativeOrder=2 ; smoothing=0.250 ; ignoreWeights=false ; modelId= ; modelWidth=0 ; modelHeight=0 ; downsample=2 ; modelSampleFormat=f32 ; targetCorrection=Subtract ; normalize=true ; discardModel=true ; replaceTarget=true ; correctedImageId= ; correctedImageSampleFormat=SameAsTarget ; imageWidth=0 ; imageHeight=0 ; symmetryCenterX=0.500000 ; symmetryCenterY=0.500000 ; tolerance=0.500 ; shadowsRelaxation=3.000 ; minSampleFraction=0.050 ; defaultSampleRadius=15 ; samplesPerRow=15

> ALTERNATIVE — DBE.
> 
> PRÉRÉGLÉ : 15 points par ligne, rayon 15, Tolerance 0,5, Smoothing 0,25, Subtraction.
> 
> À RÉGLER : Generate, retire les points sur l'objet, ajoute-en dans le fond vide.
> 
> SI :
> - points rouges -> Tolerance 1,0 à 1,5
> - vignettage -> Division

#### Opt_LinearFit_ref_H — LinearFit
   referenceViewId=H ; rejectLow=0.000000 ; rejectHigh=0.920000

> OPTION — fonds très différents entre H, O et S (conseillé avec Foraxx).
> 
> PRÉRÉGLÉ : référence = vue H.
> 
> À RÉGLER : applique sur O puis sur S.

### P2_rapide

#### R_Gradient_auto_rapide — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Gradient_auto.js`

> MODE RAPIDE, à la place de toute la phase 2 (ImageSolver, SPFC, MGC + MARS, GradientCorrection) : GradientCorrection sur TOUTES les images ouvertes, après R_C_Preparation_rapide (astrométrie déjà faite) ; ensuite la phase 3 du chemin principal (Combinaison).
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Gradient_auto.js : GradientCorrection (sans modèle de gradient) sur TOUTES les images ouvertes (masters narrowband ; RGB aussi en RGB + SHO), rien d'autre ; pas de SPFC ni de MGC + MARS ; images *_stars ignorées ; une erreur n'arrête pas les autres.
> 
> À RÉGLER : double-clic puis Apply Global, masters ouverts, après R_C_Preparation_rapide (astrométrie déjà faite) ; remplace toute la phase 2 ; ensuite Combinaison_SHO (ou Combinaison_HOO) en phase 3 ; copie Gradient_auto.js dans src/scripts/clodoweg.
> 
> SI :
> - O (ou un autre canal) garde un gradient, Lune -> Ctrl+Z, puis chemin principal de la phase 2 (SPFC, MGC + MARS) pour ce master
> - nébuleuse assombrie -> Ctrl+Z, GradientCorrection à la main avec Protection amount plus haut
> - nébuleuse qui remplit le champ -> chemin principal (MGC + MARS) ou DBE

## P3_Lineaire

#### E09_Combinaison_SHO — PixelMath
   expression = `S` ; expression1 = `H` ; expression2 = `O` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=SHO ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=RGB ; newImageSampleFormat=SameAsTarget

> PRÉRÉGLÉ : R = S, G = H, B = O, image 'SHO'.
> 
> À RÉGLER : nomme tes masters S, H et O.

#### E10_C_SHO_lineaire — ProcessContainer
   1. BlurXTerminator
      ml_version=0 ; correct_only=false ; sharpen_stars=0.25 ; adjust_star_halos=0.00 ; nonstellar_diameter=0.0 ; auto_nonstellar_psf=true ; sharpen_nonstellar=0.60 ; lunar_planetary=false ; overlap=0.20
   2. StarXTerminator
      ml_version=0 ; output_stars=true ; unscreen=false ; remove_stars=true ; remove_spikes=true ; remove_aureoles=true ; remove_reflections=true ; overlap=0.20
   3. NoiseXTerminator
      ml_version=0 ; denoise=0.75 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> CONTENEUR : BXT_NB, SXT_lineaire, NXT_NB.
> 
> SUR : l'image SHO combinée, linéaire : BXT, SXT (étoiles à part), puis NXT sur l'image sans étoiles.
> 
> Double-clic sur le conteneur pour voir ou changer les réglages de chaque étape.

#### E11_C_Extraction_SHO — ProcessContainer
   1. PixelMath
      expression = `$T[0]` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=S ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=Gray ; newImageSampleFormat=SameAsTarget
   2. PixelMath
      expression = `$T[1]` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=H ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=Gray ; newImageSampleFormat=SameAsTarget
   3. PixelMath
      expression = `$T[2]` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=O ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=Gray ; newImageSampleFormat=SameAsTarget

> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> CONTENEUR : Extraire_S, Extraire_H, Extraire_O.
> 
> SUR : l'image SHO sans étoiles.
> 
> Double-clic sur le conteneur pour voir ou changer les réglages de chaque étape.

#### E12_C_Extraction_etoiles — ProcessContainer
   1. PixelMath
      expression = `$T[0]` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=S_stars ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=Gray ; newImageSampleFormat=SameAsTarget
   2. PixelMath
      expression = `$T[1]` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=H_stars ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=Gray ; newImageSampleFormat=SameAsTarget
   3. PixelMath
      expression = `$T[2]` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=O_stars ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=Gray ; newImageSampleFormat=SameAsTarget

> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> CONTENEUR : Extraire_S_stars, Extraire_H_stars, Extraire_O_stars.
> 
> SUR : l'image d'étoiles SHO, linéaire.
> 
> Double-clic sur le conteneur pour voir ou changer les réglages de chaque étape.

#### E13_Etoiles_NB_auto — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Etoiles_NB_auto.js`
   paramètres : `h=H_stars`, `o=O_stars`, `s=S_stars`, `ratio=0.30`, `linearfit=true`, `stretch=6.0`, `boost=1.30`, `scnr=false`, `nom=NBtoRGB_stars`, `fermer=true`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Etoiles_NB_auto : LinearFit d'O_stars et S_stars sur H_stars ; mélange NB to RGB (R = 0,5·H + 0,5·S, G = 0,3·H + 0,7·O, B = O) dans NBtoRGB_stars ; étirement Star Stretch 6 ; Color Boost 1,3 ; H_stars, O_stars, S_stars fermées.
> 
> À RÉGLER : phase 3, juste après C_Extraction_etoiles (étoiles linéaires S_stars, H_stars, O_stars) : double-clic puis Apply Global (fenêtre), ou glisse l'icône sur n'importe quelle image ; aussi fait par R_C_Lineaire_rapide et T_Turbo_debut ; NBtoRGB_stars sert en phase 7 (Etoiles_screen) ; copie Etoiles_NB_auto.js dans src/scripts/clodoweg.
> 
> SI :
> - étoiles trop saturées ou criardes -> Color Boost 1,0
> - étoiles trop grosses ou cœurs blancs -> étirement 5
> - étoiles encore trop bleues -> ratio 0,4 à 0,5
> - reste de vert -> SCNR vert coché ou SCNR_etoiles_vert

### P3_options

#### Opt_SCNR_etoiles_vert — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Etoiles_auto.js`
   paramètres : `vue=NBtoRGB_stars`, `amount=0`, `satAmount=0`, `scnr=true`, `violet=false`

> OPTION — étoiles vertes : sur NBtoRGB_stars étirée (SHO sans RGB) ou RGB_stars, avant Etoiles_screen
> Glisse sur n'importe quelle image.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Etoiles_auto réglé SCNR seul : SCNR vert, Amount 1,0, Average Neutral, Preserve lightness, sur NBtoRGB_stars (amount 0 = pas d'étirement, satAmount 0 = pas de saturation).
> 
> À RÉGLER : option : glisse sur n'importe quelle image (traite toujours NBtoRGB_stars), phase 3, juste après Etoiles_NB_auto (NBtoRGB_stars déjà étirée) : vert retiré des étoiles ; options ensuite : SCNR_etoiles_violet, Saturation_grosses.
> 
> SI :
> - étoiles grisées ou magenta -> Ctrl+Z, ou double-clic : décoche SCNR
> - autre nom d'étoiles (Stars_HOO, SHO_stars) -> vue = ce nom dans l'icône

#### Opt_SCNR_etoiles_violet — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Etoiles_auto.js`
   paramètres : `vue=NBtoRGB_stars`, `amount=0`, `satAmount=0`, `scnr=false`, `violet=true`

> OPTION — étoiles violettes (R et B nettement au-dessus de G à la sonde) : après SCNR_etoiles_vert, glisse sur n'importe quelle image
> Invert, SCNR vert 1,0, Invert
> Pas dans le rapide.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Etoiles_auto réglé violet seul : Invert, SCNR vert (Amount 1,0, Average Neutral, Preserve lightness), Invert sur NBtoRGB_stars : le magenta (violet) des étoiles retiré.
> 
> À RÉGLER : option, phase 3, après Etoiles_NB_auto (et SCNR_etoiles_vert) : glisse sur n'importe quelle image (traite toujours NBtoRGB_stars) ; à vérifier à la sonde : utile si R et B nettement au-dessus de G sur les étoiles.
> 
> SI :
> - étoiles bleues devenues trop vertes ou ternes -> Ctrl+Z
> - autre nom d'étoiles -> vue = ce nom dans l'icône

#### Opt_Saturation_grosses — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Saturation_grosses.js`
   paramètres : `vue=NBtoRGB_stars`, `taille=7`, `seuil=0.15`, `etendue=12`, `passes=1`

> OPTION — grosses étoiles presque blanches, petites assez colorées : glisse sur n'importe quelle image après les SCNR
> Seules les grosses étoiles et leur halo sont saturés
> Pas dans le rapide.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Saturation_grosses sur la vue NBtoRGB_stars : masque des grosses étoiles (ouverture morphologique, disque de 7 px sur une copie à 2000 px, au-dessus de 0,15, étendu au halo, flou 12 px) ; sous ce masque, ta courbe de saturation (CurvesTransformation, c : 0,46 -> 0,54 et S : 0,46 -> 0,54, Akima), 1 passe ; petites étoiles intactes.
> 
> À RÉGLER : option : glisse sur n'importe quelle image (traite toujours NBtoRGB_stars), phase 3, après Etoiles_NB_auto et les SCNR ; pour régler à l'œil : double-clic puis Apply Global, « Voir le masque », puis Appliquer.
> 
> SI :
> - pas assez saturé -> passes 2
> - moyennes étoiles saturées aussi -> taille 9 ou 11
> - certaines grosses pas saturées -> taille 5, ou seuil 0,10
> - halo pas saturé jusqu'au bord -> etendue 16
> - pour recommencer -> Ctrl+Z sur RGB_stars

#### Opt_STF — ScreenTransferFunction
   interaction=SeparateChannels ; table STF (4 lignes)

> OPTION — n'importe quand : double-clic pour ouvrir la fenêtre ScreenTransferFunction (bouton A = auto-étirement de l'affichage, Reset pour revenir), pixels inchangés.
> 
> PRÉRÉGLÉ : process ScreenTransferFunction (STF), réglage neutre ; affichage seulement, les pixels ne changent pas.
> 
> À RÉGLER : double-clic sur l'icône : la fenêtre STF s'ouvre ; choisis l'image, puis A (Auto Stretch) ; lien R/G/B : bouton chaîne.
> 
> SI :
> - revenir à l'image brute -> Reset de la fenêtre STF (ou F12)
> - dominante de couleur à l'écran -> décoche le lien R/G/B (chaîne), puis A

### P3_rapide

#### R_C_Lineaire_rapide — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Lineaire_auto.js`
      paramètres : `etapes=Combinaison_SHO>H`, `dialogue=false`
   2. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=S, H, O`, `dialogue=false`
   3. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Lineaire_auto.js`
      paramètres : `etapes=C_SHO_lineaire>SHO ; C_Extraction_SHO>SHO ; C_Extraction_etoiles>SHO_stars`, `dialogue=false`
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=SHO`, `dialogue=false`
   5. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Etoiles_NB_auto.js`
      paramètres : `h=H_stars`, `o=O_stars`, `s=S_stars`, `ratio=0.30`, `linearfit=true`, `stretch=6.0`, `boost=1.30`, `scnr=false`, `nom=NBtoRGB_stars`, `fermer=true`, `dialogue=false`

> MODE RAPIDE, à la place de toute la phase 3 (combinaison, conteneur linéaire, extraction) : après R_Gradient_auto_rapide, double-clic puis Apply Global (pas en glissant) ; Conteneurs du workflow chargé ; ensuite Statistical_Stretch sur S, H et O.
> 
> LANCEMENT : double-clic puis Apply Global (rond bleu) ; pas en glissant (les scripts du conteneur choisissent eux-mêmes leurs vues).
> 
> PRÉRÉGLÉ : conteneur de scripts : Lineaire_auto lance Combinaison_SHO (crée SHO) ; Fermer_vues ferme les masters S, H, O ; Lineaire_auto lance C_SHO_lineaire sur SHO (BXT_NB, SXT_lineaire qui crée SHO_stars, NXT_NB 0,75), C_Extraction_SHO sur SHO (crée S, H, O sans étoiles) et C_Extraction_etoiles sur SHO_stars (crée S_stars, H_stars, O_stars) ; Fermer_vues ferme SHO ; Etoiles_NB_auto (LinearFit sur H_stars, mélange NB to RGB, étirement 6, Color Boost 1,3) crée NBtoRGB_stars et ferme S_stars, H_stars, O_stars ; SHO_stars gardée.
> 
> À RÉGLER : après R_Gradient_auto_rapide (ou la phase 2), double-clic puis Apply Global (pas en glissant) ; le fichier Conteneurs du workflow doit être chargé (icônes E## lancées par Lineaire_auto) ; les masters sont FERMÉS sans enregistrer : enregistre-les avant si tu veux les garder ; ensuite Statistical_Stretch sur S, H et O.
> 
> SI :
> - une étape en erreur -> la console dit laquelle ; fais la suite au chemin principal à partir de cette icône
> - BXT, SXT ou NXT à changer -> double-clic sur le conteneur linéaire du chemin principal (c'est lui qui est lancé)

## P4_Etirement

#### E14_Statistical_Stretch — Script
   script `$PXI_SRCDIR/scripts/statisticalstretch.js`
   paramètres : `targetMedian=0.25`, `curvesBoost=0`, `numIterations=1`, `normalizeImageRange=false`, `linkedStretch=true`, `openDialogbox=true`, `autoConvergence=false`, `blackpointSigma=5`, `noBlackClip=false`, `hdrCompress=false`, `hdrAmount=0.25`, `hdrKnee=0.35`, `lumaOnly=false`, `lumaMode=rec709`, `lumaBlend=0.6`

> LANCEMENT : glisse l'icône sur l'image. Si l'icône est bloquée après une mise à jour du script, efface son champ MD5.
> 
> PRÉRÉGLÉ : Target Median 0,25, Blackpoint Sigma 5, Linked coché, reste par défaut.
> 
> À RÉGLER : CHEMIN PRINCIPAL (à la place des GHS) : glisse sur S, puis H, puis O, linéaires SANS étoiles ; même Target Median pour les trois (médianes identiques) ; ensuite GHS_2_contraste sur chaque canal, puis la palette (SHO_simple, NBN_SHO).
> 
> SI :
> - fond trop clair après la palette -> GHS_3_fond (option) sur chaque canal avant SHO_simple (SP = HP = 0,22)
> - fond trop sombre, signal faible perdu -> Blackpoint Sigma plus bas (3)
> - étirement à la main voulu -> option GHS_1_premier à la place

#### E15_GHS_2_contraste — GeneralizedHyperbolicStretch
   stretchType=ST_GeneralisedHyperbolic ; stretchChannel=SC_RGB ; inverse=false ; stretchFactor=1.000 ; localIntensity=4.000 ; symmetryPoint=0.350000 ; highlightProtection=0.900000 ; shadowProtection=0.000000 ; blackPoint=0.000000 ; whitePoint=1.000000 ; colourBlend=1.000 ; clipType=CT_RGBBlend ; useRGBWorkingSpace=false

> PRÉRÉGLÉ : b = 4, HP 0,9, Stretch factor 1, SP 0,35.
> 
> À RÉGLER : glisse sur S, puis H, puis O, après Statistical_Stretch (ou GHS_1_premier) : SP = valeur de ta zone plate, au-dessus du fond (souvent 0,30–0,45 ; jamais 0,25 = le fond) ; Stretch factor 1 à 2 ; même réglage pour les trois ; puis la palette (GHS_3_fond en option si le fond est trop clair).
> 
> SI :
> - cœur brillant qui sature -> baisse HP vers sa valeur
> - fond trop sombre -> monte LP vers sa valeur (pas au-dessus de SP)
> - fond bruité qui ressort -> SP trop bas

### P4_options

#### Opt_GHS_1_premier — GeneralizedHyperbolicStretch
   stretchType=ST_GeneralisedHyperbolic ; stretchChannel=SC_RGB ; inverse=false ; stretchFactor=0.000 ; localIntensity=10.000 ; symmetryPoint=0.000000 ; highlightProtection=1.000000 ; shadowProtection=0.000000 ; blackPoint=0.000000 ; whitePoint=1.000000 ; colourBlend=1.000 ; clipType=CT_RGBBlend ; useRGBWorkingSpace=false

> OPTION — à la place de Statistical_Stretch : étirement à la main de chaque canal sans étoiles, H d'abord, puis O et S jusqu'au même fond
> Ensuite GHS_2_contraste et GHS_3_fond.
> 
> PRÉRÉGLÉ : b = 10, Stretch factor 0 (aucun effet tant que tu ne le montes pas).
> 
> À RÉGLER : à la place de Statistical_Stretch : étire H d'abord (pic à 0,25 ; Stretch factor 3,5 à 6,5 selon le fond lu), puis O et S jusqu'au MÊME fond (Stretch factor plus élevé) ; puis GHS_2_contraste.
> 
> SI :
> - bruit de O ou S qui ressort -> SP trop bas, remonte-le

#### Opt_GHS_3_fond — GeneralizedHyperbolicStretch
   stretchType=ST_GeneralisedHyperbolic ; stretchChannel=SC_RGB ; inverse=false ; stretchFactor=1.000 ; localIntensity=10.000 ; symmetryPoint=0.200000 ; highlightProtection=0.200000 ; shadowProtection=0.000000 ; blackPoint=0.000000 ; whitePoint=1.000000 ; colourBlend=1.000 ; clipType=CT_RGBBlend ; useRGBWorkingSpace=false

> OPTION — fond trop clair après Statistical_Stretch (0,25) ou les GHS : sur chaque canal, même SP = HP pour tous (0,22 après Statistical Stretch), fond vers 0,12–0,14, avant la palette.
> 
> PRÉRÉGLÉ : b = 10, SP = HP = 0,20, Stretch factor 1 (fond à 0,23 après GHS_2).
> 
> À RÉGLER : glisse sur chaque canal, avant la palette ; SP = HP = fond lu - 0,03 (0,22 après Statistical Stretch à 0,25) ; Stretch factor 0,8 à 1,2 jusqu'au fond vers 0,12–0,14.

#### Opt_MAS_light — MultiscaleAdaptiveStretch
   aggressiveness=0.15 ; targetBackground=0.150 ; dynamicRangeCompression=0.40 ; contrastRecovery=true ; scaleSeparation=1024 ; contrastRecoveryIntensity=1.000 ; previewLargeScale=false ; saturationEnabled=true ; saturationAmount=0.50 ; saturationBoost=0.50 ; saturationLightnessMask=true ; backgroundROIEnabled=false ; backgroundROIX0=0 ; backgroundROIY0=0 ; backgroundROIWidth=0 ; backgroundROIHeight=0

> OPTION — étirement plus doux que MAS (Aggressiveness 0,15, saturation 0,50) : à la place de MAS sur le RGB (RGB + SHO, fin de phase 3), ou de MAS_canaux / de Statistical_Stretch sur chaque canal sans étoiles
> Glisse sur l'image linéaire.
> 
> PRÉRÉGLÉ : MultiscaleAdaptiveStretch doux, tes réglages : Aggressiveness 0,15, Target background 0,150, Dynamic range compression 0,40, Contrast recovery coché (séparation 1024, intensité 1,0), saturation cochée (0,50, boost 0,50, masque de luminosité).
> 
> À RÉGLER : glisse sur l'image LINÉAIRE à la place de MAS (même place dans le workflow) ; compare avec MAS sur la même image.
> 
> SI :
> - encore trop clair -> Target background 0,12
> - trop sombre ou plat -> Aggressiveness 0,30, ou MAS
> - couleurs trop fades -> saturation 0,60

#### Opt_MAS_canaux — MultiscaleAdaptiveStretch
   aggressiveness=0.70 ; targetBackground=0.250 ; dynamicRangeCompression=0.40 ; contrastRecovery=true ; scaleSeparation=1024 ; contrastRecoveryIntensity=1.000 ; previewLargeScale=false ; saturationEnabled=false ; saturationAmount=0.75 ; saturationBoost=0.50 ; saturationLightnessMask=true ; backgroundROIEnabled=false ; backgroundROIX0=0 ; backgroundROIY0=0 ; backgroundROIWidth=0 ; backgroundROIHeight=0

> OPTION — à la place de Statistical_Stretch : MultiscaleAdaptiveStretch sur chaque canal sans étoiles, même fond cible 0,25 pour tous (règle du même fond), puis GHS_2_contraste
> GHS_3_fond (option) seulement si le fond est trop clair
> Glisse sur S, puis H, puis O
> Non testé en narrowband.
> 
> PRÉRÉGLÉ : MultiscaleAdaptiveStretch, tes réglages MAS (Aggressiveness 0,70, Target background 0,250 comme le Target Median 0,25 de Statistical Stretch, Dynamic range compression 0,40, Contrast recovery) ; saturation décochée (canaux en gris).
> 
> À RÉGLER : glisse sur chaque canal SANS étoiles, linéaire (S, H, O ; HOO : H, O), à la place de Statistical_Stretch ; même fond cible pour tous ; ensuite GHS_2_contraste ; GHS_3_fond (option) seulement si le fond est trop clair ; puis la palette.
> 
> SI :
> - fond d'un canal différent des autres -> GHS_3_fond sur ce canal
> - O ou S trop faible -> Aggressiveness plus haut sur ce canal, ou GHS
> - cœur brûlé -> Dynamic range compression plus haut

#### Opt_NBN_SHO_lineaire — NarrowbandNormalization
   palette=Palette_SHO ; lightness=Lightness_Off ; blendMode=Blend_Mode1 ; haBlend=0.000 ; scnr=0.700 ; o3Boost=1.000 ; s2Boost=1.200 ; shadowpoint=1.000 ; highlightReduction=1.000 ; brightness=1.000

> OPTION — méthode Cosgrove à tester, étape 1 de 2 (à la place de Statistical_Stretch, GHS_2_contraste, SHO_simple et NBN_SHO) : glisse sur l'image SHO LINÉAIRE sans étoiles (après C_SHO_lineaire)
> Ensuite MAS_Cosgrove
> Ou R_C_Cosgrove_rapide.
> 
> PRÉRÉGLÉ : NarrowbandNormalization palette SHO, Lightness Off (image linéaire), SCNR 0,7, SII boost 1,2, autres à 1.
> 
> À RÉGLER : méthode Cosgrove : glisse sur l'image SHO LINÉAIRE sans étoiles (après C_SHO_lineaire) ; aperçu avec STF ; ensuite MAS_Cosgrove.
> 
> SI :
> - trop vert après MAS -> SCNR plus haut
> - SHO déjà fermée (rapide P3) -> R_C_Cosgrove_rapide (la recrée)

#### Opt_MAS_Cosgrove — MultiscaleAdaptiveStretch
   aggressiveness=0.70 ; targetBackground=0.150 ; dynamicRangeCompression=0.40 ; contrastRecovery=true ; scaleSeparation=1024 ; contrastRecoveryIntensity=1.000 ; previewLargeScale=false ; saturationEnabled=true ; saturationAmount=0.50 ; saturationBoost=0.50 ; saturationLightnessMask=true ; backgroundROIEnabled=false ; backgroundROIX0=0 ; backgroundROIY0=0 ; backgroundROIWidth=0 ; backgroundROIHeight=0

> OPTION — méthode Cosgrove, étape 2 de 2 : glisse sur SHO juste après NBN_SHO_lineaire
> Étire l'image combinée d'un coup (fond 0,15, saturation 0,50)
> Ensuite la finition (phase 6) sur SHO.
> 
> PRÉRÉGLÉ : MultiscaleAdaptiveStretch, tes réglages MAS (Aggressiveness 0,70, fond 0,15, Dynamic range compression 0,40, Contrast recovery) avec saturation 0,50.
> 
> À RÉGLER : méthode Cosgrove : glisse sur SHO juste après NBN_SHO_lineaire ; ensuite la finition (phase 6) sur SHO.
> 
> SI :
> - image trop claire -> Aggressiveness 0,50 ou MAS_light
> - couleurs trop fortes -> saturation 0,30
> - O dominant : fond pas sous 0,12 (Kaessler)

### P4_rapide

#### R_C_Cosgrove_rapide — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=SHO`, `dialogue=false`
   2. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Lineaire_auto.js`
      paramètres : `etapes=Combinaison_SHO>H ; Opt_NBN_SHO_lineaire*>SHO ; Opt_MAS_Cosgrove*>SHO`, `dialogue=false`

> MODE RAPIDE méthode Cosgrove, à tester (à la place de Statistical_Stretch, GHS_2_contraste, SHO_simple et NBN_SHO) : S, H, O linéaires sans étoiles ouverts (après R_C_Lineaire_rapide ou la phase 3), double-clic puis Apply Global (pas en glissant) ; Conteneurs du workflow chargé ; résultat dans SHO, ensuite la finition (phase 6) sur SHO.
> 
> LANCEMENT : double-clic puis Apply Global (rond bleu) ; pas en glissant (les scripts du conteneur choisissent eux-mêmes leurs vues).
> 
> PRÉRÉGLÉ : conteneur de scripts : Fermer_vues ferme SHO si elle est ouverte ; Lineaire_auto lance Combinaison_SHO (S, H, O linéaires -> SHO), Opt_NBN_SHO_lineaire puis Opt_MAS_Cosgrove sur SHO (chacun sur une copie : Ctrl+Z possible) ; S, H, O restent ouverts (pour comparer avec le chemin principal).
> 
> À RÉGLER : S, H, O linéaires sans étoiles ouverts (après R_C_Lineaire_rapide ou la phase 3) ; Conteneurs du workflow chargé ; double-clic puis Apply Global (pas en glissant) ; ensuite la finition sur SHO.
> 
> SI :
> - résultat à comparer -> chemin principal (Statistical_Stretch...) sur S, H, O restés linéaires
> - une étape échoue -> la console dit laquelle ; fais les options à la main

## P5_Couleur

#### E16_SHO_simple — PixelMath
   expression = `S` ; expression1 = `H` ; expression2 = `O` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=SHO_etire ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=RGB ; newImageSampleFormat=SameAsTarget

> PRÉRÉGLÉ : R = S, G = H, B = O, nouvelle image SHO_etire.
> 
> À RÉGLER : vues S, H, O étirées, sans étoiles, même fond (après Statistical_Stretch) : double-clic puis Apply Global, ou glisse sur une des trois ; ensuite NBN_SHO sur SHO_etire.
> 
> SI :
> - une image SHO_etire existe déjà -> ferme-la avant
> - palette Foraxx voulue -> pas besoin : Foraxx_SHO lit S, H, O directement

#### E17_NBN_SHO — NarrowbandNormalization
   palette=Palette_SHO ; lightness=Lightness_Ha ; blendMode=Blend_Mode1 ; haBlend=0.000 ; scnr=0.700 ; o3Boost=1.000 ; s2Boost=1.200 ; shadowpoint=1.000 ; highlightReduction=1.000 ; brightness=1.000

> PRÉRÉGLÉ : palette SHO, Lightness = Ha (H porte le détail), SCNR 0,7 (vert retiré en partie) (demandes de l'utilisateur) ; S2 boost 1,2 (demande de l'utilisateur, 20 octobre 2026) ; O3 boost, Brightness, Highlight reduction à 1 (neutres : ce sont des multiplicateurs, 0 rend l'image noire) ; Shadow point 1 (normalisation à partir de la médiane).
> 
> À RÉGLER : glisse sur SHO_etire (SHO_simple) ; O3 boost au-dessus de 1, S2 boost autour de 1,2, peu à peu ; Shadow point : 1 = normalisation à partir de la médiane, vers 0 = zones faibles aussi (plus de bruit).
> 
> SI :
> - trop vert -> SCNR partiel
> - O discret -> O3 boost

### P5_options

#### Opt_NBN_SHO_doux — NarrowbandNormalization
   palette=Palette_SHO ; lightness=Lightness_Off ; blendMode=Blend_Mode1 ; haBlend=0.000 ; scnr=0.200 ; o3Boost=1.200 ; s2Boost=1.400 ; shadowpoint=1.000 ; highlightReduction=1.000 ; brightness=1.000

> OPTION — à la place de NBN_SHO, à tester : réglages plus doux (Deep Space Place 2026 : Lightness Off, SCNR 0,20, OIII 1,2, SII 1,4)
> Glisse sur SHO_etire après SHO_simple, compare avec NBN_SHO.
> 
> PRÉRÉGLÉ : NarrowbandNormalization palette SHO, Lightness Off, SCNR 0,20, OIII boost 1,2, SII boost 1,4, Highlight reduction et Brightness à 1 (Deep Space Place 2026).
> 
> À RÉGLER : glisse sur SHO_etire après SHO_simple, à la place de NBN_SHO ; compare les deux (Ctrl+Z entre les deux).
> 
> SI :
> - trop vert -> SCNR 0,4
> - pas assez d'orange -> SII boost 1,5
> - détail pâteux -> Lightness Ha

#### Opt_Foraxx_SHO — PixelMath
   expression = `(O^~O)*S + ~(O^~O)*H` ; expression1 = `((O*H)^~(O*H))*H + ~((O*H)^~(O*H))*O` ; expression2 = `O` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=SHO_Foraxx ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=RGB ; newImageSampleFormat=SameAsTarget

> ALTERNATIVE — Foraxx.
> 
> PRÉRÉGLÉ : formule Foraxx SHO, image 'SHO_Foraxx'.
> 
> À RÉGLER : vues S, H, O étirées, sans étoiles, fonds proches.

#### Opt_Perfect_Palette_Picker — Script
   script `$PXI_SRCDIR/scripts/PerfectPalettePicker.js`

> OPTION — comparer 16 palettes avant de choisir.
> 
> LANCEMENT : double-clic sur l'icône, puis Apply Global. Si l'icône est bloquée après une mise à jour du script, efface son champ MD5.
> 
> PRÉRÉGLÉ : rien (le script ne lit pas l'icône).
> 
> À RÉGLER : choisis H, O, S ; Linear Input Data selon tes images ; compare les 16 vignettes.

#### Opt_NBColourMapper — NoOperation

> OPTION — teintes libres, filtre par filtre.
> 
> PRÉRÉGLÉ : rien (icône-note).
> 
> À RÉGLER : H rouge-orangé, O cyan-bleu, S rouge profond ou or.

#### Opt_SCNR_SHO — SCNR
   amount=0.70 ; protectionMethod=AverageNeutral ; colorToRemove=Green ; preserveLightness=true

> OPTION — reste de vert après la palette.
> 
> PRÉRÉGLÉ : vert, Average Neutral, Amount 0,70.
> 
> À RÉGLER : rien.
> 
> SI :
> - encore vert -> 0,80
> - trop magenta -> 0,50

### P5_rapide

#### R_C_Palette_rapide — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Lineaire_auto.js`
      paramètres : `etapes=SHO_simple>H ; NBN_SHO*>SHO_etire`, `dialogue=false`

> MODE RAPIDE, à la place de SHO_simple et NBN_SHO : S, H, O étirés (après Statistical_Stretch, même fond), double-clic puis Apply Global (pas en glissant) ; ensuite la finition sur SHO_etire.
> 
> LANCEMENT : double-clic puis Apply Global (rond bleu) ; pas en glissant (les scripts du conteneur choisissent eux-mêmes leurs vues).
> 
> PRÉRÉGLÉ : conteneur de scripts : Lineaire_auto lance SHO_simple (S, H, O étirés -> SHO_etire) puis NBN_SHO sur SHO_etire (palette SHO, Lightness Ha, SCNR 0,7, S2 boost 1,2, autres boosts à 1 ; sur une copie puis recopié : Ctrl+Z annule NBN) ; S, H, O restent ouverts (Foraxx ou autre palette possible ensuite).
> 
> À RÉGLER : S, H, O étirés, sans étoiles, même fond (après Statistical_Stretch) ; Conteneurs du workflow chargé (icônes SHO_simple et NBN_SHO du chemin principal) ; double-clic puis Apply Global (pas en glissant) ; ensuite la finition (phase 6) sur SHO_etire.
> 
> SI :
> - couleurs à affiner (O3, S2 boost, SCNR) -> Ctrl+Z sur SHO_etire, double-clic sur NBN_SHO, aperçu, puis glisse-la sur SHO_etire
> - comparer avec Foraxx -> Foraxx_SHO sur S, H, O, toujours ouverts
> - une image SHO_etire existe déjà -> ferme-la avant

## P6_Finition

#### E18_HDRMT_30 — ProcessContainer
   1. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=HDR_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   2. HDRMultiscaleTransform
      numberOfLayers=6 ; numberOfIterations=1 ; invertedIterations=true ; overdrive=0.000 ; medianTransform=false ; scalingFunctionData=0.003906,0.015625,0.023438,0.015625,0.003906,0.015625,0.0625,0.09375,0.0625,0… ; scalingFunctionRowFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionColFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionName=B3 Spline (5) ; deringing=false ; smallScaleDeringing=0.000 ; largeScaleDeringing=0.250 ; outputDeringingMaps=false ; midtonesBalanceMode=Automatic ; midtonesBalance=0.500000 ; toIntensity=false ; toLightness=true ; preserveHue=true ; lightnessMask=true ; intensity=1.00
   3. PixelMath
      expression = `a = 0.3;    a*$T + (1 - a)*HDR_avant` ; useSingleExpression=true ; symbols = `a` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=HDR_avant`, `dialogue=false`

> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : copie de l'image (vue HDR_avant), HDRMT 6 couches To lightness / Preserve hue / Lightness mask, mélange 0,3 × résultat + 0,7 × copie, puis fermeture de la copie.
> 
> À RÉGLER : PARTIE 1 de la finition (cœur), par défaut : glisse sur l'image sans étoiles étirée, AVANT C_Finition ; la copie HDR_avant est fermée automatiquement.
> 
> SI :
> - cœur encore trop clair -> HDRMT_40 ou HDRMT_50
> - aucun effet visible -> saute la partie 1

#### E19_C_Finition — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=creer`, `s=0.14`, `flou=2`, `nom=masque_L`, `dialogue=false`
   2. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=Masque_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   3. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (4 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (2 lignes) ; table H (2 lignes) ; table S (3 lignes)
   4. LocalHistogramEqualization
      radius=150 ; histogramBins=Bit12 ; slopeLimit=2.0 ; amount=0.300 ; circularKernel=true
   5. LocalHistogramEqualization
      radius=40 ; histogramBins=Bit10 ; slopeLimit=2.0 ; amount=0.250 ; circularKernel=true
   6. PixelMath
      expression = `masque_L*$T + (1 - masque_L)*Masque_avant` ; expression1 = `masque_L*$T + (1 - masque_L)*Masque_avant` ; expression2 = `masque_L*$T + (1 - masque_L)*Masque_avant` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   7. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=Masque_avant`, `dialogue=false`
   8. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`

> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> CONTENEUR : Masque_L_creer, Masque_copie, Courbes, LHE, LHE_fin, Masque_melange, Fermer_Masque_avant, Masque_retirer.
> 
> SUR : l'image sans étoiles étirée (masque_L créé, Courbes, LHE et LHE_fin sur une copie, mélange par masque_L, copie et masque fermés automatiquement) ; courbe en S, saturation 0,5 -> 0,58 (couleurs trop ternes : Finition_saturee, 0,65, à la place).
> 
> Double-clic sur le conteneur pour voir ou changer les réglages de chaque étape.

#### E20_C_Sharp_MMT — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=attacher`, `s=0.14`, `flou=2`, `nom=masque_L`, `dialogue=false`
   2. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Sharp_MMT.js`
      paramètres : `biais=0.04`, `premiere=2`, `derniere=4`, `couches=5`, `dialogue=false`
   3. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`

> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : masque de luminance attaché (Masque_L, s = 0,14), script Sharp_MMT (MultiscaleMedianTransform 5 couches, couches 2 à 4 biais +0,04, couche 1 inchangée), masque retiré.
> 
> À RÉGLER : glisse sur l'image SANS étoiles étirée, après C_Finition, avant NXT_final ; regarde à 100 % sur la galaxie ; copie Sharp_MMT.js dans src/scripts/clodoweg.
> 
> SI :
> - pas assez net -> double-clic sur le conteneur, Sharp_MMT : biais 0.06
> - halos ou aspect dur -> biais 0.02
> - bruit accentué -> première couche 3

#### E21_NXT_final — NoiseXTerminator
   ml_version=0 ; denoise=0.40 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> PRÉRÉGLÉ : Denoise 0,40, 1 itération.
> 
> À RÉGLER : PARTIE 3 de la finition (bruit) : glisse sur l'image sans étoiles après C_Finition et C_Sharp_MMT ; options à la place : NXT_final_doux (0,25), NXT_final_fort (0,60).
> 
> SI :
> - aspect plastique -> NXT_final_doux
> - bruit encore visible -> NXT_final_fort

### P6_options

#### Opt_Nettoyage_sans_etoiles — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Nettoyage_sans_etoiles.js`
   paramètres : `etoiles=NBtoRGB_stars`, `seuilBas=0.05`, `seuilHaut=0.12`, `etendue=25`, `passes=3`, `protege=0.08`, `structure=0.15`, `compact=0.05`, `tresBrillant=0.05`, `etendue2=80`, `gain=3`, `gain2=8`, `afficherMasque=false`

> OPTION — avant la partie 1, sur l'image sans étoiles après la palette (image d'étoiles ouverte) : taches rondes floues ou halo coloré laissés par SXT autour des étoiles.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Nettoyage_sans_etoiles (calcul sur une copie à 2000 px) : seules les étoiles BRILLANTES de NBtoRGB_stars comptent (luminance floutée 20 px au-dessus de 0,05 à 0,12), zone étendue au halo ; fond LOCAL par ouverture morphologique (disque 25 px, 3 passes : taches de moins de 75 px retirées, halo de la galaxie gardé) ; galaxie et structures claires protégées ; excès au-dessus du fond local retiré, bruit fin gardé ; TRÈS grandes étoiles (luminance floutée 50 px au-dessus de 0,05) : zone d'environ 170 px et fond local à grande échelle (environ 300 px).
> 
> À RÉGLER : glisse sur l'image sans étoiles après la palette, AVANT HDRMT_30 ; NBtoRGB_stars doit être ouverte (étirée) ; vérifie à 1:1, Ctrl+Z pour annuler.
> 
> SI :
> - voir ce qui est touché -> afficherMasque true (vue masque_nettoyage : seulement les grandes étoiles)
> - trop d'étoiles touchées -> seuilBas 0,07, seuilHaut 0,15
> - halo d'une étoile moyenne encore visible -> seuilBas 0,04, seuilHaut 0,09
> - halo d'une très grande étoile pas entièrement couvert -> etendue2 100 et gain2 10 (masque plus large et plein)
> - halo d'une étoile brillante moyenne pas couvert -> etendue 35 et gain 4
> - trou sombre à la place du halo -> etendue2 60 et gain2 5
> - anneau sombre autour d'une petite nébuleuse dans un halo -> compact 0,03
> - un seul passage : chaque passage en plus assombrit un peu (Ctrl+Z puis réglages)
> - bras ou petite nébuleuse atténué -> structure 0,10

#### Opt_HDRMT_40 — ProcessContainer
   1. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=HDR_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   2. HDRMultiscaleTransform
      numberOfLayers=6 ; numberOfIterations=1 ; invertedIterations=true ; overdrive=0.000 ; medianTransform=false ; scalingFunctionData=0.003906,0.015625,0.023438,0.015625,0.003906,0.015625,0.0625,0.09375,0.0625,0… ; scalingFunctionRowFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionColFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionName=B3 Spline (5) ; deringing=false ; smallScaleDeringing=0.000 ; largeScaleDeringing=0.250 ; outputDeringingMaps=false ; midtonesBalanceMode=Automatic ; midtonesBalance=0.500000 ; toIntensity=false ; toLightness=true ; preserveHue=true ; lightnessMask=true ; intensity=1.00
   3. PixelMath
      expression = `a = 0.4;    a*$T + (1 - a)*HDR_avant` ; useSingleExpression=true ; symbols = `a` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=HDR_avant`, `dialogue=false`

> OPTION — partie 1, à la place de HDRMT_30 : cœur encore trop clair (HDRMT appliqué à 40 %).
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : copie de l'image (vue HDR_avant), HDRMT 6 couches To lightness / Preserve hue / Lightness mask, mélange 0,4 × résultat + 0,6 × copie, copie fermée.
> 
> À RÉGLER : option, partie 1, à la place de HDRMT_30 : glisse sur l'image sans étoiles étirée, AVANT C_Finition.
> 
> SI :
> - cœur encore brûlé -> HDRMT_50 à la place
> - cœur détaillé mais terne -> HDRMT_eclat à la place

#### Opt_HDRMT_50 — ProcessContainer
   1. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=HDR_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   2. HDRMultiscaleTransform
      numberOfLayers=6 ; numberOfIterations=1 ; invertedIterations=true ; overdrive=0.000 ; medianTransform=false ; scalingFunctionData=0.003906,0.015625,0.023438,0.015625,0.003906,0.015625,0.0625,0.09375,0.0625,0… ; scalingFunctionRowFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionColFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionName=B3 Spline (5) ; deringing=false ; smallScaleDeringing=0.000 ; largeScaleDeringing=0.250 ; outputDeringingMaps=false ; midtonesBalanceMode=Automatic ; midtonesBalance=0.500000 ; toIntensity=false ; toLightness=true ; preserveHue=true ; lightnessMask=true ; intensity=1.00
   3. PixelMath
      expression = `a = 0.5;    a*$T + (1 - a)*HDR_avant` ; useSingleExpression=true ; symbols = `a` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=HDR_avant`, `dialogue=false`

> OPTION — cœur de galaxie ou nébuleuse brillante brûlé (HDRMT appliqué à 50 %).
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : copie de l'image (vue HDR_avant), HDRMT 6 couches To lightness / Preserve hue / Lightness mask, mélange 0,5 × résultat + 0,5 × copie, puis fermeture de la copie.
> 
> À RÉGLER : glisse sur l'image sans étoiles étirée ; la copie HDR_avant est fermée automatiquement à la fin (script Fermer_vues).
> 
> SI :
> - effet trop faible -> a = 0,7 dans HDR_melange
> - trop fort -> a = 0,3

#### Opt_HDRMT_eclat — ProcessContainer
   1. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=HDR_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   2. HDRMultiscaleTransform
      numberOfLayers=6 ; numberOfIterations=1 ; invertedIterations=true ; overdrive=0.000 ; medianTransform=false ; scalingFunctionData=0.003906,0.015625,0.023438,0.015625,0.003906,0.015625,0.0625,0.09375,0.0625,0… ; scalingFunctionRowFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionColFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionName=B3 Spline (5) ; deringing=false ; smallScaleDeringing=0.000 ; largeScaleDeringing=0.250 ; outputDeringingMaps=false ; midtonesBalanceMode=Automatic ; midtonesBalance=0.500000 ; toIntensity=false ; toLightness=true ; preserveHue=true ; lightnessMask=true ; intensity=1.00
   3. PixelMath
      expression = `a = 0.4;    a*$T + (1 - a)*HDR_avant` ; useSingleExpression=true ; symbols = `a` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=HDR_avant`, `dialogue=false`
   5. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=creer`, `s=0.14`, `flou=2`, `nom=masque_L`, `dialogue=false`
   6. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=Masque_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   7. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (4 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (2 lignes) ; table H (2 lignes) ; table S (3 lignes)
   8. LocalHistogramEqualization
      radius=80 ; histogramBins=Bit10 ; slopeLimit=2.0 ; amount=0.120 ; circularKernel=true
   9. PixelMath
      expression = `masque_L*$T + (1 - masque_L)*Masque_avant` ; expression1 = `masque_L*$T + (1 - masque_L)*Masque_avant` ; expression2 = `masque_L*$T + (1 - masque_L)*Masque_avant` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   10. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=Masque_avant`, `dialogue=false`
   11. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`

> OPTION — cœur laiteux sans détail, mais terne avec HDRMT seul : HDRMT à 40 % puis Boost_finition_light, en un glisser.
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : HDRMT à 40 % (copie HDR_avant, HDRMT 6 couches, mélange 0,4 × résultat + 0,6 × copie, copie fermée), puis Boost_finition_light (masque_L créé, copie, courbe très légère, saturation 0,57, LHE rayon 80 Amount 0,12, mélange par masque_L).
> 
> À RÉGLER : glisse sur l'image sans étoiles étirée, à la place de HDRMT_50 ; HDRMT rend le détail du cœur, le Boost lui rend son éclat.
> 
> SI :
> - cœur encore terne -> un Boost_finition_light de plus
> - pas assez de détail -> a = 0,5 à 0,7 dans HDR_melange
> - trop sombre ou gris -> a = 0,3

#### Opt_DarkStructureEnhance — Script
   script `$PXI_SRCDIR/scripts/misc/DarkStructureEnhance.js`

> OPTION — TEST, avant C_Finition : bandes de poussière et structures sombres plus marquées (script livré avec PixInsight).
> 
> LANCEMENT : double-clic sur l'icône, puis Apply Global.
> 
> PRÉRÉGLÉ : rien (réglages dans le dialogue).
> 
> À RÉGLER : double-clic, choisis l'image sans étoiles étirée ; défauts : Layers to remove 8, Amount 0,70, Iterations 1.
> 
> SI :
> - trop marqué -> Amount 0,40

#### Opt_Finition_saturee — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=creer`, `s=0.14`, `flou=2`, `nom=masque_L`, `dialogue=false`
   2. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=Masque_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   3. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (4 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (2 lignes) ; table H (2 lignes) ; table S (3 lignes)
   4. LocalHistogramEqualization
      radius=150 ; histogramBins=Bit12 ; slopeLimit=2.0 ; amount=0.300 ; circularKernel=true
   5. LocalHistogramEqualization
      radius=40 ; histogramBins=Bit10 ; slopeLimit=2.0 ; amount=0.250 ; circularKernel=true
   6. PixelMath
      expression = `masque_L*$T + (1 - masque_L)*Masque_avant` ; expression1 = `masque_L*$T + (1 - masque_L)*Masque_avant` ; expression2 = `masque_L*$T + (1 - masque_L)*Masque_avant` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   7. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=Masque_avant`, `dialogue=false`
   8. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`

> OPTION — à la place de C_Finition, couleurs trop ternes : même finition (masque, Courbes, LHE, LHE_fin, masque retiré) avec la saturation de l'ancienne version (0,65 au lieu de 0,58).
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : masque_L créé sans être attaché, copie de l'image, courbe en S (0,25 -> 0,19 ; 0,75 -> 0,81) avec saturation 0,5 -> 0,65, LHE (rayon 150, 0,30), LHE_fin (rayon 40, 0,25), puis mélange masque_L × résultat + (1 − masque_L) × copie, copie et masque fermés = l'ancienne C_Finition.
> 
> À RÉGLER : à la place de C_Finition, si les couleurs restent ternes : glisse sur l'image sans étoiles étirée, après HDRMT_30.
> 
> SI :
> - trop saturé -> C_Finition (saturation 0,58)

#### Opt_Boost_finition_light — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=creer`, `s=0.14`, `flou=2`, `nom=masque_L`, `dialogue=false`
   2. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=Masque_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   3. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (4 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (2 lignes) ; table H (2 lignes) ; table S (3 lignes)
   4. LocalHistogramEqualization
      radius=80 ; histogramBins=Bit10 ; slopeLimit=2.0 ; amount=0.120 ; circularKernel=true
   5. PixelMath
      expression = `masque_L*$T + (1 - masque_L)*Masque_avant` ; expression1 = `masque_L*$T + (1 - masque_L)*Masque_avant` ; expression2 = `masque_L*$T + (1 - masque_L)*Masque_avant` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   6. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=Masque_avant`, `dialogue=false`
   7. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`

> OPTION — un tout petit peu plus de couleur et de contraste après LHE_fin (version douce du Boost, rejouable).
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : masque_L créé sans être attaché, copie de l'image, courbe très légère (0,25 -> 0,24 ; 0,75 -> 0,76, saturation 0,5 -> 0,57) puis LHE rayon 80, Amount 0,12, puis mélange masque_L × résultat + (1 − masque_L) × copie, copie et masque fermés.
> 
> À RÉGLER : sous Masque_L, après LHE_fin ; un glisser = un petit cran.
> 
> SI :
> - pas assez -> un deuxième passage, ou Boost_finition

#### Opt_Boost_finition — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=creer`, `s=0.14`, `flou=2`, `nom=masque_L`, `dialogue=false`
   2. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=Masque_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   3. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (4 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (2 lignes) ; table H (2 lignes) ; table S (3 lignes)
   4. LocalHistogramEqualization
      radius=80 ; histogramBins=Bit10 ; slopeLimit=2.0 ; amount=0.200 ; circularKernel=true
   5. PixelMath
      expression = `masque_L*$T + (1 - masque_L)*Masque_avant` ; expression1 = `masque_L*$T + (1 - masque_L)*Masque_avant` ; expression2 = `masque_L*$T + (1 - masque_L)*Masque_avant` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   6. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=Masque_avant`, `dialogue=false`
   7. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`

> OPTION — encore un peu plus de couleur et de contraste après LHE_fin (rejouable).
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : masque_L créé sans être attaché, copie de l'image, petite courbe (0,25 -> 0,23 ; 0,75 -> 0,77, saturation 0,5 -> 0,60) puis LHE rayon 80, Amount 0,20, puis mélange masque_L × résultat + (1 − masque_L) × copie, copie et masque fermés.
> 
> À RÉGLER : sous Masque_L, après LHE_fin ; un glisser = un petit cran, rejoue-le pour pousser encore.
> 
> SI :
> - fond qui se colore ou bruit -> arrête, ou NXT final
> - halo sombre autour de la galaxie -> une passe de moins

#### Opt_NXT_final_doux — NoiseXTerminator
   ml_version=0 ; denoise=0.25 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> OPTION — partie 3, à la place de NXT_final : données très propres, ou aspect plastique avec 0,40 (Denoise 0,25).
> 
> PRÉRÉGLÉ : Denoise 0,25, 1 itération.
> 
> À RÉGLER : PARTIE 3 (bruit), à la place de NXT_final : glisse sur l'image sans étoiles finie.
> 
> SI :
> - encore trop lissé -> saute la partie 3

#### Opt_NXT_final_fort — NoiseXTerminator
   ml_version=0 ; denoise=0.60 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> OPTION — partie 3, à la place de NXT_final : bruit encore visible dans le fond (Denoise 0,60).
> 
> PRÉRÉGLÉ : Denoise 0,60, 1 itération.
> 
> À RÉGLER : PARTIE 3 (bruit), à la place de NXT_final : glisse sur l'image sans étoiles finie.
> 
> SI :
> - aspect plastique -> NXT_final (0,40)

### P6_rapide

#### R_C_Fin_rapide — ProcessContainer
   1. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=HDR_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   2. HDRMultiscaleTransform
      numberOfLayers=6 ; numberOfIterations=1 ; invertedIterations=true ; overdrive=0.000 ; medianTransform=false ; scalingFunctionData=0.003906,0.015625,0.023438,0.015625,0.003906,0.015625,0.0625,0.09375,0.0625,0… ; scalingFunctionRowFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionColFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionName=B3 Spline (5) ; deringing=false ; smallScaleDeringing=0.000 ; largeScaleDeringing=0.250 ; outputDeringingMaps=false ; midtonesBalanceMode=Automatic ; midtonesBalance=0.500000 ; toIntensity=false ; toLightness=true ; preserveHue=true ; lightnessMask=true ; intensity=1.00
   3. PixelMath
      expression = `a = 0.3;    a*$T + (1 - a)*HDR_avant` ; useSingleExpression=true ; symbols = `a` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=HDR_avant`, `dialogue=false`
   5. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=creer`, `s=0.14`, `flou=2`, `nom=masque_L`, `dialogue=false`
   6. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=Masque_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   7. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (4 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (2 lignes) ; table H (2 lignes) ; table S (3 lignes)
   8. LocalHistogramEqualization
      radius=150 ; histogramBins=Bit12 ; slopeLimit=2.0 ; amount=0.300 ; circularKernel=true
   9. LocalHistogramEqualization
      radius=40 ; histogramBins=Bit10 ; slopeLimit=2.0 ; amount=0.250 ; circularKernel=true
   10. PixelMath
      expression = `masque_L*$T + (1 - masque_L)*Masque_avant` ; expression1 = `masque_L*$T + (1 - masque_L)*Masque_avant` ; expression2 = `masque_L*$T + (1 - masque_L)*Masque_avant` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   11. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=Masque_avant`, `dialogue=false`
   12. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`
   13. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=attacher`, `s=0.14`, `flou=2`, `nom=masque_L`, `dialogue=false`
   14. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Sharp_MMT.js`
      paramètres : `biais=0.04`, `premiere=2`, `derniere=4`, `couches=5`, `dialogue=false`
   15. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`
   16. NoiseXTerminator
      ml_version=0 ; denoise=0.40 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> MODE RAPIDE, à la place de HDRMT_30, C_Finition, C_Sharp_MMT et NXT_final : GLISSE sur l'image sans étoiles après la palette (SHO_etire après NBN_SHO, ou l'image de ta palette).
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : HDRMT à 30 % (copie HDR_avant, HDRMT 6 couches, mélange 0,3 × résultat + 0,7 × copie, copie fermée), masque_L créé sans être attaché, copie de l'image, Courbes, LHE (rayon 150), LHE_fin (rayon 40), mélange par masque_L ; masque attaché, Sharp_MMT (MMT couches 2 à 4 biais +0,04), masque retiré ; NXT_final (Denoise 0,40).
> 
> À RÉGLER : glisse sur l'image sans étoiles après la palette (SHO_etire après NBN_SHO ou R_C_Palette_rapide ; HOO : image après NBN_HOO) ; ensuite R_C_Etoiles_fond_rapide.
> 
> SI :
> - cœur encore trop clair -> HDRMT_40 ou HDRMT_50 (options) avant
> - une option de finition (Boost…) -> entre ce conteneur et R_C_Etoiles_fond_rapide
> - trop ou pas assez net -> double-clic sur le conteneur, Sharp_MMT : biais 0.02 ou 0.06 ; copie Sharp_MMT.js dans src/scripts/clodoweg

## P7_Etoiles

#### E22_Fond_desature — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Fond_desature.js`
   paramètres : `debut=0.03`, `fin=0.08`, `violetFin=0.30`, `flou=3`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Fond_desature, réglé plus doux en narrowband : fond mesuré ; violet neutralisé (G remonté jusqu'à min(R, B)) à plein sous fond + 0,08, décroissant jusqu'à + 0,30 ; couleur retirée seulement tout près du fond (rampe de + 0,03 à + 0,08 au lieu de + 0,15) : les voiles faibles de la nébuleuse gardent leur couleur.
> 
> À RÉGLER : glisse sur l'image SANS étoiles finie (après NXT_final), avant Fond_auto et la recombinaison des étoiles (Etoiles_screen, ou Etoiles_reduites).
> 
> SI :
> - violet encore visible dans les zones faibles -> violetFin 0,40
> - fond encore coloré -> fin 0,12
> - voiles faibles grisés -> fin 0,05, ou saute cette étape

#### E23_Fond_auto — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Fond_auto.js`
   paramètres : `cible=0.12`, `tolerance=0.005`, `grille=8`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Fond_auto : fond de chaque canal mesuré (grille 8 × 8, quart le plus sombre des cases), puis mtf canal par canal pour l'amener à 0,12, sans écrêtage ; fond neutre.
> 
> À RÉGLER : glisse sur l'image SANS étoiles, après Fond_desature, avant la recombinaison des étoiles ; console : fond avant et après.
> 
> SI :
> - image trop sombre -> cible 0,13 ou 0,14
> - données très propres -> 0,10 à 0,11
> - nébuleuse qui remplit le champ : regarde le fond AVANT dans la console ; au-dessus d'environ 0,20 (seuil au jugé), ce n'est pas du vrai ciel -> Ctrl+Z et saute cette étape

#### E24_Etoiles_screen — PixelMath
   expression = `~((~$T) * (~NBtoRGB_stars))` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget

> PRÉRÉGLÉ : ~((~$T) * (~NBtoRGB_stars)), sur l'image elle-même.
> 
> À RÉGLER : glisse sur l'image SHO sans étoiles finale ; étoiles de NB to RGB (NBtoRGB_stars), étirées.
> 
> SI :
> - étoiles synthétiques -> remplace par Stars_HOO
> - étoiles aux couleurs de la palette -> par SHO_stars (étirée)

#### E25_NXT_dernier — NoiseXTerminator
   ml_version=0 ; denoise=0.25 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> PRÉRÉGLÉ : NoiseXTerminator Denoise 0,25, 1 itération.
> 
> À RÉGLER : dernière étape avant Export_TIFF : glisse sur l'image finie AVEC ses étoiles, juste après la recombinaison (Etoiles_reduites ou Etoiles_screen).
> 
> SI :
> - aspect plastique -> Denoise 0,15
> - bruit encore visible -> 0,35
> - étoiles adoucies -> 0,15, ou saute cette étape

#### E26_Export_TIFF — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Export_TIFF.js`
   paramètres : `nom=`, `suffixe=`, `dossier=`, `icc=true`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Export_TIFF : copie de l'image en entiers 16 bits, convertie en sRGB IEC61966-2.1 (icc = true), enregistrée en TIFF (.tiff) sous le NOM DE L'OBJET, sans espace (NGC 1532 -> NGC1532), = nom du dossier des masters ouverts (L, R, G, B, H…), dossiers génériques (master, lights, output, WBPP…) sautés ; masters fermés (narrowband) : dossier retenu par Renommer_auto ; enregistrée dans ce dossier ; l'image ouverte ne change pas.
> 
> À RÉGLER : DERNIÈRE étape du chemin principal : glisse sur l'image finie, juste après NXT_dernier ; aucune vue n'est fermée ; copie Export_TIFF.js et clodoweg_objet.jsh dans src/scripts/clodoweg.
> 
> SI :
> - aucun master ouvert -> mot-clé OBJECT, sinon nom de la vue, dans ton dossier personnel
> - autre nom -> remplis nom
> - autre dossier -> remplis dossier
> - garder plusieurs versions -> suffixe (ex. _v2)
> - garder le profil actuel -> icc false

### P7_options

#### Opt_NB_to_RGB_Stars — Script
   script `$PXI_SRCDIR/scripts/NBtoRGBStars.js`

> OPTION — à la place d'Etoiles_NB_auto, à la main dans la fenêtre du script SetiAstro (même mélange)
> LinearFit des étoiles sur H_stars avant.
> 
> LANCEMENT : glisse l'icône sur l'image. Si l'icône est bloquée après une mise à jour du script, efface son champ MD5.
> 
> PRÉRÉGLÉ : rien (le script ne relit pas l'icône).
> 
> À RÉGLER : double-clic puis Apply Global ; fenêtre : Ha Stars = H_stars, OIII Stars = O_stars, SII Stars = S_stars (après LinearFit_etoiles) ; Apply Star Stretch coché, Stretch Factor 5, Color Boost 1,0 ; crée NBtoRGB_stars, déjà étirée.
> 
> SI :
> - étoiles bleues verdâtres -> coche Green Channel Blend Ratio (0,3)
> - étoiles encore toutes bleues -> LinearFit_etoiles oublié sur O_stars

#### Opt_Etoiles_HOO_synth — PixelMath
   expression = `H_stars` ; expression1 = `0.2*H_stars + 0.8*O_stars` ; expression2 = `O_stars` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=Stars_HOO ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=RGB ; newImageSampleFormat=SameAsTarget

> OPTION — alternative à NB to RGB pour les étoiles.
> 
> PRÉRÉGLÉ : R = H_stars, G = 0,2·H_stars + 0,8·O_stars, B = O_stars.
> 
> À RÉGLER : vues d'étoiles linéaires H_stars et O_stars.
> 
> SI :
> - étoiles bleues verdâtres -> 0,3·H + 0,7·O

#### Opt_Boost_final_doux — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=creer`, `s=0.20`, `gamma=2`, `flou=2`, `nom=masque_L`, `dialogue=false`
   2. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=Masque_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   3. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (2 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (3 lignes) ; table H (2 lignes) ; table S (3 lignes)
   4. PixelMath
      expression = `masque_L*$T + (1 - masque_L)*Masque_avant` ; expression1 = `masque_L*$T + (1 - masque_L)*Masque_avant` ; expression2 = `masque_L*$T + (1 - masque_L)*Masque_avant` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   5. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=Masque_avant`, `dialogue=false`
   6. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`

> OPTION — comme Boost_final mais moitié moins fort : un petit cran de couleur, sur l'image SANS étoiles, avant Fond_desature et Etoiles_screen.
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : comme Boost_final, courbes montées de moitié (c 0,46094 -> 0,49870, S 0,46354 -> 0,50261).
> 
> À RÉGLER : glisse sur l'image SANS étoiles finie, avant Fond_desature et Etoiles_screen ; un glisser = un petit cran.
> 
> SI :
> - pas assez -> un deuxième passage, ou Boost_final
> - masque trop large -> gamma 3 dans Masque_L_boost_nb

#### Opt_Boost_final — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=creer`, `s=0.20`, `gamma=2`, `flou=2`, `nom=masque_L`, `dialogue=false`
   2. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=Masque_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   3. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (2 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (3 lignes) ; table H (2 lignes) ; table S (3 lignes)
   4. PixelMath
      expression = `masque_L*$T + (1 - masque_L)*Masque_avant` ; expression1 = `masque_L*$T + (1 - masque_L)*Masque_avant` ; expression2 = `masque_L*$T + (1 - masque_L)*Masque_avant` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   5. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=Masque_avant`, `dialogue=false`
   6. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`

> OPTION — un peu plus de couleur sur les zones brillantes : sur l'image SANS étoiles finie, avant Fond_desature et Etoiles_screen (pas de L : masque tiré de l'image elle-même).
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : masque de luminance tiré de l'image elle-même (script Masque_auto, s = 0,20, gamma 2 : fort sur les zones brillantes, faible sur les voiles) créé sans être attaché, copie, CurvesTransformation c 0,46094 -> 0,53646 et S 0,46354 -> 0,54167, mélange par masque_L, copie et masque fermés.
> 
> À RÉGLER : glisse sur l'image SANS étoiles finie (après la finition), avant Fond_desature et Etoiles_screen.
> 
> SI :
> - masque encore trop large -> gamma 3 dans Masque_L_boost_nb
> - trop fort -> Boost_final_doux
> - fond teinté -> Fond_desature ensuite le retire

#### Opt_Etoiles_reduites — PixelMath
   expression = `S=0.20; W=~((~$T)*(~NBtoRGB_stars)); f1= ~((~mtf(~S,W)/~mtf(~S,$T))*~$T); max($T,f1)` ; useSingleExpression=true ; symbols = `S, W, f1` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget

> ALTERNATIVE — Recombinaison + réduction Blanshan.
> 
> PRÉRÉGLÉ : S = 0,20 ; screen + réduction Blanshan avec NBtoRGB_stars, sur l'image elle-même.
> 
> À RÉGLER : à la place d'Etoiles_screen : glisse sur l'image SHO sans étoiles finale.
> 
> SI :
> - étoiles synthétiques -> remplace NBtoRGB_stars par Stars_HOO
> - pour recommencer -> Ctrl+Z

#### Opt_ICC_sRGB — ICCProfileTransformation
   targetProfile=sRGB IEC61966-2.1 ; toDefaultProfile=false ; renderingIntent=Perceptual ; useBlackPointCompensation=true ; useFloatingPointTransformation=true

> OPTION — tout à la fin, avant une finition dans Photoshop, Lightroom ou Affinity : image convertie en sRGB IEC61966-2.1 (couleurs identiques dans l'autre logiciel).
> 
> PRÉRÉGLÉ : ICCProfileTransformation : vers sRGB IEC61966-2.1, Convert to the specified profile, rendu Perceptual, compensation du point noir.
> 
> À RÉGLER : glisse sur l'image finie avant l'export (Export_TIFF le fait aussi sur sa copie : cette icône sert si tu enregistres toi-même).
> 
> SI :
> - impression ou Adobe RGB voulu -> change le profil cible dans l'icône

#### Opt_Fermer_tout — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
   paramètres : `views=*`

> OPTION — tout à la fin, après Export_TIFF : ferme toutes les vues ouvertes sans demander (image suivante).
> 
> PRÉRÉGLÉ : script Fermer_vues, views = * : ferme TOUTES les vues ouvertes, sans demander d'enregistrer.
> 
> À RÉGLER : après Export_TIFF (TIFF déjà enregistré) : double-clic puis Apply Global, la fenêtre s'ouvre avec toutes les vues cochées, clique Fermer ; glissée sur une image, ferme tout sauf cette image ; copie Fermer_vues.js dans src/scripts/clodoweg.
> 
> SI :
> - une vue à garder -> décoche-la dans la fenêtre
> - rien n'est enregistré : exporte ou sauve AVANT

### P7_rapide

#### R_C_Etoiles_fond_rapide — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fond_desature.js`
      paramètres : `debut=0.03`, `fin=0.08`, `violetFin=0.30`, `flou=3`, `dialogue=false`
   2. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fond_auto.js`
      paramètres : `cible=0.12`, `tolerance=0.005`, `grille=8`, `dialogue=false`
   3. PixelMath
      expression = `~((~$T) * (~NBtoRGB_stars))` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   4. NoiseXTerminator
      ml_version=0 ; denoise=0.25 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20
   5. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Export_TIFF.js`
      paramètres : `nom=`, `suffixe=`, `dossier=`, `icc=true`, `dialogue=false`

> MODE RAPIDE, à la place de Fond_desature, Fond_auto, Etoiles_screen, NXT_dernier et Export_TIFF : GLISSE sur l'image sans étoiles finie, image d'étoiles du workflow ouverte et étirée.
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : Fond_desature (teinte du fond retirée), Fond_auto (fond amené à 0,12, neutre), Etoiles_screen (~((~$T) * (~NBtoRGB_stars))), NXT_dernier (Denoise 0,25, image avec étoiles), Export_TIFF (copie TIFF 16 bits sRGB nommée d'après le dossier des masters).
> 
> À RÉGLER : glisse sur l'image sans étoiles finie ; NBtoRGB_stars (LinearFit_etoiles puis NB_to_RGB_Stars, étirée par le script) ouverte ; l'image est finie et exportée.
> 
> SI :
> - étoiles trop présentes -> fais les étapes à la main avec Etoiles_reduites (à la place d'Etoiles_screen)
> - étoiles d'un autre nom (Stars_HOO, RGB_stars…) -> double-clic sur le conteneur, change le nom dans Etoiles_screen
> - nébuleuse qui remplit le champ (fond AVANT lu par Fond_auto au-dessus d'environ 0,20 dans la console) -> Ctrl+Z, puis les étapes à la main sans Fond_auto
