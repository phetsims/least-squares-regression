// Copyright 2014-2024, University of Colorado Boulder

/**
 * Type that represents a dataPoint in the view.
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';
import DataPoint from '../model/DataPoint.js';

export default class DataPointNode extends Node {

  /**
   * A function to dispose of the DataPointNode's listeners.
   */
  private readonly disposeDataPointNode: () => void;

  /**
   * @param dataPoint - The DataPoint model instance.
   * @param representation - The visual representation Node of the DataPoint.
   * @param modelViewTransform - The ModelViewTransform2 instance for coordinate transformations.
   */
  public constructor(
    dataPoint: DataPoint,
    representation: Node,
    modelViewTransform: ModelViewTransform2
  ) {
    super( { cursor: 'pointer', children: [ representation ] } );

    // Create a listener to the position of the dataPoint
    const centerPositionListener = ( position: Vector2 ) => {
      this.center = modelViewTransform.modelToViewPosition( position );
    };

    // Move this node as the model representation moves
    dataPoint.positionProperty.link( centerPositionListener );

    // TODO: use disposeEmitter, see https://github.com/phetsims/least-squares-regression/issues/94
    this.disposeDataPointNode = () => {
      dataPoint.positionProperty.unlink( centerPositionListener );
    };
  }

  /**
   * Releases references and listeners to prevent memory leaks.
   */
  public override dispose(): void {
    this.disposeDataPointNode();
    super.dispose();
  }
}

leastSquaresRegression.register( 'DataPointNode', DataPointNode );