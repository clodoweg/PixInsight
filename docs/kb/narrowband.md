# Narrowband : RGB + SHO, SHO sans RGB, HOO (peu utilisés)

Workflows narrowband, palettes, Foraxx, standards de couleur et d'étoiles narrowband. L'utilisateur a beaucoup de cibles SHO et RGB + SHO : prochain chantier (octobre 2026). Mise à jour du 8 octobre 2026 (demande de l'utilisateur) : mêmes ajouts que les galaxies, sauf MAS et SCNR des étoiles (propres au RGB) et les rapides et turbo (plus tard). NXT_NB 0,75 sur la combinaison sans étoiles (NXT par canal en option), BXT 0,60 ; finition des galaxies (HDRMT_30, C_Finition 0,58 avec Finition_saturee 0,65 en option, C_Sharp_MMT, NXT_final ; options Nettoyage_sans_etoiles, HDRMT_40, DarkStructureEnhance, NXT_final_doux, NXT_final_fort) ; P7 : Fond_desature et Fond_auto sur l'image sans étoiles, recombinaison (Etoiles_reduites par défaut, Etoiles_screen en alternative), NXT_dernier 0,25 ; options STF, EZ_Soft_Stretch (chaque canal), Binning_x2 (après ImageSolver), Fond_auto_clair, Agrandir_x2 ; Etoiles_plafond retiré ; pas de Boost_final (masque tiré de L). Etoiles_grosses reste en option.

Issu de l'ancienne fiche HTML `docs/pixinsight-workflow.html` (octobre 2026) ; sources dans `docs/sources.md`.

## RGB + SHO
La nébuleuse en palette SHO, les étoiles en couleurs naturelles issues du RGB.

1. #### Masters narrowband

Pour H, O et S séparément : recadrage identique et retrait du gradient.

2. #### Égaliser les canaux (option)

LinearFit sur O et S, avec H comme référence : les fonds et niveaux se rapprochent, ce qui aide Foraxx et NarrowbandNormalization.

3. #### Combinaison simple, puis BXT

ChannelCombination avec R = S, G = H, B = O, **sans boost ni mélange** (un filtre par canal, poids proches). Applique BXT sur cette image (manuel RC Astro : mélanger ou booster avant la déconvolution fausse la PSF).

4. #### Retrait des étoiles

SXT sur l'image SHO combinée, _Unscreen_ décoché (données linéaires). Ne garde que le **fond sans étoiles**. Pour Foraxx ou NBColourMapper, sépare ensuite les trois canaux avec ChannelExtraction (S = R, H = G, O = B).

5. #### Bruit et étirement des canaux

NXT_NB (0,75) une fois sur l'image SHO sans étoiles, linéaire, avant l'extraction (choix B de l'utilisateur, 8 octobre 2026) ; NXT par canal (NXT_H 0,60, NXT_O_S 0,75) en option. Puis étire **chaque canal séparément** jusqu'au **même fond et à une médiane proche** (on n'égalise pas la nébuleuse : l'écart de signal, c'est la couleur) :

     * **GHS** : H d'abord (pic à 0,25), puis O et S avec un Stretch factor plus élevé jusqu'au même fond ; LP pour ne pas faire ressortir le bruit.
     * **Statistical Stretch** : même Target median (0,25) pour les trois ; sur une image combinée, _Linked Stretch_ décoché.
     * **Contrôle** : combinaison simple, fond gris neutre ; sinon, le canal de la teinte est trop étiré.
6. #### Palette

     * **NarrowbandNormalization** : la référence, sur l'image SHO étirée et sans étoiles.
     * **Foraxx** (PixelMath) : or et bleu (formules) ; **NBColourMapper** : palettes créatives ; **Perfect Palette Picker** : comparer 16 palettes.
     * Contrôle : couleurs SHO.
7. #### Finition du fond SHO

Courbes de teinte et saturation, SCNR sur le vert si besoin, contraste local, NXT final léger.

8. #### Étoiles RGB

RGB combiné : gradient, BXT _Correct Only_ , SPCC, BXT complet, puis SXT en linéaire (_Unscreen_ décoché). Garde uniquement les étoiles et étire-les à part (Star Stretch ou GHS).

9. #### Réintégration des étoiles

Recombine en mode _screen_. S'il reste des étoiles magenta ou des halos, passe CorrectMagentaStars ou Halo-B-Gon. Contrôle ensuite l'accord entre nébuleuse et étoiles (couleurs RGB + SHO).

`~((~starless_SHO) * (~stars_RGB))`

### Couleurs RGB + SHO : deux standards superposés
Nébuleuse au standard SHO, étoiles au standard LRGB (jamais vertes ni magenta). Il reste à vérifier que les deux s'accordent.

Chaque calque se vérifie séparément, puis l'image finale à 100 %.
### Vérifier que tu es dedans
1. **Nébuleuse** , avant de remettre les étoiles : contrôles SHO à la sonde 15×15 (zones H R ≥ G ≫ B, zones O B ≥ G ≫ R, fond R ≈ G ≈ B).
2. **Étoiles RGB** , seules, sonde sur le halo : gamme bleue et jaune-orange, ni verte ni magenta (étoiles LRGB).
3. **Après recombinaison** , à 100 % : pas de restes d'étoiles SHO (anneaux magenta, trous sombres), pas d'étoiles « collées » ni décalées.
4. **Fond** : toujours R ≈ G ≈ B après ajout des étoiles.
### Quoi ajuster
Constat| Cause, réglage  
---|---  
Nébuleuse trop verte, sans bleu, fond coloré| Réglages SHO : NarrowbandNormalization (SCNR, O3 et S2 boost, Shadowpoint), voir couleurs SHO  
Étoiles vertes, bleues ou jaunes en bloc| SPCC du RGB à revoir (filtres, capteur, gradient avant SPCC)  
Étoiles blanches, sans couleur| Étirement des étoiles trop fort : Star Stretch plus doux, ou GHS avec HP  
Étoiles criardes| Star Stretch avec un Color Boost plus bas, ou légère désaturation de l'image d'étoiles  
Anneaux ou points magenta sous les étoiles| Étoiles SHO mal retirées : refais SXT sur la combinaison SHO (Unscreen décoché en linéaire), ou CorrectMagentaStars  
Étoiles trop grosses ou trop présentes| Réduction d'étoiles après recombinaison, ou étirement plus faible des étoiles  
Fond éclairci ou teinté après ajout des étoiles| Fond de l'image d'étoiles pas à 0 : revois SXT ou l'étirement des étoiles  
Étoiles décalées de leurs traces| RGB et SHO pas alignés : aligne-les sur la même référence dans WBPP, avec le même recadrage  
  
**Quand choisir autre chose :** pas de poses RGB : SHO sans RGB (étoiles narrowband) ; couleurs naturelles partout, nébuleuse comprise : LHaRGB ou la variante « RGB enrichi par le narrowband » plus bas ; S faible : HOO avec étoiles RGB, même principe.

### Couleurs SHO : le rendu de référence et comment le vérifier
Pas de norme, mais un rendu de référence, le « look Hubble » : **or et bleu**. Une combinaison SHO brute sort verte (H dans le vert domine) : il faut repousser ce vert vers l'or ; un soupçon de vert reste acceptable.

Zone| Couleur attendue| Pourquoi  
---|---|---  
Régions dominées par H (et S)| **Or, jaune orangé**|  Le vert de H repoussé vers le jaune, plus le rouge de S  
Régions riches en O| **Cyan, bleu-vert, bleu**|  O dans le bleu, un peu de H ajoute du vert  
Structures de soufre| Orange plus rouge, visible dans l'or| S apporte le rouge  
Fond de ciel| **Gris neutre foncé** (0,12–0,14, R = G = B)| Repères d'étirement  
Étoiles| **Pas magenta** , couleurs naturelles si possible| Avec RGB : couleurs RGB + SHO ; sans RGB : étoiles sans RGB  
Vert| Quelques touches, **pas de vert dominant**|  H domine : un SHO brut sort vert  
### Vérifier avec la sonde de lecture (15×15)
  * **Zone H brillante** : R ≥ G, nettement au-dessus de B. Si G > R : trop vert.
  * **Zone O** : G et B nettement au-dessus de R, B ≥ G. Si R est proche de B : violet ou délavé.
  * **Fond** : R ≈ G ≈ B. S'il tire vers une couleur, un canal a été trop étiré (étirement cohérent des canaux).
### Quoi ajuster dans NarrowbandNormalization
Constat| Réglage  
---|---  
Tout est vert ou vert-jaune| **SCNR** du module en partiel, ou SCNR après coup (Amount 0,50 à 0,80)  
Pas de bleu, O invisible| Monte **O3 boost**  
Pas de nuances orange ou rouges, soufre absent| Monte **S2 boost** , avec prudence (S est le plus bruité)  
Fond coloré ou trop clair| **Shadowpoint** ; si ça ne suffit pas, le problème vient de l'étirement des canaux, pas de NBN  
Cœur brûlé ou blanc| **Highlight reduction**  
Détail pâteux| **Lightness = Ha** (H porte le détail)  
Presque bon, teinte à affiner| Après NBN : **CurvesTransformation** , canal teinte (H) pour déplacer or et cyan, canal S pour la saturation, sous masque de luminance  
### Quand utiliser une autre palette ou un autre outil
  * **S très faible** (nébuleuses planétaires, beaucoup de rémanents, cibles riches en O) : HOO, sans le signal le plus faible.
  * **Galaxie avec régions HII** : workflow LHaRGB, pas une palette SHO.
  * **Or et bleu sans lutter contre le vert** : formule Foraxx, qui choisit le rouge (S ou H) selon la force de l'O.
  * **Palette créative, teintes choisies, plus de 3 filtres** : NBColourMapper.
  * **Tu hésites** : Perfect Palette Picker affiche 16 palettes en vignettes (dont SHO, HSO, HOS, HOO, Foraxx) avant de choisir.

### Formules Foraxx (palette dynamique)
La couleur de chaque pixel dépend de la force relative des signaux : là où l'O domine, le rouge vient du S, ailleurs du H. On obtient des tons or et bleu sans vert envahissant.

  * Renomme les vues **H** (Hα), **O** (OIII) et **S** (SII). Les formules utilisent ces identifiants.
  * Travaille sur des images **étirées et sans étoiles** , avec des niveaux de fond proches entre les trois canaux.
  * Dans PixelMath : décoche _Use a single RGB/K expression_ , puis dans _Destination_ choisis _Create new image_ avec l'espace de couleur _RGB Color_.

Dans PixelMath, `~x` vaut 1 − x et `^` est la puissance.
### SHO Foraxx
R/K`(O^~O)*S + ~(O^~O)*H`

G`((O*H)^~(O*H))*H + ~((O*H)^~(O*H))*O`

B`O`
### HOO Foraxx (bicolore)
R/K`H`

G`((O*H)^~(O*H))*H + ~((O*H)^~(O*H))*O`

B`O`

Point de départ : enchaîne avec les courbes et un SCNR partiel si besoin. Formules de Ludo (ForaxX).

### Variante : RGB enrichi par le narrowband
Pour garder des couleurs naturelles tout en renforçant les émissions, injecte le narrowband dans le RGB en linéaire, après soustraction du continuum (voir LHaRGB). Pondère modérément :

R'`R + w * HaNB`

G'`G + 0.3 * O_cs`

B'`B + 0.5 * O_cs`

## SHO sans RGB
Palette Hubble avec uniquement des poses narrowband : le fond et les étoiles viennent tous deux de S, H et O.

1. #### Masters narrowband

Pour S, H et O séparément : recadrage identique et retrait du gradient. Surveille O, le plus sensible à la Lune.

2. #### Égaliser les canaux (option)

LinearFit sur O et S, avec H comme référence, pour rapprocher les fonds.

3. #### Combinaison simple, puis BXT

ChannelCombination avec R = S, G = H, B = O, sans boost ni mélange, puis BXT sur cette image couleur (manuel RC Astro).

4. #### Séparer fond et étoiles

SXT sur l'image SHO combinée, _Generate star image_ coché, _Unscreen_ décoché. **Garde les deux images** : ici, les étoiles viennent du narrowband. Sépare ensuite chacune en trois canaux avec ChannelExtraction (S = R, H = G, O = B) : tu obtiens S, H et O sans étoiles, et les étoiles de chaque filtre.

5. #### Bruit et étirement du fond

NXT_NB (0,75) sur l'image SHO sans étoiles avant extraction ; en option, NXT par canal, plus fort sur O et S (0,60 à 0,85) que sur H (0,50 à 0,70). Puis étire chaque canal séparément jusqu'au même fond et à une médiane proche, comme en RGB + SHO.

6. #### Palette et finition

Comme en RGB + SHO : palette, courbes, SCNR si besoin, contraste local, NXT final. Contrôle : couleurs SHO.

7. #### Étoiles sans RGB

Sans RGB, les étoiles SHO sortent souvent magenta (étoiles sans RGB). Trois méthodes :

     * **NB to RGB Star Combination** (SetiAstro) : étoiles H et O linéaires (S en option) ; _Green Channel Blend Ratio_ 0,3, _Apply Star Stretch_ (Stretch Factor 5, Color Boost 1,0).
     * **Étoiles HOO synthétiques** (PixelMath, sur H_stars et O_stars linéaires), puis Star Stretch :

R`H_stars`

G`0.2*H_stars + 0.8*O_stars`

B`O_stars`

     * **Étoiles SHO + CorrectMagentaStars** (Amount 0,8) après recombinaison.
8. #### Réintégration des étoiles

Recombine en mode _screen_ , puis réduis les étoiles si besoin avec les formules de Bill Blanshan ou Halo-B-Gon.

`~((~$T) * (~NBtoRGB_stars))`

Sur l'image SHO sans étoiles finale ; étoiles synthétiques : `Stars_HOO` à la place de `NBtoRGB_stars`. Par défaut en nébuleuse : `Etoiles_reduites`.

### Étoiles sans RGB : le standard et comment le vérifier
Couleur non calibrée : on vise des étoiles **plausibles** (bleu-blanc à jaune-orange, peu saturées, variées), **ni magenta ni vertes** , sans anneau coloré. Pour des étoiles calibrées, quelques poses RGB courtes suffisent (RGB + SHO).
### Vérifier avec la sonde de lecture (15×15)
  * Pas de magenta : R et B ne dépassent pas nettement G. Pas de vert : G ne dépasse pas à la fois R et B.
  * Parcours une dizaine d'étoiles : si toutes donnent la même lecture, les couleurs sont écrasées (trop étirées ou trop désaturées).
  * Après recombinaison, à 100 % : ni anneau magenta ou cyan, ni trou sombre autour des étoiles ; fond inchangé.
### Quoi ajuster
Constat| Réglage  
---|---  
Étoiles magenta| NB to RGB Star Combination ou étoiles HOO synthétiques ; sinon CorrectMagentaStars (Amount 0,8, jusqu'à 1)  
Étoiles bleues verdâtres, ou étoiles rouges trop rouges| **Plus de H dans le vert** : monte a dans G = a·H + (1 − a)·O (0,3 à 0,4)  
Étoiles chaudes qui tirent vers le jaune-vert| **Moins de H dans le vert** : baisse a  
Couleurs criardes| Color Boost plus bas (Star Stretch ou NB to RGB), ou légère désaturation  
Toutes blanches| Étirement trop fort : Stretch Factor plus bas, ou GHS avec HP  
Anneau cœur rouge / halo cyan| Étoiles O plus grosses que H : réduction d'étoiles, ou légère désaturation des halos  
Étoiles trop présentes| Réduction d'étoiles après recombinaison

## HOO
Palette bicolore : H en rouge, O en cyan. Nébuleuses planétaires, rémanents, régions riches en O ; caméra mono ou couleur avec filtre dual-band.

1. #### Caméra couleur dual-band : extraire H et O

Caméra couleur seulement : gradient et BXT sur l'image couleur, puis deux images mono par PixelMath (_Create new image_ , _Grayscale_). Plus de poids sur G donne souvent un O plus propre.

H`$T[0]`

O`($T[1] + $T[2]) / 2`

2. #### Masters H et O

Retrait du gradient sur chaque master ; O est plus sensible à la Lune.

3. #### Égaliser O sur H (option)

LinearFit sur O, référence H : fonds de même luminosité (utile avec Foraxx).

4. #### Combinaison simple, puis BXT

ChannelCombination R = H, G = O, B = O, sans boost, puis BXT (déconvolution avant tout mélange).

5. #### Retrait des étoiles

SXT, _Unscreen_ décoché ; garde les étoiles si tu n'as pas de RGB. ChannelExtraction : H (R) et O (G) sans étoiles.

6. #### Bruit

NXT_NB 0,75 sur l'image HOO sans étoiles avant extraction ; en option par canal : 0,60 à 0,85 sur O, 0,50 à 0,70 sur H ; au-delà, le fond devient plastique.

7. #### Étirement des deux canaux

GHS sur H, puis sur O jusqu'au même fond et une médiane proche (Stretch factor plus élevé, LP contre le bruit).

8. #### Palette HOO

Sur les images étirées et sans étoiles (contrôle : couleurs HOO) :

     * **Combinaison simple + NarrowbandNormalization** (palette HOO, O3 boost).
     * **Foraxx HOO** : transitions orangées (formule) ; **NBColourMapper** : teintes au choix.
     * **Variante « style Hubble »** : G = 0,6·H + 0,4·O, tons plus dorés.

Combinaison simple en PixelMath (canal par canal, _Create new image_ , _RGB Color_) :

R/K`H`

G`O`

G (variante)`0.6*H + 0.4*O`

B`O`

9. #### H en luminance (option)

H porte le détail : LRGBCombination avec H en L (Saturation 0,40), H étiré au même fond que l'image HOO (sinon les couleurs se délavent).

10. #### Finition du fond

Courbes de teinte et saturation, contraste local sous masque, NXT final léger.

11. #### Étoiles

     * **Avec RGB** : comme en RGB + SHO.
     * **Sans RGB** : étoiles de SXT ou NB to RGB Star Combination, puis Star Stretch (étoiles HOO).
12. #### Réintégration des étoiles

Recombine en mode _screen_ , puis réduis les étoiles si besoin avec les formules de Bill Blanshan.

`~((~$T) * (~HOO_stars))`

Selon les étoiles : `HOO_stars`, `RGB_stars`, `NBtoRGB_stars` ou `Stars_HOO`. Par défaut en nébuleuse : `Etoiles_reduites`.

### Couleurs HOO : le rendu de référence et comment le vérifier
Rendu de référence : **rouge et cyan**.

Zone| Couleur attendue (HOO classique : R = H, G = B = O)  
---|---  
Régions dominées par H| **Rouge profond à rouge orangé**  
Régions riches en O| **Cyan, turquoise, bleu-vert**  
H et O forts tous les deux| **Rose saumon à blanchâtre** en HOO classique ; **or, orange** seulement si le vert reçoit du H  
Fond de ciel| **Gris neutre foncé** (0,12–0,14, R = G = B)  
Étoiles| Sans halos rouges ou cyan marqués  
  
Zones mixtes : **rose saumon** en HOO classique (G = B) ; **or** seulement si le vert reçoit du H (Foraxx HOO, variante Hubble).
### Vérifier avec la sonde de lecture (15×15)
### Quoi ajuster dans NarrowbandNormalization (palette HOO)
Constat| Réglage  
---|---  
Tout est rouge, O invisible| Monte **O3 boost** ; si O reste noyé, reprends son étirement (même fond et même médiane que H)  
Cyan trop saturé, froid| Baisse O3 boost, ou mets un peu de H dans le vert (variante Hubble ou Optical Mechanics) pour réchauffer  
Fond rouge ou cyan| **Shadowpoint** , sinon reprends l'étirement des canaux  
O bruité, fond granuleux cyan| NXT plus fort sur O (0,60 à 0,85), LP plus haut dans GHS  
Détail pâteux| **Lightness = Ha** , ou H en luminance (étape 9)  
Vert parasite| Rare en HOO, où le SCNR est souvent inutile ; sinon SCNR léger  
  
**Autre choix :** cible riche en S (SHO) ; O quasi absent (HaRGB ou H seul).

### Étoiles HOO : le standard et comment le vérifier
Même standard qu'en SHO sans RGB. Défaut propre au HOO classique (G = B) : étoiles chaudes **saumon, jamais jaunes** , froides **cyan** , et cœurs rouges à halo cyan ; le magenta y est impossible.

Schéma calculé : avec un vert synthétique (G = 0,2·H + 0,8·O), l'étoile chaude devient jaune-orange et la froide bleutée.
### Méthodes, de la plus naturelle à la plus simple
1. **Étoiles RGB** , si tu en as : couleurs calibrées (bloc étoiles RGB du workflow RGB + SHO).
2. **NB to RGB Star Combination** : G = 0,3·H + 0,7·O ; accepte aussi l'image dual-band.
3. **Étoiles HOO synthétiques** (AIASTRO) : R = H, G = 0,2·H + 0,8·O, B = O.
4. **Étoiles HOO telles quelles** : image d'étoiles de SXT sur l'image HOO, légèrement désaturée.
### Quoi ajuster
Constat| Réglage  
---|---  
Étoiles chaudes rouges ou saumon, jamais jaunes| Vert synthétique (NB to RGB ou formule AIASTRO) au lieu des étoiles HOO telles quelles  
Étoiles bleues verdâtres, ou chaudes encore trop rouges| **Plus de H dans le vert** : monte a dans G = a·H + (1 − a)·O (même mécanisme qu'en SHO sans RGB)  
Étoiles chaudes qui tirent vers le jaune-vert| **Moins de H dans le vert** : baisse a  
Cyan saturé| Légère désaturation, ou Color Boost plus bas (Star Stretch, NB to RGB)  
Anneau cœur rouge / halo cyan| Réduction d'étoiles, ou désaturation des halos  
Toutes blanches| Étirement trop fort : Stretch Factor plus bas, ou GHS avec HP  
Étoiles trop présentes| Réduction d'étoiles après recombinaison

## BXT et NXT en SHO : réglages comparés au LRGB (analyse du 8 octobre 2026)

Question de l'utilisateur : faut-il les mêmes BXT et NXT qu'en LRGB ? Décision de l'utilisateur : BXT gardé à 0,60 ; NXT choix B (NXT_NB 0,75 sur la combinaison sans étoiles, dans C_SHO_lineaire / C_HOO_lineaire après SXT ; NXT_H et NXT_O_S en options P3).

### Réglages actuels
- LRGB : BXT sur RGB (Correct Only, puis SPCC, puis complet : étoiles 0,25, halos 0, non stellaire 0,50) et sur L (non stellaire 0,80), PSF automatique ; NXT sur le RGB combiné 0,80 et sur L 0,60 (linéaire). LHaRGB : pareil, H comme L.
- SHO, RGB + SHO, HOO : BXT une fois sur la combinaison SHO (ou HOO) à poids égaux, linéaire, étoiles présentes : étoiles 0,25, halos 0, non stellaire 0,60, PSF automatique, puis SXT ; NXT par canal APRÈS extraction, sans étoiles, linéaire : H 0,60, O et S 0,75. Étoiles RGB du RGB + SHO : exactement les BXT du LRGB.

### Ce que disent les sources
- RC Astro, BXT AI4 et manuel : en narrowband, combinaison SHO simple, poids proches, PUIS BXT, mélange et équilibrage forts APRÈS ; mélanger ou booster avant fausse la PSF. Correct Only séparé : utile AVANT SPCC (pas de SPCC en SHO) ou par canal si les aberrations diffèrent entre filtres. Aucune valeur chiffrée pour le narrowband. SXT après BXT. Longue focale, peu d'étoiles : PSF automatique peut trop accentuer, PSF manuelle = FWHM ; PSF plafonnée à 8 px.
- RC Astro, NXT AI3 : « probablement mieux après la combinaison des canaux » ; le réseau est entraîné aux écarts de bruit entre canaux (S II souvent bien plus bruité) ; séparation intensité/couleur seulement sur une image couleur ; jamais avant BXT ; linéaire ou étiré, même efficacité ; « Detail » sans effet en AI3.
- Pratiques publiées : Cosgrove (M27 SHO, 1085 mm) BXT sur le SHO combiné, non stellaire 0,9, PSF manuelle 3 px, NXT 0,55 sur le SHO linéaire ; BrettjoAstro NXT 0,7 × 2 itérations sur l'image combinée, puis 0,7 sur le sans étoiles étiré ; theAstroShed BXT par canal, NXT sur le SHO combiné ; forum AstroBin : galaxies non stellaire 0,20–0,35, grandes nébuleuses plus haut ; NB : Ha 0,50–0,55, O III et S II 0,60–0,75 ; suréchantillonné, PSF proche de 8 px -> non stellaire plus bas.

### Conclusion
- BXT : différence justifiée. Nébuleuse en SHO : une seule image porte détail et couleur (pas de L) : 0,60, entre RGB 0,50 et L 0,80, et un peu en dessous des pratiques nébuleuses (0,9) parce qu'au CDK17 (0,264″/px, FWHM souvent 6 à 10 px, près du plafond de 8 px) les sources conseillent moins. BXT sur la combinaison à poids égaux : conforme à RC Astro. Étoiles 0,25 et halos 0 : identiques au LRGB.
- NXT : valeurs cohérentes avec le LRGB (H 0,60 = L 0,60 ; O, S 0,75 ≈ RGB 0,80), filtres 3 nm donc O et S faibles. Seule vraie différence : par canal au lieu de l'image combinée, ce que RC Astro conseille. Le par canal garde un réglage séparé pour O et S, mais perd la séparation intensité/couleur.

### BXT et NXT en HOO (analyse du 8 octobre 2026)

Question de l'utilisateur : même analyse pour le HOO. Réglages actuels : Combinaison_HOO (R = H, G = B = O, sans boost), C_HOO_lineaire = BXT_NB (0,25 / 0 / 0,60, PSF auto), SXT, NXT_NB 0,75 sur l'image HOO sans étoiles ; NXT_H, NXT_O_S en options.
- BXT : la règle RC Astro (combinaison simple à poids égaux, puis BXT, mélange après) s'applique telle quelle ; la combinaison HOO n'a pas de boost. BXT sur l'image combinée corrige aussi l'écart de PSF entre H et O (étoiles O plus grosses : cœur rouge, halo cyan) ; par canal, ce n'est pas possible. Caméra couleur + dual-band : BXT sur l'image couleur d'origine AVANT d'extraire H et O (consensus des forums), comme le dit déjà l'icône DualBand_H. 0,60 gardé.
- NXT : RC Astro (après combinaison, le réseau voit tous les canaux) contre une partie des pratiques HOO publiées (Junrui Ye, NGC 2736 : BXT et NXT sur H et O séparément ; forums : O plus fort que H). Particularité HOO : O occupe deux canaux sur trois, la luminance est surtout O, donc 0,75 vise d'abord le bruit d'O, le canal faible (filtres 3 nm). H reçoit aussi 0,75 (au lieu de 0,60 par canal) : H trop lissé -> NXT_NB 0,65 ; O encore granuleux -> NXT_O_S en plus sur O après extraction. Jon Rista (Cloudy Nights) : O paraît plus bruité surtout parce qu'on l'étire plus ; juger le bruit sur l'image ÉTIRÉE, pas en linéaire.
- Conclusion : rien à changer, le HOO suit le choix B du SHO. Si on veut trancher : un essai NXT_NB contre NXT_H + NXT_O_S sur la même cible, comparé après étirement.
