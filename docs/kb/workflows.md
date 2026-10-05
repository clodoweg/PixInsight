# Workflows LRGB et LHaRGB (les seuls utilisés)

Ordre des étapes, ce que fait chaque étape et pourquoi, mode rapide, images fermées, finition en parties, standards de couleur et d'étoiles. Les réglages exacts des icônes sont dans `icones-LRGB.md` et `icones-LHaRGB.md`.

Issu de l'ancienne fiche HTML `docs/pixinsight-workflow.html` (octobre 2026) ; sources dans `docs/sources.md`.

## Mode rapide (LRGB et LHaRGB)
Pour traiter beaucoup de galaxies vite : des conteneurs préréglés, à glisser dans l'ordre. Gradient par GradientCorrection seulement (MGC + MARS reste au mode normal).

**Où sont les icônes** : [Conteneurs-LRGB.xpsm](https://github.com/clodoweg/PixInsight/blob/main/docs/process-icons/workflows/Conteneurs-LRGB.xpsm) et [Conteneurs-LHaRGB.xpsm](https://github.com/clodoweg/PixInsight/blob/main/docs/process-icons/workflows/Conteneurs-LHaRGB.xpsm). Chaque colonne a trois groupes : **P#_Nom** (chemin principal, E00…), **P#_options** (Opt_…) et **P#_rapide** (R_…) ; sans icône R_, prends le chemin principal. L est étirée SANS étoiles, à la main par les 3 GHS ; le RGB est étiré AVEC ses étoiles par MAS, puis SXT Unscreen (RGB_stars) ; LRGB sur les deux images sans étoiles ; RGB_stars remises à la fin. Le turbo T_Turbo_debut fait P1 à P3 en un clic.

### Une seule fois par ordinateur
Copie tous les scripts du dossier [scripts](https://github.com/clodoweg/PixInsight/tree/main/docs/process-icons/scripts) dans `src/scripts/clodoweg` de PixInsight (dossier à côté du dossier ImageSolver), y compris `clodoweg_ui.jsh` (fenêtres communes).

### LRGB : l'ordre (process galaxies du 5 octobre 2026)
L sans étoiles (SXT linéaire) étirée par GHS ; RGB étiré par MAS AVEC ses étoiles, puis SXT Unscreen (RGB_stars) ; LRGB sur les deux images sans étoiles (Saturation 0,5) ; RGB_stars remises à la fin.

Où| Icône| Sur| Ce qu'elle fait  
---|---|---|---  
P1_rapide| R_C_Preparation_rapide| masters seuls ouverts ; double-clic puis **Apply Global**| Renommer_auto, LinearPatternSubtraction, Combinaison_RGB (crée `RGB`), Solver_auto  
P1_turbo| T_Turbo_debut| masters seuls ouverts ; double-clic puis **Apply Global**| en une fois : étapes de R_C_Preparation_rapide, R_Gradient_auto_rapide et R_Lineaire_rapide (un seul conteneur, les icônes R_ ne sont pas nécessaires) ; ensuite GHS_1_premier sur L  
P2_rapide| R_Gradient_auto_rapide| double-clic puis Apply Global| GradientCorrection sur toutes les images ouvertes  
P3_rapide| R_Lineaire_rapide| double-clic puis Apply Global| lance E08_C_RGB_lineaire sur RGB (BXT Correct Only, SPCC, BXT, NXT) puis E09_C_L_lineaire sur L (BXT, NXT, SXT : L sans étoiles)  
P4| E10 GHS_1_premier, E11 GHS_2_contraste, E15 GHS_3_fond (chemin principal)| L sans étoiles| GHS_1 à la main, puis GHS_2 et GHS_3_fond  
P4_rapide| R_C_RGB_etire_rapide| RGB linéaire avec étoiles| MAS (fond 0,15), SXT Unscreen (crée RGB_stars), SCNR vert sur RGB_stars, GHS fond (violet : SCNR_etoiles_violet à part) (SP = HP = 0,12)  
P5_rapide| R_C_LRGB_rapide| RGB sans étoiles, L ouverte| LRGB_ajout_L (Saturation 0,5) seul  
P6_rapide| R_C_Fin_rapide| image sans étoiles| HDRMT 30 %, masque, Courbes, LHE, LHE_fin, Sharp_MMT, masque retiré, NXT 0,40  
P7_rapide| R_C_Etoiles_fond_rapide| image sans étoiles finie| Fond_desature, Fond_auto (0,12), Etoiles_screen, NXT_dernier (0,25), Export_TIFF (aucune vue fermée). (Opt_Saturation_grosses et Opt_SCNR_etoiles_violet : options P4, pas dans le rapide)  

Chemin principal LRGB : E08 C_RGB_lineaire, E09 C_L_lineaire (finit par SXT_L_lineaire), E10 GHS_1, E11 GHS_2 (L), E12 MAS, E13 SXT_RGB_etire (RGB), E14 SCNR_etoiles_vert (SCNR vert 1,0 sur RGB_stars ; options P4 : SCNR_etoiles_violet (Invert, SCNR vert, Invert) et Saturation_grosses, pas dans le rapide), E15 GHS_3_fond (L et RGB), E16 LRGB_ajout_L, E17 HDRMT_30, E18 C_Finition, E19 C_Sharp_MMT (accentuation ; en rapide dans R_C_Fin_rapide), E20 NXT_final, E21 Fond_desature, E22 Fond_auto (tous deux sur l'image sans étoiles), E23 Etoiles_screen, E24 NXT_dernier (Denoise 0,25 sur l'image finie avec étoiles). Statistical_Stretch est une option.

### LHaRGB : l'ordre
Comme le LRGB, sauf la phase 3 (demande de l'utilisateur, 5 octobre 2026) : E10 C_RGB_couleur (BXT Correct Only, SPCC, BXT), E11 BXT_L_H sur L et sur H, E12 NXT_L (0,60), E13 SXT_L_lineaire, E14 CombineHaWithRGB (Toolbox de Jürgen Terpe, instance de l'utilisateur : H Alpha = H, Amount 2, Beta 0, Background 0,015, Sigma 0 ; par sa fenêtre, double-clic ; glissé, il échoue car il appelle beginProcess sur la vue cible), E15 C_RGB_bruit (NXT 0,80, ferme H, R, HaNB). Options P3 : Continuum_auto (avant CombineHaWithRGB, puis H Alpha = HaNB), H_dans_RGB, H_dans_RGB_v2, H_dans_L. Réglages BXT et NXT identiques au LRGB. Rapides P3 : R_Lineaire_rapide (C_RGB_couleur, BXT_L_H, NXT_L, SXT_L_lineaire), puis R_C_Ha_rapide glissé sur RGB (Ha_screen : PixelMath, même calcul que CombineHaWithRGB sur H, utilisé seulement ici ; NXT ; fermeture). PhotometricContinuumSubtraction a été essayé puis retiré (résultat jugé moche par l'utilisateur). T_Turbo_debut fait encore P1 à P3, à revoir. Puis GHS sur L, MAS + SXT_RGB_etire + SCNR_etoiles_vert + GHS_3_fond sur RGB, LRGB (Saturation 0,5), finition (HDRMT_30, C_Finition, C_Sharp_MMT, NXT_final), Fond_desature, Fond_auto, Etoiles_screen, NXT_dernier.

### Images fermées au fur et à mesure
Icône| Ferme  
---|---  
Combinaison_RGB| LRGB : R, G, B ; LHaRGB : G, B (R sert à Continuum_auto)  
LHaRGB : C_RGB_bruit| H, R, HaNB (fais Opt_H_dans_L avant)  
Export_TIFF| plus rien (demande de l'utilisateur) ; ferme L et RGB_stars à la main si besoin  
  
### Finition du workflow normal en 5 parties
Après E16 LRGB_ajout_L (E22 en LHaRGB). Regarde l'image après chaque partie ; les options sont rangées dans P6_options et P7_options. Numéros LRGB (LHaRGB entre parenthèses).

Partie| Icône par défaut| Options  
---|---|---  
0\. Nettoyage| (option) Opt_Nettoyage_sans_etoiles : restes de halos des étoiles brillantes après SXT, RGB_stars ouverte| réglages et cas dans la description de l'icône  
1\. Cœur| E17 (E23) HDRMT_30| HDRMT_40 (cœur encore trop clair), HDRMT_50 (cœur brûlé), HDRMT_eclat (cœur terne) ; rien si le cœur est bien  
2\. Contraste| E18 (E24) C_Finition : masque, Courbes (saturation 0,58), LHE 150, LHE_fin 40, masque retiré| à la place : Finition_saturee (même chose, saturation 0,65 : l'ancienne C_Finition) ; après : Boost_finition_light ou Boost_finition  
2b. Accentuation| E19 (E25) C_Sharp_MMT (MMT sous masque)| à la place : Sharp_USM (UnsharpMask) ; en rapide : Sharp_MMT dans R_C_Fin_rapide  
3\. Bruit| E20 (E26) NXT_final 0,40| NXT_final_doux (0,25) ou NXT_final_fort (0,60)  
4\. Fond, puis étoiles| E21 (E27) Fond_desature, E22 (E28) Fond_auto (0,12), puis E23 (E29) Etoiles_screen (SCNR des étoiles déjà fait en P4, SCNR_etoiles_vert), puis E24 (E30) NXT_dernier (Denoise 0,25, toute dernière réduction de bruit)| (Saturation_grosses : option P4, sur RGB_stars) ; Halo_B_Gon et MT_etoiles réduisent aussi les petites étoiles ; à la place : Etoiles_reduites (réduit toutes les étoiles)  
5\. Après les étoiles| Boost_final_doux ou Boost_final (L ouverte), en option| à la place de Fond_auto : Fond_auto_clair (0,14)  
  
### Finition hors PixInsight
`Opt_Export_TIFF` (fin de P7) enregistre une copie en TIFF 16 bits sRGB, profil ICC intégré, sous le nom du dossier des masters (/Astro/NGC1532/master/… donne /Astro/NGC1532/NGC1532.tiff, sans espace). `Opt_ICC_sRGB` ne sert que si tu enregistres toi-même. Ensuite, des retouches légères seulement, pas de nouvel étirement.

  * **Photoshop** pour la finition : convertis le calque en objet dynamique, puis filtre Camera Raw léger : saturation des bleus et cyans −10 à −15, vibrance +5 à +10, clarté +5 au plus, texture 0 ; correcteur sur un calque vide (« Échantillonner tous les calques ») ; halo coloré : calque Teinte/Saturation masqué sur le halo. Enregistre en PSD, exporte en JPEG sRGB.
  * **Affinity** , même marche : calques de réglage HSL (bleus vers cyans −10 à −15) et Vibrance (+5 à +10), filtre en direct Clarté 5 à 10 %, pinceau correcteur sur un calque vide ; export JPEG sRGB.
  * **Lightroom** pour ranger et exporter en série.

Pour une série : action Photoshop, préréglage Camera Raw ou macro Affinity.

### Icônes à tester (LRGB et LHaRGB)
Rangées dans les options (`Opt_`). Compare toujours avec le chemin principal sur la même cible.

Icône| Phase| Rôle  
---|---|---  
Binning_x2| P1, après Solver_auto| Toutes les images divisées par 2 (IntegerResample, moyenne), solution astrométrique gardée. 0,528″/px au lieu de 0,264″/px : le CDK17 sur QHY600 est suréchantillonné par un seeing courant de 2 à 3″, on perd peu de détail, le bruit baisse et le traitement va 4 fois plus vite. Image finale 4 800 px au lieu de 9 600.  
Agrandir_x2| P7, avant Export_TIFF| Après Binning_x2, pour un grand tirage : Resample × 2, Lanczos 3. Rend la taille, pas le détail perdu. Grand tirage très net voulu : ne bine pas.  
H_dans_RGB_v2 (LHaRGB)| P3| À la place de H_dans_RGB : R + w·(HaNB − med(HaNB)) et B + 0,2·w·(HaNB − med(HaNB)) (part de Hβ) ; fond de HaNB retiré avant l'injection, régions HII plus roses.  
CombineHaWithRGB (LHaRGB)| P3| Script de la PixInsight Toolbox (Jürgen Terpe), à la place de Continuum_auto + H_dans_RGB : glisse sur RGB linéaire, H ouverte (Amount 2, Linear).  
MAS| P4| Devenu chemin principal (E12 en LRGB) : voir plus haut. Icône vérifiée : elle se charge dans PixInsight (retour de l'utilisateur).  
DarkStructureEnhance| P6, avant C_Finition| Script livré avec PixInsight (Script › Utilities) : bandes de poussière plus marquées. Défauts Layers 8, Amount 0,70 ; trop fort : 0,40.  

## LRGB
Galaxies, nébuleuses par réflexion, amas. La couleur vient du RGB, le détail de la luminance.

1. #### Combinaison RGB

Combine R, G et B. Relance ImageSolver si la solution astrométrique n'a pas été conservée.

2. #### Suppression du gradient

Sur le RGB combiné et sur L (voir la phase linéaire commune). Avec MGC : SPFC d'abord, puis MGC.

3. #### Correction optique avant la couleur

BXT en mode _Correct Only_ sur le RGB combiné, **avant SPCC** : RC Astro l'indique pour obtenir le meilleur équilibre des couleurs.

4. #### Calibration des couleurs

Choisis ton profil de filtres et de capteur. Le type de galaxie _Average Spiral_ sert de référence de blanc. Contrôle ensuite les graphes et les couleurs (couleurs LRGB).

5. #### Déconvolution

RGB : BXT complet (étoiles et non-stellaire), après SPCC. L : BXT complet, en poussant un peu plus fort le non-stellaire que sur le RGB.

6. #### Réduction du bruit

NXT sur RGB (0,80, avec ses étoiles) et sur L (0,60), après BXT ; puis SXT_L_lineaire sur L linéaire (L sans étoiles, pas d'image d'étoiles gardée).

7. #### Étirement, avec les étoiles

Étire séparément le RGB et L.

     * **RGB** (il donne la couleur et les étoiles) : MAS AVEC ses étoiles (réglages de l'utilisateur, fond 0,15), puis SXT_RGB_etire (Unscreen coché : RGB sans étoiles + RGB_stars étirée), puis SCNR_etoiles_vert sur RGB_stars. Option : Statistical Stretch à la place de MAS.
     * **L** (elle porte le détail), SANS étoiles : GHS_1 (à la main) puis GHS_2, méthode GHS (`techniques.md`).
     * **Les deux** : GHS_3_fond, jusqu'au même fond (0,12–0,14), avant LRGBCombination.

Couleurs ternes : Saturation plus basse dans LRGBCombination.

8. #### Combinaison L + RGB

Sur les deux images étirées **sans étoiles** : LRGBCombination (LRGB_ajout_L), Lightness 0,5, Saturation 0,5 (réglage de l'utilisateur), _Chrominance noise reduction_ activée. Contrôle : couleurs LRGB.

9. #### Les étoiles : déjà séparées en phase 4

`RGB_stars` vient de SXT_RGB_etire sur le RGB étiré par MAS ; SCNR vert 1,0 dessus juste après (SCNR_etoiles_vert ; options P4 : SCNR_etoiles_violet, Saturation_grosses). Restes de halos dans l'image sans étoiles : Opt_Nettoyage_sans_etoiles.

10. #### Finition du fond

Courbes pour la saturation et le contraste, contraste local sous masque, NXT final léger si besoin.

11. #### Réintégration des étoiles

Recombine en mode _screen_ , puis contrôle les couleurs d'étoiles (étoiles LRGB). Pour réduire ensuite les étoiles, utilise les formules de Bill Blanshan.

`~((~$T) * (~RGB_stars))`

Glisse Etoiles_screen sur l'image sans étoiles finale : elle devient l'image finale. Grosses étoiles presque blanches : Opt_Saturation_grosses (P4) sur RGB_stars. Étoiles trop présentes : Etoiles_reduites à la place (réduit toutes les étoiles) .

### Couleurs LRGB : le rendu de référence et comment le vérifier
SPCC calibre la couleur sur le blanc _Average Spiral Galaxy_ : une galaxie spirale est blanche en moyenne.

Zone| Couleur attendue  
---|---  
Galaxie spirale, vue dans son ensemble| **Blanche en moyenne** (définition du blanc de SPCC)  
Bulbe, cœur de galaxie| **Jaune à jaune orangé** (vieilles étoiles)  
Bras spiraux| **Bleu** (jeunes étoiles chaudes)  
Régions HII dans les bras| **Rose**  
Bandes de poussière| **Brun sombre**  
Nébuleuse par réflexion| **Bleu** (la poussière diffuse mieux le bleu)  
Nébuleuse en émission| **Rouge** (raies de Balmer de l'hydrogène, surtout Hα)  
Étoiles| Du **bleu-blanc** au **jaune-orange** , **jamais vertes**  
Fond de ciel| **Gris neutre foncé** (0,12–0,14, R = G = B)  
  
Une légère dominante bleue (moins de 10 %) est normale avec SPCC.
### Vérifier que tu es dedans
1. **Graphes de SPCC** (_Generate graphs_ , décoché dans les icônes : coche-le pour ce contrôle) : les étoiles suivent les droites de près, la croix du blanc de référence est dans le nuage de points. Une forte dispersion signale souvent un mauvais flat (gradient multiplicatif).
2. **Étoiles, à la sonde 15×15** : aucune étoile avec G au-dessus de R et de B à la fois (il n'existe pas d'étoile verte) ; on trouve des étoiles bleues (B ≥ G ≥ R) et jaune-orange (R ≥ G ≥ B). Toutes blanches : sur-étirement ou combinaison L/RGB mal accordée.
3. **Galaxie** : cœur R ≥ G, nettement au-dessus de B ; bras B au-dessus de R ; régions HII R au-dessus de B au-dessus de G.
4. **Fond** : R ≈ G ≈ B.

Schéma (valeurs illustratives, pas des cibles chiffrées) : ce que la sonde doit lire sur une galaxie calibrée. Une étoile où G dépasse à la fois R et B est physiquement impossible : c'est une erreur de calibration ou un excès de vert.
### Quoi ajuster
Constat| Cause probable, réglage  
---|---  
Dominante verte générale| SPCC mal configuré (filtres, capteur) : refais-le. En dernier recours, SCNR vert, Average Neutral (rarement utile après SPCC)  
Tout bleu ou tout jaune| Mauvais filtres ou capteur dans SPCC, ou gradient resté avant SPCC  
Graphes dispersés| Flat à revoir, gradient multiplicatif, ou gradient retiré après SPCC au lieu d'avant  
Couleurs délavées après LRGBCombination| L trop claire par rapport au RGB : accorde fonds et médianes (méthode) ; Saturation plus bas que 0,5 (plus bas = plus saturé)  
Couleurs criardes, bruit coloré| Saturation trop poussée : réduis-la (dans LRGBCombination, remonte la valeur Saturation : plus haut = moins saturé) ; NXT sur le RGB ; réduction de chrominance de LRGBCombination  
Fond coloré| Neutralisation du fond de SPCC  
Régions HII peu visibles| Normal en LRGB pur ; pour les faire ressortir : LHaRGB  
  
**Quand passer à autre chose :** galaxie riche en régions HII : LHaRGB ; nébuleuse en émission ou ciel pollué : narrowband (SHO, HOO) ou RGB + SHO ; nébuleuse par réflexion, amas, galaxie sans régions HII marquées : le LRGB est dans son élément.

### Étoiles LRGB : le standard et comment le vérifier
Couleur mesurée par SPCC : étoiles du **bleu-blanc au jaune-orange** , visibles mais pas criardes, variées, **jamais vertes** ; cœur des brillantes souvent blanc (la couleur se lit sur le halo). Vaut aussi pour le LHaRGB.
### Vérifier avec la sonde (15×15, sur le halo)
1. **Avant recombinaison** , sur l'image d'étoiles seule (RGB_stars, sortie de SXT_RGB_etire après MAS) : graphes SPCC corrects ; étoiles chaudes R ≥ G ≥ B, bleues B ≥ G ≥ R ; aucune avec G au-dessus de R et de B ; une dizaine d'étoiles ne donnent pas toutes la même lecture.
2. **Après recombinaison** , à 100 % : même couleur que sur l'image d'étoiles seule ; ni anneau sombre, ni halo coloré ; étoiles ni grossies ni trop présentes ; fond inchangé.
### Quoi ajuster
Constat| Réglage  
---|---  
Étoiles toutes blanches| Étirement trop fort du RGB (MAS) : réglages de MAS plus doux ; grosses étoiles presque blanches : Opt_Saturation_grosses ; en dernier recours, étoiles étirées à part (SXT en linéaire, Star Stretch)  
Étoiles criardes| Légère désaturation de l'image d'étoiles (RGB_stars) avant Etoiles_screen  
Étoiles vertes, bleues ou jaunes en bloc| SPCC à revoir (filtres, capteur, gradient avant SPCC) ; SCNR seulement en dernier recours  
Étoiles ternes| Elles viennent du RGB seul (RGB_stars) : Opt_Saturation_grosses pour les grosses ; SCNR_etoiles_violet seulement si violet mesuré  
Anneau sombre autour des étoiles| Extraction SXT imparfaite ou étirement trop différent entre fond et étoiles : revois SXT, puis Halo-B-Gon ou réduction d'étoiles  
Étoiles trop grosses ou trop présentes| Etoiles_reduites à la place d'Etoiles_screen  
Fond éclairci ou teinté après ajout des étoiles| Fond de l'image d'étoiles pas à 0 : revois SXT (Unscreen coché sur l'image étirée)

## LHaRGB
Galaxies avec régions HII, ou nébuleuses en émission. Le H s'ajoute au rouge et, en option, à la luminance.

### Le continuum, en une image
Schéma (hauteurs non à l'échelle). La raie Hα est fine ; le continuum couvre tout le spectre. Le filtre H de 3 nm capte la raie plus une fine tranche de continuum ; le filtre R en capte surtout le continuum. D'où `HaNB = H − k·(R − med(R))` : il reste l'émission pure, à injecter sans rougir les étoiles.

1. #### RGB, L et H jusqu'à la déconvolution

RGB comme en LRGB (gradient, BXT _Correct Only_ , SPCC, BXT) ; gradient et BXT sur L et H aussi, **avant** la soustraction du continuum.

2. #### Soustraction du continuum sur H

Icône E12 **Continuum_auto** (Automatic Continuum Subtraction) : double-clic puis Apply Global ; Ha = H, Red (or RGB) = R, Execute. Le coefficient se calcule tout seul ; le script crée `HaNB` (renomme HaNB1 en HaNB si besoin). Contrôle : étoiles et disque presque disparus de HaNB.

3. #### Injection dans R

Sur le RGB calibré, **w** de 0,5 à 2. Garde une copie du RGB avant injection pour comparer (couleurs LHaRGB).

R'`R + w * HaNB`

4. #### Injection dans L (facultatif)

Rend les régions HII plus nettes. Un mélange léger fonctionne aussi.

L'`max(L, HaNB * a)`

5. #### Suite du workflow LRGB

Comme en LRGB : NXT, SXT_L_lineaire (L sans étoiles), GHS sur L, MAS + SXT_RGB_etire sur RGB, LRGB sans étoiles, finition, étoiles (RGB_stars) remises à la fin.

### Couleurs LHaRGB : le rendu de référence et comment le vérifier
Comme en LRGB, sauf les **régions HII, roses** et plus visibles. Piège : trop de H rougit toute l'image.

**Rose et pas rouge vif** : l'hydrogène émet aussi Hβ (bleu-vert). Pour l'imiter, ajoute au bleu au plus 0,35 × ce qu'on ajoute au rouge (B' = B + 0,35 × w × HaNB ; Hα/Hβ = 2,86), souvent 0,2.
### Vérifier que tu es dedans
1. **Compare avec ton LRGB sans H** (garde une copie avant injection) : hors des régions HII, les couleurs doivent être **identiques** (cœur, bras, étoiles, fond). Seules les régions HII changent.
2. **Sonde 15×15** : région HII, R nettement au-dessus de G et B, avec B ≥ G (rose ; si B ≪ G, le rose vire à l'orange-rouge) ; cœur, mêmes valeurs qu'en LRGB (R ≥ G ≫ B) ; étoiles, R pas franchement plus haut qu'en LRGB ; fond, R ≈ G ≈ B (fond rouge : bruit de H injecté).

### Quoi ajuster
Constat| Cause, réglage  
---|---  
Cœur ou halo rougi, étoiles à halo rouge| **Continuum mal soustrait** : relance Continuum_auto en mode Starless, ou baisse w ; étoiles et disque doivent disparaître de HaNB  
Taches HII rouge vif, trop saturées| **w trop fort** dans R' = R + w·HaNB : baisse w (0,5 à 2)  
Régions HII invisibles| w trop faible ou HaNB trop sombre : monte w, ou injecte aussi dans L  
Fond rouge ou granuleux| Bruit de HaNB injecté : NXT sur HaNB avant injection ; vérifie que le fond de HaNB reste près de 0  
Régions HII nettes mais couleurs délavées| Injection dans L trop forte (`max(L, HaNB·a)`) : baisse a, ou mélange léger  
### Étoiles en LHaRGB
Comme en LRGB, **et pas plus rouges qu'avant l'injection** : les étoiles reçoivent le H injecté, donc tout résidu d'étoile dans HaNB.

Défaut| Cause| Réglage  
---|---|---  
Étoiles rougies, halo rouge| Continuum mal soustrait : un reste de H stellaire est injecté| Relance Continuum_auto en mode Starless, ou baisse w ; les étoiles doivent disparaître de HaNB  
Anneaux clairs ou sombres autour des étoiles| PSF différentes entre H et R| Prends les étoiles avant injection (ci-dessous)  
Étoiles grossies| H trop fort| Baisse w  
  
**Étoiles d'avant injection** (hors icônes) : SXT sur une copie du RGB non injecté, garde ces étoiles-là pour Etoiles_screen.

**Quand choisir autre chose :** galaxie sans régions HII marquées (elliptique, lenticulaire) : LRGB ; nébuleuse en émission sans galaxie : la version HaRGB simple ci-dessus, ou le narrowband (HOO, SHO) ; avec aussi de l'O (nébuleuses planétaires) : RGB + SHO.
