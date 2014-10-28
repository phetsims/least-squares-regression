// Copyright 2002-2014, University of Colorado Boulder

/**
 * View representation of a DataPointPlacementGraph, which is a board (like a whiteboard or bulletin board) where shapes
 * can be placed.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  // var Path = require( 'SCENERY/nodes/Path' );
//  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {DataPointPlacementGraph} dataPointPlacementGraph
   * @constructor
   */
  function DataPointPlacementGraphNode( dataPointPlacementGraph ) {
    Node.call( this );

    // Create and add the board itself.
    var board = Rectangle.bounds( dataPointPlacementGraph.bounds, { fill: 'white', stroke: 'black' } );
    this.addChild( board );


    // Monitor the shapes added by the user to the board and create an equivalent shape with no edges for each.  This
    // may seem a little odd - why hide the shapes that the user placed and depict them with essentially the same
    // thing minus the edge stroke?  The reason is that this makes layering and control of visual modes much easier.
    var dataPointsLayer = new Node();
    this.addChild( dataPointsLayer );
    dataPointPlacementGraph.graphDataPoints.addItemAddedListener( function( addedDataPoint ) {
      if ( dataPointPlacementGraph.formComposite ) {
        // Add a representation of the shape.
        var representation = new Circle( 10, {fill: 'orange', stroke: 'black', lineWidth: 1} );
        representation.center = addedDataPoint.position;
        dataPointsLayer.addChild( representation );

        dataPointPlacementGraph.graphDataPoints.addItemRemovedListener( function removalListener( removedDataPoint ) {
          if ( removedDataPoint === addedDataPoint ) {
            dataPointsLayer.removeChild( representation );
            dataPointPlacementGraph.graphDataPoints.removeItemRemovedListener( removalListener );
          }
        } );
      }
    } );


  }

  return inherit( Node, DataPointPlacementGraphNode );
} );