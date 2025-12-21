'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import Link from 'next/link';
import {
  FiUsers,
  FiUserCheck,
  FiCalendar,
  FiUpload,
  FiPlusCircle
} from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState({
    encargados: 0,
    comuneros: 0,
    eventos: 0
  });

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
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Panel de Administración
        </h1>
        <p className="text-gray-600 mt-2">
          Sistema Integral Comunitario (SIC)
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          icon={<FiUsers size={32} />}
          title="Encargados"
          value={stats.encargados}
          href="/admin/secret"
        />

        <StatCard
          icon={<FiUserCheck size={32} />}
          title="Habitantes"
          value={stats.comuneros}
          href="/admin/users"
        />

        <StatCard
          icon={<FiCalendar size={32} />}
          title="Eventos"
          value={stats.eventos}
          href="/admin/event"
        />
      </section>

      <section className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Acciones rápidas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <QuickAction
            icon={<FiUpload />}
            text="Importar Habitantes (Excel)"
            href="/admin/upload"
            color="bg-[#31DCB7]"
          />

          <QuickAction
            icon={<FiPlusCircle />}
            text="Crear usuario (Secretario / Colaborador)"
            href="/admin/events/create"
            color="bg-[#5060BC]"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, title, value, href }) {
  return (
    <Link href={href}>
      <div className="cursor-pointer bg-white p-6 rounded-xl shadow border hover:shadow-lg transition">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gray-100 rounded-full text-gray-700">
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function QuickAction({ icon, text, href, color }) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 text-white px-6 py-4 rounded-xl shadow cursor-pointer hover:opacity-90 ${color}`}
      >
        {icon}
        <span className="font-medium">{text}</span>
      </div>
    </Link>
  );
}
