const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  addUserAddress,
  addUserPaymentMethod,
} = require("../controllers/userController");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - loyalty_tier
 *         - loyalty_points
 *         - addresses
 *         - payment_methods
 *       properties:
 *         id:
 *           type: string
 *           description: Unique user identifier
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         phone:
 *           type: string
 *           description: User's phone number
 *         loyalty_tier:
 *           type: string
 *           enum: [Bronze, Silver, Gold, Platinum]
 *           description: User's loyalty tier
 *         loyalty_points:
 *           type: integer
 *           minimum: 0
 *           description: User's loyalty points
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 *         payment_methods:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PaymentMethod'
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     Address:
 *       type: object
 *       required:
 *         - address_id
 *         - label
 *         - recipient
 *         - line1
 *         - city
 *         - state
 *         - postal_code
 *         - country
 *         - preferred
 *       properties:
 *         address_id:
 *           type: string
 *         label:
 *           type: string
 *         recipient:
 *           type: string
 *         line1:
 *           type: string
 *         line2:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         postal_code:
 *           type: string
 *         country:
 *           type: string
 *         preferred:
 *           type: boolean
 *
 *     PaymentMethod:
 *       type: object
 *       required:
 *         - payment_id
 *         - type
 *       properties:
 *         payment_id:
 *           type: string
 *         type:
 *           type: string
 *           enum: [card, upi, netbanking, wallet]
 *         brand:
 *           type: string
 *         last4:
 *           type: string
 *         expiry:
 *           type: string
 *         billing_address_id:
 *           type: string
 *         tokenized:
 *           type: boolean
 *         vpa:
 *           type: string
 *         preferred:
 *           type: boolean
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: loyalty_tier
 *         schema:
 *           type: string
 *           enum: [Bronze, Silver, Gold, Platinum]
 *         description: Filter by loyalty tier
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
 *         description: List of users
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
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.get("/", getAllUsers);
router.post("/", createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Validation error
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

/**
 * @swagger
 * /api/users/{id}/addresses:
 *   post:
 *     summary: Add address to user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address added successfully
 *       404:
 *         description: User not found
 */
router.post("/:id/addresses", addUserAddress);

/**
 * @swagger
 * /api/users/{id}/payment-methods:
 *   post:
 *     summary: Add payment method to user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentMethod'
 *     responses:
 *       200:
 *         description: Payment method added successfully
 *       404:
 *         description: User not found
 */
router.post("/:id/payment-methods", addUserPaymentMethod);

module.exports = router;
