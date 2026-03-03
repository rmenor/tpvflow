import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const dbUrl = new URL(process.env.DATABASE_URL!);
dbUrl.searchParams.delete('sslmode');
const pool = new Pool({
    connectionString: dbUrl.toString(),
    ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // 1. Leer db.json
    const dbPath = path.join(__dirname, '../data/db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    console.log('Reiniciando base de datos...');
    // Limpiar tablas (en orden para evitar problemas de foreign keys)
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.extraIngredient.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.customer.deleteMany();

    console.log('Sembrando categorías...');
    for (const cat of dbData.categories) {
        await prisma.category.create({
            data: {
                id: cat.id,
                name: cat.name,
            },
        });
    }

    console.log('Sembrando productos...');
    for (const prod of dbData.products) {
        // Verificar si la categoría existe, si no, crearla al vuelo
        const catExists = await prisma.category.findUnique({ where: { id: prod.categoryId } });
        if (!catExists) {
            await prisma.category.create({
                data: { id: prod.categoryId, name: `CATEGORÍA ${prod.categoryId}` }
            });
        }

        await prisma.product.create({
            data: {
                id: prod.id,
                name: prod.name,
                price: prod.price,
                categoryId: prod.categoryId,
                ingredients: prod.ingredients || [],
            },
        });
    }

    console.log('Sembrando ingredientes extra...');
    for (const extra of dbData.extraIngredients) {
        await prisma.extraIngredient.create({
            data: {
                name: extra.name,
                price: extra.price,
            },
        });
    }

    console.log('Sembrando empleados...');
    for (const emp of dbData.employees) {
        await prisma.employee.create({
            data: {
                id: emp.id,
                name: emp.name,
                initials: emp.initials,
                pin: emp.pin,
                role: emp.role,
                color: emp.color,
            },
        });
    }

    console.log('¡Base de datos alimentada exitosamente!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
