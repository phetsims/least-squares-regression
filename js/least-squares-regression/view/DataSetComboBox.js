// Copyright 2014-2019, University of Colorado Boulder

/**
 * Combo box for selecting a dataSet.
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const leastSquaresRegression = require( 'LEAST_SQUARES_REGRESSION/leastSquaresRegression' );
  const LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  const Text = require( 'SCENERY/nodes/Text' );

  class DataSetComboBox extends ComboBox {

    /**
     * @param {Array.<DataSet>} dataSets
     * @param {Property.<DataSet>} selectedDataSetProperty
     * @param {Node} dataSetListParent
     * @param {number} maxTextWidth - max width of text in the combo box
     * @constructor
     */
    constructor( dataSets, selectedDataSetProperty, dataSetListParent, maxTextWidth ) {

      // {ComboBoxItem[]}
      const items = dataSets.map( dataSet => createItem( dataSet, maxTextWidth ) );

      super( items, selectedDataSetProperty, dataSetListParent, {
        listPosition: 'below',
        highlightFill: LeastSquaresRegressionConstants.ITEM_HIGHLIGHT_FILL,
        buttonLineWidth: 1,
        xMargin: 14,
        yMargin: 8,
        cornerRadius: LeastSquaresRegressionConstants.SMALL_PANEL_CORNER_RADIUS
      } );
    }
  }

  leastSquaresRegression.register( 'DataSetComboBox', DataSetComboBox );

  /**
   * Creates an item for the combo box.
   * @param {DataSet} dataSet
   * @param {number} maxTextWidth
   * @returns {ComboBoxItem}
   */
  function createItem( dataSet, maxTextWidth ) {
    const textNode = new Text( dataSet.name, {
      font: LeastSquaresRegressionConstants.TEXT_FONT,
      maxWidth: maxTextWidth
    } );
    return new ComboBoxItem( textNode, dataSet );
  }

  return DataSetComboBox;
} );