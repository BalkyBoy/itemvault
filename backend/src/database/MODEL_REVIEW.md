# Objection.js Model Review Report

**Scope:** `src/models/` (excluding abstract `BaseModel`)  
**Date:** Generated from codebase analysis  
**Database:** PostgreSQL via Knex + Objection.js

---

## Models Found

| File | Class | `tableName` | Status |
|------|-------|-------------|--------|
| `Base.Model.ts` | `BaseModel` | _(abstract)_ | Base only — not a table |
| `User.model.ts` | `User` | `users` | ✓ Active |
| `items.model.ts` | `Items` | `items` | ✓ Active |
| `Categories.model.ts` | `Category` | `Category` | ✓ Defined, unused in repos/services |

**Not present (examples from requirements):** `Role`, `Permission`, `Session`, `RefreshToken`, `Profile` — no model files exist; **do not migrate**.

---

## BaseModel (inherited by all tables)

| Property | Type (TS) | DB column | Notes |
|----------|-----------|-----------|--------|
| `id` | `string` | `uuid` PK | No `jsonSchema`; UUID assumed from usage |
| `created_at` | `Date` | `timestamptz` | Set in `$beforeInsert` hook |
| `updated_at` | `Date` | `timestamptz` | Set in `$beforeInsert` / `$beforeUpdate` |

- **Soft delete:** None — no `deleted_at` on any model → **omit from migration**
- **Timestamps:** Application-managed; DB defaults recommended for consistency on raw SQL inserts

---

## 1. User (`users`)

### Table name
✓ `users`

### Fields

| Field | TS type | Required | Nullable | DB type | Constraints |
|-------|---------|----------|----------|---------|-------------|
| `id` | `string` | ✓ | No | `uuid` | PK |
| `email` | `string` | ✓ | No | `varchar(255)` | UNIQUE, NOT NULL |
| `password_hash` | `string?` | — | Yes (TS) | `varchar(255)` | NOT NULL in practice (login/register) |
| `first_name` | `string?` | — | Yes | `varchar(100)` | Register DTO requires |
| `last_name` | `string?` | — | Yes | `varchar(100)` | Register DTO requires |
| `email_verified` | `boolean` | ✓ | No | `boolean` | Default `false` |
| `reset_token` | `string?` | — | Yes | `varchar(255)` | Password reset flow |
| `reset_token_expires_at` | `Date?` | — | Yes | `timestamptz` | Password reset flow |
| `created_at` | `Date` | ✓ | No | `timestamptz` | Audit |
| `updated_at` | `Date` | ✓ | No | `timestamptz` | Audit |

### Relations (model definition)

```txt
user → BelongsToOneRelation → Items
  from: users.id
  to:   items.createdBy   ❌ WRONG — column does not exist on Items
```

**Actual Items FK:** `items.user_id` → `users.id`  
**Correct User-side relation:** `HasManyRelation` to `items` via `users.id` = `items.user_id`

### Indexes (recommended)
- ✓ `email` (UNIQUE)
- ✓ `created_at`
- Optional: `reset_token` (lookup during reset)

### Enums
None on model.

### DTO vs model gaps (not migrated)
- `registerSchema`: `phone`, `gender` — **not on User model**

---

## 2. Items (`items`)

### Table name
✓ `items`

### Fields

| Field | TS type | Required | Nullable | DB type | Constraints |
|-------|---------|----------|----------|---------|-------------|
| `id` | `string` | ✓ | No | `uuid` | PK |
| `user_id` | `string` | ✓ | No | `uuid` | FK → `users.id` |
| `name` | `string` | ✓ | No | `varchar(255)` | DTO max 255 |
| `description` | `string` | ✓ | No | `text` | DTO required |
| `category` | `string` | ✓ | No | `varchar(50)` | Free text; default `'Other'` (DTO) |
| `status` | `ProductStatus` | ✓ | No | `enum` | `draft`, `active`, `archived` |
| `created_at` | `Date` | ✓ | No | `timestamptz` | Audit |
| `updated_at` | `Date` | ✓ | No | `timestamptz` | Audit |

### Enum: `ProductStatus` (`src/shared/enums/generic.enum.ts`)

| Value |
|-------|
| `draft` |
| `active` |
| `archived` |

### Relations

```txt
user → BelongsToOneRelation → User
  from: items.user_id
  to:   user.id   ❌ WRONG — table is `users`, should be users.id
```

### Indexes (recommended)
- ✓ `user_id` (FK + filter by owner)
- ✓ `status`
- ✓ `category`
- ✓ `created_at`
- ✓ `name` (search uses `ilike` on name/description)

### Category model
Items store `category` as **string**, not FK to `Category` table — **no FK to Category**.

---

## 3. Category (`Category`)

### Table name
✓ `Category` (PascalCase in model — PostgreSQL will store as lowercase `category` unless quoted)

### Fields

| Field | TS type | Required | Nullable | DB type |
|-------|---------|----------|----------|---------|
| `id` | `string` | ✓ | No | `uuid` PK |
| `name` | `string` | ✓ | No | `varchar(255)` (no max in model; 255 assumed) |
| `created_at` | `Date` | ✓ | No | `timestamptz` |
| `updated_at` | `Date` | ✓ | No | `timestamptz` |

### Relations
None defined.

### Usage
- `categories.repo.ts` is empty
- Not referenced by Items — **orphan lookup table**

---

## Dependency order (migrations)

```txt
1. users        (no dependencies)
2. Category     (no dependencies)
3. items        (depends on users)
```

No circular dependencies.

---

## Issues summary

| Severity | Issue |
|----------|--------|
| **High** | `User` relation maps to `items.createdBy` — column does not exist |
| **High** | `Items` relation `to: 'user.id'` — should be `users.id` |
| **Medium** | `Category` table name PascalCase vs PostgreSQL lowercase convention |
| **Medium** | `Category` model unused; `items.category` is denormalized string |
| **Low** | `password_hash` optional in TS but required for auth |
| **Low** | `email_verified` required in model but not set on register |
| **Low** | Auth DTO fields `phone`, `gender` not on User model |
| **Info** | JWT refresh tokens stored client-side only — no `refresh_tokens` table |

---

## Suggested schema improvements (optional, post-migration)

1. Fix `User` / `Items` `relationMappings` join columns.
2. Rename `Category.tableName` to `categories` and add unique index on `name` if used as lookup table.
3. Either link `items.category_id` → `categories.id` or remove unused `Category` model.
4. Add `email_verified: false` in `AuthService.register`.
5. Align `User.password_hash` as required in TypeScript.

---

## Migration deliverable

- **File:** `src/database/migrations/202508120001_initial_schema.ts`
- **Tables:** `users`, `Category`, `items`
- **Enum:** `product_status` (`draft`, `active`, `archived`)
- **Soft delete:** Not included (not in models)
