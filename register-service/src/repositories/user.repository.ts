import { Pool } from 'pg';
import { User, RegisterData } from '../types/user';
import { Database } from '../database/connection';

export class UserRepository {
    private pool: Pool;

    constructor() {
        this.pool = Database.getInstance().getPool();
    }

    async createUser(userData: RegisterData): Promise<User> {
        const query = `
      INSERT INTO users (email, password, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, first_name, last_name, is_active, created_at, updated_at
    `;

        const result = await this.pool.query(query, [
            userData.email,
            userData.password,
            userData.firstName,
            userData.lastName
        ]);

        const row = result.rows[0];
        return {
            id: row.id,
            email: row.email,
            firstName: row.first_name,
            lastName: row.last_name,
            isActive: row.is_active,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    async createGitHubUser(email: string, firstName: string, lastName: string, githubId: string): Promise<User> {
        const query = `
      INSERT INTO users (email, first_name, last_name, github_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, first_name, last_name, github_id, is_active, created_at, updated_at
    `;

        const result = await this.pool.query(query, [email, firstName, lastName, githubId]);
        const row = result.rows[0];

        return {
            id: row.id,
            email: row.email,
            firstName: row.first_name,
            lastName: row.last_name,
            githubId: row.github_id,
            isActive: row.is_active,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    async findByEmail(email: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await this.pool.query(query, [email]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return {
            id: row.id,
            email: row.email,
            password: row.password,
            firstName: row.first_name,
            lastName: row.last_name,
            githubId: row.github_id,
            isActive: row.is_active,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    async findByGitHubId(githubId: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE github_id = $1';
        const result = await this.pool.query(query, [githubId]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return {
            id: row.id,
            email: row.email,
            firstName: row.first_name,
            lastName: row.last_name,
            githubId: row.github_id,
            isActive: row.is_active,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }
}
