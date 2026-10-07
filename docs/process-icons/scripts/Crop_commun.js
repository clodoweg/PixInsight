// ----------------------------------------------------------------------------
// Crop_commun.js — même recadrage pour toutes les images ouvertes, sans les
// bandes noires laissées par l'alignement des masters.
// ----------------------------------------------------------------------------
// Paramètre « mode » :
//   reference : crée l'image Crop_ref = minimum pixel par pixel de toutes les
//               images ouvertes (tous les canaux) : une bande noire présente
//               sur UNE image est noire sur Crop_ref. Calcul identique à
//               ImageIntegration en combinaison Minimum, sans normalisation ni
//               rejet (fait ici directement sur les vues : ImageIntegration
//               demande des fichiers et des images de même type). Crop_ref
//               est affichée étirée (STF auto) et DynamicCrop s'ouvre :
//               trace le cadre sur Crop_ref puis applique-le (coche verte).
//   appliquer : relit le dernier DynamicCrop appliqué à Crop_ref (historique
//               de la vue) et l'applique à toutes les autres images ouvertes
//               de même taille, puis ferme Crop_ref.
// Paramètre « nom » : nom de l'image de référence (Crop_ref).
// Les images *_stars sont ignorées.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Crop_commun : clodoweg > Crop commun sans bandes noires
#feature-info  Image minimum de toutes les images ouvertes (bandes noires \
   visibles), DynamicCrop dessus, puis même crop sur toutes les images.

#include <pjsr/UndoFlag.jsh>
#include "clodoweg_ui.jsh"

#define CC_TITLE "Crop commun"

function ccCandidates( nom )
{
   return ImageWindow.windows.filter( function( w )
   {
      let id = w.mainView.id;
      return id != nom && !id.endsWith( "_stars" );
   } );
}

// STF automatique (calcul de WBPP : computeAutoStretch, -2,8 MAD, fond 0,25)
function ccAutoSTF( view )
{
   let img = view.image;
   let med = Math.max( 0.00001, img.median() );
   view.stf = img.computeAutoStretch( [ med ], [ 1.4826*img.MAD() ], -2.8, 0.25, false );
}

function ccReference( nom, wins )
{
   if ( wins.length == 0 )
      throw new Error( CC_TITLE + " : aucune image ouverte." );
   let W = wins[ 0 ].mainView.image.width, H = wins[ 0 ].mainView.image.height;
   for ( let i = 1; i < wins.length; ++i )
   {
      let im = wins[ i ].mainView.image;
      if ( im.width != W || im.height != H )
         throw new Error( CC_TITLE + " : tailles différentes (" + wins[ 0 ].mainView.id + " " + W + "x" + H + ", " +
                          wins[ i ].mainView.id + " " + im.width + "x" + im.height + "). Décoche les images d'une autre taille." );
   }
   cwCloseWindow( nom );
   let out = new ImageWindow( W, H, 1, 32, true, false, nom );
   let v = out.mainView;
   v.beginProcess( UndoFlag_NoSwapFile );
   let rows = 256, acc = new Float32Array( W*rows ), buf = new Float32Array( W*rows );
   for ( let y0 = 0; y0 < H; y0 += rows )
   {
      let h = Math.min( rows, H - y0 ), n = W*h;
      let r = new Rect( 0, y0, W, y0 + h );
      for ( let k = 0; k < n; ++k )
         acc[ k ] = 1;
      for ( let i = 0; i < wins.length; ++i )
      {
         let im = wins[ i ].mainView.image;
         for ( let c = 0; c < im.numberOfChannels; ++c )
         {
            im.getSamples( buf, r, c );
            for ( let k = 0; k < n; ++k )
               if ( buf[ k ] < acc[ k ] )
                  acc[ k ] = buf[ k ];
         }
      }
      v.image.setSamples( h == rows ? acc : acc.subarray( 0, n ), r, 0 );
   }
   v.endProcess();
   ccAutoSTF( v );
   out.keywords = [ new FITSKeyword( "CWREFW", W.toString(), "Crop_commun : largeur avant crop" ),
                    new FITSKeyword( "CWREFH", H.toString(), "Crop_commun : hauteur avant crop" ) ];
   out.show();
   out.zoomToFit();
   out.bringToFront();
   console.noteln( CC_TITLE + " : " + nom + " = minimum de " + wins.map( function( w ) { return w.mainView.id; } ).join( ", " ) +
                   ". Trace le cadre dans DynamicCrop sur " + nom + ", applique-le (coche verte), puis lance Crop_appliquer." );
   try
   {
      ( new DynamicCrop ).launch();
   }
   catch ( e )
   {
      console.warningln( CC_TITLE + " : ouvre DynamicCrop toi-même (Process > Geometry > DynamicCrop)." );
   }
}

function ccKeyword( w, name )
{
   let kw = w.keywords;
   for ( let i = 0; i < kw.length; ++i )
      if ( kw[ i ].name.trim() == name )
         return parseInt( kw[ i ].strippedValue );
   return NaN;
}

function ccLastCrop( view )
{
   let h = view.processing;
   for ( let i = Math.min( view.historyIndex, h.length ) - 1; i >= 0; --i )
   {
      let p = h.at( i );
      if ( p.processId() == "DynamicCrop" )
         return p;
   }
   return null;
}

function ccAppliquer( nom, wins )
{
   let ref = ImageWindow.windowById( nom );
   if ( ref.isNull )
      throw new Error( CC_TITLE + " : pas d'image " + nom + " ouverte. Lance d'abord Crop_reference." );
   let P = ccLastCrop( ref.mainView );
   if ( P == null )
      throw new Error( CC_TITLE + " : aucun DynamicCrop appliqué à " + nom + ". Trace le cadre dans DynamicCrop puis clique la coche verte." );
   let W = ccKeyword( ref, "CWREFW" ), H = ccKeyword( ref, "CWREFH" );
   let done = [], skipped = [];
   for ( let i = 0; i < wins.length; ++i )
   {
      let w = wins[ i ], im = w.mainView.image;
      if ( !isNaN( W ) && ( im.width != W || im.height != H ) )
      {
         skipped.push( w.mainView.id + " (" + im.width + "x" + im.height + ")" );
         continue;
      }
      if ( !P.executeOn( w.mainView ) )
         throw new Error( CC_TITLE + " : échec sur " + w.mainView.id + " (voir la console)." );
      w.zoomToFit();
      done.push( w.mainView.id + " " + w.mainView.image.width + "x" + w.mainView.image.height );
   }
   ref.forceClose();
   console.noteln( CC_TITLE + " : " + done.length + " image(s) recadrée(s) : " + done.join( ", " ) + "." );
   if ( skipped.length > 0 )
      console.warningln( CC_TITLE + " : taille différente de " + nom + ", non recadrée(s) : " + skipped.join( ", " ) + "." );
}

function ccDialog( p )
{
   let d = new CWDialog( CC_TITLE, "<b>Même recadrage pour toutes les images</b>, sans les bandes noires. " +
                         "1) Référence : image " + p.nom + " = minimum des images cochées (bandes noires de toutes les images), DynamicCrop s'ouvre : " +
                         "trace le cadre sur " + p.nom + ", coche verte. 2) Appliquer : ce crop sur les images cochées, " + p.nom + " fermée.", "Référence :" );
   d.combo( "Étape :", [ "1 - Référence (" + p.nom + " + DynamicCrop)", "2 - Appliquer le crop" ], p.mode == "appliquer" ? 1 : 0,
            "1 = crée l'image minimum et ouvre DynamicCrop ; 2 = applique le dernier DynamicCrop de " + p.nom + " aux images cochées.",
            function( k ) { p.mode = k == 1 ? "appliquer" : "reference"; } );
   d.edit( "Référence :", p.nom, "Nom de l'image minimum (sans espace).", function( t ) { p.nom = t.trim(); } );
   let windows = ImageWindow.windows, boxes = [];
   d.group( "Images" );
   if ( windows.length == 0 )
      d.info( "Aucune image ouverte." );
   for ( let k = 0; k < windows.length; ++k )
   {
      let w = windows[ k ], id = w.mainView.id;
      if ( id == p.nom )
         continue;
      boxes.push( { w: w, box: d.check( id + "  (" + w.mainView.image.width + "×" + w.mainView.image.height + ")",
                                         !id.endsWith( "_stars" ), "", null ) } );
   }
   d.endGroup();
   d.validate = function() { return p.nom.length == 0 || p.nom.indexOf( " " ) >= 0 ? "Nom de référence vide ou avec un espace." : ""; };
   d.onExport = function() { Parameters.set( "mode", p.mode ); Parameters.set( "nom", p.nom ); };
   d.finish( "OK" );
   if ( !d.execute() )
      return null;
   return boxes.filter( function( b ) { return b.box.checked && b.w.mainView.id != p.nom; } ).map( function( b ) { return b.w; } );
}

function ccRun( p, wins )
{
   if ( p.mode == "appliquer" )
      ccAppliquer( p.nom, wins );
   else
      ccReference( p.nom, wins );
}

function main()
{
   let p = { mode: cwParam( "mode", "reference" ).toLowerCase(), nom: cwParam( "nom", "Crop_ref" ) };
   if ( cwWantsDialog() )
   {
      let wins = ccDialog( p );
      if ( wins != null )
         cwRun( CC_TITLE, function() { ccRun( p, wins ); } );
      return;
   }
   ccRun( p, ccCandidates( p.nom ) );
}

main();
