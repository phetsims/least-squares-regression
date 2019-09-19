// Copyright 2014-2019, University of Colorado Boulder

/**
 * Type that defines a data point.
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Emitter = require( 'AXON/Emitter' );
  const inherit = require( 'PHET_CORE/inherit' );
  const leastSquaresRegression = require( 'LEAST_SQUARES_REGRESSION/leastSquaresRegression' );
  const LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  /**
   * @param {Vector2} initialPosition
   * @constructor
   */
  function DataPoint( initialPosition ) {

    // @public - indicates where in model space the center of this data point is.
    this.positionProperty = new Vector2Property( initialPosition );

    // @public {Property.<boolean>}
    // Flag that tracks whether the user is dragging this data point around. Should be set externally, generally by a
    // view node.
    this.userControlledProperty = new BooleanProperty( false );

    // @public read-only {Property.<boolean>}
    // Flag that indicates whether this element is animating from one location to the bucket.
    this.animatingProperty = new BooleanProperty( false );

    // @public
    this.returnedToOriginEmitter = new Emitter();
  }

  leastSquaresRegression.register( 'DataPoint', DataPoint );

  return inherit( Object, DataPoint, {

    /**
     *  resets all the properties of DataPoint
     *  @public
     */
    reset: function() {
      this.positionProperty.reset();
      this.userControlledProperty.reset();
      this.animatingProperty.reset();
    },
    /**
     * Function that animates dataPoint back to the bucket.
     * @public
     */
    animate: function() {
      var self = this;

      this.animatingProperty.set( true );

      var position = {
        x: this.positionProperty.value.x,
        y: this.positionProperty.value.y
      };

      // distance from the dataPoint current position to its initial position (in the bucket)
      var distance = this.positionProperty.initialValue.distance( this.positionProperty.value );

      if ( distance > 0 ) {
        var animationTween = new TWEEN.Tween( position ).to( {
          x: this.positionProperty.initialValue.x,
          y: this.positionProperty.initialValue.y
        }, distance / LeastSquaresRegressionConstants.ANIMATION_SPEED ).easing( TWEEN.Easing.Cubic.In ).onUpdate( function() {
          self.positionProperty.set( new Vector2( position.x, position.y ) );
        } ).onComplete( function() {
          self.animatingProperty.set( false );
          self.returnedToOriginEmitter.emit();
        } );

        animationTween.start( phet.joist.elapsedTime );
      }
      else {
        // returned dataPoint to bucket when the distance is zero
        // no need for animation
        // see https://github.com/phetsims/least-squares-regression/issues/69
        self.animatingProperty.set( false );
        self.returnedToOriginEmitter.emit();
      }
    }
  } );
} );