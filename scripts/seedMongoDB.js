const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Product = require('../models/mongodb/Product');
const User = require('../models/mongodb/User');
const Cart = require('../models/mongodb/Cart');
const Order = require('../models/mongodb/Order');
const Checkout = require('../models/mongodb/Checkout');
const Shipment = require('../models/mongodb/Shipment');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://ecomm_mock:QUSAEpWfeg1aSWAA@cluster0.wttchje.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleProducts = [
  {
    name: "iPhone 15 Pro",
    description: "Latest iPhone with titanium design and advanced camera system",
    price: 999.99,
    category: "electronics",
    brand: "Apple",
    variants: [
      {
        name: "128GB Natural Titanium",
        price: 999.99,
        stock: 50,
        attributes: { color: "Natural Titanium", storage: "128GB" },
        sku: "IPH15P-128-NT"
      },
      {
        name: "256GB Natural Titanium",
        price: 1099.99,
        stock: 30,
        attributes: { color: "Natural Titanium", storage: "256GB" },
        sku: "IPH15P-256-NT"
      },
      {
        name: "128GB Blue Titanium",
        price: 999.99,
        stock: 25,
        attributes: { color: "Blue Titanium", storage: "128GB" },
        sku: "IPH15P-128-BT"
      }
    ],
    images: [
      { url: "https://example.com/iphone15pro1.jpg", alt: "iPhone 15 Pro Front", isPrimary: true },
      { url: "https://example.com/iphone15pro2.jpg", alt: "iPhone 15 Pro Back" }
    ],
    tags: ["smartphone", "apple", "premium", "camera"],
    specifications: {
      weight: "187g",
      dimensions: "146.6 x 70.6 x 8.25 mm",
      material: "Titanium",
      warranty: "1 year",
      features: ["5G", "Face ID", "Wireless Charging", "Water Resistant"]
    }
  },
  {
    name: "MacBook Pro 16-inch",
    description: "Powerful laptop with M3 Pro chip for professionals",
    price: 2499.99,
    category: "electronics",
    brand: "Apple",
    variants: [
      {
        name: "M3 Pro 512GB Space Gray",
        price: 2499.99,
        stock: 20,
        attributes: { color: "Space Gray", storage: "512GB", chip: "M3 Pro" },
        sku: "MBP16-M3P-512-SG"
      },
      {
        name: "M3 Pro 1TB Space Gray",
        price: 2799.99,
        stock: 15,
        attributes: { color: "Space Gray", storage: "1TB", chip: "M3 Pro" },
        sku: "MBP16-M3P-1TB-SG"
      }
    ],
    images: [
      { url: "https://example.com/macbookpro1.jpg", alt: "MacBook Pro 16-inch", isPrimary: true }
    ],
    tags: ["laptop", "apple", "professional", "m3"],
    specifications: {
      weight: "2.16kg",
      dimensions: "355.7 x 248.1 x 16.8 mm",
      material: "Aluminum",
      warranty: "1 year",
      features: ["Touch Bar", "Touch ID", "Thunderbolt 4", "Wi-Fi 6E"]
    }
  },
  {
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with Max Air cushioning",
    price: 150.00,
    category: "clothing",
    brand: "Nike",
    variants: [
      {
        name: "Black/White Size 9",
        price: 150.00,
        stock: 100,
        attributes: { color: "Black/White", size: "9" },
        sku: "NAM270-BW-9"
      },
      {
        name: "White/Black Size 10",
        price: 150.00,
        stock: 80,
        attributes: { color: "White/Black", size: "10" },
        sku: "NAM270-WB-10"
      },
      {
        name: "Red/White Size 11",
        price: 150.00,
        stock: 60,
        attributes: { color: "Red/White", size: "11" },
        sku: "NAM270-RW-11"
      }
    ],
    images: [
      { url: "https://example.com/nike2701.jpg", alt: "Nike Air Max 270 Side", isPrimary: true },
      { url: "https://example.com/nike2702.jpg", alt: "Nike Air Max 270 Top" }
    ],
    tags: ["shoes", "nike", "running", "comfortable"],
    specifications: {
      weight: "300g",
      material: "Mesh and Synthetic",
      warranty: "90 days",
      features: ["Max Air Cushioning", "Breathable Upper", "Rubber Outsole"]
    }
  },
  {
    name: "Samsung 55-inch 4K Smart TV",
    description: "Ultra HD Smart TV with HDR and voice control",
    price: 699.99,
    category: "electronics",
    brand: "Samsung",
    variants: [
      {
        name: "55-inch Black",
        price: 699.99,
        stock: 25,
        attributes: { color: "Black", size: "55-inch" },
        sku: "SAMSUNG-TV-55-BLK"
      },
      {
        name: "65-inch Black",
        price: 899.99,
        stock: 15,
        attributes: { color: "Black", size: "65-inch" },
        sku: "SAMSUNG-TV-65-BLK"
      }
    ],
    images: [
      { url: "https://example.com/samsungtv1.jpg", alt: "Samsung Smart TV", isPrimary: true }
    ],
    tags: ["tv", "samsung", "4k", "smart", "hdr"],
    specifications: {
      weight: "15.2kg",
      dimensions: "123.2 x 70.7 x 5.9 cm",
      material: "Plastic and Metal",
      warranty: "1 year",
      features: ["4K UHD", "HDR", "Smart TV", "Voice Control", "Wi-Fi"]
    }
  },
  {
    name: "The Great Gatsby",
    description: "Classic American novel by F. Scott Fitzgerald",
    price: 12.99,
    category: "books",
    brand: "Penguin Classics",
    variants: [
      {
        name: "Paperback",
        price: 12.99,
        stock: 200,
        attributes: { format: "Paperback", language: "English" },
        sku: "BOOK-GATSBY-PB"
      },
      {
        name: "Hardcover",
        price: 19.99,
        stock: 50,
        attributes: { format: "Hardcover", language: "English" },
        sku: "BOOK-GATSBY-HC"
      }
    ],
    images: [
      { url: "https://example.com/gatsby1.jpg", alt: "The Great Gatsby Book Cover", isPrimary: true }
    ],
    tags: ["book", "classic", "literature", "american"],
    specifications: {
      weight: "200g",
      dimensions: "19.8 x 12.9 x 1.8 cm",
      material: "Paper",
      warranty: "N/A",
      features: ["Classic Literature", "Penguin Edition", "Introduction Included"]
    }
  }
];

const sampleUsers = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    addresses: [
      {
        type: "home",
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
        isDefault: true
      }
    ],
    paymentMethods: [
      {
        type: "credit_card",
        cardNumber: "**** **** **** 1234",
        expiryDate: "12/25",
        cvv: "***",
        cardholderName: "John Doe",
        isDefault: true
      }
    ],
    loyaltyTier: "gold",
    loyaltyPoints: 2500,
    preferences: {
      newsletter: true,
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      currency: "USD",
      language: "en"
    }
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1-555-0456",
    addresses: [
      {
        type: "home",
        street: "456 Oak Avenue",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "United States",
        isDefault: true
      }
    ],
    paymentMethods: [
      {
        type: "credit_card",
        cardNumber: "**** **** **** 5678",
        expiryDate: "08/26",
        cvv: "***",
        cardholderName: "Jane Smith",
        isDefault: true
      }
    ],
    loyaltyTier: "silver",
    loyaltyPoints: 1200,
    preferences: {
      newsletter: true,
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      currency: "USD",
      language: "en"
    }
  },
  {
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "+1-555-0789",
    addresses: [
      {
        type: "home",
        street: "789 Pine Road",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "United States",
        isDefault: true
      }
    ],
    paymentMethods: [
      {
        type: "debit_card",
        cardNumber: "**** **** **** 9012",
        expiryDate: "05/27",
        cvv: "***",
        cardholderName: "Mike Johnson",
        isDefault: true
      }
    ],
    loyaltyTier: "bronze",
    loyaltyPoints: 500,
    preferences: {
      newsletter: false,
      notifications: {
        email: false,
        sms: false,
        push: true
      },
      currency: "USD",
      language: "en"
    }
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await Checkout.deleteMany({});
    await Shipment.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Seed products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${products.length} products`);

    // Seed users
    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Seeded ${users.length} users`);

    // Create sample carts
    const carts = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const cart = new Cart({
        userId: user._id,
        items: [
          {
            productId: products[i % products.length]._id,
            variantId: products[i % products.length].variants[0].sku,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: products[i % products.length].variants[0].price
          }
        ]
      });
      await cart.save();
      carts.push(cart);
    }
    console.log(`✅ Seeded ${carts.length} carts`);

    // Create sample orders
    const orders = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const product = products[i % products.length];
      const order = new Order({
        userId: user._id,
        items: [
          {
            productId: product._id,
            variantId: product.variants[0].sku,
            productName: product.name,
            quantity: Math.floor(Math.random() * 2) + 1,
            price: product.variants[0].price,
            total: product.variants[0].price * (Math.floor(Math.random() * 2) + 1)
          }
        ],
        shippingAddress: user.addresses[0],
        billingAddress: user.addresses[0],
        paymentMethod: {
          type: user.paymentMethods[0].type,
          cardNumber: user.paymentMethods[0].cardNumber,
          expiryDate: user.paymentMethods[0].expiryDate,
          cardholderName: user.paymentMethods[0].cardholderName
        },
        status: ['pending', 'confirmed', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
        subtotal: product.variants[0].price * (Math.floor(Math.random() * 2) + 1),
        tax: 0,
        shipping: 9.99,
        total: product.variants[0].price * (Math.floor(Math.random() * 2) + 1) + 9.99
      });
      await order.save();
      orders.push(order);
    }
    console.log(`✅ Seeded ${orders.length} orders`);

    // Create sample shipments
    const shipments = [];
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const shipment = new Shipment({
        orderId: order._id,
        orderNumber: order.orderNumber,
        carrier: ['UPS', 'FedEx', 'USPS'][Math.floor(Math.random() * 3)],
        trackingNumber: 'TRK' + Date.now() + i,
        status: ['pending', 'in_transit', 'delivered'][Math.floor(Math.random() * 3)],
        shippingAddress: order.shippingAddress,
        items: order.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          weight: 1.0,
          dimensions: { length: 10, width: 10, height: 5 }
        })),
        packageDetails: {
          weight: 2.0,
          dimensions: { length: 15, width: 12, height: 8 },
          packageType: 'package'
        },
        shippingMethod: 'ground',
        cost: 9.99,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        trackingEvents: [
          {
            status: 'pending',
            location: { city: 'Warehouse', state: 'CA', country: 'US' },
            description: 'Package prepared for shipment',
            timestamp: new Date()
          }
        ]
      });
      await shipment.save();
      shipments.push(shipment);
    }
    console.log(`✅ Seeded ${shipments.length} shipments`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Products: ${products.length}`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Carts: ${carts.length}`);
    console.log(`   Orders: ${orders.length}`);
    console.log(`   Shipments: ${shipments.length}`);

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run seeding
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

runSeed();
