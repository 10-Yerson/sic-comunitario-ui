'use client';

import { useEffect, useState } from 'react';
import axios from '../../../utils/axios'
import { FiUsers, FiFileText, FiVideo, FiPlusCircle } from "react-icons/fi";

export default function Dashboard() {

  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/user/`);
        const count = Array.isArray(response.data) ? response.data.length : 0;
        setUserCount(count);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        setUserCount(0);
      }
    };
    fetchData();
  }, []);
  

  return (
    <div className="p-8 bg-white min-h-screen text-gray-900 flex flex-col">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">Panel de Administración</h1>
        <p className="text-gray-600 mt-2">Monitorea y gestiona tu plataforma de manera eficiente.</p>
      </header>

      <main className="flex flex-col gap-10">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard icon={<FiUsers size={36} />} title="Usuarios" value={userCount} color="bg-gray-100" />
          <DashboardCard icon={<FiFileText size={36} />} title="Publicaciones" value="342" color="bg-gray-200" />
          <DashboardCard icon={<FiVideo size={36} />} title="Videos" value="126" color="bg-gray-100" />
        </section>

        <section className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <ActionButton icon={<FiPlusCircle size={24} />} text="Agregar Usuario" color="bg-blue-600" />
            <ActionButton icon={<FiPlusCircle size={24} />} text="Crear Publicación" color="bg-green-600" />
            <ActionButton icon={<FiPlusCircle size={24} />} text="Subir Video" color="bg-purple-600" />
          </div>
        </section>
      </main>
    </div>
  );
}

function DashboardCard({ icon, title, value, color }) {
  return (
    <div className={`p-6 rounded-lg shadow-md text-gray-900 ${color} flex flex-col items-center border border-gray-300 transition-transform transform hover:scale-105` }>
      <div className="bg-gray-300 p-5 rounded-full text-gray-800 shadow-md mb-3">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function ActionButton({ icon, text, color }) {
  return (
    <button className={`flex items-center justify-center gap-3 px-6 py-3 rounded-lg shadow-md text-white ${color} hover:bg-opacity-80 transition-all duration-300 w-full text-lg font-medium`}>      
      {icon} {text}
    </button>
  );
}
