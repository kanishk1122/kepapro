import { useState, useEffect, createContext } from 'react';
import axios from './Axios';
import Cookies from 'js-cookie';

export const detailsContext = createContext();

const Context = (props) => {
    const [data, setData] = useState([]);
    const [gettoken,settoken] = useState("");
    const[userdata,setuserdata]= useState({})
   // Renamed to follow conventions


   const [token, setToken] = useState(Cookies.get("token")); // State to hold the JWT string
   const [decodedToken, setDecodedToken] = useState(""); 
 
   function jwt_decode (token) {
   if(token){
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));


    return JSON.parse(jsonPayload);
   }
   else{
    console.log("token is not avalebvle")
   }
 
     
 }
 
 
 
   // Function to decode the token
   const decodingToken = () => {
     try {
       const decoded = jwt_decode(token); // Decode the token
       setDecodedToken(decoded); // Update the decodedToken state with the decoded token
     } catch (error) {
       console.error("Error decoding token:", error); // Log any errors that occur during decoding
     }
     console.log(jwt_decode(token));
   };

    useEffect(() => {
        console.log("Component mounted");
        decodingToken()
        
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
