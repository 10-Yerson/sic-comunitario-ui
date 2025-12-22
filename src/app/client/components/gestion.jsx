'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiEdit,
  FiTrash2,
  FiVideo,
  FiImage
} from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function GestionEventos() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMyEvents = async () => {
    try {
      const res = await axios.get('/api/event/my');
      setEvents(res.data.events);
      setStats(res.data.stats);
    } catch (err) {
      toast.error('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este evento?')) return;

    try {
      await axios.delete(`/api/event/${id}`);
      toast.success('Evento eliminado');
      setEvents(events.filter(e => e._id !== id));
    } catch {
      toast.error('No se pudo eliminar');
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500 animate-pulse">
        Cargando eventos...
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Mis eventos
        </h1>
        <p className="text-gray-500">
          Gestión de reuniones y trabajos comunitarios
        </p>
      </div>

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Stat label="Total" value={stats.total} />
          <Stat label="Reuniones" value={stats.reuniones} />
          <Stat label="Trabajos" value={stats.trabajos} />
          <Stat label="Programados" value={stats.programados} />
        </div>
      )}

      {/* GRID */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {events.map(event => (
          <div
            key={event._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
          >
            {/* MEDIA */}
            {event.media && (
              <div className="relative h-48 bg-black">
                {event.media.type === 'image' ? (
                  <img
                    src={event.media.url}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={event.media.url}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}

                <span className="absolute top-3 left-3 px-3 py-1 text-xs rounded-full bg-black/70 text-white flex items-center gap-1">
                  {event.media.type === 'image' ? <FiImage /> : <FiVideo />}
                  {event.media.type}
                </span>
              </div>
            )}

            {/* CONTENT */}
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {event.title}
                </h2>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    event.type === 'reunion'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {event.type}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {event.description}
              </p>

              {/* INFO */}
              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FiCalendar />
                  {new Date(event.date).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2">
                  <FiClock />
                  {event.startTime} - {event.endTime}
                </div>

                <div className="flex items-center gap-2">
                  <FiMapPin />
                  {event.location}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <FiEdit />
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(event._id)}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <FiTrash2 />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-center text-gray-500 mt-20">
          No has creado eventos aún
        </p>
      )}
    </div>
  );
}

/* COMPONENTE STAT */
function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
