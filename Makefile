start_db:
    docker compose up -d

stop_db:
    docker compose down

server:
    npm run dev

migrate_new:
    db-migrate create initialize --sql-file
    
migrate:
   db-migrate up

migrate_down:
   db-migrate down

create-migration:
   db-migrate create $(n) --sql

.PHONEY: start_db stop_db server migrate migrate_down create-migration