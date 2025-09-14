# Customer Impersonation Quick Reference

## 🚀 Quick Start

### 1. Enable Customer Impersonation

```
"I want to impersonate customer with ID: 507f1f77bcf86cd799439011"
```

### 2. Verify User ID Format

- Must be 24-character MongoDB ObjectId
- Format: `507f1f77bcf86cd799439011`
- Example: `507f1f77bcf86cd799439011`

## ✅ Available Tools (24 tools)

### Product Management

- `get-all-products` - Browse products
- `get-product-by-id` - View product details
- `get-product-variants` - Check sizes/colors

### User Profile (Scoped to Impersonated User)

- `get-user-by-id` - View profile
- `update-user` - Update profile
- `add-user-address` - Add address
- `add-user-payment-method` - Add payment method

### Shopping Cart (Scoped to Impersonated User)

- `get-carts-by-user` - View user's carts
- `get-cart-by-id` - View specific cart
- `create-cart` - Create new cart
- `update-cart` - Modify cart
- `add-item-to-cart` - Add products
- `remove-item-from-cart` - Remove products
- `get-active-cart` - Get current cart

### Orders (Scoped to Impersonated User)

- `get-order-by-id` - View order details
- `create-order` - Place order
- `cancel-order` - Cancel order

### Checkout Process

- `get-checkout-by-id` - View checkout
- `create-checkout` - Start checkout
- `update-checkout` - Modify checkout
- `complete-checkout` - Complete purchase

### Shipping & Tracking (Scoped to Impersonated User)

- `get-shipment-by-id` - View shipment
- `get-shipment-tracking` - Track package

### System

- `health-check` - System status

## ❌ Restricted Tools (19 tools - Not Available)

### User Management

- `get-all-users` - View all customers
- `create-user` - Register customers
- `delete-user` - Remove accounts

### Product Management

- `create-product` - Add products
- `update-product` - Modify products
- `delete-product` - Remove products

### Cart Management

- `get-all-carts` - View all carts

### Order Management

- `get-all-orders` - View all orders
- `update-order` - Modify orders
- `delete-order` - Remove orders
- `update-order-status` - Change status

### Checkout Management

- `get-all-checkouts` - View all checkouts
- `delete-checkout` - Remove checkouts

### Shipping Management

- `get-all-shipments` - View all shipments
- `create-shipment` - Create shipments
- `update-shipment` - Modify shipments
- `delete-shipment` - Remove shipments
- `add-tracking-event` - Add tracking updates

## 🔒 Security Rules

### Data Scoping

- All queries filtered by impersonated user ID
- Cross-user data access blocked
- Admin operations disabled

### Validation

- User ID must be valid ObjectId
- User must exist in system
- All operations scoped to impersonated user

### Error Messages

- Invalid ID: "Invalid user ID format. Please provide a valid MongoDB ObjectId."
- User not found: "User not found. Please verify the user ID."
- Access denied: "Access denied. You can only access data for the impersonated user."

## 📋 Common Use Cases

### Customer Support

```
"I want to impersonate customer with ID: 507f1f77bcf86cd799439011"
"Show me this customer's recent orders"
"Help them add a new address"
```

### Testing Customer Experience

```
"I want to test the customer experience for user 507f1f77bcf86cd799439011"
"Let me browse products and add items to cart"
"Complete a test purchase"
```

### Troubleshooting

```
"I want to impersonate customer with ID: 507f1f77bcf86cd799439011"
"Check their cart status"
"Verify their order history"
```

## 🛠️ Troubleshooting

### Invalid User ID

- Check format: 24 hex characters
- Example: `507f1f77bcf86cd799439011`
- Use MongoDB ObjectId validator

### User Not Found

- Verify user exists in database
- Check user ID spelling
- Confirm user is active

### Access Denied

- Ensure using customer-safe tools only
- Check if user ID is properly set
- Verify impersonation mode is active

### Tool Not Available

- Use customer-safe alternative
- Check tool access level
- Verify impersonation mode

## 📞 Support

### Technical Issues

- Check n8n workflow configuration
- Verify API endpoints
- Test user ID format

### Security Concerns

- Review access logs
- Check user permissions
- Monitor for unauthorized access

### General Questions

- Refer to full documentation
- Check setup guide
- Contact support team

## 🔄 Workflow Files

### Main Files

- `n8n-workflow-customer-impersonation.json` - Customer impersonation workflow
- `CUSTOMER_IMPERSONATION_GUIDE.md` - Complete guide
- `CUSTOMER_IMPERSONATION_SETUP.md` - Setup instructions

### Scripts

- `create-customer-workflow.js` - Workflow generator
- `agent-system-prompt.md` - Updated system prompt

## 📊 Monitoring

### Logs to Monitor

- User ID validation attempts
- Tool access patterns
- Error rates and types
- Security violations

### Metrics to Track

- Impersonation session duration
- Tools used per session
- Error frequency
- User satisfaction

## 🎯 Best Practices

### For Support Staff

1. Always verify customer identity
2. Use impersonation only for legitimate support
3. Document impersonation reasons
4. End session when complete

### For Testing

1. Use test user accounts only
2. Never impersonate real customers
3. Clean up test data
4. Use dedicated test environments

### For Development

1. Implement proper access controls
2. Log all activities
3. Regular security audits
4. Monitor for violations
