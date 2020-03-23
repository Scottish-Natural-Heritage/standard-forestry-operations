import {ReturnState} from './_base.js';

const confirmController = async (req) => {
  try {
    req.session.licenceNo = `NS-SFO-${Math.ceil(Math.random() * 99999)}`;
    req.session.expiryDate = `30/11/${new Date().getFullYear()}`;

    // Let them know it all went well.
    return ReturnState.Positive;
  } catch (error) {
    // TODO: Do something useful with this error.
    console.log(error);

    // Let the user know it went wrong, and to 'probably' try again?
    return ReturnState.Error;
  }
};

export {confirmController as default};
