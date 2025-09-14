const Cart = require('../../models/mongodb/Cart');
const Product = require('../../models/mongodb/Product');

// Get all carts
const getAllCarts = async (req, res) => {
  try {
    const { 
      userId, 
      page = 1, 
      limit = 10, 
      sort = 'createdAt',
      order = 'desc',
      isActive
    } = req.query;
    
    // Build query
    let query = {};
    if (userId) query.userId = userId;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    // Build sort object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = {};
    sortObj[sort] = sortOrder;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const carts = await Cart.find(query)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price images')
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortObj)
      .select('-__v');

    const total = await Cart.countDocuments(query);

    res.json({
      success: true,
      data: carts,
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
      message: 'Error fetching carts',
      error: error.message
    });
  }
};

// Get cart by ID
const getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price images')
      .select('-__v');
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// Get active cart for user
const getActiveCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cart = await Cart.findActiveCart(userId)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price images')
      .select('-__v');
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'No active cart found for user'
      });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active cart',
      error: error.message
    });
  }
};

// Create new cart
const createCart = async (req, res) => {
  try {
    const cart = new Cart(req.body);
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price images')
      .select('-__v');
    
    res.status(201).json({
      success: true,
      message: 'Cart created successfully',
      data: populatedCart
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
    
    res.status(500).json({
      success: false,
      message: 'Error creating cart',
      error: error.message
    });
  }
};

// Update cart
const updateCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('userId', 'name email')
      .populate('items.productId', 'name price images')
      .select('-__v');
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: cart
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
    
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
};

// Delete cart (soft delete)
const deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )
      .populate('userId', 'name email')
      .populate('items.productId', 'name price images')
      .select('-__v');
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    res.json({
      success: true,
      message: 'Cart deleted successfully',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting cart',
      error: error.message
    });
  }
};

// Add item to cart
const addItemToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, variantId, quantity, price } = req.body;
    
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    await cart.addItem(productId, variantId, quantity, price);
    
    const updatedCart = await Cart.findById(cart._id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price images')
      .select('-__v');
    
    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

// Remove item from cart
const removeItemFromCart = async (req, res) => {
  try {
    const { id, productId, variantId } = req.params;
    
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    await cart.removeItem(productId, variantId);
    
    const updatedCart = await Cart.findById(cart._id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price images')
      .select('-__v');
    
    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    await cart.clearCart();
    
    const updatedCart = await Cart.findById(cart._id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price images')
      .select('-__v');
    
    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};

// Apply discount to cart
const applyDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { discountCode, discountAmount } = req.body;
    
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.discountCode = discountCode;
    cart.discount = discountAmount || 0;
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price images')
      .select('-__v');
    
    res.json({
      success: true,
      message: 'Discount applied successfully',
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error applying discount',
      error: error.message
    });
  }
};

// Get cart statistics
const getCartStats = async (req, res) => {
  try {
    const stats = await Cart.aggregate([
      {
        $group: {
          _id: null,
          totalCarts: { $sum: 1 },
          activeCarts: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          averageCartValue: { $avg: '$total' },
          totalCartValue: { $sum: '$total' }
        }
      }
    ]);

    const userCartStats = await Cart.aggregate([
      {
        $group: {
          _id: '$userId',
          cartCount: { $sum: 1 },
          totalValue: { $sum: '$total' },
          averageValue: { $avg: '$total' }
        }
      },
      { $sort: { totalValue: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        topUsers: userCartStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllCarts,
  getCartById,
  getActiveCart,
  createCart,
  updateCart,
  deleteCart,
  addItemToCart,
  removeItemFromCart,
  clearCart,
  applyDiscount,
  getCartStats
};
