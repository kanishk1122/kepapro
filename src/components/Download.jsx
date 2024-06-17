import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link, useParams } from "react-router-dom";
import axios from "../utils/Axios";
import Cookies from "js-cookie";
import { detailsContext } from "../utils/Context";


const Download = () => {
  const { name, seo, episode } = useParams();
  const {loading, setLoading ,allvidoedata ,data} = useContext(detailsContext)

  const url = window.location.href;
  const decodedUrl = decodeURIComponent(url);
  const parts = decodedUrl.split("/");
  const desiredPart = parts.slice(4);

  console.log(typeof(desiredPart[0]));



  return (
    <div>
        {data.filter(item=> item.animename == desiredPart[0] ).map((item,index)=>{
            <div key={index}>
                {item.animename}
            </div>
        })}

    </div>
  )
}

export default Download