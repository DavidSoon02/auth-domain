import bcrypt from 'bcryptjs';
import { PasswordService } from '../../domain/services/auth.service';

export class BcryptPasswordService implements PasswordService {
    private readonly saltRounds: number;

    constructor() {
        this.saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    }

    async hashPassword(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, this.saltRounds);
        } catch (error) {
            console.error('Error hashing password:', error);
            throw new Error('Password hashing failed');
        }
    }

    async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            console.error('Error comparing passwords:', error);
            throw new Error('Password comparison failed');
        }
    }
}
