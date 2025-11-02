# AGENTS.md - Codebase Guidelines

## Commands
- **Dev**: `npm run dev` (uses turbopack)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Production**: `npm run start`

## Architecture
- Next.js 15 App Router with React 19, TypeScript strict mode
- Structure: `src/app/` (routes: admin, employee, login, patient), `src/components/` (ui, cards, graphic, sidebar), `src/lib/`, `src/hooks/`, `src/stores/` (Zustand), `src/types/`, `src/blocks/`
- UI: shadcn/ui (new-york style) + Radix UI + Tailwind CSS v4 + Lucide icons
- State: Zustand for global state management
- Forms: react-hook-form + Zod validation
- Auth: JWT (jose, jsonwebtoken)

## Code Style
- **Imports**: Use `@/` alias (e.g., `@/components/ui/button`), Next.js imports first, then third-party, then local
- **Components**: "use client" directive when needed, default exports for pages/routes
- **TypeScript**: Strict mode enabled, use explicit types, avoid `any`
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Styling**: Tailwind utility classes, responsive with `md:` prefix, colors with hex values
- **Error Handling**: try-catch blocks, user-facing alerts for errors
