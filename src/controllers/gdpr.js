import {ReturnState} from './_base.js';

const gdprController = (request) => {
  // Technically, this is the only possible valid decision as it's coming
  // from a hidden input.
  if (request.body.acceptGdpr === 'yes') {
    // We should just move on.
    return ReturnState.Positive;
  }

  // This option will allow for actually checking the user consent to GDPR
  // questions if and when we need it later.
  if (request.body.acceptGdpr === 'no') {
    // Send them to down the STOP path.
    return ReturnState.Negative;
  }

  // This is possible if they post to the URL without anything in the form
  // body. Send them back to the real page so they can do it properly.
  return ReturnState.Error;
};

export {gdprController as default};
