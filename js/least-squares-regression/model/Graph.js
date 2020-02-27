// Copyright 2014-2019, University of Colorado Boulder

/**
 * Model of a rectangular graph upon which various data points can be placed.
 * The graph Model is responsible for generating all statistical quantities related to a dataPoint set for 'best Fit Line' and 'My Line'
 * In addition, the associated Residuals (for 'My Line' and 'Best Fit Line') of the dataPoints are handled by graph model.
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ObservableArray from '../../../../axon/js/ObservableArray.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';
import Residual from './Residual.js';

/**
 * @param {Range} xRange
 * @param {Range} yRange
 * @constructor
 */
function Graph( xRange, yRange ) {

  // @public {Property.<number>} in radians, a proxy for the 'my line' slope.
  this.angleProperty = new NumberProperty( 0 );

  // @public {Property.<number>} in units of the graph bounds
  this.interceptProperty = new NumberProperty( 0 );

  // @public {Property.<boolean>} visibility of My Line on the graph and associated checkbox
  this.myLineVisibleProperty = new BooleanProperty( true );

  // @public {Property.<boolean>} visibility of Best Fit Line on the graph and associated checkbox
  this.bestFitLineVisibleProperty = new BooleanProperty( false );

  // @public {Property.<boolean>} visibility of Residuals of My Line (checkbox only)
  this.myLineShowResidualsProperty = new BooleanProperty( false );

  // @public {Property.<boolean>} visibility of Squared Residuals of My Line (checkbox only)
  this.myLineShowSquaredResidualsProperty = new BooleanProperty( false );

  // @public {Property.<boolean>} visibility of Residuals of Best Fit Line (checkbox only)
  this.bestFitLineShowResidualsProperty = new BooleanProperty( false );

  // @public {Property.<boolean>} visibility of Squared Residuals of Best Fit Line (checkbox only)
  this.bestFitLineShowSquaredResidualsProperty = new BooleanProperty( false );

  // @public {Property.<boolean>}  property that controls the visibility of the Residuals on the graph for My Line
  this.myLineResidualsVisibleProperty = new DerivedProperty( [ this.myLineVisibleProperty, this.myLineShowResidualsProperty ],
    function( myLineVisible, myLineShowResiduals ) {
      return myLineVisible && myLineShowResiduals;
    } );

  // @public {Property.<boolean>} property that controls the visibility of the Square Residuals on the graph for My Line
  this.myLineSquaredResidualsVisibleProperty = new DerivedProperty( [ this.myLineVisibleProperty, this.myLineShowSquaredResidualsProperty ],
    function( myLineVisible, myLineShowSquaredResiduals ) {
      return myLineVisible && myLineShowSquaredResiduals;
    } );

  // @public {Property.<boolean>} property that controls the visibility of the Square Residuals on the graph for Best Fit Line
  this.bestFitLineResidualsVisibleProperty = new DerivedProperty( [ this.bestFitLineVisibleProperty, this.bestFitLineShowResidualsProperty ],
    function( bestFitLineVisible, bestFitLineShowResiduals ) {
      return bestFitLineVisible && bestFitLineShowResiduals;
    } );

  // @public {Property.<boolean>} property that controls the visibility of the Square Residuals on the graph for Best Fit Line
  this.bestFitLineSquaredResidualsVisibleProperty = new DerivedProperty( [ this.bestFitLineVisibleProperty, this.bestFitLineShowSquaredResidualsProperty ],
    function( bestFitLineVisible, bestFitLineShowSquaredResiduals ) {
      return bestFitLineVisible && bestFitLineShowSquaredResiduals;
    } );

  // Bounds for the graph in model coordinates, it is a unit square. This remains the same for all DataSets
  // @public read-only
  this.bounds = new Bounds2( 0, 0, 1, 1 );

  // observable arrays of the line and squared residuals (wrapped in a property) for MyLine and BestFitLine
  this.myLineResiduals = new ObservableArray(); // @public
  this.bestFitLineResiduals = new ObservableArray(); // @public

  // array of the dataPoints that are overlapping the graph.
  this.dataPointsOnGraph = [];  // @public read-only

  // set the domain of the graphs (for future use by the equation Node and the graph Axes)
  this.setGraphDomain( xRange, yRange );
}

leastSquaresRegression.register( 'Graph', Graph );

export default inherit( Object, Graph, {
  /**
   * Reset the visibility of the lines and residuals as well as the angle and intercept.
   * Empty out the two residual arrays and the dataPoints on Graph array
   * @public
   */
  reset: function() {
    this.angleProperty.reset();
    this.interceptProperty.reset();
    this.myLineVisibleProperty.reset();
    this.bestFitLineVisibleProperty.reset();
    this.myLineShowResidualsProperty.reset();
    this.myLineShowSquaredResidualsProperty.reset();
    this.bestFitLineShowResidualsProperty.reset();
    this.bestFitLineShowSquaredResidualsProperty.reset();
    this.dataPointsOnGraph = [];
    this.myLineResiduals.clear();
    this.bestFitLineResiduals.clear();
  },

  /**
   * Empty out the two residual arrays and the dataPoints on Graph array
   * @public
   */
  resetOnChangeOfDataSet: function() {
    this.dataPointsOnGraph = [];
    this.myLineResiduals.clear();
    this.bestFitLineResiduals.clear();
  },

  /**
   * Sets the horizontal and vertical graph domain of dataSets and the corresponding multiplicative factor for the slope and intercept
   * @public
   * @param {Range} xRange
   * @param {Range} yRange
   */
  setGraphDomain: function( xRange, yRange ) {
    this.xRange = xRange; // @public
    this.yRange = yRange; // @public
    this.slopeFactor = ( yRange.max - yRange.min ) / ( xRange.max - xRange.min ) / ( this.bounds.height / this.bounds.width );// @public
    this.interceptFactor = ( yRange.max - yRange.min ) / this.bounds.height; // @public
    this.interceptOffset = ( yRange.min ); // @public
  },

  /**
   * Update the model Residuals for 'My Line" and 'Best Fit Line'
   * @private
   */
  update: function() {
    this.updateMyLineResiduals();
    this.updateBestFitLineResiduals();
  },
  /**
   * Convert the angle of a line (measured from the horizontal x axis) to a slope
   * @public read-only
   * @param {number} angle
   */
  slope: function( angle ) {
    return Math.tan( angle ) * this.bounds.height / this.bounds.width;
  },
  /**
   * Add a 'My Line' model Residual to a dataPoint
   * @private
   * @param {DataPoint} dataPoint
   */
  addMyLineResidual: function( dataPoint ) {
    const myLineResidual = new Residual( dataPoint, this.slope( this.angleProperty.value ), this.interceptProperty.value );
    this.myLineResiduals.push( new Property( myLineResidual ) );
  },
  /**
   * Add a 'Best Fit Line' model Residual to a dataPoint
   * @private
   * @param {DataPoint} dataPoint
   */
  addBestFitLineResidual: function( dataPoint ) {

    const linearFitParameters = this.getLinearFit();
    const bestFitLineResidual = new Residual( dataPoint, linearFitParameters.slope, linearFitParameters.intercept );
    this.bestFitLineResiduals.push( new Property( bestFitLineResidual ) );
  },

  /**
   * Remove the 'My Line' model Residual attached to a dataPoint
   * @private
   * @param {DataPoint} dataPoint
   */
  removeMyLineResidual: function( dataPoint ) {
    const self = this;
    const myLineResidualsCopy = this.myLineResiduals.getArray();
    myLineResidualsCopy.forEach( function( myLineResidualProperty ) {
      if ( myLineResidualProperty.value.dataPoint === dataPoint ) {
        self.myLineResiduals.remove( myLineResidualProperty );
      }
    } );
  },

  /**
   * Remove a 'Best Fit Line' model Residual attached to a dataPoint
   * @private
   * @param {DataPoint} dataPoint
   */
  removeBestFitLineResidual: function( dataPoint ) {
    const self = this;
    const bestFitLineResidualsCopy = this.bestFitLineResiduals.getArray();
    bestFitLineResidualsCopy.forEach( function( bestFitLineResidualProperty ) {
      if ( bestFitLineResidualProperty.value.dataPoint === dataPoint ) {
        self.bestFitLineResiduals.remove( bestFitLineResidualProperty );
      }
    } );
  },

  /**
   * Update all 'My Line' model Residuals
   * (Necessary to update when the slope and the intercept of 'My Line' are modified)
   * @public
   */
  updateMyLineResiduals: function() {
    const self = this;
    this.myLineResiduals.forEach( function( residualProperty ) {
      const dataPoint = residualProperty.value.dataPoint;
      residualProperty.value = new Residual( dataPoint, self.slope( self.angleProperty.value ), self.interceptProperty.value );
    } );
  },

  /**
   * Update all 'My Best Fit Line' model Residuals
   * @private
   */
  updateBestFitLineResiduals: function() {
    if ( this.isLinearFitDefined() ) {
      const linearFitParameters = this.getLinearFit();
      this.bestFitLineResiduals.forEach( function( residualProperty ) {
        const dataPoint = residualProperty.value.dataPoint;
        residualProperty.value = new Residual( dataPoint, linearFitParameters.slope, linearFitParameters.intercept );
      } );
    }
  },
  /**
   * Add Data Points on Graph in bulk such that no update is triggered throughout the process.
   * This is done for performance reason.
   * @public (accessed by LeastSquareRegressionModel)
   * @param {Array.<DataPoint>} dataPoints
   */
  addDataPointsOnGraphAndResidualsInBulk: function( dataPoints ) {
    const self = this;
    // for performance reason one should add all the dataPoints on the graph
    // then we can calculate the best Fit Line (only once)
    // and then add all the Residuals.
    dataPoints.forEach( function( dataPoint ) {
      self.dataPointsOnGraph.push( dataPoint );
    } );

    const mySlope = this.slope( this.angleProperty.value );
    const myIntercept = this.interceptProperty.value;

    // add a 'myLineResidual' for every single dataPoint
    dataPoints.forEach( function( dataPoint ) {
      const myLineResidual = new Residual( dataPoint, mySlope, myIntercept );
      self.myLineResiduals.push( new Property( myLineResidual ) );
    } );

    // add a 'best fit Line' residual  for every single dataPoint
    // unless there is not  inearFit (because there is less than 2 data points on the board for instance)
    if ( this.isLinearFitDefined() ) {
      const linearFitParameters = this.getLinearFit();
      dataPoints.forEach( function( dataPoint ) {
        const bestFitLineResidual = new Residual( dataPoint, linearFitParameters.slope, linearFitParameters.intercept );
        self.bestFitLineResiduals.push( new Property( bestFitLineResidual ) );
      } );
    }
  },

  /**
   * Function that returns true if the dataPoint is on the array.
   * @private
   * @param {DataPoint} dataPoint
   * @returns {boolean}
   */
  isDataPointOnList: function( dataPoint ) {
    const index = this.dataPointsOnGraph.indexOf( dataPoint );
    return ( index !== -1 );
  },

  /**
   * Function that determines if the Position of a Data Point is within the visual bounds of the graph
   * @private
   * @param {Vector2} position
   * @returns {boolean}
   */
  isDataPointPositionOverlappingGraph: function( position ) {
    return this.bounds.containsPoint( position );
  },

  /**
   * Add the dataPoint top the dataPointsOnGraph Array and add 'My Line' and 'Best Fit Line' model Residuals
   * @public (accessed by LeastSquareRegressionModel)
   * @param {DataPoint} dataPoint
   */
  addPointAndResiduals: function( dataPoint ) {
    const self = this;

    this.dataPointsOnGraph.push( dataPoint );
    this.addMyLineResidual( dataPoint );

    // a BestFit line exists if there are two dataPoints or more.
    // if there are two dataPoints on the graph, we don't add my bestFitLine residual
    // since the residual are zero by definition
    // if there are exactly three data points on the graph we need to add three residuals
    if ( this.dataPointsOnGraph.length === 3 ) {
      this.dataPointsOnGraph.forEach( function( dataPoint ) {
        self.addBestFitLineResidual( dataPoint );
      } );
    }
    // for three dataPoints or more there is one residual for every dataPoint added
    if ( this.dataPointsOnGraph.length > 3 ) {
      this.addBestFitLineResidual( dataPoint );
    }

    dataPoint.positionUpdateListener = function() {
      self.update();
    };
    dataPoint.positionProperty.link( dataPoint.positionUpdateListener );
  },

  /**
   * Remove a dataPoint and its associated residuals ('My Line' and 'Best Fit Line')
   * @public (accessed by LeastSquareRegressionModel)
   * @param {DataPoint} dataPoint
   */
  removePointAndResiduals: function( dataPoint ) {
    assert && assert( this.isDataPointOnList( dataPoint ), ' need the point to be on the list to remove it' );
    const index = this.dataPointsOnGraph.indexOf( dataPoint );
    this.dataPointsOnGraph.splice( index, 1 );

    this.removeMyLineResidual( dataPoint );

    // if there are two dataPoints on the graph, remove all residuals
    if ( this.dataPointsOnGraph.length === 2 ) {
      this.removeBestFitLineResiduals();
    }
    else {
      this.removeBestFitLineResidual( dataPoint );
    }
    this.update();
    if ( dataPoint.positionProperty.hasListener( dataPoint.positionUpdateListener ) ) {
      dataPoint.positionProperty.unlink( dataPoint.positionUpdateListener );
    }
  },
  /**
   * Function that removes all the best Fit Line Residuals
   * @private
   */
  removeBestFitLineResiduals: function() {
    this.bestFitLineResiduals.clear();
  },

  /**
   * Function that returns the sum of squared residuals of all the dataPoints on the list (compared with a line with a slope and intercept)
   * @private
   * @param {number} slope
   * @param {number} intercept
   * @returns {number} sumOfSquareResiduals
   */
  sumOfSquaredResiduals: function( slope, intercept ) {
    let sumOfSquareResiduals = 0;
    this.dataPointsOnGraph.forEach( function( dataPoint ) {
      const yResidual = ( slope * dataPoint.positionProperty.value.x + intercept ) - dataPoint.positionProperty.value.y;
      sumOfSquareResiduals += yResidual * yResidual;
    } );
    return sumOfSquareResiduals;
  },

  /**
   * Function that returns the sum of squared residuals of 'My Line'
   * The sum of squared residual is zero if there are less than one dataPoint on the graph.
   * @public read-only
   * @returns {number} sumOfSquareResiduals
   */
  getMyLineSumOfSquaredResiduals: function() {
    if ( this.dataPointsOnGraph.length >= 1 ) {
      return this.sumOfSquaredResiduals( this.slope( this.angleProperty.value ), this.interceptProperty.value );
    }
    else {
      return 0;
    }
  },

  /**
   * Function that returns the sum of squared residuals of 'Best Fit Line'
   * The sum of squared residual is zero if there are less than two dataPoints on the graph
   * @public read-only
   * @returns {number} sumOfSquareResiduals
   */
  getBestFitLineSumOfSquaredResiduals: function() {
    if ( this.isLinearFitDefined() ) {
      const linearFitParameters = this.getLinearFit();
      return this.sumOfSquaredResiduals( linearFitParameters.slope, linearFitParameters.intercept );
    }
    else {
      return 0;
    }
  },

  /**
   * Returns an array of two points that crosses the left and the right hand side of the graph bounds
   * @public read-only
   * @param {number} slope
   * @param {number} intercept
   * @returns {{point1: Vector2, point2: Vector2}}
   */
  getBoundaryPoints: function( slope, intercept ) {

    const yValueLeft = slope * this.bounds.minX + intercept;
    const yValueRight = slope * this.bounds.maxX + intercept;
    const boundaryPoints = {
      point1: new Vector2( this.bounds.minX, yValueLeft ),
      point2: new Vector2( this.bounds.maxX, yValueRight )
    };

    return boundaryPoints;
  },

  /**
   * Function that updates statistical properties of the dataPoints on the graph.
   * @private
   */
  getStatistics: function() {

    const dataPointArray = this.dataPointsOnGraph;
    assert && assert( dataPointArray !== null, 'dataPointsOnGraph must contain data' );
    const arrayLength = dataPointArray.length;

    const squaresXX = _.map( dataPointArray, function( dataPoint ) {
      return dataPoint.positionProperty.value.x * dataPoint.positionProperty.value.x;
    } );
    const squaresXY = _.map( dataPointArray, function( dataPoint ) {
      return dataPoint.positionProperty.value.x * dataPoint.positionProperty.value.y;
    } );
    const squaresYY = _.map( dataPointArray, function( dataPoint ) {
      return dataPoint.positionProperty.value.y * dataPoint.positionProperty.value.y;
    } );
    const positionArrayX = _.map( dataPointArray, function( dataPoint ) {
      return dataPoint.positionProperty.value.x;
    } );
    const positionArrayY = _.map( dataPointArray, function( dataPoint ) {
      return dataPoint.positionProperty.value.y;
    } );

    function add( memo, num ) {
      return memo + num;
    }

    const sumOfSquaresXX = _.reduce( squaresXX, add, 0 );
    const sumOfSquaresXY = _.reduce( squaresXY, add, 0 );
    const sumOfSquaresYY = _.reduce( squaresYY, add, 0 );
    const sumOfX = _.reduce( positionArrayX, add, 0 );
    const sumOfY = _.reduce( positionArrayY, add, 0 );

    this.averageOfSumOfSquaresXX = sumOfSquaresXX / arrayLength;
    this.averageOfSumOfSquaresXY = sumOfSquaresXY / arrayLength;
    this.averageOfSumOfSquaresYY = sumOfSquaresYY / arrayLength;
    this.averageOfSumOfX = sumOfX / arrayLength;
    this.averageOfSumOfY = sumOfY / arrayLength;
  },

  /**
   * Function that determines if a best fit line fit exists
   * @public read-only
   * @returns {boolean}
   */
  isLinearFitDefined: function() {
    let isDefined;
    // you can't have a linear fit with less than 2 data points
    if ( this.dataPointsOnGraph.length < 2 ) {
      isDefined = false;
    }
    else {
      this.getStatistics();
      const xVariance = this.averageOfSumOfSquaresXX - this.averageOfSumOfX * this.averageOfSumOfX;
      // the linear fit parameters are not defined when the points are aligned vertically (infinite slope).
      // check for a threshold to prevent https://github.com/phetsims/least-squares-regression/issues/60
      if ( xVariance < 2e-10 ) {
        isDefined = false;
      }
      else {
        isDefined = true;
      }
    }
    return isDefined;
  },

  /**
   * Function that returns the 'best fit line' parameters, i.e. slope and intercept of the dataPoints on the graph.
   * It would be wise to check if isLinearFitDefined() is true before calling this function.
   * @public read-only
   * @returns {{slope: number, intercept: number}}
   */
  getLinearFit: function() {
    this.getStatistics();
    const slopeNumerator = this.averageOfSumOfSquaresXY - this.averageOfSumOfX * this.averageOfSumOfY;
    const slopeDenominator = this.averageOfSumOfSquaresXX - this.averageOfSumOfX * this.averageOfSumOfX;
    const slope = slopeNumerator / slopeDenominator;
    const intercept = this.averageOfSumOfY - slope * this.averageOfSumOfX;

    const fitParameters = {
      slope: slope,
      intercept: intercept
    };
    return fitParameters;
  },

  /**
   * Function that returns the Pearson Coefficient Correlation
   * It returns null if there are less than two dataPoints on the graph.
   * For two dataPoints and more, the Pearson coefficient ranges from -1 to 1.
   * Note that the Pearson Coefficient Correlation is an intrinsic property of a set of DataPoint
   * See http://en.wikipedia.org/wiki/Pearson_product-moment_correlation_coefficient
   * @public read-only
   * @returns {null||number}
   */
  getPearsonCoefficientCorrelation: function() {

    if ( !this.isLinearFitDefined() ) {
      return null;
    }
    else {
      this.getStatistics();
      let pearsonCoefficientCorrelationNumerator = this.averageOfSumOfSquaresXY - this.averageOfSumOfX * this.averageOfSumOfY;

      if ( Math.abs( pearsonCoefficientCorrelationNumerator ) < 1E-10 ) {
        pearsonCoefficientCorrelationNumerator = 0;
      }

      // for very small values, we can end up with a very small or negative number.  In this case, return null so we
      // don't get a NaN for the coefficient.
      const number = ( this.averageOfSumOfSquaresXX - this.averageOfSumOfX * this.averageOfSumOfX ) * ( this.averageOfSumOfSquaresYY - this.averageOfSumOfY * this.averageOfSumOfY );
      if ( number < 1E-15 ) {
        return null;
      }
      const pearsonCoefficientCorrelationDenominator = Math.sqrt( number );

      // make sure the denominator is not equal to zero, this happens if all the points are aligned vertically
      if ( pearsonCoefficientCorrelationDenominator === 0 ) {
        return null; //
      }
      else {
        const pearsonCoefficientCorrelation = pearsonCoefficientCorrelationNumerator / pearsonCoefficientCorrelationDenominator;
        return pearsonCoefficientCorrelation;
      }
    }
  }
} );