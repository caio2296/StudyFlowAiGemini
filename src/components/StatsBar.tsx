import React from 'react';
import { CheckCircle2, Clock, Circle, Target } from 'lucide-react';
import { StudyObjective } from '../types/objective';

interface StatsBarProps {
  objectives: StudyObjective[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ objectives }) => {
  const total = objectives.length;
  const concluidos = objectives.filter((item) => item.status === 'concluido').length;
  const emAndamento = objectives.filter((item) => item.status === 'em_andamento').length;
  const naoIniciados = objectives.filter((item) => item.status === 'nao_iniciado').length;

  const percentage = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Progresso Geral dos Estudos
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {concluidos} de {total} concluídos
            </span>
          </div>
          <p className="text-slate-600 text-sm mt-0.5">
            {total === 0
              ? 'Nenhum objetivo cadastrado no momento. Que tal começar agora?'
              : percentage === 100
              ? '🎉 Parabéns! Você concluiu todos os seus objetivos cadastrados!'
              : 'Mantenha a regularidade. Cada pequena meta concluída é um passo rumo ao domínio.'}
          </p>
        </div>

        {total > 0 && (
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="flex-1">
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-bold text-slate-800">{percentage}%</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-5">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-200/80 text-slate-700 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 block leading-none">{total}</span>
            <span className="text-xs text-slate-500 font-medium">Total cadastrados</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Circle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xl font-bold text-amber-900 block leading-none">{naoIniciados}</span>
            <span className="text-xs text-amber-700 font-medium">Não iniciados</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xl font-bold text-indigo-900 block leading-none">{emAndamento}</span>
            <span className="text-xs text-indigo-700 font-medium">Em andamento</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xl font-bold text-emerald-900 block leading-none">{concluidos}</span>
            <span className="text-xs text-emerald-700 font-medium">Concluídos</span>
          </div>
        </div>
      </div>
    </section>
  );
};
