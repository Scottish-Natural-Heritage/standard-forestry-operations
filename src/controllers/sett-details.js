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
 * Check a sett ID against any previously entered during the session for duplicates.
 *
 * @param {string} currentSettId A user supplied sett Id.
 * @param {Array.<object>} previousSettArray An array of sett information already entered during this session.
 * @returns {boolean} True is the sett Id is unique.
 */
const uniqueSettId = (currentSettId, previousSettArray) => {
  // If sett list's length is 0, return true, ie it is unique.
  if (previousSettArray === undefined) {
    return true;
  }

  // If sett list's length is > 0, loop through the list of sett objects.
  if (previousSettArray.length > 0) {
    for (const sett of previousSettArray) {
      if (sett.id === currentSettId) {
        // Return false if current sett id matches one already entered.
        return false;
      }
    }

    // Return true if it does not match another sett id.
    return true;
  }
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
  return gridRef.toUpperCase().replace(/[^A-Z\d]/g, '');
};

/**
 * Clean a string to remove any html-ish characters.
 *
 * Takes something like
 * '<script>alert("hello");</script><p>this & that</p>' and returns
 * '&lt;script&gt;alert('hello');&lt;/script&gt;&lt;p&gt;this &amp; that&lt;/p&gt;'.
 *
 * @param {string} id A user supplied string of dubious quality.
 * @returns {string} A nice tidy version of the string.
 */
const formatId = (id) => {
  return id.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
  return /^[A-Z]{2}\d{8,10}$/g.test(formattedGridRef);
};

/**
 * Check to see if the user supplied string looks like a number of entrances.
 *
 * @param {string} entrances A candidate number of entrances.
 * @returns {boolean} True if this looks like a valid number of entrances,
 * otherwise false.
 */
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

const settDetailsController = (request) => {
  request.session.currentSettIdError = !validSettId(request.body.currentSettId);
  request.session.uniqueSettIdError = !uniqueSettId(request.body.currentSettId, request.session.setts);
  request.session.currentGridReferenceError = !validGridReference(request.body.currentGridReference);
  request.session.currentEntrancesError = !validEntrances(request.body.currentEntrances);

  request.session.settDetailsError =
    request.session.currentSettIdError ||
    request.session.uniqueSettIdError ||
    request.session.currentGridReferenceError ||
    request.session.currentEntrancesError;

  if (request.session.settDetailsError) {
    request.session.currentSettId = request.body.currentSettId.trim();
    // Don't return the 'formatted' one here, just send back the original one. It's too confusing otherwise.
    request.session.currentGridReference = request.body.currentGridReference.trim();
    request.session.currentEntrances = request.body.currentEntrances;

    return ReturnState.Error;
  }

  if (request.session.currentSettIndex === -1) {
    const newSett = {
      id: formatId(request.body.currentSettId.trim()),
      gridReference: formatGridReference(request.body.currentGridReference),
      entrances: Number.parseInt(request.body.currentEntrances, 10),
    };

    if (!Array.isArray(request.session.setts)) {
      request.session.setts = [];
    }

    request.session.setts.push(newSett);
    console.log(request.session);
  } else {
    request.session.setts[request.session.currentSettIndex].id = formatId(request.body.currentSettId.trim());
    request.session.setts[request.session.currentSettIndex].gridReference = formatGridReference(
      request.body.currentGridReference,
    );
    request.session.setts[request.session.currentSettIndex].entrances = Number.parseInt(
      request.body.currentEntrances,
      10,
    );
  }

  request.session.settDetailsError = false;
  request.session.settCountError = false;
  return ReturnState.Positive;
};

export {settDetailsController as default};
