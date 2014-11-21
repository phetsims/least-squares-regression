// Copyright 2002-2013, University of Colorado Boulder

/**
 * Combo box for choosing a dataSet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ComboBox = require( 'SUN/ComboBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
//  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
//  var LSRConstants = require( 'string!LEAST_SQUARES_REGRESSION/pattern.0name.1pH' );

  // constants
  var TEXT_FONT = new PhetFont( {size: 16, weight: 'bold'} );
  var ITEM_HIGHLIGHT_FILL = 'rgb(218,255,255)';

  /**
   * @param {DataSet[]} dataSets
   * @param {Property.<DataSet>} selectedDataSet
   * @param {Node} dataSetListParent
   * @constructor
   */

  function DataSetComboBox( dataSets, selectedDataSetProperty, dataSetListParent ) {

    // items
    var items = [];
    for ( var i = 0; i < dataSets.length; i++ ) {
      var dataSet = dataSets[i];
      items[i] = createItem( dataSet );
    }

    ComboBox.call( this, items, selectedDataSetProperty, dataSetListParent, {
      listPosition: 'below',
      itemYMargin: 4,
      itemHighlightFill: ITEM_HIGHLIGHT_FILL,
      buttonLineWidth: 1,
      buttonCornerRadius: 8
    } );
  }

  /**
   * Creates an item for the combo box.
   * @param dataSet
   * @returns {*|{node: *, value: *}}
   */
  var createItem = function( dataSet ) {
    var node = new Node();
    // label
    var textNode = new Text( dataSet.name, {font: TEXT_FONT} );
    node.addChild( textNode );
    return ComboBox.createItem( node, dataSet );
  };

  return inherit( ComboBox, DataSetComboBox );
} );