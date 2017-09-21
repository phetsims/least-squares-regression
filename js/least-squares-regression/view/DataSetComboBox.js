// Copyright 2014-2017, University of Colorado Boulder

/**
 * Combo box for selecting a dataSet.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var ComboBox = require( 'SUN/ComboBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var leastSquaresRegression = require( 'LEAST_SQUARES_REGRESSION/leastSquaresRegression' );
  var LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Array.<DataSet>} dataSets
   * @param {Property.<DataSet>} selectedDataSetProperty
   * @param {Node} dataSetListParent
   * @param {number} maxTextWidth - max width of text in the combo box
   * @constructor
   */

  function DataSetComboBox( dataSets, selectedDataSetProperty, dataSetListParent, maxTextWidth ) {

    // items
    var items = [];
    for ( var i = 0; i < dataSets.length; i++ ) {
      var dataSet = dataSets[ i ];
      items[ i ] = createItem( dataSet, maxTextWidth );
    }

    ComboBox.call( this, items, selectedDataSetProperty, dataSetListParent, {
      listPosition: 'below',
      itemYMargin: 2,
      itemHighlightFill: LeastSquaresRegressionConstants.ITEM_HIGHLIGHT_FILL,
      buttonLineWidth: 1,
      buttonCornerRadius: LeastSquaresRegressionConstants.SMALL_PANEL_CORNER_RADIUS
    } );
  }

  /**
   * Creates an item for the combo box.
   * @param {DataSet} dataSet
   * @param {number} maxTextWidth
   * @returns {*|{node: *, value: *}}
   */
  var createItem = function( dataSet, maxTextWidth ) {
    var node = new Node();
    // label
    var textNode = new Text( dataSet.name, { font: LeastSquaresRegressionConstants.TEXT_FONT, maxWidth: maxTextWidth } );
    node.addChild( textNode );
    return ComboBox.createItem( node, dataSet );
  };

  leastSquaresRegression.register( 'DataSetComboBox', DataSetComboBox );

  return inherit( ComboBox, DataSetComboBox );
} );