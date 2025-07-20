export class AuthenticationError extends Error {
    constructor(message: string = 'Authentication failed') {
        super(message);
        this.name = 'AuthenticationError';
    }
}

export class ValidationError extends Error {
    constructor(message: string = 'Validation failed') {
        super(message);
        this.name = 'ValidationError';
    }
}

export class UserNotFoundError extends Error {
    constructor(message: string = 'User not found') {
        super(message);
        this.name = 'UserNotFoundError';
    }
}

export class InvalidCredentialsError extends Error {
    constructor(message: string = 'Invalid credentials') {
        super(message);
        this.name = 'InvalidCredentialsError';
    }
}

export class TokenGenerationError extends Error {
    constructor(message: string = 'Token generation failed') {
        super(message);
        this.name = 'TokenGenerationError';
    }
}
