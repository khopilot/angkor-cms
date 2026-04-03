globalThis.process ??= {};
globalThis.process.env ??= {};
import { j } from "./index_6RQ4jN5M.mjs";
function rgbaPixelsToBmp(pixels, width, height) {
  const bytesPerPixel = 3;
  const padding = (4 - width * bytesPerPixel % 4) % 4;
  const bmpPixels = new Uint8Array((width * bytesPerPixel + padding) * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const j2 = (height - y - 1) * (width * bytesPerPixel + padding) + x * bytesPerPixel;
      bmpPixels[j2] = pixels[i + 2];
      bmpPixels[j2 + 1] = pixels[i + 1];
      bmpPixels[j2 + 2] = pixels[i];
    }
  }
  const header = new Uint8Array([
    66,
    77,
    // magic
    54 + bmpPixels.length,
    4,
    0,
    0,
    // size in bytes
    0,
    0,
    // app data
    0,
    0,
    // app data
    54,
    0,
    0,
    0,
    // start of data offset
    40,
    0,
    0,
    0,
    // info hdrlen
    width & 255,
    width >> 8 & 255,
    width >> 16 & 255,
    width >> 24 & 255,
    // width
    height & 255,
    height >> 8 & 255,
    height >> 16 & 255,
    height >> 24 & 255,
    // height
    1,
    0,
    // num color planes
    24,
    0,
    // bits per pixel
    0,
    0,
    0,
    0,
    // compression is none
    bmpPixels.length,
    0,
    0,
    0,
    // image bits size
    19,
    11,
    0,
    0,
    // horz resoluition in pixel / m
    19,
    11,
    0,
    0,
    // vert resolutions (0x03C3 = 96 dpi, 0x0B13 = 72 dpi)
    0,
    0,
    0,
    0,
    // #colors in palette
    0,
    0,
    0,
    0
    // #important colors
  ]);
  const fullArr = new Uint8Array(header.length + bmpPixels.length);
  fullArr.set(header);
  fullArr.set(bmpPixels, header.length);
  return fullArr;
}
function imageDataToDataURI(data, mimeType) {
  const base64 = btoa(String.fromCharCode(...data));
  return `data:${mimeType};base64,${base64}`;
}
function blurhashToDataUri(blurhash, width = 8, height = 8) {
  const pixels = j(blurhash, width, height);
  const data = rgbaPixelsToBmp(pixels, width, height);
  return imageDataToDataURI(data, "image/bmp");
}
function blurhashToImageCssString(blurhash, width = 8, height = 8) {
  return `background: url("${blurhashToDataUri(
    blurhash,
    width,
    height
  )}") cover`;
}
export {
  blurhashToDataUri,
  blurhashToImageCssString,
  imageDataToDataURI,
  rgbaPixelsToBmp
};
