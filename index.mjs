import { testRunner } from '@cairul/pdk/runner';
import adapter from './run.mjs';
import { junit, testPlugin } from '@cairul/pdk/reports';

const reports = testPlugin('webdriverio.passed', { junit });

export default testRunner(reports, 'webdriverio.run', adapter);
