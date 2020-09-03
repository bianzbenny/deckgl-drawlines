import React, { useState, useEffect, useRef } from "react";
import DeckGL, { OrbitView, OrthographicView } from "deck.gl";
//import visLayers from './visLayers';

import uti from "./utils/utils";
import useDimensions from "react-cool-dimensions";

//import bboxLayer from "./boundingBoxLayer";
import bboxPolyLayer from "./boundingBoxPolygonLayer";
import bboxLabel from "./bBoxLabelLayer";
//model border as polyline
import geojsonLayer from "./geojsonLayer";
//model top/bottom surface as polygons
import mesh3dlayer from "./mesh3dLayer";
import mesh2dlayer from "./mesh2dLayer";
import mesh3dvolumelayer from "./mesh3dVolumeLayer";
//model base map image
import baseImage from "./baseMapLayer";
//model vertical border face as polyline
import borderFaceLayer from "./borderFaceLineLayer";
import activeMeshCells from './utils/activeCellOnly';

//import geoData from "./data/geojsonData";
//import geoData2 from "./data/simpleData";
//import polygonData from "./data/simpledata3";
//import borderData from "./data/borderData";

import boundingbox from "./bbox";

//const geoData2 = geoData[0].meshLayer;
//console.log(geoData2);
const Tweakpane = require("tweakpane");
const panel = new Tweakpane({ title: "settings" });

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
  const [layers, setLayers] = useState();
  const [baseLayers, setBaseLayers] = useState();
  const [bbox, setBbox] = useState([[0,0],[1,1]]);
  //const bbox = [[0, 0], [100, 100]];
  //const bbox = [[-123.5, 49], [-123, 49.5]];
  //const bbox = [[178500, 45499], [181000, 45999]];
 
  //run when width, height and bbox change
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
  
  const [border, setBorder] = useState();
  const [mesh, setMesh] = useState();
  const [meshNo, setMeshNo] = useState(0);
  const [meshActiveNo, setMeshActiveNo] = useState(0);

  //setup control panel
  //view flag to show 2d or 3d view or 3d volume
  const [view, setView] = useState(1);
  const [zScale, setZScale] = useState(10);
  const [basemapVisible, setBaseMapVisible] = useState(false);
  const [borderFaceVisible, setBorderFaceVisible] = useState(true);
  const [meshTopVisible, setMeshTopVisible] = useState(true);
  const [meshBottomVisible, setMeshBottomVisible] = useState(true);

  const deckgl = useRef();
  //loading data and use border to set bbox
  //useEffect only run once
  useEffect(() => {
    console.log('fetch resources');
    fetch('resources/border.geojson')
    .then(response => response.json())
    .then(data => {
      //console.log("from fetch", data);
      setBbox(boundingbox({
        type: "Feature",
        geometry: data
      }));
      //console.log('bbox', bbox);
      setBorder(data);
    });  
    //fetch mesh
    fetch('resources/3dmesh.geojson')
      .then(response => response.json())
      .then(data => {
        console.log('mesh number:', data.features.length);
        setMeshNo(data.features.length);
        let activeFeatures = activeMeshCells(data.features);
        setMeshActiveNo(activeFeatures.length);
        setMesh(activeFeatures);
        
      });
  }, []);
  //set up base layers
  useEffect(()=>{
    if(!border)
      return;
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
  
  //set layers for 3d volume
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
  
  //set layers for 3d surface
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
