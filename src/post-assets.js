import {Jimp} from 'jimp';

/**
 * Create a 'small' version of the NatureScot logo as a favicon or for when
 * someone bookmarks the page or saves it to their smartphone's home screen.
 * @param {any} fileName The file name of the logo file.
 * @param {any} size The size of the logo file.
 */
const buildIcon = async (fileName, size) => {
  const orig = await Jimp.read(fileName);
  const logo = orig.crop({x: 0, y: 0, w: 259, h: 166});
  const square = logo.contain({w: size - 8 * 2, h: size - 8 * 2});
  const transparent = new Jimp({width: size, height: size, color: '#ffffff00'});
  const newLogo = transparent.composite(square, 8, 8);
  return newLogo;
};

/**
 * Create a padded version of the NatureScot logo for when someone shares the
 * page on facebook, twitter, whatsapp, imessage, etc.
 * @param {any} fileName The file name of the logo file.
 */
const buildSocial = async (fileName) => {
  const orig = await Jimp.read(fileName);

  const origSize = Math.max(orig.width, orig.height);
  const socialHeight = origSize + 16 * 2;
  const socialWidth = Math.floor(socialHeight * 1.91);

  const white = new Jimp({width: socialWidth, height: socialHeight, color: '#ffffffff'});
  const newSocial = white.composite(orig, (socialWidth - origSize) / 2, (socialHeight - orig.height) / 2);
  return newSocial;
};

/**
 * Create a 'small' version of the NatureScot logo as a favicon or for when
 * someone bookmarks the page or saves it to their smartphone's home screen.
 */
async function main() {
  try {
    // This image has been copied in to place by the `assets` npm stage.
    const sourceFile = './dist/naturescot-logo.png';

    // Build the social share image.
    const newSocial = await buildSocial(sourceFile);
    await newSocial.write(`./dist/naturescot-opengraph-image.png`);

    // Build all the fav & home screen icons.
    for await (const size of [192, 180, 167, 152, 120]) {
      const newIcon = await buildIcon(sourceFile, size);
      await newIcon.write(`./dist/icon-${size}x${size}.png`);
    }
  } catch (error) {
    console.error(error);
  }
}

await main();
