// Copyright 2014-2018, University of Colorado Boulder

/**
 * Type that represents a residual Line and Square in the view.
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const leastSquaresRegression = require( 'LEAST_SQUARES_REGRESSION/leastSquaresRegression' );
  const LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Poolable = require( 'PHET_CORE/Poolable' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );

  /**
   *
   * @param {Property.<Residual>} residualProperty
   * @param {Object} lineColor - Object that defines all color properties of residual, squared residuals, line, etc.
   * @param {Bounds2} viewBounds
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} lineVisibilityProperty
   * @param {Property.<boolean>} squareVisibilityProperty
   * @constructor
   */
  function ResidualLineAndSquareNode( residualProperty, lineColor, viewBounds, modelViewTransform, lineVisibilityProperty, squareVisibilityProperty ) {
    Node.call( this );

    const self = this;

    // create line and square residual with nominal values, will set the correct value later
    this.squareResidual = new Rectangle( 0, 0, 1, 1 );
    this.lineResidual = new Line( 0, 0, 1, 1, {
      lineWidth: LeastSquaresRegressionConstants.RESIDUAL_LINE_WIDTH
    } );

    // Add the square residual and line residual
    this.addChild( this.squareResidual );
    this.addChild( this.lineResidual );

    // Add listeners
    this.lineVisibilityPropertyListener = function( visible ) {
      self.lineResidual.visible = visible;
    };

    this.squareVisibilityPropertyListener = function( visible ) {
      self.squareResidual.visible = visible;
    };

    this.updateLineAndSquareListener = this.updateLineAndSquare.bind( this );

    this.set( residualProperty, lineColor, viewBounds, modelViewTransform, lineVisibilityProperty, squareVisibilityProperty );
  }

  leastSquaresRegression.register( 'ResidualLineAndSquareNode', ResidualLineAndSquareNode );

  inherit( Node, ResidualLineAndSquareNode, {
    /**
     * Update the Line and Square Residual
     */
    updateLineAndSquare: function() {
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
    },

    // Was dispose, see https://github.com/phetsims/scenery/issues/601
    release: function() {
      // unlink listeners
      this.lineVisibilityProperty.unlink( this.lineVisibilityPropertyListener );
      this.squareVisibilityProperty.unlink( this.squareVisibilityPropertyListener );
      this.residualProperty.unlink( this.updateLineAndSquareListener );

      this.freeToPool(); // will throw ResidualLineAndSquareNode into the pool
    },

    set: function( residualProperty, lineColor, viewBounds, modelViewTransform, lineVisibilityProperty, squareVisibilityProperty ) {
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
  } );

  Poolable.mixInto( ResidualLineAndSquareNode, {
    initialize: ResidualLineAndSquareNode.prototype.set
  } );

  return ResidualLineAndSquareNode;
} );