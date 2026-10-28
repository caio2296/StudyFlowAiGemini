import React from 'react';
import { BookOpen, Plus, Compass, Sparkles } from 'lucide-react';
import { StatusFilter } from '../types/objective';

interface EmptyStateProps {
  currentFilter: StatusFilter;
  hasAnyObjectives: boolean;
  searchTerm: string;
  onOpenCreateModal: () => void;
  onClearFilters: () => void;
  onRestoreSamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  currentFilter,
  hasAnyObjectives,
  searchTerm,
  onOpenCreateModal,
  onClearFilters,
  onRestoreSamples,
}) => {
  // Caso de filtro ativo ou busca sem resultados
  if (hasAnyObjectives && (currentFilter !== 'todos' || searchTerm.trim() !== '')) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center mb-4">
          <Compass className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Não localizamos nenhum objetivo com os filtros ou termo de busca atuais.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
        >
          Limpar filtros e busca
        </button>
      </div>
    );
  }

  // Caso onde realmente não há nenhum objetivo cadastrado (lista vazia)
  return (
    <div className="bg-gradient-to-b from-indigo-50/50 via-white to-white rounded-3xl p-8 sm:p-12 text-center border border-indigo-100/80 shadow-xs max-w-xl mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center mb-5 shadow-lg shadow-indigo-200">
        <BookOpen className="w-8 h-8 stroke-[2.2]" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold mb-3">
        <Sparkles className="w-3.5 h-3.5" /> Comece sua jornada
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
        Sua trilha de estudos está limpa!
      </h3>

      <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
        Não há nenhum objetivo cadastrado no momento. Cadastre agora o que você deseja aprender primeiro ou carregue exemplos práticos.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Cadastrar Primeiro Objetivo
        </button>

        {onRestoreSamples && (
          <button
            type="button"
            onClick={onRestoreSamples}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
          >
            Carregar Exemplos Sugeridos
          </button>
        )}
      </div>

      {/* Dicas para estudantes iniciantes */}
      <div className="mt-8 pt-6 border-t border-indigo-100/80 text-left">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          💡 Dica de ouro para iniciantes:
        </h4>
        <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside">
          <li>Prefira objetivos que possam ser cumpridos em poucos dias.</li>
          <li>Coloque prazos realistas para manter a motivação em alta.</li>
          <li>Marque o status como "Em andamento" assim que começar a estudar.</li>
        </ul>
      </div>
    </div>
  );
};
