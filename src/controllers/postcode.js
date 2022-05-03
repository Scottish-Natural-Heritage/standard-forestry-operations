import {ReturnState} from './_base.js';
import utils from 'naturescot-utils';

/**
 * Clean the incoming postcode to make it more compatible with the
 * database and its validation rules.
 *
 * @param {any} body the incoming request's body
 * @returns {any} a json object that's just got our cleaned up postcode in it
 */
const cleanInput = (body) =>{
  return{
  addressPostcode: body.addressPostcode === undefined ? undefined : body.addressPostcode.trim()
  };
};

const postcodeController = () => {
  // Clear errors.
  request.session.postcodeError = false;
  request.session.invalidPostcodeError = false;
  request.session.emptyPostcodeError = false;

  const cleanForm = cleanInput(request.body);
  request.session.addressPostcode = cleanForm.addressPostcode;

  request.session.emptyPostcodeError = request.session.addressPostcode === undefined || request.session.addressPostcode.trim() === '';

  // Call natureScot utils to check validity of postcode
  request.session.invalidPostcodeError = !utils.postalAddress.isaRealUkPostcode(request.session.addressPostcode);

  // Check that any of the fields are invalid.
  request.session.postcodeError = request.session.emptyPostcodeError || request.session.invalidPostcodeError;

  // If we've seen an error in any of the fields, our visitor needs to go back
  // and fix them.
  if (request.session.postcodeError) {
    return ReturnState.Error;
  }

  // The request passed all our validation, we've stored copies of everything we
  // need, so it's time to go on.
  return ReturnState.Positive;
};

export {postcodeController as default};
