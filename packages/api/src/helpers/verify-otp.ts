import { createGuardrails, verifySync } from "otplib";

// otplib 12 generated 10-byte secrets. Existing accounts must still be able to sign in.
const legacyGuardrails = createGuardrails({ MIN_SECRET_BYTES: 10 });

export function verifyOTP(token: string, secret: string, existingAccount = false): boolean {
  try {
    return verifySync({
      token,
      secret,
      guardrails: existingAccount ? legacyGuardrails : undefined,
    }).valid;
  } catch {
    return false;
  }
}
