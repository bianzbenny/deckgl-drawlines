import {useState, useEffect} from 'react';
export default function(props) {
   const {url} = props;
   const [data, setData] = useState();
   const [isLoading, setIsLoading] = useState(false);
   useEffect(() => {
      console.log('fetch resources');
      setIsLoading(true);
      fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setIsLoading(false);
        console.log('fetch finished');
      }); 
   }, 
   [url]); 
   return {isLoading, data};
}