/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * Type that represents a movable dataPoint in the view.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var LeastSquaresRegressionSharedConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionSharedConstants' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Color = require( 'SCENERY/util/Color' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  // var Grid = require( 'LEAST_SQUARE_REGRESSION/least-squares-regression/view/Grid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var BORDER_LINE_WIDTH = 1;

  /**
   * @param {MovableDataPoint} movableDataPoint
   * @constructor
   */
  function DataPointNode( movableDataPoint ) {
    Node.call( this, { cursor: 'pointer' } );
    var self = this;

    // Set up the mouse and touch areas for this node so that this can still be grabbed when invisible.

//TODO fixed this
    //   this.touchArea = movableDataPoint.shape;
    //   this.mouseArea = movableDataPoint.shape;

    // Set up a root node whose visibility and opacity will be manipulated below.
    var rootNode = new Node();
    this.addChild( rootNode );


    // Create the node that the user will click upon to add a model element to the view.
    var representation = new Circle( 10, {fill: 'orange', stroke: 'black', lineWidth: BORDER_LINE_WIDTH} );

    rootNode.addChild( representation );

    // Move this node as the model representation moves
    movableDataPoint.positionProperty.link( function( position ) {
      self.leftTop = position;
    } );

    // Because a composite dataPoint is often used to depict the overall dataPoint when a dataPoint is on the placement board, this
    // element may become invisible unless it is user controlled, animating, or fading.
    var visibleProperty = new DerivedProperty( [
        movableDataPoint.userControlledProperty,
        movableDataPoint.animatingProperty,
        movableDataPoint.invisibleWhenStillProperty ],
      function( userControlled, animating, invisibleWhenStill ) {
        return ( userControlled || animating || !invisibleWhenStill );
      } );


    visibleProperty.link( function( visible ) {
      rootNode.visible = visible;
    } );


    movableDataPoint.animatingProperty.link( function( animating ) {
      // To avoid certain complications, make it so that users can't grab this when it is moving.
      self.pickable = !animating;
    } );


    // Add the listener that will allow the user to drag the dataPoint around.
    this.addInputListener( new SimpleDragHandler( {
      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,

      // Handler that moves the dataPoint in model space.
      translate: function( translationParams ) {
        movableDataPoint.setDestination( movableDataPoint.position.plus( translationParams.delta ), false );
        return translationParams.position;
      },
      start: function( event, trail ) {
        movableDataPoint.userControlled = true;
      },
      end: function( event, trail ) {
        movableDataPoint.userControlled = false;
      }
    } ) );
  }

  return inherit( Node, DataPointNode );
} );