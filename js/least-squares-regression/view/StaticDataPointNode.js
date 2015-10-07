// Copyright 2002-2015, University of Colorado Boulder

/**
 * Type that represents a static dataPoint in the view.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var DataPointNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DataPointNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );

  /**
   * @param {DataPoint} dataPoint
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function StaticDataPointNode( dataPoint, modelViewTransform ) {

    // Create and add  visual representation of the dataPoint
    var representation = new Circle( LeastSquaresRegressionConstants.STATIC_DATA_POINT_RADIUS, {
      fill: LeastSquaresRegressionConstants.STATIC_DATA_POINT_FILL,
      stroke: LeastSquaresRegressionConstants.STATIC_DATA_POINT_STROKE,
      lineWidth: LeastSquaresRegressionConstants.STATIC_DATA_POINT_LINE_WIDTH
    } );

    DataPointNode.call( this, dataPoint, representation, modelViewTransform );
  }

  return inherit( DataPointNode, StaticDataPointNode );
} );