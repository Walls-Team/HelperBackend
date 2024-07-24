import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class DatabaseConfig {
    public static getPostgresConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: process.env.DATABASE_HOST || 'localhost',
            port: parseInt(process.env.DATABASE_PORT) || 5432,
            password: process.env.DATABASE_PASSWORD || 'admin',
            username: process.env.DATABASE_USER || 'admin',
            entities: [],
            database: process.env.DATABASE_NAME || 'test',
            synchronize: true,
            logging: true,
        };
    }
}

