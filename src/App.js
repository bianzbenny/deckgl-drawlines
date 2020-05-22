import React, { useState } from "react";
import DeckGL, { OrbitView, OrthographicView } from "deck.gl";


import bboxLayer from "./boundingBoxLayer";
import bboxLabel from "./bBoxLabelLayer";

export default () => {
  const width = 900;
  const height = 800;

  const bbox = [[0, 0], [500, 800]];

  const [viewport] = useState({
    target: [width / 2, height / 2, 0],
    position: [width / 2, height / 2, 0],
    width: width,
    height: height,
    rotationX: 0,
    zoom: -1
  });
  //create different views 2d, or 3d
  const views2d = new OrthographicView({ id: "2d-scene" });
  const views3d = new OrbitView({
    id: "3d-scene",
    orbitAxis: "X",
    rotationX: 10
  });
  //v2d flag to show 2d or 3d view
  const [v2d, setV2d] = useState(true);
  const click2d = () => {
    setV2d(v2d ? false : true);
  };
  //create layes
  const layers = [
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
