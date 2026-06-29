import { IPontoRepository } from '../repositories/ponto.repository';
import { ITransporteRepository } from '../repositories/transporte.repository';
import { Prisma } from '@prisma/client';

export class PontoService {
  constructor(
    private pontoRepository: IPontoRepository,
    private transporteRepository: ITransporteRepository
  ) {}

  async create(data: Prisma.PontoUncheckedCreateInput) {
    const transporte = await this.transporteRepository.findById(data.transporteId);
    if (!transporte) {
      throw new Error('Transporte não encontrado');
    }
    return this.pontoRepository.create(data as any);
  }

  async update(id: string, data: Prisma.PontoUncheckedUpdateInput) {
    const current = await this.pontoRepository.findById(id);
    if (!current) {
      throw new Error('Ponto não encontrado');
    }
    if (data.transporteId && data.transporteId !== current.transporteId) {
      const transporte = await this.transporteRepository.findById(data.transporteId as string);
      if (!transporte) {
        throw new Error('Transporte não encontrado');
      }
    }
    return this.pontoRepository.update(id, data as any);
  }

  async findById(id: string) {
    const res = await this.pontoRepository.findById(id);
    if (!res) {
      throw new Error('Ponto não encontrado');
    }
    return res;
  }

  async findByTransporteId(transporteId: string) {
    return this.pontoRepository.findByTransporteId(transporteId);
  }

  async findAll() {
    return this.pontoRepository.findAll();
  }

  async delete(id: string) {
    const current = await this.pontoRepository.findById(id);
    if (!current) {
      throw new Error('Ponto não encontrado');
    }
    return this.pontoRepository.delete(id);
  }
}
