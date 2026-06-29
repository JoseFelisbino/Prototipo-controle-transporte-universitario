import { Request, Response, NextFunction } from 'express';
import { AlunoService } from '../services/aluno.service';

export class AlunoController {
  constructor(private alunoService: AlunoService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.alunoService.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.alunoService.findAll();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.alunoService.findById(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  findByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.alunoService.findByUserId(req.params.userId);
      if (!result) {
        res.status(404).json({ error: 'Nenhum perfil de aluno associado a este usuário.' });
        return;
      }
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.alunoService.update(req.params.id, req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.alunoService.delete(req.params.id);
      res.status(200).json({ message: 'Aluno excluído com sucesso.' });
    } catch (err) {
      next(err);
    }
  };
}
