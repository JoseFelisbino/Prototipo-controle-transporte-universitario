import { ITransporteRepository } from '../repositories/transporte.repository';
import { Prisma } from '@prisma/client';

export class TransporteService {
  constructor(private transporteRepository: ITransporteRepository) {}

  async create(data: Prisma.TransporteUncheckedCreateInput) {
    if (data.gratuito) {
      data.valor = null;
    } else {
      if (data.valor === undefined || data.valor === null || Number(data.valor) <= 0) {
        throw new Error('Transporte pago deve possuir um valor válido maior que zero (RN10)');
      }
    }
    return this.transporteRepository.create(data as any);
  }

  async findById(id: string) {
    const transporte = await this.transporteRepository.findById(id);
    if (!transporte) {
      throw new Error('Transporte não encontrado');
    }
    return transporte;
  }

  async findAll(search?: string) {
    return this.transporteRepository.findAll(search);
  }

  async update(id: string, data: Prisma.TransporteUncheckedUpdateInput) {
    const current = await this.transporteRepository.findById(id);
    if (!current) {
      throw new Error('Transporte não encontrado');
    }

    // RN03 / RN07: Validate capacity reduction
    if (data.capacidade !== undefined) {
      const newCap = Number(data.capacidade);
      const studentCount = (current as any).alunos.length;
      if (newCap < studentCount) {
        throw new Error(`Não é possível reduzir a capacidade para ${newCap} porque existem ${studentCount} alunos vinculados (RN03/RN07).`);
      }
    }

    // RN10: Validate pricing logic
    if (data.gratuito === true) {
      data.valor = null;
    } else if (data.gratuito === false) {
      const valor = data.valor !== undefined ? data.valor : current.valor;
      if (valor === null || Number(valor) <= 0) {
        throw new Error('Transporte pago deve possuir um valor válido maior que zero (RN10)');
      }
    }

    return this.transporteRepository.update(id, data as any);
  }

  async delete(id: string) {
    const current = await this.transporteRepository.findById(id);
    if (!current) {
      throw new Error('Transporte não encontrado');
    }
    return this.transporteRepository.delete(id);
  }
}
