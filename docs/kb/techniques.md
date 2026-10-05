# Techniques : GHS, réduction d'étoiles, masques, règles d'or

Méthode GHS en détail (SP, LP, HP, valeurs de départ et de contrôle), formules de réduction d'étoiles de Bill Blanshan, masques, règles générales.

Issu de l'ancienne fiche HTML `docs/pixinsight-workflow.html` (octobre 2026) ; sources dans `docs/sources.md`.

## Méthode GHS en détail
GHS étire en plusieurs passes : tu choisis où placer le contraste (SP), sa concentration (b) et ce que tu protèges (LP, HP). D'après la documentation officielle de GHS.

Courbes GHS (SP = 0,1) : la pente est maximale en SP ; avec b = 10, l'étirement reste concentré autour de SP.

### Les paramètres
Paramètre| Plage| Rôle  
---|---|---  
Stretch factor (ln(D+1))| 0 à 20| Force de l'étirement. 0 ne change rien.  
Local intensity (b)| −5 à 15| Concentration de l'étirement autour de SP. Élevé : l'histogramme s'élargit fortement autour de SP. Bas ou négatif : l'image s'éclaircit globalement sans élargir l'histogramme.  
Symmetry point (SP)| 0 à 1| Niveau où le contraste ajouté est maximal.  
Protect shadows (LP)| 0 à SP| En dessous de LP, étirement linéaire : garde le contraste des ombres et empêche le fond de devenir trop sombre.  
Protect highlights (HP)| SP à 1| Au-dessus de HP, étirement linéaire : garde le contraste des hautes lumières (cœur de galaxie, nébuleuse brillante).  
Colour mode| —| RGB/K : canal par canal, peut délaver les couleurs. Colour : moyenne pondérée des canaux, garde la saturation. Lightness : canal L* seul. Saturation : saturation seule. Red, Green, Blue : un seul canal.  
  
### Affiner SP, LP et HP
Contraste maximal en SP ; sous LP et au-dessus de HP, étirement linéaire (zones protégées).

Toujours LP ≤ SP ≤ HP ; au départ LP = 0 et HP = 1.

**Ordre :** place SP, puis règle b et Stretch factor, puis HP, puis LP. Lis chaque niveau dans l'image avec la sonde 15×15, aperçu en temps réel activé.

Curseur| Comment le régler| Bon réglage  
---|---|---  
**SP**  
où va le contraste| Clique sur la zone à faire ressortir, puis _Send to SP_ (1er étirement : signal faible juste au-dessus du fond ; ensuite : une zone plate).| L'histogramme s'élargit le plus possible. S'il glisse vers la droite sans s'élargir (fond qui s'éclaircit, bruit qui ressort) : SP trop bas. S'il reste à gauche et s'élargit peu : SP trop haut.  
**HP**  
protège les zones brillantes| Pars de 1 ; baisse vers la valeur lue sur la zone la plus brillante (cœur, étoiles).| Le cœur garde son détail dans l'aperçu, l'histogramme ne s'accumule plus à droite (vue logarithmique). Si toute l'image s'assombrit, HP est trop bas : remonte-le.  
**LP**  
protège le fond| Pars de 0 ; si le fond devient trop sombre, monte vers sa valeur, sans dépasser SP.| Le fond garde du détail et ne se colle pas à 0.  
  
**Exemple, 2e passe sur une nébuleuse :** fond lu à 0,25, nébulosité plate à 0,40, cœur brillant à 0,85. Mets SP = 0,40, b = 4, puis monte Stretch factor vers 1,5. Le cœur sature : HP = 0,8. Le fond descend à 0,16 : LP = 0,15. Applique.

### Valeurs de départ par étape
Calculées avec les équations de GHS ; affine à l'aperçu.

Étape| Stretch factor| b| SP| HP| LP| Résultat visé  
---|---|---|---|---|---|---  
**1\. Premier étirement**  
GHS_1_premier| selon le fond lu :  
0,0005 → 7  
0,001 → 6,5  
0,002 → 5,5  
0,005 → 4,5  
0,01 → 3,5  
0,02 → 2,5| 10| valeur du fond (pic) ou du signal le plus faible| 1| 0| pic de l'histogramme à **0,25**  
**2\. Contraste**  
GHS_2_contraste| 1 à 2 (icône : 1)  
(0,5 léger, 3 trop fort)| 4  
(3–5)| zone plate au-dessus du fond, souvent 0,30–0,45 (icône : 0,35) ; jamais sur le fond (0,25)| 0,9  
(0,8–0,85 si le cœur sature)| 0  
(0,10–0,15 si le fond passe sous 0,20)| zone SP plus contrastée, fond vers 0,20–0,25 (icône : 0,25 → 0,23)  
**3\. Fond**  
GHS_3_fond| 0,8 à 1,2 (icône : 1)  
(≈ 1 pour un fond à 0,22–0,25)| 10| fond lu − 0,03 (icône : 0,20 pour un fond à 0,23)| = SP| 0| fond final 0,12–0,14  
  
Narrowband : O et S demandent un Stretch factor plus élevé pour le même fond que H. GHS_1_premier est à 0 dans l'icône (sans effet tant qu'il n'est pas réglé). Après Statistical Stretch : GHS_3_fond avec SP = HP = 0,22.

### Préparation
  * Image linéaire, sans gradient, calibrée (SPCC), passée dans BXT. Galaxies : avec ses étoiles (HP sous leur cœur) ; narrowband : sans étoiles.
  * Sonde de lecture (readout) en 15×15, moyenne. Retire l'autoSTF avant d'activer l'aperçu en temps réel.

1. #### Premier étirement

     * Transformation type : **Generalized Hyperbolic**.
     * Clique dans l'image sur la **zone intéressante la plus faible** (nébulosité ténue, bras de galaxie), puis sur _Send to SP_.
     * **Local intensity (b) ≈ 10** : étirement très concentré sur ce niveau.
     * Monte **Stretch factor** jusqu'à un pic de l'histogramme à **0,25** (valeurs de départ).
     * Aperçu en temps réel, affine SP (_highest sensitivity_), puis applique.
2. #### Garder les couleurs (image couleur)

     * Colour mode **Colour** plutôt que RGB/K ; zones saturées : clip mode **RGBBlend**.
3. #### Ajouter du contraste

Deuxième passe et suivantes, sur l'image déjà étirée :

     * Clique sur une zone plate (halo de galaxie), _Send to SP_ : en général 0,30 à 0,45, jamais sur le fond.
     * **b entre 3 et 5** , Stretch factor **1 à 2**.
     * **HP** 0,9 ; 0,8–0,85 si un cœur ou des étoiles saturent. Fond sous 0,20 : **LP** 0,10–0,15.
4. #### Assombrir le fond sans écrêter

Plus propre qu'un point noir en Linear, qui détruit des données.

     * Transformation type : **Generalized Hyperbolic** (pas Linear).
     * **SP = HP** = fond lu − 0,03, **LP = 0** , **b ≈ 10**.
     * Stretch factor **0,8 à 1,2** jusqu'à un fond vers 0,12–0,14.
5. #### Les étoiles

     * **Galaxies (LRGB, LHaRGB)** : GHS sur L avec ses étoiles, HP sous leur cœur ; SXT après LRGB.
     * **Narrowband** : GHS sur l'image sans étoiles ; les étoiles s'étirent à part avec Star Stretch.
6. #### LRGB : accorder L et RGB

     * Même fond et médiane proche sur L et RGB : lis-les à la sonde au même endroit.

**Contrôle à chaque passe :** garde un œil sur l'histogramme. Aucun pic collé à 0 (fond écrêté) et aucune accumulation à 1 (cœurs brûlés).

### Valeurs de référence : ni trop, ni pas assez étiré
Échelle 0–1 de PixInsight (équivalent sur 255 entre parenthèses).

Fond vers 0,20–0,25 après le 1er étirement, 0,12–0,14 dans l'image finale, jamais 0.

Moment| Valeur à viser  
---|---  
Fond de l'image finale| Gris foncé, **0,12–0,14** (30–35 sur 255)  
Couleur du fond| **R = G = B** , à quelques unités près (on ne lit jamais exactement la même valeur partout)  
Point noir| **Jamais 0** : aucun pixel du fond écrêté  
Selon le bruit| Données bruitées : haut de la fourchette (0,14–0,15). Données propres, après NXT : 0,10–0,12  
Hautes lumières| Seuls les cœurs des étoiles les plus brillantes atteignent 1 ; le cœur d'une galaxie ou d'une nébuleuse garde du détail  
  
### Comment contrôler dans PixInsight
1. **Valeur du fond :** preview sur du fond vide, puis _Process › Image › Statistics_ : lis la **médiane** de chaque canal.
2. **Écrêtage :** dans HistogramTransformation, le nombre de pixels écrêtés en bas doit rester à 0 (ou presque), sans pic collé au bord gauche.
3. **Hautes lumières :** si la lecture donne 1,0 sur de grandes zones, baisse HP (GHS) ou utilise Highlight reduction.

Trop étiré| Pas assez étiré  
---|---  
Fond grisâtre ou granuleux, bruit visible| Image sombre, extensions faibles invisibles (bras de galaxie, nébulosité diffuse)  
Halos, étoiles grosses et blanches| Aspect très contrasté, « découpé » sur du noir  
Couleurs délavées| Fond sous 0,08, ou pixels à 0  
Fond au-dessus de 0,18–0,20 dans l'image finale| Histogramme collé à gauche  
  
**Test simple :** regarde l'image en plein écran à 100 %, puis en vignette, et sur un autre écran (téléphone) : un écran trop lumineux pousse à trop assombrir le fond.

## Comparer les étirements (GHS, MAS, Statistical Stretch, EZ Soft Stretch)

Question de l'utilisateur (5 octobre 2026). Sources : `sources.md`, rubriques « Critique LRGB et LHaRGB » et « Étirements comparés ».

| Outil | Principe | Étoiles (étirées avec) | Contrôle | Pour qui dans le process |
|---|---|---|---|---|
| GHS (GeneralizedHyperbolicStretch) | courbe hyperbolique réglée à la main : SP (où va le contraste), b, LP, HP | HP protège les cœurs ; sans HP, les étoiles grossissent | total, à la main, plusieurs passes | L (choix fixe de l'utilisateur : GHS_1 à la main, GHS_2, GHS_3_fond) |
| MAS (MultiscaleAdaptiveStretch, PixInsight, déc. 2025) | étirement natif multi-échelle vers une cible de fond ; « dynamic range compression » pour garder le profil gaussien des étoiles ; restauration du contraste ; saturation en option | conçu pour étirer fort sans déformer les étoiles (avis d'utilisateurs, docs Starlust) | une passe, quelques curseurs, reproductible | candidat pour RGB (à la place de Statistical Stretch) et à tester sur L à la place de GHS_1 |
| Statistical Stretch (SetiAstro) | point noir = médiane − sigma × 1,4826 × MAD, puis fonction de transfert vers une médiane cible (0,25) | pas de protection des hautes lumières : étoiles plus grosses, cœurs blancs | automatique | RGB aujourd'hui (il ne donne que la couleur) |
| EZ Soft Stretch (darkarchon) | HistogramTransformation avec point noir et médiane calculés automatiquement | même famille que Statistical Stretch | automatique, curseurs | aucun apport ; suite abandonnée (archive GitHub) |

Avec ou sans étoiles :
- Avec étoiles : les étoiles sont les pixels les plus clairs ; une fonction de transfert (Statistical Stretch, EZ, HistogramTransformation) les fait grossir et blanchit leur cœur (couleur perdue). GHS avec HP ou MAS limitent cet effet.
- Sans étoiles (SXT en linéaire) : n'importe quel étirement va pour la galaxie ; les étoiles sont étirées à part (Star Stretch). RC Astro conseille de retirer les étoiles avant un étirement GHS ou arcsinh. L'utilisateur a choisi d'étirer AVEC les étoiles (LRGB et SXT ensuite) pour des étoiles cohérentes entre L et RGB.

Conseil donné (à valider sur des cibles réelles) : garder GHS sur L ; tester Opt_MAS sur le RGB à la place de Statistical Stretch, même cible de fond que L (0,10 à 0,12), saturation de MAS coupée sur les galaxies à cœur brillant ; puis tester MAS sur L à la place de GHS_1 seulement. Ne pas utiliser EZ Soft Stretch.

Variante proposée par l'utilisateur (5 octobre 2026, pas encore en icônes) : RGB étiré par MAS AVEC étoiles, puis SXT Unscreen (RGB_stars) ; L : SXT en linéaire, GHS sur L sans étoiles ; LRGB sur les deux images sans étoiles ; RGB_stars remises à la fin (Etoiles_screen). Avantages : L étirée librement (pas de HP à gérer), étoiles d'une seule source, couleur gardée par MAS, plus de souci de cohérence L/RGB dans les étoiles. Risques : étoiles moins fines et plus bruitées que celles de L (moins de signal dans le RGB), étoiles faibles de L absentes ; SXT peut prendre des nœuds HII ou des amas compacts de la galaxie pour des étoiles (retirés de L, rendus par RGB_stars, moins nets) ; luminosité des étoiles à doser (Etoiles_grosses, Etoiles_reduites).

## Accentuation finale (« boost de sharp ») : outils

Question de l'utilisateur (5 octobre 2026), pas encore en icônes.
- Sur l'image SANS étoiles, étirée, sous masque de luminance (masque_L), en fin de P6 (après C_Finition, avant NXT_final) ; jamais sur RGB_stars.
- MultiscaleMedianTransform (MMT) : petites couches (2 à 4) avec un léger biais (+0,03 à +0,05), couche 1 laissée (bruit) ; peu d'anneaux. Brecher l'utilise à la place d'une seconde passe de BXT (critique LRGB, sources 22 et 31).
- MultiscaleLinearTransform (MLT) : même principe, biais un peu plus forts possibles, plus d'anneaux qu'MMT.
- UnsharpMask : classique (écart type 1,5 à 2,5 px, amount 0,2 à 0,4, deringing) sous masque ; halos si trop fort (Chaotic Nebula, Light Vortex).
- Pas BlurXTerminator : données linéaires seulement (RC Astro, AI4), déjà fait en P3.
- LHE et HDRMT (déjà dans P6) donnent du contraste local, pas de l'accentuation fine.

## Réduction d'étoiles Bill Blanshan
Trois formules PixelMath (version 2) qui réduisent les étoiles sans toucher au fond. Elles s'appliquent à la fin, sur l'image étirée avec étoiles, à tous les workflows.

La réduction se fait après la recombinaison, avec la vue sans étoiles comme référence.

Vue sans étoiles nommée **starless** ; PixelMath, _Use a single RGB/K expression_ , formule et _Symbols_ , appliqué sur l'image avec étoiles. Dans les icônes : `Etoiles_reduites` fait la recombinaison et la méthode Transfer en une fois (S = 0,20). Avec aperçu : script StarReduction.

### 1. Méthode Transfer
La plus polyvalente. Baisse **S** (0,15 par défaut) pour réduire davantage.

RGB/K`S=0.15; Img1=starless; f1= ~((~mtf(~S,$T)/~mtf(~S,Img1))*~Img1); max(Img1,f1)`

Symbols`S, Img1, f1`

### 2. Méthode Halo
Réduit surtout les halos autour des étoiles brillantes. Même réglage avec **S**.

RGB/K`S=0.15; Img1=starless; f2= ((~(~$T/~Img1)-~(~mtf(~S,$T)/~mtf(~S,Img1)))*~Img1); f3= (~(~$T/~Img1)-~(~mtf(~S,$T)/~mtf(~S,Img1))); max(Img1,$T-mean(f2,f3))`

Symbols`S, Img1, f2, f3`

### 3. Méthode Star
**I** : nombre d'itérations, de 1 à 3. **M** : 1 = forte, 2 = modérée, 3 = douce.

RGB/K`Img1=starless; I=1; M=1; E1= $T*~(~(Img1/$T)*~$T); E2= max(E1,($T*E1)+(E1*~E1)); E3= E1*~(~(Img1/E1)*~E1); E4= max(E3,($T*E3)+(E3*~E3)); E5= E3*~(~(Img1/E3)*~E3); E6= max(E5,($T*E5)+(E5*~E5)); E7= iif(I==1,E1,iif(I==2,E3,E5)); E8= iif(I==1,E2,iif(I==2,E4,E6)); E9= mean( $T-($T-iif(I==1,E2,iif(I==2,E4,E6))), $T*~($T-iif(I==1,E2,iif(I==2,E4,E6)))); max(Img1,iif(M==1,E7,iif(M==2,E8,E9)))`

Symbols`I, M, Img1, E1, E2, E3, E4, E5, E6, E7, E8, E9`

## Masques
L'image sans étoiles remplace la plupart des masques. Le seul vraiment utile : le masque de luminance pour les courbes et LHE (icône Masque_L). Blanc = effet complet, noir = protégé.

### Quand en utiliser un
Étape| Masque| Lequel  
---|---|---  
Linéaire : BXT, NXT, SPFC, MGC, SPCC, étirement| Non| —  
SXT sur une galaxie au cœur très compact| Parfois| Zone noire sur le cœur : RC Astro indique que les zones masquées ne sont pas retirées  
LHE (contraste local)| **Oui**|  Masque de luminance (Masque_L) ou RangeSelection : le fond bruité ne prend pas de contraste  
Courbes de saturation et de teinte| Conseillé| Masque de luminance ; masque couleur pour une seule teinte (magenta, cyan d'O)  
HDRMultiscaleTransform| Non| Option _Lightness mask_ intégrée, cochée dans l'icône  
Éclaircir une galaxie ou une zone précise| Utile| GAME (ellipses ou forme libre, bords progressifs)  
Réduction d'étoiles, Halo-B-Gon| Non| Travail direct sur l'image d'étoiles seule  
  
### Masque de luminance en un clic : icône Masque_L
1. **Masque_L** (script [Masque_auto.js](https://github.com/clodoweg/PixInsight/blob/main/docs/process-icons/scripts/Masque_auto.js)), glissé sur l'image sans étoiles étirée : crée `masque_L` (luminance Rec. 709, fond sous **s** mis à 0, flou 2 px) et l'attache. **Masque_retirer** le détache et le ferme. Déjà dans C_Finition et les Boost.
2. **s = 0,14** (fond final 0,12–0,14) ; sinon s = fond + 0,01. Contrôle : fond de masque_L entre 0 et 0,05.

Masque_L`s = 0.14; max(0, (0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2] - s) / (1 - s))`

Masque_L_mono`s = 0.14; max(0, ($T - s) / (1 - s))`

L'effet suit la luminosité : avec s = 0,14, une zone à 0,20 reçoit 7 % de l'effet, un cœur à 0,80 en reçoit 77 %.

### Autres masques
  * **RangeSelection** (process) : garde une plage de niveaux (limites basse et haute), adoucie par Fuzziness et Smoothness. Pour isoler une nébuleuse du fond ou seulement les zones brillantes.
  * **ColorMask** (_Script › Utilities_ , livré avec PixInsight ; version de Mike Cranfield avec roue de teintes et aperçu STF) : masque par plage de teintes et de luminosité.
  * **GAME** (_Script › Utilities_) : masques dessinés, ellipses ou formes libres, avec dégradé.
  * **Masque d'étoiles** : l'image d'étoiles de SXT en gris, dilatée puis floutée.

## Règles d'or
#### L'ordre en linéaire
Gradient, BXT _Correct Only_ , SPCC, BXT complet, NXT. En narrowband, BXT sur la combinaison simple, avant tout mélange.

#### BXT d'abord
BXT avant toute réduction de bruit et avant le retrait des étoiles, jamais sur une image déjà étirée, et sans autre déconvolution en plus.

#### Quand retirer les étoiles
Galaxies : après LRGB, sur l'image étirée, _Unscreen_ coché. Narrowband : en linéaire, _Unscreen_ décoché. La finition se fait sans étoiles.

#### Reproductibilité
Garde tes paramètres dans des ProcessIcons ou l'History Explorer pour pouvoir refaire le traitement.

#### Un seul alignement
Tous les filtres alignés sur la même référence dans WBPP : les combinaisons PixelMath en dépendent.
