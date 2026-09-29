# OrbitOS — Testing Strategy

## Philosophy
Automation is mandatory. If it's not tested, it's not finished.

## Testing Layers

### 1. Unit Testing (Vitest)
- Scope: Shared business logic, database helpers, validation schemas, calculation rules.
- Location: Integrated with source files (e.g., `features/invoices/calculations.test.ts`).

### 2. Integration Testing
- Scope: Server actions, database interactions, API endpoints.
- Location: `tests/integration/`.

### 3. End-to-End Testing (Playwright)
- Scope: Critical user workflows (Golden Test §52). Verified in both light/dark mode.
- Location: `tests/e2e/`.

## Golden Test Suite (The "Must-Pass" Workflow)
Must run automatically on PRs:
1. Create business
2. Create customer
3. Create product
4. Purchase stock -> verify inventory
5. Create sales order -> issue invoice -> verify ledger
6. Record payment -> verify invoice balance
7. Verify dashboard/reports update
8. Verify audit log entry

## Visual QA
- Automated checks for design-token variance.

---

## Running Tests
```bash
npm run test:unit
npm run test:integration
npm run test:e2e
```
