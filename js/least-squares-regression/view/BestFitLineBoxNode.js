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
  var EquationNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/EquationNode' );
  // var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
//  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  // var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  // var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SumOfSquaredResidualsChart = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/SumOfSquaredResidualsChart' );
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


    var sumOfSquaredResiduals = new SumOfSquaredResidualsChart( model, model.graph.getBestFitLineSumOfSquaredResiduals.bind( model.graph ), LSRConstants.BEST_FIT_LINE_SQUARED_RESIDUAL_COLOR, model.showSquareResidualsOfBestFitLineProperty );

    //  debugger;
    var equationText = new Text( 'y = 1000x + 1000' );
    var equationPanel = new Panel( equationText, {fill: 'white', stroke: 'black', cornerRadius: 2, resize: false} );
    var linearFitParameters = model.graph.getLinearFit();
    if ( linearFitParameters !== null ) {
      this.equationNode = new EquationNode( linearFitParameters.slope, linearFitParameters.intercept );
    }
    else {
    }

    var lineCheckBox = CheckBox.createTextCheckBox( bestFitLineString, LSRConstants.TEXT_FONT, model.showBestFitLineProperty );
    var residualsCheckBox = CheckBox.createTextCheckBox( residualsString, LSRConstants.TEXT_FONT, model.showResidualsOfBestFitLineProperty );
    var squaredResidualsCheckBox = CheckBox.createTextCheckBox( squaredResidualsString, LSRConstants.TEXT_FONT, model.showSquareResidualsOfBestFitLineProperty );


    model.showBestFitLineProperty.linkAttribute( residualsCheckBox, 'enabled' );
    model.showBestFitLineProperty.linkAttribute( squaredResidualsCheckBox, 'enabled' );
    model.showBestFitLineProperty.link( function( enabled ) {
      equationPanel.opacity = enabled ? 1 : 0.3;
    } );


    AccordionBox.call( this, new VBox( {
        spacing: 5, children: [
          lineCheckBox,
          equationPanel,
          residualsCheckBox,
          squaredResidualsCheckBox,
          sumOfSquaredResiduals
        ], align: 'left'
      } ),

      _.extend( {
        cornerRadius: LSRConstants.CONTROL_PANEL_CORNER_RADIUS,
        fill: LSRConstants.CONTROL_PANEL_BACKGROUND_COLOR,

        buttonXMargin: 10,
        buttonYMargin: 6,

        expandedProperty: new Property( false ),
        resize: false,

        titleNode: new Text( bestFitLineString, {font: LSRConstants.TEXT_FONT_BOLD} ),
        titleXMargin: 0,

        contentXMargin: 8,
        contentYMargin: 5
      }, options ) );


    // Handle the comings and goings of  dataPoints.
    model.dataPoints.addItemAddedListener( function( addedDataPoint ) {
      addedDataPoint.positionProperty.link( function() {
        var linearFitParameters = model.graph.getLinearFit();
        if ( linearFitParameters !== null ) {
          equationPanel.removeChild( equationText );
          equationText = new EquationNode( linearFitParameters.slope, linearFitParameters.intercept );
          equationPanel.addChild( equationText );
        }
        else {
          //   equationText = null;
        }

      } );
    } );
  }

  return inherit( AccordionBox, BestFitLineBoxNode,
    {
      update: function() {

      }
    } );
} );