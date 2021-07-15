import {ReturnState} from './_base.js';
import utils from 'naturescot-utils';

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
    fullName: body.fullName === undefined ? undefined : body.fullName.trim(),
    companyOrganisation: body.companyOrganisation === undefined ? undefined : body.companyOrganisation.trim(),
    addressLine1: body.addressLine1 === undefined ? undefined : body.addressLine1.trim(),
    addressLine2: body.addressLine2 === undefined ? undefined : body.addressLine2.trim(),
    addressTown: body.addressTown === undefined ? undefined : body.addressTown.trim(),
    addressCounty: body.addressCounty === undefined ? undefined : body.addressCounty.trim(),
    addressPostcode: body.addressPostcode === undefined ? undefined : body.addressPostcode.trim(),
    phoneNumber: body.phoneNumber === undefined ? undefined : body.phoneNumber.trim(),
    emailAddress: body.emailAddress === undefined ? undefined : body.emailAddress.trim()
  };
};

const detailsController = (request) => {
  // Clear errors.
  request.session.nameError = false;
  request.session.addressError = false;
  request.session.townError = false;
  request.session.postcodeError = false;
  request.session.phoneError = false;
  request.session.emailError = false;
  // Clean up the user's input before we store it in the session.
  const cleanForm = cleanInput(request.body);
  request.session.fullName = cleanForm.fullName;
  request.session.companyOrganisation = cleanForm.companyOrganisation;
  request.session.addressLine1 = cleanForm.addressLine1;
  request.session.addressLine2 = cleanForm.addressLine2;
  request.session.addressTown = cleanForm.addressTown;
  request.session.addressCounty = cleanForm.addressCounty;
  request.session.addressPostcode = cleanForm.addressPostcode;
  request.session.phoneNumber = cleanForm.phoneNumber;
  request.session.emailAddress = cleanForm.emailAddress;

  request.session.nameError = request.session.fullName === undefined || request.session.fullName.trim() === '';
  request.session.addressError =
    request.session.addressLine1 === undefined || request.session.addressLine1.trim() === '';
  request.session.townError = request.session.addressTown === undefined || request.session.addressTown.trim() === '';

  // Call natureScot utils to check validity of postcode
  request.session.postcodeError =
    request.session.addressPostcode === undefined
      ? true
      : !utils.postalAddress.isaRealUkPostcode(request.session.addressPostcode);

  // The smallest, non-local, non-shortcode UK phone number is '08001111'.
  // The longest could be something like 	'+44 (01234) 567 890', but we're not
  // going to check for too much data at this time.
  request.session.phoneError =
    request.session.phoneNumber === undefined ||
    request.session.phoneNumber.trim() === '' ||
    request.session.phoneNumber.trim().length < 8;

  if (request.session.emailAddress === undefined) {
    request.session.emailError = true;
  } else {
    try {
      utils.recipients.validateEmailAddress(request.session.emailAddress);
    } catch {
      request.session.emailError = true;
    }
  }

  // Check that any of the fields are invalid.
  request.session.detailsError =
    request.session.nameError ||
    request.session.addressError ||
    request.session.townError ||
    request.session.postcodeError ||
    request.session.phoneError ||
    request.session.emailError;

  // If we've seen an error in any of the fields, our visitor needs to go back
  // and fix them.
  if (request.session.detailsError) {
    return ReturnState.Error;
  }

  // The request passed all our validation, we've stored copies of everything we
  // need, so it's time to go on.
  return ReturnState.Positive;
};

export {detailsController as default};
