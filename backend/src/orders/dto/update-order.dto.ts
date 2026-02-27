import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OrderItemDto } from './create-order.dto';

export class UpdateOrderDto {
    @IsEnum(['LOCAL', 'DOMICILIO'])
    @IsOptional()
    type?: 'LOCAL' | 'DOMICILIO';

    @IsString()
    @IsOptional()
    customerId?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    @IsOptional()
    items?: OrderItemDto[];

    @IsNumber()
    @IsOptional()
    total?: number;
}
