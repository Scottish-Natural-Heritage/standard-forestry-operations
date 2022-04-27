import {ReturnState} from './_base.js';

const chooseAddressController = (request) => {
  // Did the user tell us they need to enter a manual address?.
  if (request.body.addressFound === 'no') {
    // Go down the 'SecondaryForward' path.
    return ReturnState.Secondary;
  }

  // Much like the start page, the only way out of the choose address page is onwards,
  // so return success and continue the form.
  return ReturnState.Positive;
};

export {chooseAddressController as default};
