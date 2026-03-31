import { redisClient } from "./redis.connection.js";

export const checkKeyExistence = async (key) => {
  return await redisClient.exists(key);
};
export const getFromCache = async (key) => {
  const cached = await redisClient.get(key);
  if (!cached) return null;
  try {
    return JSON.parse(cached);
  } catch {
    return cached; // Return raw string (e.g., bcrypt hash)
  }
  // Returns parsed object or raw string
};
export const saveInCache = async (key, value, ex = 1 * 24 * 60 * 60) => {
  let formattedValue = value;
  if (value && typeof value === "object") {
    formattedValue = JSON.stringify(value);
  } // else raw string/number etc.
  return redisClient.set(key, formattedValue, {
    EX: ex,
  });
};

export const deleteFromCache = async (key) => {
  return await redisClient.del(key);
};
