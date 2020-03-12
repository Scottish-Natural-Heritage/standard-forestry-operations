import {ReturnState} from './_base.js';

const complyController = (req) => {
  // Did the user tell us they'll comply with the terms.
  if (req.body.comply !== undefined && req.body.comply === 'yes') {
    // Then we don't have any errors. This clears any previous errors.
    req.session.complyError = false;
    // Save the agreement to comply.
    req.session.comply = true;
    // Follow the 'happy path'.
    return ReturnState.Positive;
  }

  // The user submitted the form without selecting an option, this is an error!
  req.session.complyError = true;
  // Unset any saved value.
  req.session.comply = false;
  // Reload the page to highlight errors.
  return ReturnState.Error;
};

export {complyController as default};
