import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    findAll(status?: string) {
        return this.prisma.order.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: 'desc' },
            include: { customer: true }
        });
    }

    create(data: any) {
        // Strip out unknown relationship fields or map them
        const { id, items, client, customer, customerId, ticketId, ...rest } = data;
        let cId = customerId || client?.id || customer?.id;
        if (!cId) cId = undefined; // Do not pass null to string? relation if empty

        return this.prisma.order.create({
            data: {
                ...rest,
                total: rest.total || 0,
                itemsCount: items?.length || rest.itemsCount || 0,
                ...(cId ? { customerId: cId } : {})
            },
            include: { customer: true }
        });
    }

    update(id: string, data: any) {
        const { items, client, customer, customerId, ticketId, createdAt, updatedAt, ...rest } = data;
        let cId = customerId || client?.id || customer?.id;
        if (!cId) cId = undefined;

        // Clean up the `id` from `rest` payload so we don't accidentally update it
        delete rest.id;

        return this.prisma.order.update({
            where: { id },
            data: {
                ...rest,
                itemsCount: items?.length || rest.itemsCount || 0,
                ...(cId ? { customerId: cId } : {})
            },
            include: { customer: true }
        });
    }

    remove(id: string) {
        return this.prisma.order.delete({ where: { id } });
    }
}
