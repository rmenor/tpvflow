import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): ({
        id: string;
        categoryId: string;
        name: string;
        price: number;
        ingredients?: undefined;
    } | {
        id: string;
        categoryId: string;
        name: string;
        price: number;
        ingredients: string[];
    })[];
}
