/* tslint:disable */
/* eslint-disable */
/**
 * OnlineStore.WebApi
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CartItemResponse } from './cart-item-response';
/**
 * 
 * @export
 * @interface CartResponse
 */
export interface CartResponse {
    /**
     * 
     * @type {Array<CartItemResponse>}
     * @memberof CartResponse
     */
    items?: Array<CartItemResponse> | null;
    /**
     * 
     * @type {string}
     * @memberof CartResponse
     */
    cartId?: string;
    /**
     * 
     * @type {string}
     * @memberof CartResponse
     */
    accountId?: string;
    /**
     * 
     * @type {number}
     * @memberof CartResponse
     */
    itemsCount?: number;
}
