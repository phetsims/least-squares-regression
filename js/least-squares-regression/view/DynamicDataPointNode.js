// Copyright 2014-2015, University of Colorado Boulder

/**
 * Type that represents a movable dataPoint in the view.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var DataPointNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DataPointNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var leastSquaresRegression = require( 'LEAST_SQUARES_REGRESSION/leastSquaresRegression' );
  var LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param {DataPoint} dataPoint
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function DynamicDataPointNode( dataPoint, modelViewTransform ) {

    // Create the visual representation of the DynamicDataPoint
    var representation = new Circle( LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_RADIUS, {
      fill: LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_FILL,
      stroke: LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_STROKE,
      lineWidth: LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_LINE_WIDTH
    } );

    DataPointNode.call( this, dataPoint, representation, modelViewTransform );

    // Expand the touch area
    this.touchArea = this.localBounds.dilatedXY( 15, 15 );

    // Add the listener that will allow the user to drag the dataPoint around.
    this.addInputListener( new SimpleDragHandler( {
      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,

      // Handler that moves the dataPoint in model space.
      start: function( event, trail ) {
        dataPoint.userControlledProperty.set( true );
      },

      translate: function( args ) {
        dataPoint.positionProperty.value = modelViewTransform.viewToModelPosition( args.position );
      },

      end: function( event, trail ) {
        dataPoint.userControlledProperty.set( false );
      }
    } ) );
  }

  leastSquaresRegression.register( 'DynamicDataPointNode', DynamicDataPointNode );

  return inherit( DataPointNode, DynamicDataPointNode );
} );