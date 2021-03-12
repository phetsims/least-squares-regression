// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Martin Veillette (Berea College)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import leastSquaresRegressionStrings from './leastSquaresRegressionStrings.js';
import LeastSquaresRegressionScreen from './least-squares-regression/LeastSquaresRegressionScreen.js';

const leastSquaresRegressionTitleString = leastSquaresRegressionStrings[ 'least-squares-regression' ].title;

const simOptions = {
  credits: {
    leadDesign: 'Amanda McGarry',
    softwareDevelopment: 'Martin Veillette',
    team: 'Trish Loeblein, Ariel Paul, Kathy Perkins',
    qualityAssurance: 'Steele Dalton, Bryan Yoelin'
  }
};

simLauncher.launch( () => {
  const sim = new Sim( leastSquaresRegressionTitleString, [ new LeastSquaresRegressionScreen() ], simOptions );
  sim.start();
} );