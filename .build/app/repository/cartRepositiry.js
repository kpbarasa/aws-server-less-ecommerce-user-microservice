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
const dbOperations_1 = require("./dbOperations");
class CartRepository extends dbOperations_1.DBOperation {
    constructor() {
        super();
    }
    findShoppingCart(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "SELECT cart_id, user_id FROM shopping_carts WHERE user_id=$1";
            const values = [user_id];
            const result = yield this.executeQuery(queryString, values);
            return result.rowCount > 0 ? result.rows[0] : false;
        });
    }
    ;
    createShoppingCart(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "INSERT  INTO shopping_carts(user_id) VALUES($1) RETURNING *";
            const values = [user_id];
            const result = yield this.executeQuery(queryString, values);
            return result.rowCount > 0 ? result.rows[0] : false;
        });
    }
    ;
    updateShoppingCart({ cart_id, subtotal, total }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = 'UPDATE shopping_carts SET subtotal=$1  total=$2 WHERE cart_id=$3';
            const values = [subtotal, total, cart_id];
            const result = yield this.executeQuery(queryString, values);
            return result.rowCount > 0 ? result.rows[0] : false;
        });
    }
    ;
    findCartItemById(productId) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    ;
    findCartItemByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log({ productId });
            const queryString = "SELECT product_id, price, item_qty FROM cart_items WHERE product_id=$1";
            // const queryString = "SELECT * FROM cart_items WHERE product_id != $1";
            const values = [productId];
            const result = yield this.executeQuery(queryString, values);
            console.log({ result: result });
            return result.rowCount > 0 ? result.rows[0] : false;
        });
    }
    ;
    findCartItems(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `SELECT 
        ci.cart_id, 
        ci.item_id, 
        ci.product_id, 
        ci.name, 
        ci.price, 
        ci.item_qty, 
        ci.image_url,
        ci.created_at FROM cart_items sc INNER JOIN shopping_carts ci ON sc.cart_id = ci.cart_id WHERE sc.user_id = $1`;
            const values = [user_id];
            const result = yield this.executeQuery(queryString, values);
            return result.rowCount > 0 ? result.rows : false;
        });
    }
    ;
    findCartItemsByCartId(cartId) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "SELECT name, image_url, price, item_qty FROM cart_items WHERE cart_id=$1";
            const values = [cartId];
            const result = yield this.executeQuery(queryString, values);
            return result.rowCount > 0 ? result.rows : [];
        });
    }
    ;
    createCartItem({ product_id, name, price, images, cart_id, item_qty }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("CART ITEMS HERE");
            console.log({
                product_id,
                name,
                price,
                images,
                cart_id,
                item_qty
            });
            const queryString = "INSERT  INTO cart_items(cart_id, product_id, name, image_url, price, item_qty) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
            const values = [cart_id, product_id, name, images, price, item_qty];
            const result = yield this.executeQuery(queryString, values);
            console.log({ result: result.rows[0] });
            return result.rowCount > 0 ? result.rows[0] : false;
        });
    }
    ;
    updateCartItemById(itemId, qty) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = 'UPDATE cart_items SET item_qty=$1 WHERE item_id=$2';
            const values = [itemId, qty];
            const result = yield this.executeQuery(queryString, values);
            return result.rowCount > 0 ? result.rows[0] : false;
        });
    }
    ;
    updateCartItemByProductId(productId, qty) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = 'UPDATE cart_items SET item_qty=$1 WHERE item_id=$2';
            const values = [qty, productId];
            const result = yield this.executeQuery(queryString, values);
            console.log({ result: result.rows });
            return result.rowCount > 0 ? result.rows[0] : false;
        });
    }
    ;
    deleteCartItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = 'DELETE FROM cart_items WHERE item_id = $1';
            const values = [id];
            const result = yield this.executeQuery(queryString, values);
            return result.rowCount > 0 ? result.rows[0] : false;
        });
    }
    ;
    deleteCart(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = 'DELETE FROM cart_items WHERE cart_id = $1';
            const values = [id];
            const result = yield this.executeQuery(queryString, values);
            if (result) {
                yield this.executeQuery('DELETE FROM cart_items WHERE cart_id = $1', [id]);
            }
            return result.rowCount > 0 ? result.rows[0] : false;
        });
    }
    ;
}
exports.CartRepository = CartRepository;
//# sourceMappingURL=cartRepositiry.js.map