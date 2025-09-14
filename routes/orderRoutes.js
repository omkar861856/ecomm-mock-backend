const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - user_id
 *         - status
 *         - status_history
 *         - items
 *         - fulfillment
 *         - payment
 *         - shipping
 *         - totals
 *       properties:
 *         order_id:
 *           type: string
 *           description: Unique order identifier
 *         user_id:
 *           type: string
 *           description: User ID who placed the order
 *         status:
 *           type: string
 *           enum: [PLACED, CONFIRMED, PICKED, PACKED, SHIPPED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, RETURN_REQUESTED, RETURNED, REFUNDED, CANCELLED]
 *           description: Current order status
 *         status_history:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StatusHistory'
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         fulfillment:
 *           $ref: '#/components/schemas/FulfillmentInfo'
 *         payment:
 *           $ref: '#/components/schemas/PaymentInfo'
 *         shipping:
 *           $ref: '#/components/schemas/ShippingInfo'
 *         totals:
 *           $ref: '#/components/schemas/OrderTotals'
 *         notes:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         metadata:
 *           type: object
 *
 *     StatusHistory:
 *       type: object
 *       required:
 *         - status
 *         - timestamp
 *         - by
 *         - note
 *       properties:
 *         status:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *         by:
 *           type: string
 *         note:
 *           type: string
 *
 *     OrderItem:
 *       type: object
 *       required:
 *         - variant_id
 *         - name
 *         - quantity
 *         - unit_price
 *         - tax_amount
 *         - line_total
 *       properties:
 *         variant_id:
 *           type: string
 *         name:
 *           type: string
 *         quantity:
 *           type: integer
 *         unit_price:
 *           type: number
 *         tax_amount:
 *           type: number
 *         line_total:
 *           type: number
 *
 *     FulfillmentInfo:
 *       type: object
 *       required:
 *         - fulfillment_id
 *         - warehouse_id
 *         - fulfillment_type
 *         - pick_list
 *         - packing
 *       properties:
 *         fulfillment_id:
 *           type: string
 *         warehouse_id:
 *           type: string
 *         fulfillment_type:
 *           type: string
 *         pick_list:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PickListItem'
 *         packing:
 *           $ref: '#/components/schemas/PackingInfo'
 *
 *     PickListItem:
 *       type: object
 *       required:
 *         - variant_id
 *         - quantity
 *         - picked
 *       properties:
 *         variant_id:
 *           type: string
 *         quantity:
 *           type: integer
 *         picked:
 *           type: boolean
 *
 *     PackingInfo:
 *       type: object
 *       required:
 *         - packed
 *       properties:
 *         packed:
 *           type: boolean
 *         package_id:
 *           type: string
 *         package_dimensions_cm:
 *           type: object
 *
 *     PaymentInfo:
 *       type: object
 *       required:
 *         - payment_id
 *         - method
 *         - gateway
 *         - amount
 *         - currency
 *         - status
 *         - capture_attempts
 *       properties:
 *         payment_id:
 *           type: string
 *         method:
 *           type: string
 *         gateway:
 *           type: string
 *         amount:
 *           type: number
 *         currency:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, authorized, captured, failed, refunded]
 *         authorized_at:
 *           type: string
 *           format: date-time
 *         captured_at:
 *           type: string
 *           format: date-time
 *         capture_attempts:
 *           type: integer
 *
 *     OrderTotals:
 *       type: object
 *       required:
 *         - subtotal
 *         - discounts
 *         - tax
 *         - shipping
 *         - grand_total
 *         - currency
 *       properties:
 *         subtotal:
 *           type: number
 *         discounts:
 *           type: number
 *         tax:
 *           type: number
 *         shipping:
 *           type: number
 *         grand_total:
 *           type: number
 *         currency:
 *           type: string
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PLACED, CONFIRMED, PICKED, PACKED, SHIPPED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, RETURN_REQUESTED, RETURNED, REFUNDED, CANCELLED]
 *         description: Filter by order status
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
 *         description: List of orders
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
 *                     $ref: '#/components/schemas/Order'
 *                 pagination:
 *                   type: object
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 */
router.get("/", getAllOrders);
router.post("/", createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 *   put:
 *     summary: Update order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 *       400:
 *         description: Validation error
 *   delete:
 *     summary: Delete order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PLACED, CONFIRMED, PICKED, PACKED, SHIPPED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, RETURN_REQUESTED, RETURNED, REFUNDED, CANCELLED]
 *               note:
 *                 type: string
 *               by:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found
 */
router.patch("/:id/status", updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   post:
 *     summary: Cancel order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *               by:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       404:
 *         description: Order not found
 *       400:
 *         description: Order cannot be cancelled in current status
 */
router.post("/:id/cancel", cancelOrder);

module.exports = router;
