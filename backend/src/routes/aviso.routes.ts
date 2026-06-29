import { Router } from 'express';
import { AvisoController } from '../controllers/aviso.controller';
import { AvisoService } from '../services/aviso.service';
import { PrismaAvisoRepository } from '../repositories/aviso.repository';
import { PrismaTransporteRepository } from '../repositories/transporte.repository';
import { avisoRules } from '../validators/input.validator';
import { validateRequest } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { Perfil } from '@prisma/client';

const router = Router();
const avisoRepository = new PrismaAvisoRepository();
const transporteRepository = new PrismaTransporteRepository();
const avisoService = new AvisoService(avisoRepository, transporteRepository);
const avisoController = new AvisoController(avisoService);

router.use(authMiddleware);

router.get('/', avisoController.findAll);
router.get('/:id', avisoController.findById);
router.get('/transporte/:transporteId', avisoController.findByTransporteId);

// Only ADMIN can modify notices (RN07)
router.post('/', roleMiddleware([Perfil.ADMIN]), avisoRules, validateRequest, avisoController.create);
router.put('/:id', roleMiddleware([Perfil.ADMIN]), avisoRules, validateRequest, avisoController.update);
router.delete('/:id', roleMiddleware([Perfil.ADMIN]), avisoController.delete);

export default router;
