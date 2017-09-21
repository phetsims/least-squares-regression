// Copyright 2014-2017, University of Colorado Boulder

/**
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var leastSquaresRegression = require( 'LEAST_SQUARES_REGRESSION/leastSquaresRegression' );
  var LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var LeastSquaresRegressionModel = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/LeastSquaresRegressionModel' );
  var LeastSquaresRegressionScreenView = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/LeastSquaresRegressionScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

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
