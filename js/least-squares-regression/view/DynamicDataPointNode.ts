// Copyright 2014-2024, University of Colorado Boulder

/**
 * Type that represents a movable dataPoint in the view.
 *
 * @author Martin Veillette (Berea College)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Circle, SimpleDragHandler } from '../../../../scenery/js/imports.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';
import LeastSquaresRegressionConstants from '../LeastSquaresRegressionConstants.js';
import DataPoint from '../model/DataPoint.js';
import DataPointNode from './DataPointNode.js';

class DynamicDataPointNode extends DataPointNode {

  public constructor( dataPoint: DataPoint, modelViewTransform: ModelViewTransform2 ) {

    // Create the visual representation of the DynamicDataPoint
    const representation = new Circle( LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_RADIUS, {
      fill: LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_FILL,
      stroke: LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_STROKE,
      lineWidth: LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_LINE_WIDTH
    } );

    super( dataPoint, representation, modelViewTransform );

    // Expand the touch area
    this.touchArea = this.localBounds.dilatedXY( 15, 15 );

    // Add the listener that will allow the user to drag the dataPoint around.
    this.addInputListener( new SimpleDragHandler( {
      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,

      // Handler that moves the dataPoint in model space.
      start: () => {
        dataPoint.userControlledProperty.set( true );
      },

      translate: ( args: { delta: Vector2; oldPosition: Vector2; position: Vector2 } ) => {
        dataPoint.positionProperty.value = modelViewTransform.viewToModelPosition( args.position );
      },

      end: () => {
        dataPoint.userControlledProperty.set( false );
      }
    } ) );
  }
}

leastSquaresRegression.register( 'DynamicDataPointNode', DynamicDataPointNode );

export default DynamicDataPointNode;