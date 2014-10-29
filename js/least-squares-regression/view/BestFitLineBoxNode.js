// Copyright 2002-2014, University of Colorado Boulder

/**
 * Accordion Box Node in Least Squares Regression Simulation
 *
 */

define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var CheckBox = require( 'SUN/CheckBox' );
  // var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Panel = require( 'SUN/Panel' );
  //var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  // var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var bestFitLineString = require( 'string!LEAST_SQUARES_REGRESSION/bestFitLine' );
  var residualsString = require( 'string!LEAST_SQUARES_REGRESSION/residuals' );
  var squaredResidualsString = require( 'string!LEAST_SQUARES_REGRESSION/squaredResiduals' );

  // constants
//  var FONT = new PhetFont( 11 );

  /**
   * {Model} model of the main simulation
   * {Object} options
   * @constructor
   */
  function BestFitLineBoxNode( model, options ) {
    AccordionBox.call( this, new VBox( {spacing: 5, children: [
        new CheckBox( new Text( bestFitLineString, LSRConstants.TEXT_FONT ), model.showBestFitLineProperty ),
        new Panel( new Text( 'Equation' ), { fill: 'white', stroke: 'black', cornerRadius: 2 } ),
        new CheckBox( new Text( residualsString, LSRConstants.TEXT_FONT ), model.showResidualsOfBestFitLineProperty ),
        new CheckBox( new Text( squaredResidualsString, LSRConstants.TEXT_FONT ), model.showSquareResidualsOfBestFitLineProperty )
      ], align: 'left'} ),

      _.extend( {
        cornerRadius: LSRConstants.CONTROL_PANEL_CORNER_RADIUS,
        fill: LSRConstants.CONTROL_PANEL_BACKGROUND_COLOR,

        buttonXMargin: 10,
        buttonYMargin: 6,

        titleNode: new Text( bestFitLineString, {font: LSRConstants.TEXT_FONT_BOLD} ),
        titleXMargin: 0,

        contentXMargin: 8,
        contentYMargin: 5
      }, options ) );
  }

  return inherit( AccordionBox, BestFitLineBoxNode );
} );