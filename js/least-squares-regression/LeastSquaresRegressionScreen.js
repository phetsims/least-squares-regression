// Copyright 2014-2019, University of Colorado Boulder

/**
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const leastSquaresRegression = require( 'LEAST_SQUARES_REGRESSION/leastSquaresRegression' );
  const LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  const LeastSquaresRegressionModel = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/LeastSquaresRegressionModel' );
  const LeastSquaresRegressionScreenView = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/LeastSquaresRegressionScreenView' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

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
