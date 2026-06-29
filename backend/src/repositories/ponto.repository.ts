import { Ponto, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export interface IPontoRepository {
  findById(id: string): Promise<Ponto | null>;
  findByTransporteId(transporteId: string): Promise<Ponto[]>;
  findAll(): Promise<Ponto[]>;
  create(data: Prisma.PontoCreateInput): Promise<Ponto>;
  update(id: string, data: Prisma.PontoUpdateInput): Promise<Ponto>;
  delete(id: string): Promise<Ponto>;
}

export class PrismaPontoRepository implements IPontoRepository {
  async findById(id: string): Promise<Ponto | null> {
    return prisma.ponto.findUnique({
      where: { id },
      include: { transporte: true }
    });
  }

  async findByTransporteId(transporteId: string): Promise<Ponto[]> {
    return prisma.ponto.findMany({
      where: { transporteId },
      orderBy: { nome: 'asc' }
    });
  }

  async findAll(): Promise<Ponto[]> {
    return prisma.ponto.findMany({
      include: { transporte: true },
      orderBy: { nome: 'asc' }
    });
  }

  async create(data: Prisma.PontoCreateInput): Promise<Ponto> {
    return prisma.ponto.create({ data });
  }

  async update(id: string, data: Prisma.PontoUpdateInput): Promise<Ponto> {
    return prisma.ponto.update({ 
      where: { id }, 
      data 
    });
  }

  async delete(id: string): Promise<Ponto> {
    return prisma.ponto.delete({ where: { id } });
  }
}
