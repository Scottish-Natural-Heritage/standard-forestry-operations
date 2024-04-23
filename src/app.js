import {fileURLToPath} from 'node:url';
import path from 'node:path';
import process from 'node:process';
import express from 'express';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import session from 'express-session';
import memorystore from 'memorystore';

import config from './config.js';
import logger from './logger.js';
import router from './router.js';

const MemoryStore = memorystore(session);
const app = express();

app.disable('x-powered-by');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(morgan('combined', {stream: logger.stream}));

nunjucks.configure(['src/views', 'node_modules/naturescot-frontend', 'node_modules/govuk-frontend'], {
  autoescape: true,
  express: app,
});

/**
 * WCAG2.1 - 2.2 Enough Time.
 * Provide users enough time to read and use content.
 *
 * Success Criterion 2.2.1 Timing Adjustable (Level A).
 * For each time limit that is set by the content, at least one of the following
 * is true:
 * 20 Hour Exception: The time limit is longer than 20 hours.
 *
 * Success Criterion 2.2.6 Timeouts (Level AAA).
 * Users are warned of the duration of any user inactivity that could cause data
 * loss, unless the data is preserved for more than 20 hours when the user does
 * not take any actions.
 */
const sessionDuration = 20.1 * 60 * 60 * 1000;

app.set('trust proxy', 1); // Trust first proxy

// Disabling as makes the code's intention more obvious.
/* eslint-disable no-unneeded-ternary */

app.use(
  session({
    // Using the __Secure- prefix to protect our cookies as per
    // https://scotthelme.co.uk/tough-cookies/#__secure
    name: `${config.cookiePrefix}-standard-forestry-operations-session`,
    cookie: {
      sameSite: true,
      maxAge: sessionDuration,
      path: `${config.pathPrefix}/`,
      httpOnly: true,
      // We need to set the secure attribute to true as Caddy doesn't
      // currently rewrite the attribute for us in the way Nginx did.
      // If we're running tests don't set it as it'll break Cypress.
      secure: process.env.UNDER_TEST ? false : true,
    },
    store: new MemoryStore({
      checkPeriod: sessionDuration,
    }),
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: false,
  })
);

/* eslint-enable no-unneeded-ternary */

app.use(
  `${config.pathPrefix}/dist`,
  express.static(path.join(__dirname, '..', '/dist'), {immutable: true, maxAge: '30 minutes'})
);
app.use(
  `${config.pathPrefix}/govuk-frontend`,
  express.static(path.join(__dirname, '..', '/node_modules/govuk-frontend/govuk'), {
    immutable: true,
    maxAge: '3 hours',
  })
);

// `health` is a simple health-check end-point to test whether the service is
// up.
app.get(`${config.pathPrefix}/health`, async (request, response) => {
  response.status(200).send({message: 'OK'});
});

// All of our static assets are served above and have the appropriate caching
// time-outs set. From this point down, we're serving rendered pages which may
// contain user data. Ask the user to not cache these as they may be updated
// and re-rendered as they go back and forth through the app.
app.use((request, response, next) => {
  response.setHeader('Cache-Control', 'no-store');
  next();
});

app.all(`${config.pathPrefix}/`, (request, response) => {
  response.redirect(`${config.pathPrefix}/start`);
});

// To initialise the maps we need to get some json objects out of the express
// session and in to the browser's javascript, so we have to 'render' a
// javascript file to do it.
app.get(`${config.pathPrefix}/init.js`, (request, response) => {
  response.set('Content-type', 'application/javascript').render(`_init.js.njk`, {
    model: request.session,
  });
});

app.use(router);

app.use((request, response) => {
  response.status(404).render('error-404.njk', {hostPrefix: config.hostPrefix, pathPrefix: config.pathPrefix});
});

export {app as default};
