/**
 * Tipos de dados para o aplicativo StudyFlow
 */

export type ObjectiveStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface StudyObjective {
  id: string;
  title: string;
  description: string;
  deadline: string; // Formato YYYY-MM-DD
  status: ObjectiveStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface ObjectiveFormData {
  title: string;
  description: string;
  deadline: string;
  status: ObjectiveStatus;
}

export type StatusFilter = 'todos' | ObjectiveStatus;

export interface StatusConfig {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardBorder: string;
  iconName: string;
}

export const STATUS_CONFIG: Record<ObjectiveStatus, StatusConfig> = {
  nao_iniciado: {
    label: 'Não iniciado',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    cardBorder: 'border-l-amber-500',
    iconName: 'Circle',
  },
  em_andamento: {
    label: 'Em andamento',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
    badgeBorder: 'border-indigo-200',
    cardBorder: 'border-l-indigo-600',
    iconName: 'Clock',
  },
  concluido: {
    label: 'Concluído',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    cardBorder: 'border-l-emerald-500',
    iconName: 'CheckCircle2',
  },
};
