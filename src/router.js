import express from 'express';
const router = express.Router();

// Import all the controllers.
import {Page} from './controllers/_base.js';
import StartController from './controllers/start.js';
import BeforeYouStartController from './controllers/before-you-start.js';
import ConvictionController from './controllers/conviction.js';
import DetailsController from './controllers/details.js';
import PostcodeController from './controllers/postcode.js';
import ChooseAddressController from './controllers/choose-address.js';
import ManualAddressController from './controllers/manual-address.js';
import SiteLocationController from './controllers/site-location.js';
import SettDetailsController from './controllers/sett-details.js';
import ConfirmController from './controllers/confirm.js';
import LicenceConditions from './controllers/licence-conditions.js';

// Configure all of the pages and routes.

router.use(
  Page({
    path: 'start',
    positiveForward: 'before-you-start',
    controller: StartController
  })
);

router.use(
  Page({
    path: 'before-you-start',
    back: 'start',
    positiveForward: 'conviction',
    controller: BeforeYouStartController
  })
);

router.use(
  Page({
    path: 'licence-conditions'
  })
);

router.use(
  Page({
    path: 'conviction',
    back: 'before-you-start',
    positiveForward: 'details',
    negativeForward: 'conviction-stop',
    controller: ConvictionController
  })
);

router.use(
  Page({
    path: 'details',
    back: 'conviction',
    positiveForward: 'postcode',
    controller: DetailsController
  })
);

router.use(
  Page({
    path: 'postcode',
    back: 'details',
    positiveForward: 'choose-address',
    controller: PostcodeController
  })
);

router.use(
  Page({
    path: 'choose-address',
    back: 'postcode',
    positiveForward: 'site-location',
    secondaryForward: 'manual-address',
    controller: ChooseAddressController
  })
);

router.use(
  Page({
    path: 'manual-address',
    back: 'choose-address',
    positiveForward: 'site-location',
    controller: ManualAddressController
  })
);

router.use(
  Page({
    path: 'site-location',
    back: 'choose-address',
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
