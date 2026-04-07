# Layer Structure Reference

Detailed folder structures, code examples, and naming conventions for each
FSD layer. Use this reference when creating, reviewing, or reorganizing
project structure.

---

## App Layer

App-wide initialization: providers, routing, global styles, entry point.
Organized by segments only — no slices.

```text
app/
  providers/       ← Redux, React Query, Theme providers
  styles/          ← Global CSS, reset, theme variables
  router.tsx       ← Route configuration
  index.tsx        ← Entry point
```

```typescript
// app/router.tsx
import { HomePage } from '@/views/home';
import { ProfilePage } from '@/views/profile';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/profile/:id', element: <ProfilePage /> },
]);
```

**Belongs in app:** Global providers (Redux store, QueryClient, theme),
routing setup, global styles, error boundaries, analytics initialization.

**Does not belong:** Feature-specific code, business logic, page-level UI.

---

## Views Layer

Route-level composition. In v2.1, views **own substantial logic** — they are
not thin wrappers. In early project stages, most code lives here.
(**Note:** This project uses `views/` as a custom name for the standard FSD `pages/` layer.)

```text
views/
  home/
    ui/
      HomePage.tsx
      HeroSection.tsx
      FeaturesGrid.tsx
    model/
      home-data.ts          ← View-specific state + logic
    api/
      fetch-home-data.ts    ← View-specific API calls
    index.ts
  profile/
    ui/
      ProfilePage.tsx
      ProfileForm.tsx
      ProfileStats.tsx
    model/
      profile.ts            ← Profile state + validation logic
    api/
      update-profile.ts
      fetch-profile.ts
    index.ts
```

**Belongs in views:** View-specific UI, forms, validation, data fetching,
state management, business logic, API integrations. Even code that looks
reusable stays here if it is simpler to keep local.

**Does not belong:** Code that is genuinely reused in 2+ views (extract only
when the team agrees).

### View Layout Patterns

A typical view composes features and entities from lower layers,
plus its own local UI components. (No `widgets/` in this project — composite
UI blocks that would normally go in widgets stay in `views/` or `features/`.)

```typescript
// views/product-detail/ui/ProductDetailView.tsx
import { AddToCart } from '@/features/add-to-cart';
import { Product } from '@/entities/product';

export const ProductDetailView = ({ productId }) => {
  const product = useProductDetail(productId); // local hook in this view

  return (
    <>
      <Product.Card data={product} />
      <AddToCart productId={productId} />
      <RelatedProducts products={product.related} /> {/* local component */}
    </>
  );
};
```

For views that only need shared + view-local code (no extracted layers):

```typescript
// views/about/ui/AboutView.tsx
import { Card } from '@/shared/ui/Card';
import { TeamSection } from './TeamSection';  // local to this view
import { MissionStatement } from './MissionStatement';

export const AboutView = () => (
  <main>
    <MissionStatement />
    <Card><TeamSection /></Card>
  </main>
);
```

---

## Features Layer

Independent, reusable user interactions. **Create only when used in 2+ places.**

```text
features/
  auth/
    ui/
      LoginForm.tsx
      RegisterForm.tsx
    model/
      auth.ts               ← Auth state + logic
    api/
      login.ts
      register.ts
    index.ts
  add-to-cart/
    ui/
      AddToCartButton.tsx
    model/
      cart.ts
    index.ts
  like-post/
    ui/
      LikeButton.tsx
    model/
      like.ts
    api/
      toggle-like.ts
    index.ts
```

**Feature composition** — features consume entities and are composed in
higher layers (views in this project, since widgets are not used):

```typescript
// views/post-list/ui/PostCard.tsx
import { UserAvatar } from '@/entities/user';
import { LikeButton } from '@/features/like-post';
import { CommentButton } from '@/features/comment-create';

export const PostCard = ({ post }) => (
  <article>
    <UserAvatar userId={post.authorId} />
    <h2>{post.title}</h2>
    <p>{post.content}</p>
    <div>
      <LikeButton postId={post.id} />
      <CommentButton postId={post.id} />
    </div>
  </article>
);
```

---

## Entities Layer

Reusable business domain models. **Create only when used in 2+ places. Starting
without this layer is completely valid.**

```text
// Minimal entity — model only (most common form)
entities/user/
  model/
    user.ts                  ← Types + domain logic
  index.ts

// Entity with UI (use with caution)
// ⚠️ Adding UI to entities increases cross-import risk.
// Other entities may want to import this UI, leading to @x dependencies.
// Entity UI should only be imported from higher layers (features, views)
// — never from other entities.
entities/product/
  model/
    product.ts
  ui/
    ProductCard.tsx
  index.ts
```

---

## Shared Layer Structure

Infrastructure with no business logic. Organized by segments only (no slices).
Segments may import from each other.

```text
shared/
  ui/                ← UI kit: Button, Input, Modal, Card
  lib/               ← Utilities: formatDate, debounce, classnames
  api/               ← API client, route constants, CRUD helpers, base types
  auth/              ← Auth tokens, login utilities, session management
  config/            ← Environment variables, app settings
  assets/            ← Images, fonts, icons (company branding allowed)
```

```typescript
// shared/ui/Button/Button.tsx
export const Button = ({ children, onClick, variant = 'primary' }) => (
  <button className={`btn btn-${variant}`} onClick={onClick}>
    {children}
  </button>
);

// shared/ui/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

Shared **may** contain application-aware code (route constants, API endpoints,
branding assets, common types). It must **never** contain business logic,
feature-specific code, or entity-specific code.

---

## Segment Naming Conventions

### Domain-based naming

Always name files after the business domain, not the technical role:

```text
// ❌ Technical-role naming — mixes domains
model/types.ts          ← Which types? User? Order?
model/utils.ts
api/endpoints.ts
model/selectors.ts

// ✅ Domain-based naming — each file owns one domain
model/user.ts           ← User types + logic + store
model/order.ts          ← Order types + logic + store
api/fetch-profile.ts    ← Clear what this API does
model/todo.ts           ← Redux slice + selectors + thunks
```

### Single-concern segments

If a segment contains only one domain concern, the filename may match the
slice name:

```text
features/auth/
  model/
    auth.ts          ← Single concern, matches slice name
```

### Index files as public API

Every slice must have an `index.ts` that re-exports its public interface:

```typescript
// entities/user/index.ts
export { UserAvatar } from "./ui/UserAvatar";
export { useUser, type User } from "./model/user";
```

---

## Path Aliases

Configure path aliases so imports follow the `@/layer/slice` pattern:

```json
// tsconfig.json — this project uses a single wildcard alias
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// Usage: @/views/..., @/features/..., @/entities/..., @/shared/..., @/app/...
// Note: @/widgets/* does not exist in this project
```

For framework-specific alias configuration (Vite, Next.js, Nuxt), see
`references/framework-integration.md`.
