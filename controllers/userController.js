const {
  createEntity,
  getEntity,
  getAllEntities,
  updateEntity,
  deleteEntity,
  searchEntities,
} = require("../models");
const { validateUser } = require("../models/User");

// Create a new user
const createUser = (req, res) => {
  try {
    const validatedUser = validateUser(req.body);
    const user = createEntity("users", validatedUser, "user");

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all users
const getAllUsers = (req, res) => {
  try {
    const { loyalty_tier, page = 1, limit = 10 } = req.query;
    let users = getAllEntities("users");

    // Apply filters
    if (loyalty_tier) {
      users = users.filter(
        (user) => user.loyalty_tier.toLowerCase() === loyalty_tier.toLowerCase()
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(users.length / limit),
        total_items: users.length,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// Get user by ID
const getUserById = (req, res) => {
  try {
    const { id } = req.params;
    const user = getEntity("users", id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

// Update user
const updateUser = (req, res) => {
  try {
    const { id } = req.params;
    const validatedUser = validateUser(req.body);

    const updatedUser = updateEntity("users", id, validatedUser);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete user
const deleteUser = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteEntity("users", id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// Add address to user
const addUserAddress = (req, res) => {
  try {
    const { id } = req.params;
    const user = getEntity("users", id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newAddress = {
      address_id: `addr_${Date.now()}`,
      ...req.body,
    };

    user.addresses.push(newAddress);
    const updatedUser = updateEntity("users", id, {
      addresses: user.addresses,
    });

    res.json({
      success: true,
      message: "Address added successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding address",
      error: error.message,
    });
  }
};

// Add payment method to user
const addUserPaymentMethod = (req, res) => {
  try {
    const { id } = req.params;
    const user = getEntity("users", id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newPaymentMethod = {
      payment_id: `pm_${Date.now()}`,
      ...req.body,
    };

    user.payment_methods.push(newPaymentMethod);
    const updatedUser = updateEntity("users", id, {
      payment_methods: user.payment_methods,
    });

    res.json({
      success: true,
      message: "Payment method added successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding payment method",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  addUserAddress,
  addUserPaymentMethod,
};
