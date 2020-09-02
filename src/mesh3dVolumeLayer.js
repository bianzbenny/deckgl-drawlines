/**
 * extruded polygon as volume
 */
import {PolygonLayer, COORDINATE_SYSTEM } from "deck.gl";
import convertCoords3d from './utils/convertCoords3d';
export default props => {
  const { 
    id="mesh_volume_layer", 
    data, 
    stroked, 
    filled=true,
    extruded=true,
    wireframe,
    elevationScale=1,
    visible=true

  } = props;
   return new PolygonLayer({
    id,
    data,
    getPolygon: d => convertCoords3d({feature:d, elevationScale, isTop:false}),
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    modelMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    pickable: false,
    stroked,
    filled,
    extruded,
    lineWidthScale: 1,
    lineWidthMinPixels: 1,
    lineWidthUnits: "pixels",
    wireframe,
    getFillColor: [160, 160, 180, 250],
    //getFillColor: d=> d.properties.layer0.isActive === 1 ?[160, 160, 180, 250]:[0,0,0,0],
    getLineColor: [160, 160, 180, 250],
    highlightColor:[255, 0, 0, 200],
    //getRadius: 100,
    getLineWidth: 1,
    getElevation: d=>d.properties.layer0.top,
    elevationScale,
    //need to add elevationScale to trigger polygon re-calculation
    updateTriggers: {
      getPolygon: [elevationScale]},
    onHover: ({ object, x, y }) => {
      //const tooltip = object.properties.name || object.properties.station;
      /* Update tooltip
         http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
      */
    },
    visible
  });
};
