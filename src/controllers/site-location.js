import {ReturnState} from './_base.js';

const removeIndex = (array, index) => {
  const before = array.slice(0, index);
  const after = array.slice(index + 1, array.length);
  return before.concat(after);
};

const siteLocationController = (req) => {
  const formKeys = Object.keys(req.body);

  const editMode = formKeys.filter((key) => key.startsWith('edit-')).length === 1;
  const deleteMode = formKeys.filter((key) => key.startsWith('delete-')).length === 1;
  const addMode = formKeys.filter((key) => key.startsWith('add')).length === 1;
  const continueMode = formKeys.filter((key) => key.startsWith('continue')).length === 1;

  req.session.siteName = req.body.siteName === undefined ? undefined : req.body.siteName.trim();

  if (editMode) {
    const editKeys = formKeys.filter((key) => key.startsWith('edit-'));
    const editIndex = Number.parseInt(editKeys[0].split('edit-')[1], 10);

    req.session.currentSettIndex = editIndex;

    req.session.currentSettId = req.session.setts[editIndex].id;
    req.session.currentSettType = req.session.setts[editIndex].type;
    req.session.currentGridReference = req.session.setts[editIndex].gridReference;
    req.session.currentEntrances = req.session.setts[editIndex].entrances;

    req.session.settDetailsError = false;
    req.session.currentSettIdError = false;
    req.session.currentGridReferenceError = false;
    req.session.currentSettTypeError = false;
    req.session.currentEntrancesError = false;

    return ReturnState.Secondary;
  }

  if (deleteMode) {
    const deleteKeys = formKeys.filter((key) => key.startsWith('delete-'));
    const deleteIndex = Number.parseInt(deleteKeys[0].split('delete-')[1], 10);

    req.session.setts = removeIndex(req.session.setts, deleteIndex);

    return ReturnState.SameAgain;
  }

  if (addMode) {
    req.session.currentSettIndex = -1;

    req.session.currentSettId = '';
    req.session.currentSettType = undefined;
    req.session.currentGridReference = '';
    req.session.currentEntrances = '';

    req.session.settDetailsError = false;
    req.session.currentSettIdError = false;
    req.session.currentGridReferenceError = false;
    req.session.currentSettTypeError = false;
    req.session.currentEntrancesError = false;

    return ReturnState.Secondary;
  }

  if (continueMode) {
    req.session.siteNameError = req.session.siteName === undefined || req.session.siteName.length === 0;
    req.session.settCountError = req.session.setts === undefined || req.session.setts.length === 0;

    req.session.siteLocationError = req.session.siteNameError || req.session.settCountError;

    if (req.session.siteLocationError) {
      return ReturnState.Error;
    }

    return ReturnState.Positive;
  }

  return ReturnState.Error;
};

export {siteLocationController as default};
