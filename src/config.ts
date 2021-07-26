import { loadConfig, validateConfig } from "@ryanke/venera";
import { MicroConfig } from "./classes/MicroConfig";

const data = loadConfig("micro");
const config = validateConfig(MicroConfig, data, {
  // breaks with some of the whacky transforms we do
  enableImplicitConversion: false,
});

if (config.rootHost.wildcard) {
  throw new Error(`Root host cannot be a wildcard domain.`);
}

export { config };
