import type { Config } from 'jest';
import config from '../jest.config';

const e2eConfig: Config = {
  ...config,
  testRegex: 'test/e2e/.*(?!\\.module)\\.e2e-spec\\.ts$',
};

export default e2eConfig;
