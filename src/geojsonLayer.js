import { GeoJsonLayer, COORDINATE_SYSTEM } from "deck.gl";

export default props => {
  const { id = "geojson-layer", data, filled=false, lineWidth=1 } = props;
  return new GeoJsonLayer({
    id,
    data,
    positionFormat: "XY",
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    modelMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    pickable: false,
    stroked: true,
    filled,
    extruded: false,
    lineWidthScale: 1,
    lineWidthMinPixels: 1,
    lineWidthUnits: "pixels",
    wireframe: false,
    getFillColor: [160, 160, 180, 50],
    getLineColor: [160, 160, 180, 200],
    //getRadius: 100,
    getLineWidth: lineWidth,
    getElevation: 0,
    onHover: ({ object, x, y }) => {
      //const tooltip = object.properties.name || object.properties.station;
      /* Update tooltip
         http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
      */
    }
  });
};
