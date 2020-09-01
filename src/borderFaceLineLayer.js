import {LineLayer, COORDINATE_SYSTEM } from "deck.gl";
import borderToFaceLines from "./utils/borderToFaceLines";
export default props => {
  const { 
    id="border-line-layer", 
    data, 
    vertialLinesOnly = true,
    elevationScale=1,
    zTop = 1,
    zBottom = 0, 
    visible=true

  } = props;
   let borderFacesLines = borderToFaceLines({geometry:data, vertialLinesOnly, zTop, zBottom, elevationScale});
  return new LineLayer({
    id,
    data: borderFacesLines,
    getSourcePosition: d=>d[0],
    getTargetPosition: d=>d[1],
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    pickable: false,
    widthScale: 1,
    widthMinPixels: 1,
    widthUnits: "pixels",
    wireframe: false,
    highlightColor:[255, 0, 0, 200],
    getColor: [160, 160, 180, 50],
    //getRadius: 100,
    getWidth: 1,
    visible
  });
};
