# Run the stack

Prerequisites:
- Docker Desktop running and signed in (for image pulls)
- Ports free: 3000, 8081, 5433, 8000

First-time start (creates and builds services):

```bash
cd /Users/apple/Documents/GitHub/ProjetS5Cloud
docker compose up -d --build
```

Check status:

```bash
docker compose ps
```

Seed database (optional):

```bash
docker exec -i postgres_postgis psql -U admin -d projet-cloud-db < backend/sql/base.sql
```

Stop and remove:

```bash
docker compose down
```

Note: Use `docker compose start` only after containers exist (i.e. after `up`). If you run `start` before `up`, Compose will report `could not find backend`.

