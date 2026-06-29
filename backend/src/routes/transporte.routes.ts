import { Router } from 'express';
import { TransporteController } from '../controllers/transporte.controller';
import { TransporteService } from '../services/transporte.service';
import { PrismaTransporteRepository } from '../repositories/transporte.repository';
import { transporteRules } from '../validators/input.validator';
import { validateRequest } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { Perfil } from '@prisma/client';

const router = Router();
const transporteRepository = new PrismaTransporteRepository();
const transporteService = new TransporteService(transporteRepository);
const transporteController = new TransporteController(transporteService);

router.use(authMiddleware);

router.get('/', transporteController.findAll);
router.get('/:id', transporteController.findById);

// Only ADMIN can modify transport data
router.post('/', roleMiddleware([Perfil.ADMIN]), transporteRules, validateRequest, transporteController.create);
router.put('/:id', roleMiddleware([Perfil.ADMIN]), transporteRules, validateRequest, transporteController.update);
router.delete('/:id', roleMiddleware([Perfil.ADMIN]), transporteController.delete);

export default router;
