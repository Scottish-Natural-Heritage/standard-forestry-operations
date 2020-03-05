import express from 'express';
const router = express.Router();

// Import all the controllers.
import {Page} from './controllers/_base.js';
import StartController from './controllers/start.js';
import GdprController from './controllers/gdpr.js';

// Configure all of the pages and routes.

router.use(
  Page({
    path: 'start',
    positiveForward: 'gdpr',
    controller: StartController
  })
);

router.use(
  Page({
    path: 'gdpr',
    back: 'start',
    positiveForward: 'conviction',
    controller: GdprController
  })
);

export {router as default};
