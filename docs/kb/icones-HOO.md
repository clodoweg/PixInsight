# Icônes du fichier Conteneurs-HOO.xpsm

Fichier GÉNÉRÉ par `docs/process-icons/build/build.sh` (kb_icons.py) à partir de l'xpsm : ne pas éditer ; pour changer une icône, modifier le générateur (voir `generateur.md`).

Préfixes : `E##_` chemin principal (dans l'ordre), `Opt_` option, `R_` mode rapide, `C_` conteneur. Les icônes `P#_…` sont des repères de colonne.

## P1_Preparation

#### E00_LinearPatternSubtraction — Script
   script `$PXI_SRCDIR/scripts/clodoweg/LPS_UnClic.js`
   paramètres : `correctColumns=false`, `correctEntireImage=true`, `defectTableFilePath=`, `layersToRemove=9`, `rejectionLimit=3`, `globalRejection=true`, `globalRejectionLimit=5`, `autoBackground=true`, `backgroundReferenceLeft=0`, `backgroundReferenceTop=0`, `backgroundReferenceWidth=512`, `backgroundReferenceHeight=512`, `allOpenImages=true`, `closeWorkingImages=true`

> LANCEMENT : glisse l'icône sur l'image.
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

> LANCEMENT : double-clic sur l'icône, puis Apply Global.
> 
> PRÉRÉGLÉ : script Renommer_auto : renomme les masters mono ouverts L, R, G, B, H, O, S d'après le mot-clé FILTER (Lum, Red, Ha, OIII...), sinon d'après le nom du fichier.
> 
> À RÉGLER : une seule fois par ordinateur : copie Renommer_auto.js dans src/scripts/clodoweg ; ouvre tes masters, puis lance l'icône.
> 
> SI :
> - filtre inconnu ou nom déjà pris -> message dans la console, renomme cette vue à la main

#### E02_Masters_H_O — NoOperation

> PRÉRÉGLÉ : rien (icône-note).
> 
> À RÉGLER : renomme tes masters H et O ; même recadrage.

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

#### Opt_DualBand_H — PixelMath
   expression = `$T[0]` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=H ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=Gray ; newImageSampleFormat=SameAsTarget

> OPTION — caméra couleur avec filtre dual-band.
> 
> PRÉRÉGLÉ : H = canal rouge de l'image couleur.
> 
> À RÉGLER : glisse sur l'image dual-band (caméra couleur seulement).

#### Opt_DualBand_O — PixelMath
   expression = `($T[1] + $T[2]) / 2` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=O ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=Gray ; newImageSampleFormat=SameAsTarget

> OPTION — caméra couleur avec filtre dual-band.
> 
> PRÉRÉGLÉ : O = moyenne de G et B.
> 
> À RÉGLER : glisse sur l'image dual-band (caméra couleur seulement).

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

#### E09_Combinaison_HOO — PixelMath
   expression = `H` ; expression1 = `O` ; expression2 = `O` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=HOO ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=RGB ; newImageSampleFormat=SameAsTarget

> PRÉRÉGLÉ : R = H, G = O, B = O, image 'HOO'.
> 
> À RÉGLER : nomme tes masters H et O.

#### E10_C_HOO_lineaire — ProcessContainer
   1. BlurXTerminator
      ml_version=4 ; correct_only=false ; sharpen_stars=0.25 ; adjust_star_halos=0.00 ; nonstellar_diameter=0.0 ; auto_nonstellar_psf=true ; sharpen_nonstellar=0.60 ; lunar_planetary=false ; overlap=0.20
   2. StarXTerminator
      ml_version=0 ; output_stars=true ; unscreen=false ; remove_stars=true ; remove_spikes=true ; remove_aureoles=true ; remove_reflections=true ; overlap=0.20

#### E11_C_Extraction_HOO — ProcessContainer
   1. PixelMath
      expression = `$T[0]` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=H ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=Gray ; newImageSampleFormat=SameAsTarget
   2. PixelMath
      expression = `$T[1]` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=O ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=Gray ; newImageSampleFormat=SameAsTarget

#### E12_NXT_H — NoiseXTerminator
   ml_version=0 ; denoise=0.60 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> PRÉRÉGLÉ : Denoise 0,60, 1 itération.
> 
> À RÉGLER : rien.
> 
> SI :
> - encore bruité -> 0,70
> - aspect plastique -> 0,50

#### E13_NXT_O_S — NoiseXTerminator
   ml_version=0 ; denoise=0.75 ; enable_color_separation=false ; enable_frequency_separation=false ; denoise_intensity=0.90 ; denoise_color=0.90 ; denoise_high_freq=0.90 ; denoise_low_freq=0.90 ; denoise_intensity_high_freq=0.90 ; denoise_intensity_low_freq=0.90 ; denoise_color_high_freq=0.90 ; denoise_color_low_freq=0.90 ; frequency_scale=5.0 ; iterations=1 ; detail=0.15 ; overlap=0.20

> PRÉRÉGLÉ : Denoise 0,75, 1 itération.
> 
> À RÉGLER : rien.
> 
> SI :
> - très bruité -> 2 itérations
> - aspect plastique -> 0,60

## P4_Etirement

#### E14_GHS_1_premier — GeneralizedHyperbolicStretch
   stretchType=ST_GeneralisedHyperbolic ; stretchChannel=SC_RGB ; inverse=false ; stretchFactor=0.000 ; localIntensity=10.000 ; symmetryPoint=0.000000 ; highlightProtection=1.000000 ; shadowProtection=0.000000 ; blackPoint=0.000000 ; whitePoint=1.000000 ; colourBlend=1.000 ; clipType=CT_RGBBlend ; useRGBWorkingSpace=false

> PRÉRÉGLÉ : b = 10, Stretch factor 0.
> 
> À RÉGLER : étire H d'abord (pic à 0,25 ; Stretch factor 3,5 à 6,5 selon le fond lu), puis O et S jusqu'au MÊME fond (Stretch factor plus élevé).
> 
> SI :
> - bruit de O ou S qui ressort -> SP trop bas, remonte-le

#### E15_GHS_2_contraste — GeneralizedHyperbolicStretch
   stretchType=ST_GeneralisedHyperbolic ; stretchChannel=SC_RGB ; inverse=false ; stretchFactor=1.000 ; localIntensity=4.000 ; symmetryPoint=0.350000 ; highlightProtection=0.900000 ; shadowProtection=0.000000 ; blackPoint=0.000000 ; whitePoint=1.000000 ; colourBlend=1.000 ; clipType=CT_RGBBlend ; useRGBWorkingSpace=false

> PRÉRÉGLÉ : b = 4, HP 0,9, Stretch factor 1, SP 0,35.
> 
> À RÉGLER : SP = valeur de ta zone plate, au-dessus du fond (souvent 0,30–0,45 ; jamais 0,25 = le fond) ; Stretch factor 1 à 2.
> 
> SI :
> - cœur brillant qui sature -> baisse HP vers sa valeur
> - fond trop sombre -> monte LP vers sa valeur (pas au-dessus de SP)
> - fond bruité qui ressort -> SP trop bas

#### E16_GHS_3_fond — GeneralizedHyperbolicStretch
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

#### E17_HOO_simple — PixelMath
   expression = `H` ; expression1 = `O` ; expression2 = `O` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=HOO_etire ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=RGB ; newImageSampleFormat=SameAsTarget

> PRÉRÉGLÉ : R = H, G = O, B = O.
> 
> À RÉGLER : vues H et O étirées.

#### E18_NBN_HOO — NarrowbandNormalization
   palette=Palette_HOO ; lightness=Lightness_Off ; blendMode=Blend_Mode1 ; haBlend=0.000 ; scnr=0.000 ; o3Boost=0.000 ; s2Boost=0.000 ; shadowpoint=1.000 ; highlightReduction=0.000 ; brightness=0.000

> PRÉRÉGLÉ : palette HOO, boost à 0.
> 
> À RÉGLER : Lightness = H ; Shadowpoint ; O3 boost peu à peu.
> 
> SI :
> - tout rouge -> O3 boost

### P5_options

#### Opt_Foraxx_HOO — PixelMath
   expression = `H` ; expression1 = `((O*H)^~(O*H))*H + ~((O*H)^~(O*H))*O` ; expression2 = `O` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=HOO_Foraxx ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=RGB ; newImageSampleFormat=SameAsTarget

> ALTERNATIVE — Foraxx.
> 
> PRÉRÉGLÉ : formule Foraxx HOO, image 'HOO_Foraxx'.
> 
> À RÉGLER : vues H et O étirées, sans étoiles.

#### Opt_HOO_Hubble — PixelMath
   expression = `H` ; expression1 = `0.6*H + 0.4*O` ; expression2 = `O` ; useSingleExpression=false ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=HOO_Hubble ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=RGB ; newImageSampleFormat=SameAsTarget

> ALTERNATIVE — Variante Hubble.
> 
> PRÉRÉGLÉ : G = 0,6·H + 0,4·O.
> 
> À RÉGLER : vues H et O étirées ; ajuste les coefficients.

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

#### Opt_H_en_luminance — LRGBCombination
   mL=0.500 ; mc=0.400 ; clipHighlights=false ; noiseReduction=true ; layersRemoved=4 ; layersProtected=2 ; inheritAstrometricSolution=true ; table channels (4 lignes)

> OPTION — détail plus net en HOO (H en luminance).
> 
> PRÉRÉGLÉ : seul L coché, Lightness 0,5, Saturation 0,40.
> 
> À RÉGLER : copie de H étiré nommée 'L' ; glisse sur l'image HOO.

## P6_Finition

#### E19_C_Finition — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=attacher`, `s=0.14`, `flou=2`, `nom=masque_L`
   2. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (4 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (2 lignes) ; table H (2 lignes) ; table S (3 lignes)
   3. LocalHistogramEqualization
      radius=150 ; histogramBins=Bit12 ; slopeLimit=2.0 ; amount=0.300 ; circularKernel=true
   4. LocalHistogramEqualization
      radius=40 ; histogramBins=Bit10 ; slopeLimit=2.0 ; amount=0.250 ; circularKernel=true
   5. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`

### P6_options

#### Opt_Boost_finition_light — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=attacher`, `s=0.14`, `flou=2`, `nom=masque_L`
   2. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (4 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (2 lignes) ; table H (2 lignes) ; table S (3 lignes)
   3. LocalHistogramEqualization
      radius=80 ; histogramBins=Bit10 ; slopeLimit=2.0 ; amount=0.120 ; circularKernel=true
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`

#### Opt_Boost_finition — ProcessContainer
   1. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=attacher`, `s=0.14`, `flou=2`, `nom=masque_L`
   2. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (4 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (2 lignes) ; table H (2 lignes) ; table S (3 lignes)
   3. LocalHistogramEqualization
      radius=80 ; histogramBins=Bit10 ; slopeLimit=2.0 ; amount=0.200 ; circularKernel=true
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`

#### Opt_HDRMT_30 — ProcessContainer
   1. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=HDR_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   2. HDRMultiscaleTransform
      numberOfLayers=6 ; numberOfIterations=1 ; invertedIterations=true ; overdrive=0.000 ; medianTransform=false ; scalingFunctionData=0.003906,0.015625,0.023438,0.015625,0.003906,0.015625,0.0625,0.09375,0.0625,0… ; scalingFunctionRowFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionColFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionName=B3 Spline (5) ; deringing=false ; smallScaleDeringing=0.000 ; largeScaleDeringing=0.250 ; outputDeringingMaps=false ; midtonesBalanceMode=Automatic ; midtonesBalance=0.500000 ; toIntensity=false ; toLightness=true ; preserveHue=true ; lightnessMask=true ; intensity=1.00
   3. PixelMath
      expression = `a = 0.3;    a*$T + (1 - a)*HDR_avant` ; useSingleExpression=true ; symbols = `a` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=HDR_avant`

#### Opt_HDRMT_50 — ProcessContainer
   1. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=HDR_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   2. HDRMultiscaleTransform
      numberOfLayers=6 ; numberOfIterations=1 ; invertedIterations=true ; overdrive=0.000 ; medianTransform=false ; scalingFunctionData=0.003906,0.015625,0.023438,0.015625,0.003906,0.015625,0.0625,0.09375,0.0625,0… ; scalingFunctionRowFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionColFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionName=B3 Spline (5) ; deringing=false ; smallScaleDeringing=0.000 ; largeScaleDeringing=0.250 ; outputDeringingMaps=false ; midtonesBalanceMode=Automatic ; midtonesBalance=0.500000 ; toIntensity=false ; toLightness=true ; preserveHue=true ; lightnessMask=true ; intensity=1.00
   3. PixelMath
      expression = `a = 0.5;    a*$T + (1 - a)*HDR_avant` ; useSingleExpression=true ; symbols = `a` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=HDR_avant`

#### Opt_HDRMT_eclat — ProcessContainer
   1. PixelMath
      expression = `$T` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=true ; showNewImage=true ; newImageId=HDR_avant ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   2. HDRMultiscaleTransform
      numberOfLayers=6 ; numberOfIterations=1 ; invertedIterations=true ; overdrive=0.000 ; medianTransform=false ; scalingFunctionData=0.003906,0.015625,0.023438,0.015625,0.003906,0.015625,0.0625,0.09375,0.0625,0… ; scalingFunctionRowFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionColFilter=0.0625,0.25,0.375,0.25,0.0625 ; scalingFunctionName=B3 Spline (5) ; deringing=false ; smallScaleDeringing=0.000 ; largeScaleDeringing=0.250 ; outputDeringingMaps=false ; midtonesBalanceMode=Automatic ; midtonesBalance=0.500000 ; toIntensity=false ; toLightness=true ; preserveHue=true ; lightnessMask=true ; intensity=1.00
   3. PixelMath
      expression = `a = 0.4;    a*$T + (1 - a)*HDR_avant` ; useSingleExpression=true ; symbols = `a` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget
   4. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Fermer_vues.js`
      paramètres : `views=HDR_avant`
   5. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=attacher`, `s=0.14`, `flou=2`, `nom=masque_L`
   6. CurvesTransformation
      Rt=AkimaSubsplines ; Gt=AkimaSubsplines ; Bt=AkimaSubsplines ; Kt=AkimaSubsplines ; At=AkimaSubsplines ; Lt=AkimaSubsplines ; at=AkimaSubsplines ; bt=AkimaSubsplines ; ct=AkimaSubsplines ; Ht=AkimaSubsplines ; St=AkimaSubsplines ; table R (2 lignes) ; table G (2 lignes) ; table B (2 lignes) ; table K (4 lignes) ; table A (2 lignes) ; table L (2 lignes) ; table a (2 lignes) ; table b (2 lignes) ; table c (2 lignes) ; table H (2 lignes) ; table S (3 lignes)
   7. LocalHistogramEqualization
      radius=80 ; histogramBins=Bit10 ; slopeLimit=2.0 ; amount=0.120 ; circularKernel=true
   8. Script
      script `$PXI_SRCDIR/scripts/clodoweg/Masque_auto.js`
      paramètres : `mode=retirer`, `nom=masque_L`

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

#### E20_Etoiles_HOO — NoOperation

> PRÉRÉGLÉ : rien (icône-note).
> 
> À RÉGLER : avec RGB : étoiles RGB ; sans RGB : étoiles de SXT, NB to RGB ou étoiles synthétiques.

#### E21_Star_Stretch — Script
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

#### E22_Etoiles_reduites — PixelMath
   expression = `S=0.20; W=~((~$T)*(~HOO_stars)); f1= ~((~mtf(~S,W)/~mtf(~S,$T))*~$T); max($T,f1)` ; useSingleExpression=true ; symbols = `S, W, f1` ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget

> PRÉRÉGLÉ : S = 0,20 ; screen + réduction Blanshan avec HOO_stars, sur l'image elle-même.
> 
> À RÉGLER : à la place d'Etoiles_screen : glisse sur l'image HOO sans étoiles finale.
> 
> SI :
> - étoiles RGB -> RGB_stars ; NB to RGB -> NBtoRGB_stars
> - pour recommencer -> Ctrl+Z

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
   paramètres : `taille=7`, `seuil=0.15`, `etendue=6`, `force=0.70`, `afficherMasque=false`

> OPTION — grosses étoiles trop présentes, mais Etoiles_reduites réduirait toutes les étoiles : glisse sur l'image d'étoiles (RGB_stars) AVANT Etoiles_screen
> En rapide, avant R_C_Etoiles_fond_rapide.
> 
> LANCEMENT : glisse l'icône sur l'image.
> 
> PRÉRÉGLÉ : script Etoiles_grosses : masque des grosses étoiles (ouverture morphologique, disque de 7 px sur une copie à 2000 px, au-dessus de 0,15, étendu au halo) ; sous le masque, luminance -> mtf(0,70, Y), même facteur sur R, G, B : couleur gardée, petites étoiles intactes.
> 
> À RÉGLER : glisse sur RGB_stars juste AVANT Etoiles_screen (Etoiles_screen ensuite, pas Etoiles_reduites) ; en rapide, avant R_C_Etoiles_fond_rapide ; copie Etoiles_grosses.js dans src/scripts/clodoweg.
> 
> SI :
> - halo large pas entièrement réduit -> etendue 10 à 12
> - moyennes étoiles touchées aussi -> taille 9 ou 11
> - certaines grosses pas réduites -> taille 5, ou seuil 0,10
> - pas assez réduites -> force 0,80 (0,5 = rien)
> - voir ce qui est réduit -> afficherMasque true (vue masque_grosses)

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
   expression = `~((~$T) * (~HOO_stars))` ; useSingleExpression=true ; clearImageCacheAndExit=false ; cacheGeneratedImages=false ; generateOutput=true ; singleThreaded=false ; optimization=true ; use64BitWorkingImage=false ; rescale=false ; rescaleLower=0 ; rescaleUpper=1 ; truncate=true ; truncateLower=0 ; truncateUpper=1 ; createNewImage=false ; showNewImage=true ; newImageId= ; newImageWidth=0 ; newImageHeight=0 ; newImageAlpha=false ; newImageColorSpace=SameAsTarget ; newImageSampleFormat=SameAsTarget

> ALTERNATIVE — Recombinaison simple.
> 
> PRÉRÉGLÉ : ~((~$T) * (~HOO_stars)), sur l'image elle-même.
> 
> À RÉGLER : glisse sur l'image HOO sans étoiles finale ; étoiles de SXT sur HOO (HOO_stars), étirées.
> 
> SI :
> - étoiles RGB -> RGB_stars
> - NB to RGB -> NBtoRGB_stars
> - synthétiques -> Stars_HOO

#### Opt_Fond_desature — Script
   script `$PXI_SRCDIR/scripts/clodoweg/Fond_desature.js`
   paramètres : `debut=0.03`, `fin=0.15`, `violetFin=0.30`, `flou=3`

> OPTION — fond du ciel teinté (violet, bruit de couleur) sur l'image finie : couleur retirée du fond seulement.
> 
> LANCEMENT : glisse l'icône sur l'image.
> 
> PRÉRÉGLÉ : script Fond_desature : fond mesuré ; zones faibles (luminance lissée sous fond + 0,15, décroissant jusqu'à + 0,30) : violet neutralisé (G remonté jusqu'à min(R, B), magenta seulement) ; fond (sous + 0,03, rampe jusqu'à + 0,15) : couleur retirée.
> 
> À RÉGLER : glisse sur l'image finie, étoiles comprises ; dernière étape.
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
   paramètres : `nom=`, `suffixe=`, `dossier=`, `icc=true`, `fermer=L`

> OPTION — tout à la fin : copie enregistrée en TIFF 16 bits sRGB, profil ICC intégré, pour Photoshop, Lightroom ou Affinity.
> 
> LANCEMENT : glisse l'icône sur l'image.
> 
> PRÉRÉGLÉ : script Export_TIFF : copie de l'image en entiers 16 bits, convertie en sRGB IEC61966-2.1 (icc = true), enregistrée en TIFF (.tiff) sous le NOM DE L'OBJET, sans espace (NGC 1532 -> NGC1532), = nom du dossier des masters ouverts (L, R, G, B, H…), dossiers génériques (master, lights, output, WBPP…) sautés ; enregistrée dans ce dossier ; l'image ouverte ne change pas ; ensuite L fermée (paramètre fermer).
> 
> À RÉGLER : glisse sur l'image finie (après C_Fond_final), L encore ouverte (fermée après l'export) ; copie Export_TIFF.js dans src/scripts/clodoweg.
> 
> SI :
> - aucun master ouvert -> mot-clé OBJECT, sinon nom de la vue, dans ton dossier personnel
> - autre nom -> remplis nom
> - autre dossier -> remplis dossier
> - garder plusieurs versions -> suffixe (ex. _v2)
> - garder le profil actuel -> icc false
