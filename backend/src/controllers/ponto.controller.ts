import { Request, Response, NextFunction } from 'express';
import { PontoService } from '../services/ponto.service';

export class PontoController {
  constructor(private pontoService: PontoService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.pontoService.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.pontoService.findAll();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.pontoService.findById(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  findByTransporteId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.pontoService.findByTransporteId(req.params.transporteId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.pontoService.update(req.params.id, req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.pontoService.delete(req.params.id);
      res.status(200).json({ message: 'Ponto de embarque excluído com sucesso.' });
    } catch (err) {
      next(err);
    }
  };
}
