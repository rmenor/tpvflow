---
description: refactorizar el frontend del TPV separando componentes, definiendo interfaces y abstrayendo lógica.
---
# Optimización de Frontend (React/Next.js)

Este flujo de trabajo guía al desarrollador o al agente para refactorizar la vista principal del TPV (`src/app/tpv/page.tsx`), que actualmente excede las 1400 líneas.

## Pasos

1. **Crear la estructura de carpetas (`src/components`, `src/hooks`, `src/types`)**
   // turbo
   `mkdir -p src/components/{layout,tpv,modals}`
   // turbo
   `mkdir -p src/hooks src/types src/services`

2. **Definir Tipos Estrictos (`src/types/index.ts`)**
   - Extraer todos los modelos de datos (Product, Category, Customer, Order, OrderItem).
   - Eliminar los arrays de Mocks (`MOCK_CLIENTS`, `MOCK_EMPLOYEES`) y moverlos temporalmente al directorio de mocks o usarlos sólo durante desarrollo.

3. **Extraer Componentes Modulares**
   - Mover la cabecera a `src/components/layout/Header.tsx`.
   - Mover el grid de categorías a `src/components/tpv/CategorySelector.tsx`.
   - Mover el catálogo de productos a `src/components/tpv/ProductGrid.tsx`.
   - Extraer el panel lateral de la comanda (ticket, detalle, cliente asociado) a `src/components/tpv/OrderPanel.tsx`.
   - Refactorizar los modales grandes (`ModalTecladoNumerico`, `CustomPizzaModal`) a `src/components/modals/`.

4. **Implementar Custom Hooks de Estado**
   - Crear `useCart.ts`: Para manejar el estado de las líneas de comanda añadidos (`addToCart`, `removeFromCart`, `applyDiscount`).
   - Crear `useCustomers.ts`: Para gestionar clientes y sus asignaciones en tickets de Local o Domicilio.

5. **Limpiar `page.tsx`**
   - El archivo principal solo debe actuar como contenedor y orquestador (`View Controller`).
   - No usar `any`. Asegurarse de que el compilador TypeScript pase limpio.
