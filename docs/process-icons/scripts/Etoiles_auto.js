// ----------------------------------------------------------------------------
// Etoiles_auto.js — étire l'image d'étoiles sans dialogue (mode rapide).
// ----------------------------------------------------------------------------
// Travaille sur la vue « vue » (RGB_stars par défaut, l'image d'étoiles
// linéaire créée par StarXTerminator), quelle que soit l'image sur laquelle
// on glisse l'icône : elle peut donc être la dernière étape d'un conteneur
// lancé sur RGB (C_RGB_rapide, C_RGB_fin_rapide).
//   1. étirement y = 3^a·x / ((3^a − 1)·x + 1), a = amount (6 par défaut) ;
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

#define TITLE "Etoiles auto"

function param( key, value )
{
   return Parameters.has( key ) ? Parameters.getString( key ).trim() : value;
}

function main()
{
   let id = param( "vue", "RGB_stars" );
   let amount = parseFloat( param( "amount", "6" ) );
   let sat = parseFloat( param( "satAmount", "1.3" ) );
   let scnr = param( "scnr", "false" ).toLowerCase() == "true";

   let w = ImageWindow.windowById( id );
   if ( w.isNull )
   {
      console.warningln( TITLE + " : vue " + id + " introuvable, rien n'est fait." );
      return;
   }
   let view = w.mainView;

   let k = Math.pow( 3, amount );
   let P = new PixelMath;
   P.expression = "(" + k + "*$T)/((" + k + " - 1)*$T + 1)";
   P.useSingleExpression = true;
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( view );

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
   console.noteln( TITLE + " : " + id + " étirée (amount " + amount + ", saturation " + sat + (scnr ? ", SCNR" : "") + ")." );
}

main();
