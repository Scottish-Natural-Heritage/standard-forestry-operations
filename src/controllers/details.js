import utils from 'naturescot-utils';
import validation from '../utils/validation.js';
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
    fullName: body.fullName === undefined ? undefined : body.fullName.trim(),
    companyOrganisation: body.companyOrganisation === undefined ? undefined : body.companyOrganisation.trim(),
    phoneNumber: body.phoneNumber === undefined ? undefined : body.phoneNumber.trim(),
    emailAddress: body.emailAddress === undefined ? undefined : body.emailAddress.trim(),
  };
};

const detailsController = (request) => {
  // Clear errors.
  request.session.nameError = false;
  request.session.phoneError = false;
  request.session.emailError = false;
  request.session.invalidCharsName = false;
  request.session.invalidCharsOrganisation = false;
  request.session.invalidCharsPhoneNumber = false;
  // Clean up the user's input before we store it in the session.
  const cleanForm = cleanInput(request.body);
  request.session.fullName = cleanForm.fullName;
  request.session.companyOrganisation = cleanForm.companyOrganisation;
  request.session.phoneNumber = cleanForm.phoneNumber;
  request.session.emailAddress = cleanForm.emailAddress;

  request.session.nameError = request.session.fullName === undefined || request.session.fullName.trim() === '';

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

  // Check no forbidden characters exist in the user's details.
  request.session.invalidCharsName = validation.hasInvalidCharacters(cleanForm.fullName, validation.invalidCharacters);
  request.session.invalidCharsOrganisation = validation.hasInvalidCharacters(
    cleanForm.companyOrganisation,
    validation.invalidCharacters,
  );
  request.session.invalidCharsPhoneNumber = validation.hasInvalidCharacters(
    cleanForm.phoneNumber,
    validation.invalidCharacters,
  );

  // Check that any of the fields are invalid.
  request.session.detailsError =
    request.session.nameError ||
    request.session.phoneError ||
    request.session.emailError ||
    request.session.invalidCharsName ||
    request.session.invalidCharsOrganisation ||
    request.session.invalidCharsPhoneNumber;

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
