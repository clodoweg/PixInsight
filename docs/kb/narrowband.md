# Narrowband : RGB + SHO, SHO sans RGB, HOO (peu utilisés)

Workflows narrowband, palettes, Foraxx, standards de couleur et d'étoiles narrowband. L'utilisateur a beaucoup de cibles SHO et RGB + SHO : prochain chantier (octobre 2026). Mise à jour du 8 octobre 2026 (demande de l'utilisateur) : mêmes ajouts que les galaxies, sauf MAS et SCNR des étoiles (propres au RGB) et les rapides et turbo (plus tard). NXT_NB 0,75 sur la combinaison sans étoiles (NXT par canal en option), BXT 0,60 ; finition des galaxies (HDRMT_30, C_Finition 0,58 avec Finition_saturee 0,65 en option, C_Sharp_MMT, NXT_final ; options Nettoyage_sans_etoiles, HDRMT_40, DarkStructureEnhance, NXT_final_doux, NXT_final_fort) ; P7 : Fond_desature et Fond_auto sur l'image sans étoiles, recombinaison (Etoiles_screen par défaut depuis le 8 octobre 2026, Etoiles_reduites en alternative), NXT_dernier 0,25 ; options STF, EZ_Soft_Stretch (chaque canal), Binning_x2 (après ImageSolver), Fond_auto_clair, Agrandir_x2 ; Etoiles_plafond retiré ; Boost_final et Boost_final_doux en option depuis le 8 octobre 2026 (demande de l'utilisateur : « il manque pas les boosts dans les P7 des shos, hoos ? » puis « oui mais mets les option ») : pas de L, donc conteneur glissé sur l'image SANS étoiles avant Fond_desature et Etoiles_screen, masque tiré d'elle-même (Masque_L_boost_nb : s 0,20, gamma 2, flou 2, sans source ni exclusion), mêmes courbes c et S que le LRGB (réglage de l'utilisateur). Non testé en narrowband ; même mécanique de masque dans un conteneur que C_Finition (carrés noirs signalés, cause non trouvée). Etoiles_grosses reste en option.

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

     * **NarrowbandNormalization** : la référence, sur l'image SHO étirée et sans étoiles : icône SHO_simple (R = S, G = H, B = O étirés -> SHO_etire), puis NBN_SHO dessus (comme HOO_simple + NBN_HOO). Palettes en non linéaire : annonce officielle de NBN (forum PixInsight) et nrStellar ; Foraxx sur canaux étirés ; Perfect Palette Picker accepte du linéaire (il étire lui-même).
     * **Foraxx** (PixelMath) : or et bleu (formules) ; **NBColourMapper** : palettes créatives ; **Perfect Palette Picker** : comparer 16 palettes.
     * Contrôle : couleurs SHO.
7. #### Finition du fond SHO

Courbes de teinte et saturation, SCNR sur le vert si besoin, contraste local, NXT final léger.

8. #### Étoiles RGB (comme en LRGB, demande de l'utilisateur, 8 octobre 2026)

Le RGB suit le LRGB jusqu'à RGB_stars, en parallèle du SHO : P1 Combinaison_RGB ; P2 ImageSolver, SPFC_RGB_filtres, MGC_MARS sur RGB ; P3 C_RGB_lineaire (BXT _Correct Only_, SPCC, BXT, NXT 0,80) ; P4 MAS (avec étoiles), SXT_RGB_etire (_Unscreen_ coché : crée RGB_stars), SCNR_etoiles_vert (options SCNR_etoiles_violet, Saturation_grosses), puis Fermer_RGB (le RGB sans étoiles ne sert plus). En P7 : RGB_stars directement à la recombinaison. Ancienne méthode (SXT en linéaire, puis Star Stretch ou GHS sur les étoiles seules), plus courante dans les tutoriels narrowband : retirée du fichier ; elle reste l'option Star_Stretch du LRGB.

8b. #### Continuum (option, version Starless, 8 octobre 2026)

Demande de l'utilisateur : gérer le continuum ; choix : nettoyer H, O, S par le RGB, RGB + SHO seulement ; version Starless retenue (« OK », remplace la version Starry d'avant SXT). À la fin de P3, sur S, H, O extraits SANS étoiles (C_SHO_lineaire, C_Extraction_SHO) et le RGB linéaire (C_RGB_lineaire) ; marche aussi après R_C_Lineaire_rapide :
1. Opt_C_Continuum_prep (Apply Global) : Lineaire_auto lance Opt_Copie_RGB_continuum (RGB -> RGB_cont) puis Opt_SXT_RGB_continuum (SXT linéaire, sans image d'étoiles) ; RGB garde ses étoiles pour MAS (P4).
2. Opt_Continuum_SHO (ContinuumSubtraction.js de SetiAstro, fenêtre) : Ha = H, OIII = O, SII = S, Red (or RGB) = RGB_cont, Green = Select Image (le champ Green refuse un RGB : « wrong color space », test de l'utilisateur), **Starless** (Q = 1,0) ; crée HaNB, SIINB (continuum = rouge), OIIINB (continuum = vert), `NB − Q·(C − med(C))` (code 1.3.5 lu).
3. Opt_C_Continuum_fin (Apply Global) : Fermer_vues (S, H, O, RGB_cont), Lineaire_auto lance Opt_C_NB_renommer (HaNB, OIIINB, SIINB recopiées en H, O, S), Fermer_vues (*NB). Puis GHS comme d'habitude.

Pourquoi Starless en nébuleuse : pratiques (AstroWorldCreations M51 : « starless images gave the best results » ; pixls.us : retirer les étoiles AVANT, sinon trous ; AstroBin, résumé : cibles brillantes sans petites structures -> sans étoiles). Galaxie (LHaRGB) : Starry gardé (Peris, M31 ; SXT linéaire peut emporter des petites régions HII). Limite (raisonnement, non vérifié) : le rouge contient aussi les raies H et S, le vert l'OIII (Antlia : OIII transmis par B et G) ; une petite part de l'émission part aussi, surtout sur S ; si SIINB ou OIIINB s'affaiblit trop, sauter l'étape 3. Test de l'utilisateur (8 octobre 2026, nébuleuse en émission brillante, R saturé à 1 au cœur) : HaNB NOIR au cœur. Cause : en mode Starless il n'y a plus d'étoiles pour mesurer le continuum, et le rouge du RGB contient la même émission Hα (et SII) que H ; là où R est fort ou saturé, Q·(R − med R) dépasse H, le résultat est coupé à 0. Conclusion : option réservée aux cibles où le continuum compte (champs d'étoiles denses, poussière et nébuleuses par réflexion, cœurs de galaxies) ; à éviter sur les nébuleuses en émission brillantes (les étoiles sont de toute façon retirées par SXT).

9. #### Réintégration des étoiles

Recombine en mode _screen_. S'il reste des étoiles magenta ou des halos, passe CorrectMagentaStars ou Halo-B-Gon. Contrôle ensuite l'accord entre nébuleuse et étoiles (couleurs RGB + SHO).

`~((~starless_SHO) * (~stars_RGB))`

### L en plus du RGB + SHO ? (8 octobre 2026)
Pas pour la nébuleuse en émission : le détail est dans les canaux narrowband, L (large bande) le dilue avec le fond de ciel et les étoiles ; H sert déjà de luminance (Lightness Ha dans NBN_SHO). Utile seulement pour des structures large bande (poussière, nébuleuse par réflexion, IFN, galaxies du champ), sous un ciel noir ; les étoiles viennent déjà du RGB. Sources : forum AstroBin, xiulong.it (résumés).

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
Fond coloré ou trop clair| Le problème vient surtout de l'étirement des canaux (même fond pour tous) ; dans NBN, **Shadow point** vers 1 (normalisation à partir de la médiane, le fond est moins touché)  
Cœur brûlé ou blanc| **Highlight reduction**  
Détail pâteux| **Lightness = Ha** (H porte le détail)  
Presque bon, teinte à affiner| Après NBN : **CurvesTransformation** , canal teinte (H) pour déplacer or et cyan, canal S pour la saturation, sous masque de luminance  
### Teinte orange ou rouille (essai de l'utilisateur, casque de Thor, 8 octobre 2026)
SCNR de NBN sans effet sur la teinte orange (il ne retire que le vert au-dessus de (R + B)/2, et G est déjà bas dans l'orange) ; S2 boost à 1,1–1,2 rend plus rouge. L'orange vient de S (R) : pour de l'or, S2 boost sous 1 (0,8–0,9), ou S ramené au même fond (GHS_3_fond).

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

Sur l'image SHO sans étoiles finale ; étoiles synthétiques : `Stars_HOO` à la place de `NBtoRGB_stars`. Par défaut : `Etoiles_screen` (choix de l'utilisateur, 8 octobre 2026) ; `Etoiles_reduites` en alternative.

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

Selon les étoiles : `HOO_stars`, `RGB_stars`, `NBtoRGB_stars` ou `Stars_HOO`. Par défaut : `Etoiles_screen` (choix de l'utilisateur, 8 octobre 2026) ; `Etoiles_reduites` en alternative.

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
Fond rouge ou cyan| Reprends l'étirement des canaux (même fond) ; dans NBN, **Shadow point** vers 1  
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

## Mode rapide narrowband (en cours, 8 octobre 2026)

Demande de l'utilisateur (« Commence faire le premier rapide pour SHO, SHO RGB et HOO ») : les rapides se font phase par phase ; les colonnes ont un groupe P#_rapide, « pas encore de rapide » sauf en P1.
- **P1 : R_C_Preparation_rapide** (double-clic puis Apply Global, masters seuls ouverts) = Renommer_auto, LinearPatternSubtraction, Solver_auto (ImageSolver sur toutes les images). Remplace les mêmes étapes du chemin principal P1.
- **Chemin principal P1 : Solver_auto** (8 octobre 2026, comme en LRGB, après Renommer_auto ; RGB + SHO : après Combinaison_RGB) : ImageSolver sur toutes les images en Apply Global ; l'ImageSolver de P2 ne sert plus que pour une image en échec. Cause : SPCC du RGB en échec (« The image has no valid astrometric solution: RGB ») quand ImageSolver de P2 n'avait pas été glissé sur RGB. Pas de combinaison SHO ou HOO : elle se fait après le gradient (P3), qui se retire par master.
- **RGB + SHO** : Combinaison_RGB en plus, avant Solver_auto (comme en LRGB et comme le chemin principal, E02).
- HOO caméra couleur dual-band : pas ce rapide (DualBand_H / DualBand_O au chemin principal).
- Mêmes scripts et réglages qu'en galaxies (Renommer_auto reconnaît Ha, OIII, SII) : aucune nouvelle valeur technique.
- **P2 : R_Gradient_auto_rapide** (double-clic puis Apply Global, après R_C_Preparation_rapide) = script Gradient_auto : GradientCorrection sans modèle sur toutes les images ouvertes (S, H, O ; RGB en RGB + SHO). Remplace toute la phase 2 (ImageSolver, SPFC, MGC + MARS, GradientCorrection), comme en galaxies. Limites : O garde un gradient (Lune) ou nébuleuse qui remplit le champ -> chemin principal (MGC + MARS) ou DBE ; nébuleuse assombrie -> Protection amount plus haut (`outils.md`). RGB + SHO : le gradient du RGB est fait ici, à sauter dans le bloc Etoiles_RGB.
- **P3 : R_C_Lineaire_rapide** (double-clic puis Apply Global, après R_Gradient_auto_rapide ; Conteneurs du workflow chargé) = conteneur de scripts : Lineaire_auto (E09_Combinaison_SHO ou _HOO sur H) ; Fermer_vues (masters S, H, O ou H, O : l'extraction recrée ces noms) ; Lineaire_auto (C_SHO_lineaire ou C_HOO_lineaire, C_Extraction_SHO ou _HOO ; SHO sans RGB : C_Extraction_etoiles sur SHO_stars ; RGB + SHO : C_RGB_lineaire sur RGB, qui reste linéaire avec ses étoiles) ; Fermer_vues (SHO ou HOO linéaire sans étoiles ; RGB + SHO : aussi SHO_stars). Gardées : SHO_stars (SHO), HOO_stars (HOO), RGB linéaire (RGB + SHO, pour MAS en P4). Les réglages sont ceux des icônes du chemin principal (Lineaire_auto les lance). Pas en glissant : mode de lancement `cont_scripts` du générateur.
- Masters fermés sans enregistrement (préférence : images inutiles fermées) ; les enregistrer avant pour les garder.
- **Turbo : T_Turbo_debut** (colonne P1, groupe P1_turbo ; masters seuls ouverts, Conteneurs du workflow chargé, double-clic puis Apply Global) = R_C_Preparation_rapide + R_Gradient_auto_rapide + R_C_Lineaire_rapide en un seul conteneur de scripts (mêmes étapes, pas de conteneur imbriqué). Résultat : S, H, O (ou H, O) sans étoiles, linéaires ; SHO_stars (SHO), HOO_stars (HOO) ; RGB linéaire avec étoiles (RGB + SHO). Pas de continuum dans le turbo.
- **P4 (RGB + SHO seul) : R_C_RGB_etoiles_rapide** (double-clic puis Apply Global, rien à glisser) = Lineaire_auto (MAS puis SXT_RGB_etire du chemin principal sur RGB), Etoiles_auto (SCNR vert 1,0 sur RGB_stars), Fermer_vues (RGB) ; équivalent du R_C_RGB_etire_rapide du LRGB, sans GHS fond (le RGB sans étoiles est fermé). Les GHS de S, H, O restent à la main.
- **P4 canaux : R_C_MAS_canaux_rapide** (3 workflows, Apply Global) = Lineaire_auto lance l'option Opt_MAS_canaux (réglages MAS de l'utilisateur, fond cible 0,15 pour tous, saturation décochée) sur S, H, O (HOO : H, O), à la place des GHS. Demande de l'utilisateur ; aucune source sur MAS en narrowband (non vérifié) ; un même fond cible suit la règle « même fond pour tous les canaux », la médiane n'est pas égalisée : contrôler les fonds après.
- **P5 (SHO sans RGB, RGB + SHO) : R_C_Palette_rapide** (double-clic puis Apply Global) = Lineaire_auto (SHO_simple sur H, puis NBN_SHO sur SHO_etire) ; S, H, O restent ouverts (demande de l'utilisateur). NBN_SHO préréglé palette SHO, Lightness Ha, SCNR 0,7 (demandes de l'utilisateur ; SCNR partiel 0,5 à 0,8 déjà conseillé dans la base), boosts à 1. HOO : pas de rapide P5 pour l'instant.
- **P6 et P7 (3 workflows) : R_C_Fin_rapide et R_C_Etoiles_fond_rapide**, les mêmes conteneurs que les galaxies (fin_rapide), à GLISSER sur l'image sans étoiles : P6 = HDRMT 30 %, masque, Courbes, LHE, LHE_fin, Sharp_MMT, masque retiré, NXT_final 0,40 ; P7 = Fond_desature, Fond_auto 0,12, Etoiles_screen (étoiles du workflow : RGB_stars, NBtoRGB_stars, HOO_stars), NXT_dernier 0,25, Export_TIFF.
- Fond_auto en narrowband (analyse du 8 octobre 2026, choix de l'utilisateur : reste au chemin principal) : il mesure le fond sur le quart le plus sombre d'une grille 8 × 8 ; si la nébuleuse remplit le champ (fréquent au CDK17, environ 42′), ce n'est pas du ciel et il neutralise la nébulosité faible ; aide : fond AVANT au-dessus d'environ 0,20 dans la console -> sauter l'étape (seuil au jugé, non vérifié). Fond_desature : risque de griser les voiles faibles (rampe +0,03 à +0,15 au-dessus du fond) ; choix de l'utilisateur « plus doux » : fin 0,08 en narrowband (chemin principal et R_C_Etoiles_fond_rapide), galaxies inchangées à 0,15 ; valeur au jugé, non vérifiée.
- Rapides : tous faits (P4 : GHS à la main ou MAS_canaux ; pas de P5 rapide en HOO).

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

## SHO sans RGB : étoiles SHO_stars et options étoiles (8 octobre 2026)

Demande de l'utilisateur : « dans SHO (sans RGB) les etoiles s'appelent SHO_stars et il manque les options de saturation grosses étoiles, retirer le violet etc qu'il y a dans le SHO RGB ». Image d'étoiles par défaut du SHO sans RGB : SHO_stars (SXT_lineaire, étirée par Star_Stretch) dans Etoiles_screen, Etoiles_reduites, R_C_Etoiles_fond_rapide, Nettoyage_sans_etoiles, Halo_B_Gon ; NB_to_RGB_Stars (NBtoRGB_stars) et Etoiles_HOO_synth (Stars_HOO) deviennent des méthodes à part (nom à changer dans Etoiles_screen). Options P7 après Star_Stretch, avant Etoiles_screen, mêmes scripts que le RGB + SHO, vue = SHO_stars : SCNR_etoiles_vert (option ici, chemin principal en RGB + SHO), SCNR_etoiles_violet, Saturation_grosses. Non testé sur des étoiles narrowband (SCNR vert sur des étoiles SHO : à juger à la sonde).

## MAS_canaux : fond 0,25 puis GHS_3_fond (8 octobre 2026)

Demande de l'utilisateur : « en SHO, le MAS doit avoir taget median 0.25 comme ca apres je fais le GH3. tu peux mettre ca dans le rapide? ». Opt_MAS_canaux (lancée par R_C_MAS_canaux_rapide), 3 workflows narrowband : Target background 0,250 au lieu de 0,150 (MAS n'a pas de « Target Median » ; Target background est son réglage de fond, comme le Target Median 0,25 de Statistical Stretch), puis GHS_3_fond à la main sur chaque canal (SP = HP = fond lu − 0,03, fond final 0,12–0,14). MAS_light garde 0,15 (réglages de l'utilisateur). Non testé.

## Option CorrectMagentaStars supprimée (8 octobre 2026)

Demande de l'utilisateur : « supprime Opt_CorrectMagentaStars ». Icône retirée de la P7 du SHO sans RGB et du RGB + SHO ; textes qui la citaient renvoyés vers SCNR_etoiles_violet. Le script CorrectMagentaStars reste dans le menu Script de PixInsight (texte de SCNR_etoiles_violet en LRGB / LHaRGB inchangé).
