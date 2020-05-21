import { LineLayer, COORDINATE_SYSTEM } from "deck.gl";

const convertData = (grid, resolution) => {
  const cols = grid.length;
  const rows = grid[0].length;
  // coordinates y axies is reversed in deck.gl
  let result = [
    [[0, 0], [0, 800]],
    [[0, 800], [800, 800]],
    [[800, 800], [800, 0]],
    [[800, 0], [0, 0]],
    [[0, 0], [800, 800]]
  ];

  /* for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      result.push({
        x1: x * resolution,
        y1: y * resolution,
        x2: x,
        iy: y,
        value: grid[x][y]
      });
    }
  } */
  return result;
};

export default props => {
  const { grid, resolution } = props;

  if (!grid) return;

  const data = convertData(grid, resolution);

  const lineLayer = new LineLayer({
    id: "line-layer",
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    data: data,
    pickable: false,
    cellSize: resolution,
    getSourcePosition: d => d[0],
    getTargetPosition: d => d[1],
    getColor: () => [255, 0, 0],
    getWidth: 3
  });

  const layers = [lineLayer];

  return layers;
};
