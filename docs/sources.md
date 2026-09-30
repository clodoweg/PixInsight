# Sources de la fiche PixInsight

Sources consultées pour construire et vérifier `docs/pixinsight-workflow.html`, classées par sujet.
Dernière mise à jour : septembre 2026.

Légende :
- **Officiel** : documentation de l'éditeur ou de l'auteur de l'outil.
- **Tutoriel** : guide écrit par un astrophotographe reconnu.
- **Forum** : discussion communautaire.
- *(résumé)* : page inaccessible depuis le serveur, contenu connu seulement par un résumé de recherche qui la cite.

## Dépôts de scripts et modules

- Officiel — [Cosmic Photons, scripts et modules de Mike Cranfield](https://cosmicphotons.com/scripts/) : URL des dépôts NarrowbandNormalization, NBColourMapper, ImageBlend, StarReduction, ScreenStars, GHS.
- Officiel — [Seti Astro, scripts PixInsight](https://www.setiastro.com/pjsr-scripts) : dépôt `updates.setiastro.com` et dépôt de secours.
- Officiel — [DeepSkyForge](https://deepskyforge.com/) : dépôt du module GraXpert.
- Officiel — [correctMagentaStars sur GitHub](https://github.com/terrordrummer/correctMagentaStars) : auteurs du script.
- Tutoriel — [AstroWorldCreations, NarrowbandNormalization](https://www.astroworldcreations.com/blog/new-pixinsight-process-narrowbandnormalization)
- Tutoriel — [AstroWorldCreations, Seti Astro](https://www.astroworldcreations.com/blog/seti-astro-a-new-source-for-pixinsight-scripts)

## RC Astro (BlurXTerminator, NoiseXTerminator, StarXTerminator)

- Officiel — [RC Astro, installation dans PixInsight](https://www.rc-astro.com/pixinsight-installation-instructions/) : dépôt unique `https://www.rc-astro.com/PixInsight`, PixInsight 1.8.9-2 minimum, redémarrage complet après Apply, menu Process › RCAstro, licence via la clé à molette.
- Officiel — [RC Astro, FAQ](https://www.rc-astro.com/faq/) : modules parfois supprimés par un antivirus ; activation de la licence en ligne ; processeur incompatible avec les calculs de réseau de neurones.

- Officiel — [Manuel technique BlurXTerminator](https://www.rc-astro.com/blurxterminator-technical-manual/) : Correct Only avant SPCC, BXT complet après ; RGB combiné plutôt que canaux séparés ; en narrowband, BXT sur une combinaison SHO simple (un filtre par canal, poids proches), mélanges et boosts seulement après ; pas de réduction de bruit avant BXT.
- Officiel — [Manuel NoiseXTerminator AI3](https://www.rc-astro.com/noisexterminator-2-ai3-user-manual-pixinsight/) : linéaire ou étiré ; exemple Denoise 0,85 ; séparation couleur et fréquences.
- Officiel — [Notes d'utilisation StarXTerminator](https://www.rc-astro.com/starxterminator-usage-notes/) : le plus tôt possible en linéaire ; Unscreen seulement sur image étirée ; recombinaison en screen après étirement.
- Tutoriel — [Cosgrove's Cosmos, BlurXTerminator](https://cosgrovescosmos.com/tips-n-techniques/blurxtermintor-a-breakthrough-for-decon) : valeurs par défaut de BXT.
- Tutoriel — [AstroExploring, BlurXTerminator](https://astroexploring.com/blog/blur-xterminator/)
- Forum — [AstroBin, fil BlurXTerminator](https://www.astrobin.com/forum/c/astrophotography/deep-sky-processing-techniques/blurxterminator-technique-and-usage-thread/) *(résumé)* : position d'Adam Block sur l'ordre BXT/SPCC.
- Forum — [AstroBin, réglages NoiseXTerminator](https://www.astrobin.com/forum/c/equipment-forums/pleiades-astrophoto-pixinsight/seeking-noisexterminator-and-graxpert-denoise-preferences-and-recommendations-in-pixinsight/) *(résumé)* : valeurs Denoise par filtre.

## Prétraitement (WBPP, drizzle, CosmeticCorrection)

- Forum — [PixInsight, output pedestal dans WBPP](https://pixinsight.com/forum/index.php?threads/wbpp-output-pedestal-setting.20457/)
- Forum — [PixInsight, réjection ESD](https://pixinsight.com/forum/index.php?threads%2Fwbpp-rejection-method-auto-selected-generalized-extreme-studentized-deviate.20180%2F=)
- Tutoriel — [Chaotic Nebula, normalisation locale](https://chaoticnebula.com/pixinsight-local-normalization/)
- Tutoriel — [Star-watcher, drizzle](https://www.star-watcher.ch/image-processing/drizzle-integration/) : critère FWHM < 2 px, 15 à 20 poses dithérées.
- Tutoriel — [Telescope Live, CosmeticCorrection dans WBPP](https://telescope.live/tutorials/enhanced-automated-wbpp-cosmeticcorrection) *(inscription requise)*

## Gradient (MGC, GradientCorrection, DBE, GraXpert)

- Officiel — [PixInsight, projet MARS](https://pixinsight.com/mars/)
- Tutoriel — [Stirling Astrophoto, MultiscaleGradientCorrection](https://stirlingastrophoto.com/posts/multiscale-gradient-correction/) : ordre ImageSolver, SPFC, MGC, SPCC ; paramètres.
- Officiel — [AutoIntegrate, code source](https://github.com/jarmoruuth/AutoIntegrate) (`AutoIntegrateEngine.js`) : paramètres complets de SpectrophotometricFluxCalibration (QE curve, Gray/Red/Green/Blue filter, Narrowband mode avec longueur d'onde et bande passante, catalogue Gaia DR3/SP, magnitude limite automatique, détection PSF) et de MultiscaleGradientCorrection (Use MARS database, filtres MARS L/R/G/B, référence vide).
- Tutoriel — [Stirling Astrophoto, réglages SPFC](https://stirlingastrophoto.com/posts/multiscale-gradient-correction/) : QE curve et Gray filter par défaut sans filtre L, filtres R/G/B de la caméra, Gaia DR3/SP, magnitude limite automatique ; image inchangée après SPFC ; mêmes filtres ensuite dans SPCC.
- Tutoriel — [Chaotic Nebula, GradientCorrection](https://chaoticnebula.com/how-to-use-pixinsight-gradient-correction/)
- Tutoriel — [Jon Rista, DBE](https://jonrista.com/the-astrophotographers-guide/pixinsights/dynamicbackgroundextraction/)
- Tutoriel — [Chaotic Nebula, DBE](https://chaoticnebula.com/pixinsight-dynamic-background-extraction/)
- Officiel — [Documentation GraXpert (Siril)](https://siril.readthedocs.io/en/stable/processing/graxpert.html) : Smoothing 0,0 par défaut.

## Couleur (SPCC, SCNR, LinearFit)

- Officiel — [Documentation SPCC](https://pixinsight.com/doc/docs/SPCC/SPCC.html)
- Tutoriel — [Chaotic Nebula, SCNR](https://chaoticnebula.com/pixinsight-scnr/)

## Étirement (GHS, Statistical Stretch)

- Officiel — [Documentation GHS](https://www.ghsastro.co.uk/doc/tools/GeneralizedHyperbolicStretch/GeneralizedHyperbolicStretch.html) : paramètres, plages et méthode pas à pas.
- Tutoriel — [AstroBackyard, Statistical Stretch](https://astrobackyard.com/seti-astro-statistical-stretch/)

## Combinaison et narrowband

- Tutoriel — [Chaotic Nebula, luminance](https://chaoticnebula.com/pixinsight-luminance-integration/) : réglages LRGBCombination.
- Officiel — [PixInsight, combinaison broadband et narrowband](https://pixinsight.com/tutorials/narrowband/)
- Officiel — [PixInsight, notes M31 Ha](https://pixinsight.com/examples/M31-Ha/) : soustraction du continuum.
- Tutoriel — [Light Vortex, LRGB et narrowband](https://www.lightvortexastronomy.com/tutorial-combining-lrgb-with-narrowband.html) *(résumé ; site indisponible en septembre 2026)*
- Tutoriel — [Remote Astrophotography, NarrowbandNormalization](https://remoteastrophotography.com/using-narrowbandnormalization-to-enhance-your-narrowband-images/) : image étirée et sans étoiles, noms des réglages.
- Tutoriel — [The Coldest Nights, formules Foraxx](https://thecoldestnights.com/2020/06/pixinsight-dynamic-narrowband-combinations-with-pixelmath/)
- Tutoriel — [Telescope Live, combinaisons dynamiques](https://telescope.live/blog/dynamic-narrowband-combinations-pixelmath)
- Forum — [Cloudy Nights, HOO et broadband](https://www.cloudynights.com/topic/918949-combining-hoo-osc-final-image-with-broadband-osc-image-in-pixinsight/) *(résumé)*

## Dual-band pour caméra couleur (HOO)

- Forum — [Astro Pixel Processor, fuite Bayer](https://www.astropixelprocessor.com/community/main-forum/app-ha-oiii-extraction-from-osc-with-duoband-filter-unmixing-bayer-colour-leakage-from-duo-band-filters/)
- Forum — [Astro Pixel Processor, formule d'extraction](https://www.astropixelprocessor.com/community/main-forum/formula-for-ha-and-oiii-osc-dual-band-extraction/) *(résumé)*
- Forum — [AstroBin, combiner vert et bleu](https://app.astrobin.com/forum/topic/76201/processing/dual-nb-imagery-combining-blue-and-green-channel) *(résumé)*
- Tutoriel — [AstroBackyard, narrowband en caméra couleur](https://astrobackyard.com/osc-narrowband-image-processing-pixinsight/)
- Tutoriel — [Simon Todd, SHO depuis du dual-band](https://www.stastrophotography.com/creating-a-hubble-palette-image-from-osc-dual-band-data/)

## Étoiles et finition

- Officiel — [AutoIntegrate, code source](https://github.com/jarmoruuth/AutoIntegrate) (`AutoIntegrateEngine.js`) : formules de réduction d'étoiles de Bill Blanshan, version 2.
- Tutoriel — [Chaotic Nebula, réduction d'étoiles](https://chaoticnebula.com/pixinsight-star-reduction/)
- Tutoriel — [Chaotic Nebula, LHE](https://chaoticnebula.com/unlocking-faint-details-a-guide-to-local-histogram-equalization/)
- Tutoriel — [Chaotic Nebula, HDRMultiscaleTransform](https://chaoticnebula.com/pixinsight-hdr-multiscale-transform/)

## Workflows complets (auteurs de tutoriels vidéo, versions écrites)

- Tutoriel — [theAstroShed, workflows RGB et SHO 2024](https://www.theastroshed.com/my-rgb-and-sho-workflows-2024-edition/)
- Tutoriel — [nrStellar, workflow LRGB](https://nrstellar.com/blogs/articles/lrgb-editing-workflow-for-pixinsight)
- Tutoriel — [nrStellar, workflow narrowband](https://nrstellar.com/blogs/articles/narrowband-editing-workflow-for-pixinsight)
- Tutoriel — [AstroBackyard, workflow de traitement](https://astrobackyard.com/astrophotography-processing-workflow/)

## Scripts (code source lu directement)

- Officiel — [Seti Astro, dépôt des scripts](https://github.com/setiastro/pixinsight-updates-194) (archive `SetiAstroScripts09.19.2026.zip`) :
  - `statisticalstretch.js` v2.3 : Target Median 0,25, Linked Stretch coché, Blackpoint Sigma 5,0, Normalize décoché, Curves Boost 0, HDR Compress décoché (Amount 0,25, Knee 0,35).
  - `star_stretch.js` v2.6 : Stretch Amount 5 (plage 0 à 8), Color Boost 1,0 (plage 0 à 2), Remove Green via SCNR décoché par défaut.
  - `Halo-B-Gon.js` v2.1 : Reduction Amount Extra Low / Low / Med / High, Low par défaut ; Linear Data décoché.
- Officiel — [CorrectMagentaStars.js](https://github.com/terrordrummer/correctMagentaStars) v1.1 : menu Utilities, Amount 0,8 par défaut (plage 0 à 1), SCNR sur l'image inversée.

## NBRGBCombination

- Tutoriel — [Chaotic Nebula, LRGB + Ha](https://chaoticnebula.com/pixinsight-lrgbha-combination/) : script du menu Script › Utilities ; champs RGB, canal narrowband, Bandwidth, Scale.
- Tutoriel — [Galactic Hunter, HaRGB avec le script](https://www.galactic-hunter.com/post/hargbcompositetutorialpixinsight) : bande passante RGB (200 nm pour un capteur couleur), Scale 4 à 5 sur un Ha faible.
- Tutoriel — [Blog de M. Striebeck, NBRGBCombination](http://mstriebeck-astrophotography.blogspot.com/2018/09/using-nbrgbcombination-script-in.html) : Scale 1,20 par défaut.

## Écarts entre filtres

- Forum — [Cloudy Nights, effet de la Lune en narrowband](https://www.cloudynights.com/topic/603732-effect-of-moon-on-narrowband/) *(résumé)* : OIII bien plus touché par la Lune que Ha et SII.
- Forum — [Cloudy Nights, Lune et filtres 3 nm](https://www.cloudynights.com/topic/893726-moon-effect-on-mono-3nm-hasiioiii/) *(résumé)*
- Tutoriel — [Optical Mechanics, guide narrowband](https://www.opticalmechanics.com/mastering-narrowband-astrophotography-ha-oiii-sii/) *(résumé)* : poses de 180 à 600 s en narrowband sur CMOS refroidi.
- Forum — [AstroBin, pourquoi 300 s en mono CMOS](https://app.astrobin.com/forum/topic/105210/acquisition/how-long-an-exposure-with-monochrome-cmos-cameras-why-does-300sec-seem-to-be-the-standard) *(résumé)*
- Tutoriel — [Telescope Live, correction des défauts d'image](https://telescope.live/blog/correcting-image-data-problems-pixinsight) : CosmeticCorrection Hot sigma 2,2 à 2,5, Cold sigma à 0.
- Tutoriel — [Chaotic Nebula, CosmeticCorrection](https://chaoticnebula.com/cosmetic-correction/) : ne pas être trop agressif sur Hot sigma.
- Tutoriel — [Galactic Hunter, combinaison bicolore](https://www.galactic-hunter.com/post/pixinsight-bi-color-combination-tutorial) : LinearFit d'OIII sur Ha, fonds de même luminosité, variante HOO G = 0,6·Ha + 0,4·OIII.
- Tutoriel — [High Point Scientific, combiner le narrowband](https://www.highpointscientific.com/astronomy-hub/post/astro-photography-guides/combining-narrowband-data-pixinsight) : étirement de chaque canal plus ou moins fort selon la palette voulue.
- Forum — [AstroBin, NarrowbandNormalization et données couleur](https://app.astrobin.com/forum/topic/144808/problems-with-narrowband-normalisation-of-osc-data) *(résumé)* : OIII à étirer plus fort, fonds à égaliser avant de combiner.
- Tutoriel — [OPT, les filtres expliqués](https://optcorp.com/blogs/deep-sky-imaging/filters-explained) *(résumé)* : filtre Chroma R de 600 à 700 nm.

## SHO sans RGB (étoiles narrowband)

- Officiel — [Seti Astro, `NBtoRGBStars.js` v1.6](https://github.com/setiastro/pixinsight-updates-194) (code source) : étoiles Ha et OIII obligatoires, SII optionnel ; Green Channel Blend Ratio décoché, Ha to OIII ratio 0,3 ; Apply Star Stretch recommandé, Stretch Factor 5, Color Boost 1,0.
- Tutoriel — [AIASTRO, étoiles RGB à partir du narrowband](https://aiastro.wordpress.com/2020/06/02/rgb-stars-from-narroband-data/) : R = Ha, G = 20 % Ha + 80 % OIII, B = OIII, puis calibration photométrique.
- Tutoriel — [Telescope Live, étoiles violettes en SHO](https://telescope.live/blog/how-remove-purple-stars-sho-images) : cause (Ha bien plus fort que SII et OIII) et méthode par inversion.
- Tutoriel — [Telescope Live, correction des étoiles magenta](https://telescope.live/blog/narrowband-magenta-star-correction) *(résumé)*

## Icônes de process (docs/process-icons)

- Tutoriel — [theAstroShed, icônes de process](https://github.com/jamiesmith/pixinsight-icons) : fichiers `.xpsm` générés par PixInsight 1.9.3, utilisés comme modèles (format, noms de paramètres, versions, valeurs d'énumération) ; formules Foraxx identiques à celles de la fiche ; formules de Bill Blanshan version 3 avec leurs commentaires d'origine (`FromLukeAndBill.xpsm`) ; noms internes des réglages de NarrowbandNormalization ; modèles de SPCC (Average Spiral Galaxy), GradientCorrection, GHS (énumérations ST_GeneralisedHyperbolic, SC_RGB, CT_RGBBlend), CurvesTransformation ; descriptions et icônes-notes NoOperation.
- Officiel — [AutoIntegrate, code source](https://github.com/jarmoruuth/AutoIntegrate) : opérateur `Selection` de MorphologicalTransformation et masque circulaire 5×5.

## Audit de cohérence des icônes

- Tutoriel — [Evan Tsai, comparatif des outils de retrait d'étoiles](https://www.astroimagetw.com/en/tutorials/star-removal-tools/) *(résumé)* : Large overlap de StarXTerminator utile contre le quadrillage, environ deux fois plus lent, peut créer d'autres artefacts.
- Officiel — [AutoIntegrate, code source](https://github.com/jarmoruuth/AutoIntegrate) et 11 icônes SPCC de theAstroShed : limites de neutralisation du fond de SPCC −2,80 / +2,00.

## WBPP 3.1 (configuration détaillée)

- Tutoriel — [Bernd Landmann, Guide to Preprocessing of Raw Data with PixInsight](https://sh-cosmiccanvas.s3.us-west-2.amazonaws.com/Resources/20230101_GuideToPreprocessingOfRawDataWithPixInsight.pdf) (collaborateur du forum PixInsight, révision 2023, WBPP 2.5.6) : mêmes réglages caméra pour lights et calibrations ; ne jamais pré-calibrer les darks ; flats calibrés avec flat-darks ou bias seul, sans optimisation ; pas d'optimisation des darks sur ASI294MC Pro refroidie ; output pedestal automatique (≈ 0,01 % de pixels écrêtés) ; CFA dans CosmeticCorrection ; PSF Signal Weight ; Distortion correction ; normalisation locale ; intégration Average + LocalNormalization + PSF Signal Weight ; drizzle CFA recommandé par Juan Conejero (Scale 1, Drop shrink 1,0) ; contrôle des cartes de réjection.
- Officiel — [psf-guard, module WBPP](https://github.com/theatrus/psf-guard) (`src/commands/export/wbpp.rs`, vérifié contre PixInsight 1.9.5 et WBPP 3.1.0) : préréglages de qualité (Maximum par défaut, Good, Fast), Fast Integration automatique dès 150 images par groupe, drizzle réglé par groupe de lights, Autocrop activé par défaut, algorithmes de réjection proposés (Percentile, Winsorized, Linear fit, ESD, Robust Chauvenet, Auto), groupement par mot-clé lu dans le chemin (`SESSION_<nuit>`).
- Forum — [PixInsight, Fast Integration dans WBPP](https://pixinsight.com/forum/index.php?threads/fast-integration-option-within-wbpp-what-does-it-do.23150/) : l'option lance le process FastIntegration.
- Tutoriel — [Chaotic Nebula, ImageIntegration](https://chaoticnebula.com/pixinsight-image-integration/) : Percentile clipping pour moins de 10 images, Winsorized sigma clipping pour les lots plus importants.
- Forum — [PixInsight, réjection ESD choisie automatiquement par WBPP](https://pixinsight.com/forum/index.php?threads%2Fwbpp-rejection-method-auto-selected-generalized-extreme-studentized-deviate.20180%2F=) : ESD pour les grands lots.

## Ton matériel

- Utilisateur — base de filtres exportée depuis ton PixInsight (`.xspd`, 256 courbes, 29 septembre 2026) : courbes Antlia V Pro Series R, G, B, Sony IMX411/455/461/533/571 (identique à celle du modèle SPCC de theAstroShed) utilisées dans les icônes SPCC et SPFC. Filtres narrowband Antlia 3 nm (confirmé par l'utilisateur).
- Revendeur — [Teleskop-Express, Antlia L-V Pro](https://www.teleskop-express.de/en/antlia-175/photo-r-g-b-and-ir-cut-filters-267/antlia-2-l-v-pro-uv-ir-cut-luminance-filter-19102) : passe-bande 420 à 715 nm, transmission supérieure à 95 %.

## Étirement cohérent des canaux SHO et réglage de NarrowbandNormalization

- Tutoriel — [AstroWorldCreations, présentation de NarrowbandNormalization](https://www.astroworldcreations.com/blog/new-pixinsight-process-narrowbandnormalization) : entrée = image RGB (de préférence sans étoiles) où les canaux narrowband sont placés selon la palette ; réglages de boosts OIII/SII, lightness, SCNR, ombres, hautes lumières et luminosité.
- Tutoriel — [theAstroShed, workflows RGB et SHO 2024](https://www.theastroshed.com/my-rgb-and-sho-workflows-2024-edition/) : combinaison SHO puis AutoLinearFit avec le vert comme référence, GHS avant ou après la combinaison, NarrowbandNormalization avec aperçu en temps réel et astuce « pousser le curseur à 0 ou au maximum pour voir son effet ».
- Code — [pixinsight-mcp, formule de Statistical Stretch](https://github.com/mxcoppell/pixinsight-mcp/releases/tag/v1.2.0) : point noir médiane/MAD puis fonction de transfert des tons moyens qui place la médiane sur la cible ; option liée ou non liée pour la couleur (étirer les trois masters avec la même Target median donne des médianes identiques).
- Recherche — [nrStellar, workflow narrowband](https://nrstellar.com/blogs/articles/narrowband-editing-workflow-for-pixinsight) et [annonce officielle sur le forum PixInsight](https://pixinsight.com/forum/index.php?threads%2Fnew-process-narrowbandnormalization.21441%2F=) : NarrowbandNormalization de préférence sur une image étirée et sans étoiles ; en linéaire, l'équilibrage de luminosité et l'option Lightness sont limités.
- Ordre de réglage de NarrowbandNormalization (Lightness, Shadowpoint, boosts, hautes lumières, Brightness, SCNR) : suggestion de la fiche, signalée comme telle sur la page ; aucune source ne fixe d'ordre.

## Neutralisation du fond dans SPCC

- Officiel — [Documentation SPCC](https://pixinsight.com/doc/docs/SPCC/SPCC.html) : limites d'échantillonnage du fond exprimées en écarts-types (sigma) et non en valeurs de pixel ; fond de référence choisi par une preview (Region of Interest). La documentation ne décrit pas explicitement le cas sans référence (image entière) : comportement de l'outil, confirmé par l'icône (vue de référence vide, backgroundUseROI = false).
- Officiel — [Seti Astro, scripts PixInsight](https://www.setiastro.com/pjsr-scripts) : script de recherche automatique de l'aperçu de fond pour BackgroundNeutralization, ColorCalibration, SPCC et la soustraction du continuum (présenté sous le nom « Find Background Preview »).
- Code — [Seti Astro, `FindBackground.js` v1.2.2](https://github.com/setiastro/pixinsight-updates-194) (archive des scripts) : menu `Script › SetiAstro › Find Background` ; crée un aperçu nommé `Background` couvrant uniquement du fond ; co-écrit par Gerrit Erdt (AstroGerdt, auteur de NeutralizeBackground) et Franklin Marek ; PixInsight 1.9.4 minimum. Corrige le point « emplacement dans le menu non vérifié ».
- Forum — [AstroBin, script qui trouve automatiquement la zone de fond](https://app.astrobin.com/forum/topic/121048/new-script-to-automatically-find-the-background-roi-in-pixinsight)
- Forum — [PixInsight, NeutralizeBackground (AstroGerdt)](https://pixinsight.com/forum/index.php?threads/rudimentary-script-to-optimize-background-neutralization-in-spcc.21398/) : alternative (pièce jointe du forum, sans dépôt) ; cherche les zones les plus sombres et recommande une limite haute pour SPCC.
- Forum — [PixInsight, difficultés de neutralisation du fond dans SPCC](https://pixinsight.com/forum/index.php?threads/struggles-with-background-neutralization-in-spcc.20388/) et [Cloudy Nights, SPCC ou BackgroundNeutralization](https://www.cloudynights.com/forums/topic/938201-spcc-background-neutralization-vs-bn-tool/) : limites par défaut −2,80 / +2,00 ; la limite basse sert surtout à éviter un fond artificiellement sombre.

## Repères d'étirement (niveau du fond, trop ou pas assez étiré)

- Officiel — [Documentation GHS](https://www.ghsastro.co.uk/doc/tools/GeneralizedHyperbolicStretch/GeneralizedHyperbolicStretch.html) : pic d'histogramme vers 0,2–0,25 après le 1er étirement ; b ≈ 10 au début, 3 à 5 ensuite ; LP et HP inutiles au 1er étirement.
- Tutoriel — [Jerry Lodriguss, correction de base des astrophotos](https://www.astropix.com/html/processing/digtechs.html) : fond neutralisé en gris foncé vers 35-35-35 (sur 255), jamais 0-0-0 (écrêtage) ; les valeurs ne sont jamais exactement identiques partout.
- Tutoriel — [AstroBackyard, traitement pas à pas](https://astrobackyard.com/tutorials/astrophotography-tutorial-1/) : fond gris foncé vers 30, 30, 30.
- Tutoriel — [Roger Clark, traitement d'image 2](https://clarkvision.com/articles/astrophotography.image.processing2/) : mieux vaut sous-corriger qu'écrêter ; aucun canal écrêté en bas. [rnc-color-stretch](https://clarkvision.com/articles/astrophotography-rnc-color-stretch/) : point zéro par défaut 4096/65535 (≈ 0,06).
- Tutoriel — [Jon Rista, signal, bruit et histogrammes](https://jonrista.com/the-astrophotographers-guide/astrophotography-basics/signal-noise-and-histograms/) : après réduction du bruit, on peut assombrir davantage le fond.
- Pratique de la fiche (signalée comme telle sur la page) : fourchette 0,14–0,15 pour des données bruitées et 0,10–0,12 pour des données propres ; seuil « trop étiré » au-delà de 0,18–0,20 ; hautes lumières (seuls les cœurs d'étoiles à 1) ; signes visuels de sur- et sous-étirement.

## Couleurs SHO et choix de la palette

- Tutoriel — [AstroBackyard, guide du narrowband et de la palette Hubble](https://astrobackyard.com/narrowband-imaging/)
- Tutoriel — [Optical Mechanics, SHO ou HOO](https://www.opticalmechanics.com/narrowband-astrophotography-sho-vs-hoo-guide/) : rendu or et bleu (teal) après réduction du vert ; oxygène vers le cyan, soufre et hydrogène vers l'or ; étoiles aux teintes peu naturelles ; HOO pour les cibles à SII faible ; California (Ha dominant, OIII faible) : HOO centré sur Ha ou hybride HaRGB.
- Tutoriel — [AstroImagery, couleurs de la palette Hubble](https://astroimagery.com/techniques/post-processing/hubble-palette-colours/) : beaucoup d'images publiées « très orange et bleu ».
- Tutoriel — [Light Vortex Astronomy, palette Hubble](https://www.lightvortexastronomy.com/tutorial-narrowband-hubble-palette.html) : combinaison brute très verte (Ha dominant) ; rendu orange et bleu, parfois avec des touches de vert (site aujourd'hui injoignable, contenu relevé par la recherche).
- Tutoriel — [Jon Rista, SCNR](https://jonrista.com/the-astrophotographers-guide/pixinsights/scnr/) : Average Neutral remplace le vert par la moyenne de R et B quand il la dépasse.
- Règles de lecture à la sonde (or : R ≥ G ≫ B ; cyan : B ≥ G ≫ R ; fond R = G = B) et tableau des ajustements NarrowbandNormalization : déduits de la composition des couleurs et des rôles des réglages déjà sourcés ; aucune source ne les chiffre, la page l'indique.
- Code — [Seti Astro, `PerfectPalettePicker.js` v1.3](https://github.com/setiastro/pixinsight-updates-194) (archive des scripts) : menu `Script › SetiAstro › Perfect Palette Picker` ; 16 palettes (HOO, HOS, HSO, HSS, OHH, OHS, OSH, OSS, SHH, SHO, SOH, SOO, Realistic1, Realistic2, Foraxx, Dynamic Inverse) ; case *Linear Input Data* cochée par défaut, qui étire chaque canal à une médiane de 0,25 (point noir médiane − 2,7 σ) ; Ha remplace SII s'il manque (et inversement) ; entrées OSC HaO3 et S2O3 (Ha ou SII = rouge, OIII = moyenne de G et B) ; clic sur une vignette = palette en pleine taille.

## Schémas de la fiche

Les schémas ne reprennent que des faits déjà sourcés plus haut ; ils n'ajoutent aucun réglage.

- Frises des workflows, arbre de choix, comparaison large bande / narrowband, circuit des étoiles : ordre des étapes et phase linéaire ou étirée tirés des étapes de la fiche (sources des rubriques correspondantes).
- Courbes GHS : calculées avec l'équation hyperbolique généralisée de David Payne (b > 0) telle qu'elle est codée dans les formules PixelMath de Bill Blanshan (`FromLukeAndBill.xpsm`, [theAstroShed](https://github.com/jamiesmith/pixinsight-icons)) ; D = 10, SP = 0,1, b = 10 et b = 1, sans LP ni HP. Lecture des paramètres d'après la [documentation GHS](https://www.ghsastro.co.uk/doc/tools/GeneralizedHyperbolicStretch/GeneralizedHyperbolicStretch.html).
- Lecture des couleurs SHO (section RGB + SHO) : valeurs illustratives, règles de la rubrique « Couleurs SHO et choix de la palette ».
- Échelle du fond (section GHS) : reprend les valeurs de la rubrique « Repères d'étirement ».
- Continuum : filtre R vers 600–700 nm, raie Ha à 656,3 nm, filtre Ha de 3 nm et formule `Ha_cs = Ha − k·(R − med(R))`, déjà sourcés (rubrique Combinaison et narrowband). Les hauteurs sont schématiques, pas à l'échelle.

## Dernier audit (septembre 2026)

- **Liens** : 74 URL uniques testées. Environ deux tiers répondent directement ; les autres renvoient 403 ou 406 à un robot (protection anti-robots des forums AstroBin et Cloudy Nights, de Chaotic Nebula et de Remote Astrophotography ; filtrage réseau pour GitHub). Les 5 dépôts GitHub ont été confirmés par Git, Chaotic Nebula par une lecture de page. Le tutoriel Telescope Live sur CosmeticCorrection demande une inscription ; le site Light Vortex ne répond plus. Une page morte (DSLR Astrophotography, réjection) a été retirée, et la recommandation « Linear fit au-delà de 10 images » qu'elle seule appuyait a été retirée de la fiche.
- **Doublons** : trois dépôts apparaissent dans deux rubriques (AutoIntegrate, Seti Astro, CorrectMagentaStars), volontairement, car ils justifient des points différents.
- **Icônes** : 215 icônes dans 8 fichiers ; XML valide, identifiants uniques, aucune superposition, numérotation continue, une description par icône de workflow ; 80 valeurs citées dans les descriptions comparées aux réglages, aucun écart ; valeurs des icônes unitaires identiques au README ; enchaînement des noms de vues vérifié ; les générateurs du dépôt reproduisent à l'identique les 8 fichiers publiés.
- **WBPP** : mêmes réglages dans la section Prétraitement, la fiche WBPP et l'icône-note WBPP des cinq workflows.

## NarrowbandNormalization (module)

- Officiel — [Dépôt Cosmic Photons du module](https://www.cosmicphotons.com/pi-modules/narrowbandnormalization/) : module 1.1 pour PixInsight 1.9 (Windows et macOS) examiné ; valeurs internes Palette_HOO, Palette_SHO, Palette_HSO, Palette_HOS ; Lightness_Off, Lightness_Preserve, Lightness_Ha, Lightness_OIII, Lightness_SII ; Blend_Mode1 à 3.

## Non vérifié

Points sans source directe :

- Ha en luminance en HOO : Saturation 0,40 reprise du réglage LRGBCombination sourcé (Chaotic Nebula : Lightness 0,55, Saturation 0,40) ; aucune valeur propre au HOO publiée.
- Icônes de process : format vérifié sur des fichiers réels générés par PixInsight 1.9.3 et noms d'énumération vérifiés, mais chargement non testé dans PixInsight (le schéma XPSM officiel n'est plus en ligne à son adresse d'origine).

Points clos au dernier contrôle :

- GHS par filtre : pas de valeur fixe de Stretch factor, par conception ; la méthode officielle vise un pic d'histogramme vers 0,20–0,25 et le même fond pour tous les canaux, ce que suivent la fiche et les icônes.
- NarrowbandNormalization : Palette_SHO confirmée dans le module ; icônes réelles ajoutées.
- Icône SPFC L : courbe du filtre Antlia V Pro L approchée par un plateau de 95 % entre 420 et 715 nm, d'après les caractéristiques publiées ; la courbe mesurée n'est pas disponible.
