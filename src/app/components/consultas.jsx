'use client';

import { useState } from "react";
import axios from "@/utils/axios";
import { Search, User, MapPin, Mail, CreditCard, Download, Calendar, CheckCircle, XCircle, TrendingUp, Loader2, FileText, Award } from "lucide-react";

export default function ComuneroConsulta() {
    const [cedula, setCedula] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [downloadingPdf, setDownloadingPdf] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setData(null);

        try {
            const res = await axios.get(`/api/attendance/history/cedula/${cedula}`);
            setData(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "No se encontró historial para esta cédula");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        try {
            setDownloadingPdf(true);
            const res = await axios.get(
                `/api/report/public/cedula/${cedula}`,
                { responseType: 'blob' }
            );

            const fileURL = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', `Certificado_${cedula}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(fileURL);
        } catch (error) {
            console.error(error);
            alert("No se pudo descargar el certificado");
        } finally {
            setDownloadingPdf(false);
        }
    };

    return (
        <div id="historial" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-24 pb-12 px-4 relative overflow-hidden">
            
            {/* Decoraciones de fondo */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4 font-medium text-sm">
                        <Search className="w-4 h-4" />
                        Consulta Pública
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Consulta tu <span className="text-blue-600">Historial</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Ingresa tu número de cédula para consultar tu participación en reuniones y eventos comunitarios
                    </p>
                </div>

                {/* Search Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Ingresa tu número de cédula"
                                value={cedula}
                                onChange={(e) => setCedula(e.target.value)}
                                className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-4 outline-none
                                         focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-lg"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl 
                                     hover:from-blue-700 hover:to-blue-800 transition-all font-semibold text-lg
                                     shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 
                                     disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Buscando...
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    Consultar
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 flex items-center gap-3">
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Results */}
                {data && (
                    <>
                        {/* Perfil del Residente */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 mb-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                            <User className="w-10 h-10 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold mb-1">{data.residente.nombre}</h2>
                                            <p className="text-blue-100">Residente activo</p>
                                        </div>
                                    </div>
                                    {data.stats.porcentajeAsistencia >= 80 && (
                                        <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                                            <Award className="w-4 h-4" />
                                            Destacado
                                        </div>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                                        <CreditCard className="w-5 h-5 text-blue-200" />
                                        <div>
                                            <p className="text-xs text-blue-200">Cédula</p>
                                            <p className="font-semibold">{data.residente.cedula}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-blue-200" />
                                        <div>
                                            <p className="text-xs text-blue-200">Lote</p>
                                            <p className="font-semibold">{data.residente.lote}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-blue-200" />
                                        <div>
                                            <p className="text-xs text-blue-200">Email</p>
                                            <p className="font-semibold text-sm truncate">{data.residente.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Estadísticas */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                            <StatCard 
                                icon={Calendar} 
                                label="Total Eventos" 
                                value={data.stats.totalEventos}
                                color="blue"
                            />
                            <StatCard 
                                icon={FileText} 
                                label="Reuniones" 
                                value={data.stats.reuniones}
                                color="purple"
                            />
                            <StatCard 
                                icon={User} 
                                label="Trabajos" 
                                value={data.stats.trabajos}
                                color="orange"
                            />
                            <StatCard 
                                icon={CheckCircle} 
                                label="Asistencias" 
                                value={data.stats.asistencias}
                                color="green"
                            />
                            <StatCard 
                                icon={XCircle} 
                                label="Faltas" 
                                value={data.stats.faltas}
                                color="red"
                            />
                            <StatCard 
                                icon={TrendingUp} 
                                label="Asistencia" 
                                value={`${data.stats.porcentajeAsistencia}%`}
                                color="teal"
                                highlighted
                            />
                        </div>

                        {/* Tabla de Historial */}
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mb-8">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Calendar className="w-6 h-6" />
                                    Historial de Eventos
                                </h3>
                                <p className="text-blue-100 mt-1">Registro completo de tu participación</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Fecha</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Evento</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Tipo</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Estado</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Asistencia</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.historial.map((item, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-gray-900 font-medium whitespace-nowrap">
                                                    {item.evento.fecha}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-900">{item.evento.titulo}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        item.evento.tipo === 'reunion'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                        {item.evento.tipo === 'reunion' ? 'Reunión' : 'Trabajo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        item.evento.estado === 'finalizado'
                                                            ? 'bg-gray-100 text-gray-700'
                                                            : item.evento.estado === 'en_curso'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {item.evento.estado === 'finalizado' ? 'Finalizado' :
                                                         item.evento.estado === 'en_curso' ? 'En Curso' : 'Programado'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                                                        item.asistencia.estado === "asistio"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-600"
                                                    }`}>
                                                        {item.asistencia.estado === "asistio" ? (
                                                            <>
                                                                <CheckCircle className="w-4 h-4" />
                                                                Asistió
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="w-4 h-4" />
                                                                Faltó
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Botón de descarga PDF */}
                        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                        <FileText className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1">Certificado de Asistencia</h3>
                                        <p className="text-green-100">Descarga tu reporte oficial en formato PDF</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDownloadPdf}
                                    disabled={downloadingPdf}
                                    className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg
                                             hover:bg-green-50 transition-all shadow-lg hover:shadow-xl 
                                             transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                                             flex items-center gap-3 whitespace-nowrap"
                                >
                                    {downloadingPdf ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Descargando...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            Descargar PDF
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

/* Componente de Tarjeta de Estadística */
function StatCard({ icon: Icon, label, value, color, highlighted }) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
        green: 'from-green-500 to-green-600',
        red: 'from-red-500 to-red-600',
        teal: 'from-teal-500 to-teal-600'
    };

    return (
        <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-gray-100 ${
            highlighted ? 'ring-2 ring-teal-400' : ''
        }`}>
            <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-gray-600 mb-1 font-medium">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
}