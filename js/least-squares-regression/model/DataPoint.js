// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model of a data Point on the graph
 * The Data Point has a mutable position.
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   *
   * @param {Vector2} position
   * @constructor
   */
  function DataPoint( position ) {

    PropertySet.call( this, {
      position: position,
      userControlled: false     // Flag that tracks whether the user is dragging this dataPoint around.  Should be set externally, generally by the a
      // view node.
    } );
  }

  return inherit( PropertySet, DataPoint, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
    }
  } );
} );
