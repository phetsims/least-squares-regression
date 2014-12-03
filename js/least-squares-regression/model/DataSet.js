// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model that defines data sets
 *
 * @author Martin Veillette
 */

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
   * @param {string} name
   * @param {string} graphTitle
   * @param {string} yAxisTitle
   * @param {string} xAxisTitle
   * @param {Range} yRange
   * @param {Range} xRange
   * @param {Array} dataXY, array of object of the form {x: x_1, y: y_1}
   * @constructor
   */
  function DataSet( name, graphTitle, yAxisTitle, xAxisTitle, yRange, xRange, dataXY ) {

    this.name = name; // appears in the combo box
    this.graphTitle = graphTitle;
    this.xAxisTitle = xAxisTitle;
    this.yAxisTitle = yAxisTitle;
    this.xRange = xRange;
    this.yRange = yRange;
    this.dataXY = dataXY;

  }

  inherit( Object, DataSet );

  DataSet.CUSTOM = new DataSet( 'Custom', 'Title', 'Y', 'X', new Range( 0, 20 ), new Range( 0, 20 ),
    []
    //[{x: 0.12, y: 0.61},
    //  {x: 0.56, y: 0.66}]
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

  DataSet.FAKE_FAKE2 = new DataSet( 'fake2 Data', 'Y vs. X', 'Y', 'X', new Range( 0, 0.25 ), new Range( 0, 0.55 ),
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

  DataSet.YEAR_DAY = new DataSet( 'Length of Day vs Length of Year', 'Day vs. Year', 'Day', 'Year', new Range( 0, 2 ), new Range( 0, 170 ),
    [
//      {x: 0.23, y: 58.7}, //mercury
//      {x: 0.61, y: 243}, //venus
      {x: 1, y: 1}, // Earth
      {x: 1.87, y: 1.05}, // mars
      {x: 11.8, y: 0.413}, //jupiter
      {x: 29.7, y: 0.444}, // saturn
      {x: 84.3, y: 0.7}, //  uranus
      {x: 165, y: 0.669}, // neptune
      //    {x: 247, y: 6.38} // pluto
    ]
  );

  DataSet.FAKE_FAKE3 = new DataSet( 'Lots Of Data', 'Y vs. X', 'Y', 'X', new Range( 0, 1 ), new Range( 0, 1 ),
    [
      // for testing purpose
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()},
      {x: Math.random(), y: Math.random()}
    ]
  );

  DataSet.PRESSURE_PULSE = new DataSet( 'Pressure Vs. Pulse', 'Presssure vs. Pulse', 'Blood Pressure', 'Pulse', new Range( 0, 150 ), new Range( 0, 150 ),
    [
      {x: 42, y: 92},
      {x: 60, y: 120},
      {x: 72, y: 112},
      {x: 80, y: 92},
      {x: 90, y: 87},
      {x: 95, y: 76},
      {x: 72, y: 112},
      {x: 80, y: 92},
      {x: 90, y: 87},
      {x: 95, y: 76},
      {x: 100, y: 87}
    ]
  );

  DataSet.LATITUDE_TEMPERATURE = new DataSet( 'Latitude Vs. Temperature', 'Latitude vs. Temperature', 'Temperature', 'Latitude', new Range( 0, 70 ), new Range( 0, 60 ),
    [{x: 31.2, y: 44},
      {x: 32.9, y: 38},
      {x: 33.6, y: 35},
      {x: 35.4, y: 31},
      {x: 34.3, y: 47},
      {x: 38.4, y: 42},
      {x: 40.7, y: 15},
      {x: 41.7, y: 22},
      {x: 40.5, y: 26},
      {x: 39.7, y: 30},
      {x: 31, y: 45},
      {x: 25, y: 65},
      {x: 26.3, y: 58},
      {x: 33.9, y: 37},
      {x: 43.7, y: 22},
      {x: 42.3, y: 19},
      {x: 39.8, y: 21},
      {x: 41.8, y: 11},
      {x: 38.1, y: 22},
      {x: 39, y: 27},
      {x: 30.8, y: 45},
      {x: 44.2, y: 12},
      {x: 39.7, y: 25},
      {x: 42.7, y: 23},
      {x: 43.1, y: 21},
      {x: 45.9, y: 2},
      {x: 39.3, y: 24},
      {x: 47.1, y: 8},
      {x: 41.9, y: 13},
      {x: 43.5, y: 11},
      {x: 39.8, y: 27},
      {x: 35.1, y: 24},
      {x: 42.6, y: 14},
      {x: 40.8, y: 27},
      {x: 35.9, y: 34},
      {x: 36.4, y: 31},
      {x: 47.1, y: 0},
      {x: 39.2, y: 26},
      {x: 42.3, y: 21},
      {x: 35.9, y: 28},
      {x: 45.6, y: 33},
      {x: 40.9, y: 24},
      {x: 40.9, y: 24},
      {x: 33.3, y: 38},
      {x: 36.7, y: 31},
      {x: 35.6, y: 24},
      {x: 29.4, y: 49},
      {x: 30.1, y: 44},
      {x: 41.1, y: 18},
      {x: 45, y: 7},
      {x: 37, y: 32},
      {x: 48.1, y: 33},
      {x: 48.1, y: 19},
      {x: 43.4, y: 9},
      {x: 43.3, y: 13},
      {x: 41.2, y: 14}
      //

    ] );

  DataSet.GPA_HOURS = new DataSet( 'GPA vs. Study Hours', 'GPA vs. Hours', 'GPA', 'Hours', new Range( 0, 5 ), new Range( 0, 6 ),
    [
      {x: 0, y: 0},
      {x: 1, y: 0.25},
      {x: 2, y: 0.5},
      {x: 3, y: 1.0},
      {x: 4, y: 2.0},
      {x: 5, y: 4.0}
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

  DataSet.HEIGHT_SHOE = new DataSet( heightVsShoeString, 'Height vs. Shoe', 'Height', 'Shoe Size', new Range( 0, 10 ), new Range( 0, 10 ),
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

