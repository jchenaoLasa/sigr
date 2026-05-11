# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-05-10

### Added
- Full **Material Design** UI migration using MUI (`@mui/material`, `@emotion/react`, `@emotion/styled`).
- Global MUI theme (`src/theme.js`) with custom color palette (orange primary, dark navy secondary), Inter typography, rounded shapes and component overrides.
- `ThemeProvider` and `CssBaseline` in `src/main.jsx` for consistent baseline styles across browsers.
- Permanent `Drawer` sidebar with role-based navigation, avatar chip and logout button.
- Login page rebuilt with MUI `Card`, `TextField`, `Alert` and quick-access `Chip` buttons.
- Dashboard rebuilt with MUI stat `Card` components, `Table`, `List` and `Chip` status badges.
- Menu page rebuilt with MUI `Card` grid, `Tabs`, `Dialog`, `Chip` filters and `IconButton` actions.
- Orders page rebuilt with MUI `Card` grid, `Collapse` new-order panel, `Paper` cart and `Chip` filters.
- Reservations page rebuilt with MUI `Card` grid, `Dialog` form with CSS Grid layout and `Chip` statuses.
- Cash register page rebuilt with MUI stat cards, `Table` with `TableFooter` totals and confirm `Dialog`.
- Inter font loaded from Google Fonts in `index.html`.
- `README.md` with project overview, tech stack, installation and usage instructions.
- `LICENSE` (MIT).

### Changed
- Bumped project version from `0.0.0` to `1.0.0`.
- Replaced all vanilla CSS classes with MUI `sx` prop and theme-driven styling.
- `index.css` (468 lines) replaced by MUI `CssBaseline` and component-level `sx`.
- Updated `index.html` language attribute to `es` and title to full application name.
- Removed duplicate `import './index.css'` from `App.jsx`.

---

## [0.0.0] — 2026-05-10

### Added
- Initial release: React 19 + Vite SPA for restaurant management (SIGR).
- Role-based access control: `admin`, `mesero`, `cliente`.
- Pages: Login, Dashboard, Menu, Orders, Reservations, Cash Register.
- Context-based global state management (`AppContext`).
- Vanilla CSS styling with sidebar layout, cards, modals and tables.
