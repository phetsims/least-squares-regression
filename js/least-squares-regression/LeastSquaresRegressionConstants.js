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
    BACKGROUND_COLOR: 'rgb( 225, 255, 255 )',

    GRAPH_BACKGROUND_COLOR: 'rgb( 255, 255, 255 )',
    MY_LINE_COLOR: 'rgba(0,0,200,1)',
    MY_LINE_RESIDUAL_COLOR: 'rgba(0,0,255,1)',
    MY_LINE_SQUARED_RESIDUAL_COLOR: 'rgba(0,0,255,0.5)',
    BEST_FIT_LINE_COLOR: 'rgba(200,0,0,1)',
    BEST_FIT_LINE_RESIDUAL_COLOR: 'rgba(255,0,0,1)',
    BEST_FIT_LINE_SQUARED_RESIDUAL_COLOR: 'rgba(255,0,0,0.5)',

    RESIDUAL_DARKEN_FACTOR: 0.6, // The amount that the perimeter colors are darkened from the main dataPoint color
    RESIDUALS_SQUARE_TRANSPARENCY_FACTOR: 0.6,

    DATA_POINT_RADIUS: 7,
    DATA_POINT_FILL: 'orange',
    DATA_POINT_STROKE: 'black',
    DATA_POINT_LINE_WIDTH: 0.5,

    TEXT_FONT: new PhetFont( {size: 12} ),
    TEXT_FONT_BOLD: new PhetFont( {size: 12, weight: 'bold'} ),
    CONTROL_PANEL_CORNER_RADIUS: 10,
    CONTROL_PANEL_BACKGROUND_COLOR: 'rgb(255,245,238)'  //seashell

  };
} );