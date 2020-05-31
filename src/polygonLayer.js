import {PolygonLayer, COORDINATE_SYSTEM } from "deck.gl";

export default props => {
  const { id="polygon-layer", data } = props;
  return new PolygonLayer({
    id,
    data,
    getPolygon: d => d.geometry.coordinates,
    positionFormat: "XY",
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    modelMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    pickable: false,
    //stroked: true,
    //filled: true,
    extruded: true,
    lineWidthScale: 1,
    lineWidthMinPixels: 2,
    lineWidthUnits: "pixels",
    wireframe: false,
    getFillColor: [160, 160, 180, 50],
    getLineColor: [160, 160, 180, 200],
    //getRadius: 100,
    getLineWidth: 2,
    getElevation: 0.05,
    onHover: ({ object, x, y }) => {
      //const tooltip = object.properties.name || object.properties.station;
      /* Update tooltip
         http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
      */
    }
  });
};
