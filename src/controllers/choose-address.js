import {ReturnState} from './_base.js';
import axios from 'axios';
import config from '../config.js';

/**
 * Find addresses by postcode.
 *
 * @param {number} uprn The UPRN to find addresses by.
 */
const findFullAddressesByUprn = async (uprn) => {
  let apiResponse;

  try {
    // Lookup the postcode in our Gazetteer API.
    apiResponse = await axios.get(config.gazetteerApiEndpoint, {
      params: {
        uprn,
        fieldset: 'all'
      },
      headers: {
        Authorization: `Bearer ${config.gazetteerApiKey}`
      },
      timeout: 10_000
    });
  } catch (error) {
    console.log(error);
  }

  // Grab just the json payload.
  const apiData = apiResponse.data;

  // A single string in the array rather than an array of objects indicates an
  // error where no addresses have been found.
  if (apiData.metadata.count === 0 || (apiData.results.length === 1 && typeof apiData.results[0] === 'string')) {
    throw new Error('No matching addresses found.');
  }

  // Treat the json blob as a typed response.
  const gazetteerResponse = apiData;

  // Dig out the right array from the returned json blob.
  return gazetteerResponse.results[0].address;
};

const chooseAddressController = async (request) => {
  try {
    // Get full address uprn
    const gazetteerAddresses = await findFullAddressesByUprn(request.session.uprn ?? 0);

    // Build up address line 1
    const subBuildingName = gazetteerAddresses[0].sub_building_name
      ? String(gazetteerAddresses[0].sub_building_name)
      : '';
    const organisationName = gazetteerAddresses[0].rm_organisation_name
      ? String(gazetteerAddresses[0].rm_organisation_name)
      : '';
    const buildingNumber = gazetteerAddresses[0].building_number ? String(gazetteerAddresses[0].building_number) : '';
    const buildingName = gazetteerAddresses[0].building_name ? String(gazetteerAddresses[0].building_name) : '';
    const addressLine1 = `${subBuildingName} ${organisationName} ${buildingNumber} ${buildingName}`;

    // Set and save the address values back to the visitors session.
    request.session.uprnAddress = {};
    request.session.uprnAddress.addressLine1 = addressLine1;
    request.session.uprnAddress.addressLine2 = gazetteerAddresses[0].street_description;
    request.session.uprnAddress.addressTown = gazetteerAddresses[0].post_town;
    request.session.uprnAddress.addressCounty = gazetteerAddresses[0].administrative_area;
  } catch (error) {
    console.log(error);
  }

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
