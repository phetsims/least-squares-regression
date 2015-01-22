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
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Range = require( 'DOT/Range' );
  var SumOfSquaredResidualsChart = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/SumOfSquaredResidualsChart' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
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

    var equationText = new EquationNode( graph.slope( graph.angle ), graph.intercept );
    var equationPanel = new Panel( equationText, {
      fill: 'white',
      cornerRadius: LSRConstants.SMALL_PANEL_CORNER_RADIUS,
      resize: false
    } );

    var lineCheckBox = CheckBox.createTextCheckBox( myLineString, { font: LSRConstants.CHECK_BOX_TEXT_FONT }, graph.myLineVisibleProperty );
    var residualsCheckBox = CheckBox.createTextCheckBox( residualsString, { font: LSRConstants.CHECK_BOX_TEXT_FONT }, graph.myLineShowResidualsProperty );
    var squaredResidualsCheckBox = CheckBox.createTextCheckBox( squaredResidualsString, { font: LSRConstants.CHECK_BOX_TEXT_FONT }, graph.myLineShowSquaredResidualsProperty );

    var sliderInterceptRange = new Range( -1.5 * graph.bounds.maxY, 1.5 * graph.bounds.maxY );
    var maxSlope = 10;

    var aSlider = new VerticalSlider( aString, new Dimension2( 3, 190 ), graph.angleProperty, new Range( -Math.atan( maxSlope ), Math.atan( maxSlope ) ) );
    var bSlider = new VerticalSlider( bString, new Dimension2( 3, 190 ), graph.interceptProperty, sliderInterceptRange );

    var sumOfSquaredResiduals = new SumOfSquaredResidualsChart(
      graph,
      dataPoints,
      graph.getMyLineSumOfSquaredResiduals.bind( graph ),
      onEvent,
      LSRConstants.MY_LINE_COLOR.SUM_OF_SQUARES_COLOR,
      graph.myLineSquaredResidualsVisibleProperty );

    graph.myLineVisibleProperty.link( function( enabled ) {
      equationText.visible = enabled;
      aSlider.opacity = enabled ? 1 : 0.3;
      aSlider.pickable = enabled ? true : false;
      bSlider.opacity = enabled ? 1 : 0.3;
      bSlider.pickable = enabled ? true : false;
      equationPanel.opacity = enabled ? 1 : 0.3;
      immutableEquationText.opacity = enabled ? 1 : 0.3;
      residualsCheckBox.enabled = enabled;
      squaredResidualsCheckBox.enabled = enabled;
    } );

    var rightAlignedPanel = new Node();
    var hStrut = new HStrut( 20 );
    rightAlignedPanel.addChild( equationPanel );
    rightAlignedPanel.addChild( immutableEquationText );
    rightAlignedPanel.addChild( aSlider );
    rightAlignedPanel.addChild( bSlider );

    rightAlignedPanel.addChild( hStrut );
    equationPanel.left = hStrut.right;
    equationPanel.top = lineCheckBox.bottom + 15;
    immutableEquationText.top = equationPanel.bottom + 12;

    immutableEquationText.left = equationPanel.left + 5;
    aSlider.top = immutableEquationText.bottom + 10;
    bSlider.top = immutableEquationText.bottom + 10;
    aSlider.centerX = immutableEquationText.left + eqPartTwoText.centerX;
    bSlider.centerX = immutableEquationText.left + eqPartFourText.centerX;
    var mainBox = new VBox( {
      spacing: 10, children: [
        lineCheckBox,
        //equationPanel,
        //immutableEquationText,
        //slidersBox,
        rightAlignedPanel,
        residualsCheckBox,
        squaredResidualsCheckBox,
        sumOfSquaredResiduals
      ], align: 'left'
    } );

    Panel.call( this, mainBox, options );

    graph.angleProperty.link( function( angle ) {
      var slope = graph.slope( angle );
      equationText.setSlopeText( slope * graph.slopeFactor );
    } );

    graph.interceptProperty.link( function( intercept ) {
      equationText.setInterceptText( intercept * graph.interceptFactor );
    } );

  }

  return inherit( Panel, MyLineControlPanel );
} );