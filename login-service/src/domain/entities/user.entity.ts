export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCreateInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthToken {
    accessToken: string;
    expiresIn: string;
    tokenType: string;
}

export interface UserSession {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
}
