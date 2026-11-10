import crypto from "node:crypto";

const SCRYPT_SALT_BYTES = 16;
const SCRYPT_KEY_LENGTH = 64;

/**
 * Hashes a plaintext password using crypto.scrypt with a unique random salt.
 * Returns formatted string: "<saltHex>:<derivedKeyHex>"
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(SCRYPT_SALT_BYTES).toString("hex");

  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, SCRYPT_KEY_LENGTH, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

/**
 * Verifies a plaintext password against a stored "<saltHex>:<derivedKeyHex>" hash using timing-safe comparison.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split(":");
  if (parts.length !== 2) {
    return false;
  }

  const [salt, storedKeyHex] = parts;
  const storedKeyBuffer = Buffer.from(storedKeyHex, "hex");

  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, SCRYPT_KEY_LENGTH, (err, derivedKey) => {
      if (err) return reject(err);
      if (storedKeyBuffer.length !== derivedKey.length) {
        return resolve(false);
      }
      resolve(crypto.timingSafeEqual(storedKeyBuffer, derivedKey));
    });
  });
}
