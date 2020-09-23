import { SVG_NAMESPACE } from '../../SVGConst';
import { Environment } from '@recogito/recogito-client-core';

/** 
 * Parses a W3C Web Annotation FragmentSelector conforming
 * to the Media Fragments spec. This (currently) naive 
 * implementation can only deal with well-formed xywh=pixel
 * fragments. 
 */
export const parseRectFragment = annotation => {
  const selector = annotation.selector('FragmentSelector');
  if (selector?.conformsTo.startsWith('http://www.w3.org/TR/media-frags')) {
    const { value } = selector;
    const format = value.includes(':') ? value.substring(value.indexOf('=') + 1, value.indexOf(':')) : 'pixel';

    const coords = value.includes(':') ? value.substring(value.indexOf(':') + 1) : value.substring(value.indexOf('=') + 1);
    const [x, y, w, h] = coords.split(',').map(parseFloat)

    return { x, y, w, h, format };
  }
}

/** Serializes a (x, y, w, h)-tuple as Media Fragment selector **/
export const toRectFragment = (x, y, w, h) => ({
  source: Environment.image?.src,
  selector: {
    type: "FragmentSelector",
    conformsTo: "http://www.w3.org/TR/media-frags/",
    value: `xywh=pixel:${x},${y},${w},${h}`
  }
});

/** Shorthand to apply the given (x, y, w, h) to the SVG shape **/
const setXYWH = (shape, x, y, w, h) => {
  shape.setAttribute('x', x);
  shape.setAttribute('y', y);
  shape.setAttribute('width', w);
  shape.setAttribute('height', h);
}

/** 
 * Draws an SVG rectangle, either from an annotation, or an
 * (x, y, w, h)-tuple.
 */
export const drawRect = (arg1, arg2, arg3, arg4) => {


  const { x, y, w, h } = arg1.type === 'Annotation' || arg1.type === 'Selection' ?
    parseRectFragment(arg1) : { x: arg1, y: arg2, w: arg3, h: arg4 };

  const g = document.createElementNS(SVG_NAMESPACE, 'g');

  const outerRect = document.createElementNS(SVG_NAMESPACE, 'rect');
  const innerRect = document.createElementNS(SVG_NAMESPACE, 'rect');
  const textElement = document.createElementNS(SVG_NAMESPACE, 'text');
  const triangle = document.createElementNS(SVG_NAMESPACE, 'path');
  const circle = document.createElementNS(SVG_NAMESPACE, 'circle');
  const foreignObj = document.createElementNS(SVG_NAMESPACE, 'foreignObject');


  foreignObj.classList.add('delete-For');
  foreignObj.setAttribute('x', x + w - 0);
  foreignObj.setAttribute('y', y);
  foreignObj.setAttribute('width', '20');
  foreignObj.setAttribute('height', '20');
  foreignObj.style.display = 'none';
  foreignObj.style.zIndex = 9;


  let div = document.createElement('div');
  div.classList.add('delete-btn');
  div.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  div.style.backgroundColor = "#00baff";
  div.style.position = "absolute";
  //div.style.left = x + w - 10 + "px";
  //div.style.top = y + 'px';
  div.style.width = "20px";
  div.style.height = "20px";

  foreignObj.appendChild(div);

  circle.setAttribute('cx', x + w - 5);
  circle.setAttribute('cy', y + 10);
  circle.setAttribute('r', '10');
  circle.setAttribute('stroke', 'black');
  circle.setAttribute('fill', 'red');
  //circle.style.display = "none";
  circle.style.zIndex = 99;
  circle.addEventListener('mouseenter', evt => {
    /*
    if (this.currentHover !== g)
      this.emit('mouseEnterAnnotation', annotation, evt);

    this.currentHover = g;*/
    //circle.style.display = "block";
    //this.emit('mouseEnterAnnotation', annotation, evt);
    circle.

      console.log('circle hover');
  });

  circle.addEventListener('click', evt => {
    /*
    if (this.currentHover !== g)
      this.emit('mouseEnterAnnotation', annotation, evt);
    
    this.currentHover = g;*/
    console.log('circle clicked');
  });

  innerRect.addEventListener('mouseover', evt => {
    //console.log('Hovering rectangle');
    foreignObj.style.display = "block";
    let svg = document.getElementsByClassName('a9s-annnotationlayer');
    //console.log(svg[0]);
  });


  div.addEventListener('click', evt => {
    console.log('clicked');
  });



  //<path d="M150 0 L75 200 L225 200 Z" />
  triangle.setAttribute('path', 'M150 0 L75 200 L225 200 Z');

  innerRect.setAttribute('class', 'inner');
  setXYWH(innerRect, x, y, w, h);

  outerRect.setAttribute('class', 'outer');
  setXYWH(outerRect, x, y, w, h);


  //console.log(Environment);

  textElement.setAttribute('class', 'label-text');

  textElement.setAttribute('x', x + 4);
  textElement.setAttribute('y', y + 20);
  textElement.setAttribute('font-size', '12');
  textElement.setAttribute('fill', 'yellow');
  textElement.textContent = 'Shit';
  //g.appendChild(textElement);

  g.appendChild(outerRect);
  g.appendChild(innerRect);
  //g.appendChild(foreignObj);
 // g.insertAdjacentElement('beforeend', foreignObj);
  //g.appendChild(circle);

  return g;
}

/** Gets the (x, y, w, h)-values from the attributes of the SVG group **/
export const getRectSize = g => {
  const outerRect = g.querySelector('.outer');

  const x = parseFloat(outerRect.getAttribute('x'));
  const y = parseFloat(outerRect.getAttribute('y'));
  const w = parseFloat(outerRect.getAttribute('width'));
  const h = parseFloat(outerRect.getAttribute('height'));

  return { x, y, w, h };
}

/** Returns corner coordinates for the given SVG group **/
export const getCorners = g => {
  const { x, y, w, h } = getRectSize(g);
  return [
    { x: x, y: y },
    { x: x + w, y: y },
    { x: x + w, y: y + h },
    { x: x, y: y + h }
  ];
}

/** Applies the (x, y, w, h)-values to the rects in the SVG group **/
export const setRectSize = (g, x, y, w, h) => {
  const innerRect = g.querySelector('.inner');
  const outerRect = g.querySelector('.outer');

  setXYWH(innerRect, x, y, w, h);
  setXYWH(outerRect, x, y, w, h);
}

/** 
 * Shorthand to get the area (rectangle w x h) from the 
 * annotation's fragment selector. 
 */
export const rectArea = annotation => {
  const { w, h } = parseRectFragment(annotation);
  return w * h;
}

