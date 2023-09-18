CREATE TABLE "users" (
    "user_id" varchar PRIMARY KEY,
    "phone" varchar NOT NULL,
    "email" varchar UNIQUE NULL,
    "password" varchar NOT NULL,
    "user_type" varchar NOT NULL,
    "first_name" varchar,
    "last_name" varchar,
    "middle_name" varchar,
    "profile_pic" text,
    "salt" varchar NOT NULL,
    "verification_code" varchar NULL,
    "expiry_date" varchar ,
    "verified" boolean  DEFAULT FALSE,
    "created_at" varchar  DEFAULT (now()),
    "updated_at" varchar  DEFAULT (now())
);

CREATE INDEX ON "users" ("phone");