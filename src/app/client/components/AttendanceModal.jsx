'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';

export default function AttendanceModal({ event, onClose }) {
  const [residents, setResidents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);

  // Contar cuántos tienen status seleccionado
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
        justification: status === 'justificado'
          ? attendance[id]?.justification || ''
          : ''
      }
    });
  };

  const updateJustification = (id, text) => {
    setAttendance({
      ...attendance,
      [id]: {
        ...attendance[id],
        justification: text
      }
    });
  };

  // ✅ Función para marcar a todos como asistentes
  const markAllAsAttended = () => {
    const newAttendance = {};
    residents.forEach(r => {
      newAttendance[r._id] = {
        status: 'asistio',
        justification: ''
      };
    });
    setAttendance(newAttendance);
  };

  const saveAttendance = async () => {
    setSaving(true);

    // ✅ SOLO enviar residentes que tienen un status seleccionado
    const attendances = residents
      .filter(r => attendance[r._id]?.status) // Solo los que tienen status
      .map(r => ({
        residentId: r._id,
        status: attendance[r._id].status,
        justification: attendance[r._id]?.justification || ''
      }));

    // Validar que se haya seleccionado al menos uno
    if (attendances.length === 0) {
      alert('Debes seleccionar el estado de al menos un residente');
      setSaving(false);
      return;
    }

    console.log('📤 Enviando asistencias:', attendances);

    try {
      await axios.post('/api/attendance/bulk', {
        eventId: event._id,
        attendances
      });

      // 2️⃣ Cambiar estado del evento
      await axios.patch(`/api/event/${event._id}/status`, {
        status: 'finalizado'
      });

      alert('Asistencia registrada y evento finalizado');
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error al registrar asistencia');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-5xl rounded-3xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Asistencia · {event.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedCount} de {residents.length} registrados
              {selectedCount > 0 && (
                <span className="ml-2">
                  (✅ {asistenCount} · ❌ {faltoCount} · 📋 {justificadoCount})
                </span>
              )}
            </p>
          </div>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        {/* TABLE */}
        <div className="mb-3 flex justify-end">
          <button
            onClick={markAllAsAttended}
            className="px-4 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium"
          >
            ✅ Marcar todos como asistentes
          </button>
        </div>

        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Cédula</th>
                <th className="p-2 text-left">Estado</th>
                <th className="p-2 text-left">Motivo (si justifica)</th>
              </tr>
            </thead>

            <tbody>
              {residents.map(r => (
                <tr key={r._id} className="border-t">
                  <td className="p-2">
                    {r.name} {r.apellido}
                  </td>
                  <td className="p-2">{r.cedula}</td>

                  {/* ESTADO - ✅ Valores corregidos para coincidir con el enum del modelo */}
                  <td className="p-2">
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={attendance[r._id]?.status || ''}
                      onChange={(e) =>
                        updateStatus(r._id, e.target.value)
                      }
                    >
                      <option value="">Seleccionar</option>
                      <option value="asistio">✅ Asistió</option>
                      <option value="falto">❌ No asistió</option>
                      <option value="justificado">📋 Justificado</option>
                    </select>
                  </td>

                  {/* JUSTIFICACIÓN */}
                  <td className="p-2">
                    {attendance[r._id]?.status === 'justificado' && (
                      <input
                        type="text"
                        placeholder="Motivo de la justificación"
                        className="w-full border rounded px-2 py-1"
                        value={attendance[r._id]?.justification || ''}
                        onChange={(e) =>
                          updateJustification(r._id, e.target.value)
                        }
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={saveAttendance}
            disabled={saving || selectedCount === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving
              ? 'Guardando...'
              : selectedCount > 0
                ? `Guardar ${selectedCount} asistencia${selectedCount > 1 ? 's' : ''}`
                : 'Guardar asistencia'
            }
          </button>
        </div>
      </div>
    </div>
  );
}