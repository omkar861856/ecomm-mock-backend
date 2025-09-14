const { createEntity } = require("../models");

// Sample data from the provided JSON
const sampleData = {
  product: {
    id: "prod_nike_hoodie_001",
    sku: "NIKE-HOOD-001",
    name: "Nike Tech Fleece Hoodie",
    brand: "Nike",
    description:
      "Classic Nike Tech Fleece hoodie — soft, warm, modern cut. Ideal for workouts or everyday wear.",
    categories: ["apparel", "hoodies", "men"],
    tags: ["nike", "tech-fleece", "hoodie", "new-arrival"],
    images: [
      "https://cdn.example.com/products/nike_hoodie_front.jpg",
      "https://cdn.example.com/products/nike_hoodie_back.jpg",
      "https://cdn.example.com/products/nike_hoodie_side.jpg",
    ],
    variants: [
      {
        variant_id: "prod_nike_hoodie_001_blk_m",
        color: "Black",
        size: "M",
        barcode: "8901234567890",
        price: {
          currency: "INR",
          amount: 4999.0,
          msrp: 5999.0,
          discount: {
            type: "percentage",
            value: 16.67,
            label: "Sale 17% off",
          },
        },
        inventory: {
          available: 12,
          allocated: 0,
          safety_stock: 2,
          warehouse_location: "WH-DEL-1",
          backorderable: false,
        },
        weight_kg: 0.7,
        dimensions_cm: {
          length: 40,
          width: 30,
          height: 2,
        },
      },
      {
        variant_id: "prod_nike_hoodie_001_grey_l",
        color: "Heather Grey",
        size: "L",
        barcode: "8901234567891",
        price: {
          currency: "INR",
          amount: 4999.0,
        },
        inventory: {
          available: 0,
          allocated: 0,
          safety_stock: 1,
          warehouse_location: "WH-MUM-2",
          backorderable: true,
          expected_restock_date: "2025-09-25T00:00:00Z",
        },
      },
    ],
    shipping: {
      weight_kg: 0.8,
      dimensions_cm: {
        length: 42,
        width: 32,
        height: 4,
      },
      origin: {
        warehouse_id: "WH-DEL-1",
        address: "Warehouse 1, Delhi Logistics Park, New Delhi, India",
      },
      free_shipping_over: 3999.0,
      eligible_shipping_methods: ["standard", "express", "store_pickup"],
    },
    warranty: {
      type: "manufacturer",
      duration_days: 365,
      notes:
        "Covers manufacturing defects only. Does not cover wear-and-tear or improper care.",
    },
    return_policy: {
      days_window: 14,
      condition: "Unworn, unwashed, tags attached",
      restocking_fee: 0,
      who_pays_return_shipping: "customer",
      exceptions: ["final-sale items cannot be returned"],
    },
  },
  user: {
    id: "user_00987",
    name: "Asha Patel",
    email: "asha.patel@example.com",
    phone: "+91-9876543210",
    loyalty_tier: "Gold",
    loyalty_points: 1240,
    addresses: [
      {
        address_id: "addr_home_001",
        label: "Home",
        recipient: "Asha Patel",
        line1: "Flat 12B, Sunrise Apartments",
        line2: "MG Road",
        city: "Bengaluru",
        state: "Karnataka",
        postal_code: "560001",
        country: "India",
        preferred: true,
      },
      {
        address_id: "addr_work_001",
        label: "Office",
        recipient: "Asha Patel",
        line1: "12th Floor, Tech Park",
        line2: "Old Airport Road",
        city: "Bengaluru",
        state: "Karnataka",
        postal_code: "560017",
        country: "India",
        preferred: false,
      },
    ],
    payment_methods: [
      {
        payment_id: "pm_card_visa_01",
        type: "card",
        brand: "Visa",
        last4: "4242",
        expiry: "2027-08",
        billing_address_id: "addr_home_001",
        tokenized: true,
      },
      {
        payment_id: "pm_upi_01",
        type: "upi",
        vpa: "asha@upi",
        preferred: true,
      },
    ],
  },
  cart: {
    cart_id: "cart_5592",
    user_id: "user_00987",
    items: [
      {
        variant_id: "prod_nike_hoodie_001_blk_m",
        quantity: 1,
        unit_price: 4999.0,
        line_total: 4999.0,
      },
    ],
    applied_coupons: [
      {
        code: "WELCOME100",
        type: "fixed",
        value: 100.0,
        applies_to: "order",
        min_cart_value: 1000.0,
        valid_till: "2026-01-01T00:00:00Z",
      },
    ],
    estimated_taxes: 450.0,
    estimated_shipping: 50.0,
    currency: "INR",
    cart_total: 5399.0,
    created_at: "2025-09-14T07:12:00Z",
    updated_at: "2025-09-14T07:13:20Z",
  },
  checkout: {
    checkout_id: "chk_100801",
    cart_id: "cart_5592",
    user_id: "user_00987",
    selected_shipping_address_id: "addr_home_001",
    selected_billing_address_id: "addr_home_001",
    shipping_method: {
      id: "express",
      label: "Express Delivery (1-2 business days)",
      cost: 50.0,
      carrier_estimated_days: 2,
    },
    payment: {
      selected_payment_id: "pm_upi_01",
      amount_authorized: 5399.0,
      currency: "INR",
      payment_status: "pending",
      payment_gateway: "Razorpay",
      payment_intent_id: null,
    },
    order_review: {
      subtotal: 4999.0,
      discounts: 100.0,
      taxes: 450.0,
      shipping: 50.0,
      total: 5399.0,
      currency: "INR",
    },
    placed_at: null,
  },
  order: {
    order_id: "order_20250914_0001",
    user_id: "user_00987",
    status: "PLACED",
    status_history: [
      {
        status: "PLACED",
        timestamp: "2025-09-14T07:14:02Z",
        by: "system",
        note: "Order created after successful payment authorization",
      },
    ],
    items: [
      {
        variant_id: "prod_nike_hoodie_001_blk_m",
        name: "Nike Tech Fleece Hoodie - Black - M",
        quantity: 1,
        unit_price: 4999.0,
        tax_amount: 450.0,
        line_total: 5449.0,
      },
    ],
    fulfillment: {
      fulfillment_id: "ful_70012",
      warehouse_id: "WH-DEL-1",
      fulfillment_type: "shipment",
      pick_list: [
        {
          variant_id: "prod_nike_hoodie_001_blk_m",
          quantity: 1,
          picked: false,
        },
      ],
      packing: {
        packed: false,
        package_id: null,
        package_dimensions_cm: null,
      },
    },
    payment: {
      payment_id: "pay_9001",
      method: "upi",
      gateway: "Razorpay",
      amount: 5399.0,
      currency: "INR",
      status: "authorized",
      authorized_at: "2025-09-14T07:14:00Z",
      captured_at: null,
      capture_attempts: 0,
    },
    shipping: {
      recipient_address_id: "addr_home_001",
      shipping_method_id: "express",
      shipping_cost: 50.0,
      carrier: null,
      tracking: {
        tracking_number: null,
        carrier: null,
        estimated_delivery: "2025-09-16T18:00:00Z",
        events: [],
      },
      estimated_delivery_window: {
        start: "2025-09-16T09:00:00Z",
        end: "2025-09-16T18:00:00Z",
      },
    },
    totals: {
      subtotal: 4999.0,
      discounts: 100.0,
      tax: 450.0,
      shipping: 50.0,
      grand_total: 5399.0,
      currency: "INR",
    },
    notes: "Gift wrap: No. Deliver between 9am-6pm.",
    created_at: "2025-09-14T07:14:02Z",
    updated_at: "2025-09-14T07:14:02Z",
    metadata: {
      source: "web_checkout",
      utm: {
        campaign: "sep_sale",
        source: "email",
      },
    },
  },
  shipment: {
    shipment_id: null,
    order_id: "order_20250914_0001",
    carrier: null,
    service_level: null,
    tracking_number: null,
    label_created_at: null,
    shipped_at: null,
    delivered_at: null,
    events: [],
    proof_of_delivery: null,
  },
};

// Additional sample data for testing
const additionalProducts = [
  {
    sku: "ADIDAS-SHOE-001",
    name: "Adidas Ultraboost 22",
    brand: "Adidas",
    description:
      "Premium running shoes with responsive cushioning and energy return.",
    categories: ["footwear", "running", "men"],
    tags: ["adidas", "ultraboost", "running", "premium"],
    images: [
      "https://cdn.example.com/products/adidas_ultraboost_front.jpg",
      "https://cdn.example.com/products/adidas_ultraboost_side.jpg",
    ],
    variants: [
      {
        variant_id: "prod_adidas_shoe_001_blk_9",
        color: "Black",
        size: "9",
        barcode: "8901234567892",
        price: {
          currency: "INR",
          amount: 12999.0,
          msrp: 14999.0,
          discount: {
            type: "percentage",
            value: 13.33,
            label: "Sale 13% off",
          },
        },
        inventory: {
          available: 8,
          allocated: 0,
          safety_stock: 2,
          warehouse_location: "WH-DEL-1",
          backorderable: false,
        },
        weight_kg: 0.3,
        dimensions_cm: {
          length: 32,
          width: 12,
          height: 8,
        },
      },
    ],
    shipping: {
      weight_kg: 0.4,
      dimensions_cm: {
        length: 35,
        width: 15,
        height: 10,
      },
      origin: {
        warehouse_id: "WH-DEL-1",
        address: "Warehouse 1, Delhi Logistics Park, New Delhi, India",
      },
      free_shipping_over: 3999.0,
      eligible_shipping_methods: ["standard", "express"],
    },
    warranty: {
      type: "manufacturer",
      duration_days: 365,
      notes: "Covers manufacturing defects only.",
    },
    return_policy: {
      days_window: 14,
      condition: "Unworn, original packaging",
      restocking_fee: 0,
      who_pays_return_shipping: "customer",
      exceptions: ["final-sale items cannot be returned"],
    },
  },
];

const additionalUsers = [
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+91-9876543211",
    loyalty_tier: "Silver",
    loyalty_points: 750,
    addresses: [
      {
        address_id: "addr_home_002",
        label: "Home",
        recipient: "Rajesh Kumar",
        line1: "House No. 45, Sector 12",
        line2: "Near Metro Station",
        city: "Delhi",
        state: "Delhi",
        postal_code: "110075",
        country: "India",
        preferred: true,
      },
    ],
    payment_methods: [
      {
        payment_id: "pm_card_master_01",
        type: "card",
        brand: "Mastercard",
        last4: "5555",
        expiry: "2026-12",
        billing_address_id: "addr_home_002",
        tokenized: true,
      },
    ],
  },
];

function seedData() {
  console.log("🌱 Starting data seeding...");

  try {
    // Seed products
    console.log("📦 Seeding products...");
    createEntity("products", sampleData.product, "prod");
    additionalProducts.forEach((product) => {
      createEntity("products", product, "prod");
    });
    console.log(`✅ Created ${1 + additionalProducts.length} products`);

    // Seed users
    console.log("👥 Seeding users...");
    createEntity("users", sampleData.user, "user");
    additionalUsers.forEach((user) => {
      createEntity("users", user, "user");
    });
    console.log(`✅ Created ${1 + additionalUsers.length} users`);

    // Seed cart
    console.log("🛒 Seeding cart...");
    createEntity("carts", sampleData.cart, "cart");
    console.log("✅ Created 1 cart");

    // Seed checkout
    console.log("💳 Seeding checkout...");
    createEntity("checkouts", sampleData.checkout, "chk");
    console.log("✅ Created 1 checkout");

    // Seed order
    console.log("📋 Seeding order...");
    createEntity("orders", sampleData.order, "order");
    console.log("✅ Created 1 order");

    // Seed shipment
    console.log("🚚 Seeding shipment...");
    createEntity("shipments", sampleData.shipment, "ship");
    console.log("✅ Created 1 shipment");

    console.log("🎉 Data seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- Products: ${1 + additionalProducts.length}`);
    console.log(`- Users: ${1 + additionalUsers.length}`);
    console.log(`- Carts: 1`);
    console.log(`- Checkouts: 1`);
    console.log(`- Orders: 1`);
    console.log(`- Shipments: 1`);
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = { seedData, sampleData };
