const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema(
  {
    checkoutId: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        return (
          "CHK-" +
          Date.now() +
          "-" +
          Math.random().toString(36).substr(2, 9).toUpperCase()
        );
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: String,
        productName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        total: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    shippingAddress: {
      type: {
        type: String,
        enum: ["home", "work", "other"],
        default: "home",
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
        default: "United States",
      },
      phone: String,
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    paymentMethod: {
      type: {
        type: String,
        enum: ["credit_card", "debit_card", "paypal", "bank_transfer"],
        required: true,
      },
      cardNumber: String,
      expiryDate: String,
      cvv: String,
      cardholderName: String,
    },
    shippingMethod: {
      type: String,
      enum: ["standard", "express", "overnight"],
      default: "standard",
    },
    subtotal: {
      type: Number,
      required: true,
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
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountCode: String,
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentIntentId: String,
    transactionId: String,
    notes: String,
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      },
    },
    completedAt: Date,
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
checkoutSchema.index({ userId: 1 });
checkoutSchema.index({ checkoutId: 1 });
checkoutSchema.index({ cartId: 1 });
checkoutSchema.index({ status: 1 });
checkoutSchema.index({ expiresAt: 1 });
checkoutSchema.index({ createdAt: -1 });

// Virtual for checkout status
checkoutSchema.virtual("isExpired").get(function () {
  return this.expiresAt < new Date();
});

// Virtual for item count
checkoutSchema.virtual("itemCount").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Pre-save middleware to generate checkout ID
checkoutSchema.pre("save", function (next) {
  if (this.isNew && !this.checkoutId) {
    this.checkoutId =
      "CHK-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  this.updatedAt = new Date();
  next();
});

// Static method to generate checkout ID
checkoutSchema.statics.generateCheckoutId = function () {
  return (
    "CHK-" +
    Date.now() +
    "-" +
    Math.random().toString(36).substr(2, 9).toUpperCase()
  );
};

// Instance method to complete checkout
checkoutSchema.methods.completeCheckout = function (
  transactionId,
  paymentIntentId
) {
  this.status = "completed";
  this.paymentStatus = "completed";
  this.transactionId = transactionId;
  this.paymentIntentId = paymentIntentId;
  this.completedAt = new Date();

  return this.save();
};

// Instance method to fail checkout
checkoutSchema.methods.failCheckout = function (reason) {
  this.status = "failed";
  this.paymentStatus = "failed";
  this.notes = reason;

  return this.save();
};

// Static method to clean up expired checkouts
checkoutSchema.statics.cleanupExpired = function () {
  return this.deleteMany({
    status: "pending",
    expiresAt: { $lt: new Date() },
  });
};

module.exports = mongoose.model("Checkout", checkoutSchema);
