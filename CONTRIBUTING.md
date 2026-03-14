# Contributing to Playbook Corporation Platform

**This is a proprietary codebase. External contributions require prior written authorisation.**

## Before You Can Contribute

1. **Sign the NDA** — Contact legal@playbook-corp.com
2. **Sign the IP Assignment Agreement** — All work product belongs to Playbook Corporation Limited
3. **Receive a GitHub deploy key** — You will be granted access to specific repositories only
4. **Attend onboarding** — Security briefing required before first commit

## Development Standards

### TypeScript
- Strict mode required: `"strict": true` in all `tsconfig.json`
- No `any` types — use proper type definitions
- All functions must have explicit return types
- Async functions must handle errors with try/catch

### Naming Conventions
- Files: `kebab-case.ts`
- Classes: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Types/Interfaces: `PascalCase` with `I` prefix for interfaces

### VeriTech-10 Requirement
**Every function that initiates a process must use the Universal Process Recorder.**
No process runs without a V10 certification record. Use the `withV10Record()` wrapper.

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation only
- `refactor:` code change without feature/fix
- `security:` security fix
- `governance:` compliance/governance updates

### Pull Request Process
1. Create branch from `main` (never commit directly to `main`)
2. Branch naming: `feat/description`, `fix/description`, `docs/description`
3. All PRs require review by a designated maintainer
4. All TypeScript must compile without errors
5. All tests must pass
6. V10 process recording must be present for any new process functions

## Prohibited Actions
- Never commit secrets, API keys, or tokens to code
- Never disable TypeScript strict mode
- Never bypass the V10 process recorder
- Never push directly to `main`
- Never share your deploy key
