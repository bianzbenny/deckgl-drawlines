import React from 'react';
import { LegendThreshold, LegendOrdinal } from '@vx/legend';
import { scaleThreshold, scaleOrdinal  } from '@vx/scale';

/* const threshold = scaleThreshold({
  domain: [0.02, 0.04, 0.06, 0.08, 0.1],
  range: ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f'],
}); */

const colorArraytoString = (rgba)=>(`rgba(${rgba[0]},${rgba[1]}, ${rgba[2]},${rgba[3]/255})`);
export default (props) => {
   const {contours} = props;
   //why range[] pick up from the second element?
   let domain =[], range = [/* 'rgba(255,255,255,1)' */];
   for (const contour of contours){
      domain.push(contour.threshold);
      range.push(colorArraytoString(contour.color));
   }
   console.log(`domain: ${JSON.stringify(domain)} 
   range: ${JSON.stringify(range)}`);
   const threshold = scaleOrdinal({domain, range});
  return (
    <div style={{width:120, position: 'absolute',
                  bottom: '50px', left: '10px'}}>
      <LegendOrdinal
        scale={threshold}
        direction="column-reverse"
        itemDirection="row-reverse"
        labelMargin="0 20px 0 0"
        shapeMargin="1px 0 0"
      />
    </div>
  );
}
function LegendDemo({ title, children }: { title: string; children: React.ReactNode }) {
   return (
     <div className="legend">
       <div className="title">{title}</div>
       {children}
       <style jsx>{`
         .legend {
           line-height: 0.9em;
           color: #efefef;
           font-size: 10px;
           font-family: arial;
           padding: 10px 10px;
           float: left;
           border: 1px solid rgba(255, 255, 255, 0.3);
           border-radius: 8px;
           margin: 5px 5px;
         }
         .title {
           font-size: 12px;
           margin-bottom: 10px;
           font-weight: 100;
         }
       `}</style>
     </div>
   );
 }