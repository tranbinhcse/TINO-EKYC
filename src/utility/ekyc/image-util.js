// An async function that resize the image

import loadImage from "blueimp-load-image/js";

// Resize
export async function resizeImage(imageDataUrl) {
  let parsedData = await loadImage(imageDataUrl, {
    maxWidth: process.env.VUE_APP_IMAGE_MAX_WIDTH,
    maxHeight: process.env.VUE_APP_IMAGE_MAX_HEIGHT,
    orientation: true,
    canvas: true,
    meta: true,
  });
  return parsedData.image.toDataURL("image/jpeg");
}

// Crop
export async function cropImage(
  imageDataUrl,
  width,
  height,
  cropWidth,
  cropHeight
) {
  let parsedData = await loadImage(imageDataUrl, {
    maxWidth: process.env.VUE_APP_IMAGE_MAX_WIDTH,
    maxHeight: process.env.VUE_APP_IMAGE_MAX_HEIGHT,
    sourceWidth: cropWidth,
    sourceHeight: cropHeight,
    top: (height - cropHeight) / 2,
    left: (width - cropWidth) / 2,
    contain: true,
    orientation: true,
    canvas: true,
    meta: true,
  });
  return parsedData.image.toDataURL("image/jpeg");
}

export function imageDataToDataUrl(imageData) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.95);
}

export function calculateSharpness(cv, imageData) {
  if (!cv) {
    alert("openCV is not loaded");
    return;
  }

  let image = cv.matFromImageData(imageData);
  let gray = new cv.Mat();
  let laplacian_mat = new cv.Mat();
  cv.cvtColor(image, gray, cv.COLOR_RGBA2GRAY);
  cv.Laplacian(gray, laplacian_mat, cv.CV_64F, 1, 1, 0, cv.BORDER_DEFAULT);
  let myMean = new cv.Mat(1, 4, cv.CV_64F);
  let myStddev = new cv.Mat(1, 4, cv.CV_64F);
  cv.meanStdDev(laplacian_mat, myMean, myStddev);

  let sharpness = myStddev.doubleAt(0, 0);

  image.delete();
  gray.delete();
  laplacian_mat.delete();
  myMean.delete();
  myStddev.delete();

  return (sharpness * sharpness) / 2;
}

// Get the image from canvas bounded by x1, y1, x2, y2
// Then resize so that the longer size of the image is equal to longEdge
// Return a new canvas that hold the new image
export function cropAndNormalize(canvas, longEdge, x1, y1, x2, y2) {
  const normCanvas = document.createElement("canvas");
  if (canvas.width > canvas.height) {
    normCanvas.width = longEdge;
    normCanvas.height = canvas.height * (longEdge / canvas.width);
  } else {
    normCanvas.height = longEdge;
    normCanvas.width = canvas.width * (longEdge / canvas.height);
  }

  normCanvas
    .getContext("2d")
    .drawImage(
      canvas,
      x1,
      y1,
      x2 - x1,
      y2 - y1,
      0,
      0,
      normCanvas.width,
      normCanvas.height
    );

  return normCanvas;
}
