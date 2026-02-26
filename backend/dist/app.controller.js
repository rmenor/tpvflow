"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getCategories() {
        return [
            { id: '1', name: 'ENTRANTES', color: 'bg-red-600' },
            { id: '2', name: 'ENSALADAS', color: 'bg-gray-300' },
            { id: '3', name: 'PASTAS', color: 'bg-gray-300' },
            { id: '4', name: 'PIZZAS', color: 'bg-gray-300' },
            { id: '5', name: 'POSTRES', color: 'bg-red-600' },
        ];
    }
    getProducts() {
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
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getProducts", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map