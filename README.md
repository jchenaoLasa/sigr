# SIGR — Sistema Integral de Gestión de Restaurante

A role-based restaurant management SPA built with React 19 and Material Design (MUI).

---

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Framework  | React 19 + Vite |
| UI Library | MUI (Material UI) |
| Routing    | React Router DOM v7 |
| Icons      | Lucide React |
| State      | React Context + Hooks |
| Styling    | MUI `sx` prop + Emotion |

---

## Features

- **Dashboard** — daily stats (orders, revenue, reservations, menu items), recent orders table and today's reservations.
- **Menu** — card grid with category filters; admin can add, edit and delete dishes and categories.
- **Orders** — order builder with cart panel, real-time status progression (`pendiente → preparando → listo → entregado`).
- **Reservations** — reservation cards with date filter; admin can change status and manage all reservations.
- **Cash Register** — daily revenue stats, delivered order details, top-selling dishes and end-of-day cash close.
- **Role-based access** — each role sees only the pages relevant to them.

---

## Roles

| Role     | Email                | Password | Access |
|----------|----------------------|----------|--------|
| Admin    | admin@sigr.com       | 1234     | All pages |
| Mesero   | mesero@sigr.com      | 1234     | Menu, Orders, Reservations |
| Cliente  | cliente@sigr.com     | 1234     | Menu, My Reservations |

---

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd sigr

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Available Scripts

| Script           | Description |
|------------------|-------------|
| `npm run dev`    | Start Vite development server |
| `npm run build`  | Build for production |
| `npm run preview`| Preview production build |
| `npm run lint`   | Run ESLint |

---

## Project Structure

```
sigr/
├── src/
│   ├── main.jsx            # Entry point — ThemeProvider + CssBaseline
│   ├── App.jsx             # Router + role-based private routes
│   ├── theme.js            # MUI custom theme
│   ├── components/
│   │   └── Layout.jsx      # Permanent sidebar drawer + main content
│   ├── context/
│   │   └── AppContext.jsx  # Global state (users, menu, orders, reservations)
│   └── pages/
│       ├── Login.jsx
│       ├── Dashboard.jsx
│       ├── Menu.jsx
│       ├── Pedidos.jsx
│       ├── Reservas.jsx
│       └── Caja.jsx
├── CHANGELOG.md
├── LICENSE
└── README.md
```

---

## License

MIT — see [LICENSE](LICENSE) for details.
