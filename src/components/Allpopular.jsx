import React, { useContext, useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { detailsContext } from '../utils/Context';
import { Link, useParams } from 'react-router-dom';

const AllAnime = () => {
  const { type } = useParams();
  const {data} = useContext(detailsContext);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filterData = () => {
      if (data.length === 0) {
        return; // Return if data is empty
      }
      // Filter data based on type
      const filteredByType = data.filter(item => item.season === 1 && item.popular === true);
      setFilteredData(filteredByType);
    };

    filterData(); // Call filter function
  }, [data, type]); // Add data and type as dependencies

  return (
    <>
      <Navbar />
      <div className='p-3 flex gap-10 flex-wrap'>
        {filteredData.map((item, index) => (
          <Link key={index} to={`/watch/${item.animename}/${item.season}/${item.ep}`}>
            <div className='w-[40vw] max-w-[140px] flex flex-col h-[30vh] rounded-lg justify-center items-center bg-zinc-800 p-3'>
              <div className='w-full h-[200px] rounded  overflow-hidden'>

              <img  className='w-full h-full object-cover' src={item.thumnail} alt={item.animename} />
              </div >
              <h2>{item.animename}</h2>
              <p>Watch now</p>
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default AllAnime;
