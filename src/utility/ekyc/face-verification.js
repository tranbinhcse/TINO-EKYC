// import axios from "axios";

// export async function getFaceVerificationData(cardImage, faceImage) {
//   const res = await axios({
//     method: "post",
//     url: process.env.REACT_APP_API_FACEID_URL,
//     headers: {
//       key: process.env.REACT_APP_API_KEY,
//     },
//     data: {
//       image_card: cardImage,
//       image_live: faceImage,
//     },
//   });

//   return res.data;
// }

// export async function faceVerificationChecking(faceVerificationData) {
//   if (faceVerificationData.message.error_code.startsWith("ERR")) {
//     return {
//       success: false,
//       message: faceVerificationData.message.error_message,
//     };
//   }

//   if (faceVerificationData.face_anti_spoof_status.status !== "REAL") {
//     return {
//       success: false,
//       message:
//         "Ảnh mặt có thể được chụp lại từ ảnh giấy hoặc màn hình.",
//     };
//   }

//   // Check if there is a warning message
//   if (faceVerificationData.message.error_code !== "000") {
//     return {
//       success: true,
//       message: faceVerificationData.message.error_message,
//     };
//   }

//   return { success: true, message: "OK." };
// }
