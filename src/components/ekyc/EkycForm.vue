<template>
  <div
    :style="{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: `${width}px`,
      height: `${height}px`,
    }"
    v-if="isDetectingData"
  >
    <a-spin
      tip="Đang kiểm tra dữ liệu"
      :class="{ 'custom-spin': true }"
      style="position: absolute"
    />
  </div>
  <EkycForm>
    <template v-if="currentStep === 'ekycHelp'">
      <help-ekyc @comfirm="handleBeginProcess" />
    </template>
    <template v-if="currentStep === 'cardFront' && !isUpload">
      <a-modal
        @cancel="handleCancelPopup"
        :visible="visibleModal"
        title="Front"
      >
        <Suspense>
          <template #default>
            <CardDetection :open="open" @DataImage="handleCardFront" />
          </template>
        </Suspense>
      </a-modal>
    </template>

    <template v-if="currentStep === 'cardBack' && !isUpload">
      <a-modal @cancel="handleCancelPopup" :visible="visibleModal" title="Back">
        <Suspense>
          <template #default>
            <CardDetection
              v-if="!isUpload"
              :open="open"
              @DataImage="handleBackCard"
            />
          </template>
        </Suspense>
      </a-modal>
    </template>

    <a-row>
      <a-col :span="32" v-if="!isMobile && currentStep != 'complete'">
        <a-steps :current="current">
          <a-step
            v-for="item in items"
            :key="item.title"
            :title="item.title"
            :description="item.description"
          />
        </a-steps>
        <a-divider />
      </a-col>
      <a-col :span="24">
        <h3 style="text-align: center">
          XÁC THỰC MỘT LẦN, AN TOÀN MÃI MÃI, KHÔNG LO MẤT TÊN MIỀN
        </h3>
        <a-divider />
      </a-col>

      <a-col :span="24">
        <a-row>
          <a-col :span="24" v-if="currentStep === 'cardFront'">
            <a-card title="CCCD mặt trước">
              <div v-if="isMobile">
                <video
                  ref="video"
                  id="video"
                  autoplay
                  playsinline
                  webkit-playsinline
                  :style="{ width: `${width - 64}px`, height: '250px' }"
                />
                <canvas ref="canvas" id="canvas" style="display: none" />
                <a-button @click="handleCapture" type="primary" outlined block>
                  <unicon name="upload" width="40" />
                  Chụp CCCD mặt trước
                </a-button>
              </div>
              <div class="cardimage cardimage-front" v-else>
                <a-upload
                  :max-count="1"
                  :before-upload="beforeUploadFrontCard"
                  accept="image/png, image/jpeg"
                  listType="picture"
                  v-if="!frontOK && !isMobile"
                >
                  <a-button type="primary" outlined block>
                    <unicon name="upload" width="40" />
                    Chọn CCCD mặt trước
                  </a-button>
                </a-upload>
              </div>
            </a-card>
          </a-col>

          <a-col :span="24" v-if="currentStep === 'cardBack'">
            <a-card title="CCCD mặt sau">
              <div v-if="isMobile">
                <video
                  ref="video"
                  id="video"
                  autoplay
                  playsinline
                  webkit-playsinline
                  :style="{ width: `${width - 64}px`, height: '250px' }"
                />
                <canvas ref="canvas" id="canvas" style="display: none" />
                <a-button @click="handleCapture" type="primary" outlined block>
                  <unicon name="upload" width="40" />
                  Chụp CCCD mặt sau
                </a-button>
              </div>
              <div class="cardimage cardimage-back" v-else>
                <a-upload
                  v-if="!backOK"
                  :max-count="1"
                  accept="image/png, image/jpeg"
                  listType="picture"
                  :before-upload="beforeUploadBackCard"
                >
                  <!-- <a-button type="primary" outlined block v-if="isMobile">
                    <unicon name="upload" width="40" />
                    Chụp CCCD mặt sau
                  </a-button> -->
                  <a-button type="primary" outlined block>
                    <unicon name="upload" width="40" />
                    Chọn CCCD mặt sau
                  </a-button>
                </a-upload>
              </div>
            </a-card>
          </a-col>
          <a-col
            :span="24"
            v-if="currentStep === 'cardFront' || currentStep === 'cardBack'"
          >
            <div class="khungcmnd">
              <strong>Lưu ý khi tải lên hình ảnh CCCD của&nbsp;bạn:</strong>
              <div class="group_cmnd truoc">
                <div class="cmnd cmnd_1 ok">Hợp lệ</div>
                <div class="cmnd cmnd_2 er">Không bị cắt</div>
                <div class="cmnd cmnd_3 er">Không mờ</div>
                <div class="cmnd cmnd_4 er">Không bị lóa</div>
              </div>
            </div>
          </a-col>
          <a-col :span="24" v-if="currentStep === 'face'">
            <a-card title="Xác thực khuôn mặt">
              <template v-if="currentStep === 'face'">
                <a-card>
                  <Suspense>
                    <template #default>
                      <FaceDetection :open="open" @DataImage="handleFaceId" />
                    </template>
                  </Suspense>
                </a-card>
              </template>
            </a-card>
          </a-col>
        </a-row>
      </a-col>

      <a-col :span="24" v-if="currentStep === 'failed'">
        <a-card> Lỗi. </a-card>
      </a-col>
      <a-col :span="24" v-if="currentStep === 'complete'">
        <a-card>
          <img
            src="@/assets/ekyc-complete.webp"
            alt=""
            style="max-width: 150px"
          />
          <h1>Cảm ơn bạn đã định danh thông tin hoàn tất.</h1>
          <p>
            Hồ sơ tên miền của bạn sẽ được xử lý và hoàn tất trong 3-5 phút tới.
          </p>
        </a-card>
      </a-col>
    </a-row>
    <a-row v-if="currentStep != 'complete'">
      <a-col>
        <p style="color: red">
          (*) Vui lòng sử dụng thiết bị có camera/webcam để tiến hành xác thực
          (eKYC).
        </p>

        <a-button type="secondary" @click="reloadPage">Tải lại trang</a-button>

        <span>
          <ul class="text-left" style="text-align: left">
            <li>
              Công nghệ nhận diện xác thực hồ sơ EKYC do Trung tâm Internet Việt
              Nam phát triển, giúp xác thực hồ sơ tên miền nhanh chóng, bảo mật
              và an toàn.
            </li>
            <li>
              EKYC giúp việc đăng ký tên miền thuận lợi. Đồng bộ cho toàn bộ tên
              miền.
            </li>
            <li>
              Thực hiện EKYC 1 lần duy nhất, được xác thực và bảo mật bởi Trung
              tâm Internet Việt Nam.
            </li>
            <li>Xác thực hồ sơ điện tử EKYC giúp bảo vệ tên miền của bạn.</li>
            <li>
              Theo quy định Thông tư số 24/2015/TT-BTTTT ngày 18/08/2015 của Bộ
              Thông tin và Truyền thông hướng dẫn về quản lý và sử dụng tài
              nguyên Internet và Thông tư số 21/2021/TT-BTTTT ngày 08/12/2021
              sửa đổi, bổ sung một số điều của thông tư số 24/2015/TT-BTTTT, chủ
              thể tên miền phải có trách nhiệm hoàn thiện hồ sơ đăng ký tên miền
              cho Nhà đăng ký quản lý và lưu giữ.
            </li>
          </ul>
        </span>

        <img
          src="@/assets/quytrinh.jpg"
          alt=""
          style="width: 100%; max-width: 800px"
        />
      </a-col>
    </a-row>
  </EkycForm>
</template>

<script setup>
import { EkycForm } from "./style.js";
import { isMobile } from "mobile-device-detect";

import { message } from "ant-design-vue";
import { ref, h, defineEmits, watch, onMounted } from "vue";
import CardDetection from "@/components/ekyc/CardDetection.vue";
import FaceDetection from "@/components/ekyc/FaceDetection.vue";
import HelpEkyc from "@/components/ekyc/HelpEkyc.vue";
import delay from "@/utility/ekyc/delay";
// import propTypes from "vue-types";
import { resizeImage } from "@/utility/ekyc/image-util";

import ApiFactory from "@/clientApi/ApiFactory";
const EkycApi = ApiFactory.get("EkycApi");

import {
  UserOutlined,
  SolutionOutlined,
  LoadingOutlined,
  SmileOutlined,
} from "@ant-design/icons-vue";

// defineProps({
//   contact_id: propTypes.init
// })

const reloadPage = () => {
  window.location.reload();
};

const emit = defineEmits(["UserData"]);

const current = ref(0);

const width = window.innerWidth;
const height = window.innerHeight;
const items = [
  {
    title: "Kiểm tra CCCD Mặt Trước",
    icon: h(UserOutlined),
  },
  {
    title: "Kiểm tra CCCD Mặt Sau",
    icon: h(SolutionOutlined),
  },
  {
    title: "Kiểm tra sinh trắc khuôn mặt",
    icon: h(LoadingOutlined),
  },
  {
    title: "Hoàn tất kiểm tra thông tin",
    icon: h(SmileOutlined),
  },
];

const token = ref('')
const requestId = ref('')
const frontOK = ref(false);
const backOK = ref(false);
const cardimageFront = ref("");
const cardimageBack = ref("");
const currentStep = ref("cardFront");
const visibleModal = ref(true);
const video = ref(null);
const canvas = ref(null);
const canvasCtx = ref(null);
const open = ref(true);
const imageCapture = ref("");
// const requestId = "TNG" + Date.now().toString();
const isDetectingData = ref(false);
const frontData = ref([]);
const backData = ref([]);
const isUpload = ref(true);
const resetForm = () => {
  cardimageFront.value = "";
  cardimageBack.value = "";
  open.value = true;
  visibleModal.value = true;
  isDetectingData.value = false;
  backOK.value = false;
  frontOK.value = false;
  if (isMobile) {
    // video.value.play();
    handleOpenCamera()
  }
};
const delayStep = async () => {
  delay(1000).then(() => {
    handleOpenCamera()
  });
};
const getParamValueFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  token.value = urlParams.get("token") || "";
  requestId.value = urlParams.get("request_id") || "";
};
const handleCardFront = (DataImage) => {
  currentStep.value = "cardFront";
  cardimageFront.value = DataImage;
  visibleModal.value = false;
  isDetectingData.value = true;
  callOcrRecognitionAPI(DataImage, "cardFront")
    .then((response) => {
      const isDataValid = validateCardFrontData(response);
      if (isDataValid) {
        delayStep();
        currentStep.value = "cardBack";
        visibleModal.value = true;
        frontOK.value = true;
        isDetectingData.value = false;
        imageCapture.value = "";
      } else {
        currentStep.value = "cardFront";
        isUpload.value = true;
        frontOK.value = false;
        resetForm();
      }
    })
    .catch(() => {
      delayStep();
      resetForm();
    });
};
const handleBackCard = (DataImage) => {
  cardimageBack.value = DataImage;
  visibleModal.value = false;
  isDetectingData.value = true;
  currentStep.value = "cardBack";
  callOcrRecognitionAPI(DataImage, "cardBack")
    .then((response) => {
      console.log("response", response);
      const isDataValid = compareCardData(response);
      if (isDataValid) {
        delayStep();
        currentStep.value = "face";
        visibleModal.value = true;
        backOK.value = true;
      } else {
        currentStep.value = "cardFront";
        isUpload.value = true;
        backOK.value = false;
        frontOK.value = false;
        resetForm();
      }
      isDetectingData.value = false;
    })
    .catch((error) => {
      console.error("OCR recognition failed:", error);
      delayStep();
      resetForm();
    });
};
const handleFaceId = (faceImageRef) => {
  isDetectingData.value = true;
  visibleModal.value = false;
  callFaceRecognitionAPI(faceImageRef)
    .then((response) => {
      const isDataValid = processFaceRecognitionResponse(response);
      if (isDataValid) {
        delayStep();
        currentStep.value = "complete";
        emit("UserData", {
          request_id: requestId,
          frontData: frontData.value,
          backData: backData.value,
          faceData: response?.data,
          frontImage: cardimageFront.value,
          backImage: cardimageBack.value,
          faceImage: faceImageRef,
        });
      } else {
        currentStep.value = "faield";
        resetForm();
        currentStep.value = "cardFront";
        isUpload.value = true;
        frontOK.value = false;
      }
      isDetectingData.value = false;
    })
    .catch((error) => {
      console.error("OCR recognition failed:", error);
      delayStep();
      resetForm();
    });
};
// const handleBegin = () => {
//   currentStep.value = "ekycHelp";
//   isUpload.value = false
//   resetForm()
// }
const handleBeginProcess = () => {
  currentStep.value = "cardFront";
};
const handleCancelPopup = async () => {
  isUpload.value = true;
  open.value = false;
  visibleModal.value = false;
  await delay(1000);
  currentStep.value = "cardFront";
};
const callOcrRecognitionAPI = (imageData, type) => {
  const formData = { request_id: requestId, image: imageData, type: type };
  // const formData = new FormData();
  // formData.append('request_id', requestId);
  // formData.append('image', imageData);
  // formData.append('type', type);
  const headers = new Headers();
  headers.append("Content-Type", "application/json"); // Set JSON header
  return fetch("/api/ekyc/ocr/recognition", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("API request failed");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      // Xử lý lỗi
      console.error(error);
    });

  // return EkycApi.getOcrData(formData);
};
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
  const formData = {
    request_id: requestId,
    image_live: imageData,
    token: token.value,
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
  headers.append("Content-Type", "application/json"); // Set JSON header

  return fetch("/api/ekyc/faceid/verification", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("API request failed");
      }
      return response.json();
    })
    .then((data) => {
      // Xử lý dữ liệu trả về
      return data;
    })
    .catch((error) => {
      // Xử lý lỗi
      console.error(error);
    });

  // return EkycApi.getFaceidData(formData);
};

const validateCardFrontData = (data) => {
  const dataCheck = EkycApi.ocrFrontCardChecking(data);
  frontData.value = data;

  if (dataCheck.success) {
    message.info(dataCheck.message);
    return dataCheck.success;
  } else {
    message.info(dataCheck.message);
    resetForm();
    return false;
  }
};

const compareCardData = (data) => {
  const dataCheck = EkycApi.ocrBackCardChecking(data, frontData.value);
  backData.value = data;
  if (dataCheck.success) {
    message.info(dataCheck.message, 10);
    return dataCheck.success;
  } else {
    message.error(dataCheck.message, 10);
    resetForm();
  }
};

const processFaceRecognitionResponse = (data) => {
  const dataCheck = EkycApi.faceVerificationChecking(data);
  message.info(dataCheck.message, 10);
  return dataCheck.success;
};

// const handleRemove = () => {

// }

const beforeUploadFrontCard = (file) => {
  isUpload.value = true;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = async () => {
    var img = new Image();
    img.src = reader.result;

    let resizedImageData = await resizeImage(reader.result);
    cardimageFront.value = resizedImageData;
    handleCardFront(resizedImageData);
  };

  return false;
};

const beforeUploadBackCard = (file) => {
  isUpload.value = true;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = async () => {
    var img = new Image();
    img.src = reader.result;
    let resizedImageData = await resizeImage(reader.result);
    cardimageBack.value = resizedImageData;
    handleBackCard(resizedImageData);
  };
  return false;
};

const handleCapture = async () => {
  canvasCtx.value = canvas.value.getContext("2d");
  canvasCtx.value.drawImage(
    video.value,
    0,
    0,
    canvas.value.width,
    canvas.value.height
  );
  video.value.pause();
  imageCapture.value = canvas.value.toDataURL("image/jpeg");
  currentStep.value === "cardFront"
    ? handleCardFront(imageCapture.value)
    : handleBackCard(imageCapture.value);
};

watch(currentStep, (newstep) => {
  if (newstep == "cardFront") {
    current.value = 0;
  }
  if (newstep == "cardBack") {
    current.value = 1;
  }
  if (newstep == "face") {
    current.value = 2;
  }
  if (newstep == "complete") {
    current.value = 3;
  }
});

const handleOpenCamera = () => {
  if (currentStep.value === 'cardFront' || currentStep.value === 'cardBack') {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        video.value.srcObject = stream;
        video.value.onloadedmetadata = () => {
          video.value.play();
          canvas.value.width = width;
          canvas.value.height = 400;
        };
      });
  }
};

onMounted(() => {
  if (isMobile) {
    handleOpenCamera()
  }
  getParamValueFromURL()
});
</script>
