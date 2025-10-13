# Dependencies to run

- postgres
- bun
- setup biome in ide / editor

## env

```env
DATABASE_URL = "postgresql://concord_user:concord_test@localhost:5432/concord_db"
```

# Running

## API

```bash
cd apps/api
bun run dev
```
## DB

```bash
cd packages/database
bun run db:generate
bun run db:migrate
bun run db:push
bun run db:seed
bun run db:studio # optional
```

## Linting and Fixing

```bash
bunx turbo format-and-lint # view linting and formatting suggestions, without writing
bunx turbo format-and-lint:fix # write fixes
```
## Alternatively

All commands for DB and API can be run from repo root with:
```bash
bunx turbo <script> # db:generate, etc...
```
