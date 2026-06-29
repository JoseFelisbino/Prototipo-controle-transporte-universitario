import { Request, Response, NextFunction } from 'express';
import { RotaService } from '../services/rota.service';

export class RotaController {
  constructor(private rotaService: RotaService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.rotaService.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.rotaService.findAll();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.rotaService.findById(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.rotaService.update(req.params.id, req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.rotaService.delete(req.params.id);
      res.status(200).json({ message: 'Rota excluída com sucesso.' });
    } catch (err) {
      next(err);
    }
  };
}
