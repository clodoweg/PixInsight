// ----------------------------------------------------------------------------
// Masque_auto.js — masque de luminance créé ET attaché en un clic.
// ----------------------------------------------------------------------------
// mode = attacher (défaut) : crée la vue mono « masque_L » à partir de l'image
//   cible, luminance Rec. 709 (0,2126 R + 0,7152 G + 0,0722 B ; l'image elle-
//   même si elle est mono) dont le fond est coupé : tout ce qui est sous s
//   passe à 0 (protégé), le reste va de 0 à 1 ; puis léger flou gaussien
//   (flou = sigma en pixels, 0 = aucun) et masque ATTACHÉ à l'image (non
//   inversé, sans affichage rouge). Un ancien masque_L est remplacé.
// gamma = courbe du masque (1 par défaut : linéaire) : masque^gamma ; gamma > 1
//   garde fort le masque sur ce qui est très lumineux (cœur, bras brillants) et
//   l'affaiblit sur ce qui l'est moins (halo, bras faibles). Boost_final : 2.
// source = nom d'une autre vue (par exemple L, sans étoiles) : la luminance du
//   masque est prise sur cette vue au lieu de l'image cible (même taille) ;
//   vide = l'image cible. Sert au Boost_final, sur l'image finie avec étoiles :
//   masque tiré de L sans étoiles, donc les étoiles ne sont pas touchées.
// exclure = nom d'une image d'étoiles (par exemple RGB_stars, étirée) : les
//   étoiles sont retirées du masque (masque × (1 − min(1, exclureGain ×
//   étoiles lissées de 3 px)), exclureGain 4). Sert au Boost_final : sans
//   cela, les étoiles posées sur la galaxie, là où L sans étoiles est clair,
//   seraient boostées aussi.
// mode = retirer : détache le masque de l'image et ferme masque_L.
//
// Sert dans les conteneurs de finition de la fiche (C_Finition, Boost,
// C_Fin_rapide) : attacher, Courbes, LHE..., retirer.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// Lancement : glisser l'icône sur l'image sans étoiles étirée.
// ----------------------------------------------------------------------------

#feature-id    Masque_auto : clodoweg > Masque de luminance automatique
#feature-info  Crée un masque de luminance au fond coupé et l'attache à \
   l'image (ou le retire).

#include "clodoweg_ui.jsh"

#define TITLE "Masque auto"

function maParams()
{
   return { mode: cwParam( "mode", "attacher" ).toLowerCase(), s: parseFloat( cwParam( "s", "0.14" ) ), gamma: parseFloat( cwParam( "gamma", "1" ) ),
            flou: parseFloat( cwParam( "flou", "2" ) ), nom: cwParam( "nom", "masque_L" ), source: cwParam( "source", "" ),
            exclure: cwParam( "exclure", "" ), exclureGain: parseFloat( cwParam( "exclureGain", "4" ) ) };
}

function maExport( p )
{
   Parameters.set( "mode", p.mode );
   Parameters.set( "s", p.s.toFixed( 2 ) );
   Parameters.set( "gamma", p.gamma.toFixed( 1 ) );
   Parameters.set( "flou", p.flou.toFixed( 1 ) );
   Parameters.set( "nom", p.nom );
   Parameters.set( "source", p.source );
   Parameters.set( "exclure", p.exclure );
   Parameters.set( "exclureGain", p.exclureGain.toFixed( 1 ) );
}

function maDialog( p, view )
{
   let d = new CWDialog( TITLE, "<b>Masque de luminance</b> au fond coupé, créé et attaché à l'image en un clic (ou retiré). " +
                         "Fond (sous s) protégé ; contrôle à la sonde sur le masque : fond 0 à 0,05.", "Gain d'exclusion :" );
   let sel = { view: view };
   d.viewList( "Image :", view, "Image sans étoiles étirée (ou image finie pour le Boost_final).", function( v ) { sel.view = v; } );
   d.combo( "Action :", [ "créer et attacher le masque", "retirer le masque" ], p.mode == "retirer" ? 1 : 0, "", function( k ) { p.mode = k == 1 ? "retirer" : "attacher"; } );
   d.edit( "Nom du masque :", p.nom, "Vue créée (masque_L par défaut).", function( t ) { p.nom = t.trim(); } );
   d.group( "Masque" );
   d.numeric( "Seuil s :", 0.00, 0.50, 2, p.s, "Tout ce qui est sous s passe à 0 (protégé). Règle : fond mesuré + 0,01.", function( v ) { p.s = v; } );
   d.numeric( "Gamma :", 0.5, 4, 1, p.gamma, "1 = linéaire ; 2 = masque fort seulement sur le très lumineux (Boost_final).", function( v ) { p.gamma = v; } );
   d.numeric( "Flou (px) :", 0, 10, 1, p.flou, "Lissage du masque.", function( v ) { p.flou = v; } );
   d.edit( "Source :", p.source, "Autre vue d'où tirer la luminance (L sans étoiles pour Boost_final) ; vide = l'image.", function( t ) { p.source = t.trim(); } );
   d.edit( "Étoiles à exclure :", p.exclure, "Image d'étoiles (RGB_stars) retirée du masque ; vide = rien.", function( t ) { p.exclure = t.trim(); } );
   d.numeric( "Gain d'exclusion :", 1, 10, 1, p.exclureGain, "Force du retrait des étoiles du masque (4 par défaut).", function( v ) { p.exclureGain = v; } );
   d.endGroup();
   d.onExport = function() { maExport( p ); };
   d.validate = function() { return (sel.view == null || sel.view.isNull) ? "Choisis l'image." : (p.nom.length ? "" : "Nom du masque vide."); };
   d.finish();
   return d.execute() ? sel.view : null;
}

function main()
{
   let p = maParams();
   if ( cwWantsDialog() )
   {
      let v = maDialog( p, cwDefaultView() );
      if ( v != null )
         cwRun( TITLE, function() { maRun( v, p ); v.window.bringToFront(); } );
      return;
   }
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   maRun( view, p );
}

function maRun( view, p )
{
   let window = view.window;
   let name = p.nom;
   let mode = p.mode;

   if ( mode == "retirer" )
   {
      window.removeMask();
      let m = ImageWindow.windowById( name );
      if ( !m.isNull && m.mainView.id != view.id )
         m.forceClose();
      console.noteln( TITLE + " : masque retiré de " + view.id + "." );
      return;
   }

   let s = p.s, flou = p.flou, gamma = p.gamma;

   let old = ImageWindow.windowById( name );
   if ( !old.isNull && old.mainView.id != view.id )
   {
      window.removeMask();
      old.forceClose();
   }

   let src = view;
   let srcId = p.source;
   if ( srcId.length > 0 )
   {
      let sw = ImageWindow.windowById( srcId );
      if ( sw.isNull )
         console.warningln( TITLE + " : vue source " + srcId + " introuvable, masque tiré de " + view.id + "." );
      else if ( sw.mainView.image.width != view.image.width || sw.mainView.image.height != view.image.height )
         console.warningln( TITLE + " : " + srcId + " n'a pas la taille de " + view.id + ", masque tiré de " + view.id + "." );
      else
         src = sw.mainView;
   }
   let lum = src.image.isColor ? "(0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2])" : "$T";
   let P = new PixelMath;
   P.expression = gamma == 1 ? "max(0, (" + lum + " - " + s + ") / (1 - " + s + "))"
                             : "max(0, (" + lum + " - " + s + ") / (1 - " + s + "))^" + gamma;
   P.useSingleExpression = true;
   P.createNewImage = true;
   P.showNewImage = true;
   P.newImageId = name;
   P.newImageColorSpace = PixelMath.prototype.Gray;
   P.newImageSampleFormat = PixelMath.prototype.f32;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( src );

   let mask = ImageWindow.windowById( name );
   if ( mask.isNull )
      throw new Error( TITLE + " : le masque " + name + " n'a pas été créé." );

   let exclId = p.exclure;
   if ( exclId.length > 0 )
   {
      let ew = ImageWindow.windowById( exclId );
      if ( ew.isNull || ew.mainView.image.width != view.image.width || ew.mainView.image.height != view.image.height )
         console.warningln( TITLE + " : image d'étoiles " + exclId + " introuvable ou de taille différente, étoiles non retirées du masque." );
      else
      {
         let gain = p.exclureGain;
         let tmp = "masque_etoiles";
         let o = ImageWindow.windowById( tmp );
         if ( !o.isNull )
            o.forceClose();
         let E = new PixelMath;
         E.expression = ew.mainView.image.isColor ? "0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2]" : "$T";
         E.useSingleExpression = true;
         E.createNewImage = true;
         E.showNewImage = false;
         E.newImageId = tmp;
         E.newImageColorSpace = PixelMath.prototype.Gray;
         E.newImageSampleFormat = PixelMath.prototype.f32;
         E.rescale = false;
         E.truncate = true;
         E.executeOn( ew.mainView );
         let tw = ImageWindow.windowById( tmp );
         let B = new Convolution;
         B.mode = Convolution.prototype.Parametric;
         B.sigma = 3;
         B.shape = 2;
         B.aspectRatio = 1;
         B.rotationAngle = 0;
         B.executeOn( tw.mainView );
         let X = new PixelMath;
         X.expression = "$T*(1 - min(1, " + gain + "*" + tmp + "))";
         X.useSingleExpression = true;
         X.createNewImage = false;
         X.rescale = false;
         X.truncate = true;
         X.executeOn( mask.mainView );
         tw.forceClose();
      }
   }

   if ( flou > 0 )
   {
      let C = new Convolution;
      C.mode = Convolution.prototype.Parametric;
      C.sigma = flou;
      C.shape = 2;
      C.aspectRatio = 1;
      C.rotationAngle = 0;
      C.executeOn( mask.mainView );
   }

   window.mask = mask;
   window.maskEnabled = true;
   window.maskInverted = false;
   window.maskVisible = false;
   console.noteln( TITLE + " : " + name + " (tiré de " + src.id + ", s = " + s + ", gamma " + gamma + (exclId.length > 0 ? ", sans les étoiles de " + exclId : "") + ", flou " + flou + " px) attaché à " + view.id + "." );
}

main();
