# Customer Impersonation Feature

## 🎯 Overview

The Customer Impersonation feature allows you to simulate a customer's experience while maintaining strict security controls. This is perfect for:

- **Customer Support**: Help customers with their accounts
- **Testing**: Test customer flows and experiences
- **Training**: Train support staff on customer interactions
- **Debugging**: Troubleshoot customer-specific issues

## 🚀 Quick Start

### 1. Import Customer Impersonation Workflow

```bash
# Import the customer impersonation workflow into n8n
# File: n8n-workflow-customer-impersonation.json
```

### 2. Enable Customer Impersonation

```
"I want to impersonate customer with ID: 507f1f77bcf86cd799439011"
```

### 3. Start Helping the Customer

```
"Show me this customer's recent orders"
"Help them add a new address"
"Check their cart status"
```

## 📁 Files Created

| File                                        | Purpose            | Description                                        |
| ------------------------------------------- | ------------------ | -------------------------------------------------- |
| `n8n-workflow-customer-impersonation.json`  | Main workflow      | Customer impersonation workflow with 24 safe tools |
| `CUSTOMER_IMPERSONATION_GUIDE.md`           | Complete guide     | Comprehensive documentation and best practices     |
| `CUSTOMER_IMPERSONATION_SETUP.md`           | Setup instructions | Step-by-step setup and configuration               |
| `CUSTOMER_IMPERSONATION_QUICK_REFERENCE.md` | Quick reference    | Fast lookup for tools and commands                 |
| `create-customer-workflow.js`               | Workflow generator | Script to create customer impersonation workflow   |
| `agent-system-prompt.md`                    | Updated prompt     | System prompt with impersonation instructions      |

## 🔒 Security Features

### Automatic Data Scoping

- ✅ All queries filtered by impersonated user ID
- ✅ Cross-user data access blocked
- ✅ Admin operations disabled
- ✅ Sensitive information protected

### Validation Rules

- ✅ User ID must be valid MongoDB ObjectId (24 hex characters)
- ✅ User must exist in the system
- ✅ All operations scoped to impersonated user only
- ✅ Real-time permission validation

### Error Handling

- ✅ Clear error messages for invalid user IDs
- ✅ Access denied messages for unauthorized operations
- ✅ Graceful degradation for system errors
- ✅ Comprehensive audit logging

## 🛠️ Available Tools

### ✅ Customer-Safe Tools (24 tools)

#### Product Management

- `get-all-products` - Browse product catalog
- `get-product-by-id` - View specific product details
- `get-product-variants` - Check available sizes/colors

#### User Profile (Scoped to Impersonated User)

- `get-user-by-id` - View customer profile
- `update-user` - Update customer profile
- `add-user-address` - Add new shipping/billing address
- `add-user-payment-method` - Add new payment method

#### Shopping Cart (Scoped to Impersonated User)

- `get-carts-by-user` - View customer's shopping carts
- `get-cart-by-id` - View specific cart contents
- `create-cart` - Create new shopping cart
- `update-cart` - Modify cart contents
- `add-item-to-cart` - Add products to cart
- `remove-item-from-cart` - Remove products from cart
- `get-active-cart` - Get customer's current active cart

#### Orders (Scoped to Impersonated User)

- `get-order-by-id` - View order details
- `create-order` - Place new order
- `cancel-order` - Cancel an order

#### Checkout Process

- `get-checkout-by-id` - View checkout session
- `create-checkout` - Start checkout process
- `update-checkout` - Modify checkout details
- `complete-checkout` - Complete purchase

#### Shipping & Tracking (Scoped to Impersonated User)

- `get-shipment-by-id` - View shipment details
- `get-shipment-tracking` - Track package

#### System

- `health-check` - Check system status

### ❌ Admin-Only Tools (19 tools - Restricted)

#### User Management

- `get-all-users` - View all customer data
- `create-user` - Register new customers
- `delete-user` - Remove customer accounts

#### Product Management

- `create-product` - Add new products to catalog
- `update-product` - Modify product information
- `delete-product` - Remove products from catalog

#### Cart Management

- `get-all-carts` - View all shopping carts

#### Order Management

- `get-all-orders` - View all orders
- `update-order` - Modify order details
- `delete-order` - Remove orders
- `update-order-status` - Change order status

#### Checkout Management

- `get-all-checkouts` - View all checkout sessions
- `delete-checkout` - Remove checkout sessions

#### Shipping & Logistics

- `get-all-shipments` - View all shipments
- `create-shipment` - Create shipment records
- `update-shipment` - Modify shipment details
- `delete-shipment` - Remove shipment records
- `add-tracking-event` - Add tracking updates

## 🎯 Use Cases

### Customer Support

```
Scenario: Customer calls for help with their account
Action: "I want to impersonate customer with ID: 507f1f77bcf86cd799439011"
Result: Full access to customer's data while maintaining security
```

### Testing Customer Experience

```
Scenario: Test new feature from customer perspective
Action: "I want to test the customer experience for user 507f1f77bcf86cd799439011"
Result: Simulate customer journey with real data
```

### Training Support Staff

```
Scenario: Train new support agents
Action: Use customer impersonation with test accounts
Result: Safe environment to practice customer interactions
```

### Debugging Customer Issues

```
Scenario: Troubleshoot customer-specific problem
Action: "I want to impersonate customer with ID: 507f1f77bcf86cd799439011"
Result: Access customer's data to identify and fix issues
```

## 📊 Benefits

### For Customer Support

- ✅ Faster issue resolution
- ✅ Better customer understanding
- ✅ Improved support quality
- ✅ Reduced escalation needs

### For Testing

- ✅ Real customer data testing
- ✅ End-to-end flow validation
- ✅ User experience optimization
- ✅ Bug identification and fixing

### For Development

- ✅ Customer perspective development
- ✅ Feature validation
- ✅ User journey mapping
- ✅ Performance optimization

### For Business

- ✅ Improved customer satisfaction
- ✅ Reduced support costs
- ✅ Better product quality
- ✅ Faster issue resolution

## 🔧 Setup Instructions

### 1. Prerequisites

- n8n instance running
- OpenAI API credentials configured
- MongoDB connection established
- Valid user IDs in database

### 2. Import Workflow

1. Open n8n interface
2. Go to Workflows section
3. Click "Import from File"
4. Select `n8n-workflow-customer-impersonation.json`
5. Click "Import"

### 3. Configure Credentials

1. Set up OpenAI API credentials
2. Configure MongoDB connection
3. Test all connections
4. Verify workflow is active

### 4. Test Customer Impersonation

1. Start conversation with user ID
2. Test customer-safe tools
3. Verify admin tools are blocked
4. Check data scoping works correctly

## 🚨 Security Considerations

### Data Protection

- All customer data access is logged
- Cross-user data access is prevented
- Sensitive operations are blocked
- Audit trail is maintained

### Access Control

- User ID validation is enforced
- Permission checks are performed
- Unauthorized access is blocked
- Security violations are logged

### Compliance

- GDPR requirements are met
- Data processing is transparent
- Customer consent is respected
- Right to be forgotten is supported

## 📈 Monitoring and Analytics

### Key Metrics

- Impersonation session duration
- Tools used per session
- Error rates and types
- User satisfaction scores

### Logs to Monitor

- User ID validation attempts
- Tool access patterns
- Security violations
- Error frequencies

### Alerts to Set Up

- Unauthorized access attempts
- High error rates
- Suspicious activity patterns
- System performance issues

## 🛠️ Troubleshooting

### Common Issues

#### Invalid User ID Format

```
Error: "Invalid user ID format"
Solution: Ensure 24-character MongoDB ObjectId format
Example: 507f1f77bcf86cd799439011
```

#### User Not Found

```
Error: "User not found"
Solution: Verify user exists in database
Check: db.users.findOne({_id: ObjectId("507f1f77bcf86cd799439011")})
```

#### Access Denied

```
Error: "Access denied"
Solution: Ensure using customer-safe tools only
Check: Tool is in customer-safe list
```

#### Tool Not Available

```
Error: "Tool not available in customer mode"
Solution: Use customer-safe alternative
Check: Tool access level in documentation
```

### Debug Steps

1. Verify user ID format
2. Check user exists in database
3. Confirm impersonation mode is active
4. Test with customer-safe tools only
5. Check n8n workflow configuration
6. Verify API endpoints are accessible

## 📚 Documentation

### Complete Guides

- `CUSTOMER_IMPERSONATION_GUIDE.md` - Comprehensive guide
- `CUSTOMER_IMPERSONATION_SETUP.md` - Setup instructions
- `CUSTOMER_IMPERSONATION_QUICK_REFERENCE.md` - Quick reference

### Technical Documentation

- `agent-system-prompt.md` - Updated system prompt
- `create-customer-workflow.js` - Workflow generator
- `n8n-workflow-customer-impersonation.json` - Main workflow

## 🤝 Support

### Getting Help

- Check documentation first
- Review troubleshooting guide
- Test with sample user ID
- Contact technical support

### Reporting Issues

- Document error messages
- Include user ID format
- Provide reproduction steps
- Share relevant logs

### Feature Requests

- Describe use case
- Explain expected behavior
- Provide business justification
- Include implementation suggestions

## 🔄 Maintenance

### Regular Tasks

- Review access logs monthly
- Update user permissions quarterly
- Security audit annually
- Update documentation as needed

### Updates

- Monitor for n8n updates
- Test workflow compatibility
- Update tool configurations
- Refresh security measures

## 📞 Contact Information

- **Technical Issues**: [Your technical support contact]
- **Security Concerns**: [Your security team contact]
- **General Questions**: [Your general support contact]
- **Feature Requests**: [Your product team contact]

---

## 🎉 Ready to Use!

You now have a complete customer impersonation system that allows you to:

1. **Impersonate customers safely** with proper security controls
2. **Test customer experiences** with real data
3. **Provide better support** by understanding customer context
4. **Debug issues** from the customer's perspective

Start by importing the workflow and testing with a sample user ID. The system is designed to be secure, user-friendly, and comprehensive.

**Happy customer impersonating!** 🚀
