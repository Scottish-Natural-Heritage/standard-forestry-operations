'use strict';

import Jimp from 'jimp';

/**
 * Create a 'small' version of the NatureScot logo as a favicon or for when
 * someone bookmarks the page or saves it to their smartphone's home screen.
 */
const buildIcon = async (fileName, size) => {
  const orig = await Jimp.read(fileName);
  const logo = orig.crop(0, 0, 259, 166);
  const square = logo.contain(size - 8 * 2, size - 8 * 2);
  const transparent = await new Jimp(size, size, '#ffffff00');
  const newLogo = transparent.composite(square, 8, 8);
  return newLogo;
};

/**
 * Create a padded version of the NatureScot logo for when someone shares the
 * page on facebook, twitter, whatsapp, imessage, etc.
 */
const buildSocial = async (fileName) => {
  const orig = await Jimp.read(fileName);

  const origSize = Math.max(orig.getWidth(), orig.getHeight());
  const socialHeight = origSize + 16 * 2;
  const socialWidth = Math.floor(socialHeight * 1.91);

  const white = await new Jimp(socialWidth, socialHeight, '#ffffffff');
  const newSocial = white.composite(orig, (socialWidth - origSize) / 2, (socialHeight - orig.getHeight()) / 2);
  return newSocial;
};

/**
 * Create a 'small' version of the NatureScot logo as a favicon or for when
 * someone bookmarks the page or saves it to their smartphone's home screen.
 */
async function main() {
  try {
    // This image has been copied in to place by the `assets` npm stage.
    const srcFile = './dist/naturescot-logo.png';

    // Build the social share image.
    const newSocial = await buildSocial(srcFile);
    await newSocial.writeAsync(`./dist/naturescot-opengraph-image.png`);

    // Build all the fav & home screen icons.
    for await (const size of [192, 180, 167, 152, 120]) {
      const newIcon = await buildIcon(srcFile, size);
      await newIcon.writeAsync(`./dist/icon-${size}x${size}.png`);
    }
  } catch (error) {
    console.error(error);
  }
}

main();
