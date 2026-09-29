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
- Tutoriel — [Telescope Live, CosmeticCorrection dans WBPP](https://telescope.live/tutorials/enhanced-automated-wbpp-cosmeticcorrection)

## Gradient (MGC, GradientCorrection, DBE, GraXpert)

- Officiel — [PixInsight, projet MARS](https://pixinsight.com/mars/)
- Tutoriel — [Stirling Astrophoto, MultiscaleGradientCorrection](https://stirlingastrophoto.com/posts/multiscale-gradient-correction/) : ordre ImageSolver, SPFC, MGC, SPCC ; paramètres.
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
- Tutoriel — [Light Vortex, LRGB et narrowband](https://www.lightvortexastronomy.com/tutorial-combining-lrgb-with-narrowband.html) *(résumé)*
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

## Non vérifié

Réglages sans source trouvée, donnés comme valeurs de départ issues de la pratique :

- GraXpert : réglages différents par filtre.
- GHS : valeurs chiffrées de Stretch factor par filtre (le principe d'un étirement plus fort sur OIII est confirmé, pas les valeurs).
- Ha en luminance en HOO : procédure confirmée, mais le réglage Saturation 0,40 vient du workflow LRGB.
