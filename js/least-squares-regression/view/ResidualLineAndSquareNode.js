/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * Type that represents a residual Square in the view.
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
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
  var SQUARE_TRANSPARENCY = 0.6;  //between 0 and 1

  /**
   *
   * @param {Property-<Residual>}residualProperty
   * @param {Color} baseColor
   * @param {Bounds2} viewBounds
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property-<boolean>} lineVisibilityProperty
   * @param {Property-<boolean>} squareVisibilityProperty
   * @constructor
   */
  function ResidualLineAndSquareNode( residualProperty, baseColor, viewBounds, modelViewTransform, lineVisibilityProperty, squareVisibilityProperty ) {
    Node.call( this );

    this.viewBounds = viewBounds;
    this.modelViewTransform = modelViewTransform;
    this.residualProperty = residualProperty;
    var residualLineAndSquareNode = this;

    var mainColor = Color.toColor( baseColor ); // @public

    // point 1 is the position of the datapoint
    var point1 = this.modelViewTransform.modelToViewPosition( residualProperty.value.point1 );
    // point 2 is at the position of intersect of the vertical line and the y= m x + b line
    var point2 = this.modelViewTransform.modelToViewPosition( residualProperty.value.point2 );

    // position of the top of the square
    var top = Math.min( point1.y, point2.y );
    // height of the square
    var height = Math.abs( point1.y - point2.y );

    // we want a square shape
    var width = height;

    // position of the left side of the square
    // the square residual can be on the left or on the right of point1 (the dataPoint position)
    // however the square residual should not overlap with the y = m x + b line:
    var left = (residualProperty.value.isSquaredResidualToTheLeft) ? point1.x - width : point1.x;

    this.squareResidual = new Rectangle( left, top, width, height, {fill: mainColor.withAlpha( SQUARE_TRANSPARENCY )} );
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

      // update line residual

      this.lineResidual.setPoint1( point1 );
      this.lineResidual.setPoint2( point2 );
      // the line residual should not show outside the graph.
      this.lineResidual.clipArea = Shape.bounds( this.viewBounds );


      // update square residual

      var top = Math.min( point1.y, point2.y );
      var height = Math.abs( point1.y - point2.y );

      // we want a square
      var width = height;

      // the square residual can be on the left or on the right of point1 (the dataPoint position)
      // however the square residual should not overlap with the y = m x + b line:
      var left = (this.residualProperty.value.isSquaredResidualToTheLeft) ? point1.x - width : point1.x;

      this.squareResidual.setRect( left, top, width, height );
      // the squareResidual should not show outside the graph.
      this.squareResidual.clipArea = Shape.bounds( this.viewBounds );

    }

  } );
} );