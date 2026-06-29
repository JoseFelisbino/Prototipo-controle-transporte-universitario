import { Rota, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export interface IRotaRepository {
  findById(id: string): Promise<Rota | null>;
  findByTransporteId(transporteId: string): Promise<Rota | null>;
  findAll(): Promise<Rota[]>;
  create(data: Prisma.RotaCreateInput): Promise<Rota>;
  update(id: string, data: Prisma.RotaUpdateInput): Promise<Rota>;
  delete(id: string): Promise<Rota>;
}

export class PrismaRotaRepository implements IRotaRepository {
  async findById(id: string): Promise<Rota | null> {
    return prisma.rota.findUnique({
      where: { id },
      include: { transporte: true }
    });
  }

  async findByTransporteId(transporteId: string): Promise<Rota | null> {
    return prisma.rota.findUnique({
      where: { transporteId }
    });
  }

  async findAll(): Promise<Rota[]> {
    return prisma.rota.findMany({
      include: { transporte: true },
      orderBy: { nome: 'asc' }
    });
  }

  async create(data: Prisma.RotaCreateInput): Promise<Rota> {
    return prisma.rota.create({ data });
  }

  async update(id: string, data: Prisma.RotaUpdateInput): Promise<Rota> {
    return prisma.rota.update({ 
      where: { id }, 
      data 
    });
  }

  async delete(id: string): Promise<Rota> {
    return prisma.rota.delete({ where: { id } });
  }
}
