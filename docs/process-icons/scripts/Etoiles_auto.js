// ----------------------------------------------------------------------------
// Etoiles_auto.js — étire l'image d'étoiles sans dialogue (mode rapide).
// ----------------------------------------------------------------------------
// Travaille sur la vue « vue » (RGB_stars par défaut, l'image d'étoiles
// linéaire créée par StarXTerminator), quelle que soit l'image sur laquelle
// on glisse l'icône : elle peut donc être la dernière étape d'un conteneur
// lancé sur RGB (C_RGB_rapide, C_RGB_fin_rapide).
//   1. étirement y = 3^a·x / ((3^a − 1)·x + 1), a = amount (6 par défaut ;
//      0 = pas d'étirement, pour des étoiles déjà étirées : SXT passé sur
//      l'image étirée) ;
//      c'est la courbe de Star Stretch (SetiAstro, Franklin Marek), refaite
//      ici avec PixelMath ;
//   2. image couleur : ColorSaturation par teinte, satAmount × 0,4 sur les
//      rouges, × 0,7 sur les cyans (même répartition que le Color Boost de
//      Star Stretch ; courbe ColorSaturation : 0 = aucun changement, donc
//      satAmount = 0 laisse les couleurs telles quelles) ;
//   3. scnr = true : SCNR vert (Average Neutral, pleine force, luminosité
//      préservée), désactivé par défaut.
// Modifie la vue elle-même (pas de copie). Vue absente : message, rien d'autre.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Etoiles_auto : clodoweg > Étirement des étoiles sans dialogue
#feature-info  Étire l'image d'étoiles linéaire (RGB_stars) avec la courbe \
   de Star Stretch, sature les couleurs, sans dialogue.

#include "clodoweg_ui.jsh"

#define EA_TITLE "Etoiles auto"

function eaParams()
{
   return { vue: cwParam( "vue", "RGB_stars" ), amount: parseFloat( cwParam( "amount", "6" ) ),
            satAmount: parseFloat( cwParam( "satAmount", "1.3" ) ), scnr: cwBool( "scnr", false ) };
}

function eaExport( p )
{
   Parameters.set( "vue", p.vue );
   Parameters.set( "amount", p.amount.toFixed( 1 ) );
   Parameters.set( "satAmount", p.satAmount.toFixed( 2 ) );
   Parameters.set( "scnr", p.scnr ? "true" : "false" );
}

function eaDialog( p )
{
   let d = new CWDialog( EA_TITLE, "<b>Étoiles</b> : étirement (courbe de Star Stretch), saturation et SCNR de l'image d'étoiles (RGB_stars). " +
                         "Étoiles déjà étirées (SXT Unscreen sur image étirée) : Étirement = 0.", "Étirement (amount) :" );
   d.viewList( "Image d'étoiles :", cwViewById( p.vue ), "Image d'étoiles (RGB_stars).", function( v ) { p.vue = v.isNull ? "" : v.id; } );
   d.numeric( "Étirement (amount) :", 0, 10, 1, p.amount, "0 = pas d'étirement (étoiles déjà étirées) ; 6 = étoiles linéaires (Star Stretch).", function( v ) { p.amount = v; } );
   d.numeric( "Saturation :", 0, 2, 2, p.satAmount, "1,3 par défaut ; 1,0 si les étoiles sont criardes ; 0 = rien.", function( v ) { p.satAmount = v; } );
   d.check( "SCNR vert", p.scnr, "Retire la teinte verte des étoiles.", function( c ) { p.scnr = c; } );
   d.onExport = function() { eaExport( p ); };
   d.validate = function() { return p.vue ? "" : "Choisis l'image d'étoiles."; };
   d.finish();
   return d.execute();
}

function etoilesAutoMain()
{
   let p = eaParams();
   if ( cwWantsDialog() )
   {
      if ( !eaDialog( p ) )
         return;
      let w = ImageWindow.windowById( p.vue );
      if ( w.isNull )
         return;
      cwRun( EA_TITLE, function() { cwApplyOnCopy( w.mainView, function( c ) { eaProcess( c, p.vue, p.amount, p.satAmount, p.scnr ); } ); } );
      return;
   }
   etoilesAuto( p.vue, p.amount, p.satAmount, p.scnr );
}

function etoilesAuto( id, amount, sat, scnr )
{
   let w = ImageWindow.windowById( id );
   if ( w.isNull )
   {
      console.warningln( EA_TITLE + " : vue " + id + " introuvable, rien n'est fait." );
      return;
   }
   eaProcess( w.mainView, id, amount, sat, scnr );
}

function eaProcess( view, id, amount, sat, scnr )
{

   if ( amount > 0 )
   {
      let k = Math.pow( 3, amount );
      let P = new PixelMath;
      P.expression = "(" + k + "*$T)/((" + k + " - 1)*$T + 1)";
      P.useSingleExpression = true;
      P.createNewImage = false;
      P.rescale = false;
      P.truncate = true;
      P.executeOn( view );
   }

   if ( view.image.isColor )
   {
      if ( sat > 0 )
      {
         let C = new ColorSaturation;
         C.HS = [ [ 0, sat*0.4 ], [ 0.5, sat*0.7 ], [ 1, sat*0.4 ] ];
         C.HSt = ColorSaturation.prototype.AkimaSubsplines;
         C.hueShift = 0;
         C.executeOn( view );
      }
      if ( scnr )
      {
         let S = new SCNR;
         S.amount = 1;
         S.protectionMethod = SCNR.prototype.AverageNeutral;
         S.colorToRemove = SCNR.prototype.Green;
         S.preserveLightness = true;
         S.executeOn( view );
      }
   }
   console.noteln( EA_TITLE + " : " + id + " étirée (amount " + amount + ", saturation " + sat + (scnr ? ", SCNR" : "") + ")." );
}

etoilesAutoMain();
