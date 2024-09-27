import * as Joi from 'joi';

export default Joi.object({
  TYPEORM_HOST: Joi.string(),
  TYPEORM_PORT: Joi.number().integer(),
  TYPEORM_USERNAME: Joi.string(),
  TYPEORM_PASSWORD: Joi.string().min(8),
  TYPEORM_DATABASE: Joi.string(),
  TYPEORM_ENTITIES: Joi.string(),
  TYPEORM_SYNCHRONIZE: Joi.string(),
  TYPEORM_LOGGING: Joi.boolean(),
});
