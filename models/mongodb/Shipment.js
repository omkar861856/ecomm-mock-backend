const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    shipmentId: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        return (
          "SHP-" +
          Date.now() +
          "-" +
          Math.random().toString(36).substr(2, 9).toUpperCase()
        );
      },
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
    },
    carrier: {
      type: String,
      required: true,
      enum: ["UPS", "FedEx", "DHL", "USPS", "Amazon Logistics", "Other"],
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return (
          "TRK" +
          Date.now() +
          Math.random().toString(36).substr(2, 6).toUpperCase()
        );
      },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "picked_up",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "exception",
        "returned",
      ],
      default: "pending",
    },
    shippingAddress: {
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
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        weight: Number,
        dimensions: {
          length: Number,
          width: Number,
          height: Number,
        },
      },
    ],
    packageDetails: {
      weight: {
        type: Number,
        required: true,
        min: 0,
      },
      dimensions: {
        length: {
          type: Number,
          required: true,
          min: 0,
        },
        width: {
          type: Number,
          required: true,
          min: 0,
        },
        height: {
          type: Number,
          required: true,
          min: 0,
        },
      },
      packageType: {
        type: String,
        enum: ["envelope", "package", "box", "pallet"],
        default: "package",
      },
    },
    shippingMethod: {
      type: String,
      enum: ["ground", "express", "overnight", "international"],
      default: "ground",
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    estimatedDelivery: {
      type: Date,
      required: true,
    },
    actualDelivery: Date,
    trackingEvents: [
      {
        status: {
          type: String,
          required: true,
        },
        location: {
          city: String,
          state: String,
          country: String,
          coordinates: {
            latitude: Number,
            longitude: Number,
          },
        },
        timestamp: {
          type: Date,
          required: true,
          default: Date.now,
        },
        description: String,
        details: String,
      },
    ],
    notes: String,
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

// Indexes (shipmentId and trackingNumber already have unique indexes from schema definition)
shipmentSchema.index({ orderId: 1 });
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ carrier: 1 });
shipmentSchema.index({ createdAt: -1 });

// Virtual for current status
shipmentSchema.virtual("currentStatus").get(function () {
  return this.trackingEvents && this.trackingEvents.length > 0
    ? this.trackingEvents[this.trackingEvents.length - 1].status
    : this.status;
});

// Virtual for delivery status
shipmentSchema.virtual("isDelivered").get(function () {
  return this.status === "delivered" || this.actualDelivery !== null;
});

// Pre-save middleware to generate shipment ID
shipmentSchema.pre("save", function (next) {
  if (this.isNew && !this.shipmentId) {
    this.shipmentId =
      "SHP-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  this.updatedAt = new Date();
  next();
});

// Static method to generate shipment ID
shipmentSchema.statics.generateShipmentId = function () {
  return (
    "SHP-" +
    Date.now() +
    "-" +
    Math.random().toString(36).substr(2, 9).toUpperCase()
  );
};

// Instance method to add tracking event
shipmentSchema.methods.addTrackingEvent = function (
  status,
  location,
  description,
  details
) {
  this.trackingEvents.push({
    status,
    location,
    timestamp: new Date(),
    description,
    details,
  });

  // Update main status if it's a significant event
  if (["delivered", "exception", "returned"].includes(status)) {
    this.status = status;
  }

  return this.save();
};

// Instance method to mark as delivered
shipmentSchema.methods.markDelivered = function (deliveryLocation, notes) {
  this.status = "delivered";
  this.actualDelivery = new Date();

  this.addTrackingEvent(
    "delivered",
    deliveryLocation,
    "Package delivered",
    notes
  );

  return this.save();
};

// Static method to find shipments by status
shipmentSchema.statics.findByStatus = function (status) {
  return this.find({ status }).populate("orderId", "orderNumber userId");
};

// Static method to find shipments by carrier
shipmentSchema.statics.findByCarrier = function (carrier) {
  return this.find({ carrier }).populate("orderId", "orderNumber userId");
};

module.exports = mongoose.model("Shipment", shipmentSchema);
