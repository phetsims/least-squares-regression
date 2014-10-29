// Copyright 2002-2014, University of Colorado Boulder

/**
 * A composite node that depicts a bucket containing dataPoints to go on the graph, an area and
 * perimeter readout, and an erase button. These are consolidated together in this node to avoid code duplication.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var BucketFront = require( 'SCENERY_PHET/bucket/BucketFront' );
  var BucketHole = require( 'SCENERY_PHET/bucket/BucketHole' );
  // var Color = require( 'SCENERY/util/Color' );
  var DataPointCreatorNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DataPointCreatorNode' );
  var DataPointNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DataPointNode' );
  // var DataPointPlacementGraphNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DataPointPlacementGraphNode' );

  var EraserButton = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/EraserButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );

  var Node = require( 'SCENERY/nodes/Node' );
  // var Shape = require( 'KITE/Shape' );
  // var LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );

  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var IDENTITY_TRANSFORM = ModelViewTransform2.createIdentity();
  var DATA_POINT_CREATOR_OFFSET_POSITIONS = [
    // Offsets used for initial position of point, relative to bucket hole center. Empirically determined.
    new Vector2( -28, -5 ),
    new Vector2( -15, -3 ),
    new Vector2( 4, -4 ),
    new Vector2( 13, -2 ),
    new Vector2( -2, 0 )];

  /**
   * @param {Function} addDataPointToModel - Function for adding a newly created dataPoint to the model.
   * @param {ObservableArray} movableDataPointList - The array that tracks the movable dataPoints.
   * @param {Bucket} bucket - Model of the bucket that is to be portrayed
   * @param {Object} layerOptions
   * @constructor
   */
  function CompositeNode( addDataPointToModel, movableDataPointList, bucket, layerOptions ) {

    layerOptions = _.extend( {
      // optional layers (scenery nodes) that can be passed in to enable optimal layering.
      dataPointsLayer: null
    }, layerOptions );

    Node.call( this );

    // Create the nodes that will be used to layer things visually.
    var backLayer = new Node();
    this.addChild( backLayer );
    var movableDataPointsLayer = layerOptions.dataPointsLayer ? layerOptions.dataPointsLayer : new Node( { layerSplit: true } ); // Force the moving dataPoint into a separate layer for performance reasons.
    this.addChild( movableDataPointsLayer );
    var bucketFrontLayer = new Node();
    this.addChild( bucketFrontLayer );

    // Add the bucket view elements
    var bucketFront = new BucketFront( bucket, IDENTITY_TRANSFORM );
    bucketFrontLayer.addChild( bucketFront );
    var bucketHole = new BucketHole( bucket, IDENTITY_TRANSFORM );
    backLayer.addChild( bucketHole );

    // Add the dataPoint creator nodes. These must be added after the bucket hole for proper layering.
    DATA_POINT_CREATOR_OFFSET_POSITIONS.forEach( function( offset ) {
      backLayer.addChild( new DataPointCreatorNode(
        addDataPointToModel, {
          left: bucketHole.centerX + offset.x,
          top: bucketHole.centerY + offset.y
        } ) );
    } );

    // Add the button that allows the graph to be cleared of all dataPoints.
    this.addChild( new EraserButton( {
      right: bucketFront.right - 3,
      top: bucketFront.bottom + 5,
      listener: function() { movableDataPointList.clear(); }
    } ) );

    // Handle the comings and goings of movable dataPoints.
    movableDataPointList.addItemAddedListener( function( addedDataPoint ) {

      // Create and add the view representation for this dataPoint.
      var dataPointNode = new DataPointNode( addedDataPoint );
      movableDataPointsLayer.addChild( dataPointNode );

      // Move the dataPoint to the front of this layer when grabbed by the user.
      addedDataPoint.userControlledProperty.link( function( userControlled ) {
        if ( userControlled ) {
          dataPointNode.moveToFront();
        }
      } );

      // Add the removal listener for if and when this dataPoint is removed from the model.
      movableDataPointList.addItemRemovedListener( function removalListener( removedDataPoint ) {
        if ( removedDataPoint === addedDataPoint ) {
          movableDataPointsLayer.removeChild( dataPointNode );
          movableDataPointList.removeItemRemovedListener( removalListener );
        }
      } );
    } );
  }

  return inherit( Node, CompositeNode, {
    reset: function() {
    }
  } );
} );
