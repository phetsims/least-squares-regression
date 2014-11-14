// Copyright 2002-2014, University of Colorado Boulder

/**
 * Combo Box
 *
 */

define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var EquationNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/EquationNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
//  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  // var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Range = require( 'DOT/Range' );
//  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SumOfSquaredResidualsChart = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/SumOfSquaredResidualsChart' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalSlider = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/VerticalSlider' );

  // strings
  var myLineString = require( 'string!LEAST_SQUARES_REGRESSION/myLine' );
  var residualsString = require( 'string!LEAST_SQUARES_REGRESSION/residuals' );
  var squaredResidualsString = require( 'string!LEAST_SQUARES_REGRESSION/squaredResiduals' );
  var aString = require( 'string!LEAST_SQUARES_REGRESSION/a' );
  var bString = require( 'string!LEAST_SQUARES_REGRESSION/b' );

  /**
   * {Model} model of the main simulation
   * {Object} options
   * @constructor
   */
  function MyLineControlPanel( model, options ) {

    var eqPartOneText = new Text( 'y = ', {font: LSRConstants.TEXT_FONT, fill: 'black'} );
    var eqPartTwoText = new Text( aString, {font: LSRConstants.TEXT_FONT_BOLD, fill: 'blue'} );
    var eqPartThreeText = new Text( ' x + ', {font: LSRConstants.TEXT_FONT, fill: 'black'} );
    var eqPartFourText = new Text( bString, {font: LSRConstants.TEXT_FONT_BOLD, fill: 'blue'} );
    var immutableEquationText = new HBox( {spacing: 3, children: [eqPartOneText, eqPartTwoText, eqPartThreeText, eqPartFourText]} );

    var equationText = new EquationNode( model.graph.slope( model.graph.angle ), model.graph.intercept );
    var equationPanel = new Panel( equationText, {fill: 'white', cornerRadius: 2, resize: false} );

    var lineCheckBox = CheckBox.createTextCheckBox( myLineString, LSRConstants.TEXT_FONT, model.graph.myLineVisibleProperty );
    var residualsCheckBox = CheckBox.createTextCheckBox( residualsString, LSRConstants.TEXT_FONT, model.graph.myLineShowResidualsProperty );
    var squaredResidualsCheckBox = CheckBox.createTextCheckBox( squaredResidualsString, LSRConstants.TEXT_FONT, model.graph.myLineShowSquaredResidualsProperty );

    var slidersBox = new HBox( {
      spacing: 5, children: [
        //TODO get rid of magic numbers
        new VerticalSlider( aString, new Dimension2( 3, 100 ), model.graph.angleProperty, new Range( -0.936 * Math.PI / 2, Math.PI * 0.936 / 2 ) ),
        new VerticalSlider( bString, new Dimension2( 3, 100 ), model.graph.interceptProperty, new Range( -20, 20 ) )]
    } );

    var sumOfSquaredResiduals = new SumOfSquaredResidualsChart( model, model.graph.getMyLineSumOfSquaredResiduals.bind( model.graph ), LSRConstants.MY_LINE_SQUARED_RESIDUAL_COLOR, model.graph.myLineSquaredResidualsVisibleProperty );

    model.graph.myLineVisibleProperty.link( function( enabled ) {
      equationText.visible = enabled;
      slidersBox.opacity = enabled ? 1 : 0.3;
      equationPanel.opacity = enabled ? 1 : 0.3;
      immutableEquationText.opacity = enabled ? 1 : 0.3;
      residualsCheckBox.enabled = enabled;
      squaredResidualsCheckBox.enabled = enabled;
    } );

    var mainBox = new VBox( {
      spacing: 5, children: [
        lineCheckBox,
        equationPanel,
        immutableEquationText,
        slidersBox,
        residualsCheckBox,
        squaredResidualsCheckBox,
        sumOfSquaredResiduals
      ], align: 'left'
    } );

    Panel.call( this, mainBox,
      _.extend( {
        resize: false,
        cornerRadius: LSRConstants.CONTROL_PANEL_CORNER_RADIUS,
        fill: LSRConstants.CONTROL_PANEL_BACKGROUND_COLOR,
        align: 'left',
        xMargin: 8,
        yMargin: 5
      }, options )
    );

    model.graph.angleProperty.link( function( angle ) {
      var slope = model.graph.slope( angle );
      equationText.setSlopeText( slope );
    } );

    model.graph.interceptProperty.link( function( intercept ) {
      equationText.setInterceptText( intercept );
    } );

  }

  return inherit( Panel, MyLineControlPanel );
} );