// Copyright 2014-2021, University of Colorado Boulder

/**
 * Combo box for selecting a dataSet.
 *
 * @author Martin Veillette (Berea College)
 */

import { Text } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';
import LeastSquaresRegressionConstants from '../LeastSquaresRegressionConstants.js';

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

export default DataSetComboBox;