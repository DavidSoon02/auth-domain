import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '../../domain/usecases/login.usecase';
import { ValidateTokenUseCase } from '../../domain/usecases/validate-token.usecase';
import { loginSchema, validateTokenSchema } from '../validators/auth.validator';
import {
    AuthenticationError,
    ValidationError,
    UserNotFoundError,
    InvalidCredentialsError,
    TokenGenerationError
} from '../../domain/errors/auth.errors';

export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly validateTokenUseCase: ValidateTokenUseCase
    ) { }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate request body
            const validationResult = loginSchema.safeParse(req.body);

            if (!validationResult.success) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validationResult.error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
                return;
            }

            const { email, password } = validationResult.data;

            // Execute login use case
            const authToken = await this.loginUseCase.execute({ email, password });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: authToken
            });
        } catch (error) {
            next(error);
        }
    }

    async validateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Extract token from Authorization header
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({
                    success: false,
                    message: 'Authorization header with Bearer token is required'
                });
                return;
            }

            const token = authHeader.substring(7); // Remove 'Bearer ' prefix

            // Validate token
            const userSession = await this.validateTokenUseCase.execute(token);

            res.status(200).json({
                success: true,
                message: 'Token is valid',
                data: userSession
            });
        } catch (error) {
            next(error);
        }
    }

    async healthCheck(req: Request, res: Response): Promise<void> {
        res.status(200).json({
            success: true,
            message: 'Login service is healthy',
            timestamp: new Date().toISOString()
        });
    }
}

// Error handling middleware
export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error occurred:', error);

    if (error instanceof ValidationError) {
        res.status(400).json({
            success: false,
            message: error.message
        });
        return;
    }

    if (error instanceof UserNotFoundError || error instanceof InvalidCredentialsError) {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
        return;
    }

    if (error instanceof AuthenticationError) {
        res.status(401).json({
            success: false,
            message: error.message
        });
        return;
    }

    if (error instanceof TokenGenerationError) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
        return;
    }

    // Default error response
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
};
