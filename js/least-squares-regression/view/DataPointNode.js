// Copyright 2002-2015, University of Colorado Boulder

/**
 * Type that represents a dataPoint in the view.
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param {DataPoint} dataPoint
   * @param {Node} representation
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function DataPointNode( dataPoint, representation, modelViewTransform ) {
    Node.call( this, { cursor: 'pointer', children: [ representation ] } );
    var self = this;

    // Move this node as the model representation moves
    dataPoint.positionProperty.link( function( position ) {
      self.center = modelViewTransform.modelToViewPosition( position );
    } );
  }

  return inherit( Node, DataPointNode );
} );