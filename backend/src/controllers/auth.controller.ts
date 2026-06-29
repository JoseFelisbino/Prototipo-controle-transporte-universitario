import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json({
        message: 'Usuário registrado com sucesso.',
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          perfil: user.perfil
        }
      });
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, senha } = req.body;
      const result = await this.authService.login(email, senha);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  profile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Usuário não autenticado.' });
        return;
      }
      const user = await this.authService.getProfile(userId);
      res.status(200).json({
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          perfil: user.perfil,
          aluno: (user as any).aluno
        }
      });
    } catch (err) {
      next(err);
    }
  };

  listUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.authService.findAll();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };
}
