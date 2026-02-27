import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  findAll() {
    return [
      { id: '1', name: 'ENTRANTES', color: 'bg-red-600' },
      { id: '2', name: 'ENSALADAS', color: 'bg-gray-300' },
      { id: '3', name: 'PASTAS', color: 'bg-gray-300' },
      { id: '4', name: 'PIZZAS', color: 'bg-gray-300' },
      { id: '5', name: 'POSTRES', color: 'bg-red-600' },
    ];
  }
}
