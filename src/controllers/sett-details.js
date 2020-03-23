import {ReturnState} from './_base.js';

const validSettId = (settId) => {
  if (settId === undefined) {
    return false;
  }

  if (settId.trim() === '') {
    return false;
  }

  return true;
};

/**
 * Clean a string to remove any non-grid-ref characters.
 *
 * Takes something like '-NH_6400 4800__' and returns 'NH64004800'.
 *
 * @param {string} gridRef A user supplied grid ref of dubious quality.
 * @returns {string} A nice tidy version of the grid ref.
 */
const formatGridReference = (gridRef) => {
  return gridRef.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

/**
 * Check to see if the user supplied string looks like a grid ref.
 *
 * We first tidy up the user input, so that it's close to being a grid ref,
 * then we check that what we have left is actually a grid ref.
 *
 * @param {string} gridRef A candidate grid ref.
 * @returns {boolean} True if this looks like a valid grid ref, otherwise false.
 */
const validGridReference = (gridRef) => {
  // Check to make sure we've got some input before we go any further.
  if (gridRef === undefined) {
    return false;
  }

  // Tidy up the grid ref so that it's likely to pass validation.
  const formattedGridRef = formatGridReference(gridRef);

  // Later, we'll check that it's in the AA00000000 style, but we'll only be
  // checking for 8 or more digits, not an even number of digits, so we need
  // this one extra check.
  if (formattedGridRef.length % 2 !== 0) {
    return false;
  }

  // Check that the gridRef is in the AA00000000 format, and fail them if
  // it's not.
  return /^[A-Z]{2}\d{8,}$/g.test(formattedGridRef);
};

const validSettType = (settType) => {
  const testParse = Number.parseInt(settType, 10);
  if (Number.isNaN(testParse)) {
    return false;
  }

  if (testParse < 1) {
    return false;
  }

  if (testParse > 4) {
    return false;
  }

  return true;
};

const validEntrances = (entrances) => {
  if (entrances === undefined) {
    return false;
  }

  if (entrances.trim() === '') {
    return false;
  }

  const testParse = Number.parseInt(entrances, 10);
  if (Number.isNaN(testParse)) {
    return false;
  }

  return true;
};

const settDetailsController = (req) => {
  req.session.currentSettIdError = !validSettId(req.body.currentSettId);
  req.session.currentGridReferenceError = !validGridReference(req.body.currentGridReference);
  req.session.currentSettTypeError = !validSettType(req.body.currentSettType);
  req.session.currentEntrancesError = !validEntrances(req.body.currentEntrances);

  req.session.settDetailsError =
    req.session.currentSettIdError ||
    req.session.currentGridReferenceError ||
    req.session.currentSettTypeError ||
    req.session.currentEntrancesError;

  if (req.session.settDetailsError) {
    req.session.currentSettId = req.body.currentSettId.trim();
    req.session.currentSettType = Number.parseInt(req.body.currentSettType, 10);
    // Don't return the 'formatted' one here, just send back the original one. It's too confusing otherwise.
    req.session.currentGridReference = req.body.currentGridReference.trim();
    req.session.currentEntrances = req.body.currentEntrances;

    return ReturnState.Error;
  }

  if (req.session.currentSettIndex === -1) {
    const newSett = {
      id: req.body.currentSettId.trim(),
      type: Number.parseInt(req.body.currentSettType, 10),
      gridReference: formatGridReference(req.body.currentGridReference),
      entrances: Number.parseInt(req.body.currentEntrances, 10)
    };

    if (!Array.isArray(req.session.setts)) {
      req.session.setts = [];
    }

    req.session.setts.push(newSett);
    req.session.settCountError = false;
  } else {
    req.session.setts[req.session.currentSettIndex].id = req.body.currentSettId.trim();
    req.session.setts[req.session.currentSettIndex].type = Number.parseInt(req.body.currentSettType, 10);
    req.session.setts[req.session.currentSettIndex].gridReference = formatGridReference(req.body.currentGridReference);
    req.session.setts[req.session.currentSettIndex].entrances = Number.parseInt(req.body.currentEntrances, 10);
  }

  return ReturnState.Positive;
};

export {settDetailsController as default};
