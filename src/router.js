import express from 'express';
const router = express.Router();

// Import all the controllers.
import {Page} from './controllers/_base.js';
import StartController from './controllers/start.js';
import GdprController from './controllers/gdpr.js';
import OtherController from './controllers/other.js';
import OtherEmailController from './controllers/other-email.js';
import ConvictionController from './controllers/conviction.js';
import EligibleController from './controllers/eligible.js';
import ComplyController from './controllers/comply.js';
import DetailsController from './controllers/details.js';
import SiteLocationController from './controllers/site-location.js';
import SettDetailsController from './controllers/sett-details.js';
import ConfirmController from './controllers/confirm.js';

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
    positiveForward: 'other',
    controller: GdprController
  })
);

router.use(
  Page({
    path: 'other',
    back: 'gdpr',
    positiveForward: 'conviction',
    negativeForward: 'other-email',
    controller: OtherController
  })
);

router.use(
  Page({
    path: 'other-email',
    back: 'other',
    positiveForward: 'other-success',
    controller: OtherEmailController
  })
);

router.use(
  Page({
    path: 'other-success'
  })
);

router.use(
  Page({
    path: 'conviction',
    back: 'other',
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
    path: 'confirm',
    back: 'site-location',
    positiveForward: 'success',
    controller: ConfirmController
  })
);

router.use(
  Page({
    path: 'success'
  })
);

router.use(
  Page({
    path: 'conviction-stop',
    back: 'conviction'
  })
);

router.use(
  Page({
    path: 'accessibility'
  })
);

export {router as default};
