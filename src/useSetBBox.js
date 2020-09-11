import {useState, useEffect} from 'react';
import boundingbox from "./bbox";

export default function(props) {
   const {border} = props;
   const [bbox, setBbox] = useState([[0,0],[1,1]]);
   useEffect(() => {
      if(!border)
        return;
      setBbox(boundingbox(border));
    }, [border]);  
   return {bbox};
}