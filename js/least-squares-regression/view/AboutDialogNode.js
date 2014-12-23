// Copyright 2002-2014, University of Colorado Boulder

/**
 * Shows the About dialog.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  //var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  //var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var VStrut = require( 'SUN/VStrut' );
  var Dialog = require( 'JOIST/Dialog' );

  /**
   * @param {Property.<DataSet>} selectedDataSetProperty
   * @param {Bounds2} layoutBounds
   * @constructor
   */
  function AboutDialog( selectedDataSetProperty, layoutBounds ) {
    var dialog = this;

    var referenceText = new Text( selectedDataSetProperty.value.reference, {font: new PhetFont( 16 )} );
    var sourceText = new Text( selectedDataSetProperty.value.source, {font: new PhetFont( 12 )} );
    var source2Text = new Text( 'CU', {font: new PhetFont( 12 )} );
    var children = [
      referenceText,
      new VStrut( 15 ),
      sourceText,
      source2Text
    ];

    selectedDataSetProperty.link( function( selectedDataSet ) {
      referenceText.text = selectedDataSet.reference;
      sourceText.text = selectedDataSet.source;
    } );


    var content = new VBox( {align: 'left', spacing: 5, children: children} );

    Dialog.call( this, content, {
      titleAlign: 'center',
      modal: true,
      hasCloseButton: true,
      layoutStrategy: function( dialog, simBounds, screenBounds, scale ) {
        dialog.setScaleMagnitude( 1 );
        dialog.center = layoutBounds.center;
      }
    } );

    // close it on a click
    this.addInputListener( new ButtonListener( {
      fire: dialog.hide.bind( dialog )
    } ) );

    //TODO: The peer should not be in the DOM if the button is invisible
    this.addPeer( '<input type="button" aria-label="Close About Dialog">', {
      click: function() {
        dialog.hide();
      },

      //Visit this button after the user has added some pullers to the rope
      tabIndex: 20000,

      onAdded: function( peer ) {
        peer.peerElement.focus();
      }
    } );
  }

  return inherit( Dialog, AboutDialog );
} );