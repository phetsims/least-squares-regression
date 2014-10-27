//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules

  var AccordionBox = require( 'SUN/AccordionBox' );
  var BestFitLineBoxNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/BestFitLineBoxNode' );
  var BucketFront = require( 'SCENERY_PHET/bucket/BucketFront' );
  var BucketHole = require( 'SCENERY_PHET/bucket/BucketHole' );
  var ComboBox = require( 'SUN/ComboBox' );
  var CompositeNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/CompositeNode' );
  var DataPointCreatorNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DataPointNode' );
  var DataPointNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DataPointCreatorNode' );
  var GraphNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/GraphNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MyLineBoxNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/MyLineBoxNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Range = require( 'DOT/Range' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  //constants

  var LABEL_COLOR = 'brown';
  var LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  var IDENTITY_TRANSFORM = ModelViewTransform2.createIdentity();


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
      1 );
    thisView.modelViewTransform = modelViewTransform; // Make the modelViewTransform available to descendant types.


    var bestFitLineBoxNode = new BestFitLineBoxNode( model );
    this.addChild( bestFitLineBoxNode );


    var myLineBoxNode = new MyLineBoxNode( model );
    this.addChild( myLineBoxNode );

    var graphNode = new GraphNode( model.graph, modelViewTransform );
    this.addChild( graphNode );

    // Create the nodes that will be used to layer things visually.
    var backLayer = new Node();
    this.addChild( backLayer );
    // Create the layer where the shapes will be placed.  They are maintained in a separate layer so that they are over
    // all of the shape placement boards in the z-order.
    var movableDataPointsLayer = new Node( { layerSplit: true } ); // Force the moving shape into a separate layer for performance reasons.


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

    // Add the movable shapes issue.
    this.addChild( movableDataPointsLayer );
    {
      myLineBoxNode.right = this.layoutBounds.maxX - 10;
      myLineBoxNode.top = 10;
    }

  }

  return inherit( ScreenView, LeastSquaresRegressionScreenView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );