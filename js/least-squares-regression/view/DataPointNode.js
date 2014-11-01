/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * Type that represents a  dataPoint in the view.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  // var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param {DataPoint} dataPoint
   * @constructor
   */
  function DataPointNode( dataPoint, modelViewTransform ) {
    Node.call( this, { cursor: 'pointer' } );
    var self = this;

    // Set up the mouse and touch areas for this node so that this can still be grabbed when invisible.
    this.touchArea = this.localBounds.dilatedXY( 10, 10 );
    this.mouseArea = this.localBounds.dilatedXY( 10, 10 );

    // Set up a root node whose visibility and opacity will be manipulated below.
    var rootNode = new Node();
    this.addChild( rootNode );

    // Create the node that the user will click upon to add a model element to the view.
    var representation = new Circle( LSRConstants.DATA_POINT_RADIUS, {
      fill: LSRConstants.DATA_POINT_FILL,
      stroke: LSRConstants.DATA_POINT_STROKE,
      lineWidth: LSRConstants.DATA_POINT_LINE_WIDTH } );

    rootNode.addChild( representation );

    // Move this node as the model representation moves
    dataPoint.positionProperty.link( function( position ) {
      self.center = modelViewTransform.modelToViewPosition( position );
    } );

    dataPoint.animatingProperty.link( function( animating ) {
      // To avoid certain complications, make it so that users can't grab this when it is moving.
      self.pickable = !animating;
    } );

    // Add the listener that will allow the user to drag the dataPoint around.
    this.addInputListener( new SimpleDragHandler( {
      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,

      // Handler that moves the dataPoint in model space.
      translate: function( translationParams ) {
        dataPoint.setDestination( dataPoint.position.plus( modelViewTransform.viewToModelDelta( translationParams.delta ) ), false );
        return translationParams.position;
      },
      start: function( event, trail ) {
        dataPoint.userControlled = true;
        dataPoint.animating = false;
      },
      end: function( event, trail ) {
        dataPoint.userControlled = false;
      }
    } ) );
  }

  return inherit( Node, DataPointNode );
} );