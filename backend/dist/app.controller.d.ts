import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getCategories(): {
        id: string;
        name: string;
        color: string;
    }[];
    getProducts(): ({
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
