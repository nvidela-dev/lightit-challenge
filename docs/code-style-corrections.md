# Code Style Corrections

Lessons learned from code review feedback during development.

## Simplify Conditional Checks

Don't store values in variables just to check if they're truthy.

```typescript
// Bad
const validationError = validateFile(file);
if (validationError) { ... }

// Good
if (validateFile(file)) { ... }
```

## Flatten Component Structure

Don't use `Component/index.ts` barrel pattern unless you have co-located files (tests, styles). Just use `Component.tsx` directly.

```
// Bad
components/
  Button/
    Button.tsx
    index.ts

// Good
components/
  Button.tsx
```

## Consolidate Related Hooks

Don't split small, related hooks into separate files. Keep them together if they're for the same domain.

```typescript
// Bad
hooks/usePatients.ts
hooks/useCreatePatient.ts

// Good - both in usePatients.ts
export const usePatients = () => ...
export const useCreatePatient = () => ...
```

## Remove Dead Code Aggressively

Don't export or keep functions/components that aren't used. Delete them entirely.

- Unused components (e.g., `Spinner.tsx` that was never imported)
- Unused hook returns (e.g., `reset`, `isSubmitting` if not consumed)
- Unused function parameters

## No Comments in Code

Code should be self-documenting. Avoid comments unless absolutely necessary for complex logic.

## Clean Up Unused Assets

Don't keep files (images, etc.) that aren't referenced anywhere in the codebase.
