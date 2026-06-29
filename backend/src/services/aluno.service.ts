import { IAlunoRepository } from '../repositories/aluno.repository';
import { ITransporteRepository } from '../repositories/transporte.repository';
import { Prisma } from '@prisma/client';

export class AlunoService {
  constructor(
    private alunoRepository: IAlunoRepository,
    private transporteRepository: ITransporteRepository
  ) {}

  async create(data: Prisma.AlunoUncheckedCreateInput) {
    if (data.transporteId) {
      const transporte = await this.transporteRepository.findById(data.transporteId);
      if (!transporte) {
        throw new Error('Transporte não encontrado');
      }
      if ((transporte as any).alunos.length >= transporte.capacidade) {
        throw new Error('Capacidade do transporte esgotada (RN03)');
      }
    }

    if (data.matricula) {
      const existing = await this.alunoRepository.findByMatricula(data.matricula);
      if (existing) {
        throw new Error('Matrícula já cadastrada');
      }
    }

    if (data.userId) {
      const existing = await this.alunoRepository.findByUserId(data.userId);
      if (existing) {
        throw new Error('Usuário já possui um vínculo com outro aluno');
      }
    }

    return this.alunoRepository.create(data as any);
  }

  async update(id: string, data: Prisma.AlunoUncheckedUpdateInput) {
    const current = await this.alunoRepository.findById(id);
    if (!current) {
      throw new Error('Aluno não encontrado');
    }

    if (data.transporteId !== undefined && data.transporteId !== current.transporteId) {
      if (data.transporteId !== null) {
        const newTransporte = await this.transporteRepository.findById(data.transporteId as string);
        if (!newTransporte) {
          throw new Error('Transporte não encontrado');
        }
        if ((newTransporte as any).alunos.length >= newTransporte.capacidade) {
          throw new Error('Capacidade do transporte esgotada (RN03)');
        }
      }
    }

    if (data.matricula && data.matricula !== current.matricula) {
      const existing = await this.alunoRepository.findByMatricula(data.matricula as string);
      if (existing) {
        throw new Error('Matrícula já cadastrada');
      }
    }

    if (data.userId && data.userId !== current.userId) {
      const existing = await this.alunoRepository.findByUserId(data.userId as string);
      if (existing) {
        throw new Error('Usuário já possui um vínculo com outro aluno');
      }
    }

    return this.alunoRepository.update(id, data as any);
  }

  async findById(id: string) {
    const aluno = await this.alunoRepository.findById(id);
    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }
    return aluno;
  }

  async findByUserId(userId: string) {
    return this.alunoRepository.findByUserId(userId);
  }

  async findAll() {
    return this.alunoRepository.findAll();
  }

  async delete(id: string) {
    const current = await this.alunoRepository.findById(id);
    if (!current) {
      throw new Error('Aluno não encontrado');
    }
    return this.alunoRepository.delete(id);
  }
}
