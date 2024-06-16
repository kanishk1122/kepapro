import { useState, useEffect, createContext, useMemo } from 'react';
import axios from './Axios';
import Cookies from 'js-cookie';
import videoContent from './test.videos.json'

export const detailsContext = createContext();

//this file is added to gitignore for testing on locally

const Context = (props) => {
    const [data, setData] = useState(videoContent.filter(item=>item.ep===1));
    const [gettoken, settoken] = useState("");
    const [loading, setLoading] = useState(false);  // Initial loading state to true
    const [allvidoedata, setallvidoedata] = useState([])
    const [token, setToken] = useState(Cookies.get("token")); // State to hold the JWT string
    const [decodedToken, setDecodedToken] = useState({}); 

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
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         const response = await axios.get("/watchall");
    //         setallvidoedata(response.data);
    //         if (response.data) {
    //           setLoading(false)
    //         }
    //       } catch (error) {
    //         console.error("Error fetching data:", error);
    //       }
    //     };
    
    //     fetchData();
    //   }, []);

    useEffect(() => {
        console.log("Component mounted");
        decodingToken();
        
        const fetchData = async () => {
            try {
                 // Set loading to true before fetching data
                const response = await axios.get("/getall");
                setData(response.data);
                if(response.data){
                    setLoading(false)
                } // Set loading to false after data is fetched
            } catch (error) {
                console.error("Error fetching data:", error);
                 // Set loading to false if an error occurs
            }
        };

        fetchData(); // Fetch data on component mount
    
    }, [token]); // Add token as a dependency

    useEffect(() => {
        console.log(loading);
    }, [loading]); // Log loading state when it changes

    const [userdata, setuserdata] = useState(null);

    useEffect(() => {
        if (token) {
            jwt_decode(token).then(decoded => setuserdata(decoded));
        }
    }, [token]);

    console.log(userdata);

    return (
        <detailsContext.Provider value={{data, loading,allvidoedata, setallvidoedata, setLoading, setData, gettoken, settoken, userdata, setuserdata}}>
            {props.children}
        </detailsContext.Provider>
    );
};

export default Context;
