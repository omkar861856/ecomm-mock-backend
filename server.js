const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

// Import database connection
const connectDB = require("./config/database");
const mongoose = require("mongoose");

// Import routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");

const app = express();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description:
        "A comprehensive e-commerce API with CRUD operations for products, users, orders, carts, checkouts, and shipments",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            error: {
              type: "string",
              example: "Detailed error information",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
            data: {
              type: "object",
              description: "Response data",
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            current_page: {
              type: "integer",
              example: 1,
            },
            total_pages: {
              type: "integer",
              example: 10,
            },
            total_items: {
              type: "integer",
              example: 100,
            },
            items_per_page: {
              type: "integer",
              example: 10,
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "Resource not found",
              },
            },
          },
        },
        ValidationError: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "Validation error: field is required",
              },
            },
          },
        },
        ServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "Internal server error",
                error: "Detailed error information",
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Products",
        description: "Product management operations",
      },
      {
        name: "Users",
        description: "User management operations",
      },
      {
        name: "Carts",
        description: "Shopping cart operations",
      },
      {
        name: "Orders",
        description: "Order management operations",
      },
      {
        name: "Checkouts",
        description: "Checkout process operations",
      },
      {
        name: "Shipments",
        description: "Shipment and tracking operations",
      },
    ],
  },
  apis: ["./routes/*.js"], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "E-commerce API Documentation",
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "production",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// API routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkouts", checkoutRoutes);
app.use("/api/shipments", shipmentRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to E-commerce API",
    documentation: "/api-docs",
    health: "/health",
    endpoints: {
      products: "/api/products",
      users: "/api/users",
      carts: "/api/carts",
      orders: "/api/orders",
      checkouts: "/api/checkouts",
      shipments: "/api/shipments",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    available_endpoints: {
      documentation: "/api-docs",
      health: "/health",
      products: "/api/products",
      users: "/api/users",
      carts: "/api/carts",
      orders: "/api/orders",
      checkouts: "/api/checkouts",
      shipments: "/api/shipments",
    },
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;
