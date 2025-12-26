'use client';

import { useState } from "react";
import axios from "@/utils/axios";

export default function ComuneroConsulta() {

    const [cedula, setCedula] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setData(null);

        try {
            const res = await axios.get(`/api/attendance/history/cedula/${cedula}`);
            setData(res.data);
        } catch (err) {
            setError("No se encontró historial para esta cédula");
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       DESCARGAR PDF
    ========================== */
    const handleDownloadPdf = async () => {
        try {
            const res = await axios.get(
                `/api/report/public/cedula/${cedula}`,
                { responseType: 'blob' }   // 👈 importante
            );

            // Crear URL temporal
            const fileURL = window.URL.createObjectURL(new Blob([res.data]));

            // Crear etiqueta para descarga
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', `Certificado_${cedula}.pdf`);

            document.body.appendChild(link);
            link.click();

            // Limpiar
            link.remove();
            window.URL.revokeObjectURL(fileURL);

        } catch (error) {
            console.error(error);
            alert("No se pudo descargar el certificado");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 px-6">

            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Consulta pública de asistencia
                </h2>

                <p className="text-gray-500 mb-6">
                    Ingrese su número de cédula para consultar su historial.
                </p>

                {/* FORM */}
                <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Ejemplo: 1234567890"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        className="flex-1 border rounded-lg px-4 py-3 outline-none
              focus:ring-2 focus:ring-green-400"
                        required
                    />

                    <button
                        type="submit"
                        className="px-6 bg-green-600 text-white rounded-lg 
            hover:bg-green-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Buscando..." : "Consultar"}
                    </button>
                </form>

                {/* ERROR */}
                {error && <p className="text-red-500">{error}</p>}

                {/* RESULTADO */}
                {data && (
                    <>
                        {/* RESIDENTE */}
                        <div className="bg-gray-100 p-5 rounded-xl mb-6">
                            <p className="text-lg font-semibold">
                                {data.residente.nombre}
                            </p>
                            <p className="text-gray-600">
                                Cédula: <b>{data.residente.cedula}</b>
                            </p>
                            <p className="text-gray-600">
                                Lote: <b>{data.residente.lote}</b>
                            </p>
                            <p className="text-gray-600">
                                Email: <b>{data.residente.email}</b>
                            </p>
                        </div>

                        {/* STATS */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">

                            <Stat label="Total eventos" value={data.stats.totalEventos} />
                            <Stat label="Reuniones" value={data.stats.reuniones} />
                            <Stat label="Trabajos" value={data.stats.trabajos} />
                            <Stat label="Asistencias" value={data.stats.asistencias} />
                            <Stat label="Faltas" value={data.stats.faltas} />
                            <Stat label="Asistencia %" value={`${data.stats.porcentajeAsistencia}%`} />

                        </div>

                        {/* TABLA */}
                        <h3 className="text-lg font-semibold mb-3">
                            Historial de eventos
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full border rounded-lg overflow-hidden">

                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 text-left">Fecha</th>
                                        <th className="p-3 text-left">Evento</th>
                                        <th className="p-3 text-left">Tipo</th>
                                        <th className="p-3 text-left">Estado</th>
                                        <th className="p-3 text-left">Asistencia</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.historial.map((item, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="p-3">{item.evento.fecha}</td>
                                            <td className="p-3">{item.evento.titulo}</td>
                                            <td className="p-3 capitalize">{item.evento.tipo}</td>
                                            <td className="p-3">{item.evento.estado}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-sm
                          ${item.asistencia.estado === "asistio"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-600"
                                                    }`}
                                                >
                                                    {item.asistencia.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>

                        {/* PDF BUTTON */}
                         <div className="mt-6 text-right">
                            <button
                                onClick={handleDownloadPdf}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg 
                                hover:bg-blue-700 transition font-medium"
                            >
                                Descargar Certificado PDF
                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

/* COMPONENTE STATS */
function Stat({ label, value }) {
    return (
        <div className="bg-white shadow border rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}
