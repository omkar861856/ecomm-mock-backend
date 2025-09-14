const Shipment = require("../../models/mongodb/Shipment");
const Order = require("../../models/mongodb/Order");
const Product = require("../../models/mongodb/Product");
const mongoose = require("mongoose");

// Get all shipments
const getAllShipments = async (req, res) => {
  try {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
        error: "Service temporarily unavailable",
      });
    }

    const {
      orderId,
      status,
      carrier,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Cap at 100 items per page

    // Build query
    let query = {};
    if (orderId) {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID format",
          error: "Order ID must be a valid MongoDB ObjectId",
        });
      }
      query.orderId = orderId;
    }
    if (status) query.status = status;
    if (carrier) query.carrier = carrier;

    // Build sort object
    const sortOrder = order === "desc" ? -1 : 1;
    const sortObj = {};
    sortObj[sort] = sortOrder;

    // Pagination
    const skip = (pageNum - 1) * limitNum;

    const shipments = await Shipment.find(query)
      .populate("orderId", "orderNumber userId status")
      .populate("items.productId", "name price images")
      .skip(skip)
      .limit(limitNum)
      .sort(sortObj)
      .select("-__v");

    const total = await Shipment.countDocuments(query);

    res.json({
      success: true,
      data: shipments,
      pagination: {
        current_page: pageNum,
        total_pages: Math.ceil(total / limitNum),
        total_items: total,
        items_per_page: limitNum,
      },
    });
  } catch (error) {
    console.error("Error in getAllShipments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching shipments",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Get shipment by ID
const getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id)
      .populate("orderId", "orderNumber userId status")
      .populate("items.productId", "name price images")
      .select("-__v");

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching shipment",
      error: error.message,
    });
  }
};

// Get shipment by tracking number
const getShipmentByTrackingNumber = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const shipment = await Shipment.findOne({ trackingNumber })
      .populate("orderId", "orderNumber userId status")
      .populate("items.productId", "name price images")
      .select("-__v");

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching shipment",
      error: error.message,
    });
  }
};

// Create new shipment
const createShipment = async (req, res) => {
  try {
    // Verify order exists
    const order = await Order.findById(req.body.orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Copy order details to shipment
    req.body.orderNumber = order.orderNumber;
    req.body.shippingAddress = order.shippingAddress;

    // Copy items from order
    req.body.items = order.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      weight: item.weight || 0,
      dimensions: item.dimensions || { length: 0, width: 0, height: 0 },
    }));

    const shipment = new Shipment(req.body);
    await shipment.save();

    const populatedShipment = await Shipment.findById(shipment._id)
      .populate("orderId", "orderNumber userId status")
      .populate("items.productId", "name price images")
      .select("-__v");

    res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      data: populatedShipment,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating shipment",
      error: error.message,
    });
  }
};

// Update shipment
const updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("orderId", "orderNumber userId status")
      .populate("items.productId", "name price images")
      .select("-__v");

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.json({
      success: true,
      message: "Shipment updated successfully",
      data: shipment,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating shipment",
      error: error.message,
    });
  }
};

// Add tracking event
const addTrackingEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, location, description, details } = req.body;

    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    await shipment.addTrackingEvent(status, location, description, details);

    const updatedShipment = await Shipment.findById(shipment._id)
      .populate("orderId", "orderNumber userId status")
      .populate("items.productId", "name price images")
      .select("-__v");

    res.json({
      success: true,
      message: "Tracking event added successfully",
      data: updatedShipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding tracking event",
      error: error.message,
    });
  }
};

// Mark as delivered
const markAsDelivered = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryLocation, notes } = req.body;

    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    await shipment.markDelivered(deliveryLocation, notes);

    // Update order status to delivered
    const order = await Order.findById(shipment.orderId);
    if (order) {
      await order.updateStatus("delivered", "Package delivered", "system");
    }

    const updatedShipment = await Shipment.findById(shipment._id)
      .populate("orderId", "orderNumber userId status")
      .populate("items.productId", "name price images")
      .select("-__v");

    res.json({
      success: true,
      message: "Shipment marked as delivered successfully",
      data: updatedShipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking shipment as delivered",
      error: error.message,
    });
  }
};

// Get shipments by status
const getShipmentsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const shipments = await Shipment.findByStatus(status)
      .populate("orderId", "orderNumber userId status")
      .populate("items.productId", "name price images")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .select("-__v");

    const total = await Shipment.countDocuments({ status });

    res.json({
      success: true,
      data: shipments,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_items: total,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching shipments by status",
      error: error.message,
    });
  }
};

// Get shipments by carrier
const getShipmentsByCarrier = async (req, res) => {
  try {
    const { carrier } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const shipments = await Shipment.findByCarrier(carrier)
      .populate("orderId", "orderNumber userId status")
      .populate("items.productId", "name price images")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .select("-__v");

    const total = await Shipment.countDocuments({ carrier });

    res.json({
      success: true,
      data: shipments,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_items: total,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching shipments by carrier",
      error: error.message,
    });
  }
};

// Get shipment statistics
const getShipmentStats = async (req, res) => {
  try {
    const stats = await Shipment.aggregate([
      {
        $group: {
          _id: null,
          totalShipments: { $sum: 1 },
          pendingShipments: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          inTransitShipments: {
            $sum: { $cond: [{ $eq: ["$status", "in_transit"] }, 1, 0] },
          },
          deliveredShipments: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
          },
          exceptionShipments: {
            $sum: { $cond: [{ $eq: ["$status", "exception"] }, 1, 0] },
          },
          totalShippingCost: { $sum: "$cost" },
          averageShippingCost: { $avg: "$cost" },
        },
      },
    ]);

    const carrierStats = await Shipment.aggregate([
      {
        $group: {
          _id: "$carrier",
          count: { $sum: 1 },
          totalCost: { $sum: "$cost" },
          averageCost: { $avg: "$cost" },
          deliveredCount: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const statusStats = await Shipment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalCost: { $sum: "$cost" },
          averageCost: { $avg: "$cost" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const monthlyStats = await Shipment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          totalCost: { $sum: "$cost" },
          deliveredCount: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        carrierBreakdown: carrierStats,
        statusBreakdown: statusStats,
        monthlyTrends: monthlyStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching shipment statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getAllShipments,
  getShipmentById,
  getShipmentByTrackingNumber,
  createShipment,
  updateShipment,
  addTrackingEvent,
  markAsDelivered,
  getShipmentsByStatus,
  getShipmentsByCarrier,
  getShipmentStats,
};
