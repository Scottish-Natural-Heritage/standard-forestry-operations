'use strict';

// Load the config.
import config from './config.js';

// Load the app.
import app from './app.js';

// Run it.
app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}${config.pathPrefix}.`);
});
