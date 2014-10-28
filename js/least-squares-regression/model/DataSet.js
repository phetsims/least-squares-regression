// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  //var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );

  // strings
//  var customString = require( 'string!LEAST_SQUARES_REGRESSION/choice.custom' );
  var heightVsShoeString = require( 'string!LEAST_SQUARES_REGRESSION/choice.heightVsShoe' );
  var milesVsCostString = require( 'string!LEAST_SQUARES_REGRESSION/choice.milesVsCost' );

  /**
   *
   * @param name
   * @param graphTitle
   * @param xRange
   * @param yRange
   * @param dataXY
   * @constructor
   */
  function DataSet( name, graphTitle, xRange, yRange, dataXY ) {

    this.name = name;
    this.graphTitle = graphTitle;
    this.xRange = xRange;
    this.yRange = yRange;
    this.dataXY = dataXY;
  }

  inherit( Object, DataSet );

  // 'real world' immutable solutions

  DataSet.HEIGHT_SHOE = new DataSet( heightVsShoeString, 'Height vs. Shoe', new Range( 0, 20 ), new Range( 0, 20 ),
    [
      {x: 1, y: 1},
      {x: 2, y: 2},
      {x: 3, y: 5},
      {x: 4, y: 7},
      {x: 5, y: 6},
      {x: 6, y: 8},
      {x: 7, y: 9}
    ]
  );

  DataSet.MILES_COST = new DataSet( milesVsCostString, 'Miles vs. Cost', new Range( 0, 20 ), new Range( 0, 20 ),
    [
      {x: 1, y: 1},
      {x: 2, y: 2},
      {x: 3, y: 5},
      {x: 4, y: 7},
      {x: 5, y: 6},
      {x: 6, y: 8},
      {x: 7, y: 9}
    ]
  );

  return DataSet;
} )
;
