import { LineLayer, COORDINATE_SYSTEM } from "deck.gl";

//min[x, y], max[x, y] corners of bbox
//conver ot lines
const convertToLines = (min, max) => {
  // coordinates y axies is reversed in deck.gl
  return [
    [min, [min[0], max[1]]],
    [[min[0], max[1]], max],
    [max, [max[0], min[1]]],
    [[max[0], min[1]], min],
    [min, max]
  ];
};

export default props => {
  const { min, max } = props;

  const data = convertToLines(min, max);

  const lineLayer = new LineLayer({
    id: "bbox-layer",
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    data: data,
    pickable: false,
    getSourcePosition: d => d[0],
    getTargetPosition: d => d[1],
    getColor: () => [255, 0, 0],
    getWidth: 3
  });

  const layers = [lineLayer];

  return layers;
};
