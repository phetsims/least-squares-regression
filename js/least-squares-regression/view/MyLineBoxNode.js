// Copyright 2002-2014, University of Colorado Boulder

/**
 *  Combo Box
 *
 */

define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  // var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalSlider = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/VerticalSlider' );

  // strings
  var myLineString = require( 'string!LEAST_SQUARES_REGRESSION/myLine' );
  var residualsString = require( 'string!LEAST_SQUARES_REGRESSION/residuals' );
  var squaredResidualsString = require( 'string!LEAST_SQUARES_REGRESSION/squaredResiduals' );
  var aString = require( 'string!LEAST_SQUARES_REGRESSION/a' );
  var bString = require( 'string!LEAST_SQUARES_REGRESSION/b' );


  // constants
  // var FONT = new PhetFont( 11 );

  var pattern_0slope_1intercept = " y = {0} x + {1} ";
  /**
   * {Model} model of the main simulation
   * {Object} options
   * @constructor
   */
  function MyLineBoxNode( model, options ) {


    var equationText = new Text( '', { fill: 'white', stroke: 'black', cornerRadius: 2 } );

    Panel.call( this, new VBox( {spacing: 5, children: [
        new CheckBox( new Text( myLineString ), model.showMyLineProperty ),
        new Panel( equationText ),
        new Text( 'y= a x + b' ),
        new HBox( {spacing: 5, children: [
          new VerticalSlider( aString, new Dimension2( 10, 100 ), model.slopeProperty, new Range( -20, 20 ) ),
          new VerticalSlider( bString, new Dimension2( 10, 100 ), model.interceptProperty, new Range( -20, 20 ) )]} ),
        new CheckBox( new Text( residualsString ), model.showResidualsOfMyLineProperty ),
        new CheckBox( new Text( squaredResidualsString ), model.showSquareResidualsOfMyLineProperty )
      ], align: 'left' } ),
      _.extend( {
        cornerRadius: 10,
        fill: 'pink',
        align: 'left',

        buttonXMargin: 10,
        buttonYMargin: 6,

        contentXMargin: 8,
        contentYMargin: 5
      }, options )
    );

    var interceptText;
    var slopeText;
    var equationText;
    // move the slider thumb to reflect the model value
    model.interceptProperty.link( function( intercept ) {
      interceptText = Util.toFixedNumber( intercept, 1 );
      equationText.text = StringUtils.format( pattern_0slope_1intercept, slopeText, interceptText );
    } );

    // move the slider thumb to reflect the model value
    model.slopeProperty.link( function( slope ) {
      slopeText = Util.toFixedNumber( slope, 1 );
      equationText.text = StringUtils.format( pattern_0slope_1intercept, slopeText, interceptText );
    } );

  }

//  // click in the track to change the value, continue dragging if desired
//  var handleEvent = function( event ) {
//    var y = thisNode.globalToLocalPoint( event.pointer.point ).y;
//    var value = Util.linear( 0, size.height, range.max, range.min, y );
//    property.value = Util.toFixedNumber( Util.clamp( value, range.min, range.max ), decimalPlaces );
//  };
  return inherit( Panel, MyLineBoxNode );
} );