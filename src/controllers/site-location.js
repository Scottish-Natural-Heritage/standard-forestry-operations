import {ReturnState} from './_base.js';

const removeIndex = (array, index) => {
  const before = array.slice(0, index);
  const after = array.slice(index + 1, array.length);
  return before.concat(after);
};

const buildDisplaySetts = (session) => {
  const table = [];

  table.push(`
    <table class="govuk-table">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header">Sett ID</th>
          <th scope="col" class="govuk-table__header">Type</th>
          <th scope="col" class="govuk-table__header">Grid Reference</th>
          <th scope="col" class="govuk-table__header">Entrances</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
  `);

  session.setts.forEach((sett) => {
    const type = ['-', 'Main', 'Outlying', 'Annex', 'Subsidiary'][sett.type];

    table.push(`
      <tr class="govuk-table__row">
        <th scope="row" class="govuk-table__header">${sett.id}</th>
        <td class="govuk-table__cell">${type}</td>
        <td class="govuk-table__cell">${sett.gridReference}</td>
        <td class="govuk-table__cell">${sett.entrances}</td>
      </tr>
    `);
  });

  table.push(`
      </tbody>
    </table>
  `);

  return table.join('');
};

const siteLocationController = (request) => {
  const formKeys = Object.keys(request.body);

  const editMode = formKeys.filter((key) => key.startsWith('edit-')).length === 1;
  const deleteMode = formKeys.filter((key) => key.startsWith('delete-')).length === 1;
  const addMode = formKeys.filter((key) => key.startsWith('add')).length === 1;
  const continueMode = formKeys.filter((key) => key.startsWith('continue')).length === 1;

  request.session.siteName = request.body.siteName === undefined ? undefined : request.body.siteName.trim();

  if (editMode) {
    const editKeys = formKeys.filter((key) => key.startsWith('edit-'));
    const editIndex = Number.parseInt(editKeys[0].split('edit-')[1], 10);

    request.session.currentSettIndex = editIndex;

    request.session.currentSettId = request.session.setts[editIndex].id;
    request.session.currentSettType = request.session.setts[editIndex].type;
    request.session.currentGridReference = request.session.setts[editIndex].gridReference;
    request.session.currentEntrances = request.session.setts[editIndex].entrances;

    request.session.settDetailsError = false;
    request.session.currentSettIdError = false;
    request.session.currentGridReferenceError = false;
    request.session.currentSettTypeError = false;
    request.session.currentEntrancesError = false;

    return ReturnState.Secondary;
  }

  if (deleteMode) {
    const deleteKeys = formKeys.filter((key) => key.startsWith('delete-'));
    const deleteIndex = Number.parseInt(deleteKeys[0].split('delete-')[1], 10);

    request.session.setts = removeIndex(request.session.setts, deleteIndex);

    return ReturnState.SameAgain;
  }

  if (addMode) {
    request.session.currentSettIndex = -1;

    request.session.currentSettId = '';
    request.session.currentSettType = undefined;
    request.session.currentGridReference = '';
    request.session.currentEntrances = '';

    request.session.settDetailsError = false;
    request.session.currentSettIdError = false;
    request.session.currentGridReferenceError = false;
    request.session.currentSettTypeError = false;
    request.session.currentEntrancesError = false;

    return ReturnState.Secondary;
  }

  if (continueMode) {
    request.session.siteNameError = request.session.siteName === undefined || request.session.siteName.length === 0;
    request.session.settCountError = request.session.setts === undefined || request.session.setts.length === 0;

    request.session.siteLocationError = request.session.siteNameError || request.session.settCountError;

    if (request.session.siteLocationError) {
      return ReturnState.Error;
    }

    request.session.displaySetts = buildDisplaySetts(request.session);

    return ReturnState.Positive;
  }

  return ReturnState.Error;
};

export {siteLocationController as default};
