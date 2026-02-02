# Futuristic Theme - CSS Modular Structure

## 📁 Estructura de Archivos

```
css/
├── futuristic/
│   ├── _variables.css      # Variables CSS y custom properties
│   ├── _animations.css     # Todas las animaciones @keyframes
│   ├── _backgrounds.css    # Circuit board, hexagon grid
│   ├── _layout.css         # Navbar, sections, headers, footer
│   ├── _components.css     # Cards, buttons, diagrams
│   ├── _games.css          # Quiz, drag-drop, game controls
│   ├── _stepper.css        # Module stepper horizontal
│   ├── _demos.css          # ReAct, CoT, ToT, Reflection demos
│   ├── _utilities.css      # Clases utilitarias
│   └── _locked.css         # Estados locked, continue buttons
├── futuristic-theme.css    # Archivo orquestador (importar este)
└── module-futuristic.css   # Archivo original (backup)
```

## 🚀 Cómo Usar

### En tu HTML:

```html
<!-- Antes (archivo monolítico) -->
<link rel="stylesheet" href="../css/module-futuristic.css">

<!-- Ahora (modular) -->
<link rel="stylesheet" href="../css/futuristic-theme.css">
```

### Importar módulos específicos:

Si solo necesitas ciertos módulos, puedes crear tu propio archivo orquestador:

```css
/* custom-theme.css */
@import url('futuristic/_variables.css');   /* Siempre requerido */
@import url('futuristic/_animations.css');  /* Siempre requerido */
@import url('futuristic/_backgrounds.css');
@import url('futuristic/_layout.css');
/* ... solo los módulos que necesites */
```

## 📦 Descripción de Módulos

### Core (Siempre Requeridos)

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| `_variables.css` | ~45 | Variables CSS, paleta de colores, fuentes |
| `_animations.css` | ~120 | Todos los @keyframes |

### Layout

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| `_backgrounds.css` | ~95 | Circuit board, hexagon grid, decoraciones |
| `_layout.css` | ~260 | Navbar, hero, stats, roadmap, footer |

### Components

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| `_components.css` | ~270 | Theory cards, agent cards, buttons, progress |
| `_games.css` | ~160 | Quiz section, drag-drop, game controls |
| `_stepper.css` | ~130 | Module stepper con estados |

### Features

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| `_demos.css` | ~400 | ReAct, CoT, ToT, Reflection demos |
| `_utilities.css` | ~25 | Clases utilitarias |
| `_locked.css` | ~90 | Locked sections, continue buttons |

## 🎨 Variables CSS Disponibles

```css
/* Backgrounds */
--futuristic-bg-primary: #0a1628;
--futuristic-bg-secondary: #0f1729;
--futuristic-bg-tertiary: #1a2332;

/* Accents */
--futuristic-cyan: #00d9ff;
--futuristic-cyan-bright: #00f0ff;
--futuristic-blue: #0ea5e9;

/* Text */
--futuristic-text-primary: #f0f9ff;
--futuristic-text-secondary: #bae6fd;
--futuristic-text-muted: #94a3b8;

/* Glass */
--futuristic-glass-bg: rgba(15, 23, 41, 0.7);
--futuristic-glass-border: rgba(0, 217, 255, 0.3);

/* States */
--futuristic-success: #10b981;
--futuristic-warning: #f59e0b;
--futuristic-danger: #ef4444;
```

## 🔧 Animaciones Disponibles

- `circuitPulse` - Pulso del fondo de circuito
- `hexagonRotate` - Rotación de la grilla hexagonal
- `hexagonFloat` - Flotación de decoraciones
- `scanLine` - Línea de escaneo
- `progressGlow` - Brillo de barras de progreso
- `shimmer` - Efecto shimmer
- `sectionFadeIn` - Fade in de secciones
- `buttonPulse` - Pulso de botones
- `slideInRight` - Slide desde derecha
- `fadeOut` - Fade out
- `stepPulse` - Pulso de pasos del stepper

## 📝 Notas de Migración

1. **Sin cambios de clases**: Todos los selectores y nombres de clases permanecen iguales
2. **Sin cambios de funcionalidad**: 100% compatible con el código existente
3. **Prefijos preservados**: `-webkit-backdrop-filter` siempre antes de `backdrop-filter`
4. **Orden de carga**: El archivo orquestador maneja el orden correcto

## 🔍 Solución de Problemas

### Los estilos no se aplican
1. Verifica que `futuristic-theme.css` se carga correctamente
2. Asegúrate que `data-theme="futuristic"` está en el `<body>`

### Animaciones no funcionan
1. Verifica que `_animations.css` se carga antes de otros módulos
2. Revisa la consola del navegador por errores de carga

### Variables no reconocidas
1. `_variables.css` debe cargarse primero
2. Verifica que el navegador soporta CSS custom properties

## 📊 Comparación

| Métrica | Antes | Después |
|---------|-------|---------|
| Archivos | 1 | 11 |
| Líneas totales | 1,744 | ~1,600 |
| Mantenibilidad | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Modularidad | ⭐ | ⭐⭐⭐⭐⭐ |
| Reutilización | ⭐⭐ | ⭐⭐⭐⭐ |
