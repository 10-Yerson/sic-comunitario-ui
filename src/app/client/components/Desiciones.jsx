'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';
import {
  FiX,
  FiPlus,
  FiTrash2,
  FiSave,
  FiFileText,
  FiUser,
  FiAlertCircle,
  FiCheck
} from 'react-icons/fi';

export default function DecisionsModal({ event, onClose }) {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Formulario para nueva decisión
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

  // 👇 NUEVA FUNCIÓN: Guardar decisión individual inmediatamente
  const handleAddAndSaveDecision = async () => {
    if (!newDecision.decision.trim()) {
      toast.warning('Por favor ingresa una decisión');
      return;
    }

    try {
      setSaving(true);

      // Agregar la nueva decisión al array existente
      const updatedDecisions = [
        ...decisions,
        {
          decision: newDecision.decision,
          responsable: newDecision.responsable || ''
        }
      ];

      // Guardar inmediatamente
      await axios.put(`/api/event/${event._id}/decisions`, {
        decisions: updatedDecisions
      });

      // Actualizar el estado local
      const res = await axios.get(`/api/event/${event._id}`);
      setDecisions(res.data.event.decisions || []);

      // Limpiar formulario
      setNewDecision({ decision: '', responsable: '' });
      
      toast.success('✓ Decisión guardada exitosamente');
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.msg || 'Error al guardar la decisión'
      );
    } finally {
      setSaving(false);
    }
  };

  // 👇 FUNCIÓN MEJORADA: Eliminar decisión individual
  const handleDeleteDecision = async (decisionId, index) => {
    if (!window.confirm('¿Estás seguro de eliminar esta decisión?')) {
      return;
    }

    try {
      setSaving(true);

      // Eliminar del array
      const updatedDecisions = decisions.filter((_, i) => i !== index);

      // Guardar cambios
      await axios.put(`/api/event/${event._id}/decisions`, {
        decisions: updatedDecisions
      });

      // Actualizar estado local
      setDecisions(updatedDecisions);
      
      toast.success('Decisión eliminada exitosamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar la decisión');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FiFileText size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Decisiones Tomadas</h2>
                <p className="text-purple-100 text-sm mt-1">
                  {event.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Formulario para agregar nueva decisión */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 mb-6 border border-purple-200">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Decisión *
                </label>
                <textarea
                  value={newDecision.decision}
                  onChange={(e) =>
                    setNewDecision({ ...newDecision, decision: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleAddAndSaveDecision();
                    }
                  }}
                  placeholder="Ej: Aprobar presupuesto de $5,000 para reparación de la piscina"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows="3"
                  disabled={saving}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Presiona Ctrl + Enter para guardar rápido
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiUser size={14} />
                  Responsable (opcional)
                </label>
                <input
                  type="text"
                  value={newDecision.responsable}
                  onChange={(e) =>
                    setNewDecision({
                      ...newDecision,
                      responsable: e.target.value
                    })
                  }
                  placeholder="Ej: Junta directiva, Comité de seguridad..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={saving}
                />
              </div>

              <button
                onClick={handleAddAndSaveDecision}
                disabled={saving || !newDecision.decision.trim()}
                className={`
                  w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2
                  ${
                    saving || !newDecision.decision.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02]'
                  }
                `}
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <FiCheck />
                    Guardar Decisión
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Lista de decisiones */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FiFileText className="text-indigo-600" />
                Decisiones Registradas
              </h3>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {decisions.length} {decisions.length === 1 ? 'decisión' : 'decisiones'}
              </span>
            </div>

            {decisions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <FiAlertCircle className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-500 font-medium">
                  No hay decisiones registradas aún
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Usa el formulario de arriba para agregar la primera decisión
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {decisions.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                          {index + 1}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-medium leading-relaxed mb-2">
                          {item.decision}
                        </p>

                        {item.responsable && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full">
                              <FiUser size={12} />
                              <span className="font-medium">{item.responsable}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteDecision(item._id, index)}
                        disabled={saving}
                        className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Eliminar decisión"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              💡 Cada decisión se guarda automáticamente
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}