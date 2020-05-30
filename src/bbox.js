//import * as turf from "turf";
import bbox from '@turf/bbox'
export default geojson => {
  let box = bbox(geojson);
  //console.log(box);
  return [[box[0], box[1]], [box[2], box[3]]];
};
