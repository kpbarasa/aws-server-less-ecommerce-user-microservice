CREATE TABLE "shopping_carts" (
    "cart_id" bigserial PRIMARY KEY,
    "user_id" varchar NOT NULL,
    "tax_class"  varchar UNIQUE NULL,
    "subtotal"  varchar UNIQUE NULL,
    "total"  varchar UNIQUE NULL,
    "total_tax"  varchar UNIQUE NULL,
    "taxes"  varchar UNIQUE NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT(now())
);

-- Add relation
ALTER TABLE "shopping_carts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

CREATE TABLE "cart_items" (
    "item_id" bigserial PRIMARY KEY,
    "cart_id" bigserial,
    "name" varchar NOT NULL,
    "product_id" varchar UNIQUE NULL,
    "variation_id" varchar UNIQUE NULL,
    "quantity" int NOT NULL,
    "tax_class"  varchar UNIQUE NULL,
    "subtotal"  varchar UNIQUE NULL,
    "total_tax"  varchar UNIQUE NULL,
    "taxes"  varchar UNIQUE NULL,
    "meta_data"  varchar UNIQUE NULL,
    "sku"  varchar UNIQUE NULL,
    "total"  varchar UNIQUE NULL,
    "price" bigint NOT NULL,
    "image_url" varchar NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT(now())
);

CREATE INDEX ON "cart_items" ("product_id");

-- Add relation
ALTER TABLE "cart_items" ADD FOREIGN KEY ("cart_id") REFERENCES "shopping_carts" ("cart_id");