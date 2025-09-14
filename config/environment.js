const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Environment configuration with validation
const config = {
  // Application
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT) || 3000,
  API_VERSION: process.env.API_VERSION || "v1",

  // Database
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_USERNAME: process.env.MONGODB_USERNAME,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
  MONGODB_CLUSTER: process.env.MONGODB_CLUSTER,
  MONGODB_DATABASE:
    process.env.MONGODB_DATABASE || process.env.DB_NAME || "ecommerce",

  // Security
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  API_KEY: process.env.API_KEY,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === "true",
  CORS_METHODS: process.env.CORS_METHODS
    ? process.env.CORS_METHODS.split(",")
    : ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  CORS_ALLOWED_HEADERS: process.env.CORS_ALLOWED_HEADERS
    ? process.env.CORS_ALLOWED_HEADERS.split(",")
    : ["Content-Type", "Authorization", "X-API-Key"],

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS:
    parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
  RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS:
    process.env.RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS === "true",

  // API Configuration
  API_TITLE: process.env.API_TITLE || "E-commerce API",
  API_DESCRIPTION:
    process.env.API_DESCRIPTION ||
    "A comprehensive e-commerce API with CRUD operations",
  API_BASE_URL: process.env.API_BASE_URL,
  API_CONTACT_NAME: process.env.API_CONTACT_NAME || "API Support",
  API_CONTACT_EMAIL: process.env.API_CONTACT_EMAIL || "support@example.com",
  API_LICENSE_NAME: process.env.API_LICENSE_NAME || "MIT",
  API_LICENSE_URL:
    process.env.API_LICENSE_URL || "https://opensource.org/licenses/MIT",
  API_HEALTH_MESSAGE: process.env.API_HEALTH_MESSAGE || "API is running",

  // Features
  ENABLE_SWAGGER:
    process.env.ENABLE_SWAGGER === "true" ||
    process.env.NODE_ENV !== "production",
  VERBOSE_LOGGING: process.env.VERBOSE_LOGGING === "true",
  DEBUG: process.env.DEBUG,

  // Security Headers
  HELMET_ENABLED: process.env.HELMET_ENABLED !== "false",

  // Logging
  MORGAN_FORMAT: process.env.MORGAN_FORMAT || "combined",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || "./uploads",
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES
    ? process.env.ALLOWED_FILE_TYPES.split(",")
    : ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"],

  // Email (for future use)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,

  // Payment Gateways (for future use)
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,

  // External Services
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,

  // Cache (Redis - for future use)
  REDIS_URL: process.env.REDIS_URL,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  CACHE_TTL: parseInt(process.env.CACHE_TTL) || 3600,

  // Monitoring
  HEALTH_CHECK_INTERVAL: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000,
  METRICS_ENABLED: process.env.METRICS_ENABLED === "true",

  // Feature Flags
  ENABLE_REGISTRATION: process.env.ENABLE_REGISTRATION !== "false",
  ENABLE_EMAIL_VERIFICATION: process.env.ENABLE_EMAIL_VERIFICATION === "true",
  ENABLE_SMS_VERIFICATION: process.env.ENABLE_SMS_VERIFICATION === "true",
  ENABLE_SOCIAL_LOGIN: process.env.ENABLE_SOCIAL_LOGIN === "true",
  ENABLE_TWO_FACTOR_AUTH: process.env.ENABLE_TWO_FACTOR_AUTH === "true",
};

// Validation function
const validateConfig = () => {
  const required = ["MONGODB_URI"];
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    console.warn(
      `⚠️  Missing required environment variables: ${missing.join(", ")}`
    );
    console.warn("Using default values or fallback configuration");
  }

  // Security warnings
  if (config.NODE_ENV === "production") {
    if (!config.JWT_SECRET || config.JWT_SECRET.length < 32) {
      console.warn(
        "⚠️  JWT_SECRET should be at least 32 characters long in production"
      );
    }
    if (config.CORS_ORIGIN === "*") {
      console.warn(
        '⚠️  CORS_ORIGIN is set to "*" in production - consider restricting to specific domains'
      );
    }
    if (config.ENABLE_SWAGGER) {
      console.warn("⚠️  Swagger documentation is enabled in production");
    }
  }

  return config;
};

// Export validated configuration
module.exports = validateConfig();
