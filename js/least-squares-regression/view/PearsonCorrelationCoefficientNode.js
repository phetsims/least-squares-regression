// Copyright 2014-2019, University of Colorado Boulder

/**
 * A Scenery node that shows the Pearson correlation coefficient in an equation form
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const leastSquaresRegression = require( 'LEAST_SQUARES_REGRESSION/leastSquaresRegression' );
  const LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const merge = require( 'PHET_CORE/merge' );
  const MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const Property = require( 'AXON/Property' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );

  // string
  const symbolRString = require( 'string!LEAST_SQUARES_REGRESSION/symbol.r' );
  const pattern_0r_1value = '{0} {1}';
  const correlationCoefficientString = require( 'string!LEAST_SQUARES_REGRESSION/correlationCoefficient' );

  // constants
  const R_EQUALS = StringUtils.format( '{0} =', symbolRString );

  /**
   *
   * @param {Graph} graph
   * @param {Object} [options]
   * @constructor
   */
  function PearsonCorrelationCoefficientNode( graph, options ) {

    options = merge( {

      // AccordionBox options
      cornerRadius: 3
    }, options );

    // property of the accordion Box
    this.expandedProperty = new Property( false );

    this.graph = graph;

    // restrict width of labels for i18n
    const maxLabelWidth = 120;

    // Create the left hand side of the equation (includes the equal sign)
    const leftHandSideText = new Text( R_EQUALS, { font: LeastSquaresRegressionConstants.PEARSON_COEFFICIENT_TEXT_FONT } );

    // Create the right hand side of the equation
    this.rightHandSideText = new Text( '', { font: LeastSquaresRegressionConstants.PEARSON_COEFFICIENT_TEXT_FONT } );

    // calculate the maximum width of the right hand side of the equation
    const rightHandSideMaxWidth = new Text( MathSymbols.PLUS + ' 0.00', { font: LeastSquaresRegressionConstants.PEARSON_COEFFICIENT_TEXT_FONT } ).width;
    const hStrut = new HStrut( rightHandSideMaxWidth );

    hStrut.left = leftHandSideText.right + 5;
    this.rightHandSideText.left = leftHandSideText.right + 5;

    // Create the equation
    const equation = new Node( {
      children: [
        leftHandSideText,
        hStrut,
        this.rightHandSideText
      ],
      maxWidth: maxLabelWidth
    } );

    // Create the panel that holds the equation
    const mutableEquationPanel = new Panel( equation, {
      fill: LeastSquaresRegressionConstants.GRAPH_BACKGROUND_COLOR,
      cornerRadius: LeastSquaresRegressionConstants.SMALL_PANEL_CORNER_RADIUS,
      stroke: LeastSquaresRegressionConstants.SMALL_PANEL_STROKE,
      resize: false,
      xMargin: 10
    } );

    // Options for the Accordion Box
    options = merge( {
      buttonXMargin: 10,
      buttonYMargin: 10,
      expandCollapseButtonOptions: {
        touchAreaXDilation: 16,
        touchAreaYDilation: 16
      },
      expandedProperty: this.expandedProperty,
      titleYMargin: 10,
      titleNode: new MultiLineText( correlationCoefficientString, { font: LeastSquaresRegressionConstants.TEXT_BOLD_FONT, maxWidth: maxLabelWidth } ),
      titleAlignY: 'top',
      contentXMargin: 10,
      contentYMargin: 10
    }, options );

    // Add the panel to the Accordion Box
    AccordionBox.call( this, new LayoutBox( {
        children: [ new HStrut( 180 ), mutableEquationPanel ],
        orientation: 'vertical'
      } ),
      options );
  }

  leastSquaresRegression.register( 'PearsonCorrelationCoefficientNode', PearsonCorrelationCoefficientNode );

  return inherit( AccordionBox, PearsonCorrelationCoefficientNode, {
    reset: function() {
      // Close the accordion Box
      this.expandedProperty.reset();
      // Update the text of the equation
      this.update();
    },

    /**
     * Update the value of the right hand side of  the equation
     * @public
     */
    update: function() {
      let rValueString;
      // Check for the existence of the rValue
      if ( this.graph.isLinearFitDefined() ) {
        const rValue = this.graph.getPearsonCoefficientCorrelation();

        // if the rValue is zero and there are only two points on the graph, return null.  This is to avoid
        // a precision error for when the points are aligned horizontally and the denominator is non-zero
        if( rValue === 0 ) {
          if(this.graph.dataPointsOnGraph.length === 2 ) {
            rValueString = '';
          }
        }

        // getPearsonCoefficientCorrelation() will return null if NaN
        if( rValue === null ) {
          rValueString = '';
        }
        else {
          const isNegative = (rValue < 0);
          const signString = isNegative ? MathSymbols.MINUS : MathSymbols.PLUS;
          rValueString = StringUtils.format( pattern_0r_1value, signString, Util.toFixed( Math.abs( rValue ), 2 ) );
        }
      }
      else {
        // Set to null if the Pearson Coefficient does not exist
        rValueString = '';
      }
      // Update the text on the right Hand side of the equation
      this.rightHandSideText.text = rValueString;
    }
  } );
} )
;