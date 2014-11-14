/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * A Scenery node that can be clicked upon to create new  dataPoints in the model.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  // var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var DataPoint = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/DataPoint' );
  var Node = require( 'SCENERY/nodes/Node' );
  // var Path = require( 'SCENERY/nodes/Path' );
  // var Property = require( 'AXON/Property' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param {Function} addDataPointToModel - A function for adding the created dataPoint to the model
   * @param {Object} [options]
   * @constructor
   */
  function DataPointCreatorNode( addDataPointToModel, modelViewTransform, options ) {
    Node.call( this, {cursor: 'pointer'} );
    var self = this;

    // Create the node that the user will click upon to add a model element to the view.
    var representation = new Circle( LSRConstants.DATA_POINT_RADIUS, {
      fill: LSRConstants.DATA_POINT_FILL,
      stroke: LSRConstants.DATA_POINT_STROKE,
      lineWidth: LSRConstants.DATA_POINT_LINE_WIDTH
    } );

    this.addChild( representation );

    // Set up the mouse and touch areas for this node so that this can still be grabbed when invisible.
    this.touchArea = this.localBounds.dilatedXY( 15, 15 );
//    this.mouseArea = this.localBounds.dilatedXY( 10, 10 );


    // Add the listener that will allow the user to click on this and create a new dataPoint, then position it in the model.
    this.addInputListener( new SimpleDragHandler( {

      parentScreen: null, // needed for coordinate transforms
      dataPoint: null,

      // Allow moving a finger (touch) across this node to interact with it
      allowTouchSnag: true,

      start: function( event, trail ) {
        // Find the parent screen by moving up the scene graph.
        var testNode = self;
        while ( testNode !== null ) {
          if ( testNode instanceof ScreenView ) {
            this.parentScreen = testNode;
            break;
          }
          testNode = testNode.parents[0]; // Move up the scene graph by one level
        }

        // Determine the initial position of the new element as a function of the event position and this node's bounds.
        var centerPositionGlobal = self.parentToGlobalPoint( self.center );
        var initialPositionOffset = centerPositionGlobal.minus( event.pointer.point );
        var initialPosition = this.parentScreen.globalToLocalPoint( event.pointer.point.plus( initialPositionOffset ) );

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