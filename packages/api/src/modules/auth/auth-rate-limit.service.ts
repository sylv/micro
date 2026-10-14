import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { createHash } from "node:crypto";
import { GraphQLError } from "graphql";

export enum AuthRateLimitScope {
  LOGIN_IP = "login-ip",
  LOGIN_ACCOUNT = "login-account",
  OTP = "otp",
}

const LIMITS = {
  [AuthRateLimitScope.LOGIN_IP]: { attempts: 30, windowMs: 15 * 60_000 },
  [AuthRateLimitScope.LOGIN_ACCOUNT]: { attempts: 10, windowMs: 15 * 60_000 },
  [AuthRateLimitScope.OTP]: { attempts: 5, windowMs: 5 * 60_000 },
} as const;

@Injectable()
export class AuthRateLimitService {
  private readonly counters = new Map<string, { attempts: number; expiresAt: number }>();
  private static readonly MAX_COUNTERS = 10_000;

  async check(scope: AuthRateLimitScope, identity: string) {
    const limit = LIMITS[scope];
    const key = createHash("sha256").update(`${scope}:${identity}`).digest("hex");
    const now = Date.now();
    let counter = this.counters.get(key);
    if (!counter || counter.expiresAt <= now) {
      if (!counter && this.counters.size >= AuthRateLimitService.MAX_COUNTERS) {
        this.deleteExpiredCounters();
        if (this.counters.size >= AuthRateLimitService.MAX_COUNTERS) this.reject(60);
      }
      counter = { attempts: 0, expiresAt: now + limit.windowMs };
      this.counters.set(key, counter);
    }

    if (counter.attempts >= limit.attempts) this.reject(Math.ceil((counter.expiresAt - now) / 1000));
    counter.attempts++;
  }

  private reject(retryAfter: number): never {
    throw new GraphQLError("Too many authentication attempts. Please try again later", {
      extensions: { code: "TOO_MANY_REQUESTS", retryAfter },
    });
  }

  @Cron("* * * * *")
  deleteExpiredCounters() {
    const now = Date.now();
    for (const [key, counter] of this.counters) {
      if (counter.expiresAt <= now) this.counters.delete(key);
    }
  }
}
