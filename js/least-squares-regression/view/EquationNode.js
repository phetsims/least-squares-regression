// Copyright 2014-2015, University of Colorado Boulder

/**
 * Equation Node that renders a text node of a linear equation of the form y = m x + b where m and b are numerical values
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var plusString = '\u002B'; // we want a large + sign
  var minusString = '\u2212';
  var symbolXString = require( 'string!LEAST_SQUARES_REGRESSION/symbol.x' );
  var symbolYString = require( 'string!LEAST_SQUARES_REGRESSION/symbol.y' );

  /**
   * Scenery Node responsible for laying out the linear equation y = m x + b
   * @param {Object} [options]
   * @constructor
   */
  function EquationNode( options ) {
    Node.call( this );

    options = _.extend( {
      maxDecimalPlaces: 2,  // maximum of number of decimal places on slope and intercept
      mode: 'myLine',  // valid options are 'myLine' and 'bestFitLine',
      maxCharacterWidth: 25
    }, options );

    this.options = options;

    // options for the text elements of the equation

    var numericalTextOptions; // font and fill options for numerical strings , i.e.  '- 9.54'
    var stringTextOptions; // font and fill options for 'pure' strings, eg. 'y'

    switch( options.mode ) {
      case  'myLine' :
        numericalTextOptions = {
          font: LeastSquaresRegressionConstants.TEXT_BOLD_FONT,
          fill: LeastSquaresRegressionConstants.MY_LINE_COLOR.BASE_COLOR,
          maxWidth: options.maxCharacterWidth
        };
        stringTextOptions = { font: LeastSquaresRegressionConstants.TEXT_FONT, fill: 'black', maxWidth: options.maxCharacterWidth };
        break;
      case 'bestFitLine':
        numericalTextOptions = {
          font: LeastSquaresRegressionConstants.TEXT_FONT,
          fill: LeastSquaresRegressionConstants.BEST_FIT_LINE_COLOR.BASE_COLOR,
          maxWidth: options.maxCharacterWidth
        };
        stringTextOptions = numericalTextOptions;
        break;
      default:
        throw new Error( 'Unknown mode for EquationNode: ' );
    }

    // use the widest possible numbers for laying out the equation

    var maxWidthSlopeString = '0.';
    for ( var i = 0; i < options.maxDecimalPlaces; i++ ) {
      maxWidthSlopeString = maxWidthSlopeString + '0';
    }

    var maxWidthInterceptString = '0.';
    for ( var j = 0; j < options.maxDecimalPlaces; j++ ) {
      maxWidthInterceptString = maxWidthInterceptString + '0';
    }

    // @public
    this.yText = new Text( symbolYString, stringTextOptions ); // 'y'
    this.equalText = new Text( '=', stringTextOptions ); // the '=' sign
    this.signSlopeText = new Text( plusString, numericalTextOptions ); // + or -
    this.valueSlopeText = new Text( maxWidthSlopeString, numericalTextOptions ); // a number
    this.xText = new Text( symbolXString, stringTextOptions ); // 'x'
    this.signInterceptText = new Text( plusString, stringTextOptions );// + or -
    this.valueInterceptText = new Text( maxWidthInterceptString, numericalTextOptions );// a number

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

    this.mutate( options );

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
      if ( Math.abs( number ) < 10 ) {
        roundedNumber = Util.toFixed( number, this.options.maxDecimalPlaces ); // eg. 9.99, 0.01 if this.options.maxDecimalPlaces=2
      }
      else if ( Math.abs( number ) < 100 ) {
        roundedNumber = Util.toFixed( number, this.options.maxDecimalPlaces - 1 ); // eg. 10.1, 99.9
      }
      else {
        roundedNumber = Util.toFixed( number, this.options.maxDecimalPlaces - 2 );// 100, 1000, 10000, 99999
      }
      return roundedNumber;
    }
  } );
} );
