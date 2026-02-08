# Frontend Requirements — Patient Registration UI

## Tech Stack

| Layer              | Technology                        | Rationale                                                                 |
|--------------------|-----------------------------------|---------------------------------------------------------------------------|
| Framework          | React 18 + TypeScript             | Challenge requirement; strict TS for type safety                         |
| Build Tool         | Vite                              | Fast DX; outputs static assets the Express server serves at `/`          |
| Data Fetching      | TanStack Query (React Query) v5   | Cache invalidation on mutation, loading/error states for free            |
| Validation         | Zod + custom hooks                | Same schemas as backend; unified validation language across the stack    |
| Styling            | CSS Modules                       | Zero runtime, scoped by default, no library — proves you can write CSS   |
| Linting            | ESLint + Prettier                 | Industry standard; `.eslintrc` + `.prettierrc` in repo                   |
| HTTP Client        | `fetch` (wrapped in a thin client)| No Axios needed for this scope; keeps deps minimal                       |

**No UI libraries.** No shadcn, no MUI, no Radix. Every component is hand-built.

---

## Serving Strategy

The frontend is a Vite-built SPA served by the Express backend. No separate frontend server in production.

### Build & Serve Flow

```
frontend/        →  npm run build  →  backend/public/
  src/                                   index.html
  index.html                             assets/
```

### Express Configuration

```typescript
// In the Express app, after API routes:
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
```

### Docker Integration

The `api` service Dockerfile uses a **multi-stage build**:

```dockerfile
# Stage 1: Build frontend
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Stage 2: Build + run backend
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
COPY --from=frontend /app/frontend/dist ./public
RUN npm run build
CMD ["node", "dist/index.js"]
```

Single container. Single port. `http://localhost:3001` serves everything.

---

## Architecture Overview

```
src/
├── api/
│   └── client.ts                  # Thin fetch wrapper (base URL, error handling)
├── modules/
│   └── patients/
│       ├── api.ts                 # Query/mutation functions
│       ├── schemas.ts             # Zod validation (shared shapes with backend)
│       ├── types.ts               # Patient TypeScript interfaces
│       ├── hooks/
│       │   ├── usePatients.ts     # useQuery wrapper
│       │   └── useCreatePatient.ts# useMutation + cache invalidation
│       ├── components/
│       │   ├── PatientList/
│       │   │   ├── PatientList.tsx
│       │   │   ├── PatientList.module.css
│       │   │   └── index.ts
│       │   ├── PatientCard/
│       │   │   ├── PatientCard.tsx
│       │   │   ├── PatientCard.module.css
│       │   │   └── index.ts
│       │   ├── PatientForm/
│       │   │   ├── PatientForm.tsx
│       │   │   ├── PatientForm.module.css
│       │   │   └── index.ts
│       │   └── RegistrationModal/
│       │       ├── RegistrationModal.tsx
│       │       ├── RegistrationModal.module.css
│       │       └── index.ts
│       └── PatientPage.tsx        # Page-level composition
├── components/
│   ├── Modal/
│   │   ├── Modal.tsx              # Reusable modal (portal-based)
│   │   ├── Modal.module.css
│   │   └── index.ts
│   ├── FileDropzone/
│   │   ├── FileDropzone.tsx       # Reusable drag-and-drop
│   │   ├── FileDropzone.module.css
│   │   └── index.ts
│   ├── FormField/
│   │   ├── FormField.tsx          # Input + label + animated error
│   │   ├── FormField.module.css
│   │   └── index.ts
│   ├── PhoneInput/
│   │   ├── PhoneInput.tsx         # Country code + number compound input
│   │   ├── PhoneInput.module.css
│   │   └── index.ts
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   └── index.ts
│   ├── Spinner/
│   │   ├── Spinner.tsx
│   │   ├── Spinner.module.css
│   │   └── index.ts
│   └── EmptyState/
│       ├── EmptyState.tsx
│       ├── EmptyState.module.css
│       └── index.ts
├── hooks/
│   └── useForm.ts                 # Generic form hook with Zod integration
├── styles/
│   ├── globals.css                # CSS reset, variables, typography
│   └── animations.css             # Shared keyframes (slide-in, fade, shake)
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

**Key principle:** Feature-sliced inside `modules/`, shared primitives in `components/`. A reviewer can read the tree and understand the entire app before opening a single file.

---

## Component Specifications

### `PatientPage`

The single page of the app. Composes everything.

```
┌─────────────────────────────────────────────┐
│  Patient Registration          [Add Patient] │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ Card     │ │ Card     │ │ Card     │     │
│  │ --------  │ │ --------  │ │ --------  │     │
│  │ Name     │ │ Name     │ │ Name     │     │
│  │ Photo    │ │ Photo    │ │ Photo    │     │
│  └──────────┘ └──────────┘ └──────────┘     │
│                                              │
│  ┌──────────┐ ┌──────────┐                   │
│  │ Card     │ │ Card     │                   │
│  │ --------  │ │ --------  │                   │
│  │ Name     │ │ Name     │                   │
│  └──────────┘ └──────────┘                   │
└─────────────────────────────────────────────┘
```

**States:**
- **Loading:** Grid of 3 skeleton cards (CSS-only pulse animation)
- **Empty:** Illustration + "No patients yet" + CTA button
- **Populated:** Responsive card grid

---

### `PatientCard`

Collapsed (default): Name + document photo thumbnail.
Expanded (on click): Slides open to reveal email, phone, registration date.

**Animation:** `max-height` + `opacity` transition for smooth expand/collapse. No JS-driven heights — CSS handles it.

**Interactions:**
- Click anywhere on the card to toggle
- Chevron icon rotates on expand
- Subtle box-shadow lift on hover

---

### `PatientForm`

Rendered inside the `RegistrationModal`. Fields appear in this order:

| #  | Field          | Component         | Validation                                    |
|----|----------------|-------------------|-----------------------------------------------|
| 1  | Full Name      | `FormField`       | Letters + spaces only. Required.              |
| 2  | Email          | `FormField`       | Valid email, must end in `@gmail.com`.        |
| 3  | Phone          | `PhoneInput`      | Code: `+` + 1-4 digits. Number: 6-15 digits. |
| 4  | Document Photo | `FileDropzone`    | `.jpg` only. Max 5MB. Drag-and-drop + click.  |

**Validation UX:**
- Errors shown **only on submit attempt** (not on blur, not on change)
- Once submitted and invalid, errors appear with a `slideDown` animation beneath each field
- After first failed submit, errors update in real-time as the user corrects fields (standard "validate on change after first submit" pattern)

---

### `FileDropzone`

Custom drag-and-drop component built on native HTML5 Drag and Drop API.

**States:**
- **Default:** Dashed border, upload icon, "Drag & drop your .jpg here or click to browse"
- **Drag over:** Border color change + subtle scale transform
- **File selected:** Shows filename + thumbnail preview + remove button
- **Error:** Red border + error message below

**Implementation notes:**
- Hidden `<input type="file" accept=".jpg,.jpeg" />` triggered on click
- `onDragOver`, `onDragLeave`, `onDrop` handlers on the dropzone container
- File type validated client-side before setting state
- Preview via `URL.createObjectURL()`

---

### `RegistrationModal`

Wraps the `PatientForm` and handles submission states. Uses the reusable `Modal` component.

**Flow:**

```
[Form visible]
     │ submit
     ▼
[Loading overlay on form — spinner + "Registering..."]
     │
     ├── success ──▶ [Success state: ✓ icon + "Patient registered" + Close button]
     │                  │ close
     │                  ▼
     │               Modal closes → query cache invalidated → list refreshes
     │
     └── error ────▶ [Error state: ✗ icon + error message + Try Again button]
                        │ try again
                        ▼
                     Back to form with data preserved
```

**Animations:**
- Modal itself: `fadeIn` backdrop + `scaleIn` content
- State transitions: `crossfade` between form / loading / success / error
- Close: reverse animation before unmount

---

### `Modal` (reusable)

- Rendered via `createPortal` to `#modal-root`
- Backdrop click closes (unless submission in progress)
- `Escape` key closes
- Focus trap inside modal
- Scroll lock on `<body>` when open
- Enter/exit animations via CSS class toggling + `onAnimationEnd`

---

### `FormField` (reusable)

Generic form field wrapper. Composes a label, an input, and an animated error message.

```tsx
<FormField
  label="Full Name"
  error={errors.fullName}
>
  <input
    type="text"
    value={values.fullName}
    onChange={handleChange('fullName')}
  />
</FormField>
```

**Error animation:** `slideDown` with `overflow: hidden` — error message has a fixed height it transitions to from `0`.

---

### `PhoneInput` (reusable)

Compound input: small `<input>` for country code (fixed width) + larger `<input>` for number. Visually joined with shared border.

```
┌───────┬──────────────────┐
│ +598  │ 99123456          │
└───────┴──────────────────┘
```

Single `FormField` wrapper with two internal inputs. Error displayed once below both.

---

## Data Layer

### API Client

```typescript
// src/api/client.ts
const API_BASE = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.errors ?? body.error ?? 'Request failed');
  }
  return res.json();
}
```

Relative URLs — no hardcoded `localhost`. Works in dev proxy and production because frontend and backend share the same origin.

### Patient API Functions

```typescript
// src/modules/patients/api.ts
export const fetchPatients = (): Promise<PatientsResponse> =>
  request('/patients');

export const createPatient = (data: FormData): Promise<PatientResponse> =>
  request('/patients', { method: 'POST', body: data });
```

### TanStack Query Hooks

```typescript
// usePatients.ts
export const usePatients = () =>
  useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
  });

// useCreatePatient.ts
export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};
```

This is the entire data layer. `invalidateQueries` on success handles the "auto-refresh list" requirement with zero manual refetching.

---

## Form Handling

### `useForm` Hook

Custom generic hook. No Formik, no React Hook Form — hand-rolled to show competency.

```typescript
function useForm<T extends Record<string, any>>({
  initialValues: T,
  schema: ZodSchema<T>,
  onSubmit: (values: T) => Promise<void>,
}) => {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: boolean;             // has the user attempted submit?
  handleChange: (field: keyof T) => (e: ChangeEvent) => void;
  handleSubmit: (e: FormEvent) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  reset: () => void;
}
```

**Validation strategy:**
1. Before first submit: no errors shown.
2. On submit: run full Zod parse. If invalid, set `touched = true`, display errors.
3. After first failed submit: revalidate on every change so errors clear instantly when fixed.

---

## Styling Approach

### Design Tokens (CSS Custom Properties)

```css
/* styles/globals.css */
:root {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-error: #dc2626;
  --color-success: #16a34a;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}
```

### Animation Keyframes

```css
/* styles/animations.css */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes slideDown {
  from { opacity: 0; max-height: 0; }
  to   { opacity: 1; max-height: 40px; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(-4px); }
  75%      { transform: translateX(4px); }
}
```

### CSS Modules Convention

- One `.module.css` per component
- BEM-ish class names inside: `.card`, `.cardExpanded`, `.cardHeader`, `.cardBody`
- Compose shared animations via `composes` or direct class application
- No nesting beyond 2 levels — keep specificity flat

---

## Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
      '/uploads': 'http://localhost:3001',
    },
  },
  build: {
    outDir: '../backend/public',
    emptyOutDir: true,
  },
});
```

In development: Vite dev server on `5173` proxies API calls to Express on `3001`.
In production: Vite builds to `backend/public/`, Express serves it. No proxy needed.

---

## Checklist Before Submission

- [ ] `Add Patient` button opens modal with animated entry
- [ ] Form validates only on submit; real-time after first failure
- [ ] Full name rejects non-letter characters
- [ ] Email rejects non-`@gmail.com` addresses
- [ ] Dropzone accepts `.jpg` via drag-and-drop AND click
- [ ] Dropzone shows preview thumbnail after file selection
- [ ] Phone input is two fields (code + number), visually joined
- [ ] Submission shows loading → success or error state in modal
- [ ] Success auto-refreshes the patient list (no manual reload)
- [ ] Patient cards expand/collapse with smooth animation
- [ ] Empty state displayed when no patients exist
- [ ] Loading state shows skeleton cards
- [ ] All animations are CSS-driven (no janky JS)
- [ ] No UI libraries used — everything hand-built
- [ ] ESLint + Prettier configured and passing
- [ ] TypeScript strict mode, no `any` types
