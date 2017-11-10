// Copyright 2014-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var LeastSquaresRegressionScreen = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var leastSquaresRegressionTitleString = require( 'string!LEAST_SQUARES_REGRESSION/least-squares-regression.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Amanda McGarry',
      softwareDevelopment: 'Martin Veillette',
      team: 'Trish Loeblein, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Bryan Yoelin'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( leastSquaresRegressionTitleString, [ new LeastSquaresRegressionScreen() ], simOptions );
    sim.start();
  } );
} );