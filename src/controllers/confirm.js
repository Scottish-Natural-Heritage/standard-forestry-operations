import axios from 'axios';
import config from '../config.js';
import {ReturnState} from './_base.js';

const confirmController = async (request) => {
<<<<<<< HEAD
  if (request.body.declaration !== undefined && request.body.declaration === 'yes') {
    // Then we don't have any errors. This clears any previous errors.
    request.session.declarationError = false;
    // Save the agreement to comply.
    request.session.declaration = true;
    // Follow the 'happy path'.

    try {
      // Allocate a new application.
      const newAppResponse = await axios.post(config.apiEndpoint + '/applications');

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
=======
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
      setts: request.session.setts
    };

    // Send the back-end our application.
    const newAppResponse = await axios.post(config.apiEndpoint + '/applications', newApp);

    // Get the application number from the response's location header.
    const appNo = newAppResponse.headers.location.slice(newAppResponse.headers.location.lastIndexOf('/') + 1);

    // Pad with leading zeroes as required.
    const appId = appNo.padStart(5, appNo);

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

    // Let the user know it went wrong, and to 'probably' try again?
    return ReturnState.Error;
>>>>>>> develop
  }

  // The user submitted the form without selecting an option, this is an error!
  request.session.declarationError = true;
  // Unset any saved value.
  request.session.declaration = false;
  // Reload the page to highlight errors.
  return ReturnState.Error;
};

export {confirmController as default};
