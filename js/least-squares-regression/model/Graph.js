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
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  //var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
//  var ObservableArray = require( 'AXON/ObservableArray' );
  var PropertySet = require( 'AXON/PropertySet' );
  // var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Range} xRange
   * @param {Range} yRange
   * @constructor
   */
  function Graph( xRange, yRange ) {

    PropertySet.call( this, {
      angleSlope: 0, // in radians
      intercept: 0
    } );


    this.slopeProperty = new DerivedProperty( [this.angleSlopeProperty],
      function( angle ) {
        var slope = 2 * Math.tan( angle );
        return slope;
      } );

    this.xRange = xRange;
    this.yRange = yRange;


    this.dataPointsOnGraph = [];

    // Observable array of the points that have been placed on this graph.
    // this.graphDataPoints = new ObservableArray();

    // public values.
    this.bounds = new Bounds2( this.xRange.min, this.yRange.min, this.xRange.max, this.yRange.max ); // @public


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
      var valueBottomLeft = this.slopeProperty.value * this.xRange.min + this.intercept - this.yRange.min;
      var valueTopLeft = this.slopeProperty.value * this.xRange.min + this.intercept - this.yRange.max;
      var valueBottomRight = this.slopeProperty.value * this.xRange.max + this.intercept - this.yRange.min;
      var valueTopRight = this.slopeProperty.value * this.xRange.max + this.intercept - this.yRange.max;

      if ( valueBottomLeft === 0 ) {
        boundaryPoints.push( new Vector2( this.xRange.min, this.yRange.min ) );
      }
      if ( valueTopLeft === 0 ) {
        boundaryPoints.push( new Vector2( this.xRange.min, this.yRange.max ) );
      }
      if ( valueBottomRight === 0 ) {
        boundaryPoints.push( new Vector2( this.xRange.max, this.yRange.min ) );
      }
      if ( valueTopRight === 0 ) {
        boundaryPoints.push( new Vector2( this.xRange.max, this.yRange.max ) );
      }

      if ( valueBottomLeft * valueBottomRight < 0 ) {
        var bottomXIntercept = (this.yRange.min - this.intercept) / this.slopeProperty.value;
        boundaryPoints.push( new Vector2( bottomXIntercept, this.yRange.min ) );
      }

      if ( valueTopLeft * valueTopRight < 0 ) {
        var topXIntercept = (this.yRange.max - this.intercept) / this.slopeProperty.value;
        boundaryPoints.push( new Vector2( topXIntercept, this.yRange.max ) );
      }

      if ( valueBottomRight * valueTopRight < 0 ) {
        var rightYIntercept = this.slopeProperty.value * this.xRange.max + this.intercept;
        boundaryPoints.push( new Vector2( this.xRange.max, rightYIntercept ) );
      }

      if ( valueBottomLeft * valueTopLeft < 0 ) {
        var leftYIntercept = this.slopeProperty.value * this.xRange.min + this.intercept;
        boundaryPoints.push( new Vector2( this.xRange.min, leftYIntercept ) );
      }

      // no points cross the bounds
      if ( boundaryPoints.length === 0 ) {
        boundaryPoints.push( new Vector2( this.xRange.min, this.yRange.min ) );
        boundaryPoints.push( new Vector2( this.xRange.min, this.yRange.min ) );
      }
      // the line crosses the bounds at one corner
      if ( boundaryPoints.length === 1 ) {
        boundaryPoints.push( boundaryPoints[0] );
      }
      return boundaryPoints;
    }


  } );
} );