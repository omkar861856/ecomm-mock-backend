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

// Rate limiting - configurable via environment variables
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // 1000 requests default
  skipSuccessfulRequests:
    process.env.RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS === "true",
  message: "Too many requests from this IP, please try again later.",
});

// Middleware - configurable via environment variables
app.use(
  helmet({
    enabled: process.env.HELMET_ENABLED !== "false",
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: process.env.CORS_CREDENTIALS === "true",
    methods: process.env.CORS_METHODS
      ? process.env.CORS_METHODS.split(",")
      : ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS
      ? process.env.CORS_ALLOWED_HEADERS.split(",")
      : ["Content-Type", "Authorization", "X-API-Key"],
  })
);

app.use(morgan(process.env.MORGAN_FORMAT || "combined"));
app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: process.env.API_TITLE || "E-commerce API",
      version: process.env.API_VERSION || "1.0.0",
      description:
        process.env.API_DESCRIPTION ||
        "A comprehensive e-commerce API with CRUD operations for products, users, orders, carts, checkouts, and shipments",
      contact: {
        name: process.env.API_CONTACT_NAME || "API Support",
        email: process.env.API_CONTACT_EMAIL || "support@example.com",
      },
      license: {
        name: process.env.API_LICENSE_NAME || "MIT",
        url:
          process.env.API_LICENSE_URL || "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url:
          process.env.API_BASE_URL ||
          (process.env.NODE_ENV === "production"
            ? "https://your-app-name.vercel.app"
            : "http://localhost:3000"),
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
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

// Custom Swagger UI HTML template using CDN
const swaggerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>E-commerce API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    .swagger-ui .topbar { display: none; }
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin:0; background: #fafafa; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/api-docs/swagger.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true
      });
    };
  </script>
</body>
</html>
`;

// Serve custom Swagger UI HTML
app.get('/api-docs', (req, res) => {
  res.send(swaggerHtml);
});

app.get('/api-docs/', (req, res) => {
  res.send(swaggerHtml);
});

// Serve Swagger JSON
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

console.log(`📚 Swagger documentation available at /api-docs`);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: process.env.API_HEALTH_MESSAGE || "API is running",
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || "1.0.0",
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

// Start server (only if not in Vercel environment)
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  });
}

// Export for Vercel
module.exports = app;
