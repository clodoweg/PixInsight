// ----------------------------------------------------------------------------
// Etoiles_NB_auto.js — étoiles RGB plausibles à partir des étoiles narrowband,
// en un clic (SHO sans RGB, HOO).
// ----------------------------------------------------------------------------
// Refait, sans fenêtre à remplir, ce que l'utilisateur faisait à la main
// (demande du 8 octobre 2026) :
//   1. linearfit = true : LinearFit (référence h, Reject low 0, Reject high
//      0,92) sur o et s : niveaux des étoiles égalisés sur H (sans cela les
//      étoiles sortent toutes bleues, O plus brillante) ;
//   2. mélange de NB to RGB Star Combination (SetiAstro, NBtoRGBStars.js
//      v1.6, code relu) : R = 0,5·H + 0,5·S (H seul sans S), G = ratio·H +
//      (1 − ratio)·O (ratio 0 = G = O), B = O ; nouvelle image « nom »
//      (NBtoRGB_stars), linéaire ;
//   3. étirement de Star Stretch, y = 3^a·x / ((3^a − 1)·x + 1), a = stretch
//      (5), puis Color Boost (ColorSaturation 0,4 × boost sur les rouges,
//      0,7 × boost sur les cyans, comme star_stretch.js), boost = 1 ;
//      scnr = true : SCNR vert (Average Neutral) ;
//   4. fermer = true : ferme h, o et s (images d'étoiles par canal, inutiles).
// Une image « nom » déjà ouverte est remplacée.
//
// Lancement : double-clic puis Apply Global (fenêtre de réglages), ou glisser
// l'icône / dans un conteneur : exécution directe avec les réglages de l'icône.
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Etoiles_NB_auto : clodoweg > Étoiles RGB depuis les étoiles narrowband
#feature-info  LinearFit des étoiles sur H, mélange NB to RGB, étirement \
   Star Stretch, en un clic.

#include "clodoweg_ui.jsh"

#define EN_TITLE "Etoiles NB auto"

function enParams()
{
   return { h: cwParam( "h", "H_stars" ), o: cwParam( "o", "O_stars" ), s: cwParam( "s", "S_stars" ),
            ratio: parseFloat( cwParam( "ratio", "0.3" ) ), linearfit: cwBool( "linearfit", true ),
            stretch: parseFloat( cwParam( "stretch", "5" ) ), boost: parseFloat( cwParam( "boost", "1.0" ) ),
            scnr: cwBool( "scnr", false ), nom: cwParam( "nom", "NBtoRGB_stars" ), fermer: cwBool( "fermer", true ) };
}

function enExport( p )
{
   Parameters.set( "h", p.h );
   Parameters.set( "o", p.o );
   Parameters.set( "s", p.s );
   Parameters.set( "ratio", p.ratio.toFixed( 2 ) );
   Parameters.set( "linearfit", p.linearfit ? "true" : "false" );
   Parameters.set( "stretch", p.stretch.toFixed( 1 ) );
   Parameters.set( "boost", p.boost.toFixed( 2 ) );
   Parameters.set( "scnr", p.scnr ? "true" : "false" );
   Parameters.set( "nom", p.nom );
   Parameters.set( "fermer", p.fermer ? "true" : "false" );
}

function enDialog( p )
{
   let d = new CWDialog( EN_TITLE, "<b>Étoiles narrowband -> RGB</b> : LinearFit des étoiles sur H, mélange de NB to RGB Star Combination " +
                         "(R = 0,5 H + 0,5 S, G = ratio H + (1 − ratio) O, B = O), étirement Star Stretch. Images d'étoiles LINÉAIRES.", "Étoiles S (vide = aucune) :" );
   d.viewList( "Étoiles H :", cwViewById( p.h ), "Étoiles H linéaires (H_stars), référence du LinearFit.", function( v ) { p.h = v.isNull ? "" : v.id; } );
   d.viewList( "Étoiles O :", cwViewById( p.o ), "Étoiles O linéaires (O_stars).", function( v ) { p.o = v.isNull ? "" : v.id; } );
   d.edit( "Étoiles S (vide = aucune) :", p.s, "Étoiles S linéaires (S_stars) ; vide en HOO.", function( t ) { p.s = t.trim(); } );
   d.check( "LinearFit sur H avant le mélange", p.linearfit, "Égalise O et S sur H (sinon étoiles toutes bleues).", function( c ) { p.linearfit = c; } );
   d.numeric( "Ratio H dans le vert :", 0, 1, 2, p.ratio, "G = ratio·H + (1 − ratio)·O ; 0,3 par défaut ; 0 = G = O.", function( v ) { p.ratio = v; } );
   d.numeric( "Étirement :", 0, 8, 1, p.stretch, "Stretch Factor de Star Stretch : 5 ; 0 = pas d'étirement.", function( v ) { p.stretch = v; } );
   d.numeric( "Color Boost :", 0, 2, 2, p.boost, "1,0 par défaut ; plus bas si les étoiles sont criardes.", function( v ) { p.boost = v; } );
   d.check( "SCNR vert", p.scnr, "Retire la teinte verte des étoiles.", function( c ) { p.scnr = c; } );
   d.edit( "Image créée :", p.nom, "NBtoRGB_stars : l'image d'étoiles d'Etoiles_screen.", function( t ) { p.nom = t.trim(); } );
   d.check( "Fermer les étoiles par canal", p.fermer, "Ferme H_stars, O_stars, S_stars après le mélange.", function( c ) { p.fermer = c; } );
   d.onExport = function() { enExport( p ); };
   d.validate = function()
   {
      if ( !p.h || ImageWindow.windowById( p.h ).isNull )
         return "Choisis les étoiles H.";
      if ( !p.o || ImageWindow.windowById( p.o ).isNull )
         return "Choisis les étoiles O.";
      if ( p.s && ImageWindow.windowById( p.s ).isNull )
         return "Vue " + p.s + " absente (vide = pas de S).";
      return p.nom ? "" : "Nom de l'image vide.";
   };
   d.finish();
   return d.execute();
}

function enLinearFit( ref, id )
{
   let w = ImageWindow.windowById( id );
   if ( w.isNull )
      return;
   let L = new LinearFit;
   L.referenceViewId = ref;
   L.rejectLow = 0.000000;
   L.rejectHigh = 0.920000;
   if ( !L.executeOn( w.mainView ) )
      throw new Error( EN_TITLE + " : LinearFit de " + id + " sur " + ref + " a échoué (voir la console)." );
}

function enRun( p )
{
   let hw = ImageWindow.windowById( p.h ), ow = ImageWindow.windowById( p.o );
   if ( hw.isNull || ow.isNull )
      throw new Error( EN_TITLE + " : vue " + (hw.isNull ? p.h : p.o) + " absente (étoiles linéaires extraites en phase 3)." );
   let avecS = p.s.length > 0 && !ImageWindow.windowById( p.s ).isNull;
   if ( p.s.length > 0 && !avecS )
      console.warningln( EN_TITLE + " : vue " + p.s + " absente, mélange sans S (R = H)." );
   if ( p.linearfit )
   {
      enLinearFit( p.h, p.o );
      if ( avecS )
         enLinearFit( p.h, p.s );
   }
   cwCloseWindow( p.nom );
   let r = p.ratio;
   let P = new PixelMath;
   P.expression = avecS ? "0.5*" + p.h + " + 0.5*" + p.s : p.h;
   P.expression1 = r + "*" + p.h + " + " + (1 - r) + "*" + p.o;
   P.expression2 = p.o;
   P.useSingleExpression = false;
   P.createNewImage = true;
   P.showNewImage = true;
   P.newImageId = p.nom;
   P.newImageColorSpace = PixelMath.prototype.RGB;
   P.newImageSampleFormat = PixelMath.prototype.f32;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( hw.mainView );
   let nw = ImageWindow.windowById( p.nom );
   if ( nw.isNull )
      throw new Error( EN_TITLE + " : image " + p.nom + " non créée (voir la console)." );
   let v = nw.mainView;
   if ( p.stretch > 0 )
   {
      let k = Math.pow( 3, p.stretch );
      let E = new PixelMath;
      E.expression = "(" + k + "*$T)/((" + k + " - 1)*$T + 1)";
      E.useSingleExpression = true;
      E.createNewImage = false;
      E.rescale = false;
      E.truncate = true;
      E.executeOn( v );
   }
   if ( p.boost > 0 )
   {
      let C = new ColorSaturation;
      C.HS = [ [ 0, p.boost*0.4 ], [ 0.5, p.boost*0.7 ], [ 1, p.boost*0.4 ] ];
      C.HSt = ColorSaturation.prototype.AkimaSubsplines;
      C.hueShift = 0;
      C.executeOn( v );
   }
   if ( p.scnr )
   {
      let S = new SCNR;
      S.amount = 1;
      S.protectionMethod = SCNR.prototype.AverageNeutral;
      S.colorToRemove = SCNR.prototype.Green;
      S.preserveLightness = true;
      S.executeOn( v );
   }
   if ( p.fermer )
   {
      cwCloseWindow( p.h );
      cwCloseWindow( p.o );
      if ( avecS )
         cwCloseWindow( p.s );
   }
   nw.bringToFront();
   console.noteln( EN_TITLE + " : " + p.nom + " créée (" + (avecS ? "H, O, S" : "H, O") + (p.linearfit ? ", LinearFit sur H" : "") +
                   ", ratio " + r + ", étirement " + p.stretch + ", Color Boost " + p.boost + (p.scnr ? ", SCNR" : "") + ")." );
}

function main()
{
   let p = enParams();
   if ( cwWantsDialog() )
   {
      if ( enDialog( p ) )
         cwRun( EN_TITLE, function() { enRun( p ); } );
      return;
   }
   enRun( p );
}

main();
