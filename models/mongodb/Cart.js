const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: {
          type: String,
          required: false,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
          max: [100, "Quantity cannot exceed 100"],
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountCode: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
cartSchema.index({ userId: 1 });
cartSchema.index({ isActive: 1 });
cartSchema.index({ expiresAt: 1 });
cartSchema.index({ createdAt: -1 });

// Virtual for item count
cartSchema.virtual("itemCount").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Pre-save middleware to calculate totals
cartSchema.pre("save", function (next) {
  this.subtotal = this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  this.total = this.subtotal + this.tax + this.shipping - this.discount;
  this.updatedAt = new Date();

  next();
});

// Static method to find active cart for user
cartSchema.statics.findActiveCart = function (userId) {
  return this.findOne({ userId, isActive: true });
};

// Instance method to add item to cart
cartSchema.methods.addItem = function (productId, variantId, quantity, price) {
  const existingItem = this.items.find(
    (item) =>
      item.productId.toString() === productId.toString() &&
      item.variantId === variantId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      productId,
      variantId,
      quantity,
      price,
      addedAt: new Date(),
    });
  }

  return this.save();
};

// Instance method to remove item from cart
cartSchema.methods.removeItem = function (productId, variantId) {
  this.items = this.items.filter(
    (item) =>
      !(
        item.productId.toString() === productId.toString() &&
        item.variantId === variantId
      )
  );

  return this.save();
};

// Instance method to clear cart
cartSchema.methods.clearCart = function () {
  this.items = [];
  this.subtotal = 0;
  this.tax = 0;
  this.shipping = 0;
  this.discount = 0;
  this.total = 0;

  return this.save();
};

module.exports = mongoose.model("Cart", cartSchema);
