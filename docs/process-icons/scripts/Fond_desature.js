// ----------------------------------------------------------------------------
// Fond_desature.js — retire la couleur du fond du ciel et la teinte violette
// des zones faibles (halo de la galaxie), sans toucher aux étoiles ni aux
// parties brillantes de la galaxie.
// ----------------------------------------------------------------------------
// Sur l'image finie (étoiles comprises) :
//   1. fond mesuré sur la luminance (grille 8 × 8, quart le plus sombre des
//      cases, comme Fond_auto) ;
//   2. anti-violet dans les zones faibles : là où la luminance lissée est
//      sous fond + fin (0,15), le vert remonte jusqu'au plus petit du rouge et
//      du bleu s'il est plus bas que les deux (G = max(G, min(R, B)) : seul le
//      violet/magenta, où R et B dépassent G, est touché ; un bleu (R < G) ou
//      un rouge/orange (B < G) ne change pas) ;
//      effet décroissant jusqu'à fond + violetFin (0,30), nul au-delà (cœur,
//      régions roses brillantes, étoiles) ;
//   3. désaturation du fond : poids w tiré de la luminance lissée (flou px) :
//      w = 0 jusqu'à fond + debut (0,03), 1 à partir de fond + fin (0,15) ;
//      chaque canal devient Y + ($T − Y) × w (Y = luminance du pixel) : au
//      fond, gris neutre de même luminosité.
//      force (1 par défaut) : désaturation maximale (0,7 = 30 % de couleur
//      gardée) ; lisse = true : rampe en S. Narrowband : debut 0,02, fin 0,20,
//      flou 12, force 0,70, lisse (10 novembre 2026, transitions trop franches).
//      portee (px, 0 par défaut) : dégradé spatial, effet entier loin de la
//      nébuleuse, de plus en plus faible en s'en approchant (luminance lissée
//      sur portee px) ; narrowband : 60 (11 novembre 2026).
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Fond_desature : clodoweg > Fond du ciel désaturé
#feature-info  Retire la couleur du fond du ciel (violet, bruit de couleur) \
   sans toucher à la galaxie ni aux étoiles.

#include "clodoweg_ui.jsh"

#define TITLE "Fond desature"

function fdParams()
{
   return { debut: parseFloat( cwParam( "debut", "0.03" ) ), fin: parseFloat( cwParam( "fin", "0.15" ) ),
            violetFin: parseFloat( cwParam( "violetFin", "0.30" ) ), flou: parseFloat( cwParam( "flou", "3" ) ),
            force: parseFloat( cwParam( "force", "1.00" ) ), lisse: cwBool( "lisse", false ),
            portee: parseFloat( cwParam( "portee", "0" ) ) };
}

function fdExport( p )
{
   Parameters.set( "debut", p.debut.toFixed( 2 ) );
   Parameters.set( "fin", p.fin.toFixed( 2 ) );
   Parameters.set( "violetFin", p.violetFin.toFixed( 2 ) );
   Parameters.set( "flou", p.flou.toFixed( 1 ) );
   Parameters.set( "force", p.force.toFixed( 2 ) );
   Parameters.set( "lisse", p.lisse ? "true" : "false" );
   Parameters.set( "portee", p.portee.toFixed( 0 ) );
}

// Traite view (couleur) ; name : nom affiché dans la console.
function fdProcess( view, p, name )
{
   let debut = p.debut, fin = p.fin, violetFin = p.violetFin, flou = p.flou;
   let Y = "(0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2])";

   // luminance lissée (vue temporaire)
   let id = "fond_lum";
   let old = ImageWindow.windowById( id );
   if ( !old.isNull )
      old.forceClose();
   let P = new PixelMath;
   P.expression = Y;
   P.useSingleExpression = true;
   P.createNewImage = true;
   P.showNewImage = false;
   P.newImageId = id;
   P.newImageColorSpace = PixelMath.prototype.Gray;
   P.newImageSampleFormat = PixelMath.prototype.f32;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( view );
   let lw = ImageWindow.windowById( id );
   if ( lw.isNull )
      throw new Error( TITLE + " : luminance non créée." );

   // fond : quart le plus sombre des médianes de cases
   let img = lw.mainView.image, n = 8, meds = [];
   for ( let j = 0; j < n; ++j )
      for ( let i = 0; i < n; ++i )
      {
         img.selectedRect = new Rect( Math.floor( i*img.width/n ), Math.floor( j*img.height/n ), Math.floor( (i + 1)*img.width/n ), Math.floor( (j + 1)*img.height/n ) );
         meds.push( img.median() );
      }
   img.resetSelections();
   meds.sort( function( a, b ) { return a - b; } );
   let q = meds.slice( 0, Math.max( 1, Math.floor( meds.length/4 ) ) );
   let bg = q[ Math.floor( q.length/2 ) ];

   if ( flou > 0 )
   {
      let C = new Convolution;
      C.mode = Convolution.prototype.Parametric;
      C.sigma = flou;
      C.shape = 2;
      C.aspectRatio = 1;
      C.rotationAngle = 0;
      C.executeOn( lw.mainView );
   }

   // dégradé autour de la nébuleuse (portee > 0 ; narrowband, demande de l'utilisateur, 11 novembre 2026 : « plus fort sur le fond et
   // de moins en moins fort quand le fond se rapproche de la nébuleuse ») : luminance lissée sur « portee » px (fond_prox) : près de
   // la nébuleuse elle remonte, l'effet baisse ; loin, l'effet est entier. Effet × (1 − wp), wp = rampe en S de fond_prox.
   let lo = bg + debut, hi = bg + fin;
   let prox = "";
   let pw = null;
   if ( p.portee > 0 )
   {
      let pid = "fond_prox";
      cwCloseWindow( pid );
      let Q = new PixelMath;
      Q.expression = Y;
      Q.useSingleExpression = true;
      Q.createNewImage = true;
      Q.showNewImage = false;
      Q.newImageId = pid;
      Q.newImageColorSpace = PixelMath.prototype.Gray;
      Q.newImageSampleFormat = PixelMath.prototype.f32;
      Q.rescale = false;
      Q.truncate = true;
      Q.executeOn( view );
      pw = ImageWindow.windowById( pid );
      if ( pw.isNull )
         throw new Error( TITLE + " : luminance lissée (portée) non créée." );
      let G = new Convolution;
      G.mode = Convolution.prototype.Parametric;
      G.sigma = p.portee;
      G.shape = 2;
      G.aspectRatio = 1;
      G.rotationAngle = 0;
      G.executeOn( pw.mainView );
      let wp = "min(1, max(0, (" + pid + " - " + lo.toFixed( 6 ) + ")/" + (hi - lo).toFixed( 6 ) + "))";
      prox = "*(1 - (" + wp + ")^2*(3 - 2*" + wp + "))";
   }

   // anti-violet : G remonté vers min(R, B) dans les zones faibles (magenta seulement)
   let v0 = bg + fin, v1 = bg + violetFin;
   let m = "(1 - min(1, max(0, (" + id + " - " + v0.toFixed( 6 ) + ")/" + (v1 - v0).toFixed( 6 ) + ")))" + prox;
   let V = new PixelMath;
   V.expression = "$T";
   V.expression1 = "$T + (max($T, min($T[0], $T[2])) - $T)*" + m;
   V.expression2 = "$T";
   V.useSingleExpression = false;
   V.createNewImage = false;
   V.rescale = false;
   V.truncate = true;
   V.executeOn( view );

   let w = "min(1, max(0, (" + id + " - " + lo.toFixed( 6 ) + ")/" + (hi - lo).toFixed( 6 ) + "))";
   // lisse : rampe en S (3w² − 2w³) au lieu d'une droite ; force < 1 : couleur du fond gardée en partie
   // (couleur gardée = 1 − force·(1 − w)) ; narrowband (retour de l'utilisateur, 10 novembre 2026 : « trop brut avec des
   // demarquations trop franches ») ; galaxies : force 1, rampe droite (inchangé)
   if ( p.lisse )
      w = "(" + w + ")^2*(3 - 2*" + w + ")";
   let garde = (p.force >= 1 && prox == "") ? w : "(1 - " + p.force.toFixed( 3 ) + "*(1 - " + w + ")" + prox + ")";
   let D = new PixelMath;
   D.expression = Y + " + ($T - " + Y + ")*" + garde;
   D.useSingleExpression = true;
   D.createNewImage = false;
   D.rescale = false;
   D.truncate = true;
   D.executeOn( view );

   lw.forceClose();
   if ( pw != null )
      pw.forceClose();
   console.noteln( TITLE + " : " + name + " fond " + bg.toFixed( 4 ) + (p.portee > 0 ? " ; dégradé autour de la nébuleuse sur " + p.portee + " px" : "") + " ; couleur retirée sous " + lo.toFixed( 3 ) +
                   ", violet neutralisé jusqu'à " + v1.toFixed( 3 ) + "." );
}


function fdDialog( p, view )
{
   let d = new CWDialog( TITLE, "<b>Fond du ciel désaturé</b> : retire la couleur du fond (violet, bruit de couleur) sans toucher " +
                         "à la galaxie ni aux étoiles. Sur l'image sans étoiles, après SCNR_vert, avant Fond_auto et Etoiles_screen.", "Fin du violet :" );
   let sel = { view: view };
   d.viewList( "Image :", view, "Image couleur sans étoiles (avant Etoiles_screen).", function( v ) { sel.view = v; } );
   d.group( "Couleur du fond (au-dessus du fond mesuré)" );
   d.numeric( "Début :", 0.00, 0.10, 2, p.debut, "Sous fond + début : couleur retirée entièrement.", function( v ) { p.debut = v; } );
   d.numeric( "Fin :", 0.05, 0.40, 2, p.fin, "Au-dessus de fond + fin : couleur gardée (rampe entre les deux).", function( v ) { p.fin = v; } );
   d.endGroup();
   d.group( "Violet des zones faibles" );
   d.numeric( "Fin du violet :", 0.10, 0.60, 2, p.violetFin, "Violet (magenta) neutralisé jusqu'à fond + cette valeur.", function( v ) { p.violetFin = v; } );
   d.endGroup();
   d.numeric( "Flou (px) :", 0, 30, 1, p.flou, "Lissage de la luminance qui sert de masque (narrowband : 12 px, transitions douces).", function( v ) { p.flou = v; } );
   d.numeric( "Force :", 0.10, 1.00, 2, p.force, "1 = fond entièrement gris ; 0,7 = 30 % de la couleur du fond gardée (narrowband).", function( v ) { p.force = v; } );
   d.numeric( "Dégradé (px) :", 0, 200, 0, p.portee, "0 = aucun. Sinon l'effet baisse en s'approchant de la nébuleuse, sur environ cette distance (narrowband : 60).", function( v ) { p.portee = v; } );
   d.check( "Transition en S (plus douce)", p.lisse, "Rampe en S entre Début et Fin au lieu d'une droite : pas de démarcation franche.", function( c ) { p.lisse = c; } );
   d.onExport = function() { fdExport( p ); };
   d.validate = function()
   {
      if ( sel.view == null || sel.view.isNull ) return "Choisis l'image.";
      if ( !sel.view.image.isColor ) return "L'image doit être en couleur.";
      if ( p.fin <= p.debut ) return "Fin doit être plus grand que Début.";
      return "";
   };
   d.finish();
   return d.execute() ? sel.view : null;
}

function main()
{
   let p = fdParams();
   if ( cwWantsDialog() )
   {
      let view = fdDialog( p, cwDefaultView() );
      if ( view != null )
         cwRun( TITLE, function() { cwApplyOnCopy( view, function( c ) { fdProcess( c, p, view.id ); } ); } );
      return;
   }
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   if ( !view.image.isColor )
   {
      console.warningln( TITLE + " : " + view.id + " n'est pas en couleur, rien n'est fait." );
      return;
   }
   // glissé (seul ou dans un conteneur) : deux PixelMath en place sur la vue glissée donnaient
   // « Unknown error » au second ; traitement sur une copie cachée puis recopie (cwApplyOnCopy)
   cwApplyOnCopy( view, function( c ) { fdProcess( c, p, view.id ); } );
}

main();
