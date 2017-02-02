// Copyright 2014-2015, University of Colorado Boulder

/**
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var LeastSquaresRegressionModel = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/LeastSquaresRegressionModel' );
  var LeastSquaresRegressionScreenView = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/LeastSquaresRegressionScreenView' );
  var LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var leastSquaresRegression = require( 'LEAST_SQUARES_REGRESSION/leastSquaresRegression' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   */
  function LeastSquaresRegressionScreen() {
    Screen.call( this,
      function() { return new LeastSquaresRegressionModel(); },
      function( model ) { return new LeastSquaresRegressionScreenView( model ); },
      { backgroundColorProperty: new Property( LeastSquaresRegressionConstants.BACKGROUND_COLOR ) }
    );
  }

  leastSquaresRegression.register( 'LeastSquaresRegressionScreen', LeastSquaresRegressionScreen );

  return inherit( Screen, LeastSquaresRegressionScreen );
} );
