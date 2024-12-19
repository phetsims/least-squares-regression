// Copyright 2014-2024, University of Colorado Boulder

/**
 * Type that defines a data point.
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';
import LeastSquaresRegressionConstants from '../LeastSquaresRegressionConstants.js';

/* global TWEEN */

export default class DataPoint {

  // Indicates where in model space the center of this data point is.
  public readonly positionProperty: Vector2Property;

  // Flag that tracks whether the user is dragging this data point around.
  public readonly userControlledProperty: BooleanProperty;

  // Flag that indicates whether this element is animating from one position back to the bucket.
  public readonly animatingProperty: BooleanProperty;

  // Emitter that fires when the data point has returned to its origin.
  public readonly returnedToOriginEmitter: Emitter;

  public positionUpdateListener?: () => void;
  public userControlledListener?: ( userControlled: boolean ) => void;
  public returnedToOriginListener?: () => void;

  /**
   * @param initialPosition - the initial position of the DataPoint in model space
   */
  public constructor( initialPosition: Vector2 ) {

    this.positionProperty = new Vector2Property( initialPosition );
    this.userControlledProperty = new BooleanProperty( false );
    this.animatingProperty = new BooleanProperty( false );
    this.returnedToOriginEmitter = new Emitter();
  }

  /**
   * Resets all the properties of DataPoint.
   */
  public reset(): void {
    this.positionProperty.reset();
    this.userControlledProperty.reset();
    this.animatingProperty.reset();
  }

  /**
   * Function that animates the DataPoint back to the bucket.
   */
  public animate(): void {
    this.animatingProperty.set( true );

    const position = {
      x: this.positionProperty.value.x,
      y: this.positionProperty.value.y
    };

    // distance from the dataPoint current position to its initial position (in the bucket)
    const distance = this.positionProperty.initialValue.distance( this.positionProperty.value );

    if ( distance > 0 ) {

      // TODO https://github.com/phetsims/least-squares-regression/issues/94 Use twixt?
      const animationTween = new TWEEN.Tween( position )
        .to( {
          x: this.positionProperty.initialValue.x,
          y: this.positionProperty.initialValue.y
        }, distance / LeastSquaresRegressionConstants.ANIMATION_SPEED )
        .easing( TWEEN.Easing.Cubic.In )
        .onUpdate( () => {
          this.positionProperty.set( new Vector2( position.x, position.y ) );
        } )
        .onComplete( () => {
          this.animatingProperty.set( false );
          this.returnedToOriginEmitter.emit();
        } );

      animationTween.start( phet.joist.elapsedTime );
    }
    else {
      // returned dataPoint to bucket when the distance is zero
      // no need for animation
      // see https://github.com/phetsims/least-squares-regression/issues/69
      this.animatingProperty.set( false );
      this.returnedToOriginEmitter.emit();
    }
  }
}

leastSquaresRegression.register( 'DataPoint', DataPoint );