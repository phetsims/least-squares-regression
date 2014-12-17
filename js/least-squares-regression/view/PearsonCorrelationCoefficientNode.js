// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that shows the Pearson correlation coefficient
 *
 *  Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var HStrut = require( 'SUN/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // string

  var rEqualsString = require( 'string!LEAST_SQUARES_REGRESSION/rEquals' );
  var pattern_0r_1value = "{0} {1}";
  var plusString = '\u002B'; // we want a large + sign
  var minusString = '\u2212';

  /**
   *
   * @param graph
   * @constructor
   */
  function PearsonCorrelationCoefficientNode( graph ) {

    Node.call( this );
    this.graph = graph;

    var leftHandSideText = new Text( rEqualsString, {font: LSRConstants.PEARSON_COEFFICIENT_TEXT_FONT} );
    this.rightHandSideText = new Text( '', {font: LSRConstants.PEARSON_COEFFICIENT_TEXT_FONT} );
    var rightHandSideMaxWidth = new Text( plusString + '0.00', {font: LSRConstants.PEARSON_COEFFICIENT_TEXT_FONT} ).width;
    var hStrut = new HStrut( rightHandSideMaxWidth );

    hStrut.left = leftHandSideText.right + 5;
    this.rightHandSideText.left = leftHandSideText.right + 5;

    var equation = new Node( {
      children: [
        leftHandSideText,
        hStrut,
        this.rightHandSideText
      ]
    } );

    var mutableEquationText = new Panel( equation, {
      fill: LSRConstants.GRAPH_BACKGROUND_COLOR,
      cornerRadius: LSRConstants.SMALL_PANEL_CORNER_RADIUS,
      resize: false,
      xMargin: 10
    } );

    this.addChild( mutableEquationText );
  }

  return inherit( Node, PearsonCorrelationCoefficientNode, {
    reset: function() {
      this.update();
    },

    update: function() {
      var rText;
      if ( this.graph.dataPointsOnGraph.length >= 2 ) {
        var rValue = this.graph.getPearsonCoefficientCorrelation();
        var isNegative = (rValue < 0);
        var signString = isNegative ? minusString : plusString;
        rText = StringUtils.format( pattern_0r_1value, signString, Util.toFixed( Math.abs( rValue ), 2 ) );
      }
      else {
        rText = '';
      }
      this.rightHandSideText.text = rText;
    }
  } );
} )
;