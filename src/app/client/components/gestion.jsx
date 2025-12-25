'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import {
  FiCalendar,
  FiTrash2,
  FiMoreVertical,
  FiClock,
  FiMapPin,
  FiEdit,
  FiUsers,
  FiVideo,
  FiImage,
  FiFileText
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import AttendanceModal from '../components/AttendanceModal';

export default function GestionEventos() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openAttendance, setOpenAttendance] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const fetchMyEvents = async () => {
    try {
      const res = await axios.get('/api/event/my');
      setEvents(res.data.events);
      setStats(res.data.stats);
      console.log(res.data.events)
    } catch (err) {
      toast.error('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const openAttendanceModal = (event) => {
    setSelectedEvent(event);
    setOpenAttendance(true);
  };

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500 animate-pulse">
        Cargando eventos...
      </p>
    );
  }

  const downloadPDF = async (eventId, title) => {
    try {
      const res = await axios.get(
        `/api/report/event/${eventId}/pdf`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: 'application/pdf' })
      );

      const link = document.createElement('a');
      link.href = url;
      link.download = `acta-${title}.pdf`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('No se pudo descargar el acta');
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Mis eventos
        </h1>
        <p className="text-gray-500">
          Gestión de reuniones y trabajos comunitarios
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Stat label="Total" value={stats.total} />
          <Stat label="Reuniones" value={stats.reuniones} />
          <Stat label="Trabajos" value={stats.trabajos} />
          <Stat label="Programados" value={stats.programados} />
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="
                    bg-white rounded-2xl shadow-md overflow-hidden
                    hover:shadow-xl hover:-translate-y-1
                    transition-all duration-300
                  "
            >

              {event.media && (
                <div className="relative h-56 bg-black overflow-hidden">
                  {event.media.type === 'image' ? (
                    <img
                      src={event.media.url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={event.media.url}
                      controls
                      preload="metadata"
                      className="w-full h-full object-cover"
                      controlsList="nodownload noremoteplayback"
                      disablePictureInPicture
                    />
                  )}

                  <span className="absolute top-3 left-3 px-3 py-1 text-xs rounded-full bg-black/60 text-white flex items-center gap-1 backdrop-blur-sm">
                    {event.media.type === 'image' ? <FiImage /> : <FiVideo />}
                    {event.media.type}
                  </span>

                  <span
                    className={`
        absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold
        backdrop-blur-sm
        ${event.type === 'reunion'
                        ? 'bg-blue-500/70 text-white'
                        : 'bg-emerald-500/70 text-white'}
      `}
                  >
                    {event.type === 'reunion' ? 'Reunión' : 'Trabajo'}
                  </span>
                </div>
              )}

              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">
                  {event.title}
                </h2>

                <p className="mt-3 text-gray-600 text-sm line-clamp-3">
                  {event.description}
                </p>

                <div className="mt-5 space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <FiCalendar />
                    {new Date(event.date).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <FiClock />
                    {event.startTime}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiMapPin />
                      <span>{event.location}</span>
                    </div>
                    <span
                      className={`
      px-3 py-1 text-[12px] font-semibold rounded-full shadow-md
      ${event.status === 'finalizado'
                          ? 'bg-emerald-600/80 text-white'
                          : 'bg-amber-500/80 text-white'}
    `}
                    >
                      {event.status === 'finalizado' ? 'Finalizado' : 'Programado'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t relative overflow-hidden">

                  <div className="flex items-center gap-3 mt-3">
                    <img
                      src={event.organizer.profilePicture}
                      alt="Organizador"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {event.organizer.name} {event.organizer.apellido}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FiUsers size={12} />
                        Organizador
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <button
                        className={`
        flex items-center justify-center text-emerald-600
        hover:scale-110 transition-all duration-300
        ${openMenu === event._id
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-4 pointer-events-none'}
      `}
                      >
                        <FiUsers size={21} />
                      </button>

                      <span className="
      absolute -top-9 left-1/2 -translate-x-1/2 
      px-3 py-1 text-[12px] font-medium rounded-md 
      bg-black/85 text-white shadow-md
      whitespace-nowrap
      opacity-0 group-hover:opacity-100 transition
      pointer-events-none
    ">
                        Ver asistentes
                      </span>
                    </div>


                    {openMenu === event._id && event.status === 'finalizado' && (
                      <div className="relative group">
                        <button
                          onClick={() => downloadPDF(event._id, event.title)}
                          className="flex items-center justify-center text-red-600 hover:scale-110 transition-all duration-300"
                        >
                          <FiFileText size={21} />
                        </button>

                        <span className="
        absolute -top-9 left-1/2 -translate-x-1/2 
        px-3 py-1 text-[12px] font-medium rounded-md 
        bg-black/85 text-white shadow-md
        whitespace-nowrap
        opacity-0 group-hover:opacity-100 transition
        pointer-events-none
      ">
                          Descargar acta
                        </span>
                      </div>
                    )}


                    {openMenu === event._id && (
                      <div className="relative group">
                        <button
                          onClick={() => openAttendanceModal(event)}
                          disabled={event.status === 'finalizado'}
                          className={`
          flex items-center justify-center hover:scale-110 transition-all duration-300
          ${event.status === 'finalizado'
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-blue-600'}
        `}
                        >
                          <FiEdit size={21} />
                        </button>

                        <span className="
        absolute -top-9 left-1/2 -translate-x-1/2 
        px-3 py-1 text-[12px] font-medium rounded-md 
        bg-black/85 text-white shadow-md
        whitespace-nowrap
        opacity-0 group-hover:opacity-100 transition
        pointer-events-none
      ">
                          {event.status === 'finalizado'
                            ? 'Evento finalizado'
                            : 'Registrar asistencia'}
                        </span>
                      </div>
                    )}


                    <div className="relative group">
                      <button
                        onClick={() =>
                          setOpenMenu(openMenu === event._id ? null : event._id)
                        }
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                      >
                        <FiMoreVertical className="text-gray-500" />
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {openAttendance && selectedEvent && (
        <AttendanceModal
          event={selectedEvent}
          onClose={() => setOpenAttendance(false)}
        />
      )}
    </div>
  );
}


function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
