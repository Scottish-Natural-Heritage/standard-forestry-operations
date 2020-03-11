import {ReturnState} from './_base.js';

const eligibleController = () => {
  // Much like the start page, the only way out of the eligible page is onwards,
  // so return success and continue the form.
  return ReturnState.Positive;
};

export {eligibleController as default};
