import React, { useContext, useEffect, useState } from "react";
import { detailsContext } from "../utils/Context";
import Cookies from "js-cookie";
// Import the default export from jwt-decode




const DecodedToken = () => {
// State to hold the decoded token
  const [gettoken,settoken] = useContext(detailsContext)
  const [token, setToken] = useState(Cookies.get("token")); // State to hold the JWT string
  const [decodedToken, setDecodedToken] = useState(gettoken); 

  function jwt_decode (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));


    return JSON.parse(jsonPayload);

    
}



  // Function to decode the token
  const decodingToken = () => {
    try {
      const decoded = jwt_decode(token); // Decode the token
      setDecodedToken(decoded); // Update the decodedToken state with the decoded token
    } catch (error) {
      console.error("Error decoding token:", error); // Log any errors that occur during decoding
    }
  };

  useEffect(()=>{
    decodingToken()
  })

  return (
    <div>
      <h2>Decode JWT</h2>
      <div>
        <label htmlFor="token">Enter JWT:</label>
        <input type="text" id="token" value={token} className="bg-transparent" onChange={(e)=>setToken(e.target.value)} />
        <button onClick={decodingToken}>Decode</button>
      </div>
      {decodedToken && (
        <div>
          <h3>Decoded Token:</h3>
          <pre>{JSON.stringify(decodedToken)}</pre> {/* Display the decoded token */}
        </div>
      )}
    </div>
  );
};

export default DecodedToken;
