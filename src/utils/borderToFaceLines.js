/**
 * turns model boundary geometry into lines (two vertical lines and two horizontal lines)
 * output format is deckGL lines format
 * @param {*} param0 
 */
export default function ({geometry, vertialLinesOnly, zTop, zBottom, elevationScale}){
   let lines = []; 
   for (let i=0; i < geometry.coordinates[0].length-1; i++){
      //vertical line, one veritcal only
      lines.push([[...geometry.coordinates[0][i], zBottom * elevationScale], 
                  [...geometry.coordinates[0][i], zTop * elevationScale]]);
      //two horizontal lines, top and bottom
      if(!vertialLinesOnly){
         lines.push([[...geometry.coordinates[0][i], zBottom * elevationScale], 
            [...geometry.coordinates[0][i+1], zBottom * elevationScale]]);
         lines.push([[...geometry.coordinates[0][i], zTop * elevationScale], 
               [...geometry.coordinates[0][i+1], zTop * elevationScale]]);
      }

   }
   return lines;
}