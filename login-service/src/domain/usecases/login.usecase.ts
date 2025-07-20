import { LoginCredentials, AuthToken, UserSession } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { TokenService, PasswordService } from '../services/auth.service';
import { InvalidCredentialsError, UserNotFoundError } from '../errors/auth.errors';

export class LoginUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly tokenService: TokenService
    ) { }

    async execute(credentials: LoginCredentials): Promise<AuthToken> {
        // Find user by email
        const user = await this.userRepository.findByEmail(credentials.email);

        if (!user) {
            throw new UserNotFoundError('User with this email does not exist');
        }

        if (!user.isActive) {
            throw new InvalidCredentialsError('User account is not active');
        }

        // Verify password
        const isPasswordValid = await this.passwordService.comparePassword(
            credentials.password,
            user.password
        );

        if (!isPasswordValid) {
            throw new InvalidCredentialsError('Invalid password');
        }

        // Create user session data
        const userSession: UserSession = {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        };

        // Generate and return token
        return await this.tokenService.generateToken(userSession);
    }
}
