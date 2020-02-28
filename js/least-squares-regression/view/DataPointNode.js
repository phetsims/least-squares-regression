// Copyright 2014-2020, University of Colorado Boulder

/**
 * Type that represents a dataPoint in the view.
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';

/**
 * @param {DataPoint} dataPoint
 * @param {Node} representation
 * @param {ModelViewTransform2} modelViewTransform
 * @constructor
 */
function DataPointNode( dataPoint, representation, modelViewTransform ) {
  Node.call( this, { cursor: 'pointer', children: [ representation ] } );
  const self = this;

  // Create a listener to the position of the dataPoint
  const centerPositionListener = function( position ) {
    self.center = modelViewTransform.modelToViewPosition( position );
  };

  // Move this node as the model representation moves
  dataPoint.positionProperty.link( centerPositionListener );

  // @private: just for dispose.  Named based on the type name so it won't have a name collision with parent/child ones
  this.disposeDataPointNode = function() {
    dataPoint.positionProperty.unlink( centerPositionListener );
  };

}

leastSquaresRegression.register( 'DataPointNode', DataPointNode );

export default inherit( Node, DataPointNode, {
  dispose: function() {
    this.disposeDataPointNode();
    Node.prototype.dispose.call( this );
  }
} );