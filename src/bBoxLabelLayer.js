import { TextLayer, COORDINATE_SYSTEM } from "deck.gl";
const fontSize = 0;
const convertToLabel = (min, max, zBottom = 0, zTop = 0.1) => {
  return [
    {
      coordinates: [min[0], min[1], zBottom],
      label: `(${min[0]},${min[1]}), ${zBottom}`
    },
    {
      coordinates: [max[0], max[1], zTop],
      label: `(${max[0]},${max[1]},${zTop})`
    }
  ];
};

export default props => {
  const { min, max, visible } = props;

  const data = convertToLabel(min, max);

  return new TextLayer({
    id: "bbox-label",
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    modelMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],

    data,
    visible,
    pickable: true,
    getPosition: d => d.coordinates,
    getText: d => d.label,
    getSize: 12,
    getAngle: 45,
    getTextAnchor: "middle",
    getAlignmentBaseline: "center"
  });
};
