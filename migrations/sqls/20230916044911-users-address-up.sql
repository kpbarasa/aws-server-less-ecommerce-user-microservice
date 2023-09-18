CREATE TABLE "address"(
    "id" bigserial  PRIMARY KEY,
    "user_id" varchar UNIQUE NULL,
    "address_line1" text,
    "address_line2" text,
    "city" varchar,
    "state" varchar,
    "post_code" integer,
    "country" varchar,
    "created_at" varchar NOT NULL DEFAULT (now())
);

CREATE INDEX ON "address" ("city");
CREATE INDEX ON "address" ("post_code");
CREATE INDEX ON "address" ("country");


-- Add relation 
ALTER TABLE "address" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");



CREATE TABLE "shipping_address"(
    "id" bigserial  PRIMARY KEY,
    "user_id" varchar UNIQUE NULL,
    "address_line1" text,
    "address_line2" text,
    "city" varchar,
    "state" varchar,
    "post_code" integer,
    "country" varchar,
    "created_at" varchar NOT NULL DEFAULT (now())
);

CREATE INDEX ON "shipping_address" ("city");
CREATE INDEX ON "shipping_address" ("post_code");
CREATE INDEX ON "shipping_address" ("country");

-- Add relation 
ALTER TABLE "shipping_address" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

CREATE TABLE "billing_address"(
    "id" bigserial  PRIMARY KEY,
    "user_id" varchar UNIQUE NULL,
    "address_line1" text,
    "address_line2" text,
    "city" varchar,
    "state" varchar,
    "post_code" integer,
    "country" varchar,
    "created_at" varchar NOT NULL DEFAULT (now())
);

CREATE INDEX ON "billing_address" ("city");
CREATE INDEX ON "billing_address" ("post_code");
CREATE INDEX ON "billing_address" ("country");

-- Add relation 
ALTER TABLE "billing_address" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");