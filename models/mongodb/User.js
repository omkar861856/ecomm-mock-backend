const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\+?[\d\s-()]+$/, "Please enter a valid phone number"],
    },
    addresses: [
      {
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
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    paymentMethods: [
      {
        type: {
          type: String,
          enum: ["credit_card", "debit_card", "paypal", "bank_transfer"],
          required: true,
        },
        cardNumber: {
          type: String,
          required: function () {
            return ["credit_card", "debit_card"].includes(this.type);
          },
        },
        expiryDate: {
          type: String,
          required: function () {
            return ["credit_card", "debit_card"].includes(this.type);
          },
        },
        cvv: {
          type: String,
          required: function () {
            return ["credit_card", "debit_card"].includes(this.type);
          },
        },
        cardholderName: {
          type: String,
          required: function () {
            return ["credit_card", "debit_card"].includes(this.type);
          },
        },
        billingAddress: {
          street: String,
          city: String,
          state: String,
          zipCode: String,
          country: String,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    loyaltyTier: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum"],
      default: "bronze",
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    preferences: {
      newsletter: {
        type: Boolean,
        default: true,
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: false,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
      currency: {
        type: String,
        default: "USD",
      },
      language: {
        type: String,
        default: "en",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
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

// Indexes (email already has unique index from schema definition)
userSchema.index({ phone: 1 });
userSchema.index({ loyaltyTier: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for default address
userSchema.virtual("defaultAddress").get(function () {
  return (
    (this.addresses && this.addresses.find((addr) => addr.isDefault)) ||
    (this.addresses && this.addresses[0])
  );
});

// Virtual for default payment method
userSchema.virtual("defaultPaymentMethod").get(function () {
  return (
    (this.paymentMethods && this.paymentMethods.find((pm) => pm.isDefault)) ||
    (this.paymentMethods && this.paymentMethods[0])
  );
});

// Pre-save middleware
userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("User", userSchema);
