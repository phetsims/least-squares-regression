// Copyright 2014-2024, University of Colorado Boulder

/**
 * A Scenery node that can be clicked upon to create new DataPoints in the model.
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Circle, Node, NodeOptions, SceneryEvent, SimpleDragHandler } from '../../../../scenery/js/imports.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';
import LeastSquaresRegressionConstants from '../LeastSquaresRegressionConstants.js';
import DataPoint from '../model/DataPoint.js';

class DataPointCreatorNode extends Node {

  /**
   * @param addDataPointToModel - A function for adding the created DataPoint to the model.
   * @param modelViewTransform - The ModelViewTransform2 instance for coordinate transformations.
   * @param options - Optional customization options.
   */
  public constructor(
    addDataPointToModel: ( dataPoint: DataPoint ) => void,
    modelViewTransform: ModelViewTransform2,
    options?: NodeOptions // TODO: rename to providedOptions https://github.com/phetsims/least-squares-regression/issues/94
  ) {
    super( { cursor: 'pointer' } );

    // Create the node that the user will click upon to add a model element to the view.
    const representation = new Circle( LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_RADIUS, {
      fill: LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_FILL,
      stroke: LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_STROKE,
      lineWidth: LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_LINE_WIDTH
    } );

    this.addChild( representation );

    // Set up the mouse and touch areas for this node so that this can still be grabbed when invisible.
    this.touchArea = this.localBounds.dilated( 15 );
    this.mouseArea = this.localBounds.dilated( 5 );

    let parentScreenView: ScreenView | null = null;
    let dataPoint: DataPoint | null = null;

    // Add the listener that will allow the user to click on this and create a new dataPoint, then position it in the model.
    this.addInputListener( new SimpleDragHandler( {

      // Allow moving a finger (touch) across this node to interact with it
      allowTouchSnag: true,

      start: ( event: SceneryEvent ) => {

        // find the parent screen if not already found by moving up the scene graph
        if ( !parentScreenView ) {

          let testNode = ( this as Node ) || null; // Workaround for lint errors for this alias
          while ( testNode !== null ) {
            if ( testNode instanceof ScreenView ) {
              parentScreenView = testNode;
              break;
            }
            testNode = testNode.parents[ 0 ]; // move up the scene graph by one level
          }
          assert && assert( parentScreenView, 'unable to find parent screen view' );
        }

        // Determine the initial position (set to be one circle radius above the pointer point)
        const initialPosition = parentScreenView!.globalToLocalPoint( event.pointer.point.plus( new Vector2( 0, -LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_RADIUS ) ) );

        // Create and add the new model element.
        dataPoint = new DataPoint( modelViewTransform.viewToModelPosition( initialPosition ) );
        dataPoint.userControlledProperty.set( true );
        addDataPointToModel( dataPoint );
      },

      translate: ( translationParams: { delta: Vector2; oldPosition: Vector2; position: Vector2 } ) => {
        dataPoint!.positionProperty.value = dataPoint!.positionProperty.value.plus( modelViewTransform.viewToModelDelta( translationParams.delta ) );
      },

      end: () => {
        dataPoint!.userControlledProperty.set( false );
        dataPoint = null;
      }
    } ) );

    // Pass options through to parent.
    this.mutate( options );
  }
}

leastSquaresRegression.register( 'DataPointCreatorNode', DataPointCreatorNode );

export default DataPointCreatorNode;