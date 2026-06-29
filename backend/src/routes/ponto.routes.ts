import { Router } from 'express';
import { PontoController } from '../controllers/ponto.controller';
import { PontoService } from '../services/ponto.service';
import { PrismaPontoRepository } from '../repositories/ponto.repository';
import { PrismaTransporteRepository } from '../repositories/transporte.repository';
import { pontoRules } from '../validators/input.validator';
import { validateRequest } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { Perfil } from '@prisma/client';

const router = Router();
const pontoRepository = new PrismaPontoRepository();
const transporteRepository = new PrismaTransporteRepository();
const pontoService = new PontoService(pontoRepository, transporteRepository);
const pontoController = new PontoController(pontoService);

router.use(authMiddleware);

router.get('/', pontoController.findAll);
router.get('/:id', pontoController.findById);
router.get('/transporte/:transporteId', pontoController.findByTransporteId);

// Only ADMIN can modify boarding points
router.post('/', roleMiddleware([Perfil.ADMIN]), pontoRules, validateRequest, pontoController.create);
router.put('/:id', roleMiddleware([Perfil.ADMIN]), pontoRules, validateRequest, pontoController.update);
router.delete('/:id', roleMiddleware([Perfil.ADMIN]), pontoController.delete);

export default router;
