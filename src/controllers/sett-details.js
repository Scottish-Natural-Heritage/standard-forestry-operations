import validation from '../utils/validation.js';
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
 * Check a sett ID for duplicates against any previously entered during the session.
 * @param {string} currentSettId A user supplied sett Id.
 * @param {Array.<object>} setts An array of sett ids already entered during this session.
 * @returns {boolean} True if the sett Id is unique.
 */
const uniqueSettId = (currentSettId, setts) => {
  // If sett array is undefined, return true, ie it is unique as no setts have been entered yet.

  if (setts === undefined) {
    return true;
  }

  // If sett array's length is > 0, filter out the sett that is being edited then check for unique id.
  if (setts.length > 0) {
    // Returns true if there is not a match, false if there is a match.
    return !setts
      .filter((sett) => {
        return sett.editable === false;
      })
      .some((sett) => {
        return sett.id === currentSettId;
      });
  }
};

/**
 * Clean a string to remove any non-grid-ref characters.
 *
 * Takes something like '-NH_6400 4800__' and returns 'NH64004800'.
 * @param {string} gridReference A user supplied grid ref of dubious quality.
 * @returns {string} A nice tidy version of the grid ref.
 */
const formatGridReference = (gridReference) => {
  return gridReference.toUpperCase().replaceAll(/[^A-Z\d]/g, '');
};

/**
 * Clean a string to remove any html-ish characters.
 *
 * Takes something like
 * '<script>alert("hello");</script><p>this & that</p>' and returns
 * '&lt;script&gt;alert('hello');&lt;/script&gt;&lt;p&gt;this &amp; that&lt;/p&gt;'.
 * @param {string} id A user supplied string of dubious quality.
 * @returns {string} A nice tidy version of the string.
 */
const formatId = (id) => {
  return id.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
};

/**
 * Check to see if the user supplied string looks like a grid ref.
 *
 * We first tidy up the user input, so that it's close to being a grid ref,
 * then we check that what we have left is actually a grid ref.
 * @param {string} gridReference A candidate grid ref.
 * @returns {boolean} True if this looks like a valid grid ref, otherwise false.
 */
const validGridReference = (gridReference) => {
  // Check to make sure we've got some input before we go any further.
  if (gridReference === undefined) {
    return false;
  }

  // Tidy up the grid ref so that it's likely to pass validation.
  const formattedGridReference = formatGridReference(gridReference);

  // Later, we'll check that it's in the AA00000000 style, but we'll only be
  // checking for 8 or more digits, not an even number of digits, so we need
  // this one extra check.
  if (formattedGridReference.length % 2 !== 0) {
    return false;
  }

  // Check that the gridRef is in the AA00000000 format, and fail them if
  // it's not.
  return /^[A-Z]{2}\d{8,10}$/g.test(formattedGridReference);
};

/**
 * Check to see if the user supplied string looks like a number of entrances.
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

  request.session.settIdError = request.session.currentSettIdError || request.session.uniqueSettIdError;

  request.session.invalidCharsSettId = validation.hasInvalidCharacters(
    request.body.currentSettId,
    validation.invalidCharacters,
  );

  request.session.settDetailsError =
    request.session.currentSettIdError ||
    request.session.uniqueSettIdError ||
    request.session.currentGridReferenceError ||
    request.session.currentEntrancesError ||
    request.session.invalidCharsSettId;

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
      editable: false,
    };

    if (!Array.isArray(request.session.setts)) {
      request.session.setts = [];
    }

    request.session.setts.push(newSett);
  } else {
    const currentSett = request.session.setts[request.session.currentSettIndex];
    [currentSett.id, currentSett.gridReference, currentSett.entrances, currentSett.editable] = [
      formatId(request.body.currentSettId.trim()),
      formatGridReference(request.body.currentGridReference),
      Number.parseInt(request.body.currentEntrances, 10),
      false,
    ];
  }

  request.session.settDetailsError = false;
  request.session.settCountError = false;
  return ReturnState.Positive;
};

export {settDetailsController as default};
