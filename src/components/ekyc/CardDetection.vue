<template>
    <div>
        <VideoBox>
            <div v-if="loadingVideo" class="pre-loading-video">
                <a-spin size="large"  tip="Đang mở camera..." spinning />
                
            </div>
            <div class="video-box">
                <a-alert  type="success"  v-if="!loadingVideo" v-show="!isPhotoTaken" >
                    <template #message>
                        Đưa thẳng thẻ của bạn vào trước khung hình và duy chuyển nhẹ để đạt độ nét tối đa.
                    </template>
                </a-alert>
                <video style=" max-width: 100%;" v-show="!isPhotoTaken" ref="camera" webkit-playsinline playsinline autoplay :onPlay="handleGetUserMedia"></video>
                <tnButton class="taken-photo" @click="takePhoto" v-if="onDetect">
                    <unicon name="camera" :shape="`circle`" type="dashed" size="large" />
                </tnButton>
                <div class="crop-image"  v-if="!loadingVideo" v-show="!isPhotoTaken"></div>
                <canvas id="photoTaken" ref="canvas" style=" max-width: 100%;  display:none" :width="450" :height="337.5"></canvas>
            </div>
            
        </VideoBox>
    </div>
</template>
<script>
import { isMobile } from 'mobile-device-detect';
import * as tf from "@tensorflow/tfjs";
import { defineComponent, ref, onMounted, watch } from 'vue';
import propTypes from "vue-types";
import { cropImage } from "@/utility/ekyc/image-util";
import { cropAndNormalize } from "@/utility/ekyc/image-util";
import {  calculateSharpness,   } from "@/utility/ekyc/image-util";
 import { VideoBox } from './style.js'
 import delay from "@/utility/ekyc/delay";

 

export default defineComponent({
    components: {
        VideoBox
    },
    props: {
        open: propTypes.boolean
    },
    emits: ['DataImage'],

    setup(props, {emit}) { 
        const isPhotoTaken = ref(false);
        const isCameraOpen = ref(false);
        const sharpness = ref(0);
        const loadingVideo = ref(true);
        const isLoading = ref(false);
        const cameraType = ref('user');
        const camera = ref(null);
        const canvas = ref(null);
        const image = ref('');
        const isDetected = ref(false);
        const onDetect = ref(false); //test
        // const cv = ref(null);

 
        const handleGetUserMedia = (async () => {
            const yolov5 = await tf.loadGraphModel(`/component/yolov5n_web_model/model.json`)
            const dummyInput = tf.ones(yolov5.inputs[0].shape);
            await yolov5.executeAsync(dummyInput).then((warmupResult) => {
                tf.dispose(warmupResult);
                tf.dispose(dummyInput);
            });
            if(!isPhotoTaken.value){
                autoDetectCard(yolov5)
            }
           
        })
        const handleOpenCamera = () => {
            image.value = "";
            isPhotoTaken.value = false;
            isCameraOpen.value = true;
            createCameraElement();
        };
        const  createCameraElement = (async() => {
            isLoading.value = true;
            const constraints = {
                audio: false,
                video: {
                    facingMode:  "environment",
                    width: { min: 1280, max: 1920, ideal: 1440 },
                    height: { ideal: isMobile ? 1440 : 1080 },
                    aspectRatio: { ideal: isMobile ? 1.333333333 : 1.777777778 },
                }
            }
            await navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                isLoading.value = false;
                camera.value.srcObject = stream;
                loadingVideo.value = false;
            }).catch((error) => {
                isLoading.value = false;
                alert("May the browser didn't support or there is some errors.");
                console.log(error);
            })
        })
        const takePhoto = (async() => {
            console.log('TakePhoto')
            const width = camera.value ? camera.value.videoWidth : 800;
            const height = camera.value ? camera.value.videoHeight : 600;
            canvas.value.width = width;
            canvas.value.height = height;
            canvas.value.getContext("2d")?.drawImage(camera.value, 0, 0);
            let resizedImageData = await cropImage(
                canvas.value.toDataURL("image/jpeg", 0.95),
                width,
                height,
                width,
                height,
            );
            emit('DataImage', resizedImageData);

            isPhotoTaken.value = true;
            stopCameraStream();
        })

        const stopCameraStream = () => {
            isCameraOpen.value = false;
            // isPhotoTaken.value = false;
            let tracks = camera.value.srcObject.getTracks();
             tracks.forEach(async track => {
                await delay(1000)
                track.stop();
            });
        }

        const autoDetectCard = (async(model) => {
            const width = camera.value ? camera.value.videoWidth : 800;
            const height = camera.value ? camera.value.videoHeight : 600;
            const cropWidth = (width * (isMobile ? 95 : 75)) / 100;
            const cropHeight = cropWidth / 1.586;
            
            canvas.value.width = width;
            canvas.value.height = height;

            canvas.value.getContext("2d")?.drawImage(camera.value, 0, 0);
        
            tf.engine().startScope();
            let [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3);
            const input = tf.tidy(() => {
                return tf.image
                .resizeBilinear(tf.browser.fromPixels(canvas.value), [
                    modelWidth,
                    modelHeight,
                ])
                .div(255.0)
                .expandDims(0);
            });
    
            await model.executeAsync(input).then((res) => {
                const [boxes, scores] = res.slice(0, 2);
                const scores_data = scores.dataSync();
                const boxes_data = boxes.dataSync();
                if (scores_data[0] > 0.8) {

                    onDetect.value = true;

                    let [x1, y1, x2, y2] = boxes_data.slice(0, 4);
                    x1 *= width;
                    x2 *= width;
                    y1 *= height;
                    y2 *= height;

                    if (x1 >= (width - cropWidth) / 2 &&
                        y1 >= (height - cropHeight) / 2 &&
                        x2 <= (width + cropWidth) / 2 &&
                        y2 <= (height + cropHeight) / 2
                    ) {
                        const normCanvas = cropAndNormalize(canvas.value, width, x1, y1, x2, y2);
                        sharpness.value = calculateSharpness(
                        window.cv,
                        normCanvas
                            .getContext("2d")
                            .getImageData(0, 0, normCanvas.width, normCanvas.height)
                        );
                        console.log('Độ nét ảnh',sharpness.value);
                        if (sharpness.value >= 10) {
                            isDetected.value = true;
                        }
                    }
                    console.log('detect')
                }  else {
                    onDetect.value = false;
                }
                tf.dispose(res);
            });

            if (!isDetected.value && !isPhotoTaken.value) {
                requestAnimationFrame(() => autoDetectCard(model));
            } else {
                takePhoto();
                // isPhotoTaken.value = true;
                // let resizedImageData = await cropImage(
                //     canvas.value.toDataURL("image/jpeg", 0.95),
                //     width,
                //     height,
                //     width,
                //     height,
                // );
                // // emit('DataImage', resizedImageData);
                // stopCameraStream(); 
            }
            tf.engine().endScope();
        })

        const changeCam = () => {
            stopCameraStream();
            cameraType.value = cameraType.value == "user" ? "environment" : "user"
            handleOpenCamera();
        }

        onMounted(() => {
            handleOpenCamera();
        })
        
        watch(() => props.open, () => { 

            if(!props.open) {
                stopCameraStream();
            }

        })

        return {
            handleGetUserMedia,
            isPhotoTaken,
            isCameraOpen,
            handleOpenCamera,
            changeCam,
            takePhoto,
            camera,
            canvas,
            isLoading,
            loadingVideo,
            image,
            sharpness,
            onDetect
        }
    }
});




</script>