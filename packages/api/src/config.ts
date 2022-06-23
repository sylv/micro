import { loadConfig } from '@ryanke/venera';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { MicroConfig } from './classes/MicroConfig';

const data = loadConfig('micro');
const config = plainToClass(MicroConfig, data, { exposeDefaultValues: true });
const errors = validateSync(config, { forbidUnknownValues: true });
if (errors.length > 0) {
  const clean = errors.map((error) => error.toString()).join('\n');
  console.dir(config, { depth: null });
  console.error(clean);
  process.exit(1);
}

if (config.rootHost.isWildcard) {
  throw new Error(`Root host cannot be a wildcard domain.`);
}

export { config };
