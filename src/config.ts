import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";
import rc from "rc";
import { MicroConfig } from "./classes/MicroConfig";

const raw = rc("micro", { uploadLimit: "50MB", ssl: true });
const config = plainToClass(MicroConfig, raw);
const errors = validateSync(config, { whitelist: true });
if (errors.length) {
  console.dir(config, { depth: null });
  throw errors.toString();
}

if (config.hosts[0].wildcard) throw new Error(`First host cannot be a wildcard domain.`);
export { config };
