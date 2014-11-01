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
  var Util = require( 'DOT/Util' );
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

    // public values.
    this.bounds = new Bounds2( this.xRange.min, this.yRange.min, this.xRange.max, this.yRange.max ); // @public

  }

  return inherit( PropertySet, Graph, {


    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.dataPointsOnGraph = [];
    },

    isDataPointPositionOverlappingGraph: function( position ) {
      return this.bounds.containsPoint( position );
    },

    removePoint: function( dataPoint ) {
      if ( this.isDataPointOnList( dataPoint ) ) {
        var index = this.dataPointsOnGraph.indexOf( dataPoint );
        this.unfollowPoint( dataPoint );
        this.dataPointsOnGraph.splice( index, 1 );
      }
    },

    addPoint: function( dataPoint ) {
      if ( !this.isDataPointOnList( dataPoint ) ) {
        this.dataPointsOnGraph.push( dataPoint );
        //    this.followPoint( dataPoint );
      }
    },

    isDataPointOnList: function( dataPoint ) {
      var index = this.dataPointsOnGraph.indexOf( dataPoint );
      return index === -1 ? false : true;
    },

    followPoint: function( dataPoint ) {
      var self = this;
      dataPoint.positionProperty.link( function() {
          self.update();
        }
      );
    },

    findResiduals: function( slope, intercept ) {
      var residualArray = [];
      var residualPoints = {};
      this.dataPointsOnGraph.forEach( function( dataPoint ) {
        var yValue = slope * dataPoint.position.x + intercept;
        var yValueWithinBounds = Util.clamp( yValue, yRange.min, YRange.max );
        var residualPoints = {
          point1: new Vector2( dataPoint.position.x, yValueWithinBounds ),
          point2: dataPoint.position
        };
        residualArray.push( residualPoints );
      } );
      return residualArray;
    },


    unfollowPoint: function( dataPoint ) {
    },

    update: function() {

    },

    getBoundaryPoints: function( slope, intercept ) {
      var boundaryPoints = [];
      var valueBottomLeft = slope * this.xRange.min + intercept - this.yRange.min;
      var valueTopLeft = slope * this.xRange.min + intercept - this.yRange.max;
      var valueBottomRight = slope * this.xRange.max + intercept - this.yRange.min;
      var valueTopRight = slope * this.xRange.max + intercept - this.yRange.max;

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
        var bottomXIntercept = (this.yRange.min - intercept) / slope;
        boundaryPoints.push( new Vector2( bottomXIntercept, this.yRange.min ) );
      }

      if ( valueTopLeft * valueTopRight < 0 ) {
        var topXIntercept = (this.yRange.max - intercept) / slope;
        boundaryPoints.push( new Vector2( topXIntercept, this.yRange.max ) );
      }

      if ( valueBottomRight * valueTopRight < 0 ) {
        var rightYIntercept = slope * this.xRange.max + intercept;
        boundaryPoints.push( new Vector2( this.xRange.max, rightYIntercept ) );
      }

      if ( valueBottomLeft * valueTopLeft < 0 ) {
        var leftYIntercept = slope * this.xRange.min + intercept;
        boundaryPoints.push( new Vector2( this.xRange.min, leftYIntercept ) );
      }

      // no points cross the bounds
      //TODO find a way not to pass anything.
      if ( boundaryPoints.length === 0 ) {
        boundaryPoints.push( new Vector2( this.xRange.min, this.yRange.min ) );
        boundaryPoints.push( new Vector2( this.xRange.min, this.yRange.min ) );
      }
      // the line crosses the bounds at one corner
      if ( boundaryPoints.length === 1 ) {
        boundaryPoints.push( boundaryPoints[0] );
      }
      assert && assert( boundaryPoints.length <= 2, 'A straight line cannot cross the rectangular bounds at more than two places' );
      return boundaryPoints;
    },

    getStatistics: function() {

      var dataPointArray = this.dataPointsOnGraph;
      var arrayLength = dataPointArray.length;
      var squaresXX = _.map( dataPointArray, function( dataPoint ) { return dataPoint.position.x * dataPoint.position.x; } );
      var squaresXY = _.map( dataPointArray, function( dataPoint ) { return dataPoint.position.x * dataPoint.position.y; } );
      var squaresYY = _.map( dataPointArray, function( dataPoint ) { return dataPoint.position.y * dataPoint.position.y; } );
      var positionArrayX = _.map( dataPointArray, function( dataPoint ) { return dataPoint.position.x; } );
      var positionArrayY = _.map( dataPointArray, function( dataPoint ) { return dataPoint.position.y; } );

      function add( memo, num ) {
        return memo + num;
      }

      var sumOfSquaresXX = _.reduce( squaresXX, add, 0 );
      var sumOfSquaresXY = _.reduce( squaresXY, add, 0 );
      var sumOfSquaresYY = _.reduce( squaresYY, add, 0 );
      var sumOfX = _.reduce( positionArrayX, add, 0 );
      var sumOfY = _.reduce( positionArrayY, add, 0 );

      this.averageOfSumOfSquaresXX = sumOfSquaresXX / arrayLength;
      this.averageOfSumOfSquaresXY = sumOfSquaresXY / arrayLength;
      this.averageOfSumOfSquaresYY = sumOfSquaresYY / arrayLength;
      this.averageOfSumOfX = sumOfX / arrayLength;
      this.averageOfSumOfY = sumOfY / arrayLength;
    },

    getLinearFit: function() {
      this.getStatistics();

      var slopeNumerator = this.averageOfSumOfSquaresXY - this.averageOfSumOfX * this.averageOfSumOfY;
      var slopeDenominator = this.averageOfSumOfSquaresXX - this.averageOfSumOfX * this.averageOfSumOfX;
      var slope = slopeNumerator / slopeDenominator;

      var intercept = this.averageOfSumOfY - slope * this.averageOfSumOfX;

//      var pearsonCoefficientCorrelationNumerator = slopeNumerator;
//      var pearsonCoefficientCorrelationDenominator = Math.sqrt( ( this.averageOfSumOfSquaresXX - this.averageOfSumOfX * this.averageOfSumOfX) * ( this.averageOfSumOfSquaresYY - this.averageOfSumOfY * this.averageOfSumOfY) );
//      var pearsonCoefficientCorrelation = pearsonCoefficientCorrelationNumerator / pearsonCoefficientCorrelationDenominator;

      var fitParameters = {
        slope: slope,
        intercept: intercept
//        pearsonCoefficientCorrelation: pearsonCoefficientCorrelation
      };
      return fitParameters;
    },

    getPearsonCoefficientCorrelation: function() {
      this.getStatistics();
      var pearsonCoefficientCorrelationNumerator = this.averageOfSumOfSquaresXY - this.averageOfSumOfX * this.averageOfSumOfY;
      var pearsonCoefficientCorrelationDenominator = Math.sqrt( ( this.averageOfSumOfSquaresXX - this.averageOfSumOfX * this.averageOfSumOfX) * ( this.averageOfSumOfSquaresYY - this.averageOfSumOfY * this.averageOfSumOfY) );
      var pearsonCoefficientCorrelation = pearsonCoefficientCorrelationNumerator / pearsonCoefficientCorrelationDenominator;
      return pearsonCoefficientCorrelation;
    }

  } )
    ;
} )
;