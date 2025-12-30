'use client'

import React, { useEffect, useState } from "react";
import axios from '../../../utils/axios'
import Link from 'next/link';
import { MdVerified } from "react-icons/md";
import { 
  FiCalendar, 
  FiUsers, 
  FiUser, 
  FiFolder, 
  FiTrendingUp,
  FiClock,
  FiMapPin
} from "react-icons/fi";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* ========== HEADER CON HERO ========== */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            
            {/* Usuario info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  className="h-16 w-16 md:h-20 md:w-20 rounded-2xl object-cover border-4 border-white/30 shadow-xl"
                  src={
                    data?.profilePicture ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Profile"
                />
                {data?.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                    <MdVerified className="text-blue-500" size={20} />
                  </div>
                )}
              </div>
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  ¡Hola, {data?.name}!
                </h1>
                <p className="text-green-100 text-sm md:text-base mt-1">
                  Bienvenido a tu panel de colaborador
                </p>
              </div>
            </div>

            {/* Link a perfil (desktop) */}
            <Link 
              href="/client/perfil"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all backdrop-blur-sm"
            >
              <FiUser size={18} />
              <span className="font-medium">Ver Perfil</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========== CONTENIDO PRINCIPAL ========== */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ========== ESTADÍSTICAS ========== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Total de eventos */}
          <StatCard
            icon={<FiCalendar className="text-purple-600" size={32} />}
            title="Total de Eventos"
            value={stats.total || 0}
            subtitle="Eventos gestionados"
            gradient="from-purple-500 to-indigo-600"
            iconBg="bg-purple-100"
          />

          {/* Trabajos comunitarios */}
          <StatCard
            icon={<FiUsers className="text-blue-600" size={32} />}
            title="Trabajos Comunitarios"
            value={stats.trabajos || 0}
            subtitle="Actividades organizadas"
            gradient="from-blue-500 to-cyan-600"
            iconBg="bg-blue-100"
          />

          {/* Reuniones */}
          <StatCard
            icon={<FiClock className="text-green-600" size={32} />}
            title="Reuniones"
            value={stats.reuniones || 0}
            subtitle="Reuniones realizadas"
            gradient="from-green-500 to-emerald-600"
            iconBg="bg-green-100"
          />
        </div>

        {/* ========== ACCIONES RÁPIDAS ========== */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <FiTrendingUp className="text-gray-700" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">
              Acciones Rápidas
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <ActionButton
              icon={<FiCalendar size={24} />}
              label="Mis Eventos"
              description="Gestionar eventos"
              href="/client/gestion"
              color="blue"
            />

            <ActionButton
              icon={<FiFolder size={24} />}
              label="Historial"
              description="Ver actividades"
              href="/client/history"
              color="purple"
            />

            <ActionButton
              icon={<FiUser size={24} />}
              label="Mi Perfil"
              description="Editar datos"
              href="/client/perfil"
              color="green"
            />

            <ActionButton
              icon={<FiMapPin size={24} />}
              label="Crear Evento"
              description="Nuevo evento"
              href="/client/event"
              color="orange"
            />
          </div>
        </div>

        {/* ========== INFORMACIÓN ADICIONAL ========== */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Información del Colaborador
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <InfoItem 
              label="Nombre completo" 
              value={`${data?.name} ${data?.apellido}`} 
            />
            <InfoItem 
              label="Email" 
              value={data?.email} 
            />
            <InfoItem 
              label="Rol" 
              value="Colaborador Comunitario" 
            />
            <InfoItem 
              label="Estado de cuenta" 
              value={
                <span className="flex items-center gap-2">
                  {data?.isVerified ? (
                    <>
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-green-700 font-medium">Verificado</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      <span className="text-yellow-700 font-medium">Pendiente</span>
                    </>
                  )}
                </span>
              } 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== COMPONENTES ========== */

function StatCard({ icon, title, value, subtitle, gradient, iconBg }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className={`${iconBg} p-3 rounded-xl`}>
          {icon}
        </div>
        <div className={`px-3 py-1 bg-gradient-to-r ${gradient} text-white text-xs font-bold rounded-full`}>
          +{value}
        </div>
      </div>
      
      <h3 className="text-gray-600 font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function ActionButton({ icon, label, description, href, color }) {
  const colors = {
    blue: 'from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700',
    purple: 'from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700',
    green: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
    orange: 'from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
  };

  return (
    <Link
      href={href}
      className={`
        group relative overflow-hidden
        bg-gradient-to-br ${colors[color]}
        text-white rounded-2xl shadow-lg
        p-6 
        hover:shadow-2xl hover:scale-105
        transition-all duration-300
      `}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center gap-3">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <p className="font-bold text-base mb-1">{label}</p>
          <p className="text-xs text-white/80">{description}</p>
        </div>
      </div>
    </Link>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span className="text-gray-800 font-semibold">{value}</span>
    </div>
  );
}