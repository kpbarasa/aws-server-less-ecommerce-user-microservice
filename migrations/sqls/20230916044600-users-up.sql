CREATE TABLE "users" (
    "user_id" varchar PRIMARY KEY,
    "phone" varchar(50) NOT NULL,
    "email" varchar(200) UNIQUE NULL,
    "password" varchar(100) NOT NULL,
    "user_type" varchar(500) NOT NULL,
    "first_name" varchar(30),
    "last_name" varchar(30),
    "middle_name" varchar(30),
    "profile_pic" varchar(500),
    "stripe_id" varchar(200) NULL,
    "payment_id" varchar(200) NULL,
    "salt" varchar NOT NULL,
    "verification_code" varchar NULL,
    "expiry_date" DATE NULL,
    "verified" boolean  DEFAULT FALSE,
    "created_at" TIMESTAMP  DEFAULT (now()),
    "updated_at" TIMESTAMP  DEFAULT (now())
);

CREATE INDEX ON "users" ("phone");