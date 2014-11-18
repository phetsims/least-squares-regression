// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );

  // strings
// var customString = require( 'string!LEAST_SQUARES_REGRESSION/choice.custom' );
  var gasolinePriceVsYearString = require( 'string!LEAST_SQUARES_REGRESSION/choice.gasolinePriceVsYear' );
  var heightVsShoeString = require( 'string!LEAST_SQUARES_REGRESSION/choice.heightVsShoe' );
  var milesVsCostString = require( 'string!LEAST_SQUARES_REGRESSION/choice.milesVsCost' );

  /**
   *
   * @param name
   * @param graphTitle
   * @param yAxisTitle
   * @param xAxisTitle
   * @param yRange
   * @param xRange
   * @param dataXY
   * @constructor
   */
  function DataSet( name, graphTitle, yAxisTitle, xAxisTitle, yRange, xRange, dataXY ) {

    this.name = name;
    this.graphTitle = graphTitle;
    this.xAxisTitle = xAxisTitle;
    this.yAxisTitle = yAxisTitle;
    this.xRange = xRange;
    this.yRange = yRange;
    this.dataXY = dataXY;

  }

  inherit( Object, DataSet );

  DataSet.CUSTOM = new DataSet( 'Custom', 'Title', 'Y', 'X', new Range( 0, 20 ), new Range( 0, 20 ),
    [{x: 0.12, y: 0.61},
      {x: 0.56, y: 0.66}]
  );

  DataSet.FAKE_FAKE = new DataSet( 'fake Data', 'Y vs. X', 'Y', 'X', new Range( 0, 1 ), new Range( 0, 1 ),
    [
      {x: 0.12, y: 0.61},
      {x: 0.56, y: 0.66},
      {x: 0.88, y: 0.67},
      {x: 0.20, y: 0.90},
      {x: 0.98, y: 0.25},
      {x: 0.34, y: 0.38},
      {x: 0.56, y: 0.30}
    ]
  );

  DataSet.FAKE_FAKE2 = new DataSet( 'fake2 Data', 'Y vs. X', 'Y', 'X', new Range( 0, 0.5 ), new Range( 0, 0.25 ),
    [
      {x: 0.42, y: 0.11},
      {x: 0.16, y: 0.16},
      {x: 0.48, y: 0.17},
      {x: 0.20, y: 0.10},
      {x: 0.18, y: 0.15},
      {x: 0.34, y: 0.24},
      {x: 0.06, y: 0.20}
    ]
  );

  DataSet.FAKE_FAKE3 = new DataSet( 'fake3 Data', 'Y vs. X', 'Y', 'X', new Range( 0, 11 ), new Range( 0, 11 ),
    [
      {x: 1, y: 1},
      {x: 5, y: 5},
      {x: 8, y: 9}
    ]
  );

  DataSet.GASOLINE_YEAR = new DataSet( gasolinePriceVsYearString, 'Price of Gasoline vs. Year', 'Price of Gasoline', 'Year', new Range( 0, 2 ), new Range( 1975, 2005 ),
    [
      {x: 1976, y: 0.61},
      {x: 1977, y: 0.66},
      {x: 1978, y: 0.67},
      {x: 1979, y: 0.90},
      {x: 1980, y: 1.25},
      {x: 1981, y: 1.38},
      {x: 1982, y: 1.30},
      {x: 1983, y: 1.24},
      {x: 1984, y: 1.21},
      {x: 1985, y: 1.20},
      {x: 1986, y: 0.93},
      {x: 1987, y: 0.95},
      {x: 1988, y: 0.95},
      {x: 1989, y: 1.02},
      {x: 1990, y: 1.16},
      {x: 1991, y: 1.14},
      {x: 1992, y: 1.13},
      {x: 1993, y: 1.11},
      {x: 1994, y: 1.11},
      {x: 1995, y: 1.15},
      {x: 1996, y: 1.23},
      {x: 1997, y: 1.23},
      {x: 1998, y: 1.06},
      {x: 1999, y: 1.17},
      {x: 2000, y: 1.51},
      {x: 2001, y: 1.46},
      {x: 2002, y: 1.36},
      {x: 2003, y: 1.59},
      {x: 2004, y: 1.85}
    ]
  );

  DataSet.HEIGHT_SHOE = new DataSet( heightVsShoeString, 'Height vs. Shoe', 'Height', 'Shoe', new Range( 0, 10 ), new Range( 0, 10 ),
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

  DataSet.MILES_COST = new DataSet( milesVsCostString, 'Miles vs. Cost', 'Miles', 'Cost', new Range( 0, 15 ), new Range( 0, 10 ),
    [
      {x: 0.5, y: 0.4},
      {x: 2, y: 2},
      {x: 3, y: 5},
      {x: 4, y: 7},
      {x: 5, y: 6},
      {x: 6, y: 8},
      {x: 7, y: 9}
    ]
  );

  return DataSet;

} );

