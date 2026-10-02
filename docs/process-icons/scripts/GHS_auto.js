// ----------------------------------------------------------------------------
// GHS_auto.js — 1er étirement GHS calculé automatiquement (mode rapide).
// ----------------------------------------------------------------------------
// 1er étirement GHS sans réglage, sur une image sans étoiles LINÉAIRE
// (L dans l'option C_L_rapide_ghs du mode rapide) :
//   - SP = médiane de l'image × spFactor (médiane = fond du ciel sur un
//     champ de galaxie ; spFactor 0,5 : SP sous le fond, la pente maximale
//     ne tombe pas juste au-dessus du fond, où sont les restes de halos et
//     les taches) ;
//   - Local intensity b = 6 (étirement moins concentré qu'avec 10), LP = 0,
//     HP = hp (0,85 : cœur de galaxie protégé) ;
//   - Stretch factor cherché par dichotomie pour que la médiane arrive sur
//     cible (0,25 par défaut, le pic visé après GHS_1) (mode = premier).
// mode = fond : remplace GHS_3_fond sur une image déjà étirée : SP = HP =
//   médiane × 0,87 (comme SP = HP = 0,20 pour un fond à 0,23), b = 10, et
//   Stretch factor cherché pour que la médiane (le fond) arrive sur cible
//   (0,11 par défaut pour L). Le fond final ne dépend donc plus des passes
//   précédentes.
// GeneralizedHyperbolicStretch est appliqué avec ces valeurs ; la console
// donne les valeurs et la médiane MESURÉE après coup.
//
// Équations de la transformation : documentation de GHS (David Payne et Mike
// Cranfield), T(x) = 1 − (1 + b·D·x)^(−1/b), D = e^SF − 1.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    GHS_auto : clodoweg > GHS automatique (1er étirement)
#feature-info  Calcule SP et Stretch factor de GHS pour amener la médiane \
   de l'image sur une cible (1er étirement ou fond), puis applique GHS.

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

function median( img )
{
   let med = 0;
   for ( let c = 0; c < img.numberOfChannels; ++c )
   {
      img.selectedChannel = c;
      med += img.median();
   }
   img.resetSelections();
   return med/img.numberOfChannels;
}

// Stretch factor (0 à sfMax) qui amène x sur target ; f(0) = x, f monotone en SF.
function solveSF( x, target, b, SP, LP, HP, sfMax )
{
   let up = target > x;
   let f = function( sf ) { return ghs( x, sf, b, SP, LP, HP ); };
   if ( up ? f( sfMax ) < target : f( sfMax ) > target )
   {
      console.warningln( TITLE + " : cible non atteinte même avec Stretch factor " + sfMax + "." );
      return sfMax;
   }
   let lo = 0, hi = sfMax;
   for ( let i = 0; i < 60; ++i )
   {
      let m = (lo + hi)/2;
      if ( up ? f( m ) < target : f( m ) > target )
         lo = m;
      else
         hi = m;
   }
   return (lo + hi)/2;
}

function main()
{
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   let fond = param( "mode", "premier" ).toLowerCase() == "fond";
   let target = parseFloat( param( "cible", fond ? "0.11" : "0.25" ) );
   let b = parseFloat( param( "b", fond ? "10" : "6" ) );
   let spFactor = parseFloat( param( "spFactor", fond ? "0.87" : "0.5" ) );
   let hp = parseFloat( param( "hp", "0.85" ) );

   let med = median( view.image );
   if ( !(med > 0) || (fond ? med <= target : med >= target) )
   {
      console.warningln( TITLE + " : médiane " + med.toFixed( 5 ) + (fond ? " déjà sous la cible " : " déjà au-dessus de la cible ") + target + ", rien n'est fait." );
      return;
   }
   let SP = Math.min( med*spFactor, 0.99 );
   let HP = fond ? SP : Math.max( hp, SP );
   let sf = solveSF( med, target, b, SP, 0, HP, fond ? 5 : 20 );

   let G = new GeneralizedHyperbolicStretch;
   G.stretchType = GeneralizedHyperbolicStretch.prototype.ST_GeneralisedHyperbolic;
   G.stretchChannel = GeneralizedHyperbolicStretch.prototype.SC_RGB;
   G.inverse = false;
   G.stretchFactor = sf;
   G.localIntensity = b;
   G.symmetryPoint = SP;
   G.shadowProtection = 0;
   G.highlightProtection = HP;
   G.blackPoint = 0;
   G.whitePoint = 1;
   G.clipType = GeneralizedHyperbolicStretch.prototype.CT_RGBBlend;
   G.executeOn( view );

   console.noteln( TITLE + " (" + (fond ? "fond" : "premier") + ") : " + view.id + " médiane " + med.toFixed( 5 ) + " -> " + target +
                   " visée, " + median( view.image ).toFixed( 4 ) + " mesurée (SP " + SP.toFixed( 5 ) + ", HP " + HP.toFixed( 3 ) +
                   ", b " + b + ", Stretch factor " + sf.toFixed( 3 ) + ")." );
}

main();
