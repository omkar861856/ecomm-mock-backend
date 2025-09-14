const Joi = require("joi");

// Cart validation schema
const cartSchema = Joi.object({
  cart_id: Joi.string().optional(),
  user_id: Joi.string().required(),
  items: Joi.array()
    .items(
      Joi.object({
        variant_id: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        unit_price: Joi.number().positive().required(),
        line_total: Joi.number().positive().required(),
      })
    )
    .required(),
  applied_coupons: Joi.array()
    .items(
      Joi.object({
        code: Joi.string().required(),
        type: Joi.string().valid("fixed", "percentage").required(),
        value: Joi.number().positive().required(),
        applies_to: Joi.string().required(),
        min_cart_value: Joi.number().positive().required(),
        valid_till: Joi.string().isoDate().required(),
      })
    )
    .required(),
  estimated_taxes: Joi.number().min(0).required(),
  estimated_shipping: Joi.number().min(0).required(),
  currency: Joi.string().required(),
  cart_total: Joi.number().positive().required(),
  created_at: Joi.string().isoDate().optional(),
  updated_at: Joi.string().isoDate().optional(),
});

const validateCart = (cart) => {
  const { error, value } = cartSchema.validate(cart);
  if (error) {
    throw new Error(
      `Cart validation error: ${error.details.map((d) => d.message).join(", ")}`
    );
  }
  return value;
};

module.exports = {
  cartSchema,
  validateCart,
};
