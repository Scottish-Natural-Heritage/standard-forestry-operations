/**
 * Get the easting and northing of the bottom-left corner of the first letter
 * (500km tile) of a grid reference.
 *
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
    T: [500000, 0],
    N: [0, 500000],
    O: [500000, 500000],
    H: [0, 1000000]
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
 *
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
    W: [100000, 0],
    X: [200000, 0],
    Y: [300000, 0],
    Z: [400000, 0],

    Q: [0, 100000],
    R: [100000, 100000],
    S: [200000, 100000],
    T: [300000, 100000],
    U: [400000, 100000],

    L: [0, 200000],
    M: [100000, 200000],
    N: [200000, 200000],
    O: [300000, 200000],
    P: [400000, 200000],

    F: [0, 300000],
    G: [100000, 300000],
    H: [200000, 300000],
    J: [300000, 300000],
    K: [400000, 300000],

    A: [0, 400000],
    B: [100000, 400000],
    C: [200000, 400000],
    D: [300000, 400000],
    E: [400000, 400000]
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
 *
 * @param {string} gridRef A grid reference.
 * @returns {number[]} An array containing an easting and a northing.
 */
const digitsEastNorth = (gridRef) => {
  // Check we've got something between NH64 and NH6380644032 as input.
  if (gridRef === undefined || gridRef.length < 4 || gridRef.length > 12 || gridRef.length % 2 !== 0) {
    return undefined;
  }

  // Strip the letters from the front of the grid ref, keeping the digits.
  const nonLetters = gridRef.slice(2);

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
    return [east * 10000, north * 10000];
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
 *
 * @param  {...number[]} eastNorths A number of arrays, each containing an easting and
 * a northing.
 * @returns {number[]} An array containing an easting and a northing.
 */
const sumEastNorths = (...eastNorths) => {
  const hasAnInvalidEastNorth = eastNorths.reduce((foundInvalid, eastNorth) => {
    return foundInvalid || eastNorth === undefined || eastNorth.length !== 2;
  }, false);

  if (hasAnInvalidEastNorth) {
    return undefined;
  }

  return eastNorths.reduce(
    (sum, eastNorth) => {
      return [sum[0] + eastNorth[0], sum[1] + eastNorth[1]];
    },
    [0, 0]
  );
};

/**
 * Convert an OS Grid Reference to an array containing its easting and northing.
 *
 * @param {string} gridRef An OS Grid Reference, eg. NH63804403.
 * @returns {number[]} An array containing an easting and a northing.
 */
const gridRefToEastNorth = (gridRef) => {
  // Get the 500km tile easting and northing of the grid ref.
  const first = firstLetterToEastNorth(gridRef.charAt(0));

  // Get the 100km tile easting and northing of the grid ref.
  const second = secondLetterToEastNorth(gridRef.charAt(1));

  // Get the easting an northing for the digits of the grid ref.
  const rest = digitsEastNorth(gridRef);

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

export {gridRefToEastNorth, osProjString};
