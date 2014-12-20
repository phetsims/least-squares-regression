// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery Node that represents a barometer chart of the sum of square residuals .
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var sumString = require( 'string!LEAST_SQUARES_REGRESSION/sum' );

  // constants
  var ARROW_LENGTH = 120;
  var ARROW_HEAD_WIDTH = 4;
  var ARROW_HEAD_HEIGHT = 6;
  var RECTANGLE_BAROMETER_HEIGHT = 10;
  var LINE_WIDTH = 1;
  var LINE_COLOR = 'black';
  var FONT = LSRConstants.SUM_RESIDUALS_FONT;

  /**
   * @param {Graph} graph - model of a graph
   * @param {Array.<DataPoint>} dataPoints - an array of DataPoint
   * @param {Function} getSumOfSquaredResiduals
   * @param {Color} fillColor
   * @param {Property.<boolean>} visibleProperty
   * @constructor
   */
  function SumOfSquaredResidualsChart( graph, dataPoints, getSumOfSquaredResiduals, fillColor, visibleProperty ) {

    Node.call( this );

    // the barometer chart is on its side
    var width = getSumOfSquaredResiduals();

    var rectangleBarometer = new Rectangle( 0, 0, width, RECTANGLE_BAROMETER_HEIGHT, {
      fill: fillColor,
      bottom: -LINE_WIDTH,
      left: LINE_WIDTH / 2
    } );

    // create the chart
    var horizontalArrow = new ArrowNode( 0, 0, ARROW_LENGTH, 0, {tailWidth: LINE_WIDTH, headWidth: ARROW_HEAD_WIDTH, headHeight: ARROW_HEAD_HEIGHT} );
    var verticalLine = new Line( 0, 0, 0, -2 * RECTANGLE_BAROMETER_HEIGHT, {lineWidth: LINE_WIDTH, stroke: LINE_COLOR} );

    // text for the chart
    var label = new Text( sumString, {font: FONT, centerX: horizontalArrow.centerX, top: horizontalArrow.bottom + 5} );
    var zeroLabel = new Text( '0', {font: FONT, centerX: horizontalArrow.left, top: horizontalArrow.bottom + 5} );

    // the barometer width is adjustable
    // the square of the residuals vary if the position of the point change, points are added/subtracted to the graph and if the line change position
    Property.multilink( [graph.angleProperty, graph.interceptProperty], function( angle, intercept ) {
      updateWidth();
    } );

    // Handle the comings and goings of  dataPoints.
    dataPoints.addItemAddedListener( function( addedDataPoint ) {
      addedDataPoint.positionProperty.link( function() {
        updateWidth();
      } );
    } );

    // we want to map x=0 to infinity to y=0 to 1
    // this (particular) definition of hyperbolic tan function will work well for large positive x values
    function tanh( x ) {
      return (1 - Math.exp( -2 * x )) / (1 + Math.exp( -2 * x ));
    }

    function updateWidth() {
      // the width of the barometer is a non-linear. we use the tanh function to map an infinite range to a finite range
      // Note that tanh(0.5)=0.46. i.e  approximately 1/2;
      // We want that a sum of squared residuals of 1/8 the area of the visible graph yields a width that reaches
      // half the maximum value hence the value 4=8*1/2 .
      rectangleBarometer.rectWidth = ARROW_LENGTH * tanh( 4 * getSumOfSquaredResiduals() );
    }

    // controls the visibility of this node
    visibleProperty.linkAttribute( this, 'visible' );

    this.addChild( verticalLine );
    this.addChild( horizontalArrow );
    this.addChild( rectangleBarometer );
    this.addChild( zeroLabel );
    this.addChild( label );

  }

  return inherit( Node, SumOfSquaredResidualsChart );
} );