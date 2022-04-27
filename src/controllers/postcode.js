import {ReturnState} from './_base.js';

/**
 * Clean the incoming postcode to make it more compatible with the
 * database and its validation rules.
 *
 * @param {any} body the incoming request's body
 * @returns {any} a json object that's just got our cleaned up postcode in it
 */
const cleanInput = (body) =>{
  return{
  addressPostcode: model.addressPostcode === undefined ? undefined : model.addressPostcodeostcode.trim()
  };
};

const postcodeController = () => {

  const cleanForm = cleanInput(request.body);
  request.session.addressPostcode = cleanForm.addressPostcode;
  request.session.addressPostcodeError = false;

    // Call natureScot utils to check validity of postcode
    request.session.postcodeError =
    request.body.addressPostcode === undefined
      ? true
      : !utils.postalAddress.isaRealUkPostcode(request.body.addressPostcode);

  return ReturnState.Positive;
};

export {postcodeController as default};
