/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * Model of a rectangular graph upon which various data points can be placed.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  // var PropertySet = require( 'AXON/PropertySet' );
  // var Shape = require( 'KITE/Shape' );
//  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Dimension2} size
   * @param {Vector2} position
   * @param {Range} xRange
   * @param {Range} yRange
   * @constructor
   */
  function DataPointPlacementGraph( size, position, xRange, yRange ) {

    this.xRange = xRange;
    this.yRange = yRange;

    this.lines = new ObservableArray(); // {Line} lines that the graph is currently displaying

    // Observable array of the points that have been placed on this graph.
    this.graphDataPoints = new ObservableArray();

    // Non-dynamic public values.
    this.bounds = new Bounds2( position.x, position.y, position.x + size.width, position.y + size.height ); // @public
  }

  return inherit( Object, DataPointPlacementGraph, {

    // @private
    dataPointOverlapsGraph: function( dataPoint ) {
      return this.bounds.containsPoint( dataPoint.position );
    },

    /**
     * Place the provide data point on this graph.  Returns false if the data point
     * is not partially over the graph.
     * @public
     * @param {MovableDataPoint} movableDataPoint A model data point
     */
    placeDataPoint: function( movableDataPoint ) {
      assert && assert( movableDataPoint.userControlled === false, 'Data Points can\'t be placed when still controlled by user.' );
      if ( this.dataPointOverlapsGraph( movableDataPoint ) ) {
        movableDataPoint.setDestination( movableDataPoint.position, false );
        return true;
      }
      return false;
    }


  } );
} );