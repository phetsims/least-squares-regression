// Copyright 2014-2019, University of Colorado Boulder

/**
 * Equation Node that renders a text node of a linear equation of the form y = m x + b where m and b are numerical values
 *
 * @author Martin Veillette (Berea College)
 */

import Utils from '../../../../dot/js/Utils.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import leastSquaresRegressionStrings from '../../least-squares-regression-strings.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';
import LeastSquaresRegressionConstants from '../LeastSquaresRegressionConstants.js';

const symbolXString = leastSquaresRegressionStrings.symbol.x;
const symbolYString = leastSquaresRegressionStrings.symbol.y;

/**
 * Scenery Node responsible for laying out the linear equation y = m x + b
 * @param {Object} [options]
 * @constructor
 */
function EquationNode( options ) {
  Node.call( this );

  options = merge( {
    maxDecimalPlaces: 2,  // maximum of number of decimal places on slope and intercept
    mode: 'myLine',  // valid options are 'myLine' and 'bestFitLine',
    maxCharacterWidth: 25
  }, options );

  this.options = options;

  // options for the text elements of the equation

  let numericalTextOptions; // font and fill options for numerical strings , i.e.  '- 9.54'
  let stringTextOptions; // font and fill options for 'pure' strings, eg. 'y'

  switch( options.mode ) {
    case  'myLine' :
      numericalTextOptions = {
        font: LeastSquaresRegressionConstants.TEXT_BOLD_FONT,
        fill: LeastSquaresRegressionConstants.MY_LINE_COLOR.BASE_COLOR,
        maxWidth: options.maxCharacterWidth
      };
      stringTextOptions = {
        font: LeastSquaresRegressionConstants.TEXT_FONT,
        fill: 'black',
        maxWidth: options.maxCharacterWidth
      };
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

  let maxWidthSlopeString = '0.';
  for ( let i = 0; i < options.maxDecimalPlaces; i++ ) {
    maxWidthSlopeString = maxWidthSlopeString + '0';
  }

  let maxWidthInterceptString = '0.';
  for ( let j = 0; j < options.maxDecimalPlaces; j++ ) {
    maxWidthInterceptString = maxWidthInterceptString + '0';
  }

  // @public
  this.yText = new Text( symbolYString, stringTextOptions ); // 'y'
  this.equalText = new Text( MathSymbols.EQUAL_TO, stringTextOptions ); // the '=' sign
  this.signSlopeText = new Text( MathSymbols.PLUS, numericalTextOptions ); // + or -
  this.valueSlopeText = new Text( maxWidthSlopeString, numericalTextOptions ); // a number
  this.xText = new Text( symbolXString, stringTextOptions ); // 'x'
  this.signInterceptText = new Text( MathSymbols.PLUS, stringTextOptions );// + or -
  this.valueInterceptText = new Text( maxWidthInterceptString, numericalTextOptions );// a number

  const mutableEquationText = new Node( {
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

leastSquaresRegression.register( 'EquationNode', EquationNode );

export default inherit( Node, EquationNode, {
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
    const isNegative = ( this.roundNumber( number ) < 0 );
    const signString = isNegative ? MathSymbols.MINUS : MathSymbols.PLUS;
    const optionalSignString = isNegative ? MathSymbols.MINUS : ' ';
    const absoluteNumber = this.roundNumber( Math.abs( this.roundNumber( number ) ) );
    const numberString = {
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
    let roundedNumber;
    if ( Math.abs( number ) < 10 ) {
      roundedNumber = Utils.toFixed( number, this.options.maxDecimalPlaces ); // eg. 9.99, 0.01 if this.options.maxDecimalPlaces=2
    }
    else if ( Math.abs( number ) < 100 ) {
      roundedNumber = Utils.toFixed( number, this.options.maxDecimalPlaces - 1 ); // eg. 10.1, 99.9
    }
    else {
      roundedNumber = Utils.toFixed( number, this.options.maxDecimalPlaces - 2 );// 100, 1000, 10000, 99999
    }
    return roundedNumber;
  }
} );