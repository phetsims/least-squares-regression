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
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Residual = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/Residual' );
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

    this.myLineResiduals = new ObservableArray(); // @public
    this.bestFitLineResiduals = new ObservableArray(); // @public
    this.dataPointsOnGraph = [];

    // bounds for the graph in model coordinates
    this.bounds = new Bounds2( this.xRange.min, this.yRange.min, this.xRange.max, this.yRange.max );

  }

  return inherit( PropertySet, Graph, {

    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.dataPointsOnGraph = [];
      this.myLineResiduals.clear();
      this.bestFitLineResiduals.clear();
    },

    getWidth: function() {
      return this.bounds.width;
    },

    getHeight: function() {
      return this.bounds.height;
    },

    update: function() {
      this.updateMyLineResiduals();
      if ( this.dataPointsOnGraph.length > 1 ) {
        this.updateBestFitLineResiduals();
      }
    },

    slope: function( angle ) {
      //TODO find a more robust way
      return 2 * Math.tan( angle );
    },

    addMyLineResidual: function( dataPoint ) {
      var myLineResidual = new Residual( dataPoint, this.slope( this.angle ), this.intercept );
      this.myLineResiduals.push( new Property( myLineResidual ) );
    },

    addBestFitLineResidual: function( dataPoint ) {
      var linearFitParameters = this.getLinearFit();
      var bestFitLineResidual = new Residual( dataPoint, linearFitParameters.slope, linearFitParameters.intercept );
      this.bestFitLineResiduals.push( new Property( bestFitLineResidual ) );
    },

    removeMyLineResidual: function( dataPoint ) {
      var graph = this;
      var myLineResidualsCopy = this.myLineResiduals.getArray();
      myLineResidualsCopy.forEach( function( myLineResidualProperty ) {
        if ( myLineResidualProperty.value.dataPoint === dataPoint ) {
          graph.myLineResiduals.remove( myLineResidualProperty );
        }
      } );
    },

    removeBestFitLineResidual: function( dataPoint ) {
      var graph = this;
      var bestFitLineResidualsCopy = this.bestFitLineResiduals.getArray();
      bestFitLineResidualsCopy.forEach( function( bestFitLineResidualProperty ) {
        if ( bestFitLineResidualProperty.value.dataPoint === dataPoint ) {
          graph.bestFitLineResiduals.remove( bestFitLineResidualProperty );
        }
      } );
    },

    updateMyLineResidual: function( dataPoint ) {
      var graph = this;
      this.myLineResiduals.forEach( function( myLineResidualProperty ) {
        if ( myLineResidualProperty.value.dataPoint === dataPoint ) {
          myLineResidualProperty.value = new Residual( dataPoint, graph.slope( graph.angle ), graph.intercept );
        }
      } );
    },

    updateMyLineResiduals: function() {
      var graph = this;
      this.myLineResiduals.forEach( function( residualProperty ) {
        var dataPoint = residualProperty.value.dataPoint;
        residualProperty.value = new Residual( dataPoint, graph.slope( graph.angle ), graph.intercept );
      } );
    },

    updateBestFitLineResiduals: function() {
      var linearFitParameters = this.getLinearFit();
      this.bestFitLineResiduals.forEach( function( residualProperty ) {
        var dataPoint = residualProperty.value.dataPoint;
        residualProperty.value = new Residual( dataPoint, linearFitParameters.slope, linearFitParameters.intercept );
      } );
    },

    isDataPointOnList: function( dataPoint ) {
      var index = this.dataPointsOnGraph.indexOf( dataPoint );
      return (index !== -1);
    },

    isDataPointPositionOverlappingGraph: function( position ) {
      return this.bounds.containsPoint( position );
    },

    addPointAndResiduals: function( dataPoint ) {
      var self = this;

      this.dataPointsOnGraph.push( dataPoint );
      this.addMyLineResidual( dataPoint );

      // a BestFit line exists if there are two datapoints or more.
      // if there is only one dataPoint on the graph, we dont add my bestFitLine residual
      // if there are exactly two data points on the graph we need to add two residuals
      if ( this.dataPointsOnGraph.length === 2 ) {
        this.dataPointsOnGraph.forEach( function( dataPoint ) {
          self.addBestFitLineResidual( dataPoint );
        } );
      }
      // for two dataPoints or more there is one residual for every datapoint addded
      if ( this.dataPointsOnGraph.length > 2 ) {
        this.addBestFitLineResidual( dataPoint );
      }

      var positionListener = function() { self.update();};
      dataPoint.positionProperty.link( positionListener );
      dataPoint.positionListener = positionListener;

    },

    removePointAndResiduals: function( dataPoint ) {
      assert && assert( this.isDataPointOnList( dataPoint ), ' need the point to be on the list to remove it' );
      var index = this.dataPointsOnGraph.indexOf( dataPoint );
      this.dataPointsOnGraph.splice( index, 1 );

      this.removeMyLineResidual( dataPoint );

      if ( this.dataPointsOnGraph.length === 2 ) {
        this.removeBestFitLineResiduals();
      }
      else {
        this.removeBestFitLineResidual( dataPoint );
      }
      this.update();
      dataPoint.positionProperty.unlink( dataPoint.positionListener );


    },

    removeBestFitLineResiduals: function() {
      this.bestFitLineResiduals.clear();
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
        return this.sumOfSquaredResiduals( linearFitParameters.slope, linearFitParameters.intercept );
      }
      else {
        return 0;
      }
    },

    /**
     * Returns an array of two points that crosses the rectangular bounds of the graph
     *
     * @param {number} slope
     * @param {number} intercept
     */
    getBoundaryPoints: function( slope, intercept ) {

      var yValueLeft = slope * this.xRange.min + intercept;
      var yValueRight = slope * this.xRange.max + intercept;
      var boundaryPoints = {
        point1: new Vector2( this.xRange.min, yValueLeft ),
        point2: new Vector2( this.xRange.max, yValueRight )
      };

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
      if ( this.dataPointsOnGraph.length < 2 ) {
        return null;
      }
      else {
        this.getStatistics();

        var slopeNumerator = this.averageOfSumOfSquaresXY - this.averageOfSumOfX * this.averageOfSumOfY;
        var slopeDenominator = this.averageOfSumOfSquaresXX - this.averageOfSumOfX * this.averageOfSumOfX;

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
        var pearsonCoefficientCorrelation = pearsonCoefficientCorrelationNumerator / pearsonCoefficientCorrelationDenominator;
        return pearsonCoefficientCorrelation;
      }
    }

  } )
    ;
} )
;