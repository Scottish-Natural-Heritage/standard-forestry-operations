import utils from 'naturescot-utils';
import {ReturnState} from './_base.js';

/**
 * Clean the incoming POST request body to make it more compatible with the
 * database and its validation rules.
 *
 * @param {object} body The incoming request's body.
 * @returns {any} A json object that's just got our cleaned up fields on it.
 */
const cleanInput = (body) => {
  return {
    // The strings are trimmed for leading and trailing whitespace and then
    // copied across if they're in the POST body or are set to undefined if
    // they're missing.
    addressLine1: body.addressLine1 === undefined ? undefined : body.addressLine1.trim(),
    addressLine2: body.addressLine2 === undefined ? undefined : body.addressLine2.trim(),
    addressTown: body.addressTown === undefined ? undefined : body.addressTown.trim(),
    addressCounty: body.addressCounty === undefined ? undefined : body.addressCounty.trim(),
    addressPostcode: body.addressPostcode === undefined ? undefined : body.addressPostcode.trim(),
  };
};

const manualAddressController = (request) => {
  // Clear errors.
  request.session.addressError = false;
  request.session.addressLine1Error = false;
  request.session.addressTownError = false;
  request.session.addressCountyError = false;
  request.session.postcodeError = false;
  request.session.invalidPostcodeError = false;
  // Clean up the user's input before we store it in the session.
  const cleanForm = cleanInput(request.body);
  request.session.addressLine1 = cleanForm.addressLine1;
  request.session.addressLine2 = cleanForm.addressLine2;
  request.session.addressTown = cleanForm.addressTown;
  request.session.addressCounty = cleanForm.addressCounty;
  request.session.addressPostcode = cleanForm.addressPostcode;

  request.session.addressLine1Error =
    request.session.addressLine1 === undefined || request.session.addressLine1.trim() === '';
  request.session.addressTownError =
    request.session.addressTown === undefined || request.session.addressTown.trim() === '';
  request.session.addressCountyError =
    request.session.addressCounty === undefined || request.session.addressCounty.trim() === '';
  request.session.postcodeError =
    request.session.addressPostcode === undefined || request.session.addressPostcode.trim() === '';

  // Call natureScot utils to check validity of postcode
  request.session.invalidPostcodeError =
    request.session.addressPostcode === undefined
      ? true
      : !utils.postalAddress.isaRealUkPostcode(request.session.addressPostcode);

  // Check that any of the fields are invalid.
  request.session.addressError =
    request.session.addressLine1Error ||
    request.session.addressTownError ||
    request.session.addressCountyError ||
    request.session.postcodeError ||
    request.session.invalidPostcodeError;

  // If we've seen an error in any of the fields, our visitor needs to go back
  // and fix them.
  if (request.session.addressError) {
    return ReturnState.Error;
  }

  // The request passed all our validation, we've stored copies of everything we
  // need, so it's time to go on.
  return ReturnState.Positive;
};

export {manualAddressController as default};
