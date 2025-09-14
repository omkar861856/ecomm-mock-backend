const express = require("express");
const router = express.Router();
const {
  createCart,
  getAllCarts,
  getCartById,
  updateCart,
  deleteCart,
  addItemToCart,
  removeItemFromCart,
} = require("../controllers/cartController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - user_id
 *         - items
 *         - applied_coupons
 *         - estimated_taxes
 *         - estimated_shipping
 *         - currency
 *         - cart_total
 *       properties:
 *         cart_id:
 *           type: string
 *           description: Unique cart identifier
 *         user_id:
 *           type: string
 *           description: User ID who owns the cart
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         applied_coupons:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Coupon'
 *         estimated_taxes:
 *           type: number
 *           minimum: 0
 *         estimated_shipping:
 *           type: number
 *           minimum: 0
 *         currency:
 *           type: string
 *         cart_total:
 *           type: number
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     CartItem:
 *       type: object
 *       required:
 *         - variant_id
 *         - quantity
 *         - unit_price
 *         - line_total
 *       properties:
 *         variant_id:
 *           type: string
 *         quantity:
 *           type: integer
 *           minimum: 1
 *         unit_price:
 *           type: number
 *         line_total:
 *           type: number
 *
 *     Coupon:
 *       type: object
 *       required:
 *         - code
 *         - type
 *         - value
 *         - applies_to
 *         - min_cart_value
 *         - valid_till
 *       properties:
 *         code:
 *           type: string
 *         type:
 *           type: string
 *           enum: [fixed, percentage]
 *         value:
 *           type: number
 *         applies_to:
 *           type: string
 *         min_cart_value:
 *           type: number
 *         valid_till:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Get all carts
 *     tags: [Carts]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of carts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cart'
 *                 pagination:
 *                   type: object
 *   post:
 *     summary: Create a new cart
 *     tags: [Carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       201:
 *         description: Cart created successfully
 *       400:
 *         description: Validation error
 */
router.get("/", getAllCarts);
router.post("/", createCart);

/**
 * @swagger
 * /api/carts/{id}:
 *   get:
 *     summary: Get cart by ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart details
 *       404:
 *         description: Cart not found
 *   put:
 *     summary: Update cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       404:
 *         description: Cart not found
 *       400:
 *         description: Validation error
 *   delete:
 *     summary: Delete cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       404:
 *         description: Cart not found
 */
router.get("/:id", getCartById);
router.put("/:id", updateCart);
router.delete("/:id", deleteCart);

/**
 * @swagger
 * /api/carts/{id}/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - variant_id
 *               - quantity
 *               - unit_price
 *             properties:
 *               variant_id:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               unit_price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       404:
 *         description: Cart not found
 */
router.post("/:id/items", addItemToCart);

/**
 * @swagger
 * /api/carts/{id}/items/{variant_id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *       - in: path
 *         name: variant_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       404:
 *         description: Cart not found
 */
router.delete("/:id/items/:variant_id", removeItemFromCart);

module.exports = router;
