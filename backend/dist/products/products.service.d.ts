export declare class ProductsService {
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
