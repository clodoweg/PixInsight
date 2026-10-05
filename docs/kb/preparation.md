# Démarrage, outils à installer, prétraitement, phase linéaire commune

Choix du workflow, dépôts et modules à installer, WBPP et masters, phase linéaire commune (gradient, couleur).

Issu de l'ancienne fiche HTML `docs/pixinsight-workflow.html` (octobre 2026) ; sources dans `docs/sources.md`.

## Par où commencer
Installe d'abord les outils et dépôts, fais le prétraitement WBPP, puis suis le workflow qui correspond à tes filtres.

### Ce qui change entre large bande et narrowband
Les deux familles suivent le même squelette. Les points pleins marquent les trois différences : en narrowband, pas de BXT Correct Only ni de SPCC sur la palette, mais un LinearFit en option, une combinaison simple des canaux avant BXT (manuel RC Astro) et une palette au lieu de L + RGB.

## Outils à installer
Ajoute les dépôts via _Resources › Updates › Manage Repositories_ , puis _Check for Updates_. Les URL de dépôt des scripts gratuits sont listées plus bas.

**Icônes de process** : un fichier par workflow dans [workflows/](https://github.com/clodoweg/PixInsight/tree/main/docs/process-icons/workflows) (`Conteneurs-X` : chemin principal en conteneurs, options et icônes rapides rangées par phase, description courte sur chaque icône), ou le fichier de ta photo fabriqué par le préparateur. Dans PixInsight : clic droit sur l'espace de travail › _Process Icons_ › _Load Process Icons_. SPCC et SPFC sont configurés pour le QHY600 et les filtres Antlia V Pro. La plupart des scripts SetiAstro refusent le mode global : **glisse leur icône sur l'image**.  
**Notation** : **H** = Hα, **O** = OIII, **S** = SII ; les icônes attendent des masters nommés ainsi (sauf les valeurs de filtre MARS `Ha` et `OIII` dans MGC).

**PixInsight 1.9.5** : tous les dépôts de cette page servent une version 1.9.5. Après l'installation, lance _Process › Thread Performance Analysis_. Les solutions astrométriques créées en 1.9.5 ne sont pas lisibles par les versions précédentes. Nouveau process MLDenoise (réduction du bruit par IA, sur image linéaire après SPCC) : avis partagés, la fiche garde NoiseXTerminator. La base MARS DR2 (juin 2026) ajoute H et O (MGC). Modules disparus après un redémarrage : _Process › Modules › Install Modules_.

### RC Astro (licence)
Outil| Rôle| Quand  
---|---|---  
BlurXTerminator| Déconvolution, correction des étoiles (aberrations, tilt)| Linéaire, après le retrait du gradient  
NoiseXTerminator| Réduction du bruit| Linéaire, après BXT ; petite passe finale si besoin  
StarXTerminator| Séparation du fond et des étoiles| Galaxies : après LRGB, sur l'image étirée (_Unscreen_ coché) ; narrowband : en linéaire (_Unscreen_ décoché)  
  
Dépôt unique pour les trois outils : `https://www.rc-astro.com/PixInsight` . Ajoute-le, _Check for Updates_ , _Apply_ , puis **quitte complètement PixInsight** pour que l'installation se fasse. Licence : clé à molette au premier lancement.

### Modules natifs PixInsight
### Scripts et modules gratuits
Dépôts vérifiés sur les sites des auteurs en septembre 2026. Copie l'URL telle quelle, barre oblique finale comprise.

Outil| Auteur| Usage| Dépôt à ajouter  
---|---|---|---  
NarrowbandNormalizationModule (process)| Bill Blanshan & Mike Cranfield| Palettes SHO et HOO, équilibre des canaux| `https://www.cosmicphotons.com/pi-modules/narrowbandnormalization/`  
NBColourMapperScript| Mike Cranfield| Palettes narrowband sur mesure, avec aperçu| `https://www.cosmicphotons.com/pi-scripts/nbcolourmapper/`  
ImageBlendScript| Mike Cranfield| Mélanges : H dans RGB, étoiles, masques| `https://www.cosmicphotons.com/pi-scripts/imageblend/`  
StarReductionScript| Mike Cranfield (méthodes Bill Blanshan)| Réduction d'étoiles| `https://www.cosmicphotons.com/pi-scripts/starreduction/`  
ScreenStarsScript| Mike Cranfield| Réintégration des étoiles en mode screen| `https://www.cosmicphotons.com/pi-scripts/screenstars/`  
GeneralizedHyperbolicStretchModule (process)| Mike Cranfield & David Payne| Étirement GHS (dépôt utile seulement s'il manque dans ta version)| `https://www.ghsastro.co.uk/updates/`  
Statistical Stretch, Star Stretch, Halo-B-Gon, Automatic Continuum Subtraction, NB to RGB Star Combination, Perfect Palette Picker, Find BackgroundScripts| SetiAstro (Franklin Marek)| Étirement, étoiles, halos, continuum H, palettes, aperçu de fond automatique (SPCC). Dépôt de secours : https://raw.githubusercontent.com/setiastro/pixinsight-updates-194/main/| `https://updates.setiastro.com/`  
GraXpertModule (process)| DeepSkyForge (pont vers GraXpert)| Retrait du gradient par IA dans PixInsight. Nécessite le logiciel GraXpert installé. Garder la barre oblique finale.| `https://pixinsight.deepskyforge.com/update/graxpert-process/`  
PixInsight Toolbox (CombineHaWithRGB…)Scripts| Jürgen Terpe| Icône de test CombineHaWithRGB (H dans RGB)| `https://www.ideviceapps.de/PixInsight/Utilities/`  
VeraLux SuiteScript| Lucas Svaz (portage de VeraLux, Riccardo Paterniti)| (icône de test VeraLux_HMS supprimée)| `https://raw.githubusercontent.com/lucasssvaz/VeraLuxPorting/main/dist/`  
MK Star ReductionScript| M. H. Kim| (icône de test MKStarReduction supprimée)| Site de l'auteur : https://mhkastro.github.io/MKStarReduction/ (dépôt non vérifié)  
CorrectMagentaStarsScript| Roberto Sartori & Edoardo Luca Radice| Étoiles magenta en SHO. Déjà livré avec PixInsight : Script › Utilities| Aucun dépôt à ajouter  
Foraxx dynamiqueFormule PixelMath| Communauté| Palette SHO dynamique| Aucun dépôt (formule à copier)

## Prétraitement
Seulement si tu repars des brutes : WBPP 3.1 donne un master par filtre, tous alignés.

avant tout étirement après étirement

1. #### Préparer les fichiers

     * Lights et calibrations avec le même gain, offset, température et format.
     * **Darks** de même durée et température que les lights, jamais calibrés avec les bias. **Flats** par filtre et par session, avec flat-darks (ou bias).
     * **Plusieurs nuits** : un dossier par nuit avec un mot-clé de groupement (`SESSION_2026-09-28`) pour associer chaque nuit à ses flats.
2. #### Charger et vérifier les groupes

_Script › Batch Processing › WeightedBatchPreprocessing_ , _Add Directory_ ; dans _Calibration_ , vérifie que chaque groupe de lights a son master dark et son master flat.

3. #### Réglages de calibration

- **Optimize dark frames** : Décoché (caméra refroidie, darks assortis).

Output pedestal
     _Automatic_.

- **Cosmetic correction** : Activée avec l'icône `CC_auto` (Hot sigma 2,2 à 3,0, Cold désactivé).

4. #### Réglages après calibration

Préréglage
     _Maximum quality_ (normalisation locale, PSF automatique).

Subframe weighting
     _PSF Signal Weight_.

Rejection
     _Auto_ ; _Large-scale pixel rejection_ High contre les satellites.

5. #### Drizzle, recadrage et astrométrie

- **Drizzle ×2** : Seulement si la FWHM est sous 2 pixels avec au moins 15 à 20 poses bien dithérées.

- **Autocrop** : Activé.

- **Astrometric solution** : Activée (nécessaire à SPCC, SPFC et MGC).

6. #### Lancer et contrôler

     * _Run_ ; en cas d'erreur, lis le dossier _logs_.
     * Aucun master au fond collé à zéro ; cartes _rejection_high_ avec seulement satellites, avions et rayons cosmiques.
     * Résultat : un master par filtre, alignés, prêts pour la phase linéaire.

## Phase linéaire commune
Pour chaque master, avant toute combinaison et avant BXT.

1. #### Recadrage

En général inutile (Autocrop de WBPP). Sinon, même recadrage sur tous les masters.

2. #### Suppression du gradient

     * **MGC** avec MARS en priorité. Il demande une image résolue (ImageSolver) et calibrée en flux (SPFC) : pour le RGB, fais-le après ChannelCombination, juste avant SPCC.
     * Sinon **GradientCorrection** , ou **DBE** pour les grandes nébulosités.
     * GraXpert en alternative.
