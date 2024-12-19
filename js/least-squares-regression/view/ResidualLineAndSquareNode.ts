// Copyright 2014-2022, University of Colorado Boulder

/**
 * Type that represents a residual Line and Square in the view.
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Shape } from '../../../../kite/js/imports.js';
import Poolable from '../../../../phet-core/js/Poolable.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Line, Node, Rectangle } from '../../../../scenery/js/imports.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';
import LeastSquaresRegressionConstants from '../LeastSquaresRegressionConstants.js';
import Residual from '../model/Residual.js';

export default class ResidualLineAndSquareNode extends Node {
  private readonly squareResidual: Rectangle;
  private readonly lineResidual: Line;
  private readonly lineVisibilityPropertyListener: ( visible: boolean ) => void;
  private readonly squareVisibilityPropertyListener: ( visible: boolean ) => void;
  private readonly updateLineAndSquareListener: () => void;

  public constructor( private residualProperty: Property<Residual>,
                      lineColor: IntentionalAny, // TODO: Object that defines all color properties of residual, squared residuals, line, etc. See https://github.com/phetsims/least-squares-regression/issues/94
                      private viewBounds: Bounds2,
                      private modelViewTransform: ModelViewTransform2,
                      private lineVisibilityProperty: Property<boolean>,
                      private squareVisibilityProperty: Property<boolean> ) {
    super();

    // create line and square residual with nominal values, will set the correct value later
    this.squareResidual = new Rectangle( 0, 0, 1, 1 );
    this.lineResidual = new Line( 0, 0, 1, 1, {
      lineWidth: LeastSquaresRegressionConstants.RESIDUAL_LINE_WIDTH
    } );

    // Add the square residual and line residual
    this.addChild( this.squareResidual );
    this.addChild( this.lineResidual );

    // Add listeners
    this.lineVisibilityPropertyListener = visible => {
      this.lineResidual.visible = visible;
    };

    this.squareVisibilityPropertyListener = visible => {
      this.squareResidual.visible = visible;
    };

    this.updateLineAndSquareListener = this.updateLineAndSquare.bind( this );

    this.set( residualProperty, lineColor, viewBounds, modelViewTransform, lineVisibilityProperty, squareVisibilityProperty );
  }

  /**
   * Update the Line and Square Residual
   */
  public updateLineAndSquare(): void {
    const point1 = this.modelViewTransform.modelToViewPosition( this.residualProperty.value.point1 );
    const point2 = this.modelViewTransform.modelToViewPosition( this.residualProperty.value.point2 );

    // Update line residual
    this.lineResidual.setPoint1( point1 );
    this.lineResidual.setPoint2( point2 );
    // the line residual should not show outside the graph.
    this.lineResidual.clipArea = Shape.bounds( this.viewBounds );

    // Update square residual
    const top = Math.min( point1.y, point2.y );
    const height = Math.abs( point1.y - point2.y );
    // we want a square
    const width = height;

    // the square residual can be on the left or on the right of point1 (the dataPoint position)
    // however the square residual should not overlap with the y = m x + b line:
    const left = ( this.residualProperty.value.isSquaredResidualToTheLeft ) ? point1.x - width : point1.x;

    this.squareResidual.setRect( left, top, width, height );
    // the squareResidual should not show outside the graph.
    this.squareResidual.clipArea = Shape.bounds( this.viewBounds );
  }

  /**
   * This used to be dispose() before we switched to Poolable, see https://github.com/phetsims/scenery/issues/601
   */
  public release(): void {
    // unlink listeners
    this.lineVisibilityProperty.unlink( this.lineVisibilityPropertyListener );
    this.squareVisibilityProperty.unlink( this.squareVisibilityPropertyListener );
    this.residualProperty.unlink( this.updateLineAndSquareListener );

    // @ts-expect-error TODO: https://github.com/phetsims/least-squares-regression/issues/94
    this.freeToPool(); // will throw ResidualLineAndSquareNode into the pool
  }

  public set( residualProperty: Property<Residual>, lineColor: IntentionalAny, viewBounds: Bounds2, modelViewTransform: ModelViewTransform2, lineVisibilityProperty: Property<boolean>, squareVisibilityProperty: Property<boolean> ): ResidualLineAndSquareNode {
    this.lineVisibilityProperty = lineVisibilityProperty;
    this.squareVisibilityProperty = squareVisibilityProperty;
    this.residualProperty = residualProperty;
    this.viewBounds = viewBounds;
    this.modelViewTransform = modelViewTransform;

    // link the listeners
    this.lineVisibilityProperty.link( this.lineVisibilityPropertyListener );
    this.squareVisibilityProperty.link( this.squareVisibilityPropertyListener );
    this.residualProperty.link( this.updateLineAndSquareListener );

    // set the appropriate color for the square and line residuals
    this.squareResidual.fill = lineColor.SQUARED_RESIDUAL_COLOR;
    this.lineResidual.stroke = lineColor.RESIDUAL_COLOR;

    return this; // for chaining
  }
}

leastSquaresRegression.register( 'ResidualLineAndSquareNode', ResidualLineAndSquareNode );

Poolable.mixInto( ResidualLineAndSquareNode, {
  initialize: ResidualLineAndSquareNode.prototype.set
} );