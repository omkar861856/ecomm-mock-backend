const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Generate secure random strings
const generateSecret = (length = 64) => {
  return crypto.randomBytes(length).toString("hex");
};

const generateApiKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const generateEncryptionKey = () => {
  return crypto.randomBytes(16).toString("hex");
};

// Environment template
const createEnvTemplate = () => {
  return `# ===========================================
# E-COMMERCE API ENVIRONMENT CONFIGURATION
# ===========================================

# Database Configuration
# MongoDB Atlas Connection String (REQUIRED)
MONGODB_URI=mongodb+srv://ecomm_mock:QUSAEpWfeg1aSWAA@cluster0.wttchje.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0

# Database Name
DB_NAME=ecommerce

# MongoDB Atlas Credentials (Alternative to connection string)
MONGODB_USERNAME=ecomm_mock
MONGODB_PASSWORD=QUSAEpWfeg1aSWAA
MONGODB_CLUSTER=cluster0.wttchje
MONGODB_DATABASE=ecommerce

# Application Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Security Configuration (AUTO-GENERATED)
JWT_SECRET=${generateSecret(64)}
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=${generateSecret(64)}
API_KEY=${generateApiKey()}
ENCRYPTION_KEY=${generateEncryptionKey()}

# CORS Configuration
CORS_ORIGIN=*
CORS_CREDENTIALS=true
CORS_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-API-Key

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS=false

# Session Configuration
SESSION_SECRET=${generateSecret(32)}
SESSION_COOKIE_MAX_AGE=86400000

# API Configuration
API_TITLE=E-commerce API
API_DESCRIPTION=A comprehensive e-commerce API with CRUD operations
API_BASE_URL=http://localhost:3000
API_CONTACT_NAME=API Support
API_CONTACT_EMAIL=support@example.com
API_LICENSE_NAME=MIT
API_LICENSE_URL=https://opensource.org/licenses/MIT
API_HEALTH_MESSAGE=API is running

# Features
ENABLE_SWAGGER=true
VERBOSE_LOGGING=true
DEBUG=mongoose:*

# Security Headers
HELMET_ENABLED=true

# Logging Configuration
MORGAN_FORMAT=combined
LOG_LEVEL=info

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx

# Email Configuration (for future use)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
EMAIL_FROM=noreply@yourapp.com

# Payment Gateway Configuration (for future use)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# External Services
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Cache Configuration (Redis - for future use)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password
CACHE_TTL=3600

# Monitoring Configuration
HEALTH_CHECK_INTERVAL=30000
METRICS_ENABLED=true

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_EMAIL_VERIFICATION=false
ENABLE_SMS_VERIFICATION=false
ENABLE_SOCIAL_LOGIN=false
ENABLE_TWO_FACTOR_AUTH=false
`;
};

// Main setup function
const setupEnvironment = () => {
  const envPath = path.join(process.cwd(), ".env");
  const envExamplePath = path.join(process.cwd(), "env.example");

  console.log("🔐 Setting up secure environment configuration...");

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log("⚠️  .env file already exists");
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Do you want to overwrite it? (y/N): ", (answer) => {
      if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
        createEnvFile();
      } else {
        console.log("✅ Keeping existing .env file");
      }
      rl.close();
    });
  } else {
    createEnvFile();
  }

  function createEnvFile() {
    try {
      // Create .env file
      const envContent = createEnvTemplate();
      fs.writeFileSync(envPath, envContent);
      console.log("✅ Created .env file with secure configuration");

      // Create env.example file
      const exampleContent = envContent
        .replace(/mongodb\+srv:\/\/[^@]+@/, "mongodb+srv://username:password@")
        .replace(
          /MONGODB_USERNAME=ecomm_mock/,
          "MONGODB_USERNAME=your_username"
        )
        .replace(
          /MONGODB_PASSWORD=QUSAEpWfeg1aSWAA/,
          "MONGODB_PASSWORD=your_password"
        )
        .replace(
          /MONGODB_CLUSTER=cluster0\.wttchje/,
          "MONGODB_CLUSTER=your_cluster_name"
        )
        .replace(
          /JWT_SECRET=[a-f0-9]+/,
          "JWT_SECRET=your_super_secret_jwt_key_here"
        )
        .replace(
          /JWT_REFRESH_SECRET=[a-f0-9]+/,
          "JWT_REFRESH_SECRET=your_refresh_token_secret_here"
        )
        .replace(/API_KEY=[a-f0-9]+/, "API_KEY=your_api_key_here")
        .replace(
          /ENCRYPTION_KEY=[a-f0-9]+/,
          "ENCRYPTION_KEY=your_32_character_encryption_key_here"
        )
        .replace(
          /SESSION_SECRET=[a-f0-9]+/,
          "SESSION_SECRET=your_session_secret_here"
        );

      fs.writeFileSync(envExamplePath, exampleContent);
      console.log("✅ Created env.example file");

      console.log("\n🔒 Security Features:");
      console.log("   - Generated secure JWT secrets (64 characters)");
      console.log("   - Generated API key (64 characters)");
      console.log("   - Generated encryption key (32 characters)");
      console.log("   - Generated session secret (64 characters)");
      console.log("   - MongoDB credentials configured");

      console.log("\n📋 Next Steps:");
      console.log(
        "   1. Review and update .env file with your specific values"
      );
      console.log("   2. Never commit .env file to version control");
      console.log(
        "   3. Update production environment variables in your deployment platform"
      );
      console.log("   4. Run: npm run seed-mongo (to populate database)");
      console.log("   5. Run: npm start (to start the server)");
    } catch (error) {
      console.error("❌ Error creating environment files:", error.message);
      process.exit(1);
    }
  }
};

// Run setup if called directly
if (require.main === module) {
  setupEnvironment();
}

module.exports = {
  setupEnvironment,
  generateSecret,
  generateApiKey,
  generateEncryptionKey,
};
