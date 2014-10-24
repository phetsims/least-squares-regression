/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * A Scenery node that can be clicked upon to create new movable dataPoints in the model.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var LeastSquaresRegressionSharedConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionSharedConstants' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDataPoint = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/MovableDataPoint' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  // constants
  var BORDER_LINE_WIDTH = 1;

  /**
   * @param {Function} addDataPointToModel - A function for adding the created dataPoint to the model
   * @param {Object} [options]
   * @constructor
   */
  function DataPointCreatorNode( addDataPointToModel, options ) {
    Node.call( this, { cursor: 'pointer' } );
    var self = this;

    options = _.extend( {

      // Spacing of the grid, if any, that should be shown on the creator node.  Null indicates no grid.
      gridSpacing: null,

      // Max number of dataPoints that can be created by this node.
      creationLimit: Number.POSITIVE_INFINITY

    }, options );

    // Create the node that the user will click upon to add a model element to the view.
    var representation = new Circle( 10, {fill: 'orange', stroke: 'black', lineWidth: BORDER_LINE_WIDTH } );

    this.addChild( representation );

    var createdCount = new Property( 0 ); // Used to track the number of dataPoints created and not returned.

    // If the created count exceeds the max, make this node invisible (which also makes it unusable).
    createdCount.link( function( numCreated ) {
      self.visible = numCreated < options.creationLimit;
    } );

    // Add the listener that will allow the user to click on this and create a new dataPoint, then position it in the model.
    this.addInputListener( new SimpleDragHandler( {

      parentScreen: null, // needed for coordinate transforms
      movableDataPoint: null,

      // Allow moving a finger (touch) across this node to interact with it
      allowTouchSnag: true,

      start: function( event, trail ) {
        var thisDragHandler = this;

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
        var upperLeftCornerGlobal = self.parentToGlobalPoint( self.leftTop );
        var initialPositionOffset = upperLeftCornerGlobal.minus( event.pointer.point );
        var initialPosition = this.parentScreen.globalToLocalPoint( event.pointer.point.plus( initialPositionOffset ) );

        // Create and add the new model element.
        this.movableDataPoint = new MovableDataPoint( initialPosition );
        this.movableDataPoint.userControlled = true;
        addDataPointToModel( this.movableDataPoint );

        // If the creation count is limited, adjust the value and monitor the created dataPoint for if/when it is returned.
        if ( options.creationLimit < Number.POSITIVE_INFINITY ) {
          // Use an IIFE to keep a reference of the movable dataPoint in a closure.
          (function() {
            createdCount.value++;
            var localRefToMovableDataPoint = thisDragHandler.movableDataPoint;
            localRefToMovableDataPoint.on( 'returnedToOrigin', function returnedToOriginListener() {
              if ( !localRefToMovableDataPoint.userControlled ) {
                // The dataPoint has been returned to its origin.
                createdCount.value--;
                localRefToMovableDataPoint.off( 'returnedToOrigin', returnedToOriginListener );
              }
            } );
          })();
        }
      },

      translate: function( translationParams ) {
        this.movableDataPoint.setDestination( this.movableDataPoint.position.plus( translationParams.delta ) );
      },

      end: function( event, trail ) {
        this.movableDataPoint.userControlled = false;
        this.movableDataPoint = null;
      }
    } ) );

    // Pass options through to parent.
    this.mutate( options );
  }

  return inherit( Node, DataPointCreatorNode );
} );