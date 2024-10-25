const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw Error(`Missing String environment variable for ${key}`);
  }

  return value;
};

export const MONGO_URI = getEnv("MONGO_URI");

export const MAILTRAP_TOKEN = getEnv("MAILTRAP_TOKEN");
export const JWT_SECRET_ACCESS = getEnv("JWT_SECRET_ACCESS");
export const JWT_SECRET_REFRESH = getEnv("JWT_SECRET_REFRESH");
export const NODE_ENV = getEnv("NODE_ENV");
