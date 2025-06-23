// A list of characters we do not allow the user to supply as input.
const invalidCharacters = ['<', '>', '%', '/', '#', ':', '{', '}', '[', ']', '+', '=', '|', '*', '&'];

/**
 * Checks the supplied user input against an array of forbidden
 * characters and returns true if the input contains any forbidden
 * characters or else returns false if no forbidden characters or is
 * `undefined`.
 *
 * @param {string | undefined} userInput The input to check for forbidden characters.
 * @param {string[]} invalidCharacters An array of characters that are not
 * permitted as input.
 * @returns {boolean} Returns true if the supplied string contains any
 * forbidden characters, else returns false if no forbidden characters or input
 * is `undefined`.
 */
const hasInvalidCharacters = (userInput, invalidCharacters) => {
  if (userInput) {
    for (const char of invalidCharacters) {
      if (userInput.includes(char)) {
        return true;
      }
    }
  }

  return false;
};

const validationUtils = {hasInvalidCharacters, invalidCharacters};

export default validationUtils;
