// Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules

  var BestFitLineControlPanel = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/BestFitLineControlPanel' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var BucketFront = require( 'SCENERY_PHET/bucket/BucketFront' );
  var BucketHole = require( 'SCENERY_PHET/bucket/BucketHole' );
  // var Color = require( 'SCENERY/util/Color' );
  var CheckBox = require( 'SUN/CheckBox' );
  var DataPointCreatorNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DataPointCreatorNode' );
  var DataPointNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DataPointNode' );

  var DataSet = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/DataSet' );
  var DataSetComboBox = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DataSetComboBox' );
  var GraphAxesNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/GraphAxesNode' );
  var GraphNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/GraphNode' );
  var GridIcon = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/GridIcon' );
  var EraserButton = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/EraserButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MyLineControlPanel = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/MyLineControlPanel' );
  var Node = require( 'SCENERY/nodes/Node' );
  // var Path = require( 'SCENERY/nodes/Path' );
  // var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  // var Range = require( 'DOT/Range' );
  // var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  // var Shape = require( 'KITE/Shape' );
  // var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  // var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var IDENTITY_TRANSFORM = ModelViewTransform2.createIdentity();
  var DATA_POINT_CREATOR_OFFSET_POSITIONS = [
    // Offsets used for initial position of point, relative to bucket hole center. Empirically determined.
    new Vector2( -28, -5 ),
    new Vector2( -15, -3 ),
    new Vector2( 4, -4 ),
    new Vector2( 13, -2 ),
    new Vector2( -2, 0 ),
    new Vector2( -25, -14 ),
    new Vector2( -18, -12 ),
    new Vector2( -2, -7 ),
    new Vector2( 0, -16 ),
    new Vector2( 9, -12 ),
    new Vector2( 13, -9 ),
    new Vector2( -5, -12 )

  ];

  /**
   * @param {LeastSquaresRegression}
   */
  function LeastSquaresRegressionScreenView( model ) {

    ScreenView.call( this, {renderer: 'svg'} );
    var thisView = this;

    var viewGraphBounds = new Bounds2( 250, 10, 600, 360 );
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( model.graph.bounds, viewGraphBounds );

    thisView.modelViewTransform = modelViewTransform; // Make the modelViewTransform available to descendant types.

    var bestFitLineControlPanel = new BestFitLineControlPanel( model.graph, model.dataPoints );
    var myLineControlPanel = new MyLineControlPanel( model.graph, model.dataPoints );
    thisView.graphAxesNode = new GraphAxesNode( model.selectedDataSet, modelViewTransform );
    var graphNode = new GraphNode( model.graph, viewGraphBounds, modelViewTransform );

    thisView.addChild( bestFitLineControlPanel );
    thisView.addChild( myLineControlPanel );
    thisView.addChild( thisView.graphAxesNode );
    thisView.addChild( graphNode );

    // dataSet combo box
    var dataSetListParent = new Node();
    var dataSetComboBox = new DataSetComboBox( model.dataSets, model.selectedDataSetProperty, dataSetListParent );
    dataSetComboBox.left = 10;
    dataSetComboBox.top = bestFitLineControlPanel.bottom + 30;
    thisView.addChild( dataSetComboBox );
    thisView.addChild( dataSetListParent ); // last, so that dataSet box list is on top

    // Create the nodes that will be used to layer things visually.
    var backLayer = new Node();
    thisView.addChild( backLayer );
//    Create the layer where the points will be placed. They are maintained in a separate layer so that they are over
//     all of the point placement graphs in the z-order.

    thisView.dataPointsLayer = new Node( {layerSplit: true} ); // Force the moving dataPoint into a separate layer for performance reasons.

    var bucketFrontLayer = new Node();
    thisView.addChild( bucketFrontLayer );

    // Add the bucket view elements
    var bucketFront = new BucketFront( model.bucket, IDENTITY_TRANSFORM );
    bucketFrontLayer.addChild( bucketFront );
    var bucketHole = new BucketHole( model.bucket, IDENTITY_TRANSFORM );
    backLayer.addChild( bucketHole );

    // Add the dataPoint creator nodes. These must be added after the bucket hole for proper layering.
    DATA_POINT_CREATOR_OFFSET_POSITIONS.forEach( function( offset ) {
      backLayer.addChild( new DataPointCreatorNode(
        model.addUserCreatedDataPoint.bind( model ),
        modelViewTransform, {
          left: bucketHole.centerX + offset.x,
          top:  bucketHole.centerY + offset.y
        } ) );
    } );

    // Add the button that allows the graph to be cleared of all dataPoints.
    var eraserButton = new EraserButton( {
      right: bucketFront.right - 3,
      top:   bucketFront.bottom + 5,
      listener: function() {
        model.dataPoints.forEach( function( dataPoint ) {
          dataPoint.animating = true;
        } );

      }
    } );

    // gridIcon
    var gridCheckBox = new CheckBox( new GridIcon(), model.showGridProperty );

    this.addChild( gridCheckBox );

    model.selectedDataSetProperty.link( function( selectedDataSet ) {

      if ( thisView.graphAxesNode ) {
        thisView.removeChild( thisView.graphAxesNode );
      }

      thisView.graphbounds = new Bounds2( selectedDataSet.xRange.min, selectedDataSet.yRange.min, selectedDataSet.xRange.max, selectedDataSet.yRange.max );
      //  thisView.graphbounds = new Bounds2( model.graph.xRange.min, model.graph.yRange.min, model.graph.xRange.max, model.graph.yRange.max );

      var modelViewTransformAxes = ModelViewTransform2.createRectangleInvertedYMapping( thisView.graphbounds, viewGraphBounds );
      thisView.graphAxesNode = new GraphAxesNode( selectedDataSet, modelViewTransformAxes );
      thisView.addChild( thisView.graphAxesNode );
      thisView.graphAxesNode.moveToBack();
      graphNode.update();


// TODO; another hack
      model.showGridProperty.link( function( visible ) {
        thisView.graphAxesNode.gridNode.visible = visible;
      } );

      if ( selectedDataSet === DataSet.CUSTOM ) {
        bucketHole.visible = true;
        bucketFront.visible = true;
        eraserButton.visible = true;
        backLayer.visible = true;
        thisView.dataPointsLayer.pickable = true;

      }
      else {
        bucketHole.visible = false;
        bucketFront.visible = false;
        eraserButton.visible = false;
        backLayer.visible = false;
        //  thisView.dataPointsLayer.pickable = false;
      }


    } );


    // Handle the comings and goings of  dataPoints.
    model.dataPoints.addItemAddedListener( function( addedDataPoint ) {

      // Create and add the view representation for this dataPoint.
      var dataPointNode = new DataPointNode( addedDataPoint, modelViewTransform );
      thisView.dataPointsLayer.addChild( dataPointNode );


      addedDataPoint.positionProperty.link( function() {
        graphNode.update();
      } );
      // Move the dataPoint to the front of this layer when grabbed by the user.
      addedDataPoint.userControlledProperty.link( function( userControlled ) {
        if ( userControlled ) {
          graphNode.update();
          dataPointNode.moveToFront();
        }

      } );

      // Add the removal listener for if and when this dataPoint is removed from the model.
      model.dataPoints.addItemRemovedListener( function removalListener( removedDataPoint ) {
        if ( removedDataPoint === addedDataPoint ) {
          thisView.dataPointsLayer.removeChild( dataPointNode );
          model.dataPoints.removeItemRemovedListener( removalListener );
        }
      } );
    } );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        graphNode.reset();
        bestFitLineControlPanel.reset();
      },
      right:  thisView.layoutBounds.maxX - 10,
      bottom: thisView.layoutBounds.maxY - 10
    } );

    thisView.addChild( eraserButton );
    thisView.addChild( resetAllButton );

    // Add the dataPoints layer last .
    thisView.addChild( thisView.dataPointsLayer );

    {
      myLineControlPanel.right = thisView.layoutBounds.maxX - 10;
      myLineControlPanel.top = 10;
      bestFitLineControlPanel.left = 10;
      bestFitLineControlPanel.top = 10;
      gridCheckBox.centerX = myLineControlPanel.centerX;
      gridCheckBox.top = myLineControlPanel.bottom + 10;
    }


  }


  return inherit( ScreenView, LeastSquaresRegressionScreenView );
} );