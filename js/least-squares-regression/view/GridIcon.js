// Copyright 2014-2020, University of Colorado Boulder

/**
 * A Scenery node that depicts a grid icon.
 *
 * @author Martin Veillette (Berea College)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';
import LeastSquaresRegressionConstants from '../LeastSquaresRegressionConstants.js';

/**
 *
 * @param {Object} [options]
 * @constructor
 */
function GridIcon( options ) {

  Node.call( this );

  options = merge( {
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

inherit( Node, GridIcon );
export default GridIcon;