// ----------------------------------------------------------------------------
// Etoiles_LRGB.js — ajoute la luminance des étoiles de L aux étoiles RGB.
// ----------------------------------------------------------------------------
// Dernière étape de C_L_rapide dans les variantes « etoilesL » du mode rapide.
// Il faut :
//   - L_stars (étoiles de L : linéaires si SXT a tourné sur L linéaire,
//     déjà étirées si SXT a tourné après l'étirement ; etirerL = false) ;
//   - RGB_stars (étoiles RGB déjà étirées par Etoiles_auto dans le conteneur
//     RGB).
// Étapes :
//   1. si etirerL = true : L_stars est étirée avec la même courbe
//      qu'Etoiles_auto : y = 3^a·x / ((3^a − 1)·x + 1), a = amount (6) ;
//   2. luminance mélangée : partL × L_stars + (1 − partL) × luminance de
//      RGB_stars (Rec. 709), partL = 0,5 : L apporte les étoiles faibles et la
//      finesse, la moitié RGB limite le blanchiment des cœurs ;
//   3. LRGBCombination applique cette luminance à RGB_stars (saturation mc
//      0,35 comme LRGB_ajout_L, sans réduction de bruit) ;
//   4. L_stars et la vue temporaire sont fermées.
// Vérifie ensuite à 1:1 : anneau blanc ou coloré autour des étoiles = tailles
// différentes entre L et RGB -> partL 0,3 ou n'utilise pas cette option.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Etoiles_LRGB : clodoweg > Étoiles avec la luminance de L
#feature-info  Étire L_stars comme Etoiles_auto et l'applique en luminance \
   (mélangée) aux étoiles RGB_stars.

#define TITLE "Etoiles LRGB"

function param( key, value )
{
   return Parameters.has( key ) ? Parameters.getString( key ).trim() : value;
}

function main()
{
   let lId = param( "etoilesL", "L_stars" );
   let rgbId = param( "etoilesRGB", "RGB_stars" );
   let amount = parseFloat( param( "amount", "6" ) );
   let partL = parseFloat( param( "partL", "0.5" ) );
   let mc = parseFloat( param( "saturation", "0.35" ) );
   let etirerL = param( "etirerL", "true" ).toLowerCase() == "true";

   let lw = ImageWindow.windowById( lId );
   let rw = ImageWindow.windowById( rgbId );
   if ( lw.isNull || rw.isNull )
      throw new Error( TITLE + " : il faut les vues " + lId + " (laissée ouverte par C_L_rapide) et " + rgbId + "." );
   if ( !rw.mainView.image.isColor )
      throw new Error( TITLE + " : " + rgbId + " doit être en couleur." );
   if ( lw.mainView.image.width != rw.mainView.image.width || lw.mainView.image.height != rw.mainView.image.height )
      throw new Error( TITLE + " : " + lId + " et " + rgbId + " n'ont pas la même taille (images non alignées ?)." );

   // 1. étirement de L_stars, même courbe qu'Etoiles_auto (sauf si déjà étirée)
   if ( etirerL )
   {
      let k = Math.pow( 3, amount );
      let P = new PixelMath;
      P.expression = "(" + k + "*$T)/((" + k + " - 1)*$T + 1)";
      P.useSingleExpression = true;
      P.createNewImage = false;
      P.rescale = false;
      P.truncate = true;
      P.executeOn( lw.mainView );
   }

   // 2. luminance mélangée
   let mixId = "etoiles_Lmix";
   let old = ImageWindow.windowById( mixId );
   if ( !old.isNull )
      old.forceClose();
   let M = new PixelMath;
   M.expression = partL + "*" + lId + " + " + (1 - partL) + "*(0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2])";
   M.useSingleExpression = true;
   M.createNewImage = true;
   M.showNewImage = true;
   M.newImageId = mixId;
   M.newImageColorSpace = PixelMath.prototype.Gray;
   M.newImageSampleFormat = PixelMath.prototype.f32;
   M.rescale = false;
   M.truncate = true;
   M.executeOn( rw.mainView );
   let mix = ImageWindow.windowById( mixId );
   if ( mix.isNull )
      throw new Error( TITLE + " : luminance mélangée non créée." );

   // contrôle : écart moyen entre la luminance actuelle de RGB_stars et la luminance mélangée
   let dId = "etoiles_ecart";
   let D = new PixelMath;
   D.expression = "abs(" + mixId + " - (0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2]))";
   D.useSingleExpression = true;
   D.createNewImage = true;
   D.showNewImage = false;
   D.newImageId = dId;
   D.newImageColorSpace = PixelMath.prototype.Gray;
   D.newImageSampleFormat = PixelMath.prototype.f32;
   D.rescale = false;
   D.truncate = true;
   D.executeOn( rw.mainView );
   let dw = ImageWindow.windowById( dId );
   let ecart = dw.isNull ? -1 : dw.mainView.image.mean();
   let ecartMax = dw.isNull ? -1 : dw.mainView.image.maximum();
   if ( !dw.isNull )
      dw.forceClose();
   let avant = rw.mainView.image.mean();

   // 3. LRGBCombination : luminance seule sur RGB_stars
   let C = new LRGBCombination;
   C.channels = [ [ false, "", 1 ], [ false, "", 1 ], [ false, "", 1 ], [ true, mixId, 1 ] ];
   C.mL = 0.5;
   C.mc = mc;
   C.clipHighlights = false;
   C.noiseReduction = false;
   let ok = C.executeOn( rw.mainView );
   let apres = rw.mainView.image.mean();

   // 4. fermetures
   mix.forceClose();
   lw.forceClose();
   console.noteln( TITLE + " : " + rgbId + " reçoit la luminance " + partL + " × " + lId + (etirerL ? " (étirée, amount " + amount + ")" : " (déjà étirée)") + " + " +
                   (1 - partL) + " × luminance RGB ; " + lId + " fermée." );
   console.noteln( TITLE + " : LRGBCombination " + (ok ? "appliquée" : "NON appliquée") + " ; écart de luminance L / RGB avant combinaison : moyen " +
                   ecart.toFixed( 5 ) + ", max " + ecartMax.toFixed( 3 ) + " ; moyenne de " + rgbId + " " + avant.toFixed( 5 ) + " -> " + apres.toFixed( 5 ) + "." );
   if ( ecart >= 0 && ecart < 0.002 )
      console.warningln( TITLE + " : L_stars et les étoiles RGB ont presque la même luminance : l'effet est à peine visible (partL plus haut pour l'accentuer)." );
}

main();
