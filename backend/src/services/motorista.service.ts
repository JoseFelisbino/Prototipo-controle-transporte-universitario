import { IMotoristaRepository } from '../repositories/motorista.repository';
import { Prisma } from '@prisma/client';

export class MotoristaService {
  constructor(private motoristaRepository: IMotoristaRepository) {}

  async create(data: Prisma.MotoristaCreateInput) {
    const existing = await this.motoristaRepository.findByCnh(data.CNH);
    if (existing) {
      throw new Error('CNH já cadastrada');
    }
    return this.motoristaRepository.create(data);
  }

  async update(id: string, data: Prisma.MotoristaUpdateInput) {
    const current = await this.motoristaRepository.findById(id);
    if (!current) {
      throw new Error('Motorista não encontrado');
    }
    if (data.CNH && data.CNH !== current.CNH) {
      const existing = await this.motoristaRepository.findByCnh(data.CNH as string);
      if (existing) {
        throw new Error('CNH já cadastrada');
      }
    }
    return this.motoristaRepository.update(id, data);
  }

  async findById(id: string) {
    const res = await this.motoristaRepository.findById(id);
    if (!res) {
      throw new Error('Motorista não encontrado');
    }
    return res;
  }

  async findAll() {
    return this.motoristaRepository.findAll();
  }

  async delete(id: string) {
    const current = await this.motoristaRepository.findById(id);
    if (!current) {
      throw new Error('Motorista não encontrado');
    }
    if (current.transportes.length > 0) {
      throw new Error('Não é possível excluir um motorista vinculado a um transporte');
    }
    return this.motoristaRepository.delete(id);
  }
}
