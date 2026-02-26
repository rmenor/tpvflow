# TPV Pizzería - Documentación de Refactorización

## Objetivo
Clonar la aplicación existente del TPV (Terminal Punto de Venta) para "Anticapizza", modernizando la arquitectura y la interfaz gráfica sin perder la funcionalidad original.

## Arquitectura

### Frontend: Next.js (React)
El frontend estará desarrollado en **Next.js** utilizando React. 
Se implementará una vista de TPV óptima y funcional con componentes reutilizables.
**Stack Frontend**: Next.js, React, Tailwind CSS.

### Backend: NestJS
El backend será una API REST en **NestJS** que servirá todos los datos (clientes, productos, categorías, comandas).
**Stack Backend**: NestJS (TypeScript).

---

## Análisis de Funcionalidad y Pantallas

Basado en las imágenes proporcionadas del sistema antiguo, el TPV debe contar con:

### 1. Cabecera (Header)
Una barra de navegación persistente en la parte superior:
- "Comandas", "Local", "Domicilio", "Recuento", "Puntos", "Nuevo Movimiento"
- Nombre del usuario logueado en la derecha (p.ej. "Empleado")

### 2. Vista Principal de Comandas
Cuando no hay ninguna seleccionada, se muestra:
- Dos pestañas: **LOCAL** / **DOMICILIO**
- Un "tablero" o "cuadrícula" con las comandas activas, representadas como tarjetas (ej. Ticket 3200).

### 3. Vista de Ticket en Curso (El TPV Principal)
Al abrir o crear una comanda, la pantalla se divide en áreas clave clave para facilitar el flujo ágil en el restaurante:

**A. Panel Lateral Izquierdo (Acciones de la Comanda / Cliente)**
- Navegación interna (tipo tabs): **COMANDA**, **CLIENTE**, **INFORMACIÓ**, **DOMICILIO**.
- **Vista COMANDA**: 
  - Muestra la lista de artículos añadidos ("Artículo", "R", "C", "S", "Importe").
  - Botones `+` (Sumar), `-` (Restar) y la Cantidad del artículo para modificar el pedido ágilmente.
  - Bloque grande en ROJO con el Total "A pagar: 3.60 €" y el porcentaje de Descuento (si aplica).
- **Vista CLIENTE**:
  - Muestra detalles del cliente asginado a la comanda ("Sin nombre, c san onofre 31").
  - Botones "Actualizar cliente", "Seleccionar cliente", "Nuevo cliente".

**B. Panel Central/Derecho (Catálogo interactivo)**
- **Categorías Superiores**: ENTRANTES, ENSALADAS, PASTAS, PIZZAS, POSTRES, BEBIDAS, etc. Las pestañas cambian de color (ej. rojo) cuando están activas.
- **Subcategorías / Artículos Inferiores**: En función de la categoría superior seleccionada, se muestran botones grandes con cada artículo disponible (ej. "Aros de cebolla", "Patatas bravas"). Cada botón contiene el nombre y el precio en la esquina inferior.

**C. Visualización e Impresión de Ticket (Recibo)**
- Pantalla verde detallando el recibo y un botón "Re-Imprimir Ticket".
- Formato de ticket:
  - Título/Empresa (ej. "Anticapizza - ALCOY")
  - Detalles de la empresa (CIF, Teléfono, Dirección)
  - Identificador central (ej. "Factura simplificada", "Ticket: 3200", "RECOGE EN LOCAL")
  - Tabla de compra (Cantidad, Artículo, Importe)
  - Desglose de "(IVA incluido) Total: 3,60 €"
  - Mensaje final ("GRACIAS POR SU VISITA").

## Recursos (Entidades)
1. **Products (Artículos)**: Nombre, Precio Base, Categoría, Opciones Extra.
2. **Categories (Categorías)**: Nombre, Orden en la interfaz.
3. **Customers (Clientes)**: Nombre, Dirección, Teléfono, Puntos.
4. **Orders (Comandas)**: Ticket ID, Tipo (Local/Domicilio), Fecha/Hora, Cliente asociado, Lista de Items pedidos, Total bruto, Descuento, Total neto, Estado (En progreso, Pagado, etc.).
5. **OrderItems (Líneas de Comanda)**: ID Producto, Cantidad, Precio Unitario, Total Línea.

## Siguiente Paso
- Inicializar el espacio de trabajo con los directorios `/backend` para NestJS y `/frontend` para Next.js.
- Configurar Tailwind en Next.js para replicar el TPV (botones robustos, grillas de productos, panel interactivo).
- Definir el esquema base de NestJS.

--- 

## Actualizaciones y Nuevas Implementaciones (Últimas Fases)
- Se ha refactorizado la interfaz para que sea responsive simulando pantallas pequeñas en TPV (800x600).
- Todos los elementos han sido compactados: paneles laterales más estrechos (320px), fuentes y espaciados reajustados en Tailwind.
- **Botón `Abrir Comanda`**: Se ha reubicado a la izquierda en las tablas de la zona de listados.
- **Selector de Mesa**: Se habilita una pestaña nueva en `COMANDA - CLIENTE - MESA`, la cual permite incluir el número de mesa y comensales usando un teclado y un + / - interactivo.
- **Lista de Recibos / Cobros (`listados`)**: Se actualizan y visualizan las mesas aparcadas.
- **Pizzas y Modal Personalizable**: El Backend se encarga de servir las pizzas. Al pinchar en una de ellas, se abre un *Modal de Ingredientes* personalizable con estilos interactivos que se añaden dinámicamente al carrito junto a la pizza base.
