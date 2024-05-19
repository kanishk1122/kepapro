import React, { useState } from "react";
import jwt_decode from "jwt-decode"; // Import the jwt-decode library

const DecodedToken = () => {
  const [token, setToken] = useState(""); // State to hold the JWT string
  const [decodedToken, setDecodedToken] = useState(null); // State to hold the decoded token

  // Function to handle changes in the input field
  const handleChange = (event) => {
    setToken(event.target.value); // Update the token state with the input value
  };

  // Function to decode the token
  const decodeToken = () => {
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
        <input type="text" id="token" value={token} onChange={handleChange} />
        <button onClick={decodeToken}>Decode</button>
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
