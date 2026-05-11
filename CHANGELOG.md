# Historial de Cambios — SIGR

Todos los cambios relevantes del proyecto se documentan en este archivo.  
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).  
Este proyecto sigue versionado con [Versionado Semántico](https://semver.org/lang/es/).

---

## [1.0.0] — 2026-05-10 — Línea base

Versión inicial funcional del sistema. Incluye los cinco módulos principales.

### Agregado

#### Módulo de Autenticación
- Pantalla de login con validación de correo y contraseña.
- Sistema de roles: `admin`, `mesero` y `cliente`.
- Redirección automática al dashboard tras iniciar sesión.
- Botones de acceso rápido (demo) para cada rol.
- Cierre de sesión desde el sidebar.
- Rutas protegidas con restricción por rol (`PrivateRoute`).

#### Módulo de Menú Digital
- Listado de platos en formato de tarjetas con nombre, descripción, precio y categoría.
- Filtro visual por categoría mediante botones de chip.
- Indicador visual de platos no disponibles.
- **Admin:** formulario modal para crear, editar y eliminar platos.
- **Admin:** gestión de categorías (crear, editar, eliminar) con contador de platos asociados.
- Campos del plato: nombre, categoría, precio, descripción y disponibilidad.

#### Módulo de Pedidos
- Panel de creación de pedido con selector de mesa (1–10).
- Carrito de compra con agregar, restar y eliminar ítems.
- Cálculo automático del total del pedido.
- Confirmación y registro del pedido con fecha/hora de creación.
- Flujo de estados: `Pendiente → Preparando → Listo → Entregado`.
- Filtro de pedidos por estado.
- Tarjetas de pedido con detalle de ítems, mesa, total y estado actual.
- Acceso restringido a roles `admin` y `mesero`.

#### Módulo de Reservas
- Formulario de reserva: nombre, teléfono, email, fecha, hora, número de personas y notas.
- Filtro de reservas por fecha seleccionada.
- Tarjetas de reserva con todos los datos del cliente.
- Cambio de estado desde selector: `Confirmada`, `Completada`, `Cancelada`.
- Edición y eliminación de reservas existentes.
- Los clientes solo visualizan y gestionan sus propias reservas.
- Los roles `admin` y `mesero` visualizan todas las reservas.

#### Módulo de Caja y Reportes
- Estadísticas diarias: ingresos totales, pedidos entregados, ticket promedio y pedidos pendientes.
- Tabla detallada de pedidos entregados en la fecha seleccionada, con totales.
- Ranking de los 5 platos más vendidos del día.
- Cierre de caja con diálogo de confirmación que muestra el monto a registrar.
- Validación para evitar doble cierre en la misma fecha.
- Historial cronológico de todos los cierres de caja anteriores.
- Acceso restringido al rol `admin`.

#### Infraestructura y estilos
- Proyecto inicializado con **Vite 8** y plantilla `react`.
- Enrutamiento con **React Router DOM 7** (`BrowserRouter`, rutas anidadas).
- Estado global centralizado con **React Context API** (`AppProvider` / `useApp`).
- Iconografía con **Lucide React**.
- Sidebar fijo con navegación dinámica según rol del usuario.
- Sistema de estilos CSS puro (sin framework externo): variables de color, grid responsivo, modales, tarjetas, tablas y badges de estado.
- Datos de demostración precargados: 4 categorías, 9 platos y 3 usuarios.

---

## Sin lanzar aún

- Persistencia de datos en `localStorage` o API REST.
- Modo oscuro.
- Gestión de múltiples usuarios desde el panel de administración.
- Impresión de comprobantes de pedido.
- Notificaciones en tiempo real entre mesero y cocina.
- Exportación de reportes a PDF o Excel.
