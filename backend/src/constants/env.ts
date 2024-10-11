const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw Error(`Missing String environment variable for ${key}`);
  }

  return value;
};

export const MONGO_URI = getEnv("MONGO_URI");

export const MAILTRAP_TOKEN = getEnv("MAILTRAP_TOKEN");
export const JWT_SECRET = getEnv("JWT_SECRET");
