// Copyright 2014-2024, University of Colorado Boulder

/**
 * View representation of a Graph. Responsible for the view of 'MyLine', 'BestFitLine'
 * and the residuals on the graph. The view of the dataPoints is handled in the main ScreenView
 *
 * @author Martin Veillette (Berea College)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Line, Node } from '../../../../scenery/js/imports.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';
import LeastSquaresRegressionConstants from '../LeastSquaresRegressionConstants.js';
import Graph from '../model/Graph.js';
import ResidualLineAndSquareNode from './ResidualLineAndSquareNode.js';

export default class GraphNode extends Node {
  private readonly myLine: Line;
  private readonly bestFitLine: Line;
  private readonly bestFitResiduals: Node[];

  public constructor( public readonly graph: Graph,
                      public readonly viewBounds: Bounds2,
                      public readonly modelViewTransform: ModelViewTransform2 ) {

    super();

    // Create 'MyLine'
    // First, get the two points formed by the intersection of the line and the boundary of the graph
    const myLineBoundaryPoints = graph.getBoundaryPoints( graph.slope( graph.angleProperty.value ), graph.interceptProperty.value );
    this.myLine = new Line(
      modelViewTransform.modelToViewPosition( myLineBoundaryPoints.point1 ),
      modelViewTransform.modelToViewPosition( myLineBoundaryPoints.point2 ),
      {
        stroke: LeastSquaresRegressionConstants.MY_LINE_COLOR.BASE_COLOR,
        lineWidth: LeastSquaresRegressionConstants.LINE_WIDTH
      } );

    // Create 'Best Fit Line'; initially set bestFitLine to zero length and then update it
    this.bestFitLine = new Line( 0, 0, 0, 0, {
      stroke: LeastSquaresRegressionConstants.BEST_FIT_LINE_COLOR.BASE_COLOR,
      lineWidth: LeastSquaresRegressionConstants.LINE_WIDTH
    } );

    if ( graph.isLinearFitDefined() ) {
      const linearFitParameters = graph.getLinearFit();
      const bestFitLineBoundaryPoints = graph.getBoundaryPoints( linearFitParameters.slope, linearFitParameters.intercept );
      this.bestFitLine = new Line(
        modelViewTransform.modelToViewPosition( bestFitLineBoundaryPoints.point1 ),
        modelViewTransform.modelToViewPosition( bestFitLineBoundaryPoints.point2 ),
        {
          stroke: LeastSquaresRegressionConstants.BEST_FIT_LINE_COLOR.BASE_COLOR,
          lineWidth: LeastSquaresRegressionConstants.LINE_WIDTH
        } );
    }

    /**
     * Update 'My Line'
     */
    const updateMyLine = ( slope: number, intercept: number ) => {
      const boundaryPoints = graph.getBoundaryPoints( slope, intercept );
      this.myLine.setPoint1( modelViewTransform.modelToViewPosition( boundaryPoints.point1 ) );
      this.myLine.setPoint2( modelViewTransform.modelToViewPosition( boundaryPoints.point2 ) );
      this.myLine.clipArea = Shape.bounds( this.viewBounds );
    };

    // Update 'MyLine' and update 'MyLine' Residuals upon of change of angle (a proxy for the slope), or intercept
    // No need to unlink, listener is present for the lifetime of the sim
    Multilink.multilink( [ graph.angleProperty, graph.interceptProperty ], ( angle, intercept ) => {
      const slope = graph.slope( angle );
      updateMyLine( slope, intercept );
      graph.updateMyLineResiduals();
    } );

    // we will add all the residuals in a separate node
    const residualsLayer = new Node();

    // we need to track the best fit residuals in a separate array so that we can toggle their visibility when
    // the best fit is undefined
    this.bestFitResiduals = [];

    // Handle the comings and goings of 'My Line' Residuals. Recall that graph.myLineResiduals is an
    // observable array of Property.<Residual>
    graph.myLineResiduals.addItemAddedListener( addedResidualProperty => {

      // Create and add the view representation for this residual.
      const residualNode = ResidualLineAndSquareNode.pool.create(
        addedResidualProperty,
        LeastSquaresRegressionConstants.MY_LINE_COLOR,
        this.viewBounds,
        modelViewTransform,
        graph.myLineResidualsVisibleProperty,
        graph.myLineSquaredResidualsVisibleProperty );
      residualsLayer.addChild( residualNode );

      // Add the removal listener for if and when this residual is removed from the model.
      graph.myLineResiduals.addItemRemovedListener( function removalListener( removedResidualProperty ) {
        if ( removedResidualProperty === addedResidualProperty ) {
          residualNode.freeToPool();
          residualsLayer.removeChild( residualNode );
          graph.myLineResiduals.removeItemRemovedListener( removalListener );
        }
      } );
    } );

    // Handle the comings and goings of Best Fit Line Residuals. Recall that graph.bestFitResiduals is an
    // observable array of Property.<Residual>
    graph.bestFitLineResiduals.addItemAddedListener( addedResidualProperty => {

      // Create and add the view representation for this residual.
      const residualNode = ResidualLineAndSquareNode.pool.create(
        addedResidualProperty,
        LeastSquaresRegressionConstants.BEST_FIT_LINE_COLOR,
        this.viewBounds,
        modelViewTransform,
        graph.bestFitLineResidualsVisibleProperty,
        graph.bestFitLineSquaredResidualsVisibleProperty );
      residualsLayer.addChild( residualNode );

      this.bestFitResiduals.push( residualNode );

      // Add the removal listener for if and when this residual is removed from the model.
      graph.bestFitLineResiduals.addItemRemovedListener( removedResidualProperty => {
        if ( removedResidualProperty === addedResidualProperty ) {

          // remove the residualNode from this.bestFitResiduals
          const index = this.bestFitResiduals.indexOf( residualNode );
          if ( index > -1 ) {
            this.bestFitResiduals.splice( index, 1 );
          }

          residualNode.freeToPool();
          residualsLayer.removeChild( residualNode );
        }
      } );
    } );

    // Hide or show the visibility of 'MyLine' and 'BestFitLine', both listeners are present for the lifetime of the sim
    graph.myLineVisibleProperty.linkAttribute( this.myLine, 'visible' );
    graph.bestFitLineVisibleProperty.linkAttribute( this.bestFitLine, 'visible' );

    // Add the residualsLayer
    this.addChild( residualsLayer );

    // Add the two lines to this Node
    this.addChild( this.myLine );
    this.addChild( this.bestFitLine );
  }

  /**
   * Resets values to their original state
   */
  public reset(): void {
    this.updateBestFitLine();
  }

  public update(): void {
    this.updateBestFitLine();

    // make sure that the best fit residuals are only visible when the best fit line is defined
    this.updateBestFitResidualsVisible();
  }

  /**
   * Update Best Fit Line
   */
  private updateBestFitLine(): void {
    if ( this.graph.isLinearFitDefined() ) {
      const linearFitParameters = this.graph.getLinearFit();
      const boundaryPoints = this.graph.getBoundaryPoints( linearFitParameters.slope, linearFitParameters.intercept );
      this.bestFitLine.setPoint1( this.modelViewTransform.modelToViewPosition( boundaryPoints.point1 ) );
      this.bestFitLine.setPoint2( this.modelViewTransform.modelToViewPosition( boundaryPoints.point2 ) );
      this.bestFitLine.clipArea = Shape.bounds( this.viewBounds );
    }
    else {
      this.bestFitLine.setPoint1( 0, 0 ); // set line in the upper left corner
      this.bestFitLine.setPoint2( 0, 0 ); // of length zero
    }
  }

  /**
   * Make sure that the best fit residuals and squares are only visible if the linear fit is defined.
   * This visibility is separate from the visibility handled by the control panel
   */
  public updateBestFitResidualsVisible(): void {
    for ( let i = 0; i < this.bestFitResiduals.length; i++ ) {
      this.bestFitResiduals[ i ].visible = this.graph.isLinearFitDefined();
    }
  }
}

leastSquaresRegression.register( 'GraphNode', GraphNode );