/**
 * convert 2d coordinates to 3d coordinates for polygon mesh
 * @param {*} param0 
 */
export default function({
   feature, 
   elevationScale, 
   isTop 
   }) 
{
   const z = elevationScale * (isTop?feature.properties.layer0.top:feature.properties.layer0.bottom)
   //geojson supports polygon rings
   let xyzCoordinates = [[]];
   /* for (const xyCoordinates in feature.geometry.coordinates[0]) {
      xyzCoordinates[0].push([...xyCoordinates, z])
   } */
   for (let i = 0; i < feature.geometry.coordinates[0].length; i++){
      xyzCoordinates[0].push([...feature.geometry.coordinates[0][i], z])
   }
   //console.log('xyzCoordinates', xyzCoordinates[0]);
   return xyzCoordinates;
}