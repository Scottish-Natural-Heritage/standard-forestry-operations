'use strict';

import {readFileSync, writeFileSync} from 'fs';
import config from './config.js';

const lines = readFileSync('src/main.scss')
  .toString()
  .split('\n');

for (const l in lines) {
  if (lines[l].startsWith('$path-prefix:')) {
    lines[l] = `$path-prefix: '${config.pathPrefix}';`;
  }
}

writeFileSync('build/main.scss', lines.join('\n'));
