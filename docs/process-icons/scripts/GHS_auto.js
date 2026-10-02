// ----------------------------------------------------------------------------
// GHS_auto.js — 1er étirement GHS calculé automatiquement (mode rapide).
// ----------------------------------------------------------------------------
// Remplace le réglage à la main de GHS_1 (fiche, méthode GHS) sur une image
// sans étoiles LINÉAIRE (L dans C_L_rapide) :
//   - SP = médiane de l'image × spFactor (médiane = fond du ciel sur un
//     champ de galaxie ; spFactor 1 par défaut) ;
//   - Local intensity b = 10, LP = 0, HP = 1 (comme GHS_1) ;
//   - Stretch factor cherché par dichotomie pour que la médiane arrive sur
//     cible (0,25 par défaut, le pic visé après GHS_1).
// Puis GeneralizedHyperbolicStretch est appliqué avec ces valeurs, écrites
// dans la console. Les passes suivantes (GHS_2_contraste, GHS_3_fond)
// restent des icônes normales.
//
// Équations de la transformation : documentation de GHS (David Payne et Mike
// Cranfield), T(x) = 1 − (1 + b·D·x)^(−1/b), D = e^SF − 1.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    GHS_auto : clodoweg > GHS automatique (1er étirement)
#feature-info  Calcule SP et Stretch factor de GHS pour amener la médiane \
   de l'image sur une cible, puis applique GHS.

#define TITLE "GHS auto"

function param( key, value )
{
   return Parameters.has( key ) ? Parameters.getString( key ).trim() : value;
}

// T et sa dérivée (b > 0, b = 0 exponentiel)
function T( x, D, b )
{
   if ( b == 0 )
      return 1 - Math.exp( -D*x );
   return 1 - Math.pow( 1 + b*D*x, -1/b );
}

function dT( x, D, b )
{
   if ( b == 0 )
      return D*Math.exp( -D*x );
   return D*Math.pow( 1 + b*D*x, -(1 + b)/b );
}

// GHS normalisé sur [0, 1], avec LP et HP.
function ghs( x, sf, b, SP, LP, HP )
{
   let D = Math.exp( sf ) - 1;
   if ( D == 0 )
      return x;
   let T3 = function( x ) { return T( x - SP, D, b ); };
   let T2 = function( x ) { return -T( SP - x, D, b ); };
   let T1 = function( x ) { return dT( SP - LP, D, b )*(x - LP) + T2( LP ); };
   let T4 = function( x ) { return dT( HP - SP, D, b )*(x - HP) + T3( HP ); };
   let lo = T1( 0 ), hi = T4( 1 );
   let y = x < LP ? T1( x ) : x < SP ? T2( x ) : x < HP ? T3( x ) : T4( x );
   return (y - lo)/(hi - lo);
}

function main()
{
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   let target = parseFloat( param( "cible", "0.25" ) );
   let b = parseFloat( param( "b", "10" ) );
   let spFactor = parseFloat( param( "spFactor", "1" ) );

   let img = view.image;
   let med = 0;
   for ( let c = 0; c < img.numberOfChannels; ++c )
   {
      img.selectedChannel = c;
      med += img.median();
   }
   img.resetSelections();
   med /= img.numberOfChannels;

   if ( !(med > 0) || med >= target )
   {
      console.warningln( TITLE + " : médiane " + med.toFixed( 5 ) + " (déjà étirée ou vide), rien n'est fait." );
      return;
   }
   let SP = Math.min( med*spFactor, 0.99 );

   let lo = 0, hi = 20;
   if ( ghs( med, hi, b, SP, 0, 1 ) < target )
      console.warningln( TITLE + " : cible non atteinte même avec Stretch factor 20." );
   else
      for ( let i = 0; i < 60; ++i )
      {
         let m = (lo + hi)/2;
         if ( ghs( med, m, b, SP, 0, 1 ) < target )
            lo = m;
         else
            hi = m;
      }
   let sf = (lo + hi)/2;

   let G = new GeneralizedHyperbolicStretch;
   G.stretchType = GeneralizedHyperbolicStretch.prototype.ST_GeneralisedHyperbolic;
   G.stretchChannel = GeneralizedHyperbolicStretch.prototype.SC_RGB;
   G.inverse = false;
   G.stretchFactor = sf;
   G.localIntensity = b;
   G.symmetryPoint = SP;
   G.shadowProtection = 0;
   G.highlightProtection = 1;
   G.blackPoint = 0;
   G.whitePoint = 1;
   G.clipType = GeneralizedHyperbolicStretch.prototype.CT_RGBBlend;
   G.executeOn( view );

   console.noteln( TITLE + " : " + view.id + " médiane " + med.toFixed( 5 ) + " -> " + target +
                   " (SP " + SP.toFixed( 5 ) + ", b " + b + ", Stretch factor " + sf.toFixed( 2 ) + ")." );
}

main();
