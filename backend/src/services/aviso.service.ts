import { IAvisoRepository } from '../repositories/aviso.repository';
import { ITransporteRepository } from '../repositories/transporte.repository';
import { Prisma } from '@prisma/client';

export class AvisoService {
  constructor(
    private avisoRepository: IAvisoRepository,
    private transporteRepository: ITransporteRepository
  ) {}

  async create(data: Prisma.AvisoUncheckedCreateInput) {
    const transporte = await this.transporteRepository.findById(data.transporteId);
    if (!transporte) {
      throw new Error('Transporte não encontrado');
    }
    return this.avisoRepository.create(data as any);
  }

  async update(id: string, data: Prisma.AvisoUncheckedUpdateInput) {
    const current = await this.avisoRepository.findById(id);
    if (!current) {
      throw new Error('Aviso não encontrado');
    }
    if (data.transporteId && data.transporteId !== current.transporteId) {
      const transporte = await this.transporteRepository.findById(data.transporteId as string);
      if (!transporte) {
        throw new Error('Transporte não encontrado');
      }
    }
    return this.avisoRepository.update(id, data as any);
  }

  async findById(id: string) {
    const res = await this.avisoRepository.findById(id);
    if (!res) {
      throw new Error('Aviso não encontrado');
    }
    return res;
  }

  async findByTransporteId(transporteId: string) {
    return this.avisoRepository.findByTransporteId(transporteId);
  }

  async findAll() {
    return this.avisoRepository.findAll();
  }

  async delete(id: string) {
    const current = await this.avisoRepository.findById(id);
    if (!current) {
      throw new Error('Aviso não encontrado');
    }
    return this.avisoRepository.delete(id);
  }
}
