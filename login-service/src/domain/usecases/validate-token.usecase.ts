import { UserSession } from '../entities/user.entity';
import { TokenService } from '../services/auth.service';
import { InvalidCredentialsError } from '../errors/auth.errors';

export class ValidateTokenUseCase {
    constructor(
        private readonly tokenService: TokenService
    ) { }

    async execute(token: string): Promise<UserSession> {
        try {
            return await this.tokenService.verifyToken(token);
        } catch (error) {
            throw new InvalidCredentialsError('Invalid or expired token');
        }
    }
}
