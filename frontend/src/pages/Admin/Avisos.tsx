import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Dialog } from '../../components/ui/Dialog';
import { Badge } from '../../components/ui/Badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bell, Plus, Edit2, Trash2, Calendar, Bus, AlertCircle } from 'lucide-react';

const avisoSchema = z.object({
  titulo: z.string().min(2, { message: 'Título é obrigatório.' }),
  descricao: z.string().min(5, { message: 'A descrição deve ter pelo menos 5 caracteres.' }),
  transporteId: z.string().min(1, { message: 'Selecione o transporte afetado.' }),
});

type AvisoFormInputs = z.infer<typeof avisoSchema>;

export const AdminAvisos: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingAviso, setEditingAviso] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Queries
  const { data: avisos = [], isLoading: avLoading } = useQuery<any[]>({
    queryKey: ['avisos'],
    queryFn: () => api.get('/avisos').then(res => res.data)
  });

  const { data: transportes = [], isLoading: tLoading } = useQuery<any[]>({
    queryKey: ['transportes'],
    queryFn: () => api.get('/transportes').then(res => res.data)
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AvisoFormInputs>({
    resolver: zodResolver(avisoSchema),
  });

  const openCreateModal = () => {
    setEditingAviso(null);
    reset({ transporteId: '' });
    setError(null);
    setIsOpen(true);
  };

  const openEditModal = (av: any) => {
    setEditingAviso(av);
    reset();
    setValue('titulo', av.titulo);
    setValue('descricao', av.descricao);
    setValue('transporteId', av.transporteId);
    setError(null);
    setIsOpen(true);
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: AvisoFormInputs) => api.post('/avisos', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avisos'] });
      setIsOpen(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Erro ao emitir aviso.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: AvisoFormInputs) => api.put(`/avisos/${editingAviso.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avisos'] });
      setIsOpen(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Erro ao editar aviso.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/avisos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avisos'] });
    }
  });

  const onSubmit = (data: AvisoFormInputs) => {
    if (editingAviso) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este aviso?')) {
      deleteMutation.mutate(id);
    }
  };

  if (avLoading || tLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const transportOptions = [
    { value: '', label: 'Selecione o veículo afetado' },
    ...transportes.map(t => ({ value: t.id, label: t.nome }))
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Bell className="text-violet-400" size={24} />
            Mural de Avisos (RN06)
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Publique atrasos, mudanças de rota ou cancelamentos de serviços.
          </p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-1.5 font-bold shadow-lg">
          <Plus size={16} />
          Novo Aviso
        </Button>
      </div>

      {avisos.length === 0 ? (
        <Card className="text-center py-12 text-zinc-500">
          Nenhum aviso emitido até o momento.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {avisos.map((av) => (
            <Card key={av.id} className="flex flex-col justify-between gap-4 border border-rose-500/5 bg-rose-500/[0.02]">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-bold text-zinc-100">{av.titulo}</h3>
                  <Badge variant="danger" className="shrink-0 flex items-center gap-1">
                    <Bus size={10} />
                    {av.transporte?.nome || 'Geral'}
                  </Badge>
                </div>

                <p className="text-zinc-300 text-sm mt-3 leading-relaxed whitespace-pre-wrap">
                  {av.descricao}
                </p>

                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-semibold mt-4">
                  <Calendar size={12} />
                  <span>
                    Postado em: {new Date(av.data).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-zinc-800/40">
                <Button 
                  onClick={() => openEditModal(av)} 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 p-2"
                >
                  <Edit2 size={13} />
                  Editar
                </Button>
                <Button 
                  onClick={() => handleDelete(av.id)} 
                  variant="danger" 
                  size="sm" 
                  className="flex items-center gap-1.5 p-2"
                >
                  <Trash2 size={13} />
                  Excluir
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog Form */}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingAviso ? 'Editar Aviso' : 'Publicar Novo Aviso'}
      >
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Título do Aviso (Curto e direto)"
            placeholder="Ex: Atraso de 10 min devido à chuva"
            error={errors.titulo?.message}
            {...register('titulo')}
          />

          <Select
            label="Veículo Afetado (RN06)"
            options={transportOptions}
            error={errors.transporteId?.message}
            {...register('transporteId')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">Descrição do Aviso</label>
            <textarea
              placeholder="Descreva o motivo do alerta..."
              rows={4}
              className={`w-full px-4 py-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all duration-150 ${
                errors.descricao ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              {...register('descricao')}
            />
            {errors.descricao && <span className="text-xs font-medium text-red-400">{errors.descricao.message}</span>}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/60">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingAviso ? 'Salvar Alterações' : 'Publicar Aviso'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
