import {ReturnState} from './_base.js';

const otherController = (request) => {
  // Did the user tell us they're self applying.
  if (request.body.other === 'self') {
    // Then we don't have any errors. This clears any previous errors.
    request.session.otherError = false;
    // Save the decision.
    request.session.other = false;
    // Follow the 'happy path'.
    return ReturnState.Positive;
  }

  // Did the user tell us they're applying for another.
  if (request.body.other === 'other') {
    // It's a silly answer, but not an error. This clears any previous errors.
    request.session.otherError = false;
    // Save the decision.
    request.session.other = true;
    // Go down the 'STOP' path.
    return ReturnState.Negative;
  }

  // The user submitted the form without selecting an option, this is an error!
  request.session.otherError = true;
  // Unset any saved value.
  request.session.other = undefined;
  // Reload the page to highlight errors.
  return ReturnState.Error;
};

export {otherController as default};
