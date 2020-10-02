import {ReturnState} from './_base.js';

const complyController = (request) => {
  // Did the user tell us they'll comply with the terms.
  if (request.body.comply !== undefined && request.body.comply === 'yes') {
    // Then we don't have any errors. This clears any previous errors.
    request.session.complyError = false;
    // Save the agreement to comply.
    request.session.comply = true;
    // Follow the 'happy path'.
    return ReturnState.Positive;
  }

  // The user submitted the form without selecting an option, this is an error!
  request.session.complyError = true;
  // Unset any saved value.
  request.session.comply = false;
  // Reload the page to highlight errors.
  return ReturnState.Error;
};

export {complyController as default};
