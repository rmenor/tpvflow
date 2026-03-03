import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import 'dotenv/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        const dbUrl = new URL(process.env.DATABASE_URL!);
        dbUrl.searchParams.delete('sslmode');
        const pool = new Pool({
            connectionString: dbUrl.toString(),
            ssl: { rejectUnauthorized: false },
        });
        const adapter = new PrismaPg(pool);
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
