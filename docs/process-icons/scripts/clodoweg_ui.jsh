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

#include <pjsr/Sizer.jsh>
#include <pjsr/TextAlign.jsh>
#include <pjsr/NumericControl.jsh>

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

// fn( copie ) travaille sur une copie cachée de view,
// puis le résultat remplace l'image de view en une étape d'annulation.
function cwApplyOnCopy( view, fn )
{
   let id = "cw_copie";
   cwCloseWindow( id );
   let P = new PixelMath;
   P.expression = "$T";
   P.useSingleExpression = true;
   P.createNewImage = true;
   P.showNewImage = false;
   P.newImageId = id;
   P.newImageColorSpace = PixelMath.prototype.SameAsTarget;
   P.newImageSampleFormat = PixelMath.prototype.SameAsTarget;
   P.rescale = false;
   P.truncate = false;
   P.executeOn( view );
   let w = ImageWindow.windowById( id );
   if ( w.isNull )
      throw new Error( "copie de travail non créée." );
   try
   {
      fn( w.mainView );
      view.beginProcess();
      view.image.assign( w.mainView.image );
      view.endProcess();
   }
   finally
   {
      w.forceClose();
   }
   view.window.bringToFront();
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
function CWDialog( title, help, longestLabel )
{
   this.__base__ = Dialog;
   this.__base__();
   let dlg = this;
   this.windowTitle = title;
   this.labelWidth = this.font.width( longestLabel || "Paramètre :" ) + 10;
   this.onExport = null;
   this.validate = null;
   this.extraButtons = [];

   this.helpLabel = new Label( this );
   this.helpLabel.wordWrapping = true;
   this.helpLabel.useRichText = true;
   this.helpLabel.minWidth = 480;
   this.helpLabel.text = help;

   this.rows = new VerticalSizer;
   this.rows.spacing = 6;
   this.target = this.rows;

   function labelFor( text )
   {
      let l = new Label( dlg );
      l.text = text;
      l.minWidth = dlg.labelWidth;
      l.textAlignment = TextAlign_Right | TextAlign_VertCenter;
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

   this.group = function( title )
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

   this.endGroup = function()
   {
      dlg.target = dlg.rows;
   };

   this.numeric = function( text, lo, hi, prec, value, tip, onChange )
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

   this.check = function( text, checked, tip, onCheck )
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

   this.edit = function( text, value, tip, onChange )
   {
      let e = new Edit( dlg );
      e.text = value;
      e.toolTip = tip || "";
      e.onTextUpdated = onChange;
      row( text, e, true );
      return e;
   };

   this.viewList = function( text, view, tip, onSelect )
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

   this.combo = function( text, items, index, tip, onChange )
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

   this.info = function( text )
   {
      let l = new Label( dlg );
      l.wordWrapping = true;
      l.useRichText = true;
      l.text = text;
      dlg.target.add( l );
      return l;
   };

   this.button = function( text, tip, onClick )
   {
      let b = new PushButton( dlg );
      b.text = text;
      b.toolTip = tip || "";
      b.onClick = onClick;
      dlg.extraButtons.push( b );
      return b;
   };

   this.finish = function( okText )
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
            this.dialog.newInstance();
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
CWDialog.prototype = new Dialog;

#endif
