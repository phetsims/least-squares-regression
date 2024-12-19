// Copyright 2014-2022, University of Colorado Boulder

/**
 * Type that represents a residual Line and Square in the view.
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Shape } from '../../../../kite/js/imports.js';
import Pool from '../../../../phet-core/js/Pool.js';
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
                      lineColor: { SQUARED_RESIDUAL_COLOR: string; RESIDUAL_COLOR: string },
                      private viewBounds: Bounds2,
                      private modelViewTransform: ModelViewTransform2,
                      private lineVisibilityProperty: TReadOnlyProperty<boolean>,
                      private squareVisibilityProperty: TReadOnlyProperty<boolean> ) {
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

    this.initialize( residualProperty, lineColor, viewBounds, modelViewTransform, lineVisibilityProperty, squareVisibilityProperty );
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

  public freeToPool(): void {

    // unlink listeners
    this.lineVisibilityProperty.unlink( this.lineVisibilityPropertyListener );
    this.squareVisibilityProperty.unlink( this.squareVisibilityPropertyListener );
    this.residualProperty.unlink( this.updateLineAndSquareListener );

    // TypeScript doesn't need to know that we're using this for different types. When it is "active", it will be
    // the correct type.
    ResidualLineAndSquareNode.pool.freeToPool( this );
  }

  public initialize( residualProperty: Property<Residual>, lineColor: { SQUARED_RESIDUAL_COLOR: string; RESIDUAL_COLOR: string }, viewBounds: Bounds2, modelViewTransform: ModelViewTransform2, lineVisibilityProperty: TReadOnlyProperty<boolean>, squareVisibilityProperty: TReadOnlyProperty<boolean> ): ResidualLineAndSquareNode {
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

  public static readonly pool = new Pool( ResidualLineAndSquareNode, {
    initialize: ResidualLineAndSquareNode.prototype.initialize
  } );
}

leastSquaresRegression.register( 'ResidualLineAndSquareNode', ResidualLineAndSquareNode );