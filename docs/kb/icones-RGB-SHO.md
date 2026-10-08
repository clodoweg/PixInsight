# Icônes du fichier Conteneurs-RGB-SHO.xpsm

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
   paramètres : `red=R`, `green=G`, `blue=B`, `newId=RGB`, `closeSources=true`, `copyKeywords=true`, `garder=`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Combiner_RGB : R, G, B -> image couleur 'RGB', en-tête FITS du rouge copié (coordonnées et date pour ImageSolver), puis R, G et B fermées sans demander d'enregistrer.
> 
> À RÉGLER : une seule fois par ordinateur : copie Combiner_RGB.js dans src/scripts/clodoweg ; nomme tes masters R, G et B, enregistre-les si tu veux garder une version modifiée (après LPS par exemple), puis lance l'icône.
> 
> SI :
> - garder R, G et B ouvertes -> closeSources = false dans l'icône
> - une image 'RGB' existe déjà -> ferme-la ou renomme-la

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
      paramètres : `red=R`, `green=G`, `blue=B`, `newId=RGB`, `closeSources=true`, `copyKeywords=true`, `garder=`, `dialogue=false`
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/GC_Solver_auto.js`
      paramètres : `gradient=false`, `solve=true`, `solveTout=true`, `defaultDate=2020-01-01T00:00:00`, `dialogue=false`, `metadata_focal=2939`, `metadata_xpixsz=3.76`, `solver_catalogMode=2`, `solver_distortionCorrection=true`, `(+ 42 autres réglages ImageSolver)`

> MODE RAPIDE, à la place de LinearPatternSubtraction, Renommer_auto et ImageSolver (phase 2) : masters seuls ouverts, double-clic puis Apply Global (pas en glissant : ImageSolver échoue sur une image en cours de traitement) ; ensuite la phase 2 sans ImageSolver.
> 
> LANCEMENT : masters seuls ouverts, double-clic puis Apply Global (rond bleu) ; pas en glissant (ImageSolver échoue sur une image en cours de traitement).
> 
> PRÉRÉGLÉ : conteneur : Renommer_auto (S, H, O, R, G, B d'après FILTER), LinearPatternSubtraction sur tous les masters ouverts, Combinaison_RGB (crée RGB pour les étoiles, ferme R, G, B), Solver_auto (ImageSolver sur toutes les images, RGB comprise) ; SHO combinée en phase 3, après le gradient.
> 
> À RÉGLER : masters S, H, O, R, G, B seuls ouverts ; double-clic puis Apply Global (pas en glissant) ; remplace LinearPatternSubtraction, Renommer_auto, Combinaison_RGB et ImageSolver (phase 2) ; ensuite R_Gradient_auto_rapide (RGB comprise), ou la phase 2 du chemin principal sans ImageSolver.
> 
> SI :
> - une étape en erreur -> lis la console, puis fais les icônes une par une
> - pas de R, G, B ouverts -> Combinaison_RGB s'arrête : utilise le rapide du SHO sans RGB, ou le chemin principal
> - masters décalés, bandes noires -> Crop_reference et Crop_appliquer AVANT ce conteneur

### P1_turbo

#### T_Turbo_debut — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Renommer_auto.js`
      paramètres : `dialogue=false`
   2. Script
      script `$PXI_SRCDIR/scripts/clodoweg/LPS_UnClic.js`
      paramètres : `correctColumns=false`, `correctEntireImage=true`, `defectTableFilePath=`, `layersToRemove=9`, `rejectionLimit=3`, `globalRejection=true`, `globalRejectionLimit=5`, `autoBackground=true`, `backgroundReferenceLeft=0`, `backgroundReferenceTop=0`, `backgroundReferenceWidth=512`, `backgroundReferenceHeight=512`, `allOpenImages=true`, `closeWorkingImages=true`, `dialogue=false`
   3. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Combiner_RGB.js`
      paramètres : `red=R`, `green=G`, `blue=B`, `newId=RGB`, `closeSources=true`, `copyKeywords=true`, `garder=`, `dialogue=false`
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/GC_Solver_auto.js`
      paramètres : `gradient=false`, `solve=true`, `solveTout=true`, `defaultDate=2020-01-01T00:00:00`, `dialogue=false`, `metadata_focal=2939`, `metadata_xpixsz=3.76`, `solver_catalogMode=2`, `solver_distortionCorrection=true`, `(+ 42 autres réglages ImageSolver)`
   5. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Gradient_auto.js`
      paramètres : `dialogue=false`
   6. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Lineaire_auto.js`
      paramètres : `etapes=Combinaison_SHO>H`, `dialogue=false`
   7. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=S, H, O`, `dialogue=false`
   8. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Lineaire_auto.js`
      paramètres : `etapes=C_SHO_lineaire>SHO ; C_Extraction_SHO>SHO ; C_RGB_lineaire>RGB`, `dialogue=false`
   9. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=SHO, SHO_stars`, `dialogue=false`

> MODE TURBO, à la place de R_C_Preparation_rapide, R_Gradient_auto_rapide et R_C_Lineaire_rapide (phases 1 à 3) : masters seuls ouverts, Conteneurs du workflow chargé, double-clic puis Apply Global (pas en glissant) ; ensuite GHS_1_premier sur H.
> 
> LANCEMENT : masters seuls ouverts, double-clic puis Apply Global (rond bleu) ; pas en glissant (ImageSolver échoue sur une image en cours de traitement).
> 
> PRÉRÉGLÉ : conteneur, en une fois : Renommer_auto, LinearPatternSubtraction, Combinaison_RGB, Solver_auto (= R_C_Preparation_rapide) ; Gradient_auto (= R_Gradient_auto_rapide, RGB comprise) ; Lineaire_auto Combinaison_SHO, masters S, H, O fermés, Lineaire_auto C_SHO_lineaire, C_Extraction_SHO et C_RGB_lineaire (BXT Correct Only, SPCC, BXT, NXT sur RGB), SHO et SHO_stars fermées (= R_C_Lineaire_rapide) ; résultat : S, H, O sans étoiles, linéaires, et RGB linéaire avec ses étoiles.
> 
> À RÉGLER : masters S, H, O, R, G, B seuls ouverts ; Conteneurs-RGB-SHO chargé ; double-clic puis Apply Global (pas en glissant) ; ensuite GHS sur S, H, O, puis MAS, SXT_RGB_etire, SCNR_etoiles_vert, Fermer_RGB sur RGB.
> 
> SI :
> - une étape échoue -> la console dit laquelle ; lance les icônes R_ une par une pour voir où
> - gradient mal retiré (O, Lune) -> fais plutôt R_C_Preparation_rapide, la phase 2 du chemin principal (MGC + MARS), puis R_C_Lineaire_rapide
> - masters à garder -> enregistre-les AVANT : ils sont fermés sans enregistrer

## P2_Gradient

#### E03_ImageSolver — Script
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

#### E06_SPFC_RGB_filtres — SpectrophotometricFluxCalibration
   narrowbandMode=false ; grayFilterTrCurve=300,0.000,302,0.000,304,0.000,306,0.000,308,0.000,310,0.000,312,0.000,314,0.0… ; grayFilterName=Antlia V Pro Series L (approx. 420-715 nm) ; redFilterTrCurve=594,0,596,0.001,598,0.001,600,0.002,602,0.003,604,0.004,606,0.005,608,0.006,6… ; redFilterName=Antlia V Pro Series R ; greenFilterTrCurve=480,0.001,482,0.004,484,0.009,486,0.018,488,0.053,490,0.151,492,0.357,494,0.6… ; greenFilterName=Antlia V Pro Series G ; blueFilterTrCurve=420,0.002,422,0.006,424,0.021,426,0.088,428,0.237,430,0.418,432,0.611,434,0.7… ; blueFilterName=Antlia V Pro Series B ; grayFilterWavelength=656.3 ; grayFilterBandwidth=3.0 ; redFilterWavelength=656.3 ; redFilterBandwidth=3.0 ; greenFilterWavelength=500.7 ; greenFilterBandwidth=3.0 ; blueFilterWavelength=500.7 ; blueFilterBandwidth=3.0 ; deviceQECurve=402,0.7219,404,0.7367,406,0.75,408,0.7618,410,0.7751,412,0.787,414,0.7944,416… ; deviceQECurveName=Sony IMX411/455/461/533/571 ; broadbandIntegrationStepSize=0.50 ; narrowbandIntegrationSteps=10 ; rejectionLimit=0.30 ; catalogId=GaiaDR3SP ; minMagnitude=0.00 ; limitMagnitude=12.00 ; autoLimitMagnitude=true ; psfStructureLayers=5 ; saturationThreshold=0.75 ; saturationRelative=true ; saturationShrinkFactor=0.10 ; psfNoiseLayers=1 ; psfHotPixelFilterRadius=1 ; psfNoiseReductionFilterRadius=0 ; psfMinStructureSize=0 ; psfMinSNR=40.00 ; psfAllowClusteredSources=false ; psfType=PSFType_Auto ; psfGrowth=1.75 ; psfMaxStars=24576 ; psfSearchTolerance=4.00 ; generateGraphs=false ; generateStarMaps=false ; generateTextFiles=false

> PRÉRÉGLÉ : QE IMX455, filtres Antlia R, G, B, Gaia DR3/SP.
> 
> À RÉGLER : rien ; applique sur l'image RGB combinée linéaire, résolue, avant MGC.

#### E07_MGC_MARS — MultiscaleGradientCorrection
   command= ; useMARSDatabase=true ; grayMARSFilter=L ; redMARSFilter=R ; greenMARSFilter=G ; blueMARSFilter=B ; referenceImageId= ; gradientScale=1024 ; structureSeparation=3 ; modelSmoothness=1.00 ; minFieldRatio=0.017 ; maxFieldRatio=0.167 ; enforceFieldLimits=true ; scaleFactorRK=1.00 ; scaleFactorG=1.00 ; scaleFactorB=1.00 ; showGradientModel=true

> PRÉRÉGLÉ : Gradient scale 1024, Structure separation 3, Smoothness 1,0, MARS Gray = L et R, G, B (la même icône sert pour L et pour l'image RGB), modèle affiché.
> 
> À RÉGLER : après SPFC_RGB_filtres, glisse sur l'image RGB (étoiles) ; une seule fois par ordinateur : section MARS Database, Default Files, puis remplace l'icône (triangle) et enregistre tes icônes.
> 
> SI :
> - erreur « No MARS database files have been selected » -> Default Files dans la section MARS Database
> - « 0 reference image(s) available » ou « No reference data found » -> cible hors de MARS (sud au-delà de −15° environ) : GradientCorrection ou DBE à la place de SPFC + MGC
> - gradient restant dans les coins -> Gradient scale 512 puis 256
> - modèle qui ondule -> Smoothness 3 à 5
> - image couleur -> filtres MARS R, G, B

#### E08_MGC_MARS_H — MultiscaleGradientCorrection
   command= ; useMARSDatabase=true ; grayMARSFilter=Ha ; redMARSFilter=R ; greenMARSFilter=G ; blueMARSFilter=B ; referenceImageId= ; gradientScale=1024 ; structureSeparation=3 ; modelSmoothness=1.00 ; minFieldRatio=0.017 ; maxFieldRatio=0.167 ; enforceFieldLimits=true ; scaleFactorRK=1.00 ; scaleFactorG=1.00 ; scaleFactorB=1.00 ; showGradientModel=true

> PRÉRÉGLÉ : comme MGC_MARS, filtre MARS Gray = Ha.
> 
> À RÉGLER : une seule fois par ordinateur : ouvre l'icône, section MARS Database, clique Default Files (copie la liste des préférences de MGC), puis glisse le triangle sur l'icône pour la remplacer et enregistre tes icônes (Save Process Icons) ; à refaire si tu recharges les icônes de la fiche ; ensuite après SPFC_H, sur le master H.
> 
> SI :
> - cible au sud au-delà de −15° environ (et narrowband au-delà de +75°) -> pas de référence MARS : GradientCorrection ou DBE
> - gradient restant -> Gradient scale 512 puis 256

#### E09_MGC_MARS_O — MultiscaleGradientCorrection
   command= ; useMARSDatabase=true ; grayMARSFilter=OIII ; redMARSFilter=R ; greenMARSFilter=G ; blueMARSFilter=B ; referenceImageId= ; gradientScale=1024 ; structureSeparation=3 ; modelSmoothness=1.00 ; minFieldRatio=0.017 ; maxFieldRatio=0.167 ; enforceFieldLimits=true ; scaleFactorRK=1.00 ; scaleFactorG=1.00 ; scaleFactorB=1.00 ; showGradientModel=true

> PRÉRÉGLÉ : comme MGC_MARS, filtre MARS Gray = OIII.
> 
> À RÉGLER : une seule fois par ordinateur : ouvre l'icône, section MARS Database, clique Default Files (copie la liste des préférences de MGC), puis glisse le triangle sur l'icône pour la remplacer et enregistre tes icônes (Save Process Icons) ; à refaire si tu recharges les icônes de la fiche ; ensuite après SPFC_O, sur le master O.
> 
> SI :
> - cible au sud au-delà de −15° environ (et narrowband au-delà de +75°) -> pas de référence MARS : GradientCorrection ou DBE
> - gradient restant -> Gradient scale 512 puis 256

#### E10_GradientCorrection — GradientCorrection
   reference=0.50 ; lowThreshold=0.20 ; lowTolerance=0.50 ; highThreshold=0.05 ; highTolerance=0.00 ; iterations=15 ; scale=5.00 ; smoothness=0.60 ; downsamplingFactor=16 ; protection=true ; protectionThreshold=0.10 ; protectionAmount=0.50 ; protectionSmoothingFactor=16 ; lowClippingLevel=0.000076 ; automaticConvergence=true ; convergenceLimit=0.00001000 ; maxIterations=10 ; useSimplification=false ; simplificationDegree=1 ; simplificationScale=1024 ; generateSimpleModel=false ; generateGradientModel=false ; generateProtectionMasks=false ; gridSamplingDelta=16

> PRÉRÉGLÉ : valeurs par défaut, Structure protection activée.
> 
> À RÉGLER : rien ; contrôle le modèle de gradient.
> 
> SI :
> - gradient dans les coins -> baisse Gradient scale
> - nébuleuse assombrie -> monte Protection amount

### P2_options

#### Opt_Binning_x2 — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Binning_x2.js`
   paramètres : `facteur=2`

> OPTION — traitement 4 fois plus rapide et moins de bruit (0,528″/px au lieu de 0,264″/px, l'image du CDK17 est suréchantillonnée
> FWHM sous le plafond de 8 px de BXT) : double-clic puis Apply Global juste après ImageSolver (phase 2) ou après R_C_Preparation_rapide, toutes les images divisées par 2
> Pour un grand tirage, Agrandir_x2 avant l'export.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Binning_x2 : IntegerResample −2, moyenne (binning 2×2 logiciel) sur TOUTES les images ouvertes (sauf *_stars) ; solution astrométrique gardée ; mots-clés XPIXSZ et XBINNING mis à jour.
> 
> À RÉGLER : double-clic puis Apply Global, juste APRÈS ImageSolver (phase 2) ou R_C_Preparation_rapide, avant SPFC et MGC ; copie Binning_x2.js dans src/scripts/clodoweg.
> 
> SI :
> - grand tirage voulu -> Agrandir_x2 (P7 options) avant Export_TIFF, ou ne bine pas
> - binning 3×3 -> facteur 3
> - ImageSolver refait ensuite et en échec -> metadata_xpixsz = 7.52 dans l'icône ImageSolver

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

#### Opt_SPFC_S — SpectrophotometricFluxCalibration
   narrowbandMode=true ; grayFilterTrCurve=300,0.000,302,0.000,304,0.000,306,0.000,308,0.000,310,0.000,312,0.000,314,0.0… ; grayFilterName=Antlia V Pro Series L (approx. 420-715 nm) ; redFilterTrCurve=594,0,596,0.001,598,0.001,600,0.002,602,0.003,604,0.004,606,0.005,608,0.006,6… ; redFilterName=Antlia V Pro Series R ; greenFilterTrCurve=480,0.001,482,0.004,484,0.009,486,0.018,488,0.053,490,0.151,492,0.357,494,0.6… ; greenFilterName=Antlia V Pro Series G ; blueFilterTrCurve=420,0.002,422,0.006,424,0.021,426,0.088,428,0.237,430,0.418,432,0.611,434,0.7… ; blueFilterName=Antlia V Pro Series B ; grayFilterWavelength=672.4 ; grayFilterBandwidth=3.0 ; redFilterWavelength=656.3 ; redFilterBandwidth=3.0 ; greenFilterWavelength=500.7 ; greenFilterBandwidth=3.0 ; blueFilterWavelength=500.7 ; blueFilterBandwidth=3.0 ; deviceQECurve=402,0.7219,404,0.7367,406,0.75,408,0.7618,410,0.7751,412,0.787,414,0.7944,416… ; deviceQECurveName=Sony IMX411/455/461/533/571 ; broadbandIntegrationStepSize=0.50 ; narrowbandIntegrationSteps=10 ; rejectionLimit=0.30 ; catalogId=GaiaDR3SP ; minMagnitude=0.00 ; limitMagnitude=12.00 ; autoLimitMagnitude=true ; psfStructureLayers=5 ; saturationThreshold=0.75 ; saturationRelative=true ; saturationShrinkFactor=0.10 ; psfNoiseLayers=1 ; psfHotPixelFilterRadius=1 ; psfNoiseReductionFilterRadius=0 ; psfMinStructureSize=0 ; psfMinSNR=40.00 ; psfAllowClusteredSources=false ; psfType=PSFType_Auto ; psfGrowth=1.75 ; psfMaxStars=24576 ; psfSearchTolerance=4.00 ; generateGraphs=false ; generateStarMaps=false ; generateTextFiles=false

> OPTION — seulement si ta base MARS couvre S (pas le cas de DR2).
> 
> PRÉRÉGLÉ : QE IMX455, Narrowband 672,4 nm, 3 nm.
> 
> À RÉGLER : rien ; S n'est pas dans MARS : utilise plutôt GradientCorrection ou DBE.

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

#### E11_Combinaison_SHO — PixelMath
   expression = `S` ; expression1 = `H` ; expression2 = `O` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=SHO ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=RGB ; newImageSampleFormat=SameAsTarget

> PRÉRÉGLÉ : R = S, G = H, B = O, image 'SHO'.
> 
> À RÉGLER : nomme tes masters S, H et O.

#### E12_C_SHO_lineaire — ProcessContainer
   1. BlurXTerminator
      ml_version=4 ; correct_only=false ; sharpen_stars=0.25 ; adjust_star_halos=0.00 ; nonstellar_diameter=0.0 ; auto_nonstellar_psf=true ; sharpen_nonstellar=0.60 ; lunar_planetary=false ; overlap=0.20
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

#### E13_C_Extraction_SHO — ProcessContainer
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

#### E14_C_RGB_lineaire — ProcessContainer
   1. BlurXTerminator
      ml_version=4 ; correct_only=true ; sharpen_stars=0.25 ; adjust_star_halos=0.00 ; nonstellar_diameter=0.0 ; auto_nonstellar_psf=true ; sharpen_nonstellar=0.50 ; lunar_planetary=false ; overlap=0.20
   2. SpectrophotometricColorCalibration
      applyCalibration=true ; narrowbandMode=false ; narrowbandOptimizeStars=false ; whiteReferenceSpectrum=200.5,0.0715066,201.5,0.0689827,202.5,0.0720216,203.5,0.0685511,204.5,0.07123… ; whiteReferenceName=Average Spiral Galaxy ; redFilterTrCurve=594,0,596,0.001,598,0.001,600,0.002,602,0.003,604,0.004,606,0.005,608,0.006,6… ; redFilterName=Antlia V Pro Series R ; greenFilterTrCurve=480,0.001,482,0.004,484,0.009,486,0.018,488,0.053,490,0.151,492,0.357,494,0.6… ; greenFilterName=Antlia V Pro Series G ; blueFilterTrCurve=420,0.002,422,0.006,424,0.021,426,0.088,428,0.237,430,0.418,432,0.611,434,0.7… ; blueFilterName=Antlia V Pro Series B ; redFilterWavelength=656.3 ; redFilterBandwidth=3.0 ; greenFilterWavelength=500.7 ; greenFilterBandwidth=3.0 ; blueFilterWavelength=500.7 ; blueFilterBandwidth=3.0 ; deviceQECurve=402,0.7219,404,0.7367,406,0.75,408,0.7618,410,0.7751,412,0.787,414,0.7944,416… ; deviceQECurveName=Sony IMX411/455/461/533/571 ; broadbandIntegrationStepSize=0.50 ; narrowbandIntegrationSteps=10 ; catalogId=GaiaDR3SP ; limitMagnitude=12.00 ; autoLimitMagnitude=true ; targetSourceCount=8000 ; psfStructureLayers=5 ; saturationThreshold=0.75 ; saturationRelative=true ; saturationShrinkFactor=0.10 ; psfNoiseLayers=1 ; psfHotPixelFilterRadius=1 ; psfNoiseReductionFilterRadius=0 ; psfMinStructureSize=0 ; psfMinSNR=40.00 ; psfAllowClusteredSources=true ; psfType=PSFType_Auto ; psfGrowth=1.25 ; psfMaxStars=24576 ; psfSearchTolerance=4.00 ; psfChannelSearchTolerance=2.00 ; neutralizeBackground=true ; backgroundReferenceViewId= ; backgroundLow=-2.80 ; backgroundHigh=2.00 ; backgroundUseROI=false ; backgroundROIX0=0 ; backgroundROIY0=0 ; backgroundROIX1=0 ; backgroundROIY1=0 ; generateGraphs=false ; generateStarMaps=false ; generateTextFiles=false ; outputDirectory=
   3. BlurXTerminator
      ml_version=4 ; correct_only=false ; sharpen_stars=0.25 ; adjust_star_halos=0.00 ; nonstellar_diameter=0.0 ; auto_nonstellar_psf=true ; sharpen_nonstellar=0.50 ; lunar_planetary=false ; overlap=0.20
   4. NoiseXTerminator
      ml_version=0 ; denoise=0.80 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> CONTENEUR : BXT_CorrectOnly, SPCC, BXT_RGB, NXT_RGB.
> 
> SUR : l'image RGB combinée, linéaire, gradient retiré (étoiles gardées) : BXT Correct Only, SPCC, BXT, NXT.
> 
> Double-clic sur le conteneur pour voir ou changer les réglages de chaque étape.

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

#### Opt_Copie_RGB_continuum — PixelMath
   expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=RGB_cont ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=RGB ; newImageSampleFormat=SameAsTarget

> OPTION — lancée par C_Continuum_prep (ne pas utiliser seule) : copie RGB_cont du RGB linéaire.
> 
> PRÉRÉGLÉ : PixelMath $T -> nouvelle image RGB_cont (copie du RGB).
> 
> À RÉGLER : rien : lancée par Opt_C_Continuum_prep.

#### Opt_SXT_RGB_continuum — StarXTerminator
   ml_version=0 ; output_stars=false ; unscreen=false ; remove_stars=true ; remove_spikes=true ; remove_aureoles=true ; remove_reflections=true ; overlap=0.20

> OPTION — lancée par C_Continuum_prep (ne pas utiliser seule) : étoiles retirées de RGB_cont, sans image d'étoiles.
> 
> PRÉRÉGLÉ : StarXTerminator, Unscreen décoché (linéaire), sans image d'étoiles, Remove reflections coché.
> 
> À RÉGLER : rien : lancée par Opt_C_Continuum_prep sur RGB_cont.
> 
> SI :
> - quadrillage -> Large overlap

#### Opt_C_Continuum_prep — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Lineaire_auto.js`
      paramètres : `etapes=Opt_Copie_RGB_continuum>RGB ; Opt_SXT_RGB_continuum>RGB_cont`, `dialogue=false`

> OPTION — continuum retiré de H, O, S (lumière d'étoiles et de poussière hors des canaux)
> Pas sur une nébuleuse en émission brillante (cœur noirci : son émission est aussi dans R et G) : étape 1 de 3, fin de phase 3 (après C_Extraction_SHO et C_RGB_lineaire, ou après R_C_Lineaire_rapide)
> Double-clic puis Apply Global : copie RGB_cont du RGB, sans étoiles (RGB garde les siennes pour MAS).
> 
> LANCEMENT : double-clic puis Apply Global (rond bleu) ; pas en glissant (les scripts du conteneur choisissent eux-mêmes leurs vues).
> 
> PRÉRÉGLÉ : conteneur de scripts : Lineaire_auto lance Opt_Copie_RGB_continuum sur RGB (crée RGB_cont) puis Opt_SXT_RGB_continuum sur RGB_cont (étoiles retirées) ; RGB n'est pas touché.
> 
> À RÉGLER : à la fin de la phase 3 : S, H, O extraits SANS étoiles et RGB linéaire ouverts (après C_Extraction_SHO et C_RGB_lineaire, ou R_C_Lineaire_rapide) ; double-clic puis Apply Global (pas en glissant) ; ensuite Opt_Continuum_SHO.
> 
> SI :
> - une image RGB_cont existe déjà -> ferme-la avant

#### Opt_Continuum_SHO — Script
   script `$PXI_SRCDIR/scripts/ContinuumSubtraction.js`
   paramètres : `applyNoiseReduction=false`, `noiseReductionMethod=NoiseXterminator`, `starrySelected=false`, `outputLinearImageOnly=true`, `aiModel=2.0.0`

> OPTION — étape 2 de 3, après C_Continuum_prep : double-clic puis Apply Global, fenêtre : Ha = H, OIII = O, SII = S, Red (or RGB) = RGB_cont, Green = Select Image, Starless coché
> Crée HaNB, OIIINB, SIINB.
> 
> LANCEMENT : double-clic sur l'icône, puis Apply Global. Si l'icône est bloquée après une mise à jour du script, efface son champ MD5.
> 
> PRÉRÉGLÉ : script SetiAstro ContinuumSubtraction.js : Starless (coefficient 1,0 : images SANS étoiles), sortie linéaire seule, pas de réduction de bruit ; H et S moins le rouge de RGB_cont, O moins son vert ; crée HaNB, SIINB, OIIINB (gris, linéaires).
> 
> À RÉGLER : après Opt_C_Continuum_prep (S, H, O sans étoiles et RGB_cont ouverts) : double-clic puis Apply Global ; fenêtre : Ha = H, OIII = O, SII = S, Red (or RGB) = RGB_cont, Green = Select Image (pas un RGB : ce champ veut une image en gris), Starless coché ; Execute ; ensuite Opt_C_Continuum_fin.
> 
> SI :
> - zones NOIRES dans HaNB, SIINB ou OIIINB (cœur brillant, R ou G proche de 1 dans RGB_cont) -> l'émission de la nébuleuse est aussi dans le rouge et le vert : ne lance PAS C_Continuum_fin, ferme les *NB et garde S, H, O (option à éviter sur une nébuleuse en émission brillante)
> - « The image RGB_cont is the wrong color space » -> RGB_cont mis dans Green : remets Green sur Select Image
> - vue créée HaNB1 (ou OIIINB1…) -> ferme les anciennes *NB avant
> - SIINB ou OIIINB nettement plus faibles que S ou O sur la nébuleuse -> le rouge contient aussi la raie H, le vert un peu d'OIII : ferme HaNB, OIIINB, SIINB et saute Opt_C_Continuum_fin (S, H, O restent sans continuum retiré)
> - tailles différentes -> masters et RGB doivent avoir le même cadrage (Crop_appliquer)

#### Opt_C_NB_renommer — ProcessContainer
   1. PixelMath
      expression = `HaNB` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=H ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=Gray ; newImageSampleFormat=SameAsTarget
   2. PixelMath
      expression = `OIIINB` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=O ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=Gray ; newImageSampleFormat=SameAsTarget
   3. PixelMath
      expression = `SIINB` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=S ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=Gray ; newImageSampleFormat=SameAsTarget

> OPTION — lancé par C_Continuum_fin (ne pas utiliser seul) : HaNB, OIIINB, SIINB recopiées en H, O, S.
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : PixelMath HaNB -> H, OIIINB -> O, SIINB -> S (nouvelles vues en gris).
> 
> À RÉGLER : rien : lancé par Opt_C_Continuum_fin, après la fermeture de S, H, O.

#### Opt_C_Continuum_fin — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=S, H, O, RGB_cont, RGB_cont_R, RGB_cont_G`, `dialogue=false`
   2. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Lineaire_auto.js`
      paramètres : `etapes=Opt_C_NB_renommer>HaNB`, `dialogue=false`
   3. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=HaNB, OIIINB, SIINB`, `dialogue=false`

> OPTION — étape 3 de 3, après Continuum_SHO : double-clic puis Apply Global
> Ferme S, H, O, RGB_cont, puis HaNB, OIIINB, SIINB deviennent H, O, S
> Ensuite GHS_1_premier sur H.
> 
> LANCEMENT : double-clic puis Apply Global (rond bleu) ; pas en glissant (les scripts du conteneur choisissent eux-mêmes leurs vues).
> 
> PRÉRÉGLÉ : conteneur de scripts : Fermer_vues ferme S, H, O, RGB_cont (et RGB_cont_R, RGB_cont_G si le script les a laissées) ; Lineaire_auto lance Opt_C_NB_renommer (HaNB, OIIINB, SIINB recopiées en H, O, S) ; Fermer_vues ferme HaNB, OIIINB, SIINB.
> 
> À RÉGLER : après Opt_Continuum_SHO : double-clic puis Apply Global (pas en glissant) ; ensuite GHS_1_premier sur H, comme sans continuum.
> 
> SI :
> - regarde HaNB, OIIINB, SIINB AVANT : zones noires -> ne lance pas ce conteneur (il ferme S, H, O sans enregistrer)
> - HaNB, OIIINB ou SIINB absente -> la console le dit, rien n'est recréé : relance Continuum_SHO (S, H, O sont déjà fermées : refais la phase 3)

#### Opt_NXT_H — NoiseXTerminator
   ml_version=0 ; denoise=0.60 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> OPTION — ancien réglage par canal, à la place de NXT_NB : NXT 0,60 sur H sans étoiles après l'extraction.
> 
> PRÉRÉGLÉ : option, ancien réglage par canal : Denoise 0,60, 1 itération.
> 
> À RÉGLER : glisse sur H sans étoiles après l'extraction, à la place de NXT_NB (enlève-le du conteneur).
> 
> SI :
> - encore bruité -> 0,70
> - aspect plastique -> 0,50

#### Opt_NXT_O_S — NoiseXTerminator
   ml_version=0 ; denoise=0.75 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> OPTION — ancien réglage par canal : NXT 0,75 sur O et S sans étoiles après l'extraction, à la place de NXT_NB ou en plus si O ou S reste granuleux.
> 
> PRÉRÉGLÉ : option, ancien réglage par canal : Denoise 0,75, 1 itération.
> 
> À RÉGLER : glisse sur O (et S) sans étoiles après l'extraction : à la place de NXT_NB, ou en plus si O ou S reste granuleux.
> 
> SI :
> - très bruité -> 2 itérations
> - aspect plastique -> 0,60

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
      paramètres : `etapes=C_SHO_lineaire>SHO ; C_Extraction_SHO>SHO ; C_RGB_lineaire>RGB`, `dialogue=false`
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=SHO, SHO_stars`, `dialogue=false`

> MODE RAPIDE, à la place de toute la phase 3 (combinaison, conteneur linéaire, extraction) : après R_Gradient_auto_rapide, double-clic puis Apply Global (pas en glissant) ; Conteneurs du workflow chargé ; ensuite GHS_1_premier sur H.
> 
> LANCEMENT : double-clic puis Apply Global (rond bleu) ; pas en glissant (les scripts du conteneur choisissent eux-mêmes leurs vues).
> 
> PRÉRÉGLÉ : conteneur de scripts : Lineaire_auto lance Combinaison_SHO (crée SHO) ; Fermer_vues ferme les masters S, H, O ; Lineaire_auto lance C_SHO_lineaire sur SHO (BXT_NB, SXT_lineaire, NXT_NB 0,75), C_Extraction_SHO sur SHO (crée S, H, O sans étoiles) et C_RGB_lineaire sur RGB (BXT Correct Only, SPCC, BXT, NXT 0,80 : RGB reste linéaire avec ses étoiles) ; Fermer_vues ferme SHO et SHO_stars.
> 
> À RÉGLER : après R_Gradient_auto_rapide (ou la phase 2), double-clic puis Apply Global (pas en glissant) ; le fichier Conteneurs du workflow doit être chargé (icônes E## lancées par Lineaire_auto) ; les masters sont FERMÉS sans enregistrer : enregistre-les avant si tu veux les garder ; ensuite GHS_1_premier sur H ; RGB doit être combinée et résolue (R_C_Preparation_rapide ou phase 1-2) ; en phase 4 : GHS sur S, H, O, puis MAS, SXT_RGB_etire, SCNR_etoiles_vert, Fermer_RGB sur RGB.
> 
> SI :
> - une étape en erreur -> la console dit laquelle ; fais la suite au chemin principal à partir de cette icône
> - NXT par canal voulu (NXT_H, NXT_O_S) -> après ce conteneur, sur les vues extraites
> - BXT, SXT ou NXT à changer -> double-clic sur le conteneur linéaire du chemin principal (c'est lui qui est lancé)
> - pas de RGB ouverte -> l'étape C_RGB_lineaire s'arrête : fais-la au chemin principal

## P4_Etirement

#### E15_GHS_1_premier — GeneralizedHyperbolicStretch
   stretchType=ST_GeneralisedHyperbolic ; stretchChannel=SC_RGB ; inverse=false ; stretchFactor=0.000 ; localIntensity=10.000 ; symmetryPoint=0.000000 ; highlightProtection=1.000000 ; shadowProtection=0.000000 ; blackPoint=0.000000 ; whitePoint=1.000000 ; colourBlend=1.000 ; clipType=CT_RGBBlend ; useRGBWorkingSpace=false

> PRÉRÉGLÉ : b = 10, Stretch factor 0.
> 
> À RÉGLER : étire H d'abord (pic à 0,25 ; Stretch factor 3,5 à 6,5 selon le fond lu), puis O et S jusqu'au MÊME fond (Stretch factor plus élevé).
> 
> SI :
> - bruit de O ou S qui ressort -> SP trop bas, remonte-le

#### E16_GHS_2_contraste — GeneralizedHyperbolicStretch
   stretchType=ST_GeneralisedHyperbolic ; stretchChannel=SC_RGB ; inverse=false ; stretchFactor=1.000 ; localIntensity=4.000 ; symmetryPoint=0.350000 ; highlightProtection=0.900000 ; shadowProtection=0.000000 ; blackPoint=0.000000 ; whitePoint=1.000000 ; colourBlend=1.000 ; clipType=CT_RGBBlend ; useRGBWorkingSpace=false

> PRÉRÉGLÉ : b = 4, HP 0,9, Stretch factor 1, SP 0,35.
> 
> À RÉGLER : SP = valeur de ta zone plate, au-dessus du fond (souvent 0,30–0,45 ; jamais 0,25 = le fond) ; Stretch factor 1 à 2.
> 
> SI :
> - cœur brillant qui sature -> baisse HP vers sa valeur
> - fond trop sombre -> monte LP vers sa valeur (pas au-dessus de SP)
> - fond bruité qui ressort -> SP trop bas

#### E17_GHS_3_fond — GeneralizedHyperbolicStretch
   stretchType=ST_GeneralisedHyperbolic ; stretchChannel=SC_RGB ; inverse=false ; stretchFactor=1.000 ; localIntensity=10.000 ; symmetryPoint=0.200000 ; highlightProtection=0.200000 ; shadowProtection=0.000000 ; blackPoint=0.000000 ; whitePoint=1.000000 ; colourBlend=1.000 ; clipType=CT_RGBBlend ; useRGBWorkingSpace=false

> PRÉRÉGLÉ : b = 10, SP = HP = 0,20, Stretch factor 1 (fond à 0,23 après GHS_2).
> 
> À RÉGLER : SP = HP = fond lu - 0,03 (0,22 après Statistical Stretch à 0,25) ; Stretch factor 0,8 à 1,2 jusqu'au fond vers 0,12–0,14.

#### E18_MAS — MultiscaleAdaptiveStretch
   aggressiveness=0.70 ; targetBackground=0.150 ; dynamicRangeCompression=0.40 ; contrastRecovery=true ; scaleSeparation=1024 ; contrastRecoveryIntensity=1.000 ; previewLargeScale=false ; saturationEnabled=true ; saturationAmount=0.75 ; saturationBoost=0.50 ; saturationLightnessMask=true ; backgroundROIEnabled=false ; backgroundROIX0=0 ; backgroundROIY0=0 ; backgroundROIWidth=0 ; backgroundROIHeight=0

> PRÉRÉGLÉ : MultiscaleAdaptiveStretch, tes réglages : Aggressiveness 0,70, Target background 0,150, Dynamic range compression 0,40, Contrast recovery coché (séparation 1024, intensité 1,0), saturation cochée (0,75, boost 0,50, masque de luminosité).
> 
> À RÉGLER : glisse sur le RGB LINÉAIRE AVEC ses étoiles (après C_RGB_lineaire) ; il ne sert qu'aux étoiles ; ensuite SXT_RGB_etire.
> 
> SI :
> - étoiles trop saturées -> saturation 0,5
> - étoiles toutes blanches -> Aggressiveness plus bas

#### E19_SXT_RGB_etire — StarXTerminator
   ml_version=0 ; output_stars=true ; unscreen=true ; remove_stars=true ; remove_spikes=true ; remove_aureoles=true ; remove_reflections=true ; overlap=0.20

> PRÉRÉGLÉ : StarXTerminator, Unscreen COCHÉ (image étirée), Generate star image coché, Remove reflections coché : RGB sans étoiles + RGB_stars étirée.
> 
> À RÉGLER : glisse sur le RGB juste après MAS ; garde RGB_stars ouverte jusqu'à la recombinaison (phase 7) ; ensuite SCNR_etoiles_vert (options SCNR_etoiles_violet, Saturation_grosses), puis Fermer_RGB.
> 
> SI :
> - morceaux de nébuleuse dans RGB_stars -> masque noir sur les zones brillantes avant SXT
> - quadrillage -> Large overlap

#### E20_SCNR_etoiles_vert — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Etoiles_auto.js`
   paramètres : `vue=RGB_stars`, `amount=0`, `satAmount=0`, `scnr=true`, `violet=false`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Etoiles_auto réglé SCNR seul : SCNR vert, Amount 1,0, Average Neutral, Preserve lightness, sur RGB_stars (amount 0 = pas d'étirement, satAmount 0 = pas de saturation).
> 
> À RÉGLER : glisse sur n'importe quelle image juste après SXT_RGB_etire (traite toujours la vue RGB_stars) : vert retiré des étoiles ; options ensuite : SCNR_etoiles_violet, Saturation_grosses ; le RGB sans étoiles n'est pas touché.
> 
> SI :
> - étoiles grisées ou magenta -> double-clic : décoche SCNR, ou passe un SCNR natif à 0,5 sur RGB_stars
> - autre nom d'étoiles -> vue = ce nom dans l'icône

#### E21_Fermer_RGB — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
   paramètres : `views=RGB`

> PRÉRÉGLÉ : script Fermer_vues : ferme RGB (le RGB sans étoiles ne sert plus : les étoiles sont dans RGB_stars).
> 
> À RÉGLER : double-clic puis Apply Global, après SCNR_etoiles_vert (et les options Saturation_grosses, SCNR_etoiles_violet) ; RGB_stars reste ouverte jusqu'à la recombinaison (phase 7).
> 
> SI :
> - une vue absente est ignorée ; la console dit combien de vues sont fermées

### P4_options

#### Opt_Statistical_Stretch — Script
   script `$PXI_SRCDIR/scripts/statisticalstretch.js`
   paramètres : `targetMedian=0.25`, `curvesBoost=0`, `numIterations=1`, `normalizeImageRange=false`, `linkedStretch=true`, `openDialogbox=true`, `autoConvergence=false`, `blackpointSigma=5`, `noBlackClip=false`, `hdrCompress=false`, `hdrAmount=0.25`, `hdrKnee=0.35`, `lumaOnly=false`, `lumaMode=rec709`, `lumaBlend=0.6`

> ALTERNATIVE — Statistical Stretch sur tout.
> 
> LANCEMENT : glisse l'icône sur l'image. Si l'icône est bloquée après une mise à jour du script, efface son champ MD5.
> 
> PRÉRÉGLÉ : Target Median 0,25, Blackpoint Sigma 5.
> 
> À RÉGLER : rien ; même Target Median pour tous les masters ; avec 0,25, passe ensuite GHS_3_fond.

#### Opt_MAS_canaux — MultiscaleAdaptiveStretch
   aggressiveness=0.70 ; targetBackground=0.150 ; dynamicRangeCompression=0.40 ; contrastRecovery=true ; scaleSeparation=1024 ; contrastRecoveryIntensity=1.000 ; previewLargeScale=false ; saturationEnabled=false ; saturationAmount=0.75 ; saturationBoost=0.50 ; saturationLightnessMask=true ; backgroundROIEnabled=false ; backgroundROIX0=0 ; backgroundROIY0=0 ; backgroundROIWidth=0 ; backgroundROIHeight=0

> OPTION — à la place des GHS : MultiscaleAdaptiveStretch sur chaque canal sans étoiles, même fond cible 0,15 pour tous (règle du même fond)
> Glisse sur S, puis H, puis O (ou R_C_MAS_canaux_rapide)
> Non testé en narrowband.
> 
> PRÉRÉGLÉ : MultiscaleAdaptiveStretch, tes réglages MAS (Aggressiveness 0,70, Target background 0,150, Dynamic range compression 0,40, Contrast recovery) ; saturation décochée (canaux en gris).
> 
> À RÉGLER : glisse sur chaque canal SANS étoiles, linéaire (S, H, O ; HOO : H, O), à la place des GHS ; même fond cible pour tous ; ensuite contrôle le fond et la médiane de chaque canal, puis la palette.
> 
> SI :
> - fond d'un canal différent des autres -> GHS_3_fond sur ce canal
> - O ou S trop faible -> Aggressiveness plus haut sur ce canal, ou GHS
> - cœur brûlé -> Dynamic range compression plus haut

#### Opt_EZ_Soft_Stretch — Script
   script `$PXI_SRCDIR/scripts/EZProcessingSuite/EZ_SoftStretch.js`

> OPTION — à la place des GHS : étirement automatique doux de chaque canal sans étoiles (HistogramTransformation, point noir et médiane calculés)
> Même médiane cible pour tous les canaux.
> 
> LANCEMENT : double-clic sur l'icône, puis Apply Global.
> 
> PRÉRÉGLÉ : script EZ Soft Stretch (EZ Processing Suite, Elveteek / darkarchon) : HistogramTransformation avec point noir trouvé dans l'histogramme et fonction de transfert vers une médiane cible ; réglages dans sa fenêtre.
> 
> À RÉGLER : à la place des GHS : clique sur chaque canal SANS étoiles (S, H, O après extraction et NXT), double-clic puis Apply Global ; dans la fenêtre : Target Median 0,15 pour tous les canaux, Expand Low 0,05, Aggressiveness 5, Zero in White Point décoché ; ensuite la palette (même fond sur tous les canaux) ; dépôt https://elveteek.ch/pixinsight-updates/ez-processing-suite/.
> 
> SI :
> - fond trop sombre ou nébuleuse faible -> Target Median 0,20 (défaut) ou Expand Low 0,08
> - fond délavé, gris -> Target Median 0,12
> - fond coupé à noir -> Aggressiveness plus bas (2 à 3)

#### Opt_SCNR_etoiles_violet — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Etoiles_auto.js`
   paramètres : `vue=RGB_stars`, `amount=0`, `satAmount=0`, `scnr=false`, `violet=true`

> OPTION — étoiles violettes (R et B nettement au-dessus de G à la sonde, surtout en LHaRGB) : après SCNR_etoiles_vert, glisse sur n'importe quelle image (traite RGB_stars)
> Invert, SCNR vert 1,0, Invert
> Pas dans le rapide.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Etoiles_auto réglé violet seul : Invert, SCNR vert (Amount 1,0, Average Neutral, Preserve lightness), Invert sur RGB_stars : le magenta (violet) des étoiles retiré.
> 
> À RÉGLER : option, après SCNR_etoiles_vert : glisse sur n'importe quelle image (traite toujours la vue RGB_stars) ; le RGB sans étoiles n'est pas touché ; pas dans le rapide : à la main après R_C_RGB_etire_rapide si besoin ; à vérifier à la sonde : utile si R et B nettement au-dessus de G sur les étoiles bleues.
> 
> SI :
> - étoiles bleues devenues trop vertes ou ternes -> double-clic : décoche « Violet retiré », ou CorrectMagentaStars (moins fort)
> - autre nom d'étoiles -> vue = ce nom dans l'icône

#### Opt_Saturation_grosses — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Saturation_grosses.js`
   paramètres : `vue=RGB_stars`, `taille=7`, `seuil=0.15`, `etendue=12`, `passes=1`

> OPTION — grosses étoiles presque blanches, petites assez colorées : glisse sur n'importe quelle image (traite RGB_stars) après SCNR_etoiles_vert
> Seules les grosses étoiles et leur halo sont saturés
> Pas dans le rapide (à la main après R_C_RGB_etire_rapide si besoin).
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Saturation_grosses sur la vue RGB_stars : masque des grosses étoiles (ouverture morphologique, disque de 7 px sur une copie à 2000 px, au-dessus de 0,15, étendu au halo, flou 12 px) ; sous ce masque, ta courbe de saturation (CurvesTransformation, c : 0,46 -> 0,54 et S : 0,46 -> 0,54, Akima), 1 passe ; petites étoiles intactes.
> 
> À RÉGLER : option P4 : glisse sur n'importe quelle image (traite toujours RGB_stars), après SCNR_etoiles_vert (et SCNR_etoiles_violet) ; pas dans le rapide ; pour régler à l'œil : double-clic puis Apply Global, « Voir le masque », puis Appliquer ; copie Saturation_grosses.js dans src/scripts/clodoweg.
> 
> SI :
> - pas assez saturé -> passes 2
> - moyennes étoiles saturées aussi -> taille 9 ou 11
> - certaines grosses pas saturées -> taille 5, ou seuil 0,10
> - halo pas saturé jusqu'au bord -> etendue 16
> - pour recommencer -> Ctrl+Z sur RGB_stars

### P4_rapide

#### R_C_MAS_canaux_rapide — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Lineaire_auto.js`
      paramètres : `etapes=Opt_MAS_canaux>S,H,O`, `dialogue=false`

> MODE RAPIDE, à la place des GHS sur les canaux : S, H, O (HOO : H, O) linéaires sans étoiles ouverts (après R_C_Lineaire_rapide ou T_Turbo_debut), double-clic puis Apply Global (pas en glissant) ; ensuite la palette.
> 
> LANCEMENT : double-clic puis Apply Global (rond bleu) ; pas en glissant (les scripts du conteneur choisissent eux-mêmes leurs vues).
> 
> PRÉRÉGLÉ : conteneur de scripts : Lineaire_auto lance Opt_MAS_canaux sur S, H et O (fond cible 0,15 pour les trois).
> 
> À RÉGLER : S, H, O linéaires sans étoiles ouverts (après R_C_Lineaire_rapide ou T_Turbo_debut) ; Conteneurs du workflow chargé ; double-clic puis Apply Global (pas en glissant) ; ensuite contrôle des fonds, puis R_C_Palette_rapide ou la palette.
> 
> SI :
> - un canal mal étiré -> Ctrl+Z sur ce canal, puis GHS à la main
> - réglage MAS à changer -> double-clic sur Opt_MAS_canaux (c'est elle qui est lancée)

#### R_C_RGB_etoiles_rapide — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Lineaire_auto.js`
      paramètres : `etapes=MAS>RGB ; SXT_RGB_etire>RGB`, `dialogue=false`
   2. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Etoiles_auto.js`
      paramètres : `vue=RGB_stars`, `amount=0`, `satAmount=0`, `scnr=true`, `violet=false`, `dialogue=false`
   3. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=RGB`, `dialogue=false`

> MODE RAPIDE, à la place de MAS, SXT_RGB_etire, SCNR_etoiles_vert et Fermer_RGB : RGB linéaire avec étoiles ouvert (après C_RGB_lineaire, R_C_Lineaire_rapide ou T_Turbo_debut), double-clic puis Apply Global (pas en glissant) ; options SCNR_etoiles_violet et Saturation_grosses ensuite, sur RGB_stars, à la main si besoin.
> 
> LANCEMENT : double-clic puis Apply Global (rond bleu) ; pas en glissant (les scripts du conteneur choisissent eux-mêmes leurs vues).
> 
> PRÉRÉGLÉ : conteneur de scripts : Lineaire_auto lance MAS (fond 0,15, tes réglages) puis SXT_RGB_etire (Unscreen : crée RGB_stars) sur RGB ; Etoiles_auto : SCNR vert 1,0 sur RGB_stars ; Fermer_vues ferme RGB (sans étoiles, inutile) ; résultat : RGB_stars étirée, prête pour la phase 7.
> 
> À RÉGLER : RGB linéaire avec ses étoiles ouvert, Conteneurs-RGB-SHO chargé (icônes MAS et SXT_RGB_etire du chemin principal) ; double-clic puis Apply Global (pas en glissant) ; à faire avant ou après les GHS de S, H, O.
> 
> SI :
> - étoiles violettes ou grosses étoiles blanches -> SCNR_etoiles_violet ou Saturation_grosses (options P4) sur RGB_stars ensuite
> - MAS à changer -> double-clic sur E##_MAS du chemin principal (c'est elle qui est lancée)
> - une étape échoue -> la console dit laquelle ; fais la suite au chemin principal

## P5_Couleur

#### E22_SHO_simple — PixelMath
   expression = `S` ; expression1 = `H` ; expression2 = `O` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=SHO_etire ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=RGB ; newImageSampleFormat=SameAsTarget

> PRÉRÉGLÉ : R = S, G = H, B = O, nouvelle image SHO_etire.
> 
> À RÉGLER : vues S, H, O étirées, sans étoiles, même fond (après les GHS) : double-clic puis Apply Global, ou glisse sur une des trois ; ensuite NBN_SHO sur SHO_etire.
> 
> SI :
> - une image SHO_etire existe déjà -> ferme-la avant
> - palette Foraxx voulue -> pas besoin : Foraxx_SHO lit S, H, O directement

#### E23_NBN_SHO — NarrowbandNormalization
   palette=Palette_SHO ; lightness=Lightness_Ha ; blendMode=Blend_Mode1 ; haBlend=0.000 ; scnr=0.700 ; o3Boost=1.000 ; s2Boost=1.000 ; shadowpoint=1.000 ; highlightReduction=1.000 ; brightness=1.000

> PRÉRÉGLÉ : palette SHO, Lightness = Ha (H porte le détail), SCNR 0,7 (vert retiré en partie) (demandes de l'utilisateur) ; O3 boost, S2 boost, Brightness, Highlight reduction à 1 (neutres : ce sont des multiplicateurs, 0 rend l'image noire) ; Shadow point 1 (normalisation à partir de la médiane).
> 
> À RÉGLER : glisse sur SHO_etire (SHO_simple) ; O3 puis S2 boost au-dessus de 1, peu à peu ; Shadow point : 1 = normalisation à partir de la médiane, vers 0 = zones faibles aussi (plus de bruit).
> 
> SI :
> - trop vert -> SCNR partiel
> - O discret -> O3 boost

### P5_options

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
      paramètres : `etapes=SHO_simple>H ; NBN_SHO>SHO_etire`, `dialogue=false`
   2. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=S, H, O`, `dialogue=false`

> MODE RAPIDE, à la place de SHO_simple et NBN_SHO : S, H, O étirés (après les GHS, même fond), double-clic puis Apply Global (pas en glissant) ; ensuite la finition sur SHO_etire.
> 
> LANCEMENT : double-clic puis Apply Global (rond bleu) ; pas en glissant (les scripts du conteneur choisissent eux-mêmes leurs vues).
> 
> PRÉRÉGLÉ : conteneur de scripts : Lineaire_auto lance SHO_simple (S, H, O étirés -> SHO_etire) puis NBN_SHO sur SHO_etire (palette SHO, Lightness Ha, SCNR 0,7, boosts à 1) ; Fermer_vues ferme S, H, O.
> 
> À RÉGLER : S, H, O étirés, sans étoiles, même fond (après les GHS) ; Conteneurs du workflow chargé (icônes SHO_simple et NBN_SHO du chemin principal) ; double-clic puis Apply Global (pas en glissant) ; ensuite la finition (phase 6) sur SHO_etire.
> 
> SI :
> - couleurs à affiner (O3, S2 boost, SCNR) -> Ctrl+Z sur SHO_etire, double-clic sur NBN_SHO, aperçu, puis glisse-la sur SHO_etire
> - Foraxx voulu -> pas ce rapide : Foraxx_SHO a besoin de S, H, O
> - une image SHO_etire existe déjà -> ferme-la avant

## P6_Finition

#### E24_HDRMT_30 — ProcessContainer
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

#### E25_C_Finition — ProcessContainer
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

#### E26_C_Sharp_MMT — ProcessContainer
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

#### E27_NXT_final — NoiseXTerminator
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
   paramètres : `etoiles=RGB_stars`, `seuilBas=0.05`, `seuilHaut=0.12`, `etendue=25`, `passes=3`, `protege=0.08`, `structure=0.15`, `compact=0.05`, `tresBrillant=0.05`, `etendue2=80`, `gain=3`, `gain2=8`, `afficherMasque=false`

> OPTION — avant la partie 1, sur l'image sans étoiles après la palette (image d'étoiles ouverte) : taches rondes floues ou halo coloré laissés par SXT autour des étoiles.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Nettoyage_sans_etoiles (calcul sur une copie à 2000 px) : seules les étoiles BRILLANTES de RGB_stars comptent (luminance floutée 20 px au-dessus de 0,05 à 0,12), zone étendue au halo ; fond LOCAL par ouverture morphologique (disque 25 px, 3 passes : taches de moins de 75 px retirées, halo de la galaxie gardé) ; galaxie et structures claires protégées ; excès au-dessus du fond local retiré, bruit fin gardé ; TRÈS grandes étoiles (luminance floutée 50 px au-dessus de 0,05) : zone d'environ 170 px et fond local à grande échelle (environ 300 px).
> 
> À RÉGLER : glisse sur l'image sans étoiles après la palette, AVANT HDRMT_30 ; RGB_stars doit être ouverte (étirée) ; vérifie à 1:1, Ctrl+Z pour annuler.
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

## P7_Etoiles

#### E28_Fond_desature — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Fond_desature.js`
   paramètres : `debut=0.03`, `fin=0.15`, `violetFin=0.30`, `flou=3`

> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Fond_desature : fond mesuré ; zones faibles (luminance lissée sous fond + 0,15, décroissant jusqu'à + 0,30) : violet neutralisé (G remonté jusqu'à min(R, B), magenta seulement) ; fond (sous + 0,03, rampe jusqu'à + 0,15) : couleur retirée.
> 
> À RÉGLER : glisse sur l'image SANS étoiles finie (après NXT_final), avant Fond_auto et la recombinaison des étoiles (Etoiles_reduites ou Etoiles_screen).
> 
> SI :
> - violet encore visible dans les zones faibles -> violetFin 0,40
> - nébuleuse faible grisée -> fin 0,10 ; zones H faibles devenues grises -> saute cette étape

#### E29_Fond_auto — Script
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
> - nébuleuse qui remplit le champ (pas de vrai fond) -> saute cette étape

#### E30_Etoiles_screen — PixelMath
   expression = `~((~$T) * (~RGB_stars))` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget

> PRÉRÉGLÉ : ~((~$T) * (~RGB_stars)), sur l'image elle-même.
> 
> À RÉGLER : glisse sur l'image sans étoiles finale : elle reçoit les étoiles ; étoiles étirées nommées RGB_stars (nom donné par SXT, s minuscule).
> 
> SI :
> - autre nom d'étoiles -> corrige-le dans la formule

#### E31_NXT_dernier — NoiseXTerminator
   ml_version=0 ; denoise=0.25 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> PRÉRÉGLÉ : NoiseXTerminator Denoise 0,25, 1 itération.
> 
> À RÉGLER : toute dernière étape avant l'export : glisse sur l'image finie AVEC ses étoiles, juste après la recombinaison (Etoiles_reduites ou Etoiles_screen).
> 
> SI :
> - aspect plastique -> Denoise 0,15
> - bruit encore visible -> 0,35
> - étoiles adoucies -> 0,15, ou saute cette étape

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
> Attention, réduit aussi les petites étoiles (pour les grosses seulement : Etoiles_grosses).
> 
> LANCEMENT : double-clic sur l'icône, puis Apply Global. Si l'icône est bloquée après une mise à jour du script, efface son champ MD5.
> 
> PRÉRÉGLÉ : rien (réglages dans le dialogue).
> 
> À RÉGLER : Select stars-only image = l'image d'étoiles étirée (RGB_stars ; NBtoRGB_stars en SHO ; HOO_stars en HOO), AVANT Etoiles_screen ; Reduction Amount Low ; Linear Data décoché.
> 
> SI :
> - petites étoiles réduites ou effacées aussi (son masque ne protège que les cœurs) -> Etoiles_grosses à la place
> - pas assez -> relance en Low (Med = 4 courbes, High = 9)

#### Opt_Etoiles_grosses — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Etoiles_grosses.js`
   paramètres : `taille=7`, `seuil=0.15`, `etendue=12`, `force=0.80`, `afficherMasque=false`

> OPTION — grosses étoiles trop présentes, mais Etoiles_reduites réduirait toutes les étoiles : glisse sur l'image d'étoiles (RGB_stars) AVANT Etoiles_screen
> En rapide, avant R_C_Etoiles_fond_rapide.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Etoiles_grosses : masque des grosses étoiles (ouverture morphologique, disque de 7 px sur une copie à 2000 px, au-dessus de 0,15, étendu au halo, flou 12 px) ; sous le masque, luminance -> mtf(0,80, Y) avec un poids qui monte de 0 (Y = 0,10) à 1 (Y = 0,80) : halo faible jamais touché, pas d'anneau sombre ; même facteur sur R, G, B : couleur gardée, petites étoiles intactes.
> 
> À RÉGLER : sur RGB_stars juste AVANT Etoiles_screen (Etoiles_screen ensuite, pas Etoiles_reduites) ; en rapide, avant R_C_Etoiles_fond_rapide ; pour régler à l'œil : double-clic puis Apply Global, « Voir le masque », puis Appliquer ; copie Etoiles_grosses.js dans src/scripts/clodoweg.
> 
> SI :
> - anneau sombre autour des grosses étoiles -> etendue 16 à 20, ou force plus basse (0,70)
> - halo large pas entièrement réduit -> etendue 16
> - moyennes étoiles touchées aussi -> taille 9 ou 11
> - certaines grosses pas réduites -> taille 5, ou seuil 0,10
> - pas assez réduites -> force 0,85 (au plus ; 0,5 = rien)
> - voir ce qui est réduit -> fenêtre (double-clic puis Apply Global), « Voir le masque » (vue masque_grosses)

#### Opt_Fond_auto_clair — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Fond_auto.js`
   paramètres : `cible=0.14`, `tolerance=0.005`, `grille=8`

> OPTION — à la place de Fond_auto : image trop sombre, fond amené à 0,14, après Fond_desature, avant la recombinaison des étoiles.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Fond_auto, cible 0,14 : fond de chaque canal mesuré (grille 8 × 8), amené à 0,14 par mtf, sans écrêtage ; fond neutre.
> 
> À RÉGLER : à la place de Fond_auto, image trop sombre : glisse sur l'image sans étoiles, après Fond_desature, avant la recombinaison des étoiles.
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

#### Opt_CorrectMagentaStars — Script
   script `$PXI_SRCDIR/scripts/CorrectMagentaStars/CorrectMagentaStars.js`
   paramètres : `scnrAmount=0.8`, `scnrPresLight=true`

> OPTION — étoiles magenta.
> 
> LANCEMENT : double-clic sur l'icône, puis Apply Global.
> 
> PRÉRÉGLÉ : Amount 0,8.
> 
> À RÉGLER : rien ; sur l'image SHO finale avec étoiles.
> 
> SI :
> - magenta encore visible -> 1,0

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
