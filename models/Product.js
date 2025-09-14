const Joi = require("joi");

// Product validation schema
const productSchema = Joi.object({
  id: Joi.string().optional(),
  sku: Joi.string().required(),
  name: Joi.string().required(),
  brand: Joi.string().required(),
  description: Joi.string().required(),
  categories: Joi.array().items(Joi.string()).required(),
  tags: Joi.array().items(Joi.string()).required(),
  images: Joi.array().items(Joi.string().uri()).required(),
  variants: Joi.array()
    .items(
      Joi.object({
        variant_id: Joi.string().required(),
        color: Joi.string().required(),
        size: Joi.string().required(),
        barcode: Joi.string().required(),
        price: Joi.object({
          currency: Joi.string().required(),
          amount: Joi.number().positive().required(),
          msrp: Joi.number().positive().optional(),
          discount: Joi.object({
            type: Joi.string().valid("percentage", "fixed").required(),
            value: Joi.number().required(),
            label: Joi.string().required(),
          }).optional(),
        }).required(),
        inventory: Joi.object({
          available: Joi.number().integer().min(0).required(),
          allocated: Joi.number().integer().min(0).required(),
          safety_stock: Joi.number().integer().min(0).required(),
          warehouse_location: Joi.string().required(),
          backorderable: Joi.boolean().required(),
          expected_restock_date: Joi.string().isoDate().optional(),
        }).required(),
        weight_kg: Joi.number().positive().required(),
        dimensions_cm: Joi.object({
          length: Joi.number().positive().required(),
          width: Joi.number().positive().required(),
          height: Joi.number().positive().required(),
        }).required(),
      })
    )
    .required(),
  shipping: Joi.object({
    weight_kg: Joi.number().positive().required(),
    dimensions_cm: Joi.object({
      length: Joi.number().positive().required(),
      width: Joi.number().positive().required(),
      height: Joi.number().positive().required(),
    }).required(),
    origin: Joi.object({
      warehouse_id: Joi.string().required(),
      address: Joi.string().required(),
    }).required(),
    free_shipping_over: Joi.number().positive().required(),
    eligible_shipping_methods: Joi.array().items(Joi.string()).required(),
  }).required(),
  warranty: Joi.object({
    type: Joi.string().required(),
    duration_days: Joi.number().integer().positive().required(),
    notes: Joi.string().required(),
  }).required(),
  return_policy: Joi.object({
    days_window: Joi.number().integer().positive().required(),
    condition: Joi.string().required(),
    restocking_fee: Joi.number().min(0).required(),
    who_pays_return_shipping: Joi.string().required(),
    exceptions: Joi.array().items(Joi.string()).required(),
  }).required(),
});

const validateProduct = (product) => {
  const { error, value } = productSchema.validate(product);
  if (error) {
    throw new Error(
      `Product validation error: ${error.details
        .map((d) => d.message)
        .join(", ")}`
    );
  }
  return value;
};

module.exports = {
  productSchema,
  validateProduct,
};
