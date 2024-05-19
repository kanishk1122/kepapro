import React, { useState } from "react";
// Import the default export from jwt-decode


const DecodedToken = () => {
  const [token, setToken] = useState(""); // State to hold the JWT string
  const [decodedToken, setDecodedToken] = useState(null); // State to hold the decoded token

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

  return (
    <div>
      <h2>Decode JWT</h2>
      <div>
        <label htmlFor="token">Enter JWT:</label>
        <input type="text" id="token" value={token} onChange={(e)=>setToken(e.target.value)} />
        <button onClick={decodingToken}>Decode</button>
      </div>
      {decodedToken && (
        <div>
          <h3>Decoded Token:</h3>
          <pre>{JSON.stringify(decodedToken, null, 2)}</pre> {/* Display the decoded token */}
        </div>
      )}
    </div>
  );
};

export default DecodedToken;
