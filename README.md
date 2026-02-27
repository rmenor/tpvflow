# TpvFlow - Terminal Punto de Venta Inteligente

TpvFlow es una aplicación moderna y robusta para la gestión de puntos de venta (Terminal Punto de Venta), especialmente diseñada para restaurantes, pizzerías y negocios de hostelería. Su arquitectura modular separa el Frontend (basado en Next.js y React) y el Backend (una API REST construida con NestJS).

## Características Principales

*   🚀 **Interfaz Rápida y Fluida**: Panel de TPV optimizado para uso ágil en pantallas táctiles y entornos de ritmo rápido.
*   🍕 **Configurador de Pedidos**: Personalización de pizzas y platos con ingredientes base modulares, cálculos de sobrecostos e ingredientes extra.
*   📅 **Gestión de Reservas y Tickets Aparcados**: Sistema interactivo que permite asentar reservas, convertirlas a tickets "aparcados" cuando el cliente llega al local ("VINO") y realizar cobros parciales o totales.
*   👥 **Control de Empleados**: Inicio de sesión mediante PIN Code (Manager, Cajero, Camarero) asociado a las diferentes acciones del TPV.
*   📱 **Diseño Accesible**: Creado con Tailwind CSS, adaptándose perfectamente a diversos tamaños de pantallas (desktop, tablet, móvil).
*   🌐 **Arquitectura Monolítica/Modular**: Frontend en Next.js (TypeScript) + Backend en NestJS, comunicados mediante una REST API.
*   💾 **Fácil de desplegar**: Listo para funcionar localmente o con entornos de orquestación en la nube como Vercel y Dokploy.
*   � **Demo en Vivo**: Puedes probar la aplicación en [tpvflow.vercel.app](https://tpvflow.vercel.app).
    *   **Usuario**: Admin
    *   **PIN**: 1234
*   �📊 **Presentación del Proyecto**: Puedes ver una presentación detallada generada por IA en [NotebookLM - TpvFlow](https://notebooklm.google.com/notebook/56e409a2-e52b-4718-8273-4c1738fb7e4d).

## Estructura del Proyecto

El repositorio está dividido en dos principales directorios:

### `/frontend` (Next.js 14)
*   **Next.js (App Router)** para un enrutado intuitivo y generación de layouts estáticos/dinámicos (`/tpv`, `/listados`, `/reservas`).
*   **Context/Hooks**: Mantenemos el carrito, los clientes y la sesión separados con Custom Hooks (`useCart`, `useCustomers`) para facilitar la prueba de unit testing.
*   **Tailwind CSS** para un modelado premium y limpio.

### `/backend` (NestJS)
*   Back-end robusto manejado con **NestJS** en TypeScript.
*   Organizado en módulos (`Products`, `Categories`, `Customers`, `Orders`, `Employees`).
*   Usa un archivo JSON de base de datos (`data/db.json`) ligero en entorno de desarrollo.

## Instalación y Arranque Rápido

### Requisitos
*   Node.js (v18+)
*   NPM o predeterminado

### Pasos

1. Clona el repositorio:
   ```bash
   git clone https://github.com/rmenor/tpvflow.git
   cd tpvflow
   ```

2. Arranca el **Backend** (NestJS):
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
   Estará disponible en `http://localhost:3001` (por defecto habilitado para CORS).

3. En otra terminal, inicializa el **Frontend** (Next.js):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Roadmap & Futuro

*   [x] Integrar base de datos JSON en el Backend como fuente de verdad.
*   [x] Generación de Modales de cobro interactivos (Efectivo y Tarjeta).
*   [ ] Conexión base de datos real (PostgreSQL / MongoDB) con Prisma u ORM.
*   [ ] Estadísticas e Informes avanzados.
*   [ ] Impresión de tickets configurables mediante escPOS directamente a la red.

---
*⌨️ TpvFlow está diseñado por el equipo de ingeniería para optimizar los flujos de la hostelería.*
