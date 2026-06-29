import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Dialog } from '../../components/ui/Dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserSquare2, Plus, Edit2, Trash2, Phone, CreditCard, AlertCircle } from 'lucide-react';

const motoristaSchema = z.object({
  nome: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres.' }),
  telefone: z.string().min(8, { message: 'Telefone inválido.' }),
  CNH: z.string().min(5, { message: 'CNH inválida.' }),
});

type MotoristaFormInputs = z.infer<typeof motoristaSchema>;

export const AdminMotoristas: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: motoristas = [], isLoading } = useQuery<any[]>({
    queryKey: ['motoristas'],
    queryFn: () => api.get('/motoristas').then(res => res.data)
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<MotoristaFormInputs>({
    resolver: zodResolver(motoristaSchema),
  });

  const openCreateModal = () => {
    setEditingDriver(null);
    reset();
    setError(null);
    setIsOpen(true);
  };

  const openEditModal = (driver: any) => {
    setEditingDriver(driver);
    reset();
    setValue('nome', driver.nome);
    setValue('telefone', driver.telefone);
    setValue('CNH', driver.CNH);
    setError(null);
    setIsOpen(true);
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: MotoristaFormInputs) => api.post('/motoristas', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoristas'] });
      setIsOpen(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Erro ao criar motorista.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: MotoristaFormInputs) => api.put(`/motoristas/${editingDriver.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoristas'] });
      setIsOpen(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Erro ao editar motorista.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/motoristas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoristas'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Não é possível excluir motorista associado a veículos.');
    }
  });

  const onSubmit = (data: MotoristaFormInputs) => {
    if (editingDriver) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este motorista?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <UserSquare2 className="text-violet-400" size={24} />
            Gerenciamento de Motoristas
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Cadastre, edite e remova os motoristas responsáveis pelo transporte.
          </p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-1.5 font-bold shadow-lg">
          <Plus size={16} />
          Novo Motorista
        </Button>
      </div>

      {motoristas.length === 0 ? (
        <Card className="text-center py-12 text-zinc-500">
          Nenhum motorista cadastrado no momento. Clique no botão acima para cadastrar.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {motoristas.map((driver) => (
            <Card key={driver.id} className="flex flex-col justify-between gap-4 border border-zinc-800/40">
              <div>
                <h3 className="text-lg font-bold text-zinc-100 truncate">{driver.nome}</h3>
                <div className="flex items-center gap-2 text-zinc-400 text-sm mt-3">
                  <Phone size={14} className="text-zinc-500" />
                  <span>{driver.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-sm mt-2">
                  <CreditCard size={14} className="text-zinc-500" />
                  <span>CNH: {driver.CNH}</span>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/40 text-xs text-zinc-500 font-semibold">
                  Transportes Vinculados: {driver.transportes?.length || 0}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-zinc-850">
                <Button 
                  onClick={() => openEditModal(driver)} 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 p-2"
                >
                  <Edit2 size={13} />
                  Editar
                </Button>
                <Button 
                  onClick={() => handleDelete(driver.id)} 
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

      {/* Modal Dialog */}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingDriver ? 'Editar Motorista' : 'Cadastrar Novo Motorista'}
      >
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome do Motorista"
            placeholder="Nome completo"
            error={errors.nome?.message}
            {...register('nome')}
          />

          <Input
            label="Telefone de Contato"
            placeholder="(48) 99999-9999"
            error={errors.telefone?.message}
            {...register('telefone')}
          />

          <Input
            label="Número da CNH"
            placeholder="Ex: 12345678901"
            error={errors.CNH?.message}
            {...register('CNH')}
          />

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/60">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingDriver ? 'Salvar Alterações' : 'Cadastrar Motorista'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
