/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * Type that represents a residual Square in the view.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  // var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );

  var Color = require( 'SCENERY/util/Color' );
  // var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  // var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );

  // constants

  var RESIDUAL_LINE_WIDTH = 2;

  /**
   * @constructor
   */
  function ResidualLineAndSquareNode( residualProperty, baseColor, viewBounds, modelViewTransform, lineVisibilityProperty, squareVisibilityProperty ) {
    Node.call( this );

    this.viewBounds = viewBounds;
    this.modelViewTransform = modelViewTransform;
    this.residualProperty = residualProperty;
    var residualLineAndSquareNode = this;

    var mainColor = Color.toColor( baseColor ); // @public

    var point1 = this.modelViewTransform.modelToViewPosition( residualProperty.value.point1 );
    var point2 = this.modelViewTransform.modelToViewPosition( residualProperty.value.point2 );

    var y1 = point1.y;
    var y2 = point2.y;

    var top = Math.min( y1, y2 );
    var height = Math.abs( y1 - y2 );
    var width = height;

    var x1 = point1.x;
    var left = (residualProperty.value.isSquaredResidualToTheLeft) ? x1 - width : x1;

    this.squareResidual = new Rectangle( left, top, width, height, {fill: mainColor.withAlpha( 0.4 ), stroke: 'gray'} );
    this.lineResidual = new Line( point1, point2, {stroke: mainColor.brighterColor( 0.5 ), lineWidth: RESIDUAL_LINE_WIDTH} );
    this.squareResidual.clipArea = Shape.bounds( viewBounds );
    this.lineResidual.clipArea = Shape.bounds( viewBounds );

    this.addChild( this.squareResidual );
    this.addChild( this.lineResidual );
    lineVisibilityProperty.linkAttribute( this.lineResidual, 'visible' );
    squareVisibilityProperty.linkAttribute( this.squareResidual, 'visible' );
    residualProperty.link( function() {
        residualLineAndSquareNode.updateLineAndSquare();
      }
    );

  }

  return inherit( Node, ResidualLineAndSquareNode, {

    updateLineAndSquare: function() {
      var point1 = this.modelViewTransform.modelToViewPosition( this.residualProperty.value.point1 );
      var point2 = this.modelViewTransform.modelToViewPosition( this.residualProperty.value.point2 );
      this.lineResidual.setPoint1( point1 );
      this.lineResidual.setPoint2( point2 );
      this.lineResidual.clipArea = Shape.bounds( this.viewBounds );

      var top = Math.min( point1.y, point2.y );
      var height = Math.abs( point1.y - point2.y );

      // we want a square
      var width = height;

      var left = (this.residualProperty.value.isSquaredResidualToTheLeft) ? point1.x - width : point1.x;
      this.squareResidual.setRect( left, top, width, height );
      this.squareResidual.clipArea = Shape.bounds( this.viewBounds );

    }

  } );
} );