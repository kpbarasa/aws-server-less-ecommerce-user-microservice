import { SusccessResponse } from "app/utility/response";
import { AddressModel } from "../models/addressModel";
import { ShoppingCartItemModel } from "../models/CartItemsModel";
import { ProfileInput } from "../models/dto/AddressInput";
import { UserModel } from "../models/UserModel";
import { DBClient } from "../utility/databaseClient";
import { DBOperation } from "./dbOperations";
import { CartInput } from "app/models/dto/cartInput";

export class CartRepository extends DBOperation {

    constructor() {
        super()
    }

    async findShoppingCart(user_id: number) {
        const queryString = "SELECT cart_id, user_id FROM shopping_carts WHERE user_id=$1";
        const values = [user_id]
        const result = await this.executeQuery(queryString, values);
        return result.rowCount > 0 ? (result.rows[0] as ShoppingCartItemModel) : false;
    };

    async createShoppingCart(user_id: number) {
        const queryString = "INSERT  INTO shopping_carts(user_id) VALUES($1) RETURNING *";
        const values = [user_id]
        const result = await this.executeQuery(queryString, values);
        return result.rowCount > 0 ? (result.rows[0] as ShoppingCartItemModel) : false;
    };

    async updateShoppingCart({cart_id, subtotal, total}: CartInput) {
        const queryString = 'UPDATE shopping_carts SET subtotal=$1  total=$2 WHERE cart_id=$3';
        const values = [subtotal, total, cart_id]
        const result = await this.executeQuery(queryString, values);
        return result.rowCount > 0 ? (result.rows[0] as ShoppingCartItemModel) : false;
    };

    async findCartItemById(productId: number) { };

    async findCartItemByProductId(productId: number) {
        console.log({productId});
        
        const queryString = "SELECT product_id, price, item_qty FROM cart_items WHERE product_id=$1";
        // const queryString = "SELECT * FROM cart_items WHERE product_id != $1";
        const values = [productId]
        const result = await this.executeQuery(queryString, values);
        console.log({result:result});
        
        return result.rowCount > 0 ? (result.rows[0] as ShoppingCartItemModel) : false;
    };

    async findCartItems(userId: number) {

        const queryString = `SELECT 
        ci.cart_id, 
        ci.item_id, 
        ci.product_id, 
        ci.name, 
        ci.price, 
        ci.item_qty, 
        ci.image_url,
        ci.created_at FROM cart_items sc INNER JOIN shopping_carts ci ON sc.cart_id = ci.cart_id WHERE sc.user_id = $1`;
        const values = [userId];
        const result = await this.executeQuery(queryString, values);
        return result.rowCount > 0 ? (result.rows as ShoppingCartItemModel[]) : false;

    };

    async findCartItemsByCartId(cartId: string) {
        const queryString = "SELECT name, image_url, price, item_qty FROM cart_items WHERE cart_id=$1";
        const values = [cartId];
        const result = await this.executeQuery(queryString, values);
        return result.rowCount > 0 ? (result.rows as ShoppingCartItemModel[]) : [];
    };

    async createCartItem({
        product_id,
        name,
        price,
        images,
        cart_id,
        item_qty
    }: ShoppingCartItemModel) {
        console.log("CART ITEMS HERE")
        console.log({
            product_id,
            name,
            price,
            images,
            cart_id,
            item_qty
        });
        
        const queryString = "INSERT  INTO cart_items(cart_id, product_id, name, image_url, price, item_qty) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
        const values = [cart_id, product_id, name, images, price, item_qty]
        const result = await this.executeQuery(queryString, values);
        console.log({result:result.rows[0] as ShoppingCartItemModel});
        
        return result.rowCount > 0 ? (result.rows[0] as ShoppingCartItemModel) : false;
    };

    async updateCartItemById(itemId: number, qty: number) {

        const queryString = 'UPDATE cart_items SET item_qty=$1 WHERE item_id=$2';
        const values = [itemId, qty]
        const result = await this.executeQuery(queryString, values);

        return result.rowCount > 0 ? (result.rows[0] as ShoppingCartItemModel) : false;

    };

    async updateCartItemByProductId(productId: number, qty: number) {

        const queryString = 'UPDATE cart_items SET item_qty=$1 WHERE item_id=$2';
        const values = [qty, productId]
        const result = await this.executeQuery(queryString, values);
        console.log({result:result.rows});
        

        return result.rowCount > 0 ? (result.rows[0] as ShoppingCartItemModel) : false;

    };

    async deleteCartItem(id: number) {

        const queryString = 'DELETE FROM cart_items WHERE item_id = $1';
        const values = [id];
        const result = await this.executeQuery(queryString, values);

        return  result.rowCount > 0 ? (result.rows[0] as ShoppingCartItemModel) : false;

    };

    async deleteCart(id: number) {

        const queryString = 'DELETE FROM cart_items WHERE cart_id = $1';
        const values = [id];
        const result = await this.executeQuery(queryString, values);

        if(result){
            await this.executeQuery('DELETE FROM cart_items WHERE cart_id = $1', [id]);
        }

        return  result.rowCount > 0 ? (result.rows[0] as ShoppingCartItemModel) : false;

    };

}