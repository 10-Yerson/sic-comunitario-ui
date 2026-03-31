'use client'

import React, { useEffect, useState } from "react";
import axios from '../../../utils/axios'
import Link from 'next/link';
import { MdVerified } from "react-icons/md";
import {
  FiCalendar, FiUsers, FiUser, FiFolder,
  FiTrendingUp, FiClock, FiMapPin, FiChevronRight
} from "react-icons/fi";

export default function Welcome() {
  const [data, setData] = useState({});
  const [stats, setStats] = useState({ total: 0, reuniones: 0, trabajos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/auth/user-info');
        const userId = data.userId;
        const userRes = await axios.get(`/api/user/${userId}`);
        setData(userRes.data);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">

      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto px-6 py-9">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="relative flex-shrink-0">
                <img
                  className="h-16 w-16 rounded-2xl object-cover ring-4 ring-green-100"
                  src={data?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="Profile"
                />
                {data?.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
                    <MdVerified className="text-blue-500" size={18} />
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-0.5">Panel de colaborador</p>
                <h1 className="text-2xl font-bold text-gray-800">¡Hola, {data?.name}! 👋</h1>
                <p className="text-gray-400 text-sm mt-0.5">Aquí tienes un resumen de tu actividad</p>
              </div>
            </div>

            <Link
              href="/client/perfil"
              className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all text-sm font-medium text-gray-600"
            >
              <FiUser size={15} /> Ver perfil
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 py-8 space-y-8">

        <div className="grid grid-cols-3 gap-5">
          <StatCard
            icon={<FiCalendar size={20} />}
            label="Total eventos"
            value={stats.total || 0}
            color="purple"
          />
          <StatCard
            icon={<FiUsers size={20} />}
            label="Trabajos comunitarios"
            value={stats.trabajos || 0}
            color="blue"
          />
          <StatCard
            icon={<FiClock size={20} />}
            label="Reuniones"
            value={stats.reuniones || 0}
            color="green"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <FiTrendingUp className="text-gray-500" size={16} />
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Acciones rápidas</h2>
            </div>
            <div className="space-y-2">
              {[
                { icon: <FiCalendar size={16} />, label: 'Mis Eventos', desc: 'Ver y gestionar tus eventos', href: '/client/gestion', color: 'text-blue-500 bg-blue-50' },
                { icon: <FiFolder size={16} />, label: 'Historial', desc: 'Consultar actividades pasadas', href: '/client/gestion', color: 'text-purple-500 bg-purple-50' },
                { icon: <FiUser size={16} />, label: 'Mi Perfil', desc: 'Editar información personal', href: '/client/perfil', color: 'text-green-500 bg-green-50' },
                { icon: <FiMapPin size={16} />, label: 'Crear Evento', desc: 'Organizar un nuevo evento', href: '/client/event', color: 'text-orange-500 bg-orange-50' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50 transition-all group"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <FiChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Info del colaborador */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

            <div className="bg-gray-50 border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-4">
                <img
                  className="h-14 w-14 rounded-xl object-cover ring-4 ring-gray-200"
                  src={data?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="Profile"
                />
                <div>
                  <p className="text-gray-800 font-bold text-lg">{data?.name} {data?.apellido}</p>
                  <p className="text-gray-400 text-xs">Colaborador Comunitario</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {data?.isActive ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-600 text-xs font-medium">Cuenta verificada</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                        <span className="text-yellow-600 text-xs font-medium">Pendiente de verificación</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 space-y-1">
              {[
                { label: 'Nombre completo', value: `${data?.name || ''} ${data?.apellido || ''}`, icon: '👤' },
                { label: 'Email', value: data?.email, icon: '✉️' },
                { label: 'Rol', value: 'Colaborador Comunitario', icon: '🏷️' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 text-right max-w-[55%] truncate">{item.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🔒</span>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</span>
                </div>
                {data?.isActive ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-lg">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-green-600">Verificado</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 rounded-lg">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                    <span className="text-xs font-bold text-yellow-600">Pendiente</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', bar: 'bg-purple-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' },
    green: { bg: 'bg-green-50', text: 'text-green-600', bar: 'bg-green-500' },
  };
  const c = colors[color];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.bg} ${c.text}`}>
          {icon}
        </div>
        <span className={`text-xs font-bold ${c.text}`}>Total</span>
      </div>
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      <p className="text-xs text-gray-400 mb-3">{label}</p>
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${c.bar} rounded-full`} style={{ width: value > 0 ? '100%' : '0%', transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );
}