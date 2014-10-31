// Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules

  var BestFitLineBoxNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/BestFitLineBoxNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var BucketFront = require( 'SCENERY_PHET/bucket/BucketFront' );
  var BucketHole = require( 'SCENERY_PHET/bucket/BucketHole' );
  // var Color = require( 'SCENERY/util/Color' );
  var DataPointCreatorNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DataPointCreatorNode' );
  var DataPointNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DataPointNode' );
  var GraphNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/GraphNode' );
  var EraserButton = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/EraserButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MyLineBoxNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/MyLineBoxNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  // var Path = require( 'SCENERY/nodes/Path' );
  // var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  // var Range = require( 'DOT/Range' );
  // var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  // var Shape = require( 'KITE/Shape' );
  // var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  // var Text = require( 'SCENERY/nodes/Text' );
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
   * @param {LeastSquaresRegressionModel} leastSquaresRegressionModel
   * @constructor
   */
  function LeastSquaresRegressionScreenView( model ) {

    ScreenView.call( this, { renderer: 'svg' } );
    var thisView = this;


    //model View transform
//    var modelViewTransform = ModelViewTransform2.createSinglePointXYScaleMapping(
//      model.graph.graphOriginPosition,
//      model.graph.viewOriginPosition,
//      model.graph.scaleXFactor,
//      model.graph.scaleYFactor );

    var viewGrapgBounds = new Bounds2( 200, 50, 550, 450 );
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( model.graph.bounds, viewGrapgBounds );


    thisView.modelViewTransform = modelViewTransform; // Make the modelViewTransform available to descendant types.

    var bestFitLineBoxNode = new BestFitLineBoxNode( model );
    this.addChild( bestFitLineBoxNode );

    var myLineBoxNode = new MyLineBoxNode( model );
    this.addChild( myLineBoxNode );

    var graphNode = new GraphNode( model.graph, model, modelViewTransform );
    this.addChild( graphNode );

    // Create the nodes that will be used to layer things visually.
    var backLayer = new Node();
    this.addChild( backLayer );
//    Create the layer where the points will be placed. They are maintained in a separate layer so that they are over
//     all of the point placement graphs in the z-order.
    var dataPointsLayer = new Node( { layerSplit: true } ); // Force the moving dataPoint into a separate layer for performance reasons.

    var bucketFrontLayer = new Node();
    this.addChild( bucketFrontLayer );

    // Add the bucket view elements
    var bucketFront = new BucketFront( model.bucket, IDENTITY_TRANSFORM );
    bucketFrontLayer.addChild( bucketFront );
    var bucketHole = new BucketHole( model.bucket, IDENTITY_TRANSFORM );
    backLayer.addChild( bucketHole );

    // Add the dataPoint creator nodes. These must be added after the bucket hole for proper layering.
    DATA_POINT_CREATOR_OFFSET_POSITIONS.forEach( function( offset ) {
      backLayer.addChild( new DataPointCreatorNode(
        model.addUserCreatedDataPoint.bind( model ),
        modelViewTransform, {
          left: bucketHole.centerX + offset.x,
          top: bucketHole.centerY + offset.y
        } ) );
    } );

    // Add the button that allows the graph to be cleared of all dataPoints.
    this.addChild( new EraserButton( {
      right: bucketFront.right - 3,
      top: bucketFront.bottom + 5,
      listener: function() { model.dataPoints.clear(); }
    } ) );

    // Handle the comings and goings of  dataPoints.
    model.dataPoints.addItemAddedListener( function( addedDataPoint ) {

      // Create and add the view representation for this dataPoint.
      var dataPointNode = new DataPointNode( addedDataPoint, modelViewTransform );
      dataPointsLayer.addChild( dataPointNode );

      // Move the dataPoint to the front of this layer when grabbed by the user.
      addedDataPoint.userControlledProperty.link( function( userControlled ) {
        if ( userControlled ) {
          dataPointNode.moveToFront();
        }
      } );

      // Add the removal listener for if and when this dataPoint is removed from the model.
      model.dataPoints.addItemRemovedListener( function removalListener( removedDataPoint ) {
        if ( removedDataPoint === addedDataPoint ) {
          dataPointsLayer.removeChild( dataPointNode );
          model.dataPoints.removeItemRemovedListener( removalListener );
        }
      } );
    } );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        model.graph.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    // Add the dataPoints layer last .
    this.addChild( dataPointsLayer );

    {
      myLineBoxNode.right = this.layoutBounds.maxX - 10;
      myLineBoxNode.top = 10;
      bestFitLineBoxNode.left = 10;
      bestFitLineBoxNode.top = 10;
    }

  }

  return inherit( ScreenView, LeastSquaresRegressionScreenView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );