const {
  createEntity,
  getEntity,
  getAllEntities,
  updateEntity,
  deleteEntity,
  searchEntities,
} = require("../models");
const { validateCheckout } = require("../models/Checkout");

// Create a new checkout
const createCheckout = (req, res) => {
  try {
    const validatedCheckout = validateCheckout(req.body);
    const checkout = createEntity("checkouts", validatedCheckout, "chk");

    res.status(201).json({
      success: true,
      message: "Checkout created successfully",
      data: checkout,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all checkouts
const getAllCheckouts = (req, res) => {
  try {
    const { user_id, cart_id, page = 1, limit = 10 } = req.query;
    let checkouts = getAllEntities("checkouts");

    // Apply filters
    if (user_id) {
      checkouts = checkouts.filter((checkout) => checkout.user_id === user_id);
    }

    if (cart_id) {
      checkouts = checkouts.filter((checkout) => checkout.cart_id === cart_id);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCheckouts = checkouts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedCheckouts,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(checkouts.length / limit),
        total_items: checkouts.length,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching checkouts",
      error: error.message,
    });
  }
};

// Get checkout by ID
const getCheckoutById = (req, res) => {
  try {
    const { id } = req.params;
    const checkout = getEntity("checkouts", id);

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

// Update checkout
const updateCheckout = (req, res) => {
  try {
    const { id } = req.params;
    const validatedCheckout = validateCheckout(req.body);

    const updatedCheckout = updateEntity("checkouts", id, validatedCheckout);

    if (!updatedCheckout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found",
      });
    }

    res.json({
      success: true,
      message: "Checkout updated successfully",
      data: updatedCheckout,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete checkout
const deleteCheckout = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteEntity("checkouts", id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found",
      });
    }

    res.json({
      success: true,
      message: "Checkout deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting checkout",
      error: error.message,
    });
  }
};

// Complete checkout (place order)
const completeCheckout = (req, res) => {
  try {
    const { id } = req.params;
    const checkout = getEntity("checkouts", id);

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found",
      });
    }

    // Mark checkout as placed
    checkout.placed_at = new Date().toISOString();
    checkout.payment.payment_status = "authorized";

    const updatedCheckout = updateEntity("checkouts", id, checkout);

    // Create order from checkout
    const orderData = {
      user_id: checkout.user_id,
      status: "PLACED",
      status_history: [
        {
          status: "PLACED",
          timestamp: new Date().toISOString(),
          by: "system",
          note: "Order created after successful payment authorization",
        },
      ],
      items: [], // This would be populated from cart items
      fulfillment: {
        fulfillment_id: `ful_${Date.now()}`,
        warehouse_id: "WH-DEL-1",
        fulfillment_type: "shipment",
        pick_list: [],
        packing: {
          packed: false,
          package_id: null,
          package_dimensions_cm: null,
        },
      },
      payment: {
        payment_id: `pay_${Date.now()}`,
        method: checkout.payment.selected_payment_id.includes("upi")
          ? "upi"
          : "card",
        gateway: checkout.payment.payment_gateway,
        amount: checkout.order_review.total,
        currency: checkout.order_review.currency,
        status: "authorized",
        authorized_at: new Date().toISOString(),
        captured_at: null,
        capture_attempts: 0,
      },
      shipping: {
        recipient_address_id: checkout.selected_shipping_address_id,
        shipping_method_id: checkout.shipping_method.id,
        shipping_cost: checkout.shipping_method.cost,
        carrier: null,
        tracking: {
          tracking_number: null,
          carrier: null,
          estimated_delivery: null,
          events: [],
        },
        estimated_delivery_window: {
          start: new Date(
            Date.now() +
              checkout.shipping_method.carrier_estimated_days *
                24 *
                60 *
                60 *
                1000
          ).toISOString(),
          end: new Date(
            Date.now() +
              (checkout.shipping_method.carrier_estimated_days + 1) *
                24 *
                60 *
                60 *
                1000
          ).toISOString(),
        },
      },
      totals: checkout.order_review,
      notes: "",
      metadata: {
        source: "web_checkout",
      },
    };

    const order = createEntity("orders", orderData, "order");

    res.json({
      success: true,
      message: "Checkout completed successfully",
      data: {
        checkout: updatedCheckout,
        order: order,
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

// Get all checkouts by user ID
const getCheckoutsByUserId = (req, res) => {
  try {
    const { user_id } = req.params;
    const { cart_id, page = 1, limit = 10 } = req.query;
    let checkouts = getAllEntities("checkouts");

    // Filter by user_id
    checkouts = checkouts.filter((checkout) => checkout.user_id === user_id);

    // Apply additional filters
    if (cart_id) {
      checkouts = checkouts.filter((checkout) => checkout.cart_id === cart_id);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCheckouts = checkouts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedCheckouts,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(checkouts.length / limit),
        total_items: checkouts.length,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching checkouts by user ID",
      error: error.message,
    });
  }
};

module.exports = {
  createCheckout,
  getAllCheckouts,
  getCheckoutById,
  getCheckoutsByUserId,
  updateCheckout,
  deleteCheckout,
  completeCheckout,
};
