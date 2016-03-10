// Copyright 2014-2015, University of Colorado Boulder

/**
 * Scenery Node representing a Control Panel with check Boxes and Sliders that controls properties of My Line
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var EquationNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/EquationNode' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Range = require( 'DOT/Range' );
  var SumOfSquaredResidualsChart = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/SumOfSquaredResidualsChart' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var aString = require( 'string!LEAST_SQUARES_REGRESSION/a' );
  var bString = require( 'string!LEAST_SQUARES_REGRESSION/b' );
  var symbolXString = require( 'string!LEAST_SQUARES_REGRESSION/symbol.x' );
  var symbolYString = require( 'string!LEAST_SQUARES_REGRESSION/symbol.y' );
  var plusString = '\u002B'; // we want a large + sign
  var myLineString = require( 'string!LEAST_SQUARES_REGRESSION/myLine' );
  var residualsString = require( 'string!LEAST_SQUARES_REGRESSION/residuals' );
  var squaredResidualsString = require( 'string!LEAST_SQUARES_REGRESSION/squaredResiduals' );

  // constants
  var SLIDER_OPTIONS = {
    trackFill: 'black',
    trackSize: new Dimension2( 190, 2 ),
    thumbSize: new Dimension2( 15, 30 )
  };
  var TICK_COLOR = 'black';
  var TICK_LENGTH = 10;
  var TICK_WIDTH = 2;
  var MAX_WIDTH = 150;

  /**
   * Create a vertical slider with a central tick
   * @param {Property.<number>} property parameter to track.
   * @param {Range} range - Possible range for property.
   * @param {Object} [options] for slider node.
   * @constructor
   */
  function verticalSlider( property, range, options ) {
    var sliderNode = new HSlider( property, range, options );

    // HSlider does not support a tick that is centered on the track.  We need to use our own tick node here.
    var trackCenterX = SLIDER_OPTIONS.trackSize.width / 2;
    var tickYOffset = SLIDER_OPTIONS.trackSize.height / 2;
    var tickNode = new Line( trackCenterX, -TICK_LENGTH, trackCenterX, TICK_LENGTH + tickYOffset, {
      stroke: TICK_COLOR,
      lineWidth: TICK_WIDTH
    } );

    // add the tick as a child and move it behind the slider thumb
    sliderNode.addChild( tickNode );
    tickNode.moveToBack();

    // make vertical slider by rotating it
    sliderNode.rotate( -Math.PI / 2 );

    return sliderNode;
  }

  /**
   *
   * @param {Graph} graph
   * @param {Array.<DataPoint>} dataPoints
   * @param {Function} onEvent - listener function when event is trigger
   * @param {Object} [options]
   * @constructor
   */
  function MyLineControlPanel( graph, dataPoints, onEvent, options ) {


    // Create a mutable equation y = {1} x + {2} , the slope and intercept are updated later
    // max width determined empirically, and there are 6 elements that make up the equation node
    var equationCharacterMaxWidth = MAX_WIDTH / 6;
    var equationText = new EquationNode( { maxCharacterWidth: equationCharacterMaxWidth } );

    /**
     * Function that updates the value of the current slope (based on the angle of the line)
     * @param {number} angle
     */
    function updateTextSlope( angle ) {
      var slope = graph.slope( angle );
      equationText.setSlopeText( slope * graph.slopeFactor );
    }

    /**
     * Function that updates the value of the intercept
     * @param {number} intercept
     */
    function updateTextIntercept( intercept ) {
      equationText.setInterceptText( intercept * graph.interceptFactor + graph.interceptOffset );
    }

    updateTextIntercept( 0 );
    updateTextSlope( 0 );

    // Create an immutable equation y = a x + b
    var blackOptions = { font: LeastSquaresRegressionConstants.TEXT_FONT, fill: 'black', maxWidth: equationCharacterMaxWidth };
    var boldOptions = {
      font: LeastSquaresRegressionConstants.TEXT_BOLD_FONT,
      fill: LeastSquaresRegressionConstants.MY_LINE_COLOR.BASE_COLOR,
      maxWidth: equationCharacterMaxWidth
    };

    var yText = new Text( symbolYString, blackOptions ); // 'y'
    var equalText = new Text( '=', blackOptions ); // the '=' sign
    var aText = new Text( aString, boldOptions ); // a number
    var xText = new Text( symbolXString, blackOptions ); // 'x'
    var signInterceptText = new Text( plusString, blackOptions );// '+'
    var bText = new Text( bString, boldOptions );// a number

    var immutableEquationText = new Node( {
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
    yText.left = equationText.yText.left;
    equalText.left = equationText.equalText.left;
    aText.center = equationText.valueSlopeText.center;
    xText.left = equationText.xText.left;
    signInterceptText.left = equationText.signInterceptText.left;
    bText.center = equationText.valueInterceptText.center;

    // create the equation panel with white background
    var equationPanel = new Panel( equationText, {
      fill: 'white',
      cornerRadius: LeastSquaresRegressionConstants.SMALL_PANEL_CORNER_RADIUS,
      stroke: LeastSquaresRegressionConstants.SMALL_PANEL_STROKE,
      resize: false
    } );

    // Create two sliders: The aSlider controls the angle of the line and by proxy the slope, the bSlider controls the intercept
    var sliderInterceptRange = new Range( -1.5 * graph.bounds.maxY, 1.5 * graph.bounds.maxY );
    var maxSlope = 10; // determines the maximum slope (using the graph bounds as reference, i.e. the unit square)

    var aSlider = verticalSlider( graph.angleProperty, new Range( -Math.atan( maxSlope ), Math.atan( maxSlope ) ), SLIDER_OPTIONS );
    var bSlider = verticalSlider( graph.interceptProperty, sliderInterceptRange, SLIDER_OPTIONS );

    // Create label below the sliders
    var aSliderText = new Text( aString, _.extend( { maxWidth: MAX_WIDTH }, boldOptions ) );
    var bSliderText = new Text( bString, _.extend( { maxWidth: MAX_WIDTH }, boldOptions ) );

    // collect the immutable equation, the mutable equation and the sliders in one node
    var rightAlignedNode = new Node();
    var hStrut = new HStrut( 20 );
    rightAlignedNode.addChild( equationPanel );
    rightAlignedNode.addChild( immutableEquationText );
    rightAlignedNode.addChild( aSlider );
    rightAlignedNode.addChild( bSlider );
    rightAlignedNode.addChild( aSliderText );
    rightAlignedNode.addChild( bSliderText );
    rightAlignedNode.addChild( hStrut );

    // Create three check boxes
    var checkBoxTextOptions = { font: LeastSquaresRegressionConstants.CHECK_BOX_TEXT_FONT, maxWidth: MAX_WIDTH };
    var lineCheckBox = CheckBox.createTextCheckBox( myLineString, checkBoxTextOptions, graph.myLineVisibleProperty );
    var residualsCheckBox = CheckBox.createTextCheckBox( residualsString, checkBoxTextOptions, graph.myLineShowResidualsProperty );
    var squaredResidualsCheckBox = CheckBox.createTextCheckBox( squaredResidualsString, checkBoxTextOptions, graph.myLineShowSquaredResidualsProperty );

    // Expand the touch Area
    lineCheckBox.touchArea = lineCheckBox.localBounds.dilatedXY( 8, 8 );
    residualsCheckBox.touchArea = residualsCheckBox.localBounds.dilatedXY( 8, 8 );
    squaredResidualsCheckBox.touchArea = squaredResidualsCheckBox.localBounds.dilatedXY( 8, 8 );

    // Create the barometer chart for the sum of the squares
    this.sumOfSquaredResiduals = new SumOfSquaredResidualsChart(
      graph,
      dataPoints,
      graph.getMyLineSumOfSquaredResiduals.bind( graph ),
      onEvent,
      LeastSquaresRegressionConstants.MY_LINE_COLOR.SUM_OF_SQUARES_COLOR,
      graph.myLineSquaredResidualsVisibleProperty, {
        maxLabelWidth: MAX_WIDTH
      } );

    // assemble all the previous nodes in a vertical box
    var mainBox = new LayoutBox( {
      spacing: 10, children: [
        lineCheckBox,
        rightAlignedNode,
        residualsCheckBox,
        squaredResidualsCheckBox,
        this.sumOfSquaredResiduals
      ], align: 'left'
    } );

    // layout the internal nodes of the right Aligned Node
    equationPanel.left = hStrut.right;
    equationPanel.top = lineCheckBox.bottom;
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

    // call the superconstructor
    Panel.call( this, mainBox, options );

    // Trigger the opacity/non-opacity when checking the myLine checkbox
    graph.myLineVisibleProperty.link( function( enabled ) {
      equationText.visible = enabled;
      aSlider.pickable = enabled ? true : false; // enable/disable slider
      bSlider.pickable = enabled ? true : false;// enable/disable slider
      residualsCheckBox.enabled = enabled;
      squaredResidualsCheckBox.enabled = enabled;
      rightAlignedNode.opacity = enabled ? 1 : 0.3;
    } );

    // update the text (slope) of the equation when the aSlider is moving
    graph.angleProperty.link( function( angle ) {
      updateTextSlope( angle );
    } );

    // update the text (intercept) of the equation when the bSlider is moving
    graph.interceptProperty.link( function( intercept ) {
      updateTextIntercept( intercept );
    } );

    // Trigger an update after all the points have been added in bulk to the model
    // Update the equation text
    onEvent( 'DataPointsAdded', function() {
      updateTextSlope( graph.angle );
      updateTextIntercept( graph.intercept );
    } );

  }

  return inherit( Panel, MyLineControlPanel, {
    reset: function(){
      this.sumOfSquaredResiduals.reset();
    }
  } );
} );