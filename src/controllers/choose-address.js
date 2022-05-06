import {ReturnState} from './_base.js';
import Gazetteer from '../utils/gazetteer.js';

const chooseAddressController = async (request) => {
  try {
    // Get full address uprn
    const gazetteerAddresses = await Gazetteer.findFullAddressesByUprn(request.session.uprn ?? 0);

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
