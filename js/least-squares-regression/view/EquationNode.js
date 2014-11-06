// Copyright 2002-2014, University of Colorado Boulder

/**
 * Equation Node
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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Range = require( 'DOT/Range' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var aString = require( 'string!LEAST_SQUARES_REGRESSION/a' );
  var bString = require( 'string!LEAST_SQUARES_REGRESSION/b' );
  var plusString = '\u002B';
  var minusString = '\u2212';

  var pattern_0slope_1intercept = " y = {0} x {1} ";
  var pattern_0sign_1number = " {0}{1} ";

  function NumberToTextNode( number, options ) {
    options = _.extend( {
      separateSign: false,
      maxSigFigs: 2
    }, options );

    Node.call( this );
    var roundedNumber;
    if ( Math.abs( number ) < 1 ) {
      roundedNumber = Util.toFixed( number, maxSigFigs );
    }
    else {
      roundedNumber = Util.toFixed( number, maxSigFigs - 1 );
    }

    if ( separateSign ) {
      var isNegative = (roundedNumber < 0);
      var signString = isNegative ? minusString : plusString;
      var absoluteNumber = Math.abs( number );
      var signText = new Text( signString, {font: LSRConstants.TEXT_FONT, fill: 'black'} );
      var numberText = new Text( absoluteNumber, {font: LSRConstants.TEXT_FONT_BOLD, fill: 'blue', left: signText.right} );
      this.addChild( signText );
      this.addChild( numberText )
    }
    else {
      var isNegative = (roundedNumber < 0);
      var signString = isNegative ? '' : plusString;
      var absoluteNumber = Math.abs( number );
      var pattern_0sign_1number = " {0}{1} ";
      var signAndNumber = StringUtils.format( pattern_0sign_1number, signString, absoluteNumber );
      var numberText = new Text( signAndNumber, {font: LSRConstants.TEXT_FONT_BOLD, fill: 'blue'} );
      this.addChild( numberText )
    }
    return inherit( Node, NumberToTextNode );
  }

  function EquationNode( slope, intercept ) {
    Node.call( this );

    var eqnPartOneText = new Text( ' y = ', {font: LSRConstants.TEXT_FONT, fill: 'black'} );
    //  debugger;
    //  var eqnPartTwoText = new NumberToTextNode( slope, {separateSign: false} );
    var eqnPartThreeText = new Text( ' x ', {font: LSRConstants.TEXT_FONT, fill: 'black'} );
    //  var eqnPartFourText = new NumberToTextNode( intercept, {separateSign: true} );
    var mutableEquationText = new HBox( {
      spacing: 3, children: [
        eqnPartOneText,
        //    eqnPartTwoText,
        eqnPartThreeText,
        //  eqnPartFourText
      ]
    } );
    this.addChild( mutableEquationText );
  }

  return inherit( Node, EquationNode );
} );