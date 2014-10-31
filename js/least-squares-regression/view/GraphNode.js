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
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var Text = require( 'SCENERY/nodes/Text' );

  // string
  var pattern_0r_1value = "{0} {1}";

  /**
   * @param {Graph} graph
   * @constructor
   */
  function GraphNode( graph, model, modelViewTransform ) {
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

    Property.multilink( [ graph.slopeProperty, graph.interceptProperty], function( slope, intercept ) {
      line.setPoint1( modelViewTransform.modelToViewPosition( graph.getBoundaryPoints()[0] ) );
      line.setPoint2( modelViewTransform.modelToViewPosition( graph.getBoundaryPoints()[1] ) );
    } );

//    graph.interceptProperty.link( function( intercept ) {
//      if ( graph.getBoundaryPoints() ) {
//        line.setPoint1( modelViewTransform.modelToViewPosition( graph.getBoundaryPoints()[0] ) );
//        line.setPoint2( modelViewTransform.modelToViewPosition( graph.getBoundaryPoints()[1] ) );
//      }
//    } );
//
//    graph.slopeProperty.link( function( intercept ) {
//      if ( graph.getBoundaryPoints() ) {
//        line.setPoint1( modelViewTransform.modelToViewPosition( graph.getBoundaryPoints()[0] ) );
//        line.setPoint2( modelViewTransform.modelToViewPosition( graph.getBoundaryPoints()[1] ) );
//      }
//    } );

    var equationText = new Text( '**********' );
    var mutableEquationText = new Panel( equationText, { fill: 'white', cornerRadius: 2, resize: false } );
    mutableEquationText.bottom = graphNode.bottom - 10;
    mutableEquationText.right = graphNode.right - 10;
    this.addChild( mutableEquationText );
    // move the slider thumb to reflect the model value
    model.graph.slopeProperty.link( function( slope ) {
      //   var rText = Util.toFixedNumber( model.getPearsonCoefficientCorrelation(model.dataPoints.getArray()), 2 );
      //     var rText = Util.toFixedNumber( model.sumOfX(model.dataPoints.getArray().position), 2 );
      var rText = Util.toFixedNumber( model.getPearsonCoefficientCorrelation( [
        {x: 2, y: 4},
        {x: 3, y: 7},
        {x: 6, y: 9}
      ] ), 2 );
      equationText.text = StringUtils.format( pattern_0r_1value, 'r =', rText );

    } );


  }

  return inherit( Node, GraphNode );
} );