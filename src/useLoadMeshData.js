/**
 * fetch mesh data and extract active cells
 */
import {useState, useEffect} from 'react';
import activeMeshCells from './utils/activeCellOnly';
import useFetchResource from './useFetchResource';
export default function(props) {
   const {url} = props;
   const [mesh, setMesh] = useState();
   const [meshNo, setMeshNo] = useState(0);
   const [meshActiveNo, setMeshActiveNo] = useState(0);
   const {isLoading:isMeshLoading, data:meshData} = useFetchResource({url});
   useEffect(() => {
      if(!meshData)
         return;
      console.log('mesh number:', meshData.features.length);
      setMeshNo(meshData.features.length);
      let activeFeatures = activeMeshCells(meshData.features);
      setMeshActiveNo(activeFeatures.length);
      setMesh(activeFeatures);
   }, [meshData]);
   return {isMeshLoading, mesh, meshNo, meshActiveNo};
}