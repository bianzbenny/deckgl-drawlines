import {COORDINATE_SYSTEM } from "deck.gl";
import {ContourLayer} from '@deck.gl/aggregation-layers';

export default props => {
  const { 
      id = 'contourLayer', 
      data, 
      cellSize=1000, 
      contours, 
      isTop,
      visible
   } = props;
   const path = isTop?'top':'bottom';
   return new ContourLayer({
      id,
      data,
      cellSize,
      getPosition: d => d.centroid,
      getWeight: d=>d.properties.layer0[path],
      aggregation:'MAX',
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      contours,
      visible
   });
};
