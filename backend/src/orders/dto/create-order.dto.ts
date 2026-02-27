import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class OrderItemDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNumber()
    @IsNotEmpty()
    unitPrice: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    addedIngredients?: string[];
}

export class CreateOrderDto {
    @IsEnum(['LOCAL', 'DOMICILIO'])
    @IsNotEmpty()
    type: 'LOCAL' | 'DOMICILIO';

    @IsString()
    @IsOptional()
    customerId?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsNumber()
    @IsNotEmpty()
    total: number;
}
