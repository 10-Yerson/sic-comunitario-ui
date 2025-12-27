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
              <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t relative overflow-hidden">

                {/* ORGANIZADOR */}
                <div className="flex items-center gap-3">
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

                {/* <div className="flex items-center gap-2">

                  <button
                    onClick={() => handleDelete(event._id)}
                    className={`
        flex items-center gap-1 text-red-600 text-sm font-medium
        transition-all duration-300 ease-out
        ${openMenu === event._id
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-4 pointer-events-none'}
      `}
                  >
                    <FiTrash2 />
                    Eliminar
                  </button>

                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === event._id ? null : event._id)
                    }
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <FiMoreVertical className="text-gray-500" />
                  </button>
                </div> */}

                <div className="flex items-center gap-3">

                  {openMenu === event._id && event.status === 'finalizado' && (
                    <div className="relative group">
                      <button onClick={() => openAttendanceViewer(event._id)}
                        className="
                        flex items-center justify-center text-emerald-600
                        hover:scale-110 transition-all duration-300
                      "
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
                  )}

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
                        onClick={() => handleDelete(event._id)}
                        className="
        flex items-center justify-center text-red-600
        hover:scale-110 transition-all duration-300
      "
                      >
                        <FiTrash2 size={21} />
                      </button>

                      <span className="
      absolute -top-9 left-1/2 -translate-x-1/2 
      px-3 py-1 text-[12px] font-medium rounded-md 
      bg-black/85 text-white shadow-md
      whitespace-nowrap
      opacity-0 group-hover:opacity-100 transition
      pointer-events-none
    ">
                        Eliminar evento
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
      {isAttendanceViewerOpen && attendanceEventId && (
        <ViewAttendanceModal
          eventId={attendanceEventId}
          onClose={closeAttendanceViewer}
        />
      )}
    </div>
  );
}
