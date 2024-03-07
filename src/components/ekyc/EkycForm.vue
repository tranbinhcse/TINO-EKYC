<template>
 
  <EkycForm> 
    <template v-if="currentStep === 'ekycHelp'" >
      <help-ekyc @comfirm="handleBeginProcess" />
    </template>
    <template v-if="currentStep === 'cardFront' && !isUpload"  >
      <a-modal @cancel="handleCancelPopup" :visible="visibleModal" title="Front">
        <Suspense>
          <template #default>
            <CardDetection :open="open" @DataImage="handlecardFront"/>
          </template>
        </Suspense>
      </a-modal>
    </template>

     <template v-if="currentStep === 'cardBack' && !isUpload" >
      <a-modal @cancel="handleCancelPopup" :visible="visibleModal" title="Back">
        <Suspense>
          <template #default>
            <CardDetection v-if="!isUpload" :open="open" @DataImage="handleBackCard"/>
          </template>
        </Suspense>
      </a-modal>
    </template>

     <template v-if="currentStep === 'face'" >
      <a-modal @cancel="handleCancelPopup" :visible="visibleModal" title="Face">
        <Suspense>
          <template #default>
            <FaceDetection :open="open" @DataImage="handleFaceId"/>
          </template>
        </Suspense>
      </a-modal>
    </template>

      <a-row>
        <a-col :span="24" v-if="!isMobile" >
          
          <a-steps :current="current" size="default" :percent="60">
            <a-step v-for="item in items" :key="item.title" :title="item.title" :description="item.description"  />
          </a-steps>
          <a-divider />
        </a-col>
        

        <a-col :span="24">
          
          <a-row>
            <a-col :span="24" v-if="currentStep === 'cardFront'">
              <a-card title="Ảnh CCCD mặt trước">
                <img :src="cardimageFront" style="width: 100%" />
                <a-spin tip="Đang kiểm tra dữ liệu" v-if="isDetectingData" />
                <div class="cardimage cardimage-front" v-else>
                  <a-upload :max-count="1"  :before-upload="beforeUploadFrontCard" accept="image/png, image/jpeg" listType="picture">
                    <a-button type="primary" outlined block>
                      <unicon name="upload" width="40"/>
                      Chọn ảnh
                    </a-button>
               
                  
                  </a-upload>
                </div>
              </a-card>
            </a-col>

            <a-col :span="24" v-if="currentStep === 'cardBack'">
               <a-card title="Ảnh CCCD mặt sau">
                <img :src="cardimageBack" style="width: 100%" />
                  <a-spin tip="Đang kiểm tra dữ liệu" v-if="isDetectingData" />
                  <div class="cardimage cardimage-back" v-else>
                    <a-upload v-if="isUpload" :max-count="1"  accept="image/png, image/jpeg" listType="picture"
                      :before-upload="beforeUploadBackCard"
                    >
                    <a-button type="primary" outlined block>
                      <unicon name="upload" width="40"/>
                      Chọn ảnh 
                    </a-button>
                    </a-upload>
                  </div>
                </a-card>
            </a-col>
            <a-col  :span="24" v-if="currentStep === 'face'" >
              <a-card title="Xác thực khuôn mặt">
                <a-row :gutter="[25,25]">
                  <a-col :span="12"> <img :src="cardimageFront" style="width: 100%" /></a-col>
                  <a-col :span="12"> <img :src="cardimageBack" style="width: 100%" /></a-col>
                </a-row>
                  <a-spin tip="Đang kiểm tra dữ liệu" v-if="isDetectingData" />
                </a-card>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="24"  v-if="currentStep === 'failed'">
          <a-card>
            Lỗi.
          </a-card>
        </a-col>
        <a-col :span="24"  v-if="currentStep === 'complate'">
          <a-card>
            Cảm ơn bạn đã định danh thông tin hoàn tất.
          </a-card>
        </a-col>
      </a-row>
  </EkycForm>
</template>

<script setup>
 import { EkycForm } from './style.js'
 import { isMobile } from 'mobile-device-detect'; 

import { message } from 'ant-design-vue'
import { ref, h, defineEmits, watch} from "vue";
import CardDetection from "@/components/ekyc/CardDetection.vue";
import FaceDetection from "@/components/ekyc/FaceDetection.vue";
import HelpEkyc from "@/components/ekyc/HelpEkyc.vue";
import delay from "@/utility/ekyc/delay";
// import propTypes from "vue-types";
import { resizeImage } from "@/utility/ekyc/image-util";

import ApiFactory from '@/clientApi/ApiFactory'; 
const EkycApi = ApiFactory.get('EkycApi');

import {
  UserOutlined,
  SolutionOutlined,
  LoadingOutlined,
  SmileOutlined,
} from '@ant-design/icons-vue';

// defineProps({
//   contact_id: propTypes.init
// })
const emit = defineEmits(['UserData'])

const current = ref(0);
const items = [
  {
   
    title: 'Kiểm tra CCCD Mặt Trước',
    icon: h(UserOutlined),
  },
  {
     
    title: 'Kiểm tra CCCD Mặt Sau',
    icon: h(SolutionOutlined),
  },
  {
   
    title: 'Kiểm tra sinh trắc khuôn mặt',
    icon: h(LoadingOutlined),
  },
  {
    
    title: 'Hoàn tất kiểm tra thông tin',
    icon: h(SmileOutlined),
  },
];


 
    const cardimageFront = ref('')
    const cardimageBack = ref('')
    const currentStep = ref('cardFront')
    const visibleModal = ref(true)
    const open = ref(true)
    const requestId = 'TNG' +Date.now().toString();
    const isDetectingData = ref(false)
    const frontData = ref([]);
    const backData = ref([]);
    const isUpload = ref(true);

    const resetForm = () => {
      cardimageFront.value = '';
      cardimageBack.value = '';
      open.value = true;
      visibleModal.value = true;
      isDetectingData.value = false; 
    }
 
    const delayStep = (async() => {
      await delay(1000);
    })

    const getTokenFromURL = () => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("token") || "";
    };
 

    const handlecardFront = (DataImage) => {
      currentStep.value = "cardFront";
      cardimageFront.value = DataImage;
      visibleModal.value = false;
      isDetectingData.value = true; 

      callOcrRecognitionAPI(DataImage, 'cardFront')
        .then((response) => {
          const isDataValid = validateCardFrontData(response);
           console.log(isDataValid)
          if (isDataValid) {
            delayStep();
            currentStep.value = "cardBack";
            visibleModal.value = true;
            isDetectingData.value = false; 
          } else {      
            currentStep.value = "cardFront";
            isUpload.value = true;
            resetForm();
          } 
        })
        .catch((error) => {
          console.error("OCR recognition failed:", error);
          delayStep();
          resetForm()
        });

         
    }

    const handleBackCard = (DataImage) => {
      cardimageBack.value = DataImage;
      visibleModal.value = false;
      isDetectingData.value = true;
      currentStep.value = "cardBack";
      callOcrRecognitionAPI(DataImage, 'cardBack').then((response) => {

        console.log('response', response);

        const isDataValid = compareCardData(response);
        if (isDataValid) {
            delayStep();
            currentStep.value = "face";
            visibleModal.value = true;
          } else {      
            currentStep.value = "cardFront";
            isUpload.value = true;
            resetForm();
          }
          isDetectingData.value = false; 
      }).catch((error) => {
          console.error("OCR recognition failed:", error);
          delayStep();
          resetForm()
      })
    }

    const handleFaceId = (faceImageRef) => {
      isDetectingData.value = true;
      visibleModal.value = false;
      callFaceRecognitionAPI(faceImageRef).then((response) => {
        const isDataValid = processFaceRecognitionResponse(response);
        if (isDataValid) {
            delayStep();
            currentStep.value = "complate";
            emit('UserData', {
              request_id: requestId,
              frontData: frontData.value,
              backData: backData.value,
              faceData: response?.data,
              frontImage: cardimageFront.value,
              backImage: cardimageBack.value,
              faceImage: faceImageRef,
            })
          } else {      
            currentStep.value = "faield";
            resetForm();
          }
          isDetectingData.value = false; 
      }).catch((error) => {
          console.error("OCR recognition failed:", error);
          delayStep();
          resetForm()
      })
    }

    // const handleBegin = () => {
    //   currentStep.value = "ekycHelp";
    //   isUpload.value = false
    //   resetForm()
    // }

    const handleBeginProcess = () => {
      currentStep.value = "cardFront";
    }

    const handleCancelPopup = (async() => {
        isUpload.value = true
        open.value = false
        visibleModal.value = false
        await delay(1000);
        currentStep.value = "cardFront";
    })



    const callOcrRecognitionAPI = (imageData, type) => {
      const formData = {'request_id': requestId,  "image": imageData, "type": type};

      // const formData = new FormData();
      // formData.append('request_id', requestId);
      // formData.append('image', imageData);
      // formData.append('type', type);

      const headers = new Headers();
      headers.append('Content-Type', 'application/json'); // Set JSON header


      return fetch('/api/ekyc/ocr/recognition', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('API request failed');
          }
          return response.json();
        })
        .then(data => {
      
          return data;
        })
        .catch(error => {
          // Xử lý lỗi
          console.error(error);
        });
        
      
      // return EkycApi.getOcrData(formData);
    }


    // const callFaceRecognitionAPI = (imageData) => {
    //   const formData = {
    //     'contact_id': id, 
    //     'request_id': requestId, 
    //     'frontData': frontData.value,
    //     'backData': backData.value,
    //     "image_live": imageData, 
    //     "image_card": cardimageFront.value,
    //     "image_card_back": cardimageBack.value
    //   };
    //   return EkycApi.getFaceidData(formData);
    // }
    
    const callFaceRecognitionAPI = (imageData) => {
      const token = ref(getTokenFromURL());

      const formData = {
        'request_id': requestId, 
        "image_live": imageData,
        "token": token.value,
      };

      console.log(frontData.value);

      // const formData = new FormData();
      // formData.append('request_id', requestId);
      // // formData.append('frontData', JSON.stringify(frontData.value));
      // // formData.append('backData', JSON.stringify(backData.value));
      // formData.append('image_live', imageData);
      // // formData.append('image_card', cardimageFront.value);
      // // formData.append('image_card_back', cardimageBack.value);

      const headers = new Headers();
      headers.append('Content-Type', 'application/json'); // Set JSON header


      return fetch('/api/ekyc/faceid/verification', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('API request failed');
          }
          return response.json();
        })
        .then(data => {
          // Xử lý dữ liệu trả về
          return data;
        })
        .catch(error => {
          // Xử lý lỗi
          console.error(error);
        });

      // return EkycApi.getFaceidData(formData);
    }


    const validateCardFrontData = (data) => {
      const dataCheck = EkycApi.ocrFrontCardChecking(data);
      frontData.value = data
  

      if(dataCheck.success){
          message.info(dataCheck.message)
          return dataCheck.success
      } else {
        message.info(dataCheck.message)
        resetForm();
        return false
      }
    }

    const compareCardData = (data) => {
      const dataCheck = EkycApi.ocrBackCardChecking(data, frontData.value);
      backData.value = data
      if(dataCheck.success){
          message.info(dataCheck.message)
          return dataCheck.success
      } else {
        message.info(dataCheck.message)
        resetForm();

      }
    }

    const processFaceRecognitionResponse = (data) => {
      const dataCheck = EkycApi.faceVerificationChecking(data)
      message.info(dataCheck.message);
      return dataCheck.success
    }

 
    // const handleRemove = () => {
      
    // }

    const beforeUploadFrontCard = (file) => {
          isUpload.value = true; 
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = (async() => {
            var img = new Image;
            img.src = reader.result;

            let resizedImageData = await resizeImage(reader.result);
            cardimageFront.value =  resizedImageData
            handlecardFront(resizedImageData);
          })
       
          return false;
    }

    const beforeUploadBackCard = (file) => {
          isUpload.value = true; 
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = (async() => {
            var img = new Image;
            img.src = reader.result;
            let resizedImageData = await resizeImage(reader.result);
            cardimageBack.value =  resizedImageData
            handleBackCard(resizedImageData);
          })
          return false;
    }

    watch(currentStep, (newstep) => {

      if (newstep == "cardFront") {
        current.value = 0
      }
      if (newstep == "cardBack") {
        current.value = 1
      }
      if (newstep == "face") {
        current.value = 2
      }
      if (newstep == "complate") {
        current.value = 3
      }
    })
 
</script>
