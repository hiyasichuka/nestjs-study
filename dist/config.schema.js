"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configValidationSchema = void 0;
const Joi = require("@hapi/joi");
exports.configValidationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    STAGE: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.string().default(5432).required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
});
//# sourceMappingURL=config.schema.js.map