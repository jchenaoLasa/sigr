# SIGR — Sistema Integral de Gestión de Restaurante

Aplicación web desarrollada en React + Vite para la gestión completa de un restaurante: autenticación por roles, menú digital, pedidos en tiempo real, reservas y cierre de caja.

---

## Requisitos previos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js     | 18.x o superior |
| npm         | 9.x o superior  |
| Git         | 2.x o superior  |

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd sigr
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### 4. Compilar para producción

```bash
npm run build
```

Los archivos compilados quedan en la carpeta `dist/`.

### 5. Previsualizar la build de producción

```bash
npm run preview
```

---

## Credenciales de acceso (modo demo)

| Rol           | Correo            | Contraseña |
|---------------|-------------------|------------|
| Administrador | admin@sigr.com    | 1234       |
| Mesero        | mesero@sigr.com   | 1234       |
| Cliente       | cliente@sigr.com  | 1234       |

---

## Módulos del sistema

### Autenticación
- Inicio de sesión con correo y contraseña.
- Tres roles con permisos diferenciados: **admin**, **mesero** y **cliente**.
- Navegación y vistas filtradas automáticamente según el rol activo.

### Menú Digital
- Visualización de platos agrupados por categoría.
- **Admin:** CRUD completo de platos (nombre, precio, descripción, disponibilidad) y categorías.
- Filtro por categoría y marcado de platos no disponibles.

### Pedidos
- Creación de pedidos por mesa con carrito de selección.
- Seguimiento en tiempo real por estados: `Pendiente → Preparando → Listo → Entregado`.
- Filtro de pedidos por estado.
- Visible solo para roles **admin** y **mesero**.

### Reservas
- Registro de reservas con nombre, teléfono, fecha, hora y número de personas.
- Filtro por fecha.
- Cambio de estado: `Confirmada`, `Completada`, `Cancelada`.
- Los clientes solo ven y gestionan sus propias reservas.

### Caja y Reportes
- Estadísticas del día: ingresos totales, pedidos entregados, ticket promedio y pendientes.
- Detalle de todos los pedidos entregados en la fecha seleccionada.
- Ranking de los 5 platos más vendidos.
- Cierre de caja con confirmación e historial de cierres anteriores.
- Visible solo para el rol **admin**.

---

## Estructura del proyecto

```
sigr/
├── public/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Sidebar y navegación principal
│   ├── context/
│   │   └── AppContext.jsx      # Estado global con React Context
│   ├── pages/
│   │   ├── Login.jsx           # Módulo de autenticación
│   │   ├── Dashboard.jsx       # Panel de inicio y estadísticas
│   │   ├── Menu.jsx            # Módulo de menú digital
│   │   ├── Pedidos.jsx         # Módulo de pedidos
│   │   ├── Reservas.jsx        # Módulo de reservas
│   │   └── Caja.jsx            # Módulo de caja y reportes
│   ├── App.jsx                 # Enrutamiento principal
│   ├── main.jsx                # Punto de entrada
│   └── index.css               # Estilos globales
├── package.json
├── vite.config.js
├── README.md
├── CHANGELOG.md
└── LICENSE.txt
```

---

## Tecnologías utilizadas

| Paquete             | Versión  | Propósito                          |
|---------------------|----------|------------------------------------|
| React               | 19.x     | Biblioteca de interfaz de usuario  |
| Vite                | 8.x      | Build tool y servidor de desarrollo|
| React Router DOM    | 7.x      | Enrutamiento del lado del cliente  |
| Lucide React        | latest   | Iconografía                        |
| React Context API   | —        | Gestión de estado global           |

---

## Notas de desarrollo

- El estado de la aplicación es **en memoria**; al recargar la página los datos vuelven a su estado inicial. Para persistencia se puede integrar `localStorage` o una API REST.
- No requiere base de datos ni servidor backend para ejecutarse.

---

## Licencia

Este proyecto está licenciado bajo los términos de la **Licencia MIT**. Consulta el archivo [LICENSE.txt](LICENSE.txt) para más detalles.
