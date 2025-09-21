const Order = require("../../models/mongodb/Order");
const User = require("../../models/mongodb/User");
const Product = require("../../models/mongodb/Product");
const mongoose = require("mongoose");

// Get all orders
const getAllOrders = async (req, res) => {
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
      userId,
      user_id, // Handle both parameter names for compatibility
      status,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      startDate,
      endDate,
    } = req.query;

    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Cap at 100 items per page

    // Build query
    let query = {};
    const userIdParam = userId || user_id; // Use either parameter name
    if (userIdParam) {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(userIdParam)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format",
          error: "User ID must be a valid MongoDB ObjectId",
        });
      }
      query.userId = userIdParam;
    }
    if (status) query.status = status;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid start date format",
            error: "Start date must be a valid date",
          });
        }
        query.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid end date format",
            error: "End date must be a valid date",
          });
        }
        query.createdAt.$lte = end;
      }
    }

    // Build sort object
    const sortOrder = order === "desc" ? -1 : 1;
    const sortObj = {};
    sortObj[sort] = sortOrder;

    // Pagination
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .populate("userId", "name email phone")
      .populate("items.productId", "name price images")
      .skip(skip)
      .limit(limitNum)
      .sort(sortObj)
      .select("-__v");

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        current_page: pageNum,
        total_pages: Math.ceil(total / limitNum),
        total_items: total,
        items_per_page: limitNum,
      },
    });
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("items.productId", "name price images")
      .select("-__v");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};

// Get order by order number
const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber })
      .populate("userId", "name email phone")
      .populate("items.productId", "name price images")
      .select("-__v");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    // Verify user exists
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify products exist
    const productIds = req.body.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products not found",
      });
    }

    // Add product names to items
    req.body.items = req.body.items.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString()
      );
      return {
        ...item,
        productName: product.name,
      };
    });

    const order = new Order(req.body);
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("userId", "name email phone")
      .populate("items.productId", "name price images")
      .select("-__v");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: populatedOrder,
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
      message: "Error creating order",
      error: error.message,
    });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("userId", "name email phone")
      .populate("items.productId", "name price images")
      .select("-__v");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order updated successfully",
      data: order,
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
      message: "Error updating order",
      error: error.message,
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, updatedBy } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.updateStatus(status, notes, updatedBy);

    const updatedOrder = await Order.findById(order._id)
      .populate("userId", "name email phone")
      .populate("items.productId", "name price images")
      .select("-__v");

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.cancelOrder(reason);

    const updatedOrder = await Order.findById(order._id)
      .populate("userId", "name email phone")
      .populate("items.productId", "name price images")
      .select("-__v");

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
};

// Add tracking number
const addTrackingNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber, estimatedDelivery } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      {
        trackingNumber,
        estimatedDelivery: estimatedDelivery
          ? new Date(estimatedDelivery)
          : undefined,
      },
      { new: true }
    )
      .populate("userId", "name email phone")
      .populate("items.productId", "name price images")
      .select("-__v");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update status to shipped if tracking number is added
    if (trackingNumber && order.status === "confirmed") {
      await order.updateStatus("shipped", "Tracking number added", "system");
    }

    const updatedOrder = await Order.findById(order._id)
      .populate("userId", "name email phone")
      .populate("items.productId", "name price images")
      .select("-__v");

    res.json({
      success: true,
      message: "Tracking number added successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding tracking number",
      error: error.message,
    });
  }
};

// Mark order as delivered
const markAsDelivered = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.actualDelivery = new Date();
    await order.updateStatus("delivered", "Order delivered", "system");

    const updatedOrder = await Order.findById(order._id)
      .populate("userId", "name email phone")
      .populate("items.productId", "name price images")
      .select("-__v");

    res.json({
      success: true,
      message: "Order marked as delivered successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking order as delivered",
      error: error.message,
    });
  }
};

// Process refund
const processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { refundAmount, refundReason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.refundAmount = refundAmount || order.total;
    order.refundReason = refundReason;
    await order.updateStatus(
      "refunded",
      `Refund processed: ${refundReason}`,
      "system"
    );

    const updatedOrder = await Order.findById(order._id)
      .populate("userId", "name email phone")
      .populate("items.productId", "name price images")
      .select("-__v");

    res.json({
      success: true,
      message: "Refund processed successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing refund",
      error: error.message,
    });
  }
};

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$total" },
          averageOrderValue: { $avg: "$total" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "shipped"] }, 1, 0] },
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalValue: { $sum: "$total" },
          averageValue: { $avg: "$total" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const monthlyStats = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        statusBreakdown: statusStats,
        monthlyTrends: monthlyStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order statistics",
      error: error.message,
    });
  }
};

// Get all orders by user ID (alias for getAllOrders with user_id parameter)
const getOrdersByUserId = async (req, res) => {
  // Extract user_id from params and add it to query
  req.query.user_id = req.params.user_id;
  return getAllOrders(req, res);
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrderByNumber,
  getOrdersByUserId,
  createOrder,
  updateOrder,
  updateOrderStatus,
  cancelOrder,
  addTrackingNumber,
  markAsDelivered,
  processRefund,
  getOrderStats,
};
