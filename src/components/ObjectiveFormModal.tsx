import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calendar, BookOpen, AlertCircle, CheckCircle2, Clock, Circle } from 'lucide-react';
import { ObjectiveFormData, ObjectiveStatus, StudyObjective } from '../types/objective';

interface ObjectiveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ObjectiveFormData) => void;
  editingObjective: StudyObjective | null;
}

export const ObjectiveFormModal: React.FC<ObjectiveFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingObjective,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ObjectiveStatus>('nao_iniciado');
  const [error, setError] = useState<string | null>(null);

  // Inicializa o formulário com dados existentes se estiver editando ou limpa se for novo
  useEffect(() => {
    if (editingObjective) {
      setTitle(editingObjective.title);
      setDescription(editingObjective.description || '');
      setDeadline(editingObjective.deadline || '');
      setStatus(editingObjective.status);
    } else {
      setTitle('');
      setDescription('');
      // Sugere prazo padrão para daqui a 7 dias
      const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setDeadline(defaultDate);
      setStatus('nao_iniciado');
    }
    setError(null);
  }, [editingObjective, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, informe o título do seu objetivo de estudo.');
      return;
    }

    if (!deadline) {
      setError('Por favor, defina um prazo para guiar o seu progresso.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
    onClose();
  };

  // Atalhos rápidos para prazos
  const setQuickDeadline = (days: number) => {
    const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setDeadline(d.toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Topo do Modal */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              {editingObjective ? <BookOpen className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-slate-900">
                {editingObjective ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
              </h2>
              <p className="text-xs text-slate-500">
                {editingObjective
                  ? 'Atualize as informações do seu objetivo de estudo'
                  : 'Defina uma meta clara e alcançável para guiar seu aprendizado'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Campo Título */}
          <div>
            <label htmlFor="objective-title" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Título do Objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="objective-title"
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ex: Aprender o que são variáveis e tipos primitivos"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Dica: Seja específico! Metas menores e claras são mais fáceis de concluir.
            </p>
          </div>

          {/* Campo Descrição */}
          <div>
            <label htmlFor="objective-desc" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Descrição ou Anotações <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              id="objective-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Ler o capítulo 2 da apostila, assistir a aula 3 do canal e fazer 3 exercícios práticos."
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Campo Prazo */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="objective-deadline" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Prazo Limite <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1.5 text-[11px] text-indigo-600">
                <span className="text-slate-400">Atalhos:</span>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(1)}
                  className="hover:underline font-medium cursor-pointer"
                >
                  Amanhã
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(7)}
                  className="hover:underline font-medium cursor-pointer"
                >
                  7 dias
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(14)}
                  className="hover:underline font-medium cursor-pointer"
                >
                  14 dias
                </button>
              </div>
            </div>

            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="objective-deadline"
                type="date"
                required
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Campo Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Status Atual
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('nao_iniciado')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  status === 'nao_iniciado'
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold ring-2 ring-amber-400/40'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Circle className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
                Não iniciado
              </button>

              <button
                type="button"
                onClick={() => setStatus('em_andamento')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  status === 'em_andamento'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold ring-2 ring-indigo-400/40'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
                Em andamento
              </button>

              <button
                type="button"
                onClick={() => setStatus('concluido')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  status === 'concluido'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold ring-2 ring-emerald-400/40'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                Concluído
              </button>
            </div>
          </div>

          {/* Rodapé e Botões de Submissão */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              {editingObjective ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
