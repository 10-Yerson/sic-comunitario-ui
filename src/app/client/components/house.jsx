'use client'

import React, { useEffect, useState } from "react";
import axios from '../../../utils/axios'
import Link from 'next/link';
import { MdVerified } from "react-icons/md";
import { FiCalendar, FiUsers, FiUser, FiFolder } from "react-icons/fi";

export default function Welcome() {

  const [data, setData] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    reuniones: 0,
    trabajos: 0
  });
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {

        // 1️⃣ obtener usuario logueado
        const { data } = await axios.get('/api/auth/user-info');
        const userId = data.userId;

        const userRes = await axios.get(`/api/user/${userId}`);
        setData(userRes.data);

        // 2️⃣ obtener eventos del colaborador
        const eventsRes = await axios.get('/api/event/my');

        setStats(eventsRes.data.stats || {});

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
    return (
      <div className="w-full flex justify-center py-10 text-gray-500">
        Cargando panel...
      </div>
    );
  }


  return (
    <>
      {/* HEADER */}
      <main className="w-full flex pt-4 pb-4 justify-between">

        <div className="flex items-center px-4">
          <p className="flex gap-2 font-semibold text-gray-800 text-xl md:text-2xl items-center">
            {data?.name} {data?.apellido}
            {data?.isVerified && <MdVerified className="text-blue-500" />}
          </p>
        </div>

        <aside className="px-6 flex items-center gap-3">
          <Link href="/client/profile">
            <img
              className="h-12 w-12 rounded-full object-cover border"
              src={
                data?.profilePicture ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
            />
          </Link>
        </aside>

      </main>

      <div className="px-6 pb-20">

        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Panel del Colaborador
        </h2>

        {/* STATS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

          <StatCard
            icon={<FiCalendar size={28} />}
            title="Eventos de Trabajo"
            value={stats.trabajos}
            color="bg-blue-50 text-blue-700"
          />

          <StatCard
            icon={<FiCalendar size={28} />}
            title="Reuniones"
            value={stats.reuniones}
            color="bg-green-50 text-green-700"
          />

        </section>

        {/* QUICK ACTIONS */}
        <h3 className="text-md font-semibold text-gray-700 mb-3">
          Acciones rápidas
        </h3>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <ActionButton
            icon={<FiCalendar size={22} />}
            label="Mis Eventos"
            href="/client/event"
          />

          <ActionButton
            icon={<FiUsers size={22} />}
            label="Residentes"
            href="/client/residents"
          />

          <ActionButton
            icon={<FiFolder size={22} />}
            label="Historial"
            href="/client/history"
          />

          <ActionButton
            icon={<FiUser size={22} />}
            label="Mi Perfil"
            href="/client/profile"
          />

        </section>

      </div>
    </>
  );
}


/* ===== COMPONENTES ===== */

function StatCard({ icon, title, value, color }) {
  return (
    <div className={`p-5 rounded-2xl shadow border ${color} flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <p className="font-medium">{title}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function ActionButton({ icon, label, href }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 bg-white shadow-md border rounded-2xl py-6 hover:bg-gray-100 transition"
    >
      {icon}
      <span className="font-medium text-gray-700">{label}</span>
    </Link>
  );
}
