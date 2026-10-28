/**
 * Serviço de armazenamento local (localStorage) para os objetivos do StudyFlow
 */

import { ObjectiveFormData, StudyObjective } from '../types/objective';

const STORAGE_KEY = 'studyflow_objectives_v1';

// Exemplos didáticos para inicialização amigável de novos estudantes
const INITIAL_SEED_OBJECTIVES: StudyObjective[] = [
  {
    id: 'seed-1',
    title: 'Compreender a estrutura básica de HTML e CSS',
    description: 'Aprender sobre tags semânticas (<main>, <header>, <section>) e os conceitos básicos de estilização como margens e cores.',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'seed-2',
    title: 'Praticar 5 exercícios de lógica e condicionais',
    description: 'Resolver desafios práticos de if/else e operadores lógicos no caderno ou editor de código.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'nao_iniciado',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'seed-3',
    title: 'Configurar o ambiente de estudos e ferramentas',
    description: 'Instalar o navegador para testes, o editor de código e criar uma pasta organizada no computador.',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const storageService = {
  /**
   * Obtém todos os objetivos salvos no localStorage.
   * Se for a primeira vez que o usuário acessa, carrega os dados de boas-vindas.
   */
  getObjectives(): StudyObjective[] {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) {
        // Inicializa com objetivos de exemplo para o estudante iniciante já ter uma referência visual
        this.saveObjectives(INITIAL_SEED_OBJECTIVES);
        return INITIAL_SEED_OBJECTIVES;
      }
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa de objetivos no localStorage.
   */
  saveObjectives(objectives: StudyObjective[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cria e salva um novo objetivo.
   */
  createObjective(data: ObjectiveFormData): StudyObjective {
    const currentList = this.getObjectives();
    const newObjective: StudyObjective = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `obj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [newObjective, ...currentList];
    this.saveObjectives(updatedList);
    return newObjective;
  },

  /**
   * Atualiza um objetivo existente.
   */
  updateObjective(id: string, data: Partial<ObjectiveFormData>): StudyObjective | null {
    const currentList = this.getObjectives();
    const index = currentList.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const currentItem = currentList[index];
    const updatedItem: StudyObjective = {
      ...currentItem,
      title: data.title !== undefined ? data.title.trim() : currentItem.title,
      description: data.description !== undefined ? data.description.trim() : currentItem.description,
      deadline: data.deadline !== undefined ? data.deadline : currentItem.deadline,
      status: data.status !== undefined ? data.status : currentItem.status,
      updatedAt: new Date().toISOString(),
    };

    currentList[index] = updatedItem;
    this.saveObjectives(currentList);
    return updatedItem;
  },

  /**
   * Exclui um objetivo pelo seu identificador.
   */
  deleteObjective(id: string): boolean {
    const currentList = this.getObjectives();
    const filteredList = currentList.filter((item) => item.id !== id);
    if (filteredList.length === currentList.length) {
      return false;
    }
    this.saveObjectives(filteredList);
    return true;
  },

  /**
   * Restaura os objetivos de exemplo iniciais (útil para testes e exploração)
   */
  resetToSample(): StudyObjective[] {
    this.saveObjectives(INITIAL_SEED_OBJECTIVES);
    return INITIAL_SEED_OBJECTIVES;
  },

  /**
   * Limpa todos os objetivos.
   */
  clearAll(): void {
    this.saveObjectives([]);
  },
};
