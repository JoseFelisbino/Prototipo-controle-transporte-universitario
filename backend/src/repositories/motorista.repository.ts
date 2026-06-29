import { Motorista, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export interface IMotoristaRepository {
  findById(id: string): Promise<Motorista | null>;
  findByCnh(cnh: string): Promise<Motorista | null>;
  findAll(): Promise<Motorista[]>;
  create(data: Prisma.MotoristaCreateInput): Promise<Motorista>;
  update(id: string, data: Prisma.MotoristaUpdateInput): Promise<Motorista>;
  delete(id: string): Promise<Motorista>;
}

export class PrismaMotoristaRepository implements IMotoristaRepository {
  async findById(id: string): Promise<Motorista | null> {
    return prisma.motorista.findUnique({ 
      where: { id },
      include: { transportes: true }
    });
  }

  async findByCnh(cnh: string): Promise<Motorista | null> {
    return prisma.motorista.findUnique({ 
      where: { CNH: cnh } 
    });
  }

  async findAll(): Promise<Motorista[]> {
    return prisma.motorista.findMany({
      include: { transportes: true },
      orderBy: { nome: 'asc' }
    });
  }

  async create(data: Prisma.MotoristaCreateInput): Promise<Motorista> {
    return prisma.motorista.create({ data });
  }

  async update(id: string, data: Prisma.MotoristaUpdateInput): Promise<Motorista> {
    return prisma.motorista.update({ 
      where: { id }, 
      data 
    });
  }

  async delete(id: string): Promise<Motorista> {
    return prisma.motorista.delete({ where: { id } });
  }
}
