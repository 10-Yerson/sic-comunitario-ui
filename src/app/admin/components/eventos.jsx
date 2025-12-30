'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';
import ViewAttendanceModal from '../../client/components/ViewAttendanceModal';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiMoreVertical, FiTrash2, FiFileText, FiEdit } from 'react-icons/fi';

export default function EventosComunity() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  const [isAttendanceViewerOpen, setIsAttendanceViewerOpen] = useState(false);
  const [attendanceEventId, setAttendanceEventId] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/event');
        setEvents(res.data);
        console.log(res.data)
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este evento?')) return;

    try {
      await axios.delete(`/api/event/${id}`);
      setEvents(events.filter(event => event._id !== id));
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      alert('No se pudo eliminar el evento');
    }
  };

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

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500 animate-pulse">
        Cargando eventos...
      </p>
    );
  }

  const openAttendanceViewer = (eventId) => {
    setAttendanceEventId(eventId);
    setIsAttendanceViewerOpen(true);
  };

  const closeAttendanceViewer = () => {
    setIsAttendanceViewerOpen(false);
    setAttendanceEventId(null);
  };


  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Eventos de la Comunidad
        </h1>
        <p className="text-gray-500 mt-1">
          Reuniones y actividades programadas
        </p>
      </div>

      {/* GRID */}
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
            {/* MEDIA */}
            {event.media && (
              <div className="relative h-56 bg-black">
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

                {/* BADGE TIPO */}
                <span
                  className={`
                    absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold
                    ${event.type === 'reunion'
                      ? 'bg-blue-500/90 text-white'
                      : 'bg-emerald-500/90 text-white'}
                  `}
                >
                  {event.type === 'reunion' ? 'Reunión' : 'Trabajo'}
                </span>
              </div>
            )}

            {/* CONTENIDO */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">
                {event.title}
              </h2>

              <p className="mt-3 text-gray-600 text-sm line-clamp-3">
                {event.description}
              </p>

              {/* INFO */}
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
              <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t relative">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={event.organizer.profilePicture}
                      alt="Organizador"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {event.organizer.name} {event.organizer.apellido}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FiUsers size={11} />
                      <span>Organizador</span>
                    </div>
                  </div>
                </div>

                {/* BOTONES DE ACCIONES */}
                <div className="flex items-center gap-1.5">

                  {/* Botón Ver Asistentes */}
                  {openMenu === event._id && event.status === 'finalizado' && (
                    <div className="relative group">
                      <button
                        onClick={() => openAttendanceViewer(event._id)}
                        className="
            relative p-2 rounded-xl
            bg-gradient-to-br from-emerald-500 to-green-600
            text-white shadow-md
            hover:shadow-lg hover:scale-105
            active:scale-95
            transition-all duration-200
            overflow-hidden
          "
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <FiUsers size={16} className="relative z-10" />
                      </button>

                      <span className="
          absolute -top-9 left-1/2 -translate-x-1/2 
          px-2.5 py-1 text-[11px] font-medium rounded-md 
          bg-gray-900/90 text-white shadow-lg
          whitespace-nowrap
          opacity-0 group-hover:opacity-100 
          transition-all duration-200
          pointer-events-none
          backdrop-blur-sm
        ">
                        Asistentes
                      </span>
                    </div>
                  )}

                  {/* Botón Descargar PDF */}
                  {openMenu === event._id && event.status === 'finalizado' && (
                    <div className="relative group">
                      <button
                        onClick={() => downloadPDF(event._id, event.title)}
                        className="
            relative p-2 rounded-xl
            bg-gradient-to-br from-blue-500 to-cyan-600
            text-white shadow-md
            hover:shadow-lg hover:scale-105
            active:scale-95
            transition-all duration-200
            overflow-hidden
          "
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <FiFileText size={16} className="relative z-10" />
                      </button>

                      <span className="
          absolute -top-9 left-1/2 -translate-x-1/2 
          px-2.5 py-1 text-[11px] font-medium rounded-md 
          bg-gray-900/90 text-white shadow-lg
          whitespace-nowrap
          opacity-0 group-hover:opacity-100 
          transition-all duration-200
          pointer-events-none
          backdrop-blur-sm
        ">
                        Descargar PDF
                      </span>
                    </div>
                  )}

                  {/* Botón Eliminar Evento */}
                  {openMenu === event._id && (
                    <div className="relative group">
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="
            relative p-2 rounded-xl
            bg-gradient-to-br from-red-500 to-rose-600
            text-white shadow-md
            hover:shadow-lg hover:scale-105
            active:scale-95
            transition-all duration-200
            overflow-hidden
          "
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <FiTrash2 size={16} className="relative z-10" />
                      </button>

                      <span className="
          absolute -top-9 left-1/2 -translate-x-1/2 
          px-2.5 py-1 text-[11px] font-medium rounded-md 
          bg-gray-900/90 text-white shadow-lg
          whitespace-nowrap
          opacity-0 group-hover:opacity-100 
          transition-all duration-200
          pointer-events-none
          backdrop-blur-sm
        ">
                        Eliminar
                      </span>
                    </div>
                  )}

                  {/* Botón menú (siempre visible) */}
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === event._id ? null : event._id)
                    }
                    className={`
        p-2 rounded-xl
        transition-all duration-200
        ${openMenu === event._id
                        ? 'bg-gray-200 text-gray-700 shadow-sm scale-95'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                      }
        active:scale-90
      `}
                  >
                    <FiMoreVertical size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isAttendanceViewerOpen && attendanceEventId && (
        <ViewAttendanceModal
          eventId={attendanceEventId}
          onClose={closeAttendanceViewer}
        />
      )}
    </div>
  );
}
