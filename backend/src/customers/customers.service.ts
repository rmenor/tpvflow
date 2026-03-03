import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.customer.findMany({
            orderBy: { name: 'asc' },
        });
    }

    create(data: { name: string; phone?: string; address?: string; points?: number }) {
        return this.prisma.customer.create({ data });
    }

    update(id: string, data: { name?: string; phone?: string; address?: string; points?: number }) {
        return this.prisma.customer.update({ where: { id }, data });
    }

    remove(id: string) {
        return this.prisma.customer.delete({ where: { id } });
    }
}
