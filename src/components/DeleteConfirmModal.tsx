import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { StudyObjective } from '../types/objective';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  objective: StudyObjective | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  objective,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen || !objective) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 id="delete-dialog-title" className="text-lg font-bold text-slate-900 mb-2">
            Confirmar exclusão
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed mb-3">
            Tem certeza de que deseja excluir este objetivo de estudo?
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-5 text-sm text-slate-800 font-medium italic">
            "{objective.title}"
          </div>

          <p className="text-xs text-slate-400 mb-6">
            Esta ação não poderá ser desfeita após a confirmação.
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Sim, excluir objetivo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
