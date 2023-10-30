import { v1 as uuidv1 } from "uuid";
import { DBOperation } from "./dbOperations";
import { CartInput } from "app/models/dto/cartInput";
import {
  ShoppingCartItemModel,
  ShoppingCartItemsInputs,
  ShoppingCartModel,
} from "../models/CartItemsModel";
import { ErrorResponse } from "../utility/response";

export class CartRepository extends DBOperation {
  _currentDate = new Date();

  constructor() {
    super();
  }

  async createShoppingCart(user_id: string): Promise<ShoppingCartModel> {
    const cart_id = uuidv1();
    const queryString =
      "INSERT  INTO shopping_carts(user_id, cart_id,items, subtotal, total, total_tax, tax_class, taxes) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
    const values = [
      user_id,
      cart_id,
      0, //No of cart items,
      0, //subtotal,
      0, //total,
      0, // total + tax
      JSON.stringify([]), //tax class,
      JSON.stringify([]), //taxes
    ];

    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as ShoppingCartModel;
    }

    throw ErrorResponse(404, "Sorry could not create shopping cart");
  }

  async updateShoppingCart(
    input: ShoppingCartModel
  ): Promise<ShoppingCartModel> {
    const { subtotal, total, total_tax, cart_id } = input;
    const queryString =
      "UPDATE shopping_carts SET subtotal=$1, total=$2, total_tax=$3 WHERE cart_id=$4 RETURNING *";
    const values = [subtotal, total, total_tax, cart_id];
    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as ShoppingCartModel;
    }

    throw ErrorResponse(404, "Sorry could not update shopping cart data");
  }

  async findShoppingCartById(user_id: string): Promise<ShoppingCartModel> {
    const queryString =
      "SELECT cart_id, user_id, items, tax_class, subtotal, total, total_tax, taxes, created_at FROM shopping_carts WHERE user_id=$1";
    const values = [user_id];
    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as ShoppingCartModel;
    }

    throw ErrorResponse(404, "Sorry could not find shopping cart");
  }

  async findShoppingCart(user_id: string): Promise<ShoppingCartModel> {
    const queryString =
      "SELECT cart_id, user_id, items, tax_class, subtotal, total, total_tax, taxes, created_at FROM shopping_carts WHERE user_id=$1";
    const values = [user_id];
    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as ShoppingCartModel;
    }

    throw ErrorResponse(404, "Sorry could not find shopping cart data");
  }

  async findCartItem(
    cartId: string,
    productId: string
  ): Promise<ShoppingCartItemModel> {
    const queryString =
      "SELECT item_id, product_id, price, quantity, image_url, variation_id, subtotal, tax_class, taxes, total_tax, total, meta_data, sku, created_at FROM cart_items WHERE product_id=$1 AND cart_id=$2";
    const values = [productId, cartId];
    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as ShoppingCartItemModel;
    }

    throw ErrorResponse(404, "Sorry could not get shopping cart item");
  }

  async findCartItems(cartId: string): Promise<ShoppingCartItemModel[]> {
    const queryString =
      "SELECT item_id, product_id, price, quantity, image_url, variation_id, subtotal, tax_class, taxes, total_tax, total, meta_data, sku, created_at FROM cart_items WHERE  cart_id=$1";
    const values = [cartId];
    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows as ShoppingCartItemModel[];
    }

    throw ErrorResponse(404, "Sorry could not get shopping cart items");
  }

  async getShoppingcart(user_id: string): Promise<ShoppingCartModel> {
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
    const result = await this.executeQuery(queryString, values);
    console.log({result:result.rows[0]});
    

    if (result.rowCount > 0) {
      return result.rows[0] as ShoppingCartModel;
    }

    throw ErrorResponse(404, "Sorry could not get shopping car");
  }

  async createCartItem(
    inputs: ShoppingCartItemsInputs
  ): Promise<ShoppingCartItemModel> {
    const { data, cart_id, quantity, subtotal, total_tax, total } = inputs;

    const item_id = uuidv1();
    const vitem_id = uuidv1();

    const queryString = `INSERT  INTO cart_items(item_id, cart_id, product_id, name, price, image_url, variation_id, quantity, tax_class, subtotal,total_tax,taxes, total, sku) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;
    const values = [
      item_id, //ITEM ID
      cart_id, //CART ID
      data.product_id, // PRODUCT ID
      data.name, // PRODUCT NAME
      data.price, // PRODUCT PRICE
      data.images, // PRODUCT IMAGES
      vitem_id, // VRIENT ID
      quantity, // PRODUCT QUABTITY
      JSON.stringify([""]), //TAX CLASS
      subtotal, //SUB TOTAL
      total_tax, //TOTAL TAX
      JSON.stringify([""]), //TAXES
      total, //TOTAL
      "00", //SKU
    ];

    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as ShoppingCartItemModel;
    }

    throw ErrorResponse(404, "Sorry could not get shopping car");
  }

  async updateCartItemById(
    itemId: string,
    inputs: any
  ): Promise<ShoppingCartItemModel> {
    const { quantity, subtotal, total_tax, total, item_id } = inputs;

    const queryString =
      "UPDATE cart_items SET quantity=$1, subtotal=$2, total_tax=$3, total=$4 WHERE item_id=$5";
    const values = [quantity, subtotal, total_tax, total, item_id];
    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as ShoppingCartItemModel;
    }

    throw ErrorResponse(404, "Sorry could not get shopping car");
  }

  async updateCartItemByProductId(
    inputs: CartInput
  ): Promise<ShoppingCartItemModel> {
    const { quantity, subtotal, total_tax, total, productId } = inputs;

    const queryString =
      "UPDATE cart_items SET quantity=$1,  subtotal=$2, total_tax=$3, total=$4  WHERE product_id=$5 RETURNING *";
    const values = [quantity, subtotal, total_tax, total, productId];
    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as ShoppingCartItemModel;
    }

    throw ErrorResponse(404, "Sorry could not get shopping car");
  }

  async deleteCartItem(cartId: string, productId: string) {
    console.log({ productId, cartId });
    const queryString =
      "DELETE FROM cart_items WHERE cart_id=$1 AND product_id=$2";
    const values = [cartId, productId];
    const result = await this.executeQuery(queryString, values);

    return result.rowCount > 0
      ? (result.rows[0] as ShoppingCartItemModel)
      : false;
  }

  async deleteCart(cartId: string, userId: string) {
    const queryString = "DELETE FROM shopping_carts WHERE cart_id = $1";
    const values = [cartId];
    const result = await this.executeQuery(queryString, values);

    if (result) {
      await this.executeQuery("DELETE FROM cart_items WHERE cart_id = $1", [
        cartId,
      ]);
    }

    return result.rowCount > 0
      ? (result.rows[0] as ShoppingCartItemModel)
      : false;
  }
}
