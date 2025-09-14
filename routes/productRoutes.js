const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductVariants,
} = require("../controllers/productController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - sku
 *         - name
 *         - brand
 *         - description
 *         - categories
 *         - tags
 *         - images
 *         - variants
 *         - shipping
 *         - warranty
 *         - return_policy
 *       properties:
 *         id:
 *           type: string
 *           description: Unique product identifier
 *         sku:
 *           type: string
 *           description: Stock Keeping Unit
 *         name:
 *           type: string
 *           description: Product name
 *         brand:
 *           type: string
 *           description: Product brand
 *         description:
 *           type: string
 *           description: Product description
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           description: Product categories
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Product tags
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: Product image URLs
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductVariant'
 *         shipping:
 *           $ref: '#/components/schemas/ShippingInfo'
 *         warranty:
 *           $ref: '#/components/schemas/WarrantyInfo'
 *         return_policy:
 *           $ref: '#/components/schemas/ReturnPolicy'
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     ProductVariant:
 *       type: object
 *       required:
 *         - variant_id
 *         - color
 *         - size
 *         - barcode
 *         - price
 *         - inventory
 *         - weight_kg
 *         - dimensions_cm
 *       properties:
 *         variant_id:
 *           type: string
 *         color:
 *           type: string
 *         size:
 *           type: string
 *         barcode:
 *           type: string
 *         price:
 *           $ref: '#/components/schemas/PriceInfo'
 *         inventory:
 *           $ref: '#/components/schemas/InventoryInfo'
 *         weight_kg:
 *           type: number
 *         dimensions_cm:
 *           $ref: '#/components/schemas/Dimensions'
 *
 *     PriceInfo:
 *       type: object
 *       required:
 *         - currency
 *         - amount
 *       properties:
 *         currency:
 *           type: string
 *         amount:
 *           type: number
 *         msrp:
 *           type: number
 *         discount:
 *           $ref: '#/components/schemas/DiscountInfo'
 *
 *     DiscountInfo:
 *       type: object
 *       required:
 *         - type
 *         - value
 *         - label
 *       properties:
 *         type:
 *           type: string
 *           enum: [percentage, fixed]
 *         value:
 *           type: number
 *         label:
 *           type: string
 *
 *     InventoryInfo:
 *       type: object
 *       required:
 *         - available
 *         - allocated
 *         - safety_stock
 *         - warehouse_location
 *         - backorderable
 *       properties:
 *         available:
 *           type: integer
 *           minimum: 0
 *         allocated:
 *           type: integer
 *           minimum: 0
 *         safety_stock:
 *           type: integer
 *           minimum: 0
 *         warehouse_location:
 *           type: string
 *         backorderable:
 *           type: boolean
 *         expected_restock_date:
 *           type: string
 *           format: date-time
 *
 *     Dimensions:
 *       type: object
 *       required:
 *         - length
 *         - width
 *         - height
 *       properties:
 *         length:
 *           type: number
 *         width:
 *           type: number
 *         height:
 *           type: number
 *
 *     ShippingInfo:
 *       type: object
 *       required:
 *         - weight_kg
 *         - dimensions_cm
 *         - origin
 *         - free_shipping_over
 *         - eligible_shipping_methods
 *       properties:
 *         weight_kg:
 *           type: number
 *         dimensions_cm:
 *           $ref: '#/components/schemas/Dimensions'
 *         origin:
 *           $ref: '#/components/schemas/OriginInfo'
 *         free_shipping_over:
 *           type: number
 *         eligible_shipping_methods:
 *           type: array
 *           items:
 *             type: string
 *
 *     OriginInfo:
 *       type: object
 *       required:
 *         - warehouse_id
 *         - address
 *       properties:
 *         warehouse_id:
 *           type: string
 *         address:
 *           type: string
 *
 *     WarrantyInfo:
 *       type: object
 *       required:
 *         - type
 *         - duration_days
 *         - notes
 *       properties:
 *         type:
 *           type: string
 *         duration_days:
 *           type: integer
 *         notes:
 *           type: string
 *
 *     ReturnPolicy:
 *       type: object
 *       required:
 *         - days_window
 *         - condition
 *         - restocking_fee
 *         - who_pays_return_shipping
 *         - exceptions
 *       properties:
 *         days_window:
 *           type: integer
 *         condition:
 *           type: string
 *         restocking_fee:
 *           type: number
 *         who_pays_return_shipping:
 *           type: string
 *         exceptions:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, description, and tags
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
 *         description: List of products
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
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     current_page:
 *                       type: integer
 *                     total_pages:
 *                       type: integer
 *                     total_items:
 *                       type: integer
 *                     items_per_page:
 *                       type: integer
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
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
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 */
router.get("/", getAllProducts);
router.post("/", createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Validation error
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

/**
 * @swagger
 * /api/products/{id}/variants:
 *   get:
 *     summary: Get product variants
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product variants
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
 *                     $ref: '#/components/schemas/ProductVariant'
 *       404:
 *         description: Product not found
 */
router.get("/:id/variants", getProductVariants);

module.exports = router;
