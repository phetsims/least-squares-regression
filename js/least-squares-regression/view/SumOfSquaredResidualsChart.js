// Copyright 2002-2014, University of Colorado Boulder


define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
//  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  // var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Range = require( 'DOT/Range' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  // strings
  var myLineString = require( 'string!LEAST_SQUARES_REGRESSION/myLine' );
  var residualsString = require( 'string!LEAST_SQUARES_REGRESSION/residuals' );
  var squaredResidualsString = require( 'string!LEAST_SQUARES_REGRESSION/squaredResiduals' );

  //var pattern_0slope_1intercept = " y = {0} x + {1} ";
  var pattern_0sign_1intercept = " {0}{1} ";

  /**
   * {Model} model of the main simulation
   * {Object} options
   * @constructor
   */
  function SumOfSquaredResidualsChart( model, options ) {

    var eqPartOneText = new Text( 'y = ', {font: LSRConstants.TEXT_FONT, fill: 'black'} );

    var residualsCheckBox = new CheckBox( new Text( residualsString, LSRConstants.TEXT_FONT ), model.showResidualsOfMyLineProperty );
    var squaredResidualsCheckBox = new CheckBox( new Text( squaredResidualsString, LSRConstants.TEXT_FONT ), model.showSquareResidualsOfMyLineProperty );

    var sumOfSquaredResiduals = new Rectangle( 0, 0, 10, 10, { fill: 'red' } );

    //TODO fixed such that the text can be disabled
    model.showMyLineProperty.linkAttribute( residualsCheckBox, 'enabled' );
    model.showMyLineProperty.linkAttribute( squaredResidualsCheckBox, 'enabled' );


  }

  return inherit( Node, SumOfSquaredResidualsChart );
} );