import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    categoryId?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    ingredients?: string[];
}
