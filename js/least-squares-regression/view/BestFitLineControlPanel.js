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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SUN/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
//  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  //var PropertySet = require( 'AXON/PropertySet' );
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
  function BestFitLineControlPanel( graph, dataPoints, options ) {

    this.expandedProperty = new Property( false );

    var sumOfSquaredResiduals = new SumOfSquaredResidualsChart(
      graph,
      dataPoints,
      graph.getBestFitLineSumOfSquaredResiduals.bind( graph ),
      LSRConstants.BEST_FIT_LINE_SQUARED_RESIDUAL_COLOR,
      graph.bestFitLineSquaredResidualsVisibleProperty
    );

    //  debugger;
    var equationText = new EquationNode( 0, 0 );
    equationText.visible = false;
    var equationPanel = new Panel( equationText, {fill: 'white', stroke: 'black', cornerRadius: 2, resize: false} );
    var linearFitParameters = graph.getLinearFit();
    if ( linearFitParameters !== null ) {
      this.equationNode = new EquationNode( linearFitParameters.slope, linearFitParameters.intercept );
    }
    else {
    }

    var lineCheckBox = CheckBox.createTextCheckBox( bestFitLineString, LSRConstants.TEXT_FONT, graph.bestFitLineVisibleProperty );
    var residualsCheckBox = CheckBox.createTextCheckBox( residualsString, LSRConstants.TEXT_FONT, graph.bestFitLineShowResidualsProperty );
    var squaredResidualsCheckBox = CheckBox.createTextCheckBox( squaredResidualsString, LSRConstants.TEXT_FONT, graph.bestFitLineShowSquaredResidualsProperty );

    graph.bestFitLineVisibleProperty.link( function( enabled ) {
      // TODO find less hacky way to toogle equationText visibility (using derived property perhaps)
      if ( graph.dataPointsOnGraph.length > 1 ) {
        equationText.visible = enabled;
      }
      equationPanel.opacity = enabled ? 1 : 0.3;
      residualsCheckBox.enabled = enabled;
      squaredResidualsCheckBox.enabled = enabled;
    } );

    AccordionBox.call( this, new VBox( {
        spacing: 5, children: [
          lineCheckBox,
          //    equationPanel,
          new HBox( {children: [new HStrut( 20 ), equationPanel]} ),
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

        expandedProperty: this.expandedProperty,
        resize: false,

        titleNode: new Text( bestFitLineString, {font: LSRConstants.TEXT_FONT_BOLD} ),
        titleXMargin: 0,

        contentXMargin: 8,
        contentYMargin: 5
      }, options ) );

    // Handle the comings and goings of  dataPoints.
    dataPoints.addItemAddedListener( function( addedDataPoint ) {
      addedDataPoint.positionProperty.link( function() {
        var linearFitParameters = graph.getLinearFit();
        if ( linearFitParameters !== null ) {
          equationText.setSlopeText( linearFitParameters.slope );
          equationText.setInterceptText( linearFitParameters.intercept );
          if ( graph.bestFitLineVisibleProperty.value ) {
            equationText.setToVisible();
          }
        }
        else {
          equationText.setToInvisible();
        }

      } );
    } );
  }

  return inherit( AccordionBox, BestFitLineControlPanel, {
      reset: function() {
        this.expandedProperty.reset();
      },

      update: function() {

      }
    }
  )
    ;
} );