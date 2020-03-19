import express from 'express';
const router = express.Router();

// Import all the controllers.
import {Page} from './controllers/_base.js';
import StartController from './controllers/start.js';
import GdprController from './controllers/gdpr.js';
import ConvictionController from './controllers/conviction.js';
import EligibleController from './controllers/eligible.js';
import ComplyController from './controllers/comply.js';
import DetailsController from './controllers/details.js';
import SiteLocationController from './controllers/site-location.js';
import SettDetailsController from './controllers/sett-details.js';

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

router.use(
  Page({
    path: 'conviction',
    back: 'gdpr',
    positiveForward: 'eligible',
    negativeForward: 'conviction-stop',
    controller: ConvictionController
  })
);

router.use(
  Page({
    path: 'eligible',
    back: 'conviction',
    positiveForward: 'comply',
    controller: EligibleController
  })
);

router.use(
  Page({
    path: 'comply',
    back: 'eligible',
    positiveForward: 'details',
    controller: ComplyController
  })
);

router.use(
  Page({
    path: 'details',
    back: 'comply',
    positiveForward: 'site-location',
    controller: DetailsController
  })
);

router.use(
  Page({
    path: 'site-location',
    back: 'details',
    secondaryForward: 'sett-details',
    positiveForward: 'confirm',
    controller: SiteLocationController
  })
);

router.use(
  Page({
    path: 'sett-details',
    back: 'site-location',
    positiveForward: 'site-location',
    controller: SettDetailsController
  })
);

router.use(
  Page({
    path: 'conviction-stop',
    back: 'conviction'
  })
);

export {router as default};
