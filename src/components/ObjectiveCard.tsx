import React from 'react';
import { Calendar, Clock, Edit3, Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { ObjectiveStatus, STATUS_CONFIG, StudyObjective } from '../types/objective';

interface ObjectiveCardProps {
  objective: StudyObjective;
  onEdit: (objective: StudyObjective) => void;
  onDeleteRequest: (objective: StudyObjective) => void;
  onStatusChange: (id: string, newStatus: ObjectiveStatus) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const statusInfo = STATUS_CONFIG[objective.status];

  // Formatação amigável da data de prazo em Português do Brasil
  const formatDeadline = (dateStr: string) => {
    if (!dateStr) return 'Sem prazo definido';
    try {
      const [year, month, day] = dateStr.split('-');
      if (!year || !month || !day) return dateStr;

      const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(dateObj);
    } catch {
      return dateStr;
    }
  };

  // Cálculo de status de vencimento do prazo
  const getDeadlineStatus = (dateStr: string, status: ObjectiveStatus) => {
    if (!dateStr || status === 'concluido') return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = dateStr.split('-').map(Number);
    const deadlineDate = new Date(year, month - 1, day);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Atrasado há ${Math.abs(diffDays)} dia(s)`, alert: true };
    }
    if (diffDays === 0) {
      return { text: 'Vence hoje!', warning: true };
    }
    if (diffDays === 1) {
      return { text: 'Vence amanhã', warning: true };
    }
    return null;
  };

  const deadlineWarning = getDeadlineStatus(objective.deadline, objective.status);

  return (
    <article
      className={`bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative border-l-4 ${statusInfo.cardBorder}`}
    >
      <div>
        {/* Cabeçalho do Cartão: Status Badge e Ações */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.badgeBg} ${statusInfo.badgeText} ${statusInfo.badgeBorder}`}
            >
              {objective.status === 'nao_iniciado' && <Circle className="w-3 h-3 stroke-[2.5]" />}
              {objective.status === 'em_andamento' && <Clock className="w-3 h-3 stroke-[2.5]" />}
              {objective.status === 'concluido' && <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />}
              {statusInfo.label}
            </span>

            {deadlineWarning && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                  deadlineWarning.alert
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                <AlertCircle className="w-3 h-3 shrink-0" />
                {deadlineWarning.text}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(objective)}
              title="Editar objetivo"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              aria-label={`Editar ${objective.title}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteRequest(objective)}
              title="Excluir objetivo"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              aria-label={`Excluir ${objective.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base sm:text-lg font-bold text-slate-900 leading-snug mb-2 ${
            objective.status === 'concluido' ? 'line-through text-slate-500' : ''
          }`}
        >
          {objective.title}
        </h3>

        {/* Descrição do Objetivo */}
        {objective.description ? (
          <p className="text-slate-600 text-sm leading-relaxed mb-4 whitespace-pre-line line-clamp-3">
            {objective.description}
          </p>
        ) : (
          <p className="text-slate-400 text-xs italic mb-4">Sem descrição adicional.</p>
        )}
      </div>

      {/* Rodapé do Cartão: Prazo e Alternador Rápido de Status */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Prazo: {formatDeadline(objective.deadline)}</span>
        </div>

        {/* Seletor rápido de status */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200/60">
          <button
            type="button"
            onClick={() => onStatusChange(objective.id, 'nao_iniciado')}
            title="Marcar como Não iniciado"
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              objective.status === 'nao_iniciado'
                ? 'bg-amber-100 text-amber-900 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Pendente
          </button>
          <button
            type="button"
            onClick={() => onStatusChange(objective.id, 'em_andamento')}
            title="Marcar como Em andamento"
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              objective.status === 'em_andamento'
                ? 'bg-indigo-100 text-indigo-900 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Fazendo
          </button>
          <button
            type="button"
            onClick={() => onStatusChange(objective.id, 'concluido')}
            title="Marcar como Concluído"
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              objective.status === 'concluido'
                ? 'bg-emerald-100 text-emerald-900 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Concluído
          </button>
        </div>
      </div>
    </article>
  );
};
