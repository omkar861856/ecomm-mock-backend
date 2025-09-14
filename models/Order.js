const Joi = require("joi");

// Order validation schema
const orderSchema = Joi.object({
  order_id: Joi.string().optional(),
  user_id: Joi.string().required(),
  status: Joi.string()
    .valid(
      "PLACED",
      "CONFIRMED",
      "PICKED",
      "PACKED",
      "SHIPPED",
      "IN_TRANSIT",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "RETURN_REQUESTED",
      "RETURNED",
      "REFUNDED",
      "CANCELLED"
    )
    .required(),
  status_history: Joi.array()
    .items(
      Joi.object({
        status: Joi.string().required(),
        timestamp: Joi.string().isoDate().required(),
        by: Joi.string().required(),
        note: Joi.string().required(),
      })
    )
    .required(),
  items: Joi.array()
    .items(
      Joi.object({
        variant_id: Joi.string().required(),
        name: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        unit_price: Joi.number().positive().required(),
        tax_amount: Joi.number().min(0).required(),
        line_total: Joi.number().positive().required(),
      })
    )
    .required(),
  fulfillment: Joi.object({
    fulfillment_id: Joi.string().required(),
    warehouse_id: Joi.string().required(),
    fulfillment_type: Joi.string().required(),
    pick_list: Joi.array()
      .items(
        Joi.object({
          variant_id: Joi.string().required(),
          quantity: Joi.number().integer().min(1).required(),
          picked: Joi.boolean().required(),
        })
      )
      .required(),
    packing: Joi.object({
      packed: Joi.boolean().required(),
      package_id: Joi.string().optional(),
      package_dimensions_cm: Joi.object().optional(),
    }).required(),
  }).required(),
  payment: Joi.object({
    payment_id: Joi.string().required(),
    method: Joi.string().required(),
    gateway: Joi.string().required(),
    amount: Joi.number().positive().required(),
    currency: Joi.string().required(),
    status: Joi.string()
      .valid("pending", "authorized", "captured", "failed", "refunded")
      .required(),
    authorized_at: Joi.string().isoDate().optional(),
    captured_at: Joi.string().isoDate().optional(),
    capture_attempts: Joi.number().integer().min(0).required(),
  }).required(),
  shipping: Joi.object({
    recipient_address_id: Joi.string().required(),
    shipping_method_id: Joi.string().required(),
    shipping_cost: Joi.number().min(0).required(),
    carrier: Joi.string().optional(),
    tracking: Joi.object({
      tracking_number: Joi.string().optional(),
      carrier: Joi.string().optional(),
      estimated_delivery: Joi.string().isoDate().optional(),
      events: Joi.array().items(Joi.object()).required(),
    }).required(),
    estimated_delivery_window: Joi.object({
      start: Joi.string().isoDate().required(),
      end: Joi.string().isoDate().required(),
    }).required(),
  }).required(),
  totals: Joi.object({
    subtotal: Joi.number().positive().required(),
    discounts: Joi.number().min(0).required(),
    tax: Joi.number().min(0).required(),
    shipping: Joi.number().min(0).required(),
    grand_total: Joi.number().positive().required(),
    currency: Joi.string().required(),
  }).required(),
  notes: Joi.string().optional(),
  created_at: Joi.string().isoDate().optional(),
  updated_at: Joi.string().isoDate().optional(),
  metadata: Joi.object().optional(),
});

const validateOrder = (order) => {
  const { error, value } = orderSchema.validate(order);
  if (error) {
    throw new Error(
      `Order validation error: ${error.details
        .map((d) => d.message)
        .join(", ")}`
    );
  }
  return value;
};

module.exports = {
  orderSchema,
  validateOrder,
};
