import { useEffect, useState } from 'react';
import axios from 'axios';

function DataAnalytics( {uid} ){
    const [data, SetData] = useState()

    useEffect(() => {
        (async () => {
          const response = await axios.get(`http://localhost:4000/api/gethistory/${uid}`);
          setData(response.data);
        })();
    }, []);

    return (
        
    )  
}