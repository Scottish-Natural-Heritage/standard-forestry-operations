import axios from 'axios';
import config from '../config.js';
import {ReturnState} from './_base.js';

const confirmController = async (request) => {
  // Clear any previous errors.
  request.session.complyError = false;
  request.session.apiError = false;

  // If the user has clicked the checkbox then proceed.
  if (request.body.comply !== undefined && request.body.comply === 'yes') {
    // Save the agreement to comply.
    request.session.comply = true;

    try {
      // Get our application object ready for submission.
      const newApp = {
        convictions: request.session.conviction,
        fullName: request.session.fullName,
        companyOrganisation: request.session.companyOrganisation,
        phoneNumber: request.session.phoneNumber,
        emailAddress: request.session.emailAddress,
        addressPostcode: request.session.addressPostcode,
        addressLine1: request.session.addressLine1,
        addressLine2: request.session.addressLine2,
        addressTown: request.session.addressTown,
        addressCounty: request.session.addressCounty,
        uprn: request.session?.uprn ?? undefined,
        setts: request.session.setts,
        complyWithTerms: request.session.comply,
      };

      // Send the back-end our application.
      const newAppResponse = await axios.post(config.apiEndpoint + '/applications', newApp);

      // Get the application number from the response's location header.
      const appNo = newAppResponse.headers.location.slice(newAppResponse.headers.location.lastIndexOf('/') + 1);

      // Pad with leading zeroes as required.
      const appId = appNo.padStart(5, 0);

      // Get the application ID from the location in the response.
      request.session.licenceNo = `NS-SFO-${appId}`;

      // If the month is December add 1 year to the expiry date.
      request.session.expiryDate = `30/11/${
        new Date().getMonth() === 11 ? new Date().getFullYear() + 1 : new Date().getFullYear()
      }`;

      // Let them know it all went well.
      return ReturnState.Positive;
    } catch (error) {
      // TODO: Do something useful with this error.
      console.log(error);
      // Set api error to be true.
      request.session.apiError = true;
      // Let the user know it went wrong, and to 'probably' try again?
      return ReturnState.Error;
    }
  }

  // The user submitted the form without selecting an option, this is an error!
  request.session.complyError = true;
  // Unset any saved value.
  request.session.comply = false;
  // Reload the page to highlight errors.
  return ReturnState.Error;
};

export {confirmController as default};
