import type { Config } from 'jest';
import config from '../jest.config';

const unitConfig: Config = {
  ...config,
  testRegex: 'test/unit/.*\\.spec\\.ts$',
};

export default unitConfig;
