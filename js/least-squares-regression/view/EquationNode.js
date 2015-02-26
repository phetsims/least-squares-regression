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
  var xString = require( 'string!LEAST_SQUARES_REGRESSION/symbol.x' );
  var yString = require( 'string!LEAST_SQUARES_REGRESSION/symbol.y' );

  /**
   * Scenery Node responsible for laying out the linear equation y = m x + b
   * @param {Object} [options]
   * @constructor
   */
  function EquationNode( options ) {
    Node.call( this );

    options = _.extend( {
      maxDecimalPlaces: 2 // maximum of number of decimal places on slope and intercept
    }, options );

    this.options = options;

    // options for the text elements of the equation
    var blackOption = { font: LSRConstants.TEXT_FONT, fill: 'black' };
    var blueOption = { font: LSRConstants.TEXT_FONT, fill: 'blue' };

    // use the widest possible numbers for layout the equation

    var maxWidthSlopeString = '0.';
    for ( var i = 0; i < options.maxDecimalPlaces; i++ ) {
      maxWidthSlopeString = maxWidthSlopeString + '0';
    }

    var maxWidthInterceptString = '0.';
    for ( var j = 0; j < options.maxDecimalPlaces; j++ ) {
      maxWidthInterceptString = maxWidthInterceptString + '0';
    }

    // @public
    this.yText = new Text( yString, blackOption ); // 'y'
    this.equalText = new Text( '=', blackOption ); // the '=' sign
    this.signSlopeText = new Text( plusString, blueOption ); // + or -
    this.valueSlopeText = new Text( maxWidthSlopeString, blueOption ); // a number
    this.xText = new Text( xString, blackOption ); // 'x'
    this.signInterceptText = new Text( plusString, blackOption );// + or -
    this.valueInterceptText = new Text( maxWidthInterceptString, blueOption );// a number

    var mutableEquationText = new Node( {
      children: [
        this.yText,
        this.equalText,
        this.signSlopeText,
        this.valueSlopeText,
        this.xText,
        this.signInterceptText,
        this.valueInterceptText
      ]
    } );

    // layout of the entire equation
    this.yText.left = 0;
    this.equalText.left = this.yText.right + 3;
    this.signSlopeText.left = this.equalText.right + 1;
    this.valueSlopeText.left = this.signSlopeText.right + 3;
    this.xText.left = this.valueSlopeText.right + 3;
    this.signInterceptText.left = this.xText.right + 3;
    this.valueInterceptText.left = this.signInterceptText.right + 3;

    this.addChild( mutableEquationText );

  }

  return inherit( Node, EquationNode, {
    /**
     * Set the text of the slope and its accompanying sign
     * @public
     * @param {number} slope
     */
    setSlopeText: function( slope ) {
      this.signSlopeText.text = this.numberToString( slope ).optionalSign;
      this.valueSlopeText.text = this.numberToString( slope ).absoluteNumber;
    },

    /**
     * Set the text of the intercept and its accompanying sign
     * @public
     * @param {number} intercept
     */
    setInterceptText: function( intercept ) {
      this.signInterceptText.text = this.numberToString( intercept ).sign;
      this.valueInterceptText.text = this.numberToString( intercept ).absoluteNumber;
    },

    /**
     * Convert a number to a String, subject to rounding to a certain number of decimal places
     * @private
     * @param {number} number
     * @returns {{absoluteNumber: number, optionalSign: string, sign: string}}
     */
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

    /**
     * Round a number to a certain number of decimal places. Higher numbers have less decimal places.
     * @private
     * @param {number} number

     * @returns {number}
     */
    roundNumber: function( number ) {
      var roundedNumber;
      if ( Math.abs( number ) < 1 ) {
        roundedNumber = Util.toFixed( number, this.options.maxDecimalPlaces );
      }
      else if ( Math.abs( number ) < 100 ) {
        roundedNumber = Util.toFixed( number, this.options.maxDecimalPlaces - 1 );
      }
      else {
        roundedNumber = Util.toFixed( number, this.options.maxDecimalPlaces - 2 );
      }
      return roundedNumber;
    }
  } );
} );
