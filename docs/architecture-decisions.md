# Architecture Decision Record (ADR)
## Project: AGF Drawer — Industrial Inventory Platform Foundation

- **Status:** Approved
- **Date:** 2026-10-17
- **Author:** Lead Backend Architect
- **Target Release:** v1.0.0-backend

---

### 1. Context & Objectives

AGF Drawer is transitioning from an early single-file SQLite proof-of-concept into a robust, production-grade inventory and asset management platform engineered by AGF Studios. The primary initial domain is technical cable and connector management, with immediate requirements to support electronics, microcontrollers, networking gear, adapters, tools, and general workshop inventory.

The platform must support self-hosted deployments (homelabs, workshops, studios) with minimal operational overhead, while laying an uncompromising foundation for multi-tenant SaaS expansion.

---

### 2. Architectural Decisions

#### ADR-001: Modular Monolith Framework — Fastify & TypeScript Strict
- **Decision:** Use **Fastify** as the core HTTP framework running on Node.js LTS with TypeScript in `strict` mode.
- **Rationale:** Fastify provides industry-leading throughput, low overhead, native JSON schema validation, first-class plugin encapsulation, and seamless integration with OpenAPI 3.1 via `@fastify/swagger` and `@fastify/swagger-ui`. Compared to Express or NestJS, Fastify avoids bloated decorators, minimizes cold-start overhead, and provides native Pino structured logging.
- **Structure:**
  ```text
  src/
    config/          # Type-safe environment validation (Zod)
    database/        # Prisma client, transaction manager, cycle validators
    middleware/      # Authentication, CSRF, rate-limiting, error handling
    plugins/         # Fastify plugins (OpenAPI, cookie, CORS, helmet)
    modules/
      auth/          # Sessions, registration, password hashing, token lifecycle
      users/         # User accounts & preferences
      workspaces/    # Tenant management & settings
      permissions/   # RBAC & authorization engine
      members/       # Workspace memberships & role management
      invitations/   # Cryptographic invitation tokens & acceptance
      storage/       # Hierarchical storage locations & cycle prevention
      connectors/    # Standard connector catalog & workspace custom connectors
      inventory/     # Universal inventory items & category definitions
      cables/        # Cable domain specialization & symmetrical matching
      units/         # Physical inventory units & status lifecycle
      assignments/   # Cable/item in-use assignments & returns
      movements/     # Append-only movement history & transactional audit
      search/        # Multi-attribute search & symmetrical connector query
      stats/         # Workspace analytics & inventory availability counters
    types/           # Shared domain types & API error contracts
  ```

---

#### ADR-002: Multi-Tenancy & Resource-Level Workspace Isolation
- **Decision:** Shared-database, discriminator-column multi-tenancy enforced at the repository and service layer. Every inventory item, physical unit, storage location, connector definition, assignment, and movement record strictly belongs to exactly one `workspace_id`.
- **Enforcement:**
  1. Requests provide workspace context via the `X-Workspace-Id` header or route parameter.
  2. The authorization middleware verifies user membership and RBAC permissions for that specific workspace before handing execution to the controller.
  3. Every database query explicitly filters by `workspaceId`. No direct object reference (IDOR) can resolve without matching `workspaceId`.
  4. Cross-workspace relationships (e.g. setting a parent storage location from another workspace) are rejected at the database query and transaction level.

---

#### ADR-003: Database Engine & ORM — PostgreSQL 17 + Prisma
- **Decision:** Use **PostgreSQL 17+** as the canonical production database with **Prisma ORM** for type-safe queries and version-controlled migrations.
- **Rationale:** PostgreSQL offers enterprise data integrity, ACID compliance, recursive CTEs (essential for hierarchical storage traversal and cycle checks), GIN indexes on JSONB/tags, and transactional concurrency locking. SQLite is retired from production to eliminate file-locking contention and lack of native multi-user security.
- **Data Model Paradigm:** Hybrid normalized relational core + validated JSONB.
  - Searchable, indexed fields (connectors, gender, lengths, status, categories, locations, tags) use normalized relational columns and lookup tables.
  - Category-specific supplementary attributes (e.g. wire gauge, shielding type, chipset) reside in validated `metadata` JSONB fields governed by domain schemas.

---

#### ADR-004: Cable Domain & Symmetrical Connector Matching
- **Decision:** Cables are modeled with independent connector endpoints linked to the connector catalog.
- **Endpoint Design:**
  - Standard cables have at least two endpoints (Position 'A' and Position 'B').
  - The schema accommodates breakout / multi-ended cables via indexed endpoint relational records (`cable_endpoints`).
- **Symmetrical Search Strategy:**
  - A query for `USB-C` and `USB-A` must find cables whether Endpoint A is USB-C and Endpoint B is USB-A, or vice versa.
  - Implemented using SQL symmetrical disjunction:
    ```sql
    ((epA.connector = :c1 AND epB.connector = :c2) OR (epA.connector = :c2 AND epB.connector = :c1))
    ```
  - Physical connector shape is separated from protocol/capability (e.g., connector `USB-C` vs protocol `Thunderbolt 4` or `USB-PD 100W`).

---

#### ADR-005: Physical Inventory Units vs Catalog Products
- **Decision:** Separate the catalog definition (`inventory_items` / `cables`) from individual physical instances (`inventory_units`).
- **Unit Lifecycle:**
  - Status enum: `STORED`, `IN_USE`, `LOANED`, `MISSING`, `RETIRED`.
  - Invariants:
    - `STORED`: requires valid `storage_location_id`.
    - `IN_USE`: assigned to a usage location/device; counts towards total owned inventory, but explicitly excluded from available storage count.
    - `LOANED`: assigned to a borrower/destination.
    - `MISSING`: marked for review/replacement.
    - `RETIRED`: decommissioned or disposed.
  - **Concurrency & Availability:** Units utilize version-based optimistic locking (`version INT`) to prevent double-assignments. Aggregations (total, stored, in_use, loaned, missing) are calculated dynamically or via transactional projections, eliminating divergent mutable counters.

---

#### ADR-006: Hierarchical Storage & Cycle Prevention
- **Decision:** Hierarchical locations (`Room` -> `Cabinet` -> `Drawer` -> `Shelf` -> `Box` -> `Rack` -> `Compartment` -> `Other`) supported to arbitrary depth.
- **Safeguards:**
  - Before updating a location's `parent_id`, a recursive CTE verifies that the new parent is not the node itself or any of its descendants.
  - Both parent and child must belong to the exact same `workspace_id`.
  - Deletion protection: Locations containing units or child locations cannot be deleted until emptied or reparented.

---

#### ADR-007: Security & Authentication Architecture
- **Decision:** Database-backed server-side sessions with cryptographic cookie tokens.
  - Password hashing: **Argon2id** (`m=65536, t=3, p=4`).
  - Session tokens: 256-bit cryptographically secure pseudorandom values (Base64URL), stored hashed (SHA-256) in the database.
  - Cookies: `HttpOnly`, `SameSite=Lax` (or `Strict`), `Secure` in production.
  - CSRF Protection: Synchronizer / Double-Submit header token pattern for non-GET/HEAD cookie-authenticated requests.
  - Rate limiting: Fastify rate-limiter applied to `/auth/login`, `/auth/register`, and `/auth/password-reset`.
  - Sensitive data redaction: Passwords and tokens excluded from Prisma selectors and Pino logs.

---

#### ADR-008: Transactional Movement & Audit Logging
- **Decision:** All state transitions generate an immutable, append-only record in `inventory_movements` within the exact same database transaction as the mutation.
- **Payload:** Records workspace, actor, unit/item, action enum (`ITEM_CREATED`, `UNIT_MOVED`, `UNIT_ASSIGNED`, `UNIT_RETURNED`, etc.), previous state snapshot, new state snapshot, and optional reason.

---

#### ADR-009: Compatibility Strategy
- **Decision:**
  - Primary API: `/api/v1/*` conforming to OpenAPI 3.1 specification.
  - Legacy MVP Compatibility: Provide an adapter layer for legacy `/api/locations`, `/api/cables`, and `/api/units` so the existing lightweight vanilla frontend in `public/` continues to function out of the box against a default workspace.
  - Future Figma Frontend: Fully supported via the `/api/v1` REST endpoints, OpenAPI client generation, and structured session auth.
