import {useState, useEffect} from 'react';
import mesh3dvolumelayer from "./mesh3dVolumeLayer";
export default function(props){
   const {view, zScale, meshBottomVisible} = props.params;
   const {mesh} = props;
   const [v3dVolumeLayers, set3dVolumeLayers] = useState([]);
   useEffect(() =>{
      if(view !== 2 || !mesh)
      {
         set3dVolumeLayers([]);
        return;
      }
      console.log('setup 3d volume layers');
      set3dVolumeLayers( [ 
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
    }, [view, zScale, mesh, meshBottomVisible]);
    return {v3dVolumeLayers};
}