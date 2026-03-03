import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    findAll(status?: string) {
        return this.prisma.order.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: 'desc' },
            include: { customer: true, items: { include: { product: true } } }
        });
    }

    findOne(id: string) {
        return this.prisma.order.findUnique({
            where: { id },
            include: { customer: true, items: { include: { product: true } } }
        });
    }

    create(data: any) {
        // Strip out unknown relationship fields or map them
        const { id, items, client, customer, customerId, ticketId, orderType, ...rest } = data;
        let cId = customerId || client?.id || customer?.id;
        if (!cId) cId = undefined; // Do not pass null to string? relation if empty

        return this.prisma.order.create({
            data: {
                ...rest,
                total: rest.total || 0,
                itemsCount: items?.length || rest.itemsCount || 0,
                ...(cId ? { customerId: cId } : {}),
                items: {
                    create: items?.map((item: any) => ({
                        productId: item.id || item.productId,
                        quantity: 1,
                        unitPrice: item.price + (item.cartExtraCost || 0),
                        totalPrice: item.price + (item.cartExtraCost || 0)
                    })) || []
                }
            },
            include: { customer: true, items: { include: { product: true } } }
        });
    }

    update(id: string, data: any) {
        const { items, client, customer, customerId, ticketId, orderType, createdAt, updatedAt, ...rest } = data;
        let cId = customerId || client?.id || customer?.id;
        if (!cId) cId = undefined;

        // Clean up the `id` from `rest` payload so we don't accidentally update it
        delete rest.id;

        return this.prisma.order.update({
            where: { id },
            data: {
                ...rest,
                itemsCount: items?.length || rest.itemsCount || 0,
                ...(cId ? { customerId: cId } : {}),
                items: {
                    deleteMany: {},
                    create: items?.map((item: any) => ({
                        productId: item.id || item.productId,
                        quantity: 1,
                        unitPrice: item.price + (item.cartExtraCost || 0),
                        totalPrice: item.price + (item.cartExtraCost || 0)
                    })) || []
                }
            },
            include: { customer: true, items: { include: { product: true } } }
        });
    }

    remove(id: string) {
        return this.prisma.order.delete({ where: { id } });
    }
}
