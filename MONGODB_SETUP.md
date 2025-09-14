# 🍃 MongoDB Integration Setup Guide

This guide will help you set up MongoDB integration for your e-commerce API.

## 📋 Prerequisites

- Node.js installed
- MongoDB Atlas account (or local MongoDB)
- Access to the provided MongoDB connection string

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install mongoose dotenv
```

### 2. Environment Configuration

Create a `.env` file in your project root:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://ecomm_mock:QUSAEpWfeg1aSWAA@cluster0.wttchje.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0

# Database Configuration
DB_NAME=ecommerce
NODE_ENV=development

# API Configuration
PORT=3000
```

### 3. Database Connection

The database connection is already configured in `config/database.js` and will automatically connect when the server starts.

### 4. Seed the Database

Run the MongoDB seeding script to populate your database with sample data:

```bash
npm run seed-mongo
```

This will create:
- 5 sample products with variants
- 3 sample users with addresses and payment methods
- Sample carts, orders, and shipments

## 📊 Database Schema

### Products Collection
- **name**: Product name (required)
- **description**: Product description
- **price**: Base price
- **category**: Product category (electronics, clothing, books, etc.)
- **brand**: Product brand
- **variants**: Array of product variants with different attributes
- **images**: Array of product images
- **tags**: Array of search tags
- **specifications**: Product specifications object
- **isActive**: Boolean for soft delete

### Users Collection
- **name**: User's full name
- **email**: Unique email address
- **phone**: Phone number
- **addresses**: Array of user addresses
- **paymentMethods**: Array of payment methods (encrypted)
- **loyaltyTier**: Bronze, Silver, Gold, Platinum
- **loyaltyPoints**: Accumulated loyalty points
- **preferences**: User preferences object
- **isActive**: Boolean for soft delete

### Carts Collection
- **userId**: Reference to User
- **items**: Array of cart items
- **subtotal**: Calculated subtotal
- **tax**: Tax amount
- **shipping**: Shipping cost
- **discount**: Discount amount
- **total**: Final total
- **expiresAt**: Cart expiration date

### Orders Collection
- **orderNumber**: Unique order identifier
- **userId**: Reference to User
- **items**: Array of ordered items
- **shippingAddress**: Delivery address
- **billingAddress**: Billing address
- **paymentMethod**: Payment details
- **status**: Order status (pending, confirmed, shipped, delivered, etc.)
- **subtotal**: Order subtotal
- **tax**: Tax amount
- **shipping**: Shipping cost
- **total**: Final total

### Checkouts Collection
- **checkoutId**: Unique checkout identifier
- **userId**: Reference to User
- **cartId**: Reference to Cart
- **items**: Checkout items snapshot
- **shippingAddress**: Delivery address
- **paymentMethod**: Payment details
- **status**: Checkout status
- **paymentStatus**: Payment status
- **expiresAt**: Checkout expiration (15 minutes)

### Shipments Collection
- **shipmentId**: Unique shipment identifier
- **orderId**: Reference to Order
- **carrier**: Shipping carrier (UPS, FedEx, etc.)
- **trackingNumber**: Carrier tracking number
- **status**: Shipment status
- **shippingAddress**: Delivery address
- **packageDetails**: Package dimensions and weight
- **trackingEvents**: Array of tracking updates

## 🔧 Available Scripts

```bash
# Seed MongoDB with sample data
npm run seed-mongo

# Start development server (with MongoDB)
npm run dev

# Start production server
npm start
```

## 📈 Features

### Advanced Querying
- Text search across product names and descriptions
- Category and brand filtering
- Price range filtering
- Stock availability filtering
- Pagination support
- Sorting options

### Data Validation
- Mongoose schema validation
- Required field validation
- Data type validation
- Custom validation rules
- Unique constraints

### Performance Optimizations
- Database indexes for fast queries
- Virtual fields for computed properties
- Aggregation pipelines for statistics
- Connection pooling
- Query optimization

### Security Features
- Sensitive data encryption (payment methods)
- Input sanitization
- SQL injection prevention
- Rate limiting
- CORS protection

## 🛠️ MongoDB Atlas Features

### Automatic Scaling
- Automatic scaling based on usage
- Global cluster distribution
- Backup and recovery
- Monitoring and alerts

### Security
- Network access controls
- Database user management
- Encryption at rest and in transit
- Audit logging

### Performance
- Query optimization
- Index recommendations
- Performance insights
- Real-time monitoring

## 🔍 Sample Queries

### Find Products by Category
```javascript
const products = await Product.find({ 
  category: 'electronics', 
  isActive: true 
});
```

### Search Products
```javascript
const products = await Product.find({
  $text: { $search: 'iPhone' },
  isActive: true
});
```

### Get User with Orders
```javascript
const user = await User.findById(userId)
  .populate('orders')
  .select('-paymentMethods.cardNumber -paymentMethods.cvv');
```

### Aggregate Product Statistics
```javascript
const stats = await Product.aggregate([
  {
    $group: {
      _id: '$category',
      count: { $sum: 1 },
      averagePrice: { $avg: '$price' }
    }
  }
]);
```

## 🚨 Error Handling

The API includes comprehensive error handling:

- **Validation Errors**: Detailed field-level validation messages
- **Duplicate Key Errors**: Handled for unique constraints
- **Connection Errors**: Automatic reconnection attempts
- **Query Errors**: Graceful error responses
- **Timeout Errors**: Configurable timeout settings

## 📊 Monitoring

### Health Check Endpoint
```bash
GET /health
```

Returns database connection status and basic statistics.

### Database Metrics
- Connection count
- Query performance
- Index usage
- Storage utilization
- Error rates

## 🔄 Migration from In-Memory

The existing in-memory data store continues to work alongside MongoDB. To migrate:

1. Run the MongoDB seeding script
2. Update your controllers to use MongoDB models
3. Test thoroughly
4. Deploy with MongoDB configuration

## 🆘 Troubleshooting

### Connection Issues
- Verify MongoDB URI format
- Check network access in MongoDB Atlas
- Ensure database user has proper permissions

### Performance Issues
- Review query patterns
- Add appropriate indexes
- Monitor slow queries
- Optimize aggregation pipelines

### Data Issues
- Validate data before insertion
- Use transactions for complex operations
- Implement proper error handling
- Regular data backups

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Node.js MongoDB Best Practices](https://docs.mongodb.com/drivers/node/current/)

## 🎯 Next Steps

1. **Install Dependencies**: `npm install mongoose dotenv`
2. **Create .env File**: Add MongoDB connection string
3. **Seed Database**: `npm run seed-mongo`
4. **Test API**: Verify all endpoints work with MongoDB
5. **Deploy**: Update Vercel configuration for MongoDB

Your e-commerce API is now ready with full MongoDB integration! 🚀
