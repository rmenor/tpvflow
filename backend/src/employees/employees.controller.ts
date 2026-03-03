import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { EmployeesService } from './employees.service';

@Controller('api/employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @Get()
    findAll() {
        return this.employeesService.findAll();
    }

    @Post()
    create(@Body() body: any) {
        return this.employeesService.create(body);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.employeesService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.employeesService.remove(id);
    }
}
