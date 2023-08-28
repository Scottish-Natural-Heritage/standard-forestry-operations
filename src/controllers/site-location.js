import {ReturnState} from './_base.js';

const removeIndex = (array, index) => {
  const before = array.slice(0, index);
  const after = array.slice(index + 1, array.length);
  return [...before, ...after];
};

const buildDisplaySetts = (session) => {
  const table = [];

  table.push(`
    <table class="govuk-table">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header">Sett ID</th>
          <th scope="col" class="govuk-table__header">Grid Reference</th>
          <th scope="col" class="govuk-table__header">Entrances</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
  `);

  for (const sett of session.setts) {
    table.push(`
      <tr class="govuk-table__row">
        <th scope="row" class="govuk-table__header">${sett.id}</th>
        <td class="govuk-table__cell">${sett.gridReference}</td>
        <td class="govuk-table__cell">${sett.entrances}</td>
      </tr>
    `);
  }

  table.push(`
      </tbody>
    </table>
  `);

  return table.join('');
};

/**
 * Dirty a string to re-add any html-ish characters.
 *
 * Takes something like
 * &lt;script&gt;alert('hello');&lt;/script&gt;&lt;p&gt;this &amp; that&lt;/p&gt;'
 * and returns '<script>alert("hello");</script><p>this & that</p>'.
 *
 * @param {string} id A user supplied string of dubious quality.
 * @returns {string} A nice tidy version of the string.
 */
const unFormatId = (id) => {
  return id.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
};

const siteLocationController = (request) => {
  const formKeys = Object.keys(request.body);

  const editMode = formKeys.filter((key) => key.startsWith('edit-')).length === 1;
  const deleteMode = formKeys.filter((key) => key.startsWith('delete-')).length === 1;
  const addMode = formKeys.filter((key) => key.startsWith('add')).length === 1;
  const continueMode = formKeys.filter((key) => key.startsWith('continue')).length === 1;

  if (editMode) {
    const editKey = formKeys.find((key) => key.startsWith('edit-'));
    const editIndex = Number.parseInt(editKey.split('edit-')[1], 10);

    request.session.currentSettIndex = editIndex;

    request.session.currentSettId = unFormatId(request.session.setts[editIndex].id);

    request.session.setts[editIndex].editable = true;

    request.session.currentGridReference = request.session.setts[editIndex].gridReference;
    request.session.currentEntrances = request.session.setts[editIndex].entrances;

    request.session.settDetailsError = false;
    request.session.currentSettIdError = false;
    request.session.currentGridReferenceError = false;
    request.session.currentEntrancesError = false;

    return ReturnState.Secondary;
  }

  if (deleteMode) {
    const deleteKey = formKeys.find((key) => key.startsWith('delete-'));
    const deleteIndex = Number.parseInt(deleteKey.split('delete-')[1], 10);

    request.session.setts = removeIndex(request.session.setts, deleteIndex);

    return ReturnState.SameAgain;
  }

  if (addMode) {
    request.session.currentSettIndex = -1;

    request.session.currentSettId = '';
    request.session.currentGridReference = '';
    request.session.currentEntrances = '';

    request.session.settDetailsError = false;
    request.session.currentSettIdError = false;
    request.session.currentGridReferenceError = false;
    request.session.currentEntrancesError = false;

    return ReturnState.Secondary;
  }

  if (continueMode) {
    request.session.settCountError = request.session.setts === undefined || request.session.setts.length === 0;

    if (request.session.settCountError) {
      return ReturnState.Error;
    }

    request.session.displaySetts = buildDisplaySetts(request.session);

    return ReturnState.Positive;
  }

  return ReturnState.Error;
};

export {siteLocationController as default};
