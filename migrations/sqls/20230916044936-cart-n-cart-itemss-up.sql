CREATE TABLE "shopping_carts"(
    "cart_id" varchar PRIMARY KEY,
    "user_id" varchar UNIQUE NULL,
    "items" int NOT NULL,
    "tax_class"  varchar NOT NULL,
    "subtotal"  float NOT NULL,
    "total"  float NOT NULL,
    "total_tax"  float NULL,
    "taxes"  varchar NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT(now())
);

-- Add relation
ALTER TABLE "shopping_carts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

CREATE TABLE "cart_items"(
    "item_id" varchar UNIQUE PRIMARY KEY,
    "cart_id" varchar NOT NULL,
    "product_id" varchar NULL,
    "name" varchar NOT NULL,
    "price" float NOT NULL,
    "image_url" varchar NULL,
    "quantity" int NOT NULL,
    "variation_id" varchar NULL,
    "subtotal"  float NOT NULL,
    "tax_class"  varchar NULL,
    "taxes"  varchar NOT NULL,
    "total_tax"  float NOT NULL,
    "total"  float NOT NULL,
    "meta_data"  varchar NULL,
    "sku"  varchar NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT(now())
);

CREATE INDEX ON "cart_items" ("product_id");
CREATE INDEX ON "cart_items" ("name");

-- Add relation
ALTER TABLE "cart_items" ADD FOREIGN KEY ("cart_id") REFERENCES "shopping_carts" ("cart_id");