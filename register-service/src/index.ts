import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Database } from './database/connection';
import { UserRepository } from './repositories/user.repository';
import { PasswordService } from './services/password.service';
import { GitHubService } from './services/github.service';
import { JwtService } from './services/jwt.service';
import { AuthController } from './controllers/auth.controller';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Dependencies
const database = Database.getInstance();
const userRepo = new UserRepository();
const passwordService = new PasswordService();
const githubService = new GitHubService();
const jwtService = new JwtService();
const authController = new AuthController(userRepo, passwordService, githubService, jwtService);

// Routes
app.post('/register', authController.register.bind(authController));
app.get('/auth/github', authController.githubAuth.bind(authController));
app.get('/auth/github/callback', authController.githubCallback.bind(authController));
app.get('/health', authController.health.bind(authController));

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Register Service API',
        endpoints: {
            register: 'POST /register',
            githubAuth: 'GET /auth/github',
            health: 'GET /health'
        }
    });
});

// Start server
async function startServer() {
    try {
        await database.testConnection();

        app.listen(port, () => {
            console.log(`🚀 Register Service running on port ${port}`);
            console.log(`🔗 GitHub Auth: http://localhost:${port}/auth/github`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
