import axios from 'axios';
import config from '../config.js';
import {ReturnState} from './_base.js';

const confirmController = async (request) => {
  try {
    // Allocate a new application.
    const newAppResponse = await axios.post(config.apiEndpoint);

    // Determine where the back-end's saved it.
    const newAppUrl = newAppResponse.headers.location;

    // Get our application object ready for submission.
    const newApp = {
      convictions: request.session.conviction,
      complyWithTerms: request.session.comply,
      fullName: request.session.fullName,
      companyOrganisation: request.session.companyOrganisation,
      addressLine1: request.session.addressLine1,
      addressLine2: request.session.addressLine2,
      addressTown: request.session.addressTown,
      addressCounty: request.session.addressCounty,
      addressPostcode: request.session.addressPostcode,
      phoneNumber: request.session.phoneNumber,
      emailAddress: request.session.emailAddress,
      siteName: request.session.siteName,
      setts: request.session.setts
    };

    // Send the back-end our application.
    const updatedAppResponse = await axios.put(newAppUrl, newApp);

    // Save the licence details from the successful application.
    request.session.licenceNo = `NS-SFO-${updatedAppResponse.data.id}`;
    request.session.expiryDate = `30/11/${new Date().getFullYear()}`;

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
