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
  var Bounds2 = require( 'DOT/Bounds2' );
  // var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
//  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  // var Path = require( 'SCENERY/nodes/Path' );
  // var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Graph} graph
   * @constructor
   */
  function GraphNode( graph, modelViewTransform ) {
    Node.call( this );

    // Create and add the graph itself.

    this.viewBounds = new Bounds2( 200, 50, 550, 450 );
    var graphNode = Rectangle.bounds( this.viewBounds, { fill: 'white', stroke: 'gray' } );
    this.addChild( graphNode );
    var line = new Line(
      modelViewTransform.modelToViewPosition( graph.getBoundaryPoints()[0] ),
      modelViewTransform.modelToViewPosition( graph.getBoundaryPoints()[1] ),
      {stroke: 'blue', lineWidth: 2} );
    this.addChild( line );

    graph.interceptProperty.link( function( intercept ) {
      line.setPoint1( modelViewTransform.modelToViewPosition( graph.getBoundaryPoints()[0] ) );
      line.setPoint2( modelViewTransform.modelToViewPosition( graph.getBoundaryPoints()[1] ) );
    } );

    graph.slopeProperty.link( function( intercept ) {
      line.setPoint1( modelViewTransform.modelToViewPosition( graph.getBoundaryPoints()[0] ) );
      line.setPoint2( modelViewTransform.modelToViewPosition( graph.getBoundaryPoints()[1] ) );
    } );
  }

//
//    this.line = new Line (
//      modelViewTransform.modelToViewPosition(graph.getBoundaryPoints()[0]),
//      modelViewTransform.modelToViewPosition(graph.getBoundaryPoints()[1]),
//        {stroke: 'blue', lineWidth: 2});


  return inherit( Node, GraphNode );
} );