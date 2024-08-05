/**
 * Get the easting and northing of the bottom-left corner of the first letter
 * (500km tile) of a grid reference.
 * @param {string} letter The first letter of a grid reference.
 * @returns {number[]} An array containing an easting and a northing.
 */
const firstLetterToEastNorth = (letter) => {
  // Check we've got a 1 char string as input.
  if (letter === undefined || letter.length !== 1) {
    return undefined;
  }

  // Define the eastings and northings of each 500km tile.
  const firstLetterEastNorth = {
    S: [0, 0],
    T: [500_000, 0],
    N: [0, 500_000],
    O: [500_000, 500_000],
    H: [0, 1_000_000],
  };

  // Check the letter corresponds with a valid 500km tile.
  if (!Object.keys(firstLetterEastNorth).includes(letter.toUpperCase())) {
    return undefined;
  }

  // Return the correct easting and northing.
  return firstLetterEastNorth[letter.toUpperCase()];
};

/**
 * Get the easting and northing offset of the bottom-left corner of the second
 * letter (100km tile) of a grid reference.
 * @param {string} letter The second letter of a grid reference.
 * @returns {number[]} An array containing an easting and a northing.
 */
const secondLetterToEastNorth = (letter) => {
  // Check we've got a 1 char string as input.
  if (letter === undefined || letter.length !== 1) {
    return undefined;
  }

  // Define the easting and northing offset of each 100km tile.
  const secondLetterEastNorth = {
    V: [0, 0],
    W: [100_000, 0],
    X: [200_000, 0],
    Y: [300_000, 0],
    Z: [400_000, 0],

    Q: [0, 100_000],
    R: [100_000, 100_000],
    S: [200_000, 100_000],
    T: [300_000, 100_000],
    U: [400_000, 100_000],

    L: [0, 200_000],
    M: [100_000, 200_000],
    N: [200_000, 200_000],
    O: [300_000, 200_000],
    P: [400_000, 200_000],

    F: [0, 300_000],
    G: [100_000, 300_000],
    H: [200_000, 300_000],
    J: [300_000, 300_000],
    K: [400_000, 300_000],

    A: [0, 400_000],
    B: [100_000, 400_000],
    C: [200_000, 400_000],
    D: [300_000, 400_000],
    E: [400_000, 400_000],
  };

  // Check the letter corresponds with a valid 100km tile.
  if (!Object.keys(secondLetterEastNorth).includes(letter.toUpperCase())) {
    return undefined;
  }

  // Return the correct easting and northing.
  return secondLetterEastNorth[letter.toUpperCase()];
};

/**
 * Get the easting and northing offset of the digits of a grid reference.
 * @param {string} gridReference A grid reference.
 * @returns {number[]} An array containing an easting and a northing.
 */
const digitsEastNorth = (gridReference) => {
  // Check we've got something between NH64 and NH6380644032 as input.
  if (
    gridReference === undefined ||
    gridReference.length < 4 ||
    gridReference.length > 12 ||
    gridReference.length % 2 !== 0
  ) {
    return undefined;
  }

  // Strip the letters from the front of the grid ref, keeping the digits.
  const nonLetters = gridReference.slice(2);

  // Get the two numeric halves of the grid ref.
  const eastString = nonLetters.slice(0, nonLetters.length / 2);
  const northString = nonLetters.slice(nonLetters.length / 2);

  // Parse the strings in to numbers.
  const east = Number.parseInt(eastString, 10);
  const north = Number.parseInt(northString, 10);

  // Make sure we've been given some reasonably sensible numbers as input.
  if (Number.isNaN(east) || Number.isNaN(north) || east < 0 || north < 0) {
    return undefined;
  }

  // NH64 ~= 10km
  if (eastString.length === 1) {
    return [east * 10_000, north * 10_000];
  }

  // NH6344 ~= 1km
  if (eastString.length === 2) {
    return [east * 1000, north * 1000];
  }

  // NH638440 ~= 100m
  if (eastString.length === 3) {
    return [east * 100, north * 100];
  }

  // NH63804403 ~= 10m
  if (eastString.length === 4) {
    return [east * 10, north * 10];
  }

  // NH6380644032 ~= 1m
  return [east, north];
};

/**
 * Take a number of arrays, each containing an easting and a northing, and
 * return a summed easting and northing.
 * @param  {...number[]} eastNorths A number of arrays, each containing an easting and
 * a northing.
 * @returns {number[]} An array containing an easting and a northing.
 */
const sumEastNorths = (...eastNorths) => {
  // eslint-disable-next-line unicorn/no-array-reduce
  const hasAnInvalidEastNorth = eastNorths.reduce((foundInvalid, eastNorth) => {
    return foundInvalid || eastNorth === undefined || eastNorth.length !== 2;
  }, false);

  if (hasAnInvalidEastNorth) {
    return undefined;
  }

  // eslint-disable-next-line unicorn/no-array-reduce
  return eastNorths.reduce(
    (sum, eastNorth) => {
      return [sum[0] + eastNorth[0], sum[1] + eastNorth[1]];
    },
    [0, 0],
  );
};

/**
 * Convert an OS Grid Reference to an array containing its easting and northing.
 * @param {string} gridReference An OS Grid Reference, eg. NH63804403.
 * @returns {number[]} An array containing an easting and a northing.
 */
const gridReferenceToEastNorth = (gridReference) => {
  // Get the 500km tile easting and northing of the grid ref.
  const first = firstLetterToEastNorth(gridReference.charAt(0));

  // Get the 100km tile easting and northing of the grid ref.
  const second = secondLetterToEastNorth(gridReference.charAt(1));

  // Get the easting an northing for the digits of the grid ref.
  const rest = digitsEastNorth(gridReference);

  // Add all three eastings and northings together to get the final answer.
  return sumEastNorths(first, second, rest);
};

const osProjString =
  '+proj=tmerc ' + // Transverse Mercator projection
  '+lat_0=49 +lon_0=-2 ' + // True Origin
  '+k=0.9996012717 ' + // Scale Factor
  '+x_0=400000 +y_0=-100000 ' + // False Origin
  '+ellps=airy ' + // Airy Ellipsoid
  '+datum=OSGB36 ' + // OSGB36 Datum
  '+units=m ' + // Metres
  '+no_defs';

export {gridReferenceToEastNorth as gridRefToEastNorth, osProjString};
