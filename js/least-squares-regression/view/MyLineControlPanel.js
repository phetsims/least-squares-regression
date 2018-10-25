// Copyright 2018, University of Colorado Boulder

/**
 * Scenery Node representing a Control Panel with check Boxes and Sliders that controls properties of My Line
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var Checkbox = require( 'SUN/Checkbox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var EquationNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/EquationNode' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var leastSquaresRegression = require( 'LEAST_SQUARES_REGRESSION/leastSquaresRegression' );
  var LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Range = require( 'DOT/Range' );
  var SumOfSquaredResidualsChart = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/SumOfSquaredResidualsChart' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VSlider = require( 'SUN/VSlider' );

  // strings
  var aString = require( 'string!LEAST_SQUARES_REGRESSION/a' );
  var bString = require( 'string!LEAST_SQUARES_REGRESSION/b' );
  var myLineString = require( 'string!LEAST_SQUARES_REGRESSION/myLine' );
  var residualsString = require( 'string!LEAST_SQUARES_REGRESSION/residuals' );
  var squaredResidualsString = require( 'string!LEAST_SQUARES_REGRESSION/squaredResiduals' );
  var symbolXString = require( 'string!LEAST_SQUARES_REGRESSION/symbol.x' );
  var symbolYString = require( 'string!LEAST_SQUARES_REGRESSION/symbol.y' );

  // constants
  var SLIDER_OPTIONS = {
    trackFill: 'black',
    trackSize: new Dimension2( 190, 2 ),
    thumbSize: new Dimension2( 15, 30 ),
    thumbTouchAreaYDilation: 8,
    majorTickLength: 18
  };
  var MAX_WIDTH = 150;

  /**
   *
   * @param {Graph} graph
   * @param {Array.<DataPoint>} dataPoints
   * @param {Emitter} dataPointsAddedEmitter
   * @param {Object} [options]
   * @constructor
   */
  function MyLineControlPanel( graph, dataPoints, dataPointsAddedEmitter, options ) {


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
    var signInterceptText = new Text( MathSymbols.PLUS, blackOptions );// '+'
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

    var aSlider = new VSlider( graph.angleProperty, new Range( -Math.atan( maxSlope ), Math.atan( maxSlope ) ), SLIDER_OPTIONS );
    aSlider.addMajorTick( 0 );
    var bSlider = new VSlider( graph.interceptProperty, sliderInterceptRange, SLIDER_OPTIONS );
    bSlider.addMajorTick( 0 );

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

    // Create three checkboxes
    var checkboxTextOptions = { font: LeastSquaresRegressionConstants.CHECK_BOX_TEXT_FONT, maxWidth: MAX_WIDTH };
    var lineCheckbox = new Checkbox( new Text( myLineString, checkboxTextOptions ), graph.myLineVisibleProperty );
    var residualsCheckbox = new Checkbox( new Text( residualsString, checkboxTextOptions ), graph.myLineShowResidualsProperty );
    var squaredResidualsCheckbox = new Checkbox( new Text( squaredResidualsString, checkboxTextOptions ), graph.myLineShowSquaredResidualsProperty );

    // Expand the touch Area
    lineCheckbox.touchArea = lineCheckbox.localBounds.dilatedXY( 8, 8 );
    residualsCheckbox.touchArea = residualsCheckbox.localBounds.dilatedXY( 8, 8 );
    squaredResidualsCheckbox.touchArea = squaredResidualsCheckbox.localBounds.dilatedXY( 8, 8 );

    // Create the barometer chart for the sum of the squares
    this.sumOfSquaredResiduals = new SumOfSquaredResidualsChart(
      graph,
      graph.getMyLineSumOfSquaredResiduals.bind( graph ),
      dataPointsAddedEmitter,
      LeastSquaresRegressionConstants.MY_LINE_COLOR.SUM_OF_SQUARES_COLOR,
      graph.myLineSquaredResidualsVisibleProperty, {
        maxLabelWidth: MAX_WIDTH
      } );

    // assemble all the previous nodes in a vertical box
    var mainBox = new LayoutBox( {
      spacing: 10, children: [
        lineCheckbox,
        rightAlignedNode,
        residualsCheckbox,
        squaredResidualsCheckbox,
        this.sumOfSquaredResiduals
      ], align: 'left'
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

    // call the superconstructor
    Panel.call( this, mainBox, options );

    // Trigger the opacity/non-opacity when checking the myLine checkbox
    graph.myLineVisibleProperty.link( function( enabled ) {
      equationText.visible = enabled;
      aSlider.pickable = enabled; // enable/disable slider
      bSlider.pickable = enabled;// enable/disable slider
      residualsCheckbox.enabled = enabled;
      squaredResidualsCheckbox.enabled = enabled;
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
    dataPointsAddedEmitter.addListener( function() {
      updateTextSlope( graph.angleProperty.value );
      updateTextIntercept( graph.interceptProperty.value );
    } );

  }

  leastSquaresRegression.register( 'MyLineControlPanel', MyLineControlPanel );

  return inherit( Panel, MyLineControlPanel, {
    reset: function() {
      this.sumOfSquaredResiduals.reset();
    }
  } );
} );