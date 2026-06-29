import { Perfil } from '@prisma/client';

export interface UserPayload {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  alunoId?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
