import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [CategoriesModule, ProductsModule, OrdersModule, CustomersModule, EmployeesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
