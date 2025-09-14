const Joi = require("joi");

// Checkout validation schema
const checkoutSchema = Joi.object({
  checkout_id: Joi.string().optional(),
  cart_id: Joi.string().required(),
  user_id: Joi.string().required(),
  selected_shipping_address_id: Joi.string().required(),
  selected_billing_address_id: Joi.string().required(),
  shipping_method: Joi.object({
    id: Joi.string().required(),
    label: Joi.string().required(),
    cost: Joi.number().min(0).required(),
    carrier_estimated_days: Joi.number().integer().positive().required(),
  }).required(),
  payment: Joi.object({
    selected_payment_id: Joi.string().required(),
    amount_authorized: Joi.number().positive().required(),
    currency: Joi.string().required(),
    payment_status: Joi.string()
      .valid("pending", "authorized", "failed")
      .required(),
    payment_gateway: Joi.string().required(),
    payment_intent_id: Joi.string().optional(),
  }).required(),
  order_review: Joi.object({
    subtotal: Joi.number().positive().required(),
    discounts: Joi.number().min(0).required(),
    taxes: Joi.number().min(0).required(),
    shipping: Joi.number().min(0).required(),
    total: Joi.number().positive().required(),
    currency: Joi.string().required(),
  }).required(),
  placed_at: Joi.string().isoDate().optional(),
});

const validateCheckout = (checkout) => {
  const { error, value } = checkoutSchema.validate(checkout);
  if (error) {
    throw new Error(
      `Checkout validation error: ${error.details
        .map((d) => d.message)
        .join(", ")}`
    );
  }
  return value;
};

module.exports = {
  checkoutSchema,
  validateCheckout,
};
