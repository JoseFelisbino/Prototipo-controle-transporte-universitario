import { Transporte, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export interface ITransporteRepository {
  findById(id: string): Promise<Transporte | null>;
  findAll(search?: string): Promise<Transporte[]>;
  create(data: Prisma.TransporteCreateInput): Promise<Transporte>;
  update(id: string, data: Prisma.TransporteUpdateInput): Promise<Transporte>;
  delete(id: string): Promise<Transporte>;
}

export class PrismaTransporteRepository implements ITransporteRepository {
  async findById(id: string): Promise<Transporte | null> {
    return prisma.transporte.findUnique({
      where: { id },
      include: {
        motorista: true,
        rota: true,
        alunos: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                nome: true
              }
            }
          }
        },
        avisos: {
          orderBy: { data: 'desc' }
        },
        pontos: {
          orderBy: { nome: 'asc' }
        }
      }
    });
  }

  async findAll(search?: string): Promise<Transporte[]> {
    const includeOptions = {
      motorista: true,
      rota: true,
      alunos: true,
      avisos: {
        orderBy: { data: 'desc' }
      },
      pontos: {
        orderBy: { nome: 'asc' }
      }
    } as const;

    if (!search) {
      return prisma.transporte.findMany({
        include: includeOptions,
        orderBy: { nome: 'asc' }
      });
    }

    // Try to find if the search term matches any enum value for TipoTransporte
    const matchingTypes: Prisma.TipoTransporte[] = [];
    if (search.toUpperCase().includes('ONIBUS') || search.toUpperCase().includes('ÔNIBUS')) {
      matchingTypes.push('ONIBUS');
    }
    if (search.toUpperCase().includes('VAN')) {
      matchingTypes.push('VAN');
    }
    if (search.toUpperCase().includes('CARRO')) {
      matchingTypes.push('CARRO');
    }

    return prisma.transporte.findMany({
      where: {
        OR: [
          { nome: { contains: search, mode: 'insensitive' } },
          { motorista: { nome: { contains: search, mode: 'insensitive' } } },
          { rota: { nome: { contains: search, mode: 'insensitive' } } },
          ...(matchingTypes.length > 0 ? [{ tipo: { in: matchingTypes } }] : [])
        ]
      },
      include: includeOptions,
      orderBy: { nome: 'asc' }
    });
  }

  async create(data: Prisma.TransporteCreateInput): Promise<Transporte> {
    return prisma.transporte.create({
      data,
      include: {
        motorista: true,
        rota: true,
        pontos: true
      }
    });
  }

  async update(id: string, data: Prisma.TransporteUpdateInput): Promise<Transporte> {
    return prisma.transporte.update({
      where: { id },
      data,
      include: {
        motorista: true,
        rota: true,
        alunos: true,
        avisos: true,
        pontos: true
      }
    });
  }

  async delete(id: string): Promise<Transporte> {
    return prisma.transporte.delete({
      where: { id }
    });
  }
}
