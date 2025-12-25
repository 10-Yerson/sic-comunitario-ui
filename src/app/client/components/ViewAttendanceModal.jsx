'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { FiX, FiCheckCircle, FiAlertCircle, FiFileText } from 'react-icons/fi';

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        Cargando...
      </div>
    </div>
  );

  if (!data) return null;

  const { attendances, stats } = data;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          
          <h2 className="text-lg font-semibold text-gray-800">
            📋 Registro de asistencias
          </h2>

          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <FiX className="text-gray-600" size={20} />
          </button>

        </div>

        {/* CONTENT */}
        <div className="px-6 py-5">

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4 mb-6">

            <Stat label="Registrados" value={stats.total} color="gray" />

            <Stat label="Asistieron" value={stats.asistio} color="green" />

            <Stat label="Faltaron" value={stats.falto} color="red" />

          </div>


          {/* TABLE */}
          <div className="overflow-auto max-h-[60vh] border rounded-2xl shadow-inner">

            <table className="w-full text-sm">

              <thead className="bg-gray-50">
                <tr className="text-gray-600">
                  <th className="p-3 text-left font-medium">Usuario</th>
                  <th className="p-3 text-left font-medium">Cédula</th>
                  <th className="p-3 text-left font-medium">Lote</th>
                  <th className="p-3 text-left font-medium">Estado</th>
                  <th className="p-3 text-left font-medium">Justificación</th>
                  <th className="p-3 text-left font-medium">Registrado por</th>
                  <th className="p-3 text-left font-medium">Fecha</th>
                </tr>
              </thead>

              <tbody>

                {attendances.map(a => (
                  <tr 
                    key={a._id} 
                    className="border-t hover:bg-gray-50 transition"
                  >
                    
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={a.user.profilePicture}
                        className="w-10 h-10 rounded-full object-cover shadow"
                      />
                      <span className="font-medium text-gray-800">
                        {a.user.name} {a.user.apellido}
                      </span>
                    </td>

                    <td className="p-3 text-gray-700">{a.user.cedula}</td>

                    <td className="p-3 text-gray-700">{a.user.lote}</td>

                    <td className="p-3">

                      {a.status === 'asistio' && (
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium flex items-center gap-1 w-fit">
                          <FiCheckCircle /> Asistió
                        </span>
                      )}

                      {a.status === 'falto' && (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium flex items-center gap-1 w-fit">
                          <FiAlertCircle /> No asistió
                        </span>
                      )}

                      {a.status === 'justificado' && (
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-medium w-fit">
                          Justificado
                        </span>
                      )}

                    </td>

                    <td className="p-3 text-gray-600">
                      {a.justification || '—'}
                    </td>

                    <td className="p-3 text-gray-700">
                      {a.registeredBy?.name} {a.registeredBy?.apellido}
                    </td>

                    <td className="p-3 text-gray-500">
                      {new Date(a.createdAt).toLocaleString()}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-xl hover:bg-black transition"
          >
            Cerrar
          </button>
        </div>

      </div>

    </div>
  );
}


function Stat({ label, value, color }) {

  const colors = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-700"
  };

  return (
    <div className={`rounded-2xl p-4 text-center shadow-sm ${colors[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium opacity-80 mt-1">{label}</p>
    </div>
  );
}
