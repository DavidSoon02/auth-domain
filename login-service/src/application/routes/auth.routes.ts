import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import rateLimit from 'express-rate-limit';

export const createAuthRoutes = (authController: AuthController): Router => {
    const router = Router();

    // Rate limiting for login attempts
    const loginLimiter = rateLimit({
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5'), // 5 attempts per window
        message: {
            success: false,
            message: 'Too many login attempts, please try again later'
        },
        standardHeaders: true,
        legacyHeaders: false,
    });

    // Routes
    router.post('/login', loginLimiter, authController.login.bind(authController));
    router.post('/validate', authController.validateToken.bind(authController));
    router.get('/health', authController.healthCheck.bind(authController));

    return router;
};
