// import axios from "axios";
// import cleanAccents from "./clean-accents";

// export async function getOcrData(imageDataUrl) {
//   console.log(process.env.REACT_APP_API_OCR_URL);
//   const res = await axios({
//     method: "post",
//     url: process.env.REACT_APP_API_OCR_URL,
//     headers: {
//       key: process.env.REACT_APP_API_KEY,
//     },
//     data: {
//       image: imageDataUrl,
//     },
//   });
//   return res.data;
// }

// export async function convertAddressOcrData(ocrData) {
//     console.log(ocrData);
//     ocrData.province_code = ocrData.province;
//     ocrData.district_code = ocrData.district;
//     ocrData.precinct_code = ocrData.precinct;
// //  const res = await axios({
// //    method: "post",
// //    url: process.env.REACT_APP_API_ADDR_CONVERT_URL,
// //    headers: {
// //      key: process.env.REACT_APP_API_KEY,
// //    },
// //    data: {
// //      province: ocrData.province,
// //      district: ocrData.district,
// //      precinct: ocrData.precinct,
// //    },
// //  });
// //  ocrData.province_code = res.data.province;
// //  ocrData.district_code = res.data.district;
// //  ocrData.precinct_code = res.data.precinct;
// }

// export const idLogicErrorMessage = {
//   "OK": "Không có lỗi logic",
//   "ID is expired": "Giấy tờ đã hết hạn.",
//   "Not match province code": "Sai mã tỉnh.",
//   "Not match sex code":
//     "Giới tính trên giấy tờ và trong số ID không trùng khớp.",
//   "Not match year code":
//     "Năm sinh trên giấy tờ và trong số ID không trùng khớp.",
//   "Expiry subtract birthday not good":
//     "Ngày tháng năm sinh và ngày tháng hết hạn không hợp lệ.",
//   "ID can be fake": "Giấy tờ có thể đang bị giả mạo.",
// };

// export const idCheckErrorMessage = {
//   REAL: "Giấy tờ thật",
//   FAKE: "Giấy tờ giả mạo.",
//   CORNER: "Giấy tờ bị mất góc.",
//   PUNCH: "Giấy tờ bị đục lỗ.",
//   BW: "Giấy tờ photocopy đen trắng.",
// };

// export async function ocrFrontCardChecking(ocrData) {
//   if (ocrData.result_code === 200) {
//     if (ocrData.is_full !== 1 && process.env.REACT_APP_CHECK_FULL === "1") {
//       return { success: false, message: "Hình ảnh CMT không đầy đủ." };
//     }
//     if (ocrData.id_logic !== "1") {
//       return {
//         success: false,
//         message: idLogicErrorMessage[ocrData.id_logic_message]
//           ? idLogicErrorMessage[ocrData.id_logic_message]
//           : ocrData.id_logic_message,
//       };
//     }
//     if (ocrData.id_check !== "REAL") {
//       return {
//         success: false,
//         message: idCheckErrorMessage[ocrData.id_check]
//           ? idCheckErrorMessage[ocrData.id_check]
//           : ocrData.id_check,
//       };
//     }
//     if (ocrData.id_type !== "0") {
//       return { success: false, message: "Ảnh CMT mặt trước không hợp lệ." };
//     }

//     return { success: true, message: "OK." };
//   }

//   if (ocrData.result_code === 501) {
//     return {
//       success: false,
//       message:
//         "License chưa được kích hoạt. Liên hệ với VNNIC để kích hoạt license.",
//     };
//   }

//   if (ocrData.result_code === 401) {
//     return { success: false, message: "Sai api-key." };
//   }

//   if (ocrData.result_code === 402) {
//     return {
//       success: false,
//       message: "Vùng ID ảnh bị mờ hoặc bị che mất. Chụp lại ảnh rõ nét hơn.",
//     };
//   }

//   if (ocrData.result_code === 201) {
//     return { success: false, message: "Sai định dạng passport." };
//   }

//   return {
//     success: false,
//     message:
//       "Không tìm được giấy tờ trong ảnh. Nếu bạn đã làm đúng theo hướng dẫn, hãy liên hệ với VNNIC để được hỗ trợ.",
//   };
// }

// export async function ocrBackCardChecking(backCardOcrData, frontCardOcrData) {
//   if (backCardOcrData.result_code === 200) {
//     if (backCardOcrData.is_full !== 1 && process.env.REACT_APP_CHECK_FULL === "1") {
//       return { success: false, message: "Hình ảnh CMT không đầy đủ." };
//     }
//     if (backCardOcrData.id_logic !== "1") {
//       return {
//         success: false,
//         message: idLogicErrorMessage[backCardOcrData.id_logic_message]
//           ? idLogicErrorMessage[backCardOcrData.id_logic_message]
//           : backCardOcrData.id_logic_message,
//       };
//     }
//     if (backCardOcrData.id_check !== "REAL") {
//       return {
//         success: false,
//         message: idCheckErrorMessage[backCardOcrData.id_check]
//           ? idCheckErrorMessage[backCardOcrData.id_check]
//           : backCardOcrData.id_check,
//       };
//     }
//     if (backCardOcrData.id_type !== "1") {
//       return { success: false, message: "Ảnh CMT mặt sau không hợp lệ." };
//     }

//     // Trường document mặt trước và mặt sau phải giống nhau
//     // hoặc cả hai thuộc phải thuộc một trong hai loại [NEW ID, CCCD]
//     let allowedDocumentTypes = ["NEW ID", "CCCD"];
//     if (backCardOcrData.document !== frontCardOcrData.document) {
//       if (
//         !allowedDocumentTypes.includes(backCardOcrData.document) ||
//         !allowedDocumentTypes.includes(frontCardOcrData.document)
//       ) {
//         return {
//           success: false,
//           message: "CMT mặt trước và mặt sau không cùng loại.",
//         };
//       }
//     }

//     if (backCardOcrData.document === "CHIP ID") {
//       if (backCardOcrData.id !== frontCardOcrData.id) {
//         return {
//           success: false,
//           message: "không trùng khớp số id",
//         };
//       }
//       if (backCardOcrData.name !== cleanAccents(frontCardOcrData.name)) {
//         return {
//           success: false,
//           message: "không trùng khớp tên",
//         };
//       }

//       if (backCardOcrData.birthday !== frontCardOcrData.birthday) {
//         return {
//           success: false,
//           message: "không trùng khớp ngày sinh",
//         };
//       }
//     }

//     return { success: true, message: "OK." };
//   }

//   if (backCardOcrData.result_code === 501) {
//     return {
//       success: false,
//       message:
//         "License chưa được kích hoạt. Liên hệ với VNNIC để kích hoạt license.",
//     };
//   }

//   if (backCardOcrData.result_code === 401) {
//     return { success: false, message: "Sai api-key." };
//   }

//   if (backCardOcrData.result_code === 402) {
//     return {
//       success: false,
//       message: "Vùng ID ảnh bị mờ hoặc bị che mất. Chụp lại ảnh rõ nét hơn.",
//     };
//   }

//   if (backCardOcrData.result_code === 201) {
//     return { success: false, message: "Sai định dạng passport." };
//   }

//   return {
//     success: false,
//     message:
//       "Không tìm được giấy tờ trong ảnh. Nếu bạn đã làm đúng theo hướng dẫn, hãy liên hệ với VNNIC để được hỗ trợ.",
//   };
// }
