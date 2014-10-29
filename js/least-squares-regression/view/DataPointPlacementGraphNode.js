// Copyright 2002-2014, University of Colorado Boulder

/**
 * View representation of a DataPointPlacementGraph, which is a graph where points
 * can be placed.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  // var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
//  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  // var Path = require( 'SCENERY/nodes/Path' );
  // var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {DataPointPlacementGraph} dataPointPlacementGraph
   * @constructor
   */
  function DataPointPlacementGraphNode( dataPointPlacementGraph ) {
    Node.call( this );

    // Create and add the graph itself.
    var graph = Rectangle.bounds( dataPointPlacementGraph.bounds, { fill: 'white', stroke: 'gray' } );
    this.addChild( graph );

    var dataPointsLayer = new Node();
    this.addChild( dataPointsLayer );


  }

  return inherit( Node, DataPointPlacementGraphNode );
} );