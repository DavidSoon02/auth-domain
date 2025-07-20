export interface User {
    id: string;
    email: string;
    password?: string; // Optional for OAuth users
    firstName: string;
    lastName: string;
    githubId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface GitHubUser {
    id: number;
    login: string;
    email: string;
    name: string;
    avatar_url: string;
}
