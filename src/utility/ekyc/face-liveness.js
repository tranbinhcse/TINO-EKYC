import { Matrix3 } from "three";
import { MathUtils, Euler, Matrix4 } from "three";

function normalizeVector(v) {
  const l = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
  return [v[0] / l, v[1] / l, v[2] / l];
}

// Cross product
function crossP(v1, v2) {
  const e1 = v1[1] * v2[2] - v1[2] * v2[1];
  const e2 = v1[2] * v2[0] - v1[0] * v2[2];
  const e3 = v1[0] * v2[1] - v1[1] * v2[0];

  return [e1, e2, e3];
}

// The point returned from mediapipe facemesh is formatted as an object.
// This function convert it to an array, where x,y,z values are converted to exact coordinate value.
function convertFaceMeshResultToVector(object, width, height) {
  const vector = [object.x * width, object.y * height, object.z * width];
  return vector;
}

function getDirectionVectors(results) {
  // These points lie *almost* on same line in uv coordinates
  const p1 = convertFaceMeshResultToVector(
    results.multiFaceLandmarks[0][127],
    results.image.width,
    results.image.height
  ); // cheek
  const p2 = convertFaceMeshResultToVector(
    results.multiFaceLandmarks[0][356],
    results.image.width,
    results.image.height
  ); // cheek
  const p3 = convertFaceMeshResultToVector(
    results.multiFaceLandmarks[0][6],
    results.image.width,
    results.image.height
  ); // nose

  const vhelp = [p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]];
  const vx_d = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
  const vy_d = crossP(vhelp, vx_d);

  const vx = normalizeVector(vx_d);
  const vy = normalizeVector(vy_d);
  const vz = normalizeVector(crossP(vy_d, vx_d));

  return [vx, vy, vz];
}

// Calculate yaw, pitch, raw from faceMesh result
function calculateFaceAngle(results) {
  const [vx, vy, vz] = getDirectionVectors(results);
  const rotationMatrix3 = new Matrix3().fromArray([...vx, ...vy, ...vz]);
  const rotationMatrix4 = new Matrix4().setFromMatrix3(rotationMatrix3);
  const euler = new Euler().setFromRotationMatrix(rotationMatrix4, "ZYX");
  return {
    yaw: MathUtils.radToDeg(euler.y),
    pitch: MathUtils.radToDeg(euler.x),
    roll: MathUtils.radToDeg(euler.z),
  };
}

// Calculate euclideandean distance
// a, b are arrays
function eucDistance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

// Calculate left eye ratio to determine eye-blink
function leftEyeRatio(results) {
  const faceLandmarks = results.multiFaceLandmarks[0];
  // leftmost horizontal point of left eye
  const left = convertFaceMeshResultToVector(
    faceLandmarks[33],
    results.image.width,
    results.image.height
  );
  // rightmost horizontal point of left eye
  const right = convertFaceMeshResultToVector(
    faceLandmarks[133],
    results.image.width,
    results.image.height
  );
  // topmost vertical point of left eye
  const top = convertFaceMeshResultToVector(
    faceLandmarks[159],
    results.image.width,
    results.image.height
  );

  // bottommost vertical point of left eye
  const bottom = convertFaceMeshResultToVector(
    faceLandmarks[145],
    results.image.width,
    results.image.height
  );

  const horizontalDistance = eucDistance(left, right);
  const verticalDistance = eucDistance(top, bottom);
  return horizontalDistance / verticalDistance;
}

// Calculate right eye ratio to determine eye-blink
function rightEyeRatio(results) {
  const faceLandmarks = results.multiFaceLandmarks[0];
  // leftmost horizontal point of right eye
  const left = convertFaceMeshResultToVector(
    faceLandmarks[362],
    results.image.width,
    results.image.height
  );
  // rightmost horizontal point of right eye
  const right = convertFaceMeshResultToVector(
    faceLandmarks[263],
    results.image.width,
    results.image.height
  );
  // topmost vertical point of right eye
  const top = convertFaceMeshResultToVector(
    faceLandmarks[386],
    results.image.width,
    results.image.height
  );

  // bottommost vertical point of right eye
  const bottom = convertFaceMeshResultToVector(
    faceLandmarks[374],
    results.image.width,
    results.image.height
  );

  const horizontalDistance = eucDistance(left, right);
  const verticalDistance = eucDistance(top, bottom);
  return horizontalDistance / verticalDistance;
}

function detectClosedEye(results) {
  return (leftEyeRatio(results) + rightEyeRatio(results)) / 2 >= 7;
}

// Landmark point locations: https://raw.githubusercontent.com/tensorflow/tfjs-models/master/face-landmarks-detection/mesh_map.jpg
export function faceLiveNessCheck(results, action) {
  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    const { yaw, pitch } = calculateFaceAngle(results);
    switch (action) {
      case "forward":
        if (yaw >= -10 && yaw <= 10 && pitch >= -7 && pitch <= 7) {
          return true;
        }
        break;
      case "up":
        if (pitch >= 9) {
          return true;
        }
        break;
      case "down":
        if (pitch <= -10) {
          return true;
        }
        break;
      case "left":
        if (yaw >= 25) {
          return true;
        }
        break;
      case "right":
        if (yaw <= -25) {
          return true;
        }
        break;
      case "eye-closed":
        if (detectClosedEye(results)) {
          return true;
        }
        break;
      default:
        return false;
    }
  }
  return false;
}

// Get relative bounding box
export function getBoundingBox(results) {
  const faceLandmarks = results.multiFaceLandmarks[0];
  let x1 = Number.MAX_SAFE_INTEGER;
  let x2 = Number.MIN_SAFE_INTEGER;
  let y1 = Number.MAX_SAFE_INTEGER;
  let y2 = Number.MIN_SAFE_INTEGER;

  const width = results.image.width;
  const height = results.image.height;

  for (let i = 0; i < faceLandmarks.length; i++) {
    const landmark = faceLandmarks[i];
    x1 = Math.min(x1, landmark.x);
    x2 = Math.max(x2, landmark.x);
    y1 = Math.min(y1, landmark.y);
    y2 = Math.max(y2, landmark.y);
  }

  x1 *= width;
  x2 *= width;
  y1 *= height;
  y2 *= height;

  return { x1, x2, y1, y2 };
}
