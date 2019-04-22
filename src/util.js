import crypto from "crypto";

export async function hash(value) {
  const hash = crypto.createHash("SHA256");
  hash.update(value);
  return hash.digest("HEX", undefined);
}
