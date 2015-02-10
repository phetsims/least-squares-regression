// Copyright 2002-2015, University of Colorado Boulder

/**
 * Accordion Box Node that displays check boxes associated with properties of Best Fit Line
 * This Node also displays the best Fit Line Equation and the sum of Squares Barometer Chart
 *
 * @author Martin Veillette (Berea College)
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
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var SumOfSquaredResidualsChart = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/SumOfSquaredResidualsChart' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var bestFitLineString = require( 'string!LEAST_SQUARES_REGRESSION/bestFitLine' );
  var residualsString = require( 'string!LEAST_SQUARES_REGRESSION/residuals' );
  var squaredResidualsString = require( 'string!LEAST_SQUARES_REGRESSION/squaredResiduals' );

  /**
   * @param {Graph} graph - model of the graph
   * @param {Array.<DataPoint>} dataPoints
   * @param {Function} onEvent - listener function when event is trigger
   * @param {Object} [options]
   * @constructor
   */
  function BestFitLineControlPanel( graph, dataPoints, onEvent, options ) {

    this.graph = graph;
    var thisControlPanel = this;

    // property of the accordion Box that control the expanded
    this.expandedProperty = new Property( false );

    var sumOfSquaredResidualsChart = new SumOfSquaredResidualsChart(
      graph,
      dataPoints,
      graph.getBestFitLineSumOfSquaredResiduals.bind( graph ),
      onEvent,
      LSRConstants.BEST_FIT_LINE_COLOR.SUM_OF_SQUARES_COLOR,
      graph.bestFitLineSquaredResidualsVisibleProperty
    );

    var equationText = new EquationNode( 0, 0 );
    equationText.visible = false;
    var equationPanel = new Panel( equationText, {
      fill: 'white',
      stroke: 'black',
      cornerRadius: LSRConstants.SMALL_PANEL_CORNER_RADIUS,
      resize: false
    } );
    var linearFitParameters = graph.getLinearFit();
    if ( linearFitParameters !== null ) {
      this.equationNode = new EquationNode( linearFitParameters.slope * graph.slopeFactor, linearFitParameters.intercept * graph.interceptFactor );
    }

    // Create the checkBoxes
    var lineCheckBox = CheckBox.createTextCheckBox( bestFitLineString, { font: LSRConstants.CHECK_BOX_TEXT_FONT }, graph.bestFitLineVisibleProperty );
    var residualsCheckBox = CheckBox.createTextCheckBox( residualsString, { font: LSRConstants.CHECK_BOX_TEXT_FONT }, graph.bestFitLineShowResidualsProperty );
    var squaredResidualsCheckBox = CheckBox.createTextCheckBox( squaredResidualsString, { font: LSRConstants.CHECK_BOX_TEXT_FONT }, graph.bestFitLineShowSquaredResidualsProperty );

    graph.bestFitLineVisibleProperty.link( function( enabled ) {
      // Set Equation to invisible if there is less than one point on the graph
      if ( graph.dataPointsOnGraph.length > 1 ) {
        equationText.visible = enabled;
      }
      equationPanel.opacity = enabled ? 1 : 0.3;
      residualsCheckBox.enabled = enabled;
      squaredResidualsCheckBox.enabled = enabled;
    } );

    options = _.extend( {
      buttonXMargin: 10,
      buttonYMargin: 10,
      expandedProperty: this.expandedProperty,
      titleNode: new Text( bestFitLineString, { font: LSRConstants.TEXT_FONT_BOLD } ),
      titleXMargin: 0,
      contentXMargin: 10,
      contentYMargin: 10
    }, options );

    AccordionBox.call( this, new VBox( {
        spacing: 10, children: [
          lineCheckBox,
          new HBox( { children: [ new HStrut( 20 ), equationPanel ] } ),
          residualsCheckBox,
          squaredResidualsCheckBox,
          sumOfSquaredResidualsChart
        ], align: 'left'
      } ),
      options );

    // Handle the comings and goings of  dataPoints.
    dataPoints.addItemAddedListener( function( addedDataPoint ) {

      addedDataPoint.positionProperty.link( function() {
        thisControlPanel.updateBestFitLineEquation();
      } );
    } );

    // The title of the control Panel (Accordion Box)  is set to invisible when the control panel is expanded
    this.expandedProperty.link( function( expanded ) {
      options.titleNode.visible = !expanded;
    } );

    this.equationText = equationText;
  }

  return inherit( AccordionBox, BestFitLineControlPanel, {
      reset: function() {
        this.expandedProperty.reset();
      },
      /**
       * @public
       */
      updateBestFitLineEquation: function() {
        var linearFitParameters = this.graph.getLinearFit();
        if ( linearFitParameters !== null ) {
          this.equationText.setSlopeText( linearFitParameters.slope * this.graph.slopeFactor );
          this.equationText.setInterceptText( linearFitParameters.intercept * this.graph.interceptFactor + this.graph.interceptOffset );
          if ( this.graph.bestFitLineVisibleProperty.value ) {
            this.equationText.visible = true;
          }
        }
        else {
          this.equationText.visible = false;
        }
      }
    }
  )
    ;
} );