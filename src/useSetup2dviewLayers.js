import {useEffect} from 'react';
import mesh2dlayer from "./mesh2dLayer";
export default function(props){
   const {view, mesh, baseLayers, meshBottomVisible, setLayers} = props;
   //set layers for 2d
  useEffect(() =>{
   if(view !== 0 || !mesh)
     return;
   console.log('setup 2d layers');
  setLayers( [
     ...baseLayers,
     mesh2dlayer({
       id:'mesh2d',
       data:mesh,
       stroked:true,
       filled:false,
       visible:meshBottomVisible
     }),
   ]);
 }, [view, mesh, baseLayers, meshBottomVisible])
}