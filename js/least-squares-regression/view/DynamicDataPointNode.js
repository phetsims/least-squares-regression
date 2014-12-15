/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * Type that represents a movable dataPoint in the view.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var DataPointNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DataPointNode' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param {DataPoint} dataPoint
   * @param {ModelViewTransform} modelViewTransform
   * @constructor
   */
  function DynamicDataPointNode( dataPoint, modelViewTransform ) {
    DataPointNode.call( this, dataPoint, modelViewTransform );

    // Create the node that the user may click upon to add a model element to the view.
    var representation = new Circle( LSRConstants.DATA_POINT_RADIUS, {
      fill: LSRConstants.DATA_POINT_FILL,
      stroke: LSRConstants.DATA_POINT_STROKE,
      lineWidth: LSRConstants.DATA_POINT_LINE_WIDTH
    } );

    this.addChild( representation );

    this.touchArea = this.localBounds.dilatedXY( 15, 15 );
    // this.mouseArea = this.localBounds.dilatedXY( 10, 10 );


    // Add the listener that will allow the user to drag the dataPoint around.
    this.addInputListener( new SimpleDragHandler( {
      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,

      // Handler that moves the dataPoint in model space.

      translate: function( args ) {
        dataPoint.position = modelViewTransform.viewToModelPosition( args.position );
      },

      start: function( event, trail ) {
        dataPoint.userControlled = true;
        dataPoint.animating = false; // can stop point animation by catching the moving point in flight.
      },
      end: function( event, trail ) {
        dataPoint.userControlled = false;
      }
    } ) );
  }

  return inherit( DataPointNode, DynamicDataPointNode );
} );