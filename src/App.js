import React, { useState, useEffect, useRef } from "react";
import DeckGL, { OrbitView, OrthographicView } from "deck.gl";

import uti from "./utils/utils";
import useDimensions from "react-cool-dimensions";

import useFetchResource from './useFetchResource';
import useSetBBox from './useSetBBox';
import useSetupBaselayers from './useSetupBaselayers';
import useLoadingMeshData from './useLoadMeshData';
import useSetup2dviewLayers from './useSetup2dviewLayers';
import useSetup3dvolumeLayers from './useSetup3dvolumeLayers';
import useSetup3dsurfaceLayers from './useSetup3dsurfaceLayers';

import SettingsPanel from './settingsPanel';

//responsive canavs size using custom hook useDimensions
export default props => {
  const ref = useRef();

  let [{ width, height }, setCanvasSize] = useState({
    width: 900,
    height: 600
  });
  useDimensions(ref, {
    onResize: ({ width, height }) => {
      // Triggered whenever the size of the target is changed
      setCanvasSize({ width, height });
      console.log(`width=${width} height=${height}`);
    }
  });
  [width, height] = [width < 10 ? 900 : width, height = height < 10 ? 800 : height];

   const [viewport, setViewport] = useState({
    //target: [target[0], target[1], 0], //world coords of view center, should be bbox center
    //position: [target[0], target[1], 0], //camera position
    width,
    height,
    rotationX: 0,
    //zoom: //should calculate according to bbox
    
  });
  //loading model border (boundary) geojson and setup bbox
  const {isLoading:isBorderLoading, data:border} = useFetchResource({url:'resources/border.geojson'});
  const {bbox} = useSetBBox({border});

  //set up viewport run when width, height and bbox change
  useEffect(()=>{
    const { scale, zoom, target } = uti({
      min: bbox[0],
      max: bbox[1],
      width,
      height
    });
    //console.log(`w=${width} h=${height} scale=${scale} zoom=${zoom} target:${target} `);
    setViewport(viewport => ({...viewport, width, height,zoom, target, position:target}));
    console.log(viewport);
  },[width, height, bbox])
  
  //setup control panel
  //view parameters settings
  const defaultParams = {
    view:1, //show 2d or 3d surface view or 3d volume
    activeCellOnly:true,
    basemapVisible:false,
    zScale:10,
    borderFaceVisible:true,
    meshTopVisible:true,
    meshBottomVisible:true
  }
  const [params, setParams] = useState(defaultParams);
  //loading mesh data
  const {isMeshLoading, mesh, meshNo, meshActiveNo} = useLoadingMeshData({activeCellOnly:params.activeCellOnly, url:'resources/3dmesh.geojson'});


  const deckgl = useRef();
   
  const [layers, setLayers] = useState([]);
  //set up base layers
  const {baseLayers} = useSetupBaselayers({params,bbox, border});

  //set layers for 3d surface
  const {v3dSurfaceLayers} = useSetup3dsurfaceLayers({params, mesh, border});

  //2d view layers
  const {v2dLayers} = useSetup2dviewLayers({params, mesh});

  //set layers for 3d volume
  const {v3dVolumeLayers} = useSetup3dvolumeLayers({params, mesh});
  
  
  
  useEffect(() => {
    switch(params.view){
      case 1: //3d surface
        setLayers([...baseLayers, ...v3dSurfaceLayers ]);
        break;
      case 0: //2d 
        setLayers([...baseLayers, ...v2dLayers ]);
        break;
      case 2: // 3d volume
        setLayers([...baseLayers, ...v3dVolumeLayers ]);
        break;
      default:
        setLayers([]);
    }
  }, [params.view, baseLayers, v2dLayers, v3dVolumeLayers, v3dSurfaceLayers])
  
  //create different views 2d, or 3d
  const views2d = new OrthographicView({ id: "2d-scene" });
  const views3d = new OrbitView({
    id: "3d-scene",
    orbitAxis: "Z",
    rotationX: 20
  });


  //metrics
  const [metrics, setMetrics] = useState({
    fps:0,
    gpuMemory:0}
  )
  
  const onViewStateChange = () => {
    setMetrics({...deckgl.current.deck.metrics});
   //console.log(deckgl.current.deck.metrics);
  };
  return (
    <>
     <div>{`Polygon mesh total: ${new Intl.NumberFormat().format(meshNo)} 
                        active: ${new Intl.NumberFormat().format(meshActiveNo)}` }</div>
    <div>fps:{metrics.fps.toFixed(1)}</div>
    <div>GPU Mem:{(metrics.gpuMemory/1024/1024).toFixed(1)}M</div> 
    <div>{(isBorderLoading || isMeshLoading)? 'Loading data...':''}</div>
      <div id="maps" ref={ref}>
      
        <DeckGL
          //views={}
          ref={deckgl}
          //width={width}
          //height={height}
          views={params.view === 0 ? views2d : views3d}
          //controller rely on intialViewState
          initialViewState={viewport}
          //to take control of viewState, use viewState but
          //can not use initialViewState together
          //viewState={viewState}
          controller={true}
          layers={layers}
          onViewStateChange={onViewStateChange}
        />
      </div>
      <SettingsPanel defaultParams = {defaultParams} setParams={setParams}/>
    </>
  );
}
