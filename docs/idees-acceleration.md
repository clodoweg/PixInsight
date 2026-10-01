# Idées pour aller encore plus vite (à faire plus tard)

Contexte : une centaine de photos à retraiter, **masters déjà empilés (un par filtre et par cible)**, mode conteneurs préféré. Le chemin LRGB en conteneurs comptait 18 icônes ; 17 depuis A et le retour d'ImageSolver (nécessaire avant SPFC/SPCC après recadrage et combinaison). Ces idées visent 7 à 8 icônes en mode « rapide » ; les chemins complets restent pour les meilleures photos. A est fait ; le reste n'est pas commencé.

| Workflow | Aujourd'hui (conteneurs) | Avec A + B + D | Avec C en plus |
|---|---|---|---|
| LRGB | 18 (17 maintenant) | ≈ 8 | — |
| SHO sans RGB | 25 (24 maintenant) | ≈ 15 | ≈ 8 |
| HOO | 25 (24 maintenant) | ≈ 14 | ≈ 7 |

(Estimations, à confirmer en construisant le mode rapide.)

## A. Retirer ce qui ne sert plus — **fait (1er octobre 2026)**
1. WBPP et CosmeticCorrection sortis du chemin principal (masters déjà empilés) et rangés en options (« seulement si tu repars des brutes ») dans `layout.py` : présents dans `Options-X`, dans les options de `Conteneurs-X` et dans le préparateur (décochés).

## B. Conteneurs plus gros
2. **Gradient dans le conteneur linéaire** : SPFC → MGC → BXT Correct Only → SPCC → BXT → SXT → NXT en un clic par image (masters résolus par WBPP). LRGB : phase linéaire en 2 clics (RGB, puis L).
3. **Étirement dans le conteneur** : Statistical Stretch avec `openDialogbox = false` en fin de conteneur (les conteneurs de theAstroShed contiennent déjà des scripts). Un clic : master → image sans étoiles étirée. GHS reste pour les photos soignées.

## C. Narrowband sans séparer les canaux (le plus gros gain en SHO / HOO)
4. Au lieu de combinaison + 3 extractions + 2 NXT + 3 GHS : NXT sur l'image SHO combinée, puis **Statistical Stretch non lié** (chaque canal à la même médiane = fonds égalisés demandés par la fiche), puis NarrowbandNormalization. ≈ 8 icônes de moins. **À valider** sur une image en comparant avec la méthode actuelle.

## D. Moins d'étapes à la fin
5. **Recombinaison des étoiles + réduction Blanshan en une seule formule PixelMath** (Blanshan Transfer appliqué au résultat de la recombinaison screen). Vérifiable numériquement.
6. **Finition rapide sans masque à fabriquer** : conteneur HDRMT (masque de luminosité intégré) + courbe de saturation légère. Masque_L et LHE restent pour les photos soignées.

## E. Supprimer les manipulations à la main
7. **Script de renommage automatique** : un clic, nomme les vues ouvertes L, R, G, B, H, O, S d'après le mot-clé FILTER de leur en-tête (les formules et la recombinaison exigent ces noms).
8. **Garder les icônes chargées** dans un espace de travail PixInsight dédié plutôt que de les recharger à chaque photo (à vérifier dans les préférences).

## F. Le grand saut
9. **Script PixInsight « Traiter ma cible »** (PJSR) : choisir le dossier d'une cible → ouvre les masters, aligne si besoin (StarAlignment), combine, applique les conteneurs, enregistre l'image sans étoiles étirée et les étoiles étirées. Reste à la main : palette, finition, recombinaison. En série, tourne la nuit sur les 100 cibles. Plus gros gain, plus de travail et de tests (non testable par Claude dans PixInsight).

## Ordre conseillé
B + D + 7 (rapides, peu risqués, réglages existants) → C (après un essai comparatif sur une photo SHO) → 9 (une fois le reste validé).

## Autres pistes déjà proposées (voir CLAUDE.md)
Inventaire automatique des 100 cibles, deux vitesses de traitement, traitement de nuit avec ImageContainer, tableau de suivi, AutoIntegrate comme premier jet.
