import axios from 'axios';
import config from '../config.js';
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
    emailAddress: body.emailAddress === undefined ? undefined : body.emailAddress.trim()
  };
};

const otherEmailController = async (request) => {
  try {
    // Clean up the user's input before we store it in the session.
    const cleanForm = cleanInput(request.body);
    request.session.otherEmailAddress = cleanForm.emailAddress;

    request.session.otherEmailError =
      request.session.otherEmailAddress === undefined ||
      request.session.otherEmailAddress.trim() === '' ||
      request.session.otherEmailAddress.trim().includes(' ') ||
      !request.session.otherEmailAddress.includes('@');

    // If we've seen an error in any of the fields, our visitor needs to go back
    // and fix them.
    if (request.session.otherEmailError) {
      return ReturnState.Error;
    }

    // Get our apply-for-another object ready for submission.
    const newApplyOther = {
      emailAddress: request.session.otherEmailAddress
    };

    await axios.post(config.apiEndpoint + '/apply-other', newApplyOther);

    return ReturnState.Positive;
  } catch (error) {
    // TODO: Do something useful with this error.
    console.log(error);

    // Let the user know it went wrong, and to 'probably' try again?
    return ReturnState.Error;
  }
};

export {otherEmailController as default};
