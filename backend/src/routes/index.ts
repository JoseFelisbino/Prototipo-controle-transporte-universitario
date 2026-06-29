import { Router } from 'express';
import authRoutes from './auth.routes';
import motoristaRoutes from './motorista.routes';
import transporteRoutes from './transporte.routes';
import alunoRoutes from './aluno.routes';
import rotaRoutes from './rota.routes';
import pontoRoutes from './ponto.routes';
import avisoRoutes from './aviso.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/motoristas', motoristaRoutes);
router.use('/transportes', transporteRoutes);
router.use('/alunos', alunoRoutes);
router.use('/rotas', rotaRoutes);
router.use('/pontos', pontoRoutes);
router.use('/avisos', avisoRoutes);

export default router;
