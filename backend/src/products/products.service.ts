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

    create(data: { name: string; price: number; categoryId: string; ingredients?: string[] }) {
        if (data.price) data.price = Number(data.price);
        return this.prisma.product.create({ data });
    }

    update(id: string, data: any) {
        if (data.price !== undefined) data.price = Number(data.price);
        return this.prisma.product.update({ where: { id }, data });
    }

    remove(id: string) {
        return this.prisma.product.delete({ where: { id } });
    }

    findExtraIngredients() {
        return this.prisma.extraIngredient.findMany({
            orderBy: { name: 'asc' },
        });
    }
}
