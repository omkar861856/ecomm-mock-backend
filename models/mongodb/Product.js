const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: [
        "electronics",
        "clothing",
        "books",
        "home",
        "sports",
        "beauty",
        "automotive",
        "toys",
      ],
    },
    brand: {
      type: String,
      required: [true, "Product brand is required"],
      trim: true,
    },
    variants: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        stock: {
          type: Number,
          default: 0,
          min: 0,
        },
        attributes: {
          color: String,
          size: String,
          material: String,
          weight: String,
        },
        sku: {
          type: String,
          unique: true,
          sparse: true,
        },
      },
    ],
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    tags: [String],
    specifications: {
      weight: String,
      dimensions: String,
      material: String,
      warranty: String,
      features: [String],
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

// Indexes for better performance
productSchema.index({ name: "text", description: "text", brand: "text" });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for primary image
productSchema.virtual("primaryImage").get(function () {
  const primaryImg = this.images.find((img) => img.isPrimary);
  return primaryImg
    ? primaryImg.url
    : this.images[0]
    ? this.images[0].url
    : null;
});

// Pre-save middleware to update timestamps
productSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Product", productSchema);
