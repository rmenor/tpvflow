import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsNumber()
    @IsOptional()
    points?: number;
}
