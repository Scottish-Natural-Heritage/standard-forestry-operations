import assert from 'assert';

// Declare up front what env vars we need to continue and ensure they're set.
assert(process.env.SFO_PORT !== undefined, 'A port number (SFO_PORT) is required.');
assert(process.env.SFO_SESSION_SECRET !== undefined, 'A secret for sessions (SFO_SESSION_SECRET) is required.');
assert(
  process.env.SFO_API_URL !== undefined,
  'A URL for the standard-forestry-operations api service (SFO_API_URL) is required.'
);

const config = Object.freeze({
  port: process.env.SFO_PORT,
  sessionSecret: process.env.SFO_SESSION_SECRET,
  apiEndpoint: process.env.SFO_API_URL,
  pathPrefix: process.env.SFO_PATH_PREFIX ? `/${process.env.SFO_PATH_PREFIX}` : '',
  cookiePrefix: process.env.COOKIE_PREFIX || '__Secure'
});

export {config as default};
