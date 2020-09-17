/**
 * create a generator from features list, only return active feature
 * @param {*} features 
 */
/* export default function* (features){
   for (const feature of features){
      if(feature.properties.layer0.isActive === 1)
         yield feature;
      else continue;
   }
   return;
} */

export default function(features){
   let activeFeatures =[];
   //[min, max] for layer top and bottom
   let elevationBounds = {top:[0,0], bottom:[0,0]};
   if(features.length)
   {
      elevationBounds.top.fill(features[0].properties.layer0.top);
      elevationBounds.bottom.fill(features[0].properties.layer0.bottom);
   }
   for (const feature of features){
      if(feature.properties.layer0.isActive === 1){
         activeFeatures.push(feature);
         //min, max of top and bottom
         elevationBounds.top[0] = elevationBounds.top[0] < feature.properties.layer0.top ?elevationBounds.top[0]:feature.properties.layer0.top;
         elevationBounds.top[1] = elevationBounds.top[1] > feature.properties.layer0.top ?elevationBounds.top[1]:feature.properties.layer0.top;
         elevationBounds.bottom[0] = elevationBounds.bottom[0] < feature.properties.layer0.bottom ?elevationBounds.bottom[0]:feature.properties.layer0.bottom;
         elevationBounds.bottom[1] = elevationBounds.bottom[1] > feature.properties.layer0.bottom ?elevationBounds.bottom[1]:feature.properties.layer0.bottom;
      }
      
   }
   console.log(`active features: ${activeFeatures.length} elevation bounds: ${JSON.stringify(elevationBounds)}`);
   return {activeFeatures, elevationBounds};
}