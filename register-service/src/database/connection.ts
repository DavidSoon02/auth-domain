import { Pool } from 'pg';

export class Database {
    private static instance: Database;
    private pool: Pool;

    private constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        });
    }

    static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    getPool(): Pool {
        return this.pool;
    }

    async testConnection(): Promise<void> {
        const client = await this.pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        console.log('✅ Database connected');
    }
}
