const express = require("express");
const router = express.Router();
const {
  createShipment,
  getAllShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
  addTrackingEvent,
  getShipmentTracking,
} = require("../controllers/shipmentController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Shipment:
 *       type: object
 *       required:
 *         - order_id
 *         - events
 *       properties:
 *         shipment_id:
 *           type: string
 *           description: Unique shipment identifier
 *         order_id:
 *           type: string
 *           description: Order ID this shipment belongs to
 *         carrier:
 *           type: string
 *           description: Shipping carrier
 *         service_level:
 *           type: string
 *           description: Service level (express, standard, etc.)
 *         tracking_number:
 *           type: string
 *           description: Carrier tracking number
 *         label_created_at:
 *           type: string
 *           format: date-time
 *           description: When shipping label was created
 *         shipped_at:
 *           type: string
 *           format: date-time
 *           description: When package was shipped
 *         delivered_at:
 *           type: string
 *           format: date-time
 *           description: When package was delivered
 *         events:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TrackingEvent'
 *         proof_of_delivery:
 *           $ref: '#/components/schemas/ProofOfDelivery'
 *
 *     TrackingEvent:
 *       type: object
 *       required:
 *         - timestamp
 *         - status
 *         - description
 *       properties:
 *         timestamp:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *         location:
 *           type: string
 *         description:
 *           type: string
 *
 *     ProofOfDelivery:
 *       type: object
 *       properties:
 *         signature:
 *           type: string
 *         photo_url:
 *           type: string
 *           format: uri
 *         delivered_to:
 *           type: string
 *         delivery_notes:
 *           type: string
 *
 *     TrackingInfo:
 *       type: object
 *       properties:
 *         tracking_number:
 *           type: string
 *         carrier:
 *           type: string
 *         status:
 *           type: string
 *         events:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TrackingEvent'
 *         shipped_at:
 *           type: string
 *           format: date-time
 *         delivered_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/shipments:
 *   get:
 *     summary: Get all shipments
 *     tags: [Shipments]
 *     parameters:
 *       - in: query
 *         name: order_id
 *         schema:
 *           type: string
 *         description: Filter by order ID
 *       - in: query
 *         name: carrier
 *         schema:
 *           type: string
 *         description: Filter by carrier
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
 *         description: List of shipments
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
 *                     $ref: '#/components/schemas/Shipment'
 *                 pagination:
 *                   type: object
 *   post:
 *     summary: Create a new shipment
 *     tags: [Shipments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shipment'
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *       400:
 *         description: Validation error
 */
router.get("/", getAllShipments);
router.post("/", createShipment);

/**
 * @swagger
 * /api/shipments/{id}:
 *   get:
 *     summary: Get shipment by ID
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID
 *     responses:
 *       200:
 *         description: Shipment details
 *       404:
 *         description: Shipment not found
 *   put:
 *     summary: Update shipment
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shipment'
 *     responses:
 *       200:
 *         description: Shipment updated successfully
 *       404:
 *         description: Shipment not found
 *       400:
 *         description: Validation error
 *   delete:
 *     summary: Delete shipment
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID
 *     responses:
 *       200:
 *         description: Shipment deleted successfully
 *       404:
 *         description: Shipment not found
 */
router.get("/:id", getShipmentById);
router.put("/:id", updateShipment);
router.delete("/:id", deleteShipment);

/**
 * @swagger
 * /api/shipments/{id}/tracking:
 *   get:
 *     summary: Get shipment tracking information
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID
 *     responses:
 *       200:
 *         description: Shipment tracking information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TrackingInfo'
 *       404:
 *         description: Shipment not found
 */
router.get("/:id/tracking", getShipmentTracking);

/**
 * @swagger
 * /api/shipments/{id}/events:
 *   post:
 *     summary: Add tracking event to shipment
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - description
 *             properties:
 *               status:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tracking event added successfully
 *       404:
 *         description: Shipment not found
 */
router.post("/:id/events", addTrackingEvent);

module.exports = router;
