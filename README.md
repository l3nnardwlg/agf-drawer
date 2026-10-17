# AGF Drawer

Production-grade inventory and asset management platform engineered by **AGF Studios**.

Designed for workshops, studios, and homelabs to keep track of cables, connectors, electronic components, adapters, devices, and tools with strict tenant isolation, physical unit tracking, and usage assignment.

---

## Key Features

- **Universal Inventory Data Model:** Extensible categorization (Cables, Adapters, Electronics, Microcontrollers, Sensors, Networking, Devices, Tools, Spare Parts, General).
- **Specialized Cable Domain & Symmetrical Search:** Independent connector endpoint modeling. Symmetrical queries: searching for `USB-C` and `USB-A` matches cables in either direction (`USB-C -> USB-A` or `USB-A -> USB-C`).
- **Connector Catalog:** 40+ pre-seeded standard connectors (USB, Video, Networking, Audio, Power, Serial, Internal) with physical shape vs. capability distinction, aliases, and workspace-level custom definitions.
- **Physical Inventory Units:** Distinct tracking between product catalog definitions and physical serialized units (`STORED`, `IN_USE`, `LOANED`, `MISSING`, `RETIRED`).
- **Usage & Assignment Lifecycle:** Assign cables to racks, workstations, or servers. In-use items count toward total ownership while being unavailable in storage.
- **Storage Hierarchy & Cycle Protection:** Nested storage locations (`Room` → `Cabinet` → `Drawer` → `Shelf` → `Box` → `Rack` → `Compartment` → `Other`) with recursive CTE cycle detection and tenant safeguards.
- **Multi-Tenancy & RBAC:** Complete workspace isolation (`Owner`, `Admin`, `Editor`, `Viewer`) with granular resource permissions, cryptographic invitations, and ownership transfer.
- **Append-Only Movement History:** Transactional audit log recording all item creations, unit movements, assignments, returns, and status transitions.
- **Enterprise Security:** Argon2id password hashing, database-backed server sessions, Double-Submit CSRF protection, rate limiting, and structured logging with secret redaction.
- **OpenAPI 3.1 Documentation:** Interactive Swagger UI documentation available at `/docs`.
- **Backward Compatibility:** Includes an adapter layer for legacy `/api/locations`, `/api/cables`, and `/api/units` endpoints supporting the vanilla MVP frontend.

---

## Architecture & Technology Stack

- **Runtime:** Node.js 22 LTS
- **Language:** TypeScript (strict mode)
- **Framework:** Fastify
- **Database:** PostgreSQL 17+
- **ORM:** Prisma with version-controlled migrations
- **Validation:** Zod
- **Documentation:** OpenAPI 3.1 via `@fastify/swagger` and `@fastify/swagger-ui`
- **Testing:** Vitest (automated unit and integration suite)
- **Deployment:** Docker & Docker Compose (multi-stage production build)

Detailed architecture decisions and entity relationship diagrams are available in [`docs/architecture.md`](docs/architecture.md) and [`docs/architecture-decisions.md`](docs/architecture-decisions.md).

---

## Quick Start (Local Development)

### Prerequisites

- Node.js 22+
- Docker (for PostgreSQL 17)

### Setup & Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

3. **Start PostgreSQL 17:**
   ```bash
   docker compose up postgres -d
   ```

4. **Run migrations and seed connector catalog:**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) for the web UI or [http://localhost:3000/docs](http://localhost:3000/docs) for the interactive OpenAPI documentation.

---

## Testing

Run the automated test suite with Vitest:

```bash
npm test
```

Typecheck and lint:

```bash
npm run typecheck
npm run lint
```

Build production distribution:

```bash
npm run build
```

---

## Production Deployment (Docker Compose)

```bash
# Build and start services (PostgreSQL 17 + Fastify Backend)
docker compose up --build -d

# Check health status
docker compose ps
curl http://localhost:3000/health
```

### Database Backup & Restore

```bash
# Backup
docker exec -t agf-drawer-postgres pg_dump -U postgres agf_drawer > agf_drawer_backup.sql

# Restore
cat agf_drawer_backup.sql | docker exec -i agf-drawer-postgres psql -U postgres -d agf_drawer
```
