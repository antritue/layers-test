const Joi = require('joi')

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const deviceSchema = Joi.object({
  id: Joi.string(),
  deviceModel: Joi.string().required(),
  name: Joi.string().required(),
  note: Joi.string().required(),
  serial: Joi.string().required(),
});

const validateDevice = validator(deviceSchema);

module.exports = validateDevice;
