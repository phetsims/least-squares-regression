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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  // var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalSlider = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/VerticalSlider' );

  // strings
  var myLineString = require( 'string!LEAST_SQUARES_REGRESSION/myLine' );
  var residualsString = require( 'string!LEAST_SQUARES_REGRESSION/residuals' );
  var squaredResidualsString = require( 'string!LEAST_SQUARES_REGRESSION/squaredResiduals' );
  var aString = require( 'string!LEAST_SQUARES_REGRESSION/a' );
  var bString = require( 'string!LEAST_SQUARES_REGRESSION/b' );

  var pattern_0slope_1intercept = " y = {0} x + {1} ";
  var pattern_0sign_1intercept = " {0}{1} ";

  /**
   * {Model} model of the main simulation
   * {Object} options
   * @constructor
   */
  function MyLineBoxNode( model, options ) {

    var eqPartOneText = new Text( 'y = ', {font: LSRConstants.TEXT_FONT, fill: 'black'} );
    var eqPartTwoText = new Text( aString, {font: LSRConstants.TEXT_FONT, fill: 'blue'} );
    var eqPartThreeText = new Text( ' x + ', {font: LSRConstants.TEXT_FONT, fill: 'black'} );
    var eqPartFourText = new Text( bString, {font: LSRConstants.TEXT_FONT, fill: 'blue'} );
    var unmutableEquationText = new HBox( {spacing: 3, children: [eqPartOneText, eqPartTwoText, eqPartThreeText, eqPartFourText]} );


    var eqnPartOneText = new Text( 'y = ', {font: LSRConstants.TEXT_FONT, fill: 'black'} );
    var eqnPartTwoText = new Text( aString, {font: LSRConstants.TEXT_FONT, fill: 'blue'} );
    var eqnPartThreeText = new Text( ' x ', {font: LSRConstants.TEXT_FONT, fill: 'black'} );
    var eqnPartFourText = new Text( bString, {font: LSRConstants.TEXT_FONT, fill: 'blue'} );
    var mutableEquationText = new HBox( {spacing: 3, children: [eqnPartOneText, eqnPartTwoText, eqnPartThreeText, eqnPartFourText]} );


    var residualsCheckBox = new CheckBox( new Text( residualsString, LSRConstants.TEXT_FONT ), model.showResidualsOfMyLineProperty );
    var squaredResidualsCheckBox = new CheckBox( new Text( squaredResidualsString, LSRConstants.TEXT_FONT ), model.showSquareResidualsOfMyLineProperty );

    //TODO fixed such that the text can be disabled
    model.showMyLineProperty.linkAttribute( residualsCheckBox, 'enabled' );
    model.showMyLineProperty.linkAttribute( squaredResidualsCheckBox, 'enabled' );

    var equationText = new Text( '', { stroke: 'black' } );
    var mainBox = new VBox();
    mainBox = new VBox( {spacing: 5, children: [
      new CheckBox( new Text( myLineString, LSRConstants.TEXT_FONT ), model.showMyLineProperty ),
      new Panel( mutableEquationText, { fill: 'white', cornerRadius: 2 } ),
      //   mutableEquationText,
      unmutableEquationText,

      new HBox( {spacing: 5, children: [
        new VerticalSlider( aString, new Dimension2( 3, 100 ), model.slopeProperty, new Range( -20, 20 ) ),
        new VerticalSlider( bString, new Dimension2( 3, 100 ), model.interceptProperty, new Range( -20, 20 ) )]
        //  centerX:mainBox.centerX+40,
        //  centerY:mainBox.centerY
      } ),
      residualsCheckBox,
      squaredResidualsCheckBox
      //    new CheckBox( new Text( residualsString, LSRConstants.TEXT_FONT ), model.showResidualsOfMyLineProperty ),
      //     new CheckBox( new Text( squaredResidualsString, LSRConstants.TEXT_FONT ), model.showSquareResidualsOfMyLineProperty )
    ], align: 'left' } );

    Panel.call( this, mainBox,
      _.extend( {
        cornerRadius: LSRConstants.CONTROL_PANEL_CORNER_RADIUS,
        fill: LSRConstants.CONTROL_PANEL_BACKGROUND_COLOR,
        align: 'left',
        xMargin: 8,
        yMargin: 5
      }, options )
    );

    var interceptText;
    var slopeText;


    // move the slider thumb to reflect the model value
    model.slopeProperty.link( function( slope ) {
      slopeText = Util.toFixedNumber( slope, 2 );
      eqnPartTwoText.text = Util.toFixedNumber( slope, 2 );
//      equationText.text = StringUtils.format( pattern_0slope_1intercept, slopeText, interceptText );
    } );

    // move the slider thumb to reflect the model value
    model.interceptProperty.link( function( intercept ) {
      interceptText = Util.toFixedNumber( intercept, 2 );
      var isNegative = Math.sign( Util.toFixedNumber( intercept, 2 ) ) == -1 ? true : false;
      var signText = isNegative ? '' : '+';
      eqnPartFourText.text = StringUtils.format( pattern_0sign_1intercept, signText, interceptText );
      // eqnPartFourText.text = Util.toFixedNumber( intercept, 2 );
    } );

  }

  return inherit( Panel, MyLineBoxNode );
} );