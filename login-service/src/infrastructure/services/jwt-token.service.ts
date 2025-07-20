import * as jwt from 'jsonwebtoken';
import { AuthToken, UserSession } from '../../domain/entities/user.entity';
import { TokenService } from '../../domain/services/auth.service';
import { TokenGenerationError } from '../../domain/errors/auth.errors';

export class JwtTokenService implements TokenService {
    private readonly jwtSecret: string;
    private readonly jwtExpiresIn: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';

        if (this.jwtSecret === 'default-secret-key') {
            console.warn('Warning: Using default JWT secret. Set JWT_SECRET in production!');
        }
    }

    async generateToken(payload: UserSession): Promise<AuthToken> {
        try {
            const tokenPayload = {
                userId: payload.userId,
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName
            };

            const token = jwt.sign(
                tokenPayload,
                this.jwtSecret,
                { expiresIn: '24h' }
            );

            return {
                accessToken: token,
                expiresIn: this.jwtExpiresIn,
                tokenType: 'Bearer'
            };
        } catch (error) {
            console.error('Error generating token:', error);
            throw new TokenGenerationError('Failed to generate authentication token');
        }
    }

    async verifyToken(token: string): Promise<UserSession> {
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as jwt.JwtPayload & UserSession;

            return {
                userId: decoded.userId,
                email: decoded.email,
                firstName: decoded.firstName,
                lastName: decoded.lastName
            };
        } catch (error) {
            console.error('Error verifying token:', error);
            throw new Error('Invalid or expired token');
        }
    }
}
