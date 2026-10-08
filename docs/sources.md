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
- Officiel — [Manuel NoiseXTerminator AI3](https://www.rc-astro.com/noisexterminator-2-ai3-user-manual-pixinsight/) : linéaire ou étiré ; exemple Denoise 0,85 ; séparation couleur et fréquences. Relu le 30 septembre 2026 pour le détail : Denoise 0–1 (1 = trop lisse), itérations (meilleur détail dans les zones très bruitées, artefacts si trop), Detail réservé à l'AI2, séparation intensité/couleur impossible en mono, séparation HF/LF (80–90 %, 90–100 %, 50–70 %, 100 %), HF/LF Scale (exemples 4 et 7 px), étirement interne puis inverse exact.
- Officiel — [RC Astro, NoiseXTerminator 2/AI3 Released](https://www.rc-astro.com/noisexterminator-2-ai3-released-for-pixinsight/) : HF/LF Scale plus facile à régler en aperçu avec Denoise LF à 0 ; Overlap dans les options supplémentaires. Valeurs d'icône (HF/LF Scale 5, Overlap 0,20) relevées dans l'instance de référence `.xpsm`.
- Officiel — [Notes d'utilisation StarXTerminator](https://www.rc-astro.com/starxterminator-usage-notes/) : le plus tôt possible en linéaire ; Unscreen seulement sur image étirée ; recombinaison en screen après étirement.
- Officiel — [StarXTerminator 2 / AI11, notes de version](https://www.rc-astro.com/starxterminator-version-2-ai-11-release-notes/) : Large Tile Overlap 50 % au lieu de 20 %, environ trois fois plus lent, seulement en cas d'artefacts de tuiles ; case Linear supprimée (détection automatique) ; variantes complète, Lite (≈ 75 % de mémoire en moins) et Lite.nonoise (plus rapide, sans bruit dans les zones retirées) ; macOS 11 minimum. Paramètres remove_stars, remove_spikes, remove_aureoles, remove_reflections relevés dans l'instance de référence `.xpsm`, non documentés publiquement (recherche du 30 septembre 2026). Essai de l'utilisateur (2 octobre 2026) : remove_reflections coché, aucun changement sur le grand reflet autour d'une étoile brillante dans L sans étoiles (NGC 1532) ; coché quand même par défaut dans les icônes à sa demande.
- Tutoriel — [Cosgrove's Cosmos, BlurXTerminator](https://cosgrovescosmos.com/tips-n-techniques/blurxtermintor-a-breakthrough-for-decon) : valeurs par défaut de BXT. Relu le 30 septembre 2026 : Sharpen Stars 0–0,5 (défaut 0,25, étoiles réduites de moitié au maximum), Adjust Star Halos −0,5 à +0,5 (défaut 0), Sharpen Nonstellar 0–1 (défaut 0,9), PSF Diameter jusqu'à 8 px, PSF automatique par défaut.
- Officiel — [Manuel technique BlurXTerminator](https://www.rc-astro.com/blurxterminator-technical-manual/), relu le 30 septembre 2026 : AI4 exige des données linéaires ; Correct Only = PSF automatique et autres réglages à zéro ; Sharpen Stars (réduction de FWHM ; longue focale : zones sans détail autour des étoiles brillantes ; halos sombres → baisser ou monter Adjust Star Halos) ; halos (plus haut = plus doux et étendus) ; PSF automatique (sur-accentuation possible s'il y a peu d'étoiles, longue focale) ; PSF Diameter = FWHM, 8 px au maximum, réduction ×2 au-delà ; Sharpen Nonstellar 1,00 = PSF ponctuelle ; tuiles 512×512 avec recouvrement ; sur-accentuation si appliqué plusieurs fois ou PSF fictive ; images sans étoiles : PSF manuelle.
- Calcul : échelle CDK17 (2 939 mm) + QHY600 (3,76 µm) = 206,265 × 3,76 / 2 939 = 0,264″/px ; FWHM 2″ = 7,6 px, 2,5″ = 9,5 px.
- Tutoriel — [AstroExploring, BlurXTerminator](https://astroexploring.com/blog/blur-xterminator/)
- Forum — [AstroBin, fil BlurXTerminator](https://www.astrobin.com/forum/c/astrophotography/deep-sky-processing-techniques/blurxterminator-technique-and-usage-thread/) *(résumé)* : position d'Adam Block sur l'ordre BXT/SPCC.
- Forum — [AstroBin, réglages NoiseXTerminator](https://www.astrobin.com/forum/c/equipment-forums/pleiades-astrophoto-pixinsight/seeking-noisexterminator-and-graxpert-denoise-preferences-and-recommendations-in-pixinsight/) *(résumé)* : valeurs Denoise par filtre.

## Prétraitement (WBPP, drizzle, CosmeticCorrection)

- Forum — [PixInsight, output pedestal dans WBPP](https://pixinsight.com/forum/index.php?threads/wbpp-output-pedestal-setting.20457/)
- Forum — [PixInsight, réjection ESD](https://pixinsight.com/forum/index.php?threads%2Fwbpp-rejection-method-auto-selected-generalized-extreme-studentized-deviate.20180%2F=)
- Tutoriel — [Chaotic Nebula, normalisation locale](https://chaoticnebula.com/pixinsight-local-normalization/)
- Tutoriel — [Star-watcher, drizzle](https://www.star-watcher.ch/image-processing/drizzle-integration/) : critère FWHM < 2 px, 15 à 20 poses dithérées.
- Tutoriel — [Telescope Live, corriger les défauts des images](https://telescope.live/blog/correcting-image-data-problems-pixinsight) (relu le 30 septembre 2026) : Hot sigma « around 2.2 to 2.5 », Cold sigma laissé à 0. L'ancien tutoriel sur CosmeticCorrection dans WBPP (telescope.live/tutorials/enhanced-automated-wbpp-cosmeticcorrection) renvoie désormais 404.
- Tutoriel — [Chaotic Nebula, CosmeticCorrection](https://chaoticnebula.com/cosmetic-correction/) : régler le Hot sigma avec l'aperçu en temps réel, sans être trop agressif (sinon du vrai signal est modifié).

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
- Officiel — [Documentation du script GHS, primer de David Payne](https://www.ghsastro.co.uk/doc/scripts/GeneralisedHyperbolicStretch/GeneralisedHyperbolicStretch.html) : section « Affiner SP, LP et HP ». Section 3.2 : quatre zones (linéaire sous LP, contraste croissant de LP à SP, décroissant de SP à HP, linéaire au-dessus de HP) ; plus HP est bas, plus la protection est large et forte, et HP trop bas assombrit le reste de l'image ; LP garde le contraste des ombres au lieu de les assombrir. Réglage de SP : viser l'élargissement maximal de l'histogramme ; SP trop bas = histogramme qui glisse à droite, trop haut = histogramme qui reste à gauche ; SP au-dessus du bruit du fond ; SP d'abord, puis b et D. Recette « star rescue » : D et b modérés, SP = 1, LP juste sous l'accumulation des étoiles (essai 0,9).
- Officiel — [Documentation du process GHS](https://www.ghsastro.co.uk/doc/tools/GeneralizedHyperbolicStretch/GeneralizedHyperbolicStretch.html) : plages LP [0, SP] et HP [SP, 1] ; passes suivantes : HP protège les étoiles brillantes, LP « repousse » l'histogramme vers la droite si le fond devient trop sombre. Corrige l'ancienne consigne de la fiche « fond bruité → monte LP » : un fond bruité qui monte vient d'un SP trop bas.
- Mode rapide : Statistical Stretch lancé sans dialogue dans un conteneur, d'après le code de `statisticalstretch.js` (SetiAstro, archive du 19 septembre 2026) : si `Parameters.isViewTarget` et `openDialogbox = false`, le script étire directement la vue cible. FindBackground (SetiAstro) écarté : il ouvre toujours son dialogue et se relance (`while ( main() );` en fin de fichier) ; inutile pour des galaxies, SPCC prenant l'image entière. MGC laissé hors conteneur : la liste des fichiers MARS n'est pas un paramètre des icônes de la fiche (constat de l'utilisateur, rubrique MGC). GHS fond à SP = HP = 0,22 et Stretch factor 1 : fond 0,25 → 0,132 (calcul de la fiche, rubrique Valeurs de départ).
- Renommer_auto.js : mot-clé FITS FILTER lu par `ImageWindow.keywords` (`FITSKeyword.strippedValue`), forme de nom WBPP `FILTER-xxx` d'après les noms de fichiers WBPP ; correspondances de noms de filtres testées hors PixInsight (Node.js) sur Lum, Red, Ha, H-alpha, Ha 3nm, OIII, O3, SII, S2 et des noms de fichiers types.
- Mode rapide, script de la fiche `GHS_auto.js` : équations de la transformation hyperbolique généralisée (T(x) = 1 − (1 + b·D·x)^(−1/b), D = e^SF − 1, segments linéaires sous LP et au-dessus de HP, normalisation sur [0, 1]) d'après la [documentation du script GHS](https://www.ghsastro.co.uk/doc/scripts/GeneralisedHyperbolicStretch/GeneralisedHyperbolicStretch.html) de David Payne ; vérifiées en Node.js (2 octobre 2026) : médiane 0,001 → Stretch factor 6,7 ; 0,002 → 5,8 ; 0,005 → 4,7 ; 0,01 → 3,7 pour une médiane à 0,25, cohérent avec les repères de GHS_1 de la fiche (6,5 / 5,5 / 4,5 / 3,5). Noms des paramètres du process (stretchType ST_GeneralisedHyperbolic, stretchChannel SC_RGB, clipType CT_RGBBlend...) relevés dans les icônes GHS de la fiche. Pas encore testé dans PixInsight.
- Mode rapide, `GHS_auto.js` mode fond (2 octobre 2026) : retour de l'utilisateur, L trop claire à la fin du mode rapide avec GHS_3_fond fixe (SP = HP = 0,20, calculé pour un fond à 0,23). Le fond est maintenant mesuré (médiane) et amené à 0,11 : SP = HP = médiane × 0,87 (rapport de GHS_3, 0,20 / 0,23), Stretch factor par dichotomie ; vérifié en Node.js : fond 0,23 → SF 1,26 ; 0,30 → 1,76 ; 0,40 → 2,76. Cible 0,11 : plage « données propres après NXT, 0,10–0,12 » de la fiche (fiche GHS_3), un peu sous le RGB (0,13), puisque la luminance fixe la luminosité de l'image LRGB.
- Mode rapide, comparaison sur une galaxie faite par l'utilisateur (2 octobre 2026, capture PixInsight) : L en Statistical Stretch plus propre (fond sombre, cœur détaillé) que GHS_auto (SP = fond, b = 10) suivi de GHS_2 : fond laiteux, taches et restes de halos visibles, cœur blanc. Statistical Stretch devient l'étirement de L du mode rapide. Nouveaux réglages de GHS_auto (option C_L_rapide_ghs), calculés en Node.js avec les équations de GHS pour un fond de 0,002 : avec SP = fond et b = 10, un pixel à 1,3 × le fond passe à 0,39 (fond à 0,25), contre 0,32 avec Statistical Stretch (point noir à médiane − 5 × 1,4826 × MAD, MAD supposé 0,0002) ; avec SP = fond × 0,5, b = 6, HP 0,85 : 0,30, et le cœur (0,3) à 0,91 au lieu de 0,92 (0,99 avec Statistical Stretch). Un SP au-dessus du fond (× 1,2 ou 1,5) ne permet pas d'amener le fond à 0,25 en une passe (le fond est sous SP, donc comprimé). GHS_2 (SP 0,35) retiré de l'option automatique : après GHS_auto, 0,30–0,45 correspond au niveau des taches. Essai de l'utilisateur avec ces réglages (2 octobre 2026, même galaxie) : fond sombre et uniforme, cœur non brûlé, rendu proche de Statistical Stretch ; Statistical Stretch reste l'étirement par défaut de L en mode rapide (choix de l'utilisateur), GHS_auto en option C_L_rapide_ghs.
- Option `HDRMT_eclat` (2 octobre 2026) : essais de l'utilisateur sur NGC 1532 (mode rapide, captures) : HDRMT à 50 % = bulbe laiteux et lisse ; HDRMT à 100 % = structure du bulbe visible (bande de poussière qui le traverse) mais cœur plus sombre et terne. Raisonnement de la fiche : HDRMT comprime les hautes lumières et travaille la luminosité seule (To lightness), d'où un cœur plus sombre et moins saturé ; Boost_finition_light ensuite (courbe très légère, saturation 0,5 → 0,57, LHE doux sous masque) rend éclat et chaleur sans recompresser. a = 0,7 : compromis proposé. Essai de l'utilisateur (même jour, NGC 1532, C_Fin_sans_etoiles puis Boost_finition puis HDRMT_eclat) : bulbe détaillé (bande de poussière visible à travers) et plus lumineux et chaud qu'avec HDRMT à 100 % ; couleurs fortes (deux Boost cumulés), à la limite pour les bras bleus. Puis C_Fin_sans_etoiles et HDRMT_eclat seul : couleurs plus naturelles, texture plus fine, bulbe détaillé et chaud ; retenu par l'utilisateur comme finition par défaut du mode rapide (C_Fin_rapide). Ensuite a = 0,4 au lieu de 0,7 dans HDRMT_eclat (et donc C_Fin_rapide), choix de l'utilisateur ; HDRMT_50 inchangé. Puis C_Fin_rapide réordonné (analyse de la fiche, demande de l'utilisateur : « 3 fois LHE, c'est pas trop ? ») : HDRMT avant les courbes et LHE (ordre habituel : la plage dynamique d'abord, le contraste local ensuite ; dans l'ancien ordre, HDRMT recompressait le cœur que les LHE venaient de monter, d'où le Boost ajouté après), LHE rayon 80 retiré (entre 150 et 40), une seule courbe (saturation 0,68 au lieu de 0,65 puis 0,57), un seul masque calculé après HDRMT. Essai de l'utilisateur sur NGC 1532 (chaîne rapide complète) : tout fonctionne, image finie jugée bonne ; ancienne version supprimée.
- Script de la fiche `Halos_auto.js` (2 octobre 2026) : constat de l'utilisateur sur NGC 1532 (L du mode rapide) : taches rondes et claires hors de la galaxie, centrées sur les étoiles (vérifié sur le master L avant SXT) : halos diffus que StarXTerminator laisse dans l'image sans étoiles, ressortis par l'étirement. Méthode de la fiche, sans source externe : zone d'après les cœurs brillants de l'image d'étoiles de SXT (flou gaussien × gain : la zone s'élargit avec la taille du cœur, environ 75 px de rayon pour un cœur de 10 px et 150 px pour 20 px avec rayon 80 et gain 200, calcul analytique), protection de la galaxie par seuil sur la luminance lissée, retrait de l'excès lissé au-dessus du fond (le bruit et les détails fins restent). Essayé par l'utilisateur : ne marche pas ; script supprimé le jour même.
- Script de la fiche `Etoiles_LRGB.js` (2 octobre 2026, demande de l'utilisateur après la question « pourquoi ne pas se servir de L_stars pour la luminance des étoiles ? ») : raisonnement de la fiche, sans source externe : L apporte étoiles faibles et finesse (meilleur signal, BXT), mais blanchit les cœurs (couleur impossible à luminance 1) et crée des anneaux si les tailles d'étoiles diffèrent entre L et RGB ; d'où la luminance mélangée à 50 % et la même courbe d'étirement que les étoiles RGB. Paramètres de LRGBCombination (channels, mL, mc, clipHighlights, noiseReduction) relevés dans l'icône LRGB_ajout_L de la fiche. Pas encore testé dans PixInsight. Puis quatre variantes du mode rapide (demande de l'utilisateur) : SXT sur L linéaire ou après l'étirement (constat de l'utilisateur : étirer L avant SXT évite les taches de halos ; RC Astro : Unscreen sur image étirée), avec ou sans Etoiles_LRGB ; rangées ensuite dans le même fichier (version 1 au chemin principal, trois autres en options). Puis, choix de l'utilisateur : version « L étirée avant SXT + luminance de L pour les étoiles » par défaut, en rapide et en normal (LRGB, LHaRGB).
- Option `Boost_final` (2 octobre 2026) : courbes CurvesTransformation fournies par l'utilisateur (code PJSR exporté de PixInsight : c [0 ; 0,46094 → 0,53646 ; 1], S [0 ; 0,46354 → 0,54167 ; 1], Akima, autres courbes à l'identité) ; masque tiré de L sans étoiles, demande de l'utilisateur (ne pas toucher aux étoiles). Puis (retour de l'utilisateur : masque trop large dans les bras) masque à s = 0,20 et courbe gamma 2 (masque²) : valeurs calculées pour une luminance de 0,25 / 0,35 / 0,5 / 0,7 / 0,9 : 0,004 / 0,035 / 0,14 / 0,39 / 0,77 (gamma 1 : 0,06 / 0,19 / 0,38 / 0,63 / 0,88). Retour de l'utilisateur : le boost touchait encore les étoiles (celles posées sur la galaxie, où L sans étoiles est clair) : étoiles de RGB_stars retirées du masque (paramètre exclure de Masque_auto.js). Pas encore testé dans PixInsight.
- Script de la fiche `Fond_desature.js` (2 octobre 2026, demande de l'utilisateur : teinte violette du fond sur l'image finie) : méthode de la fiche, sans source externe : désaturation vers la luminance Rec. 709 (Y + (C − Y)·w, luminosité conservée), poids tiré de la luminance lissée de l'image elle-même (étoiles et galaxie plus claires que le fond, donc gardées). Premier essai de l'utilisateur (seuils + 0,02 / + 0,08, avec Boost_final) : violet toujours visible, dans le halo faible de la galaxie (au-dessus des seuils). D'où : seuils + 0,03 / + 0,15, étape anti-violet G = max(G, min(R, B)) (même idée que SCNR sur l'image inversée, limitée au magenta : R et B au-dessus de G) dans les zones faibles jusqu'à fond + 0,30, et masque de Boost_final à s = 0,20 pour ne plus saturer ce halo. Pas encore retesté.
- Mode rapide, étirement de L (2 octobre 2026) : vérification de l'utilisateur sur NGC 1532 : le grand halo de l'étoile brillante dans L sans étoiles vient de Statistical Stretch ; règle de la fiche : jamais de Statistical Stretch sur L, les 3 GHS (GHS_1 calculé par GHS_auto, GHS_2_contraste préréglé, GHS_3 calculé par GHS_auto_fond), même en mode rapide. Puis, choix de l'utilisateur : plus aucun script d'étirement sur L, même en mode rapide (GHS_auto.js supprimé) ; le conteneur de L s'arrête avant l'étirement, les 3 GHS se font à la main.
- Script de la fiche `Fond_auto.js` (2 octobre 2026, demande de l'utilisateur : vérifier et régler le fond à la fin) : cible 0,12 = fond final de la fiche (0,12–0,14, 30–35 sur 255 ; données propres après NXT 0,10–0,12 ; fiche GHS_3). Fonction de transfert des tons moyens de PixInsight mtf(m, x) = (m − 1)·x / ((2m − 1)·x − m) (fonction mtf de PixelMath, celle de HistogramTransformation) ; équilibre m = f·(t − 1) / (2·t·f − t − f) pour amener le fond f sur t, vérifié en Node.js (f = 0,08 / 0,10 / 0,14 / 0,18 → 0,12000 ; un pixel à 0,5 passe à 0,61 / 0,55 / 0,46 / 0,38). Mesure du fond sur une grille de cases (médiane du quart le plus sombre), choix de la fiche pour que la galaxie ne fausse pas la mesure. Pas encore testé dans PixInsight.
- Icône `STF` du mode rapide (3 octobre 2026, demande de l'utilisateur : ouvrir le process STF normal, pas un script) : instance ScreenTransferFunction reprise d'une icône réelle (build/templates.json : table STF 4 lignes c0, c1, m, r0, r1 et paramètre interaction), mise au réglage neutre (c0 = 0, m = 0,5 : aucun étirement). Double-clic sur une icône de process = ouverture de la fenêtre du process avec ses paramètres (PixInsight Reference Documentation, Process Icons). Le bouton A (Auto Stretch) et Reset sont ceux de la fenêtre ScreenTransferFunction. Le script `STF_auto.js` écrit avant est supprimé.
- Script de la fiche `Nettoyage_sans_etoiles.js` (3 octobre 2026, demande de l'utilisateur : taches rondes floues sur l'image sans étoiles de NGC 1532). Mesures sur le JPEG de l'utilisateur (après LRGB et HDRMT_40) : fond 0,125, taches 0,20 à 0,33 (halo bleu de l'étoile brillante 0,26 / 0,28 / 0,33), bras faible de la galaxie 0,20 : un seuil de luminosité ne sépare pas les taches de la galaxie, d'où un masque par position (luminance de RGB_stars floutée à deux échelles) et une protection par étendue (luminance de l'image floutée 30 px). Origine des taches : halos d'étoiles laissés par StarXTerminator sur l'image linéaire, que l'étirement fait ressortir (constat sur les images de l'utilisateur, ordre SXT linéaire puis étirement choisi par l'utilisateur). Correction $T − m × max(0, lissé − fond), fond mesuré comme Fond_auto. Gains (40, 200) et rayons (12, 40 px) estimés pour des étoiles étirées d'un rayon de 3 à 10 px : à ajuster après essai. Pas encore testé dans PixInsight. Version 2 (même jour, après essai de l'utilisateur : masque sur presque tout le ciel, trous noirs autour de la galaxie, étoile brillante protégée à tort) : masque des étoiles BRILLANTES seulement, seuils calibrés sur les étoiles estimées du JPEG (étoiles = 1 − (1 − finale)/(1 − sans étoiles), luminance floutée 20 px à 2000 px de large : médiane des étoiles 0,010, 90 % sous 0,038, étoiles moyennes 0,06, brillantes 0,12 à 0,14, étoile bleue 0,37) ; fond local par ouverture morphologique (érosion puis dilatation, disque 25 px, 3 passes) au lieu du fond global ; protection supplémentaire des structures plus claires que le fond local de 0,15. Simulation Python (scipy) sur le JPEG : taches 0,18 → 0,11 (fond 0,10), halo bleu 0,19 / 0,23 / 0,29 → 0,14 / 0,18 / 0,23, bras de la galaxie inchangé (0,34 / 0,40 / 0,46), masque sur 2,5 % de l'image.
- Mode rapide, script de la fiche `Etoiles_auto.js` : courbe y = 3^a·x / ((3^a − 1)·x + 1) et répartition du Color Boost (ColorSaturation, 0,4 × Boost en 0 et 1, 0,7 × Boost en 0,5, Akima, hueShift 0 ; SCNR Average Neutral, pleine force) relues dans `star_stretch.js` (SetiAstro, Franklin Marek, v2.6, archive du 19 septembre 2026). Script sous licence CC BY-NC 4.0 : la fiche réécrit la formule avec PixelMath et ColorSaturation, sans reprendre son code. Courbe ColorSaturation : 0 = aucun changement (icône Opt_SaturateStars de la fiche : 2 sur les rouges, 0 sur les bleus). Pas encore testé dans PixInsight.
- Choix de la fiche après le mode rapide sur NGC 1532 (galaxie jugée trop saturée, étoiles trop pâles) : courbe de saturation ramenée à 0,5 → 0,65, Star Stretch Color Boost 1,3 (défaut du script 1,0 ; 0 à 2 ; saturation par teinte d'après le code du script, rubrique Star Stretch). Galaxie et étoiles sont traitées séparément jusqu'à la recombinaison : les deux réglages sont indépendants.
- Constat de l'utilisateur (PixInsight 1.9.5, 1er octobre 2026) : ImageSolver dans un ProcessContainer échoue après la convergence, « ImageSolverEngine.js:1610: Invalid view update request: The image is already being processed », puis SPFC « The image has no astrometric solution » ; les mêmes icônes lancées une par une marchent. D'où l'icône ImageSolver en une seule instance Script. Essais : lancer ImageSolver par `new Script` depuis un script échoue (« "filePath" is read-only », de même md5sum et parameters, constaté par l'utilisateur). Version retenue : ImageSolver inclus comme bibliothèque (`#define USE_SOLVER_LIBRARY true`, `#define SETTINGS_MODULE`, `#include "../ImageSolver/ImageSolver.js"`), comme WBPP dans [BPP-Solver.js](https://gitlab.com/pixinsight/PJSR/-/blob/master/src/scripts/BatchPreprocessing/BPP-Solver.js), puis le même enchaînement que [ImageSolver.js](https://gitlab.com/pixinsight/PJSR/-/blob/master/src/scripts/ImageSolver/ImageSolver.js) sur une vue (`initialize`, `SaveParameters`, `solveImage`) ; les réglages d'ImageSolver sont des paramètres de l'icône, lus par `LoadParameters`. Le `beginProcess` qui fait échouer le conteneur est dans [ImageSolverEngine.js](https://gitlab.com/pixinsight/PJSR/-/blob/master/src/scripts/ImageSolver/ImageSolverEngine.js), à l'écriture de la solution. Le script principal doit commencer par `#engine v8`, comme ImageSolver.js : sans lui, « SyntaxError: class is a reserved identifier » dans pjsr/astrometry/DMath.js (constaté par l'utilisateur). Option de secours ImageSolver_seul. Deuxième constat : les paramètres d'une icône Script sont transmis par une ligne de commande `run -x -p="nom,valeur" …` ; une valeur contenant des guillemets (liste JSON) la coupe (« Unterminated string literal »), d'où des valeurs sans guillemets.
- Etoiles_reduites : formule de Bill Blanshan (Transfer V2, `FromLukeAndBill.xpsm`) où l'image étoilée $T de Bill est remplacée par sa définition en mode screen, W = ~((~starless)*(~stars)), et starless par $T : même résultat que Etoiles_screen suivi de Blanshan Transfer, appliqué directement à l'image sans étoiles. PixelMath évalue les expressions pixel par pixel, ce qui permet d'affecter W comme variable.
- Masque_auto.js : demande de l'utilisateur (masque attaché dès sa création, partout). PixelMath (luminance Rec. 709, fond coupé à s, formule de l'icône Masque_L), Convolution paramétrique (flou, doc PixInsight : la plupart des masques doivent être floutés), puis `ImageWindow.mask`, `maskEnabled`, `maskInverted`, `maskVisible` ; retrait par `removeMask()`. Non testé dans PixInsight : l'effet d'un masque attaché pendant l'exécution d'un conteneur reste à vérifier.
- Fermer_vues.js : `ImageWindow.windowById(id).forceClose()` (PJSR) ; l'image cible n'est jamais fermée.
- HDRMT à 50 % (demande de l'utilisateur) : HDRMultiscaleTransform n'a pas de réglage de force ; le conteneur HDRMT_50 garde une copie de l'image, applique HDRMT, puis mélange a·résultat + (1 − a)·copie en PixelMath (a = 0,5), le « mélange 50 % avec l'original » déjà conseillé dans la fiche HDRMT.
- Choix de l'utilisateur : pas de DynamicCrop dans les icônes (masters déjà recadrés ou recadrage inutile).
- Choix de l'utilisateur : réduction d'étoiles Blanshan en option en LRGB et LHaRGB (pas de réduction systématique pour les galaxies).
- Choix de la fiche, option Boost_finition_light : même conteneur que Boost_finition en plus doux (courbe 0,25 → 0,24 / 0,75 → 0,76, saturation 0,57, LHE 80 px à 0,12, sous la fourchette de Chad Leader), après un essai du Boost normal jugé trop fort à 1:1 (bras cyan, aspect peint) sur NGC 1532.
- Choix de la fiche, option Boost_finition (conteneur) : petite courbe en S (0,25 → 0,23 ; 0,75 → 0,77) et saturation 0,5 → 0,60, puis LHE rayon 80 (entre les deux passes de Chad Leader) à 0,20, sa fourchette basse ; incrément volontairement faible pour être rejoué.
- Choix de la fiche, LHE en deux passes dans les workflows : rayons d'après Chad Leader (grand puis petit, ex. galaxie 140 px puis 32 px), Amounts plus forts que ses exemples (0,30 puis 0,25 au lieu de 0,20 puis 0,18 ; LHE_fin ramené de 0,30 à 0,25 après un aspect un peu peint à 1:1 sur NGC 1532) à la demande de l'utilisateur, qui voulait un effet plus marqué que la passe unique à 0,35.
- Choix de la fiche, après essai sur NGC 1532 (couleurs jugées ternes) : courbe de saturation de l'icône Courbes à 0,5 → 0,65 (au lieu de 0,6), puis, l'utilisateur trouvant deux passes meilleures (un peu fortes en saturation), courbe unique 0,25 → 0,19 / 0,75 → 0,81 et saturation 0,72 (deux passes de 0,22 / 0,78 et 0,65 donnent environ 0,19 / 0,81 et 0,755, calcul par interpolation linéaire), LRGBCombination Saturation 0,35 (au lieu de 0,40 ; plus bas = plus saturé, rubrique LRGBCombination). SCNR non appliqué par défaut aux étoiles RGB : calcul d'après la formule Average Neutral (G ramené à la moyenne de R et B quand il la dépasse), qui abaisse aussi le vert d'une étoile jaune correcte.
- Choix de la fiche : Star Stretch à Stretch Amount 6 dans les icônes (défaut du script 5, l'auteur conseille la prudence au-delà de 5), demandé par l'utilisateur après essai sur NGC 1532 (étoiles faibles invisibles à 5). Calcul (formule du script y = 3^a·x / ((3^a − 1)·x + 1)) : pixel 0,002 → 0,33 à 5, 0,46 à 5,5, 0,59 à 6.
- Choix de la fiche : Blanshan Transfer à S = 0,20 dans les workflows (valeur de Bill Blanshan : 0,15, gardée dans les icônes 01 et la section Réduction d'étoiles) ; d'après la description de Bill (plus bas = étoiles plus petites), 0,20 réduit moins, à la demande de l'utilisateur qui trouvait ses étoiles trop petites.
- Noms d'images pour la recombinaison des étoiles : suffixe « _stars » (s minuscule) de l'image d'étoiles de StarXTerminator, lu dans le titre de la fenêtre « RGB_stars » sur une capture de l'utilisateur (PixInsight 1.9.5, 1er octobre 2026) ; corrige une première version en « _Stars » (message de l'utilisateur et [Astroguide, StarXTerminator](https://astroguide.starlust.de/html/StarXTerminator1.html)) ; « NBtoRGB_stars » lu dans le code de NBtoRGBStars.js (SetiAstro, `P.newImageId`). Etoiles_screen écrit avec `$T` (image cible = image sans étoiles) pour ne pas dépendre du nom de la palette ; Blanshan Transfer V2 réécrit avec `$T` et `Final` permutés (Img1 = $T, image étoilée = Final), même formule que l'original de Bill Blanshan.
- Pratique de la fiche : en LRGB, Statistical Stretch sur le RGB et GHS sur L. Raisonnement de la fiche, sans source comparative : L porte la luminosité et le détail de l'image combinée (LRGBCombination remplace la luminosité du RGB par L, rubrique LRGBCombination), le RGB ne donne que la couleur ; Linked Stretch garde l'équilibre SPCC (rubrique Statistical Stretch) ; GHS en Colour mode garde mieux la saturation (documentation GHS), d'où les recours Saturation plus basse dans LRGBCombination ou Luma Only.
- Pratique de la fiche : Statistical Stretch à Target Median 0,25 suivi de GHS_3_fond (fond ramené vers 0,12–0,14), même logique que GHS : 1er étirement généreux (0,20–0,25, documentation GHS ; 0,25 = défaut de Statistical Stretch) puis fond final 0,12–0,14 (rubrique « Repères d'étirement »). Avec 0,10 (conseil de l'auteur pour une cible compacte), le fond est déjà sous la cible. GHS réservé à l'image sans étoiles : étoiles retirées en linéaire (RC Astro, rubrique StarXTerminator) et étirées avec Star Stretch.
- Calcul de la fiche, refait pour un pic à 0,25 après le 1er étirement (choix de l'utilisateur, dans la fourchette officielle 0,20–0,25) : étape 1, Stretch factor (SP = 0,9 à 1 × fond) 6,85–7,55 (fond 0,0005), 6,05–6,7 (0,001), 5,25–5,85 (0,002), 4,15–4,7 (0,005), 3,3–3,75 (0,01), 2,45–2,85 (0,02). Étape 2 sur un fond à 0,25 (b = 4, HP 0,9, SF 1) : SP 0,25 → fond 0,38 (s'éclaircit), SP 0,30 → 0,29, SP 0,35 → 0,23, SP 0,40 → 0,19. Étape 3 (HP = SP = fond − 0,03) : SF pour un fond à 0,13 = 0,95 (fond 0,23), 1,05 (0,25). Chaîne des icônes (GHS_2 SP 0,35 SF 1, puis GHS_3 SP = HP = 0,20 SF 1) : fond 0,25 → 0,231 → 0,127 ; nébulosité 0,40 → 0,55 → 0,49. Statistical Stretch 0,25 puis SP = HP = 0,22, SF 1 : fond 0,132.
- Calcul de la fiche, tableau « Valeurs de départ par étape » (première version, pic à 0,22) : équations de la [documentation du process GHS](https://www.ghsastro.co.uk/doc/tools/GeneralizedHyperbolicStretch/GeneralizedHyperbolicStretch.html) (section 5.2, D = e^(Stretch factor) − 1, branche hyperbolique b > 0, normalisation LP/HP) codées en Python. Étape 1 (b = 10, SP = 0,8 à 1 × fond) : Stretch factor pour amener le pic à 0,22 = 6,2 à 7,0 (fond 0,0005), 5,5–6,2 (0,001), 4,7–5,3 (0,002), 3,6–4,2 (0,005), 2,8–3,3 (0,01), 2,0–2,4 (0,02). Étape 2 (SP 0,30, b = 4, HP 0,9) : pente en SP × 2,9 (SF 1), × 6,8 (SF 2), × 16 (SF 3) ; fond 0,22 → 0,23 (SF 1), 0,19 (SF 2), 0,14 (SF 3). Étape 3 (b = 10, HP = SP = fond − 0,03) : SF pour un fond à 0,13 = 0,45 (fond 0,16), 0,65 (0,18), 0,8 (0,20), 0,9 (0,22), 1,05 (0,25) ; tons moyens 0,50 → 0,44–0,48. Aucune source ne publie de Stretch factor type : la documentation demande de le monter jusqu'au pic visé.
- Calcul de la fiche : exemple chiffré (SP 0,35, HP 0,8, LP 0,15) et repères « HP vers la valeur des étoiles », « LP vers la valeur du fond », déduits des définitions ci-dessus (linéaire au-dessus de HP, sous LP).

## Combinaison et narrowband

- Tutoriel — [Chaotic Nebula, luminance](https://chaoticnebula.com/pixinsight-luminance-integration/) : réglages LRGBCombination.
- Officiel — [PixInsight, combinaison broadband et narrowband](https://pixinsight.com/tutorials/narrowband/)
- Officiel — [PixInsight, notes M31 Ha](https://pixinsight.com/examples/M31-Ha/) : soustraction du continuum.
- Tutoriel — [Light Vortex, LRGB et narrowband](https://www.lightvortexastronomy.com/tutorial-combining-lrgb-with-narrowband.html) *(résumé ; site indisponible en septembre 2026)*
- Tutoriel — [Remote Astrophotography, NarrowbandNormalization](https://remoteastrophotography.com/using-narrowbandnormalization-to-enhance-your-narrowband-images/) : image étirée et sans étoiles, noms des réglages. *Page supprimée (410) au 30 septembre 2026 ; mêmes points confirmés par AstroWorldCreations, l'annonce du forum PixInsight et les icônes de theAstroShed.*
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
- Tutoriel — [Chaotic Nebula, LHE](https://chaoticnebula.com/unlocking-faint-details-a-guide-to-local-histogram-equalization/) : Contrast Limit 1,5 ou 2,0, Amount 1,000 = pas de mélange, mélange 50/50 conseillé ; masque RangeSelection Fuzziness 0,1, Smoothness > 0,6.
- Documentation — [Starlust Astroguide, LocalHistogramEqualization](https://astroguide.starlust.de/html/LocalHistogramEqualization.html) : définitions de Kernel Radius (petit = effet fort, bruit, anneaux ; grand = stable), Contrast Limit (1,0 = aucun changement, rester sous 3), Amount (0,75 = 3/4 traité), Histogram Resolution (8-bit, plus haut = plus lent, moins bon avec petits rayons), Circular Kernel (plus uniforme). Histogram Resolution : 8-bit pour la plupart des images, plus haut = plus précis mais plus lent, « peut mal fonctionner avec de faibles valeurs du rayon », et à essayer en cas de postérisation avec de grands rayons. D'où 12-bit pour LHE (150 px, environ 70 000 pixels par fenêtre) et 10-bit pour LHE_fin (40 px, environ 5 000 pixels, trop peu pour 4 096 niveaux) et LHE_moyen (80 px), après anneaux constatés autour du noyau de NGC 1532 en 8-bit (choix « meilleure qualité » de l'utilisateur).
- Tutoriel — [Chad Leader, Local Histogram Equalization](https://chadleader.wixsite.com/my-site/post/bringing-out-the-details-part-1-local-histogram-equalization-pixinsight) : Contrast Limit 2,0 « good for most images » ; deux passes (nébuleuse 212 px / 0,19 puis 42 px / 0,16 ; galaxie 140 px / 0,20 puis 32 px / 0,18) ; masque RangeSelection ; « LHE is very easy to overdo ».
- Officiel — [PixInsight, Dynamic Range and Local Contrast (NGC 7023)](https://pixinsight.com/tutorials/NGC7023-HDR/) : LHE implémente CLAHE ; Contrast limit 1,7 ; baisse de saturation à grande échelle.
- Tutoriel — [Chaotic Nebula, HDRMultiscaleTransform](https://chaoticnebula.com/pixinsight-hdr-multiscale-transform/) : couches 5 à 9 mélangées en PixelMath ; To lightness (V de HSV), To intensity (I de HSI), Preserve hue (h de CIE L*c*h), sans effet en mono ; Lightness mask protège le fond sombre.
- Officiel — [PixInsight, Multiscale Processing with HDRWaveletTransform (M101)](https://pixinsight.com/examples/HDRWT/M101/) : 6 couches = échelles 1, 2, 4, 8, 16, 32 px ; 4 itérations puis 1 ; Luminance mask pour agir sur les zones brillantes et éviter les anneaux après plusieurs itérations ; principe (contraste local d'une couche préservé, structures plus grandes comprimées).
- Documentation — [Starlust Astroguide, HDRMultiscaleTransform](https://astroguide.starlust.de/html/HDRMultiscaleTransform.html) : couches 4 à 6, itérations « often best value is 1 », Midtones balance automatique ou 0,1, Gaussian (11) meilleur que B3 Spline dans son test.
- Tutoriel — Light Vortex Astronomy, Enhancing Feature Contrast (https://www.lightvortexastronomy.com/tutorial-enhancing-feature-contrast.html, site injoignable le 30 septembre 2026 ; passages lus dans les extraits du moteur de recherche) : Overdrive 0,100 à 0,200, Median transform (moins d'anneaux, plus lent), Deringing à petites valeurs si anneaux, Midtones balance Automatic recommandé.

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
- Code — [Seti Astro, `statisticalstretch.js`](https://github.com/setiastro/pixinsight-updates-194) (archive SetiAstroScripts09.19.2026.zip, relue) : point noir médiane − Blackpoint Sigma × écart, puis fonction de transfert des tons moyens qui place la médiane sur Target Median ; option Linked Stretch pour la couleur (étirer les trois masters avec la même Target Median donne des médianes identiques). Remplace la référence au dépôt pixinsight-mcp, supprimé (404).
- Code — même archive, `statisticalstretch.js` v2.3, relu pour le détail des paramètres (30 septembre 2026) : plages des curseurs (Target Median 0–1, Blackpoint Sigma 0–10, Curves Boost 0–0,50, HDR Amount 0–1, HDR Knee 0,10–1, Luma Blend 0–1), σ = 1,4826 × MAD, point noir borné au minimum, médiane et MAD pondérées Rec. 709 en mode lié, moyenne des trois médianes pour la fonction de transfert, courbe Akima de Curves Boost, compression HDR sur la luminance, numIterations plafonné à 5, autoConvergence (tolérance 0,001), texte d'aide de l'auteur (Target Median 0,10 pour cibles compactes, 0,25 pour grandes nébuleuses ; rec709 recommandé).
- Code — même archive, `star_stretch.js` v2.6, relu (30 septembre 2026) : étirement PixelMath `((3^a)*$T)/((3^a - 1)*$T + 1)`, Stretch Amount 0–8 (défaut 5, info-bulle « Adjust above 5 with caution »), Color Boost 0–2 (défaut 1) appliqué par ColorSaturation (courbe Akima, points 0 ; 0,5 ; 1 à 0,4 ; 0,7 ; 0,4 × Boost), SCNR vert Amount 1,0 Average Neutral Preserve lightness, saturation et SCNR ignorés en mono, application sur la vue elle-même avec STF désactivé, refus du contexte global. Valeurs d'exemple (0,01 → 0,45 / 0,71 / 0,88) calculées avec cette formule.
- Code — même archive, `Halo-B-Gon.js` v2.1, relu (30 septembre 2026) : curseur Reduction Amount 0–3 (Extra Low, Low, Med, High ; défaut 1 = Low), boucle externe et boucle de courbes de `reductionAmount` itérations chacune (1, 1, 2 × 2, 3 × 3), courbes Akima (0,75 → 0,575 en Extra Low, 0,75 → 0,40 sinon), masque = luminosité UnsharpMask (σ 2, amount 0,66) inversée, HistogramTransformation (0,5725 ; 0,875), moins deux fois une MMT des trois premières échelles ; Linear Data (décoché) : `mtf(((.25)^5),$T)` puis `mtf(~((.25)^5),$T)` ; aucun paramètre d'icône lu. Valeur d'exemple (0,001 → 0,51) calculée.
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

## Couleurs LRGB

- Officiel — [Documentation SPCC](https://pixinsight.com/doc/docs/SPCC/SPCC.html) : blanc de référence Average Spiral Galaxy (moyenne des spectres S0 à Sdm) ; graphes corrects = droites suivant les points, croix du blanc dans le nuage ; forte dispersion souvent due à un mauvais flat ; calibration légèrement plus bleue qu'avec APASS, en général moins de 10 %.
- Officiel — [NASA APOD, M81 en vraies couleurs](https://science.nasa.gov/image-article/apod-1997-july-26-m81-in-true-color/) : noyau jaune (vieilles étoiles), bras bleus (jeunes étoiles chaudes).
- Recherche — [Buta, morphologie des galaxies en couleur (NED)](https://ned.ipac.caltech.edu/level5/Sept11/Buta/Buta15.html) : populations anciennes jaune orangé, bras dominés par les jeunes étoiles donc plus bleus.
- Cours — [UNLV (Jeffery), bras spiraux](https://www.physics.unlv.edu/~jeffery/astro/galaxies/spiral_arms_bars.html) : bras en vraies couleurs = mélange de bleu (étoiles OB), rose (régions HII) et brun sombre (poussière).
- Officiel — [NASA, NGC 3982](https://science.nasa.gov/asset/hubble/face-on-spiral-galaxy-ngc-3982/) : régions de formation d'étoiles roses, amas bleus, bandes de poussière.
- Encyclopédie — [Wikipédia, nébuleuse par réflexion](https://en.wikipedia.org/wiki/Reflection_nebula) (bleue : la diffusion est plus efficace pour le bleu) et [nébuleuse en émission](https://en.wikipedia.org/wiki/Emission_nebula) (rouge : raies de Balmer, surtout Ha).
- Officiel — [Las Cumbres Observatory, corps noir](https://lco.global/spacebook/light/black-body-radiation/) : pas d'étoile verte, une étoile qui culmine dans le vert émet aussi beaucoup de rouge et de bleu et paraît blanche.
- Règles de lecture à la sonde (cœur R ≥ G ≫ B, bras B au-dessus de R, HII R > B > G, aucune étoile avec G au-dessus de R et B) : déduites de la composition des couleurs ; aucune source ne les chiffre, la page l'indique.

## Couleurs LHaRGB

- Officiel — [PixInsight, notes de traitement Ha de M31](https://pixinsight.com/examples/M31-Ha/) : aucun filtre étroit ne bloque totalement le continuum ; sans soustraction, on renforce en rouge des halos d'étoiles de la galaxie et non de la nébulosité ; la soustraction abîme un peu les étoiles (PSF différentes).
- Encyclopédie — [Wikipédia, série de Balmer](https://en.wikipedia.org/wiki/Balmer_series) : Hα à 656 nm, Hβ à 486 nm ; la raie Hα donne aux nébuleuses en émission leur teinte rouge-rose en photo.
- Tutoriel — [AstroBackyard, HaRGB](https://astrobackyard.com/hargb-astrophotography/) : trop de Ha rougit toute l'image et grossit les étoiles.
- Régions HII roses : mêmes sources que la rubrique « Couleurs LRGB » (UNLV, NASA NGC 3982).
- Règles de contrôle (comparaison avec la copie LRGB, lecture à la sonde, cœur et étoiles inchangés) : déduites de la composition des couleurs et du principe de la soustraction du continuum ; aucune source ne les chiffre, la page l'indique.

## Couleurs RGB + SHO

- Tutoriel — [Optical Mechanics, SHO ou HOO](https://www.opticalmechanics.com/narrowband-astrophotography-sho-vs-hoo-guide/) : étoiles narrowband aux teintes peu naturelles ; poses RGB courtes pour des étoiles en vraies couleurs, qui remplacent les étoiles narrowband à la recombinaison.
- Standards des deux calques : rubriques « Couleurs SHO et choix de la palette » (nébuleuse) et « Couleurs LRGB » (étoiles calibrées, jamais vertes).
- Contrôles de recombinaison (restes d'étoiles SHO magenta, étoiles « collées », alignement RGB/SHO, fond de l'image d'étoiles) : pratique de la fiche, sans chiffre sourcé ; la page l'indique.

## Standard des étoiles sans RGB

- Tutoriel — [AIASTRO, étoiles RGB à partir du narrowband](https://aiastro.wordpress.com/2020/06/02/rgb-stars-from-narroband-data/) (relu) : couleurs d'étoiles non calibrées en narrowband ; en SHO/HOO brut, étoiles bleues trop vertes et oranges trop rouges ; G = 80 % OIII + 20 % Ha choisi en comparant à du RGB, propre au matériel de l'auteur ; vérification par calibration photométrique ; légère teinte verte résiduelle sur les étoiles bleues.
- Code — [Seti Astro, `NBtoRGBStars.js` v1.6](https://github.com/setiastro/pixinsight-updates-194) (relu) : « realistic RGB star image » ; R = 0,5·Ha + 0,5·SII (Ha seul sans SII), G = ratio·Ha + (1 − ratio)·OIII avec ratio 0,3 par défaut, B = OIII ; Star Stretch optionnel (Stretch Factor 5, Color Boost 1,0).
- Tutoriel — [Telescope Live, étoiles violettes en SHO](https://telescope.live/blog/how-remove-purple-stars-sho-images) : magenta, défaut courant de la palette Hubble.
- Officiel — [CorrectMagentaStars](https://github.com/terrordrummer/correctMagentaStars) : Amount 0,8 par défaut (0 à 1).
- Officiel — [Las Cumbres Observatory, corps noir](https://lco.global/spacebook/light/black-body-radiation/) : pas d'étoile verte.
- Sens du réglage de a dans G = a·Ha + (1 − a)·OIII : calcul (monter a baisse G quand OIII > Ha, le monte quand Ha > OIII) ; les valeurs 0,3 à 0,4 indiquent le sens, non sourcées ; règles de lecture à la sonde déduites de la composition des couleurs. La page l'indique.

## Standard des étoiles LRGB

- Couleurs calibrées par SPCC et absence d'étoile verte : rubrique « Couleurs LRGB » (documentation SPCC, Las Cumbres Observatory).
- Réglages Star Stretch (Stretch Amount, Color Boost) : rubrique Scripts (code SetiAstro) et fiche Star Stretch.
- Lecture sur le halo (cœur saturé), variété des couleurs, contrôles après recombinaison (couleur identique à l'image d'étoiles seule, anneaux sombres, halos, taille, fond) : pratique de la fiche, sans chiffre sourcé ; la page l'indique.

## Étoiles en LHaRGB

- Officiel — [PixInsight, notes de traitement Ha de M31](https://pixinsight.com/examples/M31-Ha/) : la soustraction du continuum abîme toujours un peu les étoiles, les PSF ne pouvant pas coïncider ; étoiles restaurées à partir de poses rouges.
- Tutoriel — [AstroBackyard, HaRGB](https://astrobackyard.com/hargb-astrophotography/) : trop de Ha grossit les étoiles.
- Déduction de la fiche (signalée sur la page) : dans l'ordre des étapes (injection avant SXT), les étoiles gardées contiennent l'injection ; variante « étoiles prises sur une copie du RGB avant injection », même principe que la restauration de l'exemple M31, non publiée telle quelle.

## Standard des étoiles HOO

- Mêmes sources que « Standard des étoiles sans RGB » (AIASTRO, `NBtoRGBStars.js`, Las Cumbres Observatory).
- Code — [Seti Astro, `NBtoRGBStars.js` v1.6](https://github.com/setiastro/pixinsight-updates-194) (relu) : entrée image couleur dual-band, Ha = canal rouge (canal 0), OIII = canal vert (canal 1) seul.
- Déduit par calcul, sans source : en HOO classique (G = B = OIII), magenta impossible, étoiles chaudes rouges ou saumon (jamais jaunes), froides cyan ; avec G = 0,2·Ha + 0,8·OIII, G > B sur une étoile chaude et G < B sur une froide. La page l'indique.

## Couleurs SHO et choix de la palette

- Tutoriel — [AstroBackyard, guide du narrowband et de la palette Hubble](https://astrobackyard.com/narrowband-imaging/)
- Tutoriel — [Optical Mechanics, SHO ou HOO](https://www.opticalmechanics.com/narrowband-astrophotography-sho-vs-hoo-guide/) : rendu or et bleu (teal) après réduction du vert ; oxygène vers le cyan, soufre et hydrogène vers l'or ; étoiles aux teintes peu naturelles ; HOO pour les cibles à SII faible ; California (Ha dominant, OIII faible) : HOO centré sur Ha ou hybride HaRGB.
- Tutoriel — [AstroImagery, couleurs de la palette Hubble](https://astroimagery.com/techniques/post-processing/hubble-palette-colours/) : beaucoup d'images publiées « très orange et bleu ».
- Tutoriel — [Light Vortex Astronomy, palette Hubble](https://www.lightvortexastronomy.com/tutorial-narrowband-hubble-palette.html) : combinaison brute très verte (Ha dominant) ; rendu orange et bleu, parfois avec des touches de vert. *Site injoignable, contenu connu par un résumé de recherche seulement ; la combinaison brute très verte est confirmée par Optical Mechanics.*
- Tutoriel — [Jon Rista, SCNR](https://jonrista.com/the-astrophotographers-guide/pixinsights/scnr/) : Average Neutral remplace le vert par la moyenne de R et B quand il la dépasse.
- Règles de lecture à la sonde (or : R ≥ G ≫ B ; cyan : B ≥ G ≫ R ; fond R = G = B) et tableau des ajustements NarrowbandNormalization : déduits de la composition des couleurs et des rôles des réglages déjà sourcés ; aucune source ne les chiffre, la page l'indique.
- Code — [Seti Astro, `PerfectPalettePicker.js` v1.3](https://github.com/setiastro/pixinsight-updates-194) (archive des scripts) : menu `Script › SetiAstro › Perfect Palette Picker` ; 16 palettes (HOO, HOS, HSO, HSS, OHH, OHS, OSH, OSS, SHH, SHO, SOH, SOO, Realistic1, Realistic2, Foraxx, Dynamic Inverse) ; case *Linear Input Data* cochée par défaut, qui étire chaque canal à une médiane de 0,25 (point noir médiane − 2,7 σ) ; Ha remplace SII s'il manque (et inversement) ; entrées OSC HaO3 et S2O3 (Ha ou SII = rouge, OIII = moyenne de G et B) ; clic sur une vignette = palette en pleine taille.

## Couleurs HOO

- Tutoriel — [StarTools, colorations populaires](https://www.startools.org/modules/composite/usage/popular-coloring) : HOO = Ha en rouge, OIII en vert et en bleu ; Ha rouge profond, OIII vert turquoise.
- Tutoriel — [Bortle 9 Astrophotography, workflow HOO](https://bortle9astro.com/field-guides/hoo-palette-workflow) : régions Ha rouge orangé, régions OIII bleu turquoise ; zones mixtes décrites « dorées » (divergence signalée sur la page : en HOO strictement classique, G = B, une zone mixte sort rose saumon à blanchâtre ; l'or n'apparaît qu'avec du Ha dans le vert).
- Tutoriel — [Optical Mechanics, SHO ou HOO](https://www.opticalmechanics.com/narrowband-astrophotography-sho-vs-hoo-guide/) : rouge contre cyan ; G = 0,85·OIII + 0,15·Ha pour adoucir le cyan et réchauffer ; SCNR léger si besoin ; étoiles narrowband aux teintes peu naturelles, étoiles RGB courtes en remplacement.
- Tutoriel — [Galactic Hunter, combinaison bicolore](https://www.galactic-hunter.com/post/pixinsight-bi-color-combination-tutorial) : Ha et OIII ensemble dans le vert pour s'approcher du style Hubble.
- Règles de lecture à la sonde (Ha : R ≫ G ≈ B ; OIII : G ≈ B ≫ R ; mixte : R haut, G ≈ B ; fond R = G = B) et couleur des zones mixtes en HOO classique : déduites de la composition des couleurs ; aucune source ne les chiffre, la page l'indique.

## PixInsight 1.9.4 et 1.9.5

- Officiel — [PixInsight 1.9.5 Lockhart](https://pixinsight.net/dev/index.php?articles/pixinsight-1-9-5-lockhart-released.21/) : module MachineLearning (MLDenoise) ; ImageIntegration avec normalisation locale environ 9 fois plus rapide (183 images : 25 min → moins de 3 min) ; DrizzleIntegration plusieurs fois plus rapide, sans tables de gouttes ; Real-Time Preview en 32 bits flottants ; ImageSolver, option *Recursive surface splines* ; solutions astrométriques 1.9.5 illisibles par les versions précédentes (la 1.9.5 lit les anciennes) ; lancer *Process › Thread Performance Analysis* après installation ; modules à recompiler avec PCL 1.9.5 « pour bénéficier » des nouvelles routines ; macOS 15+, Windows 11, Linux GLIBC 2.35+, AVX2/FMA3 sur x64.
- Officiel — [PixInsight 1.9.4 Lockhart](https://pixinsight.net/dev/index.php?ams/pixinsight-1-9-4-lockhart-released.15/) : moteur JavaScript V8 ; instances d'AutomaticBackgroundExtractor et de SubframeSelector à recréer ; première version native Apple Silicon ; macOS 15 et 26 testés, 11 à 13 non pris en charge.
- Dépôts (fichiers `updates.xri` lus le 30 septembre 2026) : [RC Astro](https://www.rc-astro.com/PixInsight) 1.9.4:1.9.5 ; [GHS](https://www.ghsastro.co.uk/updates/) macOS 1.9.4:1.9.99, Windows 1.9.0:1.9.99 ; [NarrowbandNormalization](https://www.cosmicphotons.com/pi-modules/narrowbandnormalization/) macOS 1.9.4:1.9.99, Windows et Linux 1.9.0:1.9.99 ; [GraXpert](https://pixinsight.deepskyforge.com/update/graxpert-process/) 1.9.0:1.9.10 ; [SetiAstro](https://updates.setiastro.com/) 1.9.4:1.9.5 ; NBColourMapper, StarReduction, ScreenStars 1.9.4:1.9.99. ImageBlend : réponse anti-robots, non contrôlé.
- Code — [pixinsight-connector 2.3.0](https://www.npmjs.com/package/pixinsight-connector) (Min Xie, npm, 28 septembre 2026 ; exige PixInsight 1.9.5+), `src/tools/processes.mjs` : MGC piloté par script avec `P.useMARSDatabase = true` et `P.grayMARSFilter` = `L`, `R`, `G`, `B`, `Ha` ou `OIII` selon le filtre du master mono ; commentaire « the MARS database has no SII band » (l'outil utilise alors `Ha` ; la fiche préfère GradientCorrection ou DBE pour SII). Valeurs du paramètre confirmées ; texte affiché dans le menu de MGC non vu dans l'interface. Base des icônes `MGC_MARS_H` et `MGC_MARS_O` (identiques à `MGC_MARS` sauf `grayMARSFilter`).
- Recherche — [NixOS, paquet PixInsight 1.9.5-20260917](https://github.com/NixOS/nixpkgs/pull/564758) : date de version.
- Officiel — [PixInsight, MARS DR2](https://pixinsight.net/dev/index.php?articles/mars-dr2.18/) (21 juin 2026) : couverture large bande de tout l'hémisphère nord, narrowband Ha et [O III] jusqu'à +75°, sud jusqu'à −15° ; sélection de la base dans MGC ; exemple de configuration avec « MARS DR2 1.0.3 » et « MARS-u DR1 1.0.1 ».
- Tutoriel — [Stirling Astrophoto, MGC](https://stirlingastrophoto.com/posts/multiscale-gradient-correction/) : installation par la clé à molette de MGC › Add › fichier .xmars ; les « 1,35 Go » concernent l'ancienne base MARS 1.1.1 (août 2025), pas DR2 : taille retirée de la fiche.
- Presse — [ScopeTrader, MARS DR2](https://scopetrader.com/mars-dr2-for-pixinsight-dropped/) (article du 29 juin 2026) : filtres R, G, B, Ha et OIII ; hémisphère nord complet en large bande, narrowband jusqu'à +75° de déclinaison, extension sud jusqu'à −15° ; base 2 à 6 fois plus profonde. Fichier .xmars d'environ 1,35 Go et installation par la clé à molette de MGC : résumé de recherche (AstroBin, Cloudy Nights), non relu directement.

## Icônes de script (process Script)

- Modèle — [theAstroShed, icônes de process](https://github.com/jamiesmith/pixinsight-icons) : format réel d'une instance Script (`filePath` en `$PXI_SRCDIR/scripts/…`, `md5sum`, table `parameters` en lignes `id` / `value`, `information`) ; chemins `AdP/ImageSolver.js` et `CorrectMagentaStars/CorrectMagentaStars.js` (avec `scnrAmount` 0,8 et `scnrPresLight`) ; table vide écrite `rows="0"/>`.
- Officiel — [Forum PixInsight, somme de contrôle des scripts](https://pixinsight.com/forum/index.php?threads/restore-script-from-process-icon.14091/) : une icône dont l'empreinte ne correspond plus au script est bloquée ; Juan Conejero : ouvrir l'icône et effacer la somme MD5 pour l'exécuter.
- Code — archive SetiAstro `SetiAstroScripts09.19.2026.zip` ([dépôt](https://github.com/setiastro/pixinsight-updates-194), servie pour 1.9.4 à 1.9.5) : chemins, empreintes MD5 et paramètres lus (`Parameters.has`) de statisticalstretch.js, star_stretch.js (v2.6), FindBackground.js, ContinuumSubtraction.js ; NBtoRGBStars.js v1.6 définit `load()` sans l'appeler (paramètres d'icône ignorés) ; Halo-B-Gon.js et PerfectPalettePicker.js n'en lisent pas ; Statistical Stretch, Star Stretch, NB to RGB et Find Background refusent le contexte global.
- Code — [CorrectMagentaStars sur GitHub](https://github.com/terrordrummer/correctMagentaStars) v1.1 : exécution directe sur une vue ou l'image active, paramètre `scnrAmount` ; version livrée avec PixInsight différente (empreinte de l'icône theAstroShed ≠ fichier GitHub), d'où une empreinte laissée vide.
- Code — [psf-guard](https://github.com/theatrus/psf-guard) (`wbpp.rs`, vérifié contre PixInsight 1.9.5 et WBPP 3.1.0) : WBPP 3.x dans `src/scripts/BatchPreprocessing/BPP-Main.js`, réglages lus depuis `Runtime.jsArguments` (ligne de commande), d'où une icône WBPP sans paramètres.
- Non vérifié : NBColourMapper (paquet 3.1 derrière une protection anti-robots, chemin et paramètres inconnus) et NBRGBCombination (livré avec PixInsight, chemin inconnu) restent des icônes-notes ; chargement et lancement des icônes de script non testés dans PixInsight.

## Schémas de la fiche

Les schémas ne reprennent que des faits déjà sourcés plus haut ; ils n'ajoutent aucun réglage.

- Frises des workflows, arbre de choix, comparaison large bande / narrowband, circuit des étoiles : ordre des étapes et phase linéaire ou étirée tirés des étapes de la fiche (sources des rubriques correspondantes).
- Courbes GHS : calculées avec l'équation hyperbolique généralisée de David Payne (b > 0) telle qu'elle est codée dans les formules PixelMath de Bill Blanshan (`FromLukeAndBill.xpsm`, [theAstroShed](https://github.com/jamiesmith/pixinsight-icons)) ; D = 10, SP = 0,1, b = 10 et b = 1, sans LP ni HP. Lecture des paramètres d'après la [documentation GHS](https://www.ghsastro.co.uk/doc/tools/GeneralizedHyperbolicStretch/GeneralizedHyperbolicStretch.html).
- Étoiles LRGB (section LRGB) : valeurs illustratives, rubrique « Standard des étoiles LRGB ».
- Étoiles HOO (section HOO) : schéma calculé, rubrique « Standard des étoiles HOO ».
- Étoiles sans RGB (section SHO sans RGB) : valeurs illustratives, rubrique « Standard des étoiles sans RGB ».
- Calques RGB + SHO (section RGB + SHO) : schéma des deux calques et de leurs contrôles, rubrique « Couleurs RGB + SHO ».
- Lecture des couleurs LHaRGB (section LHaRGB) : valeurs illustratives, règles de la rubrique « Couleurs LHaRGB ».
- Lecture des couleurs LRGB (section LRGB) : valeurs illustratives, règles de la rubrique « Couleurs LRGB ».
- Lecture des couleurs HOO (section HOO) : valeurs illustratives, règles de la rubrique « Couleurs HOO ».
- Lecture des couleurs SHO (section RGB + SHO) : valeurs illustratives, règles de la rubrique « Couleurs SHO et choix de la palette ».
- Échelle du fond (section GHS) : reprend les valeurs de la rubrique « Repères d'étirement ».
- Continuum : filtre R vers 600–700 nm, raie Ha à 656,3 nm, filtre Ha de 3 nm et formule `Ha_cs = Ha − k·(R − med(R))`, déjà sourcés (rubrique Combinaison et narrowband). Les hauteurs sont schématiques, pas à l'échelle.

## Dernier audit (30 septembre 2026)

- **Réglages page contre icônes** : les 38 fiches outils de la page comparées aux réglages de toutes les icônes (BXT, NXT, SXT, SCNR, LHE, HDRMT, MorphologicalTransformation, LRGBCombination, CosmeticCorrection, GHS, SPCC, SPFC, MGC, DBE, NarrowbandNormalization, LinearFit, scripts). Écarts corrigés : fiche MGC sans les bandes MARS Ha et OIII ; fiche BXT dont la fourchette générale (0,50 à 0,90) ne couvrait pas le 0,40 à 0,60 conseillé pour le RGB ; fiche Automatic Continuum Subtraction sans les réglages préréglés dans son icône ; fiche ImageSolver sans l'option de distorsion de la 1.9.5.
- **Descriptions d'icônes contre réglages** : 129 valeurs vérifiées ; 3 descriptions complétées (Sharpen Stars de BXT_L et BXT_L_H, Lightness de H_en_luminance). Les valeurs d'accentuation de BXT Correct Only sont ignorées par le process, donc non citées.
- **Cohérence interne de la page** : chaque réglage chiffré relevé partout où il apparaît (Denoise, Nonstellar, Sharpen Stars, Saturation, Hot sigma, k, Target Median, Amount, Stretch Amount, drizzle, pic et fond de GHS, b, LHE) ; seule incohérence, la fourchette BXT ci-dessus.
- **Fiches des scripts contre leur code** (archive SetiAstro du 19 septembre 2026, CorrectMagentaStars) : valeurs par défaut et plages de Statistical Stretch, Star Stretch (0 à 8, 0 à 2), Halo-B-Gon (Low), NB to RGB Star Combination, Find Background et CorrectMagentaStars conformes.
- **Versions** : RC Astro suite 2.6.9 (7 septembre 2026) : corrections de bugs, pas de nouveau réglage, BXT en AI4, NXT en AI3, SXT en AI11 ; GHS 3.1.0 (recompilé pour la 1.9.4) ; NarrowbandNormalization 1.1 ; StarReduction 2.1 ; PixInsight 1.9.5 (rubrique dédiée).
- **Liens** : 125 URL uniques testées (page, sources, liste des dépôts, README). 96 répondent directement ; 20 renvoient 403 (GitHub filtré par le réseau de test, AstroBin, Cloudy Nights, npm, GraXpert) ; Star-watcher répond avec un navigateur. Liens morts traités : pixinsight-mcp (dépôt supprimé, remplacé par le code de statisticalstretch.js), Remote Astrophotography (410, points confirmés ailleurs), ancien tutoriel Telescope Live (404, remplacé par sa nouvelle adresse), Light Vortex (injoignable, signalé). Les racines de dépôt updates.setiastro.com et raw.githubusercontent.com/… renvoient 404 par nature ; leurs index updates.xri répondent.
- **Icônes** : 258 icônes dans 9 fichiers ; XML valide, identifiants uniques, une description par icône de workflow. Schéma XPSM officiel toujours hors ligne. Chargement dans PixInsight non testé.
- **Doublons** : trois dépôts apparaissent dans deux rubriques (AutoIntegrate, Seti Astro, CorrectMagentaStars), volontairement, car ils justifient des points différents.

## NarrowbandNormalization (module)

- Officiel — [Dépôt Cosmic Photons du module](https://www.cosmicphotons.com/pi-modules/narrowbandnormalization/) : module 1.1 pour PixInsight 1.9 (Windows et macOS) examiné ; valeurs internes Palette_HOO, Palette_SHO, Palette_HSO, Palette_HOS ; Lightness_Off, Lightness_Preserve, Lightness_Ha, Lightness_OIII, Lightness_SII ; Blend_Mode1 à 3.

## Non vérifié

Points toujours sans source directe (contrôle du 30 septembre 2026) :

- Crop_commun.js (7 octobre 2026) : ouverture de DynamicCrop par `launch()` et lecture du dernier DynamicCrop dans l'historique de Crop_ref non testées dans PixInsight ; effet de DynamicCrop sur la solution astrométrique non vérifié (crop fait avant Solver_auto).
- Ha en luminance en HOO : aucune valeur de Saturation propre au HOO dans une source lisible ; la fiche garde 0,40 (réglage LRGBCombination de Chaotic Nebula). Un résumé de recherche cite Lightness 0,5 / Saturation 0,25 pour ajouter Ha à une image HOO ou SHO, sans source retrouvée ; les tutoriels lus disent seulement « ajuste la saturation au besoin » (The Astro Geek, Madratter).
- MLDenoise contre NoiseXTerminator : pas de comparaison rigoureuse. Usage officiel vérifié (images linéaires calibrées en couleur, modèle .xmlm, [annonce PixInsight](https://pixinsight.net/dev/index.php?articles/technology-preview-mldenoise-for-macos-arm64.19/)) ; avis « très prometteur » de [ScopeTrader](https://scopetrader.com/pixinsight-mldenoise-technology-preview-for-macos-arm64-released/) ; retours d'utilisateurs mitigés (fil AstroBin inaccessible, contenu connu par un résumé). La fiche garde NXT.
- Chargement des icônes dans PixInsight : impossible à tester ici ; schéma XPSM officiel introuvable (404 à l'adresse déclarée dans les fichiers, jamais archivé). Contrôle de substitution : 213 icônes sur 258 ont exactement la structure d'icônes réelles du même process ; les 45 icônes SPFC, MGC et DBE (sans modèle réel) utilisent les noms de paramètres employés en 2026 par AutoIntegrate (SPFC, MGC), pixinsight-connector (SPFC, MGC) et pixinsight-mcp d'iftahs (DBE). Deux paramètres SPFC non confirmés (psfChannelSearchTolerance, outputDirectory, copiés du modèle SPCC) ont été retirés par prudence.
- Libellé affiché dans le menu MARS de MGC : valeurs du paramètre `Ha` et `OIII` confirmées par du code, texte de l'interface non vu.
- NBColourMapper et NBRGBCombination : chemin d'installation non vérifiable (paquet derrière une protection anti-robots ; script livré avec PixInsight), d'où des icônes-notes.

- Pas encore confirmés dans PixInsight par l'utilisateur (5 octobre 2026) : Sharp_MMT depuis sa fenêtre et cwApplyOnCopy nouvelle version (résultat recalculé sur la vue) ; Saturation_grosses après la correction de l'« Unknown error » ; Etoiles_grosses sans anneau (vérifié seulement en simulation) ; T_Turbo_debut ; SCNR_etoiles_violet (Invert en script). Réglages choisis sans source chiffrée : Courbes de C_Finition saturation 0,58 (au jugé de l'utilisateur : 0,65 trop saturé), NXT_dernier Denoise 0,25.

Points clos au dernier contrôle (30 septembre 2026) :

- Part du Ha à ajouter au bleu en LHaRGB : rapport intrinsèque Hα/Hβ = 2,86 (cas B, 10⁴ K, 10² cm⁻³, Osterbrock 1989), relu dans [Momcheva et al. 2013, arXiv 1207.5479](https://arxiv.org/abs/1207.5479) ; Hβ ≈ 0,35 × Hα, plafond physique indiqué sur la page ; les « 80 % / 20 % » des tutoriels en sont une approximation (tutoriel d'origine, arciereceleste.it, désormais en 404).
- SPCC : noms et valeurs de l'icône (neutralizeBackground, −2,80 / +2,00, backgroundUseROI) identiques à ceux d'AutoIntegrate (28 septembre 2026, compatible 1.9.5). Le nom `backgroundNeutralizationEnabled` utilisé par pixinsight-connector ne correspond à aucune icône réelle : erreur probable de cet outil (une propriété inconnue ne provoque pas d'erreur en JavaScript).
- MARS DR2 : date officielle 21 juin 2026 ([annonce PixInsight](https://pixinsight.net/dev/index.php?articles/mars-dr2.18/)) ; la taille « 1,35 Go » concernait l'ancienne base 1.1.1 et a été retirée ; installation par la clé à molette de MGC confirmée (Stirling Astrophoto).
- Emplacement du script Find Background dans le menu : `Script › SetiAstro › Find Background` (code v1.2.2).
- GHS par filtre : pas de valeur fixe de Stretch factor, par conception ; la méthode officielle vise un pic d'histogramme vers 0,20–0,25 et le même fond pour tous les canaux, ce que suivent la fiche et les icônes.
- NarrowbandNormalization : Palette_SHO confirmée dans le module ; icônes réelles ajoutées.
- Icône SPFC L : courbe du filtre Antlia V Pro L approchée par un plateau de 95 % entre 420 et 715 nm, d'après les caractéristiques publiées ; la courbe mesurée n'est pas disponible.

## Masques

- Tutoriel — [Cosgrove's Cosmos, Using Masks as a Superpower in PixInsight](https://cosgrovescosmos.com/tips-n-techniques/masks-asa-auperpower-in-pi) : valeurs de masque (0, 0,5, 1), masque de luminance par CIE L* (RGBWorkingSpace 1:1:1), RangeSelection (fuzziness, smoothness), ColorMask, GAME, masques d'étoiles par StarNet2 ou StarXTerminator plutôt que StarMask, Convolution pour adoucir, MorphologicalTransformation pour grossir ou rétrécir, PixelMath max()/min(), anneau par soustraction ; « Being able to process a starless image means you no longer need a star mask to protect the stars ».
- Officiel — [PixInsight, Using Masks](https://pixinsight.com/doc/legacy/LE/15_masks/using_masks/using_masks.html) : sélection du masque (Ctrl+M, menu Mask), inversion, affichage ; « many masks must be blurred ».
- Officiel — [RC Astro, StarXTerminator 2.2.0 : mask handling](https://www.rc-astro.com/starxterminator-2-2-0-proper-mask-handling/) : « Masked (black) areas are protected from star removal » (cœurs compacts de galaxies).
- Tutoriel — [Chaotic Nebula, luminance mask](https://chaoticnebula.com/pixinsight-luminance-mask/) : extraction CIE L*, étirement, flou par MultiscaleLinearTransform (premières couches désactivées) ; aucune valeur chiffrée publiée.
- Officiel — [PixInsight, Dynamic Range and Local Contrast](https://pixinsight.com/tutorials/NGC7023-HDR/index.html) : masque pour LHE construit avec HistogramTransformation, MorphologicalTransformation, ATrousWaveletTransform et CurvesTransformation, sans valeurs chiffrées.
- Scripts — [ColorMask, infocusAstro](https://infocusastro.com/colormask-script/) (livré avec PixInsight, Script › Utilities) ; [ColourMask, Mike Cranfield](https://github.com/mikec1485/ColourMask) (roue de teintes, STF) ; [GAME, Telescope Live](https://telescope.live/blog/using-game-script-create-mask-pixinsight) (Script › Utilities › GAME).
- Modules et scripts en un bouton — [Lighthouse Suite, LuminosityMasks](https://www.lighthousesuite.org/) (gratuit d'après les données structurées du site, Windows et macOS, Process › Mask Generation, attache le masque en un clic ; versions de PixInsight non précisées) ; [DeepSkyWorkflows, CreateLumMask](https://github.com/DeepSkyWorkflows/DeepSkyWorkflowScripts) (code lu : extraction de la luminance, auto-STF, HistogramTransformation, sans dialogue ; dernier commit 9 septembre 2022 ; dépôt https://deepskyworkflows.com/pixinsight).
- Calculs de la fiche : formule de l'icône Masque_L (poids Rec. 709 de `statisticalstretch.js`), valeur par défaut s = 0,14 tirée du fond final 0,12–0,14 de la fiche (GHS), réglage HistogramTransformation (Highlights = (S − s)/(1 − s), Midtones = (F − s)/(S − s)) déduit des fonctions de HistogramTransformation (MTF(m, m) = 0,5).

## CurvesTransformation

- Officiel — [PixInsight, Curves Transforms](https://www.pixinsight.com/doc/legacy/LE/17_curves/curves_transforms/curves_transforms.html) : canaux R, G, B, RGB/K (même courbe sur chaque canal, ou canal unique en mono), L (via CIE L*a*b*), H (via HSV, « the new H value is interpolated »), S (« varies saturation as a function of itself », saturer les pixels ternes sans toucher aux saturés) ; interpolation par splines cubiques ou linéaire.
- Tutoriel — [Madratter, CurvesTransformation Part 1](https://astroimages.weebly.com/curvestransformation-part-1.html) : pente raide = plus de contraste ; courbe en S qui abaisse aussi le bruit du fond ; valeur K du curseur dans la barre d'état pour placer les points.
- Tutoriel — Light Vortex, Touching Up Colour in Images (https://www.lightvortexastronomy.com/tutorial-touching-up-colour-in-images.html, site injoignable ; extrait du moteur de recherche) : courbe H, un point au-dessus des bleus monté vers les pourpres change les bleus en pourpres, orangés descendus vers les rouges.
- Icônes : types de courbe et noms de canaux (R, G, B, K, A, L, a, b, c, H, S ; interpolation AkimaSubsplines) relevés dans l'instance de référence `.xpsm` (theAstroShed, PixInsight 1.9.3).

## Conteneurs de process

- Modèle — [theAstroShed, icônes de process](https://github.com/jamiesmith/pixinsight-icons) : trois *ProcessContainer* réels (`RGB_PostProcess` : SPCC → BXT → NXT → script → SXT → script ; `for_each_in_RGB` ; `for_each_SHO__ADD_CROP`), générés par PixInsight 1.9.3 : instances imbriquées sans identifiant, attribut `enabled="true"`, pas de description sur le conteneur. Format recopié pour les fichiers Conteneurs-X et le préparateur ; non testé dans PixInsight 1.9.5.

## Solution astrométrique (ImageSolver)

- Officiel — [PixInsight, documentation SPCC](https://pixinsight.com/doc/docs/SPCC/SPCC.html) : l'image doit avoir une solution astrométrique valide, calculée par le script ImageSolver.
- Forum — [PixInsight, plate solve requirements for SPCC](https://pixinsight.com/forum/index.php?threads/what-exactly-are-the-plate-solve-information-requirements-for-spcc.22062/) *(résumé)* : SPCC demande une solution dans les métadonnées PixInsight ; une solution présente seulement dans l'en-tête FITS n'est pas reconnue.
- Tutoriel — [Telescope Live, ImageSolver explained](https://telescope.live/blog/pixinsight-image-solver-script-explained) *(résumé)* : après recadrage ou combinaison, la solution est perdue ; résoudre avant PCC/SPCC.
- Outil — [DynamicAstroCrop (deepskycolors)](http://www.deepskycolors.com/pixinsight/dynamicastrocrop/) *(résumé)* : les process géométriques standard (DynamicCrop, Resample, Rotation…) suppriment la solution astrométrique ; DynamicAstroCrop recadre en la conservant. Non testé.
- Conséquence dans la fiche (1er octobre 2026) : ImageSolver remis dans le chemin principal de tous les workflows, avant SPFC, et avant le SPCC des étoiles RGB du workflow RGB + SHO.

## LinearPatternSubtraction

- Officiel — [PixInsight, Correcting Defective Lines (LinearDefectDetection et LinearPatternSubtraction, Vicent Peris)](https://pixinsight.com/tutorials/LDD-LPS/) : rôle de chaque paramètre (Target is active image, Correct columns, Correct entire image, Defects file, Layers to remove, Rejection limit, Global rejection, Background reference region = zone la plus sombre) ; correction faite avant l'alignement et l'intégration ; sur les masters seulement après vérification.
- Forum — [PixInsight, Manually running LinearPatternSubtraction script fails](https://pixinsight.com/forum/index.php?threads/manually-running-linearpatternsubtraction-script-fails.19805/) et [Error with Linear Pattern Subtraction Script](https://pixinsight.com/forum/index.php?threads/error-with-linear-pattern-subtraction-script.21491/) *(résumés)* : erreur `partialColumnOrRow is undefined` (LinearPatternSubtraction.jsh, ligne 404) sur une image intégrée avec Correct entire image coché et sans fichier de défauts ; réponse : script prévu pour les brutes. Noms de paramètres vus : targetIsActiveImage, layersToRemove, rejectionLimit, globalRejection.
- Réglages, chemin et noms des paramètres de l'icône : relevés sur l'icône Script créée par l'utilisateur dans PixInsight 1.9.5 (1er octobre 2026) : `$PXI_SRCDIR/scripts/PatternCorrection/LinearPatternSubtraction.js`, MD5 e0dfe7d0bf6799a1a75f3a8089a8dd64, 16 paramètres (inputFiles, targetIsActiveImage, closeFormerWorkingImages, outputDir, correctColumns, correctEntireImage, defectTableFilePath, postfix, layersToRemove, rejectionLimit, globalRejection, globalRejectionLimit, backgroundReferenceLeft/Top/Width/Height).
- Code — `LinearPatternSubtraction.js` (version 1.02, publié le 7 avril 2025) et `pjsr/LinearPatternSubtraction.jsh` (15 septembre 2026), fournis par l'utilisateur depuis son installation PixInsight 1.9.5 et relus le 1er octobre 2026 : `main()` refuse l'exécution sur une vue et ouvre toujours le dialogue ; moteur `LPSEngine` (propriétés et `execute()`), statistiques de fond médiane/MAD, transformée en ondelettes médianes, rejets global et itératif ; listes de défauts initialisées à `[]` avant `lineList` (le plantage `partialColumnOrRow is undefined` des anciennes versions ne peut plus se produire) ; menu `Pattern Correction > LinearPatternSubtraction`.
- Script de la fiche — `docs/process-icons/scripts/LPS_UnClic.js` (installé dans `$PXI_SRCDIR/scripts/clodoweg/`, seule variable de chemin vérifiée dans des icônes réelles, valable sur Mac et PC) : appelle `LPSEngine` sans dialogue avec les réglages de l'icône, zone de fond la plus sombre (carrés de 512 px, marge de 5 %), fenêtres de travail fermées, glisser sur une image accepté. Syntaxe JavaScript vérifiée hors PixInsight ; non testé dans PixInsight.
- Paramètres de l'icône ImageSolver : chemin `$PXI_SRCDIR/scripts/ImageSolver/ImageSolver.js` et noms des 51 paramètres (metadata_*, solver_*, version 6.4.2) relevés sur une icône fonctionnelle fournie par l'utilisateur (1er octobre 2026). Valeurs adaptées au matériel : focale 2 939 mm, pixel 3,76 µm, résolution = atan(3,76 µm / 2 939 mm) = 7,330e-5 °/px ; RA, Dec et dates volontairement omises (lues dans chaque image). MD5 laissé vide (version installée inconnue). Script `ImageSolver_Date.js` de la fiche : DATE-OBS par défaut 2020-01-01 seulement en l'absence de date ; syntaxe vérifiée, non testé dans PixInsight.
- Script de la fiche `Combiner_RGB.js` : combinaison PixelMath R, G, B en image couleur (comme l'ancienne icône), copie de l'en-tête FITS du rouge (une image créée par PixelMath n'hérite pas des mots-clés, d'où l'absence de coordonnées pour ImageSolver), fermeture forcée des masters. Syntaxe vérifiée, non testé dans PixInsight.

## Correction : courbe du filtre L dans SPFC (1er octobre 2026)

- Constat de l'utilisateur (PixInsight 1.9.5) : SPFC sur le master L s'arrête avec « Parsing CSV spectrum parameter (gray filter): At least 5 items are required, only 4 are available ». La courbe approchée du filtre L (Antlia V Pro L, et Astronomik L-2 du fichier 03) n'avait que 6 ou 7 points. Correction : même forme, rééchantillonnée tous les 2 nm (251 points) par `densify()` dans `make_icons.py`. Les courbes R, G, B (plus de 100 points) et la courbe QE ne sont pas touchées. Courbe toujours approchée (bande 420–715 nm) : non mesurée par le fabricant.
- Constat de l'utilisateur (PixInsight 1.9.5, 1er octobre 2026) : les fichiers MARS déclarés dans les préférences de MGC (« Default MARS Database Files ») ne sont pas repris par une instance existante ; l'icône a donné « No MARS database files have been selected » jusqu'au clic sur **Default Files** dans la section MARS Database de l'instance, qui affiche alors la liste cochée (MARS-DR1-u01-1.0.1, MARS-DR2-1.0.3-s08). Chaque instance garde sa liste ; les icônes de la fiche n'en contiennent pas (chemins propres à chaque ordinateur).
- Constat de l'utilisateur (1er octobre 2026) : sur une cible de l'hémisphère sud, MGC trouve les deux fichiers (MARS-DR1-u01-1.0.1 et MARS-DR2-1.0.3-s08, seuls fichiers XMARS de la distribution : 134 Mio et 1,64 Gio) mais « 0 reference image(s) available » puis « No reference data found for filter 'R' » : cible hors de la couverture (nord complet, sud jusqu'à −15° environ selon l'annonce DR2 et ScopeTrader). Consigne ajoutée : GradientCorrection ou DBE pour ces cibles.


## Finition hors PixInsight (Photoshop, Affinity, Lightroom) — recherche du 4 octobre 2026
- AstroBackyard, « My Astrophotography Processing Workflow in PixInsight & Photoshop » (https://astrobackyard.com/astrophotography-processing-workflow/) : PixInsight pour la partie technique (calibration des couleurs, bruit, déconvolution, retrait des étoiles, gradient), Photoshop pour la finition créative : courbes en petites touches, calques et masques, filtre Camera Raw (curseurs TSL/HSL : saturation, vibrance, rouges et bleus, clarté, contraste).
- Star-Watcher, « My Processing Workflow » (https://www.star-watcher.ch/image-processing/my-processing-workflow/) : export PixInsight en TIFF 16 bits sans canal alpha, puis Lightroom (aberration chromatique, réduction du bruit couleur et luminance, exposition, hautes lumières, ombres, noirs, clarté, vibrance, saturation, courbe des tons ; surveiller l'histogramme pour ne rien écrêter) ; sans Lightroom, l'auteur ferait ce contraste dans PixInsight avec CurvesTransformation.
- Vaonis, « Affinity becomes free and gains a new astrophotography feature » (7 novembre 2025, https://vaonis.com/blogs/travel-journal/image-processing-tools-affinity-becomes-free-and-gains-a-new-astrophotography-feature-tutorial) : Affinity gratuit (Windows, macOS), FITS natif, compatible StarXTerminator et BlurXTerminator, outil Tone Stretching, édition non destructive par calques ; présenté comme complément de PixInsight.
- Light Vortex Astronomy, « Preparing Images for Publication » (https://www.lightvortexastronomy.com/tutorial-preparing-images-for-publication.html) et Slooh, « Using ICCProfileTransformation To Save Color Space Information » (https://remoteastrophotography.com/using-iccprofiletransformation-to-save-color-space-information/) : avant export, ICCProfileTransformation vers sRGB IEC61966-2.1 (« Convert to the specified profile »), profil ICC intégré au TIFF pour que les couleurs soient les mêmes dans un autre logiciel.
- Icônes `ICC_sRGB` et `Export_TIFF` (4 octobre 2026, demande de l'utilisateur) : paramètres de ICCProfileTransformation (targetProfile = description du profil « sRGB IEC61966-2.1 », toDefaultProfile, renderingIntent Perceptual, useBlackPointCompensation, useFloatingPointTransformation), noms repris du module ICCProfileTransformation de PixInsight ; méthode sRGB + profil intégré : Light Vortex Astronomy et Slooh (ci-dessus) ; TIFF 16 bits suffisant pour une image étirée : Star-Watcher (ci-dessus). Export_TIFF.js : copie 16 bits (ImageWindow 16 bits entiers, Image.apply), ICCProfileTransformation, ImageWindow.saveAs sans dialogue. Pas encore testé dans PixInsight.
- Plugins de finition (recherche du 4 octobre 2026) : Fstoppers, « Here Are Some Photoshop Plug-ins to Make Astrophotography Much Easier » (https://fstoppers.com/astrophotography/here-are-some-photoshop-plug-ins-make-astrophotography-much-easier-631029) : GradientXTerminator, Star Shrink, NoiseXTerminator, StarXTerminator (Russell Croman, rc-astro.com ; aussi pour Affinity Photo). RC Astro, page BlurXTerminator (https://www.rc-astro.com/software/bxt/) : BlurXTerminator réservé à PixInsight (et outils en ligne de commande), pas de version Photoshop ni Affinity car la déconvolution exige des données linéaires ; NoiseXTerminator et StarXTerminator fonctionnent dans Affinity Photo 2 ou plus récent. AstroBackyard, logiciels 2026 (https://astrobackyard.com/image-processing-software/) et DIYPhotography (https://www.diyphotography.net/five-photoshop-plugins-for-efficient-astrophotography-workflow/) : Astronomy Tools Action Set (actions Photoshop en un clic), Annie's Astro Actions, StarNet++ (gratuit). Cloudy Nights, « Astrophotography Macros for Affinity Photo » (https://www.cloudynights.com/forums/topic/862255-astrophotography-macros-for-affinity-photo/) et James Ritson (https://x.com/JamesR_Affinity/status/1801270900630692085) : macros gratuites pour Affinity (séparation étoiles / fond, Super Structure, Laplacian Structure Enhancement, réduction d'étoiles). CaptureLandscapes, Nik Color Efex 9 (https://www.capturelandscapes.com/nik-color-efex-pro/) : Nik Collection fonctionne dans Photoshop, Lightroom et Affinity (support complet d'Affinity début 2026) ; aucune source trouvée sur un usage astro précis.
- Astronomy Tools Action Set (Noel Carboni, ProDigital Software), page officielle (https://www.prodigitalsoftware.com/AstronomyToolsActions.html, consultée le 4 octobre 2026) : 34 actions Photoshop, 21,95 USD, version 1.6.2, Photoshop CS à CS6, CC et 2020 ou plus récent (PC et Mac), 8 et 16 bits ; pas pour Affinity ; version séparée pour Photoshop Elements (https://www.prodigitalsoftware.com/Astronomy_Tools_For_Elements.html). Actions : réduction d'étoiles, réduction de bruit (Space, Deep Space, banding), gradient, pollution lumineuse, fausses couleurs, aigrettes, contraste local, accentuation des objets. Avis d'AstroBackyard (Trevor Jones, https://astrobackyard.com/astronomy-tools-action-set-review/) : actions les plus utiles Make Stars Smaller, Less Crunchy More Fuzzy, Increase Star Color, Enhance DSO and Reduce Stars ; sur un calque dupliqué, opacité à régler ; masquer le sujet avant Increase Star Color ; ne pas répéter (étoiles artificielles) ; Enhance DSO and Reduce Stars : surveiller les changements de couleur et les étoiles trop petites.
- Camera Raw et Lightroom (4 octobre 2026) : forums Adobe (https://community.adobe.com/t5/lightroom-classic-discussions/what-are-the-differences-between-camera-raw-and-lightroom/m-p/11847165, https://community.adobe.com/questions-675/lr-classic-camera-raw-962798) : Lightroom Classic et Adobe Camera Raw partagent le même moteur de développement (mêmes résultats) ; Camera Raw est un module externe de Photoshop, Lightroom Classic en a sa propre copie, mise à jour en même temps. Base de la recommandation « Photoshop + filtre Camera Raw pour la finition, Lightroom pour le catalogue » de la page (choix de la fiche, l'utilisateur ayant les trois logiciels).
- Export_TIFF.js (4 octobre 2026, retour de l'utilisateur : « ReferenceError: UndoFlag_NoSwapFile is not defined ») : la constante UndoFlag_NoSwapFile de View.beginProcess est définie dans pjsr/UndoFlag.jsh, à inclure (#include <pjsr/UndoFlag.jsh>), comme dans les scripts livrés avec PixInsight.
- Marche à suivre Affinity (4 octobre 2026) : Affinity unifié et gratuit depuis le 30 octobre 2025 (Canva, https://www.canva.com/newsroom/news/all-new-affinity/ ; Digital Camera World, https://www.digitalcameraworld.com/photography/photo-editing/breaking-affinity-photo-is-now-free-for-everyone-as-the-editing-software-is-reborn-as-affinity-studio) : réglages non destructifs, masques, macros, traitement par lots. Réglage HSL : aide officielle (https://s3-eu-west-1.amazonaws.com/affinity-docs/help/photo/English.lproj/pages/Adjustments/adjustment_HSL.html) et Lenscraft (https://lenscraft.co.uk/photo-editing-tutorials/affinity-hsl-adjustment-explained-for-photographers/) : points de couleur pour choisir une gamme (bleus), repères de la roue (intérieurs : zone pleinement touchée ; extérieurs : transition), saturation vers la gauche pour désaturer. Vibrance, filtre en direct Clarté, pinceau d'inpainting, export JPEG avec profil : outils d'Affinity Photo 2 repris dans la version unifiée (noms de menus à vérifier dans la version de l'utilisateur, l'interface 3.0 ayant été réorganisée).
- Export_TIFF.js, nom de fichier (4 octobre 2026, demande de l'utilisateur : nom de l'objet = nom du dossier des fichiers L, R, G, B) : chemin du fichier d'une image ouverte = ImageWindow.filePath, liste des fenêtres = ImageWindow.windows, dossier = File.extractDrive + File.extractDirectory (PixInsight utilise « / » comme séparateur sur Mac et PC) ; repli sur le mot-clé FITS OBJECT (FITSKeyword.strippedValue). Logique de dossier vérifiée en Node.js (/Astro/NGC1532/master/masterLight_L.xisf -> NGC1532). Premier essai de l'utilisateur réussi (ICC sRGB intégré, 3144 octets).
- Export_TIFF.js (4 octobre 2026, demande de l'utilisateur) : jamais d'espace dans le nom (« NGC 1532 » -> NGC1532), extension .tiff (reconnue par le module TIFF de PixInsight comme .tif).
- Option HDRMT_30 (4 octobre 2026, demande de l'utilisateur) : même conteneur que HDRMT_40 / HDRMT_50 (copie, HDRMultiscaleTransform 6 couches, mélange a × résultat + (1 − a) × copie), a = 0,3 ; même principe de dosage que HDRMT_50 (voir plus haut).
- LRGB normal, SXT sur L linéaire (4 octobre 2026, demande de l'utilisateur) : StarXTerminator sur données linéaires le plus tôt possible après BXT (RC Astro, déjà cité pour SXT_lineaire) ; L_stars linéaire étirée par Etoiles_LRGB avec y = 3^a·x / ((3^a − 1)·x + 1), a = 6, la courbe et la valeur de Star_Stretch de l'icône (SetiAstro, déjà cité) : étoiles L et RGB étirées pareil avant le mélange de luminance.
- LHaRGB normal, SXT sur L linéaire (4 octobre 2026, demande de l'utilisateur) : même principe qu'en LRGB ; C_L_lineaire = SXT puis NXT sur L, après BXT_L_H et l'option H_dans_L (injection sur L linéaire) ; Etoiles_LRGB après Star_Stretch.
- Option rapide C_RGB_rapide_SXT_etire (4 octobre 2026, demande de l'utilisateur) : StarXTerminator sur image étirée avec Unscreen coché (manuel RC Astro, déjà cité : Unscreen réservé aux images étirées) ; Etoiles_auto avec amount 0 (pas d'étirement, saturation et SCNR seulement, comportement du script).
- Mode rapide rangé dans les options du workflow normal (4 octobre 2026, demande de l'utilisateur) : R_E02_ImageSolver et R_E03_GradientCorrection comparés aux icônes E03_ImageSolver et Opt_GradientCorrection (paramètres identiques, descriptions mises à part) : non doublés ; GHS et Etoiles_LRGB du rapide = ceux du chemin principal.
- Script GC_Solver_auto.js (4 octobre 2026, demande de l'utilisateur) : GradientCorrection en PJSR (generateGradientModel décoché, comme les icônes de la fiche) sur ImageWindow.windows, puis moteur d'ImageSolver inclus comme bibliothèque (#include ../ImageSolver/ImageSolver.js, USE_SOLVER_LIBRARY), même méthode que ImageSolver_Date.js et que WBPP (BatchPreprocessing/BPP-Solver.js) ; ImageSolver seulement sur les images couleur par défaut (seule RGB sert à SPCC). Pas encore testé dans PixInsight.
- GradientCorrection retirée de C_RGB_rapide, C_RGB_rapide_SXT_etire et C_L_rapide (4 octobre 2026, demande de l'utilisateur) : faite avant, sur toutes les images, par GC_Solver_auto.js.
- Lignes P#_rapide (4 octobre 2026, demande de l'utilisateur) : icônes rapides rangées sous un repère P#_rapide dans chaque colonne. C_RGB_couleur_rapide et C_H_rapide sans GradientCorrection comparés au chemin principal : mêmes BXT_CorrectOnly, SPCC (spcc_perso) et BXT_RGB que C_RGB_couleur, même BXT que BXT_L_H : supprimés.
- R_GC_Solver_auto renommé R_GC_Solver_auto_rapide ; R_Solver_auto en P1_rapide (4 octobre 2026, demande de l'utilisateur) : même script GC_Solver_auto.js, paramètre gradient false (ImageSolver seul).
- Colonne P4 LRGB / LHaRGB réordonnée (4 octobre 2026, demande de l'utilisateur) : 3 GHS (L), espace, Statistical_Stretch (RGB), Star_Stretch, Etoiles_LRGB ; option SXT_non_lineaire : StarXTerminator Unscreen coché, réglage RC Astro pour images étirées (manuel déjà cité).
- Solver_auto déplacé dans le chemin principal de P1 (E03) en LRGB et LHaRGB (4 octobre 2026, demande de l'utilisateur) ; numéros suivants décalés de 1.
- P6_rapide (R_HDRMT_30, R_C_Finition, R_NXT_final) et P7_rapide (R_Etoiles_screen, R_C_Fond_final) (4 octobre 2026, demande de l'utilisateur) : copies exactes des icônes HDRMT_30, C_Finition, NXT_final, Etoiles_screen et C_Fond_final (RAPIDE_COPIES dans make_workflows.py).
- Correction (4 octobre 2026, l'utilisateur voulait des conteneurs, pas des copies) : P6_rapide = conteneur C_Fin_rapide (HDRMT 30 %, masque, Courbes, LHE, LHE_fin, masque retiré, NXT_final), P7_rapide = conteneur C_Etoiles_fond_rapide (Etoiles_screen, Fond_auto, Fond_desature) ; mêmes réglages que les icônes du chemin principal.
- Nettoyage_sans_etoiles.js version 3 (4 octobre 2026, retour de l'utilisateur : halo de la grande étoile « plus large » après nettoyage). Profil radial mesuré sur ses JPEG (luminance moyenne par anneaux de 20 px autour de l'étoile bleue) : avant 0,212 / 0,201 / 0,197 / 0,176 / 0,158 / 0,147 / 0,141 (fond 0,133), après 0,187 / 0,185 / 0,182 / 0,174 / 0,158 / 0,147 / 0,141 : seul le centre (moins de 60 px) baissait, le halo s'étend jusqu'à 120 px, d'où un disque plat élargi. Cause : masque trop petit et fond local (ouverture de 75 px) plus petit que le halo. Correction simulée en Python (scipy) sur le JPEG sans étoiles : masque des très grandes étoiles (luminance floutée 50 px, seuil 0,05, étoile bleue 0,106, autres 0,036 à 0,045, zone floutée 60 px × 5) et fond local à grande échelle (ouverture sur copie 4 fois réduite, après flou 2 px contre le biais bas de l'érosion sur le bruit) : profil 0,250 / 0,251 / 0,209 / 0,151 / 0,130 / 0,122 / 0,115 -> 0,100 / 0,101 / 0,100 / 0,100 / 0,105 / 0,110 / 0,110 (fond 0,103) ; bras, petites galaxies et compagnon inchangés. Pas encore testé dans PixInsight.
- Nettoyage_sans_etoiles.js, taille du masque (4 octobre 2026, retour de l'utilisateur : une partie du halo n'est pas couverte) : gains d'extension exposés (gain 3, gain2) ; simulation sur le JPEG (profil radial autour de l'étoile bleue, fond 0,103) : etendue2 60 / gain2 5 -> rayon 134 px, 0,100 à 0,111 ; etendue2 80 / gain2 5 -> 149 px, 0,106 à 60 px (centre moins plein) ; etendue2 80 / gain2 8 -> 171 px, 0,100 à 0,107 jusqu'à 140 px (nouveau défaut) ; tresBrillant 0,04 -> d'autres étoiles entrent dans la grande zone (rayon de la zone > 500 px) : déconseillé.
- Nettoyage_sans_etoiles.js (4 octobre 2026, retour de l'utilisateur : « *** Error: Unknown error » sur le PixelMath final, image 9576 × 6388) : le retrait final référençait 5 images pleine taille (dont 3 en couleur, plus l'image et sa copie d'annulation), probablement trop pour la mémoire ; l'excès est maintenant calculé à 2000 px et une seule image (nt_e) est ramenée à la taille réelle avant $T − nt_e ; le résultat de PixelMath.executeOn est vérifié (le script affichait « nettoyé » malgré l'échec). Cause exacte (mémoire) non confirmée.
- Nettoyage_sans_etoiles.js version 4 (4 octobre 2026, retours de l'utilisateur : rond noir autour des petites galaxies dans le halo ; question « et si je le fais 10 fois de suite ? »). Simulation Python sur le JPEG. Passages répétés (version 3) : centre du halo 0,100 -> 0,087 -> 0,076 -> 0,066 -> 0,058 (fond 0,103) : chaque passage creuse, car max(0, lissé − fond local) retire la partie positive du bruit et l'ouverture morphologique est biaisée vers le bas. Petite galaxie dans le halo (version 3) : centre 0,403 -> 0,143 (effacée) et anneau 0,089 (entourage 0,101). Corrections : image lissée à 4 px (au lieu de 1,5), fond local remonté de l'écart médian lissé − fond local, protection des structures claires élargie, protection des objets compacts (plus clairs que le fond local de 0,05, étendue 4 px × 3, sauf sur l'étoile elle-même). Résultat simulé : halo 0,108 à 0,111 (fond 0,103), petite galaxie 0,402 (centre gardé) et entourage 0,107 = 0,108 (plus d'anneau) ; deuxième passage : environ −0,006 (contre −0,013 avant). Pas encore testé dans PixInsight.
- SXT avant ou après l'étirement face aux grands halos (4 octobre 2026, question de l'utilisateur) : RC Astro, page StarXTerminator (https://www.rc-astro.com/software/sxt/) : détection automatique linéaire / non linéaire ; des restes peuvent subsister autour des étoiles entourées de nébuleuses par réflexion ou de halos (brume, aberration chromatique). Cloudy Nights, « StarXterminator - unscreen stars option » (https://www.cloudynights.com/forums/topic/940800-starxterminator-unscreen-stars-option/) : Unscreen nécessaire sur image non linéaire (fond de l'image d'étoiles assombri avant le mélange screen). Aucune source trouvée qui affirme que SXT sur image étirée retire mieux les grands halos : à vérifier par comparaison (option C_RGB_rapide_SXT_etire).
- Boost_final_doux et Export_TIFF dans C_Etoiles_fond_rapide (4 octobre 2026, demande de l'utilisateur) : même conteneur que Boost_final (réglage de l'utilisateur c 0,46094 -> 0,53646, S 0,46354 -> 0,54167), montée des deux courbes divisée par deux (c -> 0,49870, S -> 0,50261) ; Export_TIFF ajouté en dernière étape du conteneur rapide de P7.
- RC Astro, « Unified PixInsight RC Astro Suite » (27 juillet 2026, https://www.rc-astro.com/unified-pixinsight-rc-astro-suite/) : BlurXTerminator, NoiseXTerminator et StarXTerminator dans une seule installation ; retirer les anciens dépôts RC Astro et ajouter https://www.rc-astro.com/PixInsight ; noms des process inchangés ; paramètres supprimés ai_file, correct_first, nonstellar_then_stellar, lum_only (vérifié le 4 octobre 2026 : aucune icône de la fiche ne les utilise).
- GC_Solver_auto.js, paramètre solve (4 octobre 2026, demande de l'utilisateur) : Solver_auto = ImageSolver sur toutes les images (solveTout true), aussi en dernière étape de C_Preparation_rapide ; GC_Solver_auto_rapide = GradientCorrection seule (solve false). C_Preparation_rapide à lancer en Apply Global : glissé sur une image, ImageSolver échoue sur cette image dans un ProcessContainer (« The image is already being processed », constat déjà noté pour l'icône ImageSolver).
- P4_rapide « Fin de GHS » (4 octobre 2026, demande de l'utilisateur) : conteneur C_Fin_GHS_rapide = icônes GHS_2_contraste et GHS_3_fond du chemin principal, mêmes réglages.
- Mode Turbo, Turbo_1.js (4 octobre 2026, demande de l'utilisateur) : exécute les icônes de l'espace de travail par ProcessInstance.fromIcon puis executeGlobal / executeOn (API PJSR). Point non vérifié : l'exécution d'instances Script (contenues dans les conteneurs) depuis un script en cours ; aucune documentation trouvée (recherche du 4 octobre 2026 : forum PixInsight « Few questions on PJSR », https://pixinsight.com/forum/index.php?threads/few-questions-on-pjsr.15882/, sans réponse sur ce point). À tester par l'utilisateur.
- Mode Turbo, Turbo_2 (4 octobre 2026, demande de l'utilisateur) : conteneur sur RGB = LRGB_ajout_L + contenu de C_Fin_rapide + contenu de C_Etoiles_fond_rapide, mêmes réglages.
- Turbo_1.js réécrit (4 octobre 2026, retour de l'utilisateur : boîte PixInsight « Attempt to execute a Script instance recursively (global context). Sorry, but this is not supported in current PixInsight versions. ») : PixInsight ne permet pas qu'un script exécute une instance Script. Turbo_1.js est maintenant généré par make_workflows.py : il inclut les scripts de la fiche (#include, gardes #ifndef CLODOWEG_TURBO autour de leur lancement et de leurs #feature-id), crée les process natifs avec les paramètres des icônes (conversion XML -> PJSR), et remplace le script Statistical Stretch (SetiAstro) par un calcul direct (point noir médiane − 5 × 1,4826 × MAD, mtf vers la médiane 0,25), approximation non identique. Pas encore testé dans PixInsight.
- Turbo_1.js (4 octobre 2026, retour de l'utilisateur : « Image.medianWaveletTransform(): Invalid argument type: Boolean value expected » dans pjsr/LinearPatternSubtraction.jsh:227 sous le moteur v8, exigé par ImageSolver) : adaptateur qui réessaie medianWaveletTransform en convertissant en booléen les arguments numériques (0 -> false, conversion faite par l'ancien moteur) ; si LPS échoue quand même, l'étape est sautée avec un avertissement et les fenêtres LS / SS / pattern sont fermées. Pas encore testé dans PixInsight.
- Turbo_1 refait en conteneur (4 octobre 2026, retour de l'utilisateur : sous #engine v8, « PixelMath.newImageColorSpace(): Invalid argument type: signed integer value expected » sur PixelMath.prototype.RGB, et LinearPatternSubtraction en échec) : le moteur v8 n'accepte pas le code écrit pour l'ancien moteur ; T_Turbo_1 = ProcessContainer (Renommer_auto, LPS_UnClic, Combiner_RGB, Solver_auto, puis script Turbo_1 sans #engine v8). Un conteneur exécute les scripts l'un après l'autre (chacun avec son moteur), ce que l'icône R_C_Preparation_rapide fait déjà.
- Mode Turbo découpé autrement (4 octobre 2026, demande de l'utilisateur : « je veux que turbo 1 s'arrete apres le R_C_L_rapide (pour que je fasse le GHS 1 a la main). Ensuite R_C_Fin_GHS_rapide et Fermeture de L_stars doivent etre fait au debut de turbo 2 ») : Turbo_1.js s'arrête après R_C_L_rapide ; nouveau script généré Turbo_2_debut.js, 1re étape du conteneur T_Turbo_2, qui lance l'icône R_C_Fin_GHS_rapide sur L par ProcessInstance.fromIcon puis ferme L_stars. Retour précédent (« turbo1 ne fait pas la meme chose que si je fais avec les rapides ») : Turbo_1 sautait GHS_1_premier.
- LRGB, étoiles gardées jusqu'à LRGB (4 octobre 2026, demande de l'utilisateur : « EN LRGB, je veux que pour le L et le RGB, on fasse les montées d'histogramme en gardant les étoiles, puis on fait le LRGB et seulement ensuite on enlève les étoiles ») : SXT_LRGB = StarXTerminator Unscreen coché, réservé par RC Astro aux images étirées (manuel StarXTerminator, déjà cité pour SXT_non_lineaire) ; pas de SXT en linéaire dans C_RGB_lineaire, C_L_lineaire, C_RGB_rapide, C_L_rapide (LRGB) ni Turbo_1 ; Star_Stretch et Etoiles_LRGB retirés du LRGB ; conseils HP sous le cœur des étoiles (paramètre Highlight protection de GHS, déjà sourcé) : déduction, non testée sur les images de l'utilisateur.
- Etoiles_plafond (4 octobre 2026, demande de l'utilisateur : « comment faire en sorte que le coeur des étoiles ne soit pas cramé à 1 ? … tu peux faire qqchose avant la reintegration ») : PixelMath de la fiche, compression des hautes lumières sur l'image d'étoiles par un facteur commun aux trois canaux (rapport R:G:B gardé) au-dessus de s = 0,70 ; formule construite ici (pas de source), croissante sur [0, 1] pour s = 0,70 et k = 0,06 (dérivée minimale 0,54 à 1).
- Continuum_auto au chemin principal LHaRGB, Continuum_H supprimé (4 octobre 2026, demande de l'utilisateur : « n'utilise pas E12_Continuum_H (supprime le) mais plutôt Opt_Continuum_auto qui ne doit pas être une option ») : code lu dans ContinuumSubtraction.js (archive SetiAstro déjà citée) — vue créée HaNB (findUniqueImageID, ChannelCombination [Ha, R, R]), BackgroundNeutralization et calibration couleur sur l'aperçu de fond trouvé automatiquement, puis PixelMath $T[0]-Q*($T[1]-med($T[1])) avec Q = 0,9 (Starry) ou 1,0 (Starless), conversion en gris ; le script ouvre toujours son dialogue. H_dans_RGB et H_dans_L lisent donc HaNB.
- LHaRGB, étoiles gardées jusqu'à LRGB (4 octobre 2026, demande de l'utilisateur : « en HaRGB je veux aussi que l'on fasse les montées d'histogramme et le LRGB avec les étoiles et qu'on fasse le SXT sur RGB après ») : même schéma et mêmes sources que le LRGB (SXT Unscreen coché sur image étirée, manuel RC Astro) ; les étoiles gardées reçoivent l'injection de H (contrôle par comparaison avec la copie d'avant injection, déjà décrit).
- Fermeture des images au fur et à mesure (4 octobre 2026, demande de l'utilisateur : « je veux aussi que tu fermes au fur et à mesure de mon avancée dans les process les images dont j'ai plus besoin ») : Fermer_vues.js (script de la fiche) en fin de C_RGB_bruit / R_C_RGB_fin_rapide (H, R, HaNB) et de C_Fond_final / R_C_Etoiles_fond_rapide / T_Turbo_2 (RGB_stars) ; paramètre garder de Combiner_RGB.js (LHaRGB : R gardée) ; paramètre fermer d'Export_TIFF.js (L après l'export). Besoins des vues lus dans les scripts de la fiche (Masque_auto source L et exclure RGB_stars pour Boost_final, objectDir d'Export_TIFF sur les fenêtres ayant un fichier).
- Passe de simplification de la documentation (4 octobre 2026, demande de l'utilisateur : « refais une passe sur la doc et supprime tout ce qui n'est pas essentiel, qui est trop, inutile ou superflu » ; choix : tout garder, mais plus court) : page réduite d’environ 29 000 à 16 000 mots de texte (colonnes « Source » des tableaux retirées : les sources restent dans ce fichier ; blocs « Par filtre » des fiches outils retirés ; historique et détails répétés supprimés) ; README des icônes et idees-acceleration.md réécrits.
- Etoiles_grosses.js (4 octobre 2026, demande de l'utilisateur : « je voudrais pouvoir réduire juste les grosses [étoiles] », Etoiles_reduites réduisant toutes les étoiles) : script de la fiche ; masque par ouverture morphologique (MorphologicalTransformation, disque de 7 px sur une copie à 2000 px, même principe que Nettoyage_sans_etoiles), puis mtf(0,70) sur la luminance avec le même facteur sur R, G, B. Réglages par défaut choisis par simulation sur des étoiles synthétiques (faible et moyenne : masque 0 ; brillante : 0,35 ; très brillante : 1), non testés dans PixInsight.
- Halo-B-Gon et petites étoiles (4 octobre 2026, retour de l'utilisateur : « il réduit et efface aussi toutes les petites étoiles ») : cohérent avec le code lu (v2.1 : masque = luminosité inversée moins les petites structures, qui ne protège que les cœurs ; courbe 0,75 → 0,40 sur les tons moyens, dont sont faites les petites étoiles). Descriptions mises à jour : Etoiles_grosses conseillé à la place.

## Critique LRGB et LHaRGB (4 octobre 2026)

Demande de l'utilisateur : « aller chercher encore de nouvelles sources sur Internet, et refaire une complète critique de mes process icônes en LRGB et HaRGB ». Rapport : `docs/critique-lrgb-lhargb.html`. Sources nouvelles (*(résumé)* : vue seulement par moteur de recherche, Cloudy Nights et AstroBin bloquant la lecture directe) :

- Tutoriel — [Urban Astrophotography, IntegerResample : quand binner](https://urbanastrophotography.com/pixinsight-guide-integerresample-knowing-when-to-bin-your-data/)
- Officiel — [Forum PixInsight, CMOS software binning et SNR](https://pixinsight.com/forum/index.php?threads/cmos-software-binning-integerresample-and-increase-in-snr.15983/) *(résumé)*
- Forum — [Stargazers Lounge, BXT et données suréchantillonnées](https://stargazerslounge.com/topic/404242-blurxterminator-and-oversampled-data/) *(résumé)*
- Tutoriel — [AstroWorldCreations, How bad is oversampling?](https://www.astroworldcreations.com/blog/oversampling) *(résumé)*
- Tutoriel — [Galactic Hunter, ajouter le Hα au RGB des galaxies](https://www.galactic-hunter.com/post/hargb-combination-pixinsight)
- Forum — [Cloudy Nights, combiner Hα et LRGB dans les galaxies](https://www.cloudynights.com/forums/topic/751206-how-to-combine-ha-with-lrgb-in-galaxies/) *(résumé)*
- Forum — [Combining Ha with LRGB](https://www.cloudynights.com/forums/topic/876046-combining-ha-with-lrgb-will-this-work/) *(résumé)*
- Tutoriel — [Starlust Astroguide, MAS – Multiscale Adaptive Stretch](https://astroguide.starlust.de/html/MAS-MultiscaleAdaptiveStretch.html)
- Officiel — [PixInsight Development, The MultiscaleAdaptiveStretch Tool](https://pixinsight.net/dev/index.php?threads/the-multiscaleadaptivestretch-tool.3/) *(résumé)*
- Forum — [AstroBin, MAS in PixInsight](https://app.astrobin.com/forum/topic/211006/multiscale-adaptive-stretch-mas-in-pixinsight) *(résumé)*
- Forum — [Cloudy Nights, MAS vs VeraLux](https://www.cloudynights.com/forums/topic/988998-multiscale-adaptive-stretch-pixinsights-answer-to-veralux-hypermetric-stretch/) *(résumé)*
- Forum — [Cloudy Nights, new MAS](https://www.cloudynights.com/forums/topic/988990-pixinsight-new-multiscaleadaptivestretch-mas/) *(résumé)*
- Forum — [Cloudy Nights, BXT introducing artifacts](https://www.cloudynights.com/forums/topic/956850-blurxterminator-introducing-artifacts/) *(résumé)*
- Forum — [Stargazers Lounge, BXT AI4](https://stargazerslounge.com/topic/417114-blur-xterminator-ai4-disaster/) *(résumé)*
- Forum — [IceInSpace, BlurXterminator](https://www.iceinspace.com.au/forum/archive/index.php/t-203665.html) *(résumé)*
- Officiel — [Cosmic Photons, script SyntheticLuminance](https://www.cosmicphotons.com/pi-scripts/syntheticluminance/) *(résumé)*
- Forum — [AstroBin, Synthetic Super Luminance Made Easy](https://app.astrobin.com/forum/topic/254071/pleiades-astrophoto-pixinsight/synthetic-super-luminance-made-easy) *(résumé)*
- Forum — [Cloudy Nights, super luminance](https://www.cloudynights.com/topic/788128-some-questions-around-super-luminance/) *(résumé)*
- Forum — [Stargazers Lounge, M33 with Super Luminance](https://stargazerslounge.com/topic/278949-m33-with-super-luminance/) *(résumé)*
- Tutoriel — [Ron Brecher, NGC 7640 (C14 + QHY600M bin 2)](https://astrodoc.ca/ngc-7640/)
- Forum — [Cloudy Nights, QHY600M : régler la vitesse USB contre le FPN](https://www.cloudynights.com/forums/topic/804987-qhy600m-tuning-the-usb-speed-to-minimize-fpn/) *(résumé)*
- Forum — [AstroBin, QHY600 banding issues and mode choices](https://www.astrobin.com/forum/c/equipment-forums/qhyccd-qhy600ph-m/qhy600-banding-issues-and-mode-choices/) *(résumé)*
- Tutoriel — [Atscope, QHY600m review](http://www.atscope.com.au/BRO/tutorials/QHY600.html) *(résumé)*
- Tutoriel — [ScopeTrader, PixInsight 1.9.5](https://scopetrader.com/pixinsight-1.9.5-lockhart-update-brings-machine-learning-and-speed/)
- Forum — [AstroBin, MARS DR2 et luminance](https://app.astrobin.com/forum/topic/245953/pixinsight-gradient-correction-issues-with-mars-dr2-and-luminance-frame) *(résumé)*
- Forum — [AstroBin, MARS DR2 release](https://app.astrobin.com/forum/topic/242060/mars-dr2-release-for-pixinsight-msgc) *(résumé)*
- Forum — [Cloudy Nights, GradientCorrection vs GraXpert](https://www.cloudynights.com/forums/topic/915961-gradient-correction-vs-graxpert/) *(résumé)*
- Tutoriel — [Brian G. Weber, New Gradient Correction](https://blog.briangweber.com/gradient-correction/) *(résumé)*
- Tutoriel — [Ron Brecher, NGC 2903](https://astrodoc.ca/ngc-2903/)
- Tutoriel — [Cosgrove's Cosmos, Markarian's Chain LRGB (2025)](https://cosgrovescosmos.com/projects/markarians-chain-4-22-25)
- Tutoriel — [How I Processed M81, M82 & NGC 3077](https://cosgrovescosmos.com/image-processing/m81-82-ngc3077-process)
- Forum — [Cloudy Nights, test de NoiseXTerminator](https://www.cloudynights.com/articles/astro-gear-today/reviews/software/noise-be-gone33-testing-rc-astro-noisexterminator-r4568/) *(résumé)*
- Tutoriel — [Astrocamp, quand utiliser NoiseXTerminator](https://astrocamp.eu/en/sqsa-when-to-use-noise-x-terminator/) *(résumé)*
- Forum — [AstroBin, MLDenoise](https://app.astrobin.com/forum/topic/254863/pleiades-astrophoto-pixinsight/mldenoise) *(résumé)*
- Forum — [Cloudy Nights, nouvel outil de réduction de bruit PixInsight](https://www.cloudynights.com/forums/topic/1003457-pis-new-noise-reduction-tool-preview-available-only-for-arm-macs/) *(résumé)*
- Tutoriel — [Adam Block Studios, M51 (soustraction du continuum)](https://www.adamblockstudios.com/categories/m51) *(résumé)*
- Tutoriel — [Ron Brecher, M51](https://astrodoc.ca/m51/)
- Officiel — [NightPhotons, PhotometricContinuumSubtraction](https://www.nightphotons.com/software/photometric-continuum-subtraction/)
- Officiel — [GitHub charleshagen/pixinsight](https://github.com/charleshagen/pixinsight) *(résumé)*
- Tutoriel — [Ron Brecher, M101 (QHY600M en Hα)](https://astrodoc.ca/m101/)
- Tutoriel — [Cosgrove's Cosmos, M31 en LHaRGB](https://cosgrovescosmos.com/projects/m31-lhargb)
- Forum — [AstroBin, How should I combine Ha with LRGB?](https://app.astrobin.com/forum/topic/30628/how-should-i-combine-ha-with-lrgb) *(résumé)*
- Forum — [Stargazers Lounge, Ha et OIII dans un LRGB d'Andromède](https://stargazerslounge.com/topic/428143-how-to-add-oiii-and-ha-in-lrgb-andromeda-galaxy/) *(résumé)*
- Forum — [AstroBin, Adding L data to RGB in PixInsight](https://ssr.app.astrobin.com/forum/topic/211402/processing/adding-l-data-to-rgb-data-in-pixinsight) *(résumé)*
- Officiel — [GitHub, VeraLux pour PixInsight](https://github.com/lucasssvaz/VeraLuxPorting) *(résumé)*
- Tutoriel — [Sky and Rockets, VeraLux HMS](https://skyandrockets.blogspot.com/2025/12/experimenting-with-new-pixinsight-tool.html) *(résumé)*
- Forum — [Stargazers Lounge, VeraLux Hypermetric Stretch](https://stargazerslounge.com/topic/440732-siril-veralux-hypermetric-stretch/) *(résumé)*
- Officiel — [Forum PixInsight, RGB/LRGB combination : linéaire ou non (Juan Conejero)](https://pixinsight.com/forum/index.php?threads/rgb-lrgb-combination-linear-vs-non-linear.17893/)
- Tutoriel — [The Astro Geeks, PixInsight LRGB pas à pas](https://www.theastrogeek.com/dark_sky_journal/pixinsight-lrgb-combine-tutorial)
- Forum — [Cloudy Nights, garder la couleur des étoiles en LRGB](https://www.cloudynights.com/forums/topic/533065-keeping-star-color-in-pixinsight-lrgb/) *(résumé)*
- Forum — [red star blowouts on LRGB](https://www.cloudynights.com/topic/678404-pi-issues-with-red-star-blowouts-on-lrgb-combination/) *(résumé)*
- Tutoriel — [ScopeTrader, Adding Luminance](https://scopetrader.com/adding-luminance:-the-missing-layer-for-sharper-astrophotography/) *(résumé)*
- Officiel — [Forum PixInsight, Combining Lum with RGB](https://pixinsight.com/forum/index.php?threads/combining-lum-with-rgb.8823/) *(résumé)*
- Tutoriel — [Ron Brecher, NGC 4236](https://astrodoc.ca/ngc-4236/) *(résumé)*
- Tutoriel — [bf-astro, HDRMultiscaleTransform](http://bf-astro.com/tutorial/HDRMultiscaleTrans.htm) *(résumé)*
- Tutoriel — [Sky at Night, galaxies vues par la tranche](https://www.skyatnightmagazine.com/astrophotography/astrophoto-tips/image-processing-edge-on-galaxies) *(résumé)*
- Officiel — [Forum PixInsight, Enhancing Dust Lanes](https://pixinsight.com/forum/index.php?threads/enhancing-dust-lanes.22459/) *(résumé)*
- Tutoriel — [The Coldest Nights, Multiscale star reduction](https://thecoldestnights.com/2020/08/pixinsight-multiscale-star-reduction/)
- Officiel — [MKStarReduction](https://mhkastro.github.io/MKStarReduction/) *(résumé)*
- Forum — [Cloudy Nights, MKStarReduction v1.0](https://www.cloudynights.com/forums/topic/1005960-new-star-reduction-script-mkstarreduction-v10-for-pixinsight/) *(résumé)*
- Tutoriel — [DeepSkyColors, Star size reduction](https://www.deepskycolors.com/apps/star-size-reduction-via-morphological-transformations/) *(résumé)*
- Forum — [Stargazers Lounge, réduire seulement les plus grosses étoiles](https://stargazerslounge.com/topic/324234-reducing-only-the-biggest-brightest-stars-in-pi/) *(résumé)*
- Officiel — [Forum PixInsight, New script ScreenStars](https://pixinsight.com/forum/index.php?threads/new-script-screenstars.21098/) *(résumé)*
- Officiel — [RS Astro, ReintegrateStars](https://www.rsastro.com/reintegratestars/) *(résumé)*
- Tutoriel — [Sky at Night, améliorer les fonds de ciel](https://www.skyatnightmagazine.com/astrophotography/astrophoto-tips/improve-sky-backgrounds) *(résumé)*
- Forum — [Cloudy Nights, noirceur optimale du fond](https://www.cloudynights.com/forums/topic/819146-what-is-the-optimal-background-blackness-is-it-subjective/) *(résumé)*
- Tutoriel — [Utah Desert Remote, combiner RGB et narrowband](https://utahdesertremote.com/simplifying-the-process-of-combining-rgb-and-narrowband-data/) *(résumé)*
- Tutoriel — [Ron Brecher, combiner couleur et narrowband (NBRGBCombination)](https://astrodoc.ca/combining-colour-narrowband-images/)
- Tutoriel — [Sky at Night, renforcer une galaxie sans toucher aux étoiles](https://www.skyatnightmagazine.com/astrophotography/astrophoto-tips/pixinsight-enhance-galaxy-brightness-without-affecting-stars)
- Forum — [Linear image StarXterminator](https://www.cloudynights.com/forums/topic/874541-linear-image-starxterminator/) *(résumé)*
- Officiel — [Forum PixInsight, Star De-emphasizer (méthode Adam Block)](https://pixinsight.com/forum/index.php?threads/star-de-emphasizer-script-adam-blocks-star-reduction-method.16034/) *(résumé)*
- Tutoriel — [Chaotic Nebula, SPCC (G2V ou Average Spiral)](https://chaoticnebula.com/color-balancing-with-pixinsight-spectrophotometric-color-calibration/) *(résumé)*
- Officiel — [Forum PixInsight, SPCC white reference](https://pixinsight.com/forum/index.php?threads/spcc-white-reference-use-stars-in-image-option.22049/) *(résumé)*
- Tutoriel — [Siril, tutoriel GHS (HP et b contre l'éclatement des étoiles)](https://siril.org/tutorials/ghs/) *(résumé)*
- Forum — [Cloudy Nights, Proper blending of Ha with LRGB](https://www.cloudynights.com/forums/topic/822468-proper-blending-of-ha-w-lrgb/) *(résumé)*
- Forum — [AstroBin, Hα non linéaire et LRGB](https://ssr.app.astrobin.com/forum/topic/168568/pleiades-astrophoto-pixinsight/integrating-ha-non-linear-master-with-lrgb-or-rgb-non-linear-master-without-using-pixelmath) *(résumé)*

## Icônes à tester (5 octobre 2026)

Demande de l'utilisateur : « ajoute Binning_x2 et Agrandir_x2, la nouvelle formule H_dans_RGB dans enelever l'ancienne que je teste les deux, Une icone mas, Une icone MKStarReduction, VeraLux HyperMetric Stretch, CombineHaWithRGB, DarkStructureEnhance pour tester, […] Une icone GraExpert au cas ou » ; réglages de MAS donnés par l'utilisateur (code de l'instance).

- Officiel — [PCL, IntegerResampleParameters.cpp](https://gitlab.com/pixinsight/PCL/-/blob/master/src/modules/processes/Geometry/IntegerResampleParameters.cpp) : zoomFactor (négatif = réduction), downsamplingMode Average.
- Officiel — [PCL, ResampleParameters.cpp](https://gitlab.com/pixinsight/PCL/-/blob/master/src/modules/processes/Geometry/ResampleParameters.cpp), [CommonParameters.cpp](https://gitlab.com/pixinsight/PCL/-/blob/master/src/modules/processes/Geometry/CommonParameters.cpp) et ResampleProcess.cpp : xSize, ySize, mode RelativeDimensions, interpolation Lanczos3, clampingThreshold 0,30, smoothness 1,5, version 0x100.
- Officiel — [PJSR, DarkStructureEnhance.js](https://gitlab.com/pixinsight/PJSR/-/blob/master/src/scripts/misc/DarkStructureEnhance.js) : chemin scripts/misc, menu Utilities, défauts Layers 8, Amount 0,70, Iterations 1 ; pas de lecture des paramètres d'icône.
- Officiel — [PixInsight Toolbox de Jürgen Terpe](https://www.ideviceapps.de/PixInsight/Utilities/) (paquet du 24 août 2026, CombineHaToRGB.js lu) : paramètres alphaView, amount 2,0, beta, bg 0,015, sigma, linear, rgbLinked ; glissé sur une vue, le script traite sans dialogue.
- Officiel — [DeepSkyForge, module GraXpert](https://pixinsight.deepskyforge.com/update/graxpert-process/) (paquet et documentation lus) : identifiants backgroundExtraction, correction, smoothing, createBackground, denoising, replaceImage ; GraXpert 2.2.1 ou plus requis.
- Officiel — [VeraLux pour PixInsight](https://raw.githubusercontent.com/lucasssvaz/VeraLuxPorting/main/dist/) (paquet lu) : script verlux.js, menu VeraLux › VeraLux Suite.
- Officiel — [MKStarReduction](https://mhkastro.github.io/MKStarReduction/) (déjà cité) : menu Script › Utilities › MK Star Reduction.

- R_GC_Solver_auto_rapide remplacée par R_Gradient_auto_rapide, script Gradient_auto.js : GradientCorrection seule sur toutes les images ouvertes, sans ImageSolver (5 octobre 2026). Demande de l'utilisateur : « Il ne doit pas faire Solver, juste Gradient sur tous les fichiers ouvert. »

- Mode Turbo supprimé : icônes T_Turbo_1, T_Turbo_2, scripts Turbo_1.js et Turbo_2_debut.js (5 octobre 2026). Demande de l'utilisateur : « enleve les turbo (script et icons) ».

- P3_rapide LRGB et LHaRGB : une seule icône R_Lineaire_rapide (script Lineaire_auto.js, ProcessInstance.fromIcon puis executeOn sur chaque vue) à la place de R_C_RGB_rapide / R_C_RGB_fin_rapide et R_C_L_rapide (5 octobre 2026). Demande de l'utilisateur : « pour le P3 rapide je veux juste une seule icone qui fasse E08_C_RGB_lineaire sur RGB et E09_C_L_lineaire sur L ». Non testé dans PixInsight.

- SCNR vert, Amount 1,0, Average Neutral, dans C_RGB_lineaire juste après SPCC (LRGB, 5 octobre 2026). Demande de l'utilisateur : « je veux rajouter un SNCR vert à 1.0 dans E08_C_RGB_lineaire et dans Lineaire_auto.js ». Paramètres de l'instance repris du modèle SCNR de theAstroShed.

## Étirements comparés (5 octobre 2026)

Question de l'utilisateur : « quel est la difference entre utiliser MAS ou GHS pour le L ? Et Avec StatStrech pour le RGB ? Ou SoftStrech de EZ ? Quel est l'impact avec ou sans etoiles ? »

- Forum — [Forum PixInsight, EZ Processing Suite](https://pixinsight.com/forum/index.php?threads/ez-processing-suite.14937/) *(résumé)* : EZ Soft Stretch = HistogramTransformation, point noir automatique, médiane cible.
- Officiel — [GitHub, archive de l'EZ Processing Suite](https://github.com/Arkatufus/Ez-Processing-Suite) *(résumé)* : suite archivée.
- Forum — [Cloudy Nights, EZ processing suite gone?](https://www.cloudynights.com/forums/topic/888826-ez-processing-suite-gone/) *(résumé)*.
- Forum — [Cloudy Nights, What stretch method are you using](https://www.cloudynights.com/topic/959611-what-stretch-method-are-you-using-pixinsight-only/) *(résumé)* : la fonction de transfert de HistogramTransformation fait grossir les étoiles ; GHS les ménage.
- Officiel — [Documentation GHS](https://www.ghsastro.co.uk/doc/tools/GeneralizedHyperbolicStretch/GeneralizedHyperbolicStretch.html) *(déjà cité)*.
- MAS : sources de la rubrique « Critique LRGB et LHaRGB » (Starlust Astroguide, forum PixInsight Development, AstroBin, Cloudy Nights).

- Process galaxies changé (5 octobre 2026) : SXT linéaire sur L, GHS sur L sans étoiles ; MAS sur RGB avec étoiles puis SXT Unscreen ; LRGB sans étoiles, Saturation 0,5 ; fond final = Fond_desature seul (C_Fond_final supprimé, Fond_auto en option) ; Export_TIFF ferme L et RGB_stars. Demandes de l'utilisateur : « change le process comme ca je préfère », « dans LRGB il faut laisser 0.5 en saturation et dans E20_C_Fond_final ne fait plus que le script Fond_Desaturé ». GHS fond après MAS : SP = HP = 0,12 (règle fond lu − 0,03 appliquée au fond MAS 0,15, non testé).

- SCNR vert retiré de C_RGB_lineaire, ajouté en option P7 (Opt_SCNR_vert, LRGB et LHaRGB) (5 octobre 2026). Demande de l'utilisateur : « retire le SCNR par defaut mais rajoute une option dans P7 etoiles ».

- Icône MAS (MultiscaleAdaptiveStretch, version 256) : se charge correctement dans PixInsight 1.9.5 (retour de l'utilisateur, 5 octobre 2026 : « si c'est bon »).

- P6 : HDRMT_30 par défaut, HDRMT_40 en option ; R_C_LRGB_rapide sans Etoiles_auto_etire (5 octobre 2026). Demande de l'utilisateur : « pour P6 Finition je veux que le HDRMT par defaut soit le 30 (met le 40 en option) dans R_C_LRGB_rapide enleve etoiles auto ».

- SCNR_vert déplacé au chemin principal de P7 (première étape, sur l'image sans étoiles, avant Etoiles_screen) et ajouté en tête de R_C_Etoiles_fond_rapide (5 octobre 2026). Demande de l'utilisateur : « Opt_SCNR_vert doit etre dans P7 Etoiles non dans Options ».

- Fond_auto remis au chemin principal de P7 (après Etoiles_screen, avant Fond_desature) et dans R_C_Etoiles_fond_rapide (5 octobre 2026). Demande de l'utilisateur : « pareil avec Opt_Fond_auto ».

- P7 : Fond_desature avant Fond_auto (chemin principal et R_C_Etoiles_fond_rapide) (5 octobre 2026). Demande de l'utilisateur : « inverse le fond desaturé et le fond auto ».

- Ménage (5 octobre 2026) : Etoiles_LRGB.js supprimé (plus utilisé par aucune icône), gardes CLODOWEG_TURBO retirées des scripts (mode Turbo supprimé), code mort du générateur retiré (anciennes listes rapides) ; fichiers .xpsm identiques avant et après. Demande de l'utilisateur : « vérifie maintenant dans les scripts que tu as crée s'il y en a des inutiles ».

- R_C_Fin_GHS_rapide supprimé (LRGB et LHaRGB) : GHS_2_contraste et GHS_3_fond se font au chemin principal (5 octobre 2026). Demande de l'utilisateur : « supprime R_C_Fin_GHS_rapide ».

- Fenêtre de réglages pour Etoiles_grosses.js (5 octobre 2026), API vérifiée dans le PJSR (NumericControl.jsh : setReal, setRange, setPrecision, slider ; bouton new-instance comme ImageSolver.js). Non testée dans PixInsight. Demande de l'utilisateur : « je veux maintenant que tu me fasse une interface graphique pour chaque script que tu as crée . Commence déja par un que l'on valide ensemble ».

- Etoiles_grosses.js, retour de l'utilisateur (5 octobre 2026) : lancé par la fenêtre, l'image changeait sans affichage ni Ctrl+Z ; correction : résultat recopié entre beginProcess et endProcess.

- Fenêtres de réglages pour tous les scripts (5 octobre 2026), fichier commun clodoweg_ui.jsh ; non testées dans PixInsight. Demande de l'utilisateur : « ca marche, tu peux faire ca a tous les scripts et prendre en compte de toujours faire ce genre d'interface et de toujours la mettre a jour ».

- P7 : SCNR_vert, Fond_desature puis Fond_auto sur l'image sans étoiles, avant Etoiles_screen (chemin principal et R_C_Etoiles_fond_rapide) (5 octobre 2026). Demande de l'utilisateur : « dans P7 etoiles, il faut mettre le fond desaturé puis le fond auto avant l'ajout des étoiles. pareil dans le process rapide ».

- Export_TIFF ne ferme plus aucune vue (paramètre fermer retiré du script, de la fenêtre et des icônes) (5 octobre 2026). Demande de l'utilisateur : « enlève le fait de tout fermer dans export tiff ».

- Retour de l'utilisateur (5 octobre 2026) : GC_Solver_auto en erreur « Identifier 'HorizontalSizer' has already been declared » (moteur v8) ; corrigé : variante v8 du fichier commun clodoweg_ui.jsh (CLODOWEG_V8), d'après ImageSolverDialog.js du PJSR (class extends Dialog, TextAlignment).

- Retour de l'utilisateur (5 octobre 2026) : R_C_RGB_etire_rapide lancé par le rond Apply Global, erreur « MultiscaleAdaptiveStretch: Cannot execute instance in the global context » ; correction : descriptions ajoutées à tous les conteneurs, avec le mode de lancement (glisser sur l'image).

## Accentuation finale (5 octobre 2026)

Question de l'utilisateur : « j'aimerais rajouter pour tous les process, un boost de sharp a la fin. quels sont les outils recommandées? »

- Tutoriel — [Chaotic Nebula, sharpening with Unsharp Mask and MLT](https://chaoticnebula.com/pixinsight-sharpening/) *(résumé)* : masque sur les zones claires, couches 1-2 de MLT.
- Tutoriel — [Light Vortex Astronomy, Enhancing Feature Contrast](https://www.lightvortexastronomy.com/tutorial-enhancing-feature-contrast.html) *(déjà cité)*.
- Officiel — [RC Astro, BlurXTerminator](https://www.rc-astro.com/software/bxt/) et [AI4](https://www.rc-astro.com/blurxterminator-2-0-ai4-release/) *(résumé)* : données linéaires obligatoires.
- MMT à la place d'une seconde passe de BXT : critique LRGB et LHaRGB (sources 22 et 31, Brecher).

- Officiel — [PCL, UnsharpMaskParameters.cpp](https://gitlab.com/pixinsight/PCL/-/blob/master/src/modules/processes/Convolution/UnsharpMaskParameters.cpp) et UnsharpMaskProcess.cpp : sigma (défaut 2,0), amount (0,10 à 1, défaut 0,80), useLuminance, linear, deringing, deringingDark (0,1), deringingBright, outputDeringingMaps, rangeLow, rangeHigh ; version 0x100. Option Opt_Sharp_USM (5 octobre 2026). Demande de l'utilisateur : « fais la moi en principal (sans la mettre dans rapide) en MMT et propose moi en Option UnsharpMask ». MultiscaleMedianTransform : identifiants non trouvés (module hors du code ouvert), icône demandée à l'utilisateur.

- Instance MultiscaleMedianTransform donnée par l'utilisateur (code source d'instance, PixInsight 1.9.5, 5 octobre 2026) : layers [enabled, biasEnabled, bias, noiseReductionEnabled, threshold, amount, adaptive], couches 2 à 4 biais 0,040, transform MultiscaleMedianTransform, toLuminance et toChrominance true, linear false ; utilisée par Sharp_MMT.js (C_Sharp_MMT au chemin principal de P6, tous les workflows, pas dans le rapide). Non testé dans PixInsight.

Non vérifié : réglages de Ron Brecher et Dave Cosgrove lus sur leurs pages (pratique d'imageurs, pas de documentation éditeur) ; plages BXT pour galaxies (Sharpen Stars 0,15–0,20, Nonstellar 0,20–0,35) issues d'un résumé de forum ; paramètres de MAS d'après Starlust Astroguide, l'article PixInsight n'ayant pas pu être lu ; version de l'instance GraXpert (256 supposé ; MAS confirmé par l'utilisateur le 5 octobre 2026) ; chemins des scripts VeraLux et MKStarReduction (icônes-notes) ; formule H_dans_RGB_v2 (part de 0,2 pour Hβ, choix de l'utilisateur à tester).

### Sharp_MMT : pas d'affichage ni de Ctrl+Z depuis la fenêtre (5 octobre 2026)

Demande : « pareil , quand j'applique je pas les modifs sur l'image ni ctrl-z »

Correction : `cwApplyOnCopy` (clodoweg_ui.jsh) reprend le schéma validé sur Etoiles_grosses : le résultat final est calculé par un PixelMath exécuté sur l'image cible (nouvelle image cachée), puis recopié entre beginProcess et endProcess. MMT tourne sur une copie sans masque ; le masque attaché (Masque_L) sert au mélange `m*copie + (1-m)*$T` (`cwMaskBlend`). Vaut pour tous les scripts qui utilisent cwApplyOnCopy.

### Sharp_MMT dans le mode rapide (5 octobre 2026)

Demande : « rajoute le dans le rapide »

Fait : script Sharp_MMT ajouté dans R_C_Fin_rapide (LRGB et LHaRGB), après LHE_fin, sous le masque de luminance déjà attaché, avant Masque_retirer et NXT_final (même ordre que le chemin principal).

### SCNR vert déplacé sur les étoiles, en P4 (5 octobre 2026)

Question : « le R_C_Etoiles_fond_rapide fait bien les bons process sur les bonnes images ? SCNR sur RGB_Stars, et les autres sur RGB ? » (réponse : non, SCNR_vert agissait sur le RGB sans étoiles).
Demande : « du coup enlève E20_SCNR_vert du P7 et du rapide et rajoute le dans P4 et dans le rapide R_C_RGB_etire_rapide sur le RGB stars »

Fait : SCNR_vert retiré de P7 et de R_C_Etoiles_fond_rapide. Nouvelle icône SCNR_etoiles (P4, juste après SXT_RGB_etire ; LRGB E14, LHaRGB E21) : script Etoiles_auto réglé vue RGB_stars, amount 0, satAmount 0, scnr true (SCNR vert 1,0, Average Neutral, Preserve lightness), qui traite toujours la vue RGB_stars, quelle que soit l'image où on glisse l'icône (un SCNR natif dans un conteneur ne traite que l'image cible). Ajoutée aussi dans R_C_RGB_etire_rapide (MAS, SXT, SCNR_etoiles, GHS fond). Numéros suivants décalés de 1 jusqu'à NXT_final.

### C_Finition moins saturée (5 octobre 2026)

Demande : « je trouve que E17_C_Finition monte un peu trop la saturation. Mais le en option et dans le normal une finition qui sature un peu moins (que tu inclus aussi dans le rapide) »

Fait (galaxies, LRGB et LHaRGB) : Courbes de C_Finition et de R_C_Fin_rapide, canal S, milieu 0,5 -> 0,58 au lieu de 0,65 (courbe en S de contraste inchangée). L'ancienne finition (saturation 0,65) devient l'option Opt_Finition_saturee (P6). Narrowband pas encore changé.

### Étoiles brillantes blanches, RepairedHSVSeparation (5 octobre 2026)

Demandes : « comment je pourrais faire pour que les étoiles brillantes soient moins blanche et plus colorée? » (image de NGC 1532 finie) puis « RepairedHSVSeparation expliques comment je l'installe et comment je peux tester »

Sources :
- https://pixinsight.com.ar/index.php?a=seccion&b=maskedstretch-stars-sores-28&i=en (Alejandro Tombolini : sur un clone de l'image linéaire, Clip Shadows, Repair level, V - no repairs ; sorties Unrepaired V, V, Sv, H ; ChannelCombination ; puis étirement protégé)
- http://wimvberlo.blogspot.com/2017/01/star-repair-in-pixinsight.html (Script › Utilities › Repaired HSV Separation, juste avant le premier étirement, ChannelCombination en HSV, essayer V réparé et non réparé)
- https://wolfcreek.space/index.php/2022/07/25/fixing-saturated-stars-in-pixinsight/ (résultats inégaux, couleurs coupées ; Repair level par défaut le meilleur, 0,25 trop peu, 0,75 trop)

### Icônes Coeurs_etoiles et Etoiles_couleur (5 octobre 2026)

Demande : « fais une icone avant MAS qui fait tout tout seul (mais pas dans rapide, c'est juste une option).  fais l'option Etoiles_couleur »

Fait : script Etoiles_couleur.js (principe de RepairedHSVSeparation, sources ci-dessus, refait sans fenêtre ni ChannelCombination : couleur du halo reportée dans les cœurs saturés par convolution normalisée, luminance gardée). Icônes Opt_Coeurs_etoiles (P4, avant MAS, RGB linéaire, pas en rapide) et Opt_Etoiles_couleur (P7, RGB_stars avant Etoiles_screen, cœurs assombris à 0,85 puis saturation 1,0), en LRGB et LHaRGB.

### Icône RepairedHSV (5 octobre 2026)

Demande : « et tu peux faire une icone pour le hsv repaired? »

Source : code du script, https://gitlab.com/pixinsight/PJSR (src/scripts/misc/RepairedHSVSeparation.js, v1.0.3, Bob Andersson) : feature-id Utilities > Repaired HSV Separation ; travaille sur ImageWindow.activeWindow ; toujours avec sa fenêtre, pas de lecture de Parameters (réglages dans Settings) ; défauts BlackClips 0, WhiteClips 0,5 (« Repair level »), StarRadius 16 ; option « Repaired RGB » : ChannelCombination HSV interne, image `<id>_Repaired_RGB`.
Fait : icône Opt_RepairedHSV (Script, $PXI_SRCDIR/scripts/misc/RepairedHSVSeparation.js), P4, avant MAS, à côté de Coeurs_etoiles, LRGB et LHaRGB, pas en rapide.

### SCNR des étoiles en deux icônes : vert puis violet (5 octobre 2026)

Demande : « Quand tu fais E14_SCNR_etoiles , je veux une premier fois pour le vert, puis une seconde en faisant invert, puis vert a 1.0 puis invert, pour supprimer le violet. Fais donc un E14_SCNR_etoiles_vert et E14_SCNR_etoiles_violet et mets les deux l'un a la suite de l'autre dans le rapide »

Fait : Etoiles_auto.js, nouveau paramètre violet (Invert, SCNR vert 1,0 Average Neutral luminosité préservée, Invert ; case dans la fenêtre). SCNR_etoiles renommée SCNR_etoiles_vert (E14) ; nouvelle SCNR_etoiles_violet (E15 en LRGB, E22 en LHaRGB) ; les deux à la suite dans R_C_RGB_etire_rapide (MAS, SXT, vert, violet, GHS fond). Numéros suivants décalés de 1.

### Question : SCNR violet sur les étoiles, est-ce recommandé ? (5 octobre 2026)

Question : « c'est une recommandations de faire ca sur les étoiles? »
Réponse (connaissance générale, sans nouvelle source) : la technique Invert / SCNR vert / Invert est classique pour les étoiles magenta des images narrowband (SHO), c'est aussi ce que fait le script CorrectMagentaStars ; en RGB calibré par SPCC elle n'est pas une étape standard, et à 1,0 elle verdit et désature un peu les étoiles bleues (G remonté jusqu'à (R + B)/2). Utile en LHaRGB si le H ajouté rosit les étoiles. Pas de changement fait.

### SCNR_etoiles_violet sorti du rapide ; où est CorrectMagentaStars (5 octobre 2026)

Demande : « SCNR_etoiles_violet -> sors le du rapide et CorrectMagentaStars c'est ou? »
Fait : R_C_RGB_etire_rapide = MAS, SXT, SCNR_etoiles_vert, GHS fond. SCNR_etoiles_violet reste au chemin principal (E15 LRGB, E22 LHaRGB). CorrectMagentaStars : icône-note seulement dans les workflows narrowband (P7 options, SHO), pas en LRGB ni LHaRGB.

### Etoiles_grosses : anneau noir autour des étoiles (5 octobre 2026)

Retour : « etoiles grosses crée des rondes noir autour des étoiles » (capture : grosse étoile à aigrettes sur RGB_stars, anneau sombre autour du halo, icône taille 7, seuil 0,15, etendue 6, force 0,70).
Cause (calcul et simulation de profils) : sous le masque, mtf(force, Y)/Y réduit surtout le halo faible ; au bord du masque, le halo non réduit est plus clair que la partie réduite juste avant : anneau.
Correction : poids de réduction selon Y (rien sous 0,10, complet à 0,80), etendue 12, force 0,80 (max 0,85).

### Suppression d'options des workflows galaxies (5 octobre 2026)

Demande : « supprime : Opt_GraXpert Opt_Coeurs_etoiles Opt_RepairedHSV Opt_VeraLux_HMS Opt_Etoiles_auto_etire Opt_MKStarReduction Opt_Etoiles_grosses Opt_Etoiles_couleur »
Fait : les huit options retirées de LRGB et LHaRGB ; code des icônes GraXpert, VeraLux_HMS, MKStarReduction, Coeurs_etoiles, RepairedHSV, Etoiles_couleur, Etoiles_auto_etire supprimé, script Etoiles_couleur.js supprimé. Etoiles_grosses (et son script) gardée dans les workflows narrowband (RGB-SHO, SHO, HOO).

### Script Saturation_grosses (5 octobre 2026)

Demande : « je veux maintenant un script qui sur RGB_stars fasse une saturation sur les grosses étoiles (qui sont presque blanche) et pas sur les petites. Pour la saturation utiliese: var P = new CurvesTransformation; […] P.c = [[0,0],[0.46094,0.53646],[1,1]] ; P.S = [[0,0],[0.46354,0.54167],[1,1]] ; autres canaux identité, Akima »
Fait : script Saturation_grosses.js (masque des grosses étoiles repris d'Etoiles_grosses : ouverture morphologique sur une copie à 2000 px, seuil 0,15, flou 12 px ; copie saturée par la courbe de l'utilisateur, « passes » fois ; mélange m × saturée + (1 − m) × image), fenêtre avec « Voir le masque ». Icône Opt_Saturation_grosses (P7, sur RGB_stars avant Etoiles_screen), LRGB et LHaRGB.

### Saturation_grosses : « Unknown error » au mélange (5 octobre 2026)

Retour : console PixInsight, « PixelMath: Processing view: RGB_stars … sg_m*sg_sat + (1 - sg_m)*$T … *** Error: Unknown error … Saturation grosses : le mélange a échoué ».
Correction : mélange calculé dans une image cachée (sg_r, PixelMath exécuté sur RGB_stars avec createNewImage), puis recopié dans RGB_stars (beginProcess / assign / endProcess) ; même changement dans Etoiles_grosses (chemin glissé).

### Suppression d'Opt_Etoiles_plafond (5 octobre 2026)

Demande : « supprime Opt_Etoiles_plafond »
Fait : retirée de LRGB et LHaRGB (gardée en narrowband, comme Etoiles_grosses). Descriptions et kb mises à jour.

### Saturation_grosses et SCNR_etoiles_violet en options P4 (5 octobre 2026)

Demande : « Déplace Opt_Saturation_grosses dans Options P4 / Déplace E15_SCNR_etoiles_violet dans P4 Options / Ne mets aucun de ces 2 dans le rapide »
Fait : les deux en options P4, juste après SCNR_etoiles_vert (sur RGB_stars) ; aucune dans R_C_RGB_etire_rapide ni ailleurs en rapide. Numéros du chemin principal décalés de −1 à partir de GHS_3_fond (LRGB E15, LHaRGB E22).

### Turbo_debut (5 octobre 2026)

Demande : « fais un turbo process qui fait une une seule fois : R_C_Preparation_rapide puis R_Gradient_auto_rapide puis R_Lineaire_rapide »
Fait : icône T_Turbo_debut (LRGB et LHaRGB, colonne P1, groupe P1_turbo) : un ProcessContainer avec Renommer_auto, LinearPatternSubtraction, Combinaison_RGB, Solver_auto, Gradient_auto, Lineaire_auto (étapes du workflow) ; double-clic puis Apply Global.

### NXT_dernier après Etoiles_screen (5 octobre 2026)

Demande : « rajoute un NXT apres etoiles screen et met le aussi dans le rapide, pour faire une toute derniere reduction de bruit »
Fait : NXT_dernier (NoiseXTerminator Denoise 0,25, 1 itération, réglage léger choisi parce que NXT_final 0,40 a déjà débruité l'image sans étoiles) au chemin principal juste après Etoiles_screen (LRGB E24, LHaRGB E31) et dans R_C_Etoiles_fond_rapide entre Etoiles_screen et Export_TIFF.

### LRGB terminé ; ménage (5 octobre 2026)

Demande : « j'ai fini pour le LRGB. Ca marche bien. Supprime idees-acceleration.md et critique-lrgb-lhargb.html. Dans claude.md : L étirée à la main par les 3 GHS, jamais par Statistical Stretch (RGB seulement) ; -> MET a jour pour dire que c'est MAS pour RGB ; supprime idees-acceleration.md »
Fait : docs/idees-acceleration.md et docs/critique-lrgb-lhargb.html supprimés (les mentions plus haut dans ce fichier restent comme historique) ; CLAUDE.md : RGB étiré par MAS (Statistical Stretch en option), lien vers idees-acceleration.md retiré, LRGB noté comme validé.

### Relecture complète des fichiers md (5 octobre 2026)

Demande : « fait une relecture complete de tes fichiers md par rapport a tout ce que l'on a dit ici pour etre sur que le principâl a bien été mémorisé »
Fait : passages périmés corrigés (ancien process « L et RGB étirés avec leurs étoiles, SXT après LRGB, Statistical Stretch sur le RGB, Saturation 0,35 ») dans workflows.md, techniques.md, outils.md ; variante MAS notée comme adoptée ; generateur.md (lancement Apply Global, SUPPR_GALAXIES) ; CLAUDE.md réorganisé (lancement des conteneurs, règle image cachée + beginProcess, contenu de R_C_Fin_rapide, mise en page des descriptions, options supprimées, état et suite).

### LRGB gelé, passage au LHaRGB (5 octobre 2026)

Demande : « je suis maintenant sur lme HaRGB. A partir de maintenant, sauf si je te le demande explicitement, ne change pour le process icon LRGB qui fonctionne bien »
Fait : règle ajoutée dans CLAUDE.md et generateur.md (modifications limitées à lhargb ou aux variantes LHA ; contrôle git diff vide sur Conteneurs-LRGB.xpsm et icones-LRGB.md après chaque build).

### LRGB : demander avant (5 octobre 2026)

Demande : « En fait plutot, si je te demande qqchose et que tu veux aussi modifié LRGB, demainde moi d'abord alors la liste des impacts et je dis s'il faut aussi le faire ou pas pour LRGB »
Fait : règle « LRGB gelé » remplacée par « demander avant de toucher » (liste des impacts LRGB, décision de l'utilisateur) dans CLAUDE.md et generateur.md.

### Continuum_rapide (LHaRGB) (5 octobre 2026)

Question puis demande : « Le process R_Lineaire_rapide ne gere pas le continuum c'est ca? » puis « oui » (faire un script de continuum sans fenêtre, en rapide et dans le turbo).
Sources :
- PhotometricContinuumSubtraction, Charles Hagen (NightPhotons) — code du script v1.4.2 lu dans le paquet du dépôt https://raw.githubusercontent.com/charleshagen/pixinsight/main/updates/ (optimizeWeights : régression par l'origine, IRLS Tukey c = 4,685 ; soustraction NB − k·(BB − méd(BB))) — Tutoriel/outil ; page : https://www.nightphotons.com/software/photometric-continuum-subtraction/
- PI_ContinuumSubtraction, A. Reinartz — https://github.com/areinartz/PI_ContinuumSubtraction (README : Q = (Wn·Tn)/(Wc·Tc), réglage empirique) — Outil.
- Automatic Continuum Subtraction (SetiAstro) — https://astrowhat.com/resources/automatic-continuum-subtraction.225/ *(résumé)*.
Fait : script Continuum_rapide.js (k par régression robuste sur pixels brillants, HaNB, injection R + w·HaNB, NXT 0,80, fermeture H, R, HaNB) ; icône R_Continuum_rapide (P3 rapide, LHaRGB) et ajout à la fin de T_Turbo_debut du LHaRGB. LRGB inchangé (git diff vide). Non vérifié : k sur de vraies images (testé en simulation seulement).

### LHaRGB P3 : CombineHaWithRGB au chemin principal, suppression des rapides (5 octobre 2026)

Demande : « je n'aime pas ton continuum rapide. Supprime le . Ce que je veux faire (vérifie qu'en LHaRGB on a les memes reglages de BXT, NXT que LRGB:) E10_C_RGB_couleur, E11_BXT_L_H sur L et sur H, E12_Continuum_auto, Opt_CombineHaWithRGB, E14_C_RGB_bruit, E15_NXT_L, E16_SXT_L_lineaire. Met ceux la dans P3 Lineaire ,et met E13_H_dans_RGB dans Options. Supprime le rapide R_Continuum_rapide et R_Lineaire_rapide. Pour le turbo on verra apres ne le touche pas pour le moment. »
Source : PixInsight Toolbox (Jürgen Terpe), https://www.ideviceapps.de/PixInsight/Utilities/ — paquet 20260824 : CombineHaToRGB.js et doc/scripts/CombineHaWithRGB/CombineHaWithRGB.html lus (« The image should be extracted using the ContinuumSubtraction script » ; Amount 1,5 à 2,5 ; Beta ; Background ; Sigma) — Officiel (auteur).
Vérifié : BXT Correct Only, BXT RGB (Sharpen Stars 0,25, Nonstellar 0,50), BXT L et L_H (0,25 / 0,80), NXT RGB 0,80, NXT L 0,60 : identiques en LRGB et LHaRGB.
Fait : Continuum_rapide.js et R_Continuum_rapide supprimés ; R_Lineaire_rapide retirée du LHaRGB ; CombineHaWithRGB au chemin principal (E13, alphaView = HaNB), H_dans_RGB en option ; T_Turbo_debut LHaRGB : seule l'étape Continuum_rapide retirée (script supprimé), le reste inchangé. LRGB inchangé (git diff vide).

### LHaRGB : deux rapides en P3 (5 octobre 2026)

Demande : « je veux deux rapides pour cette étapes: Le premier qui fera les BXT E10_C_RGB_couleur E11_BXT_L_H sur L et sur H E15_NXT_L E16_SXT_L_lineaire (ensuite je ferais a la main le E12_Continuum_auto que l'on peut pas scripter) Le second qui finalisera Opt_CombineHaWithRGB E14_C_RGB_bruit »
Fait : R_Lineaire_rapide remise en LHaRGB (Lineaire_auto, etapes C_RGB_couleur>RGB ; BXT_L_H>L,H ; NXT_L>L ; SXT_L_lineaire>L) ; nouveau conteneur R_C_Ha_rapide (CombineHaWithRGB, NXT 0,80, Fermer_vues H, R, HaNB), à glisser sur RGB après Continuum_auto. LRGB inchangé.

### LHaRGB : continuum sans fenêtre (PCS) et Ha_screen (5 octobre 2026)

Demandes : « on peut rien faire pour le E12_Continuum_auto pour le lancer en script sans la fenetre? » ; « Oui mais un truc avant: R_C_Ha_rapide marche quand je le glisse sur RGB mais j'ai l'erreur … CombineHaToRGB.js:518: Invalid view update request: The image is already being processed: RGB finalView.beginProcess(); » ; « tu es sur que c'est équivalent? »
Sources : code de PhotometricContinuumSubtraction.js v1.4.2 (main : isViewTarget -> ToolParameters.load() puis continuumSubtract() sans dialogue ; sortie H_sub ; dépôt https://raw.githubusercontent.com/charleshagen/pixinsight/main/updates/, plateforme 1.9.4:1.9.10) ; code de CombineHaToRGB.js (Toolbox 20260824 : main, process, combineHa, getHalpha, dropNoise).
Fait : C_Continuum (Continuum_PCS, HaNB = H_sub, Fermer H_sub) en E12, Continuum_auto en option ; Ha_screen (PixelMath natif, même calcul) en E13, CombineHaWithRGB en option (fenêtre seulement) ; R_C_Ha_rapide = continuum PCS, Ha_screen, NXT, fermeture ; dépôt NightPhotons ajouté à depots-pixinsight.txt. Équivalence : courbe Background 0,015 calculée, écart < 1,5 % de la médiane, non reproduite. LRGB inchangé. Non vérifié : PCS dans un conteneur glissé (attendu : il ne touche pas la vue cible).

### Saturation_grosses : pas de changement (5 octobre 2026)

Question de l'utilisateur sur R_C_Ha_rapide : « dans R_C_Ha_rapide tu utilise H alors qu'il faudrait utiliser HaNB_tmp non ? » (réponse : H est l'entrée du continuum ; HaNB_tmp… sont des images internes de CombineHaToRGB).
Réponse sur Saturation_grosses : « bizarre Saturation_grosses car ca marchait sur LRGB. Touche pas pour l'instant je te dirais plus tard si j'ai un pb dessus » : rien changé.

### Retour à Continuum_auto (5 octobre 2026)

Demande : « non c'est moche je veux utiliser Opt_Continuum_auto comme avant »
Fait : PhotometricContinuumSubtraction retiré (C_Continuum, Continuum_PCS, HaNB_PCS, Fermer_H_sub ; dépôt NightPhotons retiré de depots-pixinsight.txt) ; E12 = Continuum_auto (SetiAstro, à la main) ; R_C_Ha_rapide = Ha_screen, NXT, fermeture (après Continuum_auto). Ha_screen reste en E13. LRGB inchangé.

### LHaRGB P3 : ordre et CombineHaWithRGB (5 octobre 2026)

Demande : « Dans P3 Linear mets avant E15_NXT_L et E16_SXT_L_lineaire avant E12_Continuum_auto et remplace E13_Ha_screen par Opt_CombineHaWithRGB. E13_Ha_screen ne doit servir que dans le rapide »
Fait : P3 = E10 C_RGB_couleur, E11 BXT_L_H, E12 NXT_L, E13 SXT_L_lineaire, E14 Continuum_auto, E15 CombineHaWithRGB, E16 C_RGB_bruit ; Ha_screen retiré du chemin principal et des options, gardé dans R_C_Ha_rapide. LRGB inchangé.

### Ha_screen : erreur combine() (5 octobre 2026)

Retour : « R_C_Ha_rapide sur RGB -> … *** Error: combine() argument #1: Must be an image reference or a functional subexpression evaluating to an image ».
Correction : screen écrit en clair, R' = 1 − (1 − R)·(1 − h), h = min(1, 2·(HaNB − méd(HaNB)) au-dessus de la médiane). LRGB inchangé.

### LHaRGB : CombineHaWithRGB sur H, continuum en option (5 octobre 2026)

Demande : « Mets ca plutot dans Combine Ha With RGB et met le continuum en Option » avec l'instance de l'utilisateur (CombineHaToRGB.js, md5 140cbb0fc118263dc1d71b8e9e39f0e1, alphaView H, amount 2, beta 0, linear true, rgbLinked true, bg 0,015, rgbView « [object Object] », invertMask true, sigma 0).
Fait : icône CombineHaWithRGB réglée ainsi (rgbView omis : valeur non valable, et le script relit rgbView avec l'id d'alphaView, bug du script) et lancée par double-clic (L_GLOBAL) ; Continuum_auto en option ; Ha_screen (R_C_Ha_rapide) calculé sur H. Numéros LHaRGB décalés de −1 à partir de C_RGB_bruit (E15). LRGB inchangé.

### LHaRGB : retour aux deux rapides (5 octobre 2026)

Demandes : « tu peux pas inclure R_C_Ha_rapide directement dans R_C_P3_rapide sans avoir besoin d'une seconde icone? » puis (interrompu) « en fait laisse R_C_Ha_rapide et supprime R_C_Ha_rapide » (compris : garder R_C_Ha_rapide, supprimer R_C_P3_rapide).
Fait : R_C_P3_rapide supprimé (commit annulé) ; retour à R_Lineaire_rapide (Apply Global) puis R_C_Ha_rapide glissé sur RGB (Ha_screen, NXT, fermeture H, R, HaNB). Script Ha_rapide.js commencé puis abandonné (jamais publié). LRGB inchangé.

### Suppression de R_C_Ha_rapide (5 octobre 2026)

Demande : « supprime R_C_Ha_rapide »
Fait : R_C_Ha_rapide et Ha_screen supprimés du LHaRGB ; rapide P3 = R_Lineaire_rapide seul, puis E14 CombineHaWithRGB (fenêtre) et E15 C_RGB_bruit. LRGB inchangé.

### LHaRGB : CombineHaWithRGB glissé, P3 en un rapide (5 octobre 2026)

Demande : « le process E14_CombineHaWithRGB peut maintenant se glisser sur une image. Integre donc cette etape et E15_C_RGB_bruit dans le rapide »
Fait : CombineHaWithRGB lancé en glissant (L_DRAG) ; R_C_P3_rapide (à glisser sur RGB) = BXT Correct Only, SPCC, BXT (RGB), Lineaire_auto (BXT_L_H>L,H ; NXT_L>L ; SXT_L_lineaire>L), CombineHaWithRGB, NXT 0,80, Fermer_vues H, R, HaNB ; R_Lineaire_rapide retirée du LHaRGB. Lineaire_auto ne traite jamais la vue glissée (risque « already being processed »). Non testé dans PixInsight. LRGB inchangé.

### CombineHaWithRGB à 1 dans le rapide (5 octobre 2026)

Demande : « dans E14_CombineHaWithRGB met a 1 l'effet dans le rapide »
Fait : CombineHaWithRGB de R_C_P3_rapide : amount 1 ; E14 au chemin principal garde amount 2. LRGB inchangé.

### Question : H dans RGB en linéaire ou non linéaire ? (5 octobre 2026)

Question : « il vaut mieux faire le H dans RGB en lineair ou non lineair? »
Réponse : en linéaire, après SPCC et avant l'étirement (ce que font les icônes). Appuis déjà lus : documentation de CombineHaWithRGB (« primarily intended to be used with linear images ») ; soustraction du continuum H − k·(R − méd R) valable seulement sur des données linéaires (flux proportionnels ; PhotometricContinuumSubtraction, ContinuumSubtraction). Non linéaire (mélange après étirement) : plus de contrôle à l'œil, mais rapports de flux perdus, étoiles et fond plus difficiles à garder neutres ; pas retenu. Pas de nouvelle source.

### R_C_P3_rapide réduit, turbo LHaRGB (5 octobre 2026)

Demande : « supprime les étapes 5 6 7 de R_C_P3_rapide puis met a jour turbo pour qu'il prenne les étapes rapides de 1,2,3 »
Fait : R_C_P3_rapide = BXT Correct Only, SPCC, BXT, Lineaire_auto (L, H) (CombineHaWithRGB, NXT, fermeture retirés). T_Turbo_debut LHaRGB : contenait déjà préparation + gradient + Lineaire_auto (C_RGB_couleur>RGB ; BXT_L_H>L,H ; NXT_L>L ; SXT_L_lineaire>L), équivalent des rapides P1, P2, P3 en Apply Global (BXT et SPCC ne peuvent pas tourner directement en Apply Global) ; description mise à jour. LRGB inchangé.

### Question : réglages de CombineHaWithRGB (5 octobre 2026)

Question (capture de la fenêtre Combine H Alpha v1.10 : RGB, H, Linear, Link, pas de masque, Amount 1, Beta 0, Background 0,05, Sigma 0) : « je dois mettre quels parametres? »
Réponse d'après la documentation et le code du script (déjà lus) : Amount 1,5 à 2,5 conseillé par l'auteur avec un H issu de ContinuumSubtraction ; avec H brut (continuum non retiré), plus bas (1 à 1,5) car étoiles et cœur passent aussi dans le rouge ; Beta 0,1 à 0,2 pour le rose (Hβ) ; Background à monter jusqu'à disparition du bruit rouge dans l'aperçu ; Sigma 0 (NXT ensuite) ; masque d'étoiles possible sinon images sans étoiles conseillées. Pas de changement d'icône.

### Continuum_auto remis au chemin principal, réglages CombineHaWithRGB (5 octobre 2026)

Demande : « remet Opt_Continuum_auto avant E14_CombineHaWithRGB ; dans E14_CombineHaWithRGB met : Amount 2, beta 0.2, background: 0.05 »
Fait : Continuum_auto au chemin principal (E14) avant CombineHaWithRGB (E15) ; CombineHaWithRGB : Amount 2, Beta 0,2, Background 0,05, et H Alpha = HaNB (sortie de Continuum_auto, comme le demande la doc du script ; Amount 2 conseillé par l'auteur avec un H sans continuum). C_RGB_bruit devient E16 ; numéros suivants +1 (NXT_dernier E31). LRGB inchangé.

### Option EZ Soft Stretch (5 octobre 2026)

Demande : « rajoute une option d'etirement dans LRGB et HaRGH de EZ Soft Strech (et explique moi quels parametres mettre) » (LRGB demandé explicitement).
Sources :
- Code — EZ Processing Suite v0.5 (2026-01-04), dépôt https://elveteek.ch/pixinsight-updates/ez-processing-suite/ (paquet lu : src/scripts/EZProcessingSuite/EZ_SoftStretch.js ; feature-id EZ Processing Suite > EZ Soft Stretch ; réglages Expand Low 0 à 0,2 défaut 0,05, Target Median jusqu'à 0,4 défaut 0,2, Aggressiveness 1 à 100 défaut 10 (bouton Reset : 5), Zero in White Point ; HistogramTransformation [point noir, mtf vers médiane − Expand Low, point blanc, −Expand Low] ; réglages dans Settings, pas de paramètres d'icône ; fenêtre avec aperçu ; plateforme 1.8.8 à 1.9.9).
- Forum — https://www.cloudynights.com/forums/topic/816182-pixinsight-189-update-lost-ez-processing-suite/ *(résumé)* (adresse de dépôt elveteek.ch).
Fait : Opt_EZ_Soft_Stretch (P4) en LRGB et LHaRGB, après Statistical_Stretch ; dépôt ajouté à depots-pixinsight.txt. Réglages conseillés (non vérifiés sur les images de l'utilisateur) : Target Median 0,15 (proche du fond MAS 0,15), Expand Low 0,05, Aggressiveness 5.

### Question : MAS trop brillant sur NGC 253 (5 octobre 2026)

Question (capture : MAS Target background 0,150, Aggressiveness 0,70, Dynamic range compression 0,40, Contrast Recovery 1024 / 1,0, saturation 0,75 / 0,50, sur le RGB de NGC 253) : « sur cette source MAS fait un truc trop brillant »
Sources : Officiel/Tutoriel — https://astroguide.starlust.de/html/MAS-MultiscaleAdaptiveStretch.html *(résumé)* : Aggressiveness règle le point de coupure des ombres (plus haut = fond et tons moyens plus clairs, plus de bruit) ; Dynamic range compression règle le contraste des zones brillantes (plus haut = zones brillantes moins étirées, étoiles plus douces). Forum — https://www.cloudynights.com/forums/topic/988990-pixinsight-new-multiscaleadaptivestretch-mas/ *(résumé)*.
Réponse : pour une galaxie brillante, Dynamic range compression 0,6 à 0,8, Aggressiveness 0,5, Target background 0,12, Contrast Recovery Intensity à baisser (0,5) si le corps reste trop clair (non vérifié). Pas de changement d'icône.

### Etoiles_grosses remise en option (5 octobre 2026)

Demandes : « j'ai plus le script qui diminue juste les grosses etoiles? » puis « rajoute le dans les options etoiles pour LRGB et HaRGB »
Fait : Opt_Etoiles_grosses de nouveau dans les options P7 du LRGB et du LHaRGB (taille 7, seuil 0,15, etendue 12, force 0,80 ; version sans anneau sombre) ; textes qui la citaient remis pour les galaxies.

### Option Star_Stretch (5 octobre 2026)

Demande : « rajoute aussi dans etirement une option Star Stretch réglée par defaut sur 6 et SCNR » (dans la suite des demandes LRGB et LHaRGB).
Fait : Opt_Star_Stretch (P4) en LRGB et LHaRGB : icône Star_Stretch existante (script star_stretch.js de SetiAstro v2.6 : amount 6, satAmount 1,3, removeGreen true) ; texte galaxies : sur RGB_stars LINÉAIRE (SXT sur le RGB linéaire, Unscreen décoché), à la place de SXT_RGB_etire et SCNR_etoiles_vert ; textes narrowband inchangés.

### Script maj_pc.bat (7 octobre 2026)

Demande : « je veux que tu crée un script a la racine de du repertoire cloud qui fasse un git pull et ensuite qui copie tout ce qui est dans "C:\Dev\PixInsight\docs\process-icons\scripts" vers "C:\Program Files\PixInsight\src\scripts\clodoweg" et que tu l'apelle maj_pc.bat »
Fait : maj_pc.bat à la racine du dépôt (fins de ligne CRLF forcées par .gitattributes) : relance en administrateur si besoin, git pull dans C:\Dev\PixInsight, puis xcopy /E /I /Y des scripts vers C:\Program Files\PixInsight\src\scripts\clodoweg ; s'arrête si le pull échoue.

Demande : « je ne veux pas qu'il me demande de valider en administrateur a chaque fois »
Fait : plus de relance admin systématique. Le script teste l'écriture dans clodoweg ; seulement si elle échoue (1re fois), il lance en admin un petit .cmd temporaire qui fait icacls /grant <compte>:(OI)(CI)M /T. Ensuite il tourne sans admin.

### LHaRGB : fermeture de H, R, HaNB en icône à part (7 octobre 2026)

Demande : « dans HaRGB je veux rajouter un process apres E16 qui ferme les vue R,H et HaNB »
Fait : Fermer_continuum (Fermer_vues, views = H, R, HaNB) sorti du conteneur C_RGB_bruit (qui ne garde que NXT_RGB) et placé comme étape principale E17_Fermer_continuum (double-clic puis Apply Global), juste après E16_C_RGB_bruit ; GHS_1_premier devient E18. LRGB non touché.

### LHaRGB : repère R_Main_continuum dans P3 rapide (7 octobre 2026)

Demande : « rajoute un NOP dans P3 RAPIDE qui marque qu'il faut faire a la main la suite de continuun »
Fait : icône NoOperation R_Main_continuum (colonne P3 rapide, juste après R_C_P3_rapide), sans effet : rappelle de faire à la main E14_Continuum_auto, E15_CombineHaWithRGB, E16_C_RGB_bruit et E17_Fermer_continuum, puis GHS_1_premier sur L. LRGB non touché.

### Option Fermer_tout après Export_TIFF, tous les workflows (7 octobre 2026)

Demande : « Rajoute tous les tous les process dans les options apres save en tiff, un process fermer toutes les vues »
Fait : Fermer_vues.js accepte `views = *` (toutes les vues ouvertes ; la vue cible reste ouverte si l'icône est glissée ; fenêtre : toutes cochées). Icône Opt_Fermer_tout (P7 options, juste après Opt_Export_TIFF) dans LRGB, LHaRGB, RGB-SHO, SHO-sans-RGB et HOO (changement LRGB demandé par l'utilisateur). Source : `ImageWindow.windows` et `forceClose()` (PJSR, déjà utilisés). Non testé dans PixInsight.

### Option crop commun (Crop_reference, Crop_appliquer), tous les workflows (7 octobre 2026)

Demande : « ajoute pour tout le monde dans les P1 options, un processus qui fait image integration en mode minimun pour créer une image dans laquelle je devrais voir le max des bandes noires. il faut qu'ensuite ca m'ouvre dynamique crop que je puisse le faire dessus pour choisir l'image sans les bandes noirs, puis appliquer ce crop a toutes les images ouvertes »
Fait : script Crop_commun.js, deux icônes P1 options (après Renommer_auto) dans les 5 workflows (LRGB compris, demande de l'utilisateur). Minimum calculé directement sur les vues (identique à ImageIntegration Minimum sans normalisation ni rejet ; ImageIntegration travaille sur des fichiers).
Sources (code des scripts livrés avec PixInsight 1.9.5, installés sur le PC) :
- `view.processing` (historique, `.at(i)`, `.length`) et `view.historyIndex` : EZProcessingSuite/Elveteek_Common.js, Toolbox/ProjectArchiver.js — Officiel/Tutoriel (code).
- `ProcessInstance.launch()` (ouvre l'interface du process) : EZProcessingSuite/EZ_Decon.js — code.
- `image.computeAutoStretch(median, mad, -2.8, 0.25, false)` : BatchPreprocessing/BPP-Helper.js (WBPP) — Officiel (code).
- DynamicCrop : centerX/centerY/width/height relatifs : PixInsightBenchmark/benchmark.js, WhatsInMyImage.js — Officiel (code).
Non vérifié : DynamicCrop lancé depuis un script et lecture de l'historique non testés dans PixInsight ; DynamicCrop après Solver_auto (solution astrométrique) non vérifié : faire le crop avant.

### Crop_commun : erreur « UndoFlag is not defined » (7 octobre 2026)

Demande : console de l'utilisateur, Crop_reference (mode reference, nom Crop_ref) : « UndoFlag is not defined »
Fait : Crop_commun.js utilisait `UndoFlag.NoSwapFile` ; remplacé par la constante PJSR `UndoFlag_NoSwapFile` avec `#include <pjsr/UndoFlag.jsh>` (comme Export_TIFF.js).

### .bat : plus de pause finale (7 octobre 2026)

Demande : « Enleve le "Appuyez sur une touche pour continuer" a la fin de l'execution dans la console »
Fait : pause finale retirée de maj_pc.bat et copie_tiff_pc.bat (les pauses en cas d'erreur restent, pour lire le message).

### Crop_commun : « img.computeAutoStretch is not a function » (7 octobre 2026)

Demande : console de l'utilisateur, Crop_reference : « img.computeAutoStretch is not a function »
Fait : STF automatique de l'image Crop_ref calculé à la main (formule AutoSTF standard : ombres = médiane - 2,8 × 1,4826 MAD, tons moyens tels que le fond arrive à 0,25), view.stf mis directement ; vérifié en Python (fond ramené à 0,25).

### Fond_desature : « Unknown error » glissé dans un conteneur (7 octobre 2026)

Demande : console de l'utilisateur (conteneur glissé sur RGB : le 2e PixelMath en place de Fond_desature échoue, « Unknown error ») ; puis « fais le pour tous les worklow. »
Fait : Fond_desature.js glissé : traitement sur une copie cachée puis recopie (cwApplyOnCopy, comme la fenêtre, Etoiles_grosses et Saturation_grosses). Script commun, donc tous les workflows (LRGB accepté par l'utilisateur).

### GHS_3_fond juste après GHS_2_contraste (7 octobre 2026)

Demande : « dans les workflow met E23_GHS_3_fond juste apres E19_GHS_2_contraste »
Fait : dans lum_block (LRGB et LHaRGB, LRGB demandé par « les workflow ») : GHS_1, GHS_2, GHS_3_fond, puis MAS, SXT_RGB_etire, SCNR_etoiles_vert. LRGB : E12 GHS_3_fond, E13 MAS, E14 SXT_RGB_etire, E15 SCNR_etoiles_vert ; LHaRGB : E20 GHS_3_fond, E21 MAS, E22 SXT_RGB_etire, E23 SCNR_etoiles_vert. Les workflows SHO, RGB-SHO, HOO avaient déjà GHS_3_fond juste après GHS_2. Rapides inchangés (GHS fond déjà dans R_C_RGB_etire_rapide pour le RGB).

### BXT et NXT en SHO : comparaison avec le LRGB (8 octobre 2026)

Demande : « Avant d'agir je voudrais que tu benchmark bien les BXT et NXT par defaut pour les sho dans toutes les sources, savoir si c'est une bonne chose de ne pas avoir les meme qu'en LRGB. Fais une anaylse profonde de toutes les sources »
Fait : analyse dans kb/narrowband.md (section « BXT et NXT en SHO »). Rien changé dans les icônes.
Sources :
- https://www.rc-astro.com/blurxterminator-2-0-ai4-release/
- https://www.rc-astro.com/blurxterminator-technical-manual/
- https://www.rc-astro.com/noisexterminator-2-ai3-user-manual-pixinsight/
- https://cosgrovescosmos.com/projects/m27-the-dumbbell-nebula-reprocess
- https://cosgrovescosmos.com/tips-n-techniques/blurxtermintor-a-breakthrough-for-decon
- https://brettjoastro.co.uk/fieldnotes/streamlined-narrowband-workflow/
- https://www.theastroshed.com/my-rgb-and-sho-workflows-2024-edition/
- https://www.astrobin.com/forum/c/astrophotography/deep-sky-processing-techniques/blurxterminator-technique-and-usage-thread/?page=1
- https://app.astrobin.com/forum/topic/122336/seeking-noisexterminator-and-graxpert-denoise-preferences-and-recommendations-in-pixinsight
- https://app.astrobin.com/forum/topic/177247/what-is-your-real-world-experience-with-oversampling
- https://www.cloudynights.com/forums/topic/907829-when-to-run-blur-terminator-for-narrow-band/
- https://chaoticnebula.com/how-to-reduce-blurring-in-astrophotos-with-blurxterminator/
Non vérifié : aucune source ne donne de valeurs officielles pour le narrowband ; pas testé sur les données de l'utilisateur.

### SHO : NXT sur la combinaison sans étoiles (8 octobre 2026)

Demande : « 1 ok / 2 -> B » (BXT gardé à 0,60 ; NXT choix B)
Fait : NXT_NB (Denoise 0,75, 1 itération) ajouté en fin de C_SHO_lineaire (RGB-SHO, SHO sans RGB) et C_HOO_lineaire (HOO), après SXT_lineaire : sur l'image sans étoiles, linéaire, avant l'extraction. NXT_H et NXT_O_S passent en options P3. LRGB et LHaRGB non touchés.
