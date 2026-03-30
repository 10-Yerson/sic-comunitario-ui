'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';
import {
  FiX, FiPlus, FiTrash2, FiSave,
  FiFileText, FiUser, FiAlertCircle, FiCheck
} from 'react-icons/fi';

export default function DecisionsModal({ event, onClose, onUpdate }) {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newDecision, setNewDecision] = useState({
    decision: '',
    responsable: ''
  });

  useEffect(() => {
    if (event) {
      setDecisions(event.decisions || []);
      setLoading(false);
    }
  }, [event]);

  const handleAddAndSaveDecision = async () => {
    if (!newDecision.decision.trim()) {
      toast.warning('Por favor ingresa una decisión');
      return;
    }
    try {
      setSaving(true);
      const updatedDecisions = [
        ...decisions,
        { decision: newDecision.decision, responsable: newDecision.responsable || '' }
      ];
      await axios.put(`/api/event/${event._id}/decisions`, { decisions: updatedDecisions });
      const res = await axios.get(`/api/event/${event._id}`);
      setDecisions(res.data.event.decisions || []);
      setNewDecision({ decision: '', responsable: '' });
      toast.success('Decisión guardada exitosamente');
      onUpdate?.(); 
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error al guardar la decisión');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDecision = async (decisionId, index) => {
    try {
      setSaving(true);
      const updatedDecisions = decisions.filter((_, i) => i !== index);
      await axios.put(`/api/event/${event._id}/decisions`, { decisions: updatedDecisions });
      setDecisions(updatedDecisions);
      toast.success('Decisión eliminada exitosamente');
      onUpdate?.();
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar la decisión');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-7 py-5 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">Reunión · {event.title}</p>
              <h2 className="text-white text-xl font-bold flex items-center gap-2">
                <FiFileText size={20} /> Decisiones Tomadas
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full font-medium">
              {decisions.length} {decisions.length === 1 ? 'decisión' : 'decisiones'} registradas
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">

          {/* FORM */}
          <div className="px-7 py-5 border-b border-gray-100 bg-gray-50/50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Nueva decisión</p>
            <div className="space-y-3">
              <textarea
                value={newDecision.decision}
                onChange={(e) => setNewDecision({ ...newDecision, decision: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleAddAndSaveDecision(); }}
                placeholder="Describe la decisión tomada en la reunión..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none bg-white placeholder:text-gray-300"
                rows="3"
                disabled={saving}
              />
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                  <input
                    type="text"
                    value={newDecision.responsable}
                    onChange={(e) => setNewDecision({ ...newDecision, responsable: e.target.value })}
                    placeholder="Responsable (opcional)"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white placeholder:text-gray-300"
                    disabled={saving}
                  />
                </div>
                <button
                  onClick={handleAddAndSaveDecision}
                  disabled={saving || !newDecision.decision.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiCheck size={15} />
                  )}
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
              <p className="text-xs text-gray-400">Ctrl + Enter para guardar rápido</p>
            </div>
          </div>

          {/* LIST */}
          <div className="px-7 py-5">
            {decisions.length === 0 ? (
              <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-xl">
                <FiAlertCircle className="mx-auto text-gray-300 mb-3" size={40} />
                <p className="text-gray-400 font-medium text-sm">No hay decisiones registradas aún</p>
                <p className="text-gray-300 text-xs mt-1">Usa el formulario de arriba para agregar la primera</p>
              </div>
            ) : (
              <div className="space-y-3">
                {decisions.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="group flex gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:border-slate-200 hover:shadow-sm transition-all duration-200"
                  >
                    {/* Número */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-sm font-medium leading-relaxed">{item.decision}</p>
                      {item.responsable && (
                        <div className="flex items-center gap-1 mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span className="text-xs text-slate-500 font-medium">{item.responsable}</span>
                        </div>
                      )}
                    </div>

                    {/* Eliminar */}
                    <button
                      onClick={() => handleDeleteDecision(item._id, index)}
                      disabled={saving}
                      className="flex-shrink-0 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-7 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center flex-shrink-0">
          <p className="text-xs text-gray-400">💡 Cada decisión se guarda automáticamente</p>
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