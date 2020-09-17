import {useState, useEffect} from 'react';
import contourlayer from './contourLayer';
import {interpolateRound} from "d3-interpolate";
import {interpolateTurbo} from 'd3-scale-chromatic';
import colorConvert from './utils/color';


const setThreshold = ({
      valueBounds, //[min, max] of elevation for a surface
      colorSpectrum, 
      count,  //number of thresholds
      isIsoband, //isolines or isoband
      strokeWidth
   }) => {
   let thresholdsIP = interpolateRound(...valueBounds);
   let contours = [];
   if(isIsoband)
   {
      for (let i=0; i < count; ++i){
         contours.push({
            //Isoband is an array for threshold
            threshold:[thresholdsIP(i/count), thresholdsIP((i+1)/count)],
            color:colorConvert(interpolateTurbo((i+1)/count)),
            strokeWidth
         });
      }
   } else {
      for (let i=0; i < count; ++i){
         contours.push({
            threshold:thresholdsIP(i/(count-1)),
            color:colorConvert(interpolateTurbo(i/(count-1))),
            strokeWidth
         });
      }
   }
   
   console.log(`contours thresholds: ${JSON.stringify(contours)}`)
   return contours;
}
export default (props) => {
   const {view, contourVisible, contourCount = 5, isTop=true, isIsoband=false} = props.params;
   const {mesh, elevationBounds, strokeWidth=2} = props;
   const [contourLayers, setContourLayers] = useState([]);
   const [contours, setContours] = useState([]);
   //calculate contours, setup threshold
   //set layers for contours
  useEffect(() =>{
   if(view !== 0 || !mesh ||!contourVisible)
   {
      setContours([]);
      return;
   }
   const path = isTop?'top':'bottom';
   console.log(`contour count: ${contourCount}`);
   setContours(setThreshold({valueBounds:elevationBounds[path], count:contourCount, isIsoband, strokeWidth}));
  
   }, [view, mesh, elevationBounds, isTop, contourCount, contourVisible, isIsoband, strokeWidth]);
   
   //set layers for contours
  useEffect(() =>{
   if(view !== 0 || !mesh || !contourVisible)
   {
      setContourLayers([]);
      return;
   }
   console.log('setup contour layers');
   //const path = isTop?'top':'bottom';
   //setContours(setThreshold({valueBounds:elevationBounds[path], count, isIsoband, strokeWidth}));
  
   setContourLayers([
     contourlayer({
       data:mesh,
       contours,
       isTop,
       visible:contourVisible
     })
   ]);
 }, [view, mesh, contourVisible, contours, isTop]);
 return {contourLayers, contours};
}