import axios from 'axios';
import config from '../config.js';
import {ReturnState} from './_base.js';

const confirmController = async (req) => {
  try {
    // Allocate a new application.
    const newAppResponse = await axios.post(config.apiEndpoint);

    // Determine where the back-end's saved it.
    const newAppUrl = newAppResponse.headers.location;

    // Get our application object ready for submission.
    const newApp = {
      convictions: req.session.conviction,
      complyWithTerms: req.session.comply,
      fullName: req.session.fullName,
      companyOrganisation: req.session.companyOrganisation,
      addressLine1: req.session.addressLine1,
      addressLine2: req.session.addressLine2,
      addressTown: req.session.addressTown,
      addressCounty: req.session.addressCounty,
      addressPostcode: req.session.addressPostcode,
      phoneNumber: req.session.phoneNumber,
      emailAddress: req.session.emailAddress,
      siteName: req.session.siteName,
      setts: req.session.setts
    };

    // Send the back-end our application.
    const updatedAppResponse = await axios.put(newAppUrl, newApp);

    // Save the licence details from the successful application.
    req.session.licenceNo = `NS-SFO-${updatedAppResponse.data.id}`;
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
