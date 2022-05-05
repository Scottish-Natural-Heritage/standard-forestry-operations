import axios from 'axios';
import config from '../config.js';
import {ReturnState} from './_base.js';

const confirmController = async (request) => {
  try {
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
      setts: request.session.setts,
    };

    // Send the back-end our application.
    const newAppResponse = await axios.post(config.apiEndpoint + '/applications', newApp);

    // Get the application number from the response's location header.
    const applicationId = newAppResponse.headers.location.substr(newAppResponse.headers.location.lastIndexOf('/') + 1);

    // Pad with leading zeroes as required.
    const appId = applicationId.padStart(5, applicationId);

    // Get the application ID from the location in the response.
    request.session.licenceNo = `NS-SFO-${appId}`;

    // If the month is December add 1 year to the expiry date.
    request.session.expiryDate = `30/11/${new Date().getMonth() === 11 ? new Date().getFullYear() + 1 : new Date().getFullYear()}`

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
