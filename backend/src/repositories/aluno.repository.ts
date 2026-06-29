import { Aluno, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export interface IAlunoRepository {
  findById(id: string): Promise<Aluno | null>;
  findByMatricula(matricula: string): Promise<Aluno | null>;
  findByUserId(userId: string): Promise<Aluno | null>;
  findAll(): Promise<Aluno[]>;
  create(data: Prisma.AlunoCreateInput): Promise<Aluno>;
  update(id: string, data: Prisma.AlunoUpdateInput): Promise<Aluno>;
  delete(id: string): Promise<Aluno>;
}

export class PrismaAlunoRepository implements IAlunoRepository {
  async findById(id: string): Promise<Aluno | null> {
    return prisma.aluno.findUnique({
      where: { id },
      include: { 
        transporte: { 
          include: { 
            motorista: true, 
            rota: true, 
            pontos: true,
            avisos: {
              orderBy: { data: 'desc' }
            }
          } 
        }, 
        user: true 
      }
    });
  }

  async findByMatricula(matricula: string): Promise<Aluno | null> {
    return prisma.aluno.findUnique({
      where: { matricula }
    });
  }

  async findByUserId(userId: string): Promise<Aluno | null> {
    return prisma.aluno.findUnique({
      where: { userId },
      include: { 
        transporte: { 
          include: { 
            motorista: true, 
            rota: true, 
            pontos: true,
            avisos: { 
              orderBy: { data: 'desc' } 
            } 
          } 
        } 
      }
    });
  }

  async findAll(): Promise<Aluno[]> {
    return prisma.aluno.findMany({
      include: { 
        transporte: true, 
        user: true 
      },
      orderBy: { nome: 'asc' }
    });
  }

  async create(data: Prisma.AlunoCreateInput): Promise<Aluno> {
    return prisma.aluno.create({ data });
  }

  async update(id: string, data: Prisma.AlunoUpdateInput): Promise<Aluno> {
    return prisma.aluno.update({ 
      where: { id }, 
      data,
      include: { 
        transporte: true, 
        user: true 
      }
    });
  }

  async delete(id: string): Promise<Aluno> {
    return prisma.aluno.delete({ where: { id } });
  }
}
