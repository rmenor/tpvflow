"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
let CategoriesService = class CategoriesService {
    findAll() {
        return [
            { id: '1', name: 'ENTRANTES', color: 'bg-red-600' },
            { id: '2', name: 'ENSALADAS', color: 'bg-gray-300' },
            { id: '3', name: 'PASTAS', color: 'bg-gray-300' },
            { id: '4', name: 'PIZZAS', color: 'bg-gray-300' },
            { id: '5', name: 'POSTRES', color: 'bg-red-600' },
        ];
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)()
], CategoriesService);
//# sourceMappingURL=categories.service.js.map