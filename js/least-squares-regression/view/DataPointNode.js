/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * Type that represents a dataPoint in the view.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );


  /**
   * @param {DataPoint} dataPoint
   * @param {ModelViewTransform} modelViewTransform
   * @constructor
   */
  function DataPointNode( dataPoint, modelViewTransform ) {
    Node.call( this, {cursor: 'pointer'} );
    var self = this;

    // Move this node as the model representation moves
    dataPoint.positionProperty.link( function( position ) {
      self.center = modelViewTransform.modelToViewPosition( position );
    } );
  }

  return inherit( Node, DataPointNode );
} );