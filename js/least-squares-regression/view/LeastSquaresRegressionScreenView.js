//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules

  var AccordionBox = require( 'SUN/AccordionBox' );
  var BucketFront = require( 'SCENERY_PHET/bucket/BucketFront' );
  var BucketHole = require( 'SCENERY_PHET/bucket/BucketHole' );
  var ComboBox = require( 'SUN/ComboBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
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
      new Vector2( thisView.layoutBounds.width / 2, thisView.layoutBounds.height / 2 ),
        thisView.layoutBounds.height / 4 );
    thisView.modelViewTransform = modelViewTransform; // Make the modelViewTransform available to descendant types.


//    // Create the nodes that will be used to layer things visually.
//    var backLayer = new Node();
//    this.addChild( backLayer );
////    var movableShapesLayer = layerOptions.shapesLayer ? layerOptions.shapesLayer : new Node( { layerSplit: true } ); // Force the moving shape into a separate layer for performance reasons.
////    this.addChild( movableShapesLayer );
//    var bucketFrontLayer = new Node();
//    this.addChild( bucketFrontLayer );
//    var singleBoardControlsLayer = new Node();
//    this.addChild( singleBoardControlsLayer );
//
//    // Add the bucket view elements
//    var bucketFront = new BucketFront( model.bucket, IDENTITY_TRANSFORM );
//    bucketFrontLayer.addChild( bucketFront );
//    var bucketHole = new BucketHole( model.bucket, IDENTITY_TRANSFORM );
//    backLayer.addChild( bucketHole );


    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
  }

  return inherit( ScreenView, LeastSquaresRegressionScreenView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );