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
    addressLine1: body.addressLine1 === undefined ? undefined : body.addressLine1.trim(),
    addressLine2: body.addressLine2 === undefined ? undefined : body.addressLine2.trim(),
    addressTown: body.addressTown === undefined ? undefined : body.addressTown.trim(),
    addressCounty: body.addressCounty === undefined ? undefined : body.addressCounty.trim(),
    addressPostcode: body.addressPostcode === undefined ? undefined : body.addressPostcode.trim(),
    phoneNumber: body.phoneNumber === undefined ? undefined : body.phoneNumber.trim(),
    emailAddress: body.emailAddress === undefined ? undefined : body.emailAddress.trim()
  };
};

const buildDisplayAddress = (session) => {
  // Build the address array, ignoring any blank fields.
  const address = [];

  if (session.addressLine1 !== undefined && session.addressLine1.trim() !== '') {
    address.push(session.addressLine1);
  }

  if (session.addressLine2 !== undefined && session.addressLine2.trim() !== '') {
    address.push(session.addressLine2);
  }

  if (session.addressTown !== undefined && session.addressTown.trim() !== '') {
    address.push(session.addressTown);
  }

  if (session.addressCounty !== undefined && session.addressCounty.trim() !== '') {
    address.push(session.addressCounty);
  }

  if (session.addressPostcode !== undefined && session.addressPostcode.trim() !== '') {
    address.push(session.addressPostcode);
  }

  return address.join('<br>');
};

const detailsController = (req) => {
  // Clean up the user's input before we store it in the session.
  const cleanForm = cleanInput(req.body);
  req.session.fullName = cleanForm.fullName;
  req.session.companyOrganisation = cleanForm.companyOrganisation;
  req.session.addressLine1 = cleanForm.addressLine1;
  req.session.addressLine2 = cleanForm.addressLine2;
  req.session.addressTown = cleanForm.addressTown;
  req.session.addressCounty = cleanForm.addressCounty;
  req.session.addressPostcode = cleanForm.addressPostcode;
  req.session.phoneNumber = cleanForm.phoneNumber;
  req.session.emailAddress = cleanForm.emailAddress;

  req.session.nameError = req.session.fullName === undefined || req.session.fullName.trim() === '';
  req.session.addressError = req.session.addressLine1 === undefined || req.session.addressLine1.trim() === '';
  req.session.townError = req.session.addressTown === undefined || req.session.addressTown.trim() === '';

  // The shortest UK postcode is 'N19GU'.
  // The longest should be something like 'IV30 6GR', but we're not going to
  // check for too much data at this time.
  req.session.postcodeError =
    req.session.addressPostcode === undefined ||
    req.session.addressPostcode.trim() === '' ||
    req.session.addressPostcode.trim().length < 5;

  // The smallest, non-local, non-shortcode UK phone number is '08001111'.
  // The longest could be something like 	'+44 (01234) 567 890', but we're not
  // going to check for too much data at this time.
  req.session.phoneError =
    req.session.phoneNumber === undefined ||
    req.session.phoneNumber.trim() === '' ||
    req.session.phoneNumber.trim().length < 8;

  req.session.emailError =
    req.session.emailAddress === undefined ||
    req.session.emailAddress.trim() === '' ||
    req.session.emailAddress.trim().includes(' ') ||
    !req.session.emailAddress.includes('@');

  // Check that any of the fields are invalid.
  req.session.detailsError =
    req.session.nameError ||
    req.session.addressError ||
    req.session.townError ||
    req.session.postcodeError ||
    req.session.phoneError ||
    req.session.emailError;

  // If we've seen an error in any of the fields, our visitor needs to go back
  // and fix them.
  if (req.session.detailsError) {
    return ReturnState.Error;
  }

  // Create the display versions of the visitors address and contact info.
  req.session.displayAddress = buildDisplayAddress(req.session);
  req.session.displayContact = `${req.session.phoneNumber}<br>${req.session.emailAddress}`;

  // The request passed all our validation, we've stored copies of everything we
  // need, so it's time to go on.
  return ReturnState.Positive;
};

export {detailsController as default};
