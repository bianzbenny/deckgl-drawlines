import React, { useState } from "react";
import DeckGL, { OrbitView, OrthographicView } from "deck.gl";

//import renderLayers from "./LineLayers";
import bboxLayer from "./boundingBoxLayer";

export default () => {
  const width = 900;
  const height = 800;
  const cols = ~~(width / resolution);
  const rows = ~~(height / resolution);
  const grid = [10, 10]; //rows, cols
  const resolution = 10;

  const bbox = [[0, 0], [500, 800]];

  const [viewport] = useState({
    target: [width / 2, height / 2, 0],
    position: [width / 2, height / 2, 0],
    width: width,
    height: height,
    rotationX: 90,
    zoom: -1
  });
  const views2d = new OrthographicView({ id: "2d-scene" });
  const views3d = new OrbitView({
    id: "3d-scene",
    orbitAxis: "Z",
    rotationX: 60
  });
  const [v2d, setV2d] = useState(true);
  const click2d = () => {
    setV2d(v2d ? false : true);
  };
  return (
    <>
      <div id="maps">
        <DeckGL
          //views={}
          views={v2d ? views2d : views3d}
          initialViewState={viewport}
          controller={true}
          layers={[
            bboxLayer({
              min: bbox[0],
              max: bbox[1],
              viewport: viewport
            })
          ]}
        />
      </div>
      <div id="ui">
        <button onClick={click2d}> {v2d ? "2D" : "3D"}</button>
      </div>
    </>
  );
};
