import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeesService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.employee.findMany({
            orderBy: { name: 'asc' },
        });
    }

    create(data: { name: string; initials: string; pin: string; role: string; color: string }) {
        return this.prisma.employee.create({ data });
    }

    update(id: string, data: any) {
        return this.prisma.employee.update({ where: { id }, data });
    }

    remove(id: string) {
        return this.prisma.employee.delete({ where: { id } });
    }
}
