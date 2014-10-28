/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * Model of a rectangular board (like a white board or bulletin board) upon which various smaller shapes can be placed.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  // var Color = require( 'SCENERY/util/Color' );
  // var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var PropertySet = require( 'AXON/PropertySet' );
  // var Shape = require( 'KITE/Shape' );
//  var Vector2 = require( 'DOT/Vector2' );


  /**
   * @param {Dimension2} size
   * @param {Vector2} position
   * @constructor
   */
  function DataPointPlacementGraph( size, position ) {

    PropertySet.call( this, {
    } );

    // Observable array of the shapes that have been placed on this board.
    this.graphDataPoints = new ObservableArray();

    // Non-dynamic public values.
    this.bounds = new Bounds2( position.x, position.y, position.x + size.width, position.y + size.height ); // @public
  }

  return inherit( PropertySet, DataPointPlacementGraph, {

    // @private
    dataPointOverlapsGraph: function( dataPoint ) {
      return this.bounds.containsPoint( dataPoint.position );
    },

    /**
     * Place the provide shape on this board.  Returns false if the color does not match the handled color or if the
     * shape is not partially over the board.
     * @public
     * @param {MovableShape} movableDataPoint A model shape
     */
    placeDataPoint: function( movableDataPoint ) {
      assert && assert( movableDataPoint.userControlled === false, 'Shapes can\'t be placed when still controlled by user.' );
      if ( this.dataPointOverlapsGraph( movableDataPoint ) ) {
        movableDataPoint.setDestination( movableDataPoint.position, false );
        return true;
      }
      return false;
    }



  } );
} );