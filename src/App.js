import React, { useState, useEffect, useRef } from "react";
import DeckGL, { OrbitView, OrthographicView } from "deck.gl";
//import visLayers from './visLayers';

import uti from "./utils";
import useDimensions from "react-cool-dimensions";

import bboxLayer from "./boundingBoxLayer";
import bboxPolyLayer from "./boundingBoxPolygonLayer";
import bboxLabel from "./bBoxLabelLayer";
import geojsonLayer from "./geojsonLayer";
import polygonlayer from "./polygonLayer";
import geoData from "./data/geojsonData";
import geoData2 from "./data/simpleData";
import polygonData from "./data/simpledata3";
import borderData from "./data/borderData";

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
    console.log(`w=${width} h=${height} scale=${scale} zoom=${zoom} target:${target} `);
    setViewport(viewport => ({...viewport, width, height,zoom, target, position:target}));
    console.log(viewport);
  },[width, height, bbox])
  
  const [border, setBorder] = useState();
  const [mesh, setMesh] = useState();
  //loading data and use border to set bbox
  //useEffect only run once
  useEffect(() => {
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
        setMesh(data);
      });
  }, []);
  
  //set layers 
  useEffect(() =>{
    if(!border || !mesh)
      return;
    setLayers( [
      geojsonLayer({
        id:'border line',
        data: {
          type: "Feature",
          geometry: border
        },
        filled:true,
        lineWidth:3
      }),
      geojsonLayer({
        id:'mesh',
        data: mesh,
        filled:false,
        lineWidth:1
      }),
      /* polygonlayer({
        id:'mesh',
        data:mesh.features,
        //filled:false
      }), */
    
      bboxLayer({
        min: bbox[0],
        max: bbox[1],
        viewport: viewport
      }),
      /* bboxPolyLayer({
        min: bbox[0],
        max: bbox[1],
        viewport: viewport
      }), */
      bboxLabel({
        min: bbox[0],
        max: bbox[1],
        visible
      })
    ]);
  }, [border, mesh, bbox])
  
  //setup control panel
  //v2d flag to show 2d or 3d view
  const [v2d, setV2d] = useState(false);
  const [visible, setVisible] = useState(true);
  const deckgl = useRef();

  const [viewState, setViewState] = useState({});
  const onClickZoom = delta => {
    //may likely should get current zoom from viewState, see onViewStateChange()
    //viewState was remembered inside useEffect
    console.log(deckgl.current.deck.viewState["2d-scene"]);
    /* setViewState({
      ...viewState,
      zoom: viewState.zoom + 0.5
    });
    */
    let newViewState = deckgl.current.deck.viewState["2d-scene"];
    if (!newViewState) return;
    newViewState.zoom += delta;
    deckgl.current.deck.setProps({ viewState: newViewState });
  };

  //side effect only run once
  useEffect(() => {
    panel
      .addInput({ v2d: 1 }, "v2d", {
        options: { v2d: 0, v3d: 1 },
        label: "view"
      })
      .on("change", value => {
        setV2d(value === 0);
        //console.log(`value=${value}`);
      });
    //panel.addButton({ title: "zoomIn" }).on("click", () => onClickZoom(0.5));
    //panel.addButton({ title: "zoomOut" }).on("click", () => onClickZoom(-0.5));
    
    const folder = panel.addFolder({ title: "label layer" });
    folder
      .addInput({ visible: true }, "visible", { label: "Visible" })
      .on("change", value => {
        setVisible(value);
      });
    //panel.expanded(false);
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
  const [fps, setFPS] = useState(0);
  const [gpuMemory, setGPUMemory] = useState(0);
  const onViewStateChange = ({ viewState }) => {
    //setViewState(viewState);
    //console.log(viewState);
    setFPS(deckgl.current.deck.metrics.fps);
    setGPUMemory(deckgl.current.deck.metrics.gpuMemory);
    //console.log(deckgl.current.deck.metrics);
  };
  return (
    <>
    <div>fps:{fps.toFixed(1)}</div>
    <div>GPU Mem:{(gpuMemory/1024/1024).toFixed(1)}M</div>
    
      <div id="maps" ref={ref}>
        <DeckGL
          //views={}
          ref={deckgl}
          //width={width}
          //height={height}
          views={v2d ? views2d : views3d}
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
};
