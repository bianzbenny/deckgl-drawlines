import React, { useState } from "react";
import DeckGL, { OrbitView, OrthographicView } from "deck.gl";
import uti from "./utils";


import bboxLayer from "./boundingBoxLayer";
import bboxLabel from "./bBoxLabelLayer";
import geojsonLayer from "./geojsonLayer";
//import geoData from "./data/geojsonData";
import geoData2 from "./data/simpleData";
//const geoData2 = geoData[0].meshLayer;
console.log(geoData2);

export default () => {
  const width = 900;
  const height = 800;

  //const bbox = [[0, 0], [100, 100]];
  const bbox = [[-123.5, 49], [-123, 49.5]];
  const { scale, zoomLevel, target } = uti({
    min: bbox[0],
    max: bbox[1],
    width,
    height
  });
  console.log(`scale=${scale} zoom=${zoomLevel} target:${target} `);
  const [viewport] = useState({
    target: [target[0], target[1], 0], //world coords of view center, should be bbox center
    //position: [width / 2, height / 2, 0], //camera position
    position: [target[0], target[1], 0],
    width: width,
    height: height,
    rotationX: 0,
    zoom: zoomLevel //should calculate according to bbox
    //viewMatrix: [1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  });
  //create different views 2d, or 3d
  const views2d = new OrthographicView({ id: "2d-scene" });
  const views3d = new OrbitView({
    id: "3d-scene",
    orbitAxis: "X",
    rotationX: 0
  });
  //v2d flag to show 2d or 3d view
  const [v2d, setV2d] = useState(true);
  const click2d = () => {
    setV2d(v2d ? false : true);
  };
  //create layes
  const layers = [
    geojsonLayer({ data: geoData2 }),
    bboxLayer({
      min: bbox[0],
      max: bbox[1],
      viewport: viewport
    }),
    bboxLabel({
      min: bbox[0],
      max: bbox[1]
    })
  ];
  return (
    <>
      <div id="maps">
        <DeckGL
          //views={}
          views={v2d ? views2d : views3d}
          initialViewState={viewport}
          controller={true}
          layers={layers}
        />
      </div>
      <div id="ui">
        <button onClick={click2d}> {v2d ? "2D" : "3D"}</button>
      </div>
    </>
  );
};
