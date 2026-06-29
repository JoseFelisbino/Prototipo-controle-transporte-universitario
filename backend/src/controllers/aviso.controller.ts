import { Request, Response, NextFunction } from 'express';
import { AvisoService } from '../services/aviso.service';

export class AvisoController {
  constructor(private avisoService: AvisoService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.avisoService.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.avisoService.findAll();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.avisoService.findById(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  findByTransporteId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.avisoService.findByTransporteId(req.params.transporteId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.avisoService.update(req.params.id, req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.avisoService.delete(req.params.id);
      res.status(200).json({ message: 'Aviso excluído com sucesso.' });
    } catch (err) {
      next(err);
    }
  };
}
