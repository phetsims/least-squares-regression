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
//  var ObservableArray = require( 'AXON/ObservableArray' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Range} xRange
   * @param {Range} yRange
   * @constructor
   */
  function Graph( xRange, yRange ) {

    PropertySet.call( this, {
      angle: 0, // in radians
      intercept: 0
    } );

    this.xRange = xRange;
    this.yRange = yRange;

    this.dataPointsOnGraph = [];

    // public values.
    this.bounds = new Bounds2( this.xRange.min, this.yRange.min, this.xRange.max, this.yRange.max );

  }

  return inherit( PropertySet, Graph, {

    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.dataPointsOnGraph = [];
    },

    getWidth: function() {
      return this.bounds.width
    },

    getHeight: function() {
      return this.bounds.height
    },

    slope: function( angle ) {
      //TODO find a more robust way
      return  2 * Math.tan( angle );
    },

    isDataPointPositionOverlappingGraph: function( position ) {
      return this.bounds.containsPoint( position );
    },

    removePoint: function( dataPoint ) {
      if ( this.isDataPointOnList( dataPoint ) ) {
        var index = this.dataPointsOnGraph.indexOf( dataPoint );
        this.dataPointsOnGraph.splice( index, 1 );
      }
    },

    addPoint: function( dataPoint ) {
      if ( !this.isDataPointOnList( dataPoint ) ) {
        this.dataPointsOnGraph.push( dataPoint );
      }
    },

    isDataPointOnList: function( dataPoint ) {
      var index = this.dataPointsOnGraph.indexOf( dataPoint );
      return (index !== -1);
    },

    residualsPoints: function( slope, intercept ) {
      var residualPointArray = [];
      var self = this;
      assert && assert( this.dataPointsOnGraph !== null, 'dataPointsOnGraph must contain data' );
      this.dataPointsOnGraph.forEach( function( dataPoint ) {
        var yValue = slope * dataPoint.position.x + intercept;
        var yValueWithinBounds = Util.clamp( yValue, self.yRange.min, self.yRange.max );
        var residualPoints = {
          point1: new Vector2( dataPoint.position.x, yValueWithinBounds ),
          point2: new Vector2( dataPoint.position.x, dataPoint.position.y )
        };
        residualPointArray.push( residualPoints );
      } );
      return residualPointArray;
    },

    squaredResidualsRectangles: function( slope, intercept ) {
      var squaredResidualArray = [];
      var self = this;
      assert && assert( this.dataPointsOnGraph !== null, 'dataPointsOnGraph must contain data' );
      this.dataPointsOnGraph.forEach( function( dataPoint ) {
        var yValue = slope * dataPoint.position.x + intercept;
        var yValueWithinBounds = Util.clamp( yValue, self.yRange.min, self.yRange.max );
        var heightCorrected = yValueWithinBounds - dataPoint.position.y;
        //TODO xValue must be a square in the view!!
        var height = yValue - dataPoint.position.y;
        if ( slope < 0 ) {
          height = -height;
        }
        var xValue = dataPoint.position.x + height;
        var xValueWithinBounds = Util.clamp( xValue, self.xRange.min, self.xRange.max );
        var widthCorrected = xValueWithinBounds - dataPoint.position.x;
        var minX = Math.min( dataPoint.position.x, dataPoint.position.x + widthCorrected );
        var maxX = Math.max( dataPoint.position.x, dataPoint.position.x + widthCorrected );
        var minY = Math.min( dataPoint.position.y, dataPoint.position.y + heightCorrected );
        var maxY = Math.max( dataPoint.position.y, dataPoint.position.y + heightCorrected );
        var rectangle = new Bounds2( minX, minY, maxX, maxY );
        squaredResidualArray.push( rectangle );
      } );
      return squaredResidualArray;
    },

    sumOfSquaredResiduals: function( slope, intercept ) {
      var sumOfSquareResiduals = 0;
      this.dataPointsOnGraph.forEach( function( dataPoint ) {
        var yResidual = (slope * dataPoint.position.x + intercept) - dataPoint.position.y;
        sumOfSquareResiduals += yResidual * yResidual;
      } );
      return sumOfSquareResiduals;
    },

    getMyLineSumOfSquaredResiduals: function() {
      if ( this.dataPointsOnGraph.length >= 1 ) {
        return this.sumOfSquaredResiduals( this.slope( this.angle ), this.intercept );
      }
      else {
        return 0;
      }
    },

    getBestFitLineSumOfSquaredResiduals: function() {
      if ( this.dataPointsOnGraph.length >= 2 ) {
        var linearFitParameters = this.getLinearFit();
        return this.sumOfSquaredResiduals( linearFitParameters.slope, linearFitParameters.intercept )
      }
      else {
        return 0;
      }
    },

    getMyLineSquaredResidualsRectangles: function() {
      if ( this.dataPointsOnGraph.length >= 1 ) {
        return this.squaredResidualsRectangles( this.slope( this.angle ), this.intercept );
      }
      else {
        return null;
      }
    },

    getBestFitLineSquaredResidualsRectangles: function() {
      if ( this.dataPointsOnGraph.length >= 2 ) {
        var linearFitParameters = this.getLinearFit();
        return this.squaredResidualsRectangles( linearFitParameters.slope, linearFitParameters.intercept );
      }
      else {
        return null;
      }
    },

    getMyLineResidualsPoints: function() {
      if ( this.dataPointsOnGraph.length >= 1 ) {
        return this.residualsPoints( this.slope( this.angle ), this.intercept );
      }
      else {
        return null;
      }

    },

    getBestFitLineResidualsPoints: function() {
      if ( this.dataPointsOnGraph.length >= 2 ) {
        var linearFitParameters = this.getLinearFit();
        return this.residualsPoints( linearFitParameters.slope, linearFitParameters.intercept );
      }
      else {
        return null;
      }
    },

    /**
     * Returns an array of two points that crosses the rectangular bounds of the graph
     *
     * @param {number} slope
     * @param {number} intercept
     */
    getBoundaryPoints: function( slope, intercept ) {
      var boundaryPointArray = [];
      // check the four corner points

      var valueBottomLeft = slope * this.xRange.min + intercept - this.yRange.min;
      var valueTopLeft = slope * this.xRange.min + intercept - this.yRange.max;
      var valueBottomRight = slope * this.xRange.max + intercept - this.yRange.min;
      var valueTopRight = slope * this.xRange.max + intercept - this.yRange.max;

      if ( valueBottomLeft === 0 ) {
        boundaryPointArray.push( new Vector2( this.xRange.min, this.yRange.min ) );
      }
      if ( valueTopLeft === 0 ) {
        boundaryPointArray.push( new Vector2( this.xRange.min, this.yRange.max ) );
      }
      if ( valueBottomRight === 0 ) {
        boundaryPointArray.push( new Vector2( this.xRange.max, this.yRange.min ) );
      }
      if ( valueTopRight === 0 ) {
        boundaryPointArray.push( new Vector2( this.xRange.max, this.yRange.max ) );
      }

      // Check along the boundaries. The sign of the function must change

      if ( valueBottomLeft * valueBottomRight < 0 ) {
        var bottomXIntercept = (this.yRange.min - intercept) / slope;
        boundaryPointArray.push( new Vector2( bottomXIntercept, this.yRange.min ) );
      }

      if ( valueTopLeft * valueTopRight < 0 ) {
        var topXIntercept = (this.yRange.max - intercept) / slope;
        boundaryPointArray.push( new Vector2( topXIntercept, this.yRange.max ) );
      }

      if ( valueBottomRight * valueTopRight < 0 ) {
        var rightYIntercept = slope * this.xRange.max + intercept;
        boundaryPointArray.push( new Vector2( this.xRange.max, rightYIntercept ) );
      }

      if ( valueBottomLeft * valueTopLeft < 0 ) {
        var leftYIntercept = slope * this.xRange.min + intercept;
        boundaryPointArray.push( new Vector2( this.xRange.min, leftYIntercept ) );
      }

//      // no points cross the bounds
//      //TODO find a way not to pass anything.
//      if ( boundaryPointArray.length === 0 ) {
//        boundaryPointArray.push( new Vector2( this.xRange.min, this.yRange.min ) );
//        boundaryPointArray.push( new Vector2( this.xRange.min, this.yRange.min ) );
//      }
//      // the line crosses the bounds at one corner
//      if ( boundaryPointArray.length < 1 ) {
//        boundaryPointArray.push( boundaryPointArray[0] );
//      }
      var arrayLength = boundaryPointArray.length;

      assert && assert( arrayLength <= 2, 'A straight line cannot cross the rectangular bounds at more than two places' );

      var boundaryPoints = {};
      if ( arrayLength === 0 ) {
        boundaryPoints = null;
      }
      else if ( arrayLength === 1 ) {
        boundaryPoints.point1 = boundaryPointArray[0];
        boundaryPoints.point2 = boundaryPointArray[0];  // this is a corner point
      }
      else {
        boundaryPoints.point1 = boundaryPointArray[0];
        boundaryPoints.point2 = boundaryPointArray[1];
        assert && assert( boundaryPoints.point1 !== boundaryPoints.point2, ' The two points must be different in order to form a line' );
      }


      return boundaryPoints;
    },

    getStatistics: function() {

      var dataPointArray = this.dataPointsOnGraph;
      assert && assert( dataPointArray !== null, 'dataPointsOnGraph must contain data' );
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
//      assert && assert(this.dataPointsOnGraph.length>=2, 'need at least two data points to do a linear fit');
      if ( this.dataPointsOnGraph.length < 2 ) {
        return null;
      }
      else {
        this.getStatistics();

        var slopeNumerator = this.averageOfSumOfSquaresXY - this.averageOfSumOfX * this.averageOfSumOfY;
        var slopeDenominator = this.averageOfSumOfSquaresXX - this.averageOfSumOfX * this.averageOfSumOfX;

        assert && assert( slopeDenominator !== 0, 'variance must be non zero' );

        var slope = slopeNumerator / slopeDenominator;
        var intercept = this.averageOfSumOfY - slope * this.averageOfSumOfX;

        var fitParameters = {
          slope: slope,
          intercept: intercept
        };
        return fitParameters;
      }
    },

    getPearsonCoefficientCorrelation: function() {
      if ( this.dataPointsOnGraph.length < 2 ) {
        return null;
      }
      else {
        this.getStatistics();
        var pearsonCoefficientCorrelationNumerator = this.averageOfSumOfSquaresXY - this.averageOfSumOfX * this.averageOfSumOfY;
        var pearsonCoefficientCorrelationDenominator = Math.sqrt( ( this.averageOfSumOfSquaresXX - this.averageOfSumOfX * this.averageOfSumOfX) * ( this.averageOfSumOfSquaresYY - this.averageOfSumOfY * this.averageOfSumOfY) );
        assert && assert( pearsonCoefficientCorrelationDenominator !== 0, ' pearsonCoefficientCorrelationDenominator must be non zero' );
        var pearsonCoefficientCorrelation = pearsonCoefficientCorrelationNumerator / pearsonCoefficientCorrelationDenominator;
        return pearsonCoefficientCorrelation;
      }
    }

  } )
    ;
} )
;