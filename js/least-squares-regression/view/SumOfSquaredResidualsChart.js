// Copyright 2014-2017, University of Colorado Boulder

/**
 * A Scenery Node that represents a barometer chart of the sum of square residuals .
 *
 * @author Martin Veillette (Berea College)
 */

define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const leastSquaresRegression = require( 'LEAST_SQUARES_REGRESSION/leastSquaresRegression' );
  const LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const sumString = require( 'string!LEAST_SQUARES_REGRESSION/sum' );

  // constants
  const ARROW_LENGTH = 175;
  const ARROW_HEAD_WIDTH = 4;
  const ARROW_HEAD_HEIGHT = 6;
  const RECTANGLE_BAROMETER_HEIGHT = 10;
  const LINE_WIDTH = 1;
  const LINE_COLOR = 'black';
  const FONT = LeastSquaresRegressionConstants.SUM_RESIDUALS_FONT;

  /**
   * @param {Graph} graph - model of a graph
   * @param {Function} getSumOfSquaredResiduals
   * @param {Emitter} dataPointsAddedEmitter
   * @param {Color} fillColor
   * @param {Property.<boolean>} visibleProperty
   * @param {Object} [Options]
   * @constructor
   */
  function SumOfSquaredResidualsChart( graph, getSumOfSquaredResiduals, dataPointsAddedEmitter, fillColor, visibleProperty, options ) {

    options = _.extend( {
      maxLabelWidth: 150
    }, options );

    Node.call( this, options );

    // The barometer chart is on its side, set width to 1 , will update it momentarily
    const rectangleBarometer = new Rectangle( 0, 0, 1, RECTANGLE_BAROMETER_HEIGHT, {
      fill: fillColor,
      bottom: -LINE_WIDTH,
      left: LINE_WIDTH / 2
    } );

    // Create the chart
    const horizontalArrow = new ArrowNode( 0, 0, ARROW_LENGTH, 0, {
      tailWidth: LINE_WIDTH,
      headWidth: ARROW_HEAD_WIDTH,
      headHeight: ARROW_HEAD_HEIGHT
    } );
    const verticalLine = new Line( 0, 0, 0, -2 * RECTANGLE_BAROMETER_HEIGHT, {
      lineWidth: LINE_WIDTH,
      stroke: LINE_COLOR
    } );

    // Text for the chart
    const label = new Text( sumString, {
      font: FONT,
      centerX: horizontalArrow.centerX,
      top: horizontalArrow.bottom + 5,
      maxWidth: options.maxLabelWidth
    } );
    const zeroLabel = new Text( '0', { font: FONT, centerX: horizontalArrow.left, top: horizontalArrow.bottom + 5 } );

    /**
     * For an input value ranging from 0 to infinity, the tanh function will return a value ranging between 0 and 1
     * @param {number} x
     * @returns {number}
     */
    function tanh( x ) {
      // this (particular) definition of hyperbolic tan function will work well for large positive x values
      return (1 - Math.exp( -2 * x )) / (1 + Math.exp( -2 * x ));
    }

    /**
     * Update the width of the rectangular Barometer
     */
    function updateWidth() {
      // the width of the barometer is a non-linear. we use the tanh function to map an infinite range to a finite range
      // Note that tanh(0.5)=0.46. i.e  approximately 1/2;
      // We want that a sum of squared residuals of 1/8 the area of the visible graph yields a width that reaches
      // half the maximum value hence the value 4=8*1/2 .
      rectangleBarometer.rectWidth = ARROW_LENGTH * tanh( 4 * getSumOfSquaredResiduals() );
    }

    // The barometer width is adjustable
    // the square of the residuals vary if the position of the point change, points are added/subtracted to the graph and if the line change position
    Property.multilink( [ graph.angleProperty, graph.interceptProperty ], function( angle, intercept ) {
      updateWidth();
    } );

    // Trigger an update after all the points have been added in bulk to the model
    dataPointsAddedEmitter.addListener( updateWidth );

    // Controls the visibility of this node
    // no need to unlink since the chart is present for the lifetime of the sim
    visibleProperty.linkAttribute( this, 'visible' );

    // Add all the nodes
    this.addChild( rectangleBarometer );
    this.addChild( verticalLine );
    this.addChild( horizontalArrow );
    this.addChild( zeroLabel );
    this.addChild( label );

    this.updateWidth = updateWidth;
  }

  leastSquaresRegression.register( 'SumOfSquaredResidualsChart', SumOfSquaredResidualsChart );

  return inherit( Node, SumOfSquaredResidualsChart, {
    reset: function() {
      this.updateWidth();
    }
  } );
} );