import {useState, useEffect} from 'react';
import bboxPolyLayer from "./boundingBoxPolygonLayer";
import bboxLabel from "./bBoxLabelLayer";
//model border as polyline
import geojsonLayer from "./geojsonLayer";
//model base map image
import baseImage from "./baseMapLayer";
export default function (props) {
   const {basemapVisible, zScale } = props.params;
   const {bbox, border} = props;
   const [baseLayers, setBaseLayers] = useState([]);
   //set up base layers
  useEffect(()=>{
   if(!border)
   {
   setBaseLayers([]);
     return;
   }
   console.log('setup basic layers');
   setBaseLayers([
     baseImage({
       id:'base-map',
       min:bbox[0],
       max:bbox[1],
       visible:basemapVisible,
     }),
     geojsonLayer({
       id:'border line',
       data: {
         type: "Feature",
         geometry: border
       },
       filled:false,
       lineWidth:3
     }),
     bboxPolyLayer({
       min: bbox[0],
       max: bbox[1],
       elevation:1400,
       elevationScale:zScale,
       wireframe:true,
     }),
     bboxLabel({
       min: bbox[0],
       max: bbox[1],
       visible:true
     })
   ])

  }, [basemapVisible, bbox, border, zScale]);
  return {baseLayers};
}