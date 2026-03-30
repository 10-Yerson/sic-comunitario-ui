'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { FiX, FiCheckCircle, FiAlertCircle, FiFileText, FiUsers } from 'react-icons/fi';

export default function ViewAttendanceModal({ eventId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/attendance/event/${eventId}`);
        setData(res.data);
      } catch (err) {
        alert('Error cargando asistencias');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  if (loading) return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl flex items-center gap-3">
        <div className="w-4 h-4 rounded-full bg-slate-600 animate-bounce" />
        <div className="w-4 h-4 rounded-full bg-slate-600 animate-bounce [animation-delay:0.15s]" />
        <div className="w-4 h-4 rounded-full bg-slate-600 animate-bounce [animation-delay:0.3s]" />
      </div>
    </div>
  );

  if (!data) return null;

  const { attendances, stats } = data;
  const attendanceRate = stats.total > 0 ? Math.round((stats.asistio / stats.total) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-7 py-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">Reporte de Asistencia</p>
              <h2 className="text-white text-xl font-bold flex items-center gap-2">
                <FiUsers size={20} /> Registro de asistentes
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Stats pills */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full font-medium">
              {stats.total} registrados
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-medium">
              ✅ {stats.asistio} asistieron
            </span>
            <span className="bg-red-500/20 text-red-300 text-xs px-3 py-1 rounded-full font-medium">
              ❌ {stats.falto} faltaron
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Tasa de asistencia</span>
              <span>{attendanceRate}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-auto max-h-[55vh]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-7 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Residente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Cédula</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Lote</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Justificación</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Registrado por</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {attendances.map(a => (
                <tr
                  key={a._id}
                  className={`transition-colors ${
                    a.status === 'asistio' ? 'bg-emerald-50/40' :
                    a.status === 'falto' ? 'bg-red-50/30' :
                    a.status === 'justificado' ? 'bg-amber-50/30' : ''
                  }`}
                >
                  <td className="px-7 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={a.user.profilePicture}
                        className="w-8 h-8 rounded-full object-cover shadow-sm flex-shrink-0"
                      />
                      <span className="font-medium text-gray-800">{a.user.name} {a.user.apellido}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{a.user.cedula}</td>

                  <td className="px-4 py-3 text-gray-500">{a.user.lote}</td>

                  <td className="px-4 py-3">
                    {a.status === 'asistio' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold">
                        <FiCheckCircle size={11} /> Asistió
                      </span>
                    )}
                    {a.status === 'falto' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">
                        <FiAlertCircle size={11} /> No asistió
                      </span>
                    )}
                    {a.status === 'justificado' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 text-xs font-semibold">
                        <FiFileText size={11} /> Justificado
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-gray-500 text-xs">{a.justification || '—'}</td>

                  <td className="px-4 py-3">
                    <span className="text-gray-600 text-xs">{a.registeredBy?.name} {a.registeredBy?.apellido}</span>
                  </td>

                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(a.createdAt).toLocaleString('es-ES', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="px-7 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <p className="text-xs text-gray-400">{attendances.length} registros en total</p>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}