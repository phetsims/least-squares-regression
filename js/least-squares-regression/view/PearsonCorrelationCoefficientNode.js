// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that shows the Pearson correlation coefficient
 *
 *  Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // string
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

    this.equationText = new Text( 'r = -0.000', {font: LSRConstants.TEXT_FONT_BOLD} );

    var mutableEquationText = new Panel( this.equationText, {
      fill: LSRConstants.GRAPH_BACKGROUND_COLOR,
      cornerRadius: LSRConstants.SMALL_PANEL_CORNER_RADIUS,
      resize: false
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
      this.equationText.text = StringUtils.format( pattern_0r_1value, 'r = ', rText );
    }
  } );
} )
;