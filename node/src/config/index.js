import dotenv from 'dotenv';
import Joi from '@hapi/joi';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });
const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string()
            .valid('production', 'development', 'test')
            .required(),
        DATABASE_SERVER: Joi.string()
            .required(),
        DATABASE_USER: Joi.string()
            .required(),
        DATABASE_PASSWORD: Joi.string()
            .required(),
        DATABASE_NAME: Joi.string()
            .required(),
        HOSTNAME: Joi.string()
            .required(),
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
            .default(30)
            .description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
            .default(30)
            .description('days after which refresh tokens expire'),
    })
    .unknown();
const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    STRING_BASE_THIRTY_SIX: 36,
    GET_LAST_TEN_CHAR: -10,
    CRYPTR_KEY: {
        SECRET: process.env.CRYPTR_KEY,
    },
    ENV_PROD: 'production',
    ENV_DEV: 'development',
    DATABASE_SERVER: process.env.DATABASE_SERVER,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    HOSTNAME:process.env.HOSTNAME,
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: 10,
    },
};