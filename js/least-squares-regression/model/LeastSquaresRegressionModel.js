// Copyright 2002-2014, University of Colorado Boulder

/**
 *  Main constructor for LeastSquaresModel, which contains all of the model logic for the entire sim screen.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bucket = require( 'PHETCOMMON/model/Bucket' );
  var DataPoint = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/DataPoint' );
  var DataSet = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/DataSet' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Graph = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/Graph' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var BUCKET_SIZE = new Dimension2( 100, 55 );
  var BUCKET_POSITION = new Vector2( 120, 480 );

  /**
   * Main constructor for LeastSquaresModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function LeastSquaresRegressionModel() {

    var thisModel = this;
    PropertySet.call( thisModel, {
      showGrid: false, // controls the visibility of the graph grid
      selectedDataSet: DataSet.CUSTOM  // dataSet selected by the Combo Box: initially value set on Custom
    } );

    // array of dataPoints in the model (may not be necessarily on the graph, could be user controlled outside the graph zone or animated)
    this.dataPoints = new ObservableArray(); // @public

    // the various data Sets that populates the Combo Box
    // @public read-only
    this.dataSets = [];
    //for ( var dataSet in DataSet ){
    //  if ( DataSet.hasOwnProperty( dataSet ) ){
    //    this.dataSets.push( dataSet );
    //  }
    //}
    this.dataSets.push( DataSet.CUSTOM );
    this.dataSets.push( DataSet.TEMPERATURE_LONGITUDE );
    this.dataSets.push( DataSet.TEMPERATURE_LATITUDE );
    this.dataSets.push( DataSet.SPENDING_SALARY );
    this.dataSets.push( DataSet.WAGE_YEAR );
    this.dataSets.push( DataSet.MORTALITY_YEAR );
    this.dataSets.push( DataSet.USER_YEAR );
    this.dataSets.push( DataSet.GASOLINE_YEAR );
    this.dataSets.push( DataSet.LIFE_TV );
    this.dataSets.push( DataSet.SPEED_DISTANCE );
    this.dataSets.push( DataSet.TEMPERATURE_CHIRP );
    this.dataSets.push( DataSet.HEIGHT_SHOE );


    // Contains all information regarding the composition of the graph
    this.graph = new Graph(
      this.selectedDataSet.xRange,
      this.selectedDataSet.yRange
    );

    // bucket to draw particle
    this.bucket = new Bucket( {
      position: BUCKET_POSITION,
      baseColor: '#000080',
      caption: '',
      size: BUCKET_SIZE,
      invertY: true
    } );

    this.selectedDataSetProperty.link( function( selectedDataSet ) {
      thisModel.graph.reset();
      thisModel.dataPoints.clear();
      thisModel.graph.setGraphDomain( selectedDataSet.xRange, selectedDataSet.yRange );

      selectedDataSet.dataXY.forEach( function( position ) {
        var XNormalized = Util.linear( selectedDataSet.xRange.min, selectedDataSet.xRange.max, thisModel.graph.bounds.minX, thisModel.graph.bounds.maxX, position.x );
        var YNormalized = Util.linear( selectedDataSet.yRange.min, selectedDataSet.yRange.max, thisModel.graph.bounds.minY, thisModel.graph.bounds.maxY, position.y );
        var positionVector = new Vector2( XNormalized, YNormalized );
        thisModel.dataPoints.push( new DataPoint( positionVector ) );
      } );

      thisModel.graph.addDataPointsOnGraphAndResidualsInBulk( thisModel.dataPoints );

      // TODO : terrible hack here
      // oh terrible hack here
      // forces an update for the leastsquareschart
      var fakeData = new DataPoint( new Vector2( 0, 0 ) );
      thisModel.dataPoints.push( fakeData );
      thisModel.dataPoints.remove( fakeData );
    } );
  }

  return inherit( PropertySet, LeastSquaresRegressionModel, {

    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.dataPoints.clear();
      this.graph.reset();
    },

    step: function( dt ) {
      this.dataPoints.forEach( function( dataPoint ) {
        dataPoint.step( dt );
      } );
    },

    /**
     * Function for adding new  dataPoints to this model when the user creates them, generally by clicking on some
     * some sort of creator node.
     * @public
     * @param dataPoint
     */
    addUserCreatedDataPoint: function( dataPoint ) {
      var self = this;
      this.dataPoints.push( dataPoint );

      dataPoint.positionProperty.link( function( position ) {
        if ( self.graph.isDataPointPositionOverlappingGraph( position ) && !dataPoint.animating ) {
          if ( !self.graph.isDataPointOnList( dataPoint ) ) {
            self.graph.addPointAndResiduals( dataPoint );
          }
        }
        else {
          if ( self.graph.isDataPointOnList( dataPoint ) ) {
            self.graph.removePointAndResiduals( dataPoint );
          }
        }
      } );

      dataPoint.userControlledProperty.link( function( userControlled ) {
        var isOnGraph = self.graph.isDataPointPositionOverlappingGraph( dataPoint.position );
        if ( !isOnGraph && !userControlled ) {
          dataPoint.animating = true;
        }
      } );

//      The dataPoint will be removed from the model if and when it returns to its origination point. This is how a dataPoint
//      can be 'put back' into the bucket.
      dataPoint.on( 'returnedToOrigin', function() {
        self.dataPoints.remove( dataPoint );
      } );
    }

  } );

} );

