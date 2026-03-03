import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: { customer: true }
        });
    }

    remove(id: string) {
        return this.prisma.order.delete({ where: { id } });
    }
}
