import { useState, useEffect, createContext } from 'react';
import axios from './Axios';


export const detailsContext = createContext();

const Context = (props) => {
    const [data, setData] = useState([]);
    const [gettoken,settoken] = useState("")
   // Renamed to follow conventions

    useEffect(() => {
        console.log("Component mounted");
        
        const fetchData = async () => {
            try {
                const response = await axios.get("/getall");
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error if needed
            }
        };
    
       fetchData() // Fetch data every 5 seconds
    
       
    }, [setData]); // Add setData as a dependency

    return (
        <detailsContext.Provider value={[data, setData , gettoken , settoken]}>
            {props.children}
        </detailsContext.Provider>
    );
};

export default Context;
