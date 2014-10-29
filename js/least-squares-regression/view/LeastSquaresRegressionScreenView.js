// Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules

  var BestFitLineBoxNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/BestFitLineBoxNode' );
  var CompositeNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/CompositeNode' );
  var DataPointPlacementGraphNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DataPointPlacementGraphNode' );
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

  //constants

  // var LABEL_COLOR = 'brown';
  // var LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  // var IDENTITY_TRANSFORM = ModelViewTransform2.createIdentity();

  /**
   * @param {LeastSquaresRegressionModel} leastSquaresRegressionModel
   * @constructor
   */
  function LeastSquaresRegressionScreenView( model ) {

    ScreenView.call( this, { renderer: 'svg' } );
    var thisView = this;

    //model View transform
    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( thisView.layoutBounds.width / 4, 3 * thisView.layoutBounds.height / 4 ),
      3 );
    thisView.modelViewTransform = modelViewTransform; // Make the modelViewTransform available to descendant types.

    var bestFitLineBoxNode = new BestFitLineBoxNode( model );
    this.addChild( bestFitLineBoxNode );

    var myLineBoxNode = new MyLineBoxNode( model );
    this.addChild( myLineBoxNode );

    var dataPointPlacementGraphNode = new DataPointPlacementGraphNode( model.dataPointPlacementGraph );

    this.addChild( dataPointPlacementGraphNode );
    // Create the nodes that will be used to layer things visually.
    var backLayer = new Node();
    this.addChild( backLayer );
    // Create the layer where the points will be placed. They are maintained in a separate layer so that they are over
    // all of the point placement graphs in the z-order.
    var movableDataPointsLayer = new Node( { layerSplit: true } ); // Force the moving point into a separate layer for performance reasons.

    var compositeNode = new CompositeNode( model.addUserCreatedMovableDataPoint.bind( model ),
      model.movableDataPoints, model.bucket, { dataPointsLayer: movableDataPointsLayer } );
    this.addChild( compositeNode );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    // Add the movable points issue.
    this.addChild( movableDataPointsLayer );
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