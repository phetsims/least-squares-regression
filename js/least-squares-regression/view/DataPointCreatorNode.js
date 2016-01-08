// Copyright 2014-2015, University of Colorado Boulder

/**
 * A Scenery node that can be clicked upon to create new dataPoints in the model.
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var DataPoint = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/DataPoint' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Function} addDataPointToModel - A function for adding the created dataPoint to the model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * @constructor
   */
  function DataPointCreatorNode( addDataPointToModel, modelViewTransform, options ) {
    Node.call( this, { cursor: 'pointer' } );
    var self = this;

    // Create the node that the user will click upon to add a model element to the view.
    var representation = new Circle( LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_RADIUS, {
      fill: LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_FILL,
      stroke: LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_STROKE,
      lineWidth: LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_LINE_WIDTH
    } );

    this.addChild( representation );

    // Set up the mouse and touch areas for this node so that this can still be grabbed when invisible.
    this.touchArea = this.localBounds.dilated( 15 );
    this.mouseArea = this.localBounds.dilated( 5 );


    // Add the listener that will allow the user to click on this and create a new dataPoint, then position it in the model.
    this.addInputListener( new SimpleDragHandler( {

      parentScreenView: null, // needed for coordinate transforms
      dataPoint: null,

      // Allow moving a finger (touch) across this node to interact with it
      allowTouchSnag: true,

      start: function( event, trail ) {

        // find the parent screen if not already found by moving up the scene graph
        if ( !this.parentScreenView ) {
          var testNode = self;
          while ( testNode !== null ) {
            if ( testNode instanceof ScreenView ) {
              this.parentScreenView = testNode;
              break;
            }
            testNode = testNode.parents[ 0 ]; // move up the scene graph by one level
          }
          assert && assert( this.parentScreenView, 'unable to find parent screen view' );
        }

        // Determine the initial position (set to be one circle radius above the pointer point)
        var initialPosition = this.parentScreenView.globalToLocalPoint( event.pointer.point.plus( new Vector2( 0, -LeastSquaresRegressionConstants.DYNAMIC_DATA_POINT_RADIUS ) ) );

        // Create and add the new model element.
        this.dataPoint = new DataPoint( modelViewTransform.viewToModelPosition( initialPosition ) );
        this.dataPoint.userControlled = true;
        addDataPointToModel( this.dataPoint );

      },

      translate: function( translationParams ) {
        this.dataPoint.position = this.dataPoint.position.plus( modelViewTransform.viewToModelDelta( translationParams.delta ) );
      },

      end: function( event, trail ) {
        this.dataPoint.userControlled = false;
        this.dataPoint = null;
      }
    } ) );

    // Pass options through to parent.
    this.mutate( options );
  }

  return inherit( Node, DataPointCreatorNode );
} );