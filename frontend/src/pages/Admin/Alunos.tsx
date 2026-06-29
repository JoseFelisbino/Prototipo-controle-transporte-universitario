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
import { Users, Plus, Edit2, Trash2, Phone, BookOpen, GraduationCap, Link2, AlertCircle } from 'lucide-react';

const studentSchema = z.object({
  nome: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres.' }),
  matricula: z.string().min(2, { message: 'Matrícula é obrigatória.' }),
  curso: z.string().min(2, { message: 'Curso é obrigatório.' }),
  telefone: z.string().min(8, { message: 'Telefone inválido.' }),
  transporteId: z.string().optional().nullable().transform(v => v === '' ? null : v),
  userId: z.string().optional().nullable().transform(v => v === '' ? null : v),
});

type StudentFormInputs = z.infer<typeof studentSchema>;

export const AdminAlunos: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Queries
  const { data: alunos = [], isLoading: aLoading } = useQuery<any[]>({
    queryKey: ['alunos'],
    queryFn: () => api.get('/alunos').then(res => res.data)
  });

  const { data: transportes = [], isLoading: tLoading } = useQuery<any[]>({
    queryKey: ['transportes'],
    queryFn: () => api.get('/transportes').then(res => res.data)
  });

  const { data: users = [], isLoading: uLoading } = useQuery<any[]>({
    queryKey: ['users'],
    queryFn: () => api.get('/auth/users').then(res => res.data)
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<StudentFormInputs>({
    resolver: zodResolver(studentSchema),
  });

  const openCreateModal = () => {
    setEditingStudent(null);
    reset({ transporteId: null, userId: null });
    setError(null);
    setIsOpen(true);
  };

  const openEditModal = (student: any) => {
    setEditingStudent(student);
    reset();
    setValue('nome', student.nome);
    setValue('matricula', student.matricula);
    setValue('curso', student.curso);
    setValue('telefone', student.telefone);
    setValue('transporteId', student.transporteId || '');
    setValue('userId', student.userId || '');
    setError(null);
    setIsOpen(true);
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: StudentFormInputs) => api.post('/alunos', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
      queryClient.invalidateQueries({ queryKey: ['transportes'] });
      setIsOpen(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Erro ao cadastrar aluno.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: StudentFormInputs) => api.put(`/alunos/${editingStudent.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
      queryClient.invalidateQueries({ queryKey: ['transportes'] });
      setIsOpen(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Erro ao salvar alterações.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/alunos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
      queryClient.invalidateQueries({ queryKey: ['transportes'] });
    }
  });

  const onSubmit = (data: StudentFormInputs) => {
    if (editingStudent) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente remover este aluno?')) {
      deleteMutation.mutate(id);
    }
  };

  if (aLoading || tLoading || uLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Filter out student-type users that are not linked, OR keep the currently editing user linked
  const eligibleUsers = users.filter((u: any) => {
    if (u.perfil !== 'ESTUDANTE') return false;
    if (editingStudent && editingStudent.userId === u.id) return true;
    return !u.aluno; // User doesn't have an Aluno record yet
  });

  const userOptions = [
    { value: '', label: 'Sem vínculo (Apenas registro acadêmico)' },
    ...eligibleUsers.map((u: any) => ({ value: u.id, label: `${u.nome} (${u.email})` }))
  ];

  const transportOptions = [
    { value: '', label: 'Sem transporte vinculado' },
    ...transportes.map((t: any) => ({ 
      value: t.id, 
      label: `${t.nome} (Vagas: ${t.alunos?.length || 0}/${t.capacidade})` 
    }))
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Users className="text-violet-400" size={24} />
            Gerenciamento de Alunos
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Cadastre os estudantes, vincule-os aos seus transportes e gerencie seus acessos.
          </p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-1.5 font-bold shadow-lg">
          <Plus size={16} />
          Novo Aluno
        </Button>
      </div>

      {alunos.length === 0 ? (
        <Card className="text-center py-12 text-zinc-500">
          Nenhum aluno cadastrado. Clique no botão acima para adicionar.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alunos.map((student) => (
            <Card key={student.id} className="flex flex-col justify-between gap-4 border border-zinc-800/40">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-bold text-zinc-100 truncate">{student.nome}</h3>
                  <div className="shrink-0">
                    {student.userId ? (
                      <Badge variant="success" className="flex items-center gap-1">
                        <Link2 size={10} />
                        Vinculado
                      </Badge>
                    ) : (
                      <Badge variant="neutral">Sem Conta</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-zinc-400 text-sm mt-3">
                  <GraduationCap size={14} className="text-zinc-500" />
                  <span>Matrícula: {student.matricula}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-sm mt-2">
                  <BookOpen size={14} className="text-zinc-500" />
                  <span>Curso: {student.curso}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-sm mt-2">
                  <Phone size={14} className="text-zinc-500" />
                  <span>Tel: {student.telefone}</span>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/40 text-xs">
                  <span className="block text-zinc-500 font-semibold uppercase">Transporte Alocado (RN09)</span>
                  <span className="block font-bold text-violet-400 mt-0.5 truncate">
                    {student.transporte ? student.transporte.nome : 'Nenhum veículo alocado'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-zinc-850">
                <Button 
                  onClick={() => openEditModal(student)} 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 p-2"
                >
                  <Edit2 size={13} />
                  Editar
                </Button>
                <Button 
                  onClick={() => handleDelete(student.id)} 
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
        title={editingStudent ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}
      >
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome do Aluno"
            placeholder="Ex: José Felisbino"
            error={errors.nome?.message}
            {...register('nome')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Número de Matrícula"
              placeholder="Ex: 20261001"
              error={errors.matricula?.message}
              {...register('matricula')}
            />

            <Input
              label="Telefone do Estudante"
              placeholder="Ex: (48) 99999-9999"
              error={errors.telefone?.message}
              {...register('telefone')}
            />
          </div>

          <Input
            label="Curso Universitário"
            placeholder="Ex: Engenharia de Software"
            error={errors.curso?.message}
            {...register('curso')}
          />

          <Select
            label="Veículo Alocado (RN09 / RN03)"
            options={transportOptions}
            error={errors.transporteId?.message}
            {...register('transporteId')}
          />

          <Select
            label="Vincular à Conta de Usuário (Estudante)"
            options={userOptions}
            error={errors.userId?.message}
            {...register('userId')}
          />

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/60">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingStudent ? 'Salvar Alterações' : 'Cadastrar Aluno'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
