// ----------------------------------------------------------------------------
// Look_Lightroom.js — retouche finale façon Camera Raw (Photoshop) /
// Lightroom : panneaux Lumière et Couleur, réglages de l'utilisateur par défaut
// (capture du 9 octobre 2026 : Exposition +0,25, Contraste 0, Tons clairs
// -100, Tons foncés 0, Blancs +50, Noirs 0, Température +10, Teinte 0).
// ----------------------------------------------------------------------------
// Les formules d'Adobe ne sont pas publiées : équivalents APPROCHÉS (valeurs
// choisies au jugé), curseurs de -100 à +100, Exposition en IL. Ordre :
//   1. température t : R × (1 + 0,003·t), B × (1 − 0,003·t) ; teinte n :
//      G × (1 − 0,0015·n) (+ = magenta) ;
//   2. exposition e : gain 2^e en lumière linéaire (gamma 2,2) avec épaule
//      douce, y = (l·k / (1 + (k − 1)·l))^(1/2,2), l = x^2,2, k = 2^e : 1 reste 1 ;
//   3. une courbe de luminosité (CIE L*, Akima), 0, 0,5 et 1 fixes :
//      noirs (0,03 et 0,10), tons foncés (0,10 et 0,25), contraste (S autour
//      de 0,5), tons clairs (0,75 et 0,90), blancs (0,90 et 0,97) ;
//   4. masque = false (défaut : toute l'image) ; masque = true : mélange par
//      un masque de luminance tiré de l'image (fond coupé sous s, flou).
// Calcul sur une copie cachée puis recopie (cwApplyOnCopy) : Ctrl+Z.
// Dans un conteneur glissé (image verrouillée), traitement direct, sans masque.
//
// Place : sur l'image SANS étoiles finie, juste avant la recombinaison des
// étoiles (choix de l'utilisateur, 9 octobre 2026).
// Lancement : glisser l'icône sur l'image = réglages de l'icône ;
// double-clic puis Apply Global = fenêtre de réglages.
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Look_Lightroom : clodoweg > Retouche façon Camera Raw (Exposition, Tons clairs, Blancs, Température…)
#feature-info  Retouche finale façon Camera Raw / Lightroom (Exposition, \
   Contraste, Tons clairs, Tons foncés, Blancs, Noirs, Température, Teinte).

#include "clodoweg_ui.jsh"

#define LR_TITLE "Look Lightroom"

// curseurs du panneau Camera Raw (Photoshop) : clé, libellé, défaut, aide (réglages de l'utilisateur, 9 octobre 2026)
var LR_CURSEURS = [
   [ "exposition", "Exposition (IL) :", 0.25, "+0,25 par défaut : image plus claire (comme +0,25 IL, hautes lumières adoucies)." ],
   [ "contraste", "Contraste :", 0, "0 par défaut : courbe en S (+) ou plus plate (-)." ],
   [ "hautes", "Tons clairs :", -100, "-100 par défaut : zones claires assombries (détail récupéré)." ],
   [ "foncees", "Tons foncés :", 0, "0 par défaut : + éclaircit les zones sombres, - les assombrit." ],
   [ "blancs", "Blancs :", 50, "+50 par défaut : tons les plus clairs remontés vers 1." ],
   [ "noirs", "Noirs :", 0, "0 par défaut : - assombrit le bas (fond), + l'éclaircit." ],
   [ "temperature", "Température :", 10, "+10 par défaut : plus chaud (R plus haut, B plus bas)." ],
   [ "teinte", "Teinte :", 0, "0 par défaut : + vers le magenta (G plus bas), - vers le vert." ] ];

function lrParams()
{
   let p = { masque: cwBool( "masque", false ), s: parseFloat( cwParam( "s", "0.14" ) ), flou: parseFloat( cwParam( "flou", "2" ) ) };
   for ( let i = 0; i < LR_CURSEURS.length; ++i )
      p[ LR_CURSEURS[ i ][ 0 ] ] = parseFloat( cwParam( LR_CURSEURS[ i ][ 0 ], String( LR_CURSEURS[ i ][ 2 ] ) ) );
   return p;
}

function lrExport( p )
{
   for ( let i = 0; i < LR_CURSEURS.length; ++i )
   {
      let k = LR_CURSEURS[ i ][ 0 ];
      Parameters.set( k, k == "exposition" ? p[ k ].toFixed( 2 ) : p[ k ].toFixed( 0 ) );
   }
   Parameters.set( "masque", p.masque ? "true" : "false" );
   Parameters.set( "s", p.s.toFixed( 2 ) );
   Parameters.set( "flou", p.flou.toFixed( 1 ) );
}

function lrDialog( p, view )
{
   let d = new CWDialog( LR_TITLE, "<b>Retouche finale façon Camera Raw / Lightroom</b> (équivalents approchés ; Exposition en IL, le reste de -100 à +100). " +
                         "Toute l'image par défaut ; masque de luminance en option (zones claires seulement, fond neutre).", "Seuil du masque (s) :" );
   let sel = { view: view };
   d.viewList( "Image :", view, "L'image sans étoiles finie, avant Etoiles_screen.", function( v ) { sel.view = v; } );
   d.group( "Réglages" );
   LR_CURSEURS.forEach( function( c )
   {
      let k = c[ 0 ];
      if ( k == "exposition" )
         d.numeric( c[ 1 ], -2, 2, 2, p[ k ], c[ 3 ], function( v ) { p[ k ] = v; } );
      else
         d.numeric( c[ 1 ], -100, 100, 0, p[ k ], c[ 3 ], function( v ) { p[ k ] = v; } );
   } );
   d.endGroup();
   d.group( "Masque de luminance" );
   d.check( "Appliquer sous masque de luminance", p.masque, "Décoché par défaut : toute l'image. Coché : seules les zones claires, le fond du ciel n'est pas touché.", function( c ) { p.masque = c; } );
   d.numeric( "Seuil du masque (s) :", 0, 0.5, 2, p.s, "Tout ce qui est sous s est protégé : fond mesuré + 0,01.", function( v ) { p.s = v; } );
   d.numeric( "Flou du masque (px) :", 0, 10, 1, p.flou, "Lissage du masque.", function( v ) { p.flou = v; } );
   d.endGroup();
   d.onExport = function() { lrExport( p ); };
   d.validate = function() { return (sel.view == null || sel.view.isNull) ? "Choisis l'image." : ""; };
   d.finish();
   return d.execute() ? sel.view : null;
}

// points de la courbe de luminosité (valeurs choisies au jugé), croissants, 0 et 1 fixes
function lrCourbe( p )
{
   let c = p.contraste/100, h = p.hautes/100, f = p.foncees/100, b = p.blancs/100, n = p.noirs/100;
   let pts = [ [ 0, 0 ],
               [ 0.03, 0.03 + 0.02*n ],
               [ 0.10, 0.10 + 0.01*n + 0.04*f - 0.01*c ],
               [ 0.25, 0.25 + 0.08*f - 0.04*c ],
               [ 0.5, 0.5 ],
               [ 0.75, 0.75 + 0.08*h + 0.04*c ],
               [ 0.90, 0.90 + 0.05*h + 0.05*b + 0.01*c ],
               [ 0.97, 0.97 + 0.025*b ],
               [ 1, 1 ] ];
   for ( let i = 1; i < pts.length - 1; ++i )
      pts[ i ][ 1 ] = Math.min( Math.max( pts[ i ][ 1 ], pts[ i - 1 ][ 1 ] + 0.001 ), 0.99 + 0.001*i );
   return pts;
}

function lrProcess( view, p )
{
   // 1. balance des blancs
   if ( view.image.isColor && (p.temperature != 0 || p.teinte != 0) )
   {
      let kr = 1 + 0.003*p.temperature, kb = 1 - 0.003*p.temperature, kg = 1 - 0.0015*p.teinte;
      let P = new PixelMath;
      P.expression = "$T*" + kr.toFixed( 4 );
      P.expression1 = "$T*" + kg.toFixed( 4 );
      P.expression2 = "$T*" + kb.toFixed( 4 );
      P.useSingleExpression = false;
      P.createNewImage = false;
      P.rescale = false;
      P.truncate = true;
      P.executeOn( view );
   }
   // 2. exposition : gain 2^IL en lumière linéaire (gamma 2,2), avec épaule douce (1 reste 1)
   if ( p.exposition != 0 )
   {
      let k = Math.pow( 2, p.exposition );
      let E = new PixelMath;
      E.expression = "l = $T^2.2;\n(l*" + k.toFixed( 5 ) + "/(1 + " + (k - 1).toFixed( 5 ) + "*l))^(1/2.2)";
      E.symbols = "l";
      E.useSingleExpression = true;
      E.createNewImage = false;
      E.rescale = false;
      E.truncate = true;
      E.executeOn( view );
   }
   // 3. contraste, tons clairs, tons foncés, blancs, noirs : une courbe de luminosité
   if ( p.contraste != 0 || p.hautes != 0 || p.foncees != 0 || p.blancs != 0 || p.noirs != 0 )
   {
      let C = new CurvesTransformation;
      C.L = lrCourbe( p );
      C.Lt = CurvesTransformation.prototype.AkimaSubsplines;
      C.executeOn( view );
   }
}

// masque de luminance caché lr_masque (gris), tiré de view
function lrMasque( view, p )
{
   let id = "lr_masque";
   cwCloseWindow( id );
   let lum = view.image.isColor ? "(0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2])" : "$T";
   let P = new PixelMath;
   P.expression = "max(0, (" + lum + " - " + p.s + ") / (1 - " + p.s + "))";
   P.useSingleExpression = true;
   P.createNewImage = true;
   P.showNewImage = false;
   P.newImageId = id;
   P.newImageColorSpace = PixelMath.prototype.Gray;
   P.newImageSampleFormat = PixelMath.prototype.f32;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( view );
   let w = ImageWindow.windowById( id );
   if ( w.isNull )
      throw new Error( LR_TITLE + " : masque non créé (voir la console)." );
   if ( p.flou > 0 )
   {
      let C = new Convolution;
      C.mode = Convolution.prototype.Parametric;
      C.sigma = p.flou;
      C.shape = 2;
      C.aspectRatio = 1;
      C.rotationAngle = 0;
      C.executeOn( w.mainView );
   }
   return id;
}

function lrRun( view, p )
{
   let mid = null;
   try
   {
      if ( p.masque && !cwTargetLocked( view ) )
         mid = lrMasque( view, p );
      cwApplyOnCopy( view, function( c ) { lrProcess( c, p ); },
                     mid ? function( cid ) { return mid + "*" + cid + " + (1-" + mid + ")*$T"; } : null );
   }
   finally
   {
      if ( mid )
         cwCloseWindow( mid );
   }
   console.noteln( LR_TITLE + " : " + view.id + " (" + LR_CURSEURS.map( function( c ) { return c[ 0 ] + " " + p[ c[ 0 ] ]; } ).join( ", " ) +
                   (mid ? ", sous masque de luminance s = " + p.s : ", toute l'image") + ")." );
}

function main()
{
   let p = lrParams();
   if ( cwWantsDialog() )
   {
      let v = lrDialog( p, cwDefaultView() );
      if ( v != null )
         cwRun( LR_TITLE, function() { lrRun( v, p ); } );
      return;
   }
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( LR_TITLE + " : aucune image." );
   lrRun( view, p );
}

main();
