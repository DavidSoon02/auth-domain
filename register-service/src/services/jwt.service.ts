import jwt from 'jsonwebtoken';

export interface TokenPayload {
    userId: string;
    email: string;
}

export class JwtService {
    private readonly secretKey: string;
    private readonly expiresIn: string;

    constructor() {
        this.secretKey = process.env.JWT_SECRET || 'your-super-secret-key-change-this';
        this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    }

    generateToken(payload: TokenPayload): string {
        return jwt.sign(payload, this.secretKey, {
            expiresIn: this.expiresIn,
            issuer: 'register-service'
        });
    }

    verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, this.secretKey) as TokenPayload;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}
