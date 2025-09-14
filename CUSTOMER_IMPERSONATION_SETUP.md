# Customer Impersonation Setup Guide

## Overview

This guide explains how to set up and use the customer impersonation workflow for testing customer experiences and providing customer support.

## Files Created

### 1. Customer Impersonation Workflow

- **File**: `n8n-workflow-customer-impersonation.json`
- **Purpose**: Complete n8n workflow with customer-safe tools only
- **Tools Included**: 24 customer-safe tools
- **Admin Tools Excluded**: 19 admin-only tools

### 2. Documentation

- **File**: `CUSTOMER_IMPERSONATION_GUIDE.md`
- **Purpose**: Comprehensive guide for using customer impersonation
- **Content**: Tool categorization, security measures, best practices

### 3. Setup Script

- **File**: `create-customer-workflow.js`
- **Purpose**: Script to generate customer impersonation workflow
- **Usage**: Automatically filters tools and creates secure workflow

## Setup Instructions

### Step 1: Import Customer Impersonation Workflow

1. **Open n8n Interface**

   - Navigate to your n8n instance
   - Go to Workflows section

2. **Import Workflow**

   - Click "Import from File"
   - Select `n8n-workflow-customer-impersonation.json`
   - Click "Import"

3. **Configure Credentials**
   - Set up OpenAI API credentials
   - Configure MongoDB connection
   - Test all connections

### Step 2: Configure User ID Input

The workflow expects a user ID to be provided. You can configure this in several ways:

#### Option A: Manual Input (Recommended for Testing)

- Start conversation with: "I want to impersonate customer with ID: [USER_ID]"
- Replace [USER_ID] with actual MongoDB ObjectId

#### Option B: Webhook Configuration

- Modify the chat trigger to accept user ID parameter
- Update webhook URL to include user ID

#### Option C: Environment Variable

- Set default user ID in environment variables
- Use for testing with consistent user

### Step 3: Test Customer Impersonation

#### Test Scenarios

1. **Product Browsing**

   ```
   "Show me all electronics products"
   ```

2. **Cart Management**

   ```
   "Show me my current cart"
   "Add product ID 123 to my cart"
   ```

3. **Order Tracking**

   ```
   "Show me my order with ID 456"
   "Track my shipment 789"
   ```

4. **Profile Management**
   ```
   "Show me my profile"
   "Add a new address"
   ```

## Security Features

### Automatic Data Scoping

- All queries automatically filter by impersonated user ID
- Cross-user data access is prevented
- Admin operations are blocked

### Validation Rules

- User ID must be valid MongoDB ObjectId (24 hex characters)
- User must exist in the system
- All operations scoped to impersonated user only

### Error Handling

- Clear error messages for invalid user IDs
- Access denied messages for unauthorized operations
- Graceful degradation for system errors

## Tool Categories

### ✅ Customer-Safe Tools (24 tools)

- **Product Management**: Browse products, view details, check variants
- **User Profile**: View/update own profile, add addresses/payment methods
- **Shopping Cart**: Manage own carts, add/remove items
- **Orders**: View own orders, create orders, cancel orders
- **Checkout**: Complete purchase process
- **Shipping**: Track own shipments
- **System**: Health checks

### ❌ Admin-Only Tools (19 tools - Excluded)

- **User Management**: Get all users, create/delete users
- **Product Management**: Create/update/delete products
- **Order Management**: Get all orders, update/delete orders, change status
- **Cart Management**: Get all carts
- **Checkout Management**: Get all checkouts, delete checkouts
- **Shipping Management**: Get all shipments, create/update/delete shipments, add tracking events

## Usage Examples

### Customer Support Scenario

```
Agent: "I'm here to help you with your account. What's your user ID?"
Customer: "My user ID is 507f1f77bcf86cd799439011"
Agent: "Thank you. I can now help you with your account. What would you like to do?"
Customer: "Show me my recent orders"
Agent: [Uses get-order-by-id tool scoped to user 507f1f77bcf86cd799439011]
```

### Testing Scenario

```
Tester: "I want to test the customer experience for user 507f1f77bcf86cd799439011"
Agent: "I'm now in customer impersonation mode for user 507f1f77bcf86cd799439011. How can I help?"
Tester: "Let me browse products and add items to cart"
Agent: [Uses customer-safe tools only]
```

## Monitoring and Logging

### Audit Trail

- All impersonation activities are logged
- User ID is tracked in all operations
- Access attempts to restricted tools are recorded

### Security Monitoring

- Monitor for unauthorized access attempts
- Track user ID validation failures
- Alert on suspicious activity patterns

## Troubleshooting

### Common Issues

1. **Invalid User ID Format**

   - Error: "Invalid user ID format"
   - Solution: Ensure 24-character MongoDB ObjectId format

2. **User Not Found**

   - Error: "User not found"
   - Solution: Verify user exists in database

3. **Access Denied**

   - Error: "Access denied"
   - Solution: Ensure using customer-safe tools only

4. **Tool Not Available**
   - Error: "Tool not available in customer mode"
   - Solution: Use customer-safe alternative

### Debug Steps

1. **Check User ID Format**

   ```javascript
   // Valid MongoDB ObjectId format
   const userId = "507f1f77bcf86cd799439011";
   console.log(/^[0-9a-fA-F]{24}$/.test(userId)); // Should return true
   ```

2. **Verify User Exists**

   ```bash
   # Check if user exists in MongoDB
   db.users.findOne({_id: ObjectId("507f1f77bcf86cd799439011")})
   ```

3. **Test API Endpoints**
   ```bash
   # Test user-specific endpoint
   curl "https://your-api.com/api/users/507f1f77bcf86cd799439011"
   ```

## Best Practices

### For Customer Support

1. Always verify customer identity before impersonation
2. Use impersonation only for legitimate support purposes
3. Document the reason for impersonation
4. End impersonation session when support is complete

### For Testing

1. Use test user accounts for development
2. Never impersonate real customer accounts in testing
3. Clean up test data after testing sessions
4. Use dedicated test environments

### For Development

1. Implement proper access controls
2. Log all impersonation activities
3. Regular security audits
4. Monitor for unauthorized access attempts

## Compliance and Security

### GDPR Considerations

- Customer consent required for data access
- Right to be forgotten implementation
- Data processing transparency
- Audit trail maintenance

### Security Requirements

- Regular access reviews
- Principle of least privilege
- Multi-factor authentication for admin access
- Regular security training for support staff

## Support and Maintenance

### Regular Tasks

- Review access logs monthly
- Update user permissions quarterly
- Security audit annually
- Update documentation as needed

### Contact Information

- Technical Issues: [Your technical support contact]
- Security Concerns: [Your security team contact]
- General Questions: [Your general support contact]

## Next Steps

1. **Import the workflow** into your n8n instance
2. **Configure credentials** and test connections
3. **Set up user ID input** method
4. **Test customer impersonation** with sample user
5. **Train support staff** on proper usage
6. **Implement monitoring** and logging
7. **Regular security reviews** and updates
