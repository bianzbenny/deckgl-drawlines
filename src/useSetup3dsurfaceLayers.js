import {useEffect} from 'react';
//model top/bottom surface as polygons
import mesh3dlayer from "./mesh3dLayer";

//model vertical border face as polyline
import borderFaceLayer from "./borderFaceLineLayer";

export default function(props){
   const {view, zScale, mesh, border, baseLayers, borderFaceVisible, meshTopVisible, meshBottomVisible, setLayers} = props;
   useEffect(() =>{
      if(view !== 1 || !border || !mesh)
        return;
        console.log('setup 3d surface layers');
     setLayers( [
        
        borderFaceLayer({
          id:'border-faces',
          data:border,
          vertialLinesOnly:true,
          elevationScale:zScale,
          zTop:1500,
          zBottom:0, 
          visible:borderFaceVisible
        }),
        mesh3dlayer({
          id:'mesh-bottom',
          data:mesh,
          elevationScale:zScale,
          stroked:false,
          filled:true,
          wireframe:false,
          extruded: false,
          isTop:false,
          visible:meshBottomVisible
          //filled:false
        }),
        mesh3dlayer({
          id:'mesh-top',
          data:mesh,
          elevationScale:zScale,
          stroked:false,
          filled:true,
          wireframe:false,
          extruded: false,
          isTop:true,
          visible:meshTopVisible
          //filled:false
        }),
        ...baseLayers
      ]);
    }, [view, zScale, border, mesh, baseLayers, borderFaceVisible, meshTopVisible, meshBottomVisible])
}