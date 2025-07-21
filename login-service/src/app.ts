import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { DatabaseConnection } from './infrastructure/database/connection';
import { PostgreSQLUserRepository } from './infrastructure/repositories/postgresql-user.repository';
import { BcryptPasswordService } from './infrastructure/services/bcrypt-password.service';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { LoginUseCase } from './domain/usecases/login.usecase';
import { ValidateTokenUseCase } from './domain/usecases/validate-token.usecase';
import { AuthController } from './application/controllers/auth.controller';
import { createAuthRoutes } from './application/routes/auth.routes';
import { errorHandler } from './application/controllers/auth.controller';

// Load environment variables
dotenv.config();

export class App {
    private app: Application;
    private port: number;
    private dbConnection: DatabaseConnection;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || '3001');
        this.dbConnection = DatabaseConnection.getInstance();

        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    private setupMiddleware(): void {
        // Security middleware
        this.app.use(helmet());

        // CORS configuration - Allow all origins
        this.app.use(cors({
            origin: true, // Allow all origins
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
            optionsSuccessStatus: 200
        }));

        // Body parsing middleware
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));

        // Request logging
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }

    private setupRoutes(): void {
        // Dependency injection
        const userRepository = new PostgreSQLUserRepository();
        const passwordService = new BcryptPasswordService();
        const tokenService = new JwtTokenService();

        const loginUseCase = new LoginUseCase(userRepository, passwordService, tokenService);
        const validateTokenUseCase = new ValidateTokenUseCase(tokenService);

        const authController = new AuthController(loginUseCase, validateTokenUseCase);

        // Routes
        this.app.use('/api/auth', createAuthRoutes(authController));

        // Root endpoint
        this.app.get('/', (req, res) => {
            res.json({
                success: true,
                message: 'Login Service API',
                version: '1.0.0',
                endpoints: {
                    login: 'POST /api/auth/login',
                    validateToken: 'POST /api/auth/validate',
                    health: 'GET /api/auth/health'
                }
            });
        });

        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                message: 'Endpoint not found'
            });
        });
    }

    private setupErrorHandling(): void {
        this.app.use(errorHandler);
    }

    public async start(): Promise<void> {
        try {
            // Test database connection
            await this.dbConnection.testConnection();

            // Start server
            this.app.listen(this.port, () => {
                console.log(`🚀 Login Service running on port ${this.port}`);
                console.log(`📖 API Documentation available at http://localhost:${this.port}/`);
                console.log(`🔍 Health check: http://localhost:${this.port}/api/auth/health`);
            });
        } catch (error) {
            console.error('Failed to start application:', error);
            process.exit(1);
        }
    }

    public getApp(): Application {
        return this.app;
    }

    public async shutdown(): Promise<void> {
        console.log('Shutting down gracefully...');
        await this.dbConnection.close();
        process.exit(0);
    }
}
