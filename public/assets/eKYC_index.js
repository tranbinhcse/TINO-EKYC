const canvasdiv = document.getElementById("temp_face");
const cLoading = document.getElementById("cLoading");
cLoading.style.display = "block";
let faceLandmarker;
let runningMode = "IMAGE";
let webcamRunning = false;
var videoWidth = 500;
var userAgent = navigator.userAgent || navigator.vendor || window.opera;
if (/android/i.test(userAgent) || (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)) {
    videoWidth = 250;
}
// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
async function runDemo() {
    const filesetResolver = await FilesetResolver.forVisionTasks(
        "/id-biz-vn/Scripts/TenMien/FreeVN/models/task-vision/wasm"
    );
    faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
            modelAssetPath: `/id-biz-vn/Scripts/TenMien/FreeVN/models/face_landmarker.task`,
            delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode,
        numFaces: 1
    });
    cLoading.style.display = "none";
}
runDemo();

/********************************************************************
// Demo 1: Grab a bunch of images from the page and detection them
// upon click.
********************************************************************/

// In this demo, we have put all our clickable images in divs with the
// CSS class 'detectionOnClick'. Lets get all the elements that have
// this class.
const imageContainers = document.getElementsByClassName("detectOnClick");

// Now let's go through all of these and add a click event listener.
for (let i = 0; i < imageContainers.length; i++) {
    // Add event listener to the child element whichis the img element.
    imageContainers[i].children[0].addEventListener("click", handleClick);
}

// When an image is clicked, let's detect it and display results!
async function handleClick(event) {
    if (!faceLandmarker) {
        console.log("Wait for faceLandmarker to load before clicking!");
        return;
    }

    if (runningMode === "VIDEO") {
        runningMode = "IMAGE";
        await faceLandmarker.setOptions({ runningMode });
    }
    // Remove all landmarks drawed before
    const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
    for (var i = allCanvas.length - 1; i >= 0; i--) {
        const n = allCanvas[i];
        n.parentNode.removeChild(n);
    }

    // We can call faceLandmarker.detect as many times as we like with
    // different image data each time. This returns a promise
    // which we wait to complete and then call a function to
    // print out the results of the prediction.
    const faceLandmarkerResult = faceLandmarker.detect(event.target);
    const canvas = document.createElement("canvas");
    canvas.setAttribute("class", "canvas");
    canvas.setAttribute("width", event.target.naturalWidth + "px");
    canvas.setAttribute("height", event.target.naturalHeight + "px");
    canvas.style.left = "0px";
    canvas.style.top = "0px";
    canvas.style.width = `${event.target.width}px`;
    canvas.style.height = `${event.target.height}px`;

    event.target.parentNode.appendChild(canvas);
}

/********************************************************************
// Demo 2: Continuously grab image from webcam stream and detect it.
********************************************************************/

const video = document.getElementById("videoElm");
//const canvasElement = document.getElementById(
//    "output_canvas"
//);

//const canvasCtx = canvasElement.getContext("2d");

// Check if webcam access is supported.
function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it.
function loadFaceAPI() {
    if (hasGetUserMedia()) {
        enableCam();
    } else {
        $(".ePopup").fadeIn();
        $("#ErrorNdung").html(`<p style='margin-bottom:16px;'><span style='color:#FC4649;'>Hãy bật Camera</span></p>`);
        $("#cLoading").fadeOut();
    }
}
// Enable the live webcam view and start detection.
function enableCam(event) {
    if (!faceLandmarker) {
        $(".ePopup").fadeIn();
        $("#ErrorNdung").html(`<p style='margin-bottom:16px;'><span style='color:#FC4649;'>Camera đang bật, xin chờ giây lát!</span></p>`);
        $("#cLoading").fadeOut();
        return;
    }
    webcamRunning = true;
    $("#cLoading").hide();
    //if (webcamRunning === true) {
    //    webcamRunning = false;
    //    enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    //} else {
    //    webcamRunning = true;
    //    enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    //}

    // getUsermedia parameters.
    const constraints = {
        video: true
    };
    dateBefor = Date.now();
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
}

let dateBefor = Date.now();
let indexAction = 0;
var arrAction = [{ name: 'right', description: 'Xoay phải' }, { name: 'up', description: 'Nhìn lên' }, { name: 'down', description: 'Nhìn xuống' }, { name: 'left', description: 'Xoay trái' }, { name: 'straight', description: 'Nhìn thẳng' }];
randomActionArr = (actions) => {
    for (i = actions.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * i)
        k = actions[i]
        actions[i] = actions[j]
        actions[j] = k
    }
}
randomActionArr(arrAction);
let lastVideoTime = -1;
let results = undefined;
async function predictWebcam() {
    $("#cLoading").fadeOut();
    const radio = video.videoHeight / video.videoWidth;
    video.style.width = videoWidth + "px";
    video.style.height = videoWidth * radio + "px";
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await faceLandmarker.setOptions({ runningMode: runningMode });
    }
    let nowInMs = Date.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = faceLandmarker.detectForVideo(video, nowInMs);
    }
    if (results.faceLandmarks) {
        for (const landmarks of results.faceLandmarks) {
            let milisecond = Math.abs(nowInMs - dateBefor);
            $(".c_right_v").text(parseInt(10 - (milisecond / 1000)));
            if (milisecond >= 10000) {
                indexAction = 0;
                dateBefor = Date.now();
                randomActionArr(arrAction);
                canvasdiv.innerHTML = "";
                $("#blood_line").attr("class", "");
            }
            document.getElementById("face_action").innerHTML = arrAction[indexAction].description;
            var action = getFaceAction(landmarks);
            $("#blood_line").text((indexAction + 1).toString());
            $("#blood_line").attr("class", "line" + (indexAction + 1).toString());
            if (action == arrAction[indexAction].name) {
                indexAction++;
                if (action == 'straight') {
                    CapImage();
                }

                if (indexAction == 5) {
                    document.getElementById("face_action").innerHTML = 'Đang xác thực';
                    webcamRunning = false;
                    loadInfoFace();
                    return;
                }
            }
        }
    }
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}
function CapImage() {
    canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    canvasdiv.append(canvas);
}
function getFaceAction(landmarks) {

    let midJawRight = landmarks[50];
    let midJawLeft = landmarks[280];
    let noise = landmarks[4]

    let left = CalcDistance(midJawLeft, noise)
    let right = CalcDistance(midJawRight, noise)

    let ratio = 0;
    let ratio_y = midJawRight.y / midJawLeft.y;

    let result = "straight"
    let is_balance = (ratio_y > 0.7 && ratio_y < 1.3);

    if (left < right && is_balance) {
        ratio = right / left;
        if (ratio > 2.5)
            return result = "left";
    }
    if (right < left && is_balance) {
        ratio = left / right;
        if (ratio > 1.5)
            return result = "right";
    }

    is_balance = (ratio_y > 0.7 && ratio_y < 1.3);
    if (is_balance && noise.y > midJawLeft.y && noise.y > midJawRight.y) {
        ratio = noise.y / midJawLeft.y;
        if (ratio > 1)
            return result = "down";
    }

    if (is_balance && noise.y < midJawLeft.y && noise.y < midJawRight.y) {
        ratio = midJawLeft.y / noise.y;
        if (ratio > 1.1)
            return result = "up";
    }
    return result;
}
function CalcDistance(point_1, point_2) {
    var a = point_1.x - point_2.x;
    var b = point_1.y - point_2.y;

    return Math.sqrt(a * a + b * b);
}

//});

let verifyResults = {
    same_person: "Cùng một người",
    may_be_same: "Có thể giống nhau",
    not_same: "Không giống"
}
$("#face_reset").click(function () {
    $("#face_fail").addClass("hidden");
    $("#face_reset").addClass("hidden");
    $("#face_check").removeClass("hidden");
    $("#face_gui").removeClass("hidden");
    webcamRunning = true;
    predictWebcam();
});
loadInfoFace = function () {
    //document.getElementById("modal_face").classList.add("hide")
    let canvas = canvasdiv.getElementsByTagName("canvas");
    let faceBase64 = canvas[0].toDataURL();
    $.ajax({
        type: "POST",
        url: "/ekyc/faceid-verification",
        data: {
            image: faceBase64,
            id: document.getElementById("id").value
        },
        success: function (data) {
            const response = JSON.parse(data);
            if ((response.verify_result == 2 || response.verify_result == 1) && response.sim > 0.6) {
                $(".hideWsucc").addClass("hidden");
                $(".showWSucc").removeClass("hidden");
                document.getElementById("result").value = verifyResults[response.verify_result_text.toLowerCase().replace(" ", "_")];
                document.getElementById("sim").value = Number((response.sim * 100).toFixed(2)) + "%";
                document.getElementById("wearing_mask").value = response.wearing_mask == "NO" ? "Không đeo khẩu trang" : "Có đeo khẩu trang";
                document.getElementById("face_anti_spoof_status").value = response.face_anti_spoof_status.status == "REAL" ? "Ảnh mặt thật" : "Không xác định";
                document.getElementById("face_error_message").value = response.message.error_message;
                document.getElementById("face_action").innerHTML = 'DONE';
                video.pause();
                $("#xacthuc_3").addClass("enabled");
            } else {
                document.getElementById("face_fail").innerHTML = 'Nhận diện khuôn mặt không trùng khớp với CMND/CCCD';
                $("#xacthuc_3").removeClass("enabled");
                $("#face_check").addClass("hidden");
                $("#face_gui").addClass("hidden");
                $("#face_fail").removeClass("hidden");
                $("#face_reset").removeClass("hidden");
            }
        }
    });
    //xmlhttp.send(JSON.stringify({ "image": faceBase64, id : document.getElementById("id").value  }));
}
//loadFaceAPI().then(getCameraStream);
const cmt1 = document.getElementById("cmt_1");
const viewcmt1 = document.getElementById("view_cmt_1");
const cmt2 = document.getElementById("cmt_2");
//const camopend = document.getElementById("cam_opend");

function RenderRequestID() {
    let now = new Date();
    let month = now.getMonth() + 1;
    month = month.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    }).toString();
    let day = now.getDate();
    day = day.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    }).toString();
    return `MBC-${now.getFullYear()}${month}${day}-${now.getTime()}`;
}
var isShowBtnCMT = 0;
var requestId = "";
eventCMT1 = function () {
    cmt1.addEventListener("change", () => {
        reduceFileSize(cmt1.files[0], 1024 * 1024, 1024, 1024, 0.9, blob => {
            var reader = new FileReader();
            reader.onload = function (e) {
                viewcmt1.src = e.target.result;
                //$(".group_cmnd.sau").addClass("hidden");
                //$(".group_cmnd.truoc").removeClass("hidden");
                $(".matsau").removeClass("input_err");
                $(".mattruoc").removeClass("input_err");
                $("#lblErr_CCCD").html("");
                $("#cLoading").show();
                //lớn hơn 98kb
                if (blob.size >= 100352) {
                    requestId = requestId == "" ? RenderRequestID() : requestId;
                    $.ajax({
                        type: "POST",
                        url: "/ekyc/cmt-font",
                        data: {
                            requestId: requestId,
                            image: e.target.result
                        },
                        success: function (data) {
                            const response = JSON.parse(data);
                            let isok = 0; let htmlThongBao = "";
                            if (response.errorcode != undefined) {
                                if (response.errorcode == "1") {
                                    isok = 1;
                                    htmlThongBao = `<b>Hình ảnh CCCD mặt trước tải lên đang bị cắt!</b> Vui lòng nhấp vào để tải ảnh khác.`;
                                }
                                if (response.errorcode == "2") {
                                    isok = 1;
                                    htmlThongBao = `<b>Hình ảnh CCCD mặt trước tải lên đang bị mờ!</b> Vui lòng nhấp vào để tải ảnh khác.`;
                                }
                                if (response.errorcode == "3") {
                                    isok = 1;
                                    htmlThongBao = `<b>Hình ảnh CCCD mặt trước tải lên đang bị loá!</b> Vui lòng nhấp vào để tải ảnh khác.`;
                                }
                                if (response.errorcode == "4") {
                                    $(".group_cmnd.sau .cmnd_4").addClass("er");
                                    isok = 1;
                                    htmlThongBao = response.message;
                                }
                            }
                            else {
                                let namsinh = parseInt(response.birthday.replaceAll('/', '-').split('-')[2].replaceAll(' ', '~').split('~')[0]);
                                var NowDate = new Date();
                                let hientai = NowDate.getFullYear();
                                if ((hientai - namsinh < 18) || (hientai - namsinh > 23)) {
                                    $(".cPopup").fadeOut();
                                    $(".ePopup").fadeIn();
                                    $("#ErrorNdung").html(`<p style='margin-bottom:16px;'><span style='color:#FC4649;'>Rất tiếc! Bạn <b>không thuộc đối tượng nhận tên miền</b> miễn&nbsp;phí.</span></p>
                                            <p style='margin-bottom:20px;'>Chương trình chỉ dành đối tượng là <b>công dân Việt Nam từ&nbsp;18&nbsp;-&nbsp;23&nbsp;tuổi.</b></p>
                                            <a id='btnWhoisDomain' class='btn enabled'>Tôi vẫn muốn sở hữu tên miền này</a>`);
                                    $("#btnWhoisDomain").click(function () {
                                        let giaTri = $(".selectFor > label").attr("data-value");
                                        let dataDomain = replaceVar($("#txtSearch").val().split('.')[0]).replace(/[^a-zA-Z0-9.]/g, '');
                                        let hreftenmien = dataDomain + giaTri;
                                        location.href = "https://www.matbao.net/ten-mien/ket-qua-kiem-tra-ten-mien.html?tenmien=" + hreftenmien + "#boxwhoisincheckdomain";
                                    });
                                    $("#cLoading").hide();
                                    isok = 1;
                                }
                                else {
                                    document.getElementById("front_is_full").value = response.is_full == 1 ? "Giấy tờ đầy đủ" : "";
                                    document.getElementById("front_id_check").value = response.id_check == 'REAL' ? "Giấy tờ thật" : "";
                                    document.getElementById("front_id_logic_message").value = response.id_logic_message == 'OK' ? "Không có lỗi logic" : response.id_logic_message;

                                    document.getElementById("id").value = response.id;
                                    document.getElementById("name").value = response.name;
                                    document.getElementById("birthday").value = response.birthday;
                                    document.getElementById("sex").value = response.sex;
                                    var $radios = $('input:radio[name=r_sex]');
                                    if ($radios.is(':checked') === false) {
                                        $radios.filter('[value=' + response.sex + ']').prop('checked', true);
                                    }
                                    document.getElementById("address").value = response.address;
                                    document.getElementById("precinct_code").value = response.precinct;
                                    document.getElementById("hometown").value = response.hometown;
                                    document.getElementById("district_code").value = response.district;
                                    document.getElementById("province_code").value = response.province;
                                    document.getElementById("expiry").value = response.expiry;
                                    if (response.address == "N/A" || response.district == "N/A" || response.province == "N/A") {
                                        $("#view_cmt_1").attr("src", "");
                                        $(".vmattruoc").hide();
                                        htmlThongBao = `<b>Hình ảnh CCCD mặt trước tải lên không hợp lệ!</b> Vui lòng nhấp vào để tải ảnh khác.`;
                                        isok = 1;
                                    }
                                    isShowBtnCMT++;
                                }
                            }
                            if (response.id_check != 'REAL' && htmlThongBao == "") {
                                isok = 1;
                                htmlThongBao = `<b>Hình ảnh CCCD mặt trước tải lên không thật! </b>Vui lòng nhấp vào để tải ảnh khác.`;
                            }
                            if (response.id_logic != '1' && htmlThongBao == "") {
                                isok = 1;
                                htmlThongBao = `<b>Hình ảnh CCCD mặt trước tải lên đã bị chỉnh sửa! </b>Vui lòng nhấp vào để tải ảnh khác.`;
                            }
                            $(".vmattruoc").removeClass("er");
                            $(".vmattruoc").addClass("ok");
                            $("#cLoading").hide();
                            if (htmlThongBao != "") {
                                $(".vmattruoc").removeClass("ok");
                                $(".vmattruoc").addClass("er");
                                $("#lblErr_CCCD").html(htmlThongBao);
                            }
                            if (isok == 1) {
                                $(".vmattruoc").removeClass("ok");
                                $(".vmattruoc").addClass("er");
                                $(".mattruoc").addClass("input_err");
                                $("#xacthuc_1").removeClass("enabled");
                            }
                            if (isShowBtnCMT >= 2) {
                                $("#xacthuc_1").addClass("enabled");
                            }
                        },
                        error: function (_data) {
                            $(".ePopup").fadeIn();
                            $("#view_cmt_1").attr("src", "");
                            $(".vmattruoc").hide();
                            $(".vmattruoc").removeClass("ok");
                            $(".vmattruoc").addClass("er");
                            $(".mattruoc").addClass("input_err");
                            $("#ErrorNdung").html(`<p style='margin-bottom:16px;'><span style='color:#FC4649;'>Đã có lỗi xẩy ra, xin thử lại!</span></p>`);
                            $("#cLoading").hide();
                            $("#xacthuc_1").removeClass("enabled");
                            cmt1.value = null;
                        }
                    });
                } else {
                    $("#cLoading").fadeOut();
                    htmlThongBao = `<p style='margin-bottom:16px;'><span style='color:#FC4649;'>Hình CCCD/CMND phải lớn hơn 98KB</span></p>`;
                    $(".vmattruoc").removeClass("ok");
                    $(".vmattruoc").addClass("er");
                    $("#lblErr_CCCD").html(htmlThongBao);
                    cmt1.value = null;
                }
            };
            reader.readAsDataURL(blob);
        });
    });
}
eventCMT2 = function () {
    const viewcmt2 = document.getElementById("view_cmt_2");
    cmt2.addEventListener("change", () => {
        reduceFileSize(cmt2.files[0], 1024 * 1024, 1024, 1024, 0.9, blob => {
            var reader = new FileReader();
            reader.onload = function (e) {
                viewcmt2.src = e.target.result;
                //$(".group_cmnd.truoc").addClass("hidden");
                //$(".group_cmnd.sau").removeClass("hidden");
                $(".matsau").removeClass("input_err");
                $(".mattruoc").removeClass("input_err");
                $("#lblErr_CCCD").html("");
                $("#cLoading").show();
                if (blob.size >= 100352) {
                    requestId = requestId == "" ? RenderRequestID() : requestId;
                    $.ajax({
                        type: "POST",
                        url: "/ekyc/cmt-back",
                        data: { "image": e.target.result, requestId: requestId },
                        success: function (data) {
                            const response = JSON.parse(data);
                            let isok = 0; let htmlThongBao = "";
                            //$(".group_cmnd.sau .cmnd").removeClass("ok");
                            //$(".group_cmnd.sau .cmnd").removeClass("er");
                            if (response.errorcode != undefined) {
                                if (response.errorcode == "1") {
                                    //$(".group_cmnd.sau .cmnd_2").addClass("er");
                                    isok = 1;
                                    htmlThongBao = `<b>Hình ảnh CCCD mặt sau tải lên đang bị cắt!</b> Vui lòng nhấp vào để tải ảnh khác.`;
                                }
                                //else {
                                //    $(".group_cmnd.sau .cmnd_2").addClass("ok");
                                //}
                                if (response.errorcode == "2") {
                                    //$(".group_cmnd.sau .cmnd_3").addClass("er");
                                    isok = 1;
                                    htmlThongBao = `<b>Hình ảnh CCCD mặt sau tải lên đang bị mờ!</b> Vui lòng nhấp vào để tải ảnh khác.`;
                                }
                                //else {
                                //    $(".group_cmnd.sau .cmnd_3").addClass("ok");
                                //}
                                if (response.errorcode == "3") {
                                    //$(".group_cmnd.sau .cmnd_4").addClass("er");
                                    isok = 1;
                                    htmlThongBao = `<b>Hình ảnh CCCD mặt sau tải lên đang bị loá!</b> Vui lòng nhấp vào để tải ảnh khác.`;
                                }
                                if (response.errorcode == "4") {
                                    isok = 1;
                                    htmlThongBao = response.message;
                                }
                            }
                            else {
                                $(".vmatsau").addClass("ok");
                                document.getElementById("back_is_full").value = response.is_full == 1 ? "Giấy tờ đầy đủ" : "";
                                document.getElementById("back_id_check").value = response.id_check == 'REAL' ? "Giấy tờ thật" : "";
                                document.getElementById("back_id_logic_message").value = response.id_logic_message == 'OK' ? "Không có lỗi logic" : response.id_logic_message;

                                document.getElementById("issue_by").value = response.issue_by != "N/A" ? response.issue_by : "";
                                document.getElementById("issue_date").value = response.issue_date != "N/A" ? response.issue_date : "";
                                document.getElementById("ethnicity").value = response.ethnicity != "N/A" ? response.ethnicity : "";
                                document.getElementById("religion").value = response.religion != "N/A" ? response.religion : "";
                                if (response.id_check != 'REAL') {
                                    console.log(response.id_check);
                                }
                                if (response.issue_by == "N/A" || response.issue_date == "N/A") {
                                    $("#view_cmt_2").attr("src", "");
                                    $(".vmatsau").hide();
                                    htmlThongBao = `<b>Hình ảnh CCCD mặt sau tải lên không hợp lệ!</b> Vui lòng nhấp vào để tải ảnh khác.`;
                                }
                                isShowBtnCMT++;
                            }
                            if (response.id_check != 'REAL') {
                                isok = 1;
                                htmlThongBao = `<b>Hình ảnh CCCD mặt sau tải lên không thật! </b>Vui lòng nhấp vào để tải ảnh khác.`;
                            }
                            if (response.id_logic != '1' && htmlThongBao == "") {
                                isok = 1;
                                htmlThongBao = `<b>Hình ảnh CCCD mặt sau tải lên đã bị chỉnh sửa! </b>Vui lòng nhấp vào để tải ảnh khác.`;
                            }
                            $(".vmatsau").removeClass("er");
                            $(".vmatsau").addClass("ok");
                            $("#cLoading").hide();
                            if (htmlThongBao != "") {
                                $(".vmatsau").removeClass("ok");
                                $(".vmatsau").addClass("er");
                                $("#lblErr_CCCD").html(htmlThongBao);
                            }
                            if (isok == 1) {
                                $(".vmattruoc").removeClass("ok");
                                $(".vmattruoc").addClass("er");
                                $(".mattruoc").addClass("input_err");
                                $("#xacthuc_1").removeClass("enabled");
                            }
                            if (isShowBtnCMT >= 2) {
                                $("#xacthuc_1").addClass("enabled");
                            }
                        },
                        error: function (_data) {
                            $(".ePopup").fadeIn();
                            $("#view_cmt_2").attr("src", "");
                            $(".vmatsau").hide();
                            $(".vmatsau").removeClass("ok");
                            $(".vmatsau").addClass("er");
                            $(".matsau").addClass("input_err");
                            $("#ErrorNdung").html(`<p style='margin-bottom:16px;'><span style='color:#FC4649;'>Đã có lỗi xẩy ra, xin thử lại!</span></p>`);
                            $("#cLoading").hide();
                            $("#xacthuc_1").removeClass("enabled");
                            cmt1.value = null;
                        }
                    });
                } else {
                    $("#cLoading").fadeOut();
                    htmlThongBao = `<p style='margin-bottom:16px;'><span style='color:#FC4649;'>Hình CCCD/CMND phải lớn hơn 98KB</span></p>`;
                    $(".vmatsau").removeClass("ok");
                    $(".vmatsau").addClass("er");
                    $("#lblErr_CCCD").html(htmlThongBao);
                    cmt1.value = null;
                }
            };
            reader.readAsDataURL(blob);
        });
    });
}
eventInfoUpdate = function () {
    $("#cLoading").fadeIn();
    const _id = document.getElementById("id").value;
    const _phone = document.getElementById("tx-phone").value;
    const _email = document.getElementById("tx-email").value;
    const _accountId = document.getElementById("tx-maMB").value;
    let _arrdiachi = $("#selectCountry option:selected").text() + "☂" + $("#selectCountry option:selected").attr("data-code") + "|";
    _arrdiachi += $("#selectState option:selected").text() + "☂" + $("#selectState option:selected").attr("data-code") + "|";
    _arrdiachi += $("#selectDistrict option:selected").text() + "☂" + $("#selectDistrict option:selected").attr("data-code") + "|";
    _arrdiachi += $("#selectWard option:selected").text() + "☂" + $("#selectWard option:selected").attr("data-code") + "|";
    _arrdiachi += $("#tx-address").val();
    $.ajax({
        type: "POST",
        url: "/ekyc/update-info",
        data: { "id": _id, "phone": _phone, "email": _email, "accountId": _accountId, isCompany: false, arrdiachi: _arrdiachi },
        success: function (data) {
            if (data.Status) {
                if (data.Data > 0.6) {
                    $("#buoc_2b").addClass("hidden");
                    submitfreeVN();
                } else {
                    $("#buoc_2b").addClass("hidden");
                    $("#buoc_2c").removeClass("hidden");
                    loadFaceAPI();
                }
            } else {
                $(".ePopup").fadeIn();
                $("#ErrorNdung").html(`<p style='margin-bottom:16px;'><span style='color:#FC4649;'>${data.Message}</span></p>`);
                $("#cLoading").fadeOut();
            }

        }
    });
}
eventBZInfoUpdate = function () {
    const _id = document.getElementById("txtTaxCode").value;
    const _phone = document.getElementById("tx-bz-phone").value;
    const _email = document.getElementById("tx-bz-email").value;
    const _accountId = document.getElementById("tx-bz-maMB").value;
    $.ajax({
        type: "POST",
        url: "/ekyc/update-info",
        data: { "id": _id, "phone": _phone, "email": _email, "accountId": _accountId, isCompany: true },
        success: function (data) {
            if (!data.Status) {
                $(".ePopup").fadeIn();
                $("#ErrorNdung").html(`<p style='margin-bottom:16px;'><span style='color:#FC4649;'>${data.Message}</span></p>`);
                $("#cLoading").fadeOut();
            }
        }
    });
}
submitfreeVN = function () {
    $("#cLoading").fadeIn();
    const _id = document.getElementById("id").value;
    const _domainname = document.getElementById("txtSearch").value.split('.')[0];
    const _tld = $(".selectFor > label").attr("data-value");
    $.ajax({
        type: "POST",
        url: "/vnnic/submit-free-vn",
        data: { "domainname": _domainname, "tld": _tld, "id": _id },
        success: function (data) {
            if (!data.status) {
                $(".cPopup").fadeOut();
                $(".ePopup").fadeIn();
                $("#ErrorNdung").html(`<p style='margin-bottom:16px;'><span style='color:#FC4649;'>${data.Message}</span></p>`);
                $("#cLoading").fadeOut();
            }
            else {
                //$("#buoc_4").addClass("hidden");
                $("#buoc_5").removeClass("hidden");
            }
            $("#cLoading").fadeOut();
        }
    });
}
//eventCam = function(){
//    camopend.addEventListener("click", ()=> {
//        loadFaceAPI().then(getCameraStream);
//    });
//}
refreshEvent = function () {
    camopend.removeEventListener("change");
    cmt2.removeEventListener("change");
    cmt2.classList.add("disabled");
    camopend.classList.add("disabled");
}
eventCMT1();
eventCMT2();
//eventCam();
