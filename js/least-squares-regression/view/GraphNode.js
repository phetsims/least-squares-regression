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
  // var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResidualLineAndSquareNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/ResidualLineAndSquareNode' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // string
  var pattern_0r_1value = "{0} {1}";

  // constants

  var LINE_WIDTH = 2;

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
    //  this.graphBoundsNode = Rectangle.bounds( this.viewBounds, {fill: LSRConstants.GRAPH_BACKGROUND_COLOR, stroke: 'gray'} );
    //  this.addChild( this.graphBoundsNode );

    var myLineBoundaryPoints = graph.getBoundaryPoints( graph.slope( graph.angle ), graph.intercept );
    this.myLine = new Line(
      modelViewTransform.modelToViewPosition( myLineBoundaryPoints.point1 ),
      modelViewTransform.modelToViewPosition( myLineBoundaryPoints.point2 ),
      {stroke: LSRConstants.MY_LINE_COLOR, lineWidth: LINE_WIDTH} );
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

    var myLineResidualsLayer = new Node();
    var bestFitLineResidualsLayer = new Node();
    this.addChild( myLineResidualsLayer );
    this.addChild( bestFitLineResidualsLayer );

    model.graph.myLineVisibleProperty.linkAttribute( this.myLine, 'visible' );
    model.graph.bestFitLineVisibleProperty.linkAttribute( this.bestFitLine, 'visible' );



    this.equationText = new Text( 'r =           ' ); /// 12 blank spaces for spacing
    var mutableEquationText = new Panel( this.equationText, {fill: LSRConstants.GRAPH_BACKGROUND_COLOR, cornerRadius: 2, resize: false} );
    mutableEquationText.top = this.viewBounds.minY + 10;
    mutableEquationText.right = this.viewBounds.maxX - 10;
    this.addChild( mutableEquationText );

    Property.multilink( [graph.angleProperty, graph.interceptProperty], function( angle, intercept ) {
      var slope = graph.slope( angle );
      var boundaryPoints = graph.getBoundaryPoints( slope, intercept );
      graphNode.myLine.setPoint1( modelViewTransform.modelToViewPosition( boundaryPoints.point1 ) );
      graphNode.myLine.setPoint2( modelViewTransform.modelToViewPosition( boundaryPoints.point2 ) );
      graphNode.myLine.clipArea = Shape.bounds( graphNode.viewBounds );
      graph.updateMyLineResiduals();
    } );

    // Handle the comings and goings of  dataPoints.
    model.graph.myLineResiduals.addItemAddedListener( function( addedResidual ) {

      // Create and add the view representation for this dataPoint.
      var residualNode = new ResidualLineAndSquareNode(
        addedResidual,
        LSRConstants.MY_LINE_COLOR,
        graphNode.viewBounds,
        modelViewTransform,
        graph.myLineResidualsVisibleProperty,
        graph.myLineSquaredResidualsVisibleProperty );
      myLineResidualsLayer.addChild( residualNode );

      // Add the removal listener for if and when this dataPoint is removed from the model.
      model.graph.myLineResiduals.addItemRemovedListener( function removalListener( removedResidual ) {
        if ( removedResidual === addedResidual ) {
          myLineResidualsLayer.removeChild( residualNode );
          model.graph.myLineResiduals.removeItemRemovedListener( removalListener );
        }
      } );
    } );

    // Handle the comings and goings of  dataPoints.
    model.graph.bestFitLineResiduals.addItemAddedListener( function( addedResidual ) {

      // Create and add the view representation for this dataPoint.
      var residualNode = new ResidualLineAndSquareNode(
        addedResidual,
        LSRConstants.BEST_FIT_LINE_COLOR,
        graphNode.viewBounds,
        modelViewTransform,
        graph.bestFitLineResidualsVisibleProperty,
        graph.bestFitLineSquaredResidualsVisibleProperty );
      bestFitLineResidualsLayer.addChild( residualNode );

      // Add the removal listener for if and when this dataPoint is removed from the model.
      model.graph.bestFitLineResiduals.addItemRemovedListener( function removalListener( removedResidual ) {
        if ( removedResidual === addedResidual ) {
          bestFitLineResidualsLayer.removeChild( residualNode );
          model.graph.bestFitLineResiduals.removeItemRemovedListener( removalListener );
        }
      } );
    } );

  }

  return inherit( Node, GraphNode, {
    reset: function() {
      this.updatePearsonCoefficient();
      this.updateBestFitLine();
    },

    update: function() {
      this.updatePearsonCoefficient();
      this.updateBestFitLine();
    },

    updatePearsonCoefficient: function() {
      var rText;
      if ( this.graph.dataPointsOnGraph.length >= 2 ) {
        rText = Util.toFixed( this.graph.getPearsonCoefficientCorrelation(), 2 );
      }
      else {
        rText = '   ';
      }
      this.equationText.text = StringUtils.format( pattern_0r_1value, 'r = ', rText );
    },

    updateBestFitLine: function() {
      var linearFitParameters = this.graph.getLinearFit();
      if ( linearFitParameters !== null ) {
        var boundaryPoints = this.graph.getBoundaryPoints( linearFitParameters.slope, linearFitParameters.intercept );
        this.bestFitLine.setPoint1( this.modelViewTransform.modelToViewPosition( boundaryPoints.point1 ) );
        this.bestFitLine.setPoint2( this.modelViewTransform.modelToViewPosition( boundaryPoints.point2 ) );
        this.bestFitLine.clipArea = Shape.bounds( this.viewBounds );
      }
      else {
        this.bestFitLine.setPoint1( 0, 0 ); // set line in a corner
        this.bestFitLine.setPoint2( 0, 0 ); //
      }
    }

  } );
} )
;