# 🔒 Security Configuration Guide

This guide covers the security features and best practices for the E-commerce API.

## 🛡️ Environment Variables Security

### Required Environment Variables

#### Database Security

```env
# MongoDB Connection (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&appName=ClusterName

# Alternative: Individual components
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password
MONGODB_CLUSTER=your_cluster_name
MONGODB_DATABASE=ecommerce
```

#### Authentication Security

```env
# JWT Configuration (REQUIRED for production)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_minimum_32_characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_here_different_from_jwt_secret

# API Security
API_KEY=your_api_key_here_for_api_access_control
ENCRYPTION_KEY=your_32_character_encryption_key_for_sensitive_data
```

#### CORS Security

```env
# CORS Configuration
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
CORS_CREDENTIALS=true
CORS_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-API-Key
```

### Production Security Checklist

- [ ] **Strong JWT Secrets**: Minimum 32 characters, use crypto.randomBytes()
- [ ] **Restrict CORS Origins**: Never use `*` in production
- [ ] **Enable Helmet**: Security headers enabled
- [ ] **Rate Limiting**: Configured appropriately
- [ ] **Environment Variables**: All secrets stored securely
- [ ] **Database Access**: Restricted IP addresses in MongoDB Atlas
- [ ] **API Documentation**: Disabled in production (ENABLE_SWAGGER=false)
- [ ] **Logging**: Appropriate log levels set
- [ ] **HTTPS Only**: Force HTTPS in production
- [ ] **Input Validation**: All endpoints validated

## 🔐 Security Features

### 1. Environment Variable Protection

#### Automatic Secret Generation

```bash
# Generate secure environment configuration
npm run setup-env
```

This script automatically generates:

- 64-character JWT secrets
- 64-character API keys
- 32-character encryption keys
- Secure session secrets

#### Environment Validation

The `config/environment.js` file validates:

- Required environment variables
- Security warnings for production
- Default fallback values

### 2. Database Security

#### MongoDB Atlas Security

- **Network Access**: IP whitelist configured
- **Database Users**: Limited permissions
- **Encryption**: At rest and in transit
- **Authentication**: SCRAM-SHA-256

#### Connection String Security

```javascript
// Secure connection with environment variables
const mongoURI =
  process.env.MONGODB_URI ||
  `mongodb+srv://${encodeURIComponent(
    process.env.MONGODB_USERNAME
  )}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${
    process.env.MONGODB_CLUSTER
  }.mongodb.net/${
    process.env.MONGODB_DATABASE
  }?retryWrites=true&w=majority&appName=${process.env.MONGODB_CLUSTER}`;
```

### 3. API Security

#### Rate Limiting

```javascript
// Configurable rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
  skipSuccessfulRequests:
    process.env.RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS === "true",
});
```

#### CORS Protection

```javascript
// Secure CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: process.env.CORS_CREDENTIALS === "true",
    methods: process.env.CORS_METHODS
      ? process.env.CORS_METHODS.split(",")
      : ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS
      ? process.env.CORS_ALLOWED_HEADERS.split(",")
      : ["Content-Type", "Authorization"],
  })
);
```

#### Security Headers

```javascript
// Helmet security headers
app.use(
  helmet({
    enabled: process.env.HELMET_ENABLED !== "false",
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);
```

### 4. Data Protection

#### Sensitive Data Encryption

```javascript
// Payment method data encryption
const encryptedCardNumber = encrypt(
  paymentMethod.cardNumber,
  process.env.ENCRYPTION_KEY
);
const encryptedCVV = encrypt(paymentMethod.cvv, process.env.ENCRYPTION_KEY);
```

#### Input Validation

```javascript
// Joi validation for all inputs
const productSchema = Joi.object({
  name: Joi.string().required().max(100),
  price: Joi.number().min(0).required(),
  category: Joi.string().valid("electronics", "clothing", "books").required(),
});
```

### 5. Authentication & Authorization

#### JWT Token Security

```javascript
// Secure JWT configuration
const token = jwt.sign(
  { userId: user._id, email: user.email },
  process.env.JWT_SECRET,
  {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    issuer: process.env.API_TITLE,
    audience: process.env.API_BASE_URL,
  }
);
```

#### API Key Authentication

```javascript
// API key middleware
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Invalid API key" });
  }
  next();
};
```

## 🚀 Deployment Security

### Vercel Environment Variables

1. **Set Environment Variables in Vercel Dashboard**:

   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_secret_here
   API_KEY=your_api_key_here
   NODE_ENV=production
   CORS_ORIGIN=https://yourdomain.com
   ENABLE_SWAGGER=false
   ```

2. **Secure Production Configuration**:
   ```env
   NODE_ENV=production
   CORS_ORIGIN=https://yourdomain.com
   ENABLE_SWAGGER=false
   HELMET_ENABLED=true
   MORGAN_FORMAT=combined
   LOG_LEVEL=warn
   ```

### MongoDB Atlas Security

1. **Network Access**:

   - Add Vercel IP ranges
   - Remove 0.0.0.0/0 access
   - Use specific IP addresses

2. **Database User**:

   - Create dedicated user for application
   - Limit permissions to specific database
   - Use strong password

3. **Connection String**:
   - Use environment variables
   - Enable SSL/TLS
   - Use connection pooling

## 🔍 Security Monitoring

### Health Check Security

```javascript
// Secure health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    // Don't expose sensitive information
  });
});
```

### Logging Security

```javascript
// Secure logging configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});
```

## 🛠️ Security Tools

### Environment Setup

```bash
# Generate secure environment configuration
npm run setup-env

# Validate environment configuration
node -e "require('./config/environment')"
```

### Security Testing

```bash
# Test MongoDB connection security
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {ssl: true})
  .then(() => console.log('✅ Secure connection established'))
  .catch(err => console.log('❌ Connection failed:', err.message));
"

# Test JWT secret strength
node -e "
const secret = process.env.JWT_SECRET;
console.log('JWT Secret length:', secret ? secret.length : 'Not set');
console.log('JWT Secret strength:', secret && secret.length >= 32 ? 'Strong' : 'Weak');
"
```

## 📋 Security Checklist

### Development

- [ ] `.env` file in `.gitignore`
- [ ] Strong secrets generated
- [ ] CORS configured appropriately
- [ ] Input validation implemented
- [ ] Error handling secure

### Production

- [ ] Environment variables set securely
- [ ] CORS origins restricted
- [ ] Rate limiting enabled
- [ ] Security headers enabled
- [ ] API documentation disabled
- [ ] Database access restricted
- [ ] HTTPS enforced
- [ ] Monitoring enabled

### Ongoing

- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Review environment variables
- [ ] Test security configurations
- [ ] Update dependencies
- [ ] Backup security configurations

## 🆘 Security Incident Response

### If Secrets Are Compromised

1. **Immediately rotate all secrets**
2. **Update environment variables**
3. **Revoke API keys**
4. **Check access logs**
5. **Notify users if necessary**

### If Database Is Compromised

1. **Change database passwords**
2. **Review network access**
3. **Check for unauthorized access**
4. **Backup and restore if needed**
5. **Implement additional monitoring**

## 📚 Additional Resources

- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/security/)
- [JWT Security Best Practices](https://tools.ietf.org/html/rfc7519)

---

**🔒 Remember: Security is an ongoing process, not a one-time setup!**
