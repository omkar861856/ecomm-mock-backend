const express = require("express");
const router = express.Router();
const {
  createCheckout,
  getAllCheckouts,
  getCheckoutById,
  updateCheckout,
  deleteCheckout,
  completeCheckout,
} = require("../controllers/checkoutController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Checkout:
 *       type: object
 *       required:
 *         - cart_id
 *         - user_id
 *         - selected_shipping_address_id
 *         - selected_billing_address_id
 *         - shipping_method
 *         - payment
 *         - order_review
 *       properties:
 *         checkout_id:
 *           type: string
 *           description: Unique checkout identifier
 *         cart_id:
 *           type: string
 *           description: Cart ID being checked out
 *         user_id:
 *           type: string
 *           description: User ID performing checkout
 *         selected_shipping_address_id:
 *           type: string
 *           description: Selected shipping address ID
 *         selected_billing_address_id:
 *           type: string
 *           description: Selected billing address ID
 *         shipping_method:
 *           $ref: '#/components/schemas/ShippingMethod'
 *         payment:
 *           $ref: '#/components/schemas/CheckoutPayment'
 *         order_review:
 *           $ref: '#/components/schemas/OrderReview'
 *         placed_at:
 *           type: string
 *           format: date-time
 *           description: When the checkout was completed
 *
 *     ShippingMethod:
 *       type: object
 *       required:
 *         - id
 *         - label
 *         - cost
 *         - carrier_estimated_days
 *       properties:
 *         id:
 *           type: string
 *         label:
 *           type: string
 *         cost:
 *           type: number
 *         carrier_estimated_days:
 *           type: integer
 *
 *     CheckoutPayment:
 *       type: object
 *       required:
 *         - selected_payment_id
 *         - amount_authorized
 *         - currency
 *         - payment_status
 *         - payment_gateway
 *       properties:
 *         selected_payment_id:
 *           type: string
 *         amount_authorized:
 *           type: number
 *         currency:
 *           type: string
 *         payment_status:
 *           type: string
 *           enum: [pending, authorized, failed]
 *         payment_gateway:
 *           type: string
 *         payment_intent_id:
 *           type: string
 *
 *     OrderReview:
 *       type: object
 *       required:
 *         - subtotal
 *         - discounts
 *         - taxes
 *         - shipping
 *         - total
 *         - currency
 *       properties:
 *         subtotal:
 *           type: number
 *         discounts:
 *           type: number
 *         taxes:
 *           type: number
 *         shipping:
 *           type: number
 *         total:
 *           type: number
 *         currency:
 *           type: string
 */

/**
 * @swagger
 * /api/checkouts:
 *   get:
 *     summary: Get all checkouts
 *     tags: [Checkouts]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: cart_id
 *         schema:
 *           type: string
 *         description: Filter by cart ID
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
 *         description: List of checkouts
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
 *                     $ref: '#/components/schemas/Checkout'
 *                 pagination:
 *                   type: object
 *   post:
 *     summary: Create a new checkout
 *     tags: [Checkouts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Checkout'
 *     responses:
 *       201:
 *         description: Checkout created successfully
 *       400:
 *         description: Validation error
 */
router.get("/", getAllCheckouts);
router.post("/", createCheckout);

/**
 * @swagger
 * /api/checkouts/{id}:
 *   get:
 *     summary: Get checkout by ID
 *     tags: [Checkouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Checkout ID
 *     responses:
 *       200:
 *         description: Checkout details
 *       404:
 *         description: Checkout not found
 *   put:
 *     summary: Update checkout
 *     tags: [Checkouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Checkout ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Checkout'
 *     responses:
 *       200:
 *         description: Checkout updated successfully
 *       404:
 *         description: Checkout not found
 *       400:
 *         description: Validation error
 *   delete:
 *     summary: Delete checkout
 *     tags: [Checkouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Checkout ID
 *     responses:
 *       200:
 *         description: Checkout deleted successfully
 *       404:
 *         description: Checkout not found
 */
router.get("/:id", getCheckoutById);
router.put("/:id", updateCheckout);
router.delete("/:id", deleteCheckout);

/**
 * @swagger
 * /api/checkouts/{id}/complete:
 *   post:
 *     summary: Complete checkout and place order
 *     tags: [Checkouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Checkout ID
 *     responses:
 *       200:
 *         description: Checkout completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     checkout:
 *                       $ref: '#/components/schemas/Checkout'
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       404:
 *         description: Checkout not found
 */
router.post("/:id/complete", completeCheckout);

module.exports = router;
