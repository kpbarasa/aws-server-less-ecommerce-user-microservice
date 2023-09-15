start_db:
    docker compose up -d

stop_db:
    docker compose 

server:
    npm run dev
migrate:
   db-migrate up

migrate_down:
   db-migrate down

create-migration:
   db-migrate create $(n) --sql

.PHONEY: start_db stop_db server migrate migrate_down create-migration