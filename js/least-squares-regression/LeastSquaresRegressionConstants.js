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


    MY_LINE_COLOR: 'rgb(110, 92, 231)',
    MY_LINE_RESIDUAL_COLOR: 'rgba(0,0,255,1)',
    MY_LINE_SQUARED_RESIDUAL_COLOR: 'rgba(154, 150, 255, 0.6)',


    BEST_FIT_LINE_COLOR: 'rgb(178, 21, 27)',
    BEST_FIT_LINE_RESIDUAL_COLOR: 'rgba(255,0,0,1)',
    BEST_FIT_LINE_SQUARED_RESIDUAL_COLOR: 'rgba(255, 52, 59, 0.6)',

    RESIDUAL_DARKEN_FACTOR: 0.6, // The amount that the perimeter colors are darkened from the main dataPoint color
    RESIDUALS_SQUARE_TRANSPARENCY_FACTOR: 0.6,

    DYNAMIC_DATA_POINT_RADIUS: 7,
    DYNAMIC_DATA_POINT_FILL: 'orange',
    DYNAMIC_DATA_POINT_STROKE: 'black',
    DYNAMIC_DATA_POINT_LINE_WIDTH: 0.5,

    STATIC_DATA_POINT_RADIUS: 5,
    STATIC_DATA_POINT_FILL: 'orange',
    STATIC_DATA_POINT_STROKE: 'white',
    STATIC_DATA_POINT_LINE_WIDTH: 1,

    TEXT_FONT: new PhetFont( {size: 14} ),
    TEXT_FONT_BOLD: new PhetFont( {size: 14, weight: 'bold'} ),
    CONTROL_PANEL_CORNER_RADIUS: 10,
    CONTROL_PANEL_BACKGROUND_COLOR: 'rgb(255,245,238)'  //seashell

  };
} );