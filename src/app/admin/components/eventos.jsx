'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';

export default function EventosComunity() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p className="text-center mt-10">Cargando eventos...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Eventos de la Comunidad
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-xl shadow-md border overflow-hidden"
          >
            {/* MEDIA (imagen o video) */}
            {event.media && (
              <div className="w-full h-56 bg-black">
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
                    className="w-full h-full object-contain rounded-lg"
                    controlsList="nodownload noremoteplayback"
                    disablePictureInPicture
                  />
                )}
              </div>
            )}

            {/* CONTENIDO */}
            <div className="p-5">
              <h2 className="text-xl font-semibold text-[#31DCB7]">
                {event.title}
              </h2>

              <span className="inline-block mt-1 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                {event.type === 'reunion' ? 'Reunión' : 'Trabajo'}
              </span>

              <p className="mt-3 text-gray-600">
                {event.description}
              </p>

              <div className="mt-4 text-sm text-gray-500 space-y-1">
                <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                <p>⏰ {event.startTime}</p>
                <p>📍 {event.location}</p>
              </div>

              {/* ORGANIZADOR */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                <img
                  src={event.organizer.profilePicture}
                  alt="Organizador"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">
                    {event.organizer.name} {event.organizer.apellido}
                  </p>
                  <p className="text-xs text-gray-500">Organizador</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
