import { PolygonLayer, COORDINATE_SYSTEM } from "deck.gl";

//min[x, y], max[x, y] corners of bbox
//conver ot lines
const convertToPolygon = (min, max) => {
  // coordinates y axies is reversed in deck.gl
  return [
    [min, [min[0], max[1]]],
    [[min[0], max[1]], max],
    [max, [max[0], min[1]]],
    [[max[0], min[1]], min],
    [min, [min[0], max[1]]]
    //[min, max]
  ];
};

export default props => {
  const { min, max,  
    elevation,
    elevationScale=1,
    wireframe=true,
  } = props;

  const data = convertToPolygon(min, max);
  return new PolygonLayer({
    id: "bbox-polygon-layer",
    data,
    getPolygon: d => d,
    positionFormat: "XY",
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    modelMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    pickable: false,
    stroked: false,
    filled: false,
    extruded: true,
    lineWidthScale: 1,
    lineWidthMinPixels: 2,
    lineWidthUnits: "pixels",
    wireframe,
    getFillColor: [160, 160, 180, 50],
    getLineColor: [255, 0, 0, 100],
    //getRadius: 100,
    getLineWidth: 2,
    getElevation: elevation,
    elevationScale,
    onHover: ({ object, x, y }) => {
      //const tooltip = object.properties.name || object.properties.station;
      /* Update tooltip
         http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
      */
    }
  });
};
