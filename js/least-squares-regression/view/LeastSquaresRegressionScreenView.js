// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main View for the simulation screen of Least Squares Regression.
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
  var DynamicDataPointNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DynamicDataPointNode' );
  var DataSet = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/DataSet' );
  var DataSetComboBox = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DataSetComboBox' );
  var GraphAxesNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/GraphAxesNode' );
  var GraphNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/GraphNode' );
  var GridIcon = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/GridIcon' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MyLineControlPanel = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/MyLineControlPanel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PearsonCorrelationCoefficientNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/PearsonCorrelationCoefficientNode' );
  // var Path = require( 'SCENERY/nodes/Path' );
  // var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Property = require( 'AXON/Property' );
  // var Range = require( 'DOT/Range' );
  // var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StaticDataPointNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/StaticDataPointNode' );
  // var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var mockupImage = require( 'image!LEAST_SQUARES_REGRESSION/mockup.png' );

  // constants
  var IDENTITY_TRANSFORM = ModelViewTransform2.createIdentity();
  var DATA_POINT_CREATOR_OFFSET_POSITIONS = [
    // Offsets used for initial position of point, relative to bucket hole center. Empirically determined.
    new Vector2( -35, -5 ),
    new Vector2( -25, -9 ),
    new Vector2( -20, -4 ),
    new Vector2( -15, -14 ),
    new Vector2( -10, -4 ),
    new Vector2( -5, -17 ),
    new Vector2( -0, -5 ),
    new Vector2( 5, -14 ),
    new Vector2( 10, -3 ),
    new Vector2( 15, -7 ),
    new Vector2( 25, -4 )

  ];

  /**
   * @param {LeastSquaresRegressionModel} model
   * @constructor
   */
  function LeastSquaresRegressionScreenView( model ) {

    ScreenView.call( this, {renderer: 'svg'} );
    this.layoutBounds = ScreenView.UPDATED_LAYOUT_BOUNDS.copy();

    var thisView = this;
    var SIZE = 240;
    var OFFSET = 10;
    var viewGraphBounds = new Bounds2( this.layoutBounds.centerX - SIZE + OFFSET, this.layoutBounds.centerY - SIZE, this.layoutBounds.centerX + SIZE + OFFSET, this.layoutBounds.centerY + SIZE );
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( model.graph.bounds, viewGraphBounds );

    thisView.modelViewTransform = modelViewTransform; // Make the modelViewTransform available to descendant types.


    var panelOptions = {
      resize: false,
      cornerRadius: LSRConstants.CONTROL_PANEL_CORNER_RADIUS,
      fill: LSRConstants.CONTROL_PANEL_BACKGROUND_COLOR,
      align: 'left',
      xMargin: 10,
      yMargin: 10
    };
    var bestFitLineControlPanel = new BestFitLineControlPanel( model.graph, model.dataPoints, panelOptions );
    var myLineControlPanel = new MyLineControlPanel( model.graph, model.dataPoints, panelOptions );
    var graphAxesNode = new GraphAxesNode( model.selectedDataSet, modelViewTransform, model.showGridProperty );
    var graphNode = new GraphNode( model.graph, viewGraphBounds, modelViewTransform );

    thisView.addChild( bestFitLineControlPanel );
    thisView.addChild( myLineControlPanel );
    thisView.addChild( graphAxesNode );
    thisView.addChild( graphNode );


    // dataSet combo box
    var dataSetListParent = new Node();
    var dataSetComboBox = new DataSetComboBox( model.dataSets, model.selectedDataSetProperty, dataSetListParent );

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
      iconWidth: 25,
      listener: function() {
        model.dataPoints.forEach( function( dataPoint ) {
          dataPoint.animating = true;
        } );

      }
    } );

    // pearson Correlation coefficient panel
    var pearsonCorrelationCoefficientNode = new PearsonCorrelationCoefficientNode( model.graph );
    this.addChild( pearsonCorrelationCoefficientNode );

    // gridIcon
    var gridCheckBox = new CheckBox( new GridIcon(), model.showGridProperty );

    this.addChild( gridCheckBox );

    model.selectedDataSetProperty.link( function( selectedDataSet ) {

      if ( graphAxesNode ) {
        thisView.removeChild( graphAxesNode );
      }

      thisView.graphbounds = new Bounds2( selectedDataSet.xRange.min, selectedDataSet.yRange.min, selectedDataSet.xRange.max, selectedDataSet.yRange.max );
      //  thisView.graphbounds = new Bounds2( model.graph.xRange.min, model.graph.yRange.min, model.graph.xRange.max, model.graph.yRange.max );

      var modelViewTransformAxes = ModelViewTransform2.createRectangleInvertedYMapping( thisView.graphbounds, viewGraphBounds );
      graphAxesNode = new GraphAxesNode( selectedDataSet, modelViewTransformAxes, model.showGridProperty );
      thisView.addChild( graphAxesNode );
      graphAxesNode.moveToBack();

      graphNode.update();
      pearsonCorrelationCoefficientNode.update();
      bestFitLineControlPanel.updateBestFitLineEquation();

      if ( selectedDataSet === DataSet.CUSTOM ) {
        bucketHole.visible = true;
        bucketFront.visible = true;
        eraserButton.visible = true;
        backLayer.visible = true;

      }
      else {
        bucketHole.visible = false;
        bucketFront.visible = false;
        eraserButton.visible = false;
        backLayer.visible = false;
      }

    } );

    // Handle the comings and goings of  dataPoints.
    model.dataPoints.addItemAddedListener( function( addedDataPoint ) {

      if ( model.selectedDataSet === DataSet.CUSTOM ) {
        // Create and add the view representation for this dataPoint.
        var dynamicDataPointNode = new DynamicDataPointNode( addedDataPoint, modelViewTransform );
        thisView.dataPointsLayer.addChild( dynamicDataPointNode );

        addedDataPoint.positionProperty.link( function() {
          graphNode.update();
          pearsonCorrelationCoefficientNode.update();
        } );
        // Move the dataPoint to the front of this layer when grabbed by the user.
        addedDataPoint.userControlledProperty.link( function( userControlled ) {
          if ( userControlled ) {
            graphNode.update();
            pearsonCorrelationCoefficientNode.update();
            dynamicDataPointNode.moveToFront();
          }

        } );

        // Add the removal listener for if and when this dataPoint is removed from the model.
        model.dataPoints.addItemRemovedListener( function removalListener( removedDataPoint ) {
          if ( removedDataPoint === addedDataPoint ) {
            thisView.dataPointsLayer.removeChild( dynamicDataPointNode );
            model.dataPoints.removeItemRemovedListener( removalListener );
          }
        } );
      }

      else {
        // Create and add the view representation for this dataPoint.
        var staticDataPointNode = new StaticDataPointNode( addedDataPoint, modelViewTransform );
        thisView.dataPointsLayer.addChild( staticDataPointNode );

        // Add the removal listener for if and when this dataPoint is removed from the model.
        model.dataPoints.addItemRemovedListener( function removalListener( removedDataPoint ) {
          if ( removedDataPoint === addedDataPoint ) {
            thisView.dataPointsLayer.removeChild( staticDataPointNode );
            model.dataPoints.removeItemRemovedListener( removalListener );
          }
        } );

      }
    } );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        graphNode.reset();
        pearsonCorrelationCoefficientNode.reset();
        bestFitLineControlPanel.reset();
      },
      right:  thisView.layoutBounds.maxX - 10,
      bottom: thisView.layoutBounds.maxY - 10
    } );

    thisView.addChild( eraserButton );
    thisView.addChild( resetAllButton );

    // Add the dataPoints layer last .
    thisView.addChild( thisView.dataPointsLayer );
    dataSetListParent.moveToFront();

    {
      myLineControlPanel.right = thisView.layoutBounds.maxX - 10;
      myLineControlPanel.top = 20;
      bestFitLineControlPanel.left = 15;
      bestFitLineControlPanel.top = myLineControlPanel.top;
      dataSetComboBox.centerX = viewGraphBounds.centerX;
      dataSetComboBox.top = myLineControlPanel.top;
      gridCheckBox.left = myLineControlPanel.left + 10;
      gridCheckBox.top = myLineControlPanel.bottom + 10;
      pearsonCorrelationCoefficientNode.centerX = bestFitLineControlPanel.centerX;
      pearsonCorrelationCoefficientNode.centerY = viewGraphBounds.centerY;
    }

    //Show the mock-up and a slider to change its transparency
    var mockupOpacityProperty = new Property( 0.02 );
    var image = new Image( mockupImage, {pickable: false} );
    image.scale( this.layoutBounds.height / image.height );
//    image.scale( this.layoutBounds.width / image.width, this.layoutBounds.height / image.height );
    mockupOpacityProperty.linkAttribute( image, 'opacity' );
    this.addChild( image );
    this.addChild( new HSlider( mockupOpacityProperty, {min: 0, max: 1}, {top: 10, left: -150} ) );


  }

  return inherit( ScreenView, LeastSquaresRegressionScreenView );
} );