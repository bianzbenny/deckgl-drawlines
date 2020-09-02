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
   for (const feature of features){
      if(feature.properties.layer0.isActive === 1)
      activeFeatures.push(feature);
   }
   console.log(`active features: ${activeFeatures.length}`);
   return activeFeatures;
}