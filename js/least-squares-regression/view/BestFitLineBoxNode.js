// Copyright 2002-2014, University of Colorado Boulder

/**
 * Accordion Box Node in Least Squares Regression Simulation
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var CheckBox = require( 'SUN/CheckBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var bestFitLineBoxTitleString = 'Best-Fit Line';

  // constants
  var FONT = new PhetFont( 11 );
  var RADIO_BUTTON_OPTIONS = {
    radius: 9,
    xSpacing: 3
  };

  /**
   * {Model} model of the main simulation
   * {Object} options
   * @constructor
   */
  function BestFitLineBoxNode( model, options ) {
    AccordionBox.call( this, new VBox( {spacing: 5, children: [
        new CheckBox( new Text( 'Best-Fit Line' ), model.showBestFitLineProperty ),
        new Panel( new Text( 'Equation' ), { fill: 'white', stroke: 'black', cornerRadius: 2 } ),
        new CheckBox( new Text( 'Residuals' ), model.showResidualsOfBestFitLineProperty ),
        new CheckBox( new Text( 'Squared Residuals' ), model.showSquareResidualsOfBestFitLineProperty )
      ]} ),

      _.extend( {
        cornerRadius: 10,
        fill: 'pink',

        buttonXMargin: 10,
        buttonYMargin: 6,

        titleNode: new Text( bestFitLineBoxTitleString, {font: FONT} ),
        titleXMargin: 0,

        contentXMargin: 8,
        contentYMargin: 5
      }, options ) );
  }

  return inherit( AccordionBox, BestFitLineBoxNode );
} );