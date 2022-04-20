import {ReturnState} from './_base.js';

const beforeYouStartController = (request) => {
  // Much like the start page, the only way out of the before you start page is onwards,
  // so return success and continue the form.
  return ReturnState.Positive;
};

export {beforeYouStartController as default};
