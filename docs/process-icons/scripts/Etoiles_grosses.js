// ----------------------------------------------------------------------------
// Etoiles_grosses.js — réduit SEULEMENT les grosses étoiles de l'image
// d'étoiles (RGB_stars), avant Etoiles_screen ; les petites ne bougent pas.
// ----------------------------------------------------------------------------
// Deux façons de le lancer :
//   - GLISSER l'icône sur l'image d'étoiles : exécution directe avec les
//     réglages de l'icône (sans fenêtre ; marche aussi dans un conteneur) ;
//   - DOUBLE-CLIC sur l'icône puis Apply Global (ou menu Script › clodoweg) : fenêtre de
//     réglages pré-remplie avec les réglages de l'icône, bouton « Voir le
//     masque » pour régler à l'œil, bouton triangle pour enregistrer les
//     réglages dans une nouvelle icône.
//
// Calcul du masque sur une copie réduite à 2000 px de large (mêmes réglages
// quelle que soit la taille de l'image), puis ramené à la taille réelle :
//   1. luminance de l'image d'étoiles, légère floutée (1 px) ;
//   2. ouverture morphologique (érosion puis dilatation, disque de « taille »
//      px, 7 par défaut, soit environ 33 px sur une image de 9 576 px) : une
//      étoile plus petite que le disque disparaît, une grosse reste ;
//   3. masque = 0 sous « seuil » (0,15), 1 à seuil + 0,10, puis étendu au
//      halo (flou « etendue » 12 px × 3) ;
//   4. sous le masque, la luminance Y de chaque pixel va vers mtf(force, Y),
//      avec un poids w = (Y − 0,10)/0,70 borné à [0, 1] : les parties faibles
//      du halo (sous 0,10) ne bougent pas, la réduction est complète au-dessus
//      de 0,80 ; les trois canaux multipliés par le même facteur : couleur
//      gardée, l'étoile paraît plus petite (force 0,80 : un halo à 0,5 descend
//      à 0,33, à 0,2 à 0,18 ; un cœur à 1 reste à 1).
//      Sans ce poids (version précédente), le halo faible était divisé par 2
//      jusqu'au bord du masque et restait intact juste après : anneau noir
//      autour des grosses étoiles (retour de l'utilisateur). Le poids et le
//      masque plus étendu le suppriment ; force limitée à 0,85 (au-delà la
//      courbe ne serait plus croissante : anneau à nouveau).
// Paramètres : taille (plus grand = seules les plus grosses), seuil, etendue,
// force (0,5 = rien ; plus haut = plus réduit, 0,85 au plus), afficherMasque (garde la vue
// masque_grosses : blanc = réduit).
// Ctrl+Z pour annuler.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Etoiles_grosses : clodoweg > Réduire les grosses étoiles
#feature-info  Réduit seulement les grosses étoiles de l'image d'étoiles, \
   couleur gardée, avant la réintégration.

#include <pjsr/Sizer.jsh>
#include <pjsr/TextAlign.jsh>
#include <pjsr/NumericControl.jsh>

#define EG_TITLE "Etoiles grosses"
#define EG_WORK 2000
#define EG_MASK_VIEW "masque_grosses"

// ---------------------------------------------------------------- réglages

function egParams()
{
   function get( key, value )
   {
      return Parameters.has( key ) ? Parameters.getString( key ).trim() : value;
   }
   return {
      taille: parseFloat( get( "taille", "7" ) ),
      seuil: parseFloat( get( "seuil", "0.15" ) ),
      etendue: parseFloat( get( "etendue", "12" ) ),
      force: Math.min( 0.85, parseFloat( get( "force", "0.80" ) ) ),
      afficherMasque: get( "afficherMasque", "false" ).toLowerCase() == "true"
   };
}

function egExport( p )
{
   Parameters.set( "taille", p.taille.toFixed( 0 ) );
   Parameters.set( "seuil", p.seuil.toFixed( 2 ) );
   Parameters.set( "etendue", p.etendue.toFixed( 0 ) );
   Parameters.set( "force", p.force.toFixed( 2 ) );
   Parameters.set( "afficherMasque", p.afficherMasque ? "true" : "false" );
}

// ---------------------------------------------------------------- calcul

function egClose( id )
{
   let w = ImageWindow.windowById( id );
   if ( !w.isNull )
      w.forceClose();
}

function egNew( view, id, expr )
{
   egClose( id );
   let P = new PixelMath;
   P.expression = expr;
   P.useSingleExpression = true;
   P.createNewImage = true;
   P.showNewImage = false;
   P.newImageId = id;
   P.newImageColorSpace = PixelMath.prototype.Gray;
   P.newImageSampleFormat = PixelMath.prototype.f32;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( view );
   let w = ImageWindow.windowById( id );
   if ( w.isNull )
      throw new Error( EG_TITLE + " : vue " + id + " non créée." );
   return w;
}

function egPm( w, expr )
{
   let P = new PixelMath;
   P.expression = expr;
   P.useSingleExpression = true;
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( w.mainView );
}

function egBlur( w, sigma )
{
   if ( sigma <= 0 )
      return;
   let C = new Convolution;
   C.mode = Convolution.prototype.Parametric;
   C.sigma = sigma;
   C.shape = 2;
   C.aspectRatio = 1;
   C.rotationAngle = 0;
   C.executeOn( w.mainView );
}

function egResize( w, width, height )
{
   if ( w.mainView.image.width == width && w.mainView.image.height == height )
      return;
   let R = new Resample;
   R.mode = Resample.prototype.AbsolutePixels;
   R.absoluteMode = Resample.prototype.ForceWidthAndHeight;
   R.xSize = width;
   R.ySize = height;
   R.executeOn( w.mainView );
}

// Disque de diamètre s (impair) pour MorphologicalTransformation.
function egMorpho( w, op, s )
{
   s = Math.max( 3, 2*Math.floor( s/2 ) + 1 );
   let r = (s - 1)/2, disk = [];
   for ( let y = 0; y < s; ++y )
      for ( let x = 0; x < s; ++x )
         disk.push( ((x - r)*(x - r) + (y - r)*(y - r) <= r*r) ? 1 : 0 );
   let M = new MorphologicalTransformation;
   M.operator = op;
   M.interlacingDistance = 1;
   M.lowThreshold = 0;
   M.highThreshold = 0;
   M.numberOfIterations = 1;
   M.amount = 1;
   M.selectionPoint = 0.5;
   M.structureName = "";
   M.structureSize = s;
   M.structureWayTable = [ [ disk ] ];
   M.executeOn( w.mainView );
}

function egLuminance( view )
{
   return view.image.isColor ? "(0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2])" : "$T";
}

// Masque des grosses étoiles (vue cachée eg_m, à la taille de l'image).
function egMask( view, p )
{
   let W = view.image.width, H = view.image.height;
   let w2 = Math.min( W, EG_WORK ), h2 = Math.round( H*w2/W );
   let m = egNew( view, "eg_m", egLuminance( view ) );
   egResize( m, w2, h2 );
   egBlur( m, 1 );
   egMorpho( m, MorphologicalTransformation.prototype.Erosion, p.taille );
   egMorpho( m, MorphologicalTransformation.prototype.Dilation, p.taille );
   egPm( m, "min(1, max(0, ($T - " + p.seuil + ")/0.10))" );
   egBlur( m, p.etendue );
   egPm( m, "min(1, 3*$T)" );
   egResize( m, W, H );
   return m;
}

// Vue masque_grosses visible (blanc = réduit).
function egShowMask( view, p )
{
   let m = egMask( view, p );
   let mv = egNew( m.mainView, EG_MASK_VIEW, "$T" );
   egClose( "eg_m" );
   mv.show();
   mv.zoomToFit();
   console.noteln( EG_TITLE + " : masque affiché (" + EG_MASK_VIEW + ", blanc = réduit)." );
}

// direct (inutilisé) : le résultat est toujours calculé dans une image cachée puis recopié dans
// l'image entre beginProcess et endProcess, glissée ou par la fenêtre (Ctrl+Z, affichage).
// puis recopié dans l'image entre beginProcess et endProcess, pour avoir une étape d'annulation
// (Ctrl+Z) et l'affichage mis à jour (retour de l'utilisateur : sinon rien ne s'affichait).
function egApply( view, p, direct )
{
   if ( view == null || view.isNull )
      throw new Error( EG_TITLE + " : aucune image." );
   let m = egMask( view, p );
   // contrôle : masque vide = aucune grosse étoile trouvée, l'image ne changerait pas
   let mMax = m.mainView.image.maximum(), mMean = m.mainView.image.mean();
   console.writeln( EG_TITLE + " : masque max " + mMax.toFixed( 3 ) + ", surface réduite environ " + (100*mMean).toFixed( 2 ) + " % de l'image." );
   if ( mMax < 0.01 )
   {
      egClose( "eg_m" );
      throw new Error( EG_TITLE + " : aucune grosse étoile trouvée avec ces réglages, l'image n'est pas modifiée. " +
                       "Baisse le seuil (0,10 puis 0,05) ou la taille (5), et vérifie avec « Voir le masque »." );
   }
   if ( p.afficherMasque )
      egNew( m.mainView, EG_MASK_VIEW, "$T" ).show();
   else
      egClose( EG_MASK_VIEW );
   // luminance Y -> mtf(force, Y) sous le masque, même facteur sur R, G, B
   let Y = egLuminance( view );
   let P = new PixelMath;
   P.expression = "y = " + Y + ";\nf = iif(y > 0.000001, mtf(" + p.force.toFixed( 4 ) + ", y)/y, 1);\nw = min(1, max(0, (y - 0.10)/0.70));\n$T*(1 - eg_m*w*(1 - f))";
   P.symbols = "y, f, w";
   P.useSingleExpression = true;
   P.rescale = false;
   P.truncate = true;
   let ok;
   // toujours via une image cachée puis recopie (beginProcess / endProcess) : le PixelMath écrit
   // directement dans l'image avec des références (eg_m) peut échouer (« Unknown error » vu sur
   // Saturation_grosses, même calcul), et la recopie donne l'affichage et le Ctrl+Z
   {
      P.createNewImage = true;
      P.showNewImage = false;
      P.newImageId = "eg_r";
      P.newImageColorSpace = PixelMath.prototype.SameAsTarget;
      P.newImageSampleFormat = PixelMath.prototype.SameAsTarget;
      egClose( "eg_r" );
      ok = P.executeOn( view );
      let r = ImageWindow.windowById( "eg_r" );
      ok = ok && !r.isNull;
      if ( ok )
      {
         view.beginProcess();
         view.image.assign( r.mainView.image );
         view.endProcess();
      }
      egClose( "eg_r" );
   }
   egClose( "eg_m" );
   if ( !ok )
      throw new Error( EG_TITLE + " : la réduction a échoué (voir la console) ; l'image n'a pas été modifiée." );
   // l'image traitée passe devant : Ctrl+Z / Ctrl+Y s'appliquent à elle (pas à la vue du masque)
   view.window.bringToFront();
   console.noteln( EG_TITLE + " : pour comparer, Ctrl+Z puis Ctrl+Y sur " + view.id + " (fenêtre active), zoom 1:1 sur une grosse étoile." );
   console.noteln( EG_TITLE + " : grosses étoiles de " + view.id + " réduites (taille " + p.taille + ", seuil " + p.seuil +
                   ", étendue " + p.etendue + ", force " + p.force + ")" + (p.afficherMasque ? " ; masque gardé : " + EG_MASK_VIEW + "." : ".") );
}

// ---------------------------------------------------------------- fenêtre

function EGDialog( p, view )
{
   this.__base__ = Dialog;
   this.__base__();
   let self = this;
   this.p = p;
   this.view = view;
   this.windowTitle = EG_TITLE;
   let labelWidth = this.font.width( "Étendue au halo (px) :" ) + 8;

   this.help = new Label( this );
   this.help.wordWrapping = true;
   this.help.useRichText = true;
   this.help.minWidth = 460;
   this.help.text = "<b>Réduire seulement les grosses étoiles</b> de l'image d'étoiles (RGB_stars), " +
                    "avant Etoiles_screen. Les petites étoiles ne bougent pas, la couleur est gardée. " +
                    "Règle le masque avec « Voir le masque » (blanc = réduit), puis Appliquer.";

   // image
   this.imageLabel = new Label( this );
   this.imageLabel.text = "Image d'étoiles :";
   this.imageLabel.minWidth = labelWidth;
   this.imageLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;
   this.imageList = new ViewList( this );
   this.imageList.getMainViews();
   if ( view != null && !view.isNull )
      this.imageList.currentView = view;
   this.imageList.toolTip = "Image d'étoiles étirée (RGB_stars), avant Etoiles_screen.";
   this.imageList.onViewSelected = function( v ) { self.view = v; };
   this.imageSizer = new HorizontalSizer;
   this.imageSizer.spacing = 4;
   this.imageSizer.add( this.imageLabel );
   this.imageSizer.add( this.imageList, 100 );

   function numeric( parent, text, lo, hi, prec, value, tip, onChange )
   {
      let c = new NumericControl( parent );
      c.label.text = text;
      c.label.minWidth = labelWidth;
      c.setReal( prec > 0 );
      c.setRange( lo, hi );
      c.setPrecision( prec );
      c.slider.setRange( 0, 1000 );
      c.slider.minWidth = 220;
      c.setValue( value );
      c.toolTip = tip;
      c.onValueUpdated = onChange;
      return c;
   }

   // masque
   this.tailleControl = numeric( this, "Taille (px) :", 3, 21, 0, p.taille,
      "Diamètre du disque, en pixels sur la copie à 2000 px. Plus grand = seules les plus grosses étoiles sont réduites (7 ≈ 33 px sur une image de 9 576 px).",
      function( v ) { self.p.taille = v; } );
   this.seuilControl = numeric( this, "Seuil :", 0.02, 0.50, 2, p.seuil,
      "Luminosité minimale d'une grosse étoile après l'ouverture. Plus bas = plus d'étoiles prises.",
      function( v ) { self.p.seuil = v; } );
   this.etendueControl = numeric( this, "Étendue au halo (px) :", 0, 30, 0, p.etendue,
      "Flou du masque pour couvrir le halo (12 par défaut). Trop bas = anneau sombre autour des grosses étoiles.",
      function( v ) { self.p.etendue = v; } );
   this.maskGroup = new GroupBox( this );
   this.maskGroup.title = "Masque des grosses étoiles";
   this.maskGroup.sizer = new VerticalSizer;
   this.maskGroup.sizer.margin = 6;
   this.maskGroup.sizer.spacing = 4;
   this.maskGroup.sizer.add( this.tailleControl );
   this.maskGroup.sizer.add( this.seuilControl );
   this.maskGroup.sizer.add( this.etendueControl );

   // réduction
   this.forceControl = numeric( this, "Force :", 0.50, 0.85, 2, p.force,
      "0,50 = aucun effet ; plus haut = étoiles plus réduites (0,80 : un halo à 0,5 descend à 0,33 ; 0,85 au plus, sinon anneau sombre). Le halo faible (sous 0,10) n'est jamais touché.",
      function( v ) { self.p.force = v; } );
   this.keepMask = new CheckBox( this );
   this.keepMask.text = "Garder la vue masque_grosses après l'application";
   this.keepMask.checked = p.afficherMasque;
   this.keepMask.onCheck = function( checked ) { self.p.afficherMasque = checked; };
   this.reduceGroup = new GroupBox( this );
   this.reduceGroup.title = "Réduction";
   this.reduceGroup.sizer = new VerticalSizer;
   this.reduceGroup.sizer.margin = 6;
   this.reduceGroup.sizer.spacing = 4;
   this.reduceGroup.sizer.add( this.forceControl );
   this.reduceGroup.sizer.add( this.keepMask );

   // boutons
   this.newInstanceButton = new ToolButton( this );
   this.newInstanceButton.icon = this.scaledResource( ":/process-interface/new-instance.png" );
   this.newInstanceButton.setScaledFixedSize( 24, 24 );
   this.newInstanceButton.toolTip = "Nouvelle icône avec ces réglages (glisse le triangle sur le bureau).";
   this.newInstanceButton.onMousePress = function()
   {
      this.hasFocus = true;
      this.pushed = false;
      egExport( self.p );
      this.dialog.newInstance();
   };
   this.previewButton = new PushButton( this );
   this.previewButton.text = "Voir le masque";
   this.previewButton.toolTip = "Calcule le masque avec ces réglages et l'affiche (vue masque_grosses, blanc = réduit). L'image n'est pas modifiée.";
   this.previewButton.onClick = function()
   {
      if ( self.view == null || self.view.isNull )
      {
         (new MessageBox( "Choisis d'abord l'image d'étoiles.", EG_TITLE )).execute();
         return;
      }
      try { egShowMask( self.view, self.p ); }
      catch ( e ) { (new MessageBox( e.message, EG_TITLE )).execute(); }
   };
   this.okButton = new PushButton( this );
   this.okButton.text = "Appliquer";
   this.okButton.onClick = function()
   {
      if ( self.view == null || self.view.isNull )
      {
         (new MessageBox( "Choisis d'abord l'image d'étoiles.", EG_TITLE )).execute();
         return;
      }
      this.dialog.ok();
   };
   this.cancelButton = new PushButton( this );
   this.cancelButton.text = "Annuler";
   this.cancelButton.onClick = function() { this.dialog.cancel(); };
   this.buttons = new HorizontalSizer;
   this.buttons.spacing = 6;
   this.buttons.add( this.newInstanceButton );
   this.buttons.addStretch();
   this.buttons.add( this.previewButton );
   this.buttons.add( this.okButton );
   this.buttons.add( this.cancelButton );

   this.sizer = new VerticalSizer;
   this.sizer.margin = 8;
   this.sizer.spacing = 8;
   this.sizer.add( this.help );
   this.sizer.add( this.imageSizer );
   this.sizer.add( this.maskGroup );
   this.sizer.add( this.reduceGroup );
   this.sizer.add( this.buttons );
   this.adjustToContents();
}
EGDialog.prototype = new Dialog;

// ---------------------------------------------------------------- lancement

function egDefaultView()
{
   let w = ImageWindow.windowById( "RGB_stars" );
   if ( w.isNull )
      w = ImageWindow.activeWindow;
   return w.isNull ? null : w.mainView;
}

function main()
{
   let p = egParams();
   if ( Parameters.isViewTarget )
   {
      // icône glissée sur l'image : exécution directe (aussi dans un conteneur)
      egApply( Parameters.targetView, p, true );
      return;
   }
   if ( Parameters.has( "dialogue" ) && Parameters.getString( "dialogue" ).trim().toLowerCase() == "false" )
   {
      // conteneur lancé en Apply Global : exécution directe sur l'image active
      egApply( egDefaultView(), p, false );
      return;
   }
   let dialog = new EGDialog( p, egDefaultView() );
   if ( dialog.execute() )
   {
      try { egApply( dialog.view, p, false ); }
      catch ( e ) { console.criticalln( e.message ); (new MessageBox( e.message, EG_TITLE )).execute(); }
   }
}

main();
