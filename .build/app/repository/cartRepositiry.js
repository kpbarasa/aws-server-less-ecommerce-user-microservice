"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRepository = void 0;
const uuid_1 = require("uuid");
const dbOperations_1 = require("./dbOperations");
const response_1 = require("../utility/response");
class CartRepository extends dbOperations_1.DBOperation {
    constructor() {
        super();
        this._currentDate = new Date();
    }
    createShoppingCart(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart_id = (0, uuid_1.v1)();
            const queryString = "INSERT  INTO shopping_carts(user_id, cart_id,items, subtotal, total, total_tax, tax_class, taxes) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
            const values = [
                user_id,
                cart_id,
                0,
                0,
                0,
                0,
                JSON.stringify([]),
                JSON.stringify([]), //taxes
            ];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw (0, response_1.ErrorResponse)(404, "Sorry could not create shopping cart");
        });
    }
    updateShoppingCart(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { subtotal, total, total_tax, cart_id } = input;
            const queryString = "UPDATE shopping_carts SET subtotal=$1, total=$2, total_tax=$3 WHERE cart_id=$4 RETURNING *";
            const values = [subtotal, total, total_tax, cart_id];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw (0, response_1.ErrorResponse)(404, "Sorry could not update shopping cart data");
        });
    }
    findShoppingCartById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "SELECT cart_id, user_id, items, tax_class, subtotal, total, total_tax, taxes, created_at FROM shopping_carts WHERE user_id=$1";
            const values = [user_id];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw (0, response_1.ErrorResponse)(404, "Sorry could not find shopping cart");
        });
    }
    findShoppingCart(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "SELECT cart_id, user_id, items, tax_class, subtotal, total, total_tax, taxes, created_at FROM shopping_carts WHERE user_id=$1";
            const values = [user_id];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw (0, response_1.ErrorResponse)(404, "Sorry could not find shopping cart data");
        });
    }
    findCartItem(cartId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "SELECT item_id, product_id, price, quantity, image_url, variation_id, subtotal, tax_class, taxes, total_tax, total, meta_data, sku, created_at FROM cart_items WHERE product_id=$1 AND cart_id=$2";
            const values = [productId, cartId];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw (0, response_1.ErrorResponse)(404, "Sorry could not get shopping cart item");
        });
    }
    findCartItems(cartId) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "SELECT item_id, product_id, price, quantity, image_url, variation_id, subtotal, tax_class, taxes, total_tax, total, meta_data, sku, created_at FROM cart_items WHERE  cart_id=$1";
            const values = [cartId];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows;
            }
            throw (0, response_1.ErrorResponse)(404, "Sorry could not get shopping cart items");
        });
    }
    getShoppingcart(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `SELECT 
        ci.item_id, 
        ci.cart_id, 
        ci.product_id, 
        ci.name, 
        ci.price, 
        ci.quantity, 
        ci.image_url,
        ci.created_at 
        FROM cart_items ci INNER JOIN shopping_carts sc ON ci.cart_id = sc.cart_id WHERE sc.user_id = $1`;
            const values = [user_id];
            const result = yield this.executeQuery(queryString, values);
            console.log({ result: result.rows[0] });
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw (0, response_1.ErrorResponse)(404, "Sorry could not get shopping car");
        });
    }
    createCartItem(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, cart_id, quantity, subtotal, total_tax, total } = inputs;
            const item_id = (0, uuid_1.v1)();
            const vitem_id = (0, uuid_1.v1)();
            const queryString = `INSERT  INTO cart_items(item_id, cart_id, product_id, name, price, image_url, variation_id, quantity, tax_class, subtotal,total_tax,taxes, total, sku) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;
            const values = [
                item_id,
                cart_id,
                data.product_id,
                data.name,
                data.price,
                data.images,
                vitem_id,
                quantity,
                JSON.stringify([""]),
                subtotal,
                total_tax,
                JSON.stringify([""]),
                total,
                "00", //SKU
            ];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw (0, response_1.ErrorResponse)(404, "Sorry could not get shopping car");
        });
    }
    updateCartItemById(itemId, inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { quantity, subtotal, total_tax, total, item_id } = inputs;
            const queryString = "UPDATE cart_items SET quantity=$1, subtotal=$2, total_tax=$3, total=$4 WHERE item_id=$5";
            const values = [quantity, subtotal, total_tax, total, item_id];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw (0, response_1.ErrorResponse)(404, "Sorry could not get shopping car");
        });
    }
    updateCartItemByProductId(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { quantity, subtotal, total_tax, total, productId } = inputs;
            const queryString = "UPDATE cart_items SET quantity=$1,  subtotal=$2, total_tax=$3, total=$4  WHERE product_id=$5 RETURNING *";
            const values = [quantity, subtotal, total_tax, total, productId];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw (0, response_1.ErrorResponse)(404, "Sorry could not get shopping car");
        });
    }
    deleteCartItem(cartId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log({ productId, cartId });
            const queryString = "DELETE FROM cart_items WHERE cart_id=$1 AND product_id=$2";
            const values = [cartId, productId];
            const result = yield this.executeQuery(queryString, values);
            return result.rowCount > 0
                ? result.rows[0]
                : false;
        });
    }
    deleteCart(cartId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "DELETE FROM shopping_carts WHERE cart_id = $1";
            const values = [cartId];
            const result = yield this.executeQuery(queryString, values);
            if (result) {
                yield this.executeQuery("DELETE FROM cart_items WHERE cart_id = $1", [
                    cartId,
                ]);
            }
            return result.rowCount > 0
                ? result.rows[0]
                : false;
        });
    }
}
exports.CartRepository = CartRepository;
//# sourceMappingURL=cartRepositiry.js.map