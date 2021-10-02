import { loadConfig } from "@ryanke/venera";
import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";
import { MicroConfig } from "./classes/MicroConfig";

const data = loadConfig("micro");
const config = plainToClass(MicroConfig, data, { exposeDefaultValues: true });
const errors = validateSync(config);
if (errors.length) throw errors;
if (config.rootHost.wildcard) {
  throw new Error(`Root host cannot be a wildcard domain.`);
}

export { config };
