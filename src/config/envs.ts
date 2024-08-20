import 'dotenv/config';
import * as joi from 'joi';

// Define a type that matches the environment variables schema
interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
}

// Create a schema that matches the EnvVars interface
const envSchema = joi.object<EnvVars>({
  PORT: joi.number().required(),
  DATABASE_URL: joi.string().required(),
});

// Define a generic function to validate environment variables
function validateEnv<T>(
  schema: joi.ObjectSchema<T>,
  env: NodeJS.ProcessEnv,
): T {
  // Use Joi's validation with type assertion for better type inference
  const { error, value } = schema.validate(env, {
    allowUnknown: true,
    convert: true,
  });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return value;
}

// Validate the environment variables and infer the type
const validatedEnv = validateEnv(envSchema, process.env);

// Export the validated environment variables with specific names
export const envs = {
  port: validatedEnv.PORT,
  databaseUrl: validatedEnv.DATABASE_URL,
};
