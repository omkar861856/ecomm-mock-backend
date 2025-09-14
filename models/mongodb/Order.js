const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        return (
          "ORD-" +
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
      cardholderName: String,
      transactionId: String,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        notes: String,
        updatedBy: String,
      },
    ],
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
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    refundReason: String,
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
orderSchema.index({ userId: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ trackingNumber: 1 });

// Virtual for order status
orderSchema.virtual("currentStatus").get(function () {
  return this.statusHistory.length > 0
    ? this.statusHistory[this.statusHistory.length - 1].status
    : this.status;
});

// Pre-save middleware to generate order number
orderSchema.pre("save", function (next) {
  if (this.isNew && !this.orderNumber) {
    this.orderNumber =
      "ORD-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  // Add status to history if status changed
  if (this.isModified("status") && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      notes: "Status updated",
    });
  }

  this.updatedAt = new Date();
  next();
});

// Static method to generate order number
orderSchema.statics.generateOrderNumber = function () {
  return (
    "ORD-" +
    Date.now() +
    "-" +
    Math.random().toString(36).substr(2, 9).toUpperCase()
  );
};

// Instance method to update status
orderSchema.methods.updateStatus = function (
  newStatus,
  notes = "",
  updatedBy = "system"
) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    notes,
    updatedBy,
  });

  return this.save();
};

// Instance method to cancel order
orderSchema.methods.cancelOrder = function (reason = "Customer request") {
  if (["shipped", "delivered"].includes(this.status)) {
    throw new Error("Cannot cancel order that has been shipped or delivered");
  }

  return this.updateStatus("cancelled", reason, "system");
};

module.exports = mongoose.model("Order", orderSchema);
