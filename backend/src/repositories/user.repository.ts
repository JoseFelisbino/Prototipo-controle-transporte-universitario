import { User, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
  delete(id: string): Promise<User>;
}

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ 
      where: { id },
      include: { aluno: true }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ 
      where: { email },
      include: { aluno: true }
    });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      include: { aluno: true },
      orderBy: { nome: 'asc' }
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ 
      where: { id }, 
      data 
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }
}
