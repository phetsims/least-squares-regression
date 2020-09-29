// Copyright 2014-2020, University of Colorado Boulder

//TODO rename to BestFitLineAccordionBox
/**
 * Accordion Box Node that displays checkboxes associated with properties of Best Fit Line
 * This Node also displays the best Fit Line Equation and the sum of Squares Barometer Chart
 *
 * @author Martin Veillette (Berea College)
 */

import merge from '../../../../phet-core/js/merge.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import LayoutBox from '../../../../scenery/js/nodes/LayoutBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import SunConstants from '../../../../sun/js/SunConstants.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';
import leastSquaresRegressionStrings from '../../leastSquaresRegressionStrings.js';
import LeastSquaresRegressionConstants from '../LeastSquaresRegressionConstants.js';
import EquationNode from './EquationNode.js';
import SumOfSquaredResidualsChart from './SumOfSquaredResidualsChart.js';

// constants
const MAX_LABEL_WIDTH = 120; // max length of label text for i18n

const bestFitLineString = leastSquaresRegressionStrings.bestFitLine;
const residualsString = leastSquaresRegressionStrings.residuals;
const squaredResidualsString = leastSquaresRegressionStrings.squaredResiduals;

class BestFitLineControlPanel extends AccordionBox {

  /**
   * @param {Graph} graph - model of the graph
   * @param {Array.<DataPoint>} dataPoints
   * @param {Emitter} dataPointsAddedEmitter
   * @param {Object} [options]
   */
  constructor( graph, dataPoints, dataPointsAddedEmitter, options ) {

    // options for the accordion box
    options = merge( {
      cornerRadius: 3,
      buttonXMargin: 10,
      buttonYMargin: 10,
      expandCollapseButtonOptions: {
        touchAreaXDilation: 16,
        touchAreaYDilation: 16
      },
      titleNode: new Text( bestFitLineString, {
        font: LeastSquaresRegressionConstants.TEXT_BOLD_FONT,
        maxWidth: MAX_LABEL_WIDTH
      } ),
      titleXMargin: 0,
      contentXMargin: 10,
      contentYMargin: 10
    }, options );

    // Create the chart (barometer) displaying the sum of the squares
    const sumOfSquaredResidualsChart = new SumOfSquaredResidualsChart(
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
    const equationPanel = new Panel( equationText, {
      fill: 'white',
      stroke: LeastSquaresRegressionConstants.SMALL_PANEL_STROKE,
      cornerRadius: LeastSquaresRegressionConstants.SMALL_PANEL_CORNER_RADIUS,
      resize: false
    } );

    const textOptions = {
      font: LeastSquaresRegressionConstants.CHECKBOX_TEXT_FONT,
      maxWidth: MAX_LABEL_WIDTH
    };

    // Create the checkboxes
    const lineCheckbox = new Checkbox(
      new Text( bestFitLineString, textOptions ),
      graph.bestFitLineVisibleProperty
    );
    const residualsCheckbox = new Checkbox(
      new Text( residualsString, textOptions ),
      graph.bestFitLineShowResidualsProperty
    );
    const squaredResidualsCheckbox = new Checkbox(
      new Text( squaredResidualsString, textOptions ),
      graph.bestFitLineShowSquaredResidualsProperty
    );

    // Expand the touch Area
    lineCheckbox.touchArea = lineCheckbox.localBounds.dilatedXY( 8, 8 );
    residualsCheckbox.touchArea = residualsCheckbox.localBounds.dilatedXY( 8, 8 );
    squaredResidualsCheckbox.touchArea = squaredResidualsCheckbox.localBounds.dilatedXY( 8, 8 );

    // Update the control Panel upon a change of the status of the Best Fit Line Checkbox
    // No need to unlink, present for the lifetime of the sim
    graph.bestFitLineVisibleProperty.link( enabled => {
      // Set Equation to invisible if there is less than one point on the graph
      if ( graph.isLinearFitDefined() ) {
        equationText.visible = enabled;
      }
      equationPanel.opacity = enabled ? 1 : SunConstants.DISABLED_OPACITY;
      residualsCheckbox.enabled = enabled;
      squaredResidualsCheckbox.enabled = enabled;
    } );

    const content = new LayoutBox( {
      spacing: 10,
      children: [
        lineCheckbox,
        new LayoutBox( { children: [ new HStrut( 20 ), equationPanel ], orientation: 'horizontal' } ),
        residualsCheckbox,
        squaredResidualsCheckbox,
        sumOfSquaredResidualsChart
      ],
      excludeInvisibleChildrenFromBounds: false,
      align: 'left'
    } );

    super( content, options );

    // @private
    this.graph = graph;
    this.equationText = equationText;
    this.sumOfSquaredResidualsChart = sumOfSquaredResidualsChart;

    this.updateBestFitLineEquation();
  }

  /**
   * @public
   * @override
   */
  reset() {
    this.sumOfSquaredResidualsChart.reset();
    super.reset();
  }

  /**
   * Update the text of the best Fit Line Equation
   * @public
   */
  updateBestFitLineEquation() {
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
}

leastSquaresRegression.register( 'BestFitLineControlPanel', BestFitLineControlPanel );
export default BestFitLineControlPanel;