const Checkout = require("../../models/mongodb/Checkout");
const Cart = require("../../models/mongodb/Cart");
const User = require("../../models/mongodb/User");
const Order = require("../../models/mongodb/Order");
const mongoose = require("mongoose");

// Get all checkouts
const getAllCheckouts = async (req, res) => {
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

    // Build sort object
    const sortOrder = order === "desc" ? -1 : 1;
    const sortObj = {};
    sortObj[sort] = sortOrder;

    // Pagination
    const skip = (pageNum - 1) * limitNum;

    const checkouts = await Checkout.find(query)
      .populate("userId", "name email phone")
      .populate("cartId", "total items")
      .populate("items.productId", "name price images")
      .skip(skip)
      .limit(limitNum)
      .sort(sortObj)
      .select("-__v");

    const total = await Checkout.countDocuments(query);

    res.json({
      success: true,
      data: checkouts,
      pagination: {
        current_page: pageNum,
        total_pages: Math.ceil(total / limitNum),
        total_items: total,
        items_per_page: limitNum,
      },
    });
  } catch (error) {
    console.error("Error in getAllCheckouts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching checkouts",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Get checkout by ID
const getCheckoutById = async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("cartId", "total items")
      .populate("items.productId", "name price images")
      .select("-__v");

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found",
      });
    }

    res.json({
      success: true,
      data: checkout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching checkout",
      error: error.message,
    });
  }
};

// Get checkout by checkout ID
const getCheckoutByCheckoutId = async (req, res) => {
  try {
    const { checkoutId } = req.params;

    const checkout = await Checkout.findOne({ checkoutId })
      .populate("userId", "name email phone")
      .populate("cartId", "total items")
      .populate("items.productId", "name price images")
      .select("-__v");

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found",
      });
    }

    res.json({
      success: true,
      data: checkout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching checkout",
      error: error.message,
    });
  }
};

// Create new checkout
const createCheckout = async (req, res) => {
  try {
    // Verify user exists
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify cart exists and is active
    const cart = await Cart.findById(req.body.cartId);
    if (!cart || !cart.isActive) {
      return res.status(404).json({
        success: false,
        message: "Cart not found or inactive",
      });
    }

    // Copy items from cart to checkout
    req.body.items = cart.items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      productName: item.productName || "Product",
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }));

    // Set totals from cart
    req.body.subtotal = cart.subtotal;
    req.body.tax = cart.tax || 0;
    req.body.shipping = cart.shipping || 0;
    req.body.discount = cart.discount || 0;
    req.body.discountCode = cart.discountCode;
    req.body.total = cart.total;

    const checkout = new Checkout(req.body);
    await checkout.save();

    const populatedCheckout = await Checkout.findById(checkout._id)
      .populate("userId", "name email phone")
      .populate("cartId", "total items")
      .populate("items.productId", "name price images")
      .select("-__v");

    res.status(201).json({
      success: true,
      message: "Checkout created successfully",
      data: populatedCheckout,
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
      message: "Error creating checkout",
      error: error.message,
    });
  }
};

// Update checkout
const updateCheckout = async (req, res) => {
  try {
    const checkout = await Checkout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("userId", "name email phone")
      .populate("cartId", "total items")
      .populate("items.productId", "name price images")
      .select("-__v");

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found",
      });
    }

    res.json({
      success: true,
      message: "Checkout updated successfully",
      data: checkout,
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
      message: "Error updating checkout",
      error: error.message,
    });
  }
};

// Complete checkout
const completeCheckout = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId, paymentIntentId } = req.body;

    const checkout = await Checkout.findById(id);
    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found",
      });
    }

    if (checkout.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Checkout is not in pending status",
      });
    }

    // Complete the checkout
    await checkout.completeCheckout(transactionId, paymentIntentId);

    // Create order from checkout
    const orderData = {
      userId: checkout.userId,
      items: checkout.items,
      shippingAddress: checkout.shippingAddress,
      billingAddress: checkout.billingAddress,
      paymentMethod: checkout.paymentMethod,
      subtotal: checkout.subtotal,
      tax: checkout.tax,
      shipping: checkout.shipping,
      discount: checkout.discount,
      total: checkout.total,
      status: "confirmed",
      notes: `Order created from checkout ${checkout.checkoutId}`,
    };

    const order = new Order(orderData);
    await order.save();

    // Clear the cart
    const cart = await Cart.findById(checkout.cartId);
    if (cart) {
      await cart.clearCart();
    }

    const updatedCheckout = await Checkout.findById(checkout._id)
      .populate("userId", "name email phone")
      .populate("cartId", "total items")
      .populate("items.productId", "name price images")
      .select("-__v");

    res.json({
      success: true,
      message: "Checkout completed successfully",
      data: {
        checkout: updatedCheckout,
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.total,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error completing checkout",
      error: error.message,
    });
  }
};

// Fail checkout
const failCheckout = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const checkout = await Checkout.findById(id);
    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found",
      });
    }

    await checkout.failCheckout(reason);

    const updatedCheckout = await Checkout.findById(checkout._id)
      .populate("userId", "name email phone")
      .populate("cartId", "total items")
      .populate("items.productId", "name price images")
      .select("-__v");

    res.json({
      success: true,
      message: "Checkout marked as failed",
      data: updatedCheckout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error failing checkout",
      error: error.message,
    });
  }
};

// Cancel checkout
const cancelCheckout = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const checkout = await Checkout.findByIdAndUpdate(
      id,
      {
        status: "cancelled",
        notes: reason || "Checkout cancelled by user",
      },
      { new: true }
    )
      .populate("userId", "name email phone")
      .populate("cartId", "total items")
      .populate("items.productId", "name price images")
      .select("-__v");

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found",
      });
    }

    res.json({
      success: true,
      message: "Checkout cancelled successfully",
      data: checkout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling checkout",
      error: error.message,
    });
  }
};

// Clean up expired checkouts
const cleanupExpiredCheckouts = async (req, res) => {
  try {
    const result = await Checkout.cleanupExpired();

    res.json({
      success: true,
      message: `Cleaned up ${result.deletedCount} expired checkouts`,
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cleaning up expired checkouts",
      error: error.message,
    });
  }
};

// Get checkout statistics
const getCheckoutStats = async (req, res) => {
  try {
    const stats = await Checkout.aggregate([
      {
        $group: {
          _id: null,
          totalCheckouts: { $sum: 1 },
          completedCheckouts: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          failedCheckouts: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
          },
          pendingCheckouts: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          cancelledCheckouts: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
          totalRevenue: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$total", 0] },
          },
          averageCheckoutValue: { $avg: "$total" },
        },
      },
    ]);

    const statusStats = await Checkout.aggregate([
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

    const hourlyStats = await Checkout.aggregate([
      {
        $group: {
          _id: { $hour: "$createdAt" },
          count: { $sum: 1 },
          completedCount: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        statusBreakdown: statusStats,
        hourlyTrends: hourlyStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching checkout statistics",
      error: error.message,
    });
  }
};

// Get all checkouts by user ID (alias for getAllCheckouts with user_id parameter)
const getCheckoutsByUserId = async (req, res) => {
  // Extract user_id from params and add it to query
  req.query.user_id = req.params.user_id;
  return getAllCheckouts(req, res);
};

module.exports = {
  getAllCheckouts,
  getCheckoutById,
  getCheckoutByCheckoutId,
  getCheckoutsByUserId,
  createCheckout,
  updateCheckout,
  completeCheckout,
  failCheckout,
  cancelCheckout,
  cleanupExpiredCheckouts,
  getCheckoutStats,
};
