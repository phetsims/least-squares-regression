// Copyright 2002-2014, University of Colorado Boulder

/**
 * View representation of a Graph, which is a graph where points
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
   * @param {Graph} graph
   * @constructor
   */
  function GraphNode( graph ) {
    Node.call( this );

    // Create and add the graph itself.
    var graphNode = Rectangle.bounds( graph.bounds, { fill: 'white', stroke: 'gray' } );
    this.addChild( graphNode );
  }

  return inherit( Node, GraphNode );
} );