// Copyright 2014-2017, University of Colorado Boulder

/**
 * A Scenery node that shows the Pearson correlation coefficient in an equation form
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var leastSquaresRegression = require( 'LEAST_SQUARES_REGRESSION/leastSquaresRegression' );
  var LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // string
  var symbolRString = require( 'string!LEAST_SQUARES_REGRESSION/symbol.r' );
  var pattern_0r_1value = '{0} {1}';
  var plusString = '\u002B'; // we want a large + sign
  var minusString = '\u2212';
  var correlationCoefficientString = require( 'string!LEAST_SQUARES_REGRESSION/correlationCoefficient' );

  // constants
  var R_EQUALS = StringUtils.format( '{0} =', symbolRString );

  /**
   *
   * @param {Graph} graph
   * @param {Object} [options]
   * @constructor
   */
  function PearsonCorrelationCoefficientNode( graph, options ) {

    // property of the accordion Box
    this.expandedProperty = new Property( false );

    this.graph = graph;

    // restrict width of labels for i18n
    var maxLabelWidth = 120;

    // Create the left hand side of the equation (includes the equal sign)
    var leftHandSideText = new Text( R_EQUALS, { font: LeastSquaresRegressionConstants.PEARSON_COEFFICIENT_TEXT_FONT } );

    // Create the right hand side of the equation
    this.rightHandSideText = new Text( '', { font: LeastSquaresRegressionConstants.PEARSON_COEFFICIENT_TEXT_FONT } );

    // calculate the maximum width of the right hand side of the equation
    var rightHandSideMaxWidth = new Text( plusString + ' 0.00', { font: LeastSquaresRegressionConstants.PEARSON_COEFFICIENT_TEXT_FONT } ).width;
    var hStrut = new HStrut( rightHandSideMaxWidth );

    hStrut.left = leftHandSideText.right + 5;
    this.rightHandSideText.left = leftHandSideText.right + 5;

    // Create the equation
    var equation = new Node( {
      children: [
        leftHandSideText,
        hStrut,
        this.rightHandSideText
      ],
      maxWidth: maxLabelWidth
    } );

    // Create the panel that holds the equation
    var mutableEquationPanel = new Panel( equation, {
      fill: LeastSquaresRegressionConstants.GRAPH_BACKGROUND_COLOR,
      cornerRadius: LeastSquaresRegressionConstants.SMALL_PANEL_CORNER_RADIUS,
      stroke: LeastSquaresRegressionConstants.SMALL_PANEL_STROKE,
      resize: false,
      xMargin: 10
    } );

    // Options for the Accordion Box
    options = _.extend( {
      buttonXMargin: 10,
      buttonYMargin: 10,
      buttonTouchAreaXDilation: 16,
      buttonTouchAreaYDilation: 16,
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
      var rValueString;
      // Check for the existence of the rValue
      if ( this.graph.isLinearFitDefined() ) {
        var rValue = this.graph.getPearsonCoefficientCorrelation();

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
          var isNegative = (rValue < 0);
          var signString = isNegative ? minusString : plusString;
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