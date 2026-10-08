// ----------------------------------------------------------------------------
// clodoweg_ui.jsh — fenêtre de réglages commune aux scripts clodoweg.
// ----------------------------------------------------------------------------
// Inclus par chaque script (#include "clodoweg_ui.jsh") : à copier dans
// src/scripts/clodoweg avec les scripts.
//
// Règle de lancement (demande de l'utilisateur) :
//   - icône GLISSÉE sur une image, ou script dans un conteneur (paramètre
//     dialogue = false, ajouté par le générateur) : exécution directe, sans
//     fenêtre, avec les réglages de l'icône ;
//   - double-clic sur l'icône puis Apply Global, ou menu Script › clodoweg :
//     fenêtre pré-remplie avec les réglages de l'icône ; triangle = nouvelle
//     icône avec les réglages de la fenêtre.
// Modification d'une image lancée par la fenêtre : cwApplyOnCopy (calcul sur
// une copie cachée, puis recopie entre beginProcess et endProcess) pour avoir
// l'affichage mis à jour et une étape Ctrl+Z (retour de l'utilisateur).
// ----------------------------------------------------------------------------

#ifndef CLODOWEG_UI_JSH
#define CLODOWEG_UI_JSH

// Moteur v8 (#engine v8, scripts qui incluent ImageSolver) : définir CLODOWEG_V8
// AVANT d'inclure ce fichier. En v8, HorizontalSizer et VerticalSizer existent
// déjà (pas de pjsr/Sizer.jsh, sinon « Identifier 'HorizontalSizer' has already
// been declared »), l'alignement s'écrit TextAlignment.Right et la fenêtre se
// construit avec class ... extends Dialog.
#ifdef CLODOWEG_V8
#define CW_ALIGN_RIGHT (TextAlignment.Right | TextAlignment.VertCenter)
#else
#include <pjsr/Sizer.jsh>
#include <pjsr/TextAlign.jsh>
#include <pjsr/NumericControl.jsh>
#define CW_ALIGN_RIGHT (TextAlign_Right | TextAlign_VertCenter)
#endif

function cwParam( key, value )
{
   return Parameters.has( key ) ? Parameters.getString( key ).trim() : value;
}

function cwBool( key, value )
{
   return cwParam( key, value ? "true" : "false" ).toLowerCase() == "true";
}

function cwWantsDialog()
{
   if ( Parameters.isViewTarget )
      return false;
   if ( Parameters.has( "dialogue" ) && Parameters.getString( "dialogue" ).trim().toLowerCase() == "false" )
      return false;
   return true;
}

function cwCloseWindow( id )
{
   let w = ImageWindow.windowById( id );
   if ( !w.isNull )
      w.forceClose();
}

// Vue principale d'une fenêtre ouverte (id), sinon de la fenêtre active, sinon null.
function cwDefaultView( id )
{
   let w = id ? ImageWindow.windowById( id ) : ImageWindow.activeWindow;
   if ( w.isNull )
      w = ImageWindow.activeWindow;
   return w.isNull ? null : w.mainView;
}

// Vue principale de la fenêtre id, ou null (pas de repli sur la fenêtre active).
function cwViewById( id )
{
   let w = ImageWindow.windowById( id );
   return w.isNull ? null : w.mainView;
}

// Image cachée id = expr calculée par PixelMath EXÉCUTÉ SUR view (même format que view).
function cwPixelMathNew( view, expr, id )
{
   cwCloseWindow( id );
   let P = new PixelMath;
   P.expression = expr;
   P.useSingleExpression = true;
   P.createNewImage = true;
   P.showNewImage = false;
   P.newImageId = id;
   P.newImageColorSpace = PixelMath.prototype.SameAsTarget;
   P.newImageSampleFormat = PixelMath.prototype.SameAsTarget;
   P.rescale = false;
   P.truncate = true;
   let ok = P.executeOn( view );
   let w = ImageWindow.windowById( id );
   if ( !ok || w.isNull )
      throw new Error( "PixelMath : image de travail " + id + " non créée (voir la console)." );
   return w;
}

// Vrai si view est l'image sur laquelle un CONTENEUR a été glissé : le conteneur
// la verrouille, beginProcess y échoue (« already being processed », test de
// l'utilisateur du 8 octobre 2026 sur R_C_Fin_rapide). Les scripts d'un
// conteneur portent dialogue = false (ajouté par le générateur) ; une icône
// script glissée seule ne le porte pas et n'est pas verrouillée.
function cwTargetLocked( view )
{
   return Parameters.isViewTarget && !Parameters.targetView.isNull &&
          Parameters.targetView.id == view.id &&
          Parameters.has( "dialogue" ) && Parameters.getString( "dialogue" ).trim().toLowerCase() == "false";
}

// fn( copie ) travaille sur une copie cachée de view (sans masque). Le résultat
// est ensuite recalculé par un PixelMath exécuté SUR view (expression blend( id
// de la copie ), par défaut la copie seule), puis recopié dans view entre
// beginProcess et endProcess : affichage mis à jour et une étape Ctrl+Z.
// C'est le schéma validé par l'utilisateur sur Etoiles_grosses (le schéma
// précédent, recopie directe de la copie, ne s'affichait pas et n'avait pas
// de Ctrl+Z sur Sharp_MMT).
function cwApplyOnCopy( view, fn, blend )
{
   // vue verrouillée par le conteneur glissé : ni beginProcess (« already being
   // processed ») ni image.assign (« read-only image », test du 8 octobre 2026) ;
   // seuls les process natifs lancés sur elle y écrivent : fn directement sur la
   // vue (son masque attaché est respecté par les process natifs).
   if ( cwTargetLocked( view ) )
   {
      fn( view );
      return;
   }
   let cid = "cw_copie", rid = "cw_resultat";
   let win = view.window;
   let maskOn = win.maskEnabled;
   let c = cwPixelMathNew( view, "$T", cid );
   try
   {
      fn( c.mainView );
      win.maskEnabled = false;
      let r = cwPixelMathNew( view, blend ? blend( cid ) : cid, rid );
      try
      {
         view.beginProcess();
         view.image.assign( r.mainView.image );
         view.endProcess();
      }
      finally
      {
         r.forceClose();
      }
   }
   finally
   {
      win.maskEnabled = maskOn;
      cwCloseWindow( cid );
   }
   win.bringToFront();
}

// Expression de mélange copie / original selon le masque attaché à view
// (actif) : m*copie + (1-m)*$T, m inversé si le masque l'est ; null sans masque.
function cwMaskBlend( view )
{
   let win = view.window;
   if ( win.mask.isNull || !win.maskEnabled )
      return null;
   let m = win.mask.mainView.id;
   if ( win.maskInverted )
      m = "(1-" + m + ")";
   return function( cid ) { return m + "*" + cid + " + (1-" + m + ")*$T"; };
}

// Lancement fenêtre : exécute run() et affiche l'erreur éventuelle.
function cwRun( title, run )
{
   try
   {
      run();
   }
   catch ( e )
   {
      console.criticalln( e.message );
      (new MessageBox( e.message, title )).execute();
   }
}

// ---------------------------------------------------------------- fenêtre

// CWDialog( titre, aide HTML, texte de libellé le plus long )
// Méthodes : numeric, check, edit, viewList, combo, info, group / endGroup,
// button (bouton en bas), onExport (paramètres -> Parameters.set), validate
// (renvoie un message d'erreur ou ""), finish( texte du bouton OK ).
function cwBuildDialog( dlg, title, help, longestLabel )
{
   dlg.windowTitle = title;
   dlg.labelWidth = dlg.font.width( longestLabel || "Paramètre :" ) + 10;
   dlg.onExport = null;
   dlg.validate = null;
   dlg.extraButtons = [];

   dlg.helpLabel = new Label( dlg );
   dlg.helpLabel.wordWrapping = true;
   dlg.helpLabel.useRichText = true;
   dlg.helpLabel.minWidth = 480;
   dlg.helpLabel.text = help;

   dlg.rows = new VerticalSizer;
   dlg.rows.spacing = 6;
   dlg.target = dlg.rows;

   function labelFor( text )
   {
      let l = new Label( dlg );
      l.text = text;
      l.minWidth = dlg.labelWidth;
      l.textAlignment = CW_ALIGN_RIGHT;
      return l;
   }

   function row( text, control, stretch )
   {
      let s = new HorizontalSizer;
      s.spacing = 6;
      s.add( labelFor( text ) );
      s.add( control, stretch ? 100 : 0 );
      if ( !stretch )
         s.addStretch();
      dlg.target.add( s );
   }

   dlg.group = function( title )
   {
      let g = new GroupBox( dlg );
      g.title = title;
      g.sizer = new VerticalSizer;
      g.sizer.margin = 6;
      g.sizer.spacing = 4;
      dlg.rows.add( g );
      dlg.target = g.sizer;
      return g;
   };

   dlg.endGroup = function()
   {
      dlg.target = dlg.rows;
   };

   dlg.numeric = function( text, lo, hi, prec, value, tip, onChange )
   {
      let c = new NumericControl( dlg );
      c.label.text = text;
      c.label.minWidth = dlg.labelWidth;
      c.setReal( prec > 0 );
      c.setRange( lo, hi );
      c.setPrecision( prec );
      c.slider.setRange( 0, 1000 );
      c.slider.minWidth = 220;
      c.setValue( value );
      c.toolTip = tip || "";
      c.onValueUpdated = onChange;
      dlg.target.add( c );
      return c;
   };

   dlg.check = function( text, checked, tip, onCheck )
   {
      let c = new CheckBox( dlg );
      c.text = text;
      c.checked = checked;
      c.toolTip = tip || "";
      c.onCheck = onCheck;
      let s = new HorizontalSizer;
      s.addSpacing( dlg.labelWidth + 6 );
      s.add( c );
      s.addStretch();
      dlg.target.add( s );
      return c;
   };

   dlg.edit = function( text, value, tip, onChange )
   {
      let e = new Edit( dlg );
      e.text = value;
      e.toolTip = tip || "";
      e.onTextUpdated = onChange;
      row( text, e, true );
      return e;
   };

   dlg.viewList = function( text, view, tip, onSelect )
   {
      let v = new ViewList( dlg );
      v.getMainViews();
      if ( view != null && !view.isNull )
         v.currentView = view;
      v.toolTip = tip || "";
      v.onViewSelected = onSelect;
      row( text, v, true );
      return v;
   };

   dlg.combo = function( text, items, index, tip, onChange )
   {
      let c = new ComboBox( dlg );
      for ( let k = 0; k < items.length; ++k )
         c.addItem( items[ k ] );
      c.currentItem = index;
      c.toolTip = tip || "";
      c.onItemSelected = onChange;
      row( text, c, false );
      return c;
   };

   dlg.info = function( text )
   {
      let l = new Label( dlg );
      l.wordWrapping = true;
      l.useRichText = true;
      l.text = text;
      dlg.target.add( l );
      return l;
   };

   dlg.button = function( text, tip, onClick )
   {
      let b = new PushButton( dlg );
      b.text = text;
      b.toolTip = tip || "";
      b.onClick = onClick;
      dlg.extraButtons.push( b );
      return b;
   };

   dlg.finish = function( okText )
   {
      let bar = new HorizontalSizer;
      bar.spacing = 6;
      if ( dlg.onExport )
      {
         let ni = new ToolButton( dlg );
         ni.icon = dlg.scaledResource( ":/process-interface/new-instance.png" );
         ni.setScaledFixedSize( 24, 24 );
         ni.toolTip = "Nouvelle icône avec ces réglages (glisse le triangle sur le bureau).";
         ni.onMousePress = function()
         {
            this.hasFocus = true;
            this.pushed = false;
            dlg.onExport();
            dlg.newInstance();
         };
         bar.add( ni );
      }
      bar.addStretch();
      for ( let k = 0; k < dlg.extraButtons.length; ++k )
         bar.add( dlg.extraButtons[ k ] );
      let ok = new PushButton( dlg );
      ok.text = okText || "Appliquer";
      ok.defaultButton = true;
      ok.onClick = function()
      {
         let msg = dlg.validate ? dlg.validate() : "";
         if ( msg )
         {
            (new MessageBox( msg, dlg.windowTitle )).execute();
            return;
         }
         dlg.ok();
      };
      let cancel = new PushButton( dlg );
      cancel.text = "Annuler";
      cancel.onClick = function() { dlg.cancel(); };
      bar.add( ok );
      bar.add( cancel );
      dlg.sizer = new VerticalSizer;
      dlg.sizer.margin = 8;
      dlg.sizer.spacing = 8;
      dlg.sizer.add( dlg.helpLabel );
      dlg.sizer.add( dlg.rows );
      dlg.sizer.add( bar );
      dlg.adjustToContents();
   };
}
#ifdef CLODOWEG_V8
var CWDialog = class extends Dialog
{
   constructor( title, help, longestLabel )
   {
      super();
      cwBuildDialog( this, title, help, longestLabel );
   }
};
#else
function CWDialog( title, help, longestLabel )
{
   this.__base__ = Dialog;
   this.__base__();
   cwBuildDialog( this, title, help, longestLabel );
}
CWDialog.prototype = new Dialog;
#endif

#endif
