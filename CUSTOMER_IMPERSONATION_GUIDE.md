# Customer Impersonation Guide

## Overview

This guide explains how to use the e-commerce AI agent in customer impersonation mode to simulate customer experiences while maintaining security and privacy.

## Tool Categorization

### 🟢 Customer-Accessible Tools (Safe for Impersonation)

#### Product Management

- **Get All Products** - Browse product catalog
- **Get Product by ID** - View specific product details
- **Get Product Variants** - Check available sizes/colors

#### User Management (Limited)

- **Get User by ID** - View customer profile (only for impersonated user)
- **Update User** - Update customer profile (only for impersonated user)
- **Add User Address** - Add shipping addresses (only for impersonated user)
- **Add User Payment Method** - Add payment methods (only for impersonated user)

#### Shopping Cart

- **Get Carts by User ID** - View user's carts (only for impersonated user)
- **Get Cart by ID** - View specific cart
- **Create Cart** - Create new cart
- **Update Cart** - Modify cart contents
- **Add Item to Cart** - Add products to cart
- **Remove Item from Cart** - Remove products from cart
- **Get Active Cart** - Get user's active cart

#### Orders (Limited)

- **Get Order by ID** - View order details (only for impersonated user's orders)
- **Create Order** - Place new order
- **Cancel Order** - Cancel order (only for impersonated user's orders)

#### Checkout Process

- **Get Checkout by ID** - View checkout session
- **Create Checkout** - Start checkout process
- **Update Checkout** - Modify checkout details
- **Complete Checkout** - Complete purchase

#### Shipping & Tracking

- **Get Shipment by ID** - View shipment details (only for impersonated user's shipments)
- **Get Shipment Tracking** - Track package (only for impersonated user's shipments)

#### System

- **Health Check** - Check system status

### 🔴 Admin-Only Tools (Restricted in Customer Mode)

#### Product Management

- **Create Product** - Add new products to catalog
- **Update Product** - Modify product information
- **Delete Product** - Remove products from catalog

#### User Management

- **Get All Users** - View all customer data
- **Create User** - Register new customers
- **Delete User** - Remove customer accounts

#### Cart Management

- **Get All Carts** - View all shopping carts

#### Order Management

- **Get All Orders** - View all orders
- **Update Order** - Modify order details
- **Delete Order** - Remove orders
- **Update Order Status** - Change order status

#### Checkout Management

- **Get All Checkouts** - View all checkout sessions
- **Delete Checkout** - Remove checkout sessions

#### Shipping & Logistics

- **Get All Shipments** - View all shipments
- **Create Shipment** - Create shipment records
- **Update Shipment** - Modify shipment details
- **Delete Shipment** - Remove shipment records
- **Add Tracking Event** - Add tracking updates

## Customer Impersonation Workflow

### Prerequisites

1. Valid user ID (MongoDB ObjectId format)
2. Customer impersonation mode enabled
3. Proper authentication setup

### Usage Instructions

#### 1. Enable Customer Mode

When starting a conversation, specify:

```
"I want to impersonate customer with ID: [USER_ID]"
```

#### 2. Available Actions in Customer Mode

- Browse products and variants
- View own cart and orders
- Add/remove items from cart
- Complete checkout process
- Track own shipments
- Update own profile information
- Add/update addresses and payment methods

#### 3. Restricted Actions

The following actions are automatically blocked:

- Viewing other customers' data
- Accessing admin analytics
- Modifying system-wide settings
- Creating/deleting products
- Managing other users' orders

### Security Measures

#### Data Isolation

- All queries automatically filter by impersonated user ID
- Cross-user data access is prevented
- Sensitive admin operations are disabled

#### Validation Rules

- User ID must be valid MongoDB ObjectId
- User must exist in the system
- All operations are scoped to the impersonated user

#### Audit Trail

- All impersonation activities are logged
- User ID is tracked in all operations
- Access attempts to restricted tools are recorded

## Implementation

### Workflow Configuration

The customer impersonation workflow includes:

1. User ID validation
2. Tool filtering based on access level
3. Automatic data scoping
4. Security logging

### Error Handling

- Invalid user ID: Clear error message with format requirements
- Non-existent user: User not found error
- Unauthorized access: Access denied message
- System errors: Graceful degradation with user-friendly messages

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

## Troubleshooting

### Common Issues

1. **Invalid User ID**: Ensure ObjectId format (24 hex characters)
2. **Access Denied**: Check if user exists and is active
3. **Tool Not Available**: Verify customer mode is enabled
4. **Data Not Found**: Confirm user has the requested data

### Support Contacts

- Technical Issues: [Your technical support contact]
- Security Concerns: [Your security team contact]
- General Questions: [Your general support contact]

## Compliance Notes

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
