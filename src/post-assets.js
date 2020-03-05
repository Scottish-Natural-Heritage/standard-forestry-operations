'use strict';

import Jimp from 'jimp';

async function main() {
  try {
    await (await Jimp.read('./dist/naturescot-logo.png')).resize(192, 192).writeAsync('./dist/icon-192x192.png');
  } catch (error) {
    console.error(error);
  }
}

main();
