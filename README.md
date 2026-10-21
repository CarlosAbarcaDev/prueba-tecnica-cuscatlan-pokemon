# Pokémon Trainer — Prueba técnica Front End

Aplicación Angular que consume [PokeAPI](https://pokeapi.co/) para que el usuario configure un
perfil de entrenador y arme un equipo de 3 Pokémon de la primera generación, siguiendo el diseño
de Figma "Pokemon-Trainer".

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

## Lint

```bash
npm run lint
```

## Arquitectura (resumen)

- Angular standalone (sin NgModules) + Signals para el estado reactivo.
- `TrainerStoreService`: única fuente de verdad del perfil y equipo, persistida en `localStorage`.
- `PokeApiService`: capa de acceso a PokeAPI con cache en memoria (patrón repository).
- Validación condicional DUI / carnet de minoridad resuelta con el patrón **Strategy**.
- SCSS con tokens de diseño centralizados en `src/styles/_tokens.scss`.
- Virtual scroll (Angular CDK) en el grid de selección de Pokémon y en la lista de "Mis Pokémon".
