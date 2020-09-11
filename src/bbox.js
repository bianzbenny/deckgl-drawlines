//import * as turf from "turf";
import bbox from '@turf/bbox'
export default geojson => {
  //need to be a feature or featue list, not just geometry
  let box = bbox({
    type: "Feature",
    geometry: geojson
  });
  console.log('bbox:', box);
  return [[box[0], box[1]], [box[2], box[3]]];
};
