// Copyright 2002-2014, University of Colorado Boulder

/**
 * Equation Node
 *
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings

  var plusString = '\u002B';
  var minusString = '\u2212';

  function EquationNode( slope, intercept ) {
    Node.call( this );

    this.eqnPartOneText = new Text( ' y = ', {font: LSRConstants.TEXT_FONT, fill: 'black'} );
    this.eqnPartTwoText = new Text( this.numberToString( slope ).optionalSign, {font: LSRConstants.TEXT_FONT_BOLD, fill: 'blue'} );
    this.eqnPartThreeText = new Text( this.numberToString( slope ).absoluteNumber, {font: LSRConstants.TEXT_FONT_BOLD, fill: 'blue'} );
    this.eqnPartFourText = new Text( ' x ', {font: LSRConstants.TEXT_FONT, fill: 'black'} );
    this.eqnPartFiveText = new Text( this.numberToString( intercept ).sign, {font: LSRConstants.TEXT_FONT, fill: 'black'} );
    this.eqnPartSixText = new Text( this.numberToString( intercept ).absoluteNumber, {font: LSRConstants.TEXT_FONT_BOLD, fill: 'blue'} );
    var mutableEquationText = new Node( {
      spacing: 5,
      children: [
        this.eqnPartOneText,
        this.eqnPartTwoText,
        this.eqnPartThreeText,
        this.eqnPartFourText,
        this.eqnPartFiveText,
        this.eqnPartSixText
      ]
    } );
    this.eqnPartTwoText.left = 20;
    this.eqnPartThreeText.left = 30;
    this.eqnPartFourText.left = 55;
    this.eqnPartFiveText.left = 70;
    this.eqnPartSixText.left = 80;

    this.addChild( mutableEquationText );
  }

  return inherit( Node, EquationNode, {
    setSlopeText: function( slope ) {
      this.eqnPartTwoText.text = this.numberToString( slope ).optionalSign;
      this.eqnPartThreeText.text = this.numberToString( slope ).absoluteNumber;
    },

    setInterceptText: function( intercept ) {
      this.eqnPartFiveText.text = this.numberToString( intercept ).sign;
      this.eqnPartSixText.text = this.numberToString( intercept ).absoluteNumber;
    },

    setToInvisible: function() {
      this.visible = false;
    },

    setToVisible: function() {
      this.visible = true;
    },

    numberToString: function( number ) {
      var isNegative = (this.roundNumber( number ) < 0);
      var signString = isNegative ? minusString : plusString;
      var optionalSignString = isNegative ? minusString : ' ';
      var absoluteNumber = this.roundNumber( Math.abs( this.roundNumber( number ) ) );
      var numberString = {
        absoluteNumber: absoluteNumber,
        optionalSign: optionalSignString,
        sign: signString
      };
      return numberString;
    },

    roundNumber: function( number, options ) {
      options = _.extend( {
        maxSigFigs: 2
      }, options );

      var roundedNumber;
      if ( Math.abs( number ) < 1 ) {
        roundedNumber = Util.toFixed( number, options.maxSigFigs );
      }
      else if ( Math.abs( number ) < 100 ) {
        roundedNumber = Util.toFixed( number, options.maxSigFigs - 1 );
      }
      else {
        roundedNumber = Util.toFixed( number, options.maxSigFigs - 2 );
      }
      return roundedNumber;
    }
  } );
} );