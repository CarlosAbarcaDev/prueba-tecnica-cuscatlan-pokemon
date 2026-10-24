# Pokémon Trainer — Prueba técnica Front End (Banco Cuscatlán)

Aplicación Angular que consume [PokeAPI](https://pokeapi.co/) para que el usuario configure un
perfil de entrenador y arme un equipo de 3 Pokémon de la primera generación, siguiendo el diseño
de Figma "Pokemon-Trainer".

**Demo:** <!-- DEPLOY_URL -->

## Flujo de la aplicación

1. **Configurar perfil** — foto, nombre, pasatiempo favorito (autocomplete), fecha de nacimiento
   y documento de identidad. El tipo de documento (DUI si es mayor de edad, Carnet de Minoridad si
   es menor) y sus reglas de validación se resuelven automáticamente según la edad calculada.
2. **Seleccionar equipo** — grid de los 151 Pokémon de la primera generación, con buscador por
   nombre o número y selección de exactamente 3.
3. **Home** — perfil del entrenador y equipo elegido, con opciones para editar cualquiera de los
   dos, buscar dentro del equipo y cerrar sesión.

## Requisitos

- Node.js `>=24.0.0`
- npm `>=11`

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm start
```

Abre `http://localhost:4200/`.

## Build de producción

```bash
npm run build
```

## Tests

```bash
npm test
```

61 specs (Vitest) cubriendo servicios, guards, validators, strategies, directivas y los
componentes con lógica propia.

## Lint

```bash
npm run lint
```

## Arquitectura

- **Angular standalone** (sin NgModules) + **Signals** para todo el estado reactivo, con
  `ChangeDetectionStrategy.OnPush` en cada componente.
- **Atomic Design** en `src/app/shared/`: `atoms/` (botones, ícono, card shell), `molecules/`
  (input flotante, selector de pasatiempo, date picker, photo upload, pokemon card, etc.),
  `organisms/` (header, trainer card) y `templates/` (layout de dos columnas reutilizado por los
  pasos de onboarding). Las páginas en `src/app/features/` componen esas piezas.
- **`TrainerStoreService`** — única fuente de verdad del perfil y equipo (signals), persistida en
  `localStorage` con validación de forma al leer, para no confiar ciegamente en un valor corrupto
  o de un esquema viejo.
- **`PokeApiService`** — capa de acceso a PokeAPI (patrón repository) con cache en memoria tanto
  para el listado de la 1ª generación como para el detalle de cada Pokémon; un interceptor HTTP
  funcional reintenta automáticamente los fallos de red/servidor antes de propagar el error.
- **Patrón Strategy** (`core/strategies/document-validation.strategy.ts`) para resolver en vivo si
  el documento requerido es DUI (mayor de edad, con validación de formato y dígito verificador
  real) o Carnet de Minoridad (menor de edad, opcional).
- **Guards funcionales** (`profileRequiredGuard`, `onboardingCompleteGuard`) que protegen las
  rutas según el estado del perfil/equipo guardado.
- **Responsive de 3 niveles** (desktop / tablet / mobile) vía tokens SCSS; el único breakpoint que
  también necesita TypeScript (para re-chunkear el grid de selección) se expone como variable CSS
  derivada del token SCSS, en vez de duplicar el valor en dos lenguajes.
- **Swiper** como carrusel para la lista "Mis Pokémon" en Home; **Angular CDK virtual scroll**
  para el grid de 151 Pokémon de la selección, con fetch del detalle de cada tarjeta solo cuando
  entra en vista.
- **SweetAlert2** para los mensajes de error (formato de imagen inválido, fallo de red).
- Tokens de diseño centralizados en `src/styles/_tokens.scss` (colores, tipografía, spacing,
  radios, sombras, breakpoints).

## Decisiones y trade-offs

- El date picker de "Fecha de nacimiento" es un componente propio (grid de días + atajo de año)
  en vez del `<input type="date">` nativo, porque su popup no se puede re-estilar para igualar el
  diseño; no permite elegir una fecha futura, para que la edad calculada nunca sea negativa.
- El bonus de Swiper se aplicó donde tenía sentido como UX (un carrusel de 3 tarjetas fijas en
  Home) y se dejó fuera del grid de 151 Pokémon, donde el virtual scroll ya resuelve mejor el
  rendimiento y la navegación por scroll continuo es más natural que paginar por swipe.
- La imagen de perfil se guarda como base64 en `localStorage`; no hay backend propio, solo
  consumo de PokeAPI pública.

## Estructura

```
src/app/
  core/        # modelos, servicios, guards, interceptors, strategies, validators, utils
  shared/      # atoms / molecules / organisms / templates (Atomic Design)
  features/    # onboarding (wizard) y home
src/tests/     # specs, misma estructura que src/app
src/styles/    # tokens SCSS y estilos globales
```
