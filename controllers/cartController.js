const {
  createEntity,
  getEntity,
  getAllEntities,
  updateEntity,
  deleteEntity,
  searchEntities,
} = require("../models");
const { validateCart } = require("../models/Cart");

// Create a new cart
const createCart = (req, res) => {
  try {
    const validatedCart = validateCart(req.body);
    const cart = createEntity("carts", validatedCart, "cart");

    res.status(201).json({
      success: true,
      message: "Cart created successfully",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all carts
const getAllCarts = (req, res) => {
  try {
    const { user_id, page = 1, limit = 10 } = req.query;
    let carts = getAllEntities("carts");

    // Apply filters
    if (user_id) {
      carts = carts.filter((cart) => cart.user_id === user_id);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCarts = carts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedCarts,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(carts.length / limit),
        total_items: carts.length,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching carts",
      error: error.message,
    });
  }
};

// Get cart by ID
const getCartById = (req, res) => {
  try {
    const { id } = req.params;
    const cart = getEntity("carts", id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

// Update cart
const updateCart = (req, res) => {
  try {
    const { id } = req.params;
    const validatedCart = validateCart(req.body);

    const updatedCart = updateEntity("carts", id, validatedCart);

    if (!updatedCart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    res.json({
      success: true,
      message: "Cart updated successfully",
      data: updatedCart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete cart
const deleteCart = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteEntity("carts", id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    res.json({
      success: true,
      message: "Cart deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting cart",
      error: error.message,
    });
  }
};

// Add item to cart
const addItemToCart = (req, res) => {
  try {
    const { id } = req.params;
    const cart = getEntity("carts", id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const { variant_id, quantity, unit_price } = req.body;
    const line_total = quantity * unit_price;

    const newItem = {
      variant_id,
      quantity,
      unit_price,
      line_total,
    };

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.variant_id === variant_id
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].line_total =
        cart.items[existingItemIndex].quantity *
        cart.items[existingItemIndex].unit_price;
    } else {
      // Add new item
      cart.items.push(newItem);
    }

    // Recalculate cart total
    cart.cart_total = cart.items.reduce(
      (total, item) => total + item.line_total,
      0
    );

    const updatedCart = updateEntity("carts", id, cart);

    res.json({
      success: true,
      message: "Item added to cart successfully",
      data: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding item to cart",
      error: error.message,
    });
  }
};

// Remove item from cart
const removeItemFromCart = (req, res) => {
  try {
    const { id, variant_id } = req.params;
    const cart = getEntity("carts", id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter((item) => item.variant_id !== variant_id);

    // Recalculate cart total
    cart.cart_total = cart.items.reduce(
      (total, item) => total + item.line_total,
      0
    );

    const updatedCart = updateEntity("carts", id, cart);

    res.json({
      success: true,
      message: "Item removed from cart successfully",
      data: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing item from cart",
      error: error.message,
    });
  }
};

// Get all carts by user ID
const getCartsByUserId = (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    let carts = getAllEntities("carts");

    // Filter by user_id
    carts = carts.filter((cart) => cart.user_id === user_id);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCarts = carts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedCarts,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(carts.length / limit),
        total_items: carts.length,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching carts by user ID",
      error: error.message,
    });
  }
};

module.exports = {
  createCart,
  getAllCarts,
  getCartById,
  getCartsByUserId,
  updateCart,
  deleteCart,
  addItemToCart,
  removeItemFromCart,
};
