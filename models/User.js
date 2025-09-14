const Joi = require("joi");

// User validation schema
const userSchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\+?[\d\s-()]+$/)
    .required(),
  loyalty_tier: Joi.string()
    .valid("Bronze", "Silver", "Gold", "Platinum")
    .required(),
  loyalty_points: Joi.number().integer().min(0).required(),
  addresses: Joi.array()
    .items(
      Joi.object({
        address_id: Joi.string().required(),
        label: Joi.string().required(),
        recipient: Joi.string().required(),
        line1: Joi.string().required(),
        line2: Joi.string().optional(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        postal_code: Joi.string().required(),
        country: Joi.string().required(),
        preferred: Joi.boolean().required(),
      })
    )
    .required(),
  payment_methods: Joi.array()
    .items(
      Joi.object({
        payment_id: Joi.string().required(),
        type: Joi.string()
          .valid("card", "upi", "netbanking", "wallet")
          .required(),
        brand: Joi.string().optional(),
        last4: Joi.string().optional(),
        expiry: Joi.string().optional(),
        billing_address_id: Joi.string().optional(),
        tokenized: Joi.boolean().optional(),
        vpa: Joi.string().optional(),
        preferred: Joi.boolean().optional(),
      })
    )
    .required(),
});

const validateUser = (user) => {
  const { error, value } = userSchema.validate(user);
  if (error) {
    throw new Error(
      `User validation error: ${error.details.map((d) => d.message).join(", ")}`
    );
  }
  return value;
};

module.exports = {
  userSchema,
  validateUser,
};
