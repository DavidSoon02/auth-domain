import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { PasswordService } from '../services/password.service';
import { GitHubService } from '../services/github.service';
import { JwtService } from '../services/jwt.service';
import { registerSchema } from '../validators/register.validator';

export class AuthController {
    constructor(
        private userRepo: UserRepository,
        private passwordService: PasswordService,
        private githubService: GitHubService,
        private jwtService: JwtService
    ) { }

    async register(req: Request, res: Response) {
        try {
            const validation = registerSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validation.error.errors
                });
            }

            const { email, password, firstName, lastName } = validation.data;

            // Check if user exists
            const existingUser = await this.userRepo.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already registered'
                });
            }

            // Hash password and create user
            const hashedPassword = await this.passwordService.hashPassword(password);
            const user = await this.userRepo.createUser({
                email,
                password: hashedPassword,
                firstName,
                lastName
            });

            // Generate JWT token
            const token = this.jwtService.generateToken({
                userId: user.id,
                email: user.email
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token
                }
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({
                success: false,
                message: 'Registration failed'
            });
        }
    }

    async githubAuth(req: Request, res: Response) {
        const authUrl = this.githubService.getAuthUrl();
        res.redirect(authUrl);
    }

    async githubCallback(req: Request, res: Response) {
        try {
            const { code } = req.query;
            if (!code) {
                return res.status(400).json({
                    success: false,
                    message: 'Authorization code required'
                });
            }

            // Get access token
            const accessToken = await this.githubService.getAccessToken(code as string);

            // Get user data
            const githubUser = await this.githubService.getUserData(accessToken);
            const email = await this.githubService.getUserEmail(accessToken);

            // Check if user exists
            let user = await this.userRepo.findByGitHubId(githubUser.id.toString());

            if (!user) {
                // Check by email
                user = await this.userRepo.findByEmail(email);

                if (!user) {
                    // Create new user
                    const nameParts = githubUser.name?.split(' ') || [githubUser.login, ''];
                    user = await this.userRepo.createGitHubUser(
                        email,
                        nameParts[0] || githubUser.login,
                        nameParts[1] || '',
                        githubUser.id.toString()
                    );
                }
            }

            // Generate JWT token
            const token = this.jwtService.generateToken({
                userId: user.id,
                email: user.email
            });

            res.json({
                success: true,
                message: 'GitHub authentication successful',
                data: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token
                }
            });
        } catch (error) {
            console.error('GitHub auth error:', error);
            res.status(500).json({
                success: false,
                message: 'GitHub authentication failed'
            });
        }
    }

    async health(req: Request, res: Response) {
        res.json({
            success: true,
            message: 'Register service is healthy',
            timestamp: new Date().toISOString()
        });
    }
}
