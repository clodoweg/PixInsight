// ----------------------------------------------------------------------------
// Sharp_MMT.js — accentuation finale par MultiscaleMedianTransform (MMT).
// ----------------------------------------------------------------------------
// Sur l'image SANS étoiles étirée, en fin de phase 6, avant NXT_final, sous
// masque de luminance (dans le conteneur C_Sharp_MMT : Masque_L, ce script,
// Masque_retirer). Couche 1 (bruit) laissée telle quelle ; couches 2 à 4
// renforcées d'un léger biais (+0,04) ; couche 5 et résidu inchangés.
// Instance MMT reprise de l'icône enregistrée par l'utilisateur (PixInsight
// 1.9.5) : MMT non linéaire, luminance et chrominance.
// Paramètres : biais (0.04), premiere (2), derniere (4), couches (5).
// Le masque attaché à l'image est respecté (aussi depuis la fenêtre).
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight, avec
// clodoweg_ui.jsh.
// ----------------------------------------------------------------------------

#feature-id    Sharp_MMT : clodoweg > Accentuation finale (MMT)
#feature-info  Accentuation fine des petites échelles par \
   MultiscaleMedianTransform, couche 1 (bruit) laissée telle quelle.

#include "clodoweg_ui.jsh"

#define SM_TITLE "Sharp MMT"

function smParams()
{
   return { biais: parseFloat( cwParam( "biais", "0.04" ) ), premiere: parseInt( cwParam( "premiere", "2" ) ),
            derniere: parseInt( cwParam( "derniere", "4" ) ), couches: parseInt( cwParam( "couches", "5" ) ) };
}

function smExport( p )
{
   Parameters.set( "biais", p.biais.toFixed( 3 ) );
   Parameters.set( "premiere", p.premiere.toFixed( 0 ) );
   Parameters.set( "derniere", p.derniere.toFixed( 0 ) );
   Parameters.set( "couches", p.couches.toFixed( 0 ) );
}

// Constante d'énumération : forme 1.9.5 (MultiscaleMedianTransform.X, celle de l'icône de l'utilisateur), sinon .prototype.X.
function smEnum( name )
{
   let v = MultiscaleMedianTransform[ name ];
   return (v !== undefined) ? v : MultiscaleMedianTransform.prototype[ name ];
}

function smProcess( view, p )
{
   let P = new MultiscaleMedianTransform;
   let layers = [];
   for ( let k = 1; k <= p.couches; ++k )
   {
      let b = (k >= p.premiere && k <= p.derniere) ? p.biais : 0;
      // enabled, biasEnabled, bias, noiseReductionEnabled, noiseReductionThreshold, noiseReductionAmount, noiseReductionAdaptive
      layers.push( [ true, true, b, false, 1.0000, 1.00, 0.0000 ] );
   }
   P.layers = layers;
   P.transform = smEnum( "MultiscaleMedianTransform" );
   P.medianWaveletThreshold = 5.00;
   P.scaleDelta = 0;
   P.linearMask = false;
   P.linearMaskAmpFactor = 100;
   P.linearMaskSmoothness = 1.00;
   P.linearMaskInverted = true;
   P.linearMaskPreview = false;
   P.lowRange = 0.0000;
   P.highRange = 0.0000;
   P.previewMode = smEnum( "Disabled" );
   P.previewLayer = 0;
   P.toLuminance = true;
   P.toChrominance = true;
   P.linear = false;
   if ( !P.executeOn( view ) )
      throw new Error( SM_TITLE + " : MultiscaleMedianTransform a échoué (voir la console)." );
}

// Calcul sur une copie sans masque, puis mélange copie / original selon le masque attaché
// (Masque_L), par un PixelMath exécuté sur l'image et recopié : affichage et Ctrl+Z.
function smApply( view, p )
{
   cwApplyOnCopy( view, function( c ) { smProcess( c, p ); }, cwMaskBlend( view ) );
}

function smDialog( p, view )
{
   let d = new CWDialog( SM_TITLE, "<b>Accentuation finale</b> par MultiscaleMedianTransform : renforce les petites échelles (détails) sans toucher " +
                         "à la couche 1 (bruit). Sur l'image sans étoiles étirée, avant NXT_final. Le masque attaché à l'image (Masque_L) est respecté : " +
                         "attache-le d'abord pour ne pas accentuer le fond.", "Dernière couche :" );
   let sel = { view: view };
   d.viewList( "Image :", view, "Image sans étoiles étirée.", function( v ) { sel.view = v; } );
   d.numeric( "Biais :", 0.00, 0.20, 3, p.biais, "Renfort des couches choisies (+0,04 par défaut ; 0,02 léger, 0,06 fort).", function( v ) { p.biais = v; } );
   d.numeric( "Première couche :", 1, 6, 0, p.premiere, "Première couche renforcée (2 : la couche 1 est surtout du bruit).", function( v ) { p.premiere = v; } );
   d.numeric( "Dernière couche :", 1, 8, 0, p.derniere, "Dernière couche renforcée (4 par défaut).", function( v ) { p.derniere = v; } );
   d.numeric( "Couches :", 4, 8, 0, p.couches, "Nombre de couches de la transformée (5 par défaut).", function( v ) { p.couches = v; } );
   d.info( view != null && !view.isNull && !view.window.mask.isNull ? "Masque attaché : <b>" + view.window.mask.mainView.id + "</b>." :
           "<b>Pas de masque attaché</b> : toute l'image sera accentuée, fond compris (lance Masque_L avant, ou utilise le conteneur C_Sharp_MMT)." );
   d.onExport = function() { smExport( p ); };
   d.validate = function()
   {
      if ( sel.view == null || sel.view.isNull ) return "Choisis l'image.";
      if ( p.premiere > p.derniere ) return "La première couche doit être avant la dernière.";
      if ( p.derniere > p.couches ) return "La dernière couche dépasse le nombre de couches.";
      return "";
   };
   d.finish();
   return d.execute() ? sel.view : null;
}

function main()
{
   let p = smParams();
   if ( cwWantsDialog() )
   {
      let v = smDialog( p, cwDefaultView() );
      if ( v != null )
         cwRun( SM_TITLE, function() { smApply( v, p ); } );
      return;
   }
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( SM_TITLE + " : aucune image." );
   // glissée sur l'image : exécution directe (historique géré par PixInsight) ; sinon (conteneur
   // lancé en Apply Global) même chemin que la fenêtre, pour l'affichage et le Ctrl+Z
   if ( Parameters.isViewTarget )
      smProcess( view, p );
   else
      smApply( view, p );
   console.noteln( SM_TITLE + " : " + view.id + " accentuée (couches " + p.premiere + " à " + p.derniere + ", biais +" + p.biais + ")." );
}

main();
