// ----------------------------------------------------------------------------
// STF_auto.js — STF automatique (affichage seulement) sur l'image où on glisse
// l'icône.
// ----------------------------------------------------------------------------
// Même calcul que l'Auto Stretch de ScreenTransferFunction (bouton « A ») :
//   c0 = médiane + ombres × MAD normalisée (MAD × 1,4826), ombres = −2,8 ;
//   m  = mtf(fond, médiane − c0), fond = 0,25.
// lier = true : même réglage pour R, G et B (couleurs vraies) ; false : canal
// par canal (image linéaire avant SPCC, dominante neutralisée à l'écran).
// Les pixels ne changent pas : seule la vue est étirée à l'écran. Pour revenir
// à l'image brute : bouton « Reset » de ScreenTransferFunction (ou F12).
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    STF_auto : clodoweg > STF automatique
#feature-info  Applique un STF automatique (Auto Stretch) à la vue cible, \
   lié ou canal par canal, sans modifier les pixels.

#define TITLE "STF auto"

function param( key, value )
{
   return Parameters.has( key ) ? Parameters.getString( key ).trim() : value;
}

function main()
{
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   let ombres = parseFloat( param( "ombres", "-2.8" ) );
   let fond = parseFloat( param( "fond", "0.25" ) );
   let lier = param( "lier", "true" ).toLowerCase() == "true";

   let n = view.image.isColor ? 3 : 1;
   let med = view.computeOrFetchProperty( "Median" );
   let mad = view.computeOrFetchProperty( "MAD" );
   let A = [ [ 0, 1, 0.5, 0, 1 ], [ 0, 1, 0.5, 0, 1 ], [ 0, 1, 0.5, 0, 1 ], [ 0, 1, 0.5, 0, 1 ] ];   // c0, c1, m, r0, r1

   if ( lier )
   {
      let c0 = 0, m = 0;
      for ( let c = 0; c < n; ++c )
      {
         let s = 1.4826*mad.at( c );
         if ( 1 + s != 1 )
            c0 += med.at( c ) + ombres*s;
         m += med.at( c );
      }
      c0 = Math.range( c0/n, 0.0, 1.0 );
      m = Math.mtf( fond, m/n - c0 );
      for ( let c = 0; c < n; ++c )
         A[ c ] = [ c0, 1, m, 0, 1 ];
   }
   else
      for ( let c = 0; c < n; ++c )
      {
         let s = 1.4826*mad.at( c );
         let c0 = (1 + s != 1) ? Math.range( med.at( c ) + ombres*s, 0.0, 1.0 ) : 0.0;
         A[ c ] = [ c0, 1, Math.mtf( fond, med.at( c ) - c0 ), 0, 1 ];
      }

   let S = new ScreenTransferFunction;
   S.STF = A;
   S.executeOn( view );
   console.noteln( TITLE + " : " + view.id + " (" + (lier ? "lié" : "canal par canal") + ", ombres " + ombres + ", fond " + fond + ") ; pixels inchangés." );
}

main();
