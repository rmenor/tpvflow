import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
    findAll() {
        return [
            { id: '1', categoryId: '1', name: 'ALITAS DE POLLO', price: 3.30 },
            { id: '2', categoryId: '1', name: 'Aros de cebolla', price: 1.80 },
            { id: '3', categoryId: '1', name: 'COMBI ANTICA', price: 5.60 },
            { id: '4', categoryId: '1', name: 'Croquetas de Ibericos', price: 2.60 },
            { id: '8', categoryId: '4', name: 'Pizza Margarita', price: 8.50, ingredients: ['Tomate', 'Mozzarella', 'Orégano'] },
            { id: '9', categoryId: '4', name: 'Pizza Prosciutto', price: 9.50, ingredients: ['Tomate', 'Mozzarella', 'Jamón York'] },
            { id: '10', categoryId: '4', name: 'Pizza Barbacoa', price: 10.50, ingredients: ['Salsa BBQ', 'Mozzarella', 'Carne Picada', 'Bacon'] },
            { id: '5', categoryId: '5', name: 'MOUSSE DE CHOCO', price: 2.30 },
            { id: '6', categoryId: '5', name: 'MOUSSE DE LIMON', price: 2.30 },
            { id: '7', categoryId: '5', name: 'NATILLAS', price: 2.10 },
        ];
    }
}
