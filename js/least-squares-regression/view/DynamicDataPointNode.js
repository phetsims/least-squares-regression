// Copyright 2014-2019, University of Colorado Boulder

/**
 * Type that represents a movable dataPoint in the view.
 *
 * @author Martin Veillette (Berea College)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import SimpleDragHandler from '../../../../scenery/js/input/SimpleDragHandler.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';
import LeastSquaresRegressionConstants from '../LeastSquaresRegressionConstants.js';
import DataPointNode from './DataPointNode.js';

/**
 * @param {DataPoint} dataPoint
 * @param {ModelViewTransform2} modelViewTransform
 * @constructor
 */
function DynamicDataPointNode( dataPoint, modelViewTransform ) {

  // Create the visual representation of the DynamicDataPoint
  const representation = new Circle( LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_RADIUS, {
    fill: LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_FILL,
    stroke: LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_STROKE,
    lineWidth: LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_LINE_WIDTH
  } );

  DataPointNode.call( this, dataPoint, representation, modelViewTransform );

  // Expand the touch area
  this.touchArea = this.localBounds.dilatedXY( 15, 15 );

  // Add the listener that will allow the user to drag the dataPoint around.
  this.addInputListener( new SimpleDragHandler( {
    // Allow moving a finger (touch) across a node to pick it up.
    allowTouchSnag: true,

    // Handler that moves the dataPoint in model space.
    start: function( event, trail ) {
      dataPoint.userControlledProperty.set( true );
    },

    translate: function( args ) {
      dataPoint.positionProperty.value = modelViewTransform.viewToModelPosition( args.position );
    },

    end: function( event, trail ) {
      dataPoint.userControlledProperty.set( false );
    }
  } ) );
}

leastSquaresRegression.register( 'DynamicDataPointNode', DynamicDataPointNode );

inherit( DataPointNode, DynamicDataPointNode );
export default DynamicDataPointNode;