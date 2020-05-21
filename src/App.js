import React, { useState } from "react";
import DeckGL, { OrbitView } from "deck.gl";

import renderLayers from "./LineLayers";

const resolution = 10;
export default () => {
  const requestRef = React.useRef();
  const update = React.useRef();
  const width = 800;
  const height = 800;
  const cols = ~~(width / resolution);
  const rows = ~~(height / resolution);
  const grid = [10, 10]; //rows, cols
  const resolution = 10;

  const [viewport] = useState({
    target: [width / 2, height / 2, 0],
    position: [width / 2, height / 2, 0],
    width: width,
    height: height,
    rotationX: 90,
    zoom: -1
  });

  return (
    <>
      <div id="maps">
        <DeckGL
          views={new OrbitView()}
          initialViewState={viewport}
          controller={true}
          layers={renderLayers({
            grid: grid,
            resolution: resolution,
            viewport: viewport
          })}
        />
      </div>
    </>
  );
};
