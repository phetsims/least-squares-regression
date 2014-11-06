/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * Type that defines a data point that can be moved by the user and placed on the data point placement graphs.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );


  /**
   * @param {Vector2} initialPosition
   * @constructor
   */
  function DataPoint( initialPosition ) {
    //  var self = this;

    PropertySet.call( this, {

      // Property that indicates where in model space the upper left corner of this data point is. In general, this should
      // not be set directly outside of this type, and should only be manipulated through the methods defined below.
      position: initialPosition,

      // Flag that tracks whether the user is dragging this data point around. Should be set externally, generally by the a
      // view node.
      userControlled: false,

      // Flag that indicates whether this element is animating from one location to another, should not be set externally.
      animating: false

    } );

    this.initialPosition = initialPosition;
  }

  return inherit( PropertySet, DataPoint, {

    step: function( dt ) {
      if ( this.animating ) {
        this.animationStep( dt );
      }
    },

    animationStep: function( dt ) {
      // perform any animation
      var distanceToDestination = this.position.distance( this.initialPosition );

      // TODO: ANIMATION_VELOCITY is set in the model: not the view... adapt for scaling factor
      if ( distanceToDestination > dt * LeastSquaresRegressionConstants.ANIMATION_VELOCITY ) {
        // Move a step toward the position.
        var stepAngle = Math.atan2( this.initialPosition.y - this.position.y, this.initialPosition.x - this.position.x );
        var stepVector = Vector2.createPolar( LeastSquaresRegressionConstants.ANIMATION_VELOCITY * dt, stepAngle );
        this.position = this.position.plus( stepVector );
      }
      else {
        // Less than one time step away, so just go to the initial position.
        this.position = this.initialPosition;
        this.animating = false;
        this.trigger( 'returnedToOrigin' );
      }
    }

  } );
} );