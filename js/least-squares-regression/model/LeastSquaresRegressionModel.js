// Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bucket = require( 'PHETCOMMON/model/Bucket' );
  var Graph = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/Graph' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Range = require( 'DOT/Range' );

  // var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var BUCKET_SIZE = new Dimension2( 90, 45 );

  /**
   * Main constructor for LeastSquaresModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function LeastSquaresRegressionModel() {

    var thisModel = this;

    PropertySet.call( thisModel, {
      showBucket: true,
      showMyLine: true,
      showResidualsOfMyLine: false,
      showSquareResidualsOfMyLine: false,
      showBestFitLine: false,
      showResidualsOfBestFitLine: false,
      showSquareResidualsOfBestFitLine: false
    } );

    this.dataPoints = new ObservableArray(); // @public

    this.graph = new Graph(
      new Range( 0, 20 ),
      new Range( 0, 20 )
    );

    this.bucket = new Bucket( {
      position: new Vector2( 100, 400 ),
      baseColor: '#000080',
      caption: '',
      size: BUCKET_SIZE,
      invertY: true
    } );

  }

  return inherit( PropertySet, LeastSquaresRegressionModel, {

    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.dataPoints.clear();
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
          self.graph.addPoint( dataPoint );
        }
        else {
          self.graph.removePoint( dataPoint );
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




