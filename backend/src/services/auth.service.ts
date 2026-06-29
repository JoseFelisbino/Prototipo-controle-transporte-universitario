import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../repositories/user.repository';
import { env } from '../config/env';
import { Prisma } from '@prisma/client';

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async register(data: Prisma.UserCreateInput) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('Email já cadastrado');
    }
    const hashed = await bcrypt.hash(data.senha, 10);
    return this.userRepository.create({
      ...data,
      senha: hashed,
    });
  }

  async login(email: string, senhaPass: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }
    const isMatch = await bcrypt.compare(senhaPass, user.senha);
    if (!isMatch) {
      throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign(
      {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        alunoId: (user as any).aluno?.id || null,
      },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        aluno: (user as any).aluno
      }
    };
  }

  async getProfile(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  }

  async findAll() {
    return this.userRepository.findAll();
  }
}
