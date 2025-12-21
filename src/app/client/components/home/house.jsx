'use client'

import React, { useEffect, useState } from "react";
import axios from '../../../../utils/axios'
import Link from 'next/link';
import { MdVerified } from "react-icons/md";

export default function Welcome() {


  const [data, setdata] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfoResponse = await axios.get('/api/auth/user-info');
        const userId = userInfoResponse.data.userId;

        if (!userId) {
          throw new Error('ID del usuario no encontrado en la respuesta del servidor');
        }

        const response = await axios.get(`/api/user/${userId}`);
        setdata(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <main className="w-full flex pt-2 pb-2 flex-1 justify-between rounded-l-lg transition duration-500 ease-in-out overflow-hidden">
        <div className="flex items-center text-2xl md:text-3xl px-2">
        <p className="flex gap-x-2 font-semibold text-gray-800 text-xl md:text-2xl items-center">
            {data.name} {data.apellido}
            {data.isVerified === true && (
              <MdVerified
                className="text-blue-500"
                title="Cuenta verificada"
              />
            )}
          </p>
        </div>
        <aside className="px-4 md:px-6 py-4 flex flex-col  rounded-r-lg overflow-hidden">
          <div className="flex items-center justify-end gap-x-6 md:gap-x-9">
            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/client/profile">
                <img
                  className="h-10 w-10 md:h-14 md:w-14 rounded-full object-cover cursor-pointer"
                  src={data.profilePicture || 'https://metro.co.uk/wp-content/uploads/2018/09/sei_30244558-285d.jpg?quality=90&strip=all'}
                  alt="tempest profile"
                />
              </Link>
              <button
                className="ml-1 focus:outline-none"
              >
                <svg className="h-4 w-4 md:h-6 md:w-6 fill-current" viewBox="0 0 192 512">
                  <path
                    d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </aside>
      </main>
      <div className="flex select-none md:flex-row mb-24 lg:mb-0">
        Hola user 
      </div>
    </>
  );
}
