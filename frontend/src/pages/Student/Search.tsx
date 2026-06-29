import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Dialog } from '../../components/ui/Dialog';
import { Badge } from '../../components/ui/Badge';
import { OrleansMap } from '../../components/Map/OrleansMap';
import { 
  Search as SearchIcon, 
  Bus, 
  MapPin, 
  User, 
  Phone, 
  Clock, 
  DollarSign, 
  Users 
} from 'lucide-react';

export const StudentSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransport, setSelectedTransport] = useState<any | null>(null);

  // Fetch transport list based on search term
  const { data: transportes = [], isLoading } = useQuery<any[]>({
    queryKey: ['search-transportes', searchTerm],
    queryFn: () => api.get('/transportes', { params: { search: searchTerm } }).then(res => res.data)
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      <div>
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <SearchIcon className="text-violet-400" size={24} />
          Consultar Transportes Disponíveis
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Pesquise por nome do transporte, nome do motorista, rota ou tipo de veículo (RN08).
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full max-w-md">
        <Input
          type="text"
          placeholder="Buscar por ônibus, van, motorista, rota..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <SearchIcon className="absolute left-3.5 top-[2.2rem] transform -translate-y-1/2 text-zinc-500" size={16} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : transportes.length === 0 ? (
        <Card className="text-center py-12 text-zinc-500">
          Nenhum veículo encontrado correspondente à pesquisa.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transportes.map((t) => (
            <Card 
              key={t.id} 
              className="flex flex-col justify-between gap-4 border border-zinc-800/40 hover:border-violet-500/30 transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedTransport(t)}
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-bold text-zinc-100 group-hover:text-violet-400 transition-colors">
                    {t.nome}
                  </h3>
                  <Badge variant={t.gratuito ? 'success' : 'warning'}>
                    {t.gratuito ? 'Gratuito' : `Pago: R$ ${t.valor?.toFixed(2)}`}
                  </Badge>
                </div>

                <div className="flex gap-2 mt-2">
                  <Badge variant="primary">{t.tipo}</Badge>
                </div>

                {t.rota && (
                  <div className="mt-4 p-2.5 bg-zinc-950/40 rounded border border-zinc-850 text-xs flex justify-between items-center">
                    <div>
                      <span className="block font-bold text-zinc-300">Rota</span>
                      <span className="block text-zinc-400 truncate max-w-[200px] mt-0.5">{t.rota.nome}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block font-bold text-violet-400">{t.rota.horarioSaida}</span>
                      <span className="block text-[9px] text-zinc-500">Saída</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-zinc-850 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <User size={13} className="text-zinc-500" />
                    <span className="truncate">{t.motorista?.nome}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Users size={13} className="text-zinc-500" />
                    <span>{t.alunos?.length || 0} / {t.capacidade} alunos</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <span className="text-xs font-bold text-violet-400 group-hover:underline underline-offset-4 flex items-center gap-1">
                  Ver detalhes e mapa
                  <span>&rarr;</span>
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog
        isOpen={selectedTransport !== null}
        onClose={() => setSelectedTransport(null)}
        title={selectedTransport?.nome || 'Detalhes do Transporte'}
      >
        {selectedTransport && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">{selectedTransport.tipo}</Badge>
              <Badge variant={selectedTransport.gratuito ? 'success' : 'warning'}>
                {selectedTransport.gratuito ? 'Gratuito' : `Pago: R$ ${selectedTransport.valor?.toFixed(2)}`}
              </Badge>
              <Badge variant="neutral">
                Ocupação: {selectedTransport.alunos?.length || 0} / {selectedTransport.capacidade}
              </Badge>
            </div>

            {/* Route & Times */}
            {selectedTransport.rota && (
              <div className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-lg flex items-center gap-3 text-xs">
                <Clock className="text-violet-400" size={16} />
                <div>
                  <span className="block font-bold text-zinc-300">{selectedTransport.rota.nome}</span>
                  <span className="block text-[10px] text-zinc-500 mt-0.5">
                    Horário: <strong className="text-violet-400">{selectedTransport.rota.horarioSaida}</strong> às <strong>{selectedTransport.rota.horarioChegada}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Driver Details */}
            {selectedTransport.motorista && (
              <div className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-lg flex items-center gap-3 text-xs">
                <User className="text-indigo-400" size={16} />
                <div>
                  <span className="block font-bold text-zinc-300">Motorista: {selectedTransport.motorista.nome}</span>
                  <span className="block text-zinc-400 mt-1 flex items-center gap-1.5 font-medium">
                    <Phone size={12} className="text-zinc-500" />
                    {selectedTransport.motorista.telefone}
                  </span>
                </div>
              </div>
            )}

            {/* Map stops preview */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-zinc-450 uppercase flex items-center gap-1">
                <MapPin size={14} className="text-zinc-500" />
                Pontos de Embarque ({selectedTransport.pontos?.length || 0})
              </span>
              <div className="h-[240px] w-full rounded-lg overflow-hidden border border-zinc-800">
                <OrleansMap points={selectedTransport.pontos || []} />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-zinc-800/60">
              <Button onClick={() => setSelectedTransport(null)}>
                Fechar Detalhes
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
