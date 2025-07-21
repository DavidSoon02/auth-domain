import { sign, verify } from 'jsonwebtoken';

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
        return sign(payload, this.secretKey, {
            expiresIn: this.expiresIn,
            issuer: 'register-service'
        } as any);
    }

    verifyToken(token: string): TokenPayload {
        try {
            return verify(token, this.secretKey) as TokenPayload;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}
