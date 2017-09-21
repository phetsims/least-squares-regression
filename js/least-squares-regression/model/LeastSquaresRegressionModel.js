// Copyright 2014-2017, University of Colorado Boulder

/**
 * Contains all of the model logic for the screen LeastSquaresRegressionScreen.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Bucket = require( 'PHETCOMMON/model/Bucket' );
  var DataPoint = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/DataPoint' );
  var DataSet = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/DataSet' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Emitter = require( 'AXON/Emitter' );
  var Graph = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/Graph' );
  var inherit = require( 'PHET_CORE/inherit' );
  var leastSquaresRegression = require( 'LEAST_SQUARES_REGRESSION/leastSquaresRegression' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var BUCKET_SIZE = new Dimension2( 100, 55 );
  var BUCKET_POSITION = new Vector2( 120, 480 );

  /**
   * @constructor
   */
  function LeastSquaresRegressionModel() {

    var self = this;

    // @public {Property.<boolean>} controls the visibility of the graph grid
    this.showGridProperty = new BooleanProperty( false );

    // @public {Property.<Object>}  dataSet selected by the Combo Box: initially value set on Custom
    this.selectedDataSetProperty = new Property( DataSet.CUSTOM );

    // @public, sends an event when points are added in bulk
    this.dataPointsAddedEmitter = new Emitter();

    // Array of dataPoints in the model (may not be necessarily on the graph, could be user controlled outside the graph zone or animated)
    this.dataPoints = new ObservableArray(); // @public

    // The various data Sets that populates the Combo Box
    // @public read-only
    this.dataSets = [];
    this.dataSets.push( DataSet.CUSTOM );
    this.dataSets.push( DataSet.HEIGHT_SHOE );
    this.dataSets.push( DataSet.SPENDING_SALARY );
    this.dataSets.push( DataSet.MORTALITY_YEAR );
    this.dataSets.push( DataSet.WAGE_YEAR );
    this.dataSets.push( DataSet.USER_YEAR );
    this.dataSets.push( DataSet.GASOLINE_YEAR );
    this.dataSets.push( DataSet.LIFE_TV );
    this.dataSets.push( DataSet.SPEED_DISTANCE );
    this.dataSets.push( DataSet.TEMPERATURE_FAHRENHEIT_CHIRP );
    this.dataSets.push( DataSet.TEMPERATURE_FAHRENHEIT_LONGITUDE );
    this.dataSets.push( DataSet.TEMPERATURE_FAHRENHEIT_LATITUDE );
    this.dataSets.push( DataSet.TEMPERATURE_CELSIUS_CHIRP );
    this.dataSets.push( DataSet.TEMPERATURE_CELSIUS_LONGITUDE );
    this.dataSets.push( DataSet.TEMPERATURE_CELSIUS_LATITUDE );


    // Model of the graph that contains all information regarding the composition of the graph
    // @public read-only
    this.graph = new Graph(
      this.selectedDataSetProperty.value.xRange,
      this.selectedDataSetProperty.value.yRange
    );

    // Bucket model to be filled with dataPoint
    // @public read-only
    this.bucket = new Bucket( {
      position: BUCKET_POSITION,
      baseColor: '#000080',
      size: BUCKET_SIZE,
      invertY: true
    } );

    // array for the CUSTOM dataPoints
    var savedCustomDataPoints = []; // {Array.<DataPoints>} 

    // What to do when the selected Data Set changes. no need to unlink, present for the lifetime of the sim
    this.selectedDataSetProperty.link( function( selectedDataSet, oldSelectedDataSet ) {

      // saved the position data of CUSTOM if we are going from CUSTOM to another dataSet
      if ( oldSelectedDataSet && oldSelectedDataSet === DataSet.CUSTOM ) {
        // add the current dataPoints on graph to savedCustomDataPoints
        savedCustomDataPoints = self.graph.dataPointsOnGraph;
      }

      // unlink the listeners to dataPoints
      // this address an issue if one is userControlling a dataPoint while changing selecting a new dataSet (only possible with multitouch)
      //  see  https://github.com/phetsims/least-squares-regression/issues/11
      self.dispose();

      // Clear the dataPoints array
      self.dataPoints.clear();

      // Clear the residual arrays and the dataPointsOnGraph array
      self.graph.resetOnChangeOfDataSet();

      // Set the horizontal range, vertical range, and multiplicative factors for the slope and the intercept
      self.graph.setGraphDomain( selectedDataSet.xRange, selectedDataSet.yRange );

      // Populate the dataPoints array

      if ( selectedDataSet === DataSet.CUSTOM ) {
        // use the savedCustomDataPoints to populate the dataPoints array
        savedCustomDataPoints.forEach( function( dataPoint ) {
          self.dataPoints.push( dataPoint );
        } );
        // Add the Data Points on Graph and all the Residuals
        // For performance reason, we do it in bulk so that we don't constantly update the residuals after adding a dataPoint
        self.graph.addDataPointsOnGraphAndResidualsInBulk( self.dataPoints );
        self.dataPoints.forEach( function( dataPoint ) {
          self.addDataPointControlledListener( dataPoint );
        } );

      }
      else {
        // Populate the dataPoints array with the new SelectedDataSet
        selectedDataSet.dataXY.forEach( function( position ) {
          // For your information, only one modelViewTransform is used throughout the simulation, the bounds of the model are set by the graph bounds
          // Rescale all the {X,Y} value to the normalized graph bounds
          var XNormalized = Util.linear( selectedDataSet.xRange.min, selectedDataSet.xRange.max, self.graph.bounds.minX, self.graph.bounds.maxX, position.x );
          var YNormalized = Util.linear( selectedDataSet.yRange.min, selectedDataSet.yRange.max, self.graph.bounds.minY, self.graph.bounds.maxY, position.y );
          var positionVector = new Vector2( XNormalized, YNormalized );
          self.dataPoints.push( new DataPoint( positionVector ) );
        } );
        // Add the Data Points on Graph and all the Residuals
        // For performance reason, we do it in bulk so that we don't constantly update the residuals after adding a dataPoint
        self.graph.addDataPointsOnGraphAndResidualsInBulk( self.dataPoints );
      }
      // Since we added the dataPoints in Bulk, let's send a trigger to the view
      self.dataPointsAddedEmitter.emit();

    } );
  }

  leastSquaresRegression.register( 'LeastSquaresRegressionModel', LeastSquaresRegressionModel );

  return inherit( Object, LeastSquaresRegressionModel, {

    reset: function() {
      this.showGridProperty.reset();
      this.selectedDataSetProperty.reset();
      this.dispose();
      this.dataPoints.clear();
      this.graph.reset();
    },

    /**
     * Unlink listeners to dataPoint. Listeners might have been removed when the data point was removed from the graph,
     * so check that they are still attached first.
     * 
     * @private
     */
    dispose: function() {
      this.dataPoints.forEach( function( dataPoint ) {
        if ( dataPoint.positionProperty.hasListener( dataPoint.positionUpdateListener ) ) {
          dataPoint.positionProperty.unlink( dataPoint.positionUpdateListener );
        }
        if ( dataPoint.userControlledProperty.hasListener( dataPoint.userControlledListener ) ) {
          dataPoint.userControlledProperty.unlink( dataPoint.userControlledListener );
        }
      } );
    },

    /**
     * Function that animates all the dataPoints
     * @public
     */
    returnAllDataPointsToBucket: function() {
      this.dataPoints.forEach( function( dataPoint ) {
        dataPoint.animate();
      } );
    },

    /**
     * Function for adding new dataPoints to this model when the user creates them, generally by clicking on some
     * some sort of creator node.
     * @public
     * @param {DataPoint} dataPoint
     */
    addUserCreatedDataPoint: function( dataPoint ) {

      this.dataPoints.push( dataPoint );

      this.addDataPointControlledListener( dataPoint );
    },

    /**
     * Function that adds position listener and user Controlled listener;
     * Useful for dynamical points
     * @param {DataPoint} dataPoint
     */
    addDataPointControlledListener: function( dataPoint ) {
      var self = this;

      dataPoint.userControlledListener = function( userControlled ) {
        var isOnGraph = self.graph.isDataPointPositionOverlappingGraph( dataPoint.positionProperty.value );
        if ( !isOnGraph && !userControlled ) {
          // return the dataPoint to the bucket
          dataPoint.animate();
        }
      };

      // Determine if the data Point is not user controlled and not on graph. If so let's animate it, i.e. return it to the bucket
      dataPoint.userControlledProperty.link( dataPoint.userControlledListener );

      // The dataPoint will be removed from the model if and when it returns to its origination point. This is how a dataPoint
      // can be 'put back' into the bucket. Listeners might have been removed when it was removed from the
      // graph so check to make sure listeners are still attached before unlinking.
      dataPoint.returnedToOriginListener = function() {
        self.dataPoints.remove( dataPoint );

        if ( dataPoint.positionProperty.hasListener( dataPoint.positionUpdateListener ) ) {
          dataPoint.positionProperty.unlink( dataPoint.positionUpdateListener );
        }
        if ( dataPoint.userControlledProperty.hasListener( dataPoint.userControlledProperty ) ) {
          dataPoint.userControlledProperty.unlink( dataPoint.userControlledListener );
        }
        if ( dataPoint.returnedToOriginEmitter.hasListener( dataPoint.returnedToOriginListener ) ) {
          dataPoint.returnedToOriginEmitter.removeListener( dataPoint.returnedToOriginListener );
        }
      };

      dataPoint.returnedToOriginEmitter.addListener( dataPoint.returnedToOriginListener );
    }
  } );
} );

