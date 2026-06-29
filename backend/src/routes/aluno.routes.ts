import { Router } from 'express';
import { AlunoController } from '../controllers/aluno.controller';
import { AlunoService } from '../services/aluno.service';
import { PrismaAlunoRepository } from '../repositories/aluno.repository';
import { PrismaTransporteRepository } from '../repositories/transporte.repository';
import { alunoRules } from '../validators/input.validator';
import { validateRequest } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { Perfil } from '@prisma/client';

const router = Router();
const alunoRepository = new PrismaAlunoRepository();
const transporteRepository = new PrismaTransporteRepository();
const alunoService = new AlunoService(alunoRepository, transporteRepository);
const alunoController = new AlunoController(alunoService);

router.use(authMiddleware);

// Students or admins can look up a student link by User ID
router.get('/user/:userId', alunoController.findByUserId);
router.get('/:id', alunoController.findById);

// ADMIN only for managing the student list and transport assignments
router.get('/', roleMiddleware([Perfil.ADMIN]), alunoController.findAll);
router.post('/', roleMiddleware([Perfil.ADMIN]), alunoRules, validateRequest, alunoController.create);
router.put('/:id', roleMiddleware([Perfil.ADMIN]), alunoRules, validateRequest, alunoController.update);
router.delete('/:id', roleMiddleware([Perfil.ADMIN]), alunoController.delete);

export default router;
