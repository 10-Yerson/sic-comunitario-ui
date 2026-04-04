'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import Link from 'next/link';
import {
  FiUsers, FiUserCheck, FiCalendar, FiUpload, FiPlusCircle, FiChevronRight
} from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState({ encargados: 0, comuneros: 0, eventos: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, residentsRes, eventsRes] = await Promise.all([
          axios.get('/api/user'),
          axios.get('/api/resident'),
          axios.get('/api/event')
        ]);
        setStats({
          encargados: usersRes.data.length || 0,
          comuneros: residentsRes.data.length || 0,
          eventos: eventsRes.data.length || 0
        });
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      {/* HEADER */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">Sistema Integral Comunitario</p>
        <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
        <p className="text-gray-400 text-sm mt-0.5">Resumen general del sistema</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatCard
          icon={<FiUsers size={20} />}
          title="Encargados"
          value={stats.encargados}
          href="/admin/secret"
          color="bg-blue-50 text-blue-600"
          bar="bg-blue-400"
          emoji="👥"
        />
        <StatCard
          icon={<FiUserCheck size={20} />}
          title="Habitantes"
          value={stats.comuneros}
          href="/admin/users"
          color="bg-emerald-50 text-emerald-600"
          bar="bg-emerald-400"
          emoji="🏘️"
        />
        <StatCard
          icon={<FiCalendar size={20} />}
          title="Eventos"
          value={stats.eventos}
          href="/admin/event"
          color="bg-purple-50 text-purple-600"
          bar="bg-purple-400"
          emoji="📅"
        />
      </div>

      {/* ACCIONES RÁPIDAS */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones rápidas</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <QuickAction
            icon={<FiUpload size={18} />}
            text="Importar Habitantes"
            desc="Carga masiva desde Excel"
            href="/admin/upload"
            color="from-teal-500 to-emerald-500"
          />
          <QuickAction
            icon={<FiPlusCircle size={18} />}
            text="Crear Usuario"
            desc="Secretario o Colaborador"
            href="/admin/colaborador"
            color="from-indigo-500 to-blue-600"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, href, color, bar, emoji }) {
  return (
    <Link href={href}>
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${color}`}>{title}</span>
          <span className="text-xl">{emoji}</span>
        </div>
        <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
        <div className="flex items-center justify-between">
          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden mr-3">
            <div className={`h-full ${bar} rounded-full`} style={{ width: value > 0 ? '100%' : '0%', transition: 'width 0.8s ease' }} />
          </div>
          <FiChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
        </div>
      </div>
    </Link>
  );
}

function QuickAction({ icon, text, desc, href, color }) {
  return (
    <Link href={href}>
      <div className={`bg-gradient-to-br ${color} text-white rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              {icon}
            </div>
            <div>
              <p className="font-bold text-sm">{text}</p>
              <p className="text-white/70 text-xs mt-0.5">{desc}</p>
            </div>
          </div>
          <FiChevronRight size={16} className="text-white/50 group-hover:text-white transition-colors" />
        </div>
      </div>
    </Link>
  );
}