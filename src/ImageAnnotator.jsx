import React, { Component } from 'react';
import AnnotationLayer from './annotations/AnnotationLayer';
import { Editor } from '@recogito/recogito-client-core';

import './ImageAnnotator.scss';

export default class ImageAnnotator extends Component  {

  state = {
    selectedAnnotation: null,
    selectedDOMElement: null,
    modifiedTarget: null,

    applyTemplate: null,
    applyImmediately: null
  }

  /** Shorthand **/
  clearState = () => this.setState({
    selectedAnnotation: null,
    selectedDOMElement: null,
    modifiedTarget: null
  });

  componentDidMount() {
    
    this.annotationLayer = new AnnotationLayer(this.props);


    // A new shape selection was created with a drawing tool
    this.annotationLayer.on('createSelection', this.handleCreateSelection);

    // An existing annotation was selected
    this.annotationLayer.on('select', this.handleSelect);

    // The current selection shape was moved, resized or changed
    this.annotationLayer.on('updateTarget', this.handleUpdateTarget);

    // Mouse entered or left an annotation shape
    this.annotationLayer.on('mouseEnterAnnotation', this.handleMouseEnter);
    this.annotationLayer.on('mouseLeaveAnnotation', this.handleMouseLeave);

    //custom
    this.annotationLayer.on('removed', this.onDeleteAnnotation );
    //pthis.annotationLayer.on('deselectAnnotation');
  }

  componentWillUnmount() {
    this.annotationLayer.destroy();
  }

  handleCreateSelection = selection => 
    this.props.onSelectionCreated(selection.clone());

  handleSelect = evt => {
    //console.log('xxx');
    const { annotation, element, skipEvent } = evt;
    if (annotation) {
      this.setState({ 
        selectedAnnotation: annotation,
        selectedDOMElement: element
      });

      if (!annotation.isSelection && !skipEvent)
        this.props.onAnnotationSelected(annotation.clone());
    } else {
      this.clearState();
    }
    //this.clearState();
  }

  handleUpdateTarget = (selectedDOMElement, modifiedTarget) => {
    this.setState({ selectedDOMElement, modifiedTarget });

    const clone = JSON.parse(JSON.stringify(modifiedTarget));
    this.props.onSelectionTargetChanged(clone);
  }

  handleMouseEnter = annotation =>{
    //console.log('mouseEnter Hanlder for REAL');
    this.props.onMouseEnterAnnotation(annotation.clone());
  }
   

  handleMouseLeave = annotation =>
    this.props.onMouseLeaveAnnotation(annotation.clone());

  /**************************/  
  /* Annotation CRUD events */
  /**************************/  

  /** Common handler for annotation CREATE or UPDATE **/
  onCreateOrUpdateAnnotation = method => (annotation, previous) => {
    // Merge updated target if necessary
    const a = (this.state.modifiedTarget) ?
      annotation.clone({ target: this.state.modifiedTarget }) : annotation.clone();

    this.clearState();    
    this.annotationLayer.deselect();
    this.annotationLayer.addOrUpdateAnnotation(a, previous);
    
    

    // Call CREATE or UPDATE handler
    this.props[method](a, previous?.clone());
  }

  onDeleteAnnotation = annotation => {
    this.clearState();
    //console.log(annotation.annotation);
    //this.props.onAnnotationDeleted(annotation);   Previous code modified
    this.props.onAnnotationDeleted(annotation.annotation);
    this.annotationLayer.removeAnnotation(annotation);
    
  }

  /** Cancel button on annotation editor **/
  onCancelAnnotation = () => {
    this.clearState();
    this.annotationLayer.deselect();
  }

  /****************/               
  /* External API */
  /****************/    

  addAnnotation = annotation =>{
    this.annotationLayer.addOrUpdateAnnotation(annotation.clone());
    //console.log('addingg');
  }
  

  removeAnnotation = annotation =>{
    //this.annotationLayer.removeAnnotation(annotation.clone());
    this.annotationLayer.removeAnnotation(annotation);
  }
    

  setAnnotations = annotations =>{
    this.annotationLayer.init(annotations.map(a => a.clone()));
   
  }
   

  getAnnotations = () =>
    this.annotationLayer.getAnnotations().map(a => a.clone());

  setDrawingTool = shape =>
    this.annotationLayer.setDrawingTool(shape);

  setVisible = visible =>
    this.annotationLayer.setVisible(visible);

  selectAnnotation = arg => {
    const annotation = this.annotationLayer.selectAnnotation(arg);
    
    if (annotation)
      return annotation.clone();
    else
      this.clearState(); // Deselect
  }

  applyTemplate = (bodies, openEditor) =>
    this.setState({ applyTemplate: bodies, applyImmediately: !openEditor });

  //new added custom function
  findAnnotationSVG = annotation => {
    
    return this.annotationLayer.findShape(annotation);
  }
  //custom
  getRect = g => {
    
    return this.annotationLayer.getRectSize(g)
  };
   /*  custom function that throws error
  parseRect = annotation => {
    return this.annotationLayer.parseRect(annotation);
  }
  */
  //custom function
  deSelect = () => {
    
    this.annotationLayer.deselect();
    this.clearState();  //added for custom deletion
  }
  render() {
    // The editor should open under normal conditions (no headless mode, annotation was selected),
    // or if we are in headless mode for immediate template application 
    const normalConditions = this.state.selectedAnnotation && !this.props.headless;

    const headlessApply =
      this.props.headless && 
      this.state.applyTemplate && 
      this.state.selectedAnnotation?.isSelection;

    const open = (normalConditions == true || headlessApply == true);

    const readOnly = this.props.readOnly || this.state.selectedAnnotation?.readOnly

    return (open && (
      <Editor
        mycustom = {'SHIT'}
        wrapperEl={this.props.wrapperEl}
        annotation={this.state.selectedAnnotation}
        selectedElement={this.state.selectedDOMElement}
        readOnly={readOnly}
        applyTemplate={this.state.applyTemplate}
        applyImmediately={this.state.applyImmediately}
        onAnnotationCreated={this.onCreateOrUpdateAnnotation('onAnnotationCreated')}
        onAnnotationUpdated={this.onCreateOrUpdateAnnotation('onAnnotationUpdated')}
        onAnnotationDeleted={this.onDeleteAnnotation}
        onCancel={this.onCancelAnnotation}>

        {this.props.children}

      </Editor>
    ))
  }

}
