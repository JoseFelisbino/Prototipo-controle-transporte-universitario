import { Router } from 'express';
import { RotaController } from '../controllers/rota.controller';
import { RotaService } from '../services/rota.service';
import { PrismaRotaRepository } from '../repositories/rota.repository';
import { PrismaTransporteRepository } from '../repositories/transporte.repository';
import { rotaRules } from '../validators/input.validator';
import { validateRequest } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { Perfil } from '@prisma/client';

const router = Router();
const rotaRepository = new PrismaRotaRepository();
const transporteRepository = new PrismaTransporteRepository();
const rotaService = new RotaService(rotaRepository, transporteRepository);
const rotaController = new RotaController(rotaService);

router.use(authMiddleware);

router.get('/', rotaController.findAll);
router.get('/:id', rotaController.findById);

// Only ADMIN can modify routes (RN04 / RN07)
router.post('/', roleMiddleware([Perfil.ADMIN]), rotaRules, validateRequest, rotaController.create);
router.put('/:id', roleMiddleware([Perfil.ADMIN]), rotaRules, validateRequest, rotaController.update);
router.delete('/:id', roleMiddleware([Perfil.ADMIN]), rotaController.delete);

export default router;
