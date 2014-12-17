/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * Constants that are used in the Least Squares Regression simulation.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  return {

    // Velocity at which animated dataPoints move
    ANIMATION_VELOCITY: 2, // in the view reference frame

    // background color for sim and graph
    BACKGROUND_COLOR: 'rgb( 236,255,245 )',
    GRAPH_BACKGROUND_COLOR: 'rgb( 255, 255, 255 )',

    LINE_WIDTH: 2,
    RESIDUAL_LINE_WIDTH: 2,

    // my Line color
    MY_LINE_COLOR: {
      BASE_COLOR: 'rgb( 0, 0, 255)',
      RESIDUAL_COLOR: 'rgb( 110, 92, 231)',
      SQUARED_RESIDUAL_COLOR: 'rgba( 154, 150, 255, 0.4)',
      SUM_OF_SQUARES_COLOR: 'rgb( 154, 150, 255)'
    },

    // best Fit Line Color
    BEST_FIT_LINE_COLOR: {
      BASE_COLOR: 'rgb( 255, 0 ,0)',
      RESIDUAL_COLOR: 'rgb( 178, 21, 27)',
      SQUARED_RESIDUAL_COLOR: 'rgba( 255, 52, 59, 0.4)',
      SUM_OF_SQUARES_COLOR: 'rgb( 255, 52, 59)'
    },

    // movable data points (and points in bucket)
    DYNAMIC_DATA_POINT_RADIUS: 7,
    DYNAMIC_DATA_POINT_FILL: 'orange',
    DYNAMIC_DATA_POINT_STROKE: 'black',
    DYNAMIC_DATA_POINT_LINE_WIDTH: 0.5,

    // static data points
    STATIC_DATA_POINT_RADIUS: 5,
    STATIC_DATA_POINT_FILL: 'orange',
    STATIC_DATA_POINT_STROKE: 'white',
    STATIC_DATA_POINT_LINE_WIDTH: 1,

    // gridlines and grid icon
    MAJOR_GRID_STROKE_COLOR: 'rgb(128,128,128)',
    MINOR_GRID_STROKE_COLOR: 'rgb(218,218,218)',

    // font sizes and weight
    TEXT_FONT: new PhetFont( {size: 14} ), // default font for text
    TEXT_FONT_BOLD: new PhetFont( {size: 14, weight: 'bold'} ), // default font for bold font
    PEARSON_COEFFICIENT_TEXT_FONT: new PhetFont( {size: 16, weight: 'bold'} ),
    CHECK_BOX_TEXT_FONT: new PhetFont( {size: 12} ),
    MAJOR_TICK_FONT: new PhetFont( {size: 12} ),
    SUM_RESIDUALS_FONT: new PhetFont( {size: 12} ),

    // panels
    CONTROL_PANEL_CORNER_RADIUS: 10,
    SMALL_PANEL_CORNER_RADIUS: 5,
    CONTROL_PANEL_BACKGROUND_COLOR: 'rgb(255, 245, 238)', //seashell

    // combo box
    ITEM_HIGHLIGHT_FILL: 'rgb(	236,255,245)'

  };
} );