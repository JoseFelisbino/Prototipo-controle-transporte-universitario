import { Aviso, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export interface IAvisoRepository {
  findById(id: string): Promise<Aviso | null>;
  findByTransporteId(transporteId: string): Promise<Aviso[]>;
  findAll(): Promise<Aviso[]>;
  create(data: Prisma.AvisoCreateInput): Promise<Aviso>;
  update(id: string, data: Prisma.AvisoUpdateInput): Promise<Aviso>;
  delete(id: string): Promise<Aviso>;
}

export class PrismaAvisoRepository implements IAvisoRepository {
  async findById(id: string): Promise<Aviso | null> {
    return prisma.aviso.findUnique({
      where: { id },
      include: { transporte: true }
    });
  }

  async findByTransporteId(transporteId: string): Promise<Aviso[]> {
    return prisma.aviso.findMany({
      where: { transporteId },
      orderBy: { data: 'desc' }
    });
  }

  async findAll(): Promise<Aviso[]> {
    return prisma.aviso.findMany({
      include: { transporte: true },
      orderBy: { data: 'desc' }
    });
  }

  async create(data: Prisma.AvisoCreateInput): Promise<Aviso> {
    return prisma.aviso.create({ data });
  }

  async update(id: string, data: Prisma.AvisoUpdateInput): Promise<Aviso> {
    return prisma.aviso.update({ 
      where: { id }, 
      data 
    });
  }

  async delete(id: string): Promise<Aviso> {
    return prisma.aviso.delete({ where: { id } });
  }
}
