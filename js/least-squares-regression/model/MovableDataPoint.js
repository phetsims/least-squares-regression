/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * Type that defines a data point that can be moved by the user and placed on the data point placement boards.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var LeastSquaresRegressionSharedConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionSharedConstants' );
//  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
//  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants


  /**
   * @param {Vector2} initialPosition
   * @constructor
   */
  function MovableDataPoint( initialPosition ) {
    var self = this;

    PropertySet.call( this, {

      // Property that indicates where in model space the upper left corner of this data point is.  In general, this should
      // not be set directly outside of this type, and should only be manipulated through the methods defined below.
      position: initialPosition,

      // Flag that tracks whether the user is dragging this data point around.  Should be set externally, generally by the a
      // view node.
      userControlled: false,

      // Flag that indicates whether this element is animating from one location to another, should not be set externally.
      animating: false,

      // A flag that indicates whether this individual data point should become invisible when it is done animating.  This
      // is generally used in cases where it becomes part of a larger composite data point that is depicted instead.
      invisibleWhenStill: true
    } );

    // Destination is used for animation, and should be set through accessor methods only.
    this.destination = initialPosition.copy(); // @private

    // Trigger an event whenever this data point returns to its original position.
    this.positionProperty.lazyLink( function( position ) {
      if ( position.equals( initialPosition ) ) {
        self.trigger( 'returnedToOrigin' );
      }
    } );

  }

  return inherit( PropertySet, MovableDataPoint, {

    step: function( dt ) {
      if ( !this.userControlled ) {

        // perform any animation
        var distanceToDestination = this.position.distance( this.destination );
        if ( distanceToDestination > dt * LeastSquaresRegressionSharedConstants.ANIMATION_VELOCITY ) {
          // Move a step toward the destination.
          var stepAngle = Math.atan2( this.destination.y - this.position.y, this.destination.x - this.position.x );
          var stepVector = Vector2.createPolar( LeastSquaresRegressionSharedConstants.ANIMATION_VELOCITY * dt, stepAngle );
          this.position = this.position.plus( stepVector );
        }
        else if ( this.animating ) {
          // Less than one time step away, so just go to the destination.
          this.position = this.destination;
          this.animating = false;
        }
      }
    },

    /**
     * Set the destination for this data point.
     * @param {Vector2} destination
     * @param {boolean} animate
     */
    setDestination: function( destination, animate ) {
      this.destination = destination;
      if ( animate ) {
        this.animating = true;
      }
      else {
        this.position = destination;
      }
    },

    /**
     * Return the data point to the place where it was originally created.
     * @param {boolean} animate
     */
    returnToOrigin: function( animate ) {
      this.setDestination( this.positionProperty.initialValue, animate );
    }

  } );
} );