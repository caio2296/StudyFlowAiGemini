import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { StatusFilter } from '../types/objective';

interface FilterBarProps {
  currentFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  totalFilteredCount: number;
  totalCount: number;
  onResetSamples: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  totalFilteredCount,
  totalCount,
  onResetSamples,
}) => {
  const filterOptions: { id: StatusFilter; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'nao_iniciado', label: 'Não iniciados' },
    { id: 'em_andamento', label: 'Em andamento' },
    { id: 'concluido', label: 'Concluídos' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
      {/* Abas de filtro por status */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {filterOptions.map((opt) => {
          const isActive = currentFilter === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onFilterChange(opt.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Campo de busca e utilitários */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {totalCount === 0 && (
          <button
            type="button"
            onClick={onResetSamples}
            title="Carregar objetivos de exemplo"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Restaurar Exemplos</span>
          </button>
        )}
      </div>
    </div>
  );
};
