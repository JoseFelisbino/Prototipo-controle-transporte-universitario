import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { OrleansMap } from '../../components/Map/OrleansMap';
import { 
  Bus, 
  Users, 
  UserSquare2, 
  Bell, 
  Clock, 
  Calendar,
  AlertTriangle,
  MapPin
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  // Fetch stats in parallel using React Query
  const { data: transportes = [], isLoading: tLoading } = useQuery<any[]>({
    queryKey: ['transportes'],
    queryFn: () => api.get('/transportes').then(res => res.data)
  });

  const { data: motoristas = [], isLoading: mLoading } = useQuery<any[]>({
    queryKey: ['motoristas'],
    queryFn: () => api.get('/motoristas').then(res => res.data)
  });

  const { data: alunos = [], isLoading: aLoading } = useQuery<any[]>({
    queryKey: ['alunos'],
    queryFn: () => api.get('/alunos').then(res => res.data)
  });

  const { data: avisos = [], isLoading: avLoading } = useQuery<any[]>({
    queryKey: ['avisos'],
    queryFn: () => api.get('/avisos').then(res => res.data)
  });

  const isLoading = tLoading || mLoading || aLoading || avLoading;

  // Extract all points for the aggregated map view
  const allPoints = React.useMemo(() => {
    const pointsList: any[] = [];
    transportes.forEach(t => {
      if (t.pontos && Array.isArray(t.pontos)) {
        t.pontos.forEach((p: any) => {
          pointsList.push({
            id: p.id,
            nome: `${t.nome} - ${p.nome}`,
            endereco: p.endereco,
            latitude: p.latitude,
            longitude: p.longitude
          });
        });
      }
    });
    return pointsList;
  }, [transportes]);

  // Extract routes sorted by departure time
  const upcomingRoutes = React.useMemo(() => {
    return transportes
      .filter(t => t.rota)
      .map(t => ({
        id: t.id,
        nome: t.nome,
        tipo: t.tipo,
        rotaNome: t.rota.nome,
        saida: t.rota.horarioSaida,
        chegada: t.rota.horarioChegada
      }))
      .sort((a, b) => a.saida.localeCompare(b.saida));
  }, [transportes]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      {/* Head section */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100">Visão Geral do Sistema</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Painel administrativo de controle de transportes de Orleans/SC.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 py-5">
          <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Bus size={22} />
          </div>
          <div>
            <span className="block text-2xl font-black text-zinc-100">{transportes.length}</span>
            <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">
              Veículos
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 py-5">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users size={22} />
          </div>
          <div>
            <span className="block text-2xl font-black text-zinc-100">{alunos.length}</span>
            <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">
              Estudantes
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 py-5">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <UserSquare2 size={22} />
          </div>
          <div>
            <span className="block text-2xl font-black text-zinc-100">{motoristas.length}</span>
            <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">
              Motoristas
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 py-5">
          <div className="w-12 h-12 rounded-xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Bell size={22} />
          </div>
          <div>
            <span className="block text-2xl font-black text-zinc-100">{avisos.length}</span>
            <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">
              Avisos Ativos
            </span>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side lists (Routes and Notices) */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Upcoming Schedules */}
          <Card className="flex flex-col h-[320px]">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-violet-400" size={18} />
              <h3 className="font-bold text-sm text-zinc-200">Próximos Horários</h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {upcomingRoutes.length === 0 ? (
                <div className="text-center text-zinc-500 text-xs py-8">Nenhum horário cadastrado.</div>
              ) : (
                upcomingRoutes.map(route => (
                  <div key={route.id} className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-800/40 flex justify-between items-center gap-3">
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-zinc-200 truncate">{route.nome}</span>
                      <span className="block text-[10px] text-zinc-500 truncate mt-0.5">{route.rotaNome}</span>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-xs font-bold text-violet-400">{route.saida}</span>
                      <span className="text-[9px] text-zinc-500">Saída</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recent Notices */}
          <Card className="flex flex-col h-[280px]">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="text-rose-400" size={18} />
              <h3 className="font-bold text-sm text-zinc-200">Avisos Recentes</h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {avisos.length === 0 ? (
                <div className="text-center text-zinc-500 text-xs py-8">Nenhum aviso ativo.</div>
              ) : (
                avisos.slice(0, 5).map(av => (
                  <div key={av.id} className="p-3 bg-rose-500/5 rounded-lg border border-rose-500/10 flex gap-2.5 items-start">
                    <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={14} />
                    <div>
                      <h4 className="text-xs font-bold text-rose-400">{av.titulo}</h4>
                      <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{av.descricao}</p>
                      <span className="block text-[9px] text-zinc-500 mt-1 font-semibold uppercase">
                        {av.transporte?.nome || 'Geral'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Side Map Overview */}
        <div className="lg:col-span-2 flex flex-col gap-2 h-[624px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="text-indigo-400" size={18} />
              <h3 className="font-bold text-sm text-zinc-200">Mapa das Rotas (Visão Geral)</h3>
            </div>
            <span className="text-[10px] text-zinc-500 font-semibold uppercase">
              {allPoints.length} pontos mapeados
            </span>
          </div>
          <div className="flex-1">
            <OrleansMap points={allPoints} />
          </div>
        </div>

      </div>
    </div>
  );
};
