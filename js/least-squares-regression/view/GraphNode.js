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
//  var Bounds2 = require( 'DOT/Bounds2' );

  var inherit = require( 'PHET_CORE/inherit' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Property = require( 'AXON/Property' );
  var ResidualLineAndSquareNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/ResidualLineAndSquareNode' );
  var Shape = require( 'KITE/Shape' );

  /**
   *
   * @param {Graph} graph
   * @param {Bounds2} viewBounds
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function GraphNode( graph, viewBounds, modelViewTransform ) {
    var graphNode = this;

    this.graph = graph;
    this.viewBounds = viewBounds;
    this.modelViewTransform = modelViewTransform;

    Node.call( this );

    // get the two points form by the intersection of the line and the boundary of the graph
    var myLineBoundaryPoints = graph.getBoundaryPoints( graph.slope( graph.angle ), graph.intercept );


    this.myLine = new Line(
      modelViewTransform.modelToViewPosition( myLineBoundaryPoints.point1 ),
      modelViewTransform.modelToViewPosition( myLineBoundaryPoints.point2 ),
      {stroke: LSRConstants.MY_LINE_COLOR.BASE_COLOR, lineWidth: LSRConstants.LINE_WIDTH} );


    // set bestFitLine to zero length and then update it
    this.bestFitLine = new Line( 0, 0, 0, 0, {stroke: LSRConstants.BEST_FIT_LINE_COLOR.BASE_COLOR, lineWidth: LSRConstants.LINE_WIDTH} );
    var linearFitParameters = graph.getLinearFit();
    if ( linearFitParameters !== null ) {
      var bestFitLineBoundaryPoints = graph.getBoundaryPoints( linearFitParameters.slope, linearFitParameters.intercept );
      this.bestFitLine = new Line(
        modelViewTransform.modelToViewPosition( bestFitLineBoundaryPoints.point1 ),
        modelViewTransform.modelToViewPosition( bestFitLineBoundaryPoints.point2 ),
        {stroke: LSRConstants.BEST_FIT_LINE_COLOR.BASE_COLOR, lineWidth: LSRConstants.LINE_WIDTH} );
    }

    // set the residuals  on a separate layer in order to toggle visibility
    // TODO: check if it is still necessary
    var myLineResidualsLayer = new Node();
    var bestFitLineResidualsLayer = new Node();

    Property.multilink( [graph.angleProperty, graph.interceptProperty], function( angle, intercept ) {
      var slope = graph.slope( angle );
      var boundaryPoints = graph.getBoundaryPoints( slope, intercept );
      graphNode.myLine.setPoint1( modelViewTransform.modelToViewPosition( boundaryPoints.point1 ) );
      graphNode.myLine.setPoint2( modelViewTransform.modelToViewPosition( boundaryPoints.point2 ) );
      graphNode.myLine.clipArea = Shape.bounds( graphNode.viewBounds );
      graph.updateMyLineResiduals();
    } );

    // Handle the comings and goings of  dataPoints.
    graph.myLineResiduals.addItemAddedListener( function( addedResidual ) {

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
      graph.myLineResiduals.addItemRemovedListener( function removalListener( removedResidual ) {
        if ( removedResidual === addedResidual ) {
          myLineResidualsLayer.removeChild( residualNode );
          graph.myLineResiduals.removeItemRemovedListener( removalListener );
        }
      } );
    } );

    // Handle the comings and goings of  dataPoints.
    graph.bestFitLineResiduals.addItemAddedListener( function( addedResidual ) {

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
      graph.bestFitLineResiduals.addItemRemovedListener( function removalListener( removedResidual ) {
        if ( removedResidual === addedResidual ) {
          bestFitLineResidualsLayer.removeChild( residualNode );
          graph.bestFitLineResiduals.removeItemRemovedListener( removalListener );
        }
      } );
    } );

    graph.myLineVisibleProperty.linkAttribute( this.myLine, 'visible' );
    graph.bestFitLineVisibleProperty.linkAttribute( this.bestFitLine, 'visible' );

    this.addChild( this.myLine );
    this.addChild( this.bestFitLine );
    this.addChild( myLineResidualsLayer );
    this.addChild( bestFitLineResidualsLayer );

  }

  return inherit( Node, GraphNode, {
    reset: function() {
      this.updateBestFitLine();
    },

    update: function() {
      this.updateBestFitLine();
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
        this.bestFitLine.setPoint1( 0, 0 ); // set line in the upper left corner
        this.bestFitLine.setPoint2( 0, 0 ); // of length zero
      }
    }

  } );
} )
;