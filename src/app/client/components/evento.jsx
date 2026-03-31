'use client';

import { useState } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';
import { FiPlus, FiImage, FiTrash2, FiMapPin, FiClock, FiCalendar, FiChevronRight, FiMenu, FiX } from 'react-icons/fi';

export default function CreateEvent() {
  const [type, setType] = useState('reunion');
  const [step, setStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', date: '',
    startTime: '', endTime: '', location: '', observations: ''
  });
  const [agenda, setAgenda] = useState([{ punto: '', descripcion: '' }]);
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleMedia = (file) => {
    if (!file) return;
    setMedia(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    if (!form.title) return 'El título es obligatorio';
    if (!form.description) return 'La descripción es obligatoria';
    if (!form.location) return 'La ubicación es obligatoria';
    if (!form.date) return 'Debes elegir una fecha';
    if (!form.startTime) return 'Debes indicar hora de inicio';
    if (!form.endTime) return 'Debes indicar hora de fin';
    return null;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const error = validate();
    if (error) return toast.info(error);
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('type', type);
      if (type === 'reunion') {
        agenda.forEach((a, i) => {
          fd.append(`agenda[${i}][punto]`, a.punto);
          fd.append(`agenda[${i}][descripcion]`, a.descripcion);
        });
      }
      if (media) fd.append('media', media);
      await axios.post('/api/event', fd);
      toast.success('Evento creado correctamente');
      setForm({ title: '', description: '', date: '', startTime: '', endTime: '', location: '', observations: '' });
      setAgenda([{ punto: '', descripcion: '' }]);
      setMedia(null); setPreview(null);
      setStep(0);
    } catch {
      toast.error('No se pudo crear el evento');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 0, label: 'Tipo', emoji: '🎯', hint: 'Define si es una reunión formal o un trabajo comunitario. Esto ajusta las opciones disponibles en los pasos siguientes.' },
    { id: 1, label: 'Detalles', emoji: '📝', hint: 'Escribe el título, descripción y ubicación del evento. Esta información será visible para todos los residentes.' },
    { id: 2, label: 'Horario', emoji: '🕐', hint: 'Selecciona la fecha y el rango de horas del evento. Asegúrate de que no coincida con otros eventos programados.' },
    { id: 3, label: 'Agenda', emoji: '📋', hint: 'Solo para reuniones. Define los temas que se van a tratar. Puedes agregar tantos puntos como necesites.' },
    { id: 4, label: 'Media', emoji: '🖼️', hint: 'Sube una imagen o video representativo del evento. Este archivo es opcional pero enriquece la comunicación.' },
  ];

  const input = 'w-full px-4 py-3 text-sm rounded-2xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-green-300 focus:bg-white placeholder:text-gray-400 transition-all duration-200';
  const inputFull = `${input} text-base`;
  const labelCls = 'block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2';

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-gray-50 overflow-hidden">

      {/* MOBILE HEADER */}
      <div className="md:hidden flex-shrink-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{steps[step].emoji}</span>
          <div>
            <p className="text-xs text-gray-400">Paso {step + 1} de 5</p>
            <p className="text-sm font-bold text-gray-800">{steps[step].label}</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-gray-100 text-gray-600"
        >
          {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* STEPS */}
        <div className="flex-1 overflow-y-auto">

          {/* STEP 0 — Tipo */}
          {step === 0 && (
            <div className="min-h-full flex items-center justify-center p-6 md:p-10">
              <div className="max-w-xl w-full">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-2">Paso 1 de 5</p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">¿Qué tipo de evento es?</h2>
                <p className="text-gray-400 text-sm mb-2">{steps[0].hint}</p>
                <div className="w-12 h-0.5 bg-green-400 rounded mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { value: 'reunion', emoji: '🤝', label: 'Reunión', desc: 'Con agenda, decisiones y registro de asistencia' },
                    { value: 'trabajo', emoji: '🔧', label: 'Trabajo comunitario', desc: 'Actividad física, labores o mantenimiento' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setType(opt.value); setStep(1); }}
                      className={`p-6 md:p-8 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-105 hover:shadow-lg ${type === opt.value
                          ? 'border-green-500 bg-green-600 text-white shadow-xl scale-105'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
                        }`}
                    >
                      <span className="text-4xl block mb-4">{opt.emoji}</span>
                      <p className="font-bold text-lg mb-1">{opt.label}</p>
                      <p className={`text-sm leading-relaxed ${type === opt.value ? 'text-green-100' : 'text-gray-400'}`}>{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 — Detalles */}
          {step === 1 && (
            <div className="min-h-full flex items-center justify-center p-6 md:p-10">
              <div className="max-w-xl w-full space-y-4">
                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-2">Paso 2 de 5</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Información general</h2>
                  <p className="text-gray-400 text-sm mb-2">{steps[1].hint}</p>
                  <div className="w-12 h-0.5 bg-green-400 rounded mb-5" />
                </div>
                <div>
                  <label className={labelCls}>Título *</label>
                  <input name="title" placeholder="Ej: Reunión de propietarios Q3" className={inputFull} value={form.title} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelCls}>Descripción *</label>
                  <textarea name="description" placeholder="Describe el propósito del evento..." className={`${inputFull} resize-none`} rows="3" value={form.description} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelCls}><FiMapPin className="inline mr-1" size={11} />Ubicación *</label>
                  <input name="location" placeholder="Ej: Salón comunal, Bloque A" className={inputFull} value={form.location} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelCls}>Observaciones</label>
                  <textarea name="observations" placeholder="Notas adicionales para los asistentes..." className={`${inputFull} resize-none`} rows="2" value={form.observations} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Horario */}
          {step === 2 && (
            <div className="min-h-full flex items-center justify-center p-6 md:p-10">
              <div className="max-w-md w-full space-y-4">
                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-2">Paso 3 de 5</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Fecha y horario</h2>
                  <p className="text-gray-400 text-sm mb-2">{steps[2].hint}</p>
                  <div className="w-12 h-0.5 bg-green-400 rounded mb-5" />
                </div>
                <div>
                  <label className={labelCls}><FiCalendar className="inline mr-1" size={11} />Fecha *</label>
                  <input type="date" name="date" className={inputFull} value={form.date} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}><FiClock className="inline mr-1" size={11} />Inicio *</label>
                    <input type="time" name="startTime" className={inputFull} value={form.startTime} onChange={handleChange} />
                  </div>
                  <div>
                    <label className={labelCls}><FiClock className="inline mr-1" size={11} />Fin *</label>
                    <input type="time" name="endTime" className={inputFull} value={form.endTime} onChange={handleChange} />
                  </div>
                </div>
                {form.date && (
                  <div className="p-5 bg-green-600 rounded-2xl text-white">
                    <p className="text-green-200 text-xs uppercase tracking-wider mb-1">Resumen</p>
                    <p className="text-lg font-bold capitalize">
                      {new Date(form.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    {form.startTime && form.endTime && (
                      <p className="text-green-100 text-sm mt-1">🕐 {form.startTime} → {form.endTime}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 — Agenda */}
          {step === 3 && (
            <div className="min-h-full flex items-center justify-center p-6 md:p-10">
              <div className="max-w-xl w-full">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-2">Paso 4 de 5</p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Agenda</h2>
                <p className="text-gray-400 text-sm mb-2">{steps[3].hint}</p>
                <div className="w-12 h-0.5 bg-green-400 rounded mb-5" />
                {type === 'reunion' ? (
                  <div className="space-y-3">
                    {agenda.map((a, i) => (
                      <div key={i} className="flex gap-3 items-start bg-white border-2 border-gray-100 rounded-2xl p-4">
                        <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                        <div className="flex-1 space-y-2">
                          <input placeholder="Punto de la agenda" className={input} value={a.punto}
                            onChange={(e) => { const c = [...agenda]; c[i].punto = e.target.value; setAgenda(c); }} />
                          <input placeholder="Descripción del punto" className={input} value={a.descripcion}
                            onChange={(e) => { const c = [...agenda]; c[i].descripcion = e.target.value; setAgenda(c); }} />
                        </div>
                        {agenda.length > 1 && (
                          <button type="button" onClick={() => setAgenda(agenda.filter((_, idx) => idx !== i))}
                            className="p-2 text-gray-300 hover:text-red-400 rounded-xl hover:bg-red-50 transition-all">
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button"
                      onClick={() => setAgenda([...agenda, { punto: '', descripcion: '' }])}
                      className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 px-4 py-3 rounded-2xl border-2 border-dashed border-green-200 hover:border-green-400 w-full justify-center transition-all font-medium"
                    >
                      <FiPlus size={16} /> Agregar punto
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-2xl gap-2">
                    <span className="text-4xl">🔧</span>
                    <p className="text-gray-400 text-sm font-medium">No aplica para trabajos comunitarios</p>
                    <p className="text-gray-300 text-xs">Puedes continuar al siguiente paso</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4 — Media */}
          {step === 4 && (
            <div className="min-h-full flex items-center justify-center p-6 md:p-10">
              <div className="max-w-lg w-full">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-2">Paso 5 de 5</p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Imagen o Video</h2>
                <p className="text-gray-400 text-sm mb-2">{steps[4].hint}</p>
                <div className="w-12 h-0.5 bg-green-400 rounded mb-5" />
                {!preview ? (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-10 md:p-16 cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 group-hover:bg-green-100 flex items-center justify-center mb-4 transition-colors">
                      <FiImage size={28} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                    </div>
                    <p className="text-base font-semibold text-gray-500">Haz clic para subir un archivo</p>
                    <p className="text-sm text-gray-300 mt-1">PNG, JPG, MP4 soportados</p>
                    <input type="file" hidden accept="image/*,video/*" onChange={(e) => handleMedia(e.target.files[0])} />
                  </label>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
                    {media?.type.startsWith('video') ? (
                      <video src={preview} controls className="w-full max-h-64 object-cover" />
                    ) : (
                      <img src={preview} className="w-full max-h-64 object-cover" />
                    )}
                    <button type="button" onClick={() => { setMedia(null); setPreview(null); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM BAR */}
        <div className="flex-shrink-0 bg-white border-t border-gray-100 flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
          <div className="hidden md:flex items-center gap-3">
            <span className="text-2xl">{steps[step].emoji}</span>
            <div>
              <p className="text-xs text-gray-400">Paso {step + 1} de 5</p>
              <p className="text-sm font-bold text-gray-800">{steps[step].label}</p>
            </div>
          </div>

          {/* Mobile: progress dots */}
          <div className="flex md:hidden items-center gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className={`rounded-full transition-all duration-300 ${i === step ? 'w-5 h-2 bg-green-500' : i < step ? 'w-2 h-2 bg-green-300' : 'w-2 h-2 bg-gray-200'}`} />
            ))}
          </div>

          <div className="flex gap-2 md:gap-3">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)}
                className="px-4 md:px-6 py-2.5 md:py-3 text-sm font-medium text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">
                ← Anterior
              </button>
            )}
            {step < steps.length - 1 ? (
              <button type="button" onClick={() => setStep(step + 1)}
                className="px-4 md:px-6 py-2.5 md:py-3 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-500 transition-all">
                Siguiente →
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading}
                className="px-5 md:px-7 py-2.5 md:py-3 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-500 disabled:opacity-50 transition-all flex items-center gap-2">
                {loading ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creando...</> : '✓ Crear evento'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SIDEBAR DERECHO — desktop siempre visible, mobile como drawer */}
      <div className={`
        fixed md:relative top-0 right-0 h-full z-50
        w-72 md:w-64 flex-shrink-0
        bg-gray-100 border-l border-gray-200
        flex flex-col justify-between py-8 px-5
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-1">Sistema</p>
              <h1 className="text-gray-800 text-lg font-bold">Crear Evento</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 rounded-xl bg-gray-200 text-gray-500">
              <FiX size={16} />
            </button>
          </div>

          <div className="space-y-1">
            {steps.map((s) => (
              <button key={s.id} type="button"
                onClick={() => { setStep(s.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${step === s.id
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <span className="text-base">{s.emoji}</span>
                <span className="flex-1 text-left">{s.label}</span>
                {step === s.id && <FiChevronRight className="text-green-500" size={14} />}
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-white rounded-2xl border border-gray-200">
            <p className="text-xs font-semibold text-green-600 mb-1">💡 Sobre este paso</p>
            <p className="text-xs text-gray-500 leading-relaxed">{steps[step].hint}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Progreso</span>
            <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
          </div>
          <p className="text-gray-400 text-xs mt-3 text-center">Paso {step + 1} de {steps.length}</p>
        </div>
      </div>
    </div>
  );
}