// import { ClientApi } from '../DataApi';
import cleanAccents from "@/utility/ekyc/clean-accents";

const idCheckErrorMessage = {
    REAL: "Giấy tờ thật",
    FAKE: "Giấy tờ giả mạo.",
    CORNER: "Giấy tờ bị mất góc.",
    PUNCH: "Giấy tờ bị đục lỗ.",
    BW: "Giấy tờ photocopy đen trắng.",
}


const idLogicErrorMessage = {
    "OK": "Không có lỗi logic",
    "ID is expired": "Giấy tờ đã hết hạn.",
    "Not match province code": "Sai mã tỉnh.",
    "Not match sex code":
      "Giới tính trên giấy tờ và trong số ID không trùng khớp.",
    "Not match year code":
      "Năm sinh trên giấy tờ và trong số ID không trùng khớp.",
    "Expiry subtract birthday not good":
      "Ngày tháng năm sinh và ngày tháng hết hạn không hợp lệ.",
    "ID can be fake": "Giấy tờ có thể đang bị giả mạo.",
}



export default {

    // getOcrData (imageData) {
    //     return ClientApi.post(`/ekyc/ocr/recognition`, imageData);
    // },   
   
    // getFaceidData (imageData) {
    //     return ClientApi.post(`/ekyc/faceid/verification`, imageData);
    // },    


    convertAddressOcrData(ocrData) {
        console.log(ocrData);
        ocrData.province_code = ocrData.province;
        ocrData.district_code = ocrData.district;
        ocrData.precinct_code = ocrData.precinct;
    },



    ocrFrontCardChecking( ocrData ) {
      console.log(ocrData)
      if(ocrData){
        if (ocrData.result_code === 200) {
          if (ocrData.is_full !== 1 && process.env.VUE_APP_CHECK_FULL === "1") {
            return { success: false, message: "Hình ảnh CMT không đầy đủ." };
          }
          if (ocrData.id_logic !== "1") {
            return {
              success: false,
              message: idLogicErrorMessage[ocrData.id_logic_message]
                ? idLogicErrorMessage[ocrData.id_logic_message]
                : ocrData.id_logic_message,
            };
          }
          if (ocrData.id_check !== "REAL") {
            return {
              success: false,
              message: idCheckErrorMessage[ocrData.id_check]
                ? idCheckErrorMessage[ocrData.id_check]
                : ocrData.id_check,
            };
          }
          if (ocrData.id_type !== "0") {
            return { success: false, message: "Ảnh CMT mặt trước không hợp lệ." };
          }
      
          return { success: true, message: "Đã kiểm tra xong ảnh CCCD mặt trước." };
        }
      } else {
        return {
          success: false,
          message:
            "Đã có lỗi xảy ra vui lòng thử lại.",
        };
      }
      
        if (ocrData.result_code === 501) {
          return {
            success: false,
            message:
              "License chưa được kích hoạt. Liên hệ với VNNIC để kích hoạt license.",
          };
        }
      
        if (ocrData.result_code === 401) {
          return { success: false, message: "Sai api-key." };
        }
      
        if (ocrData.result_code === 402) {
          return {
            success: false,
            message: "Vùng ID ảnh bị mờ hoặc bị che mất. Chụp lại ảnh rõ nét hơn.",
          };
        }
      
        if (ocrData.result_code === 201) {
          return { success: false, message: "Sai định dạng passport." };
        }
      
        return {
          success: false,
          message:
            "Không thể phân tích giấy tờ trong ảnh. Nếu bạn đã làm đúng theo hướng dẫn, hãy liên hệ với chúng tôi để được hỗ trợ.",
        };
      },
      
      ocrBackCardChecking(backCardOcrData, frontCardOcrData) {
        if(backCardOcrData){
          if (backCardOcrData.result_code === 200) {
            if (backCardOcrData.is_full !== 1 && process.env.VUE_APP_CHECK_FULL === "1") {
              return { success: false, message: "Hình ảnh CMT không đầy đủ." };
            }
            if (backCardOcrData.id_logic !== "1") {
              return {
                success: false,
                message: idLogicErrorMessage[backCardOcrData.id_logic_message]
                  ? idLogicErrorMessage[backCardOcrData.id_logic_message]
                  : backCardOcrData.id_logic_message,
              };
            }
            if (backCardOcrData.id_check !== "REAL") {
              return {
                success: false,
                message: idCheckErrorMessage[backCardOcrData.id_check]
                  ? idCheckErrorMessage[backCardOcrData.id_check]
                  : backCardOcrData.id_check,
              };
            }
            if (backCardOcrData.id_type !== "1") {
              return { success: false, message: "Ảnh CMT mặt sau không hợp lệ." };
            }
        
            // Trường document mặt trước và mặt sau phải giống nhau
            // hoặc cả hai thuộc phải thuộc một trong hai loại [NEW ID, CCCD]
            let allowedDocumentTypes = ["NEW ID", "CCCD"];
            if (backCardOcrData.document !== frontCardOcrData.document) {
              if (
                !allowedDocumentTypes.includes(backCardOcrData.document) ||
                !allowedDocumentTypes.includes(frontCardOcrData.document)
              ) {
                return {
                  success: false,
                  message: "CMT mặt trước và mặt sau không cùng loại.",
                };
              }
            }
        
            if (backCardOcrData.document === "CHIP ID") {
              if (backCardOcrData.id !== frontCardOcrData.id) {
                return {
                  success: false,
                  message: "không trùng khớp số id",
                };
              }
              if (backCardOcrData.name !== cleanAccents(frontCardOcrData.name)) {
                return {
                  success: false,
                  message: "không trùng khớp tên",
                };
              }
        
              if (backCardOcrData.birthday !== frontCardOcrData.birthday) {
                return {
                  success: false,
                  message: "không trùng khớp ngày sinh",
                };
              }
            }
        
            return { success: true, message: "Đã kiểm tra xong ảnh CCCD mặt sau." };
          }
     
      
        if (backCardOcrData.result_code === 501) {
          return {
            success: false,
            message:
              "License chưa được kích hoạt. Liên hệ với VNNIC để kích hoạt license.",
          };
        }
      
        if (backCardOcrData.result_code === 401) {
          return { success: false, message: "Sai api-key." };
        }
      
        if (backCardOcrData.result_code === 402) {
          return {
            success: false,
            message: "Vùng ID ảnh bị mờ hoặc bị che mất. Chụp lại ảnh rõ nét hơn.",
          };
        }
      
        if (backCardOcrData.result_code === 201) {
          return { success: false, message: "Sai định dạng passport." };
        }
      
        return {
          success: false,
          message:
            "Không thể phân tích giấy tờ trong ảnh. Nếu bạn đã làm đúng theo hướng dẫn, hãy liên hệ với chúng tôi để được hỗ trợ.",
        };
      } else {
        return {
          success: false,
          message:
            "Có lỗi xảy ra, vui lòng thử lại.",
        };
      }

      },
      



    // getFaceVerificationData (cardImage, faceImage) {
    //     return ClientApi.post(`/ekyc/ocr/recognition`, { cardImage, faceImage });
    // },  


    faceVerificationChecking(faceVerificationData) {
        if(faceVerificationData.error){
          return { success: false, message: faceVerificationData.error};
        }
        return { success: true, message: "OK." };
    }


}