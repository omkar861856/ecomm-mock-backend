const {
  createEntity,
  getEntity,
  getAllEntities,
  updateEntity,
  deleteEntity,
  searchEntities,
} = require("../models");
const { validateOrder } = require("../models/Order");

// Create a new order
const createOrder = (req, res) => {
  try {
    const validatedOrder = validateOrder(req.body);
    const order = createEntity("orders", validatedOrder, "order");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all orders
const getAllOrders = (req, res) => {
  try {
    const { user_id, status, page = 1, limit = 10 } = req.query;
    let orders = getAllEntities("orders");

    // Apply filters
    if (user_id) {
      orders = orders.filter((order) => order.user_id === user_id);
    }

    if (status) {
      orders = orders.filter((order) => order.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedOrders = orders.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(orders.length / limit),
        total_items: orders.length,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// Get order by ID
const getOrderById = (req, res) => {
  try {
    const { id } = req.params;
    const order = getEntity("orders", id);

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

// Update order
const updateOrder = (req, res) => {
  try {
    const { id } = req.params;
    const validatedOrder = validateOrder(req.body);

    const updatedOrder = updateEntity("orders", id, validatedOrder);

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete order
const deleteOrder = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteEntity("orders", id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting order",
      error: error.message,
    });
  }
};

// Update order status
const updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const order = getEntity("orders", id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Add status change to history
    const statusChange = {
      status,
      timestamp: new Date().toISOString(),
      by: req.body.by || "system",
      note: note || `Order status changed to ${status}`,
    };

    order.status_history.push(statusChange);
    order.status = status;

    const updatedOrder = updateEntity("orders", id, order);

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
const cancelOrder = (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = getEntity("orders", id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order can be cancelled
    if (!["PLACED", "CONFIRMED"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled in current status",
      });
    }

    // Add cancellation to status history
    const statusChange = {
      status: "CANCELLED",
      timestamp: new Date().toISOString(),
      by: req.body.by || "system",
      note: reason || "Order cancelled by user",
    };

    order.status_history.push(statusChange);
    order.status = "CANCELLED";

    const updatedOrder = updateEntity("orders", id, order);

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

// Get all orders by user ID
const getOrdersByUserId = (req, res) => {
  try {
    const { user_id } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    let orders = getAllEntities("orders");

    // Filter by user_id
    orders = orders.filter((order) => order.user_id === user_id);

    // Apply additional filters
    if (status) {
      orders = orders.filter((order) => order.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedOrders = orders.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(orders.length / limit),
        total_items: orders.length,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders by user ID",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  cancelOrder,
};
