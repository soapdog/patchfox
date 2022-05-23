const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const toIco = require('to-ico')
const { convert: icnsConvert } = require('@fiahfy/icns-convert')

// TODO: replace with svg, using this for now as the icon
// on mac comes out pixelated with the .svg
const image = sharp(path.resolve(__dirname, 'icon.png'))
const setupImage = sharp(path.resolve(__dirname, 'setup-icon.svg'))

const sizes = [16, 24, 32, 48, 64, 96, 128, 256]

console.log('Building Desktop Icons:')

// windows icons
buildIcons(image, sizes, createIco, 'icon')
buildIcons(setupImage, sizes, createIco, 'setup-icon')

// mac icons
buildIcons(image, [...sizes, 512, 1024], createIcns, 'icon')
buildIcons(setupImage, [...sizes, 512, 1024], createIcns, 'dmg-icon')

function makeIcon (size, image) {
  return image
    .resize(size, size)
    .png()
    .toBuffer()
}

async function buildIcons (image, sizes, createIcon, fileName) {
  await Promise
    .all(sizes.map(size => makeIcon(size, image)))
    .then(bufs => {
      createIcon(bufs, fileName)
      console.log(`- ${fileName}`)
    })
    .catch(err => console.error('Error building icons', err))
}

function createIco (bufs, fileName) {
  toIco(bufs)
    .then(buf => {
      fs.writeFileSync(path.join(__dirname, `win/${fileName}.ico`), buf)
    })
    .catch(err => console.error('createIco error:', err))
}

function createIcns (bufs, fileName) {
  icnsConvert(bufs)
    .then(data => {
      fs.writeFileSync(path.join(__dirname, `mac/${fileName}.icns`), data)
    })
    .catch(err => console.error('createIcns error: ', err))
}
