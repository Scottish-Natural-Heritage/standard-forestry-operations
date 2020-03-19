import {ReturnState} from './_base.js';

const validSettId = (settId) => {
  if (settId === undefined) {
    return false;
  }

  if (settId.trim() === '') {
    return false;
  }

  return true;
};

const validGridReference = (gridReference) => {
  if (gridReference === undefined) {
    return false;
  }

  if (gridReference.trim() === '') {
    return false;
  }

  if (gridReference.trim().length % 2 !== 0) {
    return false;
  }

  if (gridReference.trim().length < 8) {
    return false;
  }

  return true;
};

const validSettType = (settType) => {
  const testParse = Number.parseInt(settType, 10);
  if (Number.isNaN(testParse)) {
    return false;
  }

  if (testParse < 1) {
    return false;
  }

  if (testParse > 4) {
    return false;
  }

  return true;
};

const validEntrances = (entrances) => {
  if (entrances === undefined) {
    return false;
  }

  if (entrances.trim() === '') {
    return false;
  }

  const testParse = Number.parseInt(entrances, 10);
  if (Number.isNaN(testParse)) {
    return false;
  }

  return true;
};

const settDetailsController = (req) => {
  req.session.currentSettIdError = !validSettId(req.body.currentSettId);
  req.session.currentGridReferenceError = !validGridReference(req.body.currentGridReference);
  req.session.currentSettTypeError = !validSettType(req.body.currentSettType);
  req.session.currentEntrancesError = !validEntrances(req.body.currentEntrances);

  req.session.settDetailsError =
    req.session.currentSettIdError ||
    req.session.currentGridReferenceError ||
    req.session.currentSettTypeError ||
    req.session.currentEntrancesError;

  if (req.session.settDetailsError) {
    req.session.currentSettId = req.body.currentSettId.trim();
    req.session.currentSettType = Number.parseInt(req.body.currentSettType, 10);
    req.session.currentGridReference = req.body.currentGridReference.trim();
    req.session.currentEntrances = req.body.currentEntrances;

    return ReturnState.Error;
  }

  if (req.session.currentSettIndex === -1) {
    const newSett = {
      id: req.body.currentSettId.trim(),
      type: Number.parseInt(req.body.currentSettType, 10),
      gridReference: req.body.currentGridReference.trim(),
      entrances: Number.parseInt(req.body.currentEntrances, 10)
    };

    if (!Array.isArray(req.session.setts)) {
      req.session.setts = [];
    }

    req.session.setts.push(newSett);
    req.session.settCountError = false;
  } else {
    req.session.setts[req.session.currentSettIndex].id = req.body.currentSettId.trim();
    req.session.setts[req.session.currentSettIndex].type = Number.parseInt(req.body.currentSettType, 10);
    req.session.setts[req.session.currentSettIndex].gridReference = req.body.currentGridReference.trim();
    req.session.setts[req.session.currentSettIndex].entrances = Number.parseInt(req.body.currentEntrances, 10);
  }

  return ReturnState.Positive;
};

export {settDetailsController as default};
