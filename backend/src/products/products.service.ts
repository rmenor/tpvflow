import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.product.findMany({
            include: {
                category: true,
            },
            orderBy: { name: 'asc' },
        });
    }

    findExtraIngredients() {
        return this.prisma.extraIngredient.findMany({
            orderBy: { name: 'asc' },
        });
    }
}
