import { AuthToken, UserSession } from '../entities/user.entity';

export interface TokenService {
    generateToken(payload: UserSession): Promise<AuthToken>;
    verifyToken(token: string): Promise<UserSession>;
}

export interface PasswordService {
    hashPassword(password: string): Promise<string>;
    comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
