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
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
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

  // constants

  var LINE_WIDTH = 2;
  var RESIDUAL_LINE_WIDTH = 2;

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
    var graphBoundsNode = Rectangle.bounds( this.viewBounds, { fill: LSRConstants.GRAPH_BACKGROUND_COLOR, stroke: 'gray' } );
    this.addChild( graphBoundsNode );

    var myLineBoundaryPoints = graph.getBoundaryPoints( graph.slope( graph.angle ), graph.intercept );
    console.log( myLineBoundaryPoints );
    this.myLine = new Line(
      modelViewTransform.modelToViewPosition( myLineBoundaryPoints.point1 ),
      modelViewTransform.modelToViewPosition( myLineBoundaryPoints.point2 ),
      { stroke: LSRConstants.MY_LINE_COLOR, lineWidth: LINE_WIDTH } );
    this.addChild( this.myLine );


    // set bestFitLine to zero length and then update it
    this.bestFitLine = new Line( 0, 0, 0, 0, {stroke: LSRConstants.BEST_FIT_LINE_COLOR, lineWidth: LINE_WIDTH} );
    var linearFitParameters = graph.getLinearFit();
    if ( linearFitParameters !== null ) {
      var bestFitLineBoundaryPoints = graph.getBoundaryPoints( linearFitParameters.slope, linearFitParameters.intercept );
      this.bestFitLine = new Line(
        modelViewTransform.modelToViewPosition( bestFitLineBoundaryPoints.point1 ),
        modelViewTransform.modelToViewPosition( bestFitLineBoundaryPoints.point2 ),
        {stroke: LSRConstants.BEST_FIT_LINE_COLOR, lineWidth: LINE_WIDTH} );
    }
    this.addChild( this.bestFitLine );

    this.myLineSquaredResidualsRectangles = new Node();
    this.addChild( this.myLineSquaredResidualsRectangles );

    this.bestFitLineSquaredResidualsRectangles = new Node();
    this.addChild( this.bestFitLineSquaredResidualsRectangles );

    this.myLineResidualsLines = new Node();
    this.addChild( this.myLineResidualsLines );

    this.bestFitLineResidualsLines = new Node();
    this.addChild( this.bestFitLineResidualsLines );

    model.showMyLineProperty.linkAttribute( this.myLine, 'visible' );
    model.showResidualsOfMyLineProperty.linkAttribute( this.myLineResidualsLines, 'visible' );
    model.showSquareResidualsOfMyLineProperty.linkAttribute( this.myLineSquaredResidualsRectangles, 'visible' );

    model.showBestFitLineProperty.linkAttribute( this.bestFitLine, 'visible' );
    model.showResidualsOfBestFitLineProperty.linkAttribute( this.bestFitLineResidualsLines, 'visible' );
    model.showSquareResidualsOfBestFitLineProperty.linkAttribute( this.bestFitLineSquaredResidualsRectangles, 'visible' );

    model.showMyLineProperty.link( function( visible ) {
      if ( visible === false ) {
        model.showResidualsOfMyLine = false;
        model.showSquareResidualsOfMyLine = false;
      }
    } );
    model.showBestFitLineProperty.link( function( visible ) {
      if ( visible === false ) {
        model.showResidualsOfBestFitLine = false;
        model.showSquareResidualsOfBestFitLine = false;
      }
    } );

    this.equationText = new Text( 'r =           ' ); /// 12 blank spaces for spacing
    var mutableEquationText = new Panel( this.equationText, { fill: LSRConstants.GRAPH_BACKGROUND_COLOR, cornerRadius: 2, resize: false } );
    mutableEquationText.bottom = graphNode.bottom - 10;
    mutableEquationText.right = graphNode.right - 10;
    this.addChild( mutableEquationText );

    Property.multilink( [ graph.angleProperty, graph.interceptProperty], function( angle, intercept ) {
      var slope = graph.slope( angle );
      var boundaryPoints = graph.getBoundaryPoints( slope, intercept );
      if ( boundaryPoints !== null ) {
        graphNode.myLine.setPoint1( modelViewTransform.modelToViewPosition( boundaryPoints.point1 ) );
        graphNode.myLine.setPoint2( modelViewTransform.modelToViewPosition( boundaryPoints.point2 ) );
      }
      else {
        graphNode.myLine.setPoint1( 0, 0 ); // set line in a corner
        graphNode.myLine.setPoint2( 0, 0 ); //
      }

      graphNode.updateMyLineResiduals();
      graphNode.updateMyLineSquaredResiduals();
    } );
  }

  return inherit( Node, GraphNode, {
    reset: function() {
    },

    update: function() {
      if ( this.graph.dataPointsOnGraph.length >= 1 ) {
        this.updateMyLineResiduals();
        this.updateMyLineSquaredResiduals();
      }
      if ( this.graph.dataPointsOnGraph.length >= 2 ) {
        this.updatePearsonCoefficient();
        this.updateBestFitLine();
        this.updateBestFitLineResiduals();
        this.updateBestFitLineSquaredResiduals();

      }
    },

    updatePearsonCoefficient: function() {
      var rText = Util.toFixed( this.graph.getPearsonCoefficientCorrelation(), 2 );
      this.equationText.text = StringUtils.format( pattern_0r_1value, 'r = ', rText );
    },

    updateMyLineResiduals: function() {
      var points = this.graph.getMyLineResidualsPoints();
      this.myLineResidualsLines.removeAllChildren();
      if ( points !== null ) {
        var self = this;
        points.forEach( function( point ) {
          var residualsLine = new Line(
            self.modelViewTransform.modelToViewPosition( point.point1 ),
            self.modelViewTransform.modelToViewPosition( point.point2 ),
            {stroke: LSRConstants.MY_LINE_RESIDUAL_COLOR, lineWidth: RESIDUAL_LINE_WIDTH} );
          self.myLineResidualsLines.addChild( residualsLine );
        } );
      }
    },

    updateBestFitLineResiduals: function() {
      this.bestFitLineResidualsLines.removeAllChildren();
      var points = this.graph.getBestFitLineResidualsPoints();
      if ( points !== null ) {
        var self = this;
        points.forEach( function( point ) {
          var residualsLine = new Line(
            self.modelViewTransform.modelToViewPosition( point.point1 ),
            self.modelViewTransform.modelToViewPosition( point.point2 ),
            {stroke: LSRConstants.BEST_FIT_LINE_RESIDUAL_COLOR, lineWidth: RESIDUAL_LINE_WIDTH} );
          self.bestFitLineResidualsLines.addChild( residualsLine );
        } );
      }
    },

    updateMyLineSquaredResiduals: function() {
      this.myLineSquaredResidualsRectangles.removeAllChildren();
      var rectangles = this.graph.getMyLineSquaredResidualsRectangles();
      if ( rectangles !== null ) {
        var self = this;
        rectangles.forEach( function( rectangle ) {
          var x1 = self.modelViewTransform.modelToViewX( rectangle.minX );
          var x2 = self.modelViewTransform.modelToViewX( rectangle.maxX );
          var y1 = self.modelViewTransform.modelToViewY( rectangle.minY );
          var y2 = self.modelViewTransform.modelToViewY( rectangle.maxY );

          // since the modelViewTransform might flip the axis, let's recalculate the min and max
          var minXBound = Math.min( x1, x2 );
          var maxXBound = Math.max( x1, x2 );
          var minYBound = Math.min( y1, y2 );
          var maxYBound = Math.max( y1, y2 );
          var bound = new Bounds2( minXBound, minYBound, maxXBound, maxYBound );
          var squaredResidualsRectangle = Rectangle.bounds( bound, { fill: LSRConstants.MY_LINE_SQUARED_RESIDUAL_COLOR, stroke: 'gray' } );
          self.myLineSquaredResidualsRectangles.addChild( squaredResidualsRectangle );
        } );
      }

    },

    updateBestFitLineSquaredResiduals: function() {
      this.bestFitLineSquaredResidualsRectangles.removeAllChildren();
      var rectangles = this.graph.getBestFitLineSquaredResidualsRectangles();
      if ( rectangles !== null ) {
        var self = this;
        rectangles.forEach( function( rectangle ) {
          var x1 = self.modelViewTransform.modelToViewX( rectangle.minX );
          var x2 = self.modelViewTransform.modelToViewX( rectangle.maxX );
          var y1 = self.modelViewTransform.modelToViewY( rectangle.minY );
          var y2 = self.modelViewTransform.modelToViewY( rectangle.maxY );

          // since the modelViewTransform might flip the axis, let's recalculate the min and max
          var minXBound = Math.min( x1, x2 );
          var maxXBound = Math.max( x1, x2 );
          var minYBound = Math.min( y1, y2 );
          var maxYBound = Math.max( y1, y2 );
          var bound = new Bounds2( minXBound, minYBound, maxXBound, maxYBound );

          var squaredResidualsRectangle = Rectangle.bounds( bound, { fill: LSRConstants.BEST_FIT_LINE_SQUARED_RESIDUAL_COLOR, stroke: 'gray' } );
          self.bestFitLineSquaredResidualsRectangles.addChild( squaredResidualsRectangle );
        } );
      }
    },
//    updateMyLineSquaredResiduals: function() {
//      var node = this.myLineSquaredResidualsRectangles;
//      var rectangles = this.graph.getMyLineSquaredResidualsRectangles();
//      var fillColor = this.myLineSquaredResidualsRectangles;
//      this.updateSquaredResiduals( node, rectangles, fillColor );
//    },
//
//    updateBestFitLineSquaredResiduals: function() {
//      var node = this.bestFitLineSquaredResidualsRectangles;
//      var rectangles = this.graph.getBestFitLineSquaredResidualsRectangles();
//      var fillColor = this.bestFitLineSquaredResidualsRectangles;
//      this.updateSquaredResiduals( node, rectangles, fillColor );
//    },
//
//    updateSquaredResiduals: function( node, rectangles, fillColor ) {
//      node.removeAllChildren();
//      var self = this;
//      if ( rectangles !== null ) {
//        rectangles.forEach( function( rectangle ) {
//          var x1 = self.modelViewTransform.modelToViewX( rectangle.minX );
//          var x2 = self.modelViewTransform.modelToViewX( rectangle.maxX );
//          var y1 = self.modelViewTransform.modelToViewY( rectangle.minY );
//          var y2 = self.modelViewTransform.modelToViewY( rectangle.maxY );
//
//          // since the modelViewTransform might flip the axis, let's recalculate the min and max
//          var minXBound = Math.min( x1, x2 );
//          var maxXBound = Math.max( x1, x2 );
//          var minYBound = Math.min( y1, y2 );
//          var maxYBound = Math.max( y1, y2 );
//          var bound = new Bounds2( minXBound, minYBound, maxXBound, maxYBound );
//
//          var squaredResidualsRectangle = Rectangle.bounds( bound, { fill: fillColor, stroke: 'gray' } );
//          node.addChild(squaredResidualsRectangle );
//        } );
//      }
//
//    },

    updateBestFitLine: function() {
      var linearFitParameters = this.graph.getLinearFit();
      if ( linearFitParameters !== null ) {
        var boundaryPoints = this.graph.getBoundaryPoints( linearFitParameters.slope, linearFitParameters.intercept );
        if ( boundaryPoints !== null ) {
          this.bestFitLine.setPoint1( this.modelViewTransform.modelToViewPosition( boundaryPoints.point1 ) );
          this.bestFitLine.setPoint2( this.modelViewTransform.modelToViewPosition( boundaryPoints.point2 ) );
        }
        else {
          this.bestFitLine.myLine.setPoint1( 0, 0 ); // set line in a corner
          this.bestFitLine.myLine.setPoint2( 0, 0 ); //
        }
      }
    }
  } )
    ;
} )
;