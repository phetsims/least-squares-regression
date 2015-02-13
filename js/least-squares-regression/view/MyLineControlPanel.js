// Copyright 2002-2015, University of Colorado Boulder

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
  var HStrut = require( 'SUN/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Range = require( 'DOT/Range' );
  var SumOfSquaredResidualsChart = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/SumOfSquaredResidualsChart' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalSlider = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/VerticalSlider' );

  // strings
  var aString = require( 'string!LEAST_SQUARES_REGRESSION/a' );
  var bString = require( 'string!LEAST_SQUARES_REGRESSION/b' );
  var myLineString = require( 'string!LEAST_SQUARES_REGRESSION/myLine' );
  var residualsString = require( 'string!LEAST_SQUARES_REGRESSION/residuals' );
  var squaredResidualsString = require( 'string!LEAST_SQUARES_REGRESSION/squaredResiduals' );


  /**
   *
   * @param {Graph} graph
   * @param {Array.<DataPoint>} dataPoints
   * @param {Function} onEvent - listener function when event is trigger
   * @param {Object} [options]
   * @constructor
   */
  function MyLineControlPanel( graph, dataPoints, onEvent, options ) {

    // Create an immutable equation y = a x + b
    var eqPartOneText = new Text( 'y =', { font: LSRConstants.TEXT_FONT, fill: 'black' } );
    var eqPartTwoText = new Text( aString, { font: LSRConstants.TEXT_FONT_BOLD, fill: 'blue' } );
    var eqPartThreeText = new Text( 'x +', { font: LSRConstants.TEXT_FONT, fill: 'black' } );
    var eqPartFourText = new Text( bString, { font: LSRConstants.TEXT_FONT_BOLD, fill: 'blue' } );
    var immutableEquationText = new Node( {
      children: [
        eqPartOneText,
        eqPartTwoText,
        eqPartThreeText,
        eqPartFourText
      ]
    } );

    eqPartTwoText.left = 42;
    eqPartThreeText.left = 64;
    eqPartFourText.left = 94;

    // create a mutable equation y = {1} x + {2} , the slope and interecept are updated later
    var equationText = new EquationNode( 0, 0 );

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

    // create the equation panel with white background
    var equationPanel = new Panel( equationText, {
      fill: 'white',
      cornerRadius: LSRConstants.SMALL_PANEL_CORNER_RADIUS,
      resize: false
    } );

    // Create two sliders: The aSlider controls the angle of the line and by proxy the slope, the bSlider controls the intercept
    var sliderInterceptRange = new Range( -1.5 * graph.bounds.maxY, 1.5 * graph.bounds.maxY );
    var maxSlope = 10; // determines the maximum slope (using the graph bounds as reference, i.e. the unit square)

    var aSlider = new VerticalSlider( aString, new Dimension2( 3, 190 ), graph.angleProperty, new Range( -Math.atan( maxSlope ), Math.atan( maxSlope ) ) );
    var bSlider = new VerticalSlider( bString, new Dimension2( 3, 190 ), graph.interceptProperty, sliderInterceptRange );

    // collect the immutable equation, the mutable equation and the sliders in one node
    var rightAlignedPanel = new Node();
    var hStrut = new HStrut( 20 );
    rightAlignedPanel.addChild( equationPanel );
    rightAlignedPanel.addChild( immutableEquationText );
    rightAlignedPanel.addChild( aSlider );
    rightAlignedPanel.addChild( bSlider );
    rightAlignedPanel.addChild( hStrut );

    // Create three check boxes
    var lineCheckBox = CheckBox.createTextCheckBox( myLineString, { font: LSRConstants.CHECK_BOX_TEXT_FONT }, graph.myLineVisibleProperty );
    var residualsCheckBox = CheckBox.createTextCheckBox( residualsString, { font: LSRConstants.CHECK_BOX_TEXT_FONT }, graph.myLineShowResidualsProperty );
    var squaredResidualsCheckBox = CheckBox.createTextCheckBox( squaredResidualsString, { font: LSRConstants.CHECK_BOX_TEXT_FONT }, graph.myLineShowSquaredResidualsProperty );

    // Create the barometer chart for the sum of the squares
    var sumOfSquaredResiduals = new SumOfSquaredResidualsChart(
      graph,
      dataPoints,
      graph.getMyLineSumOfSquaredResiduals.bind( graph ),
      onEvent,
      LSRConstants.MY_LINE_COLOR.SUM_OF_SQUARES_COLOR,
      graph.myLineSquaredResidualsVisibleProperty );

    // assemble all the previous nodes in a vertical box
    var mainBox = new LayoutBox( {
      spacing: 10, children: [
        lineCheckBox,
        rightAlignedPanel,
        residualsCheckBox,
        squaredResidualsCheckBox,
        sumOfSquaredResiduals
      ], align: 'left'
    } );

    // layout the internal nodes
    equationPanel.left = hStrut.right;
    equationPanel.top = lineCheckBox.bottom;
    immutableEquationText.top = equationPanel.bottom + 12;
    immutableEquationText.left = equationPanel.left + 5;
    aSlider.top = immutableEquationText.bottom + 10;
    bSlider.top = immutableEquationText.bottom + 10;
    aSlider.centerX = immutableEquationText.left + eqPartTwoText.centerX;
    bSlider.centerX = immutableEquationText.left + eqPartFourText.centerX;

    // call the superconstructor
    Panel.call( this, mainBox, options );

    // Trigger the opacity/nonopacity when checking the myLine checkcbox
    graph.myLineVisibleProperty.link( function( enabled ) {
      equationText.visible = enabled;
      aSlider.opacity = enabled ? 1 : 0.3;
      aSlider.pickable = enabled ? true : false; // enable/disable slider
      bSlider.opacity = enabled ? 1 : 0.3;
      bSlider.pickable = enabled ? true : false;// enable/disable slider
      equationPanel.opacity = enabled ? 1 : 0.3;
      immutableEquationText.opacity = enabled ? 1 : 0.3;
      residualsCheckBox.enabled = enabled;
      squaredResidualsCheckBox.enabled = enabled;
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

  return inherit( Panel, MyLineControlPanel );
} );