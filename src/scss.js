'use strict';

import {readFileSync, writeFileSync} from 'fs';
import sass from 'sass';
import packageImporter from 'node-sass-package-importer';

import config from './config.js';

// Read in the source file.
const lines = readFileSync('src/main.scss').toString().split('\n');

// Fill the place-holder line with a correct path.
for (const l in lines) {
  if (lines[l].startsWith('$path-prefix:')) {
    // eslint-disable-next-line unicorn/string-content
    lines[l] = `$path-prefix: '${config.pathPrefix}';`;
  }
}

const fixedFile = lines.join('\n');

// Render the SCSS.
const result = sass.renderSync({
  data: fixedFile,
  importer: packageImporter(),
  outputStyle: 'compressed'
});

// Save it to the destination.
writeFileSync('dist/main.css', result.css);
