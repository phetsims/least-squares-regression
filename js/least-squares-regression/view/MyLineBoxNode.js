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


  /**
   * {Model} model of the main simulation
   * {Object} options
   * @constructor
   */
  function MyLineBoxNode( model, options ) {

    var slopeText = new Text( 'a', { fill: 'white', stroke: 'black', cornerRadius: 2 } );
    var interceptText = new Text( 'b', { fill: 'white', stroke: 'black', cornerRadius: 2 } );

    var equationPanel = new Panel( slopeText );
    Panel.call( this, new VBox( {spacing: 5, children: [
        new CheckBox( new Text( myLineString ), model.showMyLineProperty ),
        equationPanel,
        new Text( 'y= a x + b' ),
        new HBox( {spacing: 5, children: [
          new VerticalSlider( aString, new Dimension2( 10, 100 ), model.interceptProperty, new Range( 0, 20 ) ),
          new VerticalSlider( bString, new Dimension2( 10, 100 ), model.slopeProperty, new Range( 0, 20 ) )]} ),
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


    // move the slider thumb to reflect the model value
    model.interceptProperty.link( function( intercept ) {
      interceptText.text = Util.toFixedNumber( intercept, 2 );
    } );

    // move the slider thumb to reflect the model value
    model.slopeProperty.link( function( slope ) {
      slopeText.text = Util.toFixedNumber( slope, 2 );
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