/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { ObjectiveCard } from './components/ObjectiveCard';
import { ObjectiveFormModal } from './components/ObjectiveFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { storageService } from './services/storageService';
import { ObjectiveFormData, ObjectiveStatus, StatusFilter, StudyObjective } from './types/objective';
import { Check, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const [objectives, setObjectives] = useState<StudyObjective[]>([]);
  const [currentFilter, setCurrentFilter] = useState<StatusFilter>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<StudyObjective | null>(null);
  const [deletingObjective, setDeletingObjective] = useState<StudyObjective | null>(null);

  // Notificações temporárias (Toast)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Carrega os objetivos do localStorage ao montar o componente
  useEffect(() => {
    const loaded = storageService.getObjectives();
    setObjectives(loaded);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  // Abrir modal de criação
  const handleOpenCreateModal = () => {
    setEditingObjective(null);
    setIsFormModalOpen(true);
  };

  // Abrir modal de edição
  const handleOpenEditModal = (obj: StudyObjective) => {
    setEditingObjective(obj);
    setIsFormModalOpen(true);
  };

  // Abrir modal de confirmação de exclusão
  const handleRequestDelete = (obj: StudyObjective) => {
    setDeletingObjective(obj);
  };

  // Salvar (criar ou editar)
  const handleFormSubmit = (formData: ObjectiveFormData) => {
    if (editingObjective) {
      const updated = storageService.updateObjective(editingObjective.id, formData);
      if (updated) {
        setObjectives((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        showToast('Objetivo de estudo atualizado com sucesso!');
      }
    } else {
      const created = storageService.createObjective(formData);
      setObjectives((prev) => [created, ...prev]);
      showToast('Novo objetivo de estudo cadastrado!');
    }
  };

  // Confirmar exclusão
  const handleConfirmDelete = () => {
    if (!deletingObjective) return;
    const success = storageService.deleteObjective(deletingObjective.id);
    if (success) {
      setObjectives((prev) => prev.filter((item) => item.id !== deletingObjective.id));
      showToast('Objetivo excluído.');
    }
    setDeletingObjective(null);
  };

  // Alternância rápida de status a partir do cartão
  const handleStatusChange = (id: string, newStatus: ObjectiveStatus) => {
    const updated = storageService.updateObjective(id, { status: newStatus });
    if (updated) {
      setObjectives((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      if (newStatus === 'concluido') {
        showToast('Parabéns pela conclusão de mais uma meta! 🎓');
      } else {
        showToast('Status atualizado.');
      }
    }
  };

  // Restaurar exemplos sugeridos
  const handleRestoreSamples = () => {
    const samples = storageService.resetToSample();
    setObjectives(samples);
    showToast('Exemplos de objetivos carregados com sucesso!');
  };

  // Filtragem e busca de objetivos
  const filteredObjectives = useMemo(() => {
    return objectives.filter((item) => {
      // Filtro por status
      if (currentFilter !== 'todos' && item.status !== currentFilter) {
        return false;
      }
      // Filtro por busca de texto
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        return matchesTitle || matchesDesc;
      }
      return true;
    });
  }, [objectives, currentFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Cabeçalho */}
      <Header onOpenCreateModal={handleOpenCreateModal} />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Painel de Quantidade de Objetivos e Estatísticas */}
        <StatsBar objectives={objectives} />

        {/* Barra de Filtros e Busca */}
        <FilterBar
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalFilteredCount={filteredObjectives.length}
          totalCount={objectives.length}
          onResetSamples={handleRestoreSamples}
        />

        {/* Listagem de Objetivos em Cartões ou Estado Vazio */}
        {filteredObjectives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredObjectives.map((obj) => (
              <ObjectiveCard
                key={obj.id}
                objective={obj}
                onEdit={handleOpenEditModal}
                onDeleteRequest={handleRequestDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            currentFilter={currentFilter}
            hasAnyObjectives={objectives.length > 0}
            searchTerm={searchTerm}
            onOpenCreateModal={handleOpenCreateModal}
            onClearFilters={() => {
              setCurrentFilter('todos');
              setSearchTerm('');
            }}
            onRestoreSamples={objectives.length === 0 ? handleRestoreSamples : undefined}
          />
        )}
      </main>

      {/* Rodapé Acolhedor */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">StudyFlow</span>
            <span>— Seu espaço para organizar e conquistar metas de estudo</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Dados salvos automaticamente no seu navegador</span>
          </div>
        </div>
      </footer>

      {/* Modal de Criação / Edição */}
      <ObjectiveFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingObjective={editingObjective}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={deletingObjective !== null}
        objective={deletingObjective}
        onCancel={() => setDeletingObjective(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
