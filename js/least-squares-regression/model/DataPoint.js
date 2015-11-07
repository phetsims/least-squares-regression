// Copyright 2014-2015, University of Colorado Boulder

/**
 * Type that defines a data point.
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Vector2} initialPosition
   * @constructor
   */
  function DataPoint( initialPosition ) {

    PropertySet.call( this, {

      // Property that indicates where in model space the center of this data point is.
      position: initialPosition,

      // Flag that tracks whether the user is dragging this data point around. Should be set externally, generally by the a
      // view node.
      userControlled: false,

      // Flag that indicates whether this element is animating from one location to the bucket.
      // @public read-only
      animating: false

    } );

  }

  return inherit( PropertySet, DataPoint, {

    /**
     * Function that animates dataPoint back to the bucket.
     * @public
     */
    animate: function() {
      var self = this;

      this.animating = true;

      var position = {
        x: this.position.x,
        y: this.position.y
      };

      // distance from the dataPoint current position to its initial position (in the bucket)
      var distance = this.positionProperty.initialValue.distance( this.position );

      var animationTween = new TWEEN.Tween( position ).
        to( {
          x: this.positionProperty.initialValue.x,
          y: this.positionProperty.initialValue.y
        }, distance/ LeastSquaresRegressionConstants.ANIMATION_SPEED ).
        easing( TWEEN.Easing.Cubic.In ).
        onUpdate( function() {
          self.position = new Vector2( position.x, position.y );
        } ).
        onComplete( function() {
          self.animating = false;
          self.trigger( 'returnedToOrigin' );
        } );

      animationTween.start();
    }
  } );
} );