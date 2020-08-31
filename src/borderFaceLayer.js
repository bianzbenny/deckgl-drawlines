import {PolygonLayer, COORDINATE_SYSTEM } from "deck.gl";
import convertCoords3d from './utils/borderToFaces';
import borderToFaces from "./utils/borderToFaces";
export default props => {
  const { 
    id="polygon-layer", 
    data, 
    stroked=true, 
    filled=true,
    extruded=false,
    wireframe = false,
    elevationScale=1,
    zTop = 1,
    zBottom = 0, 
    visible = false

  } = props;
   let borderFaces = borderToFaces({feature:data, zTop, zBottom, elevationScale});
  return new PolygonLayer({
    id,
    data: borderFaces,
    getPolygon: d=>d,
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    modelMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    pickable: false,
    stroked,
    filled,
    extruded,
    lineWidthScale: 1,
    lineWidthMinPixels: 1,
    lineWidthUnits: "pixels",
    wireframe: false,
    highlightColor:[255, 0, 0, 200],
    getFillColor: [255, 0, 0, 200],
    getLineColor: [255, 0, 0, 200],
    //getRadius: 100,
    getLineWidth: 2,
    visible
  });
};
