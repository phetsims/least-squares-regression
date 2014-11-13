/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * Type that defines a residual.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  function Residual( dataPoint, slope, intercept ) {

    this.dataPoint = dataPoint;

    var yValue = slope * dataPoint.position.x + intercept;
    var verticalDisplacement = dataPoint.position.y - yValue;

    this.point1 = new Vector2( dataPoint.position.x, dataPoint.position.y );
    this.point2 = new Vector2( dataPoint.position.x, yValue );
    this.isSquaredResidualToTheLeft = (slope * verticalDisplacement > 0);

  }

  return inherit( Object, Residual );
} );