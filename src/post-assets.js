'use strict';

import Jimp from 'jimp';

/**
 * Create a 'small' version of the NatureScot logo as a favicon or for when
 * someone bookmarks the page or saves it to their smartphone's home screen.
 */
async function main() {
  try {
    await (await Jimp.read('./dist/naturescot-logo.png')).resize(192, 192).writeAsync('./dist/icon-192x192.png');
  } catch (error) {
    console.error(error);
  }
}

main();
