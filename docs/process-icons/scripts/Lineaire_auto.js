// ----------------------------------------------------------------------------
// Lineaire_auto.js — mode rapide, phase 3 : lance des icônes du chemin
// principal sur des vues données, en un seul double-clic.
// ----------------------------------------------------------------------------
// Paramètre « etapes » : couples icône>vue séparés par « ; » ; la vue peut
// être une liste séparée par des virgules. Le nom d'icône est donné SANS son
// numéro : C_RGB_lineaire trouve E08_C_RGB_lineaire (ou E07_…, etc.).
//   LRGB    : C_RGB_lineaire>RGB ; C_L_lineaire>L (C_RGB_lineaire comprend le SCNR vert)
//   LHaRGB  : C_RGB_couleur>RGB ; BXT_L_H>L,H ; NXT_L>L
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

#define LA_TITLE "Lineaire_auto"

function laIcon( base )
{
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

function main()
{
   let etapes = Parameters.has( "etapes" ) ? Parameters.getString( "etapes" ) : "";
   let list = etapes.split( ";" ).map( function( s ) { return s.trim(); } ).filter( function( s ) { return s.length > 0; } );
   if ( list.length == 0 )
      throw new Error( LA_TITLE + " : paramètre etapes vide." );
   console.show();
   let bilan = [];
   for ( let i = 0; i < list.length; ++i )
   {
      let parts = list[ i ].split( ">" );
      if ( parts.length != 2 )
         throw new Error( LA_TITLE + " : étape mal écrite : " + list[ i ] + " (attendu icône>vue)." );
      let ic = laIcon( parts[ 0 ].trim() );
      let vues = parts[ 1 ].split( "," ).map( function( s ) { return s.trim(); } );
      for ( let j = 0; j < vues.length; ++j )
      {
         let w = ImageWindow.windowById( vues[ j ] );
         if ( w.isNull )
            throw new Error( LA_TITLE + " : vue " + vues[ j ] + " absente (étape " + ic.name + ")." );
         console.noteln( "<end><cbr><br>" + LA_TITLE + " : " + ic.name + " sur " + vues[ j ] );
         if ( !ic.process.executeOn( w.mainView ) )
            throw new Error( LA_TITLE + " : " + ic.name + " a échoué sur " + vues[ j ] + " (voir la console)." );
         bilan.push( ic.name + " sur " + vues[ j ] );
      }
   }
   console.noteln( "<end><cbr><br>" + LA_TITLE + " : fait : " + bilan.join( ", " ) + "." );
}

main();
