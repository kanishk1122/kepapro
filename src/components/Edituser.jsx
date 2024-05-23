import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';
import axios from '../utils/Axios';
import Cookies from 'js-cookie';

const Edituser = () => {
  const [userpic, setUserpic] = useState('');
  const [token, setToken] = useState(Cookies.get('token'));
  const [decodedToken, setDecodedToken] = useState(null);
  const [userdata, setUserData] = useState({});
  const [gettoken, setTokenState] = useState('');
  const { username } = useParams();
  const [newusername, setNewusername] = useState('s');

  const jwt_decode = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      const decoded = jwt_decode(token);
      setDecodedToken(decoded);
    }
  }, [token]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(
          '/userdetail',
          { email: username },
          { withCredentials: true }
        );
        setUserData(response.data);
        setNewusername(response.data.username); // Populate newusername with fetched data
        setUserpic(response.data.userpic); // Populate userpic with fetched data
      } catch (error) {
        console.log('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = {
        username: newusername,
        userpic: userpic,
      };

      const response = await axios.post('/userdetailupdate', user, {
        withCredentials: true,
      });
      setTokenState(response.data.token);

      if (response.data.token) {
        alert('User is updated');
        Cookies.set('token', response.data.token, { expires: 30 });
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className='text-3xl text-center font-semibold'>Edit User Details</h1>
      <div className='p-10 h-[90vh]'>
        <form
          onSubmit={handleSubmit}
          className='bg-zinc-800 overflow-hidden rounded-3xl w-full h-full flex flex-col gap-7 items-center'
        >
          <div className='w-full h-fit flex flex-wrap justify-around items-center gap-5 p-3 bg-zinc-600'>
            <div className='w-[20%] h-full flex flex-col justify-center items-center gap-3'>
              <div className='w-[160px] overflow-hidden h-[160px] bg-zinc-700 rounded-full'>
                <img
                  className='w-full h-full object-cover'
                  src={userpic}
                  alt=''
                />
              </div>
              <input
                type='text'
                className='h-[30px] px-2 outline-none w-full bg-zinc-900 rounded-full placeholder:text-zinc-600 min-w-[200px]'
                placeholder='Enter your image link'
                value={userpic}
                onChange={(e) => setUserpic(e.target.value)}
              />
            </div>
            <div className='bg-zinc-700 w-1/2 p-3 rounded-2xl flex justify-center items-center flex-col gap-4'>
              <h2 className='text-xl font-semibold'>Enter your new username</h2>
              <input
                type='text'
                className='w-1/2 bg-zinc-500 rounded-full p-3 h-[50px] text-[35px] outline-none'
                value={newusername}
                onChange={(e) => setNewusername(e.target.value)}
              />
            </div>
          </div>
          <input
            type='submit'
            className='bg-blue-700 px-3 py-2 rounded-full text-xl'
            value='Update'
          />
        </form>
      </div>
    </div>
  );
};

export default Edituser;
