import axios from 'axios';
import config from '../config.js';

/**
 * Find addresses by postcode.
 *
 * @param {string} postcode The postcode to find addresses by.
 */
const findAddressesByPostcode = async (postcode) => {
  let apiResponse;

  try {
    // Lookup the postcode in our Gazetteer API.
    apiResponse = await axios.get(config.gazetteerApiEndpoint, {
      params: {
        postcode,
      },
      headers: {
        Authorization: `Bearer ${config.gazetteerApiKey}`,
      },
      timeout: 10_000,
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
        fieldset: 'all',
      },
      headers: {
        Authorization: `Bearer ${config.gazetteerApiKey}`,
      },
      timeout: 10_000,
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

export {findAddressesByPostcode, findFullAddressesByUprn};
