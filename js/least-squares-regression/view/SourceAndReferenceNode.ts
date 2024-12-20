// Copyright 2014-2024, University of Colorado Boulder

/**
 * Shows a dialog box about the source and references of the selected Data Set.
 *
 * @author Martin Veillette (Berea College)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { RichText, VBox } from '../../../../scenery/js/imports.js';
import Dialog from '../../../../sun/js/Dialog.js';
import leastSquaresRegression from '../../leastSquaresRegression.js';
import LeastSquaresRegressionStrings from '../../LeastSquaresRegressionStrings.js';
import LeastSquaresRegressionConstants from '../LeastSquaresRegressionConstants.js';
import DataSet from '../model/DataSet.js';

export default class SourceAndReferenceNode extends Dialog {

  public constructor( selectedDataSetProperty: TReadOnlyProperty<DataSet> ) {

    const referenceText = new RichText( '', {
      font: LeastSquaresRegressionConstants.REFERENCE_FONT,
      replaceNewlines: true,
      align: 'left'
    } );
    const sourceText = new RichText( '', {
      font: LeastSquaresRegressionConstants.SOURCE_FONT,
      replaceNewlines: true,
      align: 'left'
    } );

    const children = [
      referenceText,
      sourceText
    ];

    // Create the content box
    const content = new VBox( { align: 'left', spacing: 10, children: children, maxWidth: 400 } );

    // Update the content of this node and the layout.
    // no need to unlink, present for the lifetime of the sim
    Multilink.multilink( [ LeastSquaresRegressionStrings.sourcePatternStringProperty, selectedDataSetProperty ], ( sourcePatternString, selectedDataSet ) => {
      referenceText.setStringProperty( selectedDataSet.reference );
      sourceText.string = StringUtils.format( sourcePatternString, selectedDataSet.source );
    } );

    super( content );
  }
}

leastSquaresRegression.register( 'SourceAndReferenceNode', SourceAndReferenceNode );