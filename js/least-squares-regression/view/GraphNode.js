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

  // var myLineSquaredResidualColor;

  /**
   *
   * @param graph
   * @param model
   * @param modelViewTransform
   * @constructor
   */
  function GraphNode( graph, model, modelViewTransform ) {
    var graphNode = this;
    this.graph = graph;
    this.modelViewTransform = modelViewTransform;
    Node.call( this );

    // Create and add the graph itself.

    this.viewBounds = new Bounds2( 200, 50, 550, 450 );
    var graphBoundsNode = Rectangle.bounds( this.viewBounds, { fill: 'white', stroke: 'gray' } );
    this.addChild( graphBoundsNode );

    var boundaryPoints = graph.getBoundaryPoints( graph.slope, graph.intercept );
    this.myLine = new Line(
      modelViewTransform.modelToViewPosition( boundaryPoints[0] ),
      modelViewTransform.modelToViewPosition( boundaryPoints[1] ),
      { stroke: 'blue', lineWidth: 2 } );
    this.addChild( this.myLine );

    var linearFitParameters = graph.getLinearFit();
    var bestBoundaryPoints = graph.getBoundaryPoints( linearFitParameters.slope, linearFitParameters.intercept );
    this.bestFitLine = new Line(
      modelViewTransform.modelToViewPosition( bestBoundaryPoints[0] ),
      modelViewTransform.modelToViewPosition( bestBoundaryPoints[1] ),
      {stroke: 'red', lineWidth: 2} );
    this.addChild( this.bestFitLine );

    this.myLineSquaredResidualsRectangles = new Node();
    this.addChild( this.myLineSquaredResidualsRectangles );

    this.bestFitLineSquaredResidualsRectangles = new Node();
    this.addChild( this.bestFitLineSquaredResidualsRectangles );

    this.myLineResidualsLines = new Node();
    this.addChild( this.myLineResidualsLines );

    this.bestFitLineResidualsLines = new Node();
    this.addChild( this.bestFitLineResidualsLines );

//    model.showMyLineProperty.linkAttribute( myLine, 'visible' );
//    model.showResidualsOfMyLineProperty.linkAttribute( this.myLineResidualsLines, 'visible' );
//    model.showSquareResidualsOfMyLineProperty.linkAttribute( this.myLineSquaredResidualsRectangles, 'visible' );
//
//    model.showBestFitLineProperty.linkAttribute( this.bestFitLine, 'visible' );
//    model.showResidualsOfBestFitLineProperty.linkAttribute( this.bestFitLineResidualsLines, 'visible' );
//    model.showSquareResidualsOfBestFitLineProperty.linkAttribute( this.bestFitLineSquaredResidualsRectangles, 'visible' );

//    model.showMyLineProperty.link( function( visible ) {
//    } );
//    model.showBestFitLineProperty.link( function( visible ) {
//    } );

    this.equationText = new Text( '**********' );
    var mutableEquationText = new Panel( this.equationText, { fill: 'white', cornerRadius: 2, resize: false } );
    mutableEquationText.bottom = graphNode.bottom - 10;
    mutableEquationText.right = graphNode.right - 10;
    this.addChild( mutableEquationText );

    Property.multilink( [ graph.angleProperty, graph.interceptProperty], function( angle, intercept ) {
      var slope = graph.slope( angle );
      var boundaryPoints = graph.getBoundaryPoints( slope, intercept );
      graphNode.myLine.setPoint1( modelViewTransform.modelToViewPosition( boundaryPoints[0] ) );
      graphNode.myLine.setPoint2( modelViewTransform.modelToViewPosition( boundaryPoints[1] ) );
      graphNode.updateMyLineResiduals();
      graphNode.updateMyLineSquaredResiduals();
    } );
  }

  return inherit( Node, GraphNode, {
    reset: function() {

    },

    update: function() {
      this.updatePearsonCoefficient();
      this.updateBestFitLine();
      this.updateMyLineResiduals();
      this.updateMyLineSquaredResiduals();
      if ( this.graph.dataPointsOnGraph.length > 1 ) {
        this.updateBestFitLineResiduals();
        this.updateBestFitLineSquaredResiduals();

      }
    },

    updatePearsonCoefficient: function() {
      var rText = Util.toFixedNumber( this.graph.getPearsonCoefficientCorrelation(), 2 );
      this.equationText.text = StringUtils.format( pattern_0r_1value, 'r =', rText );
    },
    updateMyLineResiduals: function() {
      var points = this.graph.getMyLineResidualsPoints();
      this.myLineResidualsLines.removeAllChildren();
      var self = this;
      points.forEach( function( point ) {
        var residualsLine = new Line(
          self.modelViewTransform.modelToViewPosition( point.point1 ),
          self.modelViewTransform.modelToViewPosition( point.point2 ),
          {stroke: 'rgba(0,255,255,1)', lineWidth: 4} );
        self.myLineResidualsLines.addChild( residualsLine );
      } );
    },

    updateBestFitLineResiduals: function() {
      var points = this.graph.getBestFitLineResidualsPoints();
      this.bestFitLineResidualsLines.removeAllChildren();
      var self = this;
      points.forEach( function( point ) {
        var residualsLine = new Line(
          self.modelViewTransform.modelToViewPosition( point.point1 ),
          self.modelViewTransform.modelToViewPosition( point.point2 ),
          {stroke: 'rgba(255,0,0,1)', lineWidth: 4} );
        self.bestFitLineResidualsLines.addChild( residualsLine );
      } );
    },

    updateMyLineSquaredResiduals: function() {
      var rectangles = this.graph.getMyLineSquaredResidualsRectangles();
      this.myLineSquaredResidualsRectangles.removeAllChildren();
      var self = this;
      rectangles.forEach( function( rectangle ) {
        var minXBound = self.modelViewTransform.modelToViewX( rectangle.minX );
        var maxXBound = self.modelViewTransform.modelToViewX( rectangle.maxX );
        //TODO: find a better way: y is inverted so what is min in the model is max in the view;
        var maxYBound = self.modelViewTransform.modelToViewY( rectangle.minY );
        var minYBound = self.modelViewTransform.modelToViewY( rectangle.maxY );
        var bound = new Bounds2( minXBound, minYBound, maxXBound, maxYBound );
        var squaredResidualsRectangle = Rectangle.bounds( bound, { fill: 'rgba(0,0,255,0.5)', stroke: 'gray' } );
        self.myLineSquaredResidualsRectangles.addChild( squaredResidualsRectangle );
      } );
    },

    updateBestFitLineSquaredResiduals: function() {
      var rectangles = this.graph.getBestFitLineSquaredResidualsRectangles();
      if ( rectangles === null ) {
        return null;
      }
      this.bestFitLineSquaredResidualsRectangles.removeAllChildren();
      var self = this;
      rectangles.forEach( function( rectangle ) {
        var minXBound = self.modelViewTransform.modelToViewX( rectangle.minX );
        var maxXBound = self.modelViewTransform.modelToViewX( rectangle.maxX );
        //TODO: find a better way: y is inverted so what is min in the model is max in the view;
        var maxYBound = self.modelViewTransform.modelToViewY( rectangle.minY );
        var minYBound = self.modelViewTransform.modelToViewY( rectangle.maxY );
        var bound = new Bounds2( minXBound, minYBound, maxXBound, maxYBound );

        var squaredResidualsRectangle = Rectangle.bounds( bound, { fill: 'rgba(255,0,0,0.5)', stroke: 'gray' } );
        self.bestFitLineSquaredResidualsRectangles.addChild( squaredResidualsRectangle );
      } );
    },

    updateBestFitLine: function() {
      var linearFitParameters = this.graph.getLinearFit();
      var boundaryPoints = this.graph.getBoundaryPoints( linearFitParameters.slope, linearFitParameters.intercept );
      this.bestFitLine.setPoint1( this.modelViewTransform.modelToViewPosition( boundaryPoints[0] ) );
      this.bestFitLine.setPoint2( this.modelViewTransform.modelToViewPosition( boundaryPoints[1] ) );
    }



  } );
} );