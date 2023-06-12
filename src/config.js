import process from 'node:process';

// Grab our config from the env vars, or set some defaults if they're missing.
const config = Object.freeze({
  port: process.env.SFO_PORT || 3002,
  sessionSecret: process.env.SFO_SESSION_SECRET || 'override_this_value',
  apiEndpoint: process.env.SFO_API_URL || 'http://localhost:3003/standard-forestry-operations-api/v2',
  hostPrefix: process.env.SFO_HOST_PREFIX || `http://localhost:${process.env.SFO_PORT}`,
  pathPrefix: process.env.SFO_PATH_PREFIX ? `/${process.env.SFO_PATH_PREFIX}` : '/standard-forestry-operations',
  cookiePrefix: process.env.COOKIE_PREFIX || '__Secure',
  gazetteerApiEndpoint: process.env.PC_LOOKUP_API_URL || '',
});

export {config as default};
