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

const Tweakpane = require("tweakpane");
const panel = new Tweakpane({ title: "settings" });

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
  
  //loading mesh data
  const {isMeshLoading, mesh, meshNo, meshActiveNo} = useLoadingMeshData({url:'resources/3dmesh.geojson'});


  //setup control panel
  //view flag to show 2d or 3d view or 3d volume
  const [view, setView] = useState(1);
  const [zScale, setZScale] = useState(10);
  const [basemapVisible, setBaseMapVisible] = useState(false);
  const [borderFaceVisible, setBorderFaceVisible] = useState(true);
  const [meshTopVisible, setMeshTopVisible] = useState(true);
  const [meshBottomVisible, setMeshBottomVisible] = useState(true);

  const deckgl = useRef();
   
  const [layers, setLayers] = useState([]);
  //set up base layers
  const {baseLayers} = useSetupBaselayers({basemapVisible,bbox, border, zScale });

  //set layers for 3d surface
  const {v3dSurfaceLayers} = useSetup3dsurfaceLayers({view, zScale, mesh, border, borderFaceVisible, meshTopVisible, meshBottomVisible});

  //2d view layers
  const {v2dLayers} = useSetup2dviewLayers({view, mesh, meshBottomVisible});

  //set layers for 3d volume
  const {v3dVolumeLayers} = useSetup3dvolumeLayers({view, zScale, mesh, meshBottomVisible});
  
    
  useEffect(() => {
    switch(view){
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
  }, [view, baseLayers, v2dLayers, v3dVolumeLayers, v3dSurfaceLayers])
  //side effect only run once
  useEffect(() => {
    console.log('setup settings panel');
    panel
      .addInput({ view: 1 }, "view", {
        options: { ['2D']: 0, ['3D Surface']: 1, ['3D Volume']:2 },
        label: "view"
      })
      .on("change", value => {
        setView(value);
        //console.log(`value=${value}`);
      });
    panel.addInput({zScale:30}, "zScale", {label:'z Scale',step:5, min:5, max:50})
      .on('change', value=>{
        setZScale(value);
      })
    panel.addInput({ meshTopVisible: true }, "meshTopVisible", { label: "Mesh Top" })
      .on("change", value => {
        setMeshTopVisible(value);
      });
    panel.addInput({ meshBottomVisible: true }, "meshBottomVisible", { label: "Mesh Bottom/2D" })
      .on("change", value => {
        setMeshBottomVisible(value);
      });
    panel.addInput({ borderFaceVisible: true }, "borderFaceVisible", { label: "Border Face" })
    .on("change", value => {
      setBorderFaceVisible(value);
      console.log(`border face=${value}`);
    });
      
    //panel.addButton({ title: "zoomIn" }).on("click", () => onClickZoom(0.5));
    //panel.addButton({ title: "zoomOut" }).on("click", () => onClickZoom(-0.5));
    
    const folder = panel.addFolder({ title: "base map" });
    folder
      .addInput({ visible: false }, "visible", { label: "Visible" })
      .on("change", value => {
        setBaseMapVisible(value);
      });
    panel.expanded =false;
    //clean up seems tweekpan not provide cleanup
    return () => {
      panel.dispose();
    };
  }, []);

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
    <div>{(isBorderLoading || isMeshLoading)? 'Loading data...':''}</div>
    <div>{`Polygon mesh total: ${new Intl.NumberFormat().format(meshNo)} 
                        active: ${new Intl.NumberFormat().format(meshActiveNo)}` }</div>
    <div>fps:{metrics.fps.toFixed(1)}</div>
    <div>GPU Mem:{(metrics.gpuMemory/1024/1024).toFixed(1)}M</div>  
      <div id="maps" ref={ref}>
      
        <DeckGL
          //views={}
          ref={deckgl}
          //width={width}
          //height={height}
          views={view === 0 ? views2d : views3d}
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
      
    </>
  );
}
