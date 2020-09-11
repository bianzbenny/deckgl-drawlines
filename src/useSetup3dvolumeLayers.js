import {useEffect} from 'react';
import mesh3dvolumelayer from "./mesh3dVolumeLayer";
export default function(props){
   const {view, zScale, mesh, baseLayers, meshBottomVisible, setLayers} = props;
   useEffect(() =>{
      if(view !== 2 || !mesh)
        return;
      console.log('setup 3d volume layers');
      setLayers( [
        ...baseLayers,  
        mesh3dvolumelayer({
          id:'mesh-bottom',
          data:mesh,
          elevationScale:zScale,
          stroked:false,
          filled:true,
          wireframe:false,
          extruded:true,
          visible:meshBottomVisible
          //filled:false
        })
      ]);
    }, [view, zScale, mesh, baseLayers, meshBottomVisible])
}