// Copyright 2014-2024, University of Colorado Boulder

/**
 * Scenery Node representing a Control Panel with check Boxes and Sliders that controls properties of My Line
 *
 * @author Martin Veillette (Berea College)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { HStrut, ManualConstraint, Node, SceneryConstants, Text, VBox } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import VSlider from '../../../../sun/js/VSlider.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';
import LeastSquaresRegressionStrings from '../../LeastSquaresRegressionStrings.js';
import LeastSquaresRegressionConstants from '../LeastSquaresRegressionConstants.js';
import Graph from '../model/Graph.js';
import EquationNode from './EquationNode.js';
import SumOfSquaredResidualsChart from './SumOfSquaredResidualsChart.js';

// constants
const SLIDER_OPTIONS = {
  trackFill: 'black',
  trackSize: new Dimension2( 2, 190 ),
  thumbSize: new Dimension2( 30, 15 ),
  thumbTouchAreaXDilation: 8,
  majorTickLength: 18
};
const MAX_WIDTH = 120;

export default class MyLineControlPanel extends Panel {
  public readonly sumOfSquaredResiduals: SumOfSquaredResidualsChart;

  public constructor( graph: Graph, dataPointsAddedEmitter: Emitter, options: PanelOptions ) {

    // Create a mutable equation y = {1} x + {2} , the slope and intercept are updated later
    // max width determined empirically, and there are 6 elements that make up the equation node
    const equationCharacterMaxWidth = MAX_WIDTH / 6;
    const equationText = new EquationNode( { maxCharacterWidth: equationCharacterMaxWidth } );

    /**
     * Function that updates the value of the current slope (based on the angle of the line)
     */
    function updateTextSlope( angle: number ): void {
      const slope = graph.slope( angle );
      equationText.setSlopeText( slope * graph.slopeFactor );
    }

    /**
     * Function that updates the value of the intercept
     */
    function updateTextIntercept( intercept: number ): void {
      equationText.setInterceptText( intercept * graph.interceptFactor + graph.interceptOffset );
    }

    updateTextIntercept( 0 );
    updateTextSlope( 0 );

    // Create an immutable equation y = a x + b
    const blackOptions = {
      font: LeastSquaresRegressionConstants.TEXT_FONT,
      fill: 'black',
      maxWidth: equationCharacterMaxWidth
    };
    const boldOptions = {
      font: LeastSquaresRegressionConstants.TEXT_BOLD_FONT,
      fill: LeastSquaresRegressionConstants.MY_LINE_COLOR.BASE_COLOR,
      maxWidth: equationCharacterMaxWidth
    };

    const yText = new Text( LeastSquaresRegressionStrings.symbol.yStringProperty, blackOptions ); // 'y'
    const equalText = new Text( '=', blackOptions ); // the '=' sign
    const aText = new Text( LeastSquaresRegressionStrings.aStringProperty, boldOptions ); // a number
    const xText = new Text( LeastSquaresRegressionStrings.symbol.xStringProperty, blackOptions ); // 'x'
    const signInterceptText = new Text( MathSymbols.PLUS, blackOptions );// '+'
    const bText = new Text( LeastSquaresRegressionStrings.bStringProperty, boldOptions );// a number

    const immutableEquationText = new Node( {
      children: [
        yText,
        equalText,
        aText,
        xText,
        signInterceptText,
        bText
      ]
    } );

    // Layout the immutable equation
    yText.centerX = equationText.yText.centerX;
    equalText.centerX = equationText.equalText.centerX;
    aText.centerX = equationText.valueSlopeText.centerX;
    xText.centerX = equationText.xText.centerX;
    signInterceptText.centerX = equationText.signInterceptText.centerX;
    bText.centerX = equationText.valueInterceptText.centerX;

    // create the equation panel with white background
    const equationPanel = new Panel( equationText, {
      fill: 'white',
      cornerRadius: LeastSquaresRegressionConstants.SMALL_PANEL_CORNER_RADIUS,
      stroke: LeastSquaresRegressionConstants.SMALL_PANEL_STROKE,
      resize: true // here
    } );

    // Create two sliders: The aSlider controls the angle of the line and by proxy the slope, the bSlider controls the intercept
    const sliderInterceptRange = new Range( -1.5 * graph.bounds.maxY, 1.5 * graph.bounds.maxY );
    const maxSlope = 10; // determines the maximum slope (using the graph bounds as reference, i.e. the unit square)

    const aSlider = new VSlider( graph.angleProperty, new Range( -Math.atan( maxSlope ), Math.atan( maxSlope ) ), SLIDER_OPTIONS );
    aSlider.addMajorTick( 0 );
    const bSlider = new VSlider( graph.interceptProperty, sliderInterceptRange, SLIDER_OPTIONS );
    bSlider.addMajorTick( 0 );

    // Create label below the sliders
    const aSliderText = new Text( LeastSquaresRegressionStrings.aStringProperty, merge( { maxWidth: MAX_WIDTH }, boldOptions ) );
    const bSliderText = new Text( LeastSquaresRegressionStrings.bStringProperty, merge( { maxWidth: MAX_WIDTH }, boldOptions ) );

    // collect the immutable equation, the mutable equation and the sliders in one node
    const rightAlignedNode = new Node();
    const hStrut = new HStrut( 20 );
    rightAlignedNode.addChild( equationPanel );
    rightAlignedNode.addChild( immutableEquationText );
    rightAlignedNode.addChild( aSlider );
    rightAlignedNode.addChild( bSlider );
    rightAlignedNode.addChild( aSliderText );
    rightAlignedNode.addChild( bSliderText );
    rightAlignedNode.addChild( hStrut );

    const VBOX_SPACING = 10;

    // Create three checkboxes
    const checkboxTextOptions = { font: LeastSquaresRegressionConstants.CHECKBOX_TEXT_FONT, maxWidth: MAX_WIDTH };
    const lineCheckbox = new Checkbox( graph.myLineVisibleProperty, new Text( LeastSquaresRegressionStrings.myLineStringProperty, checkboxTextOptions ) );
    const residualsCheckbox = new Checkbox( graph.myLineShowResidualsProperty, new Text( LeastSquaresRegressionStrings.residualsStringProperty, checkboxTextOptions ) );
    const squaredResidualsCheckbox = new Checkbox( graph.myLineShowSquaredResidualsProperty, new Text( LeastSquaresRegressionStrings.squaredResidualsStringProperty, checkboxTextOptions ) );

    // Expand the touch Area
    lineCheckbox.touchArea = lineCheckbox.localBounds.dilatedXY( 8, VBOX_SPACING / 2 );
    residualsCheckbox.touchArea = residualsCheckbox.localBounds.dilatedXY( 8, VBOX_SPACING / 2 );
    squaredResidualsCheckbox.touchArea = squaredResidualsCheckbox.localBounds.dilatedXY( 8, VBOX_SPACING / 2 );

    // Create the barometer chart for the sum of the squares
    const sumOfSquaredResiduals = new SumOfSquaredResidualsChart(
      graph,
      graph.getMyLineSumOfSquaredResiduals.bind( graph ),
      dataPointsAddedEmitter,
      LeastSquaresRegressionConstants.MY_LINE_COLOR.SUM_OF_SQUARES_COLOR,
      graph.myLineSquaredResidualsVisibleProperty
    );

    // assemble all the previous nodes in a vertical box
    const mainBox = new VBox( {
      spacing: VBOX_SPACING,
      children: [
        lineCheckbox,
        rightAlignedNode,
        residualsCheckbox,
        squaredResidualsCheckbox,
        sumOfSquaredResiduals
      ],
      align: 'left',
      excludeInvisibleChildrenFromBounds: false
    } );

    // layout the internal nodes of the right Aligned Node
    equationPanel.left = hStrut.right;
    equationPanel.top = lineCheckbox.bottom;
    immutableEquationText.top = equationPanel.bottom + 12;
    immutableEquationText.left = equationPanel.left + 5;
    aSlider.top = immutableEquationText.bottom + 10;
    bSlider.top = immutableEquationText.bottom + 10;
    aSlider.centerX = immutableEquationText.left + aText.centerX;
    bSlider.centerX = immutableEquationText.left + bText.centerX;
    aSliderText.top = aSlider.bottom + 8;
    bSliderText.top = bSlider.bottom + 8;
    aSliderText.centerX = aSlider.centerX;
    bSliderText.centerX = bSlider.centerX;

    super( mainBox, options );

    ManualConstraint.create( this, [ yText, equalText, aText, xText, signInterceptText, bText,
      equationText.valueInterceptText,
      equationText.valueSlopeText,
      equationText.yText,
      equationText.equalText,
      equationText.xText,
      equationText.signInterceptText,
      equationText
    ], ( yTextProxy, equalTextProxy, aTextProxy, xTextProxy, signInterceptTextProxy, bTextProxy,
         equationTextValueInterceptTextProxy,
         equationTextValueSlopeTextProxy,
         equationTextYTextProxy,
         equationTextEqualTextProxy,
         equationTextXTextProxy,
         equationTextSignInterceptTextProxy
    ) => {
      yTextProxy.centerX = equationTextYTextProxy.centerX;
      equalTextProxy.centerX = equationTextEqualTextProxy.centerX;
      aTextProxy.centerX = equationTextValueSlopeTextProxy.centerX;
      xTextProxy.centerX = equationTextXTextProxy.centerX;
      signInterceptTextProxy.centerX = equationTextSignInterceptTextProxy.centerX;
      bTextProxy.centerX = equationTextValueInterceptTextProxy.centerX;
    } );

    // Trigger the opacity/non-opacity when checking the myLine checkbox
    graph.myLineVisibleProperty.link( enabled => {
      equationText.setEquationVisible( enabled );
      aSlider.pickable = enabled; // enable/disable slider
      bSlider.pickable = enabled;// enable/disable slider
      residualsCheckbox.enabled = enabled;
      squaredResidualsCheckbox.enabled = enabled;
      rightAlignedNode.opacity = enabled ? 1 : SceneryConstants.DISABLED_OPACITY;
    } );

    // update the text (slope) of the equation when the aSlider is moving
    graph.angleProperty.link( angle => {
      updateTextSlope( angle );
    } );

    // update the text (intercept) of the equation when the bSlider is moving
    graph.interceptProperty.link( intercept => {
      updateTextIntercept( intercept );
    } );

    // Trigger an update after all the points have been added in bulk to the model
    // Update the equation text
    dataPointsAddedEmitter.addListener( () => {
      updateTextSlope( graph.angleProperty.value );
      updateTextIntercept( graph.interceptProperty.value );
    } );

    this.sumOfSquaredResiduals = sumOfSquaredResiduals;
  }

  public reset(): void {
    this.sumOfSquaredResiduals.reset();
  }
}

leastSquaresRegression.register( 'MyLineControlPanel', MyLineControlPanel );