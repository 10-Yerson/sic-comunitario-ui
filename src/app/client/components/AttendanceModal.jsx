'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';

export default function AttendanceModal({ event, onClose }) {
  const [residents, setResidents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);

  const selectedCount = residents.filter(r => attendance[r._id]?.status).length;
  const asistenCount = residents.filter(r => attendance[r._id]?.status === 'asistio').length;
  const faltoCount = residents.filter(r => attendance[r._id]?.status === 'falto').length;
  const justificadoCount = residents.filter(r => attendance[r._id]?.status === 'justificado').length;

  useEffect(() => {
    axios.get('/api/resident')
      .then(res => setResidents(res.data))
      .catch(() => alert('Error al cargar residentes'));
  }, []);

  const updateStatus = (id, status) => {
    setAttendance({
      ...attendance,
      [id]: {
        status,
        justification: status === 'justificado' ? attendance[id]?.justification || '' : ''
      }
    });
  };

  const updateJustification = (id, text) => {
    setAttendance({ ...attendance, [id]: { ...attendance[id], justification: text } });
  };

  const markAllAsAttended = () => {
    const newAttendance = {};
    residents.forEach(r => { newAttendance[r._id] = { status: 'asistio', justification: '' }; });
    setAttendance(newAttendance);
  };

  const saveAttendance = async () => {
    setSaving(true);
    const attendances = residents
      .filter(r => attendance[r._id]?.status)
      .map(r => ({
        residentId: r._id,
        status: attendance[r._id].status,
        justification: attendance[r._id]?.justification || ''
      }));

    if (attendances.length === 0) {
      alert('Debes seleccionar el estado de al menos un residente');
      setSaving(false);
      return;
    }

    try {
      await axios.post('/api/attendance/bulk', { eventId: event._id, attendances });
      await axios.patch(`/api/event/${event._id}/status`, { status: 'finalizado' });
      alert('Asistencia registrada y evento finalizado');
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error al registrar asistencia');
    } finally {
      setSaving(false);
    }
  };

  const progress = residents.length > 0 ? (selectedCount / residents.length) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden">

        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-7 py-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">Registro de Asistencia</p>
              <h2 className="text-white text-xl font-bold">{event.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full font-medium">
              {selectedCount} / {residents.length} registrados
            </span>
            {asistenCount > 0 && (
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-medium">
                ✅ {asistenCount} asistieron
              </span>
            )}
            {faltoCount > 0 && (
              <span className="bg-red-500/20 text-red-300 text-xs px-3 py-1 rounded-full font-medium">
                ❌ {faltoCount} faltaron
              </span>
            )}
            {justificadoCount > 0 && (
              <span className="bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full font-medium">
                📋 {justificadoCount} justificados
              </span>
            )}
          </div>

          <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="px-7 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <p className="text-xs text-gray-400">{residents.length} residentes en total</p>
          <button
            onClick={markAllAsAttended}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 text-xs font-semibold transition-colors"
          >
            ✅ Marcar todos como asistentes
          </button>
        </div>

        <div className="overflow-auto max-h-[50vh]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-7 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Residente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Cédula</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Justificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {residents.map((r, i) => {
                const status = attendance[r._id]?.status;
                return (
                  <tr
                    key={r._id}
                    className={`transition-colors ${status === 'asistio' ? 'bg-emerald-50/40' :
                        status === 'falto' ? 'bg-red-50/30' :
                          status === 'justificado' ? 'bg-amber-50/30' :
                            'hover:bg-gray-50/60'
                      }`}
                  >
                    <td className="px-7 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-xs flex-shrink-0">
                          {r.name?.[0]}{r.apellido?.[0]}
                        </div>
                        <span className="font-medium text-gray-800">{r.name} {r.apellido}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{r.cedula}</td>
                    <td className="px-4 py-3">
                      <select
                        className={`border rounded-lg px-3 py-1.5 text-xs font-medium w-44 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors cursor-pointer ${status === 'asistio' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                            status === 'falto' ? 'border-red-200 bg-red-50 text-red-700' :
                              status === 'justificado' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                                'border-gray-200 bg-white text-gray-500'
                          }`}
                        value={status || ''}
                        onChange={(e) => updateStatus(r._id, e.target.value)}
                      >
                        <option value="">Seleccionar</option>
                        <option value="asistio">✅ Asistió</option>
                        <option value="falto">❌ No asistió</option>
                        <option value="justificado">📋 Justificado</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {status === 'justificado' && (
                        <input
                          type="text"
                          placeholder="Motivo..."
                          className="w-full border border-amber-200 bg-amber-50 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-200 placeholder:text-amber-300 text-amber-800"
                          value={attendance[r._id]?.justification || ''}
                          onChange={(e) => updateJustification(r._id, e.target.value)}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-7 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <p className="text-xs text-gray-400">
            {selectedCount === 0 ? 'Ningún residente registrado aún' : `${residents.length - selectedCount} sin registrar`}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={saveAttendance}
              disabled={saving || selectedCount === 0}
              className="px-6 py-2 text-sm font-semibold bg-slate-800 text-white rounded-xl hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Guardando...' : selectedCount > 0
                ? `Guardar ${selectedCount} asistencia${selectedCount > 1 ? 's' : ''}`
                : 'Guardar asistencia'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}