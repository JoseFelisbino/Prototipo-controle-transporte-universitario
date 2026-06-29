import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { OrleansMap } from '../../components/Map/OrleansMap';
import { 
  Bus, 
  User, 
  Phone, 
  Clock, 
  Bell, 
  AlertTriangle, 
  GraduationCap, 
  MapPin, 
  Info,
  Calendar
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  // Fetch the Aluno record associated with this User ID
  const { data: studentLink, isLoading, isError } = useQuery<any>({
    queryKey: ['my-student-link', user?.id],
    queryFn: () => api.get(`/alunos/user/${user?.id}`).then(res => res.data),
    retry: false
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Case 1: Student User account is not linked to an Aluno record yet
  if (isError || !studentLink) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in max-w-2xl mx-auto py-10">
        <Card className="border border-zinc-800/60 p-8 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-xl font-bold text-zinc-100">Bem-vindo, {user?.nome}!</h2>
          <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
            Seu cadastro de usuário ainda não está vinculado a uma ficha de aluno acadêmica. 
          </p>
          <div className="p-4 bg-zinc-950/60 rounded-lg border border-zinc-850 text-left text-xs text-zinc-400 flex gap-3 max-w-lg mt-2">
            <Info className="text-violet-400 shrink-0 mt-0.5" size={16} />
            <div>
              <span className="block font-bold text-zinc-300">Como vincular sua conta:</span>
              <p className="mt-1 leading-relaxed">
                Entre em contato com o administrador do setor de transporte municipal de Orleans. Informe seu e-mail cadastrado (<strong className="text-violet-300">{user?.email}</strong>) e solicite a associação do seu cadastro à sua linha de transporte.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const transport = studentLink.transporte;

  // Case 2: Linked student, but no transport vehicle has been assigned to them yet
  if (!transport) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in max-w-2xl mx-auto py-10">
        <Card className="border border-zinc-850 p-8 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Bus size={32} />
          </div>
          <h2 className="text-xl font-bold text-zinc-100">Ficha de Aluno Ativa!</h2>
          <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
            Olá <strong>{studentLink.nome}</strong> (Matrícula: {studentLink.matricula}). 
            Você possui um cadastro ativo no sistema, mas ainda não foi alocado em nenhuma linha de transporte.
          </p>
          <p className="text-xs text-zinc-500">
            Por favor, aguarde a alocação por parte do administrador ou solicite vaga em uma das linhas disponíveis.
          </p>
        </Card>
      </div>
    );
  }

  // Case 3: Linked student with assigned transport vehicle
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in pb-10">
      
      {/* Left Column: Details panel */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* Profile Card */}
        <Card className="border border-zinc-800/40 p-5 bg-gradient-to-br from-zinc-950/20 to-zinc-900/10">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Ficha de Estudante
          </span>
          <h3 className="text-lg font-bold text-zinc-100 mt-1">{studentLink.nome}</h3>
          <span className="block text-xs text-zinc-400 mt-1">Matrícula: {studentLink.matricula}</span>
          <span className="block text-xs text-zinc-400 mt-0.5">Curso: {studentLink.curso}</span>
        </Card>

        {/* Transport Details Card */}
        <Card className="flex flex-col gap-4 border border-zinc-800/40">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Meu Transporte
            </span>
            <h3 className="text-lg font-bold text-zinc-100 mt-1">{transport.nome}</h3>
            <div className="flex gap-2 mt-2">
              <Badge variant="primary">{transport.tipo}</Badge>
              <Badge variant={transport.gratuito ? 'success' : 'warning'}>
                {transport.gratuito ? 'Gratuito' : `Pago: R$ ${transport.valor?.toFixed(2)}`}
              </Badge>
            </div>
          </div>

          {/* Route Times */}
          {transport.rota && (
            <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-850 flex gap-3 items-center text-xs">
              <Clock className="text-violet-400 shrink-0" size={16} />
              <div>
                <span className="block font-bold text-zinc-300">{transport.rota.nome}</span>
                <span className="block text-[10px] text-zinc-500 mt-0.5">
                  Saída: <strong className="text-violet-400">{transport.rota.horarioSaida}</strong> | Chegada: <strong>{transport.rota.horarioChegada}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Driver Contact */}
          {transport.motorista && (
            <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-850 flex gap-3 items-center text-xs">
              <User className="text-indigo-400 shrink-0" size={16} />
              <div>
                <span className="block font-bold text-zinc-300">Motorista: {transport.motorista.nome}</span>
                <span className="block text-zinc-400 mt-1 flex items-center gap-1.5 font-medium">
                  <Phone size={12} className="text-zinc-500" />
                  {transport.motorista.telefone}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Notices/Warnings Card */}
        <Card className="flex flex-col h-[280px]">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="text-rose-400" size={18} />
            <h3 className="font-bold text-sm text-zinc-200">Avisos do Transporte</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {!transport.avisos || transport.avisos.length === 0 ? (
              <div className="text-center text-zinc-500 text-xs py-10 italic">Nenhum aviso ativo.</div>
            ) : (
              transport.avisos.map((av: any) => (
                <div key={av.id} className="p-3 bg-rose-500/5 rounded-lg border border-rose-500/10 flex gap-2.5 items-start">
                  <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={14} />
                  <div>
                    <h4 className="text-xs font-bold text-rose-450">{av.titulo}</h4>
                    <p className="text-[10px] text-zinc-400 mt-1 line-clamp-3 leading-relaxed">{av.descricao}</p>
                    <div className="text-[8px] text-zinc-500 mt-2 font-semibold flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(av.data).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

      </div>

      {/* Right Column: Interactive Map */}
      <div className="lg:col-span-2 flex flex-col gap-2 h-[660px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="text-indigo-400" size={18} />
            <h3 className="font-bold text-sm text-zinc-200">Trajeto e Pontos de Embarque</h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-semibold uppercase">
            {transport.pontos?.length || 0} paradas na rota
          </span>
        </div>
        <div className="flex-1">
          <OrleansMap points={transport.pontos || []} />
        </div>
      </div>

    </div>
  );
};
