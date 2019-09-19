// Copyright 2014-2017, University of Colorado Boulder

/**
 * A Scenery node that depicts a grid icon.
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const leastSquaresRegression = require( 'LEAST_SQUARES_REGRESSION/leastSquaresRegression' );
  const LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );

  /**
   *
   * @param {Object} [options]
   * @constructor
   */
  function GridIcon( options ) {

    Node.call( this );

    options = _.extend( {
      // defaults
      columns: 4,
      rows: 4,
      cellLength: 12, // in scenery coordinates
      gridStroke: LeastSquaresRegressionConstants.MAJOR_GRID_STROKE_COLOR,
      gridLineWidth: 1,
      gridFill: null
    }, options );

    const bounds = new Bounds2( 0, 0, options.columns * options.cellLength, options.rows * options.cellLength );
    const gridShape = new Shape();

    // Create the vertical lines
    for ( var i = bounds.minX + options.cellLength; i < bounds.maxX; i += options.cellLength ) {
      gridShape.moveTo( i, bounds.minY ).verticalLineTo( bounds.maxX );
    }

    // Create the horizontal lines
    for ( i = bounds.minY + options.cellLength; i < bounds.maxY; i += options.cellLength ) {
      gridShape.moveTo( bounds.minX, i ).horizontalLineTo( bounds.maxY );
    }

    const gridPath = new Path( gridShape, {
      stroke: options.gridStroke,
      lineWidth: options.gridLineWidth,
      fill: options.gridFill
    } );

    this.addChild( gridPath );

    // Pass options through to the parent class.
    this.mutate( options );
  }

  leastSquaresRegression.register( 'GridIcon', GridIcon );

  return inherit( Node, GridIcon );
} )
;