// Copyright 2002-2015, University of Colorado Boulder

/**
 * Equation Node that renders a text node of a linear equation of the form y = m x + b where m and b are numerical values
 *
 * @author Martin Veillette (Berea College)
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
  var plusString = '\u002B'; // we want a large + sign
  var minusString = '\u2212';

  /**
   * Scenery Node responsible for laying out the linear equation y = m x + b
   * @param {number} slope
   * @param {number} intercept
   * @constructor
   */
  function EquationNode( slope, intercept ) {
    Node.call( this );

    var blackOption = { font: LSRConstants.TEXT_FONT, fill: 'black' };
    var blueOption = { font: LSRConstants.TEXT_FONT, fill: 'blue' };

    this.eqnPartOneText = new Text( 'y =', blackOption );
    this.eqnPartTwoText = new Text( this.numberToString( slope ).optionalSign, blueOption );
    this.eqnPartThreeText = new Text( this.numberToString( slope ).absoluteNumber, blueOption );
    this.eqnPartFourText = new Text( 'x', blackOption );
    this.eqnPartFiveText = new Text( this.numberToString( intercept ).sign, blackOption );
    this.eqnPartSixText = new Text( this.numberToString( intercept ).absoluteNumber, blueOption );
    var mutableEquationText = new Node( {
      children: [
        this.eqnPartOneText,
        this.eqnPartTwoText,
        this.eqnPartThreeText,
        this.eqnPartFourText,
        this.eqnPartFiveText,
        this.eqnPartSixText
      ]
    } );

    //TODO issue #25, layout of equations relies on magic numbers
    // The layout of this equation must match the layout of another equation in MyLineControlPanel
    this.eqnPartTwoText.left = 23;
    this.eqnPartThreeText.left = 32;
    this.eqnPartFourText.left = 65;
    this.eqnPartFiveText.left = 75;
    this.eqnPartSixText.left = 87;

    this.addChild( mutableEquationText );
  }

  return inherit( Node, EquationNode, {
    /**
     * Set the text of the slope and its accompanying sign
     * @public
     * @param {number} slope
     * @param {Object} [options]
     */
    setSlopeText: function( slope, options ) {
      this.eqnPartTwoText.text = this.numberToString( slope, options ).optionalSign;
      this.eqnPartThreeText.text = this.numberToString( slope, options ).absoluteNumber;
    },

    /**
     * Set the text of the intercept and its accompanying sign
     * @public
     * @param {number} intercept
     * @param {Object} [options]
     */
    setInterceptText: function( intercept, options ) {
      this.eqnPartFiveText.text = this.numberToString( intercept, options ).sign;
      this.eqnPartSixText.text = this.numberToString( intercept, options ).absoluteNumber;
    },

    /**
     * Convert a number to a String, subject to rounding to a certain number of decimal places
     * @private
     * @param {number} number
     * @param {Object} [options]
     * @returns {{absoluteNumber: number, optionalSign: string, sign: string}}
     */
    numberToString: function( number, options ) {
      var isNegative = (this.roundNumber( number ) < 0);
      var signString = isNegative ? minusString : plusString;
      var optionalSignString = isNegative ? minusString : ' ';
      var absoluteNumber = this.roundNumber( Math.abs( this.roundNumber( number, options ) ) );
      var numberString = {
        absoluteNumber: absoluteNumber,
        optionalSign: optionalSignString,
        sign: signString
      };
      return numberString;
    },

    /**
     * Round a number to a certain number of decimal places. Higher numbers have less decimal places.
     * @private
     * @param {number} number
     * @param {Object} [options]
     * @returns {number}
     */
    roundNumber: function( number, options ) {
      options = _.extend( {
        maxDecimalPlaces: 2
      }, options );

      var roundedNumber;
      if ( Math.abs( number ) < 1 ) {
        roundedNumber = Util.toFixed( number, options.maxDecimalPlaces );
      }
      else if ( Math.abs( number ) < 100 ) {
        roundedNumber = Util.toFixed( number, options.maxDecimalPlaces - 1 );
      }
      else {
        roundedNumber = Util.toFixed( number, options.maxDecimalPlaces - 2 );
      }
      return roundedNumber;
    }
  } );
} );
