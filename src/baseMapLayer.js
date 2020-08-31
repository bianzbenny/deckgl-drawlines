import { BitmapLayer, COORDINATE_SYSTEM } from "deck.gl";

export default props => {
  const { id="base-image", min, max, visible=true } = props;

  return new BitmapLayer({
    id,
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    //modelMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],

    image://'resources/IMAG0277.jpg',
    "https://raw.githubusercontent.com/uber-common/deck.gl-data/master/website/sf-districts.png",

    //bounds:[0, 0, 199000, 154000],
    bounds:[...min, ...max],
    visible,
    desaturate: 0,
    transparentColor: [0, 0, 0, 0],
    tintColor: [255, 255, 255]
  });
};
