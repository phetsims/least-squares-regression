// Copyright 2014-2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const LeastSquaresRegressionScreen = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  const leastSquaresRegressionTitleString = require( 'string!LEAST_SQUARES_REGRESSION/least-squares-regression.title' );

  const simOptions = {
    credits: {
      leadDesign: 'Amanda McGarry',
      softwareDevelopment: 'Martin Veillette',
      team: 'Trish Loeblein, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Bryan Yoelin'
    }
  };

  SimLauncher.launch( function() {
    const sim = new Sim( leastSquaresRegressionTitleString, [ new LeastSquaresRegressionScreen() ], simOptions );
    sim.start();
  } );
} );