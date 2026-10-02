// ----------------------------------------------------------------------------
// Masque_auto.js — masque de luminance créé ET attaché en un clic.
// ----------------------------------------------------------------------------
// mode = attacher (défaut) : crée la vue mono « masque_L » à partir de l'image
//   cible, luminance Rec. 709 (0,2126 R + 0,7152 G + 0,0722 B ; l'image elle-
//   même si elle est mono) dont le fond est coupé : tout ce qui est sous s
//   passe à 0 (protégé), le reste va de 0 à 1 ; puis léger flou gaussien
//   (flou = sigma en pixels, 0 = aucun) et masque ATTACHÉ à l'image (non
//   inversé, sans affichage rouge). Un ancien masque_L est remplacé.
// source = nom d'une autre vue (par exemple L, sans étoiles) : la luminance du
//   masque est prise sur cette vue au lieu de l'image cible (même taille) ;
//   vide = l'image cible. Sert au Boost_final, sur l'image finie avec étoiles :
//   masque tiré de L sans étoiles, donc les étoiles ne sont pas touchées.
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

#define TITLE "Masque auto"

function param( key, value )
{
   return Parameters.has( key ) ? Parameters.getString( key ).trim() : value;
}

function main()
{
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   let window = view.window;
   let name = param( "nom", "masque_L" );
   let mode = param( "mode", "attacher" ).toLowerCase();

   if ( mode == "retirer" )
   {
      window.removeMask();
      let m = ImageWindow.windowById( name );
      if ( !m.isNull && m.mainView.id != view.id )
         m.forceClose();
      console.noteln( TITLE + " : masque retiré de " + view.id + "." );
      return;
   }

   let s = parseFloat( param( "s", "0.14" ) );
   let flou = parseFloat( param( "flou", "2" ) );

   let old = ImageWindow.windowById( name );
   if ( !old.isNull && old.mainView.id != view.id )
   {
      window.removeMask();
      old.forceClose();
   }

   let src = view;
   let srcId = param( "source", "" );
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
   P.expression = "max(0, (" + lum + " - " + s + ") / (1 - " + s + "))";
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
   console.noteln( TITLE + " : " + name + " (tiré de " + src.id + ", s = " + s + ", flou " + flou + " px) attaché à " + view.id + "." );
}

main();
