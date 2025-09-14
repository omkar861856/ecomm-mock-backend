const Joi = require("joi");

// Shipment validation schema
const shipmentSchema = Joi.object({
  shipment_id: Joi.string().optional(),
  order_id: Joi.string().required(),
  carrier: Joi.string().optional(),
  service_level: Joi.string().optional(),
  tracking_number: Joi.string().optional(),
  label_created_at: Joi.string().isoDate().optional(),
  shipped_at: Joi.string().isoDate().optional(),
  delivered_at: Joi.string().isoDate().optional(),
  events: Joi.array()
    .items(
      Joi.object({
        timestamp: Joi.string().isoDate().required(),
        status: Joi.string().required(),
        location: Joi.string().optional(),
        description: Joi.string().required(),
      })
    )
    .required(),
  proof_of_delivery: Joi.object({
    signature: Joi.string().optional(),
    photo_url: Joi.string().uri().optional(),
    delivered_to: Joi.string().optional(),
    delivery_notes: Joi.string().optional(),
  }).optional(),
});

const validateShipment = (shipment) => {
  const { error, value } = shipmentSchema.validate(shipment);
  if (error) {
    throw new Error(
      `Shipment validation error: ${error.details
        .map((d) => d.message)
        .join(", ")}`
    );
  }
  return value;
};

module.exports = {
  shipmentSchema,
  validateShipment,
};
