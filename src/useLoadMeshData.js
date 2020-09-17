/**
 * fetch mesh data and extract active cells
 */
import {useState, useEffect} from 'react';
import activeMeshCells from './utils/activeCellOnly';
import useFetchResource from './useFetchResource';
export default function(props) {
   const {url, activeCellOnly = true} = props;
   const [mesh, setMesh] = useState();
   const [meshNo, setMeshNo] = useState(0);
   const [meshActiveNo, setMeshActiveNo] = useState(0);
   const [elevationBounds, setElevationBounds] = useState();
   const {isLoading:isMeshLoading, data:meshData} = useFetchResource({url});
   useEffect(() => {
      if(!meshData)
         return;
      console.log('mesh number:', meshData.features.length);
      setMeshNo(meshData.features.length);
      let {activeFeatures, elevationBounds:eb} = activeMeshCells(meshData.features);
      setMeshActiveNo(activeFeatures.length);
      setElevationBounds(eb);
      if(activeCellOnly)
      {
         setMesh(activeFeatures);
      }
      else
         setMesh(meshData.features);

   }, [meshData, activeCellOnly]);
   return {isMeshLoading, mesh, meshNo, meshActiveNo, elevationBounds};
}