// Copyright 2002-2014, University of Colorado Boulder

/**
 * Shows a dialog box about the source and references of the selected Data Set.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Dialog = require( 'JOIST/Dialog' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var sourceString = require( 'string!LEAST_SQUARES_REGRESSION/source' );
  var colonPunctuationString = require( 'string!LEAST_SQUARES_REGRESSION/colonPunctuation' );

  /**
   * @param {Property.<DataSet>} selectedDataSetProperty
   * @param {Bounds2} layoutBounds
   * @constructor
   */
  function SourceAndReferenceNode( selectedDataSetProperty, layoutBounds ) {
    var dialog = this;

    var referenceText = new MultiLineText( '', {font: LSRConstants.REFERENCE_FONT, align: 'left'} );
    var sourceText = new MultiLineText( '', {font: LSRConstants.SOURCE_FONT, align: 'left'} );

    var children = [
      referenceText,
      sourceText
    ];

    var content = new VBox( {align: 'left', spacing: 20, children: children} );

    Dialog.call( this, content, {
      modal: true,
      hasCloseButton: true,
      layoutStrategy: function( dialog, simBounds, screenBounds, scale ) {
        dialog.setScaleMagnitude( scale );
        dialog.centerX = layoutBounds.centerX;
        dialog.centerY = layoutBounds.centerY;
      }
    } );

    selectedDataSetProperty.link( function( selectedDataSet ) {
      referenceText.text = selectedDataSet.reference;
      sourceText.text = sourceString + colonPunctuationString + selectedDataSet.source;
    } );


    // close it on a click
    this.addInputListener( new ButtonListener( {
      fire: dialog.hide.bind( dialog )
    } ) );

    //TODO: The peer should not be in the DOM if the button is invisible
    this.addPeer( '<input type="button" aria-label="Close Dialog">', {
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

  return inherit( Dialog, SourceAndReferenceNode );
} );