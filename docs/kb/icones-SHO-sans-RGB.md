# Icônes du fichier Conteneurs-SHO-sans-RGB.xpsm

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

#### E02_Masters_S_H_O — NoOperation

> PRÉRÉGLÉ : rien (icône-note).
> 
> À RÉGLER : renomme tes masters S, H et O ; même recadrage pour tous.

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

## P3_Lineaire

#### E09_Combinaison_SHO — PixelMath
   expression = `S` ; expression1 = `H` ; expression2 = `O` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=SHO ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=RGB ; newImageSampleFormat=SameAsTarget

> PRÉRÉGLÉ : R = S, G = H, B = O, image 'SHO'.
> 
> À RÉGLER : nomme tes masters S, H et O.

#### E10_C_SHO_lineaire — ProcessContainer
   1. BlurXTerminator
      ml_version=4 ; correct_only=false ; sharpen_stars=0.25 ; adjust_star_halos=0.00 ; nonstellar_diameter=0.0 ; auto_nonstellar_psf=true ; sharpen_nonstellar=0.60 ; lunar_planetary=false ; overlap=0.20
   2. StarXTerminator
      ml_version=0 ; output_stars=true ; unscreen=false ; remove_stars=true ; remove_spikes=true ; remove_aureoles=true ; remove_reflections=true ; overlap=0.20

> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> CONTENEUR : BXT_NB, SXT_lineaire.
> 
> SUR : l'image SHO combinée, linéaire.
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

#### E13_NXT_H — NoiseXTerminator
   ml_version=0 ; denoise=0.60 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> PRÉRÉGLÉ : Denoise 0,60, 1 itération.
> 
> À RÉGLER : rien.
> 
> SI :
> - encore bruité -> 0,70
> - aspect plastique -> 0,50

#### E14_NXT_O_S — NoiseXTerminator
   ml_version=0 ; denoise=0.75 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> PRÉRÉGLÉ : Denoise 0,75, 1 itération.
> 
> À RÉGLER : rien.
> 
> SI :
> - très bruité -> 2 itérations
> - aspect plastique -> 0,60

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

## P5_Couleur

#### E18_NBN_SHO — NarrowbandNormalization
   palette=Palette_SHO ; lightness=Lightness_Off ; blendMode=Blend_Mode1 ; haBlend=0.000 ; scnr=0.000 ; o3Boost=0.000 ; s2Boost=0.000 ; shadowpoint=1.000 ; highlightReduction=0.000 ; brightness=0.000

> PRÉRÉGLÉ : palette SHO, boosts à 0.
> 
> À RÉGLER : Lightness = H ; Shadowpoint pour un fond gris foncé ; O3 puis S2 boost peu à peu.
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

## P6_Finition

#### E19_C_Finition — ProcessContainer
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
> SUR : l'image sans étoiles étirée (masque créé, attaché puis retiré automatiquement).
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
> - autre rendu -> Sharp_USM (P6 options) à la place

### P6_options

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

#### Opt_HDRMT_30 — ProcessContainer
   1. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=HDR_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   2. HDRMultiscaleTransform
      numberOfLayers=6 ; numberOfIterations=1 ; invertedIterations=true ; overdrive=0.000 ; medianTransform=false ; scalingFunctionData=0.003906,0.015625,0.023438,0.015625,0.003906,0.015625,0.0625,0.09375,0.0625,0… ; scalingFunctionRowFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionColFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionName=B3 Spline (5) ; deringing=false ; smallScaleDeringing=0.000 ; largeScaleDeringing=0.250 ; outputDeringingMaps=false ; midtonesBalanceMode=Automatic ; midtonesBalance=0.500000 ; toIntensity=false ; toLightness=true ; preserveHue=true ; lightnessMask=true ; intensity=1.00
   3. PixelMath
      expression = `a = 0.3;    a*$T + (1 - a)*HDR_avant` ; useSingleExpression=true ; symbols = `a` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=HDR_avant`, `dialogue=false`

> OPTION — cœur un peu trop clair, mais HDRMT_40 aplatit trop (HDRMT appliqué à 30 %, effet plus léger).
> 
> LANCEMENT : GLISSE l'icône sur l'image (le rond Apply Global ne marche pas : les process de ce conteneur ont besoin d'une image).
> 
> PRÉRÉGLÉ : conteneur : copie de l'image (vue HDR_avant), HDRMT 6 couches To lightness / Preserve hue / Lightness mask, mélange 0,3 × résultat + 0,7 × copie, puis fermeture de la copie.
> 
> À RÉGLER : PARTIE 1 de la finition (cœur), par défaut : glisse sur l'image sans étoiles étirée, AVANT C_Finition ; la copie HDR_avant est fermée automatiquement.
> 
> SI :
> - cœur encore trop clair -> HDRMT_40 ou HDRMT_50
> - aucun effet visible -> saute la partie 1

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

#### Opt_NXT_final — NoiseXTerminator
   ml_version=0 ; denoise=0.40 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> OPTION — bruit visible sur l'image finale.
> 
> PRÉRÉGLÉ : Denoise 0,40, 1 itération.
> 
> À RÉGLER : seulement si du bruit reste sur l'image finale.
> 
> SI :
> - aspect plastique -> 0,30

## P7_Etoiles

#### E21_NB_to_RGB_Stars — Script
   script `$PXI_SRCDIR/scripts/NBtoRGBStars.js`

> LANCEMENT : glisse l'icône sur l'image. Si l'icône est bloquée après une mise à jour du script, efface son champ MD5.
> 
> PRÉRÉGLÉ : rien (le script ne relit pas l'icône).
> 
> À RÉGLER : étoiles H et O (S en option), linéaires ; Apply Star Stretch 5 / 1,0.
> 
> SI :
> - étoiles bleues verdâtres -> active le ratio et monte-le

#### E22_Star_Stretch — Script
   script `$PXI_SRCDIR/scripts/star_stretch.js`
   paramètres : `amount=6`, `satAmount=1.3`, `removeGreen=true`, `showPreview=false`

> LANCEMENT : glisse l'icône sur l'image. Si l'icône est bloquée après une mise à jour du script, efface son champ MD5.
> 
> PRÉRÉGLÉ : Stretch Amount 6, Color Boost 1,3, Remove Green (SCNR) coché.
> 
> À RÉGLER : rien ; sur l'image d'étoiles linéaire.
> 
> SI :
> - cœurs d'étoiles blancs (R = G = B = 1) -> 5,5
> - étoiles trop grosses -> 5 ou 4
> - étoiles grisées par le SCNR -> décoche Remove Green
> - étoiles criardes -> Color Boost 1,0

#### E23_Etoiles_reduites — PixelMath
   expression = `S=0.20; W=~((~$T)*(~NBtoRGB_stars)); f1= ~((~mtf(~S,W)/~mtf(~S,$T))*~$T); max($T,f1)` ; useSingleExpression=true ; symbols = `S, W, f1` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget

> PRÉRÉGLÉ : S = 0,20 ; screen + réduction Blanshan avec NBtoRGB_stars, sur l'image elle-même.
> 
> À RÉGLER : à la place d'Etoiles_screen : glisse sur l'image SHO sans étoiles finale.
> 
> SI :
> - étoiles synthétiques -> remplace NBtoRGB_stars par Stars_HOO
> - pour recommencer -> Ctrl+Z

### P7_options

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

#### Opt_Etoiles_plafond — PixelMath
   expression = `s = 0.70; k = 0.06; m = max($T[0], $T[1], $T[2]); t = max(0, (m - s)/(1 - s)); $T*(1 - k*t*t)` ; useSingleExpression=true ; symbols = `s, k, m, t` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget

> OPTION — cœurs d'étoiles cramés à 1 (blanc pur) : glisse sur l'image d'étoiles (RGB_stars) AVANT Etoiles_screen
> En rapide, avant R_C_Etoiles_fond_rapide.
> 
> PRÉRÉGLÉ : PixelMath sur l'image d'étoiles : m = max(R, G, B) ; au-dessus de s = 0,70, les 3 canaux × (1 − k·t²), k = 0,06 : cœur à 1 -> 0,94, couleur (rapport R:G:B) gardée, étoiles sous 0,70 inchangées.
> 
> À RÉGLER : glisse sur RGB_stars (ou l'image d'étoiles de ton workflow) juste AVANT Etoiles_screen ; en rapide, avant R_C_Etoiles_fond_rapide.
> 
> SI :
> - encore trop blanc -> k = 0,10
> - étoiles moyennes touchées -> s = 0,80
> - cœur R = G = B = 1 -> saturé à la prise de vue : reste blanc (à 0,94)

#### Opt_Etoiles_screen — PixelMath
   expression = `~((~$T) * (~NBtoRGB_stars))` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget

> ALTERNATIVE — Recombinaison simple.
> 
> PRÉRÉGLÉ : ~((~$T) * (~NBtoRGB_stars)), sur l'image elle-même.
> 
> À RÉGLER : glisse sur l'image SHO sans étoiles finale ; étoiles de NB to RGB (NBtoRGB_stars), étirées.
> 
> SI :
> - étoiles synthétiques -> remplace par Stars_HOO

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

#### Opt_Fond_desature — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Fond_desature.js`
   paramètres : `debut=0.03`, `fin=0.15`, `violetFin=0.30`, `flou=3`

> OPTION — fond du ciel teinté (violet, bruit de couleur) sur l'image finie : couleur retirée du fond seulement.
> 
> LANCEMENT : glisse l'icône sur l'image = exécution directe avec ces réglages ; double-clic puis Apply Global (rond bleu) = fenêtre de réglages (choix de l'image, curseurs, aperçu, triangle pour enregistrer une nouvelle icône).
> 
> PRÉRÉGLÉ : script Fond_desature : fond mesuré ; zones faibles (luminance lissée sous fond + 0,15, décroissant jusqu'à + 0,30) : violet neutralisé (G remonté jusqu'à min(R, B), magenta seulement) ; fond (sous + 0,03, rampe jusqu'à + 0,15) : couleur retirée.
> 
> À RÉGLER : glisse sur l'image SANS étoiles finie (après NXT_final), avant Fond_auto et Etoiles_screen.
> 
> SI :
> - violet encore visible dans le halo -> violetFin 0,40
> - extensions faibles de la galaxie grisées -> fin 0,10

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
