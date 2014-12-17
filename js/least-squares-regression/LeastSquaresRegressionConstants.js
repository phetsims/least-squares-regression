/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * Constants that are shared between the various portions of the Area Builder simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  // var Bounds2 = require( 'DOT/Bounds2' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  return {
    // Layout bounds used throughout the simulation for laying out the screens.
    PERIMETER_DARKEN_FACTOR: 0.6, // The amount that the perimeter colors are darkened from the main dataPoint color

    // Velocity at which animated elements move
    ANIMATION_VELOCITY: 2,

    // Various other constants
    BACKGROUND_COLOR: 'rgb( 236,255,245 )',
    GRAPH_BACKGROUND_COLOR: 'rgb( 255, 255, 255 )',

    LINE_WIDTH: 2,

    MY_LINE_COLOR: 'rgb( 0, 0, 255)',
    MY_LINE_RESIDUAL_COLOR: 'rgb( 110, 92, 231)',
    MY_LINE_SQUARED_RESIDUAL_COLOR: 'rgba( 154, 150, 255, 0.4)',
    MY_LINE_SUM_OF_SQUARES_COLOR: 'rgb( 154, 150, 255)',

    BEST_FIT_LINE_COLOR: 'rgb( 178, 21, 27)',
    BEST_FIT_LINE_RESIDUAL_COLOR: 'rgb( 178, 21, 27)',
    BEST_FIT_LINE_SQUARED_RESIDUAL_COLOR: 'rgba( 255, 52, 59, 0.4)',
    BEST_FIT_LINE_SUM_OF_SQUARES_COLOR: 'rgb( 255, 52, 59)',

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

    TEXT_FONT: new PhetFont( {size: 14} ),
    CHECK_BOX_TEXT_FONT: new PhetFont( {size: 12} ),
    MAJOR_TICK_FONT: new PhetFont( {size: 12} ),
    SUM_RESIDUALS_FONT: new PhetFont( {size: 12} ),
    TEXT_FONT_BOLD: new PhetFont( {size: 14, weight: 'bold'} ),

    CONTROL_PANEL_CORNER_RADIUS: 10,
    SMALL_PANEL_CORNER_RADIUS: 5,
    CONTROL_PANEL_BACKGROUND_COLOR: 'rgb(255, 245, 238)', //seashell

    // combo box
    ITEM_HIGHLIGHT_FILL: 'rgb(	236,255,245)'

  };
} );