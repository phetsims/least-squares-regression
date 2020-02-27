// Copyright 2014-2019, University of Colorado Boulder

/**
 * Type that represents a static dataPoint in the view.
 *
 * @author Martin Veillette (Berea College)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';
import LeastSquaresRegressionConstants from '../LeastSquaresRegressionConstants.js';
import DataPointNode from './DataPointNode.js';

/**
 * @param {DataPoint} dataPoint
 * @param {ModelViewTransform2} modelViewTransform
 * @constructor
 */
function StaticDataPointNode( dataPoint, modelViewTransform ) {

  // Create and add  visual representation of the dataPoint
  const representation = new Circle( LeastSquaresRegressionConstants.STATIC_DATA_POINT_RADIUS, {
    fill: LeastSquaresRegressionConstants.STATIC_DATA_POINT_FILL,
    stroke: LeastSquaresRegressionConstants.STATIC_DATA_POINT_STROKE,
    lineWidth: LeastSquaresRegressionConstants.STATIC_DATA_POINT_LINE_WIDTH
  } );

  DataPointNode.call( this, dataPoint, representation, modelViewTransform );
}

leastSquaresRegression.register( 'StaticDataPointNode', StaticDataPointNode );

inherit( DataPointNode, StaticDataPointNode );
export default StaticDataPointNode;