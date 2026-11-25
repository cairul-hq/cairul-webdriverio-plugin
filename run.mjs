import { stripVTControlCharacters } from 'node:util';
import { z } from '@cairul/plugin-kit';
import { counts, list, option, repeat, selectors, stdout, value } from '@cairul/plugin-kit/runner';

function summarize(output) {
  const plain = stripVTControlCharacters(output);
  const values = (pattern) => [...plain.matchAll(pattern)].reduce((total, match) => total + Number(match[1]), 0);
  if (!/Spec Files:/i.test(plain)) throw new Error('WebdriverIO returned no spec reporter summary.');
  return counts(values(/(\d+) passing\b/gi), values(/(\d+) failing\b/gi), values(/(\d+) skipped\b/gi));
}

export default {
  command: ['wdio'],
  settings: {
    config: z.string().default('wdio.conf.js'),
    framework: z.enum(['mocha', 'jasmine', 'cucumber']).optional(),
  },
  select: selectors({ specs: list, suites: list, namePattern: value, tags: value }),
  build({ specs, suites, namePattern, tags }, _temp, settings) {
    if (namePattern && !['mocha', 'jasmine'].includes(settings.framework))
      throw new Error('Name filtering requires a Mocha or Jasmine adapter.');
    if (tags && settings.framework !== 'cucumber') throw new Error('Tag filtering requires the Cucumber adapter.');
    return {
      args: [
        'run',
        settings.config,
        '--reporters',
        'spec',
        ...repeat('--spec', specs),
        ...repeat('--suite', suites),
        ...option(settings.framework === 'jasmine' ? '--jasmineOpts.grep' : '--mochaOpts.grep', namePattern),
        ...option('--cucumberOpts.tags', tags),
      ],
      capture: true,
      read: stdout(summarize),
    };
  },
};
