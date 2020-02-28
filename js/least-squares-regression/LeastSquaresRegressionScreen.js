// Copyright 2014-2020, University of Colorado Boulder

/**
 *
 * @author Martin Veillette (Berea College)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import leastSquaresRegression from '../leastSquaresRegression.js';
import LeastSquaresRegressionConstants from './LeastSquaresRegressionConstants.js';
import LeastSquaresRegressionModel from './model/LeastSquaresRegressionModel.js';
import LeastSquaresRegressionScreenView from './view/LeastSquaresRegressionScreenView.js';

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

inherit( Screen, LeastSquaresRegressionScreen );
export default LeastSquaresRegressionScreen;