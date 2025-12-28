'use client'
import { useState, useEffect } from 'react';
import { Calendar, Users, Clock, MapPin, CheckCircle, ArrowRight, FileText, Loader2, X, Tag, FileCheck, AlertCircle } from 'lucide-react';
import axios from '@/utils/axios';

export default function MeetingsSection() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/event/comunity');
      setEventos(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventDetails = async (eventId) => {
    try {
      setLoadingDetails(true);
      const { data } = await axios.get(`/api/event/comunity/${eventId}`);
      setEventDetails(data);
    } catch (err) {
      console.error('Error al cargar detalles:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    fetchEventDetails(event._id);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setEventDetails(null);
  };

  // Filtrar eventos por tipo y estado
  const reunionesProximas = eventos.filter(e => e.type === 'reunion' && (e.status === 'programado' || e.status === 'en_curso'));
  const trabajosProximos = eventos.filter(e => e.type === 'trabajo' && (e.status === 'programado' || e.status === 'en_curso'));
  const eventosFinalizados = eventos.filter(e => e.status === 'finalizado');

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white" id="reuniones">
        <div className="max-w-7xl mx-auto px-6 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando eventos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white" id="reuniones">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 font-medium">Error al cargar los eventos: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="reuniones" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">

        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-30"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* Encabezado */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 font-medium text-sm">
              <Calendar className="w-4 h-4" />
              Gestión de Reuniones
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Mantén tu comunidad <span className="text-blue-600">organizada</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Administra reuniones, eventos comunitarios y consulta el historial completo de decisiones
            </p>
          </div>

          {/* Reuniones Próximas */}
          {reunionesProximas.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  Próximas Reuniones
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                  {reunionesProximas.length} programadas
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reunionesProximas.map((meeting) => (
                  <div
                    key={meeting._id}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
                  >
                    <div className="h-48 overflow-hidden relative">
                      {meeting.media?.url ? (
                        meeting.media.type === 'video' ? (
                          <>
                            <video
                              src={meeting.media.url}
                              className="w-full h-full object-contain"
                              controls
                              preload="metadata"
                              controlsList="nodownload noremoteplayback"
                              disablePictureInPicture
                            />
                          </>
                        ) : (
                          <>
                            <img
                              src={meeting.media.url}
                              alt={meeting.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                          </>
                        )
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg text-center px-4">
                          📁 Este evento no cuenta con archivos multimedia
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${meeting.estado === 'en_curso'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-purple-100 text-purple-700'
                          }`}>
                          {meeting.estado === 'en_curso' ? 'En Curso' : 'Programado'}
                        </div>
                      </div>

                      <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {meeting.title}
                      </h4>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {meeting.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>{meeting.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>{meeting.startTime} - {meeting.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="line-clamp-1">{meeting.location}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => openModal(meeting)}
                        className="block w-full bg-blue-50 text-blue-700 py-2.5 rounded-lg font-semibold hover:bg-blue-100 transition-colors text-center"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trabajos Comunitarios / Eventos */}
          {trabajosProximos.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  Trabajos Comunitarios
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                  {trabajosProximos.length} eventos
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {trabajosProximos.map((work) => (
                  <div
                    key={work._id}
                    className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-emerald-200 group hover:-translate-y-2 relative"
                  >
                    {/* Imagen con overlay */}
                    {work.media?.url && (
                      <div className="h-56 overflow-hidden relative">
                        <img
                          src={work.media.url}
                          alt={work.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                        {/* Badge flotante */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${work.status === 'en_curso'
                            ? 'bg-emerald-400 text-emerald-900'
                            : 'bg-teal-400 text-teal-900'
                            }`}>
                            {work.status === 'en_curso' ? '⚡ En Curso' : '📅 Programado'}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                        {work.title}
                      </h4>

                      <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
                        {work.description}
                      </p>

                      <div className="space-y-2 mb-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-emerald-500" />
                          <span className="font-medium">{new Date(work.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-emerald-500" />
                          <span>{work.startTime} - {work.endTime}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-emerald-500" />
                          <span className="line-clamp-1">{work.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-emerald-500" />
                          <span>Organiza: {work.organizer.name} {work.organizer.apellido}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => openModal(work)}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        Ver detalles completos
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historial de Reuniones Finalizadas */}
          {eventosFinalizados.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  Eventos Finalizados
                </h3>
              </div>

              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Evento</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tipo</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fecha</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Organizador</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Detalles</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {eventosFinalizados.map((evento) => (
                        <tr key={evento._id} className="hover:bg-gray-50 transition-colors">
                          <td key={evento._id} className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="font-medium text-gray-900 line-clamp-1">{evento.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${evento.type === 'reunion'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                              }`}>
                              {evento.type === 'reunion' ? 'Reunión' : 'Trabajo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{new Date(evento.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                          <td className="px-6 py-4 text-gray-600">{evento.organizer.name} {evento.organizer.apellido}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => openModal(evento)}
                              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm group"
                            >
                              <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              Ver detalles
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Mensaje si no hay eventos */}
          {eventos.length === 0 && (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay eventos disponibles</h3>
              <p className="text-gray-600">Los próximos eventos aparecerán aquí</p>
            </div>
          )}

        </div>
      </section>

      {/* Modal de Detalles */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Header del Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedEvent.type === 'reunion'
                  ? 'bg-blue-100'
                  : 'bg-gradient-to-br from-emerald-400 to-teal-400'
                  }`}>
                  {selectedEvent.type === 'reunion' ? (
                    <Calendar className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Users className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                  <span className={`text-sm font-medium ${selectedEvent.type === 'reunion' ? 'text-blue-600' : 'text-emerald-600'
                    }`}>
                    {selectedEvent.type === 'reunion' ? 'Reunión' : 'Trabajo Comunitario'}
                  </span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {loadingDetails ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : eventDetails ? (
              <div className="p-6">
                {/* Imagen Principal */}
                {selectedEvent.media?.url && (
                  <div className="mb-6 rounded-2xl overflow-hidden">
                    {selectedEvent.media.type === 'video' ? (
                      <video
                        src={selectedEvent.media.url}
                        controls
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <img
                        src={selectedEvent.media.url}
                        alt={selectedEvent.title}
                        className="w-full h-64 object-cover"
                      />
                    )}
                  </div>
                )}

                {/* Información Principal */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-700">Fecha</span>
                    </div>
                    <p className="text-gray-900 font-medium">{new Date(eventDetails.event.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-700">Horario</span>
                    </div>
                    <p className="text-gray-900 font-medium">{eventDetails.event.startTime} - {eventDetails.event.endTime}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-700">Lugar</span>
                    </div>
                    <p className="text-gray-900 font-medium">{eventDetails.event.location}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-700">Estado</span>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${eventDetails.event.status === 'programado' ? 'bg-purple-100 text-purple-700' :
                      eventDetails.event.status === 'en_curso' ? 'bg-green-100 text-green-700' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                      {eventDetails.event.status === 'programado' ? 'Programado' :
                        eventDetails.event.status === 'en_curso' ? 'En Curso' : 'Finalizado'}
                    </span>
                  </div>
                </div>

                {/* Descripción */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Descripción
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                    {eventDetails.event.description}
                  </p>
                </div>

                {/* Observaciones */}
                {eventDetails.event.observations && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      Observaciones
                    </h3>
                    <p className="text-gray-700 leading-relaxed bg-amber-50 p-4 rounded-xl border border-amber-200">
                      {eventDetails.event.observations}
                    </p>
                  </div>
                )}

                {/* Agenda (solo para reuniones) */}
                {eventDetails.event.agenda && eventDetails.event.agenda.length > 0 && eventDetails.event.agenda[0].punto && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-blue-600" />
                      Agenda
                    </h3>
                    <div className="space-y-3">
                      {eventDetails.event.agenda.map((item, index) => (
                        <div key={item._id} className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">{index + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">{item.punto}</h4>
                              <p className="text-gray-600 text-sm">{item.descripcion}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Decisiones (solo si hay) */}
                {eventDetails.event.decisions && eventDetails.event.decisions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Decisiones Tomadas
                    </h3>
                    <div className="space-y-2">
                      {eventDetails.event.decisions.map((decision, index) => (
                        <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <p className="text-gray-700">{decision}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Estadísticas de Asistencia */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Estadísticas de Asistencia</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{eventDetails.stats.totalAsistentes}</div>
                      <div className="text-sm text-gray-600">Asistentes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">{eventDetails.stats.totalFaltas}</div>
                      <div className="text-sm text-gray-600">Faltas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-600">{eventDetails.stats.totalJustificados}</div>
                      <div className="text-sm text-gray-600">Justificados</div>
                    </div>
                  </div>
                </div>

                {/* Organizador */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <img
                    src={eventDetails.event.organizer.profilePicture}
                    alt={eventDetails.event.organizer.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div>
                    <p className="text-sm text-gray-600">Organizado por</p>
                    <p className="font-semibold text-gray-900">{eventDetails.event.organizer.name} {eventDetails.event.organizer.apellido}</p>
                    <p className="text-xs text-gray-500">{eventDetails.event.organizer.email}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}