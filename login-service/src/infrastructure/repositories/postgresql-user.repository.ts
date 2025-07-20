import { Pool } from 'pg';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { DatabaseConnection } from '../database/connection';

export class PostgreSQLUserRepository implements UserRepository {
    private pool: Pool;

    constructor() {
        this.pool = DatabaseConnection.getInstance().getPool();
    }

    async findByEmail(email: string): Promise<User | null> {
        const query = `
      SELECT id, email, password, first_name, last_name, is_active, created_at, updated_at
      FROM users 
      WHERE email = $1 AND is_active = true
    `;

        try {
            const result = await this.pool.query(query, [email]);

            if (result.rows.length === 0) {
                return null;
            }

            const row = result.rows[0];
            return {
                id: row.id,
                email: row.email,
                password: row.password,
                firstName: row.first_name,
                lastName: row.last_name,
                isActive: row.is_active,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            };
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    async findById(id: string): Promise<User | null> {
        const query = `
      SELECT id, email, password, first_name, last_name, is_active, created_at, updated_at
      FROM users 
      WHERE id = $1
    `;

        try {
            const result = await this.pool.query(query, [id]);

            if (result.rows.length === 0) {
                return null;
            }

            const row = result.rows[0];
            return {
                id: row.id,
                email: row.email,
                password: row.password,
                firstName: row.first_name,
                lastName: row.last_name,
                isActive: row.is_active,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            };
        } catch (error) {
            console.error('Error finding user by id:', error);
            throw error;
        }
    }

    async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        const query = `
      INSERT INTO users (email, password, first_name, last_name, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, password, first_name, last_name, is_active, created_at, updated_at
    `;

        try {
            const result = await this.pool.query(query, [
                user.email,
                user.password,
                user.firstName,
                user.lastName,
                user.isActive
            ]);

            const row = result.rows[0];
            return {
                id: row.id,
                email: row.email,
                password: row.password,
                firstName: row.first_name,
                lastName: row.last_name,
                isActive: row.is_active,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async update(id: string, userData: Partial<User>): Promise<User> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (userData.email !== undefined) {
            fields.push(`email = $${paramCount++}`);
            values.push(userData.email);
        }
        if (userData.password !== undefined) {
            fields.push(`password = $${paramCount++}`);
            values.push(userData.password);
        }
        if (userData.firstName !== undefined) {
            fields.push(`first_name = $${paramCount++}`);
            values.push(userData.firstName);
        }
        if (userData.lastName !== undefined) {
            fields.push(`last_name = $${paramCount++}`);
            values.push(userData.lastName);
        }
        if (userData.isActive !== undefined) {
            fields.push(`is_active = $${paramCount++}`);
            values.push(userData.isActive);
        }

        fields.push(`updated_at = NOW()`);
        values.push(id);

        const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, password, first_name, last_name, is_active, created_at, updated_at
    `;

        try {
            const result = await this.pool.query(query, values);

            if (result.rows.length === 0) {
                throw new Error('User not found');
            }

            const row = result.rows[0];
            return {
                id: row.id,
                email: row.email,
                password: row.password,
                firstName: row.first_name,
                lastName: row.last_name,
                isActive: row.is_active,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            };
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        const query = 'DELETE FROM users WHERE id = $1';

        try {
            await this.pool.query(query, [id]);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}
