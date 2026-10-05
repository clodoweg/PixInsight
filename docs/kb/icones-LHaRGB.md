# Icônes du fichier Conteneurs-LHaRGB.xpsm

Fichier GÉNÉRÉ par `docs/process-icons/build/build.sh` (kb_icons.py) à partir de l'xpsm : ne pas éditer ; pour changer une icône, modifier le générateur (voir `generateur.md`).

Préfixes : `E##_` chemin principal (dans l'ordre), `Opt_` option, `R_` mode rapide, `C_` conteneur. Les icônes `P#_…` sont des repères de colonne.

## P1_Preparation

#### E00_LinearPatternSubtraction — Script
   script `$PXI_SRCDIR/scripts/clodoweg/LPS_UnClic.js`
   paramètres : `correctColumns=false`, `correctEntireImage=true`, `defectTableFilePath=`, `layersToRemove=9`, `rejectionLimit=3`, `globalRejection=true`, `globalRejectionLimit=5`, `autoBackground=true`, `backgroundReferenceLeft=0`, `backgroundReferenceTop=0`, `backgroundReferenceWidth=512`, `backgroundReferenceHeight=512`, `allOpenImages=true`, `closeWorkingImages=true`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script LPS_UnClic (moteur de Vicent Peris, sans dialogue) : lignes, Correct the entire image, Layers to remove 9, Rejection limit 3, Global rejection 5, zone de fond choisie automatiquement (la plus sombre), fenêtres de travail fermées, TOUTES les images ouvertes corrigées (allOpenImages = true).
> 
> À RÉGLER : une seule fois par ordinateur (Mac ou PC) : crée le dossier clodoweg dans src/scripts de PixInsight (à côté de PatternCorrection ; Mac : /Applications/PixInsight/src/scripts/clodoweg, PC : en général C:\Program Files\PixInsight\src\scripts\clodoweg ; pas le dossier scripts du premier niveau) et copies-y LPS_UnClic.js ; ensuite ouvre les masters linéaires de la cible (et rien d'autre), puis glisse l'icône sur l'un d'eux : tous sont corrigés, avant le recadrage (la correction se fait dans les images).
> 
> SI :
> - corriger des colonnes -> correctColumns = true dans l'icône
> - une seule image -> allOpenImages = false dans l'icône, puis glisse-la sur l'image
> - artefacts -> Ctrl+Z : le script est conçu pour les brutes, avant alignement
> - script introuvable -> vérifie le dossier scripts/clodoweg (à recopier après une réinstallation de PixInsight) ; version avec dialogue : menu Script › Pattern Correction › LinearPatternSubtraction

#### E01_Renommer_auto — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Renommer_auto.js`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Renommer_auto : renomme les masters mono ouverts L, R, G, B, H, O, S d'après le mot-clé FILTER (Lum, Red, Ha, OIII...), sinon d'après le nom du fichier.
> 
> À RÉGLER : une seule fois par ordinateur : copie Renommer_auto.js dans src/scripts/clodoweg ; ouvre tes masters, puis lance l'icône.
> 
> SI :
> - filtre inconnu ou nom déjà pris -> message dans la console, renomme cette vue à la main

#### E02_Combinaison_RGB — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Combiner_RGB.js`
   paramètres : `red=R`, `green=G`, `blue=B`, `newId=RGB`, `closeSources=true`, `copyKeywords=true`, `garder=R`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Combiner_RGB : R, G, B -> image couleur 'RGB', en-tête FITS du rouge copié ; G et B fermées, R gardée OUVERTE (garder = R : elle sert à Continuum_auto, puis C_RGB_bruit la ferme).
> 
> À RÉGLER : nomme tes masters R, G et B (ou Renommer_auto), puis lance l'icône.

#### E03_Solver_auto — Script
   script `$PXI_SRCDIR/scripts/clodoweg/GC_Solver_auto.js`
   paramètres : `gradient=false`, `solve=true`, `solveTout=true`, `defaultDate=2020-01-01T00:00:00`, `metadata_focal=2939`, `metadata_xpixsz=3.76`, `solver_catalogMode=2`, `solver_distortionCorrection=true`, `(+ 42 autres réglages ImageSolver)`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script GC_Solver_auto.js (gradient false, solveTout true) : ImageSolver (date par défaut si absente, réglages du matériel) sur TOUTES les images ouvertes, sans GradientCorrection ; images *_stars ignorées ; une erreur n'arrête pas les autres.
> 
> À RÉGLER : double-clic puis Apply Global, après Combinaison_RGB ; déjà inclus dans R_C_Preparation_rapide ; ensuite ImageSolver (phase 2) est inutile ; copie GC_Solver_auto.js dans src/scripts/clodoweg.
> 
> SI :
> - seulement la RGB -> solveTout false
> - une image en erreur -> lis le bilan en fin de console, refais-la avec ImageSolver

### P1_options

#### Opt_WBPP — Script
   script `$PXI_SRCDIR/scripts/BatchPreprocessing/BPP-Main.js`

> OPTION — seulement si tu repars des brutes (masters pas encore empilés).
> 
> LANCEMENT : double-clic sur l'icône, puis Apply Global.
> 
> PRÉRÉGLÉ : rien (WBPP garde ses propres réglages).
> 
> À RÉGLER : Maximum quality ; CosmeticCorrection = icône CC_auto ; PSF Signal Weight ; Local normalization activée ; Rejection Auto ; Large-scale rejection High ; pas de drizzle (sauf FWHM < 2 px).
> 
> SI :
> - un groupe de lights sans dark ou flat (onglet Calibration) -> corrige avant Run
> - plusieurs nuits -> Grouping keywords = SESSION

#### Opt_CC_auto — CosmeticCorrection
   masterDarkPath= ; outputDir= ; outputExtension=.xisf ; prefix= ; postfix=_cc ; overwrite=false ; amount=1.00 ; cfa=false ; useMasterDark=false ; hotDarkCheck=false ; hotDarkLevel=1.0000000 ; coldDarkCheck=false ; coldDarkLevel=0.0000000 ; useAutoDetect=true ; hotAutoCheck=true ; hotAutoValue=2.5 ; coldAutoCheck=false ; coldAutoValue=3.0 ; useDefectList=false

> OPTION — avec WBPP, si tu repars des brutes.
> 
> PRÉRÉGLÉ : Auto detect, Hot sigma 2,5, Cold désactivé.
> 
> À RÉGLER : rien ; choisis cette icône comme modèle Cosmetic correction dans WBPP ; coche CFA seulement en caméra couleur.
> 
> SI :
> - petites étoiles modifiées -> Hot sigma 3,0
> - S, H, O en poses longues -> 2,2

#### Opt_Binning_x2 — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Binning_x2.js`
   paramètres : `facteur=2`

> OPTION — traitement 4 fois plus rapide et moins de bruit (0,528″/px au lieu de 0,264″/px, l'image du CDK17 est suréchantillonnée) : double-clic puis Apply Global juste après Solver_auto, toutes les images divisées par 2
> Pour un grand tirage, Agrandir_x2 avant l'export.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Binning_x2 : IntegerResample −2, moyenne (binning 2×2 logiciel) sur TOUTES les images ouvertes (sauf *_stars) ; solution astrométrique gardée ; mots-clés XPIXSZ et XBINNING mis à jour.
> 
> À RÉGLER : double-clic puis Apply Global, juste APRÈS Solver_auto (phase 1) ; copie Binning_x2.js dans src/scripts/clodoweg.
> 
> SI :
> - grand tirage voulu -> Agrandir_x2 (P7 options) avant Export_TIFF, ou ne bine pas
> - binning 3×3 -> facteur 3
> - ImageSolver refait ensuite et en échec -> metadata_xpixsz = 7.52 dans l'icône ImageSolver

### P1_rapide

#### R_C_Preparation_rapide — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Renommer_auto.js`
      paramètres : `dialogue=false`
   2. Script
      script `$PXI_SRCDIR/scripts/clodoweg/LPS_UnClic.js`
      paramètres : `correctColumns=false`, `correctEntireImage=true`, `defectTableFilePath=`, `layersToRemove=9`, `rejectionLimit=3`, `globalRejection=true`, `globalRejectionLimit=5`, `autoBackground=true`, `backgroundReferenceLeft=0`, `backgroundReferenceTop=0`, `backgroundReferenceWidth=512`, `backgroundReferenceHeight=512`, `allOpenImages=true`, `closeWorkingImages=true`, `dialogue=false`
   3. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Combiner_RGB.js`
      paramètres : `red=R`, `green=G`, `blue=B`, `newId=RGB`, `closeSources=true`, `copyKeywords=true`, `garder=R`, `dialogue=false`
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/GC_Solver_auto.js`
      paramètres : `gradient=false`, `solve=true`, `solveTout=true`, `defaultDate=2020-01-01T00:00:00`, `dialogue=false`, `metadata_focal=2939`, `metadata_xpixsz=3.76`, `solver_catalogMode=2`, `solver_distortionCorrection=true`, `(+ 42 autres réglages ImageSolver)`

> MODE RAPIDE, à la place d'E00 à E03 : masters seuls ouverts, double-clic puis Apply Global (pas en glissant : ImageSolver échoue sur une image en cours de traitement) : Renommer_auto, LinearPatternSubtraction, Combinaison_RGB, Solver_auto (ImageSolver sur toutes les images) en un seul conteneur.
> 
> LANCEMENT : masters seuls ouverts, double-clic puis Apply Global (rond bleu) ; pas en glissant (ImageSolver échoue sur une image en cours de traitement).
> 
> PRÉRÉGLÉ : conteneur : Renommer_auto (L, R, G, B d'après FILTER), LinearPatternSubtraction sur tous les masters mono ouverts, Combinaison_RGB, Solver_auto (ImageSolver sur toutes les images).
> 
> À RÉGLER : masters seuls ouverts ; double-clic puis Apply Global (pas en glissant sur une image : ImageSolver échouerait sur celle-ci) ; remplace E00 à E03.
> 
> SI :
> - une étape en erreur -> lis la console, puis fais les icônes E00 à E03 une par une

## P2_Gradient

#### E04_ImageSolver — Script
   script `$PXI_SRCDIR/scripts/clodoweg/ImageSolver_Date.js`
   paramètres : `defaultDate=2020-01-01T00:00:00`, `metadata_focal=2939`, `metadata_xpixsz=3.76`, `solver_catalogMode=2`, `solver_distortionCorrection=true`, `(+ 42 autres réglages ImageSolver)`

> LANCEMENT : glisse l'icône sur l'image.
> 
> PRÉRÉGLÉ : script ImageSolver_Date.js en une seule icône (pas de conteneur) : date d'observation 2020-01-01 ajoutée seulement si l'image n'en a pas, puis ImageSolver 6.4.2 lancé avec focale 2 939 mm, pixel 3,76 µm (0,264″/px), catalogue automatique (Gaia DR3 local), correction de distorsion ; coordonnées et vraie date lues dans l'image.
> 
> À RÉGLER : une seule fois par ordinateur : copie la NOUVELLE version d'ImageSolver_Date.js dans src/scripts/clodoweg ; ensuite glisse l'icône sur CHAQUE image à calibrer, juste avant SPFC ou SPCC : image RGB combinée, master L, masters H, O et S.
> 
> SI :
> - la date est ajoutée mais ImageSolver ne se lance pas -> glisse l'icône ImageSolver_seul (options) sur la même image
> - échec sans coordonnées dans l'en-tête -> lance ImageSolver depuis le menu Script et utilise Search (nom de l'objet)
> - master en bin 2 -> metadata_xpixsz = 7.52 et metadata_resolution = 0.0001466 dans solverParams

#### E05_SPFC_RGB_filtres — SpectrophotometricFluxCalibration
   narrowbandMode=false ; grayFilterTrCurve=300,0.000,302,0.000,304,0.000,306,0.000,308,0.000,310,0.000,312,0.000,314,0.0… ; grayFilterName=Antlia V Pro Series L (approx. 420-715 nm) ; redFilterTrCurve=594,0,596,0.001,598,0.001,600,0.002,602,0.003,604,0.004,606,0.005,608,0.006,6… ; redFilterName=Antlia V Pro Series R ; greenFilterTrCurve=480,0.001,482,0.004,484,0.009,486,0.018,488,0.053,490,0.151,492,0.357,494,0.6… ; greenFilterName=Antlia V Pro Series G ; blueFilterTrCurve=420,0.002,422,0.006,424,0.021,426,0.088,428,0.237,430,0.418,432,0.611,434,0.7… ; blueFilterName=Antlia V Pro Series B ; grayFilterWavelength=656.3 ; grayFilterBandwidth=3.0 ; redFilterWavelength=656.3 ; redFilterBandwidth=3.0 ; greenFilterWavelength=500.7 ; greenFilterBandwidth=3.0 ; blueFilterWavelength=500.7 ; blueFilterBandwidth=3.0 ; deviceQECurve=402,0.7219,404,0.7367,406,0.75,408,0.7618,410,0.7751,412,0.787,414,0.7944,416… ; deviceQECurveName=Sony IMX411/455/461/533/571 ; broadbandIntegrationStepSize=0.50 ; narrowbandIntegrationSteps=10 ; rejectionLimit=0.30 ; catalogId=GaiaDR3SP ; minMagnitude=0.00 ; limitMagnitude=12.00 ; autoLimitMagnitude=true ; psfStructureLayers=5 ; saturationThreshold=0.75 ; saturationRelative=true ; saturationShrinkFactor=0.10 ; psfNoiseLayers=1 ; psfHotPixelFilterRadius=1 ; psfNoiseReductionFilterRadius=0 ; psfMinStructureSize=0 ; psfMinSNR=40.00 ; psfAllowClusteredSources=false ; psfType=PSFType_Auto ; psfGrowth=1.75 ; psfMaxStars=24576 ; psfSearchTolerance=4.00 ; generateGraphs=false ; generateStarMaps=false ; generateTextFiles=false

> PRÉRÉGLÉ : QE IMX455, filtres Antlia R, G, B, Gaia DR3/SP.
> 
> À RÉGLER : rien ; applique sur l'image RGB combinée linéaire, résolue, avant MGC.

#### E06_SPFC_L — SpectrophotometricFluxCalibration
   narrowbandMode=false ; grayFilterTrCurve=300,0.000,302,0.000,304,0.000,306,0.000,308,0.000,310,0.000,312,0.000,314,0.0… ; grayFilterName=Antlia V Pro Series L (approx. 420-715 nm) ; redFilterTrCurve=594,0,596,0.001,598,0.001,600,0.002,602,0.003,604,0.004,606,0.005,608,0.006,6… ; redFilterName=Antlia V Pro Series R ; greenFilterTrCurve=480,0.001,482,0.004,484,0.009,486,0.018,488,0.053,490,0.151,492,0.357,494,0.6… ; greenFilterName=Antlia V Pro Series G ; blueFilterTrCurve=420,0.002,422,0.006,424,0.021,426,0.088,428,0.237,430,0.418,432,0.611,434,0.7… ; blueFilterName=Antlia V Pro Series B ; grayFilterWavelength=656.3 ; grayFilterBandwidth=3.0 ; redFilterWavelength=656.3 ; redFilterBandwidth=3.0 ; greenFilterWavelength=500.7 ; greenFilterBandwidth=3.0 ; blueFilterWavelength=500.7 ; blueFilterBandwidth=3.0 ; deviceQECurve=402,0.7219,404,0.7367,406,0.75,408,0.7618,410,0.7751,412,0.787,414,0.7944,416… ; deviceQECurveName=Sony IMX411/455/461/533/571 ; broadbandIntegrationStepSize=0.50 ; narrowbandIntegrationSteps=10 ; rejectionLimit=0.30 ; catalogId=GaiaDR3SP ; minMagnitude=0.00 ; limitMagnitude=12.00 ; autoLimitMagnitude=true ; psfStructureLayers=5 ; saturationThreshold=0.75 ; saturationRelative=true ; saturationShrinkFactor=0.10 ; psfNoiseLayers=1 ; psfHotPixelFilterRadius=1 ; psfNoiseReductionFilterRadius=0 ; psfMinStructureSize=0 ; psfMinSNR=40.00 ; psfAllowClusteredSources=false ; psfType=PSFType_Auto ; psfGrowth=1.75 ; psfMaxStars=24576 ; psfSearchTolerance=4.00 ; generateGraphs=false ; generateStarMaps=false ; generateTextFiles=false

> PRÉRÉGLÉ : QE IMX455, Gray = Antlia L, Gaia DR3/SP.
> 
> À RÉGLER : rien ; applique sur le master L linéaire, résolu, avant MGC.

#### E07_SPFC_H — SpectrophotometricFluxCalibration
   narrowbandMode=true ; grayFilterTrCurve=300,0.000,302,0.000,304,0.000,306,0.000,308,0.000,310,0.000,312,0.000,314,0.0… ; grayFilterName=Antlia V Pro Series L (approx. 420-715 nm) ; redFilterTrCurve=594,0,596,0.001,598,0.001,600,0.002,602,0.003,604,0.004,606,0.005,608,0.006,6… ; redFilterName=Antlia V Pro Series R ; greenFilterTrCurve=480,0.001,482,0.004,484,0.009,486,0.018,488,0.053,490,0.151,492,0.357,494,0.6… ; greenFilterName=Antlia V Pro Series G ; blueFilterTrCurve=420,0.002,422,0.006,424,0.021,426,0.088,428,0.237,430,0.418,432,0.611,434,0.7… ; blueFilterName=Antlia V Pro Series B ; grayFilterWavelength=656.3 ; grayFilterBandwidth=3.0 ; redFilterWavelength=656.3 ; redFilterBandwidth=3.0 ; greenFilterWavelength=500.7 ; greenFilterBandwidth=3.0 ; blueFilterWavelength=500.7 ; blueFilterBandwidth=3.0 ; deviceQECurve=402,0.7219,404,0.7367,406,0.75,408,0.7618,410,0.7751,412,0.787,414,0.7944,416… ; deviceQECurveName=Sony IMX411/455/461/533/571 ; broadbandIntegrationStepSize=0.50 ; narrowbandIntegrationSteps=10 ; rejectionLimit=0.30 ; catalogId=GaiaDR3SP ; minMagnitude=0.00 ; limitMagnitude=12.00 ; autoLimitMagnitude=true ; psfStructureLayers=5 ; saturationThreshold=0.75 ; saturationRelative=true ; saturationShrinkFactor=0.10 ; psfNoiseLayers=1 ; psfHotPixelFilterRadius=1 ; psfNoiseReductionFilterRadius=0 ; psfMinStructureSize=0 ; psfMinSNR=40.00 ; psfAllowClusteredSources=false ; psfType=PSFType_Auto ; psfGrowth=1.75 ; psfMaxStars=24576 ; psfSearchTolerance=4.00 ; generateGraphs=false ; generateStarMaps=false ; generateTextFiles=false

> PRÉRÉGLÉ : QE IMX455, Narrowband 656,3 nm, 3 nm.
> 
> À RÉGLER : rien ; applique sur le master H, puis MGC_MARS_H.

#### E08_MGC_MARS — MultiscaleGradientCorrection
   command= ; useMARSDatabase=true ; grayMARSFilter=L ; redMARSFilter=R ; greenMARSFilter=G ; blueMARSFilter=B ; referenceImageId= ; gradientScale=1024 ; structureSeparation=3 ; modelSmoothness=1.00 ; minFieldRatio=0.017 ; maxFieldRatio=0.167 ; enforceFieldLimits=true ; scaleFactorRK=1.00 ; scaleFactorG=1.00 ; scaleFactorB=1.00 ; showGradientModel=true

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

#### E09_MGC_MARS_H — MultiscaleGradientCorrection
   command= ; useMARSDatabase=true ; grayMARSFilter=Ha ; redMARSFilter=R ; greenMARSFilter=G ; blueMARSFilter=B ; referenceImageId= ; gradientScale=1024 ; structureSeparation=3 ; modelSmoothness=1.00 ; minFieldRatio=0.017 ; maxFieldRatio=0.167 ; enforceFieldLimits=true ; scaleFactorRK=1.00 ; scaleFactorG=1.00 ; scaleFactorB=1.00 ; showGradientModel=true

> PRÉRÉGLÉ : comme MGC_MARS, filtre MARS Gray = Ha.
> 
> À RÉGLER : une seule fois par ordinateur : ouvre l'icône, section MARS Database, clique Default Files (copie la liste des préférences de MGC), puis glisse le triangle sur l'icône pour la remplacer et enregistre tes icônes (Save Process Icons) ; à refaire si tu recharges les icônes de la fiche ; ensuite après SPFC_H, sur le master H.
> 
> SI :
> - cible au sud au-delà de −15° environ (et narrowband au-delà de +75°) -> pas de référence MARS : GradientCorrection ou DBE
> - gradient restant -> Gradient scale 512 puis 256

### P2_options

#### Opt_ImageSolver_seul — Script
   script `$PXI_SRCDIR/scripts/ImageSolver/ImageSolver.js`
   paramètres : `metadata_focal=2939`, `metadata_xpixsz=3.76`, `solver_catalogMode=2`, `solver_distortionCorrection=true`, `(+ 42 autres réglages ImageSolver)`

> OPTION — secours : ImageSolver seul, si l'icône ImageSolver (date + ImageSolver) s'arrête après la date.
> 
> PRÉRÉGLÉ : ImageSolver 6.4.2 seul (mêmes réglages que l'icône ImageSolver, sans l'ajout de date).
> 
> À RÉGLER : secours : glisse sur l'image si l'icône ImageSolver s'arrête après la date.
> 
> SI :
> - icône bloquée après une mise à jour d'ImageSolver -> efface son champ MD5

#### Opt_GradientCorrection — GradientCorrection
   reference=0.50 ; lowThreshold=0.20 ; lowTolerance=0.50 ; highThreshold=0.05 ; highTolerance=0.00 ; iterations=15 ; scale=5.00 ; smoothness=0.60 ; downsamplingFactor=16 ; protection=true ; protectionThreshold=0.10 ; protectionAmount=0.50 ; protectionSmoothingFactor=16 ; lowClippingLevel=0.000076 ; automaticConvergence=true ; convergenceLimit=0.00001000 ; maxIterations=10 ; useSimplification=false ; simplificationDegree=1 ; simplificationScale=1024 ; generateSimpleModel=false ; generateGradientModel=false ; generateProtectionMasks=false ; gridSamplingDelta=16

> ALTERNATIVE — GradientCorrection.
> 
> PRÉRÉGLÉ : valeurs par défaut, Structure protection activée.
> 
> À RÉGLER : rien ; contrôle le modèle de gradient.
> 
> SI :
> - gradient dans les coins -> baisse Gradient scale
> - nébuleuse assombrie -> monte Protection amount

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

### P2_rapide

#### R_Gradient_auto_rapide — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Gradient_auto.js`

> MODE RAPIDE, à la place de la phase 2 : GradientCorrection sur TOUTES les images ouvertes (plus d'ImageSolver : fait par Solver_auto en phase 1) ; à faire AVANT R_Lineaire_rapide (sans GradientCorrection).
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Gradient_auto.js : GradientCorrection (sans modèle de gradient) sur TOUTES les images ouvertes, rien d'autre (pas d'ImageSolver) ; images *_stars ignorées ; une erreur n'arrête pas les autres.
> 
> À RÉGLER : double-clic puis Apply Global, masters et RGB ouverts, après R_C_Preparation_rapide (astrométrie déjà faite par Solver_auto) ; AVANT R_Lineaire_rapide (le chemin principal de la phase 3 n'a pas de GradientCorrection) ; copie Gradient_auto.js dans src/scripts/clodoweg.

## P3_Lineaire

#### E10_C_RGB_couleur — ProcessContainer
   1. BlurXTerminator
      ml_version=4 ; correct_only=true ; sharpen_stars=0.25 ; adjust_star_halos=0.00 ; nonstellar_diameter=0.0 ; auto_nonstellar_psf=true ; sharpen_nonstellar=0.50 ; lunar_planetary=false ; overlap=0.20
   2. SpectrophotometricColorCalibration
      applyCalibration=true ; narrowbandMode=false ; narrowbandOptimizeStars=false ; whiteReferenceSpectrum=200.5,0.0715066,201.5,0.0689827,202.5,0.0720216,203.5,0.0685511,204.5,0.07123… ; whiteReferenceName=Average Spiral Galaxy ; redFilterTrCurve=594,0,596,0.001,598,0.001,600,0.002,602,0.003,604,0.004,606,0.005,608,0.006,6… ; redFilterName=Antlia V Pro Series R ; greenFilterTrCurve=480,0.001,482,0.004,484,0.009,486,0.018,488,0.053,490,0.151,492,0.357,494,0.6… ; greenFilterName=Antlia V Pro Series G ; blueFilterTrCurve=420,0.002,422,0.006,424,0.021,426,0.088,428,0.237,430,0.418,432,0.611,434,0.7… ; blueFilterName=Antlia V Pro Series B ; redFilterWavelength=656.3 ; redFilterBandwidth=3.0 ; greenFilterWavelength=500.7 ; greenFilterBandwidth=3.0 ; blueFilterWavelength=500.7 ; blueFilterBandwidth=3.0 ; deviceQECurve=402,0.7219,404,0.7367,406,0.75,408,0.7618,410,0.7751,412,0.787,414,0.7944,416… ; deviceQECurveName=Sony IMX411/455/461/533/571 ; broadbandIntegrationStepSize=0.50 ; narrowbandIntegrationSteps=10 ; catalogId=GaiaDR3SP ; limitMagnitude=12.00 ; autoLimitMagnitude=true ; targetSourceCount=8000 ; psfStructureLayers=5 ; saturationThreshold=0.75 ; saturationRelative=true ; saturationShrinkFactor=0.10 ; psfNoiseLayers=1 ; psfHotPixelFilterRadius=1 ; psfNoiseReductionFilterRadius=0 ; psfMinStructureSize=0 ; psfMinSNR=40.00 ; psfAllowClusteredSources=true ; psfType=PSFType_Auto ; psfGrowth=1.25 ; psfMaxStars=24576 ; psfSearchTolerance=4.00 ; psfChannelSearchTolerance=2.00 ; neutralizeBackground=true ; backgroundReferenceViewId= ; backgroundLow=-2.80 ; backgroundHigh=2.00 ; backgroundUseROI=false ; backgroundROIX0=0 ; backgroundROIY0=0 ; backgroundROIX1=0 ; backgroundROIY1=0 ; generateGraphs=false ; generateStarMaps=false ; generateTextFiles=false ; outputDirectory=
   3. BlurXTerminator
      ml_version=4 ; correct_only=false ; sharpen_stars=0.25 ; adjust_star_halos=0.00 ; nonstellar_diameter=0.0 ; auto_nonstellar_psf=true ; sharpen_nonstellar=0.50 ; lunar_planetary=false ; overlap=0.20

> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> CONTENEUR : BXT_CorrectOnly, SPCC, BXT_RGB.
> 
> SUR : l'image RGB combinée, linéaire, gradient retiré.
> 
> Double-clic sur le conteneur pour voir ou changer les réglages de chaque étape.

#### E11_BXT_L_H — BlurXTerminator
   ml_version=4 ; correct_only=false ; sharpen_stars=0.25 ; adjust_star_halos=0.00 ; nonstellar_diameter=0.0 ; auto_nonstellar_psf=true ; sharpen_nonstellar=0.80 ; lunar_planetary=false ; overlap=0.20

> PRÉRÉGLÉ : Sharpen Stars 0,25, Halos 0, Nonstellar 0,80, PSF auto.
> 
> À RÉGLER : rien ; sur L puis sur H, linéaires, avant tout mélange.
> 
> SI :
> - vers ou pores -> Nonstellar 0,70
> - FWHM > 8 px -> bin 2 ou réduction ×0,5 avant

#### E12_Continuum_auto — Script
   script `$PXI_SRCDIR/scripts/ContinuumSubtraction.js`
   paramètres : `applyNoiseReduction=false`, `noiseReductionMethod=NoiseXterminator`, `starrySelected=true`, `outputLinearImageOnly=true`, `aiModel=2.0.0`

> LANCEMENT : double-clic sur l'icône, puis Apply Global. Si l'icône est bloquée après une mise à jour du script, efface son champ MD5.
> 
> PRÉRÉGLÉ : script SetiAstro ContinuumSubtraction.js : Starry, sortie linéaire seule, pas de réduction de bruit ; coefficient calculé automatiquement ; crée HaNB (gris, linéaire).
> 
> À RÉGLER : double-clic puis Apply Global ; dans le dialogue : Ha = H, Red (or RGB) = R (ou le RGB calibré), le reste vide ; Execute.
> 
> SI :
> - vue créée HaNB1 -> renomme-la HaNB (ou ferme l'ancienne HaNB avant)
> - étoiles ou disque encore visibles dans HaNB -> relance avec Starless
> - cœur rougi dans l'image finale -> baisse w dans H_dans_RGB

#### E13_H_dans_RGB — PixelMath
   expression = `w = 1.0; $T[0] + w*HaNB` ; expression1 = `$T[1]` ; expression2 = `$T[2]` ; useSingleExpression=false ; symbols = `w` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget

> PRÉRÉGLÉ : w = 1,0 ; R' = R + w·HaNB.
> 
> À RÉGLER : glisse sur le RGB linéaire calibré ; w entre 0,5 et 2.
> 
> SI :
> - régions HII rouge vif -> baisse w
> - invisibles -> monte w

#### E14_C_RGB_bruit — ProcessContainer
   1. NoiseXTerminator
      ml_version=0 ; denoise=0.80 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20
   2. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=H, R, HaNB`, `dialogue=false`

> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> CONTENEUR : NXT_RGB, Fermer_continuum.
> 
> SUR : l'image RGB après H_dans_RGB (et H_dans_L éventuel) : NXT, puis H, R et HaNB fermées.
> 
> Double-clic sur le conteneur pour voir ou changer les réglages de chaque étape.

#### E15_NXT_L — NoiseXTerminator
   ml_version=0 ; denoise=0.60 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> PRÉRÉGLÉ : Denoise 0,60, 1 itération.
> 
> À RÉGLER : rien ; après BXT.
> 
> SI :
> - détail fin perdu -> 0,50
> - encore bruité -> 0,70

#### E16_SXT_L_lineaire — StarXTerminator
   ml_version=0 ; output_stars=false ; unscreen=false ; remove_stars=true ; remove_spikes=true ; remove_aureoles=true ; remove_reflections=true ; overlap=0.20

> PRÉRÉGLÉ : StarXTerminator sur L linéaire, Unscreen décoché, SANS image d'étoiles (les étoiles viennent du RGB).
> 
> À RÉGLER : rien ; dernière étape de C_L_lineaire (ou après NXT_L en LHaRGB) ; L sort sans étoiles pour les GHS.
> 
> SI :
> - nœuds HII ou amas des bras retirés -> masque noir sur la zone avant SXT
> - quadrillage -> Large overlap

### P3_options

#### Opt_Find_Background — Script
   script `$PXI_SRCDIR/scripts/FindBackground.js`
   paramètres : `filterAvg=true`, `filterSdev=true`, `filterPoisonIndex=false`, `filterMAAD=false`, `filterObjects=false`, `printInformation=true`, `generatePreview=true`, `previewName=Background`, `slowSearch=false`, `fastSearch=true`, `size=50`, `spacingRate=2`, `searchGridSize=100`, `startingPoints=40`

> OPTION — champ rempli de nébuleuse : fond de référence pour SPCC.
> 
> LANCEMENT : double-clic sur l'icône, puis Apply Global. Si l'icône est bloquée après une mise à jour du script, efface son champ MD5.
> 
> PRÉRÉGLÉ : rien.
> 
> À RÉGLER : glisse sur l'image : crée l'aperçu Background ; dans SPCC, Region of Interest › From Preview.

#### Opt_H_dans_RGB_v2 — PixelMath
   expression = `w = 1.0; $T[0] + w*(HaNB - med(HaNB))` ; expression1 = `$T[1]` ; expression2 = `$T[2] + 0.2*w*(HaNB - med(HaNB))` ; useSingleExpression=false ; symbols = `w` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget

> OPTION — TEST, à la place de H_dans_RGB : HaNB injecté sans son fond (HaNB − med(HaNB)) dans R, et 20 % dans B (Hβ) : régions HII plus roses, fond inchangé.
> 
> PRÉRÉGLÉ : w = 1,0 ; R = R + w·(HaNB − med(HaNB)) ; G inchangé ; B = B + 0,2·w·(HaNB − med(HaNB)) (Hβ).
> 
> À RÉGLER : glisse sur RGB linéaire, après Continuum_auto (HaNB ouverte), à la place de H_dans_RGB ; compare les deux.
> 
> SI :
> - HII trop rose ou violet -> 0,1 au lieu de 0,2 dans B
> - taches HII rouge vif -> baisse w

#### Opt_H_dans_L — PixelMath
   expression = `a = 1.0; max($T, HaNB*a)` ; useSingleExpression=true ; symbols = `a` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget

> OPTION — régions HII plus nettes (H injecté dans la luminance).
> 
> PRÉRÉGLÉ : a = 1,0 ; L = max(L, a·HaNB), sur L elle-même.
> 
> À RÉGLER : glisse sur L ; HaNB (Continuum_auto) doit exister.
> 
> SI :
> - couleurs délavées -> baisse a

#### Opt_NBRGBCombination — NoOperation

> OPTION — alternative à la soustraction du continuum.
> 
> PRÉRÉGLÉ : rien (icône-note).
> 
> À RÉGLER : RGB bande 100 nm, H bande 3 nm, Scale 1,2.
> 
> SI :
> - H trop discret -> Scale 3 à 5

#### Opt_CombineHaWithRGB — Script
   script `$PXI_SRCDIR/scripts/Toolbox/CombineHaToRGB.js`
   paramètres : `alphaView=H`, `amount=2.0`, `beta=0.0`, `bg=0.015`, `sigma=0.0`, `linear=true`, `rgbLinked=true`, `invertMask=true`

> OPTION — TEST, à la place de Continuum_auto + H_dans_RGB : script CombineHaWithRGB (Toolbox)
> Glisse sur RGB linéaire, H ouverte.
> 
> LANCEMENT : glisse l'icône sur l'image.
> 
> PRÉRÉGLÉ : script CombineHaWithRGB (Toolbox) : H = vue H, Amount 2,0, Beta 0, Background 0,015, Sigma 0, Linear Image coché, canaux liés.
> 
> À RÉGLER : installe la PixInsight Toolbox de Jürgen Terpe (dépôt https://www.ideviceapps.de/PixInsight/Utilities/) ; glisse sur RGB LINÉAIRE, H ouverte, à la place de Continuum_auto + H_dans_RGB ; sans glisser (double-clic) : dialogue avec aperçu.
> 
> SI :
> - HII trop rouge -> amount 1,0
> - fond rouge -> bg plus haut

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

#### R_Lineaire_rapide — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Lineaire_auto.js`
   paramètres : `etapes=C_RGB_couleur>RGB ; BXT_L_H>L,H ; NXT_L>L ; SXT_L_lineaire>L`

> MODE RAPIDE, à la place de la phase 3 du chemin principal : double-clic puis Apply Global ; lance les icônes du chemin principal sur RGB et L (LRGB : C_RGB_lineaire et C_L_lineaire ; LHaRGB : C_RGB_couleur, BXT_L_H sur L et H, NXT_L) ; RGB et L restent linéaires, avec leurs étoiles.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Lineaire_auto.js, etapes = C_RGB_couleur>RGB ; BXT_L_H>L,H ; NXT_L>L : C_RGB_couleur (BXT Correct Only, SPCC, BXT) sur RGB, BXT (Nonstellar 0,80) sur L et H, NXT 0,60 sur L ; étoiles gardées, images linéaires.
> 
> À RÉGLER : double-clic puis Apply Global, après R_Gradient_auto_rapide ; Conteneurs-LHaRGB chargé ; ensuite Continuum_auto, H_dans_RGB, C_RGB_bruit (chemin principal), puis GHS_1_premier sur L.
> 
> SI :
> - H_dans_L voulu -> il se fait après (NXT_L déjà passé sur L)
> - une étape échoue -> la console dit laquelle

## P4_Etirement

#### E17_GHS_1_premier — GeneralizedHyperbolicStretch
   stretchType=ST_GeneralisedHyperbolic ; stretchChannel=SC_RGB ; inverse=false ; stretchFactor=0.000 ; localIntensity=10.000 ; symmetryPoint=0.000000 ; highlightProtection=1.000000 ; shadowProtection=0.000000 ; blackPoint=0.000000 ; whitePoint=1.000000 ; colourBlend=1.000 ; clipType=CT_RGBBlend ; useRGBWorkingSpace=false

> PRÉRÉGLÉ : b = 10, Stretch factor 0.
> 
> À RÉGLER : sur L SANS étoiles (SXT_L_lineaire fait en phase 3) ; clique le signal faible, Send to SP ; Stretch factor jusqu'au pic à 0,25 (fond lu 0,001 -> 6,5 ; 0,002 -> 5,5 ; 0,005 -> 4,5 ; 0,01 -> 3,5) ; pas d'étoiles : pas de HP à gérer.
> 
> SI :
> - fond bruité qui ressort -> SP trop bas, remonte-le
> - cœur qui sature -> HP vers sa valeur

#### E18_GHS_2_contraste — GeneralizedHyperbolicStretch
   stretchType=ST_GeneralisedHyperbolic ; stretchChannel=SC_RGB ; inverse=false ; stretchFactor=1.000 ; localIntensity=4.000 ; symmetryPoint=0.350000 ; highlightProtection=0.900000 ; shadowProtection=0.000000 ; blackPoint=0.000000 ; whitePoint=1.000000 ; colourBlend=1.000 ; clipType=CT_RGBBlend ; useRGBWorkingSpace=false

> PRÉRÉGLÉ : b = 4, HP 0,9, Stretch factor 1, SP 0,35.
> 
> À RÉGLER : sur L ; SP = valeur de ta zone plate, au-dessus du fond (souvent 0,30–0,45 ; jamais 0,25 = le fond) ; Stretch factor 1 à 2.
> 
> SI :
> - cœur brillant qui sature -> baisse HP vers sa valeur
> - fond trop sombre -> monte LP vers sa valeur (pas au-dessus de SP)

#### E19_MAS — MultiscaleAdaptiveStretch
   aggressiveness=0.70 ; targetBackground=0.150 ; dynamicRangeCompression=0.40 ; contrastRecovery=true ; scaleSeparation=1024 ; contrastRecoveryIntensity=1.000 ; previewLargeScale=false ; saturationEnabled=true ; saturationAmount=0.75 ; saturationBoost=0.50 ; saturationLightnessMask=true ; backgroundROIEnabled=false ; backgroundROIX0=0 ; backgroundROIY0=0 ; backgroundROIWidth=0 ; backgroundROIHeight=0

> PRÉRÉGLÉ : MultiscaleAdaptiveStretch, tes réglages : Aggressiveness 0,70, Target background 0,150, Dynamic range compression 0,40, Contrast recovery coché (séparation 1024, intensité 1,0), saturation cochée (0,75, boost 0,50, masque de luminosité).
> 
> À RÉGLER : glisse sur le RGB LINÉAIRE AVEC ses étoiles (après C_RGB_lineaire) ; ensuite SXT_RGB_etire.
> 
> SI :
> - étoiles trop saturées -> saturation 0,5
> - cœur de galaxie brûlé -> saturation décochée, HDRMT ensuite

#### E20_SXT_RGB_etire — StarXTerminator
   ml_version=0 ; output_stars=true ; unscreen=true ; remove_stars=true ; remove_spikes=true ; remove_aureoles=true ; remove_reflections=true ; overlap=0.20

> PRÉRÉGLÉ : StarXTerminator, Unscreen COCHÉ (image étirée), Generate star image coché, Remove reflections coché : RGB sans étoiles + RGB_stars étirée.
> 
> À RÉGLER : glisse sur le RGB juste après MAS ; garde RGB_stars ouverte jusqu'à Etoiles_screen ; ensuite SCNR_etoiles_vert et SCNR_etoiles_violet (sur RGB_stars), puis GHS_3_fond sur le RGB sans étoiles.
> 
> SI :
> - taches ou halos restés -> Nettoyage_sans_etoiles (P6 options)
> - morceaux de galaxie dans RGB_stars -> masque noir sur le cœur avant SXT
> - quadrillage -> Large overlap

#### E21_SCNR_etoiles_vert — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Etoiles_auto.js`
   paramètres : `vue=RGB_stars`, `amount=0`, `satAmount=0`, `scnr=true`, `violet=false`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Etoiles_auto réglé SCNR seul : SCNR vert, Amount 1,0, Average Neutral, Preserve lightness, sur RGB_stars (amount 0 = pas d'étirement, satAmount 0 = pas de saturation).
> 
> À RÉGLER : glisse sur n'importe quelle image juste après SXT_RGB_etire (traite toujours la vue RGB_stars) : vert retiré des étoiles ; ensuite SCNR_etoiles_violet ; le RGB sans étoiles n'est pas touché.
> 
> SI :
> - étoiles grisées ou magenta -> double-clic : décoche SCNR, ou passe un SCNR natif à 0,5 sur RGB_stars
> - autre nom d'étoiles -> vue = ce nom dans l'icône

#### E22_SCNR_etoiles_violet — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Etoiles_auto.js`
   paramètres : `vue=RGB_stars`, `amount=0`, `satAmount=0`, `scnr=false`, `violet=true`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Etoiles_auto réglé violet seul : Invert, SCNR vert (Amount 1,0, Average Neutral, Preserve lightness), Invert sur RGB_stars : le magenta (violet) des étoiles retiré.
> 
> À RÉGLER : juste après SCNR_etoiles_vert : glisse sur n'importe quelle image (traite toujours la vue RGB_stars) ; le RGB sans étoiles n'est pas touché ; pas dans le rapide : après R_C_RGB_etire_rapide si besoin ; à vérifier à la sonde : utile si R et B nettement au-dessus de G sur les étoiles bleues.
> 
> SI :
> - étoiles bleues devenues trop vertes ou ternes -> double-clic : décoche « Violet retiré », ou CorrectMagentaStars (moins fort)
> - autre nom d'étoiles -> vue = ce nom dans l'icône

#### E23_GHS_3_fond — GeneralizedHyperbolicStretch
   stretchType=ST_GeneralisedHyperbolic ; stretchChannel=SC_RGB ; inverse=false ; stretchFactor=1.000 ; localIntensity=10.000 ; symmetryPoint=0.200000 ; highlightProtection=0.200000 ; shadowProtection=0.000000 ; blackPoint=0.000000 ; whitePoint=1.000000 ; colourBlend=1.000 ; clipType=CT_RGBBlend ; useRGBWorkingSpace=false

> PRÉRÉGLÉ : b = 10, SP = HP = 0,20, Stretch factor 1 (fond à 0,23 après GHS_2).
> 
> À RÉGLER : sur L après GHS_2 ; puis sur le RGB SANS étoiles après MAS et SXT_RGB_etire (SP = HP = 0,12, fond MAS 0,15) ; SP = HP = fond lu - 0,03 ; Stretch factor 0,8 à 1,2 jusqu'au fond vers 0,12–0,14 sur les deux, AVANT LRGB.

### P4_options

#### Opt_Statistical_Stretch — Script
   script `$PXI_SRCDIR/scripts/statisticalstretch.js`
   paramètres : `targetMedian=0.25`, `curvesBoost=0`, `numIterations=1`, `normalizeImageRange=false`, `linkedStretch=true`, `openDialogbox=true`, `autoConvergence=false`, `blackpointSigma=5`, `noBlackClip=false`, `hdrCompress=false`, `hdrAmount=0.25`, `hdrKnee=0.35`, `lumaOnly=false`, `lumaMode=rec709`, `lumaBlend=0.6`

> OPTION — à la place de MAS sur le RGB avec étoiles (étirement statistique, étoiles plus grosses)
> Puis SXT_RGB_etire.
> 
> LANCEMENT : glisse l'icône sur l'image. Si l'icône est bloquée après une mise à jour du script, efface son champ MD5.
> 
> PRÉRÉGLÉ : Target Median 0,25, Blackpoint Sigma 5, Linked coché, reste par défaut.
> 
> À RÉGLER : OPTION, à la place de MAS : sur le RGB linéaire AVEC ses étoiles ; puis SXT_RGB_etire et GHS_3_fond sur le RGB (SP = HP = 0,22).
> 
> SI :
> - étoiles grossies ou cœurs blancs -> MAS (chemin principal)

### P4_rapide

#### R_C_RGB_etire_rapide — ProcessContainer
   1. MultiscaleAdaptiveStretch
      aggressiveness=0.70 ; targetBackground=0.150 ; dynamicRangeCompression=0.40 ; contrastRecovery=true ; scaleSeparation=1024 ; contrastRecoveryIntensity=1.000 ; previewLargeScale=false ; saturationEnabled=true ; saturationAmount=0.75 ; saturationBoost=0.50 ; saturationLightnessMask=true ; backgroundROIEnabled=false ; backgroundROIX0=0 ; backgroundROIY0=0 ; backgroundROIWidth=0 ; backgroundROIHeight=0
   2. StarXTerminator
      ml_version=0 ; output_stars=true ; unscreen=true ; remove_stars=true ; remove_spikes=true ; remove_aureoles=true ; remove_reflections=true ; overlap=0.20
   3. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Etoiles_auto.js`
      paramètres : `vue=RGB_stars`, `amount=0`, `satAmount=0`, `scnr=true`, `violet=false`, `dialogue=false`
   4. GeneralizedHyperbolicStretch
      stretchType=ST_GeneralisedHyperbolic ; stretchChannel=SC_RGB ; inverse=false ; stretchFactor=1.000 ; localIntensity=10.000 ; symmetryPoint=0.120000 ; highlightProtection=0.120000 ; shadowProtection=0.000000 ; blackPoint=0.000000 ; whitePoint=1.000000 ; colourBlend=1.000 ; clipType=CT_RGBBlend ; useRGBWorkingSpace=false

> MODE RAPIDE, à la place de MAS, SXT_RGB_etire, SCNR_etoiles_vert et GHS_3_fond sur le RGB (SCNR_etoiles_violet à passer à part si besoin) : glisse sur RGB linéaire avec étoiles ; MAS, SXT Unscreen (RGB_stars créée), SCNR vert sur RGB_stars, GHS fond (SP = HP = 0,12).
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : MAS (tes réglages, fond 0,15), SXT Unscreen (RGB_stars créée), SCNR vert 1,0 sur RGB_stars (script Etoiles_auto), GHS fond (b = 10, SP = HP = 0,12, Stretch factor 1).
> 
> À RÉGLER : glisse sur le RGB linéaire avec étoiles (après R_Lineaire_rapide) ; RGB sort étiré sans étoiles, RGB_stars étirée ; ensuite R_C_LRGB_rapide.
> 
> SI :
> - fond pas au même niveau que L -> GHS_3_fond du chemin principal, réglé à la main

## P5_Couleur

#### E24_LRGB_ajout_L — LRGBCombination
   mL=0.500 ; mc=0.500 ; clipHighlights=false ; noiseReduction=true ; layersRemoved=4 ; layersProtected=2 ; inheritAstrometricSolution=true ; table channels (4 lignes)

> PRÉRÉGLÉ : seul L coché, Lightness 0,5, Saturation 0,5, réduction du bruit de chrominance.
> 
> À RÉGLER : vue L nommée 'L' (sans étoiles, GHS faits) ; glisse sur le RGB SANS étoiles (après MAS, SXT_RGB_etire, GHS_3_fond) ; les étoiles reviennent en phase 7 (Etoiles_screen).
> 
> SI :
> - couleurs délavées -> étire L moins fort
> - couleurs trop vives -> Saturation plus haute (0,6)

### P5_rapide

#### R_C_LRGB_rapide — ProcessContainer
   1. LRGBCombination
      mL=0.500 ; mc=0.500 ; clipHighlights=false ; noiseReduction=true ; layersRemoved=4 ; layersProtected=2 ; inheritAstrometricSolution=true ; table channels (4 lignes)

> MODE RAPIDE, à la place de LRGB_ajout_L : glisse sur le RGB sans étoiles, L sans étoiles étirée ouverte ; LRGB_ajout_L (Saturation 0,5) seule.
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : LRGB_ajout_L (L sans étoiles, Lightness 0,5, Saturation 0,5).
> 
> À RÉGLER : glisse sur le RGB sans étoiles (après R_C_RGB_etire_rapide), L sans étoiles étirée ouverte ; ensuite R_C_Fin_rapide.
> 
> SI :
> - taches ou halos restés -> Nettoyage_sans_etoiles (P6 options) avant R_C_Fin_rapide

## P6_Finition

#### E25_HDRMT_30 — ProcessContainer
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

#### E26_C_Finition — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=attacher`, `s=0.14`, `flou=2`, `nom=masque_L`, `dialogue=false`
   2. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (4 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (2 lignes) ; table H (2 lignes) ; table S (3 lignes)
   3. LocalHistogramEqualization
      radius=150 ; histogramBins=Bit12 ; slopeLimit=2.0 ; amount=0.300 ; circularKernel=true
   4. LocalHistogramEqualization
      radius=40 ; histogramBins=Bit10 ; slopeLimit=2.0 ; amount=0.250 ; circularKernel=true
   5. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`

> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> CONTENEUR : Masque_L, Courbes, LHE, LHE_fin, Masque_retirer.
> 
> SUR : l'image sans étoiles étirée (masque créé, attaché puis retiré automatiquement) ; courbe en S, saturation 0,5 -> 0,58 (couleurs trop ternes : Finition_saturee, 0,65, à la place).
> 
> Double-clic sur le conteneur pour voir ou changer les réglages de chaque étape.

#### E27_C_Sharp_MMT — ProcessContainer
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
> - autre rendu -> Sharp_USM (P6 options) à la place

#### E28_NXT_final — NoiseXTerminator
   ml_version=0 ; denoise=0.40 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> PRÉRÉGLÉ : Denoise 0,40, 1 itération.
> 
> À RÉGLER : PARTIE 3 de la finition (bruit) : glisse sur l'image sans étoiles après C_Finition (et le Boost éventuel) ; options à la place : NXT_final_doux (0,25), NXT_final_fort (0,60).
> 
> SI :
> - aspect plastique -> NXT_final_doux
> - bruit encore visible -> NXT_final_fort

### P6_options

#### Opt_Nettoyage_sans_etoiles — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Nettoyage_sans_etoiles.js`
   paramètres : `etoiles=RGB_stars`, `seuilBas=0.05`, `seuilHaut=0.12`, `etendue=25`, `passes=3`, `protege=0.08`, `structure=0.15`, `compact=0.05`, `tresBrillant=0.05`, `etendue2=80`, `gain=3`, `gain2=8`, `afficherMasque=false`

> OPTION — avant la partie 1, sur l'image sans étoiles juste après LRGB (RGB_stars ouverte) : taches rondes floues ou halo coloré laissés par SXT autour des étoiles.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Nettoyage_sans_etoiles (calcul sur une copie à 2000 px) : seules les étoiles BRILLANTES de RGB_stars comptent (luminance floutée 20 px au-dessus de 0,05 à 0,12), zone étendue au halo ; fond LOCAL par ouverture morphologique (disque 25 px, 3 passes : taches de moins de 75 px retirées, halo de la galaxie gardé) ; galaxie et structures claires protégées ; excès au-dessus du fond local retiré, bruit fin gardé ; TRÈS grandes étoiles (luminance floutée 50 px au-dessus de 0,05) : zone d'environ 170 px et fond local à grande échelle (environ 300 px).
> 
> À RÉGLER : glisse sur l'image sans étoiles juste après LRGB, AVANT HDRMT_40 ; RGB_stars doit être ouverte ; vérifie à 1:1, Ctrl+Z pour annuler.
> 
> SI :
> - voir ce qui est touché -> afficherMasque true (vue masque_nettoyage : seulement les grandes étoiles)
> - trop d'étoiles touchées -> seuilBas 0,07, seuilHaut 0,15
> - halo d'une étoile moyenne encore visible -> seuilBas 0,04, seuilHaut 0,09
> - halo d'une très grande étoile pas entièrement couvert -> etendue2 100 et gain2 10 (masque plus large et plein)
> - halo d'une étoile brillante moyenne pas couvert -> etendue 35 et gain 4
> - trou sombre à la place du halo -> etendue2 60 et gain2 5
> - anneau sombre autour d'une petite galaxie dans un halo -> compact 0,03
> - un seul passage : chaque passage en plus assombrit un peu (Ctrl+Z puis réglages)
> - bras ou petite galaxie atténué -> structure 0,10

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
      paramètres : `mode=attacher`, `s=0.14`, `flou=2`, `nom=masque_L`, `dialogue=false`
   6. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (4 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (2 lignes) ; table H (2 lignes) ; table S (3 lignes)
   7. LocalHistogramEqualization
      radius=80 ; histogramBins=Bit10 ; slopeLimit=2.0 ; amount=0.120 ; circularKernel=true
   8. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`

> OPTION — cœur laiteux sans détail, mais terne avec HDRMT seul : HDRMT à 40 % puis Boost_finition_light, en un glisser.
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : HDRMT à 40 % (copie HDR_avant, HDRMT 6 couches, mélange 0,4 × résultat + 0,6 × copie, copie fermée), puis Boost_finition_light (masque, courbe très légère, saturation 0,57, LHE rayon 80 Amount 0,12, masque retiré).
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
      paramètres : `mode=attacher`, `s=0.14`, `flou=2`, `nom=masque_L`, `dialogue=false`
   2. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (4 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (2 lignes) ; table H (2 lignes) ; table S (3 lignes)
   3. LocalHistogramEqualization
      radius=150 ; histogramBins=Bit12 ; slopeLimit=2.0 ; amount=0.300 ; circularKernel=true
   4. LocalHistogramEqualization
      radius=40 ; histogramBins=Bit10 ; slopeLimit=2.0 ; amount=0.250 ; circularKernel=true
   5. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`

> OPTION — à la place de C_Finition, couleurs trop ternes : même finition (masque, Courbes, LHE, LHE_fin, masque retiré) avec la saturation de l'ancienne version (0,65 au lieu de 0,58).
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : masque de luminance attaché (Masque_L), courbe en S (0,25 -> 0,19 ; 0,75 -> 0,81) avec saturation 0,5 -> 0,65, LHE (rayon 150, 0,30), LHE_fin (rayon 40, 0,25), masque retiré = l'ancienne C_Finition.
> 
> À RÉGLER : à la place de C_Finition, si les couleurs restent ternes : glisse sur l'image sans étoiles étirée, après HDRMT_30.
> 
> SI :
> - trop saturé -> C_Finition (saturation 0,58)

#### Opt_Boost_finition_light — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=attacher`, `s=0.14`, `flou=2`, `nom=masque_L`, `dialogue=false`
   2. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (4 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (2 lignes) ; table H (2 lignes) ; table S (3 lignes)
   3. LocalHistogramEqualization
      radius=80 ; histogramBins=Bit10 ; slopeLimit=2.0 ; amount=0.120 ; circularKernel=true
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`

> OPTION — un tout petit peu plus de couleur et de contraste après LHE_fin (version douce du Boost, rejouable).
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : courbe très légère (0,25 -> 0,24 ; 0,75 -> 0,76, saturation 0,5 -> 0,57) puis LHE rayon 80, Amount 0,12.
> 
> À RÉGLER : sous Masque_L, après LHE_fin ; un glisser = un petit cran.
> 
> SI :
> - pas assez -> un deuxième passage, ou Boost_finition

#### Opt_Boost_finition — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=attacher`, `s=0.14`, `flou=2`, `nom=masque_L`, `dialogue=false`
   2. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (4 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (2 lignes) ; table H (2 lignes) ; table S (3 lignes)
   3. LocalHistogramEqualization
      radius=80 ; histogramBins=Bit10 ; slopeLimit=2.0 ; amount=0.200 ; circularKernel=true
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`

> OPTION — encore un peu plus de couleur et de contraste après LHE_fin (rejouable).
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : petite courbe (0,25 -> 0,23 ; 0,75 -> 0,77, saturation 0,5 -> 0,60) puis LHE rayon 80, Amount 0,20.
> 
> À RÉGLER : sous Masque_L, après LHE_fin ; un glisser = un petit cran, rejoue-le pour pousser encore.
> 
> SI :
> - fond qui se colore ou bruit -> arrête, ou NXT final
> - halo sombre autour de la galaxie -> une passe de moins

#### Opt_Sharp_USM — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=attacher`, `s=0.14`, `flou=2`, `nom=masque_L`, `dialogue=false`
   2. UnsharpMask
      sigma=2.00 ; amount=0.30 ; useLuminance=true ; linear=false ; deringing=true ; deringingDark=0.1000 ; deringingBright=0.0000 ; outputDeringingMaps=false ; rangeLow=0.0000000 ; rangeHigh=0.0000000
   3. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`

> OPTION — à la place de C_Sharp_MMT : accentuation finale par UnsharpMask, avant NXT_final, sur l'image sans étoiles
> Masque de luminance attaché puis retiré automatiquement.
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : masque de luminance attaché (Masque_L, s = 0,14), UnsharpMask (écart type 2,0 px, amount 0,30, luminance seule, anti-halo sombre 0,10), masque retiré.
> 
> À RÉGLER : glisse sur l'image SANS étoiles étirée, après C_Finition, avant NXT_final ; regarde à 100 % sur la galaxie.
> 
> SI :
> - halos sombres autour des détails -> double-clic sur le conteneur, UnsharpMask : amount 0,20 ou anti-halo 0,15
> - pas assez net -> amount 0,40
> - fond qui devient granuleux -> seuil s du masque plus haut (Masque_L)

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
      paramètres : `mode=attacher`, `s=0.14`, `flou=2`, `nom=masque_L`, `dialogue=false`
   6. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (4 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (2 lignes) ; table H (2 lignes) ; table S (3 lignes)
   7. LocalHistogramEqualization
      radius=150 ; histogramBins=Bit12 ; slopeLimit=2.0 ; amount=0.300 ; circularKernel=true
   8. LocalHistogramEqualization
      radius=40 ; histogramBins=Bit10 ; slopeLimit=2.0 ; amount=0.250 ; circularKernel=true
   9. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Sharp_MMT.js`
      paramètres : `biais=0.04`, `premiere=2`, `derniere=4`, `couches=5`, `dialogue=false`
   10. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`
   11. NoiseXTerminator
      ml_version=0 ; denoise=0.40 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> MODE RAPIDE, à la place de HDRMT_30, C_Finition, C_Sharp_MMT et NXT_final : sur l'image sans étoiles après LRGB_ajout_L (ou R_C_LRGB_rapide).
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : HDRMT à 30 % (copie HDR_avant, HDRMT 6 couches, mélange 0,3 × résultat + 0,7 × copie, copie fermée), masque de luminance attaché, Courbes, LHE (rayon 150), LHE_fin (rayon 40), Sharp_MMT (MMT couches 2 à 4 biais +0,04), masque retiré, NXT_final (Denoise 0,40).
> 
> À RÉGLER : glisse sur l'image sans étoiles après LRGB_ajout_L (ou R_C_LRGB_rapide) ; ensuite R_C_Etoiles_fond_rapide.
> 
> SI :
> - cœur encore trop clair -> HDRMT_40 ou HDRMT_50 (options) avant
> - une option de finition (Boost…) -> entre ce conteneur et R_C_Etoiles_fond_rapide
> - trop ou pas assez net -> double-clic sur le conteneur, Sharp_MMT : biais 0.02 ou 0.06 ; copie Sharp_MMT.js dans src/scripts/clodoweg

## P7_Etoiles

#### E29_Fond_desature — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Fond_desature.js`
   paramètres : `debut=0.03`, `fin=0.15`, `violetFin=0.30`, `flou=3`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Fond_desature : fond mesuré ; zones faibles (luminance lissée sous fond + 0,15, décroissant jusqu'à + 0,30) : violet neutralisé (G remonté jusqu'à min(R, B), magenta seulement) ; fond (sous + 0,03, rampe jusqu'à + 0,15) : couleur retirée.
> 
> À RÉGLER : glisse sur l'image SANS étoiles finie (après NXT_final), avant Fond_auto et Etoiles_screen.
> 
> SI :
> - violet encore visible dans le halo -> violetFin 0,40
> - extensions faibles de la galaxie grisées -> fin 0,10

#### E30_Fond_auto — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Fond_auto.js`
   paramètres : `cible=0.12`, `tolerance=0.005`, `grille=8`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Fond_auto : fond de chaque canal mesuré (grille 8 × 8, quart le plus sombre des cases), puis mtf canal par canal pour l'amener à 0,12, sans écrêtage ; fond neutre.
> 
> À RÉGLER : glisse sur l'image SANS étoiles, après Fond_desature, avant Etoiles_screen ; console : fond avant et après.
> 
> SI :
> - image trop sombre -> cible 0,13 ou 0,14
> - données très propres -> 0,10 à 0,11

#### E31_Etoiles_screen — PixelMath
   expression = `~((~$T) * (~RGB_stars))` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget

> PRÉRÉGLÉ : ~((~$T) * (~RGB_stars)), sur l'image elle-même.
> 
> À RÉGLER : glisse sur l'image sans étoiles finale : elle reçoit les étoiles ; étoiles étirées nommées RGB_stars (nom donné par SXT, s minuscule).
> 
> SI :
> - autre nom d'étoiles -> corrige-le dans la formule

### P7_options

#### Opt_MT_etoiles — MorphologicalTransformation
   operator=Selection ; interlacingDistance=1 ; lowThreshold=0.000000 ; highThreshold=0.000000 ; numberOfIterations=1 ; amount=0.60 ; selectionPoint=0.25 ; structureName= ; structureSize=5 ; table structureWayTable (1 lignes)

> OPTION — réduction d'étoiles supplémentaire.
> 
> PRÉRÉGLÉ : Selection 0,25, Amount 0,60, 1 itération, 5×5 circulaire.
> 
> À RÉGLER : sur l'image d'étoiles seule, avant Etoiles_screen.
> 
> SI :
> - trop fort -> Amount 0,50

#### Opt_Halo_B_Gon — Script
   script `$PXI_SRCDIR/scripts/Halo-B-Gon.js`

> OPTION — halos autour des étoiles brillantes
> Attention, réduit aussi les petites étoiles (pour les grosses seulement : Etoiles_grosses, en narrowband).
> 
> LANCEMENT : double-clic sur l'icône, puis Apply Global. Si l'icône est bloquée après une mise à jour du script, efface son champ MD5.
> 
> PRÉRÉGLÉ : rien (réglages dans le dialogue).
> 
> À RÉGLER : Select stars-only image = l'image d'étoiles étirée (RGB_stars ; NBtoRGB_stars en SHO ; HOO_stars en HOO), AVANT Etoiles_screen ; Reduction Amount Low ; Linear Data décoché.
> 
> SI :
> - petites étoiles réduites ou effacées aussi (son masque ne protège que les cœurs) -> Etoiles_grosses à la place (narrowband)
> - pas assez -> relance en Low (Med = 4 courbes, High = 9)

#### Opt_Saturation_grosses — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Saturation_grosses.js`
   paramètres : `vue=RGB_stars`, `taille=7`, `seuil=0.15`, `etendue=12`, `passes=1`

> OPTION — grosses étoiles presque blanches, petites assez colorées : glisse sur n'importe quelle image (traite RGB_stars) AVANT Etoiles_screen
> Seules les grosses étoiles et leur halo sont saturés
> En rapide, avant R_C_Etoiles_fond_rapide.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Saturation_grosses sur la vue RGB_stars : masque des grosses étoiles (ouverture morphologique, disque de 7 px sur une copie à 2000 px, au-dessus de 0,15, étendu au halo, flou 12 px) ; sous ce masque, ta courbe de saturation (CurvesTransformation, c : 0,46 -> 0,54 et S : 0,46 -> 0,54, Akima), 1 passe ; petites étoiles intactes.
> 
> À RÉGLER : glisse sur n'importe quelle image (traite toujours RGB_stars), AVANT Etoiles_screen ; pour régler à l'œil : double-clic puis Apply Global, « Voir le masque », puis Appliquer ; copie Saturation_grosses.js dans src/scripts/clodoweg.
> 
> SI :
> - pas assez saturé -> passes 2
> - moyennes étoiles saturées aussi -> taille 9 ou 11
> - certaines grosses pas saturées -> taille 5, ou seuil 0,10
> - halo pas saturé jusqu'au bord -> etendue 16
> - pour recommencer -> Ctrl+Z sur RGB_stars

#### Opt_Fond_auto_clair — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Fond_auto.js`
   paramètres : `cible=0.14`, `tolerance=0.005`, `grille=8`

> OPTION — à la place de Fond_auto : image trop sombre, fond amené à 0,14, après Fond_desature, avant Etoiles_screen.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Fond_auto, cible 0,14 : fond de chaque canal mesuré (grille 8 × 8), amené à 0,14 par mtf, sans écrêtage ; fond neutre.
> 
> À RÉGLER : à la place de Fond_auto, image trop sombre : glisse sur l'image sans étoiles, après Fond_desature, avant Etoiles_screen.
> 
> SI :
> - fond encore trop sombre -> double-clic, cible 0,15

#### Opt_Etoiles_reduites — PixelMath
   expression = `S=0.20; W=~((~$T)*(~RGB_stars)); f1= ~((~mtf(~S,W)/~mtf(~S,$T))*~$T); max($T,f1)` ; useSingleExpression=true ; symbols = `S, W, f1` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget

> ALTERNATIVE — Recombinaison + réduction Blanshan.
> 
> PRÉRÉGLÉ : S = 0,20 (Bill : 0,15) ; recombinaison screen + réduction Blanshan en une formule, sur l'image elle-même.
> 
> À RÉGLER : À LA PLACE d'Etoiles_screen : glisse sur l'image sans étoiles finale ; étoiles étirées nommées RGB_stars.
> 
> SI :
> - étoiles encore grosses -> S 0,15
> - trop petites -> S 0,25, ou Etoiles_screen
> - pour recommencer -> Ctrl+Z

#### Opt_Boost_final_doux — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=attacher`, `s=0.20`, `gamma=2`, `flou=2`, `nom=masque_L`, `source=L`, `exclure=RGB_stars`, `exclureGain=4`, `dialogue=false`
   2. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (2 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (3 lignes) ; table H (2 lignes) ; table S (3 lignes)
   3. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`

> OPTION — comme Boost_final mais moitié moins fort (courbes c et S montées de moitié) : un petit cran de couleur sur l'image finie, sans toucher aux étoiles
> L encore ouverte.
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : masque de luminance tiré de L sans étoiles (script Masque_auto, source = L, s = 0,20, gamma 2 : fort sur le cœur et les bras brillants, faible sur le halo et les bras faibles ; étoiles de RGB_stars retirées du masque) attaché, CurvesTransformation c 0,46094 -> 0,49870 et S 0,46354 -> 0,50261, masque retiré.
> 
> À RÉGLER : glisse sur l'image finie avec étoiles ; L (sans étoiles, étirée) doit être ouverte.
> 
> SI :
> - masque encore trop large -> gamma 3 dans Masque_L_source
> - trop fort -> rapproche les points de la diagonale
> - étoiles touchées -> vérifie que L est bien la version sans étoiles

#### Opt_Boost_final — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=attacher`, `s=0.20`, `gamma=2`, `flou=2`, `nom=masque_L`, `source=L`, `exclure=RGB_stars`, `exclureGain=4`, `dialogue=false`
   2. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (2 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (3 lignes) ; table H (2 lignes) ; table S (3 lignes)
   3. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`, `dialogue=false`

> OPTION — sur l'image FINIE, étoiles comprises : un peu plus de couleur sans toucher aux étoiles (masque tiré de L sans étoiles, courbes chrominance et saturation).
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : masque de luminance tiré de L sans étoiles (script Masque_auto, source = L, s = 0,20, gamma 2 : fort sur le cœur et les bras brillants, faible sur le halo et les bras faibles ; étoiles de RGB_stars retirées du masque) attaché, CurvesTransformation c 0,46094 -> 0,53646 et S 0,46354 -> 0,54167, masque retiré.
> 
> À RÉGLER : glisse sur l'image finie avec étoiles ; L (sans étoiles, étirée) doit être ouverte.
> 
> SI :
> - masque encore trop large -> gamma 3 dans Masque_L_source
> - trop fort -> rapproche les points de la diagonale
> - étoiles touchées -> vérifie que L est bien la version sans étoiles

#### Opt_Agrandir_x2 — Resample
   xSize=2.000000 ; ySize=2.000000 ; mode=RelativeDimensions ; absoluteMode=ForceWidthAndHeight ; interpolation=Lanczos3 ; clampingThreshold=0.30 ; smoothness=1.50 ; noGUIMessages=true

> OPTION — après Binning_x2, pour un grand tirage : image agrandie 2 fois (Lanczos 3) juste avant Export_TIFF
> Ne recrée pas le détail perdu.
> 
> PRÉRÉGLÉ : Resample : × 2 en largeur et hauteur, Lanczos 3, seuil d'écrêtage 0,30.
> 
> À RÉGLER : glisse sur l'image finie, juste avant ICC_sRGB et Export_TIFF ; seulement après Binning_x2, pour un grand tirage.
> 
> SI :
> - anneaux noirs autour des étoiles -> interpolation Auto ou Bicubic spline

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

#### Opt_Export_TIFF — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Export_TIFF.js`
   paramètres : `nom=`, `suffixe=`, `dossier=`, `icc=true`

> OPTION — tout à la fin : copie enregistrée en TIFF 16 bits sRGB, profil ICC intégré, pour Photoshop, Lightroom ou Affinity.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Export_TIFF : copie de l'image en entiers 16 bits, convertie en sRGB IEC61966-2.1 (icc = true), enregistrée en TIFF (.tiff) sous le NOM DE L'OBJET, sans espace (NGC 1532 -> NGC1532), = nom du dossier des masters ouverts (L, R, G, B, H…), dossiers génériques (master, lights, output, WBPP…) sautés ; enregistrée dans ce dossier ; l'image ouverte ne change pas.
> 
> À RÉGLER : glisse sur l'image finie (après Etoiles_screen) ; aucune vue n'est fermée ; copie Export_TIFF.js dans src/scripts/clodoweg.
> 
> SI :
> - aucun master ouvert -> mot-clé OBJECT, sinon nom de la vue, dans ton dossier personnel
> - autre nom -> remplis nom
> - autre dossier -> remplis dossier
> - garder plusieurs versions -> suffixe (ex. _v2)
> - garder le profil actuel -> icc false

### P7_rapide

#### R_C_Etoiles_fond_rapide — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fond_desature.js`
      paramètres : `debut=0.03`, `fin=0.15`, `violetFin=0.30`, `flou=3`, `dialogue=false`
   2. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fond_auto.js`
      paramètres : `cible=0.12`, `tolerance=0.005`, `grille=8`, `dialogue=false`
   3. PixelMath
      expression = `~((~$T) * (~RGB_stars))` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Export_TIFF.js`
      paramètres : `nom=`, `suffixe=`, `dossier=`, `icc=true`, `dialogue=false`

> MODE RAPIDE, à la place de Fond_desature, Fond_auto, Etoiles_screen et Export_TIFF : sur l'image sans étoiles finie, RGB_stars et L ouvertes.
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : Fond_desature (teinte et violet du fond retirés), Fond_auto (fond amené à 0,12, neutre), Etoiles_screen (~((~$T) * (~RGB_stars))), Export_TIFF (copie TIFF 16 bits sRGB nommée d'après le dossier des masters).
> 
> À RÉGLER : glisse sur l'image sans étoiles finie ; RGB_stars et L ouvertes ; l'image est finie et exportée.
> 
> SI :
> - étoiles trop présentes -> Etoiles_reduites (à la place d'Etoiles_screen)
> - grosses étoiles presque blanches -> Saturation_grosses (avant)
> - image trop sombre -> Fond_auto_clair à la place de Fond_auto, puis Etoiles_screen
