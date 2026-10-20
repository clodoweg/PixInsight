# Benchmark des réglages BlurXTerminator (20 octobre 2026)

Demande de l'utilisateur : « fais un benchmark des reglages de BXT en L et SHO sur les forums tres largement ». Environ 80 cas relevés (AstroBin surtout, sites d'imageurs, tutoriels, RC Astro). Cloudy Nights, Stargazers Lounge, Reddit, IceInSpace et Astrosurf bloquent la lecture : leurs valeurs sont des extraits de recherche (*résumé*). Version de BXT déduite de la date quand elle n'est pas écrite. Sources dans `../sources.md` (rubrique « Benchmark BXT »).

Abréviations : Ét. = Sharpen Stars, Hal. = Adjust Star Halos, NS = Sharpen Nonstellar.

## Réglages actuels des icônes

| Icône | Ét. | Hal. | NS | PSF |
|---|---|---|---|---|
| BXT_L, BXT_L_H (LRGB, LHaRGB) | 0,25 | 0 | **0,50** (0,80 avant le 20 octobre 2026) | auto |
| BXT_RGB (galaxies, RGB + SHO) | 0,25 | 0 | 0,50 | auto |
| BXT_NB (SHO, HOO, RGB + SHO) | 0,25 | 0 | 0,60 | auto |
| BXT Correct Only | – | – | – | auto, Correct Only |

Toutes en `ml_version = 0` (ML5 avec la licence de l'utilisateur).

## L des galaxies (33 cas, 19 valeurs NS chiffrées)

- NS : médiane **0,50**, plage habituelle 0,30-0,60 ; défaut 0,9 rare sur galaxie, surtout en courte focale. Sous 0,6"/px (9 cas) : médiane **0,44** ; au-dessus de 1"/px : 0,6-0,7. Longue focale = NS plus bas.
- **Référence la plus proche** : Kevin Morefield (staff IOTD AstroBin), **CDK17 + IMX455 à 0,264"/px**. NGC 253 : Ét. 0,25, NS 0,44 ; « jamais trouvé d'image où NS > 0,50 fasse mieux ». Galaxie en partie résolue (forum, décembre 2025) : Ét. 0,13, NS **0,30** (0,20 le plus propre, « cordes » dès 0,40, nettes à 0,60).
- Autres longues focales : CDK24 0,468"/px NS 0,48 ; C11 0,224"/px NS 0,5 ; ASA 600 drizzle 0,092"/px Ét. 0,5 NS 0,7 (carrés sombres autour des grosses étoiles, échantillonnage hors entraînement selon R. Croman).
- Galaxies résolues en étoiles (M33, NGC 300, NGC 253, NGC 55) : NS 0,2-0,3.
- Ét. : médiane 0,25 (0,13-0,33). Hal. : 0 presque partout.
- Conseils : partir bas, aperçu à 400 %, monter ; signes d'excès = « vers », « cordes », bords clairs ; plus de SNR = NS plus fort possible ; L bruitée = NS bas ou BXT sous masque de luminance.

## Narrowband SHO / HOO (35 cas)

- Méthode : RC Astro = BXT sur la combinaison SHO simple (un filtre par canal, poids proches), mélanges, NBN et boosts après ; par canal seulement si aberrations différentes (Correct Only par canal, combinaison, puis BXT complet). Conforme : Cosgrove (anneaux colorés en BXT par canal), la plupart des fiches de Ron Brecher. Divergents : Deep Space Place et theAstroShed (BXT par canal, mêmes valeurs).
- Ét. : deux écoles, 0,50 (Deep Space Place, theAstroShed, Brecher 2025) ou 0,10 avec Correct First (Brecher en narrowband) ; ailleurs 0,2-0,35.
- Hal. : 0 le plus souvent ; −0,18 à −0,40 chez certains.
- NS : 0,50 (workflows par canal) ; **0,75 chez Brecher au C14 à 0,4"/px, filtres 3 nm** (cas le plus proche) ; 0,9 en courte focale ; 0,6 sur les forums.
- PSF : auto presque partout ; Cosgrove en manuel (FWHM, puis 1,3 à 2 × la FWHM : pratique isolée, le manuel dit la FWHM).
- Aucune source sérieuse pour des réglages différents par canal (O III, S II plus bruités).

## Longue focale et suréchantillonnage (officiel RC Astro, vérifié)

- PSF Diameter : 8 px au maximum. Au CDK17 : 8 px × 0,264" = **2,1"**. Seeing 2" ≈ 7,6 px ; 2,5" ≈ 9,5 px (calcul).
- FWHM 4-6 px : rien à faire ; au-delà de 6-8 px : réduction ×2 (IntegerResample, Average) « sans perte » selon RC Astro ; drizzle inutile. Divergence : deux essais d'utilisateurs (CDK14 à 0,3"/px, Stargazers Lounge) préfèrent le bin 1 (comparaison visuelle).
- PSF auto : sur-accentuation possible dans les zones pauvres en étoiles (fréquent en longue focale) : PSF manuelle = FWHM mesurée.
- Sharpen Stars fort en longue focale : zones « sans détail » autour des étoiles brillantes (manuel).

## ML5

- RC Astro : plus net que ML4 à réglage égal, aucun réglage conseillé.
- Retours : moins de « vers » que ML4 à réglage égal (deux comparaisons) ; mais fausses étoiles ou beignets dans les coins aberrants (même en Correct Only, correctif annoncé), aigrettes modifiées en O III, détails inventés sur les petites galaxies de fond. Parade : Correct Only en ML4, puis ML5. Aucun retour ML5 sur données suréchantillonnées.

## Bilan pour l'utilisateur

- Ét. 0,25, Hal. 0, PSF auto : dans la norme partout.
- **BXT_L NS 0,80 : au-dessus de presque toutes les valeurs publiées en longue focale** ; référence CDK17 identique : 0,30-0,44, jamais plus de 0,50. Proposition : 0,45 (0,30 pour les galaxies résolues en étoiles). Touche LRGB et LHaRGB : accord de l'utilisateur nécessaire.
- BXT_RGB NS 0,50 et BXT_NB NS 0,60 : cohérents (Brecher 0,75 à 0,4"/px en 3 nm).
- Mesurer la FWHM des masters (FWHMEccentricity) : au-delà de 8 px, BXT est hors limite (binning ×2 retiré des workflows à la demande de l'utilisateur).
- Non vérifié : baisse de NS à cause de ML5 (déduction) ; réglages ML5 sur données suréchantillonnées ; défaut AI4 de Sharpen Stars (0,5 selon des utilisateurs).

## Décision (20 octobre 2026)

L'utilisateur a choisi 0,50 pour BXT_L et BXT_L_H (LRGB et LHaRGB ; demande : « y a une diff entre 0,5 et 0,44? » puis « oui ») : médiane publiée et limite haute de Morefield (CDK17, même échantillonnage). Repères : vers ou cordes à 400 % -> 0,40 ; galaxie résolue en étoiles -> 0,30.
