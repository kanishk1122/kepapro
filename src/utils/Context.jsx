import { useState, useEffect, createContext } from 'react';
import axios from './Axios';
import Cookies from 'js-cookie';

export const detailsContext = createContext();

const Context = (props) => {
    const [data, setData] = useState([]);
    const [gettoken, settoken] = useState("");
    const [userdata, setuserdata] = useState({});

    const [token, setToken] = useState(Cookies.get("token")); // State to hold the JWT string
    const [decodedToken, setDecodedToken] = useState(""); 
 
    async function jwt_decode(token) {
        if (token) {
            try {
                // Simulate an asynchronous task (e.g., validation with a server)
                await new Promise(resolve => setTimeout(resolve, 100)); // Simulated delay

                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                return JSON.parse(jsonPayload);
            } catch (error) {
                console.error("Error decoding token:", error);
                throw error; // Re-throw the error after logging it
            }
        } else {
            console.log("Token is not available");
            return null; // Return null if no token is provided
        }
    }

    // Function to decode the token
    const decodingToken = async () => {
        try {
            const decoded = await jwt_decode(token); // Decode the token asynchronously
            setDecodedToken(decoded); // Update the decodedToken state with the decoded token
        } catch (error) {
            console.error("Error decoding token:", error); // Log any errors that occur during decoding
        }
        console.log(await jwt_decode(token));
    };

    useEffect(() => {
        console.log("Component mounted");
        decodingToken();
        
        const fetchData = async () => {
            try {
                const response = await axios.get("/getall");
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error if needed
            }
        };

        fetchData(); // Fetch data every 5 seconds
    
    }, [setData]); // Add setData as a dependency

    return (
        <detailsContext.Provider value={[data, setData, gettoken, settoken]}>
            {props.children}
        </detailsContext.Provider>
    );
};

export default Context;
