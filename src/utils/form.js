/**
 * Cleans and sanitises a 'yes'/'no' pair of radio buttons.
 *
 * @param {string | undefined} dirty A form field that should be 'yes',
 * 'no' or undefined as set by a pair of radio buttons.
 * @returns {boolean | undefined} True if dirty is 'yes', false if dirty is
 * 'no', undefined otherwise.
 */
const cleanRadioBoolean = (dirty) => {
  if (dirty === 'yes') {
    return true;
  }

  if (dirty === 'no') {
    return false;
  }

  return undefined;
};

/**
 * Cleans and sanitises a string form field.
 *
 * @param {string | undefined} dirty A user-entered string from an
 * incoming form.
 * @returns {string | undefined} A trimmed string, or undefined.
 */
const cleanInputString = (dirty) => {
  if (dirty !== undefined && typeof dirty === 'string' && dirty.trim() !== '') {
    return dirty.trim();
  }

  return undefined;
};

/**
 * Process a string in to either it's non-negative integer `number`
 * representation or return `undefined`.
 *
 * @param {string | undefined} dirtyValue The user's supplied integer value.
 * @returns {number | undefined} The cleaned, non-negative, integer value.
 */

const cleanNonNegativeInteger = (dirtyValue) => {
  const trimmedValue = cleanInputString(dirtyValue);
  if (trimmedValue === undefined) {
    return undefined;
  }

  // Check we're only receiving digits, not text, negative numbers or floats.
  if (!/^\d+$/.test(trimmedValue)) {
    return undefined;
  }

  // Check it does actually parse correctly.
  const valueAsNumber = Number.parseInt(trimmedValue, 10);
  if (Number.isNaN(valueAsNumber)) {
    return undefined;
  }

  // Return the fully validated integer value.
  return valueAsNumber.valueOf();
};

export {cleanNonNegativeInteger, cleanInputString, cleanRadioBoolean};
