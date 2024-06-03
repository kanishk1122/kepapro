import React, { useContext } from 'react';
import { detailsContext } from '../utils/Context';
import Loadinggif from '../assets/public/images/Loading.gif';
import ReactCurvedText from 'react-curved-text';
import '../assets/public/css/Loading.css';

const Loading = () => {
    const { loading, setLoading } = useContext(detailsContext);
    
    console.log(loading);

    const textcolor = {
        color: "rgb(194,78,92)",
        background:
          "linear-gradient(90deg, rgba(194,78,92,1) 0%, rgba(121,9,19,1) 13%, rgba(242,6,33,1) 27%, rgba(168,69,82,1) 56%, rgba(243,6,42,1) 70%, rgba(0,212,255,1) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      };

    return (
        <div className='flex  bg-[#858585] w-full  h-screen justify-center items-center'>
            <img src={Loadinggif} className='w-[200px] h-[200px]' alt="" />
          <div className='absolute'>
          <ReactCurvedText
                width={400}
                height={200}
                cx={200}
                cy={100}
                rx={100}
                ry={100}
                startOffset={20}
                reversed={false}
                text="Kepapro - Kepapro - Kepapro - Kepapro - Kepapro - "
                textProps={{
                    style: {
                        ...textcolor,
                        fontSize: 26.5,
                        animation: "rotateAnimation 5s linear infinite",
                        transformOrigin: "center",
                    }
                }} // Apply CSS animation
                className="rotater absolute top-0 bottom-10"
            />
          </div>
        </div>
    );
};

export default Loading;
