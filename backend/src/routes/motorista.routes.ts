import { Router } from 'express';
import { MotoristaController } from '../controllers/motorista.controller';
import { MotoristaService } from '../services/motorista.service';
import { PrismaMotoristaRepository } from '../repositories/motorista.repository';
import { motoristaRules } from '../validators/input.validator';
import { validateRequest } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { Perfil } from '@prisma/client';

const router = Router();
const motoristaRepository = new PrismaMotoristaRepository();
const motoristaService = new MotoristaService(motoristaRepository);
const motoristaController = new MotoristaController(motoristaService);

router.use(authMiddleware);

router.get('/', motoristaController.findAll);
router.get('/:id', motoristaController.findById);

// Only ADMIN can modify driver data
router.post('/', roleMiddleware([Perfil.ADMIN]), motoristaRules, validateRequest, motoristaController.create);
router.put('/:id', roleMiddleware([Perfil.ADMIN]), motoristaRules, validateRequest, motoristaController.update);
router.delete('/:id', roleMiddleware([Perfil.ADMIN]), motoristaController.delete);

export default router;
