import { testRunner } from '@cairul/plugin-kit/runner';
import adapter from './run.mjs';
import { junit, testPlugin } from '@cairul/plugin-kit/reports';

const reports = testPlugin('webdriverio.passed', { junit });

export default testRunner(reports, 'webdriverio.run', adapter);
