import { TextLayer, COORDINATE_SYSTEM } from "deck.gl";
const fontSize = 16;
const convertToLabel = (min, max) => {
  return [
    {
      coordinates: [min[0], min[1] - fontSize],
      label: `(${min[0]},${min[1]})`
    },
    {
      coordinates: [max[0], max[1] + fontSize],
      label: `(${max[0]},${max[1]})`
    }
  ];
};

export default props => {
  const { min, max } = props;

  const data = convertToLabel(min, max);
  console.log(data);
  return new TextLayer({
    id: "bbox-label",
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    data,
    pickable: true,
    getPosition: d => d.coordinates,
    getText: d => d.label,
    getSize: fontSize,
    getAngle: 45,
    getTextAnchor: "middle",
    getAlignmentBaseline: "center"
  });
};
