import { Request, Response, NextFunction } from 'express';
import { MotoristaService } from '../services/motorista.service';

export class MotoristaController {
  constructor(private motoristaService: MotoristaService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.motoristaService.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.motoristaService.findAll();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.motoristaService.findById(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.motoristaService.update(req.params.id, req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.motoristaService.delete(req.params.id);
      res.status(200).json({ message: 'Motorista excluído com sucesso.' });
    } catch (err) {
      next(err);
    }
  };
}
