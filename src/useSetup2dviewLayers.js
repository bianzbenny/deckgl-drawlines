import {useState, useEffect} from 'react';
import mesh2dlayer from "./mesh2dLayer";
export default function(props){
   const {view, meshBottomVisible} = props.params;
   const {mesh} = props;
   const [v2dLayers, set2dLayers] = useState([]);
   //set layers for 2d
  useEffect(() =>{
   if(view !== 0 || !mesh)
   {
      set2dLayers([]);
      return;
   }
   console.log('setup 2d layers');
   set2dLayers( [
     mesh2dlayer({
       id:'mesh2d',
       data:mesh,
       stroked:true,
       filled:false,
       visible:meshBottomVisible
     }),
   ]);
 }, [view, mesh, meshBottomVisible]);
 return {v2dLayers};
}