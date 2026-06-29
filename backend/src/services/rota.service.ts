import { IRotaRepository } from '../repositories/rota.repository';
import { ITransporteRepository } from '../repositories/transporte.repository';
import { Prisma } from '@prisma/client';

export class RotaService {
  constructor(
    private rotaRepository: IRotaRepository,
    private transporteRepository: ITransporteRepository
  ) {}

  async create(data: Prisma.RotaUncheckedCreateInput) {
    const transporte = await this.transporteRepository.findById(data.transporteId);
    if (!transporte) {
      throw new Error('Transporte não encontrado');
    }
    const existing = await this.rotaRepository.findByTransporteId(data.transporteId);
    if (existing) {
      throw new Error('Este transporte já possui uma rota cadastrada');
    }
    return this.rotaRepository.create(data as any);
  }

  async update(id: string, data: Prisma.RotaUncheckedUpdateInput) {
    const current = await this.rotaRepository.findById(id);
    if (!current) {
      throw new Error('Rota não encontrada');
    }
    if (data.transporteId && data.transporteId !== current.transporteId) {
      const transporte = await this.transporteRepository.findById(data.transporteId as string);
      if (!transporte) {
        throw new Error('Transporte não encontrado');
      }
      const existing = await this.rotaRepository.findByTransporteId(data.transporteId as string);
      if (existing && existing.id !== id) {
        throw new Error('Este transporte já possui uma rota cadastrada');
      }
    }
    return this.rotaRepository.update(id, data as any);
  }

  async findById(id: string) {
    const res = await this.rotaRepository.findById(id);
    if (!res) {
      throw new Error('Rota não encontrada');
    }
    return res;
  }

  async findAll() {
    return this.rotaRepository.findAll();
  }

  async delete(id: string) {
    const current = await this.rotaRepository.findById(id);
    if (!current) {
      throw new Error('Rota não encontrada');
    }
    return this.rotaRepository.delete(id);
  }
}
