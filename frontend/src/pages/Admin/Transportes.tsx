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
import { 
  Bus, 
  Plus, 
  Edit2, 
  Trash2, 
  Map, 
  MapPin, 
  DollarSign, 
  Users, 
  User, 
  AlertCircle,
  Clock
} from 'lucide-react';

// Form schemas
const transportSchema = z.object({
  nome: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres.' }),
  tipo: z.enum(['ONIBUS', 'VAN', 'CARRO']),
  capacidade: z.coerce.number().int().min(1, { message: 'Capacidade mínima é 1.' }),
  gratuito: z.string().transform(v => v === 'true'),
  valor: z.coerce.number().optional().nullable(),
  motoristaId: z.string().min(1, { message: 'Selecione um motorista.' }),
});

const routeSchema = z.object({
  nome: z.string().min(2, { message: 'Nome da rota é obrigatório.' }),
  horarioSaida: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato HH:MM necessário.' }),
  horarioChegada: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato HH:MM necessário.' }),
});

const stopSchema = z.object({
  nome: z.string().min(2, { message: 'Nome do ponto é obrigatório.' }),
  endereco: z.string().min(2, { message: 'Endereço é obrigatório.' }),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
});

type TransportFormInputs = z.infer<typeof transportSchema>;
type RouteFormInputs = z.infer<typeof routeSchema>;
type StopFormInputs = z.infer<typeof stopSchema>;

export const AdminTransportes: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const [isStopsOpen, setIsStopsOpen] = useState(false);
  
  const [editingTransport, setEditingTransport] = useState<any | null>(null);
  const [activeTransportId, setActiveTransportId] = useState<string | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [stopError, setStopError] = useState<string | null>(null);

  // Queries
  const { data: transportes = [], isLoading: tLoading } = useQuery<any[]>({
    queryKey: ['transportes'],
    queryFn: () => api.get('/transportes').then(res => res.data)
  });

  const { data: motoristas = [], isLoading: mLoading } = useQuery<any[]>({
    queryKey: ['motoristas'],
    queryFn: () => api.get('/motoristas').then(res => res.data)
  });

  // Forms hook setup
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TransportFormInputs>({
    resolver: zodResolver(transportSchema),
  });

  const { register: regRoute, handleSubmit: subRoute, reset: resRoute, setValue: setValRoute, formState: { errors: errRoute } } = useForm<RouteFormInputs>({
    resolver: zodResolver(routeSchema),
  });

  const { register: regStop, handleSubmit: subStop, reset: resStop, formState: { errors: errStop } } = useForm<StopFormInputs>({
    resolver: zodResolver(stopSchema),
  });

  const isGratuito = watch('gratuito');

  // Modal Openers
  const openCreateModal = () => {
    setEditingTransport(null);
    reset({ gratuito: 'true', valor: null });
    setError(null);
    setIsOpen(true);
  };

  const openEditModal = (t: any) => {
    setEditingTransport(t);
    reset();
    setValue('nome', t.nome);
    setValue('tipo', t.tipo);
    setValue('capacidade', t.capacidade);
    setValue('gratuito', String(t.gratuito));
    setValue('valor', t.valor);
    setValue('motoristaId', t.motoristaId);
    setError(null);
    setIsOpen(true);
  };

  const openRouteModal = (t: any) => {
    setActiveTransportId(t.id);
    resRoute();
    if (t.rota) {
      setValRoute('nome', t.rota.nome);
      setValRoute('horarioSaida', t.rota.horarioSaida);
      setValRoute('horarioChegada', t.rota.horarioChegada);
    }
    setRouteError(null);
    setIsRouteOpen(true);
  };

  const openStopsModal = (t: any) => {
    setActiveTransportId(t.id);
    resStop();
    setStopError(null);
    setIsStopsOpen(true);
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: TransportFormInputs) => api.post('/transportes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportes'] });
      setIsOpen(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Erro ao criar veículo.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: TransportFormInputs) => api.put(`/transportes/${editingTransport.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportes'] });
      setIsOpen(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Erro ao atualizar veículo.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/transportes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportes'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Erro ao excluir veículo.');
    }
  });

  const routeMutation = useMutation({
    mutationFn: (data: RouteFormInputs) => {
      const activeTransport = transportes.find(t => t.id === activeTransportId);
      if (activeTransport?.rota) {
        return api.put(`/rotas/${activeTransport.rota.id}`, { ...data, transporteId: activeTransportId });
      } else {
        return api.post('/rotas', { ...data, transporteId: activeTransportId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportes'] });
      setIsRouteOpen(false);
    },
    onError: (err: any) => {
      setRouteError(err.response?.data?.error || 'Erro ao salvar rota.');
    }
  });

  const stopMutation = useMutation({
    mutationFn: (data: StopFormInputs) => api.post('/pontos', { ...data, transporteId: activeTransportId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportes'] });
      resStop();
    },
    onError: (err: any) => {
      setStopError(err.response?.data?.error || 'Erro ao adicionar ponto.');
    }
  });

  const deleteStopMutation = useMutation({
    mutationFn: (stopId: string) => api.delete(`/pontos/${stopId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportes'] });
    }
  });

  // Actions
  const onSubmit = (data: TransportFormInputs) => {
    if (editingTransport) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleRouteSubmit = (data: RouteFormInputs) => {
    routeMutation.mutate(data);
  };

  const handleStopSubmit = (data: StopFormInputs) => {
    stopMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este transporte e todos os seus vínculos?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDeleteStop = (stopId: string) => {
    if (confirm('Excluir este ponto de embarque?')) {
      deleteStopMutation.mutate(stopId);
    }
  };

  const activeTransport = transportes.find(t => t.id === activeTransportId);

  if (tLoading || mLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const driverOptions = [
    { value: '', label: 'Selecione um motorista' },
    ...motoristas.map(m => ({ value: m.id, label: `${m.nome} (CNH: ${m.CNH})` }))
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Bus className="text-violet-400" size={24} />
            Gestão de Veículos e Rotas
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Gerencie frotas, motoristas, horários e pontos de embarque de Orleans/SC.
          </p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-1.5 font-bold shadow-lg">
          <Plus size={16} />
          Novo Veículo
        </Button>
      </div>

      {transportes.length === 0 ? (
        <Card className="text-center py-12 text-zinc-500">
          Nenhum veículo cadastrado. Clique no botão acima para adicionar.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transportes.map((t) => (
            <Card key={t.id} className="flex flex-col gap-5 border border-zinc-800/40">
              {/* Header Card */}
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">{t.nome}</h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="primary">{t.tipo}</Badge>
                    <Badge variant={t.gratuito ? 'success' : 'warning'}>
                      {t.gratuito ? 'Gratuito' : `R$ ${t.valor?.toFixed(2)}`}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button onClick={() => openEditModal(t)} variant="ghost" className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200">
                    <Edit2 size={14} />
                  </Button>
                  <Button onClick={() => handleDelete(t.id)} variant="ghost" className="p-2 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>

              {/* Info details */}
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-zinc-800/40 text-xs">
                <div className="flex items-center gap-2 text-zinc-400">
                  <User className="text-zinc-500" size={14} />
                  <div>
                    <span className="block text-zinc-500">Motorista</span>
                    <span className="font-semibold text-zinc-200">{t.motorista?.nome}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-zinc-400">
                  <Users className="text-zinc-500" size={14} />
                  <div>
                    <span className="block text-zinc-500">Capacidade</span>
                    <span className="font-semibold text-zinc-200">
                      {t.alunos?.length || 0} / {t.capacidade} alunos
                    </span>
                  </div>
                </div>
              </div>

              {/* Route section */}
              <div className="p-3 bg-zinc-950/45 rounded-lg border border-zinc-850 text-xs flex justify-between items-center">
                <div className="min-w-0">
                  <span className="block font-bold text-zinc-300">Rota ativa</span>
                  <span className="block text-zinc-400 mt-0.5 truncate">
                    {t.rota ? t.rota.nome : 'Sem rota cadastrada'}
                  </span>
                </div>
                <div className="shrink-0 flex items-center gap-3 pl-3">
                  {t.rota && (
                    <div className="text-right">
                      <span className="block font-semibold text-violet-400">{t.rota.horarioSaida}</span>
                      <span className="block text-[9px] text-zinc-500">Saída</span>
                    </div>
                  )}
                  <Button onClick={() => openRouteModal(t)} variant="outline" size="sm" className="px-2 py-1 h-7">
                    <Clock size={12} className="mr-1" />
                    Horários
                  </Button>
                </div>
              </div>

              {/* Stop Points count */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-semibold uppercase">
                  {t.pontos?.length || 0} Pontos de Embarque
                </span>
                <Button onClick={() => openStopsModal(t)} variant="secondary" size="sm" className="h-8">
                  <MapPin size={13} className="mr-1.5" />
                  Gerenciar Paradas
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Main Transport Modal */}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingTransport ? 'Editar Informações do Transporte' : 'Adicionar Novo Transporte'}
      >
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome do Transporte (Identificação)"
            placeholder="Ex: Ônibus Orleans Linha 1"
            error={errors.nome?.message}
            {...register('nome')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tipo de Veículo"
              options={[
                { value: 'ONIBUS', label: 'Ônibus' },
                { value: 'VAN', label: 'Van' },
                { value: 'CARRO', label: 'Carro Particular' }
              ]}
              error={errors.tipo?.message}
              {...register('tipo')}
            />

            <Input
              type="number"
              label="Capacidade máxima (RN03)"
              placeholder="Ex: 40"
              error={errors.capacidade?.message}
              {...register('capacidade')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Cobrança (Gratuidade)"
              options={[
                { value: 'true', label: 'Gratuito' },
                { value: 'false', label: 'Pago' }
              ]}
              error={errors.gratuito?.message}
              {...register('gratuito')}
            />

            {isGratuito === 'false' && (
              <Input
                type="number"
                step="0.01"
                label="Valor Mensal (R$) (RN10)"
                placeholder="Ex: 150.00"
                error={errors.valor?.message}
                {...register('valor')}
              />
            )}
          </div>

          <Select
            label="Motorista Responsável (RN02)"
            options={driverOptions}
            error={errors.motoristaId?.message}
            {...register('motoristaId')}
          />

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/60">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingTransport ? 'Salvar Alterações' : 'Cadastrar Transporte'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Route Modal */}
      <Dialog
        isOpen={isRouteOpen}
        onClose={() => setIsRouteOpen(false)}
        title="Gerenciar Rota e Horários"
      >
        {routeError && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{routeError}</span>
          </div>
        )}

        <form onSubmit={subRoute(handleRouteSubmit)} className="space-y-4">
          <Input
            label="Nome da Rota"
            placeholder="Ex: Orleans Centro -> UNIBAVE"
            error={errRoute.nome?.message}
            {...regRoute('nome')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Horário de Saída (RN04)"
              placeholder="Ex: 18:30"
              error={errRoute.horarioSaida?.message}
              {...regRoute('horarioSaida')}
            />

            <Input
              label="Horário de Chegada (RN04)"
              placeholder="Ex: 19:00"
              error={errRoute.horarioChegada?.message}
              {...regRoute('horarioChegada')}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/60">
            <Button type="button" variant="outline" onClick={() => setIsRouteOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Rota
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Stops Modal */}
      <Dialog
        isOpen={isStopsOpen}
        onClose={() => setIsStopsOpen(false)}
        title={`Pontos de Embarque - ${activeTransport?.nome || ''}`}
      >
        {stopError && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{stopError}</span>
          </div>
        )}

        {/* Existing stops list */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-zinc-400 uppercase mb-3">Paradas Atuais</h4>
          {(!activeTransport?.pontos || activeTransport.pontos.length === 0) ? (
            <p className="text-xs text-zinc-500 italic">Nenhum ponto cadastrado para este transporte (RN05).</p>
          ) : (
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {activeTransport.pontos.map((stop: any) => (
                <div key={stop.id} className="p-2 bg-zinc-950/60 border border-zinc-850 rounded flex justify-between items-center text-xs">
                  <div>
                    <span className="block font-bold text-zinc-300">{stop.nome}</span>
                    <span className="block text-zinc-500 text-[10px] mt-0.5">{stop.endereco}</span>
                  </div>
                  <Button 
                    onClick={() => handleDeleteStop(stop.id)} 
                    variant="ghost" 
                    className="p-1 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add stop form */}
        <div className="border-t border-zinc-800/80 pt-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase mb-3">Novo Ponto de Embarque</h4>
          <form onSubmit={subStop(handleStopSubmit)} className="space-y-3">
            <Input
              label="Nome da Parada"
              placeholder="Ex: Posto Coxhia"
              error={errStop.nome?.message}
              {...regStop('nome')}
            />

            <Input
              label="Endereço"
              placeholder="Ex: Rua Altamiro Guimarães, Centro"
              error={errStop.endereco?.message}
              {...regStop('endereco')}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                step="0.000001"
                label="Latitude (Mapa)"
                placeholder="Ex: -28.3592"
                error={errStop.latitude?.message}
                {...regStop('latitude')}
              />

              <Input
                type="number"
                step="0.000001"
                label="Longitude (Mapa)"
                placeholder="Ex: -49.2905"
                error={errStop.longitude?.message}
                {...regStop('longitude')}
              />
            </div>

            <div className="flex justify-end gap-3 mt-5 pt-3 border-t border-zinc-800/60">
              <Button type="button" variant="outline" onClick={() => setIsStopsOpen(false)}>
                Fechar
              </Button>
              <Button type="submit" variant="primary">
                Adicionar Ponto
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
};
