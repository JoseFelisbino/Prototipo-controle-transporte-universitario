import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { PrismaUserRepository } from '../repositories/user.repository';
import { registerRules, loginRules } from '../validators/input.validator';
import { validateRequest } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { Perfil } from '@prisma/client';

const router = Router();
const userRepository = new PrismaUserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post('/register', registerRules, validateRequest, authController.register);
router.post('/login', loginRules, validateRequest, authController.login);
router.get('/profile', authMiddleware, authController.profile);
router.get('/users', authMiddleware, roleMiddleware([Perfil.ADMIN]), authController.listUsers);

export default router;
