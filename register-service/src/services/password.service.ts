import bcrypt from 'bcryptjs';

export class PasswordService {
    private readonly saltRounds: number;

    constructor() {
        this.saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }
}
