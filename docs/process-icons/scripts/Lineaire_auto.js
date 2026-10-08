// ----------------------------------------------------------------------------
// Lineaire_auto.js — mode rapide, phase 3 : lance des icônes du chemin
// principal sur des vues données, en un seul double-clic.
// ----------------------------------------------------------------------------
// Paramètre « etapes » : couples icône>vue séparés par « ; » ; la vue peut
// être une liste séparée par des virgules. Le nom d'icône est donné SANS son
// numéro : C_RGB_lineaire trouve E08_C_RGB_lineaire (ou E07_…, etc.).
//   LRGB    : C_RGB_lineaire>RGB ; C_L_lineaire>L
//   LHaRGB  : C_RGB_couleur>RGB ; BXT_L_H>L,H ; NXT_L>L
// Icône suivie de « * » (ex. Opt_MAS_canaux*>S,H,O) : traitée sur une copie
// cachée puis recopiée (cwApplyOnCopy) : une étape Ctrl+Z par vue. Seulement
// pour une icône qui modifie les pixels de la vue sans créer d'image ni avoir
// besoin de l'astrométrie (MAS, NBN… ; pas SXT, SPCC, extraction).
// Les icônes doivent être chargées (fichier Conteneurs-X.xpsm) et ne contenir
// que des process natifs (un script ne peut pas lancer une icône Script).
// Une étape en erreur arrête le script : la console dit laquelle.
// Lancement : double-clic sur l'icône, puis Apply Global.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Lineaire_auto : clodoweg > Phase linéaire rapide (icônes sur RGB et L)
#feature-info  Lance des icônes du chemin principal (C_RGB_lineaire, \
   C_L_lineaire…) sur les vues données, en un seul clic.

#include "clodoweg_ui.jsh"

#define LA_TITLE "Lineaire_auto"

function laIcon( base )
{
   base = base.replace( /\*$/, "" ).trim();   // « * » = étape annulable, voir laRun
   // icône exacte, sinon E00_base à E99_base
   let names = [ base ];
   for ( let k = 0; k < 100; ++k )
      names.push( "E" + (k < 10 ? "0" : "") + k + "_" + base );
   for ( let i = 0; i < names.length; ++i )
   {
      let P = null;
      try { P = ProcessInstance.fromIcon( names[ i ] ); } catch ( e ) { P = null; }
      if ( P != null && P != undefined )
         return { name: names[ i ], process: P };
   }
   throw new Error( LA_TITLE + " : icône " + base + " introuvable (charge le fichier Conteneurs-X.xpsm)." );
}

function laParse( etapes )
{
   return etapes.split( ";" ).map( function( s ) { return s.trim(); } ).filter( function( s ) { return s.length > 0; } );
}

function laRun( etapes )
{
   let list = laParse( etapes );
   if ( list.length == 0 )
      throw new Error( LA_TITLE + " : paramètre etapes vide." );
   console.show();
   let bilan = [];
   for ( let i = 0; i < list.length; ++i )
   {
      let parts = list[ i ].split( ">" );
      if ( parts.length != 2 )
         throw new Error( LA_TITLE + " : étape mal écrite : " + list[ i ] + " (attendu icône>vue)." );
      let copie = /\*$/.test( parts[ 0 ].trim() );
      let ic = laIcon( parts[ 0 ].trim() );
      let vues = parts[ 1 ].split( "," ).map( function( s ) { return s.trim(); } );
      for ( let j = 0; j < vues.length; ++j )
      {
         let w = ImageWindow.windowById( vues[ j ] );
         if ( w.isNull )
            throw new Error( LA_TITLE + " : vue " + vues[ j ] + " absente (étape " + ic.name + ")." );
         console.noteln( "<end><cbr><br>" + LA_TITLE + " : " + ic.name + " sur " + vues[ j ] );
         if ( copie )
            // sur une copie cachée puis recopie : étape Ctrl+Z (retour de l'utilisateur, 8 octobre 2026 : pas de Ctrl+Z après R_C_MAS_canaux_rapide)
            cwApplyOnCopy( w.mainView, function( c )
            {
               if ( !ic.process.executeOn( c ) )
                  throw new Error( LA_TITLE + " : " + ic.name + " a échoué sur " + vues[ j ] + " (voir la console)." );
            } );
         else if ( !ic.process.executeOn( w.mainView ) )
            throw new Error( LA_TITLE + " : " + ic.name + " a échoué sur " + vues[ j ] + " (voir la console)." );
         bilan.push( ic.name + " sur " + vues[ j ] );
      }
   }
   console.noteln( "<end><cbr><br>" + LA_TITLE + " : fait : " + bilan.join( ", " ) + "." );
}

function laDialog( p )
{
   let d = new CWDialog( LA_TITLE, "<b>Phase linéaire rapide</b> : lance les icônes du chemin principal sur leurs vues, dans l'ordre. " +
                         "Le fichier Conteneurs doit être chargé (le script cherche les icônes E##_). " +
                         "Icône suivie de * : traitée sur une copie puis recopiée (Ctrl+Z possible).", "Étapes :" );
   let rows = laParse( p.etapes ).map( function( e ) { let parts = e.split( ">" ); return { icone: (parts[ 0 ] || "").trim(), vues: (parts[ 1 ] || "").trim() }; } );
   d.group( "Étapes (icône : vues, séparées par des virgules)" );
   for ( let k = 0; k < rows.length; ++k )
   {
      let r = rows[ k ], found = "introuvable";
      try { found = laIcon( r.icone ).name; } catch ( e ) {}
      d.edit( r.icone + " :", r.vues, "Icône " + found + ".", function( t ) { r.vues = t.trim(); } );
   }
   if ( rows.length == 0 )
      d.info( "Aucune étape : paramètre etapes vide dans l'icône." );
   d.endGroup();
   function etapes()
   {
      return rows.map( function( r ) { return r.icone + ">" + r.vues; } ).join( " ; " );
   }
   d.onExport = function() { Parameters.set( "etapes", etapes() ); };
   d.validate = function()
   {
      for ( let k = 0; k < rows.length; ++k )
      {
         try { laIcon( rows[ k ].icone ); } catch ( e ) { return e.message; }
         let vues = rows[ k ].vues.split( "," );
         for ( let j = 0; j < vues.length; ++j )
            if ( ImageWindow.windowById( vues[ j ].trim() ).isNull )
               return "Vue " + vues[ j ].trim() + " absente (étape " + rows[ k ].icone + ").";
      }
      return "";
   };
   d.finish( "Lancer" );
   if ( !d.execute() )
      return false;
   p.etapes = etapes();
   return true;
}

function main()
{
   let p = { etapes: cwParam( "etapes", "" ) };
   if ( cwWantsDialog() )
   {
      if ( laDialog( p ) )
         cwRun( LA_TITLE, function() { laRun( p.etapes ); } );
      return;
   }
   laRun( p.etapes );
}

main();
