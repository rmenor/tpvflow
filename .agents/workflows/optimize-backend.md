---
description: refactorizar el backend de NestJS utilizando arquitectura modular y DTOs
---
# Optimización de Backend (NestJS)

Este flujo de trabajo tiene como objetivo escalar el backend que actualmente se encuentra monolítico en el archivo `src/app.controller.ts`.

## Pasos

1. **Definir la Estructura Modular**
   Aprovechando las herramientas del Nest CLI (`npx nest`), generar los recursos necesarios.
   // turbo
   `npx nest g module categories`
   // turbo
   `npx nest g controller categories`
   // turbo
   `npx nest g service categories`

2. **Repetir para los módulos clave**
   Generar la infraestructura básica para `products`, `orders` y `customers`.
   // turbo
   `npx nest g module products && npx nest g controller products && npx nest g service products`
   // turbo
   `npx nest g module orders && npx nest g controller orders && npx nest g service orders`

3. **Migrar los Datos Hardcoded**
   - Transladar los mocks de categorías de `app.controller.ts` a `categories.service.ts`.
   - Mover los productos del mismo lugar a `products.service.ts`.

4. **Preparar Entidades y DTOs**
   - En cada módulo crear carpetas `/entities` y `/dto`.
   - Declarar DTOs para validación de entrada (ej: `CreateOrderDto`, `UpdateProductDto`) utilizando `class-validator` y `class-transformer`.
   
5. **Configurar el Acceso Global (`app.module.ts`)**
   - Asegurar que los módulos recién creados queden inyectados.
   - Limpiar `app.controller.ts` para dejarlo únicamente si es necesario (ej: Check de Health) o suprimirlo por completo.
