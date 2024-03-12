var iOS1 = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
var EventClick = "click";
if (iOS1 == true) { EventClick = "click touchstart"; }
var windWidth = $(window).width();
var createCookie = function (name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}
$(document).ready(function () {
    $(".selectFor ul li").click(function () {
        let extDomain = $(this).attr('data-value');
        $(".selectFor > label").attr("data-value", extDomain);
        $(".selectFor > label").text($(this).text());
        $("#SuperMenu .li_1").text($(this).text());
        $(".div_CC_VN").addClass("hidden");
        $("#div_h").attr("class", "color" + $(this).text().replaceAll('.', '_'));
        $("#div_h img").addClass("hidden");
        $("#hinh" + $(this).text().replaceAll('.', '_')).removeClass("hidden");
        $("#div" + $(this).text().replaceAll('.', '_')).removeClass("hidden");
        let dataDomain = replaceVar($("#txtSearch").val().split('.')[0]).replace(/[^a-zA-Z0-9.]/g, '');
        if (dataDomain != null && dataDomain != undefined && dataDomain != "") {
            $("#btnSearch").trigger("click");
        }
    });
    var arrParamUrl = location.search.replaceAll('?', '').split('&');
    $.each(arrParamUrl, function (i, value) {
        if (value.indexOf('=') > -1) {
            let paraname = value.split('=')[0];
            let paravalue = value.split('=')[1];
            if (paraname == "domain") {
                $('[data-value="' + paravalue + '"]').trigger("click");
            }
        }
    });
    $(".ePopup .close").click(function () {
        $(".ePopup").fadeOut();
    });
    $(".cPopup .close").click(function () {
        $(".cPopup").fadeOut();
    });
    $("body").on(EventClick, "#btnTaiLaiTruoc", function () {
        $(".ePopup").fadeOut();
        $("#label_cmt_1").trigger("click");
    });
    $("body").on(EventClick, "#btnTaiLaiSau", function () {
        $(".ePopup").fadeOut();
        $("#label_cmt_2").trigger("click");
    });
    $("#txtmidSeach").keypress(function (event) {
        var inpDM = replaceVar($(this).val()).replace(/[^a-zA-Z0-9.]/g, '');
        if (event.which == 13) {
            $("#txtmidSeach").val(inpDM);
            $("#btnmidSeach").trigger("click");
        }
    });
    $("#btnmidSeach").click(function () {
        $("#returnmidSearch").html("");
        let giaTri = $(".selectFor > label").attr("data-value");
        let dataDomain = replaceVar($("#txtmidSeach").val().split('.')[0]).replace(/[^a-zA-Z0-9.]/g, '');
        if (dataDomain == null || dataDomain == undefined || dataDomain == "") {
            $(".ePopup").fadeIn();
            $("#ErrorNdung").html(`<p style='margin-bottom:16px;'><span style='color:#FC4649;'>Hãy nhập tên miền bạn muốn tìm.</span></p>`);
            $("#cLoading").fadeOut();
            return;
        }

        $("#txtmidSeach").val(dataDomain);
        $("#cLoading").fadeIn();
        $.ajax({
            type: "GET",
            url: "/TenMien/checkisExistsDomain?domain=" + dataDomain + giaTri,
            success: function (data) {
                var isExistsCount = parseInt(data);
                if (isExistsCount == 1) {
                    if (giaTri == ".id.vn") {
                        $("#hientenmien").text(dataDomain + ".id.vn");
                        $("#danhchoCaNhan").show();
                        $("#danhchoDoanhNghiep").hide();
                        $("#returnmidSearch").append(`<div class='box'>
                        <strong class ='succ'><b>Chúc mừng bạn!</b> Tên miền <a style='color:#1E74E8;text-decoration:underline;'>${dataDomain}.id.vn</a> của bạn <b>chưa có người đăng ký</b>.</strong>
                        <p>Vui lòng <b>xác thực thông tin cá nhân bằng eKYC </b> để nhận tên miền miễn phí.</p>
                        <a id='btnXacThuc' class='btn blue'>Xác thực</a>
                        <a class ='link block hidden' href='' target='_blank'>Hướng dẫn xác thực bằng eKYC</a>
                        <hr style='border:solid 1px #E0E0E0;border-bottom:0;margin:16px 0;' />
                        <p style='color:#FC4649;margin-bottom:4px;font-size:12px;line-height:18px;'><b>Lưu ý về đối tượng nhận tên miền</b> MIỄN PHÍ:</p>
                        <ul style='color:#7C7C7C;font-size:12px;line-height:18px;padding-left:16px;'>
                            <li>Dành cho <b>công dân Việt Nam</b> từ <b>18-23 tuổi</b>.</li>
                            <li><b>Mỗi cá nhân</b> được <b>đăng ký 1 tên miền</b>.</li>
                        </ul>
                        </div>`);
                    }
                    else {
                        $("#hientenmien1").text(dataDomain + ".biz.vn");
                        $("#danhchoDoanhNghiep").show();
                        $("#danhchoCaNhan").hide();
                        $("#returnmidSearch").append(`<div class='box'>
                        <strong class ='succ'><b>Chúc mừng bạn!</b> Tên miền <a style='color:#1E74E8;text-decoration:underline;'>${dataDomain}.biz.vn</a> của bạn <b>chưa có người đăng ký</b>.</strong>
                        <p>Vui lòng <b>xác thực thông tin doanh nghiệp </b> để nhận tên miền MIỄN PHÍ.</p>
                        <a id='btnXacThuc' class ='btn blue'>Xác thực</a>
                        <a class ='link block hidden' href='' target='_blank'>Hướng dẫn xác thực thông tin doanh nghiệp</a>
                        <hr style='border:solid 1px #E0E0E0;border-bottom:0;margin:16px 0;' />
                        <p style='color:#FC4649;margin-bottom:4px;font-size:12px;line-height:18px;'><b>Lưu ý về đối tượng nhận tên miền</b> MIỄN PHÍ:</p>
                        <ul style='color:#7C7C7C;font-size:12px;line-height:18px;padding-left:16px;'>
                            <li>Dành cho <b>Dành cho doanh nghiệp thành lập trong vòng 1 năm</b>.</li>
                            <li><b>Hộ kinh doanh có giấy chứng nhận đăng ký</b>.</li>
                            <li><b>Mỗi đối tượng</b> được <b>đăng ký 1 tên miền</b>.</li>
                        </ul>
                        </div>`);
                    }
                }
                else {
                    $(".ePopup").fadeIn();
                    $("#ErrorNdung").html(`<p style='margin-bottom:16px;'><span style='color:#FC4649;'>Tên miền bạn không thể chọn vì là tên miền đặc biệt hoặc đã có người mua!</span></p>`);
                }
                $("#cLoading").fadeOut();
            },
            error: function (_data) {
                $("#cLoading").fadeOut();
                console.log(_data);
            }
        });
    });
    $("#txtSearch").keypress(function (event) {
        var inpDM = replaceVar($(this).val()).replace(/[^a-zA-Z0-9.]/g, '');
        if (event.which == 13) {
            $("#txtSearch").val(inpDM);
            $("#btnSearch").trigger("click");
        }
    });
    $("#xacthuc_3").click(() => {
        submitfreeVN();
    })
    $("#btnSearch").click(function () {
        $("#returnSearch").html("");
        let giaTri = $(".selectFor > label").attr("data-value");
        let dataDomain = replaceVar($("#txtSearch").val().split('.')[0]).replace(/[^a-zA-Z0-9.]/g, '');
        if (dataDomain == null || dataDomain == undefined || dataDomain == "") {
            $(".ePopup").fadeIn();
            $("#ErrorNdung").html(`<p style='margin-bottom:16px;'><span style='color:#FC4649;'>Hãy nhập tên miền bạn muốn tìm.</span></p>`);
            $("#cLoading").fadeOut();
            return;
        }

        $("#txtSearch").val(dataDomain);
        $("#cLoading").fadeIn();
        $.ajax({
            type: "GET",
            url: "/TenMien/checkisExistsDomain?domain=" + dataDomain + giaTri,
            success: function (data) {
                var isExistsCount = parseInt(data);
                if (isExistsCount == 1) {
                    if (giaTri == ".id.vn") {
                        $("#hientenmien").text(dataDomain + ".id.vn");
                        $("#danhchoCaNhan").show();
                        $("#danhchoDoanhNghiep").hide();
                        $("#returnSearch").append(`<div class='box'>
                        <strong class ='succ'><b>Chúc mừng bạn!</b> Tên miền <a style='color:#1E74E8;text-decoration:underline;'>${dataDomain}.id.vn</a> của bạn <b>chưa có người đăng ký</b>.</strong>
                        <p>Vui lòng <b>xác thực thông tin cá nhân bằng eKYC </b> để nhận tên miền miễn phí.</p>
                        <a id='btnXacThuc' class='btn blue'>Xác thực</a>
                        <a class ='link block hidden' href='' target='_blank'>Hướng dẫn xác thực bằng eKYC</a>
                        <hr style='border:solid 1px #E0E0E0;border-bottom:0;margin:16px 0;' />
                        <p style='color:#FC4649;margin-bottom:4px;font-size:12px;line-height:18px;'><b>Lưu ý về đối tượng nhận tên miền</b> MIỄN PHÍ:</p>
                        <ul style='color:#7C7C7C;font-size:12px;line-height:18px;padding-left:16px;'>
                            <li>Dành cho <b>công dân Việt Nam</b> từ <b>18-23 tuổi</b>.</li>
                            <li><b>Mỗi cá nhân</b> được <b>đăng ký 1 tên miền</b>.</li>
                        </ul>
                        </div>`);
                    }
                    else {
                        $("#hientenmien1").text(dataDomain + ".biz.vn");
                        $("#danhchoDoanhNghiep").show();
                        $("#danhchoCaNhan").hide();
                        $("#returnSearch").append(`<div class='box'>
                        <strong class ='succ'><b>Chúc mừng bạn!</b> Tên miền <a style='color:#1E74E8;text-decoration:underline;'>${dataDomain}.biz.vn</a> của bạn <b>chưa có người đăng ký</b>.</strong>
                        <p>Vui lòng <b>xác thực thông tin doanh nghiệp </b> để nhận tên miền MIỄN PHÍ.</p>
                        <a id='btnXacThuc' class ='btn blue'>Xác thực</a>
                        <a class ='link block hidden' href='' target='_blank'>Hướng dẫn xác thực thông tin doanh nghiệp</a>
                        <hr style='border:solid 1px #E0E0E0;border-bottom:0;margin:16px 0;' />
                        <p style='color:#FC4649;margin-bottom:4px;font-size:12px;line-height:18px;'><b>Lưu ý về đối tượng nhận tên miền</b> MIỄN PHÍ:</p>
                        <ul style='color:#7C7C7C;font-size:12px;line-height:18px;padding-left:16px;'>
                            <li>Dành cho <b>Dành cho doanh nghiệp thành lập trong vòng 1 năm</b>.</li>
                            <li><b>Hộ kinh doanh có giấy chứng nhận đăng ký</b>.</li>
                            <li><b>Mỗi đối tượng</b> được <b>đăng ký 1 tên miền</b>.</li>
                        </ul>
                        </div>`);
                    }
                }
                else {
                    $(".ePopup").fadeIn();
                    $("#ErrorNdung").html(`<p style='margin-bottom:16px;'><span style='color:#FC4649;'>Tên miền bạn không thể chọn vì là tên miền đặc biệt hoặc đã có người mua!</span></p>`);
                }
                $("#cLoading").fadeOut();
            },
            error: function (_data) {
                $("#cLoading").fadeOut();
                console.log(_data);
            }
        });
    });
    $("body").on(EventClick, "#btnXacThuc", function () {
        $(".cPopup").fadeIn();
        $("#danhchoCaNhan .cacbuoc,#danhchoDoanhNghiep .cacbuoc").addClass("hidden");
        $("#danhchoCaNhan .cacbuoc:first,#danhchoDoanhNghiep .cacbuoc:first").removeClass("hidden");
    });
    $("#danhchoCaNhan .cStep li.active:nth-child(1)").click(function (e) {
        $("#danhchoCaNhan .cacbuoc").addClass("hidden");
        $("#buoc_1").removeClass("hidden");
    });
    $("#danhchoCaNhan .cStep li.active:nth-child(2)").click(function (e) {
        $("#danhchoCaNhan .cacbuoc").addClass("hidden");
        $("#buoc_2b").removeClass("hidden");
    });
    $("#danhchoCaNhan .cStep li.active:nth-child(3)").click(function (e) {
        $("#danhchoCaNhan .cacbuoc").addClass("hidden");
        $("#buoc_2c").removeClass("hidden");
    });
    $("#danhchoDoanhNghiep .cStep li.active:nth-child(1)").click(function (e) {
        $("#danhchoDoanhNghiep .cacbuoc").addClass("hidden");
        $("#buoc_bz_1").removeClass("hidden");
    });
    $("#danhchoDoanhNghiep .cStep li.active:nth-child(2)").click(function (e) {
        $("#danhchoDoanhNghiep .cacbuoc").addClass("hidden");
        $("#buoc_bz_2b").removeClass("hidden");
    });
    $("#danhchoDoanhNghiep .cStep li.active:nth-child(3)").click(function (e) {
        $("#danhchoDoanhNghiep .cacbuoc").addClass("hidden");
        $("#buoc_bz_2").removeClass("hidden");
    });
    $("#backxn_2").click(function () {
        $("#buoc_2").addClass("hidden");
        $("#buoc_1").removeClass("hidden");
    });
    $("#backxn_2b").click(function () {
        $("#buoc_2b").addClass("hidden");
        $("#buoc_2").removeClass("hidden");
    });
    $("#backxn_2c").click(function () {
        $("#buoc_2c").addClass("hidden");
        $("#buoc_2b").removeClass("hidden");
    });
    $("#backxn_3").click(function () {
        $("#buoc_3").addClass("hidden");
        $("#buoc_2c").removeClass("hidden");
    });
    $("#backxn_bz_2b").click(function () {
        $("#buoc_bz_2b").addClass("hidden");
        $("#buoc_bz_1").removeClass("hidden");
    });
    $("#backxn_buz_2").click(function () {
        $("#buoc_bz_2").addClass("hidden");
        $("#buoc_bz_2b").removeClass("hidden");
    });
    $("#xacthuc_0").click(function () {
        $("#buoc_0").addClass("hidden");
        $("#buoc_1").removeClass("hidden");
    });
    $("#xacthuc_1").click(function () {
        $("#buoc_1").addClass("hidden");
        $("#buoc_2").removeClass("hidden");

        if ($("#front_id_check").val() == "Giấy tờ thật" && $("#back_id_check").val() == "Giấy tờ thật") {
            $("#xacthuc_2").addClass("enabled");
        }
        else {
            $("#xacthuc_2").removeClass("enabled");
        }
    });
    $("#xacthuc_2").click(function () {
        $("#buoc_2").addClass("hidden");
        $("#buoc_2b").removeClass("hidden");
        getCountry("selectCountry");

        $("#selectCountry").val("243");
        getState("selectState", $("#selectCountry").val());

        $("body").on("change", "#selectCountry", function () {
            var selectname = "selectState";
            getState(selectname, $(this).val());
        });
        $("body").on("change", "#selectState", function () {
            var selectname = "selectDistrict";
            getDistrict(selectname, $(this).val());
        });
        $("body").on("change", "#selectDistrict", function () {
            var selectname = "selectWard";
            getWard(selectname, $(this).val());
        });
    });
    $("#tx-address").hover(() => {
        $("#lb_note_address").css("display", "block");
    });
    $("#xacthuc_2c").click(function () {
        $("#cLoading").fadeIn();
        $("#buoc_2c").addClass("hidden");
        $("#buoc_3").removeClass("hidden");
    });
    $(".showtip").focus(function () {
        var id = $(this).attr("id").replace('tx-', '');
        $(".lbl-alert").each(function () {
            if ($(this).attr("class").indexOf("hidden") <= -1) {
                $(this).addClass("hidden");
            }
        });
        $("#lb_note_" + id).removeClass("hidden");
    });
    $("#xacthuc_2b").click(function () {
        let _nuoc1 = $("#selectCountry").val();
        let _tinh1 = $("#selectState").val();
        let _quan1 = $("#selectDistrict").val();
        let _phuong1 = $("#selectWard").val();
        let _email1 = $("#tx-email").val();
        let _phone1 = $("#tx-phone").val();
        let _duong1 = $("#tx-address").val();
        let _iserror = false;
        $("#err_email").addClass("hidden");
        $("#tx-email").removeClass("input_err");
        $("#err_phone").addClass("hidden");
        $("#tx-phone").removeClass("input_err");
        $("#err_address").addClass("hidden");
        $("#tx-address").removeClass("input_err");
        $("#selectCountry").removeClass("input_err");
        $("#selectState").removeClass("input_err");
        $("#selectDistrict").removeClass("input_err");
        $("#selectWard").removeClass("input_err");
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        let nul_mail = false;let nul_phone = false;let nul_address = false;
        if (_email1 == undefined || _email1 == "") {
            $("#err_email").text("Vui lòng điền Email!");
            $("#lb_note_email").addClass("hidden");
            $("#err_email").removeClass("hidden");
            $("#tx-email").addClass("input_err");
            _iserror = true; nul_mail = true;
        }
        if (_phone1 == undefined || _phone1 == "") {
            $("#err_phone").text("Vui lòng điền số điện thoại!");
            $("#lb_note_phone").addClass("hidden");
            $("#err_phone").removeClass("hidden");
            $("#tx-phone").addClass("input_err");
            _iserror = true; nul_phone = true;
        } if (_nuoc1 == "" || _tinh1 == "" || _quan1 == "" || _phuong1 == "" || _duong1 == "" || _duong1.indexOf(',') > -1) {
            if (_nuoc1 == "") {
                $("#selectCountry").addClass("input_err");
            }
            if (_tinh1 == "") {
                $("#selectState").addClass("input_err");
            }
            if (_quan1 == "") {
                $("#selectDistrict").addClass("input_err");
            }
            if (_phuong1 == "") {
                $("#selectWard").addClass("input_err");
            }
            if (_duong1 == "" || _duong1.indexOf(',') > -1) {
                $("#tx-address").addClass("input_err");
            }
            let mess = "Vui lòng chọn và điền đầy đủ thông tin địa chỉ!";
            if (_duong1.indexOf(',') > -1) {
                mess = "Địa chỉ không thể nhập dấu phẩy!";
            }
            $("#err_address").text(mess);
            $("#lb_note_address").addClass("hidden");
            $("#err_address").removeClass("hidden");
            _iserror = true; nul_address = true;
        }
        $("#cLoading").fadeOut();
        if (!regex.test(_email1) && !nul_mail) {
            $("#err_email").text("Địa chỉ email chưa đúng định dạng!");
            $("#lb_note_email").addClass("hidden");
            $("#err_email").removeClass("hidden");
            $("#tx-email").addClass("input_err");
            _iserror = true;
        }
        if ((!$.isNumeric(_phone1) || _phone1.length < 8 || _phone1.length >= 12 || _phone1.substr(0, 1) != "0") && !nul_phone) {
            $("#err_phone").text("Số điện thoại chưa đúng định dạng!");
            $("#lb_note_phone").addClass("hidden");
            $("#err_phone").removeClass("hidden");
            $("#tx-phone").addClass("input_err");
            _iserror = true;
        }
        if ((_duong1.length <= 2 || $.isNumeric(_duong1)) && !nul_address) {
            $("#err_address").text("Địa chỉ chưa đúng định dạng!");
            $("#lb_note_address").addClass("hidden");
            $("#err_address").removeClass("hidden");
            $("#tx-address").addClass("input_err");
            _iserror = true;
        }
        $("#cLoading").fadeOut();
        if (!_iserror) {
            eventInfoUpdate();
        }
    });
    $("#xacthuc_3").click(function () {
        $("#buoc_4").addClass("hidden");
        $("#buoc_5").removeClass("hidden");
    });
    $("#cmt_1").change(function () {
        let file = $(this).val();
        if (file != undefined && file != null) {
            $("#label_cmt_1").hide();
            $(".vmattruoc").show();
        }
    });
    $("#view_cmt_1").click(function () {
        $("#cmt_1").trigger("click");
        $("#label_cmt_1").show();
        $(".vmattruoc").hide();
    });
    $("#cmt_2").change(function () {
        let file = $(this).val();
        if (file != undefined && file != null) {
            $("#label_cmt_2").hide();
            $(".vmatsau").show();
        }
    });
    $("#view_cmt_2").click(function () {
        $("#cmt_2").trigger("click");
        $("#label_cmt_2").show();
        $(".vmatsau").hide();
    });
    $("#videoElm").on("pause", function () {
        $("#buoc_3").addClass("hidden");
        $("#cLoading").fadeIn();
        setTimeout(function () { submitfreeVN(); }, 3000);
        //$("#buoc_5").removeClass("hidden");
    });
    $("#tx-bz-email").keyup(function (event) {
        if ($(this).val() != undefined && $(this).val() != "") {
            $("#xacthuc_bz_2b").addClass("enabled");
        }
        else {
            $("#xacthuc_bz_2b").removeClass("enabled");
        }
    })
    $("#btnTaxCode").click(function () {
        $(".groupHide").removeClass("hidden");
        let taxcode = $("#txtTaxCode").val();
        $("#cLoading").fadeIn();
        $.ajax({
            type: "POST",
            url: "/ekyc/enterprise-query?taxCode=" + taxcode,
            success: function (_data) {
                var jsonVal = JSON.parse(_data).data;
                if (JSON.parse(_data).errorcode != undefined) {
                    $(".ePopup").fadeIn();
                    $("#ErrorNdung").html(`<p style='margin-bottom:16px;'><span style='color:#FC4649;'>${JSON.parse(_data).message}</span></p>`);
                } else {
                    $("#danhchoDoanhNghiep #enterpriseName").val(jsonVal.enterpriseName);
                    $("#danhchoDoanhNghiep #nationalityName").val(jsonVal.nationalityName);
                    $("#danhchoDoanhNghiep #cityName").val(jsonVal.cityName);
                    $("#danhchoDoanhNghiep #districtName").val(jsonVal.districtName);
                    $("#danhchoDoanhNghiep #wardName").val(jsonVal.wardName);
                    $("#danhchoDoanhNghiep #vaddress").val(jsonVal.address);
                    $("#danhchoDoanhNghiep #businessCode").val(jsonVal.businessCode);
                    $("#danhchoDoanhNghiep #directorName").val(jsonVal.directorName);
                    $("#danhchoDoanhNghiep #persDocNo").val(jsonVal.persDocNo);
                    $("#xacthuc_buz_1").addClass("enabled");
                }
                $("#cLoading").fadeOut();
            },
            error: function (_data) {
                $("#cLoading").fadeOut();
                console.log(_data);
                $("#xacthuc_buz_1").removeClass("enabled");
            }
        });
    });
    $("#xacthuc_bz_0").click(function () {
        $("#buoc_bz_0").addClass("hidden");
        $("#buoc_bz_1").removeClass("hidden");
    });
    $("#xacthuc_buz_1").click(function () {
        $("#buoc_bz_1").addClass("hidden");
        $("#buoc_bz_2b").removeClass("hidden");
    });
    $("#xacthuc_bz_2b").click(function () {
        let _phone2 = $("#tx-bz-phone").val();
        let _email2 = $("#tx-bz-email").val();
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        $("#err_bz-email").addClass("hidden");
        $("#tx-bz-email").removeClass("input_err");
        $("#err_bz-phone").addClass("hidden");
        $("#tx-bz-phone").removeClass("input_err");
        let is_error = false;let nul_mail = false; let nul_phone = false;
        if (_email2 == "") {
            $("#err_bz-email").text("Vui lòng điền Email!");
            $("#lb_note_bz-email").addClass("hidden");
            $("#err_bz-email").removeClass("hidden");
            $("#tx-bz-email").addClass("input_err");
            is_error = true; nul_mail = true;
        }
        if (_phone2 == "") {
            $("#err_bz-phone").text("Vui lòng điền số điện thoại!");
            $("#lb_note_bz-phone").addClass("hidden");
            $("#err_bz-phone").removeClass("hidden");
            $("#tx-bz-phone").addClass("input_err");
            is_error = true; nul_phone = true;
        }
        if (!regex.test(_email2) && !nul_mail) {
            $("#err_bz-email").text("Địa chỉ email chưa đúng định dạng!");
            $("#lb_note_bz-email").addClass("hidden");
            $("#err_bz-email").removeClass("hidden");
            $("#tx-bz-email").addClass("input_err");
            is_error = true;
        }
        if ((!$.isNumeric(_phone2) || _phone2.length < 8 || _phone2.length >= 12 || _phone2.substr(0, 1) != "0") && !nul_phone) {
            $("#err_bz-phone").text("Số điện thoại chưa đúng định dạng!");
            $("#lb_note_bz-phone").addClass("hidden");
            $("#err_bz-phone").removeClass("hidden");
            $("#tx-bz-phone").addClass("input_err");
            is_error = true;
        }
        if (!is_error) {
            eventBZInfoUpdate();
            $("#buoc_bz_2b").addClass("hidden");
            $("#buoc_bz_2").removeClass("hidden");
        }
    });
    $('.fromUpload [type="file"]').change(function (e) {
        let filename = "";
        let myid = $(this).attr("id").replace("fulGiay_", "");
        $("#revGiay_" + myid).html("");
        if (e.target.files[0]) {
            filename = e.target.files[0].name;
            $("#revGiay_" + myid).append("<a><b>" + filename + "</b></a>");
        }
    });
    $("#xacthuc_buz_2").click(function () {
       
    });
    $("#btnDownloadFile").click(function () {
        let taxcode = $("#txtTaxCode").val();
        window.open("/vnnic/enterprise-dowload?taxCode=" + taxcode, "_blank");
    });
    $("body").on("change", "#fulGiay_2", function (e) {
        $("#lblErr_FulGiay_2").text("");
        $(".revGiay a").removeClass("input_err");
        if (e.target.files.length > 0) {
            let filetype = e.target.files[0].type;
            console.log(filetype);
            if (filetype == "application/pdf") {
                $("#xacthuc_buz_2").addClass("enabled");
            }
            else {
                $("#lblErr_FulGiay_2").text("Bản khai chưa đúng định dạng PDF!");
                $(".revGiay a").addClass("input_err");
                $("#xacthuc_buz_2").removeClass("enabled");
            }
        }
        else {
            $("#lblErr_FulGiay_2").text("Vui lòng chọn file bản khai!");
            $(".revGiay a").addClass("input_err");
            $("#xacthuc_buz_2").removeClass("enabled");
        }
    });
    $("#xacthuc_buz_2").click(function () {
        $("#lblErr_FulGiay_2").text("");
        $(".revGiay a").removeClass("input_err");
        let taxcode = $("#txtTaxCode").val();
        var formData = new FormData();
        formData.append('taxCode', taxcode);
        $.each($('input[type=file]#fulGiay_2'), function (i, d) {
            for (var i = 0; i < d.files.length; i++) {
                formData.append(`${d.id}_${i}`, d.files[i]);
            }
        });
        $("#cLoading").show();
        $.ajax({
            type: "POST",
            url: "/vnnic/enterprise-upload",
            contentType: false,
            processData: false,
            cache: false,
            data: formData
        }).done(function (res) {
            if (res.Status) {
                const _id = document.getElementById("txtTaxCode").value;
                const _domainname = document.getElementById("txtSearch").value.split('.')[0];
                const _tld = $(".selectFor > label").attr("data-value");
                $.ajax({
                    type: "POST",
                    url: "/vnnic/submit-free-vn",
                    data: { "domainname": _domainname, "tld": _tld, "id": _id },
                    success: function (data) {
                        if (!res.status) {
                            $("#lblErr_FulGiay_2").text(data.Message);
                            $(".revGiay a").addClass("input_err");
                        }
                        else {
                            let cofile = $("#revGiay_2").html();
                            if (cofile != undefined && cofile != "") {
                                $("#buoc_bz_2").addClass("hidden");
                                $("#buoc_bz_3").removeClass("hidden");
                            }
                        }
                        $("#cLoading").hide();
                    }
                });
            } else {
                $("#lblErr_FulGiay_2").text(res.Message.replace('File chưa ký số!', 'Bản khai chưa có chữ ký số!'));
                $(".revGiay a").addClass("input_err");
                $("#cLoading").hide();
            }

        }).fail(function (ex) {
            notify.error(res.Message);
            $("#cLoading").hide();
            return;
        });
    });
    $(".panel-heading.collapsed").click(function () {
        var gindex = $(this).attr("id").replace("heading", "");
        $("#collapse" + gindex).toggle();
        if ($("#collapse" + gindex).attr("style") == "display: block;") {
            $(this).addClass("active");
        }
        else {
            $(this).removeClass("active");
        }
    });
    if (getCookie("eShowTip4z") == undefined || getCookie("eShowTip4z") == '') {
        $(".introduceThree").removeClass("hidden");
        $(".introduceThree").css("display", "none");
        $(".introduceThree").fadeIn();
        createCookie("eShowTip4z", 1, 30);
    }
    $(".introduceThree").click(function () {
        $(this).remove();
    });
    $(document).scroll(function () {
        scrolltop();
    });
    if (windWidth <= 768) {
        $(".link").click(function () {
            var num = $(this).attr("id").replace('lnk','');
            if ($(this).attr("class").indexOf("op") <= -1) {
                $("#dv" + num + ".is_box_mb .content-detail-6 .mbhide").slideDown();
                $("#dv" + num + ".is_box_mb .content-detail-6 .mbdot").slideUp();
                $(this).addClass("op");
            }
            else {
                $("#dv" + num + ".is_box_mb .content-detail-6 .mbdot").slideDown();
                $("#dv" + num + ".is_box_mb .content-detail-6 .mbhide").slideUp();
                $(this).removeClass("op");
            }
        });
    }
});
function replaceVar(text) {
    try {
        text = text.toLowerCase();
        text = text.replace(/à|á|ả|ã|ạ|â|ầ|ấ|ẩ|ẫ|ậ|ă|ắ|ằ|ẳ|ẵ|ặ/g, "a");
        text = text.replace(/ó|ò|ỏ|õ|ọ|ô|ồ|ố|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, "o");
        text = text.replace(/è|é|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, "e");
        text = text.replace(/ú|ù|ủ|ũ|ụ|ư|ừ|ứ|ử|ữ|ự/g, "u");
        text = text.replace(/í|ì|ỉ|ĩ|ị/g, "i");
        text = text.replace(/ý|ỳ|ỷ|ỹ|ỵ/g, "y");
        text = text.replace(/đ/g, "d");
        text = text.replace(/ /g, "-");
        text = text.replace(/–/g, "");
        text = text.replace(/,/g, "");
        text = text.replace(/\./gi, "");
        text = text.replace(/;/g, "");
        text = text.replace(/&/g, "");
        text = text.replace(/\?/gi, "");
        text = text.replace(/:/g, "");
        text = text.replace(/-+-/g, "-");
        text = text.replace(/^\-+|\-+$/g, "");
    } catch (e) {
        console.log(e);
    }
    return text;
}
function getCountry(conid) {
    $.ajax({
        type: "GET",
        async: false,
        url: "/api/address",
        data: { cType: "country" },
        success: function (_data) {
            let arrNational = JSON.parse(_data.value).data;
            $("#" + conid).html("<option value=''>Chọn quốc gia</option>");
            $.each(arrNational, function (i, item) {
                $("#" + conid).append("<option data-code='" + item.code + "' value='" + item.id + "'>" + item.name + "</option>");
            });
        }
    });
}
function getState(conid, selctd) {
    $.ajax({
        type: "GET",
        async: false,
        url: "/api/address",
        data: { cType: "state" },
        success: function (_data) {
            let arrNational = JSON.parse(_data.value).data;
            $("#" + conid).html("<option value=''>Chọn tỉnh/thành phố</option>");
            $.each(arrNational, function (i, item) {
                if (item.parentId == selctd) {
                    $("#" + conid).append("<option data-code='" + item.code + "' value='" + item.id + "'>" + item.name + "</option>");
                }
            });
        }
    });
}
function getDistrict(conid, selctd) {
    $.ajax({
        type: "GET",
        async: false,
        url: "/api/address",
        data: { cType: "district" },
        success: function (_data) {
            let arrNational = JSON.parse(_data.value).data;
            $("#" + conid).html("<option value=''>Chọn quận/huyện</option>");
            $.each(arrNational, function (i, item) {
                if (item.parentId == selctd) {
                    $("#" + conid).append("<option data-code='" + item.code + "' value='" + item.id + "'>" + item.name + "</option>");
                }
            });
        }
    });
}
function getWard(conid, selctd) {
    $.ajax({
        type: "GET",
        async: false,
        url: "/api/address",
        data: { cType: "ward" },
        success: function (_data) {
            let arrNational = JSON.parse(_data.value).data;
            $("#" + conid).html("<option value=''>Chọn phường/xã</option>");
            $.each(arrNational, function (i, item) {
                if (item.parentId == selctd) {
                    $("#" + conid).append("<option data-code='" + item.code + "' value='" + item.id + "'>" + item.name + "</option>");
                }
            });
        }
    });
}

function scrolltop() {
    var topSuperMenu = $(".afterFix").offset().top;
    var div_1 = $("#div_1").offset().top - 120;
    var div_2 = $("#div_2").offset().top - 82;
    var div_3 = $("#div_3").offset().top - 82;
    var div_4 = $("#cauhoithuonggap").offset().top - 82;
    var topScroll = $(window).scrollTop();
    if (topScroll >= topSuperMenu) {
        $("#SuperMenu").addClass("SuperFix");
    }
    else {
        $("#SuperMenu").removeClass("SuperFix");
    }
    if (topScroll >= div_4) {
        $("#SuperMenu li").removeClass("active");
        $("#SuperMenu .li_4").addClass("active");
    }
    //else if (topScroll >= div_3) {
    //    $("#SuperMenu li").removeClass("active");
    //    $("#SuperMenu .li_3").addClass("active");
    //}
    else if (topScroll >= div_2) {
        $("#SuperMenu li").removeClass("active");
        $("#SuperMenu .li_2").addClass("active");
    }
    else if (topScroll >= div_1) {
        $("#SuperMenu li").removeClass("active");
        $("#SuperMenu .li_1").addClass("active");
    }
    else {
        $("#SuperMenu li").removeClass("active");
    }
}
$("#SuperMenu .li_4").click(function () {
    $('body,html').animate({ scrollTop: $("#cauhoithuonggap").position().top - 68 }, 'slow');
})
//$("#SuperMenu .li_3").click(function () {
//    $('body,html').animate({ scrollTop: $("#div_3").position().top - 68 }, 'slow');
//})
$("#SuperMenu .li_2").click(function () {
    $('body,html').animate({ scrollTop: $("#div_2").position().top - 68 }, 'slow');
})
$("#SuperMenu .li_1").click(function () {
    $('body,html').animate({ scrollTop: $("#div_1").position().top - 68 }, 'slow');
})
$(".btn-khamphangay,.adangkyngay").click(function () {
    $('body,html').animate({ scrollTop: $("#formKiemTraTenMien").position().top }, 'slow');
})