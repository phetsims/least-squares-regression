// Copyright 2014-2019, University of Colorado Boulder

/**
 * Accordion Box Node that displays checkboxes associated with properties of Best Fit Line
 * This Node also displays the best Fit Line Equation and the sum of Squares Barometer Chart
 *
 * @author Martin Veillette (Berea College)
 */

import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import LayoutBox from '../../../../scenery/js/nodes/LayoutBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import SunConstants from '../../../../sun/js/SunConstants.js';
import leastSquaresRegressionStrings from '../../least-squares-regression-strings.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';
import LeastSquaresRegressionConstants from '../LeastSquaresRegressionConstants.js';
import EquationNode from './EquationNode.js';
import SumOfSquaredResidualsChart from './SumOfSquaredResidualsChart.js';

const bestFitLineString = leastSquaresRegressionStrings.bestFitLine;
const residualsString = leastSquaresRegressionStrings.residuals;
const squaredResidualsString = leastSquaresRegressionStrings.squaredResiduals;

/**
 * @param {Graph} graph - model of the graph
 * @param {Array.<DataPoint>} dataPoints
 * @param {Emitter} dataPointsAddedEmitter
 * @param {Object} [options]
 * @constructor
 */
function BestFitLineControlPanel( graph, dataPoints, dataPointsAddedEmitter, options ) {

  options = merge( {

    // AccordionBox options
    cornerRadius: 3
  }, options );

  this.graph = graph;

  // max length of label text for i18n
  const maxLabelWidth = 120;


  // property of the accordion Box
  this.expandedProperty = new Property( false );

  // Create the chart (barometer) displaying the sum of the squares
  this.sumOfSquaredResidualsChart = new SumOfSquaredResidualsChart(
    graph,
    graph.getBestFitLineSumOfSquaredResiduals.bind( graph ),
    dataPointsAddedEmitter,
    LeastSquaresRegressionConstants.BEST_FIT_LINE_COLOR.SUM_OF_SQUARES_COLOR,
    graph.bestFitLineSquaredResidualsVisibleProperty
  );

  // Create the 'Best Fit Line' equation
  // initial values set the spacing, the correct values for the slope and the intercept will be updated below
  const equationText = new EquationNode( { mode: 'bestFitLine' } );
  equationText.visible = false;
  this.equationText = equationText;
  const equationPanel = new Panel( equationText, {
    fill: 'white',
    stroke: LeastSquaresRegressionConstants.SMALL_PANEL_STROKE,
    cornerRadius: LeastSquaresRegressionConstants.SMALL_PANEL_CORNER_RADIUS,
    resize: false
  } );
  this.updateBestFitLineEquation();

  // Create the checkboxes
  const lineCheckbox = new Checkbox(
    new Text( bestFitLineString, {
      font: LeastSquaresRegressionConstants.CHECKBOX_TEXT_FONT,
      maxWidth: maxLabelWidth
    } ),
    graph.bestFitLineVisibleProperty
  );
  const residualsCheckbox = new Checkbox(
    new Text( residualsString, {
      font: LeastSquaresRegressionConstants.CHECKBOX_TEXT_FONT,
      maxWidth: maxLabelWidth
    } ),
    graph.bestFitLineShowResidualsProperty
  );
  const squaredResidualsCheckbox = new Checkbox(
    new Text( squaredResidualsString, {
      font: LeastSquaresRegressionConstants.CHECKBOX_TEXT_FONT,
      maxWidth: maxLabelWidth
    } ),
    graph.bestFitLineShowSquaredResidualsProperty
  );

  // Expand the touch Area
  lineCheckbox.touchArea = lineCheckbox.localBounds.dilatedXY( 8, 8 );
  residualsCheckbox.touchArea = residualsCheckbox.localBounds.dilatedXY( 8, 8 );
  squaredResidualsCheckbox.touchArea = squaredResidualsCheckbox.localBounds.dilatedXY( 8, 8 );

  // Update the control Panel upon a change of the status of the Best Fit Line Checkbox
  // No need to unlink, present for the lifetime of the sim
  graph.bestFitLineVisibleProperty.link( function( enabled ) {
    // Set Equation to invisible if there is less than one point on the graph
    if ( graph.isLinearFitDefined() ) {
      equationText.visible = enabled;
    }
    equationPanel.opacity = enabled ? 1 : SunConstants.DISABLED_OPACITY;
    residualsCheckbox.enabled = enabled;
    squaredResidualsCheckbox.enabled = enabled;
  } );

  // options for the accordion box
  options = merge( {
    buttonXMargin: 10,
    buttonYMargin: 10,
    expandCollapseButtonOptions: {
      touchAreaXDilation: 16,
      touchAreaYDilation: 16
    },
    expandedProperty: this.expandedProperty,
    titleNode: new Text( bestFitLineString, {
      font: LeastSquaresRegressionConstants.TEXT_BOLD_FONT,
      maxWidth: maxLabelWidth
    } ),
    titleXMargin: 0,
    contentXMargin: 10,
    contentYMargin: 10
  }, options );

  AccordionBox.call( this, new LayoutBox( {
      spacing: 10,
      children: [
        lineCheckbox,
        new LayoutBox( { children: [ new HStrut( 20 ), equationPanel ], orientation: 'horizontal' } ),
        residualsCheckbox,
        squaredResidualsCheckbox,
        this.sumOfSquaredResidualsChart
      ],
      align: 'left'
    } ),
    options );
}

leastSquaresRegression.register( 'BestFitLineControlPanel', BestFitLineControlPanel );

export default inherit( AccordionBox, BestFitLineControlPanel, {
  /**
   * Reset
   * @public
   */
  reset: function() {
    // Close the accordion Box
    this.expandedProperty.reset();
    this.sumOfSquaredResidualsChart.reset();
  },

  /**
   * Update the text of the best Fit Line Equation
   * @public
   */
  updateBestFitLineEquation: function() {
    if ( this.graph.isLinearFitDefined() ) {
      const linearFitParameters = this.graph.getLinearFit();
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
} );