import { Request, Response, NextFunction } from 'express';
import { TransporteService } from '../services/transporte.service';

export class TransporteController {
  constructor(private transporteService: TransporteService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.transporteService.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = req.query.search as string | undefined;
      const result = await this.transporteService.findAll(search);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.transporteService.findById(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.transporteService.update(req.params.id, req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.transporteService.delete(req.params.id);
      res.status(200).json({ message: 'Transporte excluído com sucesso.' });
    } catch (err) {
      next(err);
    }
  };
}
