import { Request, Response, NextFunction } from 'express';
import { Perfil } from '@prisma/client';

export const roleMiddleware = (allowedRoles: Perfil[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Usuário não autenticado.' });
      return;
    }

    if (!allowedRoles.includes(req.user.perfil)) {
      res.status(403).json({ error: 'Acesso proibido. Permissão insuficiente (RN07).' });
      return;
    }

    next();
  };
};
