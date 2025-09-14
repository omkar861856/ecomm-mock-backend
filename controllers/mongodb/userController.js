const User = require('../../models/mongodb/User');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = 'createdAt',
      order = 'desc',
      loyaltyTier,
      isActive
    } = req.query;
    
    // Build query
    let query = {};
    if (loyaltyTier) query.loyaltyTier = loyaltyTier;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    // Build sort object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = {};
    sortObj[sort] = sortOrder;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortObj)
      .select('-__v -paymentMethods.cardNumber -paymentMethods.cvv');

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_items: total,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-__v -paymentMethods.cardNumber -paymentMethods.cvv');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    
    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.paymentMethods?.forEach(pm => {
      delete pm.cardNumber;
      delete pm.cvv;
    });
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResponse
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v -paymentMethods.cardNumber -paymentMethods.cvv');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// Delete user (soft delete)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-__v -paymentMethods.cardNumber -paymentMethods.cvv');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// Add address to user
const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If this is the first address or marked as default, set as default
    if (user.addresses.length === 0 || req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(req.body);
    await user.save();

    res.json({
      success: true,
      message: 'Address added successfully',
      data: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding address',
      error: error.message
    });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === req.params.addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If setting as default, unset other defaults
    if (req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...req.body };
    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: user.addresses[addressIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating address',
      error: error.message
    });
  }
};

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );

    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully',
      data: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting address',
      error: error.message
    });
  }
};

// Add payment method
const addPaymentMethod = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If this is the first payment method or marked as default, set as default
    if (user.paymentMethods.length === 0 || req.body.isDefault) {
      user.paymentMethods.forEach(pm => pm.isDefault = false);
    }

    user.paymentMethods.push(req.body);
    await user.save();

    // Remove sensitive data from response
    const response = user.paymentMethods.map(pm => ({
      ...pm.toObject(),
      cardNumber: pm.cardNumber ? '**** **** **** ' + pm.cardNumber.slice(-4) : undefined,
      cvv: pm.cvv ? '***' : undefined
    }));

    res.json({
      success: true,
      message: 'Payment method added successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding payment method',
      error: error.message
    });
  }
};

// Update loyalty points
const updateLoyaltyPoints = async (req, res) => {
  try {
    const { points, action } = req.body; // action: 'add' or 'subtract'
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (action === 'add') {
      user.loyaltyPoints += points;
    } else if (action === 'subtract') {
      user.loyaltyPoints = Math.max(0, user.loyaltyPoints - points);
    }

    // Update loyalty tier based on points
    if (user.loyaltyPoints >= 10000) {
      user.loyaltyTier = 'platinum';
    } else if (user.loyaltyPoints >= 5000) {
      user.loyaltyTier = 'gold';
    } else if (user.loyaltyPoints >= 1000) {
      user.loyaltyTier = 'silver';
    } else {
      user.loyaltyTier = 'bronze';
    }

    await user.save();

    res.json({
      success: true,
      message: 'Loyalty points updated successfully',
      data: {
        loyaltyPoints: user.loyaltyPoints,
        loyaltyTier: user.loyaltyTier
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating loyalty points',
      error: error.message
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          averageLoyaltyPoints: { $avg: '$loyaltyPoints' }
        }
      }
    ]);

    const loyaltyTierStats = await User.aggregate([
      {
        $group: {
          _id: '$loyaltyTier',
          count: { $sum: 1 },
          averagePoints: { $avg: '$loyaltyPoints' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        loyaltyTiers: loyaltyTierStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addAddress,
  updateAddress,
  deleteAddress,
  addPaymentMethod,
  updateLoyaltyPoints,
  getUserStats
};
