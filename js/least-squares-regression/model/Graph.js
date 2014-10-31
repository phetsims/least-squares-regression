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
  //var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var PropertySet = require( 'AXON/PropertySet' );
  // var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Dimension2} size
   * @param {Vector2} originPosition
   * @param {Range} xRange
   * @param {Range} yRange
   * @constructor
   */
  function Graph( size, originPosition, xRange, yRange ) {

//    this.addProperty( slope, 0);
//    this.addProperty( intercept, 0);

    PropertySet.call( this, {
      slope: 0,
      intercept: 0
    } );

    this.size = size;
    this.originPosition = originPosition;
    this.xRange = xRange;
    this.yRange = yRange;

    //   this.lines = new ObservableArray(); // {Line} lines that the graph is currently displaying


    // Observable array of the points that have been placed on this graph.
    // this.graphDataPoints = new ObservableArray();

    // public values.
    this.bounds = new Bounds2( this.xRange.min, this.yRange.min, this.xRange.max, this.yRange.max ); // @public

//    this.graphOriginPosition = new Vector2( this.xRange.min, this.yRange.min );
//    this.viewOriginPosition = originPosition;
//    this.scaleXFactor = this.size.width / this.xRange.getLength();
//    this.scaleYFactor = -1 * this.size.height / this.yRange.getLength();
  }

  return inherit( PropertySet, Graph, {

    // @private
    dataPointOverlapsGraph: function( dataPoint ) {
      return this.bounds.containsPoint( dataPoint.position );
    },


    /**
     * Place the provide data point on this graph. Returns false if the data point
     * is not over the graph.
     * @public
     * @param {DataPoint} dataPoint A model data point
     */
    placeDataPoint: function( dataPoint ) {
      assert && assert( dataPoint.userControlled === false, 'Data Points can\'t be placed when still controlled by user.' );
      if ( this.dataPointOverlapsGraph( dataPoint ) ) {
        dataPoint.setDestination( dataPoint.position, false );
        return true;
      }
      return false;
    },

    getBoundaryPoints: function() {
      var boundaryPoints = [];
      var leftYIntercept = this.slope * this.xRange.min + this.intercept;
      var rightYIntercept = this.slope * this.xRange.max + this.intercept;
      var bottomXIntercept = (this.yRange.min - this.intercept) / this.slope;
      var topXIntercept = (this.yRange.max - this.intercept) / this.slope;

      if ( this.yRange.contains( leftYIntercept ) ) {
        boundaryPoints.push( new Vector2( this.xRange.min, leftYIntercept ) );
      }
      if ( this.yRange.contains( rightYIntercept ) ) {
        boundaryPoints.push( new Vector2( this.xRange.max, rightYIntercept ) );
      }
      if ( this.xRange.contains( bottomXIntercept ) ) {
        boundaryPoints.push( new Vector2( bottomXIntercept, this.yRange.min ) );
      }
      if ( this.xRange.contains( topXIntercept ) ) {
        boundaryPoints.push( new Vector2( topXIntercept, this.yRange.max ) );
      }

      if ( boundaryPoints.length === 0 ) {
        boundaryPoints.push( new Vector2( 0, 0 ) );
        boundaryPoints.push( new Vector2( 0, 0 ) );
      }
      // the line can intersect the graph bounds at either 2 points or none.
      //   assert && assert( boundaryPoints.length === 2 || boundaryPoints.length === 0 );

      return boundaryPoints;
    }
  } );
} );