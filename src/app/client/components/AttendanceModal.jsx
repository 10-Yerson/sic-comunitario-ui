'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';

export default function AttendanceModal({ event, onClose }) {
  const [residents, setResidents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);

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

  const saveAttendance = async () => {
    setSaving(true);

    const attendances = residents.map(r => ({
      residentId: r._id,
      status: attendance[r._id]?.status || 'no_asistio',
      justification: attendance[r._id]?.justification || ''
    }));

    try {
      await axios.post('/api/attendance/bulk', {
        eventId: event._id,
        attendances
      });

      alert('Asistencia registrada correctamente');
      onClose();
    } catch {
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
          <h2 className="text-xl font-bold text-gray-800">
            Asistencia · {event.title}
          </h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        {/* TABLE */}
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

                  {/* ESTADO */}
                  <td className="p-2">
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={attendance[r._id]?.status || ''}
                      onChange={(e) =>
                        updateStatus(r._id, e.target.value)
                      }
                    >
                      <option value="">Seleccionar</option>
                      <option value="asistio">Asistió</option>
                      <option value="no_asistio">No asistió</option>
                      <option value="justificado">Justificado</option>
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
        <div className="flex justify-end mt-5">
          <button
            onClick={saveAttendance}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            {saving ? 'Guardando...' : 'Guardar asistencia'}
          </button>
        </div>
      </div>
    </div>
  );
}
