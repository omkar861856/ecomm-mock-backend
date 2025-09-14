# E-commerce API

A comprehensive Node.js backend API with CRUD operations for products, users, orders, carts, checkouts, and shipments. This API is built with Express.js and includes complete Swagger documentation.

## Features

- **Complete CRUD Operations** for all entities:

  - Products (with variants, inventory, pricing)
  - Users (with addresses, payment methods, loyalty)
  - Shopping Carts (with items, coupons, calculations)
  - Orders (with status tracking, fulfillment, payment)
  - Checkouts (with shipping, payment, order review)
  - Shipments (with tracking, events, delivery)

- **Comprehensive Data Models** based on real e-commerce requirements
- **Input Validation** using Joi schemas
- **Rate Limiting** for API protection
- **Security Middleware** (Helmet, CORS)
- **Request Logging** with Morgan
- **Interactive API Documentation** with Swagger UI
- **Sample Data Seeding** for testing

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone or download the project
2. Install dependencies:

   ```bash
   npm install
   ```

3. Seed sample data:

   ```bash
   npm run seed
   ```

4. Start the server:

   ```bash
   npm start
   ```

   For development with auto-restart:

   ```bash
   npm run dev
   ```

### API Endpoints

The server will start on `http://localhost:3000` with the following endpoints:

- **API Documentation**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/health`
- **Products**: `http://localhost:3000/api/products`
- **Users**: `http://localhost:3000/api/users`
- **Carts**: `http://localhost:3000/api/carts`
- **Orders**: `http://localhost:3000/api/orders`
- **Checkouts**: `http://localhost:3000/api/checkouts`
- **Shipments**: `http://localhost:3000/api/shipments`

## API Documentation

Visit `http://localhost:3000/api-docs` for interactive Swagger documentation where you can:

- Explore all available endpoints
- View request/response schemas
- Test API calls directly from the browser
- Download OpenAPI specification

## Data Structure

The API handles complex e-commerce data structures including:

### Products

- Basic product information (name, brand, description)
- Multiple variants (color, size, pricing)
- Inventory management (stock levels, warehouse locations)
- Shipping information and policies
- Warranty and return policies

### Users

- User profiles with contact information
- Multiple addresses (home, work, etc.)
- Payment methods (cards, UPI, wallets)
- Loyalty program integration

### Shopping Carts

- Cart items with quantities and pricing
- Applied coupons and discounts
- Tax and shipping calculations
- Real-time total updates

### Orders

- Order status tracking with history
- Item details with pricing and taxes
- Fulfillment information (picking, packing)
- Payment processing details
- Shipping and delivery tracking

### Checkouts

- Address selection (shipping/billing)
- Shipping method selection
- Payment method selection
- Order review and confirmation

### Shipments

- Carrier and service level information
- Tracking numbers and events
- Delivery confirmation and proof
- Real-time status updates

## Sample Data

The API comes with comprehensive sample data including:

- Nike Tech Fleece Hoodie product with variants
- Adidas Ultraboost running shoes
- User profiles with addresses and payment methods
- Complete order flow from cart to delivery
- Realistic pricing, inventory, and shipping data

## API Usage Examples

### Get All Products

```bash
curl http://localhost:3000/api/products
```

### Get Product by ID

```bash
curl http://localhost:3000/api/products/prod_nike_hoodie_001
```

### Create New Product

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "NEW-PRODUCT-001",
    "name": "New Product",
    "brand": "Brand Name",
    "description": "Product description",
    "categories": ["category1", "category2"],
    "tags": ["tag1", "tag2"],
    "images": ["https://example.com/image.jpg"],
    "variants": [...],
    "shipping": {...},
    "warranty": {...},
    "return_policy": {...}
  }'
```

### Add Item to Cart

```bash
curl -X POST http://localhost:3000/api/carts/cart_5592/items \
  -H "Content-Type: application/json" \
  -d '{
    "variant_id": "prod_nike_hoodie_001_blk_m",
    "quantity": 1,
    "unit_price": 4999.00
  }'
```

### Update Order Status

```bash
curl -X PATCH http://localhost:3000/api/orders/order_20250914_0001/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CONFIRMED",
    "note": "Order confirmed by warehouse",
    "by": "warehouse_manager"
  }'
```

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Validation errors, invalid input
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server errors

All errors return a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

## Rate Limiting

The API implements rate limiting:

- 100 requests per 15 minutes per IP address
- Configurable limits for different endpoints
- Clear error messages when limits are exceeded

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Joi schema validation
- **Rate Limiting**: DDoS protection
- **Request Logging**: Audit trail

## Development

### Project Structure

```
├── controllers/          # Business logic controllers
├── models/              # Data models and validation schemas
├── routes/              # API route definitions
├── scripts/             # Utility scripts (seeding, etc.)
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

### Adding New Endpoints

1. Create validation schema in `models/`
2. Add controller functions in `controllers/`
3. Define routes in `routes/`
4. Update Swagger documentation
5. Test with sample data

### Environment Variables

The API supports the following environment variables:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions:

- Check the API documentation at `/api-docs`
- Review the sample data structure
- Test endpoints using the Swagger UI
- Check server logs for detailed error information
