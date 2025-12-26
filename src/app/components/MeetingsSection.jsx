'use client'
import { useState, useEffect } from 'react';
import { Calendar, Users, Clock, MapPin, CheckCircle, ArrowRight, Video, FileText, Loader2 } from 'lucide-react';
import axios from '@/utils/axios';

export default function MeetingsSection() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/event/public/');
      setEventos(data.eventos || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar eventos por tipo y estado
  const reunionesProximas = eventos.filter(e => e.tipo === 'reunion' && (e.estado === 'programado' || e.estado === 'en_curso'));
  const trabajosProximos = eventos.filter(e => e.tipo === 'trabajo' && (e.estado === 'programado' || e.estado === 'en_curso'));
  const eventosFinalizados = eventos.filter(e => e.estado === 'finalizado');

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
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden" id="reuniones">
      
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
                  key={meeting.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
                >
                  {/* Imagen */}
                  {meeting.imagen && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={meeting.imagen} 
                        alt={meeting.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        meeting.estado === 'en_curso' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {meeting.estado === 'en_curso' ? 'En Curso' : 'Programado'}
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {meeting.titulo}
                    </h4>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {meeting.descripcion}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>{meeting.fecha}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{meeting.horaInicio} - {meeting.horaFin}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="line-clamp-1">{meeting.lugar}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>Organiza: {meeting.organizador}</span>
                      </div>
                    </div>

                    <a 
                      href={`/evento/${meeting.id}`}
                      className="block w-full bg-blue-50 text-blue-700 py-2.5 rounded-lg font-semibold hover:bg-blue-100 transition-colors text-center"
                    >
                      Ver detalles
                    </a>
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
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
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
                  key={work.id}
                  className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 group hover:-translate-y-1"
                >
                  {/* Imagen */}
                  {work.imagen && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={work.imagen} 
                        alt={work.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors flex-1">
                        {work.titulo}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 ${
                        work.estado === 'en_curso'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {work.estado === 'en_curso' ? 'En Curso' : 'Programado'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                      {work.descripcion}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{work.fecha}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>{work.horaInicio} - {work.horaFin}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span className="line-clamp-1">{work.lugar}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Users className="w-4 h-4 text-orange-500" />
                        <span>Organiza: {work.organizador}</span>
                      </div>
                    </div>

                    <a 
                      href={`/evento/${work.id}`}
                      className="block w-full bg-white text-orange-700 py-2.5 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-sm text-center"
                    >
                      Ver detalles e inscribirme
                    </a>
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
                      <tr key={evento.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-gray-900 line-clamp-1">{evento.titulo}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            evento.tipo === 'reunion' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {evento.tipo === 'reunion' ? 'Reunión' : 'Trabajo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{evento.fecha}</td>
                        <td className="px-6 py-4 text-gray-600">{evento.organizador}</td>
                        <td className="px-6 py-4">
                          <a 
                            href={`/evento/${evento.id}`}
                            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm group"
                          >
                            <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Ver detalles
                          </a>
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
  );
}