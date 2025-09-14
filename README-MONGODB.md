# 🍃 E-commerce API with MongoDB Integration

A comprehensive e-commerce API built with Node.js, Express, and MongoDB, featuring full CRUD operations, advanced querying, and real-time data persistence.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation & Setup

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd ecommerce-api
   npm install
   ```

2. **Run MongoDB Setup**
   ```bash
   ./setup-mongodb.sh
   ```
   This script will:
   - Install MongoDB dependencies (`mongoose`, `dotenv`)
   - Create `.env` file with connection string
   - Test MongoDB connection
   - Seed the database with sample data

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Access the API**
   - API Base URL: `http://localhost:3000`
   - Swagger Documentation: `http://localhost:3000/api-docs`
   - Health Check: `http://localhost:3000/health`

## 📊 Database Schema

### Collections Overview

| Collection | Description | Key Features |
|------------|-------------|--------------|
| **Products** | Product catalog with variants | Text search, category filtering, stock management |
| **Users** | Customer information | Addresses, payment methods, loyalty program |
| **Carts** | Shopping cart data | Auto-expiration, item management |
| **Orders** | Order processing | Status tracking, payment integration |
| **Checkouts** | Checkout sessions | Time-limited, payment processing |
| **Shipments** | Shipping tracking | Carrier integration, tracking events |

### Sample Data Structure

#### Product Example
```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with titanium design",
  "price": 999.99,
  "category": "electronics",
  "brand": "Apple",
  "variants": [
    {
      "name": "128GB Natural Titanium",
      "price": 999.99,
      "stock": 50,
      "attributes": {
        "color": "Natural Titanium",
        "storage": "128GB"
      },
      "sku": "IPH15P-128-NT"
    }
  ],
  "images": [
    {
      "url": "https://example.com/iphone15pro1.jpg",
      "alt": "iPhone 15 Pro Front",
      "isPrimary": true
    }
  ],
  "tags": ["smartphone", "apple", "premium"],
  "specifications": {
    "weight": "187g",
    "dimensions": "146.6 x 70.6 x 8.25 mm",
    "material": "Titanium",
    "warranty": "1 year"
  }
}
```

#### User Example
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0123",
  "addresses": [
    {
      "type": "home",
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "United States",
      "isDefault": true
    }
  ],
  "paymentMethods": [
    {
      "type": "credit_card",
      "cardNumber": "**** **** **** 1234",
      "expiryDate": "12/25",
      "cardholderName": "John Doe",
      "isDefault": true
    }
  ],
  "loyaltyTier": "gold",
  "loyaltyPoints": 2500
}
```

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products (with filtering, pagination)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product (soft delete)
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search?q=query` - Search products
- `GET /api/products/stats` - Get product statistics

### Users
- `GET /api/users` - Get all users (with filtering, pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (soft delete)
- `POST /api/users/:id/addresses` - Add address
- `PUT /api/users/:id/addresses/:addressId` - Update address
- `DELETE /api/users/:id/addresses/:addressId` - Delete address
- `POST /api/users/:id/payment-methods` - Add payment method
- `PUT /api/users/:id/loyalty-points` - Update loyalty points
- `GET /api/users/stats` - Get user statistics

### Carts
- `GET /api/carts` - Get all carts
- `GET /api/carts/:id` - Get cart by ID
- `POST /api/carts` - Create new cart
- `PUT /api/carts/:id` - Update cart
- `DELETE /api/carts/:id` - Delete cart
- `POST /api/carts/:id/items` - Add item to cart
- `PUT /api/carts/:id/items/:itemId` - Update cart item
- `DELETE /api/carts/:id/items/:itemId` - Remove item from cart
- `POST /api/carts/:id/clear` - Clear cart

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/cancel` - Cancel order

### Checkouts
- `GET /api/checkouts` - Get all checkouts
- `GET /api/checkouts/:id` - Get checkout by ID
- `POST /api/checkouts` - Create new checkout
- `PUT /api/checkouts/:id` - Update checkout
- `DELETE /api/checkouts/:id` - Delete checkout
- `POST /api/checkouts/:id/complete` - Complete checkout
- `POST /api/checkouts/:id/fail` - Fail checkout

### Shipments
- `GET /api/shipments` - Get all shipments
- `GET /api/shipments/:id` - Get shipment by ID
- `POST /api/shipments` - Create new shipment
- `PUT /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment
- `POST /api/shipments/:id/tracking` - Add tracking event
- `PUT /api/shipments/:id/delivered` - Mark as delivered

## 🔍 Advanced Querying

### Product Search
```bash
# Text search
GET /api/products/search?q=iPhone

# Category filter
GET /api/products?category=electronics

# Brand filter
GET /api/products?brand=Apple

# Price range
GET /api/products?minPrice=500&maxPrice=1000

# In stock only
GET /api/products?inStock=true

# Combined filters
GET /api/products?category=electronics&brand=Apple&minPrice=500&inStock=true

# Pagination
GET /api/products?page=2&limit=20

# Sorting
GET /api/products?sort=price&order=asc
```

### User Filtering
```bash
# Loyalty tier filter
GET /api/users?loyaltyTier=gold

# Active users only
GET /api/users?isActive=true

# Pagination and sorting
GET /api/users?page=1&limit=10&sort=createdAt&order=desc
```

## 📈 Statistics & Analytics

### Product Statistics
```bash
GET /api/products/stats
```
Returns:
- Total products count
- Active products count
- Average, min, max prices
- Category distribution
- Top brands

### User Statistics
```bash
GET /api/users/stats
```
Returns:
- Total users count
- Active users count
- Average loyalty points
- Loyalty tier distribution

## 🛡️ Security Features

### Data Protection
- **Encrypted Payment Data**: Card numbers and CVV are encrypted
- **Input Validation**: Comprehensive Joi validation
- **SQL Injection Prevention**: Mongoose ORM protection
- **Rate Limiting**: Configurable request limits
- **CORS Protection**: Cross-origin request security

### Authentication Ready
The API is structured to easily integrate with:
- JWT authentication
- OAuth providers
- Session-based auth
- API key authentication

## 🚀 Deployment

### Vercel Deployment
The API is already configured for Vercel deployment:

1. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

2. **Update Environment Variables**
   - Add `MONGODB_URI` to Vercel environment variables
   - Set `NODE_ENV=production`

3. **Update n8n Tools**
   ```bash
   node update-urls.js https://your-app.vercel.app
   ```

### MongoDB Atlas Configuration
- **Connection String**: Already configured
- **Database**: `ecommerce`
- **Collections**: Auto-created on first use
- **Indexes**: Automatically created for performance

## 🔧 Development

### Available Scripts
```bash
# Development
npm run dev          # Start with nodemon
npm start            # Start production server

# Database
npm run seed         # Seed in-memory data
npm run seed-mongo   # Seed MongoDB data

# Deployment
npm run build        # Build for production
npm run vercel-build # Vercel build command
```

### Project Structure
```
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── mongodb/             # MongoDB controllers
│   └── ...                  # Original controllers
├── models/
│   ├── mongodb/             # Mongoose schemas
│   └── ...                  # Original models
├── routes/                  # API routes
├── scripts/
│   ├── seedData.js          # In-memory seeding
│   └── seedMongoDB.js       # MongoDB seeding
├── .env                     # Environment variables
├── index.js                 # Vercel entry point
├── server.js               # Development server
└── vercel.json             # Vercel configuration
```

## 📊 Performance Features

### Database Optimization
- **Indexes**: Strategic indexes for fast queries
- **Aggregation**: Efficient data processing
- **Connection Pooling**: Optimized connections
- **Query Optimization**: Mongoose query optimization

### API Optimization
- **Pagination**: Efficient data loading
- **Caching**: Ready for Redis integration
- **Compression**: Gzip compression
- **Rate Limiting**: Request throttling

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### Sample API Calls
```bash
# Get all products
curl http://localhost:3000/api/products

# Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":99.99,"category":"electronics","brand":"Test"}'

# Search products
curl "http://localhost:3000/api/products/search?q=iPhone"
```

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check connection string format
   - Verify network access in MongoDB Atlas
   - Ensure database user permissions

2. **Seeding Failed**
   - Check MongoDB connection
   - Verify database permissions
   - Check for duplicate data

3. **API Errors**
   - Check server logs
   - Verify request format
   - Check validation errors

### Debug Mode
```bash
# Enable debug logging
DEBUG=mongoose:* npm start
```

## 📚 Documentation

- **Swagger UI**: `/api-docs` - Interactive API documentation
- **MongoDB Setup**: `MONGODB_SETUP.md` - Detailed setup guide
- **Deployment**: `DEPLOYMENT.md` - Deployment instructions
- **Agent System**: `agent-system-prompt.md` - AI agent integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🎯 Next Steps

1. **Integrate Authentication**: Add JWT or OAuth
2. **Add Real-time Features**: WebSocket integration
3. **Implement Caching**: Redis for performance
4. **Add Payment Processing**: Stripe/PayPal integration
5. **Deploy to Production**: Configure production environment

---

**🚀 Your e-commerce API is now ready with full MongoDB integration!**

For support or questions, please refer to the documentation or create an issue in the repository.
